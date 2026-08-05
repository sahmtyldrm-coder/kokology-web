"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import type { ReactNode } from "react";

type Direction = "up" | "left" | "right" | "none";

const OFFSET: Record<Direction, { x: number; y: number }> = {
  up: { x: 0, y: 28 },
  left: { x: -28, y: 0 },
  right: { x: 28, y: 0 },
  none: { x: 0, y: 0 },
};

/**
 * Scroll ile beliren blok. Hareket azaltma açıkken hiçbir dönüşüm uygulanmaz —
 * içerik ilk karede tam opak ve yerindedir, yani site animasyonsuz da eksiksiz.
 */
export function Reveal({
  children,
  direction = "up",
  delay = 0,
  className,
  as = "div",
}: {
  children: ReactNode;
  direction?: Direction;
  delay?: number;
  className?: string;
  as?: "div" | "section" | "li" | "figure" | "span";
}) {
  const reduced = useReducedMotion();
  const Tag = motion[as];

  if (reduced) {
    const Plain = as;
    return <Plain className={className}>{children}</Plain>;
  }

  const variants: Variants = {
    hidden: { opacity: 0, ...OFFSET[direction] },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: { duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <Tag
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.25, margin: "0px 0px -80px 0px" }}
    >
      {children}
    </Tag>
  );
}

/**
 * Çocukları sırayla açan kapsayıcı. `Reveal` yerine `RevealItem` ile kullanılır.
 */
export function RevealGroup({
  children,
  className,
  stagger = 0.08,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
  as?: "div" | "ul" | "section";
}) {
  const reduced = useReducedMotion();
  const Tag = motion[as];

  if (reduced) {
    const Plain = as;
    return <Plain className={className}>{children}</Plain>;
  }

  return (
    <Tag
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15, margin: "0px 0px -80px 0px" }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: stagger } },
      }}
    >
      {children}
    </Tag>
  );
}

/**
 * Char-wipe: başlık soldan sağa, ateşin ekmeği yalaması gibi açılır.
 *
 * Harf harf bölmek yerine clip-path ile tek parça açılır — bu hem daha az
 * DOM düğümü hem de metnin ekran okuyucuda bütün kalması demek. Harflere
 * bölen çözümler kelimeyi tek tek harf olarak okutur.
 *
 * Hareket azaltma açıkken hiçbir kırpma uygulanmaz.
 */
export function WipeText({
  children,
  className,
  as = "h2",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  delay?: number;
}) {
  const reduced = useReducedMotion();
  const Tag = motion[as];

  if (reduced) {
    const Plain = as;
    return <Plain className={className}>{children}</Plain>;
  }

  return (
    <Tag
      className={className}
      initial={{ clipPath: "inset(0 100% -0.25em 0)", opacity: 0.35 }}
      whileInView={{ clipPath: "inset(0 0% -0.25em 0)", opacity: 1 }}
      viewport={{ once: true, amount: 0.4, margin: "0px 0px -60px 0px" }}
      transition={{ duration: 0.85, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </Tag>
  );
}

export function RevealItem({
  children,
  className,
  direction = "up",
  as = "div",
  scale = false,
}: {
  children: ReactNode;
  className?: string;
  direction?: Direction;
  as?: "div" | "li" | "figure";
  /** Görsel kartlarda: hafif büyüyerek gelir, ışığa yaklaşıyormuş gibi */
  scale?: boolean;
}) {
  const reduced = useReducedMotion();
  const Tag = motion[as];

  if (reduced) {
    const Plain = as;
    return <Plain className={className}>{children}</Plain>;
  }

  return (
    <Tag
      className={className}
      variants={{
        hidden: { opacity: 0, ...OFFSET[direction], ...(scale && { scale: 0.96 }) },
        visible: {
          opacity: 1,
          x: 0,
          y: 0,
          ...(scale && { scale: 1 }),
          transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
        },
      }}
    >
      {children}
    </Tag>
  );
}
