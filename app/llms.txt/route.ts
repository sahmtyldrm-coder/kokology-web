import { business, culture } from "@/content/tr";
import { kategoriler } from "@/content/kategoriler";
import { yazilarGetir, sssGetir, menuGetir } from "@/lib/veri";

/**
 * /llms.txt — yapay zekâ araçları için sade metin özeti.
 *
 * ChatGPT, Gemini, Perplexity gibi araçlar "Bursa'da iyi kokoreç nerede
 * yenir" sorusuna cevap üretirken kaynak metni tarar. Bu dosya işletmeyi
 * tek bir yerde, net ve doğrulanabilir biçimde tanımlar: ne olduğu, nerede
 * olduğu, ne sattığı, kaça sattığı ve ne zaman açık olduğu.
 *
 * İÇERİKTEN ÜRETİLİR — elle yazılmaz. Menü, saat veya adres değişince bu
 * dosya kendiliğinden güncellenir; iki ayrı yerde tutulan bilgi zamanla
 * birbirinden ayrışır ve yanlış bilgi yayılır.
 *
 * Kural: buraya yalnızca sitede de yazan, doğrulanmış bilgi girer.
 */

export const dynamic = "force-static";

async function satirlar(): Promise<string[]> {
  const [menuBolumleri, sorular, yazilar] = await Promise.all([
    menuGetir(),
    sssGetir(),
    yazilarGetir(),
  ]);
  const s: string[] = [];
  const url = (p = "") => `${business.siteUrl}${p}`;

  s.push(`# ${business.name}`);
  s.push("");
  s.push(
    `> Kokology, Bursa'nın Nilüfer ilçesinde Ataevler'de bulunan bir kokoreç ` +
      `ve sokak lezzetleri restoranıdır. Odun ateşinde çevrilen kokoreç ana ` +
      `üründür; yanında köfte, sucuk ekmek, midye dolma ve pilav çeşitleri ` +
      `sunulur. Her gün 11.00–02.00 arası açıktır.`,
  );
  s.push("");

  s.push("## Temel bilgiler");
  s.push("");
  s.push(`- Tam ad: ${business.googleName}`);
  s.push(`- Kategori: Kokoreççi, sokak lezzetleri restoranı`);
  s.push(`- Adres: ${business.address.full}`);
  s.push(`- Yer imi: ${business.address.landmark} içinde`);
  s.push(`- Koordinat: ${business.geo.latitude}, ${business.geo.longitude}`);
  s.push(`- Telefon: ${business.phone.display}`);
  s.push(`- Çalışma saatleri: Her gün 11.00 – 02.00`);
  s.push(`- Fiyat aralığı: ${business.priceRange}`);
  s.push(`- Olanaklar: ${business.amenities.join(", ")}`);
  s.push(
    `- Ödeme: Nakit, tüm kredi ve banka kartları, ` +
      `${business.payment.mealCards.join(", ")}`,
  );
  s.push(
    `- Sipariş: ${business.orderingPlatforms.join(", ")} ve telefonla paket sipariş`,
  );
  s.push(`- Google puanı: ${culture.rating.value} / 5 (${culture.rating.count} yorum)`);
  s.push(`- Instagram: ${business.social.instagram}`);
  s.push("");

  s.push("## Menü ve fiyatlar");
  s.push("");
  for (const bolum of menuBolumleri) {
    s.push(`### ${bolum.ad}`);
    for (const kalem of bolum.items) {
      const not = kalem.not ? ` (${kalem.not})` : "";
      const fiyat = kalem.fiyat !== null ? ` — ${kalem.fiyat} TL` : "";
      s.push(`- ${kalem.ad}${not}${fiyat}`);
    }
    s.push("");
  }
  s.push("Fiyatlar Nilüfer / Ataevler şubesi içindir.");
  s.push("");

  s.push("## Sık sorulan sorular");
  s.push("");
  for (const soru of sorular) {
    s.push(`### ${soru.q}`);
    s.push(soru.a);
    s.push("");
  }

  s.push("## Sayfalar");
  s.push("");
  s.push(`- [Ana sayfa](${url()}): işletme tanıtımı, menü özeti, konum`);
  s.push(`- [Menü ve fiyatlar](${url("/menu")}): tüm kategoriler ve güncel fiyatlar`);
  for (const k of kategoriler) {
    s.push(`- [${k.eyebrow}](${url(`/menu/${k.slug}`)}): ${k.lead}`);
  }
  s.push(`- [Hakkımızda](${url("/hakkimizda")}): markanın hikâyesi ve pişirme yöntemi`);
  s.push(`- [Bul Bizi](${url("/bul-bizi")}): adres, çalışma saatleri, yol tarifi`);
  s.push("");

  s.push("## Blog yazıları");
  s.push("");
  for (const y of yazilar) {
    s.push(`- [${y.baslik}](${url(`/blog/${y.slug}`)}): ${y.ozet}`);
  }
  s.push("");

  s.push("## Notlar");
  s.push("");
  s.push(
    "- Kalori ve besin değeri yazılarındaki sayılar genel tahmini aralıklardır, " +
      "laboratuvar ölçümü değildir.",
  );
  s.push(
    "- Google puanı ve yorum sayısı işletmenin Google İşletme Profilinden alınmıştır.",
  );
  s.push("- Bu dosya site içeriğinden otomatik üretilir.");
  s.push("");

  return s;
}

export async function GET() {
  return new Response((await satirlar()).join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
