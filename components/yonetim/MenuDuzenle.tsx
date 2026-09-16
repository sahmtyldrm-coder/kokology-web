"use client";

import { useState, useTransition } from "react";
import { urunGuncelle, urunEkle, urunSil } from "@/app/yonetim/eylemler";

export type PanelUrun = {
  id: string;
  ad: string;
  fiyat: number | null;
  not_metni: string;
  imza: boolean;
  yayinda: boolean;
  gorsel: string;
  gorsel_alt: string;
};

export type PanelKategori = {
  id: string;
  ad: string;
  /** Ürünün kendi fotoğrafı yoksa sitede bu görünür — önizlemede de öyle. */
  gorsel: string;
  urunler: PanelUrun[];
};

/**
 * Menü düzenleyici.
 *
 * Kaydetme satır satır: bir ürünü değiştirip kaydettiğinde yalnızca o satır
 * gider. Tek büyük "hepsini kaydet" formu, yanlışlıkla bütün menüyü ezme
 * riski taşır ve zam gibi tek satırlık işlerde gereksiz yavaştır.
 */
export function MenuDuzenle({ kategoriler }: { kategoriler: PanelKategori[] }) {
  return (
    <div className="space-y-12">
      {kategoriler.map((k) => (
        <section key={k.id}>
          <h2 className="font-display text-2xl text-brass">{k.ad}</h2>
          <ul className="mt-4 divide-y divide-bone/10 border-y border-bone/10">
            {k.urunler.map((u) => (
              <UrunSatiri key={u.id} urun={u} kategoriGorseli={k.gorsel} />
            ))}
          </ul>
          <YeniUrun kategoriId={k.id} />
        </section>
      ))}
    </div>
  );
}

/* -------------------------------------------------------------------------- */

function UrunSatiri({
  urun,
  kategoriGorseli,
}: {
  urun: PanelUrun;
  kategoriGorseli: string;
}) {
  const [ad, setAd] = useState(urun.ad);
  const [fiyat, setFiyat] = useState(
    urun.fiyat === null ? "" : String(urun.fiyat),
  );
  const [notu, setNotu] = useState(urun.not_metni);
  const [imza, setImza] = useState(urun.imza);
  const [gorsel, setGorsel] = useState(urun.gorsel);
  const [gorselAlt, setGorselAlt] = useState(urun.gorsel_alt);
  /* Veritabanında boş dize "fotoğraf gösterme" demek; NULL ise kalem
     kategorisinin fotoğrafına düşer. Panelde bu ayrımı bu kutu taşıyor. */
  const [fotografsiz, setFotografsiz] = useState(urun.gorsel === "");
  const [durum, setDurum] = useState<"" | "kaydedildi" | string>("");
  const [bekliyor, basla] = useTransition();

  const degisti =
    ad !== urun.ad ||
    fiyat !== (urun.fiyat === null ? "" : String(urun.fiyat)) ||
    notu !== urun.not_metni ||
    imza !== urun.imza ||
    gorsel !== urun.gorsel ||
    gorselAlt !== urun.gorsel_alt ||
    fotografsiz !== (urun.gorsel === "");

  // Sitede bu satırda hangi fotoğrafın görüneceği — kutu boşsa kategorininki,
  // "fotoğrafsız" işaretliyse hiçbiri.
  const onizleme = fotografsiz ? "" : gorsel.trim() || kategoriGorseli;

  function kaydet() {
    setDurum("");
    basla(async () => {
      // Boş fiyat NULL olarak gider: sitede fiyat alanı hiç render edilmez.
      const sayi = fiyat.trim() === "" ? null : Number(fiyat);
      if (sayi !== null && (Number.isNaN(sayi) || sayi < 0)) {
        setDurum("Fiyat geçersiz.");
        return;
      }
      const s = await urunGuncelle(urun.id, {
        ad: ad.trim(),
        fiyat: sayi,
        not_metni: notu.trim(),
        imza,
        /* "fotoğrafsız" → boş dize (hiç gösterme).
           Boş kutu → NULL (kategori fotoğrafına düş). */
        gorsel: fotografsiz ? "" : gorsel.trim() || null,
        gorsel_alt: fotografsiz ? null : gorselAlt.trim() || null,
      });
      setDurum(s.ok ? "kaydedildi" : s.hata);
    });
  }

  function sil() {
    basla(async () => {
      const s = await urunSil(urun.id);
      if (!s.ok) setDurum(s.hata);
    });
  }

  return (
    <li className="grid grid-cols-1 gap-3 py-4 sm:grid-cols-[1fr_7rem_9rem_auto] sm:items-center">
      <input
        value={ad}
        onChange={(e) => setAd(e.target.value)}
        aria-label="Ürün adı"
        className="min-h-[44px] rounded-sm border border-bone/20 bg-soot px-3 font-sans text-base text-bone outline-none focus:border-brass"
      />
      <input
        value={fiyat}
        onChange={(e) => setFiyat(e.target.value)}
        inputMode="decimal"
        placeholder="fiyatsız"
        aria-label="Fiyat"
        className="min-h-[44px] rounded-sm border border-bone/20 bg-soot px-3 text-right font-sans text-base tabular-nums text-bone outline-none focus:border-brass"
      />
      <input
        value={notu}
        onChange={(e) => setNotu(e.target.value)}
        placeholder="not (ör. Uykuluklu)"
        aria-label="Not"
        className="min-h-[44px] rounded-sm border border-bone/20 bg-soot px-3 font-sans text-sm text-bone/80 outline-none focus:border-brass"
      />

      <div className="flex items-center gap-3">
        <label className="flex cursor-pointer items-center gap-2 font-sans text-xs text-bone/60">
          <input
            type="checkbox"
            checked={imza}
            onChange={(e) => setImza(e.target.checked)}
            className="h-4 w-4 accent-[var(--color-brass)]"
          />
          imza
        </label>

        <button
          type="button"
          onClick={kaydet}
          disabled={!degisti || bekliyor}
          className="min-h-[44px] rounded-full bg-brass px-4 font-sans text-sm font-semibold text-charcoal transition-opacity disabled:opacity-30"
        >
          {bekliyor ? "…" : "Kaydet"}
        </button>

        <button
          type="button"
          onClick={sil}
          disabled={bekliyor}
          aria-label={`${urun.ad} ürününü sil`}
          className="min-h-[44px] px-2 font-sans text-sm text-bone/40 transition-colors hover:text-red"
        >
          Sil
        </button>
      </div>

      {/* Fotoğraf satırı — /yonetim/fotograflar'dan kopyalanan adres buraya
          yapıştırılır. Solda sitede görünecek hâlin önizlemesi durur. */}
      <div className="flex items-center gap-3 sm:col-span-4">
        <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-sm border border-bone/15 bg-soot">
          {onizleme ? (
            /* Panel görselleri Supabase Storage'dan da gelebildiği için
               next/image değil düz img: uzak alan adı yapılandırması
               gerektirmesin. */
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={onizleme}
              alt=""
              aria-hidden
              className={`h-full w-full ${
                onizleme.endsWith(".png")
                  ? "object-contain p-1"
                  : "object-cover"
              } ${gorsel.trim() ? "" : "opacity-45"}`}
            />
          ) : (
            <span
              aria-hidden
              className="flex h-full w-full items-center justify-center font-sans text-lg text-bone/25"
            >
              {fotografsiz ? "–" : "⤢"}
            </span>
          )}
        </span>

        <input
          value={fotografsiz ? "" : gorsel}
          onChange={(e) => setGorsel(e.target.value)}
          disabled={fotografsiz}
          placeholder={
            fotografsiz
              ? "bu üründe fotoğraf gösterilmiyor"
              : kategoriGorseli
                ? "fotoğraf adresi — boşsa kategorininki kullanılır"
                : "fotoğraf adresi"
          }
          aria-label={`${urun.ad} fotoğraf adresi`}
          className="min-h-[44px] min-w-0 flex-[2] rounded-sm border border-bone/20 bg-soot px-3 font-sans text-xs text-bone/80 outline-none focus:border-brass disabled:opacity-40"
        />
        <input
          value={fotografsiz ? "" : gorselAlt}
          onChange={(e) => setGorselAlt(e.target.value)}
          disabled={fotografsiz}
          placeholder="fotoğraf açıklaması (görme engelliler + Google)"
          aria-label={`${urun.ad} fotoğraf açıklaması`}
          className="min-h-[44px] min-w-0 flex-[3] rounded-sm border border-bone/20 bg-soot px-3 font-sans text-xs text-bone/80 outline-none focus:border-brass disabled:opacity-40"
        />

        {/* Yanlış fotoğraf, fotoğrafsızlıktan kötüdür: Atom gibi kendine
            özgü ürünlerde kategori fotoğrafına düşmeyi kapatmak gerekiyor. */}
        <label className="flex shrink-0 cursor-pointer items-center gap-2 font-sans text-xs whitespace-nowrap text-bone/60">
          <input
            type="checkbox"
            checked={fotografsiz}
            onChange={(e) => setFotografsiz(e.target.checked)}
            className="h-4 w-4 accent-[var(--color-brass)]"
          />
          fotoğrafsız
        </label>
      </div>

      {durum && (
        <p
          role="status"
          className={`font-sans text-xs sm:col-span-4 ${
            durum === "kaydedildi" ? "text-brass" : "text-red"
          }`}
        >
          {durum === "kaydedildi" ? "Kaydedildi, site güncellendi." : durum}
        </p>
      )}
    </li>
  );
}

/* -------------------------------------------------------------------------- */

function YeniUrun({ kategoriId }: { kategoriId: string }) {
  const [ad, setAd] = useState("");
  const [fiyat, setFiyat] = useState("");
  const [hata, setHata] = useState("");
  const [bekliyor, basla] = useTransition();

  function ekle() {
    if (!ad.trim()) return;
    setHata("");
    basla(async () => {
      const sayi = fiyat.trim() === "" ? null : Number(fiyat);
      const s = await urunEkle(kategoriId, ad.trim(), sayi);
      if (s.ok) {
        setAd("");
        setFiyat("");
      } else {
        setHata(s.hata);
      }
    });
  }

  return (
    <div className="mt-4 flex flex-wrap items-center gap-3">
      <input
        value={ad}
        onChange={(e) => setAd(e.target.value)}
        placeholder="Yeni ürün adı"
        aria-label="Yeni ürün adı"
        className="min-h-[44px] flex-1 rounded-sm border border-dashed border-bone/25 bg-transparent px-3 font-sans text-base text-bone outline-none focus:border-brass"
      />
      <input
        value={fiyat}
        onChange={(e) => setFiyat(e.target.value)}
        placeholder="fiyat"
        inputMode="decimal"
        aria-label="Yeni ürün fiyatı"
        className="min-h-[44px] w-28 rounded-sm border border-dashed border-bone/25 bg-transparent px-3 text-right font-sans text-base tabular-nums text-bone outline-none focus:border-brass"
      />
      <button
        type="button"
        onClick={ekle}
        disabled={!ad.trim() || bekliyor}
        className="min-h-[44px] rounded-full border border-brass/60 px-5 font-sans text-sm font-semibold text-brass transition-opacity disabled:opacity-30"
      >
        {bekliyor ? "…" : "Ekle"}
      </button>
      {hata && <p className="w-full font-sans text-xs text-red">{hata}</p>}
    </div>
  );
}
