import { getTranslations } from "next-intl/server";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { hotel } from "@/content/hotel";

/**
 * Kapanış CTA — sayfanın tek birincil eylemi burada tekrarlanır.
 * İkincil eylem (telefon) düğme değil, sessiz bağlantıdır (CLAUDE.md §6).
 */
export async function ClosingCta() {
  const t = await getTranslations("home.closing");

  return (
    <Container as="section" className="py-20 md:py-section">
      <p className="font-display text-display text-ink max-w-[14ch] text-balance">
        {t("title")}
      </p>

      <div className="mt-12 flex flex-col gap-6 sm:flex-row sm:items-center">
        <ButtonLink href="/rezervasyon">{t("cta")}</ButtonLink>
        <a
          href={`tel:${hotel.telephone}`}
          className="text-muted-fg hover:text-ink decoration-border-strong hover:decoration-accent inline-flex min-h-11 items-center font-sans text-small tracking-wide underline underline-offset-4 transition-colors duration-200"
        >
          {hotel.telephoneDisplay}
        </a>
      </div>
    </Container>
  );
}
