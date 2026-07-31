import { getFormatter, getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { hotel } from "@/content/hotel";
import { Link } from "@/lib/navigation";
import type { Locale } from "@/lib/routing";

/**
 * Oda önizlemesi — fotoğraf yerine editoryal künye.
 *
 * Her kart bir katalog kaydı gibi kurulur: ad, tek cümlelik özet,
 * sonra ince çizgilerle ayrılmış teknik veri. Sayılar (m², kişi, fiyat)
 * iri dizilir; hem kompozisyonu taşır hem §10.4'ün istediği olgusal
 * içeriği metin olarak sunar.
 */
export async function RoomsPreview({ locale }: { locale: Locale }) {
  const t = await getTranslations("home.rooms");
  const tRoom = await getTranslations("room");
  const format = await getFormatter();

  return (
    <section className="bg-surface border-border border-b">
      <Container className="py-20 md:py-section">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <h2 className="font-display text-h1 text-ink max-w-[18ch] text-balance">
            {t("title")}
          </h2>
          <p className="text-muted-fg max-w-measure text-body">
            {t("lead", { total: hotel.numberOfRooms, types: hotel.rooms.length })}
          </p>
        </div>

        {/* subgrid: kartların satırları birbirine hizalanır. Özet metni
            bir kartta 2, diğerinde 1 satır olduğunda künye tabloları
            kaymasın diye — hizasız satırlar düzeni ucuz gösterir. */}
        <Reveal
          as="ul"
          stagger
          className="border-border mt-16 grid gap-px border-t md:grid-cols-3 md:grid-rows-[auto_auto_auto_auto]"
        >
          {hotel.rooms.map((room) => (
            <li
              key={room.slug}
              className="border-border border-b md:row-span-4 md:grid md:grid-rows-subgrid md:border-r"
            >
              <Link
                href={{ pathname: "/odalar/[slug]", params: { slug: room.slug } }}
                className="group grid h-full grid-rows-subgrid px-0 py-10 transition-opacity duration-200 hover:opacity-70 md:row-span-4 md:px-8"
              >
                <p className="font-display text-h2 text-ink">
                  {room.name[locale]}
                </p>
                <p className="text-muted-fg mt-4 text-small leading-relaxed">
                  {room.summary[locale]}
                </p>

                <dl className="border-border mt-8 self-start border-t">
                  <Spec label={tRoom("size")} value={`${room.sizeSqm} m²`} />
                  <Spec
                    label={tRoom("occupancy")}
                    value={tRoom("guests", { count: room.maxOccupancy })}
                  />
                  <Spec label={tRoom("bed")} value={room.bed.type[locale]} />
                  <Spec
                    label={tRoom("count")}
                    value={tRoom("roomsAvailable", { count: room.count })}
                  />
                </dl>

                <div className="mt-8 self-end">
                  <p className="text-muted-fg font-sans text-small tracking-wide uppercase">
                    {tRoom("from")}
                  </p>
                  <p className="font-display text-h2 text-ink mt-1">
                    {format.number(room.priceFrom, {
                      style: "currency",
                      currency: hotel.currency,
                      maximumFractionDigits: 0,
                    })}
                  </p>
                  <p className="text-muted-fg mt-1 text-small">
                    {tRoom("perNight")}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </Reveal>

        <div className="mt-16">
          <ButtonLink href="/odalar" variant="secondary">
            {t("cta")}
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-border flex items-baseline justify-between border-b py-3">
      <dt className="text-muted-fg font-sans text-small">{label}</dt>
      <dd className="text-ink font-sans text-small tabular-nums">{value}</dd>
    </div>
  );
}
