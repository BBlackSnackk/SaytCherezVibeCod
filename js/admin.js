/* ===================== Вівальді CRM ===================== */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const fmt = n => (n || 0).toLocaleString('uk-UA') + ' ₴';
const dt = s => new Date(s).toLocaleString('uk-UA', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
const day = s => new Date(s).toLocaleDateString('uk-UA', { day: '2-digit', month: '2-digit', year: 'numeric' });
const plain = s => String(s || '').replace(/^[^\p{L}\d]+/u, '');      // прибрати емодзі на початку
const sum = (arr, f) => arr.reduce((s, x) => s + f(x), 0);

const db = supabase.createClient(VIV_CONFIG.supabaseUrl, VIV_CONFIG.supabaseKey);

const STATUS = {
  new: ['Новий', '#2a64c5'], confirmed: ['Підтверджений', '#7a4fd1'], shipped: ['Відправлений', '#e8741a'],
  delivered: ['Отриманий', '#179a45'], returned: ['Повернення', '#8a3b45'], cancelled: ['Скасований', '#757575'],
};
const CLOSED = ['returned', 'cancelled'];
const badge = s => `<span class="badge" style="--c:${STATUS[s][1]}">${STATUS[s][0]}</span>`;
const colorName = k => (COLORS[k] ? COLORS[k][0] : k);
const swatch = k => `<span class="swatch" style="background:${COLORS[k] ? COLORS[k][1] : '#ccc'}"></span>`;
const SEASON_NAME = Object.fromEntries(SEASONS.map(s => [s.key, s.emoji + ' ' + s.name]));
const TITLES = { orders: 'Замовлення', customers: 'Клієнти', products: 'Товари й залишки', stats: 'Статистика' };

const S = { user: null, staff: null, orders: [], customers: [], products: [], stock: [], view: 'orders', status: 'all', period: 30, pSeason: 'all', timer: null };
const isAdmin = () => S.staff?.role === 'admin';

let toastTimer;
function toast(text, isError = false) {
  const t = $('#toast');
  t.textContent = text; t.classList.toggle('error', isError); t.classList.add('show');
  clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove('show'), isError ? 5000 : 2500);
}

/* ===================== ВХІД ===================== */
function showLogin(msg = '') {
  $('#appView').hidden = true; $('#loginView').hidden = false;
  $('#loginError').textContent = msg;
}

$('#loginForm').addEventListener('submit', async e => {
  e.preventDefault();
  const email = $('#loginEmail').value.trim(), password = $('#loginPass').value;
  if (!email || !password) { $('#loginError').textContent = 'Введіть email і пароль'; return; }
  const btn = $('#loginBtn'); btn.disabled = true; btn.textContent = 'Входимо…';
  const { data, error } = await db.auth.signInWithPassword({ email, password });
  btn.disabled = false; btn.textContent = 'Увійти';
  if (error) {
    $('#loginError').textContent = /invalid login/i.test(error.message) ? 'Невірний email або пароль' : 'Не вдалося увійти: ' + error.message;
    return;
  }
  $('#loginPass').value = '';
  enter(data.user);
});

async function enter(user) {
  const { data: staff, error } = await db.from('staff').select('*').eq('user_id', user.id).maybeSingle();
  if (error || !staff) {
    await db.auth.signOut();
    showLogin(error ? 'Не вдалося перевірити доступ: ' + error.message : 'Цей акаунт не має доступу до CRM. Зверніться до адміністратора.');
    return;
  }
  S.user = user; S.staff = staff;
  $('#loginView').hidden = true; $('#appView').hidden = false;
  $('#meName').textContent = staff.name || user.email;
  $('#meRole').textContent = staff.role === 'admin' ? 'Адміністратор' : 'Менеджер';
  $$('[data-admin]').forEach(b => { b.hidden = !isAdmin(); });
  await loadAll();
  show(location.hash.slice(1) in TITLES ? location.hash.slice(1) : 'orders');
  clearInterval(S.timer);
  S.timer = setInterval(() => { if (!document.hidden) loadAll(); }, 60000);
}

$('#logoutBtn').addEventListener('click', async () => { await db.auth.signOut(); location.hash = ''; location.reload(); });

/* ===================== ДАНІ ===================== */
async function loadAll() {
  const queries = [
    db.from('orders').select('*, customers(id, name, phone, city), order_items(*)').order('created_at', { ascending: false }),
    db.from('customers').select('*').order('created_at', { ascending: false }),
  ];
  if (isAdmin()) queries.push(db.from('products').select('*').order('sort'), db.from('stock').select('*'));
  const res = await Promise.all(queries);
  const failed = res.find(r => r.error);
  if (failed) { toast('Не вдалося завантажити дані: ' + failed.error.message, true); return; }
  S.orders = res[0].data; S.customers = res[1].data;
  if (isAdmin()) { S.products = res[2].data; S.stock = res[3].data; }
  $('#updatedAt').textContent = 'Оновлено о ' + new Date().toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' });
  const fresh = S.orders.filter(o => o.status === 'new').length;
  $('#newCount').hidden = !fresh; $('#newCount').textContent = fresh;
  render();
}

function show(view) {
  if ((view === 'products' || view === 'stats') && !isAdmin()) view = 'orders';
  S.view = view;
  history.replaceState(null, '', '#' + view);
  $$('.nav button').forEach(b => b.classList.toggle('on', b.dataset.view === view));
  $$('.view').forEach(v => { v.hidden = v.id !== 'view-' + view; });
  $('#viewTitle').textContent = TITLES[view];
  render();
}
function render() { ({ orders: renderOrders, customers: renderCustomers, products: renderProducts, stats: renderStats })[S.view](); }

$$('.nav button').forEach(b => b.addEventListener('click', () => show(b.dataset.view)));
$('#refreshBtn').addEventListener('click', () => loadAll());

/* ===================== БІЧНА ПАНЕЛЬ ===================== */
function openPanel(html) {
  $('#panelBody').innerHTML = html;
  $('#panel').classList.add('open'); $('#panel').setAttribute('aria-hidden', 'false');
  $('#overlay').hidden = false; $('#panel').scrollTop = 0;
}
function closePanel() { $('#panel').classList.remove('open'); $('#panel').setAttribute('aria-hidden', 'true'); $('#overlay').hidden = true; }
$('#panelClose').addEventListener('click', closePanel);
$('#overlay').addEventListener('click', closePanel);
document.addEventListener('keydown', e => { if (e.key === 'Escape') closePanel(); });
$('#panelBody').addEventListener('click', e => {
  const c = e.target.closest('[data-customer]'); if (c) { e.preventDefault(); openCustomer(+c.dataset.customer); return; }
  const o = e.target.closest('[data-order]'); if (o) { e.preventDefault(); openOrder(+o.dataset.order); }
});

/* ===================== ЗАМОВЛЕННЯ ===================== */
function renderOrders() {
  const counts = { all: S.orders.length };
  S.orders.forEach(o => { counts[o.status] = (counts[o.status] || 0) + 1; });
  $('#statusChips').innerHTML = [['all', 'Усі'], ...Object.entries(STATUS).map(([k, v]) => [k, v[0]])]
    .map(([k, l]) => `<button class="chip ${S.status === k ? 'on' : ''}" data-status="${k}">${l}<span class="n">${counts[k] || 0}</span></button>`).join('');

  const q = $('#orderSearch').value.trim().toLowerCase();
  const list = S.orders.filter(o => (S.status === 'all' || o.status === S.status) &&
    (!q || [o.number, o.customers?.name, o.customers?.phone, o.ttn, o.city].join(' ').toLowerCase().includes(q)));

  $('#ordersTable').innerHTML = `<thead><tr><th>Номер</th><th>Дата</th><th>Клієнт</th><th>Телефон</th><th class="right">Шт.</th>
    <th class="right">Сума</th><th>Доставка</th><th>Статус</th><th>ТТН</th></tr></thead><tbody>${list.length ? list.map(o => `
    <tr data-order="${o.id}">
      <td class="strong">${esc(o.number)}</td>
      <td class="num">${dt(o.created_at)}</td>
      <td>${esc(o.customers?.name || '—')}</td>
      <td class="num">${esc(o.customers?.phone || '')}</td>
      <td class="num right">${sum(o.order_items, i => i.qty)}</td>
      <td class="num right strong">${fmt(o.items_total)}</td>
      <td>${esc(o.city)}<br><small class="muted">${esc(plain(o.delivery))}</small></td>
      <td>${badge(o.status)}</td>
      <td class="num">${o.ttn ? esc(o.ttn) : '<span class="muted">—</span>'}</td>
    </tr>`).join('') : `<tr><td colspan="9" class="empty">${S.orders.length ? 'За цими умовами нічого не знайдено' : 'Замовлень поки немає. Оформіть тестове замовлення через Віва-бота на сайті.'}</td></tr>`}</tbody>`;
}
$('#statusChips').addEventListener('click', e => { const b = e.target.closest('[data-status]'); if (b) { S.status = b.dataset.status; renderOrders(); } });
$('#orderSearch').addEventListener('input', renderOrders);
$('#ordersTable').addEventListener('click', e => { const r = e.target.closest('[data-order]'); if (r) openOrder(+r.dataset.order); });

function openOrder(id) {
  const o = S.orders.find(x => x.id === id); if (!o) return;
  const c = o.customers || {};
  openPanel(`
    <h2>Замовлення ${esc(o.number)}</h2>
    <p class="sub">${new Date(o.created_at).toLocaleString('uk-UA')} &nbsp;${badge(o.status)}</p>
    <div class="box"><h3>Клієнт</h3><dl class="kv">
      <dt>Ім'я</dt><dd><a href="#" data-customer="${c.id}">${esc(c.name)}</a></dd>
      <dt>Телефон</dt><dd><a href="tel:${esc(c.phone)}">${esc(c.phone)}</a></dd>
    </dl></div>
    <div class="box"><h3>Доставка й оплата</h3><dl class="kv">
      <dt>Місто</dt><dd>${esc(o.city)}</dd>
      <dt>Спосіб</dt><dd>${esc(plain(o.delivery))}</dd>
      <dt>Адреса</dt><dd>${esc(o.address)}</dd>
      <dt>Оплата</dt><dd>${esc(plain(o.payment))}</dd>
      <dt>Доставка</dt><dd>${o.delivery_free ? '🎁 безкоштовна' : 'за тарифами перевізника'}</dd>
    </dl></div>
    <div class="box"><h3>Товари</h3><div class="items">${o.order_items.map(i => `
      <div class="item"><img class="thumb" src="${esc(S.products.find(x => x.id === i.product_id)?.image1 || `images/products/${i.product_id}-1.jpg`)}" alt="" onerror="this.style.visibility='hidden'">
        <div><b>${esc(i.name)}</b><small>${esc(i.size)} · ${swatch(i.color)}${esc(colorName(i.color))} · ${i.qty} × ${fmt(i.price)}</small></div>
        <b class="num">${fmt(i.qty * i.price)}</b></div>`).join('')}</div>
      <div class="totals"><span>Разом</span><span class="num">${fmt(o.items_total)}</span></div></div>
    <form class="box" id="orderForm"><h3>Обробка</h3>
      <div class="row2">
        <label>Статус<select id="oStatus">${Object.entries(STATUS).map(([k, v]) => `<option value="${k}" ${k === o.status ? 'selected' : ''}>${v[0]}</option>`).join('')}</select></label>
        <label>ТТН Нової Пошти<input type="text" id="oTtn" inputmode="numeric" maxlength="17" placeholder="20450000000000" value="${esc(o.ttn || '')}"></label>
      </div>
      <p class="small muted">${o.ttn ? `<a href="https://novaposhta.ua/tracking/?cargo_number=${esc(o.ttn)}" target="_blank" rel="noopener">Відстежити посилку на сайті Нової Пошти →</a>` : 'ТТН — 14 цифр. Після збереження з’явиться посилання для відстеження.'}</p>
      <label>Нотатка менеджера<textarea id="oNote" maxlength="1000" placeholder="Напр.: клієнт просив зателефонувати після 18:00">${esc(o.manager_note || '')}</textarea></label>
      <p class="small muted">Статуси «Скасований» і «Повернення» автоматично повертають товари на склад.</p>
      <div class="actions"><button class="btn btn-primary" type="submit">Зберегти</button></div>
    </form>`);

  $('#orderForm').addEventListener('submit', async e => {
    e.preventDefault();
    const ttn = $('#oTtn').value.replace(/\D/g, '');
    if (ttn && ttn.length !== 14) { toast('ТТН має містити рівно 14 цифр', true); return; }
    const btn = e.submitter || e.target.querySelector('[type="submit"]'); btn.disabled = true;
    const { error } = await db.from('orders').update({ status: $('#oStatus').value, ttn: ttn || null, manager_note: $('#oNote').value.trim() }).eq('id', o.id);
    btn.disabled = false;
    if (error) { toast('Не збережено: ' + error.message, true); return; }
    toast('Замовлення ' + o.number + ' збережено');
    await loadAll(); openOrder(o.id);
  });
}

/* ===================== КЛІЄНТИ ===================== */
function customerStats(c) {
  const orders = S.orders.filter(o => o.customer_id === c.id);
  const valid = orders.filter(o => !CLOSED.includes(o.status));
  return { orders, count: orders.length, spent: sum(valid, o => o.items_total), last: orders[0]?.created_at };
}

function renderCustomers() {
  const q = $('#customerSearch').value.trim().toLowerCase();
  const list = S.customers.map(c => ({ c, st: customerStats(c) }))
    .filter(({ c }) => !q || [c.name, c.phone, c.city].join(' ').toLowerCase().includes(q))
    .sort((a, b) => (b.st.last || '').localeCompare(a.st.last || ''));
  $('#customersTable').innerHTML = `<thead><tr><th>Клієнт</th><th>Телефон</th><th>Місто</th><th class="right">Замовлень</th>
    <th class="right">Витратив</th><th>Останнє замовлення</th><th>Клієнт з</th></tr></thead><tbody>${list.length ? list.map(({ c, st }) => `
    <tr data-customer="${c.id}">
      <td class="strong">${esc(c.name)}</td><td class="num">${esc(c.phone)}</td><td>${esc(c.city || '—')}</td>
      <td class="num right">${st.count}</td><td class="num right strong">${fmt(st.spent)}</td>
      <td class="num">${st.last ? dt(st.last) : '—'}</td><td class="num">${day(c.created_at)}</td>
    </tr>`).join('') : `<tr><td colspan="7" class="empty">${S.customers.length ? 'Нічого не знайдено' : 'Клієнти з’являться після першого замовлення'}</td></tr>`}</tbody>`;
}
$('#customerSearch').addEventListener('input', renderCustomers);
$('#customersTable').addEventListener('click', e => { const r = e.target.closest('[data-customer]'); if (r) openCustomer(+r.dataset.customer); });

function openCustomer(id) {
  const c = S.customers.find(x => x.id === id); if (!c) return;
  const st = customerStats(c);
  openPanel(`
    <h2>${esc(c.name)}</h2><p class="sub">Клієнт з ${day(c.created_at)}</p>
    <div class="box"><h3>Контакти</h3><dl class="kv">
      <dt>Телефон</dt><dd><a href="tel:${esc(c.phone)}">${esc(c.phone)}</a></dd>
      <dt>Місто</dt><dd>${esc(c.city || '—')}</dd>
      <dt>Замовлень</dt><dd>${st.count}</dd>
      <dt>Витратив</dt><dd>${fmt(st.spent)} <small class="muted">(без скасованих і повернень)</small></dd>
      <dt>Середній чек</dt><dd>${fmt(st.count ? Math.round(st.spent / Math.max(1, st.orders.filter(o => !CLOSED.includes(o.status)).length)) : 0)}</dd>
    </dl></div>
    <div class="box"><h3>Історія замовлень</h3><div class="history">${st.orders.map(o => `
      <button data-order="${o.id}"><span><b>${esc(o.number)}</b> <small class="muted">${dt(o.created_at)}</small></span>
        <span class="actions">${badge(o.status)}<b class="num">${fmt(o.items_total)}</b></span></button>`).join('') || '<p class="muted">Замовлень немає</p>'}</div></div>
    <form class="box" id="customerForm"><h3>Нотатки про клієнта</h3>
      <textarea id="cNotes" maxlength="1000" placeholder="Напр.: постійний клієнт, носить розмір M">${esc(c.notes || '')}</textarea>
      <div class="actions"><button class="btn btn-primary" type="submit">Зберегти нотатку</button></div>
    </form>`);
  $('#customerForm').addEventListener('submit', async e => {
    e.preventDefault();
    const { error } = await db.from('customers').update({ notes: $('#cNotes').value.trim() }).eq('id', c.id);
    if (error) { toast('Не збережено: ' + error.message, true); return; }
    c.notes = $('#cNotes').value.trim(); toast('Нотатку збережено');
  });
}

/* ===================== ТОВАРИ Й ЗАЛИШКИ ===================== */
const stockOf = id => S.stock.filter(s => s.product_id === id);
const stockTotal = id => sum(stockOf(id), s => s.qty);
const stockBadge = t => t === 0 ? '<span class="badge stock-out">Немає</span>'
  : t <= 5 ? `<span class="badge stock-low">Закінчується · ${t}</span>` : `<span class="badge stock-ok">${t} шт.</span>`;

function renderProducts() {
  $('#importBox').hidden = S.products.length > 0;
  $('#productChips').innerHTML = [['all', 'Усі'], ...SEASONS.map(s => [s.key, s.emoji + ' ' + s.name]), ['low', '⚠️ Мало на складі']]
    .map(([k, l]) => `<button class="chip ${S.pSeason === k ? 'on' : ''}" data-pseason="${k}">${l}</button>`).join('');
  const q = $('#productSearch').value.trim().toLowerCase();
  const list = S.products.filter(p => (S.pSeason === 'all' || p.season === S.pSeason || (S.pSeason === 'low' && stockTotal(p.id) <= 5))
    && (!q || [p.name, p.id].join(' ').toLowerCase().includes(q)));
  $('#productsTable').innerHTML = S.products.length ? `<thead><tr><th></th><th>Товар</th><th>Сезон</th><th>Для кого</th>
    <th class="right">Ціна</th><th class="right">Стара ціна</th><th>Залишок</th><th>На сайті</th></tr></thead><tbody>${list.map(p => `
    <tr data-product="${esc(p.id)}">
      <td><img class="thumb" src="${esc(imgUrl(p, 1))}" alt="" loading="lazy" onerror="this.style.visibility='hidden'"></td>
      <td><b>${esc(p.name)}</b><br><small class="muted">${esc(p.id)} · ${esc(CATEGORIES[p.cat] || p.cat)}</small></td>
      <td>${SEASON_NAME[p.season]}</td><td>${AUDIENCES[p.aud]}</td>
      <td class="num right strong">${fmt(p.price)}</td>
      <td class="num right">${p.old_price ? `<s class="muted">${fmt(p.old_price)}</s> <small>−${Math.round((1 - p.price / p.old_price) * 100)}%</small>` : '—'}</td>
      <td>${stockBadge(stockTotal(p.id))}</td>
      <td>${p.active ? '✅' : '<span class="muted">приховано</span>'}</td>
    </tr>`).join('') || '<tr><td colspan="8" class="empty">Нічого не знайдено</td></tr>'}</tbody>` : '';
}
$('#productChips').addEventListener('click', e => { const b = e.target.closest('[data-pseason]'); if (b) { S.pSeason = b.dataset.pseason; renderProducts(); } });
$('#productSearch').addEventListener('input', renderProducts);
$('#productsTable').addEventListener('click', e => { const r = e.target.closest('[data-product]'); if (r) openProduct(r.dataset.product); });
$('#addProductBtn').addEventListener('click', () => openProduct(null));

/* ---------- Редактор картки товару: створення й редагування ---------- */
const SIZE_GROUPS = [
  ['Дорослі', ['XS', 'S', 'M', 'L', 'XL', 'XXL']],
  ['Діти (зріст, см)', ['86', '92', '98', '104', '110', '116', '122', '128', '134', '140', '146', '152']],
  ['Головні убори та інше', ['48-50', '52-54', 'One size']],
];
const SEASON_CODE = { spring: 'sp', summer: 'su', autumn: 'au', winter: 'wi' };
const AUD_CODE = { women: 'w', men: 'm', kids: 'k' };
const BUCKET = 'products';
const imgUrl = (p, n) => p[`image${n}`] || `images/products/${p.id}-${n}.jpg`;
const storagePath = url => { const m = /\/storage\/v1\/object\/public\/products\/(.+)$/.exec(url || ''); return m ? decodeURIComponent(m[1]) : null; };
const sortSizes = sizes => { const order = SIZE_GROUPS.flatMap(g => g[1]); return [...sizes].sort((a, b) => (order.indexOf(a) + 1 || 999) - (order.indexOf(b) + 1 || 999)); };
function nextId(season, aud) {
  const pre = `${SEASON_CODE[season]}-${AUD_CODE[aud]}-`;
  let n = 1; while (S.products.some(x => x.id === pre + n)) n++;
  return pre + n;
}

let E = null; // чернетка відкритої картки

function openProduct(id) {
  const p = id ? S.products.find(x => x.id === id) : null;
  if (id && !p) return;
  const qty = {};
  if (p) stockOf(p.id).forEach(s => { qty[s.size + '|' + s.color] = s.qty; });
  E = p ? {
    isNew: false, id: p.id, season: p.season, aud: p.aud, cat: p.cat, emoji: p.emoji, name: p.name, price: p.price,
    old: p.old_price ?? '', material: p.material, desc: p.description, active: p.active, sizes: [...p.sizes], colors: [...p.colors],
    rating: p.rating, reviews: p.reviews, sort: p.sort, qty, image1: p.image1, image2: p.image2,
  } : {
    isNew: true, id: null, season: 'spring', aud: 'women', cat: 'outer', emoji: '👕', name: '', price: '', old: '', material: '', desc: '',
    active: true, sizes: ['S', 'M', 'L'], colors: [], rating: 5, reviews: 0, sort: Math.max(0, ...S.products.map(x => x.sort)) + 1, qty: {},
    image1: null, image2: null,
  };
  E.files = {}; E.preview = {}; E.remove = {};
  renderEditor(true);
}

function collectEditor() {
  if (!$('#productForm')) return;
  const v = id => $('#' + id).value;
  Object.assign(E, {
    name: v('pName'), season: v('pSeason'), aud: v('pAud'), cat: v('pCat'), emoji: v('pEmoji'), price: v('pPrice'), old: v('pOld'),
    material: v('pMaterial'), desc: v('pDesc'), active: $('#pActive').checked, rating: v('pRating'), reviews: v('pReviews'), sort: v('pSort'),
  });
  $$('#productForm [data-size][data-color]').forEach(i => { E.qty[i.dataset.size + '|' + i.dataset.color] = Math.max(0, parseInt(i.value, 10) || 0); });
}

function renderEditor(fresh = false) {
  const keep = fresh ? 0 : $('#panel').scrollTop;
  const opt = (obj, cur) => Object.entries(obj).map(([k, l]) => `<option value="${k}" ${k === cur ? 'selected' : ''}>${esc(l)}</option>`).join('');
  const photoSlot = (n, title) => {
    const src = E.preview[n] || (E.remove[n] ? null : (E.isNew ? E[`image${n}`] : imgUrl(E, n)));
    return `<div class="photo-slot">
      <div class="photo-box">${src ? `<img src="${esc(src)}" alt="" onerror="this.replaceWith(Object.assign(document.createElement('span'),{className:'muted small',textContent:'Немає фото'}))">` : `<span class="photo-emoji">${esc(E.emoji || '👕')}</span>`}</div>
      <b>${title}</b>
      <div class="actions">
        <label class="btn btn-ghost small-btn">📷 ${src ? 'Замінити' : 'Завантажити'}<input type="file" accept="image/jpeg,image/png,image/webp" data-photo="${n}" hidden></label>
        ${src ? `<button type="button" class="link small" data-photo-remove="${n}">Прибрати</button>` : ''}
      </div></div>`;
  };
  const discount = E.old && E.price && +E.old > +E.price ? Math.round((1 - E.price / E.old) * 100) : 0;
  openPanel(`
    <h2>${E.isNew ? 'Новий товар' : esc(E.name)}</h2>
    <p class="sub">${E.isNew ? `Код буде присвоєно автоматично: <b>${nextId(E.season, E.aud)}</b>` : `Код ${esc(E.id)} · ${E.active ? 'показується на сайті' : 'приховано з сайту'}`}</p>
    <form id="productForm" novalidate>
      <div class="box"><h3>Основне</h3>
        <label>Назва<input type="text" id="pName" maxlength="80" required placeholder="Напр.: Светр «Рапсодія»" value="${esc(E.name)}"></label>
        <div class="row3">
          <label>Сезон<select id="pSeason">${opt(Object.fromEntries(SEASONS.map(s => [s.key, s.emoji + ' ' + s.name])), E.season)}</select></label>
          <label>Для кого<select id="pAud">${opt(AUDIENCES, E.aud)}</select></label>
          <label>Категорія<select id="pCat">${opt(CATEGORIES, E.cat)}</select></label>
        </div>
        <div class="row2">
          <label>Емодзі (якщо немає фото)<input type="text" id="pEmoji" maxlength="8" value="${esc(E.emoji)}"></label>
          <label class="check" style="align-self:end"><input type="checkbox" id="pActive" ${E.active ? 'checked' : ''}> Показувати на сайті</label>
        </div>
      </div>

      <div class="box"><h3>Ціна</h3>
        <div class="row2">
          <label>Ціна, ₴<input type="number" id="pPrice" min="1" step="1" required value="${esc(E.price)}"></label>
          <label>Стара ціна, ₴ — для знижки<input type="number" id="pOld" min="1" step="1" placeholder="без знижки" value="${esc(E.old)}"></label>
        </div>
        ${discount ? `<p class="small">Знижка на сайті: <b>−${discount}%</b></p>` : '<p class="small muted">Щоб показати знижку, вкажіть стару ціну, більшу за нову.</p>'}
      </div>

      <div class="box"><h3>Опис</h3>
        <label>Опис для покупця<textarea id="pDesc" maxlength="600" placeholder="2–3 речення: чим річ хороша, з чим носити">${esc(E.desc)}</textarea></label>
        <label>Склад<input type="text" id="pMaterial" maxlength="200" placeholder="Напр.: 80% бавовна, 20% поліестер" value="${esc(E.material)}"></label>
      </div>

      <div class="box"><h3>Фото</h3>
        <div class="photos">${photoSlot(1, 'На моделі — у першому кольорі')}${photoSlot(2, 'Усі кольори / без моделі')}</div>
        <p class="small muted">JPG, PNG або WebP до 5 МБ, вертикальне 3:4. Фото автоматично зменшується до 900 px перед завантаженням.</p>
      </div>

      <div class="box"><h3>Розміри · обрано ${E.sizes.length}</h3>
        ${SIZE_GROUPS.map(([title, list]) => `<div class="pick-group"><small class="muted">${title}</small><div class="chips">${list.map(s => `<button type="button" class="chip ${E.sizes.includes(s) ? 'on' : ''}" data-size-toggle="${esc(s)}">${esc(s)}</button>`).join('')}</div></div>`).join('')}
        ${E.sizes.filter(s => !SIZE_GROUPS.some(g => g[1].includes(s))).length ? `<div class="pick-group"><small class="muted">Свої</small><div class="chips">${E.sizes.filter(s => !SIZE_GROUPS.some(g => g[1].includes(s))).map(s => `<button type="button" class="chip on" data-size-toggle="${esc(s)}">${esc(s)} ✕</button>`).join('')}</div></div>` : ''}
        <div class="inline"><input type="text" id="pCustomSize" maxlength="12" placeholder="Свій розмір, напр. 36 або 1 рік"><button type="button" class="btn btn-ghost" id="addSizeBtn">Додати</button></div>
      </div>

      <div class="box"><h3>Кольори · обрано ${E.colors.length}</h3>
        <div class="chips">${Object.entries(COLORS).map(([k, [n, hex]]) => { const i = E.colors.indexOf(k); return `<button type="button" class="chip color-chip ${i >= 0 ? 'on' : ''}" data-color-toggle="${k}"><span class="swatch" style="background:${hex}"></span>${esc(n)}${i >= 0 ? ` <b class="n">${i + 1}</b>` : ''}</button>`; }).join('')}</div>
        <p class="small muted">Порядок має значення: колір №1 — той, у якому товар на фото з моделлю.</p>
      </div>

      <div class="box"><h3>Залишки на складі, шт.</h3>
        ${E.sizes.length && E.colors.length ? `<div class="stock-grid"><table>
          <thead><tr><th>Розмір</th>${E.colors.map(c => `<th>${swatch(c)}${esc(colorName(c))}</th>`).join('')}</tr></thead>
          <tbody>${sortSizes(E.sizes).map(s => `<tr><th>${esc(s)}</th>${E.colors.map(c => `<td><input type="number" min="0" max="999" step="1" data-size="${esc(s)}" data-color="${esc(c)}" value="${E.qty[s + '|' + c] ?? 0}" aria-label="${esc(s)}, ${esc(colorName(c))}"></td>`).join('')}</tr>`).join('')}</tbody>
        </table></div>
        <p class="small muted">На сайті: 0 шт. — «Немає в наявності», 1–5 — «Закінчується». Розмір, якого немає в обраному кольорі, покупець не зможе обрати.</p>`
        : '<p class="muted">Оберіть хоча б один розмір і колір — тут з’явиться таблиця залишків.</p>'}
      </div>

      <div class="box"><h3>Додатково</h3>
        <div class="row3">
          <label>Рейтинг (0–5)<input type="number" id="pRating" min="0" max="5" step="0.1" value="${esc(E.rating)}"></label>
          <label>Відгуків<input type="number" id="pReviews" min="0" step="1" value="${esc(E.reviews)}"></label>
          <label>Порядок у каталозі<input type="number" id="pSort" step="1" value="${esc(E.sort)}"></label>
        </div>
        <p class="small muted">Товар із 0 відгуків показується на сайті з позначкою «Новинка».</p>
      </div>

      <div class="actions sticky-actions">
        <button class="btn btn-primary" type="submit">${E.isNew ? 'Створити товар' : 'Зберегти зміни'}</button>
        ${E.isNew ? '' : `<a href="./#season-${esc(E.season)}" target="_blank" rel="noopener" class="small">Відкрити на сайті ↗</a>
        <button type="button" class="btn btn-danger" id="deleteProductBtn">Видалити товар</button>`}
      </div>
    </form>`);
  $('#panel').scrollTop = keep;
  $('#productForm').addEventListener('submit', saveProduct);
}

// Перемикачі розмірів, кольорів, фото — зберігаємо введене й перемальовуємо картку
$('#panelBody').addEventListener('click', e => {
  if (!E || !$('#productForm')) return;
  const sz = e.target.closest('[data-size-toggle]');
  const col = e.target.closest('[data-color-toggle]');
  const rm = e.target.closest('[data-photo-remove]');
  if (sz) { collectEditor(); const s = sz.dataset.sizeToggle; E.sizes = E.sizes.includes(s) ? E.sizes.filter(x => x !== s) : sortSizes([...E.sizes, s]); renderEditor(); }
  else if (col) { collectEditor(); const c = col.dataset.colorToggle; E.colors = E.colors.includes(c) ? E.colors.filter(x => x !== c) : [...E.colors, c]; renderEditor(); }
  else if (rm) { collectEditor(); const n = rm.dataset.photoRemove; delete E.files[n]; delete E.preview[n]; E.remove[n] = true; renderEditor(); }
  else if (e.target.closest('#addSizeBtn')) {
    collectEditor(); const s = $('#pCustomSize').value.trim();
    if (!s) { toast('Введіть розмір', true); return; }
    if (!E.sizes.includes(s)) E.sizes = sortSizes([...E.sizes, s]);
    renderEditor();
  } else if (e.target.closest('#deleteProductBtn')) deleteProduct();
});
$('#panelBody').addEventListener('change', e => {
  const f = e.target.closest('[data-photo]'); if (!f || !E) return;
  const file = f.files[0]; if (!file) return;
  if (!/^image\/(jpeg|png|webp)$/.test(file.type)) { toast('Підходять лише JPG, PNG або WebP', true); return; }
  if (file.size > 15 * 1024 * 1024) { toast('Файл завеликий (понад 15 МБ)', true); return; }
  collectEditor();
  const n = f.dataset.photo;
  E.files[n] = file; E.preview[n] = URL.createObjectURL(file); E.remove[n] = false;
  renderEditor();
});
$('#panelBody').addEventListener('input', e => {
  if (E && ['pSeason', 'pAud', 'pPrice', 'pOld', 'pEmoji'].includes(e.target.id)) {
    // оновити підказки (код, знижку) не втрачаючи введене
    clearTimeout(E.t); E.t = setTimeout(() => { collectEditor(); renderEditor(); const el = $('#' + e.target.id); if (el) { el.focus(); if (el.setSelectionRange && el.type === 'text') el.setSelectionRange(el.value.length, el.value.length); } }, 500);
  }
});

// Зменшити фото до 900 px по ширині й стиснути в JPEG
async function shrinkImage(file) {
  const bmp = await createImageBitmap(file);
  const w = Math.min(900, bmp.width), h = Math.round(bmp.height * w / bmp.width);
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  c.getContext('2d').drawImage(bmp, 0, 0, w, h);
  return new Promise(res => c.toBlob(res, 'image/jpeg', 0.85));
}

async function saveProduct(e) {
  e.preventDefault();
  collectEditor();
  const name = E.name.trim(), price = parseInt(E.price, 10), old = String(E.old).trim() ? parseInt(E.old, 10) : null;
  const rating = Number(E.rating), reviews = parseInt(E.reviews, 10) || 0;
  if (name.length < 2) { toast('Вкажіть назву товару', true); $('#pName').focus(); return; }
  if (!(price > 0)) { toast('Вкажіть ціну', true); $('#pPrice').focus(); return; }
  if (old !== null && !(old > price)) { toast('Стара ціна має бути більшою за нову — інакше це не знижка', true); $('#pOld').focus(); return; }
  if (!E.sizes.length) { toast('Оберіть хоча б один розмір', true); return; }
  if (!E.colors.length) { toast('Оберіть хоча б один колір', true); return; }
  if (!(rating >= 0 && rating <= 5)) { toast('Рейтинг має бути від 0 до 5', true); return; }

  const btn = e.submitter || e.target.querySelector('[type="submit"]'); btn.disabled = true; btn.textContent = 'Зберігаємо…';
  const done = () => { btn.disabled = false; btn.textContent = E.isNew ? 'Створити товар' : 'Зберегти зміни'; };
  const id = E.isNew ? nextId(E.season, E.aud) : E.id;
  const images = { image1: E.isNew ? null : E.image1 ?? null, image2: E.isNew ? null : E.image2 ?? null };
  const toDelete = [];

  // 1. Фото
  for (const n of ['1', '2']) {
    const key = 'image' + n, oldPath = storagePath(E[key]);
    if (E.files[n]) {
      const blob = await shrinkImage(E.files[n]);
      const path = `${id}/${n}-${Date.now()}.jpg`;
      const up = await db.storage.from(BUCKET).upload(path, blob, { contentType: 'image/jpeg', cacheControl: '31536000' });
      if (up.error) { done(); toast('Фото не завантажилось: ' + up.error.message, true); return; }
      images[key] = db.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
      if (oldPath) toDelete.push(oldPath);
    } else if (E.remove[n]) {
      images[key] = null;
      if (oldPath) toDelete.push(oldPath);
    }
  }

  // 2. Картка товару
  const row = {
    id, season: E.season, aud: E.aud, cat: E.cat, emoji: (E.emoji || '👕').trim(), name, price, old_price: old,
    sizes: sortSizes(E.sizes), colors: E.colors, material: E.material.trim(), description: E.desc.trim(),
    rating: Math.round(rating * 10) / 10, reviews, sort: parseInt(E.sort, 10) || 0, active: E.active, ...images,
  };
  const r = E.isNew ? await db.from('products').insert(row) : await db.from('products').update(row).eq('id', id);
  if (r.error) { done(); toast('Не збережено: ' + r.error.message, true); return; }

  // 3. Залишки: сітка «розмір × колір»; зайві комбінації (прибрані розміри/кольори) видаляємо
  const stock = row.sizes.flatMap(size => row.colors.map(color => ({ product_id: id, size, color, qty: E.qty[size + '|' + color] ?? 0 })));
  const s1 = await db.from('stock').upsert(stock);
  const stale = stockOf(id).filter(s => !row.sizes.includes(s.size) || !row.colors.includes(s.color));
  const s2 = await Promise.all(stale.map(s => db.from('stock').delete().eq('product_id', id).eq('size', s.size).eq('color', s.color)));
  if (toDelete.length) await db.storage.from(BUCKET).remove(toDelete);
  done();
  const err = s1.error || s2.find(x => x.error)?.error;
  if (err) { toast('Товар збережено, але залишки — ні: ' + err.message, true); }
  else toast(E.isNew ? `Товар «${name}» створено (${id}) — він уже на сайті` : `«${name}» збережено — на сайті вже нові дані`);
  await loadAll(); openProduct(id);
}

async function deleteProduct() {
  const p = S.products.find(x => x.id === E.id); if (!p) return;
  const { count, error } = await db.from('order_items').select('id', { count: 'exact', head: true }).eq('product_id', p.id);
  if (error) { toast('Не вдалося перевірити замовлення: ' + error.message, true); return; }
  if (count > 0) {
    toast(`«${p.name}» уже є в ${count} замовленнях — видалити не можна, щоб не зламати історію. Зніміть галочку «Показувати на сайті».`, true);
    return;
  }
  if (!confirm(`Видалити «${p.name}» (${p.id}) назавжди?\n\nЗникнуть картка, залишки й завантажені фото. Це не можна скасувати.`)) return;
  const paths = [storagePath(p.image1), storagePath(p.image2)].filter(Boolean);
  const r = await db.from('products').delete().eq('id', p.id);
  if (r.error) { toast('Не видалено: ' + r.error.message, true); return; }
  if (paths.length) await db.storage.from(BUCKET).remove(paths);
  toast(`«${p.name}» видалено`); closePanel(); E = null; loadAll();
}

// Перше наповнення бази з каталогу сайту (js/data.js)
$('#importBtn').addEventListener('click', async () => {
  const btn = $('#importBtn'); btn.disabled = true; btn.textContent = 'Імпортуємо…';
  const products = PRODUCTS.map((p, i) => ({
    id: p.id, season: p.season, aud: p.aud, cat: p.cat, emoji: p.emoji, name: p.name, price: p.price, old_price: p.old || null,
    sizes: p.sizes, colors: p.colors, material: p.material, description: p.desc, rating: p.rating, reviews: p.reviews, sort: i, active: true,
  }));
  const rnd = n => Math.floor(Math.random() * n);
  const stock = PRODUCTS.flatMap(p => {
    const cells = p.sizes.flatMap(size => p.colors.map(color => ({ product_id: p.id, size, color, qty: 0 })));
    if (p.stock === 'in') cells.forEach(c => { c.qty = 2 + rnd(9); });
    if (p.stock === 'low') { let left = 3 + rnd(3); while (left-- > 0) cells[rnd(cells.length)].qty++; }
    return cells;
  });
  const a = await db.from('products').upsert(products);
  const b = a.error ? a : await db.from('stock').upsert(stock);
  btn.disabled = false; btn.textContent = 'Імпортувати каталог';
  if (b.error) { toast('Помилка імпорту: ' + b.error.message, true); return; }
  toast(`Імпортовано ${products.length} товарів і ${stock.length} позицій складу`);
  loadAll();
});

/* ===================== СТАТИСТИКА ===================== */
$('#periodChips').addEventListener('click', e => {
  const b = e.target.closest('[data-period]'); if (!b) return;
  S.period = +b.dataset.period;
  $$('#periodChips .chip').forEach(c => c.classList.toggle('on', c === b));
  renderStats();
});

const dayKey = d => { const x = new Date(d); return `${x.getFullYear()}-${x.getMonth() + 1}-${x.getDate()}`; };
const niceMax = v => { if (!v) return 1000; const p = 10 ** Math.floor(Math.log10(v)); return Math.ceil(v / p) * p; };

function renderStats() {
  const since = S.period ? Date.now() - S.period * 864e5 : 0;
  const orders = S.orders.filter(o => new Date(o.created_at).getTime() >= since);
  const valid = orders.filter(o => !CLOSED.includes(o.status));
  const revenue = sum(valid, o => o.items_total);
  const avg = valid.length ? Math.round(revenue / valid.length) : 0;
  const lost = orders.length - valid.length;

  // Виручка по днях
  const first = orders.length ? Math.min(...orders.map(o => +new Date(o.created_at))) : Date.now();
  const nDays = Math.min(60, S.period || Math.max(7, Math.ceil((Date.now() - first) / 864e5) + 1));
  const days = Array.from({ length: nDays }, (_, i) => new Date(Date.now() - (nDays - 1 - i) * 864e5));
  const byDay = Object.fromEntries(days.map(d => [dayKey(d), 0]));
  valid.forEach(o => { const k = dayKey(o.created_at); if (k in byDay) byDay[k] += o.items_total; });
  const vals = days.map(d => byDay[dayKey(d)]);
  const max = niceMax(Math.max(...vals));
  const W = 640, H = 220, L = 52, B = 26, T = 10, cw = (W - L - 8) / nDays;
  const y = v => T + (H - T - B) * (1 - v / max);
  const step = Math.ceil(nDays / 10);
  const chart = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Виручка по днях">
    ${[0, .25, .5, .75, 1].map(f => `<line class="grid" x1="${L}" x2="${W - 4}" y1="${y(max * f)}" y2="${y(max * f)}"/><text x="${L - 6}" y="${y(max * f) + 3}" text-anchor="end">${(max * f / 1000).toLocaleString('uk-UA')}k</text>`).join('')}
    ${vals.map((v, i) => `<rect class="bar" x="${L + i * cw + cw * .15}" y="${y(v)}" width="${cw * .7}" height="${Math.max(0, H - B - y(v))}" rx="3"><title>${days[i].toLocaleDateString('uk-UA')}: ${fmt(v)}</title></rect>`).join('')}
    ${days.map((d, i) => i % step === 0 ? `<text x="${L + i * cw + cw / 2}" y="${H - 8}" text-anchor="middle">${d.getDate()}.${String(d.getMonth() + 1).padStart(2, '0')}</text>` : '').join('')}
  </svg>`;

  // Топ товарів
  const agg = {};
  valid.forEach(o => o.order_items.forEach(i => {
    agg[i.product_id] ??= { name: i.name, qty: 0, sum: 0 };
    agg[i.product_id].qty += i.qty; agg[i.product_id].sum += i.qty * i.price;
  }));
  const top = Object.values(agg).sort((a, b) => b.qty - a.qty || b.sum - a.sum).slice(0, 6);
  const topMax = Math.max(1, ...top.map(t => t.qty));

  // Статуси
  const st = Object.keys(STATUS).map(k => [k, orders.filter(o => o.status === k).length]);
  const stMax = Math.max(1, ...st.map(s => s[1]));

  // Мало на складі
  const low = S.products.filter(p => p.active).map(p => ({ p, t: stockTotal(p.id) })).filter(x => x.t <= 5).sort((a, b) => a.t - b.t);

  $('#statsBody').innerHTML = `
    <div class="kpis">
      <div class="kpi"><span>Виручка</span><b>${fmt(revenue)}</b><small>без скасованих і повернень</small></div>
      <div class="kpi"><span>Замовлень</span><b>${valid.length}</b><small>${orders.filter(o => o.status === 'new').length} нових чекають обробки</small></div>
      <div class="kpi"><span>Середній чек</span><b>${fmt(avg)}</b><small>${sum(valid, o => sum(o.order_items, i => i.qty))} речей продано</small></div>
      <div class="kpi"><span>Скасовано й повернено</span><b>${lost}</b><small>${orders.length ? Math.round(lost / orders.length * 100) : 0}% від усіх замовлень</small></div>
    </div>
    <div class="grid2">
      <div class="card chart"><h3>Виручка по днях, ₴</h3>${chart}</div>
      <div class="card"><h3>Популярні товари</h3><div class="hbars">${top.map(t => `
        <div class="hbar"><span>${esc(t.name)}</span><b class="num">${t.qty} шт. · ${fmt(t.sum)}</b><i style="--w:${t.qty / topMax * 100}%"></i></div>`).join('') || '<p class="muted">Ще немає продажів за цей період</p>'}</div></div>
      <div class="card"><h3>Замовлення за статусами</h3><div class="hbars">${st.map(([k, n]) => `
        <div class="hbar"><span>${STATUS[k][0]}</span><b class="num">${n}</b><i style="--w:${n / stMax * 100}%;--c:${STATUS[k][1]}"></i></div>`).join('')}</div></div>
      <div class="card"><h3>Мало на складі (≤ 5 шт.)</h3><div class="history">${low.map(({ p, t }) => `
        <button data-goto-product="${esc(p.id)}"><span>${esc(p.name)}</span>${stockBadge(t)}</button>`).join('') || '<p class="muted">Усього достатньо 👍</p>'}</div></div>
    </div>`;
}
$('#statsBody').addEventListener('click', e => {
  const b = e.target.closest('[data-goto-product]'); if (!b) return;
  show('products'); openProduct(b.dataset.gotoProduct);
});

/* ===================== СТАРТ ===================== */
(async () => {
  const { data: { session } } = await db.auth.getSession();
  if (session) enter(session.user); else showLogin();
})();
