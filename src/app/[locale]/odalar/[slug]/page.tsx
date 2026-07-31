import type { Metadata } from "next";
import { getFormatter, getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/layout/PageHeader";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { hotel, type RoomSlug } from "@/content/hotel";
import { Link } from "@/lib/navigation";
import { routing, type Locale } from "@/lib/routing";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ locale: Locale; slug: string }> };

/** Her oda × her dil build zamanında statik üretilir. */
export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    hotel.rooms.map((room) => ({ locale, slug: room.slug })),
  );
}

function findRoom(slug: string) {
  return hotel.rooms.find((r) => r.slug === slug);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const room = findRoom(slug);
  if (!room) return {};

  const t = await getTranslations({ locale, namespace: "room" });

  return pageMetadata({
    locale,
    href: { pathname: "/odalar/[slug]", params: { slug: room.slug as RoomSlug } },
    title: t("metaTitle", { name: room.name[locale], hotel: hotel.name }),
    // Açıklama olgusal: ad, m², kapasite, konum. Pazarlama sıfatı yok (§10.4).
    description: t("metaDescription", {
      name: room.name[locale],
      size: room.sizeSqm,
      guests: room.maxOccupancy,
      neighborhood: hotel.neighborhood[locale],
      city: hotel.city[locale],
    }),
  });
}

export default async function RoomDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const room = findRoom(slug);
  if (!room) notFound();

  const t = await getTranslations("room");
  const tRooms = await getTranslations("rooms");
  const format = await getFormatter();

  return (
    <main id="main">
      <PageHeader
        eyebrow={tRooms("title")}
        title={room.name[locale]}
        lead={room.summary[locale]}
      />

      <Container className="py-16 md:py-24">
        <div className="grid gap-12 md:grid-cols-12 md:gap-16">
          {/* Künye */}
          <div className="md:col-span-5">
            <h2 className="font-sans text-small text-ink tracking-widest uppercase">
              {t("specsHeading")}
            </h2>
            <dl className="border-border mt-6 border-t">
              <Spec label={t("size")} value={`${room.sizeSqm} m²`} />
              <Spec
                label={t("occupancy")}
                value={t("guests", { count: room.maxOccupancy })}
              />
              <Spec
                label={t("bed")}
                value={`${room.bed.count} × ${room.bed.type[locale]}`}
              />
              <Spec
                label={t("view")}
                value={room.hasView ? t("hasView") : t("noView")}
              />
              <Spec
                label={t("count")}
                value={t("roomsAvailable", { count: room.count })}
              />
            </dl>
          </div>

          {/* Otel geneli olanaklar */}
          <div className="md:col-span-5 md:col-start-8">
            <h2 className="font-sans text-small text-ink tracking-widest uppercase">
              {t("amenitiesHeading")}
            </h2>
            <ul className="border-border mt-6 border-t">
              {hotel.amenities.map((a) => (
                <li
                  key={a.key}
                  className="border-border text-ink border-b py-4 font-sans text-small"
                >
                  {a[locale]}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Fiyat + eylem */}
        <div className="border-border mt-16 flex flex-col gap-8 border-t pt-12 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-muted-fg font-sans text-small tracking-wide uppercase">
              {t("from")}
            </p>
            <p className="font-display text-display text-ink mt-2">
              {format.number(room.priceFrom, {
                style: "currency",
                currency: hotel.currency,
                maximumFractionDigits: 0,
              })}
            </p>
            <p className="text-muted-fg mt-2 text-small">{t("perNight")}</p>
          </div>

          {/* Oda önceden seçili olarak rezervasyona gider */}
          <ButtonLink
            href={{ pathname: "/rezervasyon", query: { oda: room.slug } }}
          >
            {t("bookThis")}
          </ButtonLink>
        </div>

        <div className="mt-12">
          <Link
            href="/odalar"
            className="text-muted-fg hover:text-ink decoration-border-strong inline-flex min-h-11 items-center font-sans text-small tracking-wide underline underline-offset-4 transition-colors duration-200"
          >
            {t("backToRooms")}
          </Link>
        </div>
      </Container>
    </main>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-border flex items-baseline justify-between border-b py-4">
      <dt className="text-muted-fg font-sans text-small">{label}</dt>
      <dd className="text-ink font-sans text-small tabular-nums">{value}</dd>
    </div>
  );
}
