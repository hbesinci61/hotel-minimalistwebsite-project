import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHeader } from "@/components/layout/PageHeader";
import { BookingForm } from "@/components/sections/BookingForm";
import { Container } from "@/components/ui/Container";
import { hotel } from "@/content/hotel";
import type { Locale } from "@/lib/routing";
import { pageMetadata } from "@/lib/seo";

type Props = {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<{ oda?: string }>;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "booking" });
  return pageMetadata({
    locale,
    href: "/rezervasyon",
    title: t("metaTitle"),
    description: t("metaDescription", {
      checkin: hotel.checkinTime,
      checkout: hotel.checkoutTime,
    }),
  });
}

export default async function BookingPage({ params, searchParams }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  // Oda detay sayfasından gelindiyse oda önceden seçili olur
  const { oda } = await searchParams;
  const preselected = hotel.rooms.find((r) => r.slug === oda)?.slug;

  const t = await getTranslations("booking");

  return (
    <main id="main">
      <PageHeader title={t("title")} lead={t("lead")} />

      <Container className="py-16 md:py-24">
        <BookingForm locale={locale} preselectedRoom={preselected} />
      </Container>
    </main>
  );
}
