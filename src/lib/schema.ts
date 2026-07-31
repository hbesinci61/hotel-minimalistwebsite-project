import { hotel, type Room } from "@/content/hotel";
import { getPathname } from "./navigation";
import { hreflang, routing, type Locale } from "./routing";

/**
 * ============================================================
 *  JSON-LD ÜRETİCİLERİ  —  CLAUDE.md §10.3
 * ============================================================
 *
 * Şema YALNIZCA burada üretilir; sayfa dosyalarına elle JSON-LD yazılmaz.
 * Bütün değerler hotel.ts'ten okunur, böylece şema ile ekrandaki metin
 * ayrışamaz — yapay zekâ motorlarının bir oteli doğrulama biçimi tam
 * olarak bu tutarlılıktır.
 *
 * KURALLAR
 *  - `aggregateRating` / `reviewCount` YAYINLANMAZ. Otel kurgusaldır;
 *    uydurma puan hem Google politikasını ihlal eder hem yalandır.
 *  - `Hotel` zaten `LocalBusiness` alt tipidir. Ayrıca `LocalBusiness`
 *    düğümü yayınlanmaz — aynı varlığı ikiye böler.
 *  - Her düğüm `@id` taşır; diğerleri buna referansla bağlanır.
 *  - Şemadaki her olgunun sayfada görünür karşılığı olmalı.
 */

type Json = Record<string, unknown>;

/** Şemalar mutlak URL ister; getPathname yol döndürür. */
function absUrl(locale: Locale, href: Parameters<typeof getPathname>[0]["href"]) {
  return `${hotel.url}${getPathname({ locale, href })}`;
}

const HOTEL_ID = `${hotel.url}/#hotel`;
const WEBSITE_ID = `${hotel.url}/#website`;

function amenityFeatures(locale: Locale) {
  return hotel.amenities.map((a) => ({
    "@type": "LocationFeatureSpecification",
    name: a[locale],
    value: true,
  }));
}

/** Ana varlık. Sitede BİR KEZ yayınlanır (kök layout). */
export function hotelSchema(locale: Locale): Json {
  return {
    "@context": "https://schema.org",
    "@type": "Hotel",
    "@id": HOTEL_ID,
    name: hotel.name,
    legalName: hotel.legalName,
    url: absUrl(locale, "/"),
    telephone: hotel.telephone,
    email: hotel.email,
    priceRange: hotel.priceRange,
    numberOfRooms: hotel.numberOfRooms,
    checkinTime: hotel.checkinTime,
    checkoutTime: hotel.checkoutTime,
    petsAllowed: hotel.petsAllowed,
    smokingAllowed: hotel.smokingAllowed,
    currenciesAccepted: hotel.currency,
    address: {
      "@type": "PostalAddress",
      streetAddress: hotel.address.streetAddress,
      addressLocality: hotel.address.addressLocality,
      addressRegion: hotel.address.addressRegion,
      postalCode: hotel.address.postalCode,
      addressCountry: hotel.address.addressCountry,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: hotel.geo.latitude,
      longitude: hotel.geo.longitude,
    },
    amenityFeature: amenityFeatures(locale),
    // Resepsiyon 7/24: haftanın her günü 00:00–23:59
    openingHoursSpecification: hotel.receptionAlwaysOpen
      ? {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
          ],
          opens: "00:00",
          closes: "23:59",
        }
      : undefined,
    potentialAction: {
      "@type": "ReserveAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: absUrl(locale, "/rezervasyon"),
        inLanguage: hreflang[locale],
        actionPlatform: [
          "https://schema.org/DesktopWebPlatform",
          "https://schema.org/MobileWebPlatform",
        ],
      },
      result: {
        "@type": "LodgingReservation",
        name: locale === "tr" ? "Oda rezervasyonu" : "Room reservation",
      },
    },
    // NOT: aggregateRating bilinçli olarak yok. Bkz. dosya başı.
  };
}

export function websiteSchema(locale: Locale): Json {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: absUrl(locale, "/"),
    name: hotel.name,
    inLanguage: hreflang[locale],
    publisher: { "@id": HOTEL_ID },
  };
}

/**
 * Oda tipi.
 *
 * Fiyat "başlangıç fiyatı" olduğu için AggregateOffer + lowPrice kullanılır;
 * tek bir `price` yazmak sabit fiyat iddiası olurdu ve sayfadaki
 * "Başlangıç fiyatı" ifadesiyle çelişirdi.
 */
export function roomSchema(locale: Locale, room: Room): Json {
  const url = absUrl(locale, {
    pathname: "/odalar/[slug]",
    params: { slug: room.slug },
  });

  return {
    "@context": "https://schema.org",
    "@type": "HotelRoom",
    "@id": `${url}#room`,
    name: room.name[locale],
    description: room.summary[locale],
    url,
    containedInPlace: { "@id": HOTEL_ID },
    occupancy: {
      "@type": "QuantitativeValue",
      maxValue: room.maxOccupancy,
      unitCode: "C62", // UN/CEFACT: adet (kişi)
    },
    floorSize: {
      "@type": "QuantitativeValue",
      value: room.sizeSqm,
      unitCode: "MTK", // UN/CEFACT: metrekare
    },
    bed: {
      "@type": "BedDetails",
      typeOfBed: room.bed.type[locale],
      numberOfBeds: room.bed.count,
    },
    amenityFeature: amenityFeatures(locale),
    offers: {
      "@type": "AggregateOffer",
      lowPrice: room.priceFrom,
      priceCurrency: hotel.currency,
      offerCount: room.count,
      availability: "https://schema.org/InStock",
      url: absUrl(locale, "/rezervasyon"),
    },
  };
}

/**
 * SSS.
 *
 * Sorular ve cevaplar hotel.ts'ten gelir — SSS sayfasında GÖRÜNEN metnin
 * tam olarak aynı kaynağı. Görünmeyen içeriği işaretlemek yasak (§10.3).
 */
export function faqSchema(locale: Locale): Json {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${absUrl(locale, "/sss")}#faq`,
    mainEntity: hotel.faq.map((item) => ({
      "@type": "Question",
      name: item.q[locale],
      acceptedAnswer: { "@type": "Answer", text: item.a[locale] },
    })),
  };
}

export type Crumb = {
  name: string;
  href: Parameters<typeof getPathname>[0]["href"];
};

/** Ana sayfa hariç her sayfada. Ana sayfa listenin ilk öğesidir. */
export function breadcrumbSchema(
  locale: Locale,
  home: string,
  crumbs: Crumb[],
): Json {
  const items = [{ name: home, href: "/" as const }, ...crumbs];

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: absUrl(locale, c.href),
    })),
  };
}

/** Sitemap ve diğer tüketiciler için: desteklenen diller. */
export const locales = routing.locales;
