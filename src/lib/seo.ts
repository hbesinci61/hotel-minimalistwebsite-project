import type { Metadata } from "next";
import { getPathname } from "./navigation";
import { hreflang, routing, type Locale } from "./routing";

type Href = Parameters<typeof getPathname>[0]["href"];

/**
 * canonical + hreflang üreticisi.
 *
 * NEDEN: yollar dile göre değişiyor (/tr/odalar ↔ /en/rooms). Bunları her
 * sayfada elle yazmak er geç bir sayfada yanlış eşleşmeye yol açar ve dil
 * kopyaları birbirini yamyamlaştırır. routing.ts tek kaynak; burası onu
 * metadata'ya çevirir.
 *
 * x-default varsayılan dile işaret eder (CLAUDE.md §9).
 */
export function alternatesFor(locale: Locale, href: Href): Metadata["alternates"] {
  const languages = Object.fromEntries(
    routing.locales.map((l) => [hreflang[l], getPathname({ locale: l, href })]),
  );

  return {
    canonical: getPathname({ locale, href }),
    languages: {
      ...languages,
      "x-default": getPathname({ locale: routing.defaultLocale, href }),
    },
  };
}

/** Sayfa metadata'sı — başlık, açıklama ve dil eşlemeleri tek çağrıda. */
export function pageMetadata({
  locale,
  href,
  title,
  description,
}: {
  locale: Locale;
  href: Href;
  title: string;
  description: string;
}): Metadata {
  const alternates = alternatesFor(locale, href);

  return {
    title,
    description,
    alternates,
    openGraph: {
      type: "website",
      title,
      description,
      locale: hreflang[locale],
      url: alternates?.canonical as string,
    },
  };
}
