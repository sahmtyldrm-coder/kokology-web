import { redirect } from "next/navigation";
import { sunucuIstemcisi } from "@/lib/supabase";

export const dynamic = "force-dynamic";

const TIP_ETIKET: Record<string, string> = {
  sayfa: "Sayfa görüntüleme",
  ara: "Tıkla-ara",
  yol_tarifi: "Yol tarifi",
  siparis: "Sipariş",
  menu: "Menü",
  qr: "QR menü",
};

const KAYNAK_ETIKET: Record<string, string> = {
  organik: "Arama motoru",
  yapay_zeka: "Yapay zekâ",
  sosyal: "Sosyal medya",
  dogrudan: "Doğrudan",
  diger: "Diğer",
};

/**
 * Bileşenin dışında: React Compiler render sırasında saf olmayan çağrıları
 * (Date.now) uyarı olarak işaretliyor. Sayfa zaten `force-dynamic` ve her
 * istekte yeniden çalışıyor, ama hesabı ayırmak hem uyarıyı kaldırıyor hem
 * niyeti açık ediyor.
 */
function otuzGunOnce(): string {
  return new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
}

export default async function IstatistikYonetim() {
  const db = await sunucuIstemcisi();
  const {
    data: { user },
  } = await db.auth.getUser();
  if (!user) redirect("/yonetim");

  const otuzGun = otuzGunOnce();

  const { data, error } = await db
    .from("olaylar")
    .select("tip, kaynak, kaynak_ad, bot, yol")
    .gte("olusturuldu", otuzGun)
    .limit(50000);

  if (error) {
    return (
      <p className="font-sans text-base text-red">
        Veriler okunamadı: {error.message}
      </p>
    );
  }

  const olaylar = data ?? [];
  const ziyaretci = olaylar.filter((o) => !o.bot);
  const botlar = olaylar.filter((o) => o.bot);

  const say = <T extends string>(liste: { [k: string]: unknown }[], alan: string) =>
    liste.reduce<Record<string, number>>((t, o) => {
      const k = String(o[alan] ?? "") as T;
      if (!k) return t;
      t[k] = (t[k] ?? 0) + 1;
      return t;
    }, {});

  const tipler = say(ziyaretci, "tip");
  const kaynaklar = say(
    ziyaretci.filter((o) => o.tip === "sayfa"),
    "kaynak",
  );
  const yzKaynak = say(
    ziyaretci.filter((o) => o.kaynak === "yapay_zeka"),
    "kaynak_ad",
  );
  const botAdlari = say(botlar, "kaynak_ad");
  const sayfalar = say(
    ziyaretci.filter((o) => o.tip === "sayfa"),
    "yol",
  );

  const bos = olaylar.length === 0;

  return (
    <>
      <h1 className="font-display text-3xl tracking-tight text-bone sm:text-4xl">
        İstatistik
      </h1>
      <p className="mt-2 max-w-[64ch] font-sans text-sm text-bone/50">
        Son 30 gün. Çerez kullanılmıyor, kimlik saklanmıyor — bu sayılar
        kişileri değil olayları sayar.
      </p>

      {bos ? (
        <p className="mt-10 rounded-sm border border-bone/15 bg-soot/60 p-6 font-sans text-base text-bone/60">
          Henüz veri yok. Ölçüm yeni devreye girdi; site ziyaret aldıkça burası
          dolacak.
        </p>
      ) : (
        <div className="mt-10 space-y-12">
          <Blok baslik="Aksiyonlar" veri={tipler} etiketler={TIP_ETIKET} />
          <Blok
            baslik="Ziyaretçi nereden geldi"
            veri={kaynaklar}
            etiketler={KAYNAK_ETIKET}
          />

          <section>
            <h2 className="font-display text-2xl text-brass">
              Yapay zekâ görünürlüğü
            </h2>
            <p className="mt-2 max-w-[64ch] font-sans text-sm text-bone/50">
              İki ayrı şey ölçülüyor ve karıştırılmamalı.
            </p>

            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <div className="rounded-sm border border-bone/12 bg-soot/60 p-5">
                <h3 className="font-sans text-xs font-semibold tracking-[0.15em] text-bone/45 uppercase">
                  Yapay zekâdan gelen ziyaret
                </h3>
                <p className="mt-1 font-sans text-xs text-bone/40">
                  Kullanıcı sordu, cevapta çıktık, tıkladı.
                </p>
                <Liste veri={yzKaynak} bosMesaj="Henüz yok." />
              </div>

              <div className="rounded-sm border border-bone/12 bg-soot/60 p-5">
                <h3 className="font-sans text-xs font-semibold tracking-[0.15em] text-bone/45 uppercase">
                  Yapay zekâ taraması
                </h3>
                <p className="mt-1 font-sans text-xs text-bone/40">
                  Modelin tarayıcısı içeriğimizi çekti. Ziyaret değil.
                </p>
                <Liste veri={botAdlari} bosMesaj="Henüz tarama yok." />
              </div>
            </div>

            <p className="mt-5 max-w-[64ch] rounded-sm border border-bone/12 p-4 font-sans text-xs leading-relaxed text-bone/45">
              <strong className="text-bone/70">Ölçülemeyen:</strong> &ldquo;kaç
              yapay zekâ sorgusunda çıktık&rdquo;. ChatGPT, Gemini ve Perplexity
              sorgu hacmi paylaşmıyor. Bunu vaat eden araçlar tahmin üretiyor.
              Yukarıdaki iki ölçüm gerçek görünürlük eğrisi verir.
            </p>
          </section>

          <Blok baslik="En çok görülen sayfalar" veri={sayfalar} sinir={10} />
        </div>
      )}
    </>
  );
}

function Blok({
  baslik,
  veri,
  etiketler,
  sinir,
}: {
  baslik: string;
  veri: Record<string, number>;
  etiketler?: Record<string, string>;
  sinir?: number;
}) {
  return (
    <section>
      <h2 className="font-display text-2xl text-brass">{baslik}</h2>
      <Liste veri={veri} etiketler={etiketler} sinir={sinir} bosMesaj="Veri yok." />
    </section>
  );
}

function Liste({
  veri,
  etiketler,
  sinir,
  bosMesaj,
}: {
  veri: Record<string, number>;
  etiketler?: Record<string, string>;
  sinir?: number;
  bosMesaj: string;
}) {
  const satirlar = Object.entries(veri)
    .sort((a, b) => b[1] - a[1])
    .slice(0, sinir ?? 20);

  if (satirlar.length === 0) {
    return <p className="mt-3 font-sans text-sm text-bone/40">{bosMesaj}</p>;
  }

  const enBuyuk = satirlar[0][1];

  return (
    <dl className="mt-4 space-y-2.5">
      {satirlar.map(([anahtar, sayi]) => (
        <div key={anahtar} className="flex items-center gap-4">
          <dt className="w-44 shrink-0 truncate font-sans text-sm text-bone/75">
            {etiketler?.[anahtar] ?? anahtar}
          </dt>
          {/* Çubuk oranı en büyük değere göre — göz karşılaştırmayı hızlı yapsın */}
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-bone/10">
            <div
              className="h-full rounded-full bg-brass"
              style={{ width: `${Math.max(4, (sayi / enBuyuk) * 100)}%` }}
            />
          </div>
          <dd className="w-14 shrink-0 text-right font-sans text-sm tabular-nums text-bone">
            {sayi}
          </dd>
        </div>
      ))}
    </dl>
  );
}
