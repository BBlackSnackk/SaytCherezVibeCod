/* ===================== Віва-бот — чат для оформлення замовлень ===================== */
const Bot = (() => {
  const log = $('#botLog'), quick = $('#botQuick'), input = $('#botInput');
  let started = false;
  let st = { mode: null, step: null, data: {} };
  const MENU = ['🛒 Оформити замовлення', '📏 Підібрати розмір', '🚚 Доставка й оплата', '↩️ Повернення', '👩‍💼 Зв\'язатися з людиною'];

  function add(cls, html) {
    const m = document.createElement('div');
    m.className = 'msg ' + cls;
    m.innerHTML = html;
    log.appendChild(m);
    log.scrollTop = log.scrollHeight;
  }
  function setQuick(opts) {
    quick.innerHTML = opts.map(o => `<button type="button">${esc(o)}</button>`).join('');
  }
  let queue = Promise.resolve();
  function say(html, opts = []) {
    queue = queue.then(() => new Promise(res => {
      setQuick([]);
      const t = document.createElement('div');
      t.className = 'msg bot-m typing';
      t.innerHTML = '<i></i><i></i><i></i>';
      log.appendChild(t); log.scrollTop = log.scrollHeight;
      setTimeout(() => { t.remove(); add('bot-m', html); setQuick(opts); res(); }, 450 + Math.min(700, html.length * 4));
    }));
  }
  function hear(text) {
    text = text.trim();
    if (!text) return;
    add('me', esc(text));
    route(text);
  }

  /* ---------- Маршрутизація ---------- */
  function route(t) {
    const l = t.toLowerCase();
    if (/скасув|отмен|стоп|меню/.test(l) && st.mode) { st = { mode: null, step: null, data: {} }; return say('Добре, скасовано. Чим ще допомогти?', MENU); }
    if (st.mode === 'order') return orderStep(t);
    if (st.mode === 'size') return sizeStep(t);
    if (/замов|оформ|купи|заказ|кошик|корзин/.test(l)) return startOrder();
    if (/розмір|размер|size|підібр|подобр/.test(l)) return startSize();
    if (/достав|пошт|відправ|отправ|кур/.test(l)) return delivery();
    if (/оплат|карт|налож|наклад/.test(l)) return payment();
    if (/поверн|возвр|обмін|обмен/.test(l)) return returns();
    if (/люд|менедж|оператор|подзвон|позвон|телефон|номер|зв.яз/.test(l)) return human();
    if (/знижк|скидк|акці|акци|sale/.test(l)) return sales();
    if (/дяку|спасиб|thanks/.test(l)) return say('Завжди радий допомогти! 🎻 Гарного дня і затишних покупок.', MENU);
    if (/прив|добр|здрав|hello|hi\b|вітаю/.test(l)) return greet();
    const found = PRODUCTS.filter(p => p.name.toLowerCase().includes(l) || l.split(/\s+/).some(w => w.length > 3 && p.name.toLowerCase().includes(w)));
    if (found.length) {
      return say(`Ось що я знайшов:<ul>${found.slice(0, 4).map(p => `<li><a href="#" data-open="${p.id}">${esc(p.name)}</a> — ${fmt(p.price)}</li>`).join('')}</ul>Натисніть на назву, щоб відкрити товар.`, MENU);
    }
    say('Хм, я поки вчуся розуміти людей 🙈 Оберіть, будь ласка, одну з тем нижче:', MENU);
  }

  function greet() {
    say('Привіт! Я <b>Віва-бот</b> 🎻 — помічник магазину «Вівальді».');
    say('Можу оформити замовлення без реєстрації, підібрати розмір або розповісти про доставку. Що вас цікавить?', MENU);
  }
  const delivery = () => say('🚚 <b>Доставка</b><ul><li>Нова Пошта (відділення/поштомат) — 1–3 дні</li><li>Кур\'єр НП — 1–2 дні</li><li>Укрпошта — 3–5 днів</li></ul>Від <b>1500 ₴</b> доставка до відділення безкоштовна 🎁', MENU);
  const payment = () => say('💳 <b>Оплата</b>: накладений платіж при отриманні або переказ на картку після того, як менеджер підтвердить замовлення.', MENU);
  const returns = () => say('↩️ Обмін і повернення — <b>14 днів</b> з моменту отримання. Збережіть бирки, напишіть нам, і ми надішлемо адресу. Гроші повернемо за 3 робочі дні.', MENU);
  const human = () => say('👩‍💼 Наші менеджери на зв\'язку щодня з 9:00 до 21:00.<br>📞 <a href="tel:0800167844"><b>0 800 167 844</b></a> — безкоштовно по Україні.<br>Або залиште номер в оформленні замовлення — ми передзвонимо.', MENU);
  const sales = () => {
    const s = PRODUCTS.filter(p => p.old);
    say(`🔥 Зараз зі знижкою:<ul>${s.map(p => `<li><a href="#" data-open="${p.id}">${esc(p.name)}</a> — <b>${fmt(p.price)}</b> <s>${fmt(p.old)}</s></li>`).join('')}</ul>`, MENU);
  };

  /* ---------- Підбір розміру ---------- */
  function startSize() {
    st = { mode: 'size', step: 'who', data: {} };
    say('Давайте підберемо розмір 📏 Для кого шукаємо одяг?', ['👩 Жінці', '👨 Чоловікові', '🧒 Дитині']);
  }
  function sizeStep(t) {
    const l = t.toLowerCase();
    if (st.step === 'who') {
      if (/жін|жен/.test(l)) st.data.who = 'women';
      else if (/чол|муж/.test(l)) st.data.who = 'men';
      else if (/дит|реб|діт|дет/.test(l)) st.data.who = 'kids';
      else return say('Оберіть, будь ласка, варіант кнопкою 🙂', ['👩 Жінці', '👨 Чоловікові', '🧒 Дитині']);
      st.step = 'num';
      return say(st.data.who === 'kids' ? 'Який зріст дитини в сантиметрах? (наприклад, 116)' : 'Який обхват грудей у сантиметрах? (наприклад, 92)');
    }
    const n = parseInt(t.replace(/\D/g, ''), 10);
    if (!n || n < 50 || n > 190) return say('Напишіть, будь ласка, число в сантиметрах 🙂');
    let size;
    if (st.data.who === 'kids') {
      const k = ['98', '104', '110', '116', '122', '128', '134', '140', '146', '152'];
      size = k.find(s => +s >= n) || '152';
    } else if (st.data.who === 'women') {
      size = n < 82 ? 'XS' : n < 88 ? 'S' : n < 94 ? 'M' : n < 100 ? 'L' : 'XL';
    } else {
      size = n < 92 ? 'S' : n < 99 ? 'M' : n < 105 ? 'L' : n < 111 ? 'XL' : 'XXL';
    }
    st = { mode: null, step: null, data: {} };
    say(`Ваш розмір — <b>${size}</b> ✨<br>Якщо ви між розмірами або любите вільну посадку, беріть на один більший.`, MENU);
  }

  /* ---------- Оформлення замовлення ---------- */
  const DELIV = ['📦 Нова Пошта — відділення', '🏧 Нова Пошта — поштомат', '🛵 Кур\'єр Нової Пошти', '✉️ Укрпошта'];
  const PAY = ['💵 Накладений платіж', '💳 Переказ на картку'];

  function startOrder() {
    if (!cart.length) {
      return say('Ваш кошик поки порожній 🧺 Відкрийте будь-який товар, оберіть розмір і натисніть «Додати в кошик», а потім повертайтеся до мене!', ['🔥 Що зі знижкою?', '📏 Підібрати розмір']);
    }
    st = { mode: 'order', step: 'name', data: {} };
    const list = cart.map(i => `<li>${esc(byId[i.id].name)} (${i.size}, ${COLORS[i.color][0]}) × ${i.qty}</li>`).join('');
    say(`Чудово, оформлюємо! У кошику:<ul>${list}</ul>Разом: <b>${fmt(cartTotal())}</b><br><small>ℹ️ Це демонстраційний магазин: ваші дані залишаються лише у вашому браузері й нікуди не надсилаються.</small>`);
    say('Як до вас звертатися? Напишіть ім\'я та прізвище.', ['Скасувати']);
  }

  function orderStep(t) {
    const d = st.data;
    switch (st.step) {
      case 'name':
        if (t.length < 2 || /\d/.test(t)) return say('Напишіть, будь ласка, справжнє ім\'я 🙂');
        d.name = t; st.step = 'phone';
        return say(`Приємно познайомитись, ${esc(t.split(' ')[0])}! Ваш номер телефону? Наприклад: 067 123 45 67`, ['Скасувати']);
      case 'phone': {
        let digits = t.replace(/\D/g, '');
        if (digits.length === 10 && digits[0] === '0') digits = '38' + digits;
        if (!/^380\d{9}$/.test(digits)) return say('Схоже, номер неповний 🤔 Потрібен український номер, наприклад <b>067 123 45 67</b> або <b>+380 67 123 45 67</b>.');
        d.phone = '+' + digits.replace(/^(\d{3})(\d{2})(\d{3})(\d{2})(\d{2})$/, '$1 $2 $3 $4 $5');
        st.step = 'city';
        return say('Дякую! В яке місто доставити?', ['Київ', 'Львів', 'Одеса', 'Харків', 'Дніпро']);
      }
      case 'city':
        if (t.length < 2) return say('Напишіть назву міста 🙂');
        d.city = t; st.step = 'delivery';
        return say('Як доставити?', DELIV);
      case 'delivery': {
        const opt = DELIV.find(o => o === t) || DELIV.find(o => o.toLowerCase().includes(t.toLowerCase().slice(0, 5)));
        if (!opt) return say('Оберіть спосіб доставки кнопкою 👇', DELIV);
        d.delivery = opt; st.step = 'address';
        const q = opt.includes('відділення') ? 'Номер відділення Нової Пошти?' : opt.includes('поштомат') ? 'Номер поштомата?' : opt.includes('Кур') ? 'Адреса доставки (вулиця, будинок, квартира)?' : 'Поштовий індекс відділення Укрпошти?';
        return say(q);
      }
      case 'address':
        if (t.length < 1) return say('Уточніть, будь ласка 🙂');
        d.address = d.delivery.includes('відділення') ? 'відділення № ' + t.replace(/^№\s*/, '')
          : d.delivery.includes('поштомат') ? 'поштомат № ' + t.replace(/^№\s*/, '')
          : d.delivery.includes('Укрпошта') ? 'індекс ' + t : t;
        st.step = 'pay';
        return say('Як зручніше оплатити?', PAY);
      case 'pay': {
        const opt = PAY.find(o => o === t) || (/налож|наклад|отрим/.test(t.toLowerCase()) ? PAY[0] : /карт/.test(t.toLowerCase()) ? PAY[1] : null);
        if (!opt) return say('Оберіть спосіб оплати кнопкою 👇', PAY);
        d.pay = opt; st.step = 'confirm';
        const total = cartTotal();
        const free = total >= FREE_DELIVERY && !d.delivery.includes('Кур');
        return say(`Перевірте, будь ласка:<ul>
          <li>👤 ${esc(d.name)}</li><li>📞 ${d.phone}</li>
          <li>📍 ${esc(d.city)}, ${esc(d.address)}</li><li>${d.delivery}</li><li>${d.pay}</li>
          <li>🛒 ${cartCount()} шт. на <b>${fmt(total)}</b></li>
          <li>🚚 Доставка: ${free ? '<b>безкоштовно</b> 🎁' : 'за тарифами перевізника'}</li></ul>Усе правильно?`,
          ['✅ Підтвердити', '✏️ Змінити дані', 'Скасувати']);
      }
      case 'confirm':
        if (/змін|измен/.test(t.toLowerCase())) return startOrder();
        if (!/підтв|так|да|ok|ок|✅/.test(t.toLowerCase())) return say('Підтвердити замовлення?', ['✅ Підтвердити', '✏️ Змінити дані', 'Скасувати']);
        return finish();
    }
  }

  function finish() {
    const num = 'VIV-' + Math.floor(10000 + Math.random() * 89999);
    const order = { num, ...st.data, items: cart, total: cartTotal(), date: new Date().toISOString() };
    const orders = store.get('vivaldi-orders', []);
    orders.push(order); store.set('vivaldi-orders', orders);
    cart = []; saveCart(); renderCart();
    st = { mode: null, step: null, data: {} };
    say(`🎉 Замовлення <b>${num}</b> оформлено!<br>У справжньому магазині менеджер зателефонував би на ${order.phone}, щоб підтвердити деталі.<br><small>ℹ️ Це демонстраційний магазин: замовлення нікуди не надсилається, оплата й доставка не відбудуться.</small>`);
    say('Дякуємо, що обрали «Вівальді»! Нехай кожен сезон буде затишним 🎻', ['📏 Підібрати розмір', '🚚 Доставка й оплата']);
  }

  /* ---------- Відкриття / закриття ---------- */
  function open(intent) {
    const m = $('#pmodal'); if (m.open) m.close();
    $('#bot').hidden = false;
    $('#botFab').hidden = true;
    $('#botHint').classList.remove('show');
    if (!started) { started = true; if (!intent) greet(); }
    if (intent === 'order') { if (started && log.children.length === 0) say('Привіт! Я <b>Віва-бот</b> 🎻'); startOrder(); }
    if (intent === 'size') { if (log.children.length === 0) say('Привіт! Я <b>Віва-бот</b> 🎻'); startSize(); }
    setTimeout(() => input.focus(), 50);
  }
  function close() { $('#bot').hidden = true; $('#botFab').hidden = false; }

  $('#botFab').addEventListener('click', () => open());
  $('#botClose').addEventListener('click', close);
  $('#botForm').addEventListener('submit', e => { e.preventDefault(); hear(input.value); input.value = ''; });
  quick.addEventListener('click', e => {
    const b = e.target.closest('button');
    if (!b) return;
    const txt = b.textContent;
    if (txt === '🔥 Що зі знижкою?') { add('me', esc(txt)); return sales(); }
    hear(txt);
  });
  log.addEventListener('click', e => {
    const a = e.target.closest('[data-open]');
    if (a) { e.preventDefault(); }
  });
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-bot-open]');
    if (b) { e.preventDefault(); open(b.dataset.botOpen || undefined); }
  });

  setTimeout(() => { if (!started) $('#botHint').classList.add('show'); }, 4000);
  setTimeout(() => $('#botHint').classList.remove('show'), 12000);

  return { open, close };
})();
