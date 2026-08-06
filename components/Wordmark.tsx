import Image from "next/image";
import { business } from "@/content/tr";  // yalnızca marka adı — panelden değişmiyor

/**
 * Marka lockup'ı: orijinal rozet + Anton wordmark.
 *
 * Dükkân cephesindeki düzenin aynısı — rozet solda, isim sağda. Rozetin
 * içindeki "KOKOLOGY" küçük puntoda okunmadığı için isim ayrıca yazılır.
 *
 * Kaynak `public/logo-kokology.png`, markanın vektör PDF'inden (kokology.pdf)
 * alfa kanalı korunarak üretildi; şeffaf ve 900px genişliğinde.
 */
const LOGO_SRC = "/logo-kokology.png";
const LOGO_RATIO = 900 / 767; // genişlik / yükseklik

export function Wordmark({
  className = "",
  /** Rozet yüksekliği (px). Metin boyutu `className` ile ayarlanır. */
  badgeSize = 34,
  showName = true,
}: {
  className?: string;
  badgeSize?: number;
  showName?: boolean;
}) {
  return (
    <span
      className={`inline-flex items-center gap-2.5 ${className}`}
      aria-label={business.name}
      role="img"
    >
      <Image
        src={LOGO_SRC}
        alt=""
        aria-hidden
        width={Math.round(badgeSize * LOGO_RATIO)}
        height={badgeSize}
        priority
        className="w-auto shrink-0"
        style={{ height: badgeSize }}
      />
      {showName && (
        <span className="font-display leading-none tracking-tight" aria-hidden>
          {business.name}
        </span>
      )}
    </span>
  );
}
