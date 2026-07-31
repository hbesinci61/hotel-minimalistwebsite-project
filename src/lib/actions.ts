"use server";

import { getLocale, getTranslations } from "next-intl/server";
import { hotel } from "@/content/hotel";
import type { Locale } from "./routing";

/**
 * Form gönderimleri.
 *
 * DEMO: Vela Hotel kurgusaldır. Burada e-posta gönderilmez, hiçbir yere
 * kayıt yazılmaz, ödeme alınmaz. Yapılan tek şey doğrulamadır ve sonuç
 * kullanıcıya "talep alındı" olarak DEĞİL, açıkça demo olarak bildirilir.
 * Sahte bir onay göstermek kurgusal otelde bile yanıltıcıdır.
 *
 * Server Action olarak yazıldı: form JavaScript kapalıyken de gönderilir
 * ve aynı doğrulamadan geçer. İstemci tarafı doğrulama tek başına
 * güvenilmez; burası tek karar noktası.
 */

export type FormState = {
  ok: boolean;
  message?: string;
  errors?: Record<string, string>;
  /** Kullanıcının girdiği değerler — hata durumunda form boşalmasın */
  values?: Record<string, string>;
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Bugünün tarihi, YYYY-MM-DD (sunucu saat dilimine göre). */
function today(): string {
  return new Date().toISOString().slice(0, 10);
}

function isValidDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const d = new Date(value + "T00:00:00Z");
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === value;
}

export async function submitBooking(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const t = await getTranslations("booking.errors");
  const locale = (await getLocale()) as Locale;

  const values = {
    checkin: String(formData.get("checkin") ?? ""),
    checkout: String(formData.get("checkout") ?? ""),
    guests: String(formData.get("guests") ?? ""),
    room: String(formData.get("room") ?? ""),
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    notes: String(formData.get("notes") ?? ""),
  };

  const errors: Record<string, string> = {};

  // --- Tarihler ---
  if (!values.checkin) errors.checkin = t("checkinRequired");
  else if (!isValidDate(values.checkin)) errors.checkin = t("dateInvalid");
  else if (values.checkin < today()) errors.checkin = t("checkinPast");

  if (!values.checkout) errors.checkout = t("checkoutRequired");
  else if (!isValidDate(values.checkout)) errors.checkout = t("dateInvalid");
  else if (values.checkin && values.checkout <= values.checkin)
    errors.checkout = t("checkoutBeforeCheckin");

  // --- Oda ve kişi sayısı ---
  const room = hotel.rooms.find((r) => r.slug === values.room);
  if (!values.room) errors.room = t("roomRequired");
  else if (!room) errors.room = t("roomUnknown");

  const guests = Number(values.guests);
  if (!values.guests) errors.guests = t("guestsRequired");
  else if (!Number.isInteger(guests) || guests < 1) errors.guests = t("guestsInvalid");
  else if (room && guests > room.maxOccupancy)
    // Oda kapasitesi hotel.ts'ten gelir — kural veriyle birlikte değişir
    errors.guests = t("guestsTooMany", {
      room: room.name[locale],
      max: room.maxOccupancy,
    });

  // --- İletişim ---
  if (!values.name.trim()) errors.name = t("nameRequired");
  if (!values.email) errors.email = t("emailRequired");
  else if (!EMAIL.test(values.email)) errors.email = t("emailInvalid");

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors, values };
  }

  const tOk = await getTranslations("booking");
  return { ok: true, message: tOk("demoSuccess") };
}

export async function submitContact(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const t = await getTranslations("booking.errors");

  const values = {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    message: String(formData.get("message") ?? ""),
  };

  const errors: Record<string, string> = {};
  if (!values.name.trim()) errors.name = t("nameRequired");
  if (!values.email) errors.email = t("emailRequired");
  else if (!EMAIL.test(values.email)) errors.email = t("emailInvalid");
  if (!values.message.trim()) errors.message = t("messageRequired");

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors, values };
  }

  const tOk = await getTranslations("contact");
  return { ok: true, message: tOk("demoSuccess") };
}
