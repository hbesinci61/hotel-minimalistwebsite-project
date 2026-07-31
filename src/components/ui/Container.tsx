import { clsx } from "clsx";

/**
 * Sayfa genişliği ve yatay kenar boşluğu — TEK karar noktası.
 *
 * Bu kalıp (`mx-auto max-w-7xl px-6 md:px-10`) header, footer ve yedi
 * ana sayfa bölümünde tekrarlanıyordu. Genişlik değişecekse tek yerde
 * değişmeli; dokuz dosyayı elle güncellemek kaçınılmaz olarak birini
 * atlamakla sonuçlanır.
 */
export function Container({
  as: Tag = "div",
  width = "wide",
  className,
  children,
}: {
  /** Semantik etiket. Kapsayıcı aynı zamanda bölümün kendisiyse `section`. */
  as?: "div" | "section";
  /** `wide`: bölüm ızgarası · `measure`: okuma metni (65–75 karakter, §5) */
  width?: "wide" | "measure";
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Tag
      className={clsx(
        "mx-auto w-full px-6 md:px-10",
        width === "measure" ? "max-w-measure" : "max-w-7xl",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
