import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * Geliştirme sunucusuna yerel ağdan erişim.
   *
   * Next.js, başlatıldığı adresten (localhost) farklı bir kaynaktan gelen
   * istekleri geliştirme modunda güvenlik gereği engelliyor. Telefondan
   * `http://192.168.x.x:3000` açıldığında HTML geliyor ama istemci paketi
   * engelleniyor; React devreye girmediği için scroll animasyonlarının
   * başlangıç durumu (opacity: 0) kalıcı hâle geliyor ve hero ile footer
   * dışındaki her yer görünmez oluyor.
   *
   * YALNIZCA geliştirmeyi etkiler — üretimde böyle bir engelleme yok.
   * Yerel ağ aralıkları: ev/ofis yönlendiricilerinin kullandığı özel adresler.
   */
  allowedDevOrigins: ["192.168.0.*", "192.168.1.*", "10.0.0.*", "172.20.10.*"],

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
