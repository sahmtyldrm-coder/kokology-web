"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

/**
 * Ziyaret ve tıklama ölçümü.
 *
 * Çerez kullanmıyor, kimlik saklamıyor. Sayfa görüntülemeyi ve ateşleme
 * aksiyonlarını (ara, yol tarifi, sipariş, menü) sayıyor.
 *
 * Tıklamalar tek bir gövde dinleyicisiyle yakalanıyor; her butona ayrı
 * işleyici bağlamak yerine `data-olcum` özniteliğine bakılıyor. Böylece yeni
 * bir buton eklendiğinde ölçüm kodu değişmiyor.
 */
export function Olcum() {
  const yol = usePathname();
  const sonGonderilen = useRef<string | null>(null);

  // Sayfa görüntüleme.
  // React StrictMode geliştirme modunda efektleri iki kez çalıştırıyor ve aynı
  // ziyaret iki kez sayılıyordu. Son gönderilen yolu tutarak tekrarı engelliyoruz.
  useEffect(() => {
    if (sonGonderilen.current === yol) return;
    sonGonderilen.current = yol;
    gonder("sayfa", yol, document.referrer);
  }, [yol]);

  // Aksiyon tıklamaları
  useEffect(() => {
    function tikla(e: MouseEvent) {
      const hedef = (e.target as HTMLElement | null)?.closest<HTMLElement>(
        "[data-olcum]",
      );
      if (!hedef) return;
      const tip = hedef.dataset.olcum;
      if (tip) gonder(tip, window.location.pathname, document.referrer);
    }
    document.addEventListener("click", tikla, { capture: true });
    return () => document.removeEventListener("click", tikla, { capture: true });
  }, []);

  return null;
}

/**
 * Aksiyon tıklamalarının reklam araçlarındaki karşılıkları.
 *
 * Sayfa görüntüleme zaten GA4 ve Meta tarafından kendiliğinden sayılıyor;
 * burada yalnızca "dönüşüm" sayılabilecek tıklamalar iletiliyor. Google Ads
 * ve Meta kampanyaları bu olaylara göre optimize edilebilsin diye gerekli —
 * yoksa reklam aracı yalnızca sayfa açıldığını bilir, kimsenin aradığını
 * ya da sipariş linkine gittiğini bilmez.
 *
 * Meta'da standart olay adı varsa o kullanılıyor (Contact, FindLocation);
 * karşılığı olmayanlar özel olay olarak gidiyor.
 */
const REKLAM_OLAYLARI: Record<
  string,
  { ga: string; meta: string; metaStandart: boolean }
> = {
  ara: { ga: "telefon_tikla", meta: "Contact", metaStandart: true },
  siparis: { ga: "siparis_tikla", meta: "Lead", metaStandart: true },
  yol_tarifi: { ga: "yol_tarifi", meta: "FindLocation", metaStandart: true },
  menu: { ga: "menu_goruntule", meta: "MenuGoruntule", metaStandart: false },
};

type ReklamPenceresi = Window & {
  gtag?: (...a: unknown[]) => void;
  fbq?: (...a: unknown[]) => void;
};

/**
 * Reklam araçlarına ilet.
 *
 * `gtag` ve `fbq` yalnızca ziyaretçi çerez onayı verdiğinde sayfaya basılıyor.
 * Yani buradaki varlık kontrolü aynı zamanda rıza kontrolü: onay yoksa
 * fonksiyonlar tanımsızdır ve hiçbir şey gönderilmez.
 */
function reklamaBildir(tip: string) {
  const olay = REKLAM_OLAYLARI[tip];
  if (!olay) return;
  const w = window as ReklamPenceresi;
  w.gtag?.("event", olay.ga);
  w.fbq?.(olay.metaStandart ? "track" : "trackCustom", olay.meta);
}

function gonder(tip: string, yol: string, referrer: string) {
  if (tip !== "sayfa") reklamaBildir(tip);

  const govde = JSON.stringify({ tip, yol, referrer });

  // sendBeacon sayfadan ayrılırken bile isteği tamamlar; tıkla-ara gibi
  // sayfadan çıkaran aksiyonlarda fetch yarıda kesilirdi.
  if (navigator.sendBeacon) {
    navigator.sendBeacon(
      "/api/olay",
      new Blob([govde], { type: "application/json" }),
    );
    return;
  }
  void fetch("/api/olay", {
    method: "POST",
    body: govde,
    headers: { "Content-Type": "application/json" },
    keepalive: true,
  }).catch(() => {});
}
