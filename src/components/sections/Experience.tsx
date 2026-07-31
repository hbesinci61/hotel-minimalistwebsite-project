import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { hotel } from "@/content/hotel";
import type { Locale } from "@/lib/routing";

const blocks = ["breakfast", "terrace", "neighborhood"] as const;

/**
 * Deneyim — numaralandırılmış editoryal bloklar.
 *
 * Sıra numaraları (01/02/03) fotoğrafın bıraktığı görsel boşluğu
 * tipografiyle doldurur ve okuma ritmi kurar (CLAUDE.md §6).
 */
export async function Experience({ locale }: { locale: Locale }) {
  const t = await getTranslations("home.experience");

  return (
    <section className="bg-surface border-border border-b">
      <Container className="py-20 md:py-section">
        <h2 className="font-display text-h1 text-ink max-w-[18ch] text-balance">
          {t("title")}
        </h2>

        <div className="mt-16 grid gap-12 md:grid-cols-3 md:gap-8">
          {blocks.map((key, i) => (
            <article key={key} className="border-border border-t pt-8">
              <p
                aria-hidden="true"
                className="font-display text-h2 text-border-strong leading-none"
              >
                {String(i + 1).padStart(2, "0")}
              </p>
              <h3 className="font-display text-h3 text-ink mt-6">
                {t(`${key}.title`)}
              </h3>
              <p className="text-muted-fg mt-4 text-small leading-relaxed">
                {t(`${key}.body`, {
                  neighborhood: hotel.neighborhood[locale],
                  year: hotel.buildingYear,
                })}
              </p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
