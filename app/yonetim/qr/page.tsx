import { redirect } from "next/navigation";
import Link from "next/link";
import QRCode from "qrcode";
import { sunucuIstemcisi } from "@/lib/supabase";
import { ayarlarGetir } from "@/lib/veri";
import { business } from "@/content/tr";
import { QrIndir } from "@/components/yonetim/QrIndir";

export const dynamic = "force-dynamic";

/** Marka renkleriyle; baskıda da ekranda da aynı görünsün. */
const SECENEKLER = {
  errorCorrectionLevel: "M" as const,
  margin: 2,
  color: { dark: "#141210", light: "#EFE7D6" },
};

export default async function QrYonetim() {
  const db = await sunucuIstemcisi();
  const {
    data: { user },
  } = await db.auth.getUser();
  if (!user) redirect("/yonetim");

  const ayarlar = await ayarlarGetir();
  const site = (ayarlar.site ?? {}) as Record<string, string>;
  const qr = (ayarlar.qr ?? {}) as Record<string, string>;

  const siteUrl = site.siteUrl || business.siteUrl;
  const hedefYol = qr.hedefYol || "/qr";
  const hedef = `${siteUrl.replace(/\/$/, "")}${hedefYol}`;
  const alanAdiHazir = !siteUrl.includes("kokology.com.tr");

  // Kod sunucuda üretiliyor: tarayıcıya ek paket indirmeye gerek yok.
  const svg = await QRCode.toString(hedef, { ...SECENEKLER, type: "svg" });
  const png = await QRCode.toDataURL(hedef, { ...SECENEKLER, width: 1200 });

  return (
    <>
      <h1 className="font-display text-3xl tracking-tight text-bone sm:text-4xl">
        QR menü
      </h1>
      <p className="mt-2 max-w-[64ch] font-sans text-sm text-bone/50">
        Masalardaki karta basılan kod. Hedef adresi{" "}
        <Link href="/yonetim/iletisim" className="text-brass underline underline-offset-4">
          İletişim ve linkler
        </Link>{" "}
        ekranından değiştirebilirsin — kampanya döneminde kodu yeniden
        bastırmadan yönlendirmeyi çevirebilmek için ayrı tutuldu.
      </p>

      {!alanAdiHazir && (
        <div className="mt-8 rounded-sm border border-red/50 bg-red/10 p-5">
          <p className="font-sans text-sm leading-relaxed text-bone">
            <strong>Bu kodu bastırma.</strong> Alan adı hâlâ varsayılan
            (<code className="text-brass">{siteUrl}</code>). Gerçek alan adını
            girip bu sayfayı yenile, kod kendiliğinden güncellenir.
          </p>
        </div>
      )}

      <div className="mt-10 grid gap-10 md:grid-cols-[auto_1fr] md:items-start">
        <div
          className="w-64 rounded-sm bg-bone p-4"
          // Kod SVG olarak gömülü: her boyutta net, baskıda bozulmaz.
          dangerouslySetInnerHTML={{ __html: svg }}
        />

        <div>
          <h2 className="font-sans text-xs font-semibold tracking-[0.15em] text-bone/45 uppercase">
            Hedef adres
          </h2>
          <p className="mt-2 font-sans text-base break-all text-bone">{hedef}</p>

          <h2 className="mt-8 font-sans text-xs font-semibold tracking-[0.15em] text-bone/45 uppercase">
            İndir
          </h2>
          <QrIndir svg={svg} png={png} />

          <p className="mt-6 max-w-[52ch] font-sans text-xs leading-relaxed text-bone/45">
            Baskı için <strong className="text-bone/70">SVG</strong> kullan —
            vektörel olduğu için masa kartında da afişte de net çıkar. PNG
            dijital paylaşım içindir.
          </p>
        </div>
      </div>
    </>
  );
}
