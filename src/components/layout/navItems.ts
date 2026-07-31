/**
 * Header ve mobil menü aynı listeyi kullanır — ikisi ayrışmasın.
 * href değerleri routing.ts'teki KANONİK yollardır; yerelleştirmeyi
 * Link bileşeni yapar.
 */
export const navItems = [
  { href: "/odalar", key: "rooms" },
  { href: "/teras", key: "terrace" },
  { href: "/konum", key: "location" },
  { href: "/hakkimizda", key: "about" },
  { href: "/sss", key: "faq" },
  { href: "/iletisim", key: "contact" },
] as const;
