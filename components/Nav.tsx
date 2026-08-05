"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useMotionValueEvent, useReducedMotion } from "motion/react";
import { nav, business } from "@/content/tr";
import { primaryAction } from "@/lib/schema";
import { Wordmark } from "@/components/Wordmark";

/**
 * Kalıcı minimal nav.
 * Hero üzerindeyken şeffaf, kaydırınca zemin kazanır.
 * Mobilde tam ekran katman; Escape ile kapanır, arkadaki sayfa kilitlenir.
 */
export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const reduced = useReducedMotion();
  const action = primaryAction();
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 80));

  // Katman açıkken arka plan kaymasın, Escape kapatsın
  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
          scrolled || open
            ? "border-b border-bone/10 bg-charcoal/92 backdrop-blur-md"
            : "border-b border-transparent"
        }`}
      >
        <div className="mx-auto flex h-16 w-full max-w-[1400px] items-center justify-between px-5 sm:h-18 sm:px-8 lg:px-12">
          <a
            href="#icerik"
            aria-label={nav.brandHome}
            className="transition-colors hover:text-brass"
          >
            <Wordmark className="text-xl sm:text-2xl" />
          </a>

          {/* Masaüstü bağlantıları */}
          <nav className="hidden items-center gap-8 lg:flex">
            {nav.links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="font-sans text-sm font-medium text-bone/70 transition-colors hover:text-brass"
              >
                {link.label}
              </a>
            ))}
            <a
              href={action.href}
              {...(action.label === "order" && {
                target: "_blank",
                rel: "noopener noreferrer",
              })}
              className="inline-flex min-h-[44px] items-center rounded-full bg-red px-6 font-sans text-sm font-semibold text-bone transition-colors hover:bg-brass hover:text-charcoal"
            >
              {action.label === "order" ? nav.cta.order : nav.cta.call}
            </a>
          </nav>

          {/* Mobil menü düğmesi — 44px dokunmatik hedef */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobil-menu"
            aria-label={open ? nav.closeMenu : nav.openMenu}
            className="-mr-2 flex h-11 w-11 items-center justify-center lg:hidden"
          >
            <span className="relative block h-4 w-6">
              <span
                className={`absolute left-0 block h-px w-full bg-bone transition-all duration-300 ${
                  open ? "top-1/2 rotate-45" : "top-0.5"
                }`}
              />
              <span
                className={`absolute left-0 block h-px w-full bg-bone transition-all duration-300 ${
                  open ? "top-1/2 -rotate-45" : "bottom-0.5"
                }`}
              />
            </span>
          </button>
        </div>
      </header>

      {/* Mobil katman */}
      {open && (
        <motion.div
          id="mobil-menu"
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-40 flex flex-col justify-center bg-charcoal px-5 pt-16 lg:hidden"
        >
          <nav className="flex flex-col gap-1">
            {nav.links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="font-display py-3 text-4xl text-bone transition-colors hover:text-brass"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <a
            href={`tel:${business.phone.e164}`}
            className="mt-10 font-sans text-lg text-bone/60 transition-colors hover:text-brass"
          >
            {business.phone.display}
          </a>
        </motion.div>
      )}
    </>
  );
}
