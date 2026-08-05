import Image from "next/image";
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
  showImages = true,
  columns = 2,
  className = "",
}: {
  headingLevel?: "h2" | "h3";
  showImages?: boolean;
  columns?: 1 | 2;
  className?: string;
}) {
  const Heading = headingLevel;

  return (
    <div
      className={`grid gap-x-14 gap-y-14 ${
        columns === 2 ? "md:grid-cols-2" : ""
      } ${className}`}
    >
      {menu.sections.map((section) => (
        <section key={section.id} id={`menu-${section.id}`} className="scroll-mt-24">
          <div className="flex items-center gap-4">
            {showImages &&
              (section.image ? (
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full bg-soot">
                  <Image
                    src={section.image}
                    alt={section.alt}
                    fill
                    sizes="56px"
                    quality={70}
                    className="object-cover"
                  />
                </div>
              ) : (
                /* Fotoğrafsız kategoride de aynı yer ayrılır ki sütunlar
                   arasında başlık hizası kaymasın. */
                <div
                  aria-hidden
                  className="rule-brass h-14 w-14 shrink-0 rounded-full border border-dashed"
                />
              ))}

            <Heading className="font-display text-2xl text-brass sm:text-3xl">
              {section.name}
            </Heading>
            <span aria-hidden className="rule-brass mt-1 h-px flex-1 border-t" />
          </div>

          <dl className="mt-5">
            {section.items.map((item) => (
              <div
                key={item.name}
                className="flex items-baseline gap-3 border-b border-bone/8 py-3 last:border-b-0"
              >
                <dt className="font-sans text-base text-bone">
                  {item.name}
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
