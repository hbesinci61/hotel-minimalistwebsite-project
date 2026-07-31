import { getTranslations } from "next-intl/server";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { hotel } from "@/content/hotel";
import { Link } from "@/lib/navigation";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { MobileMenu } from "./MobileMenu";
import { navItems } from "./navItems";
import { ThemeToggle } from "./ThemeToggle";

/**
 * Yapışkan üst çubuk.
 *
 * Server Component — çeviriler sunucuda çözülür. Yalnızca etkileşim
 * gerektiren yapraklar ("use client"): ThemeToggle, LanguageSwitcher,
 * MobileMenu.
 *
 * Zemin bg/95 + blur: hero görselinin üstünde dururken metin kontrastı
 * ölçülebilir kalır. Tam saydam bir başlık şık görünür ama görselin açık
 * bölgelerinde okunmaz hâle gelir (CLAUDE.md §6).
 */
export async function Header() {
  const t = await getTranslations("nav");

  return (
    <header className="bg-bg/95 border-border sticky top-0 z-40 border-b backdrop-blur-md">
      <Container className="flex items-center justify-between gap-6 py-4">
        <Link
          href="/"
          className="font-display text-h3 text-ink tracking-wide transition-opacity duration-200 hover:opacity-70"
        >
          {hotel.name}
        </Link>

        <nav aria-label={t("home")} className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="font-sans text-small text-muted-fg hover:text-ink tracking-wide transition-colors duration-200"
            >
              {t(item.key)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1 md:gap-3">
          <div className="hidden md:block">
            <LanguageSwitcher />
          </div>
          <ThemeToggle />
          <ButtonLink href="/rezervasyon" className="hidden md:inline-flex">
            {t("book")}
          </ButtonLink>
          <MobileMenu />
        </div>
      </Container>
    </header>
  );
}
