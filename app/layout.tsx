import type { Metadata, Viewport } from "next";
import { Anton, Fraunces, Hanken_Grotesk, Caveat } from "next/font/google";
import { business, seo, a11y, hero } from "@/content/tr";
import { siteSchema, jsonLdString } from "@/lib/schema";
import { Olcum } from "@/components/Olcum";
import { IsletmeSaglayici } from "@/components/IsletmeSaglayici";
import { OnayVePikseller } from "@/components/OnayVePikseller";
import type { TakipKodlari } from "@/components/Pikseller";
import { isletmeGetir, saatlerGetir, ayarlarGetir } from "@/lib/veri";
import "./globals.css";

/**
 * Search Console doğrulaması önce panelden (İletişim ve linkler → Search
 * Console doğrulama), yoksa ortam değişkeninden okunur. Panel öncelikli çünkü
 * doğrulama kodu değiştiğinde yeniden dağıtım beklemek gerekmesin.
 *
 * Çerez onayının dışında: tek seferlik bir meta etiketi, kimse izlenmiyor.
 *
 * Analytics ve reklam kodları burada DEĞİL: onlar panelden giriliyor ve
 * yalnızca çerez onayı alındıktan sonra yükleniyor. İki ayrı yoldan GA
 * yüklenseydi sayfa görüntülemeler iki kez sayılırdı.
 */
async function gscDogrulama(): Promise<string | undefined> {
  const ayarlar = await ayarlarGetir();
  const takip = (ayarlar.takip ?? {}) as Record<string, string>;
  const panelden = takip.searchConsole?.trim();
  return panelden || process.env.NEXT_PUBLIC_GSC_VERIFICATION || undefined;
}

/* --------------------------------------------------------------------------
   Dört ses. Hepsinde `latin-ext` var — Türkçe ş ğ ı İ ç ö ü doğru render eder.
   -------------------------------------------------------------------------- */

const anton = Anton({
  variable: "--font-anton",
  subsets: ["latin", "latin-ext"],
  weight: "400", // Anton tek ağırlıkta gelir
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin", "latin-ext"],
  style: ["normal", "italic"],
  display: "swap",
});

const hanken = Hanken_Grotesk({
  variable: "--font-hanken",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

/* -------------------------------------------------------------------------- */

/**
 * Alan adı panelden değişebildiği için metadata statik olamaz:
 * metadataBase, canonical ve Open Graph adresleri her istekte okunur.
 */
export async function generateMetadata(): Promise<Metadata> {
  const [isletme, gsc] = await Promise.all([isletmeGetir(), gscDogrulama()]);
  return {
    metadataBase: new URL(isletme.siteUrl),
  title: {
    default: seo.title,
    template: seo.titleTemplate,
  },
  description: seo.description,
  keywords: [...seo.keywords],
  applicationName: business.name,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "tr_TR",
      url: isletme.siteUrl,
    siteName: business.name,
    title: seo.title,
    description: seo.description,
    images: [
      {
        url: hero.image.src,
        width: 2000,
        height: 1333,
        alt: seo.ogImageAlt,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: seo.title,
    description: seo.description,
    images: [hero.image.src],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  formatDetection: {
    telephone: true,
    address: true,
  },
    ...(gsc && { verification: { google: gsc } }),
  };
}

export const viewport: Viewport = {
  themeColor: "#141210",
  colorScheme: "dark",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  // Tek okuma, tüm istemci bileşenlerine bağlamla dağıtılır.
  const [isletme, saatler, ayarlar] = await Promise.all([
    isletmeGetir(),
    saatlerGetir(),
    ayarlarGetir(),
  ]);

  const takip = (ayarlar.takip ?? {}) as TakipKodlari;
  const takipVar = Object.values(takip).some((v) => v && String(v).trim());

  return (
    <html
      lang="tr"
      className={`${anton.variable} ${fraunces.variable} ${hanken.variable} ${caveat.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-charcoal text-bone flex flex-col overflow-x-hidden">
        <a
          href="#icerik"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-full focus:bg-bone focus:px-5 focus:py-3 focus:font-sans focus:text-sm focus:font-semibold focus:text-charcoal"
        >
          {a11y.skipToContent}
        </a>

        <IsletmeSaglayici deger={{ isletme, saatler }}>{children}</IsletmeSaglayici>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdString(await siteSchema()) }}
        />

        {/* Çerezsiz, kimliksiz kendi ölçümümüz — çerez onayı beklemeden çalışır */}
        <Olcum />

        {/* Onay bandı ve üçüncü taraf kodları. Bant yalnızca izlenecek bir şey
            varsa çıkar — hiçbir kod tanımlı değilken onay sormak gereksiz.
            Onay tarayıcıda okunuyor; sunucuda okumak tüm sayfaları
            dinamikleştirip statik hızı öldürüyordu. */}
        {takipVar && <OnayVePikseller kodlar={takip} />}
      </body>
    </html>
  );
}
