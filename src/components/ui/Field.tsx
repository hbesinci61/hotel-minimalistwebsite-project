import { clsx } from "clsx";
import type { ComponentProps, ReactNode } from "react";

/**
 * Form alanları — CLAUDE.md §11.
 *
 * TASARIM KARARI: etiket/kontrol/hata bağlantısı (id, aria-describedby,
 * aria-invalid) bileşenin İÇİNDE kurulur, çağırana bırakılmaz. Bu üçlü
 * elle bağlandığında en sık unutulan şeydir ve unutulduğunda ekran
 * okuyucu kullanıcısı hatanın hangi alana ait olduğunu duyamaz.
 *
 * Alt çizgi (border-b) çerçeve olarak kullanılır: sitenin ince çizgi
 * diline uyar ve --color-border-strong 3:1 kontrast sağlar (WCAG 1.4.11).
 * Dekoratif --color-border burada YETERSİZDİR.
 */

function Label({
  htmlFor,
  children,
  required,
}: {
  htmlFor: string;
  children: ReactNode;
  required?: boolean;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="font-sans text-small text-muted-fg block tracking-wide"
    >
      {children}
      {required && (
        <span className="text-destructive ml-1" aria-hidden="true">
          *
        </span>
      )}
    </label>
  );
}

function Messages({
  hintId,
  hint,
  errorId,
  error,
}: {
  hintId: string;
  hint?: string;
  errorId: string;
  error?: string;
}) {
  return (
    <>
      {hint && !error && (
        <p id={hintId} className="text-muted-fg mt-2 text-small">
          {hint}
        </p>
      )}
      {/* Hata alanın YANINDA duruyor, sayfanın tepesinde değil.
          Yalnızca renkle değil, metinle de belirtiliyor. */}
      {error && (
        <p id={errorId} className="text-destructive mt-2 text-small">
          {error}
        </p>
      )}
    </>
  );
}

const controlBase =
  "w-full min-h-11 bg-transparent border-b border-border-strong " +
  "py-2 font-sans text-body text-ink " +
  "transition-colors duration-200 focus:border-accent";

type Shared = {
  id: string;
  label: string;
  hint?: string;
  error?: string;
};

export function TextField({
  id,
  label,
  hint,
  error,
  required,
  className,
  ...rest
}: Shared & ComponentProps<"input">) {
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;

  return (
    <div className={className}>
      <Label htmlFor={id} required={required}>
        {label}
      </Label>
      <input
        id={id}
        name={rest.name ?? id}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : hint ? hintId : undefined}
        className={clsx(controlBase, error && "border-destructive")}
        {...rest}
      />
      <Messages hintId={hintId} hint={hint} errorId={errorId} error={error} />
    </div>
  );
}

export function SelectField({
  id,
  label,
  hint,
  error,
  required,
  className,
  children,
  ...rest
}: Shared & ComponentProps<"select">) {
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;

  return (
    <div className={className}>
      <Label htmlFor={id} required={required}>
        {label}
      </Label>
      <select
        id={id}
        name={rest.name ?? id}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : hint ? hintId : undefined}
        className={clsx(controlBase, "cursor-pointer", error && "border-destructive")}
        {...rest}
      >
        {children}
      </select>
      <Messages hintId={hintId} hint={hint} errorId={errorId} error={error} />
    </div>
  );
}

export function TextAreaField({
  id,
  label,
  hint,
  error,
  required,
  className,
  ...rest
}: Shared & ComponentProps<"textarea">) {
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;

  return (
    <div className={className}>
      <Label htmlFor={id} required={required}>
        {label}
      </Label>
      <textarea
        id={id}
        name={rest.name ?? id}
        required={required}
        rows={rest.rows ?? 4}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : hint ? hintId : undefined}
        className={clsx(controlBase, "resize-y", error && "border-destructive")}
        {...rest}
      />
      <Messages hintId={hintId} hint={hint} errorId={errorId} error={error} />
    </div>
  );
}
