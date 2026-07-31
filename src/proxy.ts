import createMiddleware from "next-intl/middleware";
import { routing } from "@/lib/routing";

/**
 * Dil yönlendirmesi.
 *
 * Next 16'da bu dosya "middleware.ts" değil "proxy.ts" olarak adlandırılır;
 * eski ad kullanımdan kaldırıldı. next-intl'in createMiddleware'i buraya
 * varsayılan dışa aktarım olarak bağlanır.
 */
export default createMiddleware(routing);

export const config = {
  // API, Next iç yolları ve uzantılı dosyalar (favicon, llms.txt, görseller) hariç her şey
  matcher: "/((?!api|_next|_vercel|.*\\..*).*)",
};
