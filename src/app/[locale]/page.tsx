import { setRequestLocale } from "next-intl/server";
import { ClosingCta } from "@/components/sections/ClosingCta";
import { Experience } from "@/components/sections/Experience";
import { Hero } from "@/components/sections/Hero";
import { LocationSection } from "@/components/sections/LocationSection";
import { Positioning } from "@/components/sections/Positioning";
import { RoomsPreview } from "@/components/sections/RoomsPreview";
import { Testimonials } from "@/components/sections/Testimonials";
import type { Locale } from "@/lib/routing";

/**
 * Ana sayfa — bölüm sırası CLAUDE.md §8'de tanımlıdır.
 * Sıra keyfi değil: konumlandırma erken gelir (GEO), sosyal kanıt
 * kapanış CTA'sından hemen önce durur.
 */
export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main id="main">
      <Hero locale={locale} />
      <Positioning locale={locale} />
      <RoomsPreview locale={locale} />
      <Experience locale={locale} />
      <LocationSection locale={locale} />
      <Testimonials />
      <ClosingCta />
    </main>
  );
}
