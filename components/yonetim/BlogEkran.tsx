"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import {
  blogTohumla,
  yaziDurumDegistir,
  yaziSil,
} from "@/app/yonetim/eylemler";

export type PanelYazi = {
  id: string;
  slug: string;
  baslik: string;
  etiket: string;
  durum: "taslak" | "yayinda";
  yayin_tarihi: string | null;
};

/**
 * Blog listesi ve yayın durumu.
 *
 * Taslak → yayında akışı: yazı hazır olmadan sitede görünmez, sitemap'e
 * girmez ve arama motoru yarım içeriği dizine almaz. Yayından geri almak da
 * tek tık — hatalı bir yazıyı silmeden gizleyebilirsin.
 */
export function BlogEkran({ yazilar }: { yazilar: PanelYazi[] }) {
  const [bekliyor, basla] = useTransition();
  const [mesaj, setMesaj] = useState("");

  if (yazilar.length === 0) {
    return (
      <div className="rounded-sm border border-dashed border-bone/25 p-8">
        <p className="font-sans text-base text-bone/70">
          Veritabanında henüz yazı yok. Site şu an dosyalardaki 7 yazıyı
          gösteriyor; panelden düzenleyebilmek için bir kez aktarman gerekiyor.
        </p>
        <button
          type="button"
          disabled={bekliyor}
          onClick={() =>
            basla(async () => {
              const s = await blogTohumla();
              setMesaj(
                s.ok
                  ? `${s.eklenen ?? 0} yazı aktarıldı.`
                  : `Aktarılamadı: ${s.hata}`,
              );
            })
          }
          className="mt-5 min-h-[48px] rounded-full bg-brass px-6 font-sans text-sm font-semibold text-charcoal transition-opacity disabled:opacity-40"
        >
          {bekliyor ? "Aktarılıyor…" : "Yazıları veritabanına aktar"}
        </button>
        {mesaj && (
          <p role="status" className="mt-3 font-sans text-sm text-brass">
            {mesaj} Sayfayı yenile.
          </p>
        )}
      </div>
    );
  }

  return (
    <ul className="divide-y divide-bone/10 border-y border-bone/10">
      {yazilar.map((y) => (
        <YaziSatiri key={y.id} yazi={y} />
      ))}
    </ul>
  );
}

function YaziSatiri({ yazi }: { yazi: PanelYazi }) {
  const [durum, setDurum] = useState(yazi.durum);
  const [hata, setHata] = useState("");
  const [bekliyor, basla] = useTransition();
  const yayinda = durum === "yayinda";

  return (
    <li className="flex flex-wrap items-center gap-x-5 gap-y-3 py-4">
      <div className="min-w-0 flex-1">
        <p className="truncate font-sans text-base font-medium text-bone">
          {yazi.baslik}
        </p>
        <p className="mt-1 truncate font-sans text-xs text-bone/40">
          /blog/{yazi.slug} · {yazi.etiket}
          {yazi.yayin_tarihi ? ` · ${yazi.yayin_tarihi}` : ""}
        </p>
      </div>

      <span
        className={`rounded-full border px-3 py-1 font-sans text-xs font-medium ${
          yayinda
            ? "border-brass/50 bg-brass/10 text-brass"
            : "border-bone/25 text-bone/50"
        }`}
      >
        {yayinda ? "Yayında" : "Taslak"}
      </span>

      <button
        type="button"
        disabled={bekliyor}
        onClick={() =>
          basla(async () => {
            const yeni = yayinda ? "taslak" : "yayinda";
            const s = await yaziDurumDegistir(yazi.id, yeni);
            if (s.ok) setDurum(yeni);
            else setHata(s.hata);
          })
        }
        className="min-h-[44px] rounded-full border border-bone/25 px-5 font-sans text-sm text-bone/85 transition-colors hover:border-brass hover:text-brass"
      >
        {yayinda ? "Yayından al" : "Yayınla"}
      </button>

      {yayinda && (
        <Link
          href={`/blog/${yazi.slug}`}
          target="_blank"
          className="font-sans text-sm text-bone/45 transition-colors hover:text-brass"
        >
          Gör →
        </Link>
      )}

      <button
        type="button"
        disabled={bekliyor}
        onClick={() => basla(async () => void (await yaziSil(yazi.id)))}
        className="font-sans text-sm text-bone/35 transition-colors hover:text-red"
      >
        Sil
      </button>

      {hata && <p className="w-full font-sans text-xs text-red">{hata}</p>}
    </li>
  );
}
