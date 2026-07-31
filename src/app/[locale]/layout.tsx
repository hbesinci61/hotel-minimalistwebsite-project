import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { hotel } from "@/content/hotel";
import { hreflang, routing, type Locale } from "@/lib/routing";
import "../globals.css";

/**
 * Fontlar next/font ile SELF-HOST edilir — CLAUDE.md §5.
 * Google Fonts'a <link> atılmaz: üçüncü taraf isteği + CLS riski.
 *
 * latin-ext ŞART: ğ, ş, ı karakterleri latin alt kümesinde yok.
 * Kaldırırsan Türkçe metin bozulur.
 */
const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });

  return {
    metadataBase: new URL(hotel.url),
    title: {
      default: t("defaultTitle"),
      template: `%s | ${hotel.name}`,
    },
    description: t("defaultDescription"),
    alternates: {
      canonical: `/${locale}`,
      languages: {
        [hreflang.tr]: "/tr",
        [hreflang.en]: "/en",
        "x-default": `/${routing.defaultLocale}`,
      },
    },
    openGraph: {
      type: "website",
      siteName: hotel.name,
      locale: hreflang[locale],
      title: t("defaultTitle"),
      description: t("defaultDescription"),
      url: `/${locale}`,
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  // Statik üretim için gerekli — olmadan sayfalar dinamiğe düşer.
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "nav" });

  return (
    <html
      lang={locale}
      className={`${cormorant.variable} ${inter.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-dvh bg-bg text-ink antialiased">
        <NextIntlClientProvider>
          {/* Klavye kullanıcıları için atlama bağlantısı — CLAUDE.md §11 */}
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-accent focus:px-4 focus:py-2 focus:text-on-accent"
          >
            {t("skipToContent")}
          </a>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
