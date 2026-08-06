import { redirect } from "next/navigation";
import { MenuDuzenle, type PanelKategori } from "@/components/yonetim/MenuDuzenle";
import { sunucuIstemcisi } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default async function MenuYonetim() {
  const db = await sunucuIstemcisi();
  const {
    data: { user },
  } = await db.auth.getUser();
  if (!user) redirect("/yonetim");

  const { data, error } = await db
    .from("menu_kategoriler")
    .select("id, ad, sira, menu_urunler(id, ad, fiyat, not_metni, imza, yayinda, sira)")
    .order("sira");

  if (error) {
    return (
      <p className="font-sans text-base text-red">
        Menü okunamadı: {error.message}
      </p>
    );
  }

  const kategoriler: PanelKategori[] = (data ?? []).map((k) => ({
    id: k.id,
    ad: k.ad,
    urunler: (k.menu_urunler ?? [])
      .sort((a, b) => a.sira - b.sira)
      .map((u) => ({
        id: u.id,
        ad: u.ad,
        fiyat: u.fiyat === null ? null : Number(u.fiyat),
        not_metni: u.not_metni ?? "",
        imza: u.imza,
        yayinda: u.yayinda,
      })),
  }));

  return (
    <>
      <h1 className="font-display text-3xl tracking-tight text-bone sm:text-4xl">
        Menü ve fiyatlar
      </h1>
      <p className="mt-2 max-w-[60ch] font-sans text-sm text-bone/50">
        Bir satırı değiştirip Kaydet&apos;e bas — site birkaç saniye içinde
        güncellenir. Fiyat kutusunu boş bırakırsan o üründe fiyat hiç
        gösterilmez.
      </p>

      <div className="mt-10">
        <MenuDuzenle kategoriler={kategoriler} />
      </div>
    </>
  );
}
