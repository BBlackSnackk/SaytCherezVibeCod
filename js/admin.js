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
      <div class="item"><img class="thumb" src="images/products/${esc(i.product_id)}-1.jpg" alt="" onerror="this.style.visibility='hidden'">
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
      <td><img class="thumb" src="images/products/${esc(p.id)}-1.jpg" alt="" onerror="this.style.visibility='hidden'"></td>
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

function openProduct(id) {
  const p = S.products.find(x => x.id === id); if (!p) return;
  const qty = (s, c) => stockOf(p.id).find(x => x.size === s && x.color === c)?.qty ?? 0;
  openPanel(`
    <h2>${esc(p.name)}</h2><p class="sub">${esc(p.id)} · ${SEASON_NAME[p.season]} · ${AUDIENCES[p.aud]} · ${esc(CATEGORIES[p.cat] || p.cat)}</p>
    <form id="productForm">
      <div class="box"><h3>Опис і ціна</h3>
        <label>Назва<input type="text" id="pName" maxlength="80" required value="${esc(p.name)}"></label>
        <div class="row2">
          <label>Ціна, ₴<input type="number" id="pPrice" min="1" step="1" required value="${p.price}"></label>
          <label>Стара ціна, ₴ (для знижки)<input type="number" id="pOld" min="1" step="1" placeholder="без знижки" value="${p.old_price ?? ''}"></label>
        </div>
        <label>Склад<input type="text" id="pMaterial" maxlength="200" value="${esc(p.material)}"></label>
        <label>Опис<textarea id="pDesc" maxlength="600">${esc(p.description)}</textarea></label>
        <label class="check"><input type="checkbox" id="pActive" ${p.active ? 'checked' : ''}> Показувати на сайті</label>
      </div>
      <div class="box"><h3>Залишки на складі, шт. · зараз ${stockTotal(p.id)}</h3>
        <div class="stock-grid"><table>
          <thead><tr><th>Розмір</th>${p.colors.map(c => `<th>${swatch(c)}${esc(colorName(c))}</th>`).join('')}</tr></thead>
          <tbody>${p.sizes.map(s => `<tr><th>${esc(s)}</th>${p.colors.map(c => `<td><input type="number" min="0" max="999" step="1" data-size="${esc(s)}" data-color="${esc(c)}" value="${qty(s, c)}" aria-label="${esc(s)}, ${esc(colorName(c))}"></td>`).join('')}</tr>`).join('')}</tbody>
        </table></div>
        <p class="small muted">На сайті: 0 шт. — «Немає в наявності», 1–5 — «Закінчується». Розмір, якого немає в обраному кольорі, покупець не зможе обрати.</p>
      </div>
      <div class="actions"><button class="btn btn-primary" type="submit">Зберегти зміни</button>
        <a href="./#season-${esc(p.season)}" target="_blank" rel="noopener" class="small">Відкрити на сайті ↗</a></div>
    </form>`);

  $('#productForm').addEventListener('submit', async e => {
    e.preventDefault();
    const price = parseInt($('#pPrice').value, 10);
    const oldRaw = $('#pOld').value.trim(); const old = oldRaw ? parseInt(oldRaw, 10) : null;
    const name = $('#pName').value.trim();
    if (name.length < 2) { toast('Назва надто коротка', true); return; }
    if (!(price > 0)) { toast('Вкажіть ціну', true); return; }
    if (old !== null && !(old > price)) { toast('Стара ціна має бути більшою за нову — інакше це не знижка', true); return; }
    const rows = $$('#productForm [data-size]').map(i => ({ product_id: p.id, size: i.dataset.size, color: i.dataset.color, qty: Math.max(0, parseInt(i.value, 10) || 0) }));
    const btn = e.submitter || e.target.querySelector('[type="submit"]'); btn.disabled = true;
    const a = await db.from('products').update({ name, price, old_price: old, material: $('#pMaterial').value.trim(), description: $('#pDesc').value.trim(), active: $('#pActive').checked }).eq('id', p.id);
    const b = a.error ? a : await db.from('stock').upsert(rows);
    btn.disabled = false;
    if (b.error) { toast('Не збережено: ' + b.error.message, true); return; }
    toast('«' + name + '» збережено — на сайті вже нові дані');
    await loadAll(); openProduct(p.id);
  });
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
