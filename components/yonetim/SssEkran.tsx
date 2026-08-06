"use client";

import { ListeDuzenle, type Kayit } from "@/components/yonetim/ListeDuzenle";
import { sssGuncelle, sssEkle, sssSil } from "@/app/yonetim/eylemler";

const ALANLAR = [
  { ad: "soru", etiket: "Soru", ipucu: "Kokology'de otopark var mı?" },
  { ad: "cevap", etiket: "Cevap", cokSatir: true },
];

export function SssEkran({ kayitlar }: { kayitlar: Kayit[] }) {
  return (
    <ListeDuzenle
      kayitlar={kayitlar}
      alanlar={ALANLAR}
      ekleEtiketi="Yeni soru ekle"
      guncelle={(id, d) =>
        sssGuncelle(id, { soru: String(d.soru), cevap: String(d.cevap) })
      }
      sil={sssSil}
      ekle={(d) => sssEkle(d.soru, d.cevap)}
    />
  );
}
