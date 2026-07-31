import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { hotel } from "@/content/hotel";
import type { Locale } from "@/lib/routing";

/**
 * Konumlandırma şeridi — CLAUDE.md §8, ana sayfanın 2. bölümü.
 *
 * GEO açısından sayfanın en kritik paragrafı: otel adı + semt + şehir +
 * oda sayısı tek ve kendi kendine yeten bir cümlede geçer. Yapay zekâ
 * motorları bu cümleyi bağlamından koparıp alıntılayabilmeli (§10.4).
 */
export async function Positioning({ locale }: { locale: Locale }) {
  const t = await getTranslations("home.positioning");

  return (
    <section className="border-border border-b">
      <Container className="py-20 md:py-section">
        <p className="font-display text-h1 text-ink max-w-[24ch] text-balance">
          {t("statement", {
            name: hotel.name,
            neighborhood: hotel.neighborhood[locale],
            city: hotel.city[locale],
            rooms: hotel.numberOfRooms,
            year: hotel.buildingYear,
          })}
        </p>
      </Container>
    </section>
  );
}
