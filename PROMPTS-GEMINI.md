# Вивальди — анализ рынка и промпты для Gemini

## 1. Краткий анализ рынка одежды Украины (для фото и подачи)

> Обзор составлен по общим знаниям о рынке, без свежих данных, — для учебного проекта этого достаточно.

**Кто задаёт стандарты онлайн-витрины:** маркетплейсы (Rozetka, Kasta, Prom, Answear, Intertop) и масс-маркет-бренды (LC Waikiki, Sinsay, Reserved, H&M, Zara, Mango), а также украинские бренды, которые продают через Instagram и свои сайты.

**Что общего в фотографиях товаров у лидеров:**
| Приём | Как делают | Что берём мы |
|---|---|---|
| Фон | Светло-серый или белый бесшовный, иногда тёплый пастельный | Пастельный фон **в цвет сезона** (это фишка «Вивальди») |
| Формат | Вертикальный 3:4 (на маркетплейсах иногда 1:1) | **3:4**, 1200×1600 px |
| Кадры | 1 — на модели в полный рост, 2 — flat lay или деталь, 3–5 — ракурсы | **2 фото**: модель + flat lay |
| Свет | Мягкий студийный, без жёстких теней | Мягкий, тёплый, «уютный» |
| Модели | Естественные позы, разные типы внешности, дети — в игре | Семейная, тёплая подача |
| Баннеры | Lifestyle-съёмка: улица, природа, семья | 4 сезонных баннера |

**Тренды масс-маркета:** базовые вещи нейтральных цветов, oversize-трикотаж, лён летом, длинные пуховики и парки зимой, family look (одинаковые вещи для родителей и детей), практичная детская одежда (мембрана, флис), упор на состав ткани и честную таблицу размеров.

**Вывод для сайта:** единый стиль фото (одинаковые свет, ракурс и формат), цвет фона по сезону, у каждого товара минимум 2 фото, семейные lifestyle-баннеры для каждого сезона.

---

## 2. Логотип

```
Minimalist vector logo for a clothing brand called "Vivaldi". A classical violin standing upright, with a single soft yarn thread unwinding from a small ball of wool at the bottom and elegantly spiraling around the violin body and neck, like a musical staff line. The thread subtly changes color along its length through four seasons: fresh light green (spring), rich green (summer), warm orange-yellow (autumn), icy blue (winter). The violin in warm deep burgundy-brown wood tone. Flat design, clean line art, smooth curves, cozy and elegant feel, centered composition, plain white background, no text, high contrast, suitable for a favicon and a website header.
```
Вариант с надписью — добавьте в конец: `Below the emblem the word "Вівальді" in an elegant serif typeface.`

Сохраните как `images/logo.png` (лучше с прозрачным фоном) — сайт подхватит его сам.

---

## 3. Сезонные баннеры (lifestyle)

Сохраните как `images/hero-spring.jpg`, `hero-summer.jpg`, `hero-autumn.jpg`, `hero-winter.jpg` (горизонтально, 16:9).

**Весна**
```
Warm lifestyle photo for a mass-market family clothing brand: a happy family (mother, father, two kids) walking in a blooming spring park with cherry blossoms, wearing light trench coat, bomber jacket, cardigan and kids windbreakers in pastel light-green, beige and pink tones. Soft morning sunlight, cozy atmosphere, natural candid poses, shallow depth of field, horizontal 16:9, no text, no logos.
```
**Лето**
```
Warm lifestyle photo for a mass-market family clothing brand: a family on a sunny summer meadow near a lake, wearing linen dress, linen shirt, cotton t-shirts, shorts and a kids panama hat in white, sand and saturated green tones. Bright golden hour light, joyful candid moment, horizontal 16:9, no text, no logos.
```
**Осень**
```
Warm cozy lifestyle photo for a mass-market family clothing brand: a family walking through an autumn alley with golden and orange fallen leaves, wearing wool coat, oversize knitted sweaters, hoodies and a kids demi-season jacket in mustard, orange, camel and brown tones. Soft warm afternoon light, kids throwing leaves, horizontal 16:9, no text, no logos.
```
**Зима**
```
Cozy lifestyle photo for a mass-market family clothing brand: a family in a snowy winter forest, wearing a long white down coat, navy parka, Nordic-pattern sweater and a kids light-blue winter jumpsuit with pompom hat. Soft snowfall, blue and white palette with warm skin tones, joyful candid moment, horizontal 16:9, no text, no logos.
```

---

## 4. Фото товаров (36 шт.)

**Как пользоваться.** Каждый промпт ниже — фото №1 (на модели). Сохраните результат как `images/products/<код>-1.jpg`.
Для фото №2 в **том же чате Gemini** напишите:
```
Now the same garment as a flat lay, top-down view, neatly folded/arranged on the same background, no model, same lighting, vertical 3:4.
```
и сохраните как `<код>-2.jpg`. Пока файлов нет, сайт показывает цветные заглушки.

**Общий стиль (уже вшит в каждый промпт):** `Professional e-commerce catalog photo, vertical 3:4, soft diffused studio light, seamless pastel background, full garment visible, true-to-life colors, realistic fabric texture, no text, no logos, no watermark.`

### 🌱 Весна (фон — светло-салатовый `#E8F5D6`)
| Код | Промпт |
|---|---|
| sp-w-1 | `Professional e-commerce catalog photo, vertical 3:4: a young woman wearing a classic beige double-breasted cotton trench coat with belt, knee length, over a white top and light jeans, full body, relaxed pose, seamless pastel light-green background, soft diffused studio light, realistic fabric texture, no text, no logos.` |
| sp-w-2 | `Professional e-commerce catalog photo, vertical 3:4: a woman wearing a flowing midi viscose dress with a small pink and white floral print, short puff sleeves, V-neck, full body, seamless pastel light-green background, soft studio light, no text, no logos.` |
| sp-w-3 | `Professional e-commerce catalog photo, vertical 3:4: a woman wearing a soft mint-green knitted cotton cardigan with pearl buttons over a white t-shirt and beige trousers, three-quarter shot, seamless pastel light-green background, soft studio light, no text, no logos.` |
| sp-m-1 | `Professional e-commerce catalog photo, vertical 3:4: a young man wearing an olive-green lightweight nylon bomber jacket with ribbed cuffs over a white t-shirt and beige chinos, full body, seamless pastel light-green background, soft studio light, no text, no logos.` |
| sp-m-2 | `Professional e-commerce catalog photo, vertical 3:4: a man wearing a light-blue cotton Oxford button-down shirt, sleeves slightly rolled, tucked into grey chinos, three-quarter shot, seamless pastel light-green background, soft studio light, no text, no logos.` |
| sp-m-3 | `Professional e-commerce catalog photo, vertical 3:4: a man wearing slim beige cotton chino trousers with a white t-shirt and white sneakers, full body, seamless pastel light-green background, soft studio light, focus on trousers fit, no text, no logos.` |
| sp-k-1 | `Professional e-commerce catalog photo, vertical 3:4: a smiling 6-year-old child wearing a bright yellow lightweight hooded windbreaker jacket with zipper, jeans and sneakers, playful pose, seamless pastel light-green background, soft studio light, no text, no logos.` |
| sp-k-2 | `Professional e-commerce catalog photo, vertical 3:4: a cheerful 7-year-old child wearing a light-blue cotton hoodie with a cute print of small singing birds on the chest, full body, seamless pastel light-green background, soft studio light, no text, no logos.` |
| sp-k-3 | `Professional e-commerce catalog photo, vertical 3:4: a 6-year-old child wearing classic medium-blue denim jeans with a white t-shirt and sneakers, full body, playful jumping pose, seamless pastel light-green background, soft studio light, no text, no logos.` |

### ☀️ Лето (фон — светло-зелёный `#DFF3E4`)
| Код | Промпт |
|---|---|
| su-w-1 | `Professional e-commerce catalog photo, vertical 3:4: a woman wearing a white linen sundress with thin straps, midi length, slightly wrinkled natural linen texture, straw sandals, full body, seamless pastel green background, bright soft summer light, no text, no logos.` |
| su-w-2 | `Professional e-commerce catalog photo, vertical 3:4: a woman wearing a fitted white cotton camisole top with thin straps tucked into denim shorts, three-quarter shot, seamless pastel green background, soft bright light, no text, no logos.` |
| su-w-3 | `Professional e-commerce catalog photo, vertical 3:4: a woman wearing high-waisted medium-blue denim shorts with frayed hem and a white t-shirt, full body, seamless pastel green background, soft bright light, no text, no logos.` |
| su-m-1 | `Professional e-commerce catalog photo, vertical 3:4: a man wearing a plain white basic crew-neck cotton t-shirt, regular fit, with beige shorts, three-quarter shot, seamless pastel green background, soft bright light, no text, no logos.` |
| su-m-2 | `Professional e-commerce catalog photo, vertical 3:4: a man wearing a white relaxed-fit linen shirt with open collar, sleeves rolled up, beige linen trousers, full body, seamless pastel green background, soft summer light, no text, no logos.` |
| su-m-3 | `Professional e-commerce catalog photo, vertical 3:4: a man wearing olive-green cotton cargo shorts with side pockets and a white t-shirt, full body, seamless pastel green background, soft bright light, no text, no logos.` |
| su-k-1 | `Professional e-commerce catalog photo, vertical 3:4: a happy 5-year-old child wearing a matching summer set — yellow cotton t-shirt with a small sun print and green cotton shorts, full body, seamless pastel green background, soft bright light, no text, no logos.` |
| su-k-2 | `Professional e-commerce catalog photo, vertical 3:4: a smiling 4-year-old child wearing a white cotton bucket panama hat, close-up portrait from chest up, seamless pastel green background, soft bright light, no text, no logos.` |
| su-k-3 | `Professional e-commerce catalog photo, vertical 3:4: a 6-year-old girl wearing a white cotton summer dress with a small daisy print and frill hem, full body, twirling, seamless pastel green background, soft bright light, no text, no logos.` |

### 🍂 Осень (фон — тёплый персиковый `#FFE8C7`)
| Код | Промпт |
|---|---|
| au-w-1 | `Professional e-commerce catalog photo, vertical 3:4: a woman wearing a long camel-brown wool-blend coat with wide lapels over a beige knit sweater and dark trousers, full body, seamless warm peach background, soft warm studio light, no text, no logos.` |
| au-w-2 | `Professional e-commerce catalog photo, vertical 3:4: a woman wearing a chunky oversize pumpkin-orange knitted sweater with dropped shoulders and jeans, cozy pose holding sleeves, three-quarter shot, seamless warm peach background, soft warm light, no text, no logos.` |
| au-w-3 | `Professional e-commerce catalog photo, vertical 3:4: a woman wearing a mustard-yellow pleated midi skirt with a tucked-in cream knit top and ankle boots, full body, seamless warm peach background, soft warm light, no text, no logos.` |
| au-m-1 | `Professional e-commerce catalog photo, vertical 3:4: a man wearing a brown checked wool-blend overshirt jacket over a grey hoodie and jeans, full body, seamless warm peach background, soft warm light, no text, no logos.` |
| au-m-2 | `Professional e-commerce catalog photo, vertical 3:4: a man wearing a plain orange cotton fleece hoodie with kangaroo pocket, relaxed fit, with dark jeans, three-quarter shot, seamless warm peach background, soft warm light, no text, no logos.` |
| au-m-3 | `Professional e-commerce catalog photo, vertical 3:4: a man wearing straight-leg medium-blue denim jeans with a tucked cream sweater and brown boots, full body, seamless warm peach background, soft warm light, no text, no logos.` |
| au-k-1 | `Professional e-commerce catalog photo, vertical 3:4: a smiling 6-year-old child wearing an orange insulated demi-season hooded jacket with zipper and reflective details, jeans and boots, full body, seamless warm peach background, soft warm light, no text, no logos.` |
| au-k-2 | `Professional e-commerce catalog photo, vertical 3:4: a 7-year-old child wearing a mustard-yellow cotton sweatshirt with a cute chestnut print, full body, seamless warm peach background, soft warm light, no text, no logos.` |
| au-k-3 | `Professional e-commerce catalog photo, vertical 3:4: a 5-year-old child wearing a matching orange knitted beanie hat and long scarf set, portrait from waist up, seamless warm peach background, soft warm light, no text, no logos.` |

### ❄️ Зима (фон — ледяной голубой `#DCE8FB`)
| Код | Промпт |
|---|---|
| wi-w-1 | `Professional e-commerce catalog photo, vertical 3:4: a woman wearing a long white quilted down puffer coat with hood, knee length, full body, seamless icy light-blue background, soft cool studio light, no text, no logos.` |
| wi-w-2 | `Professional e-commerce catalog photo, vertical 3:4: a woman wearing a white chunky knit turtleneck sweater with a subtle snowflake pattern, three-quarter shot, seamless icy light-blue background, soft cool light, no text, no logos.` |
| wi-w-3 | `Professional e-commerce catalog photo, vertical 3:4: a woman wearing black brushed-fleece thermal leggings with a long grey knit sweater and winter boots, full body, seamless icy light-blue background, soft cool light, no text, no logos.` |
| wi-m-1 | `Professional e-commerce catalog photo, vertical 3:4: a man wearing a navy-blue insulated winter parka with a faux-fur trimmed hood, mid-thigh length, full body, seamless icy light-blue background, soft cool light, no text, no logos.` |
| wi-m-2 | `Professional e-commerce catalog photo, vertical 3:4: a man wearing a navy and white Nordic-pattern wool-blend knit sweater with crew neck, three-quarter shot, seamless icy light-blue background, soft cool light, no text, no logos.` |
| wi-m-3 | `Professional e-commerce catalog photo, vertical 3:4: a man wearing black fleece-lined softshell winter trousers with a grey sweater and winter boots, full body, seamless icy light-blue background, soft cool light, no text, no logos.` |
| wi-k-1 | `Professional e-commerce catalog photo, vertical 3:4: a happy 4-year-old child wearing a light-blue one-piece insulated winter snowsuit with hood and reflective strips, full body, seamless icy light-blue background, soft cool light, no text, no logos.` |
| wi-k-2 | `Professional e-commerce catalog photo, vertical 3:4: a smiling 5-year-old child wearing a white knitted balaclava hat with a big pompom, portrait from chest up, seamless icy light-blue background, soft cool light, no text, no logos.` |
| wi-k-3 | `Professional e-commerce catalog photo, vertical 3:4: a 7-year-old child wearing a royal-blue polar fleece zip-up jacket, full body, seamless icy light-blue background, soft cool light, no text, no logos.` |

---

## 5. Советы по Gemini
- Промпты на английском дают более стабильный результат; описания на сайте — на украинском.
- Если Gemini добавляет надписи или логотипы — допишите `absolutely no text or letters on the image`.
- Делайте все фото одного сезона в одном чате, чтобы фон и свет были одинаковыми.
- Перед загрузкой на сайт сожмите фото (например, через squoosh.app) до ~200 КБ.

---

## 6. Фото №2 v2 — все расцветки на одном кадре

Вместо обычного flat lay вторым фото показываем **все цвета модели рядом**. Каждый цвет занимает равную часть кадра: 2 цвета — по 1/2, 3 цвета — по 1/3. На сайте при выборе цвета, отличного от того, что на модели, открывается именно это фото.

**Шаблон** (подставьте вещь, число и цвета, фон сезона):
```
Generate an image: Professional e-commerce catalog flat lay photo, vertical 3:4, top-down view: {N} identical {garment} laid side by side in equal parts of the frame, one in each color: {colors}. Same cut and size, evenly spaced, each fully visible, no overlap, seamless {background} background, soft diffused studio light, no model, absolutely no text, letters or logos.
```
Фоны: весна `pastel light-green`, лето `pastel green`, осень `warm peach`, зима `icy light-blue`.

| Код | Вещь (garment) | Цвета |
|---|---|---|
| sp-w-1 | classic belted double-breasted cotton trench coats | beige, olive green |
| sp-w-2 | midi viscose dresses with small floral print and puff sleeves | pastel pink floral, white floral |
| sp-w-3 | knitted cotton cardigans with pearl buttons | mint green, white |
| sp-m-1 | lightweight nylon bomber jackets | olive green, navy blue |
| sp-m-2 | cotton Oxford button-down shirts | light blue, white |
| sp-m-3 | slim cotton chino trousers | beige, grey |
| sp-k-1 | kids hooded windbreaker jackets | bright yellow, mint green |
| sp-k-2 | kids hoodies with a small singing-birds print | light blue, pastel pink |
| sp-k-3 | kids denim jeans | medium blue (1 цвет — обычный flat lay) |
| su-w-1 | linen midi sundresses with thin straps | white, sage green |
| su-w-2 | cotton camisole tops with thin straps | white, black, yellow |
| su-w-3 | high-waisted denim shorts with frayed hem | medium blue, light blue |
| su-m-1 | basic crew-neck cotton t-shirts | white, black, green, navy blue |
| su-m-2 | relaxed-fit linen shirts | white, beige, light blue |
| su-m-3 | cotton cargo shorts | olive green, beige |
| su-k-1 | kids sets of t-shirt with sun print and shorts | yellow, green |
| su-k-2 | kids cotton bucket panama hats | white, yellow |
| su-k-3 | girls' summer dresses with daisy print and frill hem | white, pastel pink |
| au-w-1 | long wool-blend coats with wide lapels | camel brown, grey |
| au-w-2 | chunky oversize knitted sweaters | pumpkin orange, beige |
| au-w-3 | pleated midi skirts | mustard yellow, brown |
| au-m-1 | checked wool-blend overshirt jackets | brown, olive green |
| au-m-2 | fleece hoodies with kangaroo pocket | orange, grey, black |
| au-m-3 | straight-leg denim jeans | medium blue, black |
| au-k-1 | kids insulated demi-season hooded jackets | orange, navy blue |
| au-k-2 | kids sweatshirts with chestnut print | mustard yellow, beige |
| au-k-3 | kids knitted beanie and long scarf sets | orange, grey |
| wi-w-1 | long quilted down puffer coats with hood | white, navy blue, black |
| wi-w-2 | chunky knit turtleneck sweaters with snowflake pattern | white, light blue |
| wi-w-3 | brushed-fleece thermal leggings | black, grey |
| wi-m-1 | insulated parkas with faux-fur trimmed hood | navy blue, olive green |
| wi-m-2 | Nordic-pattern wool-blend knit sweaters | navy blue, grey |
| wi-m-3 | fleece-lined softshell winter trousers | black, grey |
| wi-k-1 | kids one-piece insulated winter snowsuits with hood | light blue, pastel pink, red |
| wi-k-2 | kids knitted balaclava hats with big pompom | white, royal blue, pastel pink |
| wi-k-3 | kids polar fleece zip-up jackets | royal blue, red |
