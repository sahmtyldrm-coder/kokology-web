import { business, menu, culture, seo, faq, hero } from "@/content/tr";
import { kategoriBul } from "@/content/kategoriler";
import { openingHoursSpecification } from "@/lib/hours";

const site = business.siteUrl;

/**
 * JSON-LD'yi <script> içine gömerken XSS'e karşı `<` karakterini kaçırırız.
 * Next.js dokümanının önerdiği yaklaşım.
 */
export function jsonLdString(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

function sameAs(): string[] {
  return Object.values(business.social).filter(Boolean);
}

/** Kırmızı CTA'nın hedefi: sipariş linki varsa oraya, yoksa telefona. */
export function primaryAction(): { href: string; label: "order" | "call" } {
  const order =
    business.ordering.yemeksepeti ||
    business.ordering.getir ||
    business.ordering.trendyolYemek;
  return order
    ? { href: order, label: "order" }
    : { href: `tel:${business.phone.e164}`, label: "call" };
}

/* -------------------------------------------------------------------------- */

/** Basılı menüdeki her kategori bir MenuSection, her porsiyon bir MenuItem. */
function menuSchema() {
  return {
    "@type": "Menu",
    "@id": `${site}/#menu`,
    name: "Kokology Menü",
    inLanguage: "tr-TR",
    hasMenuSection: menu.sections.map((section) => ({
      "@type": "MenuSection",
      name: section.name,
      ...(section.image && { image: `${site}${section.image}` }),
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
function reviewSchema() {
  if (culture.reviews.length === 0) return {};

  return {
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: culture.rating.value,
      reviewCount: culture.rating.count,
      bestRating: 5,
      worstRating: 1,
    },
    review: culture.reviews.map((r) => ({
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

/** Basit iç sayfa: kırıntı yolu + sayfa kaydı. İşletmeye @id ile bağlanır. */
export function sayfaSchema({
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
export function kategoriSchema(slug: string) {
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
export function menuPageSchema() {
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
      menuSchema(),
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
export function siteSchema() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Restaurant",
        "@id": `${site}/#restaurant`,
        // Google İşletme Profilindeki adla birebir aynı olmalı (NAP tutarlılığı)
        name: business.googleName,
        alternateName: business.name,
        legalName: business.legalName,
        slogan: business.tagline,
        description: seo.description,
        url: site,
        telephone: business.phone.e164,
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
          streetAddress: business.address.street,
          addressLocality: business.address.town,
          addressRegion: business.address.city,
          postalCode: business.address.postalCode,
          addressCountry: business.address.country,
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: business.geo.latitude,
          longitude: business.geo.longitude,
        },
        hasMap: business.maps.placeUrl,
        openingHoursSpecification: openingHoursSpecification(),
        priceRange: business.priceRange,
        servesCuisine: [...business.servesCuisine],
        currenciesAccepted: "TRY",
        paymentAccepted: [
          "Nakit",
          "Kredi Kartı",
          "Banka Kartı",
          ...business.payment.mealCards,
        ].join(", "),
        amenityFeature: business.amenities.map((name) => ({
          "@type": "LocationFeatureSpecification",
          name,
          value: true,
        })),
        // Normal ziyarette rezervasyon gerekmiyor; yalnızca grup ve topluluk
        // etkinlikleri için telefonla alınıyor.
        acceptsReservations:
          "Grup ve topluluk etkinlikleri için telefonla rezervasyon alınır",
        hasMenu: { "@id": `${site}/#menu` },
        ...(sameAs().length > 0 && { sameAs: sameAs() }),
        ...reviewSchema(),
      },
      {
        "@type": "WebSite",
        "@id": `${site}/#website`,
        url: site,
        name: business.name,
        inLanguage: "tr-TR",
        publisher: { "@id": `${site}/#restaurant` },
      },
    ],
  };
}

/** Ana sayfa — menü ve sık sorulanlar burada yayınlanır. */
export function homeSchema() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      menuSchema(),
      {
        // Sık sorulanlar: hem Google'ın zengin sonuçları hem de yapay zekâ
        // araçlarının doğrudan alıntıladığı kaynak.
        "@type": "FAQPage",
        "@id": `${site}/#sss`,
        inLanguage: "tr-TR",
        mainEntity: faq.items.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: { "@type": "Answer", text: item.a },
        })),
      },
    ],
  };
}
