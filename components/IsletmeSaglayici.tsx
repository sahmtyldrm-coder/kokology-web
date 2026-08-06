"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { Isletme, Saat } from "@/lib/veri";

/**
 * İşletme bilgilerini istemci bileşenlerine taşır.
 *
 * Hero, FindUs, Nav ve StickyCTA istemci bileşeni — kaydırma, saat hesabı ve
 * form durumu için tarayıcıda çalışmaları gerekiyor. Bu yüzden veriyi kendileri
 * `await` ile çekemiyorlar.
 *
 * Alternatif her birine ayrı prop geçirmekti; o zaman aradaki her bileşen
 * kullanmadığı veriyi taşımak zorunda kalırdı. Kök düzende bir kez okunup
 * bağlamla dağıtmak hem daha az kod hem tek okuma.
 */
type Deger = { isletme: Isletme; saatler: Saat[] };

const Baglam = createContext<Deger | null>(null);

export function IsletmeSaglayici({
  deger,
  children,
}: {
  deger: Deger;
  children: ReactNode;
}) {
  return <Baglam.Provider value={deger}>{children}</Baglam.Provider>;
}

export function useIsletme(): Deger {
  const deger = useContext(Baglam);
  if (!deger) {
    // Sağlayıcı unutulursa sessizce yanlış veri göstermek yerine erken patlar.
    throw new Error("useIsletme, IsletmeSaglayici içinde kullanılmalı.");
  }
  return deger;
}
