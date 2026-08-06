import type { MetadataRoute } from "next";
import { isletmeGetir } from "@/lib/veri";

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

export default async function robots(): Promise<MetadataRoute.Robots> {
  const { siteUrl } = await isletmeGetir();
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      { userAgent: YAPAY_ZEKA_TARAYICILARI, allow: "/" },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
