import Image from "next/image";
import Link from "next/link";
import { menu } from "@/content/tr";
import { kategoriler } from "@/content/kategoriler";
import { RevealGroup, RevealItem } from "@/components/Reveal";

/**
 * Görselli menü — her kategori bir kart.
 *
 * Kalem bazında fotoğraf bilerek yok: menü porsiyon varyantlarından oluşuyor
 * (çeyrek / yarım / üç çeyrek / tam kokoreç) ve bunların ayrı fotoğrafı
 * anlamsız — aynı ürünün farklı boyu. Fotoğraf ürünün kendisini gösterir,
 * fiyat listesi porsiyonu; ikisi bir arada doğru bilgi verir.
 *
 * Kartın altındaki fiyat aralığı karar vermeyi hızlandırır: tıklamadan önce
 * "bu kategori kaç para" sorusu cevaplanır.
 */
export function MenuKategoriGrid() {
  return (
    <RevealGroup
      as="ul"
      stagger={0.06}
      className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6"
    >
      {kategoriler.map((k) => {
        const section = menu.sections.find((s) => s.id === k.slug);
        const fiyatlar = (section?.items ?? [])
          .map((i) => i.price)
          .filter((p): p is number => p !== null);
        const enDusuk = fiyatlar.length ? Math.min(...fiyatlar) : null;

        return (
          <RevealItem as="li" key={k.slug} scale className="group">
            <Link href={`/menu/${k.slug}`} className="block">
              <article>
                <div className="grain relative aspect-[4/3] overflow-hidden rounded-sm bg-soot">
                  <Image
                    src={k.image}
                    alt={k.alt}
                    fill
                    sizes="(min-width: 1024px) 31vw, (min-width: 640px) 46vw, 92vw"
                    quality={80}
                    className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
                  />
                  <div
                    aria-hidden
                    className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-charcoal via-charcoal/45 to-transparent"
                  />

                  <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-5">
                    <h3 className="font-display text-2xl text-bone transition-colors group-hover:text-brass sm:text-3xl">
                      {k.eyebrow}
                    </h3>
                    {enDusuk !== null && (
                      <span className="shrink-0 font-sans text-sm text-bone/70">
                        {enDusuk} ₺&rsquo;den
                      </span>
                    )}
                  </div>
                </div>

                <p className="mt-3 font-sans text-sm leading-relaxed text-bone/55">
                  {k.lead}
                </p>
              </article>
            </Link>
          </RevealItem>
        );
      })}
    </RevealGroup>
  );
}
