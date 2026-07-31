"use client";

import { useTranslations } from "next-intl";
import { useActionState } from "react";
import { Button } from "@/components/ui/Button";
import { SelectField, TextAreaField, TextField } from "@/components/ui/Field";
import { hotel } from "@/content/hotel";
import { submitBooking, type FormState } from "@/lib/actions";
import type { Locale } from "@/lib/routing";

const initial: FormState = { ok: false };

/**
 * Rezervasyon formu.
 *
 * Server Action'a bağlıdır: JavaScript kapalıyken form yine gönderilir ve
 * aynı doğrulamadan geçer. useActionState yalnızca JS varken sayfa
 * yenilenmesini önler — davranışın kendisi ona bağımlı değil.
 *
 * Hata durumunda girilen değerler geri yazılır (defaultValue); formun
 * boşalması kullanıcıyı en çok kaçıran şeydir.
 */
export function BookingForm({
  locale,
  preselectedRoom,
}: {
  locale: Locale;
  preselectedRoom?: string;
}) {
  const t = useTranslations("booking");
  const tRoom = useTranslations("room");
  const [state, formAction, pending] = useActionState(submitBooking, initial);

  const v = state.values ?? {};
  const e = state.errors ?? {};

  /**
   * Seçim kutularının doğrulama hatasından sonra korunması.
   *
   * SORUN: <select> için defaultValue yalnızca bileşen ilk bağlandığında
   * uygulanır. Hata dönüşünde seçim sıfırlanıyor, kullanıcı hatayı
   * düzeltmeye geldiğinde oda ve kişi seçimini kaybediyordu.
   *
   * DENENİP ELENEN ÇÖZÜM: kontrollü <select> (value + onChange).
   * Ölçtüm — React state doğru değeri tutuyordu (value: "avlu-odasi")
   * ama DOM'da boş seçenek işaretli kalıyordu; kontrollü select ile
   * hidrasyon arasındaki bilinen çakışma.
   *
   * ÇALIŞAN ÇÖZÜM: sunucudan gelen değeri key'e koymak. Değer değişince
   * React yeni bir <select> oluşturur ve defaultValue temiz bir
   * bağlanmada uygulanır. Kullanıcı seçim yaparken alan kontrolsüz
   * kalır, yani tarayıcı değeri doğal olarak korur.
   */
  const roomValue = v.room || preselectedRoom || "";
  const guestsValue = v.guests || "2";

  if (state.ok) {
    return (
      <div
        role="status"
        className="border-accent border-l-2 py-2 pl-6"
      >
        <p className="font-display text-h2 text-ink">{t("successTitle")}</p>
        <p className="text-muted-fg mt-4 max-w-measure text-body">
          {state.message}
        </p>
      </div>
    );
  }

  const maxGuests = Math.max(...hotel.rooms.map((r) => r.maxOccupancy));

  return (
    <form action={formAction} noValidate className="max-w-3xl">
      {/* Hata özeti: ekran okuyucuya duyurulur, ama asıl mesajlar
          alanların yanında durur (CLAUDE.md §11). */}
      {Object.keys(e).length > 0 && (
        <p
          role="alert"
          className="text-destructive border-destructive mb-10 border-l-2 py-2 pl-6 text-small"
        >
          {t("errorSummary", { count: Object.keys(e).length })}
        </p>
      )}

      <div className="grid gap-8 sm:grid-cols-2">
        <TextField
          id="checkin"
          type="date"
          label={t("checkin")}
          required
          defaultValue={v.checkin}
          error={e.checkin}
          hint={t("checkinHint", { time: hotel.checkinTime })}
        />
        <TextField
          id="checkout"
          type="date"
          label={t("checkout")}
          required
          defaultValue={v.checkout}
          error={e.checkout}
          hint={t("checkoutHint", { time: hotel.checkoutTime })}
        />

        <SelectField
          key={`room-${roomValue}`}
          id="room"
          label={t("room")}
          required
          defaultValue={roomValue}
          error={e.room}
        >
          <option value="">{t("roomPlaceholder")}</option>
          {hotel.rooms.map((r) => (
            <option key={r.slug} value={r.slug}>
              {r.name[locale]} — {r.sizeSqm} m² —{" "}
              {tRoom("guests", { count: r.maxOccupancy })}
            </option>
          ))}
        </SelectField>

        <SelectField
          key={`guests-${guestsValue}`}
          id="guests"
          label={t("guests")}
          required
          defaultValue={guestsValue}
          error={e.guests}
        >
          {Array.from({ length: maxGuests }, (_, i) => i + 1).map((n) => (
            <option key={n} value={n}>
              {tRoom("guests", { count: n })}
            </option>
          ))}
        </SelectField>

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
        <TextField
          id="phone"
          type="tel"
          label={t("phone")}
          autoComplete="tel"
          defaultValue={v.phone}
          error={e.phone}
          hint={t("optional")}
          className="sm:col-span-2"
        />
        <TextAreaField
          id="notes"
          label={t("notes")}
          defaultValue={v.notes}
          error={e.notes}
          hint={t("optional")}
          className="sm:col-span-2"
        />
      </div>

      <div className="mt-12 flex flex-col gap-6 sm:flex-row sm:items-center">
        <Button type="submit" disabled={pending}>
          {pending ? t("submitting") : t("submit")}
        </Button>
        <p className="text-muted-fg text-small">{t("demoNotice")}</p>
      </div>
    </form>
  );
}
