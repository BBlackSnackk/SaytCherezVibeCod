/* ===================== Вівальді — логіка сайту ===================== */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const fmt = n => n.toLocaleString('uk-UA') + ' ₴';
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const byId = Object.fromEntries(PRODUCTS.map(p => [p.id, p]));
const FREE_DELIVERY = 1500;

const store = {
  get(k, d) { try { const v = JSON.parse(localStorage.getItem(k)); return v ?? d; } catch { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* приватний режим */ } },
};

/* ---------- Тост ---------- */
let toastTimer;
function toast(text) {
  const t = $('#toast');
  t.textContent = text;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2600);
}

/* ---------- Плейсхолдер / фото ---------- */
// Фото, завантажене через CRM (Supabase Storage), або файл із репозиторію
const imgSrc = (p, n) => (n === 1 ? p.img1 : p.img2) || `images/products/${p.id}-${n}.jpg`;
const ratingLine = p => p.reviews > 0 ? `<b>★ ${p.rating.toFixed(1)}</b> · ${p.reviews} відгуків` : '<b class="new-badge">✨ Новинка</b>';

function photo(p, n = 1, label = false, hoverAlt = false) {
  return `<div class="ph" data-s="${p.season}">
    <span class="ph-emoji" aria-hidden="true">${p.emoji}</span>
    ${label ? `<span class="ph-label">${p.id}-${n}.jpg</span>` : ''}
    <img src="${esc(imgSrc(p, n))}" alt="${esc(p.name)}, фото ${n}" loading="lazy" onerror="this.remove()">
    ${hoverAlt ? `<img class="alt" src="${esc(imgSrc(p, 2))}" alt="" loading="lazy" onerror="this.remove()">` : ''}
  </div>`;
}

/* ===================== ФІЛЬТРИ ===================== */
const F = { q: '', aud: new Set(), season: new Set(), cat: new Set(), size: new Set(), color: new Set(), min: null, max: null, inStock: false, sale: false, sort: 'popular' };
const discount = p => p.old ? Math.round((1 - p.price / p.old) * 100) : 0;

function matches(p, skip) {
  const q = F.q.trim().toLowerCase();
  if (q) {
    const hay = [p.name, CATEGORIES[p.cat], AUDIENCES[p.aud], p.desc, p.material, SEASONS.find(s => s.key === p.season).name,
      ...p.colors.map(c => COLORS[c][0])].join(' ').toLowerCase();
    if (!q.split(/\s+/).every(w => hay.includes(w))) return false;
  }
  if (skip !== 'aud' && F.aud.size && !F.aud.has(p.aud)) return false;
  if (skip !== 'season' && F.season.size && !F.season.has(p.season)) return false;
  if (skip !== 'cat' && F.cat.size && !F.cat.has(p.cat)) return false;
  if (skip !== 'size' && F.size.size && !p.sizes.some(s => F.size.has(s))) return false;
  if (skip !== 'color' && F.color.size && !p.colors.some(c => F.color.has(c))) return false;
  if (F.min != null && p.price < F.min) return false;
  if (F.max != null && p.price > F.max) return false;
  if (F.inStock && p.stock === 'out') return false;
  if (F.sale && !p.old) return false;
  return true;
}

const sorters = {
  popular: (a, b) => b.reviews - a.reviews,
  cheap: (a, b) => a.price - b.price,
  expensive: (a, b) => b.price - a.price,
  rating: (a, b) => b.rating - a.rating,
  sale: (a, b) => (b.old ? 1 : 0) - (a.old ? 1 : 0) || b.reviews - a.reviews,
};

function renderFilters() {
  const count = (key, val) => PRODUCTS.filter(p => matches(p, key) && (key === 'cat' ? p.cat === val : true)).length;
  const allSizes = [...new Set(PRODUCTS.flatMap(p => p.sizes))];
  const adult = allSizes.filter(s => /^[A-Z]+$/.test(s)).sort((a, b) => ['XS', 'S', 'M', 'L', 'XL', 'XXL'].indexOf(a) - ['XS', 'S', 'M', 'L', 'XL', 'XXL'].indexOf(b));
  const kids = allSizes.filter(s => /^\d+$/.test(s)).sort((a, b) => a - b);
  const heads = allSizes.filter(s => s.includes('-'));
  const chip = (f, v, label) => `<button class="chip ${F[f].has(v) ? 'on' : ''}" data-f="${f}" data-v="${v}" aria-pressed="${F[f].has(v)}">${label}</button>`;

  $('#filterBody').innerHTML = `
    <div class="fgroup"><h3>Для кого</h3><div class="chips">
      ${Object.entries(AUDIENCES).map(([k, v]) => chip('aud', k, v)).join('')}</div></div>
    <div class="fgroup"><h3>Сезон</h3><div class="chips">
      ${SEASONS.map(s => chip('season', s.key, s.emoji + ' ' + s.name)).join('')}</div></div>
    <div class="fgroup"><h3>Категорія</h3>
      ${Object.entries(CATEGORIES).map(([k, v]) => `<label class="check"><input type="checkbox" data-f="cat" data-v="${k}" ${F.cat.has(k) ? 'checked' : ''}> ${v}<span class="cnt">${count('cat', k)}</span></label>`).join('')}</div>
    <div class="fgroup"><h3>Ціна, ₴</h3><div class="price-row">
      <input type="number" id="pmin" placeholder="від 249" min="0" value="${F.min ?? ''}" aria-label="Ціна від">—
      <input type="number" id="pmax" placeholder="до 2999" min="0" value="${F.max ?? ''}" aria-label="Ціна до"></div></div>
    <div class="fgroup"><h3>Розмір — дорослі</h3><div class="chips">${adult.map(s => chip('size', s, s)).join('')}</div></div>
    <div class="fgroup"><h3>Розмір — діти (зріст)</h3><div class="chips">${kids.map(s => chip('size', s, s)).join('')}${heads.map(s => chip('size', s, '🧢 ' + s)).join('')}</div></div>
    <div class="fgroup"><h3>Колір</h3><div class="swatches">
      ${Object.entries(COLORS).map(([k, [n, hex]]) => `<button class="swatch ${F.color.has(k) ? 'on' : ''}" style="background:${hex}" data-f="color" data-v="${k}" title="${n}" aria-label="${n}" aria-pressed="${F.color.has(k)}"></button>`).join('')}</div></div>
    <div class="fgroup"><label class="check"><input type="checkbox" id="inStock" ${F.inStock ? 'checked' : ''}> Лише в наявності</label>
      <label class="check"><input type="checkbox" id="saleOnly" ${F.sale ? 'checked' : ''}> 🔥 Лише зі знижкою</label></div>`;
}

function renderActiveChips() {
  const list = [];
  F.aud.forEach(v => list.push(['aud', v, AUDIENCES[v]]));
  F.season.forEach(v => list.push(['season', v, SEASONS.find(s => s.key === v).name]));
  F.cat.forEach(v => list.push(['cat', v, CATEGORIES[v]]));
  F.size.forEach(v => list.push(['size', v, 'Розмір ' + v]));
  F.color.forEach(v => list.push(['color', v, COLORS[v][0]]));
  if (F.min != null) list.push(['min', '', 'від ' + fmt(F.min)]);
  if (F.max != null) list.push(['max', '', 'до ' + fmt(F.max)]);
  if (F.inStock) list.push(['inStock', '', 'В наявності']);
  if (F.sale) list.push(['sale', '', 'Зі знижкою']);
  if (F.q) list.push(['q', '', '«' + F.q + '»']);
  $('#activeChips').innerHTML = list.map(([f, v, l]) => `<button class="chip" data-rm="${f}" data-v="${v}">${esc(l)}</button>`).join('')
    + (list.length > 1 ? '<button class="link-btn" data-rm="all">Скинути все</button>' : '');
}

/* ===================== КАТАЛОГ ===================== */
function card(p) {
  const sale = p.old ? Math.round((1 - p.price / p.old) * 100) : 0;
  return `<article class="card ${p.stock === 'out' ? 'is-out' : ''}" data-open="${p.id}" tabindex="0" aria-label="${esc(p.name)}">
    <div class="tags">
      ${sale ? `<span class="tag sale">−${sale}%</span>` : ''}
      ${p.stock === 'low' ? '<span class="tag low">Закінчується</span>' : ''}
      ${p.stock === 'out' ? '<span class="tag out">Немає в наявності</span>' : ''}
    </div>
    ${photo(p, 1, false, true)}
    <div class="card-body">
      <span class="card-meta">${AUDIENCES[p.aud]} · ${CATEGORIES[p.cat]}</span>
      <h3>${esc(p.name)}</h3>
      <span class="rating">${ratingLine(p)}</span>
      <div class="dots">${p.colors.map(c => `<span class="dot" style="background:${COLORS[c][1]}" title="${COLORS[c][0]}"></span>`).join('')}</div>
      <div class="price-line"><span class="price ${p.old ? 'red' : ''}">${fmt(p.price)}</span>${p.old ? `<span class="old">${fmt(p.old)}</span>` : ''}</div>
      <button class="btn ${p.stock === 'out' ? 'btn-ghost' : 'btn-primary'}" data-open="${p.id}">${p.stock === 'out' ? 'Детальніше' : 'Купити'}</button>
    </div>
  </article>`;
}

function buildSeasons() {
  $('#seasons').innerHTML = SEASONS.map(s => `
    <section id="season-${s.key}" class="zone season" data-zone="${s.key}" data-s="${s.key}">
      <div class="season-head">
        <img src="images/hero-${s.key}.jpg" alt="" onerror="this.remove()"><div class="season-shade"></div>
        <span class="season-deco" aria-hidden="true">${s.emoji}</span>
        <span class="it">${s.it}</span>
        <h2>${s.emoji} ${s.name}</h2>
        <p>${s.text}</p>
        <small>🎼 ${s.concerto}</small>
      </div>
      <div class="season-body"></div>
    </section>`).join('');
}

function renderCatalog() {
  let total = 0;
  SEASONS.forEach(s => {
    const sec = $('#season-' + s.key);
    const hiddenBySeason = F.season.size && !F.season.has(s.key);
    sec.hidden = hiddenBySeason;
    $(`[data-nav="season-${s.key}"]`).style.opacity = hiddenBySeason ? .4 : '';
    if (hiddenBySeason) return;
    const items = PRODUCTS.filter(p => p.season === s.key && matches(p)).sort(sorters[F.sort]);
    total += items.length;
    const groups = Object.keys(AUDIENCES).map(a => [a, items.filter(p => p.aud === a)]).filter(([, l]) => l.length);
    $('.season-body', sec).innerHTML = groups.length
      ? groups.map(([a, l]) => `<h3 class="aud-title">${{ women: '👩', men: '👨', kids: '🧒' }[a]} ${AUDIENCES[a]}</h3><div class="grid">${l.map(card).join('')}</div>`).join('')
      : `<div class="empty">У сезоні «${s.name}» за цими фільтрами нічого немає 🤷 <button class="link-btn" data-rm="all">Скинути фільтри</button></div>`;
  });
  const word = n => (n % 10 === 1 && n % 100 !== 11) ? 'товар' : (n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20)) ? 'товари' : 'товарів';
  $('#found').textContent = `Знайдено ${total} ${word(total)}`;
  renderActiveChips();
}

function update(keepView = true) {
  const aside = $('#filters'), asideScroll = aside.scrollTop;
  const main = $('.catalog-main');
  const headerH = $('.header').offsetHeight;
  const wasInside = main.getBoundingClientRect().top < headerH;
  renderFilters();
  renderCatalog();
  aside.scrollTop = asideScroll; // панель фільтрів не стрибає нагору
  // список став коротшим — не даємо сторінці "провалитися" в підвал, а показуємо початок результатів
  if (keepView && wasInside) scrollTo({ top: scrollY + main.getBoundingClientRect().top - headerH - 12, behavior: 'instant' });
  checkZone();
}

/* Події фільтрів */
$('#filterBody').addEventListener('click', e => {
  const b = e.target.closest('button[data-f]');
  if (!b) return;
  const set = F[b.dataset.f];
  set.has(b.dataset.v) ? set.delete(b.dataset.v) : set.add(b.dataset.v);
  update();
});
$('#filterBody').addEventListener('change', e => {
  const t = e.target;
  if (t.dataset.f === 'cat') { t.checked ? F.cat.add(t.dataset.v) : F.cat.delete(t.dataset.v); update(); }
  if (t.id === 'inStock') { F.inStock = t.checked; update(); }
  if (t.id === 'saleOnly') { F.sale = t.checked; update(); }
  if (t.id === 'pmin' || t.id === 'pmax') {
    const v = t.value === '' ? null : Math.max(0, +t.value);
    F[t.id === 'pmin' ? 'min' : 'max'] = v;
    update();
  }
});
document.addEventListener('click', e => {
  const r = e.target.closest('[data-rm]');
  if (!r) return;
  const f = r.dataset.rm;
  if (f === 'all') resetFilters();
  else if (F[f] instanceof Set) F[f].delete(r.dataset.v);
  else if (f === 'inStock') F.inStock = false;
  else if (f === 'sale') F.sale = false;
  else if (f === 'q') { F.q = ''; $('#search').value = ''; }
  else F[f] = null;
  update();
});
function resetFilters() {
  ['aud', 'season', 'cat', 'size', 'color'].forEach(k => F[k].clear());
  F.min = F.max = null; F.inStock = false; F.sale = false; F.q = ''; $('#search').value = '';
}
$('#resetFilters').addEventListener('click', () => { resetFilters(); update(); });
$('#sort').addEventListener('change', e => { F.sort = e.target.value; renderCatalog(); });

let searchTimer;
$('#search').addEventListener('input', e => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => { F.q = e.target.value; update(); }, 200);
});
$('.search').addEventListener('submit', () => { F.q = $('#search').value; update(); $('#catalog').scrollIntoView(); });

/* Мобільні фільтри */
const openFilters = () => { $('#filters').classList.add('open'); $('#overlay').hidden = false; };
const closeFilters = () => { $('#filters').classList.remove('open'); if (!$('#cart').classList.contains('open')) $('#overlay').hidden = true; };
$('#openFilters').addEventListener('click', openFilters);
$('#closeFilters').addEventListener('click', closeFilters);
$('#applyFilters').addEventListener('click', () => { closeFilters(); $('#catalog').scrollIntoView(); });

/* ===================== КАРТКА ТОВАРУ ===================== */
const pm = { p: null, color: null, size: null, qty: 1, img: 1 };

function openProduct(id) {
  const p = byId[id];
  Object.assign(pm, { p, color: p.colors[0], size: p.sizes.length === 1 ? p.sizes[0] : null, qty: 1, img: 1 });
  renderProduct();
  $('#pmodal').showModal();
}

function renderProduct() {
  const { p } = pm;
  const s = SEASONS.find(x => x.key === p.season);
  const stockText = { in: '✔ В наявності', low: '⏳ Закінчується — лишилось кілька штук', out: '✖ Немає в наявності' }[p.stock];
  $('#pmodalBody').innerHTML = `
    <button class="icon-btn pm-close" data-close-modal aria-label="Закрити">✕</button>
    <div class="pm">
      <div class="pm-gallery">
        ${photo(p, pm.img)}
        <div class="thumbs">${[1, 2].map(n => `<button class="${pm.img === n ? 'on' : ''}" data-img="${n}" aria-label="Фото ${n}">${photo(p, n, false)}</button>`).join('')}</div>
        <p class="pm-caption">${pm.img === 1 ? `На моделі — колір «${COLORS[p.colors[0]][0]}»` : (p.colors.length > 1 ? `Усі кольори: ${p.colors.map(c => COLORS[c][0].toLowerCase()).join(', ')}` : 'Вигляд без моделі')}</p>
      </div>
      <div class="pm-info">
        <span class="card-meta">${s.emoji} ${s.name} · ${AUDIENCES[p.aud]} · ${CATEGORIES[p.cat]}</span>
        <h2>${esc(p.name)}</h2>
        <span class="rating">${ratingLine(p)} · код ${p.id}</span>
        <div class="price-line"><span class="price ${p.old ? 'red' : ''}" style="font-size:28px">${fmt(p.price)}</span>${p.old ? `<span class="old">${fmt(p.old)}</span>` : ''}</div>
        <span class="stock ${p.stock}">${stockText}</span>

        <span class="pm-label">Колір: <b style="text-transform:none;color:var(--ink)">${COLORS[pm.color][0]}</b></span>
        <div class="pm-colors">${p.colors.map(c => `<button class="swatch ${pm.color === c ? 'on' : ''}" style="background:${COLORS[c][1]}" data-color="${c}" title="${COLORS[c][0]}" aria-label="${COLORS[c][0]}"></button>`).join('')}</div>

        <span class="pm-label">Розмір ${p.aud === 'kids' && p.cat !== 'acc' ? '(зріст, см)' : ''} · <a href="#sizes" class="link-btn" data-close-modal style="text-transform:none">таблиця розмірів</a></span>
        <div class="pm-sizes" id="pmSizes">${p.sizes.map(z => { const n = avail(p, z, pm.color); return `<button class="size-btn ${pm.size === z ? 'on' : ''}" data-size="${z}" ${n === 0 ? 'disabled title="Немає в цьому кольорі"' : ''}>${z}</button>`; }).join('')}</div>
        ${pm.size && avail(p, pm.size, pm.color) <= 3 ? `<span class="stock low">Лишилось ${avail(p, pm.size, pm.color)} шт. у розмірі ${pm.size}</span>` : ''}

        <div class="pm-buy">
          <div class="qty"><button data-q="-1" aria-label="Менше">−</button><span>${pm.qty}</span><button data-q="1" aria-label="Більше">+</button></div>
          <button class="btn btn-primary" id="addToCart" ${p.stock === 'out' ? 'disabled' : ''}>${p.stock === 'out' ? 'Немає в наявності' : '🛒 Додати в кошик'}</button>
        </div>
        ${p.stock === 'out' ? '<button class="link-btn" data-bot-open>Повідомити, коли з\'явиться — через Віва-бота</button>' : ''}

        <p>${esc(p.desc)}</p>
        <dl class="specs">
          <dt>Склад</dt><dd>${esc(p.material)}</dd>
          <dt>Доступні кольори</dt><dd>${p.colors.map(c => COLORS[c][0]).join(', ')}</dd>
          <dt>Розміри</dt><dd>${p.sizes.join(', ')}</dd>
          <dt>Догляд</dt><dd>Делікатне прання при 30°, не відбілювати, прасувати при низькій температурі.</dd>
          <dt>Доставка</dt><dd>Нова Пошта 1–3 дні · безкоштовно від ${fmt(FREE_DELIVERY)}</dd>
        </dl>
      </div>
    </div>`;
}

$('#pmodal').addEventListener('click', e => {
  const t = e.target;
  if (t === $('#pmodal') || t.closest('[data-close-modal]')) { $('#pmodal').close(); return; }
  const c = t.closest('[data-color]'); if (c) {
    pm.color = c.dataset.color; pm.img = pm.color === pm.p.colors[0] ? 1 : 2;
    if (pm.size && avail(pm.p, pm.size, pm.color) === 0) pm.size = null; // цього розміру немає в новому кольорі
    renderProduct(); return;
  }
  const z = t.closest('[data-size]'); if (z) { pm.size = z.dataset.size; renderProduct(); return; }
  const im = t.closest('[data-img]'); if (im) { pm.img = +im.dataset.img; renderProduct(); return; }
  const q = t.closest('[data-q]'); if (q) { pm.qty = Math.min(10, Math.max(1, pm.qty + +q.dataset.q)); renderProduct(); return; }
  if (t.closest('#addToCart')) {
    if (!pm.size) { $('#pmSizes').classList.remove('shake'); void $('#pmSizes').offsetWidth; $('#pmSizes').classList.add('shake'); toast('Оберіть, будь ласка, розмір 📏'); return; }
    const inCart = cart.filter(i => i.id === pm.p.id && i.size === pm.size && i.color === pm.color).reduce((s, i) => s + i.qty, 0);
    const left = avail(pm.p, pm.size, pm.color) - inCart;
    if (left < pm.qty) { toast(left > 0 ? `Доступно ще лише ${left} шт. у цьому розмірі й кольорі` : 'Усі доступні штуки вже у вашому кошику'); return; }
    addToCart(pm.p.id, pm.size, pm.color, pm.qty);
    $('#pmodal').close();
  }
});

/* ===================== КОШИК ===================== */
let cart = store.get('vivaldi-cart', []).filter(i => byId[i.id]);
const saveCart = () => store.set('vivaldi-cart', cart);
const cartTotal = () => cart.reduce((s, i) => s + byId[i.id].price * i.qty, 0);
const cartCount = () => cart.reduce((s, i) => s + i.qty, 0);

function addToCart(id, size, color, qty = 1) {
  const ex = cart.find(i => i.id === id && i.size === size && i.color === color);
  ex ? ex.qty = Math.min(10, ex.qty + qty) : cart.push({ id, size, color, qty });
  saveCart(); renderCart();
  const b = $('#cartCount'); b.classList.remove('bump'); void b.offsetWidth; b.classList.add('bump');
  toast(`«${byId[id].name}» додано в кошик ✓`);
}

function renderCart() {
  $('#cartCount').textContent = cartCount();
  if (!cart.length) {
    $('#cartBody').innerHTML = '<div class="cart-empty"><span>🧺</span>Кошик поки порожній.<br>Оберіть щось затишне у каталозі!</div>';
    $('#cartFoot').innerHTML = '<button class="btn btn-ghost" data-close-cart data-scroll="#catalog">До каталогу</button>';
    return;
  }
  $('#cartBody').innerHTML = cart.map((i, idx) => {
    const p = byId[i.id];
    return `<div class="citem">
      ${photo(p, 1, false)}
      <div><h4>${esc(p.name)}</h4><small>Розмір ${i.size} · ${COLORS[i.color][0]}</small><small>${fmt(p.price)} / шт.</small></div>
      <div class="citem-right">
        <b>${fmt(p.price * i.qty)}</b>
        <div class="qty"><button data-cq="${idx}" data-d="-1" aria-label="Менше">−</button><span>${i.qty}</span><button data-cq="${idx}" data-d="1" aria-label="Більше">+</button></div>
        <button class="remove" data-crm="${idx}">видалити</button>
      </div></div>`;
  }).join('');
  const total = cartTotal();
  const left = FREE_DELIVERY - total;
  $('#cartFoot').innerHTML = `
    <small>${left > 0 ? `Додайте ще <b>${fmt(left)}</b> — і доставка буде безкоштовною 🎁` : '🎉 Доставка до відділення — безкоштовно!'}</small>
    <div class="progress"><i style="width:${Math.min(100, total / FREE_DELIVERY * 100)}%"></i></div>
    <div class="total"><span>Разом</span><span>${fmt(total)}</span></div>
    <button class="btn btn-primary" data-bot-open="order">💬 Оформити через Віва-бота</button>
    <small class="muted" style="text-align:center">Без реєстрації: бот запитає ім'я, телефон і відділення Нової Пошти</small>`;
}

$('#cart').addEventListener('click', e => {
  const q = e.target.closest('[data-cq]');
  if (q) { const i = cart[+q.dataset.cq]; i.qty += +q.dataset.d; if (i.qty < 1) cart.splice(+q.dataset.cq, 1); else i.qty = Math.min(10, i.qty); saveCart(); renderCart(); }
  const r = e.target.closest('[data-crm]');
  if (r) { cart.splice(+r.dataset.crm, 1); saveCart(); renderCart(); }
  if (e.target.closest('[data-close-cart], [data-bot-open]')) closeCart();
});
function openCart() { renderCart(); $('#cart').classList.add('open'); $('#cart').setAttribute('aria-hidden', 'false'); $('#overlay').hidden = false; }
function closeCart() { $('#cart').classList.remove('open'); $('#cart').setAttribute('aria-hidden', 'true'); if (!$('#filters').classList.contains('open')) $('#overlay').hidden = true; }
$('#openCart').addEventListener('click', openCart);
$('#closeCart').addEventListener('click', closeCart);
$('#overlay').addEventListener('click', () => { closeCart(); closeFilters(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeCart(); closeFilters(); } });

/* ===================== ЗАГАЛЬНІ ПОДІЇ ===================== */
document.addEventListener('click', e => {
  const o = e.target.closest('[data-open]');
  if (o && !e.target.closest('#pmodal')) { openProduct(o.dataset.open); return; }
  const s = e.target.closest('[data-scroll]');
  if (s) { $(s.dataset.scroll).scrollIntoView(); }
  const f = e.target.closest('[data-fake]');
  if (f) { e.preventDefault(); toast(`«${f.dataset.fake}» — сторінка ще в розробці 🎻`); }
});
document.addEventListener('keydown', e => {
  if (e.key === 'Enter' && e.target.matches('.card[data-open]')) openProduct(e.target.dataset.open);
});

/* ===================== ЗМІНА КОЛЬОРУ ПО СЕЗОНАХ ===================== */
const THEME_COLOR = { base: '#8a3b45', spring: '#7cb342', summer: '#179a45', autumn: '#e8741a', winter: '#2a64c5' };
function setTheme(zone) {
  if (document.documentElement.dataset.season === zone) return;
  document.documentElement.dataset.season = zone;
  $('meta[name="theme-color"]').content = THEME_COLOR[zone];
}
let currentZone = null;
function checkZone() {
  const y = innerHeight * 0.45;
  const zone = $$('.zone').find(z => { if (z.hidden) return false; const r = z.getBoundingClientRect(); return r.top <= y && r.bottom > y; });
  if (!zone || zone === currentZone) return;
  currentZone = zone;
  setTheme(zone.dataset.zone);
  $$('.seasonnav a').forEach(a => a.classList.toggle('active', a.dataset.nav === zone.id));
  const active = $('.seasonnav a.active');
  if (active) active.parentElement.scrollTo({ left: active.offsetLeft - 40, behavior: 'smooth' });
}
function watchZones() {
  addEventListener('scroll', checkZone, { passive: true });
  addEventListener('resize', checkZone);
  checkZone();
}

/* Висота шапки для sticky-фільтрів і якорів */
function syncHeader() { document.documentElement.style.setProperty('--header-h', $('.header').offsetHeight + 'px'); }
window.addEventListener('resize', syncHeader);

/* Меню розділів: прокрутка колесиком миші та затухання по краях */
(() => {
  const row = $('.seasonnav-inner');
  const edges = () => {
    const max = row.scrollWidth - row.clientWidth;
    row.classList.toggle('more-left', row.scrollLeft > 2);
    row.classList.toggle('more-right', row.scrollLeft < max - 2);
  };
  row.addEventListener('wheel', e => {
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;       // тачпад і так гортає вбік
    const max = row.scrollWidth - row.clientWidth;
    if (max <= 0) return;                                       // усе вміщається — гортати нічого
    if ((e.deltaY < 0 && row.scrollLeft <= 0) || (e.deltaY > 0 && row.scrollLeft >= max - 1)) return; // край — гортаємо сторінку
    e.preventDefault();
    row.scrollLeft += e.deltaY * (e.deltaMode === 1 ? 32 : 1);  // deltaMode 1 — рядки (Firefox)
  }, { passive: false });
  row.addEventListener('scroll', edges, { passive: true });
  addEventListener('resize', edges);
  edges();
})();

/* Кнопка «нагору» */
window.addEventListener('scroll', () => $('#toTop').classList.toggle('show', scrollY > 900), { passive: true });
$('#toTop').addEventListener('click', () => scrollTo({ top: 0 }));

/* ===================== ЖИВИЙ КАТАЛОГ ІЗ БАЗИ (Supabase) ===================== */
// Скільки штук доступно в розмірі й кольорі. Без даних із бази — оцінка за статусом товару.
function avail(p, size, color) {
  if (!p.stockMap) return p.stock === 'out' ? 0 : 99;
  return p.stockMap[size + '|' + color] ?? 0;
}

async function loadLiveCatalog() {
  const cfg = window.VIV_CONFIG; if (!cfg) return;
  try {
    const r = await fetch(`${cfg.supabaseUrl}/rest/v1/catalog?select=*&order=sort`, {
      headers: { apikey: cfg.supabaseKey, Authorization: 'Bearer ' + cfg.supabaseKey },
    });
    if (!r.ok) throw new Error('HTTP ' + r.status);
    const rows = await r.json();
    if (!rows.length) return; // база ще порожня — лишаємо вбудований каталог
    const live = rows.map(x => ({
      id: x.id, season: x.season, aud: x.aud, cat: x.cat, emoji: x.emoji, name: x.name, price: x.price,
      old: x.old_price || undefined, sizes: x.sizes, colors: x.colors, material: x.material, desc: x.description,
      rating: Number(x.rating), reviews: x.reviews, stockMap: x.stock_map, img1: x.image1, img2: x.image2,
      stock: x.stock_total === 0 ? 'out' : x.stock_total <= 5 ? 'low' : 'in',
    }));
    PRODUCTS.splice(0, PRODUCTS.length, ...live);
    Object.keys(byId).forEach(k => delete byId[k]);
    live.forEach(p => { byId[p.id] = p; });
    cart = cart.filter(i => byId[i.id]); saveCart();
    renderPromo(); update(false); renderCart();
    if ($('#pmodal').open && byId[pm.p?.id]) { pm.p = byId[pm.p.id]; renderProduct(); }
  } catch (e) {
    console.warn('Каталог із бази недоступний — показуємо вбудований', e);
  }
}

/* ===================== РЕКЛАМНИЙ БАНЕР ===================== */
function renderPromo() {
  const sale = PRODUCTS.filter(p => p.old && p.stock !== 'out').sort((a, b) => discount(b) - discount(a));
  if (!sale.length) { $('#sale').hidden = true; $('[data-nav="sale"]').hidden = true; return; }
  const n = sale.length;
  const word = (n % 10 === 1 && n % 100 !== 11) ? 'модель' : (n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20)) ? 'моделі' : 'моделей';
  $('#promoMax').textContent = `−${discount(sale[0])}%`;
  $('#promoLead').textContent = `${n} ${word} для жінок, чоловіків і дітей за зниженими цінами — поки є ваші розміри.`;
  $('#promoItems').innerHTML = sale.slice(0, 3).map(p => `
    <button class="promo-item" data-open="${p.id}" aria-label="${esc(p.name)}, знижка ${discount(p)}%">
      <span class="tag sale">−${discount(p)}%</span>
      ${photo(p)}
      <span class="promo-name">${esc(p.name)}</span>
      <span class="promo-price"><b>${fmt(p.price)}</b> <s>${fmt(p.old)}</s></span>
    </button>`).join('');
}
$('#showSale').addEventListener('click', () => {
  resetFilters(); F.sale = true; F.sort = 'sale'; $('#sort').value = 'sale';
  update(false);
  scrollTo({ top: scrollY + $('.catalog-main').getBoundingClientRect().top - $('.header').offsetHeight - 12 });
});

/* ===================== СТАРТ ===================== */
buildSeasons();
renderPromo();
update(false);
renderCart();
watchZones();
syncHeader();
loadLiveCatalog();
