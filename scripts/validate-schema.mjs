const BASE = process.argv[2] ?? "http://localhost:3000";

let pass = 0, fail = 0;
const ok = (m) => { pass++; console.log(`  PASS  ${m}`); };
const no = (m) => { fail++; console.log(`  FAIL  ${m}`); };
const check = (cond, m) => (cond ? ok(m) : no(m));

async function page(path) {
  const res = await fetch(BASE + path);
  const html = await res.text();
  const blocks = [...html.matchAll(
    /<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g,
  )].map((m) => m[1]);
  const schemas = blocks.map((b) => JSON.parse(b.replace(/\\u003c/g, "<")));
  // kaba gorunur metin
  const text = html
    .replace(/<script[\s\S]*?<\/script>/g, " ")
    .replace(/<style[\s\S]*?<\/style>/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&#x27;/g, "'").replace(/&amp;/g, "&").replace(/&quot;/g, '"')
    .replace(/\s+/g, " ");
  return { status: res.status, schemas, text, html };
}

const byType = (schemas, t) => schemas.find((s) => s["@type"] === t);

// schema.org'da var olan tipler (bu projede kullanilanlar)
const KNOWN = new Set([
  "Hotel","WebSite","HotelRoom","FAQPage","BreadcrumbList","PostalAddress",
  "GeoCoordinates","LocationFeatureSpecification","ReserveAction","EntryPoint",
  "LodgingReservation","QuantitativeValue","BedDetails","AggregateOffer",
  "OpeningHoursSpecification","Question","Answer","ListItem",
]);

function walkTypes(node, found = []) {
  if (Array.isArray(node)) { node.forEach((n) => walkTypes(n, found)); return found; }
  if (node && typeof node === "object") {
    if (typeof node["@type"] === "string") found.push(node["@type"]);
    Object.values(node).forEach((v) => walkTypes(v, found));
  }
  return found;
}

console.log("=== 1. ANA SAYFA: Hotel + WebSite ===");
{
  const { schemas, text } = await page("/tr");
  const hotel = byType(schemas, "Hotel");
  const site = byType(schemas, "WebSite");

  check(!!hotel, "Hotel dugumu var");
  check(!!site, "WebSite dugumu var");
  check(schemas.filter((s) => s["@type"] === "Hotel").length === 1, "Hotel yalnizca BIR kez");
  check(!byType(schemas, "LocalBusiness"), "Ayrica LocalBusiness YOK (Hotel zaten alt tipi)");

  // DURUSTLUK
  check(!("aggregateRating" in hotel), "aggregateRating YOK");
  check(!("review" in hotel), "review YOK");
  check(!("reviewCount" in hotel), "reviewCount YOK");

  // zorunlu alanlar
  for (const f of ["@id","name","url","telephone","address","geo","numberOfRooms","checkinTime","checkoutTime","priceRange"])
    check(f in hotel, `Hotel.${f} var`);

  check(hotel.address["@type"] === "PostalAddress", "address tipi PostalAddress");
  check(hotel.geo["@type"] === "GeoCoordinates", "geo tipi GeoCoordinates");
  check(typeof hotel.geo.latitude === "number", "geo.latitude sayi");
  check(hotel.potentialAction?.["@type"] === "ReserveAction", "potentialAction ReserveAction");
  check(site.publisher?.["@id"] === hotel["@id"], "WebSite.publisher -> Hotel @id");

  // OLGU ESLESMESI: semadaki deger sayfada gorunuyor mu?
  check(text.includes(String(hotel.numberOfRooms)), `numberOfRooms (${hotel.numberOfRooms}) sayfada gorunuyor`);
  check(text.includes(hotel.checkinTime), `checkinTime (${hotel.checkinTime}) sayfada gorunuyor`);
  check(text.includes(hotel.name), "Otel adi sayfada gorunuyor");

  const unknown = walkTypes(schemas).filter((t) => !KNOWN.has(t));
  check(unknown.length === 0, `Bilinmeyen @type yok${unknown.length ? " -> " + [...new Set(unknown)] : ""}`);
}

console.log("\n=== 2. ODA DETAY: HotelRoom + Breadcrumb ===");
{
  const { schemas, text } = await page("/tr/odalar/teras-suiti");
  const room = byType(schemas, "HotelRoom");
  const crumbs = byType(schemas, "BreadcrumbList");

  check(!!room, "HotelRoom dugumu var");
  check(room.containedInPlace?.["@id"]?.endsWith("/#hotel"), "containedInPlace -> Hotel @id");
  check(room.occupancy?.unitCode === "C62", "occupancy unitCode C62 (adet)");
  check(room.floorSize?.unitCode === "MTK", "floorSize unitCode MTK (metrekare)");
  check(room.bed?.["@type"] === "BedDetails", "bed tipi BedDetails");
  check(room.offers?.["@type"] === "AggregateOffer", "offers AggregateOffer (baslangic fiyati)");
  check(typeof room.offers?.lowPrice === "number", "offers.lowPrice sayi");
  check(!("price" in (room.offers ?? {})), "Sabit 'price' yok (fiyat baslangic degeri)");
  check(room.offers?.availability?.startsWith("https://schema.org/"), "availability schema.org URL");

  check(text.includes(String(room.floorSize.value)), `floorSize (${room.floorSize.value}) sayfada gorunuyor`);
  check(text.includes(String(room.occupancy.maxValue)), `occupancy (${room.occupancy.maxValue}) sayfada gorunuyor`);
  check(text.includes(room.name), `Oda adi "${room.name}" sayfada gorunuyor`);

  check(!!crumbs, "BreadcrumbList var");
  const pos = crumbs.itemListElement.map((i) => i.position);
  check(JSON.stringify(pos) === JSON.stringify([1,2,3]), "Breadcrumb pozisyonlari 1,2,3");
  check(crumbs.itemListElement.every((i) => /^https?:\/\//.test(i.item)), "Breadcrumb item'lari mutlak URL");
}

console.log("\n=== 3. SSS: FAQPage ===");
{
  const { schemas, text } = await page("/tr/sss");
  const faq = byType(schemas, "FAQPage");
  check(!!faq, "FAQPage dugumu var");
  check(Array.isArray(faq.mainEntity) && faq.mainEntity.length > 0, `mainEntity dolu (${faq.mainEntity.length} soru)`);
  check(faq.mainEntity.every((q) => q["@type"] === "Question" && q.acceptedAnswer?.["@type"] === "Answer"),
    "Her ogede Question + acceptedAnswer/Answer");

  // GORUNMEYEN ICERIK ISARETLENMEZ: her soru VE cevap sayfada olmali
  const missingQ = faq.mainEntity.filter((q) => !text.includes(q.name));
  const missingA = faq.mainEntity.filter((q) => !text.includes(q.acceptedAnswer.text));
  check(missingQ.length === 0, `Tum sorular sayfada gorunuyor${missingQ.length ? " -> eksik: " + missingQ.length : ""}`);
  check(missingA.length === 0, `Tum cevaplar sayfada gorunuyor${missingA.length ? " -> eksik: " + missingA.length : ""}`);
}

console.log("\n=== 4. EN sema dili ===");
{
  const { schemas } = await page("/en/rooms/kule-odasi");
  const room = byType(schemas, "HotelRoom");
  check(room?.name === "Tower Room", `Oda adi Ingilizce ("${room?.name}")`);
  const crumbs = byType(schemas, "BreadcrumbList");
  check(crumbs?.itemListElement[1]?.item.includes("/en/rooms"), "Breadcrumb EN yolunu kullaniyor");
}

console.log("\n=== 5. robots.txt / sitemap.xml / llms.txt ===");
{
  const robots = await (await fetch(BASE + "/robots.txt")).text();
  for (const bot of ["GPTBot","ClaudeBot","PerplexityBot","Google-Extended","OAI-SearchBot"])
    check(robots.includes(bot), `robots.txt: ${bot} listelenmis`);
  check(/Sitemap:/i.test(robots), "robots.txt sitemap satiri var");
  check(!/Disallow: \/$/m.test(robots), "Kok dizin engellenmemiş");

  const sm = await (await fetch(BASE + "/sitemap.xml")).text();
  const urls = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  check(urls.length === 22, `sitemap 22 URL (8 sayfa + 3 oda) x 2 dil -> ${urls.length}`);
  check(urls.some((u) => u.endsWith("/en/rooms")), "sitemap EN yerellestirilmis yolu iceriyor");
  check(urls.some((u) => u.endsWith("/tr/odalar")), "sitemap TR yolu iceriyor");
  check(/hreflang/.test(sm), "sitemap hreflang alternatifleri iceriyor");

  const llms = await (await fetch(BASE + "/llms.txt")).text();
  check(llms.startsWith("# Vela Hotel"), "llms.txt H1 ile basliyor");
  check(llms.includes("> "), "llms.txt ozet blogu var");
  check(/FICTIONAL/i.test(llms), "llms.txt kurgusal oldugunu belirtiyor");
  check(llms.includes("24-room"), "llms.txt oda sayisini iceriyor");
}

console.log(`\n${"=".repeat(46)}\nGECEN: ${pass}   KALAN: ${fail}`);
process.exit(fail ? 1 : 0);
