import type { MetadataRoute } from "next";
import { hotel } from "@/content/hotel";
import { getPathname } from "@/lib/navigation";
import { hreflang, routing, type Locale } from "@/lib/routing";

type Href = Parameters<typeof getPathname>[0]["href"];

/** Sitemap'e girecek sayfalar. Yollar routing.ts'teki kanonik biçimde. */
const staticPages: { href: Href; priority: number }[] = [
  { href: "/", priority: 1 },
  { href: "/odalar", priority: 0.9 },
  { href: "/rezervasyon", priority: 0.9 },
  { href: "/teras", priority: 0.7 },
  { href: "/konum", priority: 0.7 },
  { href: "/sss", priority: 0.7 },
  { href: "/hakkimizda", priority: 0.6 },
  { href: "/iletisim", priority: 0.6 },
];

/**
 * lastModified — uydurulmaz.
 *
 * İçerik `hotel.ts` ve `messages/*.json` dosyalarından geliyor; derleme
 * zamanı bu içeriğin yayına girdiği andır. Sabit bir tarih yazmak ya da
 * her istekte `new Date()` üretmek yanlış tazelik sinyali verir
 * (CLAUDE.md §10.5).
 */
const lastModified = new Date();

function urlFor(locale: Locale, href: Href) {
  return `${hotel.url}${getPathname({ locale, href })}`;
}

/** Her sayfanın dil karşılıkları — alternates.languages ile bildirilir. */
function languagesFor(href: Href) {
  return Object.fromEntries(
    routing.locales.map((l) => [hreflang[l], urlFor(l, href)]),
  );
}

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of routing.locales) {
    for (const page of staticPages) {
      entries.push({
        url: urlFor(locale, page.href),
        lastModified,
        changeFrequency: "monthly",
        priority: page.priority,
        alternates: { languages: languagesFor(page.href) },
      });
    }

    // Oda detay sayfaları — hotel.ts'ten türetilir, elle listelenmez
    for (const room of hotel.rooms) {
      const href: Href = {
        pathname: "/odalar/[slug]",
        params: { slug: room.slug },
      };
      entries.push({
        url: urlFor(locale, href),
        lastModified,
        changeFrequency: "monthly",
        priority: 0.8,
        alternates: { languages: languagesFor(href) },
      });
    }
  }

  return entries;
}
