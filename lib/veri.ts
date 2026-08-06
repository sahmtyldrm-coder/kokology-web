import { createClient } from "@supabase/supabase-js";
import { unstable_cache } from "next/cache";
import { business as varsayilanIsletme, menu as varsayilanMenu } from "@/content/tr";

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
