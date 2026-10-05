import type { Metadata } from "next";

/**
 * Sayfa başlığı — marka iki kez yazılmasın.
 *
 * Kök düzendeki şablon her başlığın sonuna "| Kokology Bursa Kokoreç"
 * ekliyor. Blog ve kategori başlıklarının çoğu markayı zaten içeriyor
 * (panelden girilen `seo_baslik` dahil); şablon bir kez daha eklediğinde
 * "… | Kokology Bursa | Kokology Bursa Kokoreç" çıkıyor ve başlık Google'da
 * kesiliyordu. Marka geçiyorsa şablon atlanır, geçmiyorsa eklenir.
 */
export function sayfaBasligi(baslik: string): Metadata["title"] {
  return /kokology/i.test(baslik) ? { absolute: baslik } : baslik;
}
