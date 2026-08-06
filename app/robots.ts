import type { MetadataRoute } from "next";
import { business } from "@/content/tr";

/**
 * Yapay zekâ tarayıcıları bilerek açık bırakıldı.
 *
 * GPTBot, PerplexityBot, ClaudeBot ve Google-Extended engellenirse işletme
 * bu araçların cevaplarında görünmez. Yerel bir restoran için bu bir kayıp:
 * "Bursa'da kokoreç nerede yenir" sorusuna verilen cevapta yer almak istiyoruz.
 * `allow: "/"` zaten hepsini kapsıyor; burada ayrıca sayılmalarının sebebi
 * kararın bilinçli olduğunu belgelemek.
 */
const YAPAY_ZEKA_TARAYICILARI = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "PerplexityBot",
  "ClaudeBot",
  "Claude-SearchBot",
  "Google-Extended",
  "Applebot-Extended",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      { userAgent: YAPAY_ZEKA_TARAYICILARI, allow: "/" },
    ],
    sitemap: `${business.siteUrl}/sitemap.xml`,
    host: business.siteUrl,
  };
}
