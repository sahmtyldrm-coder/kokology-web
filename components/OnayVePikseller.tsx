"use client";

import { useSyncExternalStore } from "react";
import { cerez } from "@/content/tr";
import {
  onayAbone,
  onayAnlik,
  onaySunucuAnlik,
  onayKaydet,
} from "@/lib/onay";
import { Pikseller, type TakipKodlari } from "@/components/Pikseller";

/**
 * Çerez onayı ve üçüncü taraf izleme kodları.
 *
 * Onay SUNUCUDA değil tarayıcıda okunuyor. Sebebi mimari: kök düzende
 * `cookies()` çağırmak Next.js'in tüm sayfaları dinamik hâle getirmesine yol
 * açıyor — site tamamen statikken her istekte sunucuda render edilmeye başlıyor
 * ve hız kaybediliyor. Bir restoran sitesinde bu takas kabul edilemez.
 *
 * Karşılığında pikseller hidrasyondan hemen sonra yükleniyor; onay gerektiren
 * kodlar için zaten standart davranış bu.
 *
 * Kritik nokta: onay yoksa kodlar sayfaya HİÇ basılmıyor. Yüklenip sonra
 * susturulan bir piksel ağ isteğini zaten yapmış, yani rıza öncesi veri
 * toplamış olurdu.
 */
export function OnayVePikseller({ kodlar }: { kodlar: TakipKodlari }) {
  // `undefined` = sunucuda / henüz okunmadı, `null` = karar verilmemiş
  const durum = useSyncExternalStore(onayAbone, onayAnlik, onaySunucuAnlik);

  // Okunmadan ne bant ne piksel — ilk karede yanıp sönmesin.
  if (durum === undefined) return null;

  if (durum === "kabul") return <Pikseller kodlar={kodlar} />;
  if (durum === "ret") return null;

  return (
    <div
      role="dialog"
      aria-label={cerez.baslik}
      className="fixed inset-x-0 bottom-0 z-[70] border-t border-bone/15 bg-charcoal/97 backdrop-blur-md"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-4 px-5 py-5 sm:px-8 lg:flex-row lg:items-center lg:gap-8 lg:px-12">
        <div className="min-w-0 flex-1">
          <p className="font-sans text-sm leading-relaxed text-bone/80">
            {cerez.metin}
          </p>
          <p className="mt-1.5 font-sans text-xs leading-relaxed text-bone/45">
            {cerez.detay}
          </p>
        </div>

        {/* İki düğme aynı görünürlükte: "reddet"i saklayıp "kabul et"i öne
            çıkarmak karanlık desendir ve rızayı geçersiz kılar. */}
        <div className="flex shrink-0 gap-3">
          <button
            type="button"
            onClick={() => onayKaydet("kabul")}
            className="min-h-[48px] flex-1 rounded-full bg-brass px-6 font-sans text-sm font-semibold text-charcoal lg:flex-initial"
          >
            {cerez.kabul}
          </button>
          <button
            type="button"
            onClick={() => onayKaydet("ret")}
            className="min-h-[48px] flex-1 rounded-full border border-bone/30 px-6 font-sans text-sm font-medium text-bone lg:flex-initial"
          >
            {cerez.ret}
          </button>
        </div>
      </div>
    </div>
  );
}
