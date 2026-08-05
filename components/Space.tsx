import Image from "next/image";
import { space, a11y } from "@/content/tr";
import { Reveal, RevealGroup, RevealItem } from "@/components/Reveal";

/**
 * İçerikteki `span` değerini grid yerleşimine çevirir.
 *
 * Satır yüksekliği sabit (`auto-rows-*`), yükseklik aspect-ratio'dan değil
 * grid'den gelir — aksi hâlde `row-span-2` hücreler çöküp mozaikte delik açar.
 * Masaüstünde 4 sütun; içerikteki sıra (wide, tall, normal, normal, tall,
 * normal, wide, normal) 4×4'lük alanı tam doldurur.
 */
const SPAN_CLASS: Record<string, string> = {
  wide: "col-span-2 row-span-1 sm:row-span-2",
  tall: "col-span-1 row-span-1 sm:row-span-2",
  normal: "col-span-1 row-span-1",
};

/**
 * Bölüm 4 — Mekân.
 * Yürüyüşün içeri girdiği yer: yeşil sedir, tuğla, pirinç, duvar resmi.
 */
export function Space() {
  return (
    <section
      id="mekan"
      className="relative scroll-mt-20 border-t border-bone/10 bg-charcoal py-20 md:py-28"
    >
      <div className="mx-auto w-full max-w-[1400px] px-5 sm:px-8 lg:px-12">
        <Reveal>
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div>
              <p className="font-sans text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-brass">
                {space.eyebrow}
              </p>
              <h2 className="mt-4 max-w-[22ch] font-display text-jumbo text-bone">
                {space.heading}
              </h2>
            </div>
            {/* Vitrin etiketi — mekânın kendi dilinden bir alıntı */}
            <span className="rule-brass rounded-full border px-4 py-2 font-sans text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-brass">
              {space.takeaway}
            </span>
          </div>
          <p className="mt-6 max-w-[56ch] font-serif text-lg leading-relaxed text-bone/70 italic">
            {space.lead}
          </p>
        </Reveal>

        <RevealGroup
          as="ul"
          stagger={0.06}
          className="mt-14 grid auto-rows-[44vw] grid-cols-2 gap-3 sm:auto-rows-[clamp(110px,11.5vw,195px)] sm:grid-cols-4 sm:gap-4"
          aria-label={a11y.galleryLabel}
        >
          {space.gallery.map((shot) => (
            <RevealItem
              as="li"
              key={shot.src}
              className={`group relative overflow-hidden rounded-sm bg-soot ${
                SPAN_CLASS[shot.span] ?? SPAN_CLASS.normal
              }`}
            >
              <Image
                src={shot.src}
                alt={shot.alt}
                fill
                sizes="(min-width: 640px) 30vw, 50vw"
                quality={78}
                className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]"
              />
              {/* Karanlık zemine bağlayan ince perde; hover'da açılır */}
              <div
                aria-hidden
                className="absolute inset-0 bg-charcoal/30 transition-opacity duration-500 group-hover:opacity-0"
              />
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
