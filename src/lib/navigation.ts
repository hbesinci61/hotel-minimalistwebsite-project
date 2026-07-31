import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

/**
 * Dil farkındalıklı gezinme API'si.
 *
 * KURAL: Site içi bağlantılarda next/link DEĞİL, buradaki Link kullanılır.
 * next/link kullanırsan dil öneki ve yerelleştirilmiş yol kaybolur.
 */
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
