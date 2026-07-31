import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { JsonLd } from "@/components/layout/JsonLd";
import { PageHeader } from "@/components/layout/PageHeader";
import { Container } from "@/components/ui/Container";
import { hotel } from "@/content/hotel";
import type { Locale } from "@/lib/routing";
import { breadcrumbSchema, faqSchema } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "faq" });
  return pageMetadata({
    locale,
    href: "/sss",
    title: t("metaTitle"),
    description: t("metaDescription", {
      checkin: hotel.checkinTime,
      checkout: hotel.checkoutTime,
    }),
  });
}

/**
 * SSS.
 *
 * Sorular hotel.ts'te, misafirin gerçekten sorduğu biçimde yazılı
 * (CLAUDE.md §10.4) — pazarlama başlığı olarak değil.
 *
 * <details>/<summary> kullanılıyor: açılır kapanır davranış JS gerektirmez,
 * klavyeyle çalışır ve tarayıcının sayfa içi aramasıyla uyumludur.
 * Cevap metni DOM'da her zaman bulunur; yapay zekâ tarayıcıları ve Google
 * kapalıyken de okur.
 *
 * Faz 3'te bu sayfaya FAQPage JSON-LD eklenecek; şemadaki metin buradaki
 * görünür metinle birebir aynı kaynaktan gelmeli.
 */
export default async function FaqPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("faq");
  const tNav = await getTranslations("nav");

  return (
    <main id="main">
      {/* Şemadaki soru ve cevaplar hotel.ts'ten gelir — aşağıda GÖRÜNEN
          metnin tam olarak aynı kaynağı. Görünmeyen içerik işaretlenmez. */}
      <JsonLd schema={faqSchema(locale)} />
      <JsonLd
        schema={breadcrumbSchema(locale, tNav("home"), [
          { name: tNav("faq"), href: "/sss" },
        ])}
      />

      <PageHeader
        eyebrow={`${hotel.neighborhood[locale]}, ${hotel.city[locale]}`}
        title={t("title")}
        lead={t("lead")}
      />

      <Container className="py-16 md:py-24">
        <div className="border-border border-t">
          {hotel.faq.map((item) => (
            <details
              key={item.key}
              className="border-border group border-b py-6"
            >
              <summary className="font-display text-h3 text-ink marker:content-none flex cursor-pointer items-baseline justify-between gap-6 list-none">
                {item.q[locale]}
                <span
                  aria-hidden="true"
                  className="text-border-strong shrink-0 font-sans text-body transition-transform duration-200 group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="text-muted-fg max-w-measure mt-4 text-body leading-relaxed">
                {item.a[locale]}
              </p>
            </details>
          ))}
        </div>
      </Container>
    </main>
  );
}
