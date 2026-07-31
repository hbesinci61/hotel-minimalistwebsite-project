import { clsx } from "clsx";
import { Link } from "@/lib/navigation";
import type { ComponentProps } from "react";

type Variant = "primary" | "secondary" | "quiet";

/**
 * CLAUDE.md §6: sayfa başına TEK birincil CTA.
 * İkincil eylemler "quiet" (metin bağlantısı) olur, düğme değil.
 */
const variants: Record<Variant, string> = {
  primary: "bg-accent text-on-accent hover:opacity-90",
  secondary:
    "border border-border-strong text-ink hover:bg-muted hover:border-ink",
  quiet:
    "text-ink underline decoration-border-strong underline-offset-4 hover:decoration-accent",
};

/**
 * Dokunma hedefi ≥44px (CLAUDE.md §11):
 * py-4 (32px) + text-small satır yüksekliği ≈ 21px + border → 53px.
 */
const base =
  "inline-flex items-center justify-center gap-2 " +
  "min-h-11 px-8 py-4 " +
  "font-sans text-small tracking-wide uppercase " +
  "cursor-pointer transition-all duration-200 " +
  "disabled:pointer-events-none disabled:opacity-50";

const quietBase =
  "inline-flex items-center gap-2 min-h-11 " +
  "font-sans text-small tracking-wide " +
  "cursor-pointer transition-all duration-200";

function classesFor(variant: Variant, className?: string) {
  return clsx(variant === "quiet" ? quietBase : base, variants[variant], className);
}

/** Sayfa içi/site içi gezinme — yerelleştirilmiş yolu korur. */
export function ButtonLink({
  variant = "primary",
  className,
  children,
  ...rest
}: { variant?: Variant } & ComponentProps<typeof Link>) {
  return (
    <Link className={classesFor(variant, className)} {...rest}>
      {children}
    </Link>
  );
}

/** Eylem düğmesi — form gönderimi, menü açma vb. */
export function Button({
  variant = "primary",
  className,
  children,
  type = "button",
  ...rest
}: { variant?: Variant } & ComponentProps<"button">) {
  return (
    <button type={type} className={classesFor(variant, className)} {...rest}>
      {children}
    </button>
  );
}
