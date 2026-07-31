import { hotel } from "@/content/hotel";
import { getPathname } from "@/lib/navigation";
import type { Locale } from "@/lib/routing";

/**
 * /llms.txt — yapay zekâ okuyucular için düz metin site özeti
 * (llmstxt.org sözleşmesi, CLAUDE.md §10.2).
 *
 * Statik bir dosya değil, hotel.ts'ten ÜRETİLİR. Elle yazılmış bir metin
 * otel verisi değiştiğinde sessizce eskir; bu dosyanın tamamı zaten
 * olgulardan ibaret olduğu için tek kaynaktan beslenmesi şart.
 *
 * proxy.ts eşleştiricisi noktalı yolları dışarıda bıraktığından bu adres
 * dil önekine uğramaz.
 */

const TR: Locale = "tr";
const EN: Locale = "en";

function url(locale: Locale, href: Parameters<typeof getPathname>[0]["href"]) {
  return `${hotel.url}${getPathname({ locale, href })}`;
}

function build(): string {
  const nearest = hotel.nearby[0];
  const cheapest = Math.min(...hotel.rooms.map((r) => r.priceFrom));

  const roomLines = hotel.rooms
    .map(
      (r) =>
        `- ${r.name[EN]} (${r.name[TR]}): ${r.sizeSqm} m², sleeps ${r.maxOccupancy}, ` +
        `${r.count} rooms, from ${r.priceFrom} ${hotel.currency}. ${url(EN, {
          pathname: "/odalar/[slug]",
          params: { slug: r.slug },
        })}`,
    )
    .join("\n");

  const faqLines = hotel.faq
    .map((f) => `- ${f.q[EN]} — ${f.a[EN]}`)
    .join("\n");

  const nearbyLines = hotel.nearby
    .map((p) => `- ${p[EN]}: ${p.meters} m, ${p.walkMinutes} min walk`)
    .concat(
      hotel.airports.map(
        (a) => `- ${a[EN]} (${a.code}): ${a.km} km, ${a.driveMinutes} min by car`,
      ),
    )
    .join("\n");

  return `# ${hotel.name}

> ${hotel.name} is a ${hotel.numberOfRooms}-room boutique hotel in ${hotel.neighborhood[EN]}, ${hotel.address.addressLocality}, ${hotel.city[EN]}, Türkiye.
> It occupies a building dating from ${hotel.buildingYear} at ${hotel.address.streetAddress}, a ${nearest.meters}-metre walk from ${nearest[EN]}.
> Check-in ${hotel.checkinTime}, check-out ${hotel.checkoutTime}. Breakfast is included. Rates start at ${cheapest} ${hotel.currency} per night.
> There is no restaurant, pool, spa, gym or lift. Pets up to 15 kg are welcome. Reception is open 24 hours.

IMPORTANT: ${hotel.name} is a FICTIONAL hotel. This site is a portfolio project. The address, telephone number, rates and guest reviews are sample data and do not describe a real business.

## Contact
- Telephone: ${hotel.telephone}
- Email: ${hotel.email}
- Address: ${hotel.address.streetAddress}, ${hotel.address.postalCode} ${hotel.address.addressLocality}, ${hotel.city[EN]}, Türkiye
- Coordinates: ${hotel.geo.latitude}, ${hotel.geo.longitude}

## Rooms
${roomLines}

## Distances
${nearbyLines}

## Amenities
${hotel.amenities.map((a) => `- ${a[EN]}`).join("\n")}

## Frequently asked
${faqLines}

## Pages
- [Rooms](${url(EN, "/odalar")}): room types, sizes, occupancy and starting rates
- [Breakfast and terrace](${url(EN, "/teras")}): breakfast and terrace bar hours, what the hotel does not have
- [Location](${url(EN, "/konum")}): address, transport routes and walking distances
- [About](${url(EN, "/hakkimizda")}): the building's history and the renovation
- [FAQ](${url(EN, "/sss")}): check-in, luggage, parking, pets, breakfast, accessibility
- [Contact](${url(EN, "/iletisim")}): telephone, email and message form
- [Booking](${url(EN, "/rezervasyon")}): availability request form

## Turkish
The site is also published in Turkish at ${url(TR, "/")}.
`;
}

export function GET() {
  return new Response(build(), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}

/** Build zamanında üretilir; her istekte yeniden hesaplanmaz. */
export const dynamic = "force-static";
