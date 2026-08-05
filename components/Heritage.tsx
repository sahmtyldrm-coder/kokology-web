import Image from "next/image";
import { heritage } from "@/content/tr";
import { Reveal } from "@/components/Reveal";

/**
 * Bölüm 5 — Miras / Old Turkish Delicious.
 * Sayfanın nefes bölümü: sakin, seyrek, tek görsel. Menü ve galerinin
 * yoğunluğundan sonra tempo düşürür.
 */
export function Heritage() {
  return (
    <section
      id="miras"
      className="grain relative scroll-mt-20 overflow-hidden border-t border-bone/10 py-24 md:py-36"
    >
      {/* Duvar resmi arka planda, zemine karışarak */}
      <div aria-hidden className="absolute inset-0 -z-20">
        <Image
          src={heritage.image.src}
          alt=""
          fill
          sizes="100vw"
          quality={75}
          className="object-cover object-center"
        />
      </div>
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-charcoal/85 mix-blend-multiply"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_70%_at_70%_45%,transparent_0%,rgba(20,18,16,0.8)_65%,var(--color-charcoal)_100%)]"
      />

      <div className="relative mx-auto w-full max-w-[1400px] px-5 sm:px-8 lg:px-12">
        <Reveal className="max-w-[62ch]">
          {/* İngilizce başlık — Türkçe uppercase kuralı "Turkish"i "TURKİSH"
              yapmasın diye dil işaretlendi. */}
          <p
            lang="en"
            className="font-sans text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-brass"
          >
            {heritage.eyebrow}
          </p>
          <h2 className="mt-6 font-serif text-3xl leading-[1.2] font-light text-bone italic sm:text-4xl md:text-[3.25rem]">
            {heritage.heading}
          </h2>
          <p className="mt-8 font-sans text-lg leading-[1.85] text-bone/70">
            {heritage.body}
          </p>

          <blockquote className="mt-12 border-l-2 border-brass/50 pl-6">
            <p className="font-hand text-3xl text-brass sm:text-4xl">
              {heritage.pullquote}
            </p>
          </blockquote>
        </Reveal>
      </div>
    </section>
  );
}
