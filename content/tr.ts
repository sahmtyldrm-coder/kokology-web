/**
 * KOKOLOGY — Türkçe içerik kaynağı (tek doğruluk noktası)
 *
 * Sitedeki HER metin buradan gelir. Bileşenlerde hardcode metin yoktur.
 * Faz 2'de `content/en.ts` aynı şekli uygulayarak eklenir.
 *
 * ┌─ DOLDURULMASI GEREKENLER ────────────────────────────────────────────┐
 * │ Aşağıda `TODO:` ile işaretli alanlar gerçek veriyle değiştirilmeli.  │
 * │ business.phone / address / geo / hours → yerel SEO'nun temeli.       │
 * │ Google İşletme Profili ile BİREBİR aynı olmalı (NAP tutarlılığı).    │
 * └──────────────────────────────────────────────────────────────────────┘
 */

export const business = {
  /** Sitede görünen kısa ad */
  name: "Kokology",
  /**
   * Google İşletme Profilindeki başlığın birebir kendisi. NAP tutarlılığı için
   * schema.org'a bu yazılır; sitede görünen ad kısa `name` alanıdır.
   * Profil başlığı sadeleştirilirse burayı da güncelle.
   */
  googleName: "Kokology Ataevler | Kokoreç & Street Food",
  /** Resmi ticari unvan — işletmeden teyitli */
  legalName: "Kokology",
  tagline: "Street Grill Culture",
  secondaryTagline: "Old Turkish Delicious",

  phone: {
    display: "0531 715 11 95",
    e164: "+905317151195",
  },

  address: {
    street: "Yılmaz Akkılıç Cd. No:18/A",
    district: "Ataevler",
    town: "Nilüfer",
    city: "Bursa",
    postalCode: "16140",
    country: "TR",
    /** Tek satır gösterim — footer ve harita altı */
    full: "Yılmaz Akkılıç Cd. No:18/A, Ataevler, 16140 Nilüfer / Bursa",
    /** Tabelasız tarif için yer imi; adresin parçası değil */
    landmark: "Cadde Ataevler",
  },

  geo: {
    latitude: 40.2206,
    longitude: 28.96009,
  },

  /**
   * Bağlantılar Google Maps yer kimliğinden (CID 6399837262169871067,
   * hex 0x58d0ca1507f192db) üretildi — paylaşım linkindeki uzun `data=!4m2...`
   * parametresi zamanla bozulabildiği için kalıcı biçim tercih edildi.
   */
  maps: {
    directionsUrl:
      "https://www.google.com/maps/dir/?api=1&destination=40.2206%2C28.96009",
    placeUrl: "https://maps.google.com/?cid=6399837262169871067",
    /**
     * Anahtarsız gömme, koordinatla. Adres metniyle arama denendi ama Google
     * caddenin yanlış noktasına düşürüyordu; koordinat kesin sonuç veriyor.
     */
    embedUrl:
      "https://maps.google.com/maps?q=40.2206,28.96009&z=18&hl=tr&output=embed",
  },

  /**
   * Haftanın günleri: 0 = Pazar ... 6 = Cumartesi
   * "Şu an açık" rozeti ve schema.org openingHoursSpecification bundan üretilir.
   *
   * Her gün 11.00 – 02.00, işletmeden teyitli. Kapanış gece yarısını aştığı
   * için ertesi güne taşan vardiya olarak hesaplanır (bkz. lib/hours.ts).
   */
  hours: [
    { day: 1, label: "Pazartesi", opens: "11:00", closes: "02:00" },
    { day: 2, label: "Salı", opens: "11:00", closes: "02:00" },
    { day: 3, label: "Çarşamba", opens: "11:00", closes: "02:00" },
    { day: 4, label: "Perşembe", opens: "11:00", closes: "02:00" },
    { day: 5, label: "Cuma", opens: "11:00", closes: "02:00" },
    { day: 6, label: "Cumartesi", opens: "11:00", closes: "02:00" },
    { day: 0, label: "Pazar", opens: "11:00", closes: "02:00" },
  ],

  priceRange: "₺₺",
  servesCuisine: ["Turkish", "Street food", "Grill"],

  /**
   * Google İşletme Profilindeki "Hizmet seçenekleri" + işletmeden teyitli
   * ücretsiz otopark. Bul Bizi'de rozet, schema'da `amenityFeature` olur.
   */
  amenities: [
    "Ücretsiz otopark",
    "Kapalı otopark",
    "Açık hava bölümü",
    "Wi-Fi",
    "Oyun alanı",
  ],

  /** Boş bırakılanlar sitede hiç gösterilmez. */
  social: {
    instagram: "https://www.instagram.com/kokologybursa",
    tiktok: "",
    youtube: "",
  },

  /**
   * Sipariş platformları — işletme hepsinde aktif.
   *
   * TODO: Her platformdaki İŞLETME SAYFASININ linkini gir. Link girildiği anda
   * kırmızı CTA otomatik "Ara"dan "Sipariş"e döner (lib/schema.ts →
   * primaryAction) ve butonlar o adrese gider. Linkler boşken CTA "Ara"
   * kalır — olmayan bir yere götüren buton koymamak için.
   */
  ordering: {
    yemeksepeti: "",
    getir: "",
    uberEats: "",
    migrosYemek: "",
    trendyolYemek: "",
  },

  /** Sipariş alınan platformların görünen adları — S.S.S. metninde kullanılır */
  orderingPlatforms: [
    "Yemeksepeti",
    "Getir Yemek",
    "Uber Eats",
    "Migros Yemek",
    "Trendyol Yemek",
  ],

  /** Ödeme — işletmeden teyitli */
  payment: {
    cards: "Tüm kredi ve banka kartları",
    mealCards: [
      "Sodexo",
      "Multinet",
      "Ticket",
      "Setcard",
      "Metropol",
      "Edenred",
    ],
  },

  /**
   * TODO: alan adı alınınca burayı güncelle. Canonical, Open Graph, sitemap ve
   * JSON-LD'deki tüm mutlak adresler buradan türüyor — yayından önce şart.
   */
  siteUrl: "https://kokology.com.tr",
} as const;

/* ========================================================================== */

/**
 * Kimlik sırası önemli: burası önce bir KOKOREÇÇİ, sonra sokak lezzetleri
 * mekânı. Başlık, açıklama ve anahtar kelimeler bu sıraya göre kurulur —
 * "kokoreç" ana terim, "sokak lezzetleri" ikincil.
 */
export const seo = {
  title: "Kokology — Bursa Nilüfer Kokoreççi | Ataevler Kokoreç & Sokak Lezzetleri",
  titleTemplate: "%s | Kokology Bursa Kokoreç",
  description:
    "Ataevler'de kokoreççi. Odun ateşinde çevrilen kokoreç, yanında köfte, sucuk, midye dolma ve pilav. Gece 02.00'ye kadar açık. Yılmaz Akkılıç Cd., Nilüfer / Bursa.",
  keywords: [
    "kokoreç Bursa",
    "Bursa kokoreççi",
    "Nilüfer kokoreç",
    "Ataevler kokoreç",
    "Cadde Ataevler kokoreççi",
    "Bursa kokoreç fiyatları",
    "gece açık kokoreççi Bursa",
    "sokak lezzetleri Bursa",
    "midye dolma Nilüfer",
    "köfte ekmek Ataevler",
  ],
  ogImageAlt:
    "Kokology Bursa Nilüfer Ataevler kokoreççi dükkânının dış cephesi ve tabelası",
};

/* ========================================================================== */

export const nav = {
  brandHome: "Kokology ana sayfa",
  openMenu: "Menüyü aç",
  closeMenu: "Menüyü kapat",
  /**
   * "Menü" ilk sırada: gelen ziyaretçinin ilk sorusu bu.
   * Rota bağlantıları (/) ile sayfa içi çapalar (#) karışık olabilir;
   * Nav bileşeni hangisinin next/link, hangisinin <a> olacağını kendi seçer.
   */
  links: [
    { href: "/menu", label: "Menü" },
    { href: "/hakkimizda", label: "Hakkımızda" },
    { href: "#mekan", label: "Mekân" },
    { href: "#kultur", label: "Kültür" },
    { href: "#sss", label: "S.S.S." },
    { href: "/bul-bizi", label: "Bul Bizi" },
  ],
  cta: {
    order: "Sipariş",
    call: "Ara",
    directions: "Yol Tarifi",
    menu: "Menüyü Gör",
  },
  scrollHint: "Aşağı kaydır",
};

/* ========================================================================== */

export const hero = {
  /**
   * H1 — marka + kategori + konum. Sayfanın tek H1'i ve SEO'nun en önemli
   * satırı. Kategori "kokoreççi": mekânın birincil kimliği bu.
   *
   * Hero görselinde marka wordmark'ı zaten büyük ve el yazmasıyla yer aldığı
   * için marka adı Anton ile ikinci kez BÜYÜK yazılmıyor — aynı kelime iki
   * farklı karakterle iki kez görünürdü. Marka adı H1 içinde daha küçük
   * duruyor, görsel ağırlığı anahtar görsel taşıyor.
   */
  h1: {
    brand: "Kokology",
    line: "Bursa Nilüfer'de kokoreççi ve sokak lezzetleri",
  },
  witty: "Sokağın en eski lezzeti. En yeni hali.",
  eyebrow: "Cadde Ataevler · Nilüfer / Bursa",
  image: {
    src: "/images/mekan/kokology-bursa-nilufer-kokorec-leonardo-da-vinci-marka-gorseli.jpg",
    alt: "Kokology marka görseli: Leonardo da Vinci elinde kokoreç ekmek arası tutuyor, önündeki masada şişte pişmiş kokoreç — Bursa Nilüfer Ataevler kokoreççisi",
  },

  /** Güven satırı — karar veren bilgiler tek bakışta (CRO) */
  trust: [
    { icon: "star", text: "5,0 Google puanı" },
    { icon: "pin", text: "Ataevler / Nilüfer" },
    { icon: "parking", text: "Ücretsiz otopark" },
  ],
};

/* ========================================================================== */

export const manifesto = {
  eyebrow: "Fikir",
  heading: "Kokoreç bir yemek değil, bir kültürdür.",
  lead: "Ateş, ekmek ve kalabalık. Bu üçü bir araya geldiğinde ortaya çıkan şeyin adı fast food değil — sokak lezzeti. Biz onu daha temiz bir tezgâha taşıdık; tadını değil, sadece ortamını değiştirdik.",
  columns: [
    {
      title: "Miras",
      body: "Tarif dededen kaldı, kısayol aramadık. Kokoreç aynı kokoreç; sadece daha iyi bakılıyor.",
    },
    {
      title: "Ocak",
      body: "Açık mutfak, sürekli sıcaklık, tek standart. Şansa bırakılan hiçbir şey yok.",
    },
    {
      title: "Sokak",
      body: "Ayaküstü de olur, oturarak da. Acele edene de yer var, üç saat kalana da.",
    },
  ],
};

/* ========================================================================== */

/**
 * MENÜ — basılı menüden birebir alındı (5 Ağustos 2026 tarihli baskı).
 *
 * `price` opsiyoneldir; `null` bırakılan satırda fiyat render edilmez ve
 * JSON-LD'ye `offers` yazılmaz. Fiyat güncellemesi yalnızca burayı ilgilendirir.
 */
export const menu = {
  eyebrow: "Izgara",
  heading: "Ateşten çıkanlar",
  lead: "Hepsi ocakta, önünüzde pişer. Çeyrekten tama, ekmek arası ya da porsiyon — kararı siz verin.",
  /** Ana sayfadan /menu sayfasına giden bağlantının etiketi */
  pageLabel: "Menünün tamamı",
  allMenuLabel: "Basılı menüyü gör",
  /** Basılı menünün iki yüzü — orijinal tasarım, Old Master illüstrasyonlarıyla */
  printed: [
    {
      src: "/images/menu/kokology-menu-on-bursa-nilufer.jpg",
      alt: "Kokology basılı menüsünün ön yüzü — kokoreç, köfte, sucuk, midye ve pilav fiyatları",
      label: "Ön yüz — yemekler",
    },
    {
      src: "/images/menu/kokology-menu-arka-icecekler.jpg",
      alt: "Kokology basılı menüsünün arka yüzü — içecek fiyatları",
      label: "Arka yüz — içecekler",
    },
  ],
  currency: "TRY",
  priceNote: "Fiyatlar ₺ cinsindendir.",

  /** Görselli, iştah açan üç imza kategori — menünün üstünde büyük gösterilir */
  featured: [
    {
      id: "kokorec",
      name: "Kokoreç",
      description:
        "Odun ateşinde döndürülür, kekik ve pul biberle sıcak ekmeğin arasına girer. Çeyrekten tama.",
      image: "/images/urun/kokology-kokorec-ekmek-arasi-bursa-nilufer-06.jpg",
      alt: "Kokology kokoreç ekmek arası, yanında turşu ve şalgam",
    },
    {
      id: "kofte",
      name: "Köfte",
      description:
        "Elde yoğrulur, mangalda pişer. Ekmek arası ya da pilav ve közlemeyle porsiyon.",
      image: "/images/urun/kokology-kofte-ekmek-arasi-bursa-nilufer-02.jpg",
      alt: "Kokology köfte ekmek arası, közlenmiş biber ile",
    },
    {
      id: "pilav",
      name: "Pilav",
      description:
        "Tereyağlı pilav; tavuklu, bonfileli ya da üstüne kokoreçli. Öğle arasının kestirme yolu.",
      image: "/images/urun/kokology-tavuklu-pilav-bursa-nilufer-01.jpg",
      alt: "Kokology tavuklu pilav porsiyonu",
    },
  ],

  /** Basılı menünün tam dökümü */
  sections: [
    {
      id: "kokorec",
      name: "Kokoreç",
      image: "/images/urun/kokology-kokorec-porsiyon-bursa-nilufer-06.jpg",
      alt: "Kokology kokoreç porsiyon tabağı",
      items: [
        { name: "Çeyrek Kokoreç", price: 200 as number | null, note: "" },
        { name: "Yarım Kokoreç", price: 350 as number | null, note: "" },
        { name: "Üç Çeyrek Kokoreç", price: 550 as number | null, note: "" },
        { name: "Tam Kokoreç", price: 700 as number | null, note: "" },
        { name: "Porsiyon Kokoreç", price: 700 as number | null, note: "" },
        {
          name: "Special Atom",
          price: 1200 as number | null,
          note: "Uykuluklu",
          /** Markanın imza ürünü — menüde ayrıca işaretlenir */
          signature: true,
        },
      ],
    },
    {
      id: "kofte",
      name: "Köfte",
      image: "/images/urun/kokology-kofte-porsiyon-bursa-nilufer-03.jpg",
      alt: "Kokology köfte porsiyon tabağı, pilav ve közleme ile",
      items: [
        { name: "Çeyrek Köfte", price: 180 as number | null, note: "" },
        { name: "Yarım Köfte", price: 300 as number | null, note: "" },
        { name: "Porsiyon Köfte", price: 500 as number | null, note: "" },
      ],
    },
    {
      id: "sucuk",
      name: "Sucuk",
      image: "/images/urun/kokology-sucuk-ekmek-bursa-nilufer-04.jpg",
      alt: "Kokology sucuk ekmek, kızarmış ekmek arasında",
      items: [
        { name: "Çeyrek Sucuk", price: 200 as number | null, note: "" },
        { name: "Yarım Sucuk", price: 350 as number | null, note: "" },
      ],
    },
    {
      id: "midye",
      name: "Midye",
      image: "/images/urun/kokology-midye-dolma-bursa-nilufer-04.jpg",
      alt: "Kokology midye dolma tabağı, limon dilimleri ile",
      items: [
        { name: "Adet", price: 20 as number | null, note: "" },
        { name: "10 Adet", price: 200 as number | null, note: "" },
        { name: "50 Adet Kova", price: 1000 as number | null, note: "" },
      ],
    },
    {
      id: "pilav",
      name: "Pilav",
      image: "/images/urun/kokology-pilav-ustu-kokorec-bursa-nilufer-05.jpg",
      alt: "Kokology pilav üstü kokoreç porsiyonu",
      items: [
        { name: "Tavuklu Pilav", price: 200 as number | null, note: "" },
        { name: "Sporcu Pilav", price: 300 as number | null, note: "300 gr ızgara bonfile" },
        { name: "Kokoreçli Pilav", price: 400 as number | null, note: "" },
      ],
    },
    {
      id: "icecekler",
      name: "İçecekler",
      image: "",
      alt: "",
      items: [
        { name: "Özerihisar Ayran", price: 80 as number | null, note: "" },
        { name: "Sütaş Ayran", price: 50 as number | null, note: "" },
        { name: "Turşu Suyu", price: 60 as number | null, note: "" },
        { name: "Şalgam", price: 100 as number | null, note: "" },
        { name: "Coca Cola", price: 100 as number | null, note: "" },
        { name: "Uludağ Premium Su", price: 30 as number | null, note: "" },
        { name: "Uludağ Gazoz", price: 90 as number | null, note: "" },
        { name: "Uludağ Portakallı", price: 90 as number | null, note: "" },
        { name: "Uludağ Maden Suyu", price: 40 as number | null, note: "" },
        { name: "Uludağ Minarelli Su", price: 80 as number | null, note: "" },
      ],
    },
  ],
};

/* ========================================================================== */

export const space = {
  eyebrow: "Mekân",
  heading: "İçerisi de ateşe göre kurulmuş.",
  lead: "Yeşil sedirler, tuğla zemin, pirinç detaylar ve duvarda bir Old Master. Ayaküstü alıp gidin ya da oturun — ikisi de doğru cevap.",
  takeaway: "TAKE-OUT",
  gallery: [
    {
      src: "/images/mekan/kokology-sedir-oturma-alani-kokorecci-nilufer.jpg",
      alt: "Kokology iç mekânında yeşil kapitone sedirler ve duvardaki Old Master duvar resmi",
      span: "wide",
    },
    {
      src: "/images/mekan/kokology-kokorec-ocagi-mangal-bursa-nilufer.jpg",
      alt: "Kokology'de kokoreç ocağı ve mangal",
      span: "tall",
    },
    {
      src: "/images/mekan/kokology-pencere-kenari-oturma-bursa-kokorec.jpg",
      alt: "Kokology'de pencere kenarı oturma alanı",
      span: "normal",
    },
    {
      src: "/images/mekan/kokology-kokorec-pisirme-acik-mutfak-bursa.jpg",
      alt: "Kokology açık mutfağında kokoreç pişirme anı",
      span: "normal",
    },
    {
      src: "/images/mekan/kokology-ic-mekan-duvar-resmi-bursa-kokorecci.jpg",
      alt: "Kokology iç mekânında duvar resmi ve oturma düzeni",
      span: "tall",
    },
    {
      src: "/images/mekan/kokology-masa-sandalye-oturma-alani-bursa.jpg",
      alt: "Kokology'de ahşap masalar ve thonet sandalyeler",
      span: "normal",
    },
    {
      src: "/images/mekan/kokology-restoran-ic-mekan-bursa-ataevler.jpg",
      alt: "Kokology restoran iç mekânı geniş açı",
      span: "wide",
    },
    {
      src: "/images/mekan/kokology-kokorecci-nilufer-ataevler-magaza-girisi.jpg",
      alt: "Kokology Ataevler mağaza girişi",
      span: "normal",
    },
  ],
};

/* ========================================================================== */

export const heritage = {
  eyebrow: "Old Turkish Delicious",
  heading: "Bu tarif İstanbul'dan geldi, Bursa'da kaldı.",
  body: "Kokoreç bir icat değil, bir aktarım. Vapur iskelelerinden, maç çıkışlarından, gece yarısı kuyruklarından geçerek buraya kadar geldi. Biz sadece sırayı bozmadık.",
  pullquote: "İyi yemek. İyi keyif. İyi insanlar.",
  image: {
    src: "/images/mekan/kokology-ic-tasarim-duvar-resmi-bursa-kokorec.jpg",
    alt: "Kokology duvarındaki Old Master tarzı sofra resmi",
  },
};

/* ========================================================================== */

export const culture = {
  eyebrow: "Kültür",
  heading: "Ses duvarı",
  /** Witty tek satırlar — Caveat ile, az ve seyrek */
  lines: [
    "Ateş yalan söylemez.",
    "Ekmek sıcaksa gerisi teferruat.",
    "Acele edene de yer var.",
  ],
  /**
   * Google İşletme Profilinden alınan GERÇEK yorumlar (5 Ağustos 2026).
   * Metinler kısaltılmadan, yazıldığı gibi.
   */
  reviews: [
    {
      author: "Ömür Aras",
      rating: 5,
      body: "Gerçekten uzun zamandır yediğim en iyi Kokoreç. Güleryüzlü personeli ve verilen hizmet harika. Ellerinize sağlık. Özellikle ve sıklıkla tavsiye edeceğim mekandır.",
      date: "2026-08-04",
    },
    {
      author: "Feray ATAK",
      rating: 5,
      body: "Kokoreç tek kelimeyle efsaneydi, tam kıvamında, lezzeti yerindeydi. Uzun zamandır bu kadar iyisini yememiştim. Özerhisar ayran da yanında öyle güzel gitmiş ki lezzeti iyice tamamlamıştı. Mutlaka tavsiye ederim.",
      date: "2026-08-04",
    },
    {
      author: "Tuğçe DAĞ",
      rating: 5,
      body: "Yeni açılmış, denemeye geldik. Çalışanlar çok güler yüzlü ve çok temiz. Açık alanları olması çok güzel. Midye ve kokoreç denedik, lezzetleri 10 numaraydı. Ellerine sağlık, tavsiye edilir.",
      date: "2026-08-03",
    },
    {
      author: "Pati Veteriner Muayenehanesi",
      rating: 5,
      body: "Kaliteli bir mekan. Çalışanlar tecrübeli ve hızlı. Çok fazla kokoreç yemeyen bir kişi olarak gömdüm, midyeler de ayrı güzeldi. Hayırlı olsun.",
      date: "2026-08-03",
    },
    {
      author: "Hüseyin B.",
      rating: 5,
      body: "Bu kadar lezzetli kokoreç yemedim, güler yüz ve hızlı hizmet için teşekkür ederiz.",
      date: "2026-08-03",
    },
    {
      author: "selçuk umur",
      rating: 5,
      body: "Gerçekten harika bir lezzet, şiddetle tavsiye ederim. Bursa'mıza hayırlı olsun.",
      date: "2026-08-04",
    },
  ] as Array<{
    author: string;
    rating: number;
    body: string;
    date: string;
  }>,

  /**
   * Google'daki toplam puan. Sitede gösterilen altı yorumdan değil, profilin
   * tamamından geldiği için ayrı tutulur — altı yorumun ortalamasını "20 yorum"
   * diye sunmak yanlış olurdu.
   */
  rating: {
    value: 5.0,
    count: 20,
    source: "Google",
    label: "Google'da 20 yorum",
  },
  instagram: {
    label: "Instagram'da takip et",
    handle: "@kokologybursa",
  },
};

/* ========================================================================== */

export const findUs = {
  eyebrow: "Kapı",
  heading: "Bul bizi",
  lead: "Otopark ücretsiz, gece ikiye kadar ocak yanıyor. Ayaküstü de olur, oturarak da.",
  addressLabel: "Adres",
  hoursLabel: "Çalışma saatleri",
  phoneLabel: "Telefon",
  openNow: "Şu an açık",
  closedNow: "Şu an kapalı",
  opensAt: (t: string) => `${t}'te açılıyor`,
  closesAt: (t: string) => `${t}'e kadar açık`,
  mapTitle: "Kokology konumu — Cadde Ataevler, Nilüfer / Bursa",
  callCta: "Hemen ara",
  directionsCta: "Yol tarifi al",
  orderCta: "Sipariş ver",
  image: {
    src: "/images/mekan/cadde-ataevler-avm-kokology-bursa-nilufer-konum.jpg",
    alt: "Cadde Ataevler AVM dış görünümü — Kokology'nin bulunduğu konum",
  },
};

/* ========================================================================== */

/* ========================================================================== */

/**
 * SIK SORULAN SORULAR
 *
 * Yerel aramada ve yapay zekâ cevaplarında en çok işe yarayan bölüm: insanlar
 * Google'a ve sohbet botlarına tam olarak bu cümleleri yazıyor. FAQPage
 * yapısal verisi buradan üretilir (lib/schema.ts).
 *
 * KURAL: Buraya yalnızca DOĞRULANMIŞ bilgi yazılır. Yapay zekâlar bu cevapları
 * birebir alıntılıyor; tahmin yazmak yanlış bilginin yayılması demek.
 *
 * Cevaplar 6 Ağustos 2026'da işletmeden birebir teyit edildi.
 */
export const faq = {
  eyebrow: "Merak edilenler",
  heading: "Sık sorulanlar",
  items: [
    {
      q: "Kokology nerede?",
      a: "Bursa'nın Nilüfer ilçesinde, Ataevler'deyiz: Yılmaz Akkılıç Cd. No:18/A, 16140 Nilüfer / Bursa. Cadde Ataevler'in içinde, cam cepheli dükkânız.",
    },
    {
      q: "Kokology kaça kadar açık?",
      a: "Her gün gece 02.00'ye kadar açığız. Ocak kapanış saatine kadar yanıyor.",
    },
    {
      q: "Kokoreç fiyatları ne kadar?",
      a: "Çeyrek kokoreç 200 ₺, yarım 350 ₺, üç çeyrek 550 ₺, tam kokoreç ve porsiyon kokoreç 700 ₺. Uykuluklu Special Atom 1200 ₺. Güncel liste menü sayfamızda.",
    },
    {
      q: "Kokoreç dışında neler var?",
      a: "Köfte (çeyrek, yarım, porsiyon), sucuk ekmek, midye dolma, tavuklu pilav, kokoreçli pilav ve 300 gramlık ızgara bonfileli Sporcu Pilav. İçecek tarafında ayran, şalgam, turşu suyu ve Uludağ gazozları.",
    },
    {
      q: "Oturacak yer var mı, ayaküstü de alınıyor mu?",
      a: "İkisi de var. İçeride sedirli oturma alanı ve açık hava bölümü bulunuyor; acelesi olan ayaküstü alıp gidebiliyor.",
    },
    {
      q: "Kokology'de otopark var mı?",
      a: "Var ve ücretsiz. Hem açık hem kapalı otopark kullanabilirsiniz.",
    },
    {
      q: "Mekânda Wi-Fi ve çocuklar için oyun alanı var mı?",
      a: "Evet, ücretsiz Wi-Fi ve çocuklar için oyun alanı var. Açık hava bölümü de mevcut.",
    },
    {
      q: "Kokology'ye nasıl sipariş verilir?",
      a: "Online yemek platformlarından sipariş edebilirsiniz: Yemeksepeti, Getir Yemek, Uber Eats, Migros Yemek ve Trendyol Yemek. Doğrudan 0531 715 11 95 numarasını arayarak da paket sipariş verebilirsiniz.",
    },
    {
      q: "Paket servis var mı?",
      a: "Var. Online yemek platformlarından ya da bizi arayarak paket sipariş verebilirsiniz. Gelip ayaküstü alıp gitmek de mümkün.",
    },
    {
      q: "Pişmiş şiş kokoreç satıyor musunuz?",
      a: "Evet. Şişte pişmiş kokoreci dilim dilim ya da kilo hesabıyla satıyoruz. Eve götürüp kendi sofranızda tüketmek isteyenler için ideal.",
    },
    {
      q: "Hangi ödeme yöntemleri geçerli?",
      a: "Nakit, tüm kredi ve banka kartları geçerli. Yemek kartlarından Sodexo, Multinet, Ticket, Setcard, Metropol ve Edenred kullanabilirsiniz.",
    },
    {
      q: "Rezervasyon gerekiyor mu?",
      a: "Normal ziyaretlerde gerekmez, gelip oturabilirsiniz. Kalabalık grup ve topluluk etkinlikleri için önceden aramanızı tavsiye ederiz: 0531 715 11 95.",
    },
  ],
};

/* ========================================================================== */

export const footer = {
  wordmark: "Kokology",
  tagline: "Street Grill Culture",
  newsletter: {
    heading: "Yeni bir şey çıkarsa haber veririz.",
    placeholder: "E-posta adresin",
    submit: "Kaydol",
    /** TODO: Faz 2'de gerçek liste servisi bağlanacak (şimdilik form gizli) */
    enabled: false,
    success: "Kaydın alındı.",
    error: "Bir şeyler ters gitti. Tekrar dene.",
  },
  exploreLabel: "Bölümler",
  socialLabel: "Sosyal medya",
  copyright: (year: number) => `© ${year} Kokology. Tüm hakları saklıdır.`,
  credit: "",
};

/* ========================================================================== */

export const a11y = {
  skipToContent: "İçeriğe geç",
  mainLandmark: "Ana içerik",
  galleryLabel: "Mekân fotoğraf galerisi",
  menuLabel: "Menü öne çıkanlar",
};
