"use server";

import { updateTag, revalidatePath } from "next/cache";
import { sunucuIstemcisi } from "@/lib/supabase";
import { ETIKET } from "@/lib/veri";

/**
 * Panelin yazma işlemleri.
 *
 * Her kayıttan sonra ilgili önbellek etiketi `updateTag` ile anında
 * geçersizleştirilir. `revalidateTag` yerine bunun seçilmesinin sebebi:
 * updateTag "kendi yazdığını hemen gör" davranışı verir — panelde Kaydet'e
 * basan kişi siteyi açtığında değişikliği görmüş olur. revalidateTag ise
 * bayat içeriği bir süre daha servis eder ve "kaydettim ama değişmedi"
 * izlenimi yaratırdı. Ziyaretçi yine statik sayfa görür, LCP bozulmaz.
 *
 * Yetki kontrolü iki katmanlı: burada oturum var mı diye bakılır, ayrıca
 * veritabanında RLS yazmayı yalnızca giriş yapmışa açar. Biri atlansa bile
 * diğeri durdurur.
 */

async function yetkiliIstemci() {
  const db = await sunucuIstemcisi();
  const {
    data: { user },
  } = await db.auth.getUser();
  if (!user) throw new Error("Bu işlem için giriş yapmalısın.");
  return db;
}

export type EylemSonuc = { ok: true } | { ok: false; hata: string };

/* -------------------------------------------------------------------------- */

export async function fiyatGuncelle(
  urunId: string,
  fiyat: number | null,
): Promise<EylemSonuc> {
  try {
    const db = await yetkiliIstemci();
    const { error } = await db
      .from("menu_urunler")
      .update({ fiyat })
      .eq("id", urunId);
    if (error) return { ok: false, hata: error.message };

    updateTag(ETIKET.menu);
    return { ok: true };
  } catch (e) {
    return { ok: false, hata: (e as Error).message };
  }
}

export async function urunGuncelle(
  urunId: string,
  alanlar: { ad?: string; fiyat?: number | null; not_metni?: string; imza?: boolean; yayinda?: boolean },
): Promise<EylemSonuc> {
  try {
    const db = await yetkiliIstemci();
    const { error } = await db.from("menu_urunler").update(alanlar).eq("id", urunId);
    if (error) return { ok: false, hata: error.message };

    updateTag(ETIKET.menu);
    return { ok: true };
  } catch (e) {
    return { ok: false, hata: (e as Error).message };
  }
}

export async function urunEkle(
  kategoriId: string,
  ad: string,
  fiyat: number | null,
): Promise<EylemSonuc> {
  try {
    const db = await yetkiliIstemci();
    const { data: son } = await db
      .from("menu_urunler")
      .select("sira")
      .eq("kategori_id", kategoriId)
      .order("sira", { ascending: false })
      .limit(1);

    const { error } = await db.from("menu_urunler").insert({
      kategori_id: kategoriId,
      ad,
      fiyat,
      sira: (son?.[0]?.sira ?? 0) + 1,
    });
    if (error) return { ok: false, hata: error.message };

    updateTag(ETIKET.menu);
    return { ok: true };
  } catch (e) {
    return { ok: false, hata: (e as Error).message };
  }
}

export async function urunSil(urunId: string): Promise<EylemSonuc> {
  try {
    const db = await yetkiliIstemci();
    const { error } = await db.from("menu_urunler").delete().eq("id", urunId);
    if (error) return { ok: false, hata: error.message };

    updateTag(ETIKET.menu);
    return { ok: true };
  } catch (e) {
    return { ok: false, hata: (e as Error).message };
  }
}

/* -------------------------------------------------------------------------- */

export async function saatGuncelle(
  gun: number,
  alanlar: { acilis?: string; kapanis?: string; kapali?: boolean },
): Promise<EylemSonuc> {
  try {
    const db = await yetkiliIstemci();
    const { error } = await db
      .from("calisma_saatleri")
      .update(alanlar)
      .eq("gun", gun);
    if (error) return { ok: false, hata: error.message };

    // Saat değişikliği "şu an açık" rozetini ve yapısal veriyi etkiliyor.
    updateTag(ETIKET.saatler);
    revalidatePath("/", "layout");
    return { ok: true };
  } catch (e) {
    return { ok: false, hata: (e as Error).message };
  }
}

/* -------------------------------------------------------------------------- */

export async function ayarGuncelle(
  anahtar: string,
  deger: unknown,
): Promise<EylemSonuc> {
  try {
    const db = await yetkiliIstemci();
    const { error } = await db
      .from("site_ayarlar")
      .upsert({ anahtar, deger }, { onConflict: "anahtar" });
    if (error) return { ok: false, hata: error.message };

    updateTag(ETIKET.ayarlar);
    revalidatePath("/", "layout");
    return { ok: true };
  } catch (e) {
    return { ok: false, hata: (e as Error).message };
  }
}

/* -------------------------------------------------------------------------- */

/**
 * İlk kurulum: `content/blog.ts` içindeki yazıları veritabanına aktarır.
 *
 * Neden bir düğme? Aktarım, giriş yapmış kullanıcının oturumuyla çalışıyor —
 * anonim anahtar RLS yüzünden yazamıyor ve yazmamalı da. Tek seferlik bir
 * kurulum adımı olduğu için otomatik değil, bilinçli bir tıklama.
 *
 * Aynı slug ikinci kez eklenmez; tekrar basılması zarar vermez.
 */
export async function blogTohumla(): Promise<EylemSonuc & { eklenen?: number }> {
  try {
    const db = await yetkiliIstemci();
    const { yazilar } = await import("@/content/blog");

    const { data: mevcut } = await db.from("blog_yazilar").select("slug");
    const varOlan = new Set((mevcut ?? []).map((m) => m.slug));
    const yeni = yazilar.filter((y) => !varOlan.has(y.slug));
    if (yeni.length === 0) return { ok: true, eklenen: 0 };

    const { error } = await db.from("blog_yazilar").insert(
      yeni.map((y) => ({
        slug: y.slug,
        baslik: y.h1,
        seo_baslik: y.title,
        aciklama: y.description,
        ozet: y.ozet,
        etiket: y.etiket,
        gorsel: y.image,
        gorsel_alt: y.alt,
        bloklar: y.bloklar,
        ilgili: y.ilgili,
        okuma_dakika: y.okumaDakika,
        durum: "yayinda",
        yayin_tarihi: y.tarih,
      })),
    );
    if (error) return { ok: false, hata: error.message };

    updateTag(ETIKET.blog);
    return { ok: true, eklenen: yeni.length };
  } catch (e) {
    return { ok: false, hata: (e as Error).message };
  }
}

export async function yaziDurumDegistir(
  id: string,
  durum: "taslak" | "yayinda",
): Promise<EylemSonuc> {
  try {
    const db = await yetkiliIstemci();
    const { error } = await db
      .from("blog_yazilar")
      .update({ durum })
      .eq("id", id);
    if (error) return { ok: false, hata: error.message };
    updateTag(ETIKET.blog);
    return { ok: true };
  } catch (e) {
    return { ok: false, hata: (e as Error).message };
  }
}

export async function yaziSil(id: string): Promise<EylemSonuc> {
  try {
    const db = await yetkiliIstemci();
    const { error } = await db.from("blog_yazilar").delete().eq("id", id);
    if (error) return { ok: false, hata: error.message };
    updateTag(ETIKET.blog);
    return { ok: true };
  } catch (e) {
    return { ok: false, hata: (e as Error).message };
  }
}

/* -------------------------------------------------------------------------- */

export async function sssGuncelle(
  id: string,
  alanlar: { soru?: string; cevap?: string; yayinda?: boolean },
): Promise<EylemSonuc> {
  try {
    const db = await yetkiliIstemci();
    const { error } = await db.from("sss").update(alanlar).eq("id", id);
    if (error) return { ok: false, hata: error.message };
    updateTag(ETIKET.sss);
    return { ok: true };
  } catch (e) {
    return { ok: false, hata: (e as Error).message };
  }
}

export async function sssEkle(soru: string, cevap: string): Promise<EylemSonuc> {
  try {
    const db = await yetkiliIstemci();
    const { data: son } = await db
      .from("sss")
      .select("sira")
      .order("sira", { ascending: false })
      .limit(1);
    const { error } = await db
      .from("sss")
      .insert({ soru, cevap, sira: (son?.[0]?.sira ?? 0) + 1 });
    if (error) return { ok: false, hata: error.message };
    updateTag(ETIKET.sss);
    return { ok: true };
  } catch (e) {
    return { ok: false, hata: (e as Error).message };
  }
}

export async function sssSil(id: string): Promise<EylemSonuc> {
  try {
    const db = await yetkiliIstemci();
    const { error } = await db.from("sss").delete().eq("id", id);
    if (error) return { ok: false, hata: error.message };
    updateTag(ETIKET.sss);
    return { ok: true };
  } catch (e) {
    return { ok: false, hata: (e as Error).message };
  }
}

/* -------------------------------------------------------------------------- */

export async function yorumGuncelle(
  id: string,
  alanlar: { yazan?: string; puan?: number; metin?: string; yayinda?: boolean },
): Promise<EylemSonuc> {
  try {
    const db = await yetkiliIstemci();
    const { error } = await db.from("yorumlar").update(alanlar).eq("id", id);
    if (error) return { ok: false, hata: error.message };
    updateTag(ETIKET.yorumlar);
    return { ok: true };
  } catch (e) {
    return { ok: false, hata: (e as Error).message };
  }
}

export async function yorumEkle(
  yazan: string,
  puan: number,
  metin: string,
  tarih: string,
): Promise<EylemSonuc> {
  try {
    const db = await yetkiliIstemci();
    const { error } = await db.from("yorumlar").insert({ yazan, puan, metin, tarih });
    if (error) return { ok: false, hata: error.message };
    updateTag(ETIKET.yorumlar);
    return { ok: true };
  } catch (e) {
    return { ok: false, hata: (e as Error).message };
  }
}

export async function yorumSil(id: string): Promise<EylemSonuc> {
  try {
    const db = await yetkiliIstemci();
    const { error } = await db.from("yorumlar").delete().eq("id", id);
    if (error) return { ok: false, hata: error.message };
    updateTag(ETIKET.yorumlar);
    return { ok: true };
  } catch (e) {
    return { ok: false, hata: (e as Error).message };
  }
}
