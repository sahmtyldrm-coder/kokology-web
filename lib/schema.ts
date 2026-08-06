import { business, menu, culture, seo, hero } from "@/content/tr";
import { kategoriBul } from "@/content/kategoriler";
import { blogSayfa } from "@/content/blog";
import {
  menuGetir,
  sssGetir,
  yorumlarGetir,
  yazilarGetir,
  yaziGetir,
  isletmeGetir,
  saatlerGetir,
} from "@/lib/veri";
import { openingHoursSpecification } from "@/lib/hours";

/**
 * Adres, artık panelden değiştirilebildiği için her şemada okunuyor.
 * `siteUrl` canonical, Open Graph, sitemap ve JSON-LD'nin tamamını besliyor —
 * alan adı değiştiğinde hepsi birlikte güncellenmeli.
 */
async function adres() {
  return (await isletmeGetir()).siteUrl.replace(/\/$/, "");
}

/**
 * JSON-LD'yi <script> içine gömerken XSS'e karşı `<` karakterini kaçırırız.
 * Next.js dokümanının önerdiği yaklaşım.
 */
export function jsonLdString(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

function sameAs(isletme: { social: Record<string, string> }): string[] {
  return Object.values(isletme.social).filter(Boolean);
}

/* -------------------------------------------------------------------------- */

/** Basılı menüdeki her kategori bir MenuSection, her porsiyon bir MenuItem. */
async function menuSchema() {
  const site = await adres();
  const bolumler = await menuGetir();
  return {
    "@type": "Menu",
    "@id": `${site}/#menu`,
    name: "Kokology Menü",
    inLanguage: "tr-TR",
    hasMenuSection: bolumler.map((section) => ({
      "@type": "MenuSection",
      name: section.ad,
      ...(section.gorsel && { image: `${site}${section.gorsel}` }),
      hasMenuItem: section.items.map((item) => ({
        "@type": "MenuItem",
        name: item.ad,
        ...(item.not && { description: item.not }),
        ...(item.fiyat !== null && {
          offers: {
            "@type": "Offer",
            price: item.fiyat,
            priceCurrency: menu.currency,
            availability: "https://schema.org/InStock",
          },
        }),
      })),
    })),
  };
}

/**
 * Yorum ve puan yalnızca gerçek veri varsa yayınlanır.
 *
 * `aggregateRating` sitede gösterilen yorumların ortalamasından değil,
 * Google İşletme Profilinin tamamından (5,0 / 20 yorum) alınır — altı yorumu
 * "20 yorum" diye sunmak yanlış beyan olurdu.
 */
async function reviewSchema() {
  const yorumlar = await yorumlarGetir();
  if (yorumlar.length === 0) return {};

  return {
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: culture.rating.value,
      reviewCount: culture.rating.count,
      bestRating: 5,
      worstRating: 1,
    },
    review: yorumlar.map((r) => ({
      "@type": "Review",
      author: { "@type": "Person", name: r.author },
      datePublished: r.date,
      reviewBody: r.body,
      reviewRating: {
        "@type": "Rating",
        ratingValue: r.rating,
        bestRating: 5,
        worstRating: 1,
      },
    })),
  };
}

/* -------------------------------------------------------------------------- */

/** /blog — yazı listesi. */
export async function blogListeSchema() {
  const site = await adres();
  const yazilar = await yazilarGetir();
  const url = `${site}/blog`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: business.name, item: site },
          { "@type": "ListItem", position: 2, name: "Blog", item: url },
        ],
      },
      {
        "@type": "Blog",
        "@id": `${url}#blog`,
        url,
        name: blogSayfa.h1,
        description: blogSayfa.description,
        inLanguage: "tr-TR",
        publisher: { "@id": `${site}/#restaurant` },
        blogPost: yazilar.map((y) => ({
          "@type": "BlogPosting",
          headline: y.baslik,
          description: y.ozet,
          datePublished: y.tarih,
          url: `${url}/${y.slug}`,
          image: `${site}${y.gorsel}`,
        })),
      },
    ],
  };
}

/**
 * /blog/[slug] — tek yazı.
 *
 * `articleBody` bilerek yazılmıyor: gövde zaten sayfada okunabilir hâlde ve
 * tekrar etmek dosyayı gereksiz şişirir. Arama motorları da yapay zekâ araçları
 * da gövdeyi HTML'den okuyor.
 */
export async function yaziSchema(slug: string) {
  const site = await adres();
  const yazi = await yaziGetir(slug);
  if (!yazi) return { "@context": "https://schema.org", "@graph": [] };
  const url = `${site}/blog/${slug}`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: business.name, item: site },
          { "@type": "ListItem", position: 2, name: "Blog", item: `${site}/blog` },
          { "@type": "ListItem", position: 3, name: yazi.baslik, item: url },
        ],
      },
      {
        "@type": "BlogPosting",
        "@id": `${url}#article`,
        headline: yazi.baslik,
        name: yazi.seoBaslik,
        description: yazi.aciklama,
        inLanguage: "tr-TR",
        datePublished: yazi.tarih,
        dateModified: yazi.guncelleme ?? yazi.tarih,
        image: `${site}${yazi.gorsel}`,
        mainEntityOfPage: { "@type": "WebPage", "@id": url },
        author: { "@id": `${site}/#restaurant` },
        publisher: { "@id": `${site}/#restaurant` },
        about: { "@id": `${site}/#restaurant` },
        keywords: [yazi.etiket, "kokoreç", "Bursa", "Nilüfer", "Ataevler"],
        wordCount: yazi.bloklar
          .map((b) =>
            b.tip === "liste" ? b.ogeler.join(" ") : (b as { metin: string }).metin,
          )
          .join(" ")
          .split(/\s+/).length,
      },
    ],
  };
}

/** Basit iç sayfa: kırıntı yolu + sayfa kaydı. İşletmeye @id ile bağlanır. */
export async function sayfaSchema({
  path,
  name,
  description,
  breadcrumb,
}: {
  path: string;
  name: string;
  description: string;
  breadcrumb: string;
}) {
  const site = await adres();
  const url = `${site}${path}`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: business.name, item: site },
          { "@type": "ListItem", position: 2, name: breadcrumb, item: url },
        ],
      },
      {
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        url,
        name,
        description,
        inLanguage: "tr-TR",
        isPartOf: { "@id": `${site}/#website` },
        about: { "@id": `${site}/#restaurant` },
      },
    ],
  };
}

/**
 * /menu/[kategori] — kırıntı yolu + yalnızca o kategorinin menü bölümü +
 * kategoriye özel sorular.
 *
 * Tüm menü burada tekrarlanmaz: sayfada yalnızca bir kategorinin fiyatları
 * var, tamamını işaretlemek sayfada olmayan içeriği beyan etmek olurdu.
 */
export async function kategoriSchema(slug: string) {
  const site = await adres();
  const bulunan = kategoriBul(slug);
  if (!bulunan) return { "@context": "https://schema.org", "@graph": [] };
  const { kategori, section } = bulunan;
  const url = `${site}/menu/${slug}`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: business.name, item: site },
          { "@type": "ListItem", position: 2, name: "Menü", item: `${site}/menu` },
          {
            "@type": "ListItem",
            position: 3,
            name: kategori.eyebrow,
            item: url,
          },
        ],
      },
      {
        "@type": "Menu",
        "@id": `${url}#menu`,
        name: `Kokology ${kategori.eyebrow}`,
        inLanguage: "tr-TR",
        hasMenuSection: [
          {
            "@type": "MenuSection",
            name: section.name,
            image: `${site}${kategori.image}`,
            hasMenuItem: section.items.map((item) => ({
              "@type": "MenuItem",
              name: item.name,
              ...(item.note && { description: item.note }),
              ...(item.price !== null && {
                offers: {
                  "@type": "Offer",
                  price: item.price,
                  priceCurrency: menu.currency,
                  availability: "https://schema.org/InStock",
                },
              }),
            })),
          },
        ],
      },
      ...(kategori.faq.length > 0
        ? [
            {
              "@type": "FAQPage",
              "@id": `${url}#sss`,
              inLanguage: "tr-TR",
              mainEntity: kategori.faq.map((f) => ({
                "@type": "Question",
                name: f.q,
                acceptedAnswer: { "@type": "Answer", text: f.a },
              })),
            },
          ]
        : []),
      {
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        url,
        name: kategori.title,
        description: kategori.description,
        inLanguage: "tr-TR",
        isPartOf: { "@id": `${site}/#website` },
        about: { "@id": `${site}/#restaurant` },
        primaryImageOfPage: `${site}${kategori.image}`,
      },
    ],
  };
}

/**
 * /menu sayfası — kırıntı yolu + menünün kendisi.
 * Restaurant kaydına `@id` ile bağlanır, tekrar tanımlanmaz.
 */
export async function menuPageSchema() {
  const site = await adres();
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: business.name,
            item: site,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Menü",
            item: `${site}/menu`,
          },
        ],
      },
      await menuSchema(),
      {
        "@type": "WebPage",
        "@id": `${site}/menu#webpage`,
        url: `${site}/menu`,
        inLanguage: "tr-TR",
        isPartOf: { "@id": `${site}/#website` },
        about: { "@id": `${site}/#restaurant` },
        primaryImageOfPage: `${site}${menu.printed[0].src}`,
      },
    ],
  };
}

/**
 * Her sayfada basılan çekirdek: işletmenin kendisi + site kaydı.
 *
 * Menü ve S.S.S. verisi bilerek burada değil — o içerik yalnızca ilgili
 * sayfalarda bulunuyor. Bulunmadığı sayfada yapısal veri olarak duyurmak
 * yanlış beyandır; Google da sayfada karşılığı olmayan işaretlemeyi eler.
 */
export async function siteSchema() {
  const site = await adres();
  const isletme = await isletmeGetir();
  const saatler = await saatlerGetir();
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Restaurant",
        "@id": `${site}/#restaurant`,
        // Google İşletme Profilindeki adla birebir aynı olmalı (NAP tutarlılığı)
        name: isletme.googleName,
        alternateName: isletme.name,
        legalName: isletme.legalName,
        slogan: business.tagline,
        description: seo.description,
        url: site,
        telephone: isletme.phone.e164,
        // Google bu listeden zengin sonuçta görsel seçiyor: marka görseli,
        // dış cephe, iç mekân ve ürün — dördü farklı soruya cevap veriyor.
        image: [
          `${site}${hero.image.src}`,
          `${site}/images/mekan/kokology-kokorec-bursa-nilufer-cadde-ataevler-dis-cephe.jpg`,
          `${site}/images/mekan/kokology-sedir-oturma-alani-kokorecci-nilufer.jpg`,
          `${site}/images/urun/kokology-kokorec-ekmek-arasi-bursa-nilufer-06.jpg`,
        ],
        address: {
          "@type": "PostalAddress",
          streetAddress: isletme.address.street,
          addressLocality: isletme.address.town,
          addressRegion: isletme.address.city,
          postalCode: isletme.address.postalCode,
          addressCountry: isletme.address.country,
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: isletme.geo.latitude,
          longitude: isletme.geo.longitude,
        },
        hasMap: isletme.maps.placeUrl,
        openingHoursSpecification: openingHoursSpecification(saatler),
        priceRange: isletme.priceRange,
        servesCuisine: [...isletme.servesCuisine],
        currenciesAccepted: "TRY",
        paymentAccepted: [
          "Nakit",
          "Kredi Kartı",
          "Banka Kartı",
          ...isletme.payment.mealCards,
        ].join(", "),
        amenityFeature: isletme.amenities.map((name) => ({
          "@type": "LocationFeatureSpecification",
          name,
          value: true,
        })),
        // Normal ziyarette rezervasyon gerekmiyor; yalnızca grup ve topluluk
        // etkinlikleri için telefonla alınıyor.
        acceptsReservations:
          "Grup ve topluluk etkinlikleri için telefonla rezervasyon alınır",
        hasMenu: { "@id": `${site}/#menu` },
        ...(sameAs(isletme).length > 0 && { sameAs: sameAs(isletme) }),
        ...(await reviewSchema()),
      },
      {
        "@type": "WebSite",
        "@id": `${site}/#website`,
        url: site,
        name: isletme.name,
        inLanguage: "tr-TR",
        publisher: { "@id": `${site}/#restaurant` },
      },
    ],
  };
}

/** Ana sayfa — menü ve sık sorulanlar burada yayınlanır. */
export async function homeSchema() {
  const site = await adres();
  const sorular = await sssGetir();
  return {
    "@context": "https://schema.org",
    "@graph": [
      await menuSchema(),
      {
        // Sık sorulanlar: hem Google'ın zengin sonuçları hem de yapay zekâ
        // araçlarının doğrudan alıntıladığı kaynak.
        "@type": "FAQPage",
        "@id": `${site}/#sss`,
        inLanguage: "tr-TR",
        mainEntity: sorular.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: { "@type": "Answer", text: item.a },
        })),
      },
    ],
  };
}
