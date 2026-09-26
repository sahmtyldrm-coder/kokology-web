import { menu as varsayilanMenu } from "@/content/tr";
import type { MenuBolum } from "@/lib/veri";

/**
 * Metin içindeki `{Ürün Adı}` yer tutucularını menüdeki fiyatla doldurur:
 * "Çeyrek {Çeyrek Kokoreç}" → "Çeyrek 230 ₺".
 *
 * Kategori sayfalarının açıklama ve S.S.S. metinleri fiyat söylemek zorunda
 * (arama sonucunda görünen şey o), ama fiyatın tek kaynağı menü. Rakamı elle
 * yazınca menü panelden güncellenir, metin eskide kalır — 2026-09'da tam
 * olarak bu oldu. Yer tutucu bu kopukluğu kapatır.
 *
 * Arama önce `bolumId` kategorisinde yapılır ("Adet" gibi genel adlar
 * yalnızca kendi kategorisinde anlamlı), sonra tüm menüde, en son dosyadaki
 * varsayılan menüde. Hiçbirinde yoksa hata fırlatır: yanlış yazılmış bir ad
 * sessizce "{...}" olarak yayına çıkmasın, derleme dursun.
 */
export function fiyatDoldur(
  metin: string,
  bolumler: MenuBolum[],
  bolumId?: string,
): string {
  return metin.replace(/\{([^{}]+)\}/g, (_, ham: string) => {
    const ad = ham.trim();
    const fiyat = fiyatBul(ad, bolumler, bolumId);
    if (fiyat === null) {
      throw new Error(`fiyatDoldur: menüde "${ad}" adlı fiyatlı ürün yok`);
    }
    return `${fiyat.toLocaleString("tr-TR")} ₺`;
  });
}

function fiyatBul(
  ad: string,
  bolumler: MenuBolum[],
  bolumId?: string,
): number | null {
  // Panelde ada parantezli açıklama eklenebiliyor ("Yarım Atom (Uykuluklu
  // Kokoreç)"); yer tutucu parantezsiz adla da eşleşsin.
  const hedef = ad.toLocaleLowerCase("tr-TR");
  const esit = (x: string) => {
    const aday = x.trim().toLocaleLowerCase("tr-TR");
    return aday === hedef || aday.startsWith(`${hedef} (`);
  };

  const kendi = bolumler.find((b) => b.id === bolumId);
  const adaylar = [
    ...(kendi?.items ?? []),
    ...bolumler.flatMap((b) => b.items),
  ];
  const canli = adaylar.find((u) => esit(u.ad) && u.fiyat !== null);
  if (canli) return canli.fiyat;

  const yedek = varsayilanMenu.sections
    .flatMap((s): { name: string; price: number | null }[] => s.items)
    .find((i) => esit(i.name) && i.price !== null);
  return yedek?.price ?? null;
}
