import Link from "next/link";
import { GirisFormu } from "@/components/yonetim/GirisFormu";
import { sunucuIstemcisi, supabaseHazir } from "@/lib/supabase";
import { menuGetir, saatlerGetir, ayarlarGetir } from "@/lib/veri";

export const dynamic = "force-dynamic";

export default async function YonetimAnasayfa() {
  if (!supabaseHazir) {
    return (
      <div className="flex min-h-screen items-center justify-center px-5">
        <p className="max-w-md font-sans text-base text-bone/70">
          Supabase ayarları eksik. <code>.env.local</code> dosyasına{" "}
          <code>NEXT_PUBLIC_SUPABASE_URL</code> ve{" "}
          <code>NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY</code> ekle.
        </p>
      </div>
    );
  }

  const db = await sunucuIstemcisi();
  const {
    data: { user },
  } = await db.auth.getUser();

  if (!user) return <GirisFormu />;

  const [bolumler, saatler, ayarlar] = await Promise.all([
    menuGetir(),
    saatlerGetir(),
    ayarlarGetir(),
  ]);

  const urunSayisi = bolumler.reduce((t, b) => t + b.items.length, 0);
  const siparis = (ayarlar.siparis ?? {}) as Record<string, string>;
  const aktifPlatform = Object.values(siparis).filter(Boolean).length;
  const site = (ayarlar.site ?? {}) as Record<string, string>;
  const alanAdiHazir = !String(site.siteUrl ?? "").includes("kokology.com.tr");

  return (
    <>
      <h1 className="font-display text-3xl tracking-tight text-bone sm:text-4xl">
        Özet
      </h1>
      <p className="mt-2 font-sans text-sm text-bone/50">
        Sitede şu an ne var, neresi eksik.
      </p>

      <dl className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Kart baslik="Menü" deger={`${bolumler.length} kategori`} alt={`${urunSayisi} ürün`} href="/yonetim/menu" />
        <Kart
          baslik="Çalışma saatleri"
          deger={`${saatler.filter((s) => !s.kapali).length} gün açık`}
          alt={saatler[0] ? `${saatler[0].opens} – ${saatler[0].closes}` : ""}
          href="/yonetim/saatler"
        />
        <Kart
          baslik="Sipariş platformu"
          deger={aktifPlatform > 0 ? `${aktifPlatform} bağlı` : "Bağlı değil"}
          alt={aktifPlatform > 0 ? 'CTA "Sipariş"' : 'CTA "Ara" olarak duruyor'}
          href="/yonetim/iletisim"
        />
      </dl>

      {/* Yayına engel olan eksikler burada tek yerde görünür */}
      <section className="mt-10">
        <h2 className="font-sans text-xs font-semibold tracking-[0.15em] text-bone/50 uppercase">
          Yayından önce
        </h2>
        <ul className="mt-4 space-y-3">
          <Madde tamam={alanAdiHazir}>
            Alan adı tanımlı
            {!alanAdiHazir && (
              <span className="text-bone/50">
                {" "}
                — QR kodu ve tüm mutlak adresler buna bağlı
              </span>
            )}
          </Madde>
          <Madde tamam={aktifPlatform > 0}>
            Sipariş platformu linkleri
            {aktifPlatform === 0 && (
              <span className="text-bone/50">
                {" "}
                — girilince kırmızı buton otomatik &ldquo;Sipariş&rdquo;e döner
              </span>
            )}
          </Madde>
        </ul>
      </section>
    </>
  );
}

function Kart({
  baslik,
  deger,
  alt,
  href,
}: {
  baslik: string;
  deger: string;
  alt: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="block rounded-sm border border-bone/12 bg-soot/60 p-5 transition-colors hover:border-brass/50"
    >
      <dt className="font-sans text-xs font-semibold tracking-[0.15em] text-bone/45 uppercase">
        {baslik}
      </dt>
      <dd className="mt-3 font-display text-2xl text-bone">{deger}</dd>
      <dd className="mt-1 font-sans text-sm text-bone/50">{alt}</dd>
    </Link>
  );
}

function Madde({
  tamam,
  children,
}: {
  tamam: boolean;
  children: React.ReactNode;
}) {
  return (
    <li className="flex items-start gap-3 font-sans text-base text-bone/80">
      <span
        aria-hidden
        className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
          tamam ? "bg-brass" : "bg-red"
        }`}
      />
      <span>
        {children}
        <span className="sr-only">{tamam ? " — tamam" : " — eksik"}</span>
      </span>
    </li>
  );
}
