import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { hotel } from "@/content/hotel";
import type { Locale } from "@/lib/routing";

/**
 * Konum — mesafeler tipografik bir cetvel olarak.
 *
 * Harita görseli yerine sayısal veri: "Galata Kulesi — 250 m — 3 dk".
 * Bu hem tasarım dilini korur hem de §10.4'ün istediği doğrulanabilir,
 * alıntılanabilir olguyu METİN olarak sunar (görsele gömülmez).
 */
export async function LocationSection({ locale }: { locale: Locale }) {
  const t = await getTranslations("home.location");

  return (
    <section className="border-border border-b">
      <Container className="py-20 md:py-section">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <h2 className="font-display text-h1 text-ink max-w-[18ch] text-balance">
            {t("title")}
          </h2>
          <p className="text-muted-fg max-w-measure text-body">
            {t("lead", { street: hotel.address.streetAddress })}
          </p>
        </div>

        <ul className="border-border mt-16 border-t">
          {hotel.nearby.map((place) => (
            <li
              key={place.key}
              className="border-border grid grid-cols-[1fr_auto_auto] items-baseline gap-4 border-b py-5 md:gap-12"
            >
              <span className="font-display text-h3 text-ink">
                {place[locale]}
              </span>
              <span className="text-ink font-sans text-small tabular-nums">
                {place.meters} m
              </span>
              <span className="text-muted-fg font-sans text-small tabular-nums">
                {t("walk", { minutes: place.walkMinutes })}
              </span>
            </li>
          ))}
          {hotel.airports.map((airport) => (
            <li
              key={airport.code}
              className="border-border grid grid-cols-[1fr_auto_auto] items-baseline gap-4 border-b py-5 md:gap-12"
            >
              <span className="font-display text-h3 text-ink">
                {airport[locale]}
                <span className="text-muted-fg ml-2 font-sans text-small">
                  {airport.code}
                </span>
              </span>
              <span className="text-ink font-sans text-small tabular-nums">
                {airport.km} km
              </span>
              <span className="text-muted-fg font-sans text-small tabular-nums">
                {t("drive", { minutes: airport.driveMinutes })}
              </span>
            </li>
          ))}
        </ul>

        <div className="mt-16">
          <ButtonLink href="/konum" variant="secondary">
            {t("cta")}
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
