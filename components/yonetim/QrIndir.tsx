"use client";

/**
 * QR indirme düğmeleri.
 *
 * Dosyalar sunucuda hazır üretildi; burada yalnızca tarayıcıya kaydettiriyoruz.
 * SVG için bir Blob oluşturulup adresi kısa süre sonra serbest bırakılıyor —
 * bırakılmazsa sayfa açık kaldıkça bellekte birikir.
 */
export function QrIndir({ svg, png }: { svg: string; png: string }) {
  function svgIndir() {
    const blob = new Blob([svg], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    indir(url, "kokology-qr-menu.svg");
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  return (
    <div className="mt-3 flex flex-wrap gap-3">
      <button
        type="button"
        onClick={svgIndir}
        className="min-h-[48px] rounded-full bg-brass px-6 font-sans text-sm font-semibold text-charcoal"
      >
        SVG indir (baskı)
      </button>
      <button
        type="button"
        onClick={() => indir(png, "kokology-qr-menu.png")}
        className="min-h-[48px] rounded-full border border-bone/25 px-6 font-sans text-sm font-medium text-bone transition-colors hover:border-brass hover:text-brass"
      >
        PNG indir (dijital)
      </button>
    </div>
  );
}

function indir(url: string, ad: string) {
  const a = document.createElement("a");
  a.href = url;
  a.download = ad;
  document.body.appendChild(a);
  a.click();
  a.remove();
}
