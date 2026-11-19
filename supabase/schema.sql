-- =====================================================================
-- Вівальді CRM — схема бази даних Supabase (PostgreSQL)
-- Запускається один раз у Supabase → SQL Editor. Повторний запуск безпечний.
-- =====================================================================

-- ---------- 1. Співробітники та ролі ----------
create table if not exists public.staff (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  name       text not null default '',
  role       text not null default 'manager' check (role in ('admin', 'manager')),
  created_at timestamptz not null default now()
);

create or replace function public.is_staff() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.staff where user_id = auth.uid())
$$;

create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.staff where user_id = auth.uid() and role = 'admin')
$$;

-- ---------- 2. Товари ----------
create table if not exists public.products (
  id          text primary key,                       -- код товару, напр. sp-w-1
  season      text not null check (season in ('spring', 'summer', 'autumn', 'winter')),
  aud         text not null check (aud in ('women', 'men', 'kids')),
  cat         text not null,
  emoji       text not null default '👕',
  name        text not null check (length(name) between 2 and 80),
  price       int  not null check (price > 0),
  old_price   int  check (old_price is null or old_price > price),
  sizes       text[] not null,
  colors      text[] not null,                        -- ключі кольорів із js/data.js
  material    text not null default '',
  description text not null default '',
  rating      numeric(2,1) not null default 5.0 check (rating between 0 and 5),
  reviews     int  not null default 0 check (reviews >= 0),
  sort        int  not null default 0,
  active      boolean not null default true,
  updated_at  timestamptz not null default now()
);

-- ---------- 3. Залишки: окремо для кожного розміру й кольору ----------
create table if not exists public.stock (
  product_id text not null references public.products(id) on delete cascade,
  size       text not null,
  color      text not null,
  qty        int  not null default 0 check (qty >= 0),
  primary key (product_id, size, color)
);

-- ---------- 4. Клієнти ----------
create table if not exists public.customers (
  id         bigint generated always as identity primary key,
  name       text not null,
  phone      text not null unique check (phone ~ '^\+380\d{9}$'),
  city       text,
  notes      text not null default '',
  created_at timestamptz not null default now()
);

-- ---------- 5. Замовлення ----------
create table if not exists public.orders (
  id            bigint generated always as identity primary key,
  number        text not null unique,
  customer_id   bigint not null references public.customers(id),
  status        text not null default 'new'
                check (status in ('new', 'confirmed', 'shipped', 'delivered', 'returned', 'cancelled')),
  delivery      text not null,
  city          text not null,
  address       text not null,
  payment       text not null,
  items_total   int  not null default 0,
  delivery_free boolean not null default false,
  ttn           text check (ttn is null or ttn ~ '^\d{14}$'),   -- номер ТТН Нової Пошти
  manager_note  text not null default '',
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create index if not exists orders_created_idx on public.orders (created_at desc);
create index if not exists orders_customer_idx on public.orders (customer_id);

create table if not exists public.order_items (
  id         bigint generated always as identity primary key,
  order_id   bigint not null references public.orders(id) on delete cascade,
  product_id text not null references public.products(id),
  name       text not null,            -- назва й ціна фіксуються на момент замовлення
  size       text not null,
  color      text not null,
  qty        int  not null check (qty between 1 and 10),
  price      int  not null check (price > 0)
);
create index if not exists order_items_order_idx on public.order_items (order_id);

-- ---------- 6. Публічний каталог для сайту: товари + наявність ----------
-- Представлення працює від імені власника, тож відвідувачі бачать лише ці колонки,
-- а не саму таблицю залишків чи щось інше в базі.
create or replace view public.catalog as
select p.id, p.season, p.aud, p.cat, p.emoji, p.name, p.price, p.old_price, p.sizes, p.colors,
       p.material, p.description, p.rating, p.reviews, p.sort,
       coalesce(s.total, 0)              as stock_total,
       coalesce(s.map, '{}'::jsonb)      as stock_map     -- {"M|beige": 4, ...}
from public.products p
left join lateral (
  select sum(qty)::int as total, jsonb_object_agg(size || '|' || color, qty) as map
  from public.stock where product_id = p.id
) s on true
where p.active;

-- ---------- 7. Оформлення замовлення з сайту ----------
-- Ціни беруться з бази (не з браузера), залишки списуються атомарно.
create or replace function public.place_order(
  p_name text, p_phone text, p_city text, p_delivery text, p_address text, p_payment text, p_items jsonb
) returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  v_customer bigint; v_order bigint; v_total int := 0; v_num text; v_recent int;
  it jsonb; p public.products%rowtype; v_qty int; v_size text; v_color text;
begin
  p_name := trim(p_name); p_city := trim(p_city); p_address := trim(p_address);
  if length(p_name) < 2 or length(p_name) > 80 then raise exception 'Вкажіть ім''я (від 2 символів)'; end if;
  if p_phone !~ '^\+380\d{9}$' then raise exception 'Невірний номер телефону'; end if;
  if length(p_city) < 2 or length(p_city) > 60 then raise exception 'Вкажіть місто'; end if;
  if length(p_address) < 1 or length(p_address) > 120 then raise exception 'Вкажіть адресу або відділення'; end if;
  if length(p_delivery) > 60 or length(p_payment) > 60 then raise exception 'Невірний спосіб доставки чи оплати'; end if;
  if jsonb_typeof(p_items) <> 'array' or jsonb_array_length(p_items) = 0 or jsonb_array_length(p_items) > 20 then
    raise exception 'Кошик порожній або завеликий';
  end if;

  -- захист від спаму: не більше 5 замовлень з одного номера на годину
  select count(*) into v_recent from public.orders o join public.customers c on c.id = o.customer_id
   where c.phone = p_phone and o.created_at > now() - interval '1 hour';
  if v_recent >= 5 then raise exception 'Забагато замовлень з цього номера. Спробуйте пізніше.'; end if;

  insert into public.customers (name, phone, city) values (p_name, p_phone, p_city)
  on conflict (phone) do update set name = excluded.name, city = excluded.city
  returning id into v_customer;

  loop
    v_num := 'VIV-' || (10000 + floor(random() * 90000))::int;
    exit when not exists (select 1 from public.orders where number = v_num);
  end loop;

  insert into public.orders (number, customer_id, delivery, city, address, payment)
  values (v_num, v_customer, p_delivery, p_city, p_address, p_payment)
  returning id into v_order;

  for it in select * from jsonb_array_elements(p_items) loop
    v_size := it->>'size'; v_color := it->>'color'; v_qty := (it->>'qty')::int;
    select * into p from public.products where id = it->>'id' and active;
    if not found then raise exception 'Товар більше не продається: %', it->>'id'; end if;
    if v_qty is null or v_qty < 1 or v_qty > 10 then raise exception 'Невірна кількість для «%»', p.name; end if;
    if not (v_size = any (p.sizes)) or not (v_color = any (p.colors)) then
      raise exception 'Невірний розмір або колір для «%»', p.name;
    end if;
    update public.stock set qty = qty - v_qty
     where product_id = p.id and size = v_size and color = v_color and qty >= v_qty;
    if not found then
      raise exception 'На жаль, «%» (розмір %) закінчився. Оберіть інший розмір чи колір.', p.name, v_size;
    end if;
    insert into public.order_items (order_id, product_id, name, size, color, qty, price)
    values (v_order, p.id, p.name, v_size, v_color, v_qty, p.price);
    v_total := v_total + p.price * v_qty;
  end loop;

  update public.orders
     set items_total = v_total,
         delivery_free = v_total >= 1500 and p_delivery not ilike '%кур%'
   where id = v_order;

  return jsonb_build_object('number', v_num, 'total', v_total);
end $$;

-- ---------- 8. Скасування / повернення повертає товар на склад ----------
create or replace function public.orders_before_update() returns trigger
language plpgsql security definer set search_path = public as $$
declare closed text[] := array['cancelled', 'returned'];
begin
  if new.status = any (closed) and not (old.status = any (closed)) then
    update public.stock s set qty = s.qty + i.qty
      from public.order_items i
     where i.order_id = new.id and s.product_id = i.product_id and s.size = i.size and s.color = i.color;
  elsif old.status = any (closed) and not (new.status = any (closed)) then
    if exists (select 1 from public.order_items i join public.stock s
                 on s.product_id = i.product_id and s.size = i.size and s.color = i.color
                where i.order_id = new.id and s.qty < i.qty) then
      raise exception 'Недостатньо залишків, щоб відновити це замовлення';
    end if;
    update public.stock s set qty = s.qty - i.qty
      from public.order_items i
     where i.order_id = new.id and s.product_id = i.product_id and s.size = i.size and s.color = i.color;
  end if;
  new.updated_at := now();
  return new;
end $$;

drop trigger if exists orders_before_update on public.orders;
create trigger orders_before_update before update on public.orders
for each row execute function public.orders_before_update();

create or replace function public.touch_updated_at() returns trigger language plpgsql as $$
begin new.updated_at := now(); return new; end $$;
drop trigger if exists products_touch on public.products;
create trigger products_touch before update on public.products
for each row execute function public.touch_updated_at();

-- ---------- 9. Права доступу (Row Level Security) ----------
alter table public.staff       enable row level security;
alter table public.products    enable row level security;
alter table public.stock       enable row level security;
alter table public.customers   enable row level security;
alter table public.orders      enable row level security;
alter table public.order_items enable row level security;

drop policy if exists staff_read on public.staff;
create policy staff_read on public.staff for select to authenticated
  using (user_id = auth.uid() or public.is_admin());

drop policy if exists products_read on public.products;
create policy products_read on public.products for select to authenticated using (public.is_staff());
drop policy if exists products_write on public.products;
create policy products_write on public.products for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists stock_read on public.stock;
create policy stock_read on public.stock for select to authenticated using (public.is_staff());
drop policy if exists stock_write on public.stock;
create policy stock_write on public.stock for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists customers_read on public.customers;
create policy customers_read on public.customers for select to authenticated using (public.is_staff());
drop policy if exists customers_update on public.customers;
create policy customers_update on public.customers for update to authenticated
  using (public.is_staff()) with check (public.is_staff());

drop policy if exists orders_read on public.orders;
create policy orders_read on public.orders for select to authenticated using (public.is_staff());
drop policy if exists orders_update on public.orders;
create policy orders_update on public.orders for update to authenticated
  using (public.is_staff()) with check (public.is_staff());

drop policy if exists order_items_read on public.order_items;
create policy order_items_read on public.order_items for select to authenticated using (public.is_staff());

-- Відвідувачі сайту (anon) бачать лише каталог і можуть лише оформити замовлення.
revoke all on public.staff, public.products, public.stock, public.customers, public.orders, public.order_items from anon;
grant select on public.catalog to anon, authenticated;
revoke all on function public.place_order(text, text, text, text, text, text, jsonb) from public;
grant execute on function public.place_order(text, text, text, text, text, text, jsonb) to anon, authenticated;
