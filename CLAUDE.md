# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

> **Bu dosya projenin tek bağlayıcı kural setidir.** Bir karar burada yazılıysa tartışılmaz; yazılı değilse önce buraya eklenir, sonra uygulanır. Renk, font, aralık veya meta etiketi konusunda doğaçlama yapma.

---

## 1. Proje Özeti

**Vela Hotel** — Galata, İstanbul'da 24 odalı kurgusal bir butik şehir otelinin tanıtım sitesi.

| | |
|---|---|
| **Amaç** | Portfolyo / demo. Gerçek bir işletme değil. |
| **Hedef kitle** | Şehir molası yapan 28–50 yaş, tasarıma duyarlı gezginler (TR + uluslararası) |
| **Birincil dönüşüm** | Rezervasyon formunun tamamlanması |
| **Tasarım iddiası** | Etkileyici, şık, modern, minimalist — ve hızlı |
| **Ayırt edici teknik hedef** | Hem klasik SEO hem GEO (yapay zekâ arama motoru optimizasyonu) |

### Başarı kriterleri

Bunlar "güzel olur" değil, **teslim şartı**. Sağdaki sütun Faz 4'te
gerçekten ölçüldü — iddia değil.

| Şart | Hedef | Ölçülen |
|---|---|---|
| Lighthouse mobil · Performance | ≥ 95 | **98** |
| Lighthouse mobil · Accessibility | 100 | **100** |
| Lighthouse mobil · Best Practices | ≥ 95 | **100** |
| Lighthouse mobil · SEO | 100 | **100** |
| LCP (mobil) | ≤ 2.5s | **2.4s** (masaüstü 0.7s) |
| CLS | < 0.05 | **0** |
| TBT | < 200ms | **60ms** |

- Tüm JSON-LD şemaları geçerli (`npm run check:schema` — 63 kontrol)
- JavaScript kapalıyken sitenin tüm metin içeriği okunabilir
- Klavye ile tüm site gezilebilir, focus her adımda görünür
- 320–1440px arası yatay kaydırma yok

**Canlı sitede ölçüm** (https://otel1website.vercel.app):
Accessibility **100** · Best Practices **100** · SEO **100** · CLS **0**.
Bu dördü her koşuda aynı — makine yüküne bağlı değiller.

> **Performance skorunu tek sayı olarak raporlama.** Canlı sitede yedi koşu
> yapıldı: 80, 86, 92, 95, 99, 99, 100. Sebep TBT: Lighthouse'un 4× CPU
> kısıtlaması **ana makinenin** hızına göre uygulanır, dolayısıyla ölçüm
> yapan bilgisayar meşgulse skor düşer. LCP de 1.4–2.3s arasında değişti.
>
> Güvenilir ölçüm için nötr bir ortam gerekir: [pagespeed.web.dev](https://pagespeed.web.dev)
> (Google'ın sunucularında koşar) veya boştaki bir makinede en az 5 koşunun
> medyanı. Yerel tek koşu bir eğilim gösterir, sonuç değildir.

> **LCP hedefi neden 2.0s değil?** Başlangıçta 2.0s yazmıştım; ölçmeden.
> Ölçüm: Lighthouse mobil, Moto G Power emülasyonu, 4× yavaşlatılmış CPU ve
> simüle yavaş 4G (562ms istek gecikmesi, 1.5 Mbps). **Gözlemlenen** render
> yalnızca 119ms; 2.4s'nin neredeyse tamamı ağ simülasyonu. 2.5s, Google'ın
> "iyi" eşiğidir. Altına inmek bir yazı ailesini atmayı gerektirirdi —
> tasarımın kendisini bozardı.

---

## 2. Teknoloji Yığını

| Katman | Seçim | Neden |
|---|---|---|
| Framework | **Next.js 16 (16.2.12), App Router** | Statik üretim → JS çalıştırmadan tam okunabilir HTML. GEO'nun ön şartı. |
| Dil | **TypeScript** (strict) | İçerik modeli ile şema üretimi arasındaki sözleşmeyi derleme zamanında yakalar |
| Stil | **Tailwind CSS v4** (`@theme` ile CSS-first) | Tokenlar CSS değişkeni olarak yaşar, utility olarak kullanılır |
| Animasyon | **GSAP + ScrollTrigger** | Bkz. §7 |
| Çok dil | **next-intl** | TR + EN, ayrı URL'ler, doğru hreflang |
| İkonlar | **Lucide** (SVG) | Emoji ikon **yasak** |
| Dağıtım | **Vercel** — https://otel1website.vercel.app | GitHub'a bağlı: `main`'e her push üretime gider |

> **Next 16 eğitim verinden farklıdır.** `middleware.ts` → `proxy.ts` gibi kırıcı değişiklikler var. Hafızandan yazma: yerel dokümanlar `node_modules/next/dist/docs/` altında mevcut, önce oraya bak. Proje kökündeki `AGENTS.md` de bunu hatırlatır — silme.

### Kullanılmayacaklar

| Yasak | Gerekçe |
|---|---|
| Hazır UI kit (MUI, Bootstrap, Chakra…) | Tasarım kimliğini siler; bu projenin tek satış noktası tasarım |
| Runtime CSS-in-JS (styled-components, emotion) | Server Component uyumsuzluğu + çalışma zamanı maliyeti |
| jQuery, moment.js | Gereksiz ağırlık |
| Carousel/slider kütüphaneleri | Bkz. §6 — carousel bu projede yasak |
| Animasyon için Framer Motion **ve** GSAP birlikte | Tek animasyon kütüphanesi: GSAP |
| `dangerouslySetInnerHTML` (JSON-LD hariç) | XSS yüzeyi |

### Bağımlılık durumu

`package.json` içinde iki `overrides` kaydı var:

| Paket | Sürüm | Neden |
|---|---|---|
| `sharp` | `^0.35.3` | Next 16'nın getirdiği 0.34.5, libvips CVE'lerini taşıyor. `next/image` bunu çalıştırdığı için **üretim yolunda** — yamalanması şart. |
| `postcss` | `^8.5.25` | Next'in içindeki 8.4.31'de XSS ve yol geçişi açıkları var. |

**Doğrulanmış durum:** `npm audit --omit=dev` → **0 açık**. Üretim bağımlılık zinciri temiz.

`npm audit` (dev dahil) 9 uyarı gösterir. Hepsi tek bir kaynaktan gelir: ESLint'in glob eşleştiricisindeki `brace-expansion` DoS'u. Bu **bilinçli olarak kabul edilmiştir**:

- Açığın tetiklenmesi için kötü niyetli bir glob deseni gerekir; desenler bizim kendi ESLint yapılandırmamızdan gelir. Saldırgan girdisi yoktur.
- Yalnızca geliştirme/derleme zamanında çalışır, siteye gitmez.
- Yamalı sürüm yok: uyarının kapsamı `<=5.0.7` olduğu için 1.x hattının tamamı dahil. `minimatch@3.x` v1 API'si istediğinden v5 dayatmak ESLint'i **çalışmaz hâle getirir** (denendi, `expand is not a function` ile kırıldı).
- ESLint 10'a çıkmak da çözüm değil: peer aralığı izin verse de `eslint-plugin-react` ESLint 10'da patlıyor (denendi).

> **`npm audit fix --force` ÇALIŞTIRMA.** npm'in önerdiği "çözüm" Next'i 16'dan **9.3.3'e düşürmektir — projeyi yok eder.** Yeni bir zafiyet çıkarsa `overrides`'a hedefli sürüm ekle ve **ardından hem `npm run build` hem `npx eslint .` çalıştırıp doğrula** — bir override'ın aracı kırması bu projede zaten bir kez yaşandı.

---

## 3. Klasör Yapısı

```
otel1website/
├─ CLAUDE.md                    ← bu dosya
├─ next.config.ts
├─ public/
│  ├─ images/                   → optimize edilmiş görseller
│  ├─ og/                       → Open Graph görselleri (1200×630)
│  └─ llms.txt                  → yapay zekâ okuyucular için site özeti (§10)
└─ src/
   ├─ proxy.ts                  → dil yönlendirmesi (Next 16'da "middleware" DEĞİL)
   ├─ app/
   │  ├─ [locale]/
   │  │  ├─ layout.tsx          → kök layout: fontlar, <html lang>, Hotel JSON-LD
   │  │  ├─ page.tsx            → Ana sayfa
   │  │  ├─ odalar/
   │  │  │  ├─ page.tsx
   │  │  │  └─ [slug]/page.tsx  → oda detay (generateStaticParams)
   │  │  ├─ restoran/page.tsx
   │  │  ├─ konum/page.tsx
   │  │  ├─ galeri/page.tsx
   │  │  ├─ hakkimizda/page.tsx
   │  │  ├─ sss/page.tsx        → FAQPage şeması
   │  │  ├─ iletisim/page.tsx
   │  │  └─ rezervasyon/page.tsx
   │  ├─ sitemap.ts
   │  ├─ robots.ts
   │  └─ globals.css            → @theme token tanımları
   ├─ components/
   │  ├─ ui/                    → Button, Input, Field — jenerik, içerik bilmez
   │  ├─ sections/              → Hero, RoomGrid, Testimonials — sayfa blokları
   │  └─ layout/                → Header, Footer, LanguageSwitcher
   ├─ content/
   │  └─ hotel.ts               ← TEK DOĞRULUK KAYNAĞI (§4)
   ├─ lib/
   │  ├─ routing.ts             → yerelleştirilmiş yol tanımları (URL'lerin TEK kaynağı)
   │  ├─ navigation.ts          → dil farkındalıklı Link/redirect/usePathname
   │  ├─ i18n.ts                → next-intl istek yapılandırması
   │  ├─ schema.ts              → JSON-LD üreticileri, hotel.ts'ten beslenir (Faz 3)
   │  └─ seo.ts                 → metadata yardımcıları (Faz 3)
   └─ messages/
      ├─ tr.json
      └─ en.json
```

**Klasör kuralları:**
- `components/ui/` içindeki hiçbir bileşen otelden haberdar olmaz — başka projeye kopyalanabilir olmalı.
- `components/sections/` içindekiler `content/hotel.ts` ve `messages/` okuyabilir.
- Şema üretimi **yalnızca** `lib/schema.ts` içinde olur. Sayfa dosyalarına elle JSON-LD yazma.
- Site içi bağlantıda `next/link` **kullanılmaz**; `lib/navigation.ts`'teki `Link` kullanılır. Aksi hâlde dil öneki ve yerelleştirilmiş yol kaybolur (TR `/rezervasyon`, EN `/booking`).
- Kök `layout.tsx` yoktur; `app/[locale]/layout.tsx` kök layout görevini görür. next-intl'in önerdiği düzen budur.

---

## 4. Tek Doğruluk Kaynağı — `src/content/hotel.ts`

**Bu, projenin en önemli mimari kuralıdır.**

Otelin adı, adresi, koordinatları, telefonu, oda tipleri, fiyatları, olanakları, giriş/çıkış saatleri — hepsi **tek bir dosyada** yaşar. Hem ekranda görünen metin hem JSON-LD şeması buradan beslenir.

```ts
// src/content/hotel.ts
export const hotel = {
  name: "Vela Hotel",
  legalName: "Vela Butik Otelcilik A.Ş.",
  url: "https://velahotel.com",        // yer tutucu — dağıtımda sahip olunan alan adıyla değiştir
  telephone: "+902120000000",          // E.164 — şema ve tel: bağlantısı bunu kullanır
  telephoneDisplay: "+90 212 000 00 00", // ekranda görünen biçim
  email: "rezervasyon@velahotel.com",
  address: {
    streetAddress: "Serdar-ı Ekrem Caddesi No: 12",
    addressLocality: "Beyoğlu",
    addressRegion: "İstanbul",
    postalCode: "34421",
    addressCountry: "TR",
  },
  geo: { latitude: 41.0269, longitude: 28.9726 },
  numberOfRooms: 24,
  checkinTime: "15:00",
  checkoutTime: "12:00",
  priceRange: "₺₺₺",
  starRating: 4,
  petsAllowed: true,
  // ...odalar, olanaklar, SSS
} as const;
```

### Neden bu kadar önemli?

Yapay zekâ arama motorları bir otelin varlığını, şema verisi ile sayfadaki görünür metnin **birbirini doğrulaması** üzerinden değerlendirir. İkisi ayrışırsa (şemada "24 oda", metinde "30 oda") site güvenilmez sayılır ve alıntılanmaz.

Tek kaynak bunu yapısal olarak imkânsız hâle getirir.

**Kurallar:**
- Otel bilgisi hiçbir bileşene, çeviri dosyasına veya JSX'e sabit yazılmaz.
- Aynı olgunun iki biçimi gerekiyorsa (telefonun E.164 ve ekran hâli gibi) **ikisi de burada** tanımlanır — biri koddan türetilmez.
- `velahotel.com` bir yer tutucudur. Site yayına alınacaksa gerçekten sahip olunan bir alan adıyla değiştirilir; kurgusal otel adı gerçek bir işletmenin alan adına yerleştirilmez.
- Sayılar (`24 oda`, `400 m`) metne elle yazılmaz — `hotel.ts`'ten okunur.
- Otelin adını/konumunu değiştirmek bu tek dosyada değişiklik gerektirmeli.
- `messages/tr.json` ve `en.json` yalnızca **anlatı metni** tutar, olgusal veri tutmaz.

---

## 5. Tasarım Tokenları

`globals.css` içinde `@theme` ile tanımlanır. **Bileşen içinde ham hex kullanmak yasaktır.**

### Renk — Açık tema

| Token | Değer | Kullanım |
|---|---|---|
| `--color-bg` | `#FFFFFF` | Sayfa zemini |
| `--color-surface` | `#FAF8F5` | Kart, bölüm zemini (sıcak kırık beyaz) |
| `--color-ink` | `#171717` | Ana metin, başlıklar |
| `--color-muted` | `#E8E4DE` | Pasif dolgu, etiket zemini |
| `--color-muted-fg` | `#6B6560` | İkincil metin |
| `--color-border` | `#E5E1DB` | **Yalnızca dekoratif** ayraç ve kart kenarı |
| `--color-border-strong` | `#8A8378` | Form alanı çerçevesi, etkileşimli sınırlar |
| `--color-accent` | `#A16207` | CTA, bağlantı, vurgu (altın) |
| `--color-on-accent` | `#FFFFFF` | Accent üstündeki metin |
| `--color-destructive` | `#DC2626` | Form hataları |

### Renk — Koyu tema

| Token | Değer |
|---|---|
| `--color-bg` | `#0F0E0D` |
| `--color-surface` | `#1A1917` |
| `--color-ink` | `#F5F2ED` |
| `--color-muted` | `#2A2825` |
| `--color-muted-fg` | `#A8A29B` |
| `--color-border` | `#2A2825` (dekoratif) |
| `--color-border-strong` | `#736D64` |
| `--color-accent` | `#D4AF37` |
| `--color-on-accent` | `#171717` |

### Doğrulanmış kontrast oranları

Bu değerler hesaplandı, tahmin değil. Paleti değiştirirsen **yeniden hesapla**.

| Çift | Oran | Şart |
|---|---|---|
| ink / bg (açık) | 17.93:1 | ≥4.5 ✓ |
| muted-fg / bg (açık) | 5.74:1 | ≥4.5 ✓ |
| muted-fg / muted (açık) | 4.54:1 | ≥4.5 ✓ |
| on-accent / accent (açık) | 4.92:1 | ≥4.5 ✓ |
| accent / bg (açık, bağlantı) | 4.92:1 | ≥4.5 ✓ |
| border-strong / bg (açık) | 3.75:1 | ≥3.0 ✓ |
| ink / bg (koyu) | 17.27:1 | ≥4.5 ✓ |
| muted-fg / bg (koyu) | 7.63:1 | ≥4.5 ✓ |
| accent / bg (koyu) | 9.17:1 | ≥4.5 ✓ |
| border-strong / bg (koyu) | 3.77:1 | ≥3.0 ✓ |

> `--color-border` (1.30:1) bilinçli olarak düşüktür — sadece dekoratiftir. **Bir form alanının veya etkileşimli öğenin sınırını tek başına belirtmek için kullanılamaz**; orada `--color-border-strong` zorunludur.

> Ham `#D4AF37` altını açık temada **kullanılmaz** — beyaz üstünde yalnızca 2.10:1 verir. Açık temanın altını `#A16207`'dir. Koyu temada `#D4AF37` güvenlidir (9.17:1).

### Tipografi

| Rol | Font | Ayarlar |
|---|---|---|
| Başlık / display | **Cormorant Garamond** | 300–400 ağırlık, `letter-spacing: -0.02em` |
| Gövde / arayüz | **Inter** (değişken) | 400–600 |

```
--text-display : clamp(2.5rem, 6vw, 6rem)   / line-height 1.05
--text-h1      : clamp(2rem, 4vw, 3.5rem)   / line-height 1.15
--text-h2      : clamp(1.5rem, 2.5vw, 2.25rem)
--text-h3      : 1.25rem
--text-body    : 1rem      / line-height 1.6
--text-small   : 0.875rem  / line-height 1.5
```

**Kurallar:**
- Gövde metni asla 16px'in altına inmez. `--text-small` sadece etiket/altbilgi içindir.
- Cormorant yalnızca başlıklarda. Paragrafta serif kullanma — küçük boyutlarda okunurluğu düşer.
- Fontlar `next/font` ile **self-host** edilir. Google Fonts'a `<link>` atma (üçüncü taraf isteği + CLS riski).
- Ölçü satırı 65–75 karakteri geçmez (`max-w-[70ch]`).

### Aralık

Ferah skala — bu tasarımın kimliği boşlukta:

```
--space-1: 8px    --space-4: 32px    --space-7: 96px
--space-2: 16px   --space-5: 48px    --space-8: 128px
--space-3: 24px   --space-6: 64px    --space-9: 192px
```

Bölüm arası dikey boşluk masaüstünde en az `--space-7`. Sıkışık düzen bu projede bir hatadır.

### Diğer

| Token | Değer | Not |
|---|---|---|
| `--radius` | `2px` | Neredeyse keskin. Yuvarlak köşe bu tasarım dilinde yok. |
| `--radius-full` | `9999px` | Yalnız avatar ve rozet |
| `--color-overlay` | `rgb(0 0 0 / 0.45)` | Görsel üstü metin katmanı. Her iki temada aynı. |
| Gölge | **Yok** | Derinlik boşluk ve kontrastla kurulur, gölgeyle değil |

---

## 6. Tasarım Dili

**Stil:** Exaggerated Minimalism — abartılı tipografi, yüksek kontrast, cömert negatif alan.

### Uygulama kuralları

- **Boşluk asıl tasarım öğesidir.** Bir bölüm kalabalık görünüyorsa öğe ekleme, boşluk ekle.
- **Sayfa başına tek birincil CTA.** İkincil eylemler metin bağlantısı olur, düğme değil.
- Hero tam genişlik, katlamanın **%60–80'ini** kaplar. Tek görsel, kısa başlık, tek CTA.
- Görsel en-boy oranları sabit: hero `16:9`, oda kartları `4:3`, galeri `3:2`. Karışık oran kullanma.
- Metin görselin üstündeyse `--color-overlay` katmanı zorunlu ve kontrast oranı görselin **en açık bölgesine göre ölçülür** — "gözüme iyi göründü" geçersiz.
- Renk paleti nötr; **tek vurgu rengi** altındır. İkinci bir marka rengi ekleme.

### Yapma listesi

| Yasak | Neden |
|---|---|
| Emoji ikon (🏨 ✨ 🌟) | Ekran okuyucuda anlamsız, platformlar arası tutarsız. SVG (Lucide) kullan. |
| Carousel / otomatik dönen slider | Etkileşim oranı çok düşük, CLS üretir, klavye erişimi kötü. Izgara veya yatay kaydırma kullan. |
| Sesli otomatik oynayan video | Erişilebilirlik ihlali, hemen çıkma oranını yükseltir |
| Stok klişeleri: gülen resepsiyonist, çakışan kadeh, kuğu havlusu | Bu segmentin en görünür ucuzluk işareti |
| Giriş animasyonu / "loading" ekranı | LCP'yi doğrudan öldürür |
| Sahte aciliyet ("3 kişi bakıyor", geri sayım) | Kurgusal otelde yalan; gerçek otelde manipülatif |
| Metin üstüne düşük kontrastlı gri (`#999` vb.) | §5'teki token'lar dışına çıkma |
| Parallax + imleç takip efekti + partikül | Şıklık değil, gürültü |

### Fotoğrafsız tasarım (bağlayıcı karar)

**Bu sitede tanıtım fotoğrafı kullanılmaz.** Tasarım tamamen tipografi, boşluk ve çizgi üzerine kurulur.

Gerekçe: vasat stok fotoğraf bu segmentin 1 numaralı ucuzluk işaretidir; kötü fotoğraf koymaktansa hiç koymamak daha güçlü bir sonuç verir. Editoryal/mimari bir dil — iyi dizilmiş bir kitap gibi.

**Bunun yerine kullanılacak araçlar:**

| Araç | Nasıl |
|---|---|
| Devasa tipografi | Cormorant Garamond, `--text-display`. Başlık *görselin kendisidir*. |
| Sayılar | `24 oda`, `1890`, `22 m²`, `250 m` iri puntoyla dizilir. Hem görsel çapa hem GEO yakıtı (§10.4). |
| İnce çizgiler | `--color-border` ile yatay ayraçlar; sayfayı editoryal bir ızgaraya oturtur. |
| Zemin blokları | `--color-bg` ↔ `--color-surface` dönüşümü bölümleri ayırır. |
| Asimetrik ızgara | Ortalanmış her şey durgun görünür; dengeyi kaydır. |
| Boşluk | En az `--spacing-section`. Boşluk burada süs değil, kompozisyon. |

**Yasak:**
- Fotoğraf yerine gri kutu, "resim gelecek" yer tutucusu, ikon dolgusu
- Boşluğu doldurmak için eklenen dekoratif SVG, gradyan, desen
- Yapay zekâ üretimi "otel fotoğrafı" — gerçekmiş gibi sunulan uydurma mekân

**Boş görünme riski gerçektir.** Bir bölüm çıplak duruyorsa çözüm görsel eklemek değil, tipografik hiyerarşiyi güçlendirmektir: ölçek farkını büyüt, bir sayıyı öne çıkar, bir çizgi ekle.

> Bu karar değişirse (fotoğraf eklenecekse) §12'deki görsel bütçesi ve `public/images/CREDITS.md` lisans kaydı zorunlu hâle gelir.

---

## 7. Animasyon

**Kütüphane:** GSAP + ScrollTrigger. Başka animasyon kütüphanesi eklenmez.

### Standart preset

```js
gsap.from('.grid-item', {
  opacity: 0, scale: 0.92, y: 16,
  duration: 0.4,
  stagger: { each: 0.06, from: 'start', grid: 'auto' },
  ease: 'back.out(1.4)',
});
```

| Kural | Değer |
|---|---|
| Süre | 300–450 ms (mikro etkileşimler 150–250 ms) |
| Easing | `back.out(1.4)` giriş, çıkışta daha hızlı |
| Animate edilebilir | `transform`, `opacity` — **yalnızca bunlar** |
| Animate **edilemez** | `width`, `height`, `top`, `left`, `margin` (layout thrashing) |

### Zorunlu: `prefers-reduced-motion`

Her GSAP çağrısı `gsap.matchMedia()` ile korunur. Kullanıcı hareketi azaltmışsa animasyon **çalışmaz** — yavaşlatılmaz, tamamen kapatılır ve içerik son hâliyle görünür.

```js
const mm = gsap.matchMedia();
mm.add('(prefers-reduced-motion: no-preference)', () => {
  /* animasyonlar burada */
});
```

**Kural:** Animasyon anlam taşımalı — hiyerarşi kurmalı, mekânsal süreklilik sağlamalı. Sırf hareket olsun diye animasyon eklenmez. Bir animasyonun neden orada olduğunu açıklayamıyorsan sil.

---

## 8. Sayfa Mimarisi

### URL şeması

Yollar dile göre yerelleştirilir, `src/lib/routing.ts` içinde **tek yerde** tanımlanır.

| Sayfa | TR | EN |
|---|---|---|
| Ana sayfa | `/tr` | `/en` |
| Odalar | `/tr/odalar` | `/en/rooms` |
| Oda detay | `/tr/odalar/[slug]` | `/en/rooms/[slug]` |
| Restoran | `/tr/restoran` | `/en/restaurant` |
| Konum & Çevre | `/tr/konum` | `/en/location` |
| Galeri | `/tr/galeri` | `/en/gallery` |
| Hakkımızda | `/tr/hakkimizda` | `/en/about` |
| SSS | `/tr/sss` | `/en/faq` |
| İletişim | `/tr/iletisim` | `/en/contact` |
| Rezervasyon | `/tr/rezervasyon` | `/en/booking` |

### Ana sayfa bölüm sırası (Hero-Centric + Social Proof)

1. **Hero** — tam genişlik görsel, otel adı + konum, tek CTA ("Müsaitlik Sorgula")
2. **Konumlandırma şeridi** — tek cümlelik değer önermesi; otelin adı, semti ve oda sayısı burada geçer (GEO için kritik)
3. **Odalar önizlemesi** — 3 oda tipi, ızgara
4. **Deneyim** — restoran / teras / mahalle, 2–3 blok
5. **Konum** — harita + yürüme mesafeleri (sayısal)
6. **Misafir yorumları** — 3–5 yorum, isim + tarih
7. **Kapanış CTA**
8. **Footer** — NAP (isim, adres, telefon), diller, demo notu

### Her sayfa için zorunlular

- Tam olarak bir `<h1>`, başlık hiyerarşisi atlanmaz (h1 → h2 → h3)
- `generateMetadata` ile title, description, canonical, hreflang
- İlgili JSON-LD şeması (§10)
- Metinde otel adı + semt + şehir açıkça geçer

---

## 9. SEO Kuralları

### Metadata

Her sayfa `generateMetadata` kullanır. `layout.tsx`'te `metadataBase` tanımlıdır.

```ts
export async function generateMetadata({ params }): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: "Odalar ve Süitler | Vela Hotel Galata",
    description: "…", // 150–160 karakter, otel adı ve semt geçer
    alternates: {
      canonical: `/${locale}/odalar`,
      languages: { "tr-TR": "/tr/odalar", "en-US": "/en/rooms", "x-default": "/tr/odalar" },
    },
    openGraph: { /* … */ },
  };
}
```

| Kural | Detay |
|---|---|
| `title` | ≤ 60 karakter, biçim: `Sayfa \| Vela Hotel Galata` |
| `description` | 150–160 karakter, benzersiz, otel adı + semt içerir |
| `canonical` | Her sayfada zorunlu — dil kopyaları birbirini yamyamlaştırmasın |
| `hreflang` | TR/EN karşılıklı + `x-default` |
| `alt` metni | Betimleyici, "otel fotoğrafı" gibi boş ifade yasak. Dekoratifse `alt=""` |
| `sitemap.ts` | Tüm diller ve oda detay sayfaları dâhil, `lastModified` gerçek |
| Kırık bağlantı | Sıfır. Dağıtım öncesi taranır. |

### Core Web Vitals

| Metrik | Hedef | Nasıl |
|---|---|---|
| LCP < 2.0s | Hero görseli | `next/image` + `priority` + doğru `sizes` |
| CLS < 0.05 | Boyut rezervasyonu | Her görselde `width`/`height` veya `fill` + oranlı kap |
| INP < 200ms | JS bütçesi | Server Component varsayılan; `"use client"` gerekçe ister |

---

## 10. GEO — Yapay Zekâ Arama Motoru Optimizasyonu

Bu bölüm projeyi sıradan bir otel sitesinden ayıran şeydir. Klasik SEO sıralamayı hedefler; GEO **alıntılanmayı** hedefler.

### 10.1 Tarayıcı erişimi — `app/robots.ts`

Yapay zekâ tarayıcıları açıkça karşılanır. Engellenirse site ChatGPT/Claude/Perplexity cevaplarında hiç görünmez.

```
User-agent: GPTBot            Allow: /
User-agent: OAI-SearchBot     Allow: /
User-agent: ChatGPT-User      Allow: /
User-agent: ClaudeBot         Allow: /
User-agent: Claude-User       Allow: /
User-agent: Claude-SearchBot  Allow: /
User-agent: PerplexityBot     Allow: /
User-agent: Google-Extended    Allow: /
User-agent: Applebot-Extended Allow: /
User-agent: CCBot             Allow: /
```

`sitemap` satırı da eklenir.

### 10.2 `public/llms.txt`

Sitenin yapay zekâ okuyucular için düz metin haritası (llmstxt.org sözleşmesi):

```markdown
# Vela Hotel

> Galata, İstanbul'da 24 odalı butik şehir oteli. Serdar-ı Ekrem Caddesi'nde,
> Galata Kulesi'ne 250 metre yürüme mesafesinde. Giriş 15:00, çıkış 12:00.

## Sayfalar
- [Odalar](https://velahotel.com/tr/odalar): 3 oda tipi, fiyat ve donanım listesi
- [Konum](https://velahotel.com/tr/konum): ulaşım ve yürüme mesafeleri
- [SSS](https://velahotel.com/tr/sss): giriş/çıkış, evcil hayvan, otopark, kahvaltı
```

### 10.3 JSON-LD şemaları

**Yalnızca `src/lib/schema.ts` üretir, `hotel.ts`'ten beslenir.** Sayfaya elle yazma.

| Şema | Nerede | Not |
|---|---|---|
| `Hotel` | `[locale]/layout.tsx` — sitede **bir kez** | `@id: "https://velahotel.com/#hotel"` |
| `HotelRoom` + `Offer` | Oda detay sayfaları | `containedInPlace` ile `#hotel`'e bağlanır |
| `FAQPage` | SSS sayfası | Soru metni sayfada da görünmeli |
| `BreadcrumbList` | Ana sayfa hariç her sayfa | |
| `WebSite` | layout | `inLanguage` alanıyla |

**`Hotel` düğümü — zorunlu alanlar:**

```json
{
  "@context": "https://schema.org",
  "@type": "Hotel",
  "@id": "https://velahotel.com/#hotel",
  "name": "Vela Hotel",
  "url": "https://velahotel.com",
  "telephone": "+902120000000",
  "priceRange": "₺₺₺",
  "numberOfRooms": 24,
  "checkinTime": "15:00",
  "checkoutTime": "12:00",
  "petsAllowed": true,
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Serdar-ı Ekrem Caddesi No: 12",
    "addressLocality": "Beyoğlu",
    "addressRegion": "İstanbul",
    "postalCode": "34421",
    "addressCountry": "TR"
  },
  "geo": { "@type": "GeoCoordinates", "latitude": 41.0269, "longitude": 28.9726 },
  "amenityFeature": [
    { "@type": "LocationFeatureSpecification", "name": "Ücretsiz Wi-Fi", "value": true }
  ],
  "potentialAction": {
    "@type": "ReserveAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://velahotel.com/tr/rezervasyon",
      "actionPlatform": [
        "https://schema.org/DesktopWebPlatform",
        "https://schema.org/MobileWebPlatform"
      ]
    },
    "result": { "@type": "LodgingReservation", "name": "Oda rezervasyonu" }
  }
}
```

**Şema kuralları:**

- `Hotel` zaten `LocalBusiness` alt tipidir. **Ayrıca `LocalBusiness` düğümü yayınlama** — aynı varlığı ikiye böler ve güveni düşürür.
- Her düğüm `@id` taşır; diğer düğümler bu `@id`'ye referansla bağlanır. Varlık netliği GEO'nun temelidir.
- **`aggregateRating` / `reviewCount` yayınlanmaz.** Otel kurgusaldır; uydurma puan hem Google yapılandırılmış veri politikasını ihlal eder hem yalandır. Yorumlar sayfada tasarım öğesi olarak durur, şemaya girmez.
- Şemadaki her değerin sayfada görünür karşılığı olmalı. Görünmeyen içeriği işaretleme.

### 10.4 Alıntılanabilir içerik yazımı

Yapay zekâ motorları paragrafları bağlamından koparıp alıntılar. Buna göre yaz:

| Kural | Kötü | İyi |
|---|---|---|
| **Kendi kendine yeterlilik** | "Yukarıda belirttiğimiz gibi burası çok merkezi." | "Vela Hotel, Galata Kulesi'ne 250 metre yürüme mesafesindedir." |
| **Varlık netliği** | "Biz misafirlerimizi ağırlıyoruz." | "Vela Hotel, İstanbul Beyoğlu'ndaki 24 odalı bir butik oteldir." |
| **Sayısal kesinlik** | "Havalimanına çok yakın" | "İstanbul Havalimanı'na araçla yaklaşık 45 dakika" |
| **Doğrudan cevap** | Uzun giriş, sonunda cevap | Cevap ilk cümlede, detay sonra |

- Her sayfada otel adı + semt + şehir en az bir kez açıkça geçer. "Burası", "otelimiz" ile geçiştirilmez.
- SSS soruları kullanıcının gerçekten sorduğu biçimde yazılır ("Girişten önce bagaj bırakabilir miyim?"), pazarlama başlığı olarak değil.
- Pazarlama sıfatları ("eşsiz", "büyüleyici", "unutulmaz") olgusal ifadelerle değiştirilir. Yapay zekâ motorları sıfat alıntılamaz, olgu alıntılar.
- Kritik bilgi (fiyat, saat, mesafe, politika) **metin olarak** yazılır — görsel içine gömülmez.

### 10.5 Güncellik

- Her sayfa şemasında gerçek `dateModified` bulunur.
- `sitemap.ts` içindeki `lastModified` uydurulmaz, dosya/veri değişikliğinden türetilir.

---

## 11. Erişilebilirlik

Hedef **WCAG 2.2 AA** ve Lighthouse Accessibility 100.

| Kural | Şart |
|---|---|
| Metin kontrastı | ≥ 4.5:1 (büyük metin ≥ 3:1) |
| Arayüz sınırı kontrastı | ≥ 3:1 — `--color-border-strong` |
| Dokunma hedefi | ≥ 44×44 px, aralarında ≥ 8 px |
| Focus | Her odaklanabilir öğede görünür halka. `outline: none` **tek başına yasak** |
| Klavye | Tüm site Tab ile gezilebilir, tuzak yok, modal'da focus hapsi |
| İkon düğme | Mutlaka `aria-label` |
| Form | Görünür `<label>` — placeholder etiket yerine geçmez |
| Hata | İlgili alanın **yanında**, `aria-describedby` ile bağlı; sadece renkle belirtilmez |
| Görsel | Anlamlıysa betimleyici `alt`, dekoratifse `alt=""` |
| Dil | `<html lang>` aktif dile göre |
| Hareket | `prefers-reduced-motion` her animasyonda |

---

## 12. Performans Bütçesi

Aşağıdaki tavanlar **ölçülerek** belirlendi (Faz 4). Tahmin değil.

| Kaynak | Tavan | Ölçülen (ana sayfa) |
|---|---|---|
| Sayfa başına JS | 175 KB | **166.6 KB** |
| Web font | 110 KB, 2 aile, **yalnızca kullanılan ağırlıklar** | **100.4 KB** (4 dosya) |
| CSS | 15 KB | 6.7 KB |
| Toplam ilk yükleme | 300 KB | **288 KB** |
| Üçüncü taraf script | **Sıfır** (analitik dahil değil — eklenecekse `next/script` + `strategy="lazyOnload"`) | 0 |

> **JS tavanı neden 100 KB değil?** Başlangıçta 100 KB yazmıştım; ölçmeden.
> Next.js App Router + React 19 çerçeve kodu tek başına ~150 KB. 100 KB bu
> yığınla ulaşılabilir bir hedef değildi. 175 KB, çerçeve tabanının üstünde
> gerçekçi bir uygulama payı bırakır.

**Faz 4'te ölçülüp kesilenler — aynı tuzaklara düşme:**

| Bulgu | Kazanç |
|---|---|
| GSAP + ScrollTrigger, basit bir "solarak yüksel" efekti için yükleniyordu | **−43 KB** · `IntersectionObserver` + CSS geçişi ile değiştirildi |
| Cormorant 300 ağırlığı hiç kullanılmıyordu ama indiriliyordu | **−73 KB** (Inter'in değişken aksını da 400'e sabitlemekle birlikte) |
| `NextIntlClientProvider` 179 çeviri anahtarının **tamamını** her sayfaya gömüyordu | **−10 KB HTML**, TBT 220 ms → **60 ms** |

Son ikisi sinsi: kod doğru derleniyor, site çalışıyor, kimse fark etmiyor.
Yalnızca ölçünce görünüyorlar. **Yeni bir font ağırlığı, animasyon kütüphanesi
veya istemci bileşeni eklerken tekrar ölç.**

- Tüm görseller `next/image` üzerinden. Ham `<img>` yalnız SVG ikonlar için.
- Katlamanın altındaki görseller `loading="lazy"` (varsayılan), hero `priority`.
- Fontlar `next/font` ile self-host, `display: "swap"`.
- Harita gömülü iframe ise tıklamayla yüklenir (facade deseni) — sayfa açılışında değil.

---

## 13. İçerik ve Metin Kuralları

- **Ton:** Sakin, kendinden emin, abartısız. Ünlem yok. Otel kendini övmez, olguyu söyler.
- Paragraf en fazla 3–4 cümle.
- Türkçe içerikte İngilizce sızıntı yok ("check-in" → "giriş", "spa" kalabilir).
- Türkçe karakterler ve kesme işareti doğru kullanılır: "Galata'ya", "İstanbul'un".
- `messages/tr.json` ve `en.json` **aynı anahtar setine** sahip olur. Eksik anahtar build'i kırmalı.
- Çeviri anahtarları alana göre: `rooms.hero.title`, `booking.form.checkin`. Anahtar olarak Türkçe cümle kullanma.
- EN içerik TR'nin makine çevirisi değildir — uluslararası okuyucu için ayrıca yazılır.
- Footer'da kalıcı demo notu: bu sitenin kurgusal bir otel için hazırlanmış bir portfolyo çalışması olduğu belirtilir.

---

## 14. Kod Kuralları

- **Server Component varsayılandır.** `"use client"` yalnızca durum, efekt veya tarayıcı API'si gerektiğinde — ve mümkün olan en küçük yaprak bileşende.
- Bileşen dosyası ~200 satırı geçerse böl.
- Bileşen adları `PascalCase`, dosya adı bileşenle aynı.
- TypeScript `strict`. `any` yasak; bilinmeyen için `unknown` + daraltma.
- İçerik verisi `as const` ile tiplenir; şema üreticileri bu tipten türetilir.
- Tailwind sınıfları uzarsa `clsx`/`cva` ile ayrıştırılır, ama soyutlama uğruna bileşen üretme.
- Yorum satırı "ne" değil "neden" anlatır.

### Tailwind display çakışması — sessiz ve tehlikeli

Bir bileşenin taban sınıflarında `inline-flex` varsa, çağrı yerinde ona
ayrıca `hidden` vermek **işe yaramaz**. İkisi de `display` utility'sidir;
kazananı stil dosyasındaki sıra belirler, `class` özniteliğindeki sıra değil.

```tsx
// YANLIŞ — düğme mobilde görünür kalır
<ButtonLink className="hidden md:inline-flex">…</ButtonLink>

// DOĞRU — görünürlük sarmalayıcıda
<div className="hidden lg:block">
  <ButtonLink>…</ButtonLink>
</div>
```

Ölçüldü: header CTA'sı 412px'te 179×74 px görünür kalıyordu, hamburgerin
yanında. Derleme, lint ve tip kontrolü hepsi temizdi — bu hata yalnızca
**gerçek bir mobil viewport'ta** görünür.

**Nav kırılma noktası `lg` (1024px), `md` değil.** 768px'te altı bağlantı +
dil seçici + tema + CTA sığmıyor ve yatay taşma yapıyordu (ölçüldü).

### Form yazarken bilinen tuzak

Doğrulama hatasından sonra **`<select>` seçimi sıfırlanır**; metin alanları
sıfırlanmaz. Sebep: `defaultValue` yalnızca bileşen ilk bağlandığında uygulanır.

Kontrollü `<select>` (`value` + `onChange`) bunu **çözmez** — denendi ve ölçüldü:
React doğru değeri tutuyordu ama DOM'da boş seçenek işaretli kalıyordu.

Çalışan çözüm, sunucudan gelen değeri `key`'e koymaktır:

```tsx
<SelectField key={`room-${roomValue}`} defaultValue={roomValue} … />
```

Değer değişince React yeni bir `<select>` oluşturur ve `defaultValue` temiz bir
bağlanmada uygulanır. Örnek: `components/sections/BookingForm.tsx`.

---

## 15. Faz Planı

Sırayla ilerlenir. Bir faz bitmeden sonrakine geçilmez.

**Faz 0 — Kurulum**
- [x] Next.js 16 + TS (strict) + Tailwind v4 projesi
- [x] `globals.css` içinde `@theme` ile §5 tokenları (`light-dark()` + `color-scheme`)
- [x] `next/font` ile Cormorant Garamond + Inter self-host — **`latin-ext` şart** (ğ, ş, ı)
- [x] next-intl kurulumu, `routing.ts`, `navigation.ts`, `tr.json`/`en.json`
- [x] `content/hotel.ts` doldurulur + build zamanı değişmez kontrolü

**Faz 1 — İskelet ve tasarım sistemi**
- [x] Header (yapışkan, CTA'lı), Footer (NAP + demo notu), LanguageSwitcher
- [x] `components/ui/`: Button/ButtonLink, Container, Section
- [x] Açık/koyu tema geçişi (`ThemeScript` ile FOUC'suz)
- [x] Ana sayfa: hero + tüm bölümler
- [x] Tarayıcıda gözle doğrulandı: açık/koyu tema, atlama bağlantısı, focus halkası

> Form bileşenleri (Input, Field, Select) Faz 2'ye taşındı — tüketicisi olan
> rezervasyon formu orada yazılıyor. Kullanıcısı olmayan bileşen spekülasyondur.

**Faz 2 — Sayfalar**
- [x] `components/ui/Field.tsx`: TextField, SelectField, TextAreaField
- [x] Odalar listesi + oda detay (`generateStaticParams`)
- [x] Kahvaltı ve Teras, Konum, Hakkımızda, SSS, İletişim
- [x] Rezervasyon: tarih/kişi/oda seçici, doğrulama, simüle gönderim
- [x] `lib/seo.ts`: canonical + hreflang üreticisi (yollar routing.ts'ten)

> **Galeri sayfası kaldırıldı** — fotoğrafsız tasarımda (§6) boş bir kabuk olurdu.
>
> **"Restoran" → "Kahvaltı ve Teras"** (`/teras` ↔ `/terrace`). Otelde restoran
> yok; `hotel.ts` yalnızca kahvaltı ve teras barı listeliyor. Olmayan olanağı
> vaat eden bir nav bağlantısı, sitenin geri kalanındaki dürüstlüğü bozar.

**Faz 3 — SEO + GEO**
- [x] `lib/schema.ts` — Hotel, WebSite, HotelRoom+AggregateOffer, FAQPage, BreadcrumbList
- [x] Her sayfada `generateMetadata` + canonical + hreflang (`lib/seo.ts`)
- [x] `sitemap.ts`, `robots.ts`, `/llms.txt` (statik dosya değil, `hotel.ts`'ten üretilir)
- [x] İçerik §10.4'e göre gözden geçirildi — 18/18 sayfada varlık netliği

> **Denetim betikleri.** Faz 3'te iki otomatik denetim yazıldı; şema veya
> içerik değiştiğinde tekrar çalıştır:
> - JSON-LD geçerliliği + şemadaki olguların sayfada görünürlüğü (63 kontrol)
> - Varlık netliği: her sayfanın `<main>` içinde otel adı + semt + şehir
>
> İkincisi ilk çalıştırmada **18 sayfanın 16'sında başarısız oldu** — otel adı
> yalnızca header/footer'daydı. Sayfa metnine bakan bir yapay zekâ hangi otelden
> söz edildiğini bilemezdi. Yeni sayfa eklerken bu denetimi çalıştır.

**Faz 4 — Cila ve doğrulama**
- [x] Kaydırma animasyonları + `prefers-reduced-motion` koruması
      (GSAP değil — gerekçe `components/ui/Reveal.tsx` içinde)
- [x] Lighthouse mobil + masaüstü ölçüldü, sonuçlar §1'de
- [x] 320–1440px arası responsive doğrulama (iki gerçek hata bulundu)
- [x] §17 kontrol listesi

### Dağıtım

`main` dalına yapılan her push otomatik olarak üretime gider (Vercel ↔ GitHub bağlı).
Elle yayına almak gerekirse: `npx vercel --prod`.

Site adresi `hotel.ts` içindeki `siteUrl()` ile çözülür ve Vercel'in verdiği
üretim adresine kendiliğinden düşer — **ilk yayın için elle env ayarı gerekmez.**
Kendi alan adın bağlanırsa `NEXT_PUBLIC_SITE_URL`'i Vercel panelinden ayarla,
yoksa canonical eski adreste kalır.

> **Ölçüm nasıl tekrarlanır:**
> ```bash
> NEXT_PUBLIC_SITE_URL="http://localhost:3000" npm run build
> NEXT_PUBLIC_SITE_URL="http://localhost:3000" npx next start
> npx lighthouse http://localhost:3000/tr --preset=desktop   # ve mobil için --preset'siz
> ```
> `NEXT_PUBLIC_SITE_URL` **şart**: ayarlanmazsa canonical `velahotel.com`'u
> gösterir, Lighthouse bunu geçersiz sayar ve SEO puanı 92'ye düşer.

---

## 16. Kırmızı Çizgiler

| Asla | |
|---|---|
| Bileşende ham hex/px renk | Token kullan (§5) |
| Otel bilgisini JSX'e sabit yazmak | `hotel.ts` (§4) |
| Emoji ikon | Lucide SVG |
| Carousel | Izgara veya yatay kaydırma |
| Sahte yorum puanı şemada | `aggregateRating` yayınlanmaz (§10.3) |
| `outline: none` (yerine koymadan) | Focus görünür kalmalı |
| `width`/`height` animasyonu | Yalnız `transform`/`opacity` |
| Animasyonu `prefers-reduced-motion` olmadan yazmak | `gsap.matchMedia()` zorunlu |
| Kök `layout` içinde `"use client"` | Tüm ağacı istemciye taşır |
| Şemada olup sayfada olmayan bilgi | Görünmeyen içerik işaretlenmez |
| Ölçmeden "erişilebilir" demek | Kontrast hesaplanır |

---

## 17. Teslim Öncesi Kontrol Listesi

**Tasarım**
- [ ] Emoji ikon yok, tümü SVG
- [ ] Tıklanabilir her öğede `cursor-pointer`
- [ ] Hover geçişleri 150–300 ms
- [ ] Görsel oranları tutarlı (16:9 / 4:3 / 3:2)
- [ ] 375 / 768 / 1024 / 1440 px'te kontrol edildi, yatay kaydırma yok

**Erişilebilirlik**
- [ ] Metin kontrastı ≥ 4.5:1, arayüz sınırları ≥ 3:1 (hesaplandı)
- [ ] Klavye ile tüm site gezildi, focus her adımda görünür
- [ ] `prefers-reduced-motion` açıkken animasyon yok
- [ ] Form etiketleri görünür, hatalar alan yanında

**Performans**
- [ ] Lighthouse mobil ≥ 95
- [ ] LCP < 2.0s · CLS < 0.05 · INP < 200ms
- [ ] Görseller AVIF/WebP ve bütçe içinde
- [ ] JS bütçesi aşılmadı

**SEO**
- [ ] Her sayfada tek `<h1>`, hiyerarşi atlanmıyor
- [ ] title/description benzersiz ve uzunluk sınırında
- [ ] canonical + hreflang (x-default dâhil) doğru
- [ ] `sitemap.xml` ve `robots.txt` erişilebilir
- [ ] Kırık bağlantı yok
- [ ] JS kapalıyken tüm metin okunuyor

**GEO**
- [ ] Tüm JSON-LD Rich Results Test'ten hatasız geçiyor
- [ ] Şemadaki her olgu sayfada görünür metin olarak var
- [ ] `aggregateRating` **yok**
- [ ] `llms.txt` yayında ve güncel
- [ ] AI tarayıcıları `robots.txt`'te izinli
- [ ] Rastgele 5 paragraf bağlamdan koparıldığında tek başına anlaşılıyor
- [ ] Otel adı + semt + şehir her sayfada geçiyor

**Dürüstlük**
- [ ] Sahte ödül, basın logosu, yorum puanı yok
- [ ] Sahte aciliyet göstergesi yok
- [ ] Footer'da demo/portfolyo notu var
- [ ] `public/images/CREDITS.md` tüm görsellerin lisansını içeriyor
