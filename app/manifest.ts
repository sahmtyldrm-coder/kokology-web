import type { MetadataRoute } from "next";
import { business, seo } from "@/content/tr";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: business.googleName,
    short_name: business.name,
    description: seo.description,
    start_url: "/",
    display: "standalone",
    background_color: "#141210",
    theme_color: "#141210",
    lang: "tr",
    dir: "ltr",
    categories: ["food", "restaurant"],
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      {
        src: "/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
