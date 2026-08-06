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

function gonder(tip: string, yol: string, referrer: string) {
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
