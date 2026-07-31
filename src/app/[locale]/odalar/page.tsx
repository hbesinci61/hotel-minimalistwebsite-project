import type { Metadata } from "next";
import { getFormatter, getTranslations, setRequestLocale } from "next-intl/server";
import { JsonLd } from "@/components/layout/JsonLd";
import { PageHeader } from "@/components/layout/PageHeader";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { hotel } from "@/content/hotel";
import { Link } from "@/lib/navigation";
import type { Locale } from "@/lib/routing";
import { breadcrumbSchema } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "rooms" });

  return pageMetadata({
    locale,
    href: "/odalar",
    title: t("metaTitle"),
    description: t("metaDescription", {
      total: hotel.numberOfRooms,
      types: hotel.rooms.length,
    }),
  });
}

export default async function RoomsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("rooms");
  const tNav = await getTranslations("nav");
  const tRoom = await getTranslations("room");
  const format = await getFormatter();

  return (
    <main id="main">
      <JsonLd
        schema={breadcrumbSchema(locale, tNav("home"), [
          { name: tNav("rooms"), href: "/odalar" },
        ])}
      />
      <PageHeader
        eyebrow={`${hotel.neighborhood[locale]}, ${hotel.city[locale]}`}
        title={t("title")}
        lead={t("lead", {
          total: hotel.numberOfRooms,
          types: hotel.rooms.length,
        })}
      />

      <Container className="py-16 md:py-24">
        <ul>
          {hotel.rooms.map((room, i) => (
            <li key={room.slug} className="border-border border-b">
              <article className="grid gap-8 py-12 md:grid-cols-12 md:gap-12 md:py-16">
                {/* Sıra numarası — fotoğrafsız düzende görsel çapa */}
                <p
                  aria-hidden="true"
                  className="font-display text-h3 text-border-strong md:col-span-1"
                >
                  {String(i + 1).padStart(2, "0")}
                </p>

                <div className="md:col-span-5">
                  <h2 className="font-display text-h1 text-ink">
                    {room.name[locale]}
                  </h2>
                  <p className="text-muted-fg mt-4 text-body">
                    {room.summary[locale]}
                  </p>

                  <div className="mt-8 flex flex-wrap items-baseline gap-x-6 gap-y-2">
                    <span className="text-muted-fg font-sans text-small tracking-wide uppercase">
                      {tRoom("from")}
                    </span>
                    <span className="font-display text-h2 text-ink">
                      {format.number(room.priceFrom, {
                        style: "currency",
                        currency: hotel.currency,
                        maximumFractionDigits: 0,
                      })}
                    </span>
                    <span className="text-muted-fg text-small">
                      {tRoom("perNight")}
                    </span>
                  </div>
                </div>

                <dl className="border-border border-t md:col-span-5 md:col-start-8">
                  <Spec label={tRoom("size")} value={`${room.sizeSqm} m²`} />
                  <Spec
                    label={tRoom("occupancy")}
                    value={tRoom("guests", { count: room.maxOccupancy })}
                  />
                  <Spec label={tRoom("bed")} value={room.bed.type[locale]} />
                  <Spec
                    label={tRoom("view")}
                    value={room.hasView ? tRoom("hasView") : tRoom("noView")}
                  />
                  <Spec
                    label={tRoom("count")}
                    value={tRoom("roomsAvailable", { count: room.count })}
                  />

                  <div className="mt-8">
                    <Link
                      href={{
                        pathname: "/odalar/[slug]",
                        params: { slug: room.slug },
                      }}
                      className="text-ink decoration-border-strong hover:decoration-accent inline-flex min-h-11 items-center font-sans text-small tracking-wide underline underline-offset-4 transition-colors duration-200"
                    >
                      {t("detail", { name: room.name[locale] })}
                    </Link>
                  </div>
                </dl>
              </article>
            </li>
          ))}
        </ul>

        <div className="mt-16">
          <ButtonLink href="/rezervasyon">{t("cta")}</ButtonLink>
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
