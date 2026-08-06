import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Nav } from "@/components/Nav";
import { ScrollProgress } from "@/components/ScrollProgress";
import { StickyCTA } from "@/components/StickyCTA";
import { Footer } from "@/components/Footer";
import { MenuSections } from "@/components/MenuSections";
import { Reveal } from "@/components/Reveal";
import { Breadcrumb } from "@/components/Breadcrumb";
import { menu, a11y, business, nav } from "@/content/tr";
import { kategoriler, kategoriBul, kategoriSluglari } from "@/content/kategoriler";
import { kategoriSchema, jsonLdString } from "@/lib/schema";
import { isletmeGetir, anaAksiyon } from "@/lib/veri";

export function generateStaticParams() {
  return kategoriSluglari.map((kategori) => ({ kategori }));
}

export async function generateMetadata({
  params,
}: PageProps<"/menu/[kategori]">): Promise<Metadata> {
  const { kategori } = await params;
  const bulunan = kategoriBul(kategori);
  if (!bulunan) return {};

  const { kategori: k } = bulunan;
  return {
    title: k.title,
    description: k.description,
    alternates: { canonical: `/menu/${k.slug}` },
    openGraph: {
      type: "article",
      locale: "tr_TR",
      url: `${business.siteUrl}/menu/${k.slug}`,
      title: k.title,
      description: k.description,
      images: [{ url: k.image, alt: k.alt }],
    },
  };
}

export default async function KategoriPage({
  params,
}: PageProps<"/menu/[kategori]">) {
  const { kategori } = await params;
  const bulunan = kategoriBul(kategori);
  if (!bulunan) notFound();

  const { kategori: k } = bulunan;
  const action = anaAksiyon(await isletmeGetir());
  const digerleri = kategoriler.filter((x) => x.slug !== k.slug);

  return (
    <>
      <ScrollProgress />
      <Nav />

      <main id="icerik" aria-label={a11y.mainLandmark} className="flex-1">
        {/* Başlık + görsel */}
        <section className="border-b border-bone/10 bg-charcoal px-5 pt-28 pb-16 sm:px-8 md:pt-36 lg:px-12">
          <div className="mx-auto w-full max-w-[1400px]">
            <Breadcrumb
              items={[
                { href: "/", label: business.name },
                { href: "/menu", label: "Menü" },
                { label: k.eyebrow },
              ]}
            />

            <div className="mt-8 grid items-center gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
              <Reveal>
                <p className="font-sans text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-brass">
                  {k.eyebrow}
                </p>
                <h1 className="mt-4 font-display text-jumbo text-bone">{k.h1}</h1>
                <p className="mt-6 max-w-[46ch] font-serif text-lg leading-relaxed text-bone/70 italic">
                  {k.lead}
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  <a
                    href={action.href}
                    {...(action.label === "order" && {
                      target: "_blank",
                      rel: "noopener noreferrer",
                    })}
                    className="inline-flex min-h-[52px] items-center gap-2 rounded-full bg-red px-7 font-sans text-base font-semibold text-bone transition-all duration-300 hover:bg-brass hover:text-charcoal hover:shadow-[0_0_28px_-4px_var(--color-brass)]"
                  >
                    {action.label === "order" ? nav.cta.order : nav.cta.call}
                  </a>
                  <a
                    href={business.maps.directionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-[52px] items-center rounded-full border border-bone/25 px-7 font-sans text-base font-medium text-bone/90 transition-colors hover:border-brass hover:text-brass"
                  >
                    {nav.cta.directions}
                  </a>
                </div>
              </Reveal>

              <Reveal direction="right">
                <div className="grain relative aspect-[4/3] overflow-hidden rounded-sm bg-soot">
                  <Image
                    src={k.image}
                    alt={k.alt}
                    fill
                    priority
                    sizes="(min-width: 1024px) 45vw, 92vw"
                    quality={82}
                    className="object-cover"
                  />
                  <div
                    aria-hidden
                    className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-charcoal/70 to-transparent"
                  />
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* Hikâye + fiyat listesi */}
        <section className="bg-charcoal px-5 py-16 sm:px-8 md:py-20 lg:px-12">
          <div className="mx-auto grid w-full max-w-[1400px] gap-12 lg:grid-cols-[1.15fr_1fr] lg:gap-20">
            <Reveal>
              <div className="space-y-6">
                {k.story.map((p) => (
                  <p
                    key={p.slice(0, 24)}
                    className="font-sans text-lg leading-[1.8] text-bone/70"
                  >
                    {p}
                  </p>
                ))}
              </div>

              <div className="mt-10 border-l-2 border-brass/50 pl-6">
                <p className="font-serif text-lg leading-relaxed text-bone/80 italic">
                  {k.local}
                </p>
              </div>
            </Reveal>

            <Reveal direction="right">
              <MenuSections headingLevel="h2" only={k.slug} columns={1} />
              <p className="mt-6 font-sans text-sm text-bone/40">
                {menu.priceNote}
              </p>
            </Reveal>
          </div>
        </section>

        {/* Kategoriye özel sorular */}
        {k.faq.length > 0 && (
          <section className="border-t border-bone/10 bg-charcoal px-5 py-16 sm:px-8 md:py-20 lg:px-12">
            <div className="mx-auto w-full max-w-[1400px]">
              <Reveal>
                <h2 className="font-display text-3xl text-bone sm:text-4xl">
                  {k.eyebrow} hakkında sık sorulanlar
                </h2>
                <ul className="mt-8 max-w-[72ch]">
                  {k.faq.map((item) => (
                    <li key={item.q}>
                      <details className="group border-b border-bone/10">
                        <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-5 font-sans text-lg font-medium text-bone transition-colors hover:text-brass [&::-webkit-details-marker]:hidden">
                          {item.q}
                          <span
                            aria-hidden
                            className="mt-1 shrink-0 text-xl leading-none text-brass transition-transform duration-300 group-open:rotate-45"
                          >
                            +
                          </span>
                        </summary>
                        <p className="pb-6 pr-10 font-sans text-base leading-relaxed text-bone/65">
                          {item.a}
                        </p>
                      </details>
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>
          </section>
        )}

        {/* Diğer kategoriler — iç link ağı */}
        <section className="border-t border-bone/10 bg-charcoal px-5 py-16 sm:px-8 md:py-20 lg:px-12">
          <div className="mx-auto w-full max-w-[1400px]">
            <Reveal>
              <h2 className="font-display text-2xl text-brass sm:text-3xl">
                Menünün geri kalanı
              </h2>
              <ul className="mt-6 flex flex-wrap gap-3">
                {digerleri.map((d) => (
                  <li key={d.slug}>
                    <Link
                      href={`/menu/${d.slug}`}
                      className="inline-flex min-h-[48px] items-center rounded-full border border-bone/20 px-6 font-sans text-base text-bone/85 transition-colors hover:border-brass hover:text-brass"
                    >
                      {d.eyebrow}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    href="/menu"
                    className="inline-flex min-h-[48px] items-center rounded-full border border-brass/60 px-6 font-sans text-base font-medium text-brass transition-colors hover:bg-brass hover:text-charcoal"
                  >
                    Tüm menü →
                  </Link>
                </li>
              </ul>
            </Reveal>
          </div>
        </section>
      </main>

      <Footer />
      <StickyCTA />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(await kategoriSchema(k.slug)) }}
      />
    </>
  );
}
