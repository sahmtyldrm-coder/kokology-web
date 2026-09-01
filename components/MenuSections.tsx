import Image from "next/image";
import Link from "next/link";
import { menuGetir } from "@/lib/veri";

/**
 * Basılı menünün tam dökümü — kategori başlıkları ve noktalı fiyat satırları.
 *
 * Üç yerde kullanılır: ana sayfadaki Izgara bölümü, /menu sayfası ve QR menü.
 * Başlık seviyesi dışarıdan verilir; her sayfada H1→H2→H3 hiyerarşisi
 * bozulmasın diye.
 */
export async function MenuSections({
  headingLevel = "h3",
  columns = 2,
  className = "",
  only,
  linkToCategory = false,
  sectionImages = false,
}: {
  headingLevel?: "h2" | "h3";
  columns?: 1 | 2;
  className?: string;
  /** Tek kategori göster — kategori sayfalarında kullanılır */
  only?: string;
  /** Başlıkları /menu/[kategori] sayfalarına bağla */
  linkToCategory?: boolean;
  /** Başlığın yanında kategori fotoğrafı göster — QR menüde metnin yanına
   * yalnızca bir görsel eklemek için (porsiyon başına değil, kategori başına). */
  sectionImages?: boolean;
}) {
  const Heading = headingLevel;
  // Menü artık veritabanından geliyor; erişilemezse lib/veri.ts
  // content/tr.ts'e düşüyor ve site kesintisiz çalışmaya devam ediyor.
  const tum = await menuGetir();
  const sections = only ? tum.filter((s) => s.id === only) : tum;

  return (
    <div
      className={`grid gap-x-14 gap-y-14 ${
        columns === 2 ? "md:grid-cols-2" : ""
      } ${className}`}
    >
      {sections.map((section) => (
        <section key={section.id} id={`menu-${section.id}`} className="scroll-mt-24">
          <div className="flex items-center gap-4">
            {sectionImages && section.gorsel && (
              <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full bg-soot">
                <Image
                  src={section.gorsel}
                  alt=""
                  aria-hidden
                  fill
                  sizes="56px"
                  className="object-cover"
                />
              </span>
            )}
            <Heading className="font-display text-2xl text-brass sm:text-3xl">
              {linkToCategory ? (
                <Link
                  href={`/menu/${section.id}`}
                  className="transition-colors hover:text-bone"
                >
                  {section.ad}
                </Link>
              ) : (
                section.ad
              )}
            </Heading>
            <span aria-hidden className="rule-brass h-px flex-1 border-t" />
            {linkToCategory && (
              <Link
                href={`/menu/${section.id}`}
                className="shrink-0 font-sans text-xs text-bone/45 transition-colors hover:text-brass"
                aria-label={`${section.ad} kategorisinin sayfasına git`}
              >
                detay →
              </Link>
            )}
          </div>

          <dl className="mt-5">
            {section.items.map((item) => (
              <div
                key={item.ad}
                className="flex items-baseline gap-3 border-b border-bone/8 py-3 last:border-b-0"
              >
                {/* Satır görseli yalnızca gerçekten fotoğrafı olan kalemlerde
                    çıkar (şu an içecekler). Porsiyon varyantlarının —
                    çeyrek/yarım/tam — ayrı fotoğrafı yok ve olması da anlamsız:
                    aynı ürünün farklı boyu. */}
                {item.gorsel && (
                  <span className="relative h-11 w-9 shrink-0 self-center">
                    <Image
                      src={item.gorsel}
                      alt={item.alt ?? item.ad}
                      fill
                      sizes="36px"
                      className="object-contain object-bottom"
                    />
                  </span>
                )}
                <dt className="font-sans text-base text-bone">
                  {item.ad}
                  {item.imza && (
                    /* İmza ürünü: menüde göz bunu ilk yakalasın */
                    <span className="ml-2 inline-flex items-center gap-1 rounded-full border border-brass/50 bg-brass/10 px-2 py-0.5 align-middle font-sans text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-brass">
                      İmza
                    </span>
                  )}
                  {item.not && (
                    <span className="ml-2 font-sans text-sm text-bone/45">
                      {item.not}
                    </span>
                  )}
                </dt>
                {/* Noktalı dolgu: adı fiyata basılı menüdeki gibi bağlar */}
                <span
                  aria-hidden
                  className="mb-1 min-w-6 flex-1 border-b border-dotted border-bone/20"
                />
                {item.fiyat !== null && (
                  <dd className="shrink-0 font-sans text-base font-semibold tabular-nums text-bone">
                    {item.fiyat}
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
