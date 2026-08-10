"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { hero, nav, findUs } from "@/content/tr";
import { useIsletme } from "@/components/IsletmeSaglayici";
import { anaAksiyon, type Saat } from "@/lib/veri";
import { getOpenState, formatTime, type OpenState } from "@/lib/hours";

/**
 * Bölüm 1 — Sokak Cephesi.
 *
 * Sahne, ocağın yanındaki elle boyanmış Leonardo duvar resmi: markanın kendi
 * görsel dilini (sıcak karanlık, Old Master, tek kaynaklı ışık) taşıyan ve
 * marka adını zaten içinde barındıran tek kare.
 *
 * Metin bloğu sola, koyu çini duvarın önüne oturur; duvar resmi sağda kalır.
 * Böylece hem okunabilirlik hem de görselin kompozisyonu korunur.
 */
export function Hero() {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { isletme, saatler } = useIsletme();
  const action = anaAksiyon(isletme);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Anahtar görsel tamamlanmış bir kompozisyon; fazla parallax kadrajı bozuyor.
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "9%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "38%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section
      ref={ref}
      className="grain relative flex min-h-[100svh] flex-col justify-end overflow-hidden"
    >
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
          /* Dar ekranda kadraj daralınca Leonardo kayıyor; odağı ona
             sabitliyoruz. Geniş ekranda merkez kadraj zaten doğru. */
          /* Görsel 16:9; 16:10 ekranlarda yatayda kırpılıyor. Kadraj sağa
             kaydırılır ki wordmark'ın son harfi kesilmesin — soldaki boş
             manzara alanını kaybetmek zararsız. */
          className="scale-105 object-cover object-[40%_center] sm:object-[58%_center]"
        />
      </motion.div>

      {/*
        Perdeleme dengesi: sol taraf metnin okunması için koyulaşır ama
        Leonardo'nun yüzünü ve elindeki ekmeği yutmayacak kadar hafif —
        iştahı taşıyan unsur o. Asıl karartma alttan gelir, metin oraya oturur.
      */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-r from-charcoal/85 via-charcoal/35 to-transparent"
      />
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 -z-10 h-28 bg-gradient-to-b from-charcoal/90 to-transparent"
      />
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 -z-10 h-3/5 bg-gradient-to-t from-charcoal via-charcoal/85 to-transparent"
      />
      <div aria-hidden className="ember-glow absolute inset-x-0 bottom-0 -z-10 h-1/3" />

      <motion.div
        style={reduced ? undefined : { y: contentY, opacity: contentOpacity }}
        className="relative mx-auto w-full max-w-[1400px] px-5 pb-24 sm:px-8 md:pb-20 lg:px-12"
      >
        <p className="font-sans text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-brass sm:text-xs">
          {hero.eyebrow}
        </p>

        {/* H1: marka adı + kategori + konum. Görsel ağırlık serif satırda. */}
        {/* Ölçü `ch` ile verilemez: `ch` elementin KENDİ font boyutuna göre
            hesaplanır, h1'in font boyutu yok (16px miras alır) ve başlık
            192px'e sıkışıp altı satıra bölünüyordu. */}
        <h1 className="mt-4 max-w-[34rem] lg:max-w-[46rem]">
          <span className="font-display block text-2xl leading-none tracking-tight text-bone/85 sm:text-3xl">
            {hero.h1.brand}
          </span>
          <span className="mt-3 block font-serif text-3xl leading-[1.08] font-light text-bone italic sm:text-4xl md:text-5xl lg:text-[3.5rem]">
            {hero.h1.line}
          </span>
        </h1>

        <p className="font-hand mt-5 text-2xl text-brass sm:text-3xl">
          {hero.witty}
        </p>

        {/* Aksiyonlar — kırmızı yalnızca tek ateşleme aksiyonunda */}
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <a
            href={action.href}
            {...(action.label === "order" && {
              target: "_blank",
              rel: "noopener noreferrer",
            })}
            data-olcum={action.label === "order" ? "siparis" : "ara"}
            className="group inline-flex min-h-[52px] items-center gap-2.5 rounded-full bg-red px-8 font-sans text-base font-semibold text-bone transition-all duration-300 hover:bg-brass hover:text-charcoal hover:shadow-[0_0_28px_-4px_var(--color-brass)]"
          >
            {action.label === "order" ? nav.cta.order : nav.cta.call}
            <span
              aria-hidden
              className="text-lg leading-none transition-transform duration-300 group-hover:translate-x-0.5"
            >
              →
            </span>
          </a>

          <Link
            data-olcum="menu"
            href="/menu"
            className="inline-flex min-h-[52px] items-center rounded-full border border-brass/60 px-7 font-sans text-base font-medium text-brass transition-colors duration-200 hover:border-brass hover:bg-brass hover:text-charcoal"
          >
            {nav.cta.menu}
          </Link>

          <a
            data-olcum="yol_tarifi"
            href="#bul-bizi"
            className="inline-flex min-h-[52px] items-center rounded-full border border-bone/25 px-7 font-sans text-base font-medium text-bone/90 transition-colors duration-200 hover:border-brass hover:text-brass"
          >
            {nav.cta.directions}
          </a>
        </div>

        {/* Güven satırı — karar veren bilgiler tek bakışta */}
        <ul className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3 font-sans text-sm text-bone/65">
          <li>
            <OpenStatus saatler={saatler} />
          </li>
          {hero.trust.map((item) => (
            <li key={item.text} className="flex items-center gap-2">
              <TrustIcon name={item.icon} />
              {item.text}
            </li>
          ))}
        </ul>
      </motion.div>

      <span className="sr-only">
        {isletme.address.full} · {isletme.phone.display}
      </span>
    </section>
  );
}

/* -------------------------------------------------------------------------- */

/**
 * Gece 02.00'ye kadar açık olmak yerel aramada gerçek bir avantaj — bunu
 * hero'da göstermek karar süresini kısaltır. Durum istemcide hesaplanır;
 * statik HTML'e gömülse saatler sonra yanlış olurdu.
 */
function OpenStatus({ saatler }: { saatler: Saat[] }) {
  const [state, setState] = useState<OpenState | null>(null);

  useEffect(() => {
    const tick = () => setState(getOpenState(saatler));
    tick();
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, [saatler]);

  if (!state) return <span className="inline-block h-5" aria-hidden />;

  return (
    <span role="status" className="flex items-center gap-2">
      <span
        aria-hidden
        className={`h-2 w-2 rounded-full ${
          state.open ? "bg-brass" : "bg-bone/40"
        }`}
      />
      <span className={state.open ? "text-brass" : "text-bone/50"}>
        {state.open
          ? `${findUs.openNow} · ${formatTime(state.closesAt)}'e kadar`
          : findUs.closedNow}
      </span>
    </span>
  );
}

function TrustIcon({ name }: { name: string }) {
  const common = "h-3.5 w-3.5 shrink-0 text-brass";
  if (name === "star")
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={common}>
        <path d="M12 2l2.9 6.3 6.9.8-5.1 4.7 1.4 6.8L12 17.3 5.9 20.6l1.4-6.8L2.2 9.1l6.9-.8L12 2z" />
      </svg>
    );
  if (name === "pin")
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={common}>
        <path d="M12 2a7 7 0 00-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 00-7-7zm0 9.5A2.5 2.5 0 1112 6.5a2.5 2.5 0 010 5z" />
      </svg>
    );
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={common}>
      <path d="M3 3h18v18H3V3zm5 4v10h2.6v-3.2h2.1a3.4 3.4 0 100-6.8H8zm2.6 2.2h1.9a1.2 1.2 0 010 2.4h-1.9V9.2z" />
    </svg>
  );
}
