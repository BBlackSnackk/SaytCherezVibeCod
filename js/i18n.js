/* ===================== Мови сайту: українська (основна), російська, англійська =====================
   • Статичний текст сторінки позначено атрибутами data-i18n="ключ" (innerHTML) і
     data-i18n-attr="атрибут:ключ;…". Українська береться прямо з index.html, тут — лише переклади.
   • Динамічні рядки (каталог, кошик, бот) — функція t('ключ', {змінні}).
   • Довідники (сезони, категорії, кольори) і товари перекладаються «на місці»: глобальні
     SEASONS / AUDIENCES / CATEGORIES / COLORS / PRODUCTS отримують текст поточної мови,
     а українські оригінали зберігаються, щоб пошук працював будь-якою мовою.
   • Сайт завжди відкривається українською, якщо відвідувач сам не обрав іншу мову. */

const LANGS = ['uk', 'ru', 'en'];
const LANG_LABEL = { uk: 'УКР', ru: 'РУС', en: 'ENG' };
let LANG = (() => {
  const fromUrl = new URLSearchParams(location.search).get('lang');
  if (LANGS.includes(fromUrl)) return fromUrl;
  try { const saved = localStorage.getItem('vivaldi-lang'); if (LANGS.includes(saved)) return saved; } catch { /* приватний режим */ }
  return 'uk';
})();

/* ---------- Статичний текст index.html: [російська, англійська] ---------- */
const STATIC = {
  'meta.title': ['Вивальди — одежда четырёх сезонов', 'Vivaldi — clothing for four seasons'],
  'skip': ['Перейти к каталогу', 'Skip to catalog'],
  'logo.aria': ['Вивальди — на главную', 'Vivaldi — home'],
  'logo.text': ['Вивальди<small>одежда четырёх сезонов</small>', 'Vivaldi<small>clothing for four seasons</small>'],
  'catalog.aria': ['Перейти к каталогу', 'Go to catalog'],
  'catalog': ['Каталог', 'Catalog'],
  'search.ph': ['Я ищу… например, «свитер» или «Подснежник»', 'I’m looking for… e.g. “sweater” or “Snowdrop”'],
  'search.aria': ['Поиск товаров', 'Search products'],
  'search.btn': ['Найти', 'Search'],
  'phone.note': ['бесплатно по Украине', 'free calls in Ukraine'],
  'cart.aria': ['Корзина', 'Cart'],
  'lang.aria': ['Язык сайта', 'Site language'],
  'nav.aria': ['Разделы страницы', 'Page sections'],
  'nav.home': ['🎻 Главная', '🎻 Home'],
  'nav.sale': ['🔥 Скидки', '🔥 Sale'],
  'nav.spring': ['🌱 Весна', '🌱 Spring'],
  'nav.summer': ['☀️ Лето', '☀️ Summer'],
  'nav.autumn': ['🍂 Осень', '🍂 Autumn'],
  'nav.winter': ['❄️ Зима', '❄️ Winter'],
  'nav.sizes': ['📏 Размеры', '📏 Sizes'],
  'nav.delivery': ['🚚 Доставка и оплата', '🚚 Delivery & payment'],
  'nav.about': ['🎼 О нас', '🎼 About us'],
  'nav.reviews': ['💬 Отзывы', '💬 Reviews'],
  'nav.contacts': ['📞 Контакты', '📞 Contacts'],

  'hero.eyebrow': ['Новая коллекция 2026', 'New collection 2026'],
  'hero.title': ['Одежда, которая звучит<br><em>как четыре времени года</em>', 'Clothes that sound<br><em>like the four seasons</em>'],
  'hero.lead': ['Вдохновлённые «Временами года» Антонио Вивальди, мы шьём уютную одежду для всей семьи: для женщин, мужчин и детей. Лёгкий лён для жары, мягкий трикотаж для осени и тёплый пух для морозов — по доступным ценам.',
    'Inspired by Antonio Vivaldi’s “The Four Seasons”, we make cosy clothes for the whole family: women, men and kids. Light linen for the heat, soft knits for autumn and warm down for the frost, all at affordable prices.'],
  'hero.toCatalog': ['В каталог', 'Shop the catalog'],
  'hero.askBot': ['💬 Спросить Вива-бота', '💬 Ask Viva-bot'],
  'tile.spring': ['Весна', 'Spring'], 'tile.summer': ['Лето', 'Summer'], 'tile.autumn': ['Осень', 'Autumn'], 'tile.winter': ['Зима', 'Winter'],
  'perk.1': ['<b>Нова Пошта 1–3 дня</b>по всей Украине', '<b>Nova Poshta in 1–3 days</b>anywhere in Ukraine'],
  'perk.2': ['<b>Бесплатно от 1500 ₴</b>доставка в отделение', '<b>Free from ₴1,500</b>delivery to a branch'],
  'perk.3': ['<b>14 дней</b>на обмен и возврат', '<b>14 days</b>for exchanges and returns'],
  'perk.4': ['<b>Оплата при получении</b>или на карту', '<b>Pay on delivery</b>or by card transfer'],

  'promo.eyebrow': ['Сезонная распродажа', 'Seasonal sale'],
  'promo.title': ['Скидки до', 'Up to'],
  'promo.titleAfter': ['', 'off'],
  'promo.lead': ['Любимые модели для всей семьи по сниженным ценам — пока есть ваши размеры.', 'Favourite styles for the whole family at reduced prices, while your sizes last.'],
  'promo.btn': ['Смотреть все скидки', 'See all deals'],
  'promo.note': ['+ бесплатная доставка от 1500 ₴', '+ free delivery from ₴1,500'],

  'filters.aria': ['Фильтры', 'Filters'],
  'filters.title': ['Фильтры', 'Filters'],
  'filters.reset': ['Сбросить', 'Reset'],
  'filters.close': ['Закрыть фильтры', 'Close filters'],
  'filters.apply': ['Показать товары', 'Show products'],
  'filters.open': ['⚙️ Фильтры', '⚙️ Filters'],
  'sort.label': ['Сортировать:', 'Sort by:'],
  'sort.popular': ['по популярности', 'popularity'],
  'sort.cheap': ['от дешёвых', 'price: low to high'],
  'sort.expensive': ['от дорогих', 'price: high to low'],
  'sort.rating': ['по рейтингу', 'rating'],
  'sort.sale': ['сначала скидки', 'deals first'],

  'sizes.title': ['📏 Таблица размеров', '📏 Size guide'],
  'sizes.intro': ['Не уверены в размере? Вива-бот подберёт его по двум цифрам. <button class="link-btn" data-bot-open="size">Подобрать размер →</button>',
    'Not sure about your size? Viva-bot will find it from two numbers. <button class="link-btn" data-bot-open="size">Find my size →</button>'],
  'sizes.women': ['Женщинам', 'Women'], 'sizes.men': ['Мужчинам', 'Men'], 'sizes.kids': ['Детям', 'Kids'],
  'sizes.size': ['Размер', 'Size'], 'sizes.chest': ['Грудь, см', 'Chest, cm'], 'sizes.waist': ['Талия, см', 'Waist, cm'],
  'sizes.hips': ['Бёдра, см', 'Hips, cm'], 'sizes.height': ['Рост, см', 'Height, cm'], 'sizes.kidSize': ['Размер (рост)', 'Size (height)'],
  'sizes.age': ['Возраст', 'Age'],
  'age.3': ['3–4 года', '3–4 years'], 'age.5': ['5–6 лет', '5–6 years'], 'age.7': ['7–8 лет', '7–8 years'],
  'age.9': ['9–10 лет', '9–10 years'], 'age.11': ['11–12 лет', '11–12 years'],
  'sizes.hats': ['Шапки: 48–50 см — 2–5 лет, 52–54 см — 6–12 лет.', 'Hats: 48–50 cm for ages 2–5, 52–54 cm for ages 6–12.'],

  'delivery.title': ['🚚 Доставка и оплата', '🚚 Delivery & payment'],
  'delivery.np': ['Нова Пошта', 'Nova Poshta'],
  'delivery.npText': ['Отделение или почтомат, 1–3 дня. Бесплатно от 1500 ₴, иначе — по тарифам перевозчика.', 'Branch or parcel locker, 1–3 days. Free from ₴1,500, otherwise at the carrier’s rates.'],
  'delivery.courier': ['Курьер', 'Courier'],
  'delivery.courierText': ['Адресная доставка Новой Почтой в крупных городах, 1–2 дня.', 'Door-to-door delivery by Nova Poshta in major cities, 1–2 days.'],
  'delivery.up': ['Укрпочта', 'Ukrposhta'],
  'delivery.upText': ['Самый дешёвый вариант: 3–5 дней в любой уголок Украины.', 'The cheapest option: 3–5 days to anywhere in Ukraine.'],
  'delivery.pay': ['Оплата', 'Payment'],
  'delivery.payText': ['Наложенный платёж при получении или перевод на карту после подтверждения заказа менеджером.', 'Cash on delivery, or a card transfer once a manager has confirmed your order.'],
  'returns.title': ['↩️ Обмен и возврат', '↩️ Exchanges & returns'],
  'returns.1': ['Напишите Вива-боту или позвоните в течение 14 дней после получения.', 'Message Viva-bot or call us within 14 days of receiving your order.'],
  'returns.2': ['Сохраните бирки и товарный вид вещи.', 'Keep the tags on and the item in its original condition.'],
  'returns.3': ['Отправьте посылку Новой Почтой по нашему адресу.', 'Send the parcel to our address with Nova Poshta.'],
  'returns.4': ['Получите деньги на карту в течение 3 рабочих дней.', 'Get your money back to your card within 3 working days.'],

  'about.title': ['🎼 О нас', '🎼 About us'],
  'about.1': ['В 1725 году Антонио Вивальди издал четыре скрипичных концерта, изображающих весну, лето, осень и зиму. Почти триста лет спустя мы подумали: у одежды тоже есть свои сезоны, свой ритм и своё настроение.',
    'In 1725 Antonio Vivaldi published four violin concertos portraying spring, summer, autumn and winter. Almost three hundred years later we thought: clothes have their seasons, rhythm and mood too.'],
  'about.2': ['«Вивальди» — украинский магазин одежды масс-маркет сегмента для всей семьи. Каждая коллекция — как часть концерта: лёгкая весна, яркое лето, тёплая осень и уютная зима.',
    'Vivaldi is a Ukrainian mass-market clothing store for the whole family. Each collection is like a movement of the concerto: a light spring, a bright summer, a warm autumn and a cosy winter.'],
  'about.3': ['Мы выбираем практичные ткани — лён, хлопок, шерсть, флис и мембрану — и проверяем, как вещи ведут себя после стирки. Чтобы одежда служила не один сезон, а несколько.',
    'We choose practical fabrics (linen, cotton, wool, fleece and membrane) and test how each piece holds up in the wash, so your clothes last for several seasons, not just one.'],
  'about.logoAlt': ['Логотип «Вивальди»: скрипка, обвитая нитью', 'Vivaldi logo: a violin wrapped in yarn'],
  'stats.models': ['моделей в коллекции', 'styles in the collection'],
  'stats.seasons': ['сезона', 'seasons'],
  'stats.lines': ['линии: женщины, мужчины, дети', 'lines: women, men, kids'],
  'stats.rating': ['средняя оценка покупателей', 'average customer rating'],

  'reviews.title': ['💬 Отзывы покупателей', '💬 Customer reviews'],
  'review.1': ['Купила пуховик «L\'Inverno» и себе, и дочке комбинезон. Тепло, легко, а доставка пришла за день!', 'I bought the “L’Inverno” down coat for myself and a snowsuit for my daughter. Warm, light, and delivery took just a day!'],
  'review.1by': ['Оксана, Киев', 'Oksana, Kyiv'],
  'review.2': ['Льняная рубашка — просто спасение в жару. Размер подсказал бот, подошёл идеально.', 'The linen shirt is a lifesaver in the heat. The bot suggested my size and it fits perfectly.'],
  'review.2by': ['Андрей, Одесса', 'Andrii, Odesa'],
  'review.3': ['Свитер «Тыквенный латте» — любовь с первого взгляда. Минус одна звезда: хочу ещё больше цветов 🙂', 'The “Pumpkin Latte” sweater was love at first sight. Minus one star only because I want even more colours 🙂'],
  'review.3by': ['Мария, Львов', 'Mariia, Lviv'],
  'review.4': ['Взял худи «Осенний ветер» и джинсы «Октябрь». Ткань плотная, после стирки не села и не полиняла. За такие деньги — очень достойно.', 'Got the “Autumn Wind” hoodie and “October” jeans. Thick fabric that didn’t shrink or fade in the wash. Great value for the money.'],
  'review.4by': ['Дмитрий, Харьков', 'Dmytro, Kharkiv'],

  'brand': ['Вивальди', 'Vivaldi'],
  'footer.tagline': ['Одежда четырёх сезонов для всей семьи.', 'Clothing for four seasons, for the whole family.'],
  'footer.phoneNote': ['1678 — год рождения Антонио Вивальди, 44 — четыре сезона и четыре концерта 🎶<br>Звонки бесплатные, ежедневно 9:00–21:00',
    '1678 is the year Antonio Vivaldi was born; 44 stands for four seasons and four concertos 🎶<br>Free calls, daily 9:00–21:00'],
  'footer.buyers': ['Покупателям', 'Customer care'],
  'footer.delivery': ['Доставка и оплата', 'Delivery & payment'],
  'footer.returns': ['Обмен и возврат', 'Exchanges & returns'],
  'footer.sizes': ['Таблица размеров', 'Size guide'],
  'footer.gift': ['Подарочные сертификаты', 'Gift cards'],
  'footer.loyalty': ['Программа лояльности «Скрипичный ключ»', 'Treble Clef loyalty programme'],
  'footer.company': ['Компания', 'Company'],
  'footer.about': ['О нас', 'About us'],
  'footer.jobs': ['Вакансии', 'Careers'],
  'footer.stores': ['Наши магазины', 'Our stores'],
  'footer.offer': ['Публичная оферта', 'Terms of sale'],
  'footer.privacy': ['Политика конфиденциальности', 'Privacy policy'],
  'footer.social': ['Мы в соцсетях', 'Follow us'],
  'footer.email': ['Почта hello@vivaldi.wear', 'Email hello@vivaldi.wear'],
  'footer.youtube': ['YouTube «Вивальди»', 'YouTube “Vivaldi”'],
  'footer.telegram': ['Telegram-канал @vivaldi_wear', 'Telegram channel @vivaldi_wear'],
  'footer.address': ['📍 Киев, ул. Скрипичная, 4 (вымышленный адрес)', '📍 4 Skrypkova St, Kyiv (fictional address)'],
  'footer.copy': ['© 2026 «Вивальди». Учебный проект — магазин и товары вымышлены.', '© 2026 Vivaldi. A study project: the store and products are fictional.'],

  'pmodal.aria': ['Карточка товара', 'Product details'],
  'cart.title': ['🛒 Корзина', '🛒 Cart'],
  'cart.close': ['Закрыть корзину', 'Close cart'],
  'toTop': ['Наверх', 'Back to top'],
  'bot.hint': ['Привет! Я помогу оформить заказ 👋', 'Hi! I can help you place an order 👋'],
  'bot.fabAria': ['Открыть чат с Вива-ботом', 'Open chat with Viva-bot'],
  'bot.name': ['Вива-бот', 'Viva-bot'],
  'bot.aria': ['Чат с Вива-ботом', 'Chat with Viva-bot'],
  'bot.status': ['● онлайн, отвечает мгновенно', '● online, replies instantly'],
  'bot.close': ['Закрыть чат', 'Close chat'],
  'bot.ph': ['Напишите сообщение…', 'Type a message…'],
  'bot.msgAria': ['Сообщение', 'Message'],
  'bot.send': ['Отправить', 'Send'],
};

/* ---------- Динамічні рядки: [українська, російська, англійська] ---------- */
const DICT = {
  // каталог і фільтри
  'photoAlt': ['{name}, фото {n}', '{name}, фото {n}', '{name}, photo {n}'],
  'f.aud': ['Для кого', 'Для кого', 'Shop for'],
  'f.season': ['Сезон', 'Сезон', 'Season'],
  'f.cat': ['Категорія', 'Категория', 'Category'],
  'f.price': ['Ціна, ₴', 'Цена, ₴', 'Price, ₴'],
  'f.from': ['від {p}', 'от {p}', 'from {p}'],
  'f.to': ['до {p}', 'до {p}', 'to {p}'],
  'f.priceFrom': ['Ціна від', 'Цена от', 'Minimum price'],
  'f.priceTo': ['Ціна до', 'Цена до', 'Maximum price'],
  'f.sizeAdult': ['Розмір — дорослі', 'Размер — взрослые', 'Size — adults'],
  'f.sizeKids': ['Розмір — діти (зріст)', 'Размер — дети (рост)', 'Size — kids (height)'],
  'f.color': ['Колір', 'Цвет', 'Colour'],
  'f.inStock': ['Лише в наявності', 'Только в наличии', 'In stock only'],
  'f.sale': ['🔥 Лише зі знижкою', '🔥 Только со скидкой', '🔥 On sale only'],
  'chip.size': ['Розмір {s}', 'Размер {s}', 'Size {s}'],
  'chip.from': ['від {p}', 'от {p}', 'from {p}'],
  'chip.to': ['до {p}', 'до {p}', 'up to {p}'],
  'chip.inStock': ['В наявності', 'В наличии', 'In stock'],
  'chip.sale': ['Зі знижкою', 'Со скидкой', 'On sale'],
  'chip.resetAll': ['Скинути все', 'Сбросить все', 'Clear all'],
  'card.low': ['Закінчується', 'Заканчивается', 'Low stock'],
  'card.out': ['Немає в наявності', 'Нет в наличии', 'Out of stock'],
  'card.more': ['Детальніше', 'Подробнее', 'Details'],
  'card.buy': ['Купити', 'Купить', 'Buy'],
  'rating.reviews': ['{n} {w}', '{n} {w}', '{n} {w}'],
  'rating.new': ['✨ Новинка', '✨ Новинка', '✨ New'],
  'empty.season': ['У сезоні «{s}» за цими фільтрами нічого немає 🤷', 'В сезоне «{s}» по этим фильтрам ничего нет 🤷', 'Nothing in {s} matches these filters 🤷'],
  'empty.reset': ['Скинути фільтри', 'Сбросить фильтры', 'Reset filters'],
  'found': ['Знайдено {n} {w}', 'Найдено {n} {w}', 'Found {n} {w}'],

  // картка товару
  'pm.stockIn': ['✔ В наявності', '✔ В наличии', '✔ In stock'],
  'pm.stockLow': ['⏳ Закінчується — лишилось кілька штук', '⏳ Заканчивается — осталось несколько штук', '⏳ Low stock — only a few left'],
  'pm.stockOut': ['✖ Немає в наявності', '✖ Нет в наличии', '✖ Out of stock'],
  'pm.photo': ['Фото {n}', 'Фото {n}', 'Photo {n}'],
  'pm.capModel': ['На моделі — колір «{c}»', 'На модели — цвет «{c}»', 'On the model: {c}'],
  'pm.capAll': ['Усі кольори: {list}', 'Все цвета: {list}', 'All colours: {list}'],
  'pm.capNoModel': ['Вигляд без моделі', 'Вид без модели', 'Product view'],
  'pm.code': ['код {id}', 'код {id}', 'code {id}'],
  'pm.color': ['Колір:', 'Цвет:', 'Colour:'],
  'pm.size': ['Розмір', 'Размер', 'Size'],
  'pm.height': ['(зріст, см)', '(рост, см)', '(height, cm)'],
  'pm.sizeTable': ['таблиця розмірів', 'таблица размеров', 'size guide'],
  'pm.noColor': ['Немає в цьому кольорі', 'Нет в этом цвете', 'Not available in this colour'],
  'pm.left': ['Лишилось {n} шт. у розмірі {s}', 'Осталось {n} шт. в размере {s}', 'Only {n} left in size {s}'],
  'pm.less': ['Менше', 'Меньше', 'Fewer'],
  'pm.more': ['Більше', 'Больше', 'More'],
  'pm.add': ['🛒 Додати в кошик', '🛒 Добавить в корзину', '🛒 Add to cart'],
  'pm.notify': ['Повідомити, коли з\'явиться — через Віва-бота', 'Сообщить, когда появится — через Вива-бота', 'Notify me when it’s back — via Viva-bot'],
  'spec.material': ['Склад', 'Состав', 'Composition'],
  'spec.colors': ['Доступні кольори', 'Доступные цвета', 'Available colours'],
  'spec.sizes': ['Розміри', 'Размеры', 'Sizes'],
  'spec.care': ['Догляд', 'Уход', 'Care'],
  'spec.careText': ['Делікатне прання при 30°, не відбілювати, прасувати при низькій температурі.', 'Деликатная стирка при 30°, не отбеливать, гладить при низкой температуре.', 'Gentle wash at 30°C, do not bleach, iron on low heat.'],
  'spec.delivery': ['Доставка', 'Доставка', 'Delivery'],
  'spec.deliveryText': ['Нова Пошта 1–3 дні · безкоштовно від {p}', 'Нова Пошта 1–3 дня · бесплатно от {p}', 'Nova Poshta, 1–3 days · free from {p}'],
  'close': ['Закрити', 'Закрыть', 'Close'],

  // повідомлення
  'toast.pickSize': ['Оберіть, будь ласка, розмір 📏', 'Выберите, пожалуйста, размер 📏', 'Please choose a size 📏'],
  'toast.onlyLeft': ['Доступно ще лише {n} шт. у цьому розмірі й кольорі', 'Доступно ещё только {n} шт. в этом размере и цвете', 'Only {n} more available in this size and colour'],
  'toast.allInCart': ['Усі доступні штуки вже у вашому кошику', 'Все доступные штуки уже в вашей корзине', 'All available items are already in your cart'],
  'toast.added': ['Додано в кошик: {name} ✓', 'Добавлено в корзину: {name} ✓', 'Added to cart: {name} ✓'],
  'toast.fake': ['«{x}» — сторінка ще в розробці 🎻', '«{x}» — страница ещё в разработке 🎻', '{x}: coming soon 🎻'],

  // кошик
  'cart.empty': ['Кошик поки порожній.<br>Оберіть щось затишне у каталозі!', 'Корзина пока пуста.<br>Выберите что-нибудь уютное в каталоге!', 'Your cart is empty.<br>Find something cosy in the catalog!'],
  'cart.toCatalog': ['До каталогу', 'В каталог', 'Go to catalog'],
  'cart.line': ['Розмір {s} · {c}', 'Размер {s} · {c}', 'Size {s} · {c}'],
  'cart.each': ['{p} / шт.', '{p} / шт.', '{p} each'],
  'cart.remove': ['видалити', 'удалить', 'remove'],
  'cart.addMore': ['Додайте ще <b>{p}</b> — і доставка буде безкоштовною 🎁', 'Добавьте ещё <b>{p}</b> — и доставка будет бесплатной 🎁', 'Add <b>{p}</b> more to get free delivery 🎁'],
  'cart.free': ['🎉 Доставка до відділення — безкоштовно!', '🎉 Доставка в отделение — бесплатно!', '🎉 Free delivery to a branch!'],
  'cart.total': ['Разом', 'Итого', 'Total'],
  'cart.checkout': ['💬 Оформити через Віва-бота', '💬 Оформить через Вива-бота', '💬 Check out with Viva-bot'],
  'cart.note': ['Без реєстрації: бот запитає ім\'я, телефон і відділення Нової Пошти', 'Без регистрации: бот спросит имя, телефон и отделение Новой Почты', 'No sign-up: the bot will ask for your name, phone and Nova Poshta branch'],

  // рекламний банер
  'promo.lead': ['{n} {w} для жінок, чоловіків і дітей за зниженими цінами — поки є ваші розміри.', '{n} {w} для женщин, мужчин и детей по сниженным ценам — пока есть ваши размеры.', '{n} {w} for women, men and kids at reduced prices, while your sizes last.'],
  'promo.aria': ['{name}, знижка {d}%', '{name}, скидка {d}%', '{name}, {d}% off'],
};

/* Множина: [одна, кілька (2–4), багато] для української й російської; [one, other] для англійської */
const PLURALS = {
  product: [['товар', 'товари', 'товарів'], ['товар', 'товара', 'товаров'], ['item', 'items']],
  model: [['модель', 'моделі', 'моделей'], ['модель', 'модели', 'моделей'], ['style', 'styles']],
  review: [['відгук', 'відгуки', 'відгуків'], ['отзыв', 'отзыва', 'отзывов'], ['review', 'reviews']],
};
function plural(n, key) {
  const forms = PLURALS[key][LANGS.indexOf(LANG)];
  if (LANG === 'en') return n === 1 ? forms[0] : forms[1];
  const a = n % 10, b = n % 100;
  return a === 1 && b !== 11 ? forms[0] : a >= 2 && a <= 4 && (b < 10 || b >= 20) ? forms[1] : forms[2];
}

function t(key, vars = {}) {
  const row = DICT[key];
  let s = row ? (row[LANGS.indexOf(LANG)] ?? row[0]) : key;
  return s.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? vars[k] : m));
}

/* ---------- Довідники ---------- */
const DATA_I18N = {
  seasons: {
    spring: { ru: ['Весна', 'Первые лучи, лёгкие ткани и пастельные цвета. Одежда, в которой хочется гулять дольше.', 'Концерт № 1 ми мажор, RV 269'],
              en: ['Spring', 'First sunbeams, light fabrics and pastel colours. Clothes that make you want to stay out longer.', 'Concerto No. 1 in E major, RV 269'] },
    summer: { ru: ['Лето', 'Лён и хлопок, которые дышат вместе с вами. Для жары, моря и долгих вечеров.', 'Концерт № 2 соль минор, RV 315'],
              en: ['Summer', 'Linen and cotton that breathe with you. For the heat, the sea and long evenings.', 'Concerto No. 2 in G minor, RV 315'] },
    autumn: { ru: ['Осень', 'Тёплый трикотаж и цвета опавшей листвы. Уют, который можно надеть.', 'Концерт № 3 фа мажор, RV 293'],
              en: ['Autumn', 'Warm knits in the colours of fallen leaves. Cosiness you can wear.', 'Concerto No. 3 in F major, RV 293'] },
    winter: { ru: ['Зима', 'Пуховики, шерсть и флис. Тепло, как у камина, даже в самый лютый мороз.', 'Концерт № 4 фа минор, RV 297'],
              en: ['Winter', 'Down coats, wool and fleece. Fireside warmth even in the fiercest frost.', 'Concerto No. 4 in F minor, RV 297'] },
  },
  aud: { women: ['Женщинам', 'Women'], men: ['Мужчинам', 'Men'], kids: ['Детям', 'Kids'] },
  cat: {
    outer: ['Верхняя одежда', 'Outerwear'], dress: ['Платья и юбки', 'Dresses & skirts'], knit: ['Свитеры, худи, кардиганы', 'Sweaters, hoodies & cardigans'],
    tops: ['Футболки и рубашки', 'T-shirts & shirts'], pants: ['Брюки, шорты, джинсы', 'Trousers, shorts & jeans'], sets: ['Комплекты', 'Sets'], acc: ['Аксессуары', 'Accessories'],
  },
  colors: {
    white: ['Белый', 'White'], black: ['Чёрный', 'Black'], grey: ['Серый', 'Grey'], beige: ['Бежевый', 'Beige'], brown: ['Коричневый', 'Brown'],
    olive: ['Оливковый', 'Olive'], green: ['Зелёный', 'Green'], mint: ['Мятный', 'Mint'], yellow: ['Жёлтый', 'Yellow'], orange: ['Оранжевый', 'Orange'],
    red: ['Красный', 'Red'], pink: ['Розовый', 'Pink'], lightblue: ['Голубой', 'Light blue'], blue: ['Синий', 'Blue'], navy: ['Тёмно-синий', 'Navy'],
  },
};

// Українські оригінали довідників (знімок до першого перекладу)
const UK = {
  seasons: Object.fromEntries(SEASONS.map(s => [s.key, [s.name, s.text, s.concerto]])),
  aud: { ...AUDIENCES }, cat: { ...CATEGORIES },
  colors: Object.fromEntries(Object.entries(COLORS).map(([k, v]) => [k, v[0]])),
};
const pick = (row, ukValue) => (LANG === 'uk' || !row) ? ukValue : (row[LANG === 'ru' ? 0 : 1] || ukValue);

function localizeData() {
  SEASONS.forEach(s => {
    const tr = DATA_I18N.seasons[s.key]?.[LANG];
    [s.name, s.text, s.concerto] = LANG === 'uk' || !tr ? UK.seasons[s.key] : tr;
  });
  Object.keys(AUDIENCES).forEach(k => { AUDIENCES[k] = pick(DATA_I18N.aud[k], UK.aud[k]); });
  Object.keys(CATEGORIES).forEach(k => { CATEGORIES[k] = pick(DATA_I18N.cat[k], UK.cat[k]); });
  Object.keys(COLORS).forEach(k => { COLORS[k][0] = pick(DATA_I18N.colors[k], UK.colors[k]); });
}

/* ---------- Товари ---------- */
// p.i18n = { ru: {name, desc, material}, en: {...} }: з бази або з js/products-i18n.js.
// Незаповнене поле показується українською.
function localizeProduct(p) {
  if (!p.uk) p.uk = { name: p.name, desc: p.desc, material: p.material };
  if (!p.i18n || !Object.keys(p.i18n).length) p.i18n = PRODUCT_I18N[p.id] || {};
  const tr = LANG === 'uk' ? {} : (p.i18n[LANG] || {});
  p.name = (tr.name || '').trim() || p.uk.name;
  p.desc = (tr.desc || '').trim() || p.uk.desc;
  p.material = (tr.material || '').trim() || p.uk.material;
  return p;
}

/* ---------- Статичний текст сторінки ---------- */
function applyStatic() {
  const col = LANG === 'ru' ? 0 : 1;
  const tr = (k, uk) => (LANG === 'uk' ? uk : STATIC[k]?.[col] ?? uk);
  document.querySelectorAll('[data-i18n]').forEach(el => {
    if (el.ukHTML == null) el.ukHTML = el.innerHTML;
    el.innerHTML = tr(el.dataset.i18n, el.ukHTML);
  });
  document.querySelectorAll('[data-i18n-attr]').forEach(el => {
    el.ukAttr ??= {};
    el.dataset.i18nAttr.split(';').forEach(pair => {
      const [attr, key] = pair.split(':').map(x => x.trim());
      if (!(attr in el.ukAttr)) el.ukAttr[attr] = el.getAttribute(attr) ?? '';
      el.setAttribute(attr, tr(key, el.ukAttr[attr]));
    });
  });
  const html = document.documentElement;
  if (!html.dataset.ukTitle) html.dataset.ukTitle = document.title;
  document.title = tr('meta.title', html.dataset.ukTitle);
  html.lang = LANG;
  document.querySelectorAll('[data-lang]').forEach(b => {
    const on = b.dataset.lang === LANG;
    b.classList.toggle('on', on);
    b.setAttribute('aria-pressed', on);
  });
}

/* ---------- Перемикання ---------- */
function setLang(lang) {
  if (!LANGS.includes(lang) || lang === LANG) return;
  LANG = lang;
  try { localStorage.setItem('vivaldi-lang', lang); } catch { /* приватний режим */ }
  // ?lang= у посиланні — щоб можна було поділитися сторінкою потрібною мовою
  const url = new URL(location.href);
  if (lang === 'uk') url.searchParams.delete('lang'); else url.searchParams.set('lang', lang);
  history.replaceState(null, '', url);
  localizeData();
  PRODUCTS.forEach(localizeProduct);
  applyStatic();
  document.dispatchEvent(new CustomEvent('langchange', { detail: lang }));
}

document.addEventListener('click', e => {
  const b = e.target.closest('[data-lang]');
  if (b) setLang(b.dataset.lang);
});

// Перший переклад — до того, як app.js намалює каталог
localizeData();
PRODUCTS.forEach(localizeProduct);
applyStatic();
