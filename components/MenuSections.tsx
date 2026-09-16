import Image from "next/image";
import Link from "next/link";
import { menuGetir, type MenuBolum } from "@/lib/veri";
import { FotoGaleri, type GaleriFoto } from "@/components/FotoGaleri";

/**
 * Şişe/kutu fotoğrafları (içecekler) fon olmadan, PNG olarak kesilmiştir:
 * kırpılmadan, tam görünmeleri gerekir. Yemek fotoğrafları ise kadraja
 * oturan JPEG kareler — küçük kutuda `cover` daha iştah açıcı durur.
 */
function kesimSinifi(src: string): string {
  return src.endsWith(".png") ? "object-contain p-1.5" : "object-cover";
}

/** Galerideki sıra menüdeki sıradır; anahtar kategori + ürün adı. */
function fotoAnahtari(bolumId: string, urunAdi: string): string {
  return `${bolumId}::${urunAdi}`;
}

/**
 * Kalemin gösterilecek fotoğrafı: kendi fotoğrafı, yoksa kategorisininki.
 *
 * Bu düşüş yalnızca fotoğraflı menüde geçerli — `lib/veri.ts` katmanında
 * yapılsaydı ana sayfa ve kategori sayfalarındaki fotoğrafsız listelere de
 * sızardı. Pratik faydası: panelden fotoğrafsız yeni bir ürün eklendiğinde
 * satır boş kalmaz, kategorinin fotoğrafıyla dolar.
 */
function urunFotografi(bolum: MenuBolum, urun: MenuBolum["items"][number]) {
  // Boş dize "fotoğraf gösterme" demek; kategorininkine DÜŞMEZ. Ayrımı
  // koruyabilmek için burada `||` değil açık bir null kontrolü var.
  if (urun.gorsel === "") return null;

  const src = urun.gorsel ?? bolum.gorsel;
  if (!src) return null;
  const kendi = Boolean(urun.gorsel);
  return {
    src,
    alt:
      (kendi ? urun.alt : bolum.alt) ??
      `${urun.ad} — Kokology Bursa Nilüfer Ataevler`,
  };
}

/**
 * Menüde göründükleri sırayla fotoğraflı kalemleri toplar.
 * Galeri bu diziyi kullanır — oklarla bütün menü gezilebilir.
 */
function galeriKur(sections: MenuBolum[]) {
  const fotograflar: GaleriFoto[] = [];
  const sira = new Map<string, number>();

  for (const bolum of sections) {
    for (const urun of bolum.items) {
      const foto = urunFotografi(bolum, urun);
      if (!foto) continue;
      sira.set(fotoAnahtari(bolum.id, urun.ad), fotograflar.length);
      fotograflar.push({
        src: foto.src,
        alt: foto.alt,
        ad: urun.ad,
        fiyat: urun.fiyat,
        not: urun.not,
        bolum: bolum.ad,
      });
    }
  }

  return { fotograflar, sira };
}

/**
 * Basılı menünün tam dökümü — kategori başlıkları ve noktalı fiyat satırları.
 *
 * Üç yerde kullanılır: ana sayfadaki Izgara bölümü, /menu sayfası ve QR menü.
 * Başlık seviyesi dışarıdan verilir; her sayfada H1→H2→H3 hiyerarşisi
 * bozulmasın diye.
 */
export async function MenuSections({
  headingLevel = "h3",
  columns = 2,
  className = "",
  only,
  linkToCategory = false,
  sectionImages = false,
  urunGorselleri = false,
}: {
  headingLevel?: "h2" | "h3";
  columns?: 1 | 2;
  className?: string;
  /** Tek kategori göster — kategori sayfalarında kullanılır */
  only?: string;
  /** Başlıkları /menu/[kategori] sayfalarına bağla */
  linkToCategory?: boolean;
  /** Başlığın yanında kategori fotoğrafı göster — QR menüde metnin yanına
   * yalnızca bir görsel eklemek için (porsiyon başına değil, kategori başına). */
  sectionImages?: boolean;
  /** Her ürün satırına fotoğraf koy; tıklanınca tam ekran galeri açılsın.
   * Fotoğrafı olmayan kalem kendi kategorisinin fotoğrafını kullanır
   * (bkz. `lib/veri.ts`), yani satırlar hiçbir zaman boş kalmaz. */
  urunGorselleri?: boolean;
}) {
  const Heading = headingLevel;
  // Menü artık veritabanından geliyor; erişilemezse lib/veri.ts
  // content/tr.ts'e düşüyor ve site kesintisiz çalışmaya devam ediyor.
  const tum = await menuGetir();
  const sections = only ? tum.filter((s) => s.id === only) : tum;
  const { fotograflar, sira } = urunGorselleri
    ? galeriKur(sections)
    : { fotograflar: [], sira: new Map<string, number>() };

  const liste = (
    <div
      className={`grid gap-x-14 gap-y-14 ${
        columns === 2 ? "md:grid-cols-2" : ""
      } ${className}`}
    >
      {sections.map((section) => (
        <section
          key={section.id}
          id={`menu-${section.id}`}
          className="scroll-mt-24"
        >
          <div className="flex items-center gap-4">
            {sectionImages && section.gorsel && (
              <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full bg-soot">
                <Image
                  src={section.gorsel}
                  alt=""
                  aria-hidden
                  fill
                  sizes="56px"
                  className="object-cover"
                />
              </span>
            )}
            <Heading className="font-display text-2xl text-brass sm:text-3xl">
              {linkToCategory ? (
                <Link
                  href={`/menu/${section.id}`}
                  className="transition-colors hover:text-bone"
                >
                  {section.ad}
                </Link>
              ) : (
                section.ad
              )}
            </Heading>
            <span aria-hidden className="rule-brass h-px flex-1 border-t" />
            {linkToCategory && (
              <Link
                href={`/menu/${section.id}`}
                className="shrink-0 font-sans text-xs text-bone/45 transition-colors hover:text-brass"
                aria-label={`${section.ad} kategorisinin sayfasına git`}
              >
                detay →
              </Link>
            )}
          </div>

          <dl className="mt-5">
            {section.items.map((item) => {
              const fotoIndex = sira.get(fotoAnahtari(section.id, item.ad));
              const foto = urunGorselleri ? urunFotografi(section, item) : null;

              return (
                <div
                  key={item.ad}
                  /* Fotoğraflı satırda hizalama dikey ortadan; fotoğrafsız
                     satırda ad ve fiyat basılı menüdeki gibi aynı taban
                     çizgisinde durur. */
                  className={`flex gap-3 border-b border-bone/8 py-3 last:border-b-0 ${
                    urunGorselleri ? "items-center" : "items-baseline"
                  }`}
                >
                  {/* Fotoğraflı menü: satırın solunda küçük görsel. Kutu 3:2 —
                      fotoğrafların çekim oranı bu, kare kutu tabağı kırpıp
                      masayı gösteriyordu. Buton çünkü tıklanabilir:
                      klavyeyle de açılmalı. */}
                  {foto && fotoIndex !== undefined ? (
                    <button
                      type="button"
                      data-foto={fotoIndex}
                      aria-label={`${item.ad} fotoğrafını büyüt`}
                      className="group relative h-16 w-24 shrink-0 cursor-zoom-in overflow-hidden rounded-sm border border-bone/10 bg-soot transition-colors hover:border-brass/60 sm:h-[4.5rem] sm:w-28"
                    >
                      <Image
                        src={foto.src}
                        alt={foto.alt}
                        fill
                        sizes="112px"
                        className={`transition-transform duration-500 group-hover:scale-105 ${kesimSinifi(foto.src)}`}
                      />
                      {/* Büyüteç ipucu — fotoğrafın tıklanabilir olduğunu söyler */}
                      <span
                        aria-hidden
                        className="absolute right-1 bottom-1 rounded-full bg-charcoal/75 px-1.5 text-[0.6rem] leading-[1.4] text-bone/70 opacity-0 transition-opacity group-hover:opacity-100"
                      >
                        ⤢
                      </span>
                    </button>
                  ) : urunGorselleri ? (
                    /* Fotoğraflı listede fotoğrafı olmayan kalem (ör. Atom):
                       kutu kadar boşluk bırakılır ki ürün adları aynı hizada
                       kalsın — aksi hâlde o satırlar sola kayıp liste bozuk
                       görünürdü. */
                    <span
                      aria-hidden
                      className="h-16 w-24 shrink-0 sm:h-[4.5rem] sm:w-28"
                    />
                  ) : (
                    /* Fotoğrafsız görünüm — ana sayfa ve kategori sayfaları.
                       Burada yalnızca fonsuz kesilmiş şişe/kutu görselleri
                       (PNG) çıkar: metin listesinin yanında ufak bir işaret
                       gibi dururlar. Yemek fotoğrafları (JPEG) bu boyutta
                       tanınmaz; onlar `urunGorselleri` açıkken büyük kutuda
                       gösterilir. */
                    item.gorsel?.endsWith(".png") && (
                      <span className="relative h-11 w-9 shrink-0 self-center">
                        <Image
                          src={item.gorsel}
                          alt={item.alt ?? item.ad}
                          fill
                          sizes="36px"
                          className="object-contain object-bottom"
                        />
                      </span>
                    )
                  )}

                  <dt className="font-sans text-base text-bone">
                    {item.ad}
                    {item.imza && (
                      /* İmza ürünü: menüde göz bunu ilk yakalasın */
                      <span className="ml-2 inline-flex items-center gap-1 rounded-full border border-brass/50 bg-brass/10 px-2 py-0.5 align-middle font-sans text-[0.65rem] font-semibold tracking-[0.12em] text-brass uppercase">
                        İmza
                      </span>
                    )}
                    {item.not && (
                      <span className="ml-2 font-sans text-sm text-bone/45">
                        {item.not}
                      </span>
                    )}
                  </dt>
                  {/* Noktalı dolgu: adı fiyata basılı menüdeki gibi bağlar */}
                  <span
                    aria-hidden
                    className="mb-1 min-w-6 flex-1 border-b border-dotted border-bone/20"
                  />
                  {item.fiyat !== null && (
                    <dd className="shrink-0 font-sans text-base font-semibold tabular-nums text-bone">
                      {item.fiyat}
                      <span className="ml-0.5 text-brass">₺</span>
                    </dd>
                  )}
                </div>
              );
            })}
          </dl>
        </section>
      ))}
    </div>
  );

  if (!urunGorselleri || fotograflar.length === 0) return liste;

  return <FotoGaleri fotograflar={fotograflar}>{liste}</FotoGaleri>;
}
