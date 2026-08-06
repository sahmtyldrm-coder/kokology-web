import Image from "next/image";
import Link from "next/link";
import { menu } from "@/content/tr";

/**
 * Basılı menünün tam dökümü — kategori başlıkları ve noktalı fiyat satırları.
 *
 * Üç yerde kullanılır: ana sayfadaki Izgara bölümü, /menu sayfası ve QR menü.
 * Başlık seviyesi dışarıdan verilir; her sayfada H1→H2→H3 hiyerarşisi
 * bozulmasın diye.
 */
export function MenuSections({
  headingLevel = "h3",
  columns = 2,
  className = "",
  only,
  linkToCategory = false,
}: {
  headingLevel?: "h2" | "h3";
  columns?: 1 | 2;
  className?: string;
  /** Tek kategori göster — kategori sayfalarında kullanılır */
  only?: string;
  /** Başlıkları /menu/[kategori] sayfalarına bağla */
  linkToCategory?: boolean;
}) {
  const Heading = headingLevel;
  const sections = only
    ? menu.sections.filter((s) => s.id === only)
    : menu.sections;

  return (
    <div
      className={`grid gap-x-14 gap-y-14 ${
        columns === 2 ? "md:grid-cols-2" : ""
      } ${className}`}
    >
      {sections.map((section) => (
        <section key={section.id} id={`menu-${section.id}`} className="scroll-mt-24">
          <div className="flex items-baseline gap-4">
            <Heading className="font-display text-2xl text-brass sm:text-3xl">
              {linkToCategory ? (
                <Link
                  href={`/menu/${section.id}`}
                  className="transition-colors hover:text-bone"
                >
                  {section.name}
                </Link>
              ) : (
                section.name
              )}
            </Heading>
            <span aria-hidden className="rule-brass h-px flex-1 border-t" />
            {linkToCategory && (
              <Link
                href={`/menu/${section.id}`}
                className="shrink-0 font-sans text-xs text-bone/45 transition-colors hover:text-brass"
                aria-label={`${section.name} kategorisinin sayfasına git`}
              >
                detay →
              </Link>
            )}
          </div>

          <dl className="mt-5">
            {section.items.map((item) => (
              <div
                key={item.name}
                className="flex items-baseline gap-3 border-b border-bone/8 py-3 last:border-b-0"
              >
                {/* Satır görseli yalnızca gerçekten fotoğrafı olan kalemlerde
                    çıkar (şu an içecekler). Porsiyon varyantlarının —
                    çeyrek/yarım/tam — ayrı fotoğrafı yok ve olması da anlamsız:
                    aynı ürünün farklı boyu. */}
                {"image" in item && item.image && (
                  <span className="relative h-11 w-9 shrink-0 self-center">
                    <Image
                      src={item.image}
                      alt={"alt" in item && item.alt ? item.alt : item.name}
                      fill
                      sizes="36px"
                      className="object-contain object-bottom"
                    />
                  </span>
                )}
                <dt className="font-sans text-base text-bone">
                  {item.name}
                  {"signature" in item && item.signature && (
                    /* İmza ürünü: menüde göz bunu ilk yakalasın */
                    <span className="ml-2 inline-flex items-center gap-1 rounded-full border border-brass/50 bg-brass/10 px-2 py-0.5 align-middle font-sans text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-brass">
                      İmza
                    </span>
                  )}
                  {item.note && (
                    <span className="ml-2 font-sans text-sm text-bone/45">
                      {item.note}
                    </span>
                  )}
                </dt>
                {/* Noktalı dolgu: adı fiyata basılı menüdeki gibi bağlar */}
                <span
                  aria-hidden
                  className="mb-1 min-w-6 flex-1 border-b border-dotted border-bone/20"
                />
                {item.price !== null && (
                  <dd className="shrink-0 font-sans text-base font-semibold tabular-nums text-bone">
                    {item.price}
                    <span className="ml-0.5 text-brass">₺</span>
                  </dd>
                )}
              </div>
            ))}
          </dl>
        </section>
      ))}
    </div>
  );
}
