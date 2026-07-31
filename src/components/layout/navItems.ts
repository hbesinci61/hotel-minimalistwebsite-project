/**
 * Header ve mobil menü aynı listeyi kullanır — ikisi ayrışmasın.
 * href değerleri routing.ts'teki KANONİK yollardır; yerelleştirmeyi
 * Link bileşeni yapar.
 */
export const navItems = [
  { href: "/odalar", key: "rooms" },
  { href: "/restoran", key: "restaurant" },
  { href: "/konum", key: "location" },
  { href: "/galeri", key: "gallery" },
  { href: "/hakkimizda", key: "about" },
  { href: "/iletisim", key: "contact" },
] as const;
