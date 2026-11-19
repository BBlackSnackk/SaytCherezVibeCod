/* ===================== Віва-бот — чат для оформлення замовлень ===================== */

/* Тексти бота: [українська, російська, англійська] */
Object.assign(DICT, {
  'b.m.order': ['🛒 Оформити замовлення', '🛒 Оформить заказ', '🛒 Place an order'],
  'b.m.size': ['📏 Підібрати розмір', '📏 Подобрать размер', '📏 Find my size'],
  'b.m.delivery': ['🚚 Доставка й оплата', '🚚 Доставка и оплата', '🚚 Delivery & payment'],
  'b.m.returns': ['↩️ Повернення', '↩️ Возврат', '↩️ Returns'],
  'b.m.human': ['👩‍💼 Зв\'язатися з людиною', '👩‍💼 Связаться с человеком', '👩‍💼 Talk to a person'],
  'b.q.sale': ['🔥 Що зі знижкою?', '🔥 Что со скидкой?', '🔥 What’s on sale?'],
  'b.cancel': ['Скасувати', 'Отменить', 'Cancel'],
  'b.cancelled': ['Добре, скасовано. Чим ще допомогти?', 'Хорошо, отменено. Чем ещё помочь?', 'OK, cancelled. What else can I help with?'],
  'b.thanks': ['Завжди радий допомогти! 🎻 Гарного дня і затишних покупок.', 'Всегда рад помочь! 🎻 Хорошего дня и уютных покупок.', 'Always happy to help! 🎻 Have a lovely day and cosy shopping.'],
  'b.found': ['Ось що я знайшов:<ul>{list}</ul>Натисніть на назву, щоб відкрити товар.', 'Вот что я нашёл:<ul>{list}</ul>Нажмите на название, чтобы открыть товар.', 'Here’s what I found:<ul>{list}</ul>Tap a name to open the product.'],
  'b.unknown': ['Хм, я поки вчуся розуміти людей 🙈 Оберіть, будь ласка, одну з тем нижче:', 'Хм, я пока учусь понимать людей 🙈 Выберите, пожалуйста, одну из тем ниже:', 'Hmm, I’m still learning to understand people 🙈 Please pick one of the topics below:'],
  'b.hello': ['Привіт! Я <b>Віва-бот</b> 🎻', 'Привет! Я <b>Вива-бот</b> 🎻', 'Hi! I’m <b>Viva-bot</b> 🎻'],
  'b.greet1': ['Привіт! Я <b>Віва-бот</b> 🎻 — помічник магазину «Вівальді».', 'Привет! Я <b>Вива-бот</b> 🎻 — помощник магазина «Вивальди».', 'Hi! I’m <b>Viva-bot</b> 🎻, the Vivaldi store assistant.'],
  'b.greet2': ['Можу оформити замовлення без реєстрації, підібрати розмір або розповісти про доставку. Що вас цікавить?', 'Могу оформить заказ без регистрации, подобрать размер или рассказать о доставке. Что вас интересует?', 'I can place an order for you without sign-up, help you find your size or tell you about delivery. What would you like?'],
  'b.delivery': ['🚚 <b>Доставка</b><ul><li>Нова Пошта (відділення/поштомат) — 1–3 дні</li><li>Кур\'єр НП — 1–2 дні</li><li>Укрпошта — 3–5 днів</li></ul>Від <b>{free}</b> доставка до відділення безкоштовна 🎁',
    '🚚 <b>Доставка</b><ul><li>Нова Пошта (отделение/почтомат) — 1–3 дня</li><li>Курьер НП — 1–2 дня</li><li>Укрпочта — 3–5 дней</li></ul>От <b>{free}</b> доставка в отделение бесплатная 🎁',
    '🚚 <b>Delivery</b><ul><li>Nova Poshta (branch/parcel locker): 1–3 days</li><li>Nova Poshta courier: 1–2 days</li><li>Ukrposhta: 3–5 days</li></ul>Delivery to a branch is free from <b>{free}</b> 🎁'],
  'b.payment': ['💳 <b>Оплата</b>: накладений платіж при отриманні або переказ на картку після того, як менеджер підтвердить замовлення.', '💳 <b>Оплата</b>: наложенный платёж при получении или перевод на карту после того, как менеджер подтвердит заказ.', '💳 <b>Payment</b>: cash on delivery, or a card transfer once a manager has confirmed your order.'],
  'b.returns': ['↩️ Обмін і повернення — <b>14 днів</b> з моменту отримання. Збережіть бирки, напишіть нам, і ми надішлемо адресу. Гроші повернемо за 3 робочі дні.', '↩️ Обмен и возврат — <b>14 дней</b> с момента получения. Сохраните бирки, напишите нам, и мы пришлём адрес. Деньги вернём за 3 рабочих дня.', '↩️ You can exchange or return items within <b>14 days</b> of receiving them. Keep the tags on, message us and we’ll send you the address. Refunds take 3 working days.'],
  'b.human': ['👩‍💼 Наші менеджери на зв\'язку щодня з 9:00 до 21:00.<br>📞 <a href="tel:0800167844"><b>0 800 167 844</b></a> — безкоштовно по Україні.<br>Або залиште номер в оформленні замовлення — ми передзвонимо.', '👩‍💼 Наши менеджеры на связи ежедневно с 9:00 до 21:00.<br>📞 <a href="tel:0800167844"><b>0 800 167 844</b></a> — бесплатно по Украине.<br>Или оставьте номер при оформлении заказа — мы перезвоним.', '👩‍💼 Our managers are available daily from 9:00 to 21:00.<br>📞 <a href="tel:0800167844"><b>0 800 167 844</b></a>, free within Ukraine.<br>Or leave your number when placing an order and we’ll call you back.'],
  'b.sales': ['🔥 Зараз зі знижкою:<ul>{list}</ul>', '🔥 Сейчас со скидкой:<ul>{list}</ul>', '🔥 On sale now:<ul>{list}</ul>'],

  // підбір розміру
  'b.who.w': ['👩 Жінці', '👩 Женщине', '👩 For a woman'],
  'b.who.m': ['👨 Чоловікові', '👨 Мужчине', '👨 For a man'],
  'b.who.k': ['🧒 Дитині', '🧒 Ребёнку', '🧒 For a child'],
  'b.size.start': ['Давайте підберемо розмір 📏 Для кого шукаємо одяг?', 'Давайте подберём размер 📏 Для кого ищем одежду?', 'Let’s find your size 📏 Who are we shopping for?'],
  'b.size.pick': ['Оберіть, будь ласка, варіант кнопкою 🙂', 'Выберите, пожалуйста, вариант кнопкой 🙂', 'Please pick an option with a button 🙂'],
  'b.size.kids': ['Який зріст дитини в сантиметрах? (наприклад, 116)', 'Какой рост ребёнка в сантиметрах? (например, 116)', 'What is the child’s height in centimetres? (e.g. 116)'],
  'b.size.chest': ['Який обхват грудей у сантиметрах? (наприклад, 92)', 'Какой обхват груди в сантиметрах? (например, 92)', 'What is the chest measurement in centimetres? (e.g. 92)'],
  'b.size.num': ['Напишіть, будь ласка, число в сантиметрах 🙂', 'Напишите, пожалуйста, число в сантиметрах 🙂', 'Please type a number in centimetres 🙂'],
  'b.size.result': ['Ваш розмір — <b>{s}</b> ✨<br>Якщо ви між розмірами або любите вільну посадку, беріть на один більший.', 'Ваш размер — <b>{s}</b> ✨<br>Если вы между размерами или любите свободную посадку, берите на один больше.', 'Your size is <b>{s}</b> ✨<br>If you’re between sizes or like a looser fit, go one size up.'],

  // оформлення замовлення
  'b.d.branch': ['📦 Нова Пошта — відділення', '📦 Нова Пошта — отделение', '📦 Nova Poshta — branch'],
  'b.d.locker': ['🏧 Нова Пошта — поштомат', '🏧 Нова Пошта — почтомат', '🏧 Nova Poshta — parcel locker'],
  'b.d.courier': ['🛵 Кур\'єр Нової Пошти', '🛵 Курьер Новой Почты', '🛵 Nova Poshta courier'],
  'b.d.up': ['✉️ Укрпошта', '✉️ Укрпочта', '✉️ Ukrposhta'],
  'b.p.cod': ['💵 Накладений платіж', '💵 Наложенный платёж', '💵 Cash on delivery'],
  'b.p.card': ['💳 Переказ на картку', '💳 Перевод на карту', '💳 Card transfer'],
  'b.empty': ['Ваш кошик поки порожній 🧺 Відкрийте будь-який товар, оберіть розмір і натисніть «Додати в кошик», а потім повертайтеся до мене!', 'Ваша корзина пока пуста 🧺 Откройте любой товар, выберите размер и нажмите «Добавить в корзину», а потом возвращайтесь ко мне!', 'Your cart is empty 🧺 Open any product, choose a size and tap “Add to cart”, then come back to me!'],
  'b.o.start': ['Чудово, оформлюємо! У кошику:<ul>{list}</ul>Разом: <b>{total}</b><br><small>ℹ️ Навчальний проєкт: ім\'я й телефон потраплять у CRM магазину, але оплати й доставки не буде. Не вказуйте справжніх даних, якщо не хочете.</small>',
    'Отлично, оформляем! В корзине:<ul>{list}</ul>Итого: <b>{total}</b><br><small>ℹ️ Учебный проект: имя и телефон попадут в CRM магазина, но оплаты и доставки не будет. Не указывайте настоящие данные, если не хотите.</small>',
    'Great, let’s check out! In your cart:<ul>{list}</ul>Total: <b>{total}</b><br><small>ℹ️ This is a study project: your name and phone will reach the store’s CRM, but there is no real payment or delivery. Feel free to use made-up details.</small>'],
  'b.o.line': ['{name} ({s}, {c}) × {q}', '{name} ({s}, {c}) × {q}', '{name} ({s}, {c}) × {q}'],
  'b.o.name': ['Як до вас звертатися? Напишіть ім\'я та прізвище.', 'Как к вам обращаться? Напишите имя и фамилию.', 'What’s your name? Please type your first and last name.'],
  'b.o.nameBad': ['Напишіть, будь ласка, справжнє ім\'я 🙂', 'Напишите, пожалуйста, настоящее имя 🙂', 'Please type a real name 🙂'],
  'b.o.phone': ['Приємно познайомитись, {n}! Ваш номер телефону? Наприклад: 067 123 45 67', 'Приятно познакомиться, {n}! Ваш номер телефона? Например: 067 123 45 67', 'Nice to meet you, {n}! What’s your phone number? For example: 067 123 45 67'],
  'b.o.phoneBad': ['Схоже, номер неповний 🤔 Потрібен український номер, наприклад <b>067 123 45 67</b> або <b>+380 67 123 45 67</b>.', 'Похоже, номер неполный 🤔 Нужен украинский номер, например <b>067 123 45 67</b> или <b>+380 67 123 45 67</b>.', 'That number looks incomplete 🤔 We need a Ukrainian number, e.g. <b>067 123 45 67</b> or <b>+380 67 123 45 67</b>.'],
  'b.o.city': ['Дякую! В яке місто доставити?', 'Спасибо! В какой город доставить?', 'Thanks! Which city should we deliver to?'],
  'b.o.cities': ['Київ|Львів|Одеса|Харків|Дніпро', 'Киев|Львов|Одесса|Харьков|Днепр', 'Kyiv|Lviv|Odesa|Kharkiv|Dnipro'],
  'b.o.cityBad': ['Напишіть назву міста 🙂', 'Напишите название города 🙂', 'Please type the city name 🙂'],
  'b.o.how': ['Як доставити?', 'Как доставить?', 'How should we deliver?'],
  'b.o.howBad': ['Оберіть спосіб доставки кнопкою 👇', 'Выберите способ доставки кнопкой 👇', 'Please choose a delivery option below 👇'],
  'b.o.q.branch': ['Номер відділення Нової Пошти?', 'Номер отделения Новой Почты?', 'Nova Poshta branch number?'],
  'b.o.q.locker': ['Номер поштомата?', 'Номер почтомата?', 'Parcel locker number?'],
  'b.o.q.courier': ['Адреса доставки (вулиця, будинок, квартира)?', 'Адрес доставки (улица, дом, квартира)?', 'Delivery address (street, building, flat)?'],
  'b.o.q.up': ['Поштовий індекс відділення Укрпошти?', 'Почтовый индекс отделения Укрпочты?', 'Postcode of the Ukrposhta branch?'],
  'b.o.addrBad': ['Уточніть, будь ласка 🙂', 'Уточните, пожалуйста 🙂', 'Could you clarify, please? 🙂'],
  'b.a.branch': ['відділення № {x}', 'отделение № {x}', 'branch No. {x}'],
  'b.a.locker': ['поштомат № {x}', 'почтомат № {x}', 'parcel locker No. {x}'],
  'b.a.up': ['індекс {x}', 'индекс {x}', 'postcode {x}'],
  'b.o.pay': ['Як зручніше оплатити?', 'Как удобнее оплатить?', 'How would you like to pay?'],
  'b.o.payBad': ['Оберіть спосіб оплати кнопкою 👇', 'Выберите способ оплаты кнопкой 👇', 'Please choose a payment option below 👇'],
  'b.o.check': ['Перевірте, будь ласка:', 'Проверьте, пожалуйста:', 'Please check your details:'],
  'b.o.items': ['🛒 {n} шт. на <b>{total}</b>', '🛒 {n} шт. на <b>{total}</b>', '🛒 {n} pcs, <b>{total}</b>'],
  'b.o.free': ['🚚 Доставка: <b>безкоштовно</b> 🎁', '🚚 Доставка: <b>бесплатно</b> 🎁', '🚚 Delivery: <b>free</b> 🎁'],
  'b.o.paid': ['🚚 Доставка: за тарифами перевізника', '🚚 Доставка: по тарифам перевозчика', '🚚 Delivery: at the carrier’s rates'],
  'b.o.right': ['Усе правильно?', 'Всё правильно?', 'Is everything correct?'],
  'b.o.confirm?': ['Підтвердити замовлення?', 'Подтвердить заказ?', 'Confirm your order?'],
  'b.o.ok': ['✅ Підтвердити', '✅ Подтвердить', '✅ Confirm'],
  'b.o.edit': ['✏️ Змінити дані', '✏️ Изменить данные', '✏️ Edit details'],
  'b.o.unavailable': ['😔 Зараз не вдається оформити замовлення. Спробуйте пізніше або зателефонуйте нам.', '😔 Сейчас не удаётся оформить заказ. Попробуйте позже или позвоните нам.', '😔 We can’t place orders right now. Please try again later or give us a call.'],
  'b.o.sending': ['⏳ Оформлюю замовлення…', '⏳ Оформляю заказ…', '⏳ Placing your order…'],
  'b.o.fail': ['😔 Не вдалося оформити замовлення: {why}.<br>Кошик збережено — можна змінити розмір чи колір і спробувати ще раз.', '😔 Не удалось оформить заказ: {why}.<br>Корзина сохранена — можно изменить размер или цвет и попробовать ещё раз.', '😔 We couldn’t place your order: {why}.<br>Your cart is saved, so you can change the size or colour and try again.'],
  'b.e.offline': ['немає зв\'язку з сервером', 'нет связи с сервером', 'no connection to the server'],
  'b.e.soldOut': ['одна з речей у цьому розмірі й кольорі вже закінчилась', 'одна из вещей в этом размере и цвете уже закончилась', 'one of the items is now sold out in that size and colour'],
  'b.e.spam': ['забагато замовлень з цього номера, спробуйте пізніше', 'слишком много заказов с этого номера, попробуйте позже', 'too many orders from this number, please try again later'],
  'b.e.gone': ['один із товарів більше не продається', 'один из товаров больше не продаётся', 'one of the products is no longer available'],
  'b.e.generic': ['помилка сервера', 'ошибка сервера', 'server error'],
  'b.o.done': ['🎉 Замовлення <b>{num}</b> на <b>{total}</b> прийнято!<br>Менеджер зателефонує на {phone}, щоб підтвердити деталі.<br><small>ℹ️ Навчальний проєкт: замовлення потрапляє в CRM магазину, але оплати й доставки не буде.</small>',
    '🎉 Заказ <b>{num}</b> на <b>{total}</b> принят!<br>Менеджер позвонит на {phone}, чтобы подтвердить детали.<br><small>ℹ️ Учебный проект: заказ попадает в CRM магазина, но оплаты и доставки не будет.</small>',
    '🎉 Order <b>{num}</b> for <b>{total}</b> received!<br>A manager will call {phone} to confirm the details.<br><small>ℹ️ This is a study project: the order reaches the store’s CRM, but there is no real payment or delivery.</small>'],
  'b.o.bye': ['Дякуємо, що обрали «Вівальді»! Нехай кожен сезон буде затишним 🎻', 'Спасибо, что выбрали «Вивальди»! Пусть каждый сезон будет уютным 🎻', 'Thank you for choosing Vivaldi! May every season be cosy 🎻'],
});

const Bot = (() => {
  const log = $('#botLog'), quick = $('#botQuick'), input = $('#botInput');
  let started = false;
  let st = { mode: null, step: null, data: {} };
  const MENU = () => [t('b.m.order'), t('b.m.size'), t('b.m.delivery'), t('b.m.returns'), t('b.m.human')];

  // Способи доставки й оплати: на сервер і в CRM завжди йде українська назва, покупцю показуємо його мовою
  const DELIV = ['branch', 'locker', 'courier', 'up'];
  const DELIV_UK = { branch: '📦 Нова Пошта — відділення', locker: '🏧 Нова Пошта — поштомат', courier: '🛵 Кур\'єр Нової Пошти', up: '✉️ Укрпошта' };
  const PAY = ['cod', 'card'];
  const PAY_UK = { cod: '💵 Накладений платіж', card: '💳 Переказ на картку' };
  const delivLabels = () => DELIV.map(k => t('b.d.' + k));
  const payLabels = () => PAY.map(k => t('b.p.' + k));
  const ukAddr = { branch: x => 'відділення № ' + x, locker: x => 'поштомат № ' + x, up: x => 'індекс ' + x, courier: x => x };

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
  let generation = 0; // після зміни мови старі повідомлення з черги не показуємо
  function say(html, opts = []) {
    const gen = generation;
    queue = queue.then(() => new Promise(res => {
      if (gen !== generation) return res();
      setQuick([]);
      const tp = document.createElement('div');
      tp.className = 'msg bot-m typing';
      tp.innerHTML = '<i></i><i></i><i></i>';
      log.appendChild(tp); log.scrollTop = log.scrollHeight;
      setTimeout(() => { tp.remove(); if (gen === generation) { add('bot-m', html); setQuick(opts); } res(); }, 450 + Math.min(700, html.length * 4));
    }));
  }
  function hear(text) {
    text = text.trim();
    if (!text) return;
    add('me', esc(text));
    route(text);
  }

  /* ---------- Маршрутизація (розуміє українську, російську й англійську) ---------- */
  function route(tx) {
    const l = tx.toLowerCase();
    if (/скасув|отмен|стоп|меню|cancel|stop|menu/.test(l) && st.mode) { st = { mode: null, step: null, data: {} }; return say(t('b.cancelled'), MENU()); }
    if (st.mode === 'order') return orderStep(tx);
    if (st.mode === 'size') return sizeStep(tx);
    if (/замов|оформ|купи|заказ|кошик|корзин|order|buy|checkout|cart/.test(l)) return startOrder();
    if (/розмір|размер|size|підібр|подобр/.test(l)) return startSize();
    if (/достав|пошт|почт|відправ|отправ|кур|deliver|shipping|courier/.test(l)) return delivery();
    if (/оплат|карт|налож|наклад|pay|card/.test(l)) return payment();
    if (/поверн|возвр|обмін|обмен|return|exchange|refund/.test(l)) return returns();
    if (/люд|человек|менедж|оператор|подзвон|позвон|телефон|номер|зв.яз|связ|person|human|manager|call|phone/.test(l)) return human();
    if (/знижк|скидк|акці|акци|sale|discount|deal/.test(l)) return sales();
    if (/дяку|спасиб|thank/.test(l)) return say(t('b.thanks'), MENU());
    if (/прив|добр|здрав|hello|hi\b|hey|вітаю/.test(l)) return greet();
    const words = l.split(/\s+/).filter(w => w.length > 3);
    const found = PRODUCTS.filter(p => {
      const names = [p.name, p.uk?.name].filter(Boolean).map(n => n.toLowerCase());
      return names.some(n => n.includes(l) || words.some(w => n.includes(w)));
    });
    if (found.length) {
      return say(t('b.found', { list: found.slice(0, 4).map(p => `<li><a href="#" data-open="${p.id}">${esc(p.name)}</a> — ${fmt(p.price)}</li>`).join('') }), MENU());
    }
    say(t('b.unknown'), MENU());
  }

  function greet() {
    say(t('b.greet1'));
    say(t('b.greet2'), MENU());
  }
  const delivery = () => say(t('b.delivery', { free: fmt(FREE_DELIVERY) }), MENU());
  const payment = () => say(t('b.payment'), MENU());
  const returns = () => say(t('b.returns'), MENU());
  const human = () => say(t('b.human'), MENU());
  const sales = () => {
    const s = PRODUCTS.filter(p => p.old);
    say(t('b.sales', { list: s.map(p => `<li><a href="#" data-open="${p.id}">${esc(p.name)}</a> — <b>${fmt(p.price)}</b> <s>${fmt(p.old)}</s></li>`).join('') }), MENU());
  };

  /* ---------- Підбір розміру ---------- */
  const WHO = () => [t('b.who.w'), t('b.who.m'), t('b.who.k')];
  function startSize() {
    st = { mode: 'size', step: 'who', data: {} };
    say(t('b.size.start'), WHO());
  }
  function sizeStep(tx) {
    const l = tx.toLowerCase();
    if (st.step === 'who') {
      // спершу «жінка», бо «woman» містить «man»
      if (/жін|жен|woman|women|female|girl|lady/.test(l)) st.data.who = 'women';
      else if (/чол|муж|\bman\b|\bmen\b|male|guy/.test(l)) st.data.who = 'men';
      else if (/дит|реб|діт|дет|child|kid|baby/.test(l)) st.data.who = 'kids';
      else return say(t('b.size.pick'), WHO());
      st.step = 'num';
      return say(st.data.who === 'kids' ? t('b.size.kids') : t('b.size.chest'));
    }
    const n = parseInt(tx.replace(/\D/g, ''), 10);
    if (!n || n < 50 || n > 190) return say(t('b.size.num'));
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
    say(t('b.size.result', { s: size }), MENU());
  }

  /* ---------- Оформлення замовлення ---------- */
  function startOrder() {
    if (!cart.length) return say(t('b.empty'), [t('b.q.sale'), t('b.m.size')]);
    st = { mode: 'order', step: 'name', data: {} };
    const list = cart.map(i => `<li>${esc(t('b.o.line', { name: byId[i.id].name, s: i.size, c: COLORS[i.color][0], q: i.qty }))}</li>`).join('');
    say(t('b.o.start', { list, total: fmt(cartTotal()) }));
    say(t('b.o.name'), [t('b.cancel')]);
  }

  function orderStep(tx) {
    const d = st.data, l = tx.toLowerCase();
    switch (st.step) {
      case 'name':
        if (tx.length < 2 || /\d/.test(tx)) return say(t('b.o.nameBad'));
        d.name = tx; st.step = 'phone';
        return say(t('b.o.phone', { n: esc(tx.split(' ')[0]) }), [t('b.cancel')]);
      case 'phone': {
        let digits = tx.replace(/\D/g, '');
        if (digits.length === 10 && digits[0] === '0') digits = '38' + digits;
        if (!/^380\d{9}$/.test(digits)) return say(t('b.o.phoneBad'));
        d.phone = '+' + digits.replace(/^(\d{3})(\d{2})(\d{3})(\d{2})(\d{2})$/, '$1 $2 $3 $4 $5');
        st.step = 'city';
        return say(t('b.o.city'), t('b.o.cities').split('|'));
      }
      case 'city':
        if (tx.length < 2) return say(t('b.o.cityBad'));
        d.city = tx; st.step = 'delivery';
        return say(t('b.o.how'), delivLabels());
      case 'delivery': {
        const labels = delivLabels();
        let i = labels.indexOf(tx);
        if (i < 0) i = labels.findIndex(o => o.toLowerCase().includes(l.slice(0, 5)));
        if (i < 0) return say(t('b.o.howBad'), labels);
        d.delivery = DELIV[i]; st.step = 'address';
        return say(t('b.o.q.' + d.delivery));
      }
      case 'address': {
        if (tx.length < 1) return say(t('b.o.addrBad'));
        const x = d.delivery === 'courier' ? tx : tx.replace(/^№\s*/, '');
        d.address = ukAddr[d.delivery](x);                                   // для CRM — українською
        d.addressShown = d.delivery === 'courier' ? x : t('b.a.' + d.delivery, { x }); // для покупця — його мовою
        st.step = 'pay';
        return say(t('b.o.pay'), payLabels());
      }
      case 'pay': {
        const labels = payLabels();
        let i = labels.indexOf(tx);
        if (i < 0) i = /налож|наклад|отрим|получ|cash|deliver/.test(l) ? 0 : /карт|card|transfer/.test(l) ? 1 : -1;
        if (i < 0) return say(t('b.o.payBad'), labels);
        d.pay = PAY[i]; st.step = 'confirm';
        const total = cartTotal();
        const free = total >= FREE_DELIVERY && d.delivery !== 'courier';
        return say(`${t('b.o.check')}<ul>
          <li>👤 ${esc(d.name)}</li><li>📞 ${d.phone}</li>
          <li>📍 ${esc(d.city)}, ${esc(d.addressShown)}</li><li>${t('b.d.' + d.delivery)}</li><li>${t('b.p.' + d.pay)}</li>
          <li>${t('b.o.items', { n: cartCount(), total: fmt(total) })}</li>
          <li>${free ? t('b.o.free') : t('b.o.paid')}</li></ul>${t('b.o.right')}`,
          [t('b.o.ok'), t('b.o.edit'), t('b.cancel')]);
      }
      case 'confirm':
        if (/змін|измен|change|edit/.test(l)) return startOrder();
        if (!/підтв|подтв|так|да|ok|ок|yes|confirm|✅/.test(l)) return say(t('b.o.confirm?'), [t('b.o.ok'), t('b.o.edit'), t('b.cancel')]);
        return finish();
    }
  }

  // Повідомлення сервера (українською) → зрозуміла причина мовою покупця
  function reason(msg) {
    if (/закінчився/.test(msg)) return t('b.e.soldOut');
    if (/Забагато замовлень/.test(msg)) return t('b.e.spam');
    if (/більше не продається/.test(msg)) return t('b.e.gone');
    return LANG === 'uk' ? msg : t('b.e.generic');
  }

  // Замовлення йде в базу Supabase: ціни перераховуються на сервері, залишки списуються.
  async function finish() {
    const d = st.data, cfg = window.VIV_CONFIG;
    st = { mode: null, step: null, data: {} };
    if (!cfg) { say(t('b.o.unavailable'), MENU()); return; }
    say(t('b.o.sending'));
    let res;
    try {
      const r = await fetch(`${cfg.supabaseUrl}/rest/v1/rpc/place_order`, {
        method: 'POST',
        headers: { apikey: cfg.supabaseKey, Authorization: 'Bearer ' + cfg.supabaseKey, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          p_name: d.name, p_phone: d.phone.replace(/\s/g, ''), p_city: d.city, p_delivery: DELIV_UK[d.delivery],
          p_address: d.address, p_payment: PAY_UK[d.pay], p_items: cart.map(i => ({ id: i.id, size: i.size, color: i.color, qty: i.qty })),
          p_lang: LANG,
        }),
      });
      res = await r.json();
      if (!r.ok) throw new Error(res.message || 'server');
    } catch (e) {
      const why = e instanceof TypeError ? t('b.e.offline') : reason(e.message);
      say(t('b.o.fail', { why: esc(why) }), [t('b.m.order'), t('b.m.human')]);
      if (typeof loadLiveCatalog === 'function') loadLiveCatalog();
      return;
    }
    cart = []; saveCart(); renderCart();
    if (typeof loadLiveCatalog === 'function') loadLiveCatalog(); // оновити залишки на сайті
    say(t('b.o.done', { num: esc(res.number), total: fmt(res.total), phone: esc(d.phone) }));
    say(t('b.o.bye'), [t('b.m.size'), t('b.m.delivery')]);
  }

  /* ---------- Відкриття / закриття ---------- */
  function open(intent) {
    const m = $('#pmodal'); if (m.open) m.close();
    $('#bot').hidden = false;
    $('#botFab').hidden = true;
    $('#botHint').classList.remove('show');
    $('#toTop').hidden = true;
    document.documentElement.classList.add('bot-open'); // на телефоні сторінка під чатом не прокручується
    if (!started) { started = true; if (!intent) greet(); }
    if (intent === 'order') { if (log.children.length === 0) say(t('b.hello')); startOrder(); }
    if (intent === 'size') { if (log.children.length === 0) say(t('b.hello')); startSize(); }
    // На сенсорних екранах не відкриваємо клавіатуру одразу — вона закриває половину чату
    if (matchMedia('(hover: hover)').matches) setTimeout(() => input.focus(), 50);
  }
  function close() {
    $('#bot').hidden = true; $('#botFab').hidden = false; $('#toTop').hidden = false;
    document.documentElement.classList.remove('bot-open');
  }

  // Зміна мови: починаємо розмову заново новою мовою
  document.addEventListener('langchange', () => {
    generation++;
    queue = Promise.resolve();
    st = { mode: null, step: null, data: {} };
    log.innerHTML = ''; setQuick([]);
    started = !$('#bot').hidden;
    if (started) greet();
  });

  $('#botFab').addEventListener('click', () => open());
  $('#botClose').addEventListener('click', close);
  $('#botForm').addEventListener('submit', e => { e.preventDefault(); hear(input.value); input.value = ''; });
  quick.addEventListener('click', e => {
    const b = e.target.closest('button');
    if (!b) return;
    const txt = b.textContent;
    if (txt === t('b.q.sale')) { add('me', esc(txt)); return sales(); }
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
