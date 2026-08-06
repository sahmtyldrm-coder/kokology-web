"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "motion/react";
import { nav, business } from "@/content/tr";
import { primaryAction } from "@/lib/schema";

/**
 * Mobil alt sabit bar.
 * Yerel müşteri telefonda: ateşleme aksiyonu her an başparmak altında.
 * Hero geçildikten sonra belirir; masaüstünde nav'daki CTA yeterli olduğu
 * için gizlidir. iPhone alt çubuğu için safe-area payı bırakılır.
 */
export function StickyCTA() {
  const [visible, setVisible] = useState(false);
  const action = primaryAction();
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (y) => {
    setVisible(y > (typeof window !== "undefined" ? window.innerHeight * 0.7 : 600));
  });

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: "110%" }}
          animate={{ y: 0 }}
          exit={{ y: "110%" }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-x-0 bottom-0 z-50 border-t border-bone/10 bg-charcoal/95 backdrop-blur-md lg:hidden"
          style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        >
          {/* Üç aksiyon: ara, menü, yol tarifi. Yerel müşterinin telefonda
              yapmak isteyeceği her şey tek başparmak mesafesinde. */}
          <div className="flex gap-2 px-3 py-3">
            <a
              href={action.href}
              {...(action.label === "order" && {
                target: "_blank",
                rel: "noopener noreferrer",
              })}
              data-olcum="ara"
            className="inline-flex min-h-[52px] flex-1 items-center justify-center rounded-full bg-red px-3 font-sans text-[0.95rem] font-semibold text-bone"
            >
              {action.label === "order" ? nav.cta.order : nav.cta.call}
            </a>
            <Link
              href="/menu"
              data-olcum="menu"
            className="inline-flex min-h-[52px] flex-1 items-center justify-center rounded-full border border-brass/60 px-3 font-sans text-[0.95rem] font-semibold text-brass"
            >
              {nav.links[0].label}
            </Link>
            <a
              href={business.maps.directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-olcum="yol_tarifi"
            className="inline-flex min-h-[52px] flex-1 items-center justify-center rounded-full border border-bone/25 px-3 font-sans text-[0.95rem] font-medium text-bone"
            >
              {nav.cta.directions}
            </a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
