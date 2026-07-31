import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { hotel } from "@/content/hotel";
import type { Locale } from "@/lib/routing";

/**
 * Hero — fotoğrafsız.
 *
 * Görselin yerini devasa tipografi ve sayısal çapa alır (CLAUDE.md §6).
 * Kompozisyon asimetrik: başlık sola dayalı, sağ alt köşede olgular.
 */
export async function Hero({ locale }: { locale: Locale }) {
  const t = await getTranslations("home.hero");

  return (
    <section className="border-border border-b">
      <Container className="pt-20 pb-16 md:pt-40 md:pb-24">
        <p className="font-sans text-small text-muted-fg tracking-[0.2em] uppercase">
          {hotel.neighborhood[locale]}, {hotel.city[locale]}
        </p>

        {/* Editoryal bölme: iri başlık solda, kurşun metin sağda ve
            başlığın alt hizasına oturur. Tek sütuna yığmak sağ yarıyı
            boş bırakıyordu — fotoğrafsız düzende bu "eksik" görünür. */}
        <div className="mt-8 grid gap-8 md:grid-cols-12 md:gap-12">
          <h1 className="font-display text-display text-ink col-span-full text-balance md:col-span-7">
            {t("title")}
          </h1>
          <p className="text-muted-fg col-span-full text-body md:col-span-4 md:col-start-9 md:self-end">
            {t("lead")}
          </p>
        </div>

        {/* CTA sola dayalı: header'daki altın düğmeyle aynı dikey eksende
            durursa iki birincil eylem üst üste yığılmış gibi okunur. */}
        <div className="mt-16 md:mt-24">
          <ButtonLink href="/rezervasyon">{t("cta")}</ButtonLink>
        </div>
      </Container>

      {/* Sayısal çapa — hem kompozisyonu tutar hem GEO için olgu taşır.
          Hücreler arası dikey çizgi YOK: ayrım boşlukla kurulur. Çizgili
          hücreler hem ilk sayıyı başlık hizasından kaydırıyordu hem de
          sütun sayısı değişince (mobilde 2) kenarda artık çizgi bırakıyordu. */}
      <Container className="border-border grid grid-cols-2 gap-x-8 gap-y-10 border-t py-10 md:grid-cols-4 md:gap-x-12 md:py-12">
        <Figure value={String(hotel.numberOfRooms)} label={t("statRooms")} />
        <Figure value={String(hotel.buildingYear)} label={t("statBuilding")} />
        <Figure
          value={`${hotel.nearby[0].meters} m`}
          label={hotel.nearby[0][locale]}
        />
        <Figure value={hotel.checkinTime} label={t("statCheckin")} />
      </Container>
    </section>
  );
}

function Figure({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="font-display text-h1 text-ink leading-none">{value}</p>
      <p className="font-sans text-small text-muted-fg mt-3 tracking-wide">
        {label}
      </p>
    </div>
  );
}
