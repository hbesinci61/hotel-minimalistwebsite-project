import { defineRouting } from "next-intl/routing";

/**
 * Yerelleştirilmiş yollar — CLAUDE.md §8.
 *
 * URL'ler TEK yerde tanımlanır. Bir sayfanın yolu değişecekse
 * burada değişir; bileşenlere veya sitemap'e elle yol yazılmaz.
 *
 * Ayrı URL'ler (/tr/odalar, /en/rooms) doğru hreflang için zorunlu —
 * tek URL üzerinde dil değiştirmek SEO'yu bozar.
 */
export const routing = defineRouting({
  locales: ["tr", "en"],
  defaultLocale: "tr",

  // Varsayılan dil de önek alır: /tr/... ve /en/...
  // Böylece her sayfanın tek bir kanonik adresi olur.
  localePrefix: "always",

  pathnames: {
    "/": "/",
    "/odalar": { tr: "/odalar", en: "/rooms" },
    "/odalar/[slug]": { tr: "/odalar/[slug]", en: "/rooms/[slug]" },
    // "Restoran" değil: otelde restoran yok, kahvaltı ve teras barı var.
    // Olmayan olanağı vaat etmemek için yol ve etiket buna göre.
    "/teras": { tr: "/teras", en: "/terrace" },
    "/konum": { tr: "/konum", en: "/location" },
    "/hakkimizda": { tr: "/hakkimizda", en: "/about" },
    "/sss": { tr: "/sss", en: "/faq" },
    "/iletisim": { tr: "/iletisim", en: "/contact" },
    "/rezervasyon": { tr: "/rezervasyon", en: "/booking" },
  },
});

export type Locale = (typeof routing.locales)[number];

/** hreflang etiketleri — metadata ve sitemap bunu kullanır. */
export const hreflang: Record<Locale, string> = {
  tr: "tr-TR",
  en: "en-US",
};
