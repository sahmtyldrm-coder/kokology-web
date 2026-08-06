/**
 * QR menü kodu üretir.
 *
 *   npm run qr
 *
 * Çıktı: public/qr-menu.svg   baskı için — sınırsız büyütülebilir
 *        public/qr-menu.png   dijital kullanım, 1200px
 *
 * Hedef adres `content/tr.ts` içindeki `business.siteUrl` + `business.qr.hedefYol`
 * birleşiminden gelir. Hedefi değiştirdikten sonra bu komutu tekrar çalıştır;
 * masadaki kartlar yeniden bastırılmalı.
 *
 * ÖNEMLİ: `siteUrl` gerçek alan adıyla güncellenmeden basılan QR yanlış
 * adrese gider. Script bunu tespit edip uyarır.
 */
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import QRCode from "qrcode";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

// content/tr.ts TypeScript olduğu için derlemeden düz metin olarak okunuyor —
// script'in bir derleme adımına ihtiyacı olmasın.
const content = await readFile(join(root, "content/tr.ts"), "utf8");

const siteUrl = content.match(/siteUrl:\s*"([^"]+)"/)?.[1];
const hedefYol = content.match(/hedefYol:\s*"([^"]+)"/)?.[1] ?? "/qr";

if (!siteUrl) {
  console.error("content/tr.ts içinde siteUrl bulunamadı.");
  process.exit(1);
}

const target = `${siteUrl.replace(/\/$/, "")}${hedefYol}`;

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

if (siteUrl.includes("kokology.com.tr")) {
  console.warn(
    "\nUYARI: siteUrl hâlâ varsayılan alan adı.\n" +
      "Gerçek alan adı belli olunca content/tr.ts içinde güncelleyip\n" +
      "`npm run qr` komutunu tekrar çalıştır. Bu hâliyle BASTIRMA.",
  );
}
