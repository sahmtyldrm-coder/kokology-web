import { menu } from "@/content/tr";

/**
 * MENÜ KATEGORİ SAYFALARI — /menu/[kategori]
 *
 * Her kategori kendi arama hedefine oynar: "bursa kokoreç fiyatları",
 * "nilüfer midye dolma", "ataevler köfte ekmek" gibi sorgular tek bir menü
 * sayfasıyla değil, o ürüne ayrılmış sayfayla kazanılır.
 *
 * KURAL: Fiyat ve porsiyon bilgisi burada TEKRARLANMAZ — tek kaynak
 * `tr.ts` içindeki `menu.sections`. Buradaki metinler yalnızca hikâye,
 * yerel bağlam ve o kategoriye özel sorular.
 *
 * S.S.S. cevapları doğrulanmış bilgiyle sınırlıdır; hikâye metinleri marka
 * anlatısıdır ama ölçülebilir bir iddia (süre, adet, sertifika) içermez.
 */

export type Kategori = {
  /** menu.sections içindeki id ile birebir aynı olmalı */
  slug: string;
  title: string;
  description: string;
  h1: string;
  eyebrow: string;
  lead: string;
  /** Hikâye — 2-3 paragraf, marka sesiyle */
  story: string[];
  /** Bursa/Ataevler bağlamı — yerel aramaların karşılığı */
  local: string;
  image: string;
  alt: string;
  faq: { q: string; a: string }[];
};

export const kategoriler: Kategori[] = [
  {
    slug: "kokorec",
    title: "Bursa Kokoreç Fiyatları — Çeyrek, Yarım, Tam | Kokology Ataevler",
    description:
      "Kokology'de kokoreç fiyatları: çeyrek 200 ₺, yarım 350 ₺, tam 700 ₺. Odun ateşinde çevrilen kokoreç, Ataevler / Nilüfer. Gece 02.00'ye kadar açık.",
    h1: "Bursa'da kokoreç: çeyrekten tama",
    eyebrow: "Kokoreç",
    lead: "Markanın adı buradan geliyor. Ateşte döner, siparişte doğranır, ekmeğin arasına sıcak girer.",
    story: [
      "Kokoreç sabırlı bir iştir. Ateşin uzağında olursa kurur, yakınında olursa yanar; arası bulunacak diye saatlerce çevrilir. Bizde ocak açık, çevirme görünür — ne olduğunu göremediğiniz bir yerden yemek zorunda değilsiniz.",
      "Sipariş verildiği anda tezgâhta doğranır. Kekik ve pul biber o an eklenir, önceden karıştırılıp bekletilmez; baharatın kokusu ekmeğe yeni geçmiş olmalı. Ekmek de sıcak gider, ılık değil.",
      "Çeyrek acıkmışlığa, yarım öğüne, tam paylaşmaya yeter. Porsiyon isterseniz tabakta gelir, ekmeği yanında. Uykuluklu Special Atom ise ayrı bir mesele — onu bilerek isteyen bilir.",
    ],
    local:
      "Bursa'da kokoreç denince akla gelen yerlerin çoğu ya kapanmış ya da ayaküstü bir tezgâh. Nilüfer tarafında oturarak, temiz bir masada ve gece 02.00'ye kadar kokoreç yenebilecek yer sayısı az. Cadde Ataevler'in içindeyiz; otopark ücretsiz, çıkışta kuyruk olsa da hızlı akar.",
    image: "/images/urun/kokology-kokorec-ekmek-arasi-bursa-nilufer-06.jpg",
    alt: "Kokology kokoreç ekmek arası, yanında turşu ve şalgam — Bursa Nilüfer Ataevler",
    faq: [
      {
        q: "Çeyrek, yarım, tam kokoreç ne kadar geliyor?",
        a: "Çeyrek kokoreç 200 ₺, yarım 350 ₺, üç çeyrek 550 ₺, tam kokoreç 700 ₺. Porsiyon kokoreç de 700 ₺ ve tabakta, yanında ekmekle geliyor.",
      },
      {
        q: "Special Atom nedir?",
        a: "Uykuluklu kokoreç. Standart kokorece göre daha zengin ve daha ağır bir tat isteyenler için; 1200 ₺.",
      },
      {
        q: "Pişmiş kokoreç alıp eve götürebilir miyim?",
        a: "Evet. Şişte pişmiş kokoreci dilim dilim ya da kilo hesabıyla satıyoruz.",
      },
    ],
  },
  {
    slug: "kofte",
    title: "Ataevler Köfte Ekmek ve Porsiyon Köfte | Kokology Bursa",
    description:
      "Kokology'de köfte fiyatları: çeyrek 180 ₺, yarım 300 ₺, porsiyon 500 ₺. Elde yoğrulmuş köfte, mangal ateşi. Ataevler / Nilüfer, Bursa.",
    h1: "Mangalda köfte — ekmek arası ya da porsiyon",
    eyebrow: "Köfte",
    lead: "Elde yoğrulur, mangalda pişer. Kömür kokusu tabağa kadar gelir.",
    story: [
      "Köftenin tarifi kısa: et, soğan, baharat, sabır. Uzun olan kısmı ateşi doğru tutmak. Kömür çok harlıysa dışı kabuk bağlar içi çiğ kalır; ölü ateşte de kurur. Aradaki dar aralık ustanın işi.",
      "Ekmek arası isteyenler için közlenmiş domates ve biber yanına gider. Porsiyon tercih ederseniz pilav ve közlemeyle tam bir masa yemeği olur — kokoreç yemeyen arkadaşınız da sofrada aç kalmaz.",
    ],
    local:
      "Nilüfer'de köfte ekmek bulmak zor değil, ama kokoreç ocağının yanında pişeni başka. Ataevler'de öğle arasında hızlı bir şey arayanlar genelde çeyrek köfteyle çıkıyor; akşam oturanlar porsiyon tarafına geçiyor.",
    image: "/images/urun/kokology-kofte-ekmek-arasi-bursa-nilufer-02.jpg",
    alt: "Kokology köfte ekmek arası, közlenmiş biber ile — Ataevler Nilüfer Bursa",
    faq: [
      {
        q: "Köfte porsiyonun yanında ne geliyor?",
        a: "Pilav ve közleme geliyor. Porsiyon köfte 500 ₺.",
      },
      {
        q: "Köfte ekmek kaç para?",
        a: "Çeyrek köfte 180 ₺, yarım köfte 300 ₺.",
      },
    ],
  },
  {
    slug: "sucuk",
    title: "Sucuk Ekmek — Bursa Nilüfer Ataevler | Kokology",
    description:
      "Kokology'de sucuk ekmek: çeyrek 200 ₺, yarım 350 ₺. Kalın kesim sucuk, kızarmış ekmek. Cadde Ataevler, Nilüfer / Bursa.",
    h1: "Sucuk ekmek: kalın kesim, kızarmış ekmek",
    eyebrow: "Sucuk",
    lead: "İnce kesilirse çıtır olur ama tadı kaçar. Biz kalın kesiyoruz.",
    story: [
      "Sucuk ekmeğin tamamı iki karara bakar: kesim kalınlığı ve ekmeğin kızarma derecesi. İnce kesim çabuk pişer, kolaydır, ama sucuğun yağı ekmeğe geçmeden biter. Kalın kesim beklemek ister; karşılığında her lokmada sucuğu ayrı ayrı hissedersiniz.",
      "Ekmek ocağın kenarında kızarır, tost makinesinde değil. Kenarları sertleşir, ortası yumuşak kalır.",
    ],
    local:
      "Ataevler'de kahvaltıdan sonraki ilk acıkma ile akşamüstü arasındaki boşluğu genelde sucuk ekmek dolduruyor. Ayaküstü de alınıyor, oturup şalgamla da yeniyor.",
    image: "/images/urun/kokology-sucuk-ekmek-bursa-nilufer-04.jpg",
    alt: "Kokology sucuk ekmek, kızarmış ekmek arasında kalın kesim sucuk — Nilüfer Bursa",
    faq: [
      {
        q: "Sucuk ekmek fiyatı ne kadar?",
        a: "Çeyrek sucuk 200 ₺, yarım sucuk 350 ₺.",
      },
    ],
  },
  {
    slug: "midye",
    title: "Midye Dolma — Bursa Nilüfer | Adet, 10'lu, Kova | Kokology",
    description:
      "Kokology'de midye dolma: adedi 20 ₺, 10 adet 200 ₺, 50 adetlik kova 1000 ₺. Baharatlı iç pilav, bol limon. Ataevler / Nilüfer, Bursa.",
    h1: "Midye dolma — adetle ya da kovayla",
    eyebrow: "Midye",
    lead: "Tek yenmez. Bunu herkes bilir, biz de buna göre kova yapıyoruz.",
    story: [
      "Midye dolmanın hilesi içindeki pilavda: baharat az olursa tatsız, çok olursa midyenin kendi tadını bastırır. Limon da servis anında sıkılmalı, önceden değil — beklerse pilav sulanır.",
      "Bir tane deneyip bırakan görmedik. Sofrada paylaşılacaksa 50 adetlik kova en makul yol; masada herkesin elinin uzanacağı bir yere konur ve sessizce biter.",
    ],
    local:
      "Bursa'da midye dolma çoğunlukla sahil ilçelerinde ya da gezici tezgâhlarda bulunuyor. Nilüfer'de oturarak, limonu masada sıkarak yiyebileceğiniz bir yer arıyorsanız Ataevler'deyiz.",
    image: "/images/urun/kokology-midye-dolma-bursa-nilufer-04.jpg",
    alt: "Kokology midye dolma tabağı, limon dilimleriyle — Bursa Nilüfer Ataevler",
    faq: [
      {
        q: "Midye dolma kaç para?",
        a: "Adedi 20 ₺. 10 adet 200 ₺, 50 adetlik kova 1000 ₺.",
      },
      {
        q: "Kova kaç kişilik?",
        a: "50 adetlik kova kalabalık masalar için. Üç dört kişilik bir sofrada rahatlıkla paylaşılıyor.",
      },
    ],
  },
  {
    slug: "pilav",
    title: "Tavuklu Pilav, Kokoreçli Pilav, Sporcu Pilav | Kokology Bursa",
    description:
      "Kokology'de pilav çeşitleri: tavuklu pilav 200 ₺, sporcu pilav (300 gr ızgara bonfile) 300 ₺, kokoreçli pilav 400 ₺. Ataevler / Nilüfer, Bursa.",
    h1: "Tereyağlı pilav — üstü size kalmış",
    eyebrow: "Pilav",
    lead: "Öğle arasının en kestirme yolu. Tavuklu, bonfileli ya da üstüne kokoreçli.",
    story: [
      "Pilav sade göründüğü için kolay sanılır. Oysa tereyağının miktarı, pirincin dinlenme süresi ve tuz üçü birden tutmazsa tabak boş döner. Bizde pilav gün içinde tazelenir, sabahtan akşama aynı tencerede beklemez.",
      "Üstüne ne geleceği acıkmanın derecesine bağlı: tavuklu hafif ve hızlı, 300 gramlık ızgara bonfileli Sporcu Pilav doyurucu, kokoreçli ise iki dünyayı tek tabakta buluşturuyor.",
    ],
    local:
      "Ataevler'de öğle arası kısa. Oturup beklemeye vakti olmayanlar genelde pilav tarafına geçiyor; hazır gelir, çabuk yenir, ağır kalmaz.",
    image: "/images/urun/kokology-tavuklu-pilav-bursa-nilufer-01.jpg",
    alt: "Kokology tavuklu pilav porsiyonu — Bursa Nilüfer Ataevler",
    faq: [
      {
        q: "Sporcu Pilav nedir?",
        a: "Tereyağlı pilavın üstüne 300 gram ızgara bonfile. 300 ₺.",
      },
      {
        q: "Kokoreçli pilav var mı?",
        a: "Var. Pilavın üstüne kokoreç, 400 ₺.",
      },
    ],
  },
  {
    slug: "icecekler",
    title: "Ayran, Şalgam, Turşu Suyu ve İçecekler | Kokology Bursa Ataevler",
    description:
      "Kokology içecek fiyatları: Özerihisar ayran 80 ₺, şalgam 100 ₺, turşu suyu 60 ₺, Uludağ gazoz 90 ₺. Ataevler / Nilüfer, Bursa.",
    h1: "Yanında ne içilir?",
    eyebrow: "İçecekler",
    lead: "Kokorecin yanına ne gittiği tartışılır. Bizde üç tarafın da hakkı veriliyor.",
    story: [
      "Ayran ekolü çoğunluktadır: yağı keser, ağzı serinletir, tartışma çıkarmaz. Şalgam ekolü daha azdır ama daha iddialıdır — acılısı kokorecin baharatını yukarı çeker. Turşu suyu ise ikisinin arasında bir yerde durur.",
      "Gazoz tarafı da var. Uludağ'ın sade ve portakallısı, soğuk maden suyu ve klasik kola. Kararı masada verirsiniz.",
    ],
    local:
      "Bursa'da ayran denince akla gelen isimler bellidir; biz Özerihisar ve Sütaş ile gidiyoruz. Uludağ gazoz da yerel refleksin karşılığı — şehrin kendi markası.",
    image: "/images/urun/kokology-sucuk-ekmek-bursa-nilufer-06.jpg",
    alt: "Kokology masasında ayran, şalgam ve gazoz — Bursa Nilüfer Ataevler",
    faq: [
      {
        q: "Kokorecin yanına ne içilir?",
        a: "En çok ayran tercih ediliyor; yağı kestiği için. Acı sevenler şalgam alıyor. Turşu suyu ve Uludağ gazozları da var.",
      },
    ],
  },
];

/** Slug ile kategori bul; menü verisiyle eşleştir. */
export function kategoriBul(slug: string) {
  const kategori = kategoriler.find((k) => k.slug === slug);
  if (!kategori) return null;
  const section = menu.sections.find((s) => s.id === slug);
  if (!section) return null;
  return { kategori, section };
}

export const kategoriSluglari = kategoriler.map((k) => k.slug);
