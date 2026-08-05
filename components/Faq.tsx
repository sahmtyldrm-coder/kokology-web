import { faq } from "@/content/tr";
import { Reveal, RevealGroup, RevealItem } from "@/components/Reveal";

/**
 * Sık sorulanlar.
 *
 * Cevaplar `<details>` içinde ama HTML'de her zaman mevcut — arama motorları
 * ve yapay zekâ araçları kapalı akordeonu da okur. JavaScript gerekmez.
 */
export function Faq() {
  return (
    <section
      id="sss"
      className="relative scroll-mt-20 border-t border-bone/10 bg-charcoal py-20 md:py-28"
    >
      <div className="mx-auto w-full max-w-[1400px] px-5 sm:px-8 lg:px-12">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,26rem)_1fr] lg:gap-20">
          <Reveal>
            <p className="font-sans text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-brass">
              {faq.eyebrow}
            </p>
            <h2 className="mt-4 font-display text-jumbo text-bone">
              {faq.heading}
            </h2>
          </Reveal>

          <RevealGroup as="ul" stagger={0.05} className="lg:pt-3">
            {faq.items.map((item) => (
              <RevealItem as="li" key={item.q}>
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
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </div>
    </section>
  );
}
