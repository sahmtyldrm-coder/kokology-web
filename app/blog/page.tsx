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
import { yazilar, blogSayfa } from "@/content/blog";
import { blogListeSchema, jsonLdString } from "@/lib/schema";

export const metadata: Metadata = {
  title: blogSayfa.title,
  description: blogSayfa.description,
  alternates: { canonical: "/blog" },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: `${business.siteUrl}/blog`,
    title: blogSayfa.title,
    description: blogSayfa.description,
  },
};

export default function BlogPage() {
  const sirali = [...yazilar].sort((a, b) => b.tarih.localeCompare(a.tarih));

  return (
    <>
      <ScrollProgress />
      <Nav />

      <main id="icerik" aria-label={a11y.mainLandmark} className="flex-1">
        <section className="border-b border-bone/10 bg-charcoal px-5 pt-28 pb-14 sm:px-8 md:pt-36 lg:px-12">
          <div className="mx-auto w-full max-w-[1400px]">
            <Breadcrumb
              items={[
                { href: "/", label: business.name },
                { label: blogSayfa.breadcrumb },
              ]}
            />
            <Reveal className="mt-8 block">
              <p className="font-sans text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-brass">
                {blogSayfa.eyebrow}
              </p>
              <h1 className="mt-4 font-display text-jumbo text-bone">
                {blogSayfa.h1}
              </h1>
              <p className="mt-6 max-w-[56ch] font-serif text-lg leading-relaxed text-bone/70 italic">
                {blogSayfa.lead}
              </p>
            </Reveal>
          </div>
        </section>

        <section className="bg-charcoal px-5 py-16 sm:px-8 md:py-20 lg:px-12">
          <div className="mx-auto w-full max-w-[1400px]">
            {sirali.length === 0 ? (
              <p className="font-sans text-base text-bone/50">
                {blogSayfa.bosMesaj}
              </p>
            ) : (
              <RevealGroup
                as="ul"
                stagger={0.06}
                className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8"
              >
                {sirali.map((yazi) => (
                  <RevealItem as="li" key={yazi.slug} scale className="group">
                    <article>
                      <Link href={`/blog/${yazi.slug}`} className="block">
                        <div className="grain relative aspect-[16/10] overflow-hidden rounded-sm bg-soot">
                          <Image
                            src={yazi.image}
                            alt={yazi.alt}
                            fill
                            sizes="(min-width: 1024px) 31vw, (min-width: 640px) 46vw, 92vw"
                            quality={78}
                            className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]"
                          />
                          <div
                            aria-hidden
                            className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-charcoal/80 to-transparent"
                          />
                        </div>

                        <div className="mt-4 flex items-center gap-3 font-sans text-xs text-bone/45">
                          <span className="rounded-full border border-brass/40 px-2.5 py-1 text-brass">
                            {yazi.etiket}
                          </span>
                          <span>{yazi.okumaDakika} dk okuma</span>
                        </div>

                        <h2 className="mt-3 font-display text-xl text-bone transition-colors group-hover:text-brass sm:text-2xl">
                          {yazi.h1}
                        </h2>
                      </Link>
                      <p className="mt-2.5 font-sans text-base leading-relaxed text-bone/60">
                        {yazi.ozet}
                      </p>
                    </article>
                  </RevealItem>
                ))}
              </RevealGroup>
            )}
          </div>
        </section>
      </main>

      <Footer />
      <StickyCTA />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(blogListeSchema()) }}
      />
    </>
  );
}
