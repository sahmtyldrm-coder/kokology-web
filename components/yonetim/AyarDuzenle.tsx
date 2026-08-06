"use client";

import { useState, useTransition } from "react";
import { ayarGuncelle } from "@/app/yonetim/eylemler";

type Alan = {
  anahtar: string;
  etiket: string;
  aciklama?: string;
  /** Değerin içindeki alanlar — hepsi metin */
  alanlar: { ad: string; etiket: string; ipucu?: string }[];
};

/**
 * Anahtar-değer ayarları düzenler.
 *
 * Değerler jsonb olarak saklandığı için yeni bir alan eklemek şema değişikliği
 * gerektirmiyor; buraya bir satır eklemek yeterli.
 */
export function AyarDuzenle({
  tanimlar,
  degerler,
}: {
  tanimlar: Alan[];
  degerler: Record<string, Record<string, string>>;
}) {
  return (
    <div className="space-y-12">
      {tanimlar.map((t) => (
        <AyarBlogu key={t.anahtar} tanim={t} baslangic={degerler[t.anahtar] ?? {}} />
      ))}
    </div>
  );
}

function AyarBlogu({
  tanim,
  baslangic,
}: {
  tanim: Alan;
  baslangic: Record<string, string>;
}) {
  const [deger, setDeger] = useState<Record<string, string>>(() =>
    Object.fromEntries(tanim.alanlar.map((a) => [a.ad, baslangic[a.ad] ?? ""])),
  );
  const [durum, setDurum] = useState("");
  const [bekliyor, basla] = useTransition();

  const degisti = tanim.alanlar.some(
    (a) => (deger[a.ad] ?? "") !== (baslangic[a.ad] ?? ""),
  );

  function kaydet() {
    setDurum("");
    basla(async () => {
      // Mevcut değeri korumak için üzerine yazıyoruz: tanımda olmayan
      // alanlar (ör. sonradan eklenmiş bir anahtar) silinmesin.
      const s = await ayarGuncelle(tanim.anahtar, { ...baslangic, ...deger });
      setDurum(s.ok ? "kaydedildi" : s.hata);
    });
  }

  return (
    <section>
      <h2 className="font-display text-2xl text-brass">{tanim.etiket}</h2>
      {tanim.aciklama && (
        <p className="mt-1.5 max-w-[62ch] font-sans text-sm text-bone/50">
          {tanim.aciklama}
        </p>
      )}

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {tanim.alanlar.map((a) => (
          <label key={a.ad} className="block">
            <span className="font-sans text-xs font-semibold tracking-[0.12em] text-bone/45 uppercase">
              {a.etiket}
            </span>
            <input
              value={deger[a.ad] ?? ""}
              onChange={(e) =>
                setDeger((d) => ({ ...d, [a.ad]: e.target.value }))
              }
              placeholder={a.ipucu}
              className="mt-2 min-h-[44px] w-full rounded-sm border border-bone/20 bg-soot px-3 font-sans text-base text-bone outline-none focus:border-brass"
            />
          </label>
        ))}
      </div>

      <div className="mt-5 flex items-center gap-4">
        <button
          type="button"
          onClick={kaydet}
          disabled={!degisti || bekliyor}
          className="min-h-[44px] rounded-full bg-brass px-6 font-sans text-sm font-semibold text-charcoal transition-opacity disabled:opacity-30"
        >
          {bekliyor ? "…" : "Kaydet"}
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
    </section>
  );
}
