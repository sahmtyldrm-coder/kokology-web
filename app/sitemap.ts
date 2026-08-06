import type { MetadataRoute } from "next";
import { business } from "@/content/tr";
import { kategoriSluglari } from "@/content/kategoriler";
import { yazilarGetir } from "@/lib/veri";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Taslak yazılar sitemap'e girmez: yazilarGetir yalnızca yayındakileri döner.
  const yazilar = await yazilarGetir();
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
      url: url("/blog"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    ...yazilar.map((y) => ({
      url: url(`/blog/${y.slug}`),
      lastModified: new Date(y.guncelleme ?? y.tarih),
      changeFrequency: "monthly" as const,
      priority: 0.6,
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
