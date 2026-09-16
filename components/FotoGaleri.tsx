"use client";

import Image from "next/image";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type MouseEvent,
  type ReactNode,
} from "react";

/** Hiç değişmeyen bir dış kaynak: abone olmaya gerek yok. */
const aboneOlma = () => () => {};

export type GaleriFoto = {
  src: string;
  alt: string;
  ad: string;
  fiyat: number | null;
  not: string;
  /** Kategori adı — büyütülen fotoğrafın hangi bölümden geldiğini söyler */
  bolum: string;
};

/**
 * Menü fotoğraflarını büyüten tam ekran galeri.
 *
 * Sarmalayıcı olarak çalışır: `children` sunucuda render edilmiş menü
 * listesidir, bu bileşen yalnızca tıklamayı yakalar. Böylece 29 satırlık
 * menü istemciye JSX olarak taşınmaz — sayfa statik kalır, yalnızca bu küçük
 * dinleyici ve açıldığında görünen katman istemci tarafında çalışır.
 *
 * Tıklanan öğe `data-foto="<index>"` taşır; hangi fotoğrafın açılacağını
 * olay delegasyonuyla buradan okuruz.
 */
export function FotoGaleri({
  fotograflar,
  children,
}: {
  fotograflar: GaleriFoto[];
  children: ReactNode;
}) {
  const [acik, setAcik] = useState<number | null>(null);
  /* İstemci bileşenleri sunucuda da render ediliyor; `document` orada yok.
     Katmanı ancak tarayıcıya bağlandıktan sonra portal'a taşırız. Sunucuda
     false, hidrasyondan sonra true döner — React'in client-only render için
     önerdiği kalıp. */
  const monte = useSyncExternalStore(
    aboneOlma,
    () => true,
    () => false,
  );
  const azHareket = useReducedMotion();
  /** Galeri kapanınca odak, tıklanan fotoğrafa geri döner. */
  const tetikleyen = useRef<HTMLElement | null>(null);
  const kapatButonu = useRef<HTMLButtonElement | null>(null);
  const dokunusX = useRef<number | null>(null);

  const kapat = useCallback(() => setAcik(null), []);

  const git = useCallback(
    (yon: 1 | -1) =>
      setAcik((i) =>
        i === null ? null : (i + yon + fotograflar.length) % fotograflar.length,
      ),
    [fotograflar.length],
  );

  /** Listedeki bir fotoğrafa tıklandı mı? */
  function listeTiklamasi(e: MouseEvent<HTMLDivElement>) {
    const hedef = (e.target as HTMLElement).closest<HTMLElement>("[data-foto]");
    if (!hedef) return;
    const i = Number(hedef.dataset.foto);
    if (Number.isNaN(i) || !fotograflar[i]) return;
    tetikleyen.current = hedef;
    setAcik(i);
  }

  /* Klavye + sayfa kaydırma kilidi. Galeri açıkken arkadaki sayfanın
     kaymaması, mobilde "kapattım ama başka yerdeyim" hissini önler. */
  useEffect(() => {
    if (acik === null) return;

    function tus(e: KeyboardEvent) {
      if (e.key === "Escape") kapat();
      else if (e.key === "ArrowRight") git(1);
      else if (e.key === "ArrowLeft") git(-1);
    }

    const oncekiOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", tus);
    kapatButonu.current?.focus();

    return () => {
      document.removeEventListener("keydown", tus);
      document.body.style.overflow = oncekiOverflow;
    };
  }, [acik, kapat, git]);

  /* Kapanışta odağı tıklanan fotoğrafa iade et — klavye kullanıcısı menünün
     başına fırlamaz, kaldığı satırdan devam eder. */
  useEffect(() => {
    if (acik !== null) return;
    tetikleyen.current?.focus();
    tetikleyen.current = null;
  }, [acik]);

  const foto = acik === null ? null : fotograflar[acik];

  return (
    <>
      {/* Sunucuda render edilmiş menü listesi olduğu gibi burada durur. */}
      <div onClick={listeTiklamasi}>{children}</div>

      {monte &&
        createPortal(
          <AnimatePresence>
            {foto && (
              <motion.div
                role="dialog"
                aria-modal="true"
                aria-label={`${foto.ad} fotoğrafı`}
                initial={azHareket ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={azHareket ? undefined : { opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={kapat}
                onTouchStart={(e) => {
                  dokunusX.current = e.touches[0].clientX;
                }}
                onTouchEnd={(e) => {
                  if (dokunusX.current === null) return;
                  const fark = e.changedTouches[0].clientX - dokunusX.current;
                  dokunusX.current = null;
                  // 60px altındaki hareket kaydırma değil, titremedir.
                  if (Math.abs(fark) > 60) git(fark < 0 ? 1 : -1);
                }}
                className="fixed inset-0 z-[100] flex flex-col bg-charcoal/95 backdrop-blur-sm"
              >
                {/* Üst şerit: bölüm adı + kapat */}
                <div className="flex shrink-0 items-center justify-between gap-4 px-5 pt-[max(1rem,env(safe-area-inset-top))] pb-3 sm:px-8">
                  <p className="font-sans text-[0.7rem] font-semibold tracking-[0.22em] text-brass uppercase">
                    {foto.bolum}
                  </p>
                  <button
                    ref={kapatButonu}
                    type="button"
                    onClick={kapat}
                    aria-label="Fotoğrafı kapat"
                    className="-mr-2 flex h-11 w-11 items-center justify-center rounded-full text-2xl leading-none text-bone/70 transition-colors hover:text-brass"
                  >
                    <span aria-hidden>×</span>
                  </button>
                </div>

                {/* Fotoğraf — tıklama katmanı kapatmasın diye olay durdurulur */}
                <div
                  className="relative min-h-0 flex-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Image
                    key={foto.src}
                    src={foto.src}
                    alt={foto.alt}
                    fill
                    sizes="100vw"
                    quality={85}
                    priority
                    className="object-contain"
                  />

                  {fotograflar.length > 1 && (
                    <>
                      <GaleriOk yon="onceki" onClick={() => git(-1)} />
                      <GaleriOk yon="sonraki" onClick={() => git(1)} />
                    </>
                  )}
                </div>

                {/* Alt şerit: ad, not, fiyat */}
                <div
                  className="shrink-0 border-t border-bone/10 px-5 pt-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:px-8"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="mx-auto flex w-full max-w-[900px] items-baseline gap-4">
                    <div className="min-w-0">
                      <p className="font-display text-2xl text-bone sm:text-3xl">
                        {foto.ad}
                      </p>
                      {foto.not && (
                        <p className="mt-1 font-sans text-sm text-bone/50">
                          {foto.not}
                        </p>
                      )}
                    </div>
                    <span
                      aria-hidden
                      className="mb-1 min-w-6 flex-1 border-b border-dotted border-bone/20"
                    />
                    {foto.fiyat !== null && (
                      <p className="shrink-0 font-sans text-2xl font-semibold tabular-nums text-bone sm:text-3xl">
                        {foto.fiyat}
                        <span className="ml-0.5 text-brass">₺</span>
                      </p>
                    )}
                  </div>
                  <p className="mx-auto mt-3 w-full max-w-[900px] font-sans text-xs text-bone/35">
                    {acik !== null && `${acik + 1} / ${fotograflar.length}`}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
}

/* -------------------------------------------------------------------------- */

/** Fotoğrafın kenarındaki geçiş oku. Mobilde kaydırma da aynı işi yapar. */
function GaleriOk({
  yon,
  onClick,
}: {
  yon: "onceki" | "sonraki";
  onClick: () => void;
}) {
  const onceki = yon === "onceki";
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={onceki ? "Önceki fotoğraf" : "Sonraki fotoğraf"}
      className={`absolute top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-bone/15 bg-charcoal/70 text-xl text-bone/80 backdrop-blur-sm transition-colors hover:border-brass hover:text-brass ${
        onceki ? "left-3 sm:left-6" : "right-3 sm:right-6"
      }`}
    >
      <span aria-hidden>{onceki ? "‹" : "›"}</span>
    </button>
  );
}
