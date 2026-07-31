/**
 * ============================================================
 *  TEK DOĞRULUK KAYNAĞI  —  CLAUDE.md §4
 * ============================================================
 *
 * Otele dair her OLGU burada yaşar. Hem ekranda görünen metin
 * hem JSON-LD şeması bu dosyadan beslenir.
 *
 * NEDEN: Yapay zekâ arama motorları bir otelin varlığını, şema
 * verisiyle görünür metnin birbirini doğrulaması üzerinden
 * değerlendirir. İkisi ayrışırsa site güvenilmez sayılır ve
 * alıntılanmaz. Tek kaynak bu ayrışmayı imkânsız kılar.
 *
 * KURALLAR
 *  - Sayıları (oda sayısı, m², mesafe) bileşene elle yazma.
 *  - Aynı olgunun iki biçimi gerekiyorsa (telefonun E.164 ve
 *    ekran hâli gibi) ikisi de burada tanımlanır.
 *  - messages/*.json sayfa metnini tutar; olgusal veri tutmaz.
 *    Oda adı/özeti burada, çünkü şemayla birebir aynı olmalı.
 *  - Bir sayıyı değiştirirsen TÜREVLERİNİ de kontrol et. Oda
 *    tiplerinin adetleri toplamı numberOfRooms'a eşit olmalı;
 *    bu değişmez dosyanın altında build zamanında doğrulanıyor.
 *
 * Vela Hotel KURGUSALDIR. Gerçek bir işletme değildir.
 */

export const hotel = {
  // --- Kimlik ---------------------------------------------------
  name: "Vela Hotel",
  legalName: "Vela Butik Otelcilik A.Ş.",
  /** Yer tutucu. Yayına alınacaksa gerçekten sahip olunan alan adıyla değiştir. */
  url: "https://velahotel.com",
  /** E.164 — şema ve tel: bağlantısı bunu kullanır */
  telephone: "+902120000000",
  /** Ekranda görünen biçim */
  telephoneDisplay: "+90 212 000 00 00",
  email: "rezervasyon@velahotel.com",
  foundingYear: 2016,
  /** Binanın yapım yılı — "1890 yapımı" ifadesi buradan gelir */
  buildingYear: 1890,

  // --- Konum ----------------------------------------------------
  address: {
    streetAddress: "Serdar-ı Ekrem Caddesi No: 12",
    addressLocality: "Beyoğlu",
    addressRegion: "İstanbul",
    postalCode: "34421",
    addressCountry: "TR",
  },
  geo: { latitude: 41.0269, longitude: 28.9726 },
  neighborhood: { tr: "Galata", en: "Galata" },
  city: { tr: "İstanbul", en: "Istanbul" },

  // --- İşletme --------------------------------------------------
  numberOfRooms: 24,
  checkinTime: "15:00",
  checkoutTime: "12:00",
  priceRange: "₺₺₺",
  currency: "TRY",
  starRating: 4,
  petsAllowed: true,
  smokingAllowed: false,
  /** Resepsiyon 7/24 açık */
  receptionAlwaysOpen: true,

  // --- Oda tipleri ----------------------------------------------
  // count toplamı numberOfRooms'a eşit olmalı: 12 + 8 + 4 = 24
  rooms: [
    {
      slug: "avlu-odasi",
      name: { tr: "Avlu Odası", en: "Courtyard Room" },
      summary: {
        tr: "İç avluya bakan, 22 m² büyüklüğünde sakin oda.",
        en: "A quiet 22 m² room overlooking the inner courtyard.",
      },
      count: 12,
      sizeSqm: 22,
      maxOccupancy: 2,
      bed: { type: { tr: "Çift kişilik", en: "Queen" }, count: 1 },
      priceFrom: 4800,
      hasView: false,
    },
    {
      slug: "kule-odasi",
      name: { tr: "Kule Odası", en: "Tower Room" },
      summary: {
        tr: "Galata Kulesi manzaralı, 28 m² büyüklüğünde köşe oda.",
        en: "A 28 m² corner room with a view of Galata Tower.",
      },
      count: 8,
      sizeSqm: 28,
      maxOccupancy: 2,
      bed: { type: { tr: "King", en: "King" }, count: 1 },
      priceFrom: 6200,
      hasView: true,
    },
    {
      slug: "teras-suiti",
      name: { tr: "Teras Süiti", en: "Terrace Suite" },
      summary: {
        tr: "Özel terası ve Haliç manzarası olan 42 m² süit.",
        en: "A 42 m² suite with a private terrace and Golden Horn view.",
      },
      count: 4,
      sizeSqm: 42,
      maxOccupancy: 3,
      bed: { type: { tr: "King", en: "King" }, count: 1 },
      priceFrom: 9500,
      hasView: true,
    },
  ],

  // --- Olanaklar ------------------------------------------------
  // Küçük, tarihi bir binada butik otel: havuz/spa/fitness YOK.
  // Olmayan olanağı listeleme — yanlış beklenti yaratır.
  amenities: [
    { key: "wifi", tr: "Ücretsiz Wi-Fi", en: "Free Wi-Fi" },
    { key: "breakfast", tr: "Kahvaltı dahil", en: "Breakfast included" },
    { key: "terrace-bar", tr: "Teras bar", en: "Terrace bar" },
    { key: "reception-24", tr: "7/24 resepsiyon", en: "24-hour reception" },
    { key: "ac", tr: "Klima", en: "Air conditioning" },
    { key: "pets", tr: "Evcil hayvan kabul edilir", en: "Pets allowed" },
    { key: "luggage", tr: "Bagaj emaneti", en: "Luggage storage" },
    { key: "transfer", tr: "Havalimanı transferi (ücretli)", en: "Airport transfer (paid)" },
  ],

  // --- Çevre: sayısal, doğrulanabilir (CLAUDE.md §10.4) ----------
  nearby: [
    { key: "galata-tower", tr: "Galata Kulesi", en: "Galata Tower", meters: 250, walkMinutes: 3 },
    { key: "tunel", tr: "Tünel", en: "Tünel Funicular", meters: 400, walkMinutes: 5 },
    { key: "karakoy", tr: "Karaköy", en: "Karaköy", meters: 700, walkMinutes: 9 },
    { key: "istiklal", tr: "İstiklal Caddesi", en: "İstiklal Avenue", meters: 850, walkMinutes: 11 },
    { key: "galata-bridge", tr: "Galata Köprüsü", en: "Galata Bridge", meters: 900, walkMinutes: 12 },
  ],
  airports: [
    { code: "IST", tr: "İstanbul Havalimanı", en: "Istanbul Airport", km: 41, driveMinutes: 45 },
    { code: "SAW", tr: "Sabiha Gökçen Havalimanı", en: "Sabiha Gökçen Airport", km: 50, driveMinutes: 60 },
  ],

  // --- SSS: misafirin gerçekten sorduğu biçimde -----------------
  faq: [
    {
      key: "early-luggage",
      q: {
        tr: "Girişten önce bagajımı bırakabilir miyim?",
        en: "Can I leave my luggage before check-in?",
      },
      a: {
        tr: "Evet. Resepsiyon 7/24 açıktır ve bagajınızı giriş saatinden önce ücretsiz olarak emanete alır.",
        en: "Yes. Reception is open 24 hours and will store your luggage free of charge before check-in.",
      },
    },
    {
      key: "checkin-time",
      q: { tr: "Giriş ve çıkış saatleri nedir?", en: "What are the check-in and check-out times?" },
      a: {
        tr: "Giriş 15:00, çıkış 12:00'dir. Müsaitlik durumuna göre erken giriş veya geç çıkış talep edebilirsiniz.",
        en: "Check-in is at 15:00 and check-out at 12:00. Early check-in or late check-out can be requested subject to availability.",
      },
    },
    {
      key: "parking",
      q: { tr: "Otelin otoparkı var mı?", en: "Does the hotel have parking?" },
      a: {
        tr: "Otelin kendi otoparkı yoktur. Serdar-ı Ekrem Caddesi araç trafiğine kapalıdır; 300 metre mesafedeki anlaşmalı otoparka vale hizmeti sunuyoruz.",
        en: "The hotel has no car park of its own. Serdar-ı Ekrem Street is closed to traffic; we offer valet service to a partner car park 300 metres away.",
      },
    },
    {
      key: "pets",
      q: { tr: "Evcil hayvan kabul ediyor musunuz?", en: "Do you accept pets?" },
      a: {
        tr: "Evet, 15 kilograma kadar evcil hayvanlar ek ücret olmadan kabul edilir. Rezervasyon sırasında belirtmeniz yeterlidir.",
        en: "Yes, pets up to 15 kilograms are welcome at no extra charge. Please note it when booking.",
      },
    },
    {
      key: "breakfast",
      q: { tr: "Kahvaltı fiyata dahil mi?", en: "Is breakfast included in the rate?" },
      a: {
        tr: "Evet. Kahvaltı tüm oda tiplerinde fiyata dahildir ve teras katında 07:30–10:30 arasında servis edilir.",
        en: "Yes. Breakfast is included with every room type and is served on the terrace floor between 07:30 and 10:30.",
      },
    },
    {
      key: "accessibility",
      q: { tr: "Asansör var mı?", en: "Is there a lift?" },
      a: {
        tr: "Bina 1890 yapımıdır ve asansörü yoktur. Zemin katta iki adet Avlu Odası bulunur; merdiven kullanmak istemeyen misafirlerimiz için bu odaları öneriyoruz.",
        en: "The building dates from 1890 and has no lift. Two Courtyard Rooms are located on the ground floor; we recommend these for guests who prefer to avoid stairs.",
      },
    },
  ],
} as const;

export type Hotel = typeof hotel;
export type Room = Hotel["rooms"][number];
export type RoomSlug = Room["slug"];

/** Ekranda gösterilecek fiyat aralığının alt sınırı. */
export const priceFrom = Math.min(...hotel.rooms.map((r) => r.priceFrom));

/** Oda tipi adetlerinin toplamı — numberOfRooms ile eşleşmeli. */
export const roomCountTotal = hotel.rooms.reduce((sum, r) => sum + r.count, 0);

/**
 * Değişmez kontrolü — build zamanında çalışır.
 *
 * Şemada "24 oda" yazarken sayfada oda tiplerinin toplamı 23 çıkarsa
 * site kendi kendisiyle çelişir; GEO açısından en pahalı hata budur.
 * Bu yüzden tutarsız veriyle DERLEME YAPILMAZ.
 */
if (roomCountTotal !== hotel.numberOfRooms) {
  throw new Error(
    `hotel.ts tutarsız: oda tiplerinin adet toplamı ${roomCountTotal}, ` +
      `ancak numberOfRooms ${hotel.numberOfRooms}. ` +
      `İkisi eşit olmalı — şema ile sayfa metni ayrışamaz (CLAUDE.md §4).`,
  );
}

const slugs = hotel.rooms.map((r) => r.slug);
if (new Set(slugs).size !== slugs.length) {
  throw new Error("hotel.ts tutarsız: oda slug'ları benzersiz olmalı (URL çakışması).");
}
