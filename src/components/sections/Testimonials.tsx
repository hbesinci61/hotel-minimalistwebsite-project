import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";

const quotes = ["one", "two", "three"] as const;

/**
 * Misafir yorumları.
 *
 * DÜRÜSTLÜK KURALI (CLAUDE.md §10.3 + kontrol listesi):
 * Otel kurgusaldır, dolayısıyla bu yorumlar da kurgusaldır. Bu yüzden
 *   - şemaya `aggregateRating` / `reviewCount` YAZILMAZ,
 *   - yıldız veya puan gösterilmez,
 *   - bölüm başlığı gerçek bir derecelendirme iddiasında bulunmaz.
 * Uydurma puan hem Google yapılandırılmış veri politikasını ihlal eder
 * hem de yalandır. Alt bilgideki demo notu bunu ayrıca açıklar.
 */
export async function Testimonials() {
  const t = await getTranslations("home.testimonials");

  return (
    <section className="border-border border-b">
      <Container className="py-20 md:py-section">
        <h2 className="font-display text-h1 text-ink max-w-[18ch] text-balance">
          {t("title")}
        </h2>

        <Reveal stagger className="mt-16 grid gap-12 md:grid-cols-3 md:gap-8">
          {quotes.map((key) => (
            <figure key={key} className="border-border border-t pt-8">
              <blockquote className="font-display text-h3 text-ink leading-snug text-balance">
                {t(`${key}.quote`)}
              </blockquote>
              <figcaption className="text-muted-fg mt-6 font-sans text-small">
                {t(`${key}.author`)}
                <span aria-hidden="true" className="mx-2">
                  ·
                </span>
                {t(`${key}.date`)}
              </figcaption>
            </figure>
          ))}
        </Reveal>
      </Container>
    </section>
  );
}
