import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Nav } from "@/components/Nav";
import { ScrollProgress } from "@/components/ScrollProgress";
import { StickyCTA } from "@/components/StickyCTA";
import { Footer } from "@/components/Footer";
import { Reveal, RevealGroup, RevealItem } from "@/components/Reveal";
import { Breadcrumb } from "@/components/Breadcrumb";
import { a11y, business } from "@/content/tr";
import { hakkimizda } from "@/content/sayfalar";
import { sayfaSchema, jsonLdString } from "@/lib/schema";

export const metadata: Metadata = {
  title: hakkimizda.title,
  description: hakkimizda.description,
  alternates: { canonical: "/hakkimizda" },
  openGraph: {
    type: "article",
    locale: "tr_TR",
    url: `${business.siteUrl}/hakkimizda`,
    title: hakkimizda.title,
    description: hakkimizda.description,
  },
};

export default function HakkimizdaPage() {
  return (
    <>
      <ScrollProgress />
      <Nav />

      <main id="icerik" aria-label={a11y.mainLandmark} className="flex-1">
        <section className="border-b border-bone/10 bg-charcoal px-5 pt-28 pb-16 sm:px-8 md:pt-36 lg:px-12">
          <div className="mx-auto w-full max-w-[1400px]">
            <Breadcrumb
              items={[
                { href: "/", label: business.name },
                { label: hakkimizda.breadcrumb },
              ]}
            />
            <Reveal className="mt-8 block">
              <p className="font-sans text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-brass">
                {hakkimizda.eyebrow}
              </p>
              <h1 className="mt-4 max-w-[20ch] font-display text-jumbo text-bone">
                {hakkimizda.h1}
              </h1>
              <p className="mt-6 max-w-[54ch] font-serif text-lg leading-relaxed text-bone/70 italic">
                {hakkimizda.lead}
              </p>
            </Reveal>
          </div>
        </section>

        <section className="bg-charcoal px-5 py-16 sm:px-8 md:py-20 lg:px-12">
          <div className="mx-auto w-full max-w-[1400px]">
            <RevealGroup className="grid gap-14 md:grid-cols-3 md:gap-10">
              {hakkimizda.sections.map((s) => (
                <RevealItem key={s.title}>
                  <h2 className="font-display text-2xl text-brass sm:text-3xl">
                    {s.title}
                  </h2>
                  <div className="mt-5 space-y-4">
                    {s.body.map((p) => (
                      <p
                        key={p.slice(0, 24)}
                        className="font-sans text-base leading-relaxed text-bone/65"
                      >
                        {p}
                      </p>
                    ))}
                  </div>
                </RevealItem>
              ))}
            </RevealGroup>

            <Reveal className="mt-16 block">
              <blockquote className="border-l-2 border-brass/50 pl-6">
                <p className="font-hand text-3xl text-brass sm:text-4xl">
                  {hakkimizda.quote}
                </p>
              </blockquote>
            </Reveal>
          </div>
        </section>

        <section className="border-t border-bone/10 bg-charcoal px-5 py-16 sm:px-8 md:py-20 lg:px-12">
          <div className="mx-auto w-full max-w-[1400px]">
            <RevealGroup as="ul" className="grid gap-4 sm:grid-cols-3">
              {hakkimizda.gallery.map((shot) => (
                <RevealItem as="li" key={shot.src}>
                  <div className="group relative aspect-[4/5] overflow-hidden rounded-sm bg-soot">
                    <Image
                      src={shot.src}
                      alt={shot.alt}
                      fill
                      sizes="(min-width: 640px) 31vw, 92vw"
                      quality={80}
                      className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]"
                    />
                  </div>
                </RevealItem>
              ))}
            </RevealGroup>

            <Reveal className="mt-12 block">
              <Link
                href="/menu"
                className="inline-flex min-h-[52px] items-center gap-2 rounded-full border border-brass/60 px-7 font-sans text-base font-semibold text-brass transition-colors hover:bg-brass hover:text-charcoal"
              >
                {hakkimizda.cta}
                <span aria-hidden>→</span>
              </Link>
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
              path: "/hakkimizda",
              name: hakkimizda.title,
              description: hakkimizda.description,
              breadcrumb: hakkimizda.breadcrumb,
            }),
          ),
        }}
      />
    </>
  );
}
