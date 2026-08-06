import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Nav } from "@/components/Nav";
import { ScrollProgress } from "@/components/ScrollProgress";
import { StickyCTA } from "@/components/StickyCTA";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/Reveal";
import { Breadcrumb } from "@/components/Breadcrumb";
import { BlogBloklari } from "@/components/BlogBloklari";
import { a11y, business } from "@/content/tr";
import { yaziSluglari } from "@/content/blog";
import { yazilarGetir, yaziGetir } from "@/lib/veri";
import { yaziSchema, jsonLdString } from "@/lib/schema";

export function generateStaticParams() {
  return yaziSluglari.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const yazi = await yaziGetir(slug);
  if (!yazi) return {};

  return {
    title: yazi.seoBaslik,
    description: yazi.aciklama,
    alternates: { canonical: `/blog/${yazi.slug}` },
    openGraph: {
      type: "article",
      locale: "tr_TR",
      url: `${business.siteUrl}/blog/${yazi.slug}`,
      title: yazi.seoBaslik,
      description: yazi.aciklama,
      publishedTime: yazi.tarih,
      images: [{ url: yazi.gorsel, alt: yazi.gorselAlt }],
    },
  };
}

export default async function YaziPage({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const yazi = await yaziGetir(slug);
  if (!yazi) notFound();

  const digerleri = (await yazilarGetir())
    .filter((y) => y.slug !== yazi.slug)
    .slice(0, 3);
  const tarih = new Date(yazi.tarih).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <>
      <ScrollProgress />
      <Nav />

      <main id="icerik" aria-label={a11y.mainLandmark} className="flex-1">
        <article>
          <section className="bg-charcoal px-5 pt-28 pb-10 sm:px-8 md:pt-36 lg:px-12">
            <div className="mx-auto w-full max-w-[1400px]">
              <Breadcrumb
                items={[
                  { href: "/", label: business.name },
                  { href: "/blog", label: "Blog" },
                  { label: yazi.etiket },
                ]}
              />

              <Reveal className="mt-8 block">
                <div className="flex items-center gap-3 font-sans text-xs text-bone/45">
                  <span className="rounded-full border border-brass/40 px-2.5 py-1 text-brass">
                    {yazi.etiket}
                  </span>
                  <time dateTime={yazi.tarih}>{tarih}</time>
                  <span aria-hidden>·</span>
                  <span>{yazi.okumaDakika} dk okuma</span>
                </div>

                <h1 className="mt-5 max-w-[22ch] font-display text-jumbo text-bone">
                  {yazi.baslik}
                </h1>
                <p className="mt-6 max-w-[60ch] font-serif text-lg leading-relaxed text-bone/70 italic">
                  {yazi.ozet}
                </p>
              </Reveal>
            </div>
          </section>

          <section className="bg-charcoal px-5 sm:px-8 lg:px-12">
            <div className="mx-auto w-full max-w-[1400px]">
              <Reveal className="block">
                <div className="grain relative aspect-[16/9] overflow-hidden rounded-sm bg-soot">
                  <Image
                    src={yazi.gorsel}
                    alt={yazi.gorselAlt}
                    fill
                    priority
                    sizes="(min-width: 1400px) 1400px, 100vw"
                    quality={82}
                    className="object-cover"
                  />
                </div>
              </Reveal>
            </div>
          </section>

          <section className="bg-charcoal px-5 py-14 sm:px-8 md:py-16 lg:px-12">
            <div className="mx-auto w-full max-w-[1400px]">
              <Reveal className="block">
                <BlogBloklari bloklar={yazi.bloklar} />
              </Reveal>

              {/* İç bağlantılar — okuyucuyu menüye ve konuma taşır */}
              <Reveal className="mt-14 block">
                <ul className="flex flex-wrap gap-3">
                  {yazi.ilgili.map((l) => (
                    <li key={l.href}>
                      <Link
                        href={l.href}
                        className="inline-flex min-h-[48px] items-center gap-2 rounded-full border border-brass/60 px-6 font-sans text-base font-medium text-brass transition-colors hover:bg-brass hover:text-charcoal"
                      >
                        {l.label}
                        <span aria-hidden>→</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>
          </section>
        </article>

        {/* Diğer yazılar */}
        {digerleri.length > 0 && (
          <section className="border-t border-bone/10 bg-charcoal px-5 py-16 sm:px-8 md:py-20 lg:px-12">
            <div className="mx-auto w-full max-w-[1400px]">
              <Reveal>
                <h2 className="font-display text-2xl text-brass sm:text-3xl">
                  Diğer yazılar
                </h2>
                <ul className="mt-8 grid gap-6 sm:grid-cols-3">
                  {digerleri.map((d) => (
                    <li key={d.slug}>
                      <Link href={`/blog/${d.slug}`} className="group block">
                        <div className="relative aspect-[16/10] overflow-hidden rounded-sm bg-soot">
                          <Image
                            src={d.gorsel}
                            alt={d.gorselAlt}
                            fill
                            sizes="(min-width: 640px) 31vw, 92vw"
                            quality={75}
                            className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                          />
                        </div>
                        <h3 className="mt-3 font-sans text-base font-semibold text-bone transition-colors group-hover:text-brass">
                          {d.baslik}
                        </h3>
                      </Link>
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>
          </section>
        )}
      </main>

      <Footer />
      <StickyCTA />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(await yaziSchema(yazi.slug)) }}
      />
    </>
  );
}
