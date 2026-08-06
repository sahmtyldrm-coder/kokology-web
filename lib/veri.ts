import { createClient } from "@supabase/supabase-js";
import { unstable_cache } from "next/cache";
import {
  business as varsayilanIsletme,
  menu as varsayilanMenu,
  faq as varsayilanFaq,
  culture as varsayilanCulture,
} from "@/content/tr";
import { yazilar as varsayilanBlog, type Blok } from "@/content/blog";

/**
 * VERİ KATMANI — sitenin içeriği nereden okuduğu.
 *
 * Kural: veritabanı KAYNAK, `content/tr.ts` GERİ DÜŞME.
 *
 * Veritabanı erişilemezse, boşsa ya da ortam değişkenleri tanımlı değilse
 * site sessizce dosyalardaki içerikle çalışmaya devam eder. Bunun sebebi
 * ticari: bir restoran sitesinin, panel çöktü diye menüsünü gösterememesi
 * kabul edilemez. Ziyaretçi arızayı hiç görmez.
 *
 * Okumalar `unstable_cache` ile etiketlenir; panel kaydettiğinde
 * `revalidateTag` çağrılır ve yalnızca ilgili sayfalar yeniden üretilir.
 * Sayfalar statik kalır, LCP bozulmaz.
 */

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export const ETIKET = {
  menu: "menu",
  saatler: "saatler",
  ayarlar: "ayarlar",
  sss: "sss",
  yorumlar: "yorumlar",
  blog: "blog",
} as const;

/** Okuma için oturumsuz istemci — sunucuda derleme sırasında da çalışır. */
function okumaIstemcisi() {
  if (!URL || !KEY) return null;
  return createClient(URL, KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/* -------------------------------------------------------------------------- */

export type MenuUrun = {
  ad: string;
  fiyat: number | null;
  not: string;
  imza: boolean;
  gorsel: string | null;
  alt: string | null;
};

export type MenuBolum = {
  id: string;
  ad: string;
  gorsel: string;
  alt: string;
  items: MenuUrun[];
};

/** Dosyalardaki menüyü veri katmanının şekline çevirir. */
function varsayilanBolumler(): MenuBolum[] {
  return varsayilanMenu.sections.map((s) => ({
    id: s.id,
    ad: s.name,
    gorsel: s.image,
    alt: s.alt,
    items: s.items.map((i) => ({
      ad: i.name,
      fiyat: i.price,
      not: i.note ?? "",
      imza: "signature" in i && Boolean(i.signature),
      gorsel: "image" in i ? ((i as { image?: string }).image ?? null) : null,
      alt: "alt" in i ? ((i as { alt?: string }).alt ?? null) : null,
    })),
  }));
}

async function menuOku(): Promise<MenuBolum[]> {
  const db = okumaIstemcisi();
  if (!db) return varsayilanBolumler();

  const { data, error } = await db
    .from("menu_kategoriler")
    .select(
      "slug, ad, sira, gorsel, gorsel_alt, menu_urunler(ad, fiyat, not_metni, imza, gorsel, gorsel_alt, sira, yayinda)",
    )
    .eq("yayinda", true)
    .order("sira");

  if (error || !data || data.length === 0) return varsayilanBolumler();

  return data.map((k) => ({
    id: k.slug,
    ad: k.ad,
    gorsel: k.gorsel ?? "",
    alt: k.gorsel_alt ?? "",
    items: (k.menu_urunler ?? [])
      .filter((u) => u.yayinda)
      .sort((a, b) => a.sira - b.sira)
      .map((u) => ({
        ad: u.ad,
        fiyat: u.fiyat === null ? null : Number(u.fiyat),
        not: u.not_metni ?? "",
        imza: u.imza,
        gorsel: u.gorsel,
        alt: u.gorsel_alt,
      })),
  }));
}

export const menuGetir = unstable_cache(menuOku, ["menu"], {
  tags: [ETIKET.menu],
});

/* -------------------------------------------------------------------------- */

export type Saat = {
  day: number;
  label: string;
  opens: string;
  closes: string;
  kapali: boolean;
};

async function saatlerOku(): Promise<Saat[]> {
  const db = okumaIstemcisi();
  const varsayilan = varsayilanIsletme.hours.map((h) => ({
    day: h.day,
    label: h.label,
    opens: h.opens as string,
    closes: h.closes as string,
    kapali: false,
  }));
  if (!db) return varsayilan;

  const { data, error } = await db
    .from("calisma_saatleri")
    .select("gun, etiket, acilis, kapanis, kapali");

  if (error || !data || data.length === 0) return varsayilan;

  return data.map((s) => ({
    day: s.gun,
    label: s.etiket,
    opens: s.acilis,
    closes: s.kapanis,
    kapali: s.kapali,
  }));
}

export const saatlerGetir = unstable_cache(saatlerOku, ["saatler"], {
  tags: [ETIKET.saatler],
});

/* -------------------------------------------------------------------------- */

export type Ayarlar = Record<string, unknown>;

async function ayarlarOku(): Promise<Ayarlar> {
  const db = okumaIstemcisi();
  if (!db) return {};

  const { data, error } = await db.from("site_ayarlar").select("anahtar, deger");
  if (error || !data) return {};

  return Object.fromEntries(data.map((a) => [a.anahtar, a.deger]));
}

export const ayarlarGetir = unstable_cache(ayarlarOku, ["ayarlar"], {
  tags: [ETIKET.ayarlar],
});

/* -------------------------------------------------------------------------- */

export type SoruCevap = { q: string; a: string };

async function sssOku(): Promise<SoruCevap[]> {
  const db = okumaIstemcisi();
  if (!db) return [...varsayilanFaq.items];

  const { data, error } = await db
    .from("sss")
    .select("soru, cevap")
    .eq("yayinda", true)
    .order("sira");

  if (error || !data || data.length === 0) return [...varsayilanFaq.items];
  return data.map((s) => ({ q: s.soru, a: s.cevap }));
}

export const sssGetir = unstable_cache(sssOku, ["sss"], { tags: [ETIKET.sss] });

/* -------------------------------------------------------------------------- */

export type Yorum = {
  author: string;
  rating: number;
  body: string;
  date: string;
};

async function yorumlarOku(): Promise<Yorum[]> {
  const db = okumaIstemcisi();
  if (!db) return [...varsayilanCulture.reviews];

  const { data, error } = await db
    .from("yorumlar")
    .select("yazan, puan, metin, tarih")
    .eq("yayinda", true)
    .order("sira");

  if (error || !data || data.length === 0) return [...varsayilanCulture.reviews];
  return data.map((y) => ({
    author: y.yazan,
    rating: y.puan,
    body: y.metin,
    date: y.tarih,
  }));
}

export const yorumlarGetir = unstable_cache(yorumlarOku, ["yorumlar"], {
  tags: [ETIKET.yorumlar],
});

/* -------------------------------------------------------------------------- */

export type BlogYazi = {
  slug: string;
  baslik: string;
  seoBaslik: string;
  aciklama: string;
  ozet: string;
  etiket: string;
  gorsel: string;
  gorselAlt: string;
  bloklar: Blok[];
  ilgili: { href: string; label: string }[];
  okumaDakika: number;
  tarih: string;
  guncelleme: string | null;
};

/** Dosyalardaki yazıları veri katmanının şekline çevirir. */
function varsayilanYazilar(): BlogYazi[] {
  return varsayilanBlog.map((y) => ({
    slug: y.slug,
    baslik: y.h1,
    seoBaslik: y.title,
    aciklama: y.description,
    ozet: y.ozet,
    etiket: y.etiket,
    gorsel: y.image,
    gorselAlt: y.alt,
    bloklar: y.bloklar,
    ilgili: [...y.ilgili],
    okumaDakika: y.okumaDakika,
    tarih: y.tarih,
    guncelleme: y.guncelleme ?? null,
  }));
}

async function yazilarOku(): Promise<BlogYazi[]> {
  const db = okumaIstemcisi();
  if (!db) return varsayilanYazilar();

  const { data, error } = await db
    .from("blog_yazilar")
    .select(
      "slug, baslik, seo_baslik, aciklama, ozet, etiket, gorsel, gorsel_alt, bloklar, ilgili, okuma_dakika, yayin_tarihi, guncellendi",
    )
    .eq("durum", "yayinda")
    .order("yayin_tarihi", { ascending: false });

  if (error || !data || data.length === 0) return varsayilanYazilar();

  return data.map((y) => ({
    slug: y.slug,
    baslik: y.baslik,
    seoBaslik: y.seo_baslik || y.baslik,
    aciklama: y.aciklama,
    ozet: y.ozet,
    etiket: y.etiket,
    gorsel: y.gorsel,
    gorselAlt: y.gorsel_alt,
    bloklar: (y.bloklar ?? []) as Blok[],
    ilgili: (y.ilgili ?? []) as { href: string; label: string }[],
    okumaDakika: y.okuma_dakika,
    tarih: String(y.yayin_tarihi ?? "").slice(0, 10),
    guncelleme: y.guncellendi ? String(y.guncellendi).slice(0, 10) : null,
  }));
}

export const yazilarGetir = unstable_cache(yazilarOku, ["blog"], {
  tags: [ETIKET.blog],
});

export async function yaziGetir(slug: string): Promise<BlogYazi | null> {
  const hepsi = await yazilarGetir();
  return hepsi.find((y) => y.slug === slug) ?? null;
}
