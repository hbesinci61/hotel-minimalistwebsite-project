# Vela Hotel

İstanbul Galata'da kurgusal bir butik otel için tasarlanmış tanıtım sitesi.
Fotoğraf kullanmadan, yalnızca tipografi ve boşlukla kurulmuş bir tasarım denemesi.

![Vela Hotel ana sayfası](docs/screenshot.jpg)

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

## Not

Vela Hotel gerçek bir işletme değildir. Adres, telefon, fiyatlar ve misafir
yorumları örnek veridir. Bu depo bir portfolyo çalışmasıdır.
