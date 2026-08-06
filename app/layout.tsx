import type { Metadata, Viewport } from "next";
import { Anton, Fraunces, Hanken_Grotesk, Caveat } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import { business, seo, a11y, hero } from "@/content/tr";
import { siteSchema, jsonLdString } from "@/lib/schema";
import { Olcum } from "@/components/Olcum";
import "./globals.css";

/**
 * Ölçüm kimlikleri ortam değişkeninden gelir; tanımlı değilse ilgili etiket
 * hiç basılmaz — site kimliksiz de sorunsuz çalışır.
 * .env.local içine yazılır, .env.ornek dosyasına bak.
 */
const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
const GSC_VERIFICATION = process.env.NEXT_PUBLIC_GSC_VERIFICATION;

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

export const metadata: Metadata = {
  metadataBase: new URL(business.siteUrl),
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
    url: business.siteUrl,
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
  ...(GSC_VERIFICATION && {
    verification: { google: GSC_VERIFICATION },
  }),
};

export const viewport: Viewport = {
  themeColor: "#141210",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
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

        {children}

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdString(siteSchema()) }}
        />

        {/* Çerezsiz, kimliksiz kendi ölçümümüz — çerez onayı beklemeden çalışır */}
        <Olcum />

        {GA_ID && <GoogleAnalytics gaId={GA_ID} />}
      </body>
    </html>
  );
}
