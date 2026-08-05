import { manifesto } from "@/content/tr";
import { Reveal, RevealGroup, RevealItem } from "@/components/Reveal";

/**
 * Bölüm 2 — Fikir.
 * Kapıdan girmeden önce tez: bu bir mutfak değil, bir kültür.
 * Fraunces burada baskın; sayfanın "düşünen" bölümü.
 */
export function Manifesto() {
  return (
    <section
      id="fikir"
      className="relative scroll-mt-20 border-t border-bone/10 bg-charcoal py-20 md:py-28"
    >
      <div className="mx-auto w-full max-w-[1400px] px-5 sm:px-8 lg:px-12">
        <Reveal>
          <p className="font-sans text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-brass">
            {manifesto.eyebrow}
          </p>
          <h2 className="mt-5 max-w-[20ch] font-serif text-3xl leading-[1.15] font-light text-bone sm:text-4xl md:text-5xl">
            {manifesto.heading}
          </h2>
          <p className="mt-7 max-w-[58ch] font-sans text-lg leading-relaxed text-bone/65">
            {manifesto.lead}
          </p>
        </Reveal>

        <RevealGroup className="mt-16 grid gap-px overflow-hidden border-y border-bone/10 bg-bone/10 sm:grid-cols-3">
          {manifesto.columns.map((col) => (
            <RevealItem
              key={col.title}
              className="bg-charcoal px-0 py-8 sm:px-7 sm:py-10"
            >
              <h3 className="font-display text-2xl text-brass sm:text-3xl">
                {col.title}
              </h3>
              <p className="mt-4 font-sans text-base leading-relaxed text-bone/60">
                {col.body}
              </p>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
