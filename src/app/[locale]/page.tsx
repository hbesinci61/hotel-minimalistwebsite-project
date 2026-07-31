import { getTranslations, setRequestLocale } from "next-intl/server";
import { hotel } from "@/content/hotel";
import { Link } from "@/lib/navigation";
import type { Locale } from "@/lib/routing";

/**
 * Faz 0 iskeleti — tokenların, fontların ve i18n'in çalıştığını doğrular.
 * Gerçek ana sayfa bölümleri Faz 1'de gelecek (CLAUDE.md §8).
 */
export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("home.hero");
  const nearest = hotel.nearby[0];

  return (
    <main id="main" className="px-6 py-section">
      <section className="mx-auto max-w-measure">
        <p className="font-sans text-small tracking-widest text-muted-fg uppercase">
          {t("eyebrow")}
        </p>

        <h1 className="mt-6 font-display text-display text-balance">
          {t("title")}
        </h1>

        <p className="mt-8 font-sans text-body text-muted-fg">{t("lead")}</p>

        {/* Olgular hotel.ts'ten okunur, metne elle yazılmaz — CLAUDE.md §4 */}
        <p className="mt-4 font-sans text-body text-muted-fg">
          {hotel.name} · {hotel.numberOfRooms} oda ·{" "}
          {nearest[locale]}&apos;ne {nearest.meters} m
        </p>

        {/* Yol yerelleştirmesi routing.ts'ten gelir: TR /rezervasyon, EN /booking.
            Site içi bağlantıda next/link DEĞİL bu Link kullanılır — CLAUDE.md §8. */}
        <Link
          href="/rezervasyon"
          className="mt-12 inline-block bg-accent px-8 py-4 font-sans text-small tracking-wide text-on-accent uppercase transition-opacity duration-200 hover:opacity-90"
        >
          {t("cta")}
        </Link>
      </section>
    </main>
  );
}
