import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/components/Nav";
import { ScrollProgress } from "@/components/ScrollProgress";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/Reveal";
import { Breadcrumb } from "@/components/Breadcrumb";
import { a11y, business } from "@/content/tr";
import { isletmeGetir } from "@/lib/veri";
import { siparisSayfa } from "@/content/sayfalar";
import { sayfaSchema, jsonLdString } from "@/lib/schema";
import { sayfaBasligi } from "@/lib/baslik";

/**
 * Paket sipariş sayfası — kırmızı CTA'ların hedefi.
 *
 * Google Ads / GA4 "siparis_tikla" dönüşümü YALNIZCA buradaki platform
 * butonlarında (data-olcum="siparis") sayılır. Platform linkleri
 * content/tr.ts → business.ordering ya da panelden (ayarlar.siparis) gelir;
 * boş olan platform gösterilmez.
 */

const PLATFORMLAR: { anahtar: string; ad: string }[] = [
  { anahtar: "trendyolYemek", ad: "Trendyol Go" },
  { anahtar: "yemeksepeti", ad: "Yemeksepeti" },
  { anahtar: "getir", ad: "Getir Yemek" },
  { anahtar: "migrosYemek", ad: "Migros Yemek" },
  { anahtar: "uberEats", ad: "Uber Eats" },
];

export async function generateMetadata(): Promise<Metadata> {
  const isletme = await isletmeGetir();
  return {
    title: sayfaBasligi(siparisSayfa.title),
    description: siparisSayfa.description,
    alternates: { canonical: "/siparis" },
    openGraph: {
      type: "website",
      locale: "tr_TR",
      url: `${isletme.siteUrl}/siparis`,
      title: siparisSayfa.title,
      description: siparisSayfa.description,
      images: [
        {
          url: "/images/urun/kokology-kokorec-ekmek-arasi-bursa-nilufer-10.jpg",
          alt: "Kokology paket kokoreç — Bursa Nilüfer Ataevler",
        },
      ],
    },
  };
}

export default async function SiparisPage() {
  const isletme = await isletmeGetir();
  const linkler = isletme.ordering as Record<string, string>;
  const platformlar = PLATFORMLAR.filter((p) => linkler[p.anahtar]?.trim());

  return (
    <>
      <ScrollProgress />
      <Nav />

      <main id="icerik" aria-label={a11y.mainLandmark} className="flex-1">
        <section className="bg-charcoal px-5 pt-28 pb-12 sm:px-8 md:pt-36 lg:px-12">
          <div className="mx-auto w-full max-w-[1400px]">
            <Breadcrumb
              items={[
                { href: "/", label: business.name },
                { label: siparisSayfa.breadcrumb },
              ]}
            />
            <Reveal className="mt-8 block">
              <h1 className="max-w-[20ch] font-display text-jumbo text-bone">
                {siparisSayfa.h1}
              </h1>
              <p className="mt-6 max-w-[60ch] font-sans text-lg leading-relaxed text-bone/70">
                {siparisSayfa.lead}
              </p>
            </Reveal>
          </div>
        </section>

        <section className="bg-charcoal px-5 pb-16 sm:px-8 lg:px-12">
          <div className="mx-auto w-full max-w-[1400px]">
            <Reveal>
              <h2 className="font-display text-2xl text-brass sm:text-3xl">
                {siparisSayfa.platformsHeading}
              </h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:max-w-[900px]">
                {platformlar.map((p) => (
                  <a
                    key={p.anahtar}
                    href={linkler[p.anahtar]}
                    data-olcum="siparis"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex min-h-[88px] items-center justify-between gap-4 rounded-2xl bg-red px-7 py-5 font-sans text-bone transition-all duration-300 hover:bg-brass hover:text-charcoal"
                  >
                    <span>
                      <span className="block text-sm opacity-80">Sipariş ver</span>
                      <span className="block text-2xl font-semibold">{p.ad}</span>
                    </span>
                    <span aria-hidden className="text-2xl transition-transform group-hover:translate-x-1">
                      →
                    </span>
                  </a>
                ))}
              </div>
              <p className="mt-4 max-w-[68ch] font-sans text-sm text-bone/50">
                {siparisSayfa.platformNote}
              </p>
            </Reveal>
          </div>
        </section>

        <section className="border-t border-bone/10 bg-charcoal px-5 py-16 sm:px-8 lg:px-12">
          <div className="mx-auto grid w-full max-w-[1400px] gap-12 lg:grid-cols-2">
            <Reveal>
              <h2 className="font-display text-2xl text-brass sm:text-3xl">
                {siparisSayfa.gelAlHeading}
              </h2>
              <p className="mt-5 max-w-[60ch] font-sans text-base leading-relaxed text-bone/65">
                {siparisSayfa.gelAl}
              </p>
              <a
                href={`tel:${isletme.phone.e164}`}
                data-olcum="ara"
                className="mt-6 inline-flex min-h-[56px] items-center gap-2 rounded-full border border-bone/25 px-8 font-sans text-lg font-medium text-bone transition-colors duration-200 hover:border-brass hover:text-brass"
              >
                {isletme.phone.display}
              </a>
              <p className="mt-4 font-sans text-sm text-bone/50">
                Her gün 11.00 – 03.00 · {isletme.address.full}
              </p>
            </Reveal>
            <Reveal>
              <h2 className="font-display text-2xl text-brass sm:text-3xl">
                {siparisSayfa.ipuclariHeading}
              </h2>
              <ul className="mt-5 max-w-[60ch] list-disc space-y-2 pl-5 font-sans text-base leading-relaxed text-bone/65">
                {siparisSayfa.ipuclari.map((m) => (
                  <li key={m.slice(0, 20)}>{m}</li>
                ))}
              </ul>
              <div className="mt-6 flex flex-wrap gap-4 font-sans text-base">
                <Link href="/menu" data-olcum="menu" className="text-brass underline-offset-4 hover:underline">
                  Menü ve fiyatlar →
                </Link>
                <Link href="/blog/bursa-kokorec-siparis-paket-kokorec" className="text-brass underline-offset-4 hover:underline">
                  Sipariş rehberi →
                </Link>
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      <Footer />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdString(
            await sayfaSchema({
              path: "/siparis",
              name: siparisSayfa.title,
              description: siparisSayfa.description,
              breadcrumb: siparisSayfa.breadcrumb,
            }),
          ),
        }}
      />
    </>
  );
}
