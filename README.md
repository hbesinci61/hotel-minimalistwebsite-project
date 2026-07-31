# Vela Hotel

İstanbul Galata'da kurgusal bir butik otel için tasarlanmış tanıtım sitesi.
Fotoğraf kullanmadan, yalnızca tipografi ve boşlukla kurulmuş bir tasarım denemesi.

**[Canlı demo → otel1website.vercel.app](https://otel1website.vercel.app)**

[![Vela Hotel ana sayfası](docs/screenshot.jpg)](https://otel1website.vercel.app)

## Neler var

- **İki dil** — Türkçe ve İngilizce, ayrı adreslerle (`/tr/odalar` ↔ `/en/rooms`)
- **Açık ve koyu tema** — sistem tercihini izler, tek tıkla değiştirilebilir
- **Rezervasyon formu** — tarih, oda tipi ve kişi sayısı doğrulanır; JavaScript kapalıyken bile çalışır
- **Arama motorlarına hazır** — her sayfa build sırasında statik üretilir, canonical ve hreflang etiketleri otomatik
- **Erişilebilir** — WCAG AA kontrast oranları, klavyeyle tam gezinme, görünür odak halkası

## Tasarım notu

Otel sitelerinde en çok göze batan şey vasat stok fotoğraftır. Bu projede
fotoğraf hiç kullanılmadı; onun yerine iri serif başlıklar, ince çizgiler ve
sayılar (24 oda, 1890, 250 m) kompozisyonu taşıyor.

Otelin bütün bilgileri tek bir dosyada (`src/content/hotel.ts`) tutuluyor.
Ekranda görünen metin de arama motorlarına giden veri de aynı kaynaktan
besleniyor, böylece ikisi birbirinden ayrışamıyor.

## Kurulum

```bash
npm install
npm run dev
```

Tarayıcıda [localhost:3000](http://localhost:3000) adresini açın.

## Teknolojiler

Next.js 16 · TypeScript · Tailwind CSS v4 · next-intl

## Ölçümler

Canlı sitede, Lighthouse mobil (4 koşunun medyanı):

| Performance | Accessibility | Best Practices | SEO |
|---|---|---|---|
| 97 | 100 | 100 | 100 |

LCP 1.6 s · CLS 0

## Not

Vela Hotel gerçek bir işletme değildir. Adres, telefon, fiyatlar ve misafir
yorumları örnek veridir. Bu depo bir portfolyo çalışmasıdır.
