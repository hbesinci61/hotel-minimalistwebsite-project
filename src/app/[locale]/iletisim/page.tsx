import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { JsonLd } from "@/components/layout/JsonLd";
import { PageHeader } from "@/components/layout/PageHeader";
import { ContactForm } from "@/components/sections/ContactForm";
import { Container } from "@/components/ui/Container";
import { hotel } from "@/content/hotel";
import type { Locale } from "@/lib/routing";
import { breadcrumbSchema } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact" });
  return pageMetadata({
    locale,
    href: "/iletisim",
    title: t("metaTitle"),
    description: t("metaDescription", {
      phone: hotel.telephoneDisplay,
      neighborhood: hotel.neighborhood[locale],
      city: hotel.city[locale],
    }),
  });
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("contact");
  const tNav = await getTranslations("nav");
  const messages = await getMessages();

  return (
    <main id="main">
      <JsonLd
        schema={breadcrumbSchema(locale, tNav("home"), [
          { name: tNav("contact"), href: "/iletisim" },
        ])}
      />
      <PageHeader
        eyebrow={`${hotel.neighborhood[locale]}, ${hotel.city[locale]}`}
        title={t("title")}
        lead={t("lead")}
      />

      <Container className="py-16 md:py-24">
        <div className="grid gap-16 md:grid-cols-12">
          {/* Doğrudan iletişim önce: form doldurmak istemeyen kullanıcı
              telefonu aramak zorunda kalmasın diye üstte. */}
          <div className="md:col-span-4">
            <h2 className="font-sans text-small text-ink tracking-widest uppercase">
              {t("directHeading")}
            </h2>
            <ul className="border-border mt-6 border-t">
              <li className="border-border border-b py-4">
                <a
                  href={`tel:${hotel.telephone}`}
                  className="font-display text-h3 text-ink hover:text-accent inline-flex min-h-11 items-center transition-colors duration-200"
                >
                  {hotel.telephoneDisplay}
                </a>
              </li>
              <li className="border-border border-b py-4">
                <a
                  href={`mailto:${hotel.email}`}
                  className="text-ink hover:text-accent inline-flex min-h-11 items-center font-sans text-body transition-colors duration-200"
                >
                  {hotel.email}
                </a>
              </li>
            </ul>

            <address className="text-muted-fg mt-8 text-small not-italic leading-relaxed">
              {hotel.address.streetAddress}
              <br />
              {hotel.address.postalCode} {hotel.address.addressLocality}
              <br />
              {hotel.city[locale]}
            </address>

            <p className="text-muted-fg mt-6 text-small">
              {t("receptionHours")}
            </p>
          </div>

          <div className="md:col-span-7 md:col-start-6">
            <h2 className="font-sans text-small text-ink tracking-widest uppercase">
              {t("formHeading")}
            </h2>
            <div className="mt-6">
              {/* Form istemci bileşeni: kendi ad alanını sarıyor */}
            <NextIntlClientProvider messages={{ contact: messages.contact }}>
              <ContactForm />
            </NextIntlClientProvider>
            </div>
          </div>
        </div>
      </Container>
    </main>
  );
}
