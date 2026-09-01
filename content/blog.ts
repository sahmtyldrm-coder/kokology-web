/**
 * BLOG — /blog ve /blog/[slug]
 *
 * Amaç ikili: (1) Google'da "kokoreç nedir", "bursa'da kokoreç nerede yenir"
 * gibi gerçek aramalara cevap vermek, (2) yapay zekâ araçlarının alıntılayacağı
 * net, doğrulanabilir metin üretmek.
 *
 * KURAL — ölçülebilir iddia yok:
 * Kalori ve besin değeri gibi sayılar YAYGIN OLARAK BİLİNEN GENEL aralıklardır,
 * Kokology'nin laboratuvar ölçümü değildir. Metinde bu açıkça yazılıdır.
 * Kesin değer isteniyorsa ürünün analizi yaptırılmalı; o zaman bu yazı
 * gerçek verilerle güncellenir.
 *
 * Faz D'de yazılar admin panelinden girilecek; bu dosya varsayılan içerik olarak
 * kalır ve veri modelinin şeklini belirler.
 */

export type Blok =
  | { tip: "paragraf"; metin: string }
  | { tip: "baslik"; metin: string }
  | { tip: "liste"; ogeler: string[] }
  | { tip: "alinti"; metin: string }
  | { tip: "not"; metin: string };

export type Yazi = {
  slug: string;
  title: string;
  description: string;
  h1: string;
  /** Liste kartında görünen kısa tanıtım */
  ozet: string;
  /** ISO tarih — Article schema datePublished */
  tarih: string;
  guncelleme?: string;
  etiket: string;
  okumaDakika: number;
  image: string;
  alt: string;
  bloklar: Blok[];
  /** Menü veya kategori sayfalarına iç bağlantılar */
  ilgili: { href: string; label: string }[];
};

export const yazilar: Yazi[] = [
  {
    slug: "kokorec-nedir-nasil-yapilir",
    title: "Kokoreç Nedir, Nasıl Yapılır? | Kokology Bursa",
    description:
      "Kokoreç nedir, neyden yapılır, nasıl pişirilir? Şişe sarımından ateş yönetimine, baharatından ekmeğine kadar kokorecin bütün aşamaları.",
    h1: "Kokoreç nedir, nasıl yapılır?",
    ozet:
      "Neyden yapıldığı, nasıl sarıldığı, ateşin neden en zor kısım olduğu ve iyi kokoreci kötüsünden ayıran şey.",
    tarih: "2026-08-06",
    etiket: "Temel bilgi",
    okumaDakika: 4,
    image: "/images/mekan/kokology-kokorec-pisirme-acik-mutfak-bursa.jpg",
    alt: "Kokology açık mutfağında kokoreç pişirme anı — Bursa Nilüfer Ataevler",
    bloklar: [
      {
        tip: "paragraf",
        metin:
          "Kokoreç, kuzu bağırsağının şişe sarılıp odun veya kömür ateşinde çevrilerek pişirilmesiyle yapılan bir sokak lezzetidir. Türkiye'nin en çok tüketilen, en az konuşulan yemeklerinden biri: herkes bilir, kimse tarifini sormaz.",
      },
      { tip: "baslik", metin: "Neyden yapılır?" },
      {
        tip: "paragraf",
        metin:
          "Temel malzeme kuzu bağırsağıdır. İç kısma genellikle kuzu iç organları (böbrek, yürek, akciğer) yerleştirilir ve bağırsak bunların etrafına sıkıca sarılır. Sarım gevşek olursa pişerken dağılır, fazla sıkı olursa içi pişmez.",
      },
      {
        tip: "paragraf",
        metin:
          "Bazı yerlerde uykuluk (timus bezi) eklenir. Uykuluk daha yumuşak, daha zengin bir doku verir ve fiyatı yukarı çeker. Bizde bu ürün Special Atom adıyla ayrı satılıyor.",
      },
      { tip: "baslik", metin: "Nasıl pişirilir?" },
      {
        tip: "paragraf",
        metin:
          "Sarılmış şiş yatay olarak ateşin üstüne yerleştirilir ve saatlerce yavaşça çevrilir. İşin tamamı ateşin yönetilmesine bakar: şiş ateşe fazla yakınsa dış yüzey yanar, iç kısım çiğ kalır; fazla uzaksa kurur ve sertleşir.",
      },
      {
        tip: "paragraf",
        metin:
          "Doğru pişmiş kokorecin dışı karamelize olmuş, kenarları hafif çıtır, içi yumuşaktır. Bu noktaya kestirmeden ulaşmanın yolu yoktur; olsaydı herkes bulurdu.",
      },
      { tip: "baslik", metin: "Servis: doğrama ve baharat" },
      {
        tip: "paragraf",
        metin:
          "Sipariş verildiği anda şişten kesilen parça tezgâhta satırla doğranır. Kekik ve pul biber bu aşamada eklenir. Baharatı önceden karıştırıp beklettiğinizde kokusu uçar; kokorecin ekmeğe girerken taze baharat kokması gerekir.",
      },
      {
        tip: "paragraf",
        metin:
          "Ekmek sıcak olmalıdır, ılık değil. Soğuyan ekmek kokorecin yağını emmez ve lokma dağılır.",
      },
      { tip: "baslik", metin: "İyi kokoreci ne ayırır?" },
      {
        tip: "liste",
        ogeler: [
          "Ateşin görünür olması — ne pişirdiğini saklamayan tezgâh",
          "Sipariş anında doğranması, önceden hazırlanıp bekletilmemesi",
          "Baharatın servis anında eklenmesi",
          "Ekmeğin sıcak gitmesi",
          "Temizliğin göz önünde olması",
        ],
      },
      {
        tip: "alinti",
        metin: "Kokoreç sabırlı bir iştir. Kestirme yolu yoktur.",
      },
    ],
    ilgili: [
      { href: "/menu/kokorec", label: "Kokoreç fiyatları" },
      { href: "/hakkimizda", label: "Nasıl pişiriyoruz?" },
    ],
  },

  {
    slug: "ceyrek-yarim-tam-kokorec-ne-demek",
    title: "Çeyrek, Yarım, Tam Kokoreç Ne Demek? | Kokology Bursa",
    description:
      "Kokoreç siparişinde çeyrek, yarım, üç çeyrek ve tam ne anlama geliyor? Hangi porsiyon kaç kişilik, ekmek arası ile porsiyon farkı nedir?",
    h1: "Çeyrek, yarım, tam kokoreç ne demek?",
    ozet:
      "İlk kez sipariş verenlerin en çok takıldığı yer. Hangi porsiyon ne kadar, ekmek arası mı porsiyon mu?",
    tarih: "2026-08-06",
    etiket: "Sipariş rehberi",
    okumaDakika: 3,
    image: "/images/urun/kokology-kokorec-ekmek-arasi-bursa-nilufer-06.jpg",
    alt: "Kokology kokoreç ekmek arası, yanında turşu ve şalgam — Bursa Nilüfer Ataevler",
    bloklar: [
      {
        tip: "paragraf",
        metin:
          "Kokoreçte porsiyon adları ekmeğin boyunu değil, içine giren kokoreç miktarını anlatır. Tezgâhtaki şişten kesilen parçanın uzunluğu ölçüdür.",
      },
      { tip: "baslik", metin: "Porsiyonlar" },
      {
        tip: "liste",
        ogeler: [
          "Çeyrek — küçük acıkmalar, ayaküstü atıştırma. Tek kişilik hafif porsiyon.",
          "Yarım — standart bir öğün. Çoğu kişinin tercih ettiği boy.",
          "Üç çeyrek — iyi acıkmışlar için. Yarım yetmiyor, tam fazla geliyorsa burası.",
          "Tam — doyurucu tek kişilik ya da iki kişilik paylaşımlık.",
        ],
      },
      { tip: "baslik", metin: "Ekmek arası mı, porsiyon mu?" },
      {
        tip: "paragraf",
        metin:
          "Ekmek arası, doğranmış kokorecin sıcak ekmeğin içine konmasıdır; elde yenir, hızlıdır. Porsiyon ise kokorecin tabakta, ekmeği yanında servis edilmesidir. Aynı ürün, farklı sunum.",
      },
      {
        tip: "paragraf",
        metin:
          "Porsiyon tercih edenler genelde oturarak yiyenler ve yanında turşu, şalgam gibi ekler isteyenler oluyor.",
      },
      { tip: "baslik", metin: "Peki Special Atom?" },
      {
        tip: "paragraf",
        metin:
          "Special Atom, uykuluklu kokoreçtir. Porsiyon büyüklüğünden değil, içeriğinden dolayı ayrı bir kalem. Daha zengin ve daha ağır bir tat arayanlar için.",
      },
      {
        tip: "not",
        metin:
          "Güncel fiyatlar menü sayfamızda. Fiyatlar Nilüfer / Ataevler şubemiz içindir.",
      },
    ],
    ilgili: [
      { href: "/menu/kokorec", label: "Kokoreç porsiyon ve fiyatları" },
      { href: "/menu", label: "Tüm menü" },
    ],
  },

  {
    slug: "bursada-kokorec-nerede-yenir",
    title: "Bursa'da Kokoreç Nerede Yenir? | Kokology Nilüfer Ataevler",
    description:
      "Bursa'da kokoreç yenecek yer ararken nelere bakmalı? Nilüfer ve Ataevler tarafında oturarak, gece geç saatte kokoreç yenebilecek adres.",
    h1: "Bursa'da kokoreç nerede yenir?",
    ozet:
      "Şehirde kokoreç yenecek yer ararken bakılacak beş şey — ve Nilüfer tarafında nereye gidilir.",
    tarih: "2026-08-06",
    etiket: "Bursa rehberi",
    okumaDakika: 4,
    image: "/images/mekan/kokology-kokorec-bursa-nilufer-cadde-ataevler-dis-cephe.jpg",
    alt: "Kokology'nin Cadde Ataevler'deki cam cepheli dükkânı ve aydınlatmalı tabelası — Bursa Nilüfer",
    bloklar: [
      {
        tip: "paragraf",
        metin:
          "Bursa'da kokoreç bulmak zor değil; iyisini bulmak ve oturarak yemek biraz daha zor. Şehirdeki seçeneklerin büyük kısmı ayaküstü tezgâhlar ya da kapanış saati erken olan yerler.",
      },
      { tip: "baslik", metin: "Nelere bakmalı?" },
      {
        tip: "liste",
        ogeler: [
          "Ocak görünüyor mu? Kokorecin nerede ve nasıl piştiğini göremediğiniz yerlerde kalite şansa kalır.",
          "Sipariş anında mı doğranıyor? Önceden doğranıp bekletilen kokoreç kurur.",
          "Kaça kadar açık? Kokoreç çoğunlukla gece yenen bir şey; erken kapanan yer işinize yaramaz.",
          "Oturacak yer var mı? Ayaküstü herkese uygun değil.",
          "Otopark ve ulaşım — özellikle Nilüfer gibi geniş ilçelerde belirleyici.",
        ],
      },
      { tip: "baslik", metin: "Nilüfer / Ataevler tarafı" },
      {
        tip: "paragraf",
        metin:
          "Kokology, Bursa'nın Nilüfer ilçesinde, Ataevler'de. Adres: Yılmaz Akkılıç Cd. No:18/A, Cadde Ataevler içinde. Her gün 11.00'den gece 02.00'ye kadar açığız; otopark hem açık hem kapalı ve ücretsiz.",
      },
      {
        tip: "paragraf",
        metin:
          "İçeride sedirli oturma alanı ve açık hava bölümü var. Ayaküstü alıp gitmek de mümkün, üç saat oturmak da. Wi-Fi ve çocuklar için oyun alanı mevcut.",
      },
      { tip: "baslik", metin: "Kokoreç dışında ne var?" },
      {
        tip: "paragraf",
        metin:
          "Köfte, sucuk ekmek, midye dolma, tavuklu pilav, kokoreçli pilav ve 300 gramlık ızgara bonfileli Sporcu Pilav. Kokoreç yemeyen arkadaşınız da sofrada aç kalmaz.",
      },
    ],
    ilgili: [
      { href: "/bul-bizi", label: "Adres ve yol tarifi" },
      { href: "/menu", label: "Menü ve fiyatlar" },
    ],
  },

  {
    slug: "nilufer-ataevler-gece-acik-kokorec",
    title: "Nilüfer ve Ataevler'de Gece Açık Kokoreç | Kokology Bursa",
    description:
      "Bursa Nilüfer'de gece geç saatte açık kokoreççi arayanlar için: Kokology her gün 02.00'ye kadar açık. Ataevler, ücretsiz otopark.",
    h1: "Nilüfer ve Ataevler'de gece açık kokoreç",
    ozet:
      "Gece yarısından sonra açık yer bulmak Bursa'da sanıldığından zor. Saatler, konum ve gece gelenler için notlar.",
    tarih: "2026-08-06",
    etiket: "Bursa rehberi",
    okumaDakika: 3,
    image: "/images/mekan/kokology-sedir-oturma-alani-kokorecci-nilufer.jpg",
    alt: "Kokology iç mekânında yeşil kapitone sedirler ve duvardaki Old Master resmi — Bursa Nilüfer Ataevler",
    bloklar: [
      {
        tip: "paragraf",
        metin:
          "Kokorecin doğal saati geçtir. Maç çıkışı, mesai sonrası, gece yarısı acıkması — bu yemeğin geleneği akşamdan sonraya kuruludur. Ama Bursa'da gece 24.00'ten sonra açık ve oturulabilir yer sayısı sanıldığından az.",
      },
      { tip: "baslik", metin: "Kokology'nin saatleri" },
      {
        tip: "paragraf",
        metin:
          "Her gün 11.00 – 02.00. Hafta içi hafta sonu farkı yok. Ocak kapanış saatine kadar yanıyor; son siparişe kadar taze kokoreç servis ediliyor.",
      },
      { tip: "baslik", metin: "Gece gelenler için notlar" },
      {
        tip: "liste",
        ogeler: [
          "Otopark hem açık hem kapalı, ücretsiz. Gece park sorunu yok.",
          "Açık hava bölümü var; yaz gecelerinde tercih ediliyor.",
          "Kalabalık saatler genelde 21.00 sonrası. Kuyruk olsa da hızlı akıyor.",
          "Paket almak isteyenler telefonla önceden sipariş verebiliyor: 0531 715 11 95",
        ],
      },
      {
        tip: "paragraf",
        metin:
          "Eve götürmek isteyenler için şişte pişmiş kokoreci dilim dilim ya da kilo hesabıyla da satıyoruz.",
      },
    ],
    ilgili: [
      { href: "/bul-bizi", label: "Konum ve çalışma saatleri" },
      { href: "/menu/kokorec", label: "Kokoreç fiyatları" },
    ],
  },

  {
    slug: "kokorec-kac-kalori",
    title: "Kokoreç Kaç Kalori? Besin Değeri Hakkında | Kokology Bursa",
    description:
      "Kokoreç kaç kalori, besin değeri nedir? Porsiyona göre genel kalori aralıkları ve bu sayıların neden değişkenlik gösterdiği.",
    h1: "Kokoreç kaç kalori?",
    ozet:
      "En çok sorulan sorulardan biri. Genel aralıklar, porsiyonun etkisi ve bu sayıların neden kesin olmadığı.",
    tarih: "2026-08-06",
    etiket: "Merak edilenler",
    okumaDakika: 3,
    image: "/images/urun/kokology-kokorec-porsiyon-bursa-nilufer-06.jpg",
    alt: "Kokology kokoreç porsiyon tabağı, doğranmış kokoreç — Bursa Nilüfer Ataevler",
    bloklar: [
      {
        tip: "not",
        metin:
          "Aşağıdaki değerler kokoreç için yaygın olarak kullanılan GENEL tahmini aralıklardır; Kokology ürünlerinin laboratuvar analizi değildir. Kesin değer gerekiyorsa (diyet, tıbbi takip) bir uzmana danışın.",
      },
      {
        tip: "paragraf",
        metin:
          "Kokorecin kalorisi tek bir sayıyla verilemez. İçeriğe giren iç organların oranı, pişirmede eriyip akan yağ miktarı, ekmeğin boyu ve porsiyon büyüklüğü sonucu ciddi biçimde değiştirir. Aynı isimde iki kokoreç, iki farklı değer verebilir.",
      },
      { tip: "baslik", metin: "Neye göre değişir?" },
      {
        tip: "liste",
        ogeler: [
          "Porsiyon — çeyrek ile tam arasında dört kata varan fark var.",
          "Ekmek — ekmek arası porsiyonda kalorinin önemli kısmı ekmekten gelir.",
          "Pişirme — uzun süre ateşte çevrilen kokorecin yağının bir bölümü akar.",
          "İçerik — uykuluk gibi eklerin bulunması değeri yukarı çeker.",
        ],
      },
      { tip: "baslik", metin: "Besin değeri açısından" },
      {
        tip: "paragraf",
        metin:
          "Kokoreç protein ve yağ ağırlıklı bir yiyecektir; karbonhidratın çoğu yanında gelen ekmekten gelir. İç organlar demir ve B12 gibi besinler açısından zengindir, ama aynı zamanda kolesterol içeriği yüksektir.",
      },
      {
        tip: "paragraf",
        metin:
          "Kısacası: ara sıra yenen, keyif için tüketilen bir yemek. Günlük rutin bir öğün olarak değil, sokağın kendi ritmi içinde düşünülmeli.",
      },
    ],
    ilgili: [
      { href: "/blog/kokorec-saglikli-mi", label: "Kokoreç sağlıklı mı?" },
      { href: "/menu/kokorec", label: "Porsiyonlar ve fiyatlar" },
    ],
  },

  {
    slug: "kokorec-saglikli-mi",
    title: "Kokoreç Sağlıklı mı? Merak Edilenler | Kokology Bursa",
    description:
      "Kokoreç sağlıklı mı, temiz mi, nasıl hazırlanmalı? Hijyen, pişirme sıcaklığı ve tüketim sıklığı üzerine dengeli bir bakış.",
    h1: "Kokoreç sağlıklı mı?",
    ozet:
      "Sorunun kısa cevabı yok. Hijyen, pişirme ve sıklık üzerinden dürüst bir değerlendirme.",
    tarih: "2026-08-06",
    etiket: "Merak edilenler",
    okumaDakika: 4,
    image: "/images/mekan/kokology-kokorec-ocagi-mangal-bursa-nilufer.jpg",
    alt: "Kokology'de açık kokoreç ocağı ve mangal — Bursa Nilüfer Ataevler",
    bloklar: [
      {
        tip: "not",
        metin:
          "Bu yazı genel bilgi amaçlıdır, tıbbi tavsiye değildir. Kolesterol, tansiyon veya sindirim rahatsızlığı olanlar hekimlerine danışmalı.",
      },
      {
        tip: "paragraf",
        metin:
          "Kokorecin kötü şöhreti büyük ölçüde nasıl yapıldığından geliyor, ne olduğundan değil. Doğru temizlenmiş, doğru saklanmış ve yeterince pişmiş kokoreç, diğer et ürünlerinden farklı bir risk taşımaz. Sorun bu üç şartın hepsinin sağlanmadığı yerlerde çıkıyor.",
      },
      { tip: "baslik", metin: "Belirleyici olan üç şey" },
      {
        tip: "liste",
        ogeler: [
          "Temizlik — bağırsağın işlenmesi ve temizlenmesi işin en kritik aşaması. Bu aşamada yapılan hata sonradan telafi edilemez.",
          "Soğuk zincir — hazırlanan ürünün ocağa girene kadar doğru sıcaklıkta saklanması.",
          "Pişirme — yeterli sıcaklık ve süre. Kokoreç saatlerce çevrilir; bu sadece lezzet meselesi değil, güvenlik meselesidir.",
        ],
      },
      { tip: "baslik", metin: "Müşteri olarak neye bakabilirsiniz?" },
      {
        tip: "paragraf",
        metin:
          "Ocağın görünür olması iyi bir işarettir. Tezgâhın temizliği, personelin eldiven ve hijyen alışkanlığı, kokorecin sipariş anında doğranması — bunlar dışarıdan gözlenebilir şeyler. Kapalı mutfakta neyin nasıl yapıldığını bilemezsiniz.",
      },
      { tip: "baslik", metin: "Sıklık meselesi" },
      {
        tip: "paragraf",
        metin:
          "Kokoreç yağ ve kolesterol açısından zengin bir yiyecek. Haftanın her günü yenecek bir şey değil; zaten kimse öyle tüketmiyor. Ara sıra, keyif için, doğru yerde yendiğinde mesele yok.",
      },
      {
        tip: "alinti",
        metin: "Sorun kokorecin kendisi değil, nerede yediğiniz.",
      },
    ],
    ilgili: [
      { href: "/hakkimizda", label: "Ocağımız ve mutfağımız" },
      { href: "/blog/kokorec-kac-kalori", label: "Kokoreç kaç kalori?" },
    ],
  },

  {
    slug: "kokorec-yanina-ne-icilir",
    title: "Kokoreç Yanına Ne İçilir? Ayran mı Şalgam mı? | Kokology Bursa",
    description:
      "Kokorecin yanına ayran mı, şalgam mı, turşu suyu mu? Hangi içecek neden yakışıyor, Kokology'de neler var?",
    h1: "Kokoreç yanına ne içilir?",
    ozet:
      "Ayran ekolü, şalgam ekolü ve arada kalanlar. Hangisi neden yakışıyor?",
    tarih: "2026-08-06",
    etiket: "Sipariş rehberi",
    okumaDakika: 3,
    image: "/images/icecek/kokology-icecekler-ayran-salgam-gazoz-bursa-nilufer.jpg",
    alt: "Kokology'de satılan içecekler: Özerhisar ve Sütaş ayran, acılı şalgam, Uludağ gazoz ve maden suyu, Coca-Cola — Bursa Nilüfer Ataevler",
    bloklar: [
      {
        tip: "paragraf",
        metin:
          "Kokorecin yanına ne içileceği masada tartışma çıkaran nadir konulardan biri. Üç ekol var ve üçünün de mantığı sağlam.",
      },
      { tip: "baslik", metin: "Ayran ekolü" },
      {
        tip: "paragraf",
        metin:
          "Çoğunluk burada. Ayranın yoğun kıvamı ve hafif tuzu, kokorecin yağını keser; ağızda kalan ağırlığı temizler. Tartışma çıkarmayan, güvenli tercih.",
      },
      { tip: "baslik", metin: "Şalgam ekolü" },
      {
        tip: "paragraf",
        metin:
          "Daha az kişi, daha iddialı bir grup. Şalgamın ekşiliği ve acısı kokorecin baharatını bastırmak yerine yukarı çeker; tat daha keskin hâle gelir. Acılı tercih edenler bu etkiyi arıyor.",
      },
      { tip: "baslik", metin: "Turşu suyu ve gazozlar" },
      {
        tip: "paragraf",
        metin:
          "Turşu suyu ikisinin arasında durur: ekşi ama şalgam kadar baskın değil. Gazoz tarafında ise Uludağ'ın sade ve portakallısı, soğuk maden suyu ve klasik kola var. Gazın kendisi de yağı kesen bir etki yapıyor.",
      },
      {
        tip: "not",
        metin:
          "Kokology'de Özerhisar ve Sütaş ayran, acılı şalgam, turşu suyu, Uludağ gazoz ve maden suyu ile Coca-Cola bulunuyor.",
      },
    ],
    ilgili: [
      { href: "/menu/icecekler", label: "İçecekler ve fiyatları" },
      { href: "/menu/kokorec", label: "Kokoreç fiyatları" },
    ],
  },

  {
    slug: "bursa-kokorec-fiyatlari-ne-kadar",
    title: "Bursa Kokoreç Fiyatları Ne Kadar? Fiyatı Ne Belirler? | Kokology Bursa",
    description:
      "Bursa kokoreç fiyatları neye göre değişir? Porsiyon, malzeme ve sunuma göre kokoreç fiyatını belirleyen etkenler ve Kokology'nin güncel fiyat listesi.",
    h1: "Bursa'da kokoreç fiyatları ne kadar?",
    ozet:
      "Kokoreç fiyatını asıl belirleyen şey ne — porsiyon mu, malzeme mi? Bursa'da fiyata bakarken nelere dikkat etmeli.",
    tarih: "2026-09-01",
    etiket: "Fiyat rehberi",
    okumaDakika: 4,
    image: "/images/urun/kokology-kokorec-ekmek-arasi-bursa-nilufer-10.jpg",
    alt: "Kokology kokoreç ekmek arası, ahşap tezgahta servis anı — Bursa Nilüfer Ataevler",
    bloklar: [
      {
        tip: "paragraf",
        metin:
          "Bursa'da kokoreç arayan biri için ilk soru genelde fiyat oluyor. Ama tek bir \"bursa kokoreç fiyatı\" yok — aynı şehirde, hatta aynı sokakta bile fiyat ciddi şekilde değişebiliyor. Sebebi rastgele değil; birkaç somut etken kokorecin fiyatını belirliyor.",
      },
      { tip: "baslik", metin: "Kokoreç fiyatını ne belirler?" },
      {
        tip: "liste",
        ogeler: [
          "Porsiyon miktarı — çeyrekten tama, şişten kesilen parçanın uzunluğu doğrudan fiyata yansır.",
          "Malzeme — uykuluk (timus bezi) eklenen kokoreç, daha zengin dokusu yüzünden standart kokoreçten pahalıdır.",
          "Pişirme süresi ve yöntemi — odun veya kömürle saatlerce çevrilen bir ürün, hızlı pişirilenden maliyetlice farklıdır.",
          "Sunum — ekmek arası mı, porsiyon tabağı mı olduğu; porsiyon genelde yanına gelen ekler (turşu, salata) yüzünden biraz daha yüksek fiyatlanır.",
          "Lokasyon — cadde üzeri, oturma alanlı bir mekânın işletme maliyeti, tezgah üstü satıştan farklıdır.",
        ],
      },
      { tip: "baslik", metin: "Bursa'da kokoreç fiyatları hangi aralıkta?" },
      {
        tip: "paragraf",
        metin:
          "Şehir geneli için tek bir rakam vermek yanıltıcı olur — her kokoreçci kendi malzeme ve porsiyon anlayışına göre fiyatlandırıyor. Bunun yerine kendi güncel listemizi somut bir örnek olarak paylaşalım; Nilüfer / Ataevler şubemizde kokoreç şöyle fiyatlanıyor:",
      },
      {
        tip: "liste",
        ogeler: [
          "Çeyrek Kokoreç — 230 ₺",
          "Yarım Kokoreç — 380 ₺",
          "Üç Çeyrek Kokoreç — 580 ₺",
          "Tam Kokoreç — 740 ₺",
          "Porsiyon Kokoreç — 800 ₺",
          "Yarım Atom (uykuluklu) — 650 ₺",
          "Special Atom (uykuluklu) — 1200 ₺",
        ],
      },
      { tip: "baslik", metin: "Ucuz kokoreç her zaman kötü müdür?" },
      {
        tip: "paragraf",
        metin:
          "Hayır — ama fiyatın arkasında ne olduğunu bilmek önemli. Düşük fiyat bazen ince porsiyondan, bazen de gerçekten sade bir işletme modelinden gelir; bunun kendisi bir sorun değil. Asıl dikkat edilmesi gereken şeffaflık: ateşin görünür olması, kokorecin sipariş anında doğranması, baharatın önceden değil son anda eklenmesi. Fiyat tek başına bir kalite göstergesi değil, ama bu şeffaflığın olduğu yerde fiyat da genelde açık ve tutarlıdır.",
      },
      {
        tip: "not",
        metin:
          "Yukarıdaki fiyatlar Kokology Nilüfer / Ataevler şubemiz için 1 Eylül 2026 itibariyledir. Güncel liste her zaman menü sayfamızda.",
      },
      {
        tip: "alinti",
        metin: "Kokoreçte fiyat sorulur ama asıl soru neyin karşılığı olduğu.",
      },
    ],
    ilgili: [
      { href: "/menu/kokorec", label: "Güncel kokoreç fiyatları" },
      { href: "/menu", label: "Tüm menü ve fiyatlar" },
    ],
  },
];

export const blogSayfa = {
  title: "Blog — Kokoreç ve Bursa Sokak Lezzetleri | Kokology",
  description:
    "Kokoreç nedir, nasıl yapılır, kaç kalori, Bursa'da nerede yenir? Kokoreç ve sokak lezzetleri üzerine yazılar.",
  breadcrumb: "Blog",
  eyebrow: "Yazılar",
  h1: "Kokoreç üzerine",
  lead: "En çok sorulan sorular, sipariş rehberleri ve Bursa'da kokoreç. Kısa, işe yarar, abartısız.",
  bosMesaj: "Henüz yazı yok.",
};

export const yaziSluglari = yazilar.map((y) => y.slug);

export function yaziBul(slug: string) {
  return yazilar.find((y) => y.slug === slug) ?? null;
}
