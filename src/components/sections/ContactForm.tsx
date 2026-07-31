"use client";

import { useTranslations } from "next-intl";
import { useActionState } from "react";
import { Button } from "@/components/ui/Button";
import { TextAreaField, TextField } from "@/components/ui/Field";
import { submitContact, type FormState } from "@/lib/actions";

const initial: FormState = { ok: false };

export function ContactForm() {
  const t = useTranslations("contact");
  const [state, formAction, pending] = useActionState(submitContact, initial);

  const v = state.values ?? {};
  const e = state.errors ?? {};

  if (state.ok) {
    return (
      <div role="status" className="border-accent border-l-2 py-2 pl-6">
        <p className="font-display text-h2 text-ink">{t("successTitle")}</p>
        <p className="text-muted-fg mt-4 max-w-measure text-body">
          {state.message}
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} noValidate>
      {Object.keys(e).length > 0 && (
        <p
          role="alert"
          className="text-destructive border-destructive mb-10 border-l-2 py-2 pl-6 text-small"
        >
          {t("errorSummary", { count: Object.keys(e).length })}
        </p>
      )}

      <div className="grid gap-8">
        <TextField
          id="name"
          label={t("name")}
          required
          autoComplete="name"
          defaultValue={v.name}
          error={e.name}
        />
        <TextField
          id="email"
          type="email"
          label={t("email")}
          required
          autoComplete="email"
          defaultValue={v.email}
          error={e.email}
        />
        <TextAreaField
          id="message"
          label={t("message")}
          required
          rows={6}
          defaultValue={v.message}
          error={e.message}
        />
      </div>

      <div className="mt-10 flex flex-col gap-6 sm:flex-row sm:items-center">
        <Button type="submit" disabled={pending}>
          {pending ? t("submitting") : t("submit")}
        </Button>
        <p className="text-muted-fg text-small">{t("demoNotice")}</p>
      </div>
    </form>
  );
}
