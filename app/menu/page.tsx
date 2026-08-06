import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Nav } from "@/components/Nav";
import { ScrollProgress } from "@/components/ScrollProgress";
import { StickyCTA } from "@/components/StickyCTA";
import { Footer } from "@/components/Footer";
import { MenuSections } from "@/components/MenuSections";
import { MenuKategoriGrid } from "@/components/MenuKategoriGrid";
import { Reveal } from "@/components/Reveal";
import { menu, a11y, business } from "@/content/tr";
import { menuPage } from "@/content/menu-page";
import { menuPageSchema, jsonLdString } from "@/lib/schema";

export const metadata: Metadata = {
  title: menuPage.title,
  description: menuPage.description,
  alternates: { canonical: "/menu" },
  openGraph: {
    type: "article",
    locale: "tr_TR",
    url: `${business.siteUrl}/menu`,
    title: menuPage.title,
    description: menuPage.description,
  },
};

export default async function MenuPage() {
  return (
    <>
      <ScrollProgress />
      <Nav />

      <main id="icerik" aria-label={a11y.mainLandmark} className="flex-1">
        <section className="border-b border-bone/10 bg-charcoal px-5 pt-28 pb-16 sm:px-8 md:pt-36 lg:px-12">
          <div className="mx-auto w-full max-w-[1400px]">
            {/* Kırıntı yolu — hem kullanıcı hem arama motoru için konum bilgisi */}
            <nav aria-label="Sayfa yolu">
              <ol className="flex items-center gap-2 font-sans text-sm text-bone/45">
                <li>
                  <Link href="/" className="transition-colors hover:text-brass">
                    {business.name}
                  </Link>
                </li>
                <li aria-hidden>/</li>
                <li aria-current="page" className="text-bone/70">
                  {menuPage.breadcrumb}
                </li>
              </ol>
            </nav>

            <Reveal className="mt-8 block">
              <p className="font-sans text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-brass">
                {menuPage.eyebrow}
              </p>
              <h1 className="mt-4 font-display text-jumbo text-bone">
                {menuPage.h1}
              </h1>
              <p className="mt-6 max-w-[62ch] font-serif text-lg leading-relaxed text-bone/70 italic">
                {menuPage.lead}
              </p>
            </Reveal>
          </div>
        </section>

        {/* Görselli menü — kategori kartları */}
        <section className="bg-charcoal px-5 py-16 sm:px-8 md:py-20 lg:px-12">
          <div className="mx-auto w-full max-w-[1400px]">
            <Reveal className="mb-10 block">
              <h2 className="font-display text-3xl text-bone sm:text-4xl">
                {menuPage.gridHeading}
              </h2>
              <p className="mt-3 max-w-[56ch] font-sans text-base text-bone/60">
                {menuPage.gridLead}
              </p>
            </Reveal>
            <MenuKategoriGrid />
          </div>
        </section>

        {/* Tam fiyat listesi */}
        <section className="border-t border-bone/10 bg-charcoal px-5 py-16 sm:px-8 md:py-20 lg:px-12">
          <div className="mx-auto w-full max-w-[1400px]">
            <Reveal className="mb-10 block">
              <h2 className="font-display text-3xl text-bone sm:text-4xl">
                {menuPage.listHeading}
              </h2>
            </Reveal>
            <Reveal className="block">
              <MenuSections headingLevel="h3" linkToCategory />
              <p className="mt-10 font-sans text-sm text-bone/40">
                {menu.priceNote}
              </p>
            </Reveal>
          </div>
        </section>

        {/* Basılı menü görselleri */}
        <section className="border-t border-bone/10 bg-charcoal px-5 py-16 sm:px-8 md:py-20 lg:px-12">
          <div className="mx-auto w-full max-w-[1400px]">
            <Reveal>
              <h2 className="font-display text-3xl text-bone sm:text-4xl">
                {menuPage.printedHeading}
              </h2>
              <p className="mt-3 max-w-[52ch] font-sans text-base text-bone/60">
                {menuPage.printedLead}
              </p>
            </Reveal>

            <ul className="mt-10 grid gap-6 sm:grid-cols-2">
              {menu.printed.map((sheet) => (
                <li key={sheet.src}>
                  <a
                    href={sheet.src}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block"
                  >
                    <div className="relative aspect-[1555/2200] overflow-hidden rounded-sm border border-bone/15 bg-soot">
                      <Image
                        src={sheet.src}
                        alt={sheet.alt}
                        fill
                        sizes="(min-width: 640px) 45vw, 90vw"
                        quality={82}
                        className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                      />
                    </div>
                    <p className="mt-3 font-sans text-sm text-bone/55 transition-colors group-hover:text-brass">
                      {sheet.label}
                    </p>
                  </a>
                </li>
              ))}
            </ul>

            <Link
              href="/"
              className="mt-12 inline-flex min-h-[48px] items-center gap-2 rounded-full border border-bone/25 px-6 font-sans text-sm font-medium text-bone/90 transition-colors hover:border-brass hover:text-brass"
            >
              <span aria-hidden>←</span>
              {menuPage.backToHome}
            </Link>
          </div>
        </section>
      </main>

      <Footer />
      <StickyCTA />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(await menuPageSchema()) }}
      />
    </>
  );
}
