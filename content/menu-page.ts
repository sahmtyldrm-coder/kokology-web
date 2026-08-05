import { business } from "@/content/tr";

/**
 * /menu sayfasının kendi metinleri.
 *
 * Ana sayfadan ayrı bir sayfa olmasının sebebi ticari: tek sayfalık site tek
 * arama hedefine oynar. "bursa kokoreç fiyatları", "ataevler kokoreç menü"
 * gibi sorgular için kendi başlığı ve açıklaması olan ikinci bir giriş kapısı
 * gerekiyor. Metinler ana sayfanınkini tekrar etmez — kopya içerik sayılmasın.
 */
export const menuPage = {
  title: "Menü ve Fiyatlar — Bursa Nilüfer Kokoreç Fiyatları",
  description:
    "Kokology güncel menü ve fiyat listesi. Çeyrek kokoreç 200 ₺'den başlıyor; köfte, sucuk, midye dolma, pilav ve içecekler. Ataevler, Nilüfer / Bursa.",
  breadcrumb: "Menü",

  eyebrow: "Menü",
  h1: "Kokology menü ve fiyatları",
  lead: `Ataevler'deki ocağımızdan çıkan her şey ve güncel fiyatları. Kokoreç çeyrekten tama, köfte ekmek arası ya da porsiyon. Fiyatlar ${business.address.town} şubemiz içindir.`,

  printedHeading: "Basılı menü",
  printedLead:
    "Masadaki menünün kendisi. Old Master illüstrasyonları markanın kendi tasarımı.",

  backToHome: "Ana sayfaya dön",
  qrNote:
    "Masadan QR okuttuysanız aradığınız yer burası — liste her zaman güncel.",
};
