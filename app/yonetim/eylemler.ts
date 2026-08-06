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
