import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { JsonLd } from "@/components/layout/JsonLd";
import { PageHeader } from "@/components/layout/PageHeader";
import { Container } from "@/components/ui/Container";
import { hotel } from "@/content/hotel";
import type { Locale } from "@/lib/routing";
import { breadcrumbSchema } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });
  return pageMetadata({
    locale,
    href: "/hakkimizda",
    title: t("metaTitle"),
    description: t("metaDescription", {
      year: hotel.buildingYear,
      rooms: hotel.numberOfRooms,
      neighborhood: hotel.neighborhood[locale],
      city: hotel.city[locale],
    }),
  });
}

const paragraphs = ["building", "restoration", "today"] as const;

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("about");
  const tNav = await getTranslations("nav");

  return (
    <main id="main">
      <JsonLd
        schema={breadcrumbSchema(locale, tNav("home"), [
          { name: tNav("about"), href: "/hakkimizda" },
        ])}
      />
      <PageHeader
        eyebrow={`${hotel.neighborhood[locale]}, ${hotel.city[locale]}`}
        title={t("title")}
        lead={t("lead", { year: hotel.buildingYear })}
      />

      <Container className="py-16 md:py-24">
        {/* Okuma metni: ölçü satırı 65–75 karakter (§5) */}
        <div className="max-w-measure">
          {paragraphs.map((key) => (
            <p key={key} className="text-ink mt-8 text-body first:mt-0">
              {t(`paragraphs.${key}`, {
                year: hotel.buildingYear,
                rooms: hotel.numberOfRooms,
                since: hotel.foundingYear,
              })}
            </p>
          ))}
        </div>

        {/* Künye — olgular tek bakışta */}
        <dl className="border-border mt-20 grid gap-x-12 gap-y-8 border-t pt-12 sm:grid-cols-2 md:grid-cols-4">
          <Fact label={t("factBuilding")} value={String(hotel.buildingYear)} />
          <Fact label={t("factRooms")} value={String(hotel.numberOfRooms)} />
          <Fact label={t("factSince")} value={String(hotel.foundingYear)} />
          <Fact label={t("factFloors")} value={t("noLift")} />
        </dl>
      </Container>
    </main>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dd className="font-display text-h1 text-ink leading-none">{value}</dd>
      <dt className="text-muted-fg mt-3 font-sans text-small tracking-wide">
        {label}
      </dt>
    </div>
  );
}
