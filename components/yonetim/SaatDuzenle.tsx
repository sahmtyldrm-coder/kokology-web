"use client";

import { useState, useTransition } from "react";
import { saatGuncelle } from "@/app/yonetim/eylemler";

export type PanelSaat = {
  gun: number;
  etiket: string;
  acilis: string;
  kapanis: string;
  kapali: boolean;
};

/**
 * Çalışma saatleri düzenleyici.
 *
 * Kapanış açılıştan küçük olabilir (11:00 – 02:00): bu bir hata değil, gece
 * yarısını aşan vardiyadır ve site bunu doğru hesaplar. Bu yüzden burada
 * "kapanış açılıştan büyük olmalı" gibi bir doğrulama YOK.
 */
export function SaatDuzenle({ saatler }: { saatler: PanelSaat[] }) {
  return (
    <ul className="divide-y divide-bone/10 border-y border-bone/10">
      {saatler.map((s) => (
        <SaatSatiri key={s.gun} saat={s} />
      ))}
    </ul>
  );
}

function SaatSatiri({ saat }: { saat: PanelSaat }) {
  const [acilis, setAcilis] = useState(saat.acilis);
  const [kapanis, setKapanis] = useState(saat.kapanis);
  const [kapali, setKapali] = useState(saat.kapali);
  const [durum, setDurum] = useState("");
  const [bekliyor, basla] = useTransition();

  const degisti =
    acilis !== saat.acilis || kapanis !== saat.kapanis || kapali !== saat.kapali;

  const geceyiAsiyor = !kapali && kapanis < acilis;

  function kaydet() {
    setDurum("");
    basla(async () => {
      const s = await saatGuncelle(saat.gun, { acilis, kapanis, kapali });
      setDurum(s.ok ? "kaydedildi" : s.hata);
    });
  }

  return (
    <li className="grid grid-cols-1 gap-3 py-4 sm:grid-cols-[8rem_auto_auto_1fr_auto] sm:items-center">
      <span className="font-sans text-base font-medium text-bone">
        {saat.etiket}
      </span>

      <input
        type="time"
        value={acilis}
        disabled={kapali}
        onChange={(e) => setAcilis(e.target.value)}
        aria-label={`${saat.etiket} açılış`}
        className="min-h-[44px] rounded-sm border border-bone/20 bg-soot px-3 font-sans text-base tabular-nums text-bone outline-none focus:border-brass disabled:opacity-40"
      />
      <input
        type="time"
        value={kapanis}
        disabled={kapali}
        onChange={(e) => setKapanis(e.target.value)}
        aria-label={`${saat.etiket} kapanış`}
        className="min-h-[44px] rounded-sm border border-bone/20 bg-soot px-3 font-sans text-base tabular-nums text-bone outline-none focus:border-brass disabled:opacity-40"
      />

      <div className="flex items-center gap-4">
        <label className="flex cursor-pointer items-center gap-2 font-sans text-sm text-bone/60">
          <input
            type="checkbox"
            checked={kapali}
            onChange={(e) => setKapali(e.target.checked)}
            className="h-4 w-4 accent-[var(--color-red)]"
          />
          kapalı
        </label>
        {geceyiAsiyor && (
          <span className="font-sans text-xs text-bone/45">
            ertesi güne taşıyor
          </span>
        )}
      </div>

      <button
        type="button"
        onClick={kaydet}
        disabled={!degisti || bekliyor}
        className="min-h-[44px] rounded-full bg-brass px-5 font-sans text-sm font-semibold text-charcoal transition-opacity disabled:opacity-30"
      >
        {bekliyor ? "…" : "Kaydet"}
      </button>

      {durum && (
        <p
          role="status"
          className={`sm:col-span-5 font-sans text-xs ${
            durum === "kaydedildi" ? "text-brass" : "text-red"
          }`}
        >
          {durum === "kaydedildi" ? "Kaydedildi, site güncellendi." : durum}
        </p>
      )}
    </li>
  );
}
