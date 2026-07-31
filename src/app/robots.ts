import type { MetadataRoute } from "next";
import { hotel } from "@/content/hotel";

/**
 * Tarayıcı erişimi — CLAUDE.md §10.1.
 *
 * Yapay zekâ tarayıcıları AÇIKÇA karşılanır. Bir otel sitesinin bunları
 * engellemesi, ChatGPT/Claude/Perplexity cevaplarında hiç görünmemesi
 * demektir; GEO'nun ön şartı burada başlar.
 *
 * Adlar tek tek yazılıyor çünkü `User-agent: *` yeterli olsa da açık izin
 * niyeti belgeler: biri ileride genel bir kısıtlama eklerse bu satırlar
 * neyin bilinçli olarak açık bırakıldığını gösterir.
 */
const aiCrawlers = [
  "GPTBot", // OpenAI — eğitim
  "OAI-SearchBot", // OpenAI — ChatGPT arama
  "ChatGPT-User", // OpenAI — kullanıcı tetikli gezinme
  "ClaudeBot", // Anthropic
  "Claude-User",
  "Claude-SearchBot",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended", // Gemini
  "Applebot-Extended",
  "CCBot", // Common Crawl
  "meta-externalagent",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      ...aiCrawlers.map((userAgent) => ({ userAgent, allow: "/" })),
    ],
    sitemap: `${hotel.url}/sitemap.xml`,
    host: hotel.url,
  };
}
