"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { hero, nav, business } from "@/content/tr";
import { primaryAction } from "@/lib/schema";

/**
 * Bölüm 1 — Sokak Cephesi.
 * Yürüyüşün başladığı yer: dükkânın önünde duruyorsunuz.
 * H1 marka + kategori + konum taşır; sayfanın tek H1'i budur.
 */
export function Hero() {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const action = primaryAction();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Görsel yavaş, içerik hızlı kayar — derinlik hissi
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section
      ref={ref}
      className="grain relative flex min-h-[100svh] flex-col justify-end overflow-hidden"
    >
      {/* Sahne */}
      <motion.div
        className="absolute inset-0 -z-20"
        style={reduced ? undefined : { y: imageY }}
      >
        <Image
          src={hero.image.src}
          alt={hero.image.alt}
          fill
          priority
          fetchPriority="high"
          sizes="100vw"
          quality={82}
          /* object-position aşağıda: cephedeki fiziksel tabela kadraj dışında
             kalsın, wordmark iki kez okunmasın. */
          className="scale-[1.18] object-cover object-[center_72%]"
        />
      </motion.div>

      {/* Sıcaklık: fotoğrafın nötr grisini marka ısısına çeker */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-walnut/35 mix-blend-color"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-charcoal/15 mix-blend-multiply"
      />

      {/* Tek kaynaklı ışık: kenarlardan koyulaşan, ortada nefes alan zemin */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_72%_58%_at_45%_42%,transparent_0%,rgba(20,18,16,0.45)_55%,rgba(20,18,16,0.94)_100%)]"
      />
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 -z-10 h-40 bg-gradient-to-b from-charcoal via-charcoal/70 to-transparent"
      />
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 -z-10 h-[62%] bg-gradient-to-t from-charcoal via-charcoal/88 to-transparent"
      />
      <div aria-hidden className="ember-glow absolute inset-x-0 bottom-0 -z-10 h-1/3" />

      {/* İçerik */}
      <motion.div
        style={reduced ? undefined : { y: contentY, opacity: contentOpacity }}
        className="relative mx-auto w-full max-w-[1400px] px-5 pb-28 sm:px-8 md:pb-24 lg:px-12"
      >
        <p className="font-sans text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-brass sm:text-xs">
          {hero.eyebrow}
        </p>

        <h1 className="mt-5">
          <span className="font-display block text-mega text-bone drop-shadow-[0_2px_40px_rgba(20,18,16,0.9)]">
            {hero.h1.brand}
          </span>
          <span className="mt-3 block font-serif text-xl leading-tight font-light text-bone/90 italic sm:text-2xl md:text-3xl">
            {hero.h1.line}
          </span>
        </h1>

        <p className="font-hand mt-5 text-2xl text-brass sm:text-3xl">
          {hero.witty}
        </p>

        {/* Tek ateşleme aksiyonu — kırmızı yalnızca burada */}
        <div className="mt-9 flex flex-wrap items-center gap-3">
          <a
            href={action.href}
            {...(action.label === "order" && {
              target: "_blank",
              rel: "noopener noreferrer",
            })}
            className="inline-flex min-h-[52px] items-center gap-2.5 rounded-full bg-red px-8 font-sans text-base font-semibold text-bone transition-colors duration-200 hover:bg-brass hover:text-charcoal"
          >
            {action.label === "order" ? nav.cta.order : nav.cta.call}
            <span aria-hidden className="text-lg leading-none">
              →
            </span>
          </a>

          <a
            href="#bul-bizi"
            className="inline-flex min-h-[52px] items-center rounded-full border border-bone/25 px-7 font-sans text-base font-medium text-bone/90 transition-colors duration-200 hover:border-brass hover:text-brass"
          >
            {nav.cta.directions}
          </a>
        </div>
      </motion.div>

      {/* Kaydırma ipucu */}
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 md:flex"
      >
        <span className="font-sans text-[0.65rem] uppercase tracking-[0.25em] text-bone/45">
          {nav.scrollHint}
        </span>
        <motion.span
          className="block h-8 w-px bg-gradient-to-b from-brass to-transparent"
          animate={reduced ? undefined : { scaleY: [0.4, 1, 0.4], originY: 0 }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Görünmez ama makinelerin okuduğu konum teyidi */}
      <span className="sr-only">
        {business.address.full} · {business.phone.display}
      </span>
    </section>
  );
}
