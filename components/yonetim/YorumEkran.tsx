"use client";

import { ListeDuzenle, type Kayit } from "@/components/yonetim/ListeDuzenle";
import { yorumGuncelle, yorumEkle, yorumSil } from "@/app/yonetim/eylemler";

const ALANLAR = [
  { ad: "yazan", etiket: "Yazan", ipucu: "Google'daki isim" },
  { ad: "puan", etiket: "Puan (1-5)", tip: "sayi" as const, ipucu: "5" },
  { ad: "metin", etiket: "Yorum", cokSatir: true },
  { ad: "tarih", etiket: "Tarih", ipucu: "2026-08-04" },
];

export function YorumEkran({ kayitlar }: { kayitlar: Kayit[] }) {
  return (
    <ListeDuzenle
      kayitlar={kayitlar}
      alanlar={ALANLAR}
      ekleEtiketi="Yeni yorum ekle"
      guncelle={(id, d) =>
        yorumGuncelle(id, {
          yazan: String(d.yazan),
          puan: Number(d.puan),
          metin: String(d.metin),
        })
      }
      sil={yorumSil}
      ekle={(d) => yorumEkle(d.yazan, Number(d.puan), d.metin, d.tarih)}
    />
  );
}
