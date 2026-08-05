import type { MetadataRoute } from "next";
import { business } from "@/content/tr";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // /qr sitemap'te yok: içeriği /menu ile aynı, noindex ve canonical'ı /menu.
  return [
    {
      url: business.siteUrl,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${business.siteUrl}/menu`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
  ];
}
