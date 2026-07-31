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
  const t = await getTranslations({ locale, namespace: "location" });
  return pageMetadata({
    locale,
    href: "/konum",
    title: t("metaTitle"),
    description: t("metaDescription", {
      street: hotel.address.streetAddress,
      neighborhood: hotel.neighborhood[locale],
      city: hotel.city[locale],
    }),
  });
}

const routes = ["metro", "tram", "taxi", "foot"] as const;

export default async function LocationPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("location");
  const tNav = await getTranslations("nav");
  const tDist = await getTranslations("distance");

  const mapsUrl = `https://www.openstreetmap.org/?mlat=${hotel.geo.latitude}&mlon=${hotel.geo.longitude}#map=17/${hotel.geo.latitude}/${hotel.geo.longitude}`;

  return (
    <main id="main">
      <JsonLd
        schema={breadcrumbSchema(locale, tNav("home"), [
          { name: tNav("location"), href: "/konum" },
        ])}
      />
      <PageHeader
        eyebrow={`${hotel.neighborhood[locale]}, ${hotel.city[locale]}`}
        title={t("title")}
        lead={t("lead", { street: hotel.address.streetAddress })}
      />

      <Container className="py-16 md:py-24">
        <div className="grid gap-12 md:grid-cols-12 md:gap-16">
          {/* Adres — NAP metin olarak, görsele gömülmez */}
          <div className="md:col-span-5">
            <h2 className="font-sans text-small text-ink tracking-widest uppercase">
              {t("addressHeading")}
            </h2>
            <address className="font-display text-h3 text-ink mt-6 not-italic leading-relaxed">
              {hotel.address.streetAddress}
              <br />
              {hotel.address.postalCode} {hotel.address.addressLocality}
              <br />
              {hotel.city[locale]}
            </address>
            <p className="text-muted-fg mt-6 text-small tabular-nums">
              {hotel.geo.latitude}, {hotel.geo.longitude}
            </p>
            {/* Harita gömülmez: üçüncü taraf script bütçesi sıfır (§12).
                Bunun yerine dış bağlantı. */}
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-ink decoration-border-strong hover:decoration-accent mt-6 inline-flex min-h-11 items-center font-sans text-small tracking-wide underline underline-offset-4 transition-colors duration-200"
            >
              {t("openMap")}
            </a>
          </div>

          {/* Ulaşım */}
          <div className="md:col-span-6 md:col-start-7">
            <h2 className="font-sans text-small text-ink tracking-widest uppercase">
              {t("gettingHereHeading")}
            </h2>
            <dl className="border-border mt-6 border-t">
              {routes.map((key) => (
                <div key={key} className="border-border border-b py-5">
                  <dt className="font-display text-h3 text-ink">
                    {t(`routes.${key}.title`)}
                  </dt>
                  <dd className="text-muted-fg mt-2 text-small leading-relaxed">
                    {t(`routes.${key}.body`)}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        {/* Mesafeler — sayısal, doğrulanabilir */}
        <h2 className="font-sans text-small text-ink mt-20 tracking-widest uppercase">
          {t("distancesHeading")}
        </h2>
        <ul className="border-border mt-6 border-t">
          {hotel.nearby.map((p) => (
            <li
              key={p.key}
              className="border-border grid grid-cols-[1fr_auto_auto] items-baseline gap-4 border-b py-5 md:gap-12"
            >
              <span className="font-display text-h3 text-ink">{p[locale]}</span>
              <span className="text-ink font-sans text-small tabular-nums">
                {p.meters} m
              </span>
              <span className="text-muted-fg font-sans text-small tabular-nums">
                {tDist("walk", { minutes: p.walkMinutes })}
              </span>
            </li>
          ))}
          {hotel.airports.map((a) => (
            <li
              key={a.code}
              className="border-border grid grid-cols-[1fr_auto_auto] items-baseline gap-4 border-b py-5 md:gap-12"
            >
              <span className="font-display text-h3 text-ink">
                {a[locale]}
                <span className="text-muted-fg ml-2 font-sans text-small">
                  {a.code}
                </span>
              </span>
              <span className="text-ink font-sans text-small tabular-nums">
                {a.km} km
              </span>
              <span className="text-muted-fg font-sans text-small tabular-nums">
                {tDist("drive", { minutes: a.driveMinutes })}
              </span>
            </li>
          ))}
        </ul>
      </Container>
    </main>
  );
}
