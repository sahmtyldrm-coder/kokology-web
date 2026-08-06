import { redirect } from "next/navigation";
import { AyarDuzenle } from "@/components/yonetim/AyarDuzenle";
import { sunucuIstemcisi } from "@/lib/supabase";

export const dynamic = "force-dynamic";

const TANIMLAR = [
  {
    anahtar: "telefon",
    etiket: "Telefon",
    aciklama:
      "Tıkla-ara butonları ve Google'a giden yapısal veri buradan besleniyor. Google İşletme Profilindeki numarayla birebir aynı olmalı.",
    alanlar: [
      { ad: "display", etiket: "Görünen", ipucu: "0531 715 11 95" },
      { ad: "e164", etiket: "Arama formatı", ipucu: "+905317151195" },
    ],
  },
  {
    anahtar: "adres",
    etiket: "Adres",
    aciklama:
      "Google İşletme Profiliyle birebir aynı yazılmalı (NAP tutarlılığı). Farklı yazım yerel sıralamayı zayıflatır.",
    alanlar: [
      { ad: "street", etiket: "Cadde ve no", ipucu: "Yılmaz Akkılıç Cd. No:18/A" },
      { ad: "district", etiket: "Mahalle", ipucu: "Ataevler" },
      { ad: "town", etiket: "İlçe", ipucu: "Nilüfer" },
      { ad: "city", etiket: "İl", ipucu: "Bursa" },
      { ad: "postalCode", etiket: "Posta kodu", ipucu: "16140" },
      { ad: "landmark", etiket: "Yer imi", ipucu: "Cadde Ataevler" },
    ],
  },
  {
    anahtar: "siparis",
    etiket: "Sipariş platformları",
    aciklama:
      "İşletme sayfalarının linkleri. İlk link girildiği anda sitedeki kırmızı butonlar otomatik olarak “Ara”dan “Sipariş”e döner. Boşken buton telefonu arar — olmayan bir yere götüren buton koymuyoruz.",
    alanlar: [
      { ad: "yemeksepeti", etiket: "Yemeksepeti", ipucu: "https://..." },
      { ad: "getir", etiket: "Getir Yemek", ipucu: "https://..." },
      { ad: "uberEats", etiket: "Uber Eats", ipucu: "https://..." },
      { ad: "migrosYemek", etiket: "Migros Yemek", ipucu: "https://..." },
      { ad: "trendyolYemek", etiket: "Trendyol Yemek", ipucu: "https://..." },
    ],
  },
  {
    anahtar: "sosyal",
    etiket: "Sosyal medya",
    aciklama: "Boş bırakılan hesap sitede hiç gösterilmez.",
    alanlar: [
      { ad: "instagram", etiket: "Instagram", ipucu: "https://instagram.com/..." },
      { ad: "tiktok", etiket: "TikTok", ipucu: "https://tiktok.com/@..." },
      { ad: "youtube", etiket: "YouTube", ipucu: "https://youtube.com/@..." },
    ],
  },
  {
    anahtar: "site",
    etiket: "Alan adı",
    aciklama:
      "Canonical adresler, Open Graph, sitemap, yapısal veri ve QR kodu bu adresten türüyor. Yayına çıkmadan önce doldurulması zorunlu.",
    alanlar: [
      { ad: "siteUrl", etiket: "Site adresi", ipucu: "https://kokology.com.tr" },
      { ad: "googleName", etiket: "Google İşletme adı" },
      { ad: "legalName", etiket: "Ticari unvan" },
    ],
  },
  {
    anahtar: "qr",
    etiket: "QR menü",
    aciklama:
      "Masadaki kodun gittiği adres. Kampanyada kodu yeniden bastırmadan yönlendirmeyi buradan değiştirebilirsin (ör. /menu/kokorec).",
    alanlar: [
      { ad: "hedefYol", etiket: "Hedef yol", ipucu: "/qr" },
      { ad: "baskiEtiketi", etiket: "Baskı etiketi", ipucu: "Menü için okut" },
    ],
  },
  {
    anahtar: "takip",
    etiket: "Ölçüm kodları",
    aciklama:
      "Boş bırakılan kod için hiçbir etiket sayfaya basılmaz. KVKK çerez onayı Faz D2'de eklenecek; o zamana kadar pixel eklemeyi ertelemek daha güvenli.",
    alanlar: [
      { ad: "ga4", etiket: "Google Analytics 4", ipucu: "G-XXXXXXX" },
      { ad: "gtm", etiket: "Google Tag Manager", ipucu: "GTM-XXXXXXX" },
      { ad: "metaPixel", etiket: "Meta Pixel", ipucu: "1234567890" },
      { ad: "googleAds", etiket: "Google Ads dönüşüm", ipucu: "AW-XXXXXXX" },
      { ad: "searchConsole", etiket: "Search Console doğrulama" },
    ],
  },
];

export default async function IletisimYonetim() {
  const db = await sunucuIstemcisi();
  const {
    data: { user },
  } = await db.auth.getUser();
  if (!user) redirect("/yonetim");

  const { data, error } = await db.from("site_ayarlar").select("anahtar, deger");
  if (error) {
    return (
      <p className="font-sans text-base text-red">
        Ayarlar okunamadı: {error.message}
      </p>
    );
  }

  const degerler = Object.fromEntries(
    (data ?? []).map((a) => [a.anahtar, a.deger as Record<string, string>]),
  );

  return (
    <>
      <h1 className="font-display text-3xl tracking-tight text-bone sm:text-4xl">
        İletişim ve linkler
      </h1>
      <p className="mt-2 max-w-[62ch] font-sans text-sm text-bone/50">
        Buradaki bilgiler hem sitede görünür hem de Google&apos;a yapısal veri
        olarak gider.
      </p>

      <div className="mt-10">
        <AyarDuzenle tanimlar={TANIMLAR} degerler={degerler} />
      </div>
    </>
  );
}
