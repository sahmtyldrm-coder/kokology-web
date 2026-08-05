import type { MetadataRoute } from "next";
import { business } from "@/content/tr";
import { kategoriSluglari } from "@/content/kategoriler";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const url = (path = "") => `${business.siteUrl}${path}`;

  // /qr sitemap'te yok: içeriği /menu ile aynı, noindex ve canonical'ı /menu.
  return [
    { url: url(), lastModified: now, changeFrequency: "weekly", priority: 1 },
    {
      url: url("/menu"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...kategoriSluglari.map((slug) => ({
      url: url(`/menu/${slug}`),
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    {
      url: url("/hakkimizda"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: url("/bul-bizi"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];
}
