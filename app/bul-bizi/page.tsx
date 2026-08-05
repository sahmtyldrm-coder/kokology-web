import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { ScrollProgress } from "@/components/ScrollProgress";
import { StickyCTA } from "@/components/StickyCTA";
import { Footer } from "@/components/Footer";
import { FindUs } from "@/components/FindUs";
import { Reveal } from "@/components/Reveal";
import { Breadcrumb } from "@/components/Breadcrumb";
import { a11y, business } from "@/content/tr";
import { bulBiziSayfa } from "@/content/sayfalar";
import { sayfaSchema, jsonLdString } from "@/lib/schema";

export const metadata: Metadata = {
  title: bulBiziSayfa.title,
  description: bulBiziSayfa.description,
  alternates: { canonical: "/bul-bizi" },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: `${business.siteUrl}/bul-bizi`,
    title: bulBiziSayfa.title,
    description: bulBiziSayfa.description,
  },
};

export default function BulBiziPage() {
  return (
    <>
      <ScrollProgress />
      <Nav />

      <main id="icerik" aria-label={a11y.mainLandmark} className="flex-1">
        <section className="bg-charcoal px-5 pt-28 pb-4 sm:px-8 md:pt-36 lg:px-12">
          <div className="mx-auto w-full max-w-[1400px]">
            <Breadcrumb
              items={[
                { href: "/", label: business.name },
                { label: bulBiziSayfa.breadcrumb },
              ]}
            />
            <Reveal className="mt-8 block">
              <h1 className="max-w-[20ch] font-display text-jumbo text-bone">
                {bulBiziSayfa.h1}
              </h1>
            </Reveal>
          </div>
        </section>

        {/* Harita, saatler, iletişim — ana sayfadakiyle aynı bileşen */}
        <FindUs showHeading={false} />

        {/* Yol tarifi metni: haritanın anlatamadığı kısım */}
        <section className="border-t border-bone/10 bg-charcoal px-5 py-16 sm:px-8 md:py-20 lg:px-12">
          <div className="mx-auto w-full max-w-[1400px]">
            <Reveal>
              <h2 className="font-display text-2xl text-brass sm:text-3xl">
                {bulBiziSayfa.directionsHeading}
              </h2>
              <div className="mt-5 max-w-[68ch] space-y-4">
                {bulBiziSayfa.directions.map((p) => (
                  <p
                    key={p.slice(0, 24)}
                    className="font-sans text-base leading-relaxed text-bone/65"
                  >
                    {p}
                  </p>
                ))}
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      <Footer />
      <StickyCTA />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdString(
            sayfaSchema({
              path: "/bul-bizi",
              name: bulBiziSayfa.title,
              description: bulBiziSayfa.description,
              breadcrumb: bulBiziSayfa.breadcrumb,
            }),
          ),
        }}
      />
    </>
  );
}
