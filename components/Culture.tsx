import { culture, business } from "@/content/tr";
import { Reveal, RevealGroup, RevealItem } from "@/components/Reveal";

/**
 * Bölüm 6 — Kültür / Ses duvarı.
 * Witty tek satırlar + gerçek yorumlar + Instagram.
 *
 * `culture.reviews` boşken yorum bloğu hiç render edilmez; bölüm yine de
 * eksiksiz durur. Yorumlar girildiğinde blok kendiliğinden görünür ve
 * lib/schema.ts aynı veriden Review/AggregateRating üretir.
 */
export function Culture() {
  const hasReviews = culture.reviews.length > 0;

  return (
    <section
      id="kultur"
      className="relative scroll-mt-20 border-t border-bone/10 bg-charcoal py-20 md:py-28"
    >
      <div className="mx-auto w-full max-w-[1400px] px-5 sm:px-8 lg:px-12">
        <Reveal>
          <p className="font-sans text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-brass">
            {culture.eyebrow}
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-x-8 gap-y-4">
            <h2 className="font-display text-jumbo text-bone">
              {culture.heading}
            </h2>

            {/* Puanın kaynağı açıkça yazılır — sayı havada kalmasın */}
            {hasReviews && (
              <p className="flex items-center gap-3">
                <span className="font-display text-3xl text-brass sm:text-4xl">
                  {culture.rating.value.toLocaleString("tr-TR", {
                    minimumFractionDigits: 1,
                  })}
                </span>
                <span
                  aria-hidden
                  className="flex gap-0.5 text-sm text-brass"
                >
                  {"★★★★★"}
                </span>
                <span className="font-sans text-sm text-bone/55">
                  {culture.rating.label}
                </span>
              </p>
            )}
          </div>
        </Reveal>

        {/* Witty satırlar — el yazısı, seyrek, paylaşılabilir */}
        <RevealGroup
          as="ul"
          stagger={0.12}
          className="mt-14 flex flex-col gap-10 border-y border-bone/10 py-14 sm:gap-12"
        >
          {culture.lines.map((line, i) => (
            <RevealItem
              as="li"
              key={line}
              direction={i % 2 === 0 ? "left" : "right"}
              className={i % 2 === 0 ? "sm:self-start" : "sm:self-end sm:text-right"}
            >
              <p className="font-hand text-4xl leading-tight text-bone/90 sm:text-5xl md:text-6xl">
                {line}
              </p>
            </RevealItem>
          ))}
        </RevealGroup>

        {/* Gerçek yorumlar */}
        {hasReviews && (
          <RevealGroup
            as="ul"
            className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
          >
            {culture.reviews.map((review) => (
              <RevealItem
                as="li"
                key={`${review.author}-${review.date}`}
                className="rounded-sm border border-bone/12 bg-soot/60 p-6"
              >
                <figure>
                  <div
                    className="flex gap-1 text-brass"
                    aria-label={`5 üzerinden ${review.rating}`}
                  >
                    {Array.from({ length: 5 }, (_, i) => (
                      <span key={i} aria-hidden className="text-sm">
                        {i < review.rating ? "★" : "☆"}
                      </span>
                    ))}
                  </div>
                  <blockquote className="mt-4 font-serif text-lg leading-relaxed text-bone/85 italic">
                    {review.body}
                  </blockquote>
                  <figcaption className="mt-4 font-sans text-sm text-bone/50">
                    {review.author}
                  </figcaption>
                </figure>
              </RevealItem>
            ))}
          </RevealGroup>
        )}

        {/* Instagram */}
        {business.social.instagram && (
          <Reveal className="mt-14">
            <a
              href={business.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex min-h-[56px] items-center gap-4 rounded-full border border-bone/20 px-7 transition-colors hover:border-brass"
            >
              {/* normal-case: font-display uppercase uygular, kullanıcı adı
                  ise küçük harfli olduğu gibi doğru görünmeli. */}
              <span className="font-display text-xl normal-case text-bone transition-colors group-hover:text-brass">
                {culture.instagram.handle}
              </span>
              <span className="font-sans text-sm text-bone/55">
                {culture.instagram.label}
              </span>
              <span
                aria-hidden
                className="text-lg text-brass transition-transform duration-300 group-hover:translate-x-1"
              >
                →
              </span>
            </a>
          </Reveal>
        )}
      </div>
    </section>
  );
}
