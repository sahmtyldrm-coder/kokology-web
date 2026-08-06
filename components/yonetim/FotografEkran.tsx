"use client";

import Image from "next/image";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { tarayiciIstemcisi } from "@/lib/supabase-tarayici";

export type Dosya = { ad: string; url: string; boyutKb: number; tarih: string };

const KOVA = "gorseller";
const MB = 1024 * 1024;

/**
 * Fotoğraf yönetimi.
 *
 * Liste SUNUCUDA hazırlanıp prop olarak geliyor: ilk boyamada yükleniyor
 * ekranı yok ve etkide setState çağırmak gerekmiyor. Yükleme veya silmeden
 * sonra `router.refresh()` ile sunucudan tazeleniyor.
 *
 * Yükleme doğrudan tarayıcıdan Supabase depolamasına gidiyor — dosya
 * Next.js sunucusuna hiç uğramıyor. Büyük görselleri sunucudan geçirmek
 * gereksiz gecikme ve bellek yükü demek.
 */
export function FotografEkran({ baslangic }: { baslangic: Dosya[] }) {
  const router = useRouter();
  const [hata, setHata] = useState("");
  const [ilerleme, setIlerleme] = useState("");
  const [bekliyor, basla] = useTransition();

  async function yukle(secilen: FileList | null) {
    if (!secilen?.length) return;
    setHata("");
    const db = tarayiciIstemcisi();

    for (const [i, dosya] of Array.from(secilen).entries()) {
      if (dosya.size > 10 * MB) {
        setHata(`${dosya.name} 10 MB sınırını aşıyor.`);
        continue;
      }
      setIlerleme(`${i + 1}/${secilen.length} yükleniyor…`);
      const { error } = await db.storage
        .from(KOVA)
        .upload(seoAdi(dosya.name), dosya, {
          cacheControl: "31536000",
          upsert: false,
        });
      if (error) setHata(`${dosya.name}: ${error.message}`);
    }

    setIlerleme("");
    router.refresh();
  }

  async function sil(ad: string) {
    const { error } = await tarayiciIstemcisi().storage.from(KOVA).remove([ad]);
    if (error) setHata(error.message);
    else router.refresh();
  }

  return (
    <div>
      <label className="block cursor-pointer rounded-sm border border-dashed border-bone/25 p-8 text-center transition-colors hover:border-brass">
        <input
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp,image/avif"
          className="sr-only"
          onChange={(e) => basla(() => void yukle(e.target.files))}
        />
        <span className="font-sans text-base text-bone/80">
          Fotoğraf yüklemek için tıkla
        </span>
        <span className="mt-1 block font-sans text-xs text-bone/40">
          JPG, PNG, WebP veya AVIF · en fazla 10 MB · dosya adı otomatik
          düzeltilir
        </span>
      </label>

      {ilerleme && (
        <p role="status" className="mt-3 font-sans text-sm text-brass">
          {ilerleme}
        </p>
      )}
      {hata && (
        <p role="alert" className="mt-3 font-sans text-sm text-red">
          {hata}
        </p>
      )}

      {baslangic.length === 0 ? (
        <p className="mt-8 font-sans text-sm text-bone/40">
          Henüz yüklenmiş fotoğraf yok. Sitedeki mevcut görseller projede
          duruyor; buradakiler panelden eklenenler.
        </p>
      ) : (
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {baslangic.map((d) => (
            <li
              key={d.ad}
              className="overflow-hidden rounded-sm border border-bone/12 bg-soot/60"
            >
              <div className="relative aspect-[4/3] bg-charcoal">
                <Image
                  src={d.url}
                  alt={d.ad}
                  fill
                  sizes="(min-width: 1024px) 30vw, 45vw"
                  className="object-cover"
                />
              </div>
              <div className="p-3">
                <p className="truncate font-sans text-xs text-bone/70">{d.ad}</p>
                <p className="mt-0.5 font-sans text-xs text-bone/35">
                  {d.boyutKb} KB · {d.tarih}
                </p>
                <div className="mt-2.5 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => void navigator.clipboard.writeText(d.url)}
                    className="font-sans text-xs text-brass transition-opacity hover:opacity-70"
                  >
                    Adresi kopyala
                  </button>
                  <button
                    type="button"
                    disabled={bekliyor}
                    onClick={() => basla(() => void sil(d.ad))}
                    className="font-sans text-xs text-bone/35 transition-colors hover:text-red"
                  >
                    Sil
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */

const TR: Record<string, string> = {
  ç: "c", ğ: "g", ı: "i", ö: "o", ş: "s", ü: "u",
  Ç: "c", Ğ: "g", İ: "i", I: "i", Ö: "o", Ş: "s", Ü: "u",
};

/**
 * "Ekran Resmi 2026.PNG" → "ekran-resmi-2026-a3f9.png"
 *
 * Türkçe karakterler sadeleştirilir: adreste bozuk görünmesinler ve görsel
 * aramada okunabilir olsunlar. Sondaki kısa ek, aynı adlı iki dosyanın
 * birbirinin üzerine yazmasını engeller.
 */
function seoAdi(ad: string): string {
  const nokta = ad.lastIndexOf(".");
  const govde = nokta > 0 ? ad.slice(0, nokta) : ad;
  const uzanti = (nokta > 0 ? ad.slice(nokta + 1) : "jpg").toLowerCase();

  const temiz = govde
    .replace(/[çğıöşüÇĞİIÖŞÜ]/g, (h) => TR[h] ?? h)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);

  const sonek = Math.random().toString(36).slice(2, 6);
  return `${temiz || "gorsel"}-${sonek}.${uzanti}`;
}
