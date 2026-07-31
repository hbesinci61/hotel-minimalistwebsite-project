"use client";

import { Menu, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRef } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { Link } from "@/lib/navigation";
import { navItems } from "./navItems";

/**
 * Mobil menü.
 *
 * Native <dialog> + showModal() kullanılır. Bunun elle yazılmış bir
 * overlay'e göre bedavaya getirdikleri:
 *   - odak hapsi (Tab menüden dışarı kaçmaz)
 *   - Escape ile kapanma
 *   - arka planın erişilebilirlik ağacından çıkması (inert)
 *   - kapanınca odağın tetikleyici düğmeye dönmesi
 * Bunlar elle yazılan menülerde en sık bozulan davranışlardır.
 */
export function MobileMenu() {
  const t = useTranslations("nav");
  const dialogRef = useRef<HTMLDialogElement>(null);

  return (
    <>
      <button
        type="button"
        onClick={() => dialogRef.current?.showModal()}
        aria-label={t("openMenu")}
        className="inline-flex size-11 cursor-pointer items-center justify-center text-ink transition-opacity duration-200 hover:opacity-70 lg:hidden"
      >
        <Menu className="size-5" strokeWidth={1.5} aria-hidden="true" />
      </button>

      <dialog
        ref={dialogRef}
        aria-label={t("openMenu")}
        className="bg-bg text-ink m-0 h-dvh max-h-none w-full max-w-none backdrop:bg-black/60"
      >
        <div className="flex h-full flex-col px-6 py-6">
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => dialogRef.current?.close()}
              aria-label={t("closeMenu")}
              className="inline-flex size-11 cursor-pointer items-center justify-center text-ink transition-opacity duration-200 hover:opacity-70"
            >
              <X className="size-5" strokeWidth={1.5} aria-hidden="true" />
            </button>
          </div>

          <nav className="mt-8 flex flex-col gap-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => dialogRef.current?.close()}
                className="font-display text-h2 text-ink py-3 transition-opacity duration-200 hover:opacity-60"
              >
                {t(item.key)}
              </Link>
            ))}
          </nav>

          <div className="mt-auto pt-8">
            <ButtonLink
              href="/rezervasyon"
              onClick={() => dialogRef.current?.close()}
              className="w-full"
            >
              {t("book")}
            </ButtonLink>
          </div>
        </div>
      </dialog>
    </>
  );
}
