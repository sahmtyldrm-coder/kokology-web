import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // AVIF önce denenir; desteklemeyen tarayıcı WebP'ye düşer. Yerel aramada
    // hız doğrudan sıralamayı etkilediği için LCP görselinde fark yaratır.
    formats: ["image/avif", "image/webp"],
    // Next 16 yalnızca burada sayılan kalite değerlerine izin veriyor.
    // Bileşenlerde `quality={...}` kullanılan her değer listede olmalı,
    // yoksa istek çalışma zamanında uyarı üretip varsayılana düşüyor.
    qualities: [70, 75, 78, 80, 82],
  },
  // Geliştirme rozeti, sosyal paylaşım görselini üretirken kadraja giriyordu.
  devIndicators: false,
};

export default nextConfig;
