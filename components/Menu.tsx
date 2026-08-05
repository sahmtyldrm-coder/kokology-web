import Image from "next/image";
import Link from "next/link";
import { menu, a11y } from "@/content/tr";
import { Reveal, RevealGroup, RevealItem } from "@/components/Reveal";
import { MenuSections } from "@/components/MenuSections";

/**
 * Bölüm 3 — Izgara. İştah motoru.
 *
 * İki katman: üstte üç imza kategori büyük ve sıcak görsellerle (iştah),
 * altta basılı menünün tam dökümü porsiyon ve fiyatlarıyla (kullanışlılık).
 * Fiyat `null` ise satırda fiyat sütunu boş kalır, düzen bozulmaz.
 */
export function Menu() {
  return (
    <section
      id="menu"
      className="relative scroll-mt-20 border-t border-bone/10 bg-charcoal py-20 md:py-28"
    >
      <div className="mx-auto w-full max-w-[1400px] px-5 sm:px-8 lg:px-12">
        <Reveal>
          <p className="font-sans text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-brass">
            {menu.eyebrow}
          </p>
          <div className="mt-4 flex flex-wrap items-start justify-between gap-6">
            <h2 className="font-display text-jumbo text-bone">{menu.heading}</h2>
            <Link
              href="/menu"
              className="inline-flex min-h-[48px] items-center gap-2 rounded-full border border-bone/25 px-6 font-sans text-sm font-medium text-bone/90 transition-colors hover:border-brass hover:text-brass"
            >
              {menu.pageLabel}
              <span aria-hidden>→</span>
            </Link>
          </div>
          <p className="mt-5 max-w-[54ch] font-serif text-lg leading-relaxed text-bone/70 italic">
            {menu.lead}
          </p>
        </Reveal>

        {/* İmza kategoriler */}
        <RevealGroup
          as="ul"
          className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8"
          aria-label={a11y.menuLabel}
        >
          {menu.featured.map((item) => (
            <RevealItem as="li" key={item.id} className="group">
              <article>
                <a href={`#menu-${item.id}`} className="block">
                  <div className="grain relative aspect-[4/5] overflow-hidden rounded-sm bg-soot">
                    <Image
                      src={item.image}
                      alt={item.alt}
                      fill
                      sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
                      quality={80}
                      className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
                    />
                    {/* Ürün ateşten yeni çıkmış gibi: alt kenarda kor parıltısı */}
                    <div
                      aria-hidden
                      className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-charcoal/85 via-charcoal/25 to-transparent"
                    />
                  </div>

                  <h3 className="font-display mt-5 text-2xl text-bone transition-colors group-hover:text-brass sm:text-3xl">
                    {item.name}
                  </h3>
                </a>
                <p className="mt-2.5 font-sans text-base leading-relaxed text-bone/60">
                  {item.description}
                </p>
              </article>
            </RevealItem>
          ))}
        </RevealGroup>

        {/* Tam menü */}
        <Reveal className="mt-20 block border-t border-bone/10 pt-14">
          <MenuSections />
          <p className="mt-10 font-sans text-sm text-bone/40">{menu.priceNote}</p>
        </Reveal>
      </div>
    </section>
  );
}
