/**
 * QR menü kodu üretir.
 *
 *   npm run qr
 *
 * Çıktı: public/qr-menu.svg (baskı için, sınırsız büyütülebilir)
 *        public/qr-menu.png (dijital kullanım, 1200px)
 *
 * ÖNEMLİ: Kod alan adını içerir. `content/tr.ts` içindeki `business.siteUrl`
 * gerçek alan adıyla güncellenmeden basılan QR yanlış adrese gider — alan adı
 * netleştikten sonra bu komutu tekrar çalıştırıp masa kartlarını öyle bastır.
 */
import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import QRCode from "qrcode";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

// content/tr.ts TypeScript olduğu için burada tekrar okumak yerine adresi
// düz metin olarak çekiyoruz — script'in derleme adımına ihtiyacı olmasın.
const { readFile } = await import("node:fs/promises");
const content = await readFile(join(root, "content/tr.ts"), "utf8");
const match = content.match(/siteUrl:\s*"([^"]+)"/);

if (!match) {
  console.error("content/tr.ts içinde siteUrl bulunamadı.");
  process.exit(1);
}

const target = `${match[1].replace(/\/$/, "")}/qr`;

const options = {
  errorCorrectionLevel: "M",
  margin: 2,
  color: {
    dark: "#141210", // charcoal
    light: "#EFE7D6", // bone
  },
};

const svg = await QRCode.toString(target, { ...options, type: "svg" });
await writeFile(join(root, "public/qr-menu.svg"), svg, "utf8");

await QRCode.toFile(join(root, "public/qr-menu.png"), target, {
  ...options,
  width: 1200,
});

console.log(`QR üretildi → ${target}`);
console.log("  public/qr-menu.svg  (baskı)");
console.log("  public/qr-menu.png  (dijital)");

if (target.includes("kokology.com.tr")) {
  console.warn(
    "\nUYARI: siteUrl hâlâ varsayılan alan adı. Gerçek alan adı belli olunca\n" +
      "content/tr.ts içinde güncelleyip `npm run qr` komutunu tekrar çalıştır.",
  );
}
