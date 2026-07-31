const BASE = process.argv[2] ?? "http://localhost:3000";
const pages = {
  tr: ["/tr","/tr/odalar","/tr/odalar/kule-odasi","/tr/teras","/tr/konum","/tr/hakkimizda","/tr/sss","/tr/iletisim","/tr/rezervasyon"],
  en: ["/en","/en/rooms","/en/rooms/kule-odasi","/en/terrace","/en/location","/en/about","/en/faq","/en/contact","/en/booking"],
};
const hood = { tr: "Galata", en: "Galata" };
const city = { tr: "İstanbul", en: "Istanbul" };

async function visible(path) {
  const html = await (await fetch(BASE + path)).text();
  // <main> ve <footer> disi (header/nav) sayilmasin diye <main> icini al
  const main = html.match(/<main[\s\S]*?<\/main>/)?.[0] ?? html;
  return main
    .replace(/<script[\s\S]*?<\/script>/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&#x27;/g, "'").replace(/&amp;/g, "&")
    .replace(/\s+/g, " ");
}

console.log("VARLIK NETLIGI — main icinde otel adi + semt + sehir (CLAUDE.md §10.4)\n");
let fail = 0;
for (const [loc, list] of Object.entries(pages)) {
  for (const p of list) {
    const t = await visible(p);
    const hasName = t.includes("Vela Hotel");
    const hasHood = t.includes(hood[loc]);
    const hasCity = t.includes(city[loc]);
    const okAll = hasName && hasHood && hasCity;
    if (!okAll) fail++;
    console.log(`${okAll ? "PASS" : "EKSIK"}  ${p.padEnd(26)} ad:${hasName?"+":"-"} semt:${hasHood?"+":"-"} sehir:${hasCity?"+":"-"}`);
  }
}
console.log(`\nEksik sayfa: ${fail}`);
