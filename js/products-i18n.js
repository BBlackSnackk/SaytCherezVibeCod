/* ===== Переклади товарів російською та англійською =====
   Українська — основна мова: назви й описи в js/data.js та в базі (CRM).
   Для живого каталогу переклади зберігаються в базі (products.i18n) і редагуються в CRM;
   цей файл — запасний варіант, коли база недоступна або переклад там ще не заповнено. */
const PRODUCT_I18N = {
  // ---------- ВЕСНА ----------
  'sp-w-1': {
    ru: { name: 'Тренч «Primavera»', desc: 'Классический двубортный тренч с поясом. Водоотталкивающая пропитка спасает от весеннего ливня.', material: '65% хлопок, 35% полиэстер; подкладка — 100% вискоза' },
    en: { name: 'Trench Coat “Primavera”', desc: 'A classic double-breasted belted trench. The water-repellent finish keeps you dry in a spring downpour.', material: '65% cotton, 35% polyester; lining: 100% viscose' },
  },
  'sp-w-2': {
    ru: { name: 'Платье миди «Цветущий сад»', desc: 'Лёгкое платье с мелким цветочным принтом, рукавами-фонариками и V-образным вырезом.', material: '100% вискоза' },
    en: { name: 'Midi Dress “Blooming Garden”', desc: 'A light dress with a ditsy floral print, puff sleeves and a V-neck.', material: '100% viscose' },
  },
  'sp-w-3': {
    ru: { name: 'Кардиган «Подснежник»', desc: 'Мягкий вязаный кардиган на перламутровых пуговицах: накинуть вечером, когда становится прохладно.', material: '50% хлопок, 50% акрил' },
    en: { name: 'Cardigan “Snowdrop”', desc: 'A soft knitted cardigan with pearly buttons, perfect to throw on when the evening gets cool.', material: '50% cotton, 50% acrylic' },
  },
  'sp-m-1': {
    ru: { name: 'Бомбер «Allegro»', desc: 'Лёгкий бомбер с трикотажными манжетами. Ветрозащитный, с внутренним карманом для телефона.', material: 'Верх — 100% полиамид; подкладка — 100% полиэстер' },
    en: { name: 'Bomber Jacket “Allegro”', desc: 'A light bomber with ribbed cuffs. Windproof, with an inside pocket for your phone.', material: 'Shell: 100% polyamide; lining: 100% polyester' },
  },
  'sp-m-2': {
    ru: { name: 'Рубашка оксфорд «Март»', desc: 'Рубашка на пуговицах из плотной оксфордской ткани: к джинсам и к пиджаку.', material: '100% хлопок' },
    en: { name: 'Oxford Shirt “March”', desc: 'A button-down shirt in sturdy oxford cloth that works with jeans and a blazer alike.', material: '100% cotton' },
  },
  'sp-m-3': {
    ru: { name: 'Чиносы «Апрель»', desc: 'Чиносы прямого кроя, зауженные книзу. Немного эластана, чтобы было удобно весь день.', material: '98% хлопок, 2% эластан' },
    en: { name: 'Chinos “April”', desc: 'Straight-cut chinos tapering at the ankle, with a touch of stretch for all-day comfort.', material: '98% cotton, 2% elastane' },
  },
  'sp-k-1': {
    ru: { name: 'Ветровка «Скворцы»', desc: 'Яркая ветровка с капюшоном и светоотражающими вставками: ребёнка видно издалека.', material: '100% полиэстер с водоотталкивающей пропиткой' },
    en: { name: 'Windbreaker “Starlings”', desc: 'A bright hooded windbreaker with reflective details, so your child is easy to spot from afar.', material: '100% polyester with a water-repellent finish' },
  },
  'sp-k-2': {
    ru: { name: 'Худи «Птичье пение»', desc: 'Худи с принтом певчих птичек и карманом-кенгуру.', material: 'Футер: 80% хлопок, 20% полиэстер' },
    en: { name: 'Hoodie “Birdsong”', desc: 'A hoodie with a songbird print and a kangaroo pocket.', material: 'French terry: 80% cotton, 20% polyester' },
  },
  'sp-k-3': {
    ru: { name: 'Джинсы «Ручеёк»', desc: 'Прочные детские джинсы с регулируемой резинкой в поясе. Выдержат и прыжки, и горки.', material: '99% хлопок, 1% эластан' },
    en: { name: 'Jeans “Brook”', desc: 'Tough kids’ jeans with an adjustable waistband. Ready for jumping and slides.', material: '99% cotton, 1% elastane' },
  },

  // ---------- ЛІТО ----------
  'su-w-1': {
    ru: { name: 'Льняной сарафан «Presto»', desc: 'Сарафан миди на тонких бретелях из натурального льна. Прохладный даже в +35°.', material: '100% лён' },
    en: { name: 'Linen Sundress “Presto”', desc: 'A midi sundress with thin straps in natural linen. Stays cool even at +35°C.', material: '100% linen' },
  },
  'su-w-2': {
    ru: { name: 'Топ «Зной»', desc: 'Базовый топ на бретелях: облегает, но не сдавливает.', material: '95% хлопок, 5% эластан' },
    en: { name: 'Top “Heatwave”', desc: 'A basic strappy top that fits close without squeezing.', material: '95% cotton, 5% elastane' },
  },
  'su-w-3': {
    ru: { name: 'Джинсовые шорты «Июль»', desc: 'Шорты с высокой посадкой и необработанным краем.', material: '100% хлопок' },
    en: { name: 'Denim Shorts “July”', desc: 'High-waisted shorts with a raw hem.', material: '100% cotton' },
  },
  'su-m-1': {
    ru: { name: 'Футболка базовая «Adagio»', desc: 'Футболка, которую хочется купить во всех цветах. Не деформируется после стирки.', material: '100% хлопок, плотность 180 г/м²' },
    en: { name: 'Basic T-shirt “Adagio”', desc: 'The tee you’ll want in every colour. Keeps its shape wash after wash.', material: '100% cotton, 180 g/m²' },
  },
  'su-m-2': {
    ru: { name: 'Льняная рубашка «Морской бриз»', desc: 'Свободная рубашка с открытым воротом для отпуска и городской жары.', material: '100% лён' },
    en: { name: 'Linen Shirt “Sea Breeze”', desc: 'A relaxed camp-collar shirt for holidays and hot city days.', material: '100% linen' },
  },
  'su-m-3': {
    ru: { name: 'Шорты карго «Гроза»', desc: 'Шорты с шестью карманами: место найдётся и для ключей, и для наушников.', material: '100% хлопок' },
    en: { name: 'Cargo Shorts “Thunderstorm”', desc: 'Six pockets, so there’s room for your keys and your earbuds.', material: '100% cotton' },
  },
  'su-k-1': {
    ru: { name: 'Комплект «Каникулы»', desc: 'Футболка с принтом солнышка и шорты на мягкой резинке.', material: '100% хлопок' },
    en: { name: 'Set “Holidays”', desc: 'A sunshine-print T-shirt and shorts with a soft elastic waist.', material: '100% cotton' },
  },
  'su-k-2': {
    ru: { name: 'Панама «Солнышко»', desc: 'Лёгкая панама с широкими полями защищает от солнца лицо и шею.', material: '100% хлопок' },
    en: { name: 'Bucket Hat “Sunshine”', desc: 'A light wide-brimmed hat that shields the face and neck from the sun.', material: '100% cotton' },
  },
  'su-k-3': {
    ru: { name: 'Платье «Ромашка»', desc: 'Детское платье с ромашковым принтом и воланом по низу. Идеально кружится!', material: '100% хлопок' },
    en: { name: 'Dress “Daisy”', desc: 'A kids’ dress with a daisy print and a ruffled hem. Perfect for twirling!', material: '100% cotton' },
  },

  // ---------- ОСІНЬ ----------
  'au-w-1': {
    ru: { name: 'Пальто «Листопад»', desc: 'Длинное шерстяное пальто с широкими лацканами: тёплое, элегантное, на несколько сезонов.', material: '60% шерсть, 40% полиэстер' },
    en: { name: 'Coat “Leaf Fall”', desc: 'A long wool coat with wide lapels: warm, elegant and made to last several seasons.', material: '60% wool, 40% polyester' },
  },
  'au-w-2': {
    ru: { name: 'Свитер oversize «Тыквенный латте»', desc: 'Объёмный свитер крупной вязки со спущенной линией плеча. Самая уютная вещь сезона.', material: '50% шерсть, 50% акрил' },
    en: { name: 'Oversized Sweater “Pumpkin Latte”', desc: 'A chunky-knit sweater with dropped shoulders. The cosiest piece of the season.', material: '50% wool, 50% acrylic' },
  },
  'au-w-3': {
    ru: { name: 'Юбка плиссе «Золотая осень»', desc: 'Юбка миди в мелкую складку, которая красиво двигается при ходьбе.', material: '100% полиэстер' },
    en: { name: 'Pleated Skirt “Golden Autumn”', desc: 'A finely pleated midi skirt that moves beautifully as you walk.', material: '100% polyester' },
  },
  'au-m-1': {
    ru: { name: 'Куртка-рубашка «Vendemmia»', desc: 'Плотный овершот в клетку: можно носить и как рубашку, и как лёгкую куртку.', material: '70% хлопок, 30% шерсть' },
    en: { name: 'Overshirt “Vendemmia”', desc: 'A heavy checked overshirt: wear it as a shirt or as a light jacket.', material: '70% cotton, 30% wool' },
  },
  'au-m-2': {
    ru: { name: 'Худи «Осенний ветер»', desc: 'Тёплое худи с начёсом и двойным капюшоном.', material: 'Футер с начёсом: 80% хлопок, 20% полиэстер' },
    en: { name: 'Hoodie “Autumn Wind”', desc: 'A warm brushed-fleece hoodie with a double-layer hood.', material: 'Brushed terry: 80% cotton, 20% polyester' },
  },
  'au-m-3': {
    ru: { name: 'Джинсы прямые «Октябрь»', desc: 'Классические прямые джинсы со средней посадкой.', material: '99% хлопок, 1% эластан' },
    en: { name: 'Straight Jeans “October”', desc: 'Classic mid-rise straight-leg jeans.', material: '99% cotton, 1% elastane' },
  },
  'au-k-1': {
    ru: { name: 'Куртка демисезонная «Ёжик»', desc: 'Тёплая куртка на +5…+15° со светоотражающими элементами и съёмным капюшоном.', material: 'Полиэстер, утеплитель 80 г/м²' },
    en: { name: 'Transitional Jacket “Hedgehog”', desc: 'A warm jacket for +5…+15°C with reflective details and a detachable hood.', material: 'Polyester, 80 g/m² insulation' },
  },
  'au-k-2': {
    ru: { name: 'Свитшот «Каштаны»', desc: 'Свитшот с принтом каштанов: для школы и прогулок.', material: '100% хлопок' },
    en: { name: 'Sweatshirt “Chestnuts”', desc: 'A chestnut-print sweatshirt for school and walks.', material: '100% cotton' },
  },
  'au-k-3': {
    ru: { name: 'Шапка и шарф «Опята»', desc: 'Комплект из шапки и длинного шарфа. Мягкий, не колется.', material: '100% акрил, не колется' },
    en: { name: 'Hat & Scarf “Mushrooms”', desc: 'A hat and long scarf set. Soft and not itchy.', material: '100% acrylic, non-itchy' },
  },

  // ---------- ЗИМА ----------
  'wi-w-1': {
    ru: { name: 'Пуховик «L\'Inverno»', desc: 'Длинный пуховик до колена с капюшоном. Держит тепло до −25°.', material: 'Верх — полиамид; наполнитель: 90% пух, 10% перо' },
    en: { name: 'Down Coat “L’Inverno”', desc: 'A knee-length hooded down coat. Keeps you warm down to −25°C.', material: 'Shell: polyamide; fill: 90% down, 10% feather' },
  },
  'wi-w-2': {
    ru: { name: 'Свитер с горлом «Снежинка»', desc: 'Свитер крупной вязки с высоким горлом и едва заметным узором из снежинок.', material: '30% шерсть, 70% акрил' },
    en: { name: 'Turtleneck Sweater “Snowflake”', desc: 'A chunky-knit turtleneck with a subtle snowflake pattern.', material: '30% wool, 70% acrylic' },
  },
  'wi-w-3': {
    ru: { name: 'Термолосины «Мороз»', desc: 'Плотные лосины с мягким начёсом внутри: под платье, свитшот или пуховик.', material: '90% полиэстер, 10% эластан, начёс' },
    en: { name: 'Thermal Leggings “Frost”', desc: 'Thick leggings with a soft brushed inside, to wear under a dress, sweatshirt or down coat.', material: '90% polyester, 10% elastane, brushed inside' },
  },
  'wi-m-1': {
    ru: { name: 'Парка «Метель»', desc: 'Удлинённая парка с капюшоном с искусственным мехом и ветрозащитной планкой.', material: 'Верх — 100% нейлон; утеплитель 200 г/м²' },
    en: { name: 'Parka “Blizzard”', desc: 'A longline parka with a faux-fur hood and a windproof placket.', material: 'Shell: 100% nylon; 200 g/m² insulation' },
  },
  'wi-m-2': {
    ru: { name: 'Свитер «Норвежский узор»', desc: 'Классический свитер с норвежским орнаментом: новогоднее настроение гарантировано.', material: '50% шерсть, 50% акрил' },
    en: { name: 'Sweater “Nordic Pattern”', desc: 'A classic Nordic-pattern sweater. Festive mood guaranteed.', material: '50% wool, 50% acrylic' },
  },
  'wi-m-3': {
    ru: { name: 'Утеплённые брюки «Largo»', desc: 'Не продуваются, отталкивают снег, внутри тёплая флисовая подкладка.', material: 'Софтшелл на флисе: 94% полиэстер, 6% эластан' },
    en: { name: 'Insulated Trousers “Largo”', desc: 'Windproof and snow-repellent, with a warm fleece lining inside.', material: 'Fleece-lined softshell: 94% polyester, 6% elastane' },
  },
  'wi-k-1': {
    ru: { name: 'Комбинезон «Снеговичок»', desc: 'Зимний комбинезон до −25°: можно валяться в снегу сколько угодно.', material: 'Мембрана 5000 мм; утеплитель 250 г/м²' },
    en: { name: 'Snowsuit “Little Snowman”', desc: 'A winter snowsuit rated to −25°C, made for rolling in the snow as long as you like.', material: '5000 mm membrane; 250 g/m² insulation' },
  },
  'wi-k-2': {
    ru: { name: 'Шапка-шлем «Помпончик»', desc: 'Закрывает ушки и шею, а большой помпон радует и детей, и родителей.', material: '50% шерсть мериноса, 50% акрил; флисовая подкладка' },
    en: { name: 'Balaclava Hat “Pom-Pom”', desc: 'Covers the ears and neck, and the big pom-pom delights kids and parents alike.', material: '50% merino wool, 50% acrylic; fleece lining' },
  },
  'wi-k-3': {
    ru: { name: 'Флисовая кофта «Полярка»', desc: 'Тёплая флисовая кофта на молнии: под комбинезон или на прогулку в тёплый день.', material: '100% полиэстер (флис 260 г/м²)' },
    en: { name: 'Fleece Jacket “Polar”', desc: 'A warm zip-up fleece to wear under a snowsuit or on its own on milder days.', material: '100% polyester (260 g/m² fleece)' },
  },
};
