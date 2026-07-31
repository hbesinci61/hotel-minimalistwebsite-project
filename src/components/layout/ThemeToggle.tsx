"use client";

import { Contrast } from "lucide-react";
import { useTranslations } from "next-intl";

/**
 * Açık/koyu tema düğmesi.
 *
 * TASARIM KARARI: ikon temaya göre DEĞİŞMEZ.
 * Değişen bir ikon, JS yüklenene kadar doğru hâli bilinemediği için ya
 * hidrasyon uyuşmazlığı ya da bir kare yanlış ikon yanıp sönmesi üretir.
 * Sabit bir kontrast ikonu + eylemi anlatan sabit etiket ikisini de
 * ortadan kaldırır ve minimalist dile daha iyi oturur.
 *
 * Durum React'te tutulmaz: tek doğruluk kaynağı <html data-theme>.
 * Böylece ThemeScript'in boyamadan önce yazdığı değerle çakışmaz.
 */
export function ThemeToggle() {
  const t = useTranslations("theme");

  function toggle() {
    const root = document.documentElement;
    const current =
      root.getAttribute("data-theme") ??
      (window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light");
    const next = current === "dark" ? "light" : "dark";

    root.setAttribute("data-theme", next);
    try {
      localStorage.setItem("theme", next);
    } catch {
      // Depolama kapalıysa tema yine de bu oturum için değişir.
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={t("toggle")}
      title={t("toggle")}
      className="inline-flex size-11 cursor-pointer items-center justify-center text-ink transition-opacity duration-200 hover:opacity-70"
    >
      <Contrast className="size-5" strokeWidth={1.5} aria-hidden="true" />
    </button>
  );
}
