"use client";

import { useState, useTransition } from "react";
import type { EylemSonuc } from "@/app/yonetim/eylemler";

/**
 * S.S.S. ve yorumlar için ortak düzenleyici.
 *
 * İkisi de aynı şekle sahip: sıralı bir liste, her satırda birkaç metin alanı,
 * satır bazlı kaydetme ve silme. Ayrı iki bileşen yazmak aynı hatayı iki yerde
 * düzeltmek demek olurdu.
 */

export type Alan = {
  ad: string;
  etiket: string;
  cokSatir?: boolean;
  tip?: "metin" | "sayi";
  ipucu?: string;
};

export type Kayit = { id: string } & Record<string, string | number | boolean>;

export function ListeDuzenle({
  kayitlar,
  alanlar,
  guncelle,
  sil,
  ekle,
  ekleEtiketi,
}: {
  kayitlar: Kayit[];
  alanlar: Alan[];
  guncelle: (id: string, degerler: Record<string, string | number>) => Promise<EylemSonuc>;
  sil: (id: string) => Promise<EylemSonuc>;
  ekle: (degerler: Record<string, string>) => Promise<EylemSonuc>;
  ekleEtiketi: string;
}) {
  return (
    <div>
      <ul className="divide-y divide-bone/10 border-y border-bone/10">
        {kayitlar.map((k) => (
          <Satir
            key={k.id}
            kayit={k}
            alanlar={alanlar}
            guncelle={guncelle}
            sil={sil}
          />
        ))}
      </ul>
      <YeniKayit alanlar={alanlar} ekle={ekle} etiket={ekleEtiketi} />
    </div>
  );
}

/* -------------------------------------------------------------------------- */

function Satir({
  kayit,
  alanlar,
  guncelle,
  sil,
}: {
  kayit: Kayit;
  alanlar: Alan[];
  guncelle: (id: string, degerler: Record<string, string | number>) => Promise<EylemSonuc>;
  sil: (id: string) => Promise<EylemSonuc>;
}) {
  const baslangic = Object.fromEntries(
    alanlar.map((a) => [a.ad, String(kayit[a.ad] ?? "")]),
  );
  const [deger, setDeger] = useState(baslangic);
  const [durum, setDurum] = useState("");
  const [bekliyor, basla] = useTransition();

  const degisti = alanlar.some((a) => deger[a.ad] !== baslangic[a.ad]);

  function kaydet() {
    setDurum("");
    basla(async () => {
      const gonderi: Record<string, string | number> = {};
      for (const a of alanlar) {
        gonderi[a.ad] = a.tip === "sayi" ? Number(deger[a.ad]) : deger[a.ad];
      }
      const s = await guncelle(kayit.id, gonderi);
      setDurum(s.ok ? "kaydedildi" : s.hata);
    });
  }

  return (
    <li className="py-5">
      <div className="space-y-3">
        {alanlar.map((a) =>
          a.cokSatir ? (
            <label key={a.ad} className="block">
              <span className="font-sans text-xs font-semibold tracking-[0.12em] text-bone/45 uppercase">
                {a.etiket}
              </span>
              <textarea
                rows={3}
                value={deger[a.ad]}
                onChange={(e) =>
                  setDeger((d) => ({ ...d, [a.ad]: e.target.value }))
                }
                className="mt-2 w-full resize-y rounded-sm border border-bone/20 bg-soot px-3 py-2 font-sans text-base leading-relaxed text-bone outline-none focus:border-brass"
              />
            </label>
          ) : (
            <label key={a.ad} className="block">
              <span className="font-sans text-xs font-semibold tracking-[0.12em] text-bone/45 uppercase">
                {a.etiket}
              </span>
              <input
                value={deger[a.ad]}
                inputMode={a.tip === "sayi" ? "numeric" : undefined}
                onChange={(e) =>
                  setDeger((d) => ({ ...d, [a.ad]: e.target.value }))
                }
                placeholder={a.ipucu}
                className="mt-2 min-h-[44px] w-full rounded-sm border border-bone/20 bg-soot px-3 font-sans text-base text-bone outline-none focus:border-brass"
              />
            </label>
          ),
        )}
      </div>

      <div className="mt-3 flex items-center gap-4">
        <button
          type="button"
          onClick={kaydet}
          disabled={!degisti || bekliyor}
          className="min-h-[44px] rounded-full bg-brass px-5 font-sans text-sm font-semibold text-charcoal transition-opacity disabled:opacity-30"
        >
          {bekliyor ? "…" : "Kaydet"}
        </button>
        <button
          type="button"
          onClick={() => basla(async () => void (await sil(kayit.id)))}
          disabled={bekliyor}
          className="font-sans text-sm text-bone/40 transition-colors hover:text-red"
        >
          Sil
        </button>
        {durum && (
          <p
            role="status"
            className={`font-sans text-xs ${
              durum === "kaydedildi" ? "text-brass" : "text-red"
            }`}
          >
            {durum === "kaydedildi" ? "Kaydedildi, site güncellendi." : durum}
          </p>
        )}
      </div>
    </li>
  );
}

/* -------------------------------------------------------------------------- */

function YeniKayit({
  alanlar,
  ekle,
  etiket,
}: {
  alanlar: Alan[];
  ekle: (degerler: Record<string, string>) => Promise<EylemSonuc>;
  etiket: string;
}) {
  const bos = Object.fromEntries(alanlar.map((a) => [a.ad, ""]));
  const [deger, setDeger] = useState<Record<string, string>>(bos);
  const [hata, setHata] = useState("");
  const [bekliyor, basla] = useTransition();

  const dolu = alanlar.every((a) => deger[a.ad]?.trim());

  return (
    <div className="mt-8 rounded-sm border border-dashed border-bone/25 p-5">
      <h3 className="font-sans text-xs font-semibold tracking-[0.15em] text-bone/50 uppercase">
        {etiket}
      </h3>
      <div className="mt-4 space-y-3">
        {alanlar.map((a) =>
          a.cokSatir ? (
            <textarea
              key={a.ad}
              rows={3}
              placeholder={a.etiket}
              value={deger[a.ad]}
              onChange={(e) => setDeger((d) => ({ ...d, [a.ad]: e.target.value }))}
              className="w-full resize-y rounded-sm border border-bone/20 bg-soot px-3 py-2 font-sans text-base text-bone outline-none focus:border-brass"
            />
          ) : (
            <input
              key={a.ad}
              placeholder={a.ipucu ?? a.etiket}
              value={deger[a.ad]}
              onChange={(e) => setDeger((d) => ({ ...d, [a.ad]: e.target.value }))}
              className="min-h-[44px] w-full rounded-sm border border-bone/20 bg-soot px-3 font-sans text-base text-bone outline-none focus:border-brass"
            />
          ),
        )}
      </div>
      <button
        type="button"
        disabled={!dolu || bekliyor}
        onClick={() =>
          basla(async () => {
            const s = await ekle(deger);
            if (s.ok) setDeger(bos);
            else setHata(s.hata);
          })
        }
        className="mt-4 min-h-[44px] rounded-full border border-brass/60 px-5 font-sans text-sm font-semibold text-brass transition-opacity disabled:opacity-30"
      >
        {bekliyor ? "…" : "Ekle"}
      </button>
      {hata && <p className="mt-2 font-sans text-xs text-red">{hata}</p>}
    </div>
  );
}
