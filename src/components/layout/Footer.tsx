import { getLocale, getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { hotel } from "@/content/hotel";
import { Link } from "@/lib/navigation";
import type { Locale } from "@/lib/routing";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { navItems } from "./navItems";

/**
 * Alt bilgi.
 *
 * NAP (isim–adres–telefon) burada METİN olarak bulunur; görsele gömülmez.
 * Yerel SEO ve GEO bu üçlünün tutarlılığı üzerinden doğrulama yapar
 * (CLAUDE.md §10.4). Değerler hotel.ts'ten okunur, elle yazılmaz.
 */
export async function Footer() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("footer");
  const tNav = await getTranslations("nav");

  return (
    <footer className="bg-surface border-border border-t">
      <Container className="py-16 md:py-24">
        <div className="grid gap-12 md:grid-cols-3">
          {/* Kimlik + adres */}
          <div>
            <p className="font-display text-h3 text-ink tracking-wide">
              {hotel.name}
            </p>
            <address className="text-muted-fg mt-4 text-small not-italic leading-relaxed">
              {hotel.address.streetAddress}
              <br />
              {hotel.address.postalCode} {hotel.address.addressLocality}
              <br />
              {hotel.city[locale]}, {t("country")}
            </address>
          </div>

          {/* İletişim */}
          <div>
            <h2 className="font-sans text-small text-ink tracking-widest uppercase">
              {t("contactHeading")}
            </h2>
            <ul className="mt-4 space-y-2 text-small">
              <li>
                {/* tel: E.164 biçimini kullanır, ekranda okunur biçim görünür */}
                <a
                  href={`tel:${hotel.telephone}`}
                  className="text-muted-fg hover:text-ink inline-flex min-h-11 items-center transition-colors duration-200"
                >
                  {hotel.telephoneDisplay}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${hotel.email}`}
                  className="text-muted-fg hover:text-ink inline-flex min-h-11 items-center transition-colors duration-200"
                >
                  {hotel.email}
                </a>
              </li>
              <li className="text-muted-fg pt-2">
                {t("checkinLine", {
                  checkin: hotel.checkinTime,
                  checkout: hotel.checkoutTime,
                })}
              </li>
            </ul>
          </div>

          {/* Gezinme */}
          <div>
            <h2 className="font-sans text-small text-ink tracking-widest uppercase">
              {t("exploreHeading")}
            </h2>
            <ul className="mt-4 grid grid-cols-2 gap-x-6">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-muted-fg hover:text-ink inline-flex min-h-11 items-center text-small transition-colors duration-200"
                  >
                    {tNav(item.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-border mt-16 flex flex-col gap-6 border-t pt-8 md:flex-row md:items-center md:justify-between">
          {/* legalName zaten "A.Ş." ile bitiyor; ayırıcı olarak nokta
              kullanılırsa "A.Ş.." çıkar. Bu yüzden orta nokta. */}
          <p className="text-muted-fg text-small">
            © {new Date().getFullYear()} {hotel.legalName}
            <span aria-hidden="true" className="mx-2">
              ·
            </span>
            {t("rights")}
          </p>
          <LanguageSwitcher />
        </div>

        {/* Kalıcı demo notu — CLAUDE.md §13 ve dürüstlük kontrol listesi */}
        <p className="text-muted-fg border-border mt-8 border-t pt-8 text-small">
          {t("demoNotice")}
        </p>
      </Container>
    </footer>
  );
}
