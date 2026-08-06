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
    /**
     * Panelden yüklenen görseller Supabase depolamasında duruyor.
     * next/image yalnızca burada sayılan kaynaklardan görsel işler —
     * açık uçlu izin, sitenin görsel işlemcisini başkalarının kullanmasına
     * ve trafiğinin sömürülmesine yol açardı.
     */
    remotePatterns: [
      {
        protocol: "https",
        hostname: "mcdztalchglavwnzrdmh.supabase.co",
        pathname: "/storage/v1/object/public/gorseller/**",
      },
    ],
  },
  // Geliştirme rozeti, sosyal paylaşım görselini üretirken kadraja giriyordu.
  devIndicators: false,

  /**
   * Güvenlik başlıkları.
   *
   * İçerik Güvenlik Politikası (CSP) bilerek EKLENMEDİ: sayfada satır içi
   * JSON-LD ve onay sonrası yüklenen üçüncü taraf pikselleri var; sıkı bir CSP
   * ikisini de kırardı ve gevşek bir CSP güvenlik sağlamaz, yalnızca güvenlik
   * varmış hissi verir. Pikseller kesinleştiğinde nonce tabanlı CSP eklenebilir.
   */
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          // Tarayıcı dosya türünü tahmin etmeye çalışmasın
          { key: "X-Content-Type-Options", value: "nosniff" },
          // Dış sitelere tam adres sızmasın
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          // Kullanılmayan cihaz izinleri kapalı
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), payment=()",
          },
        ],
      },
      {
        // Yönetim paneli hiçbir yerde çerçeve içine alınamaz —
        // tıklama hırsızlığına (clickjacking) karşı.
        source: "/yonetim/:path*",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "no-referrer" },
          // Panel sayfaları hiçbir ara katmanda önbelleğe alınmasın
          { key: "Cache-Control", value: "private, no-store" },
        ],
      },
    ];
  },
};

export default nextConfig;
