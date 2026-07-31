"use client";

import { clsx } from "clsx";
import { useLocale, useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { usePathname, useRouter } from "@/lib/navigation";
import { routing, type Locale } from "@/lib/routing";

/**
 * Dil değiştirici.
 *
 * KRİTİK: kullanıcı bulunduğu sayfada KALIR. /tr/odalar → /en/rooms.
 * Ana sayfaya atmak hem kullanıcıyı kaybettirir hem de dil kopyaları
 * arasındaki eşleşmeyi bozar.
 *
 * usePathname yerelleştirilmiş değil, KANONİK yolu döndürür (/odalar);
 * router hedef dile göre doğru yerelleştirmeyi kendisi uygular.
 * Dinamik segmentler için params geçilmesi şart, aksi hâlde oda detay
 * sayfalarında slug kaybolur.
 */
export function LanguageSwitcher() {
  const active = useLocale() as Locale;
  const pathname = usePathname();
  const params = useParams();
  const router = useRouter();
  const t = useTranslations("nav");

  return (
    <nav aria-label={t("switchLanguage")} className="flex items-center">
      {routing.locales.map((locale, i) => {
        const isActive = locale === active;
        return (
          <span key={locale} className="flex items-center">
            {i > 0 && (
              <span aria-hidden="true" className="px-2 text-border-strong">
                /
              </span>
            )}
            <button
              type="button"
              disabled={isActive}
              aria-current={isActive ? "true" : undefined}
              onClick={() =>
                router.replace(
                  // @ts-expect-error — params tipi yola göre değişir; next-intl
                  // çalışma zamanında doğru eşlemeyi yapar.
                  { pathname, params },
                  { locale },
                )
              }
              className={clsx(
                "min-h-11 cursor-pointer px-1 font-sans text-small tracking-wide uppercase transition-opacity duration-200",
                isActive
                  ? "text-ink cursor-default"
                  : "text-muted-fg hover:text-ink",
              )}
            >
              {locale}
            </button>
          </span>
        );
      })}
    </nav>
  );
}
