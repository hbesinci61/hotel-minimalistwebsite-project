import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHeader } from "@/components/layout/PageHeader";
import { Container } from "@/components/ui/Container";
import { hotel } from "@/content/hotel";
import type { Locale } from "@/lib/routing";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "terrace" });
  return pageMetadata({
    locale,
    href: "/teras",
    title: t("metaTitle"),
    description: t("metaDescription"),
  });
}

const blocks = ["breakfast", "terrace", "honesty"] as const;

export default async function TerracePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("terrace");

  return (
    <main id="main">
      <PageHeader
        eyebrow={`${hotel.neighborhood[locale]}, ${hotel.city[locale]}`}
        title={t("title")}
        lead={t("lead")}
      />

      <Container className="py-16 md:py-24">
        <div className="grid gap-12 md:grid-cols-3 md:gap-8">
          {blocks.map((key, i) => (
            <article key={key} className="border-border border-t pt-8">
              <p
                aria-hidden="true"
                className="font-display text-h2 text-border-strong leading-none"
              >
                {String(i + 1).padStart(2, "0")}
              </p>
              <h2 className="font-display text-h3 text-ink mt-6">
                {t(`${key}.title`)}
              </h2>
              <p className="text-muted-fg mt-4 text-small leading-relaxed">
                {t(`${key}.body`)}
              </p>
            </article>
          ))}
        </div>

        {/* Saatler — olgusal, metin olarak (§10.4) */}
        <dl className="border-border mt-16 border-t">
          <Row label={t("hoursBreakfast")} value="07:30 – 10:30" />
          <Row label={t("hoursTerrace")} value="16:00 – 23:00" />
          <Row
            label={t("hoursReception")}
            value={hotel.receptionAlwaysOpen ? t("allDay") : "—"}
          />
        </dl>
      </Container>
    </main>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-border flex items-baseline justify-between border-b py-4">
      <dt className="text-ink font-display text-h3">{label}</dt>
      <dd className="text-muted-fg font-sans text-small tabular-nums">{value}</dd>
    </div>
  );
}
