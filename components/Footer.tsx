import { footer, nav, findUs } from "@/content/tr";
import { formatTime } from "@/lib/hours";
import { isletmeGetir, saatlerGetir } from "@/lib/veri";

/**
 * Bölüm 8 — Çanta.
 * Dev outline wordmark, sosyal, tekrar adres/telefon/saat.
 * Yürüyüşün sonu: çıkarken elinde kalanlar.
 */
export async function Footer() {
  const [isletme, saatler] = await Promise.all([isletmeGetir(), saatlerGetir()]);
  const year = new Date().getFullYear();
  const socials = Object.entries(isletme.social).filter(([, url]) => url);

  return (
    <footer className="relative overflow-hidden border-t border-bone/10 bg-charcoal pt-16">
      <div className="mx-auto w-full max-w-[1400px] px-5 sm:px-8 lg:px-12">
        <div className="grid gap-12 pb-14 md:grid-cols-[1.2fr_1fr_1fr]">
          {/* Adres + telefon */}
          <div>
            <h2 className="font-display text-2xl text-bone">{footer.wordmark}</h2>
            {/* lang="en": sayfa lang="tr" olduğu için CSS uppercase, İngilizce
                "Grill"deki i'yi Türkçe kuralıyla İ'ye çevirirdi. */}
            <p
              lang="en"
              className="mt-1 font-sans text-[0.7rem] uppercase tracking-[0.28em] text-brass"
            >
              {footer.tagline}
            </p>
            <address className="mt-6 font-sans text-base leading-relaxed text-bone/60 not-italic">
              {isletme.address.street}
              <br />
              {isletme.address.district}, {isletme.address.postalCode}{" "}
              {isletme.address.town} / {isletme.address.city}
            </address>
            <a
              href={`tel:${isletme.phone.e164}`}
              className="mt-3 inline-block font-sans text-base text-bone transition-colors hover:text-brass"
            >
              {isletme.phone.display}
            </a>
          </div>

          {/* Saatler */}
          <div>
            <h3 className="font-sans text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-bone/45">
              {findUs.hoursLabel}
            </h3>
            <dl className="mt-4 space-y-1.5">
              {saatler.map((h) => (
                <div
                  key={h.day}
                  className="flex justify-between gap-4 font-sans text-sm text-bone/55"
                >
                  <dt>{h.label}</dt>
                  <dd className="tabular-nums">
                    {formatTime(h.opens)} – {formatTime(h.closes)}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Bağlantılar + sosyal */}
          <div>
            <h3 className="font-sans text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-bone/45">
              {footer.exploreLabel}
            </h3>
            <ul className="mt-4 space-y-2">
              {nav.links.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="font-sans text-base text-bone/60 transition-colors hover:text-brass"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>

            {socials.length > 0 && (
              <>
                <h3 className="mt-8 font-sans text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-bone/45">
                  {footer.socialLabel}
                </h3>
                <ul className="mt-3 flex flex-wrap gap-4">
                  {socials.map(([key, url]) => (
                    <li key={key}>
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        lang="en"
                        className="font-sans text-base text-bone/60 capitalize transition-colors hover:text-brass"
                      >
                        {key}
                      </a>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>

        <p className="border-t border-bone/10 py-6 font-sans text-sm text-bone/35">
          {footer.copyright(year)}
        </p>
      </div>

      {/* Dev outline wordmark — alt kenardan taşarak, dekoratif */}
      <div aria-hidden className="relative select-none">
        <span
          className="font-display block w-full text-center leading-[0.75] text-transparent"
          style={{
            fontSize: "clamp(4rem, 19vw, 17rem)",
            WebkitTextStroke: "1px color-mix(in oklab, var(--color-bone) 22%, transparent)",
            transform: "translateY(22%)",
          }}
        >
          {footer.wordmark}
        </span>
      </div>
    </footer>
  );
}
