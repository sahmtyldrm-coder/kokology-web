import { redirect } from "next/navigation";
import { FotografEkran, type Dosya } from "@/components/yonetim/FotografEkran";
import { sunucuIstemcisi } from "@/lib/supabase";

export const dynamic = "force-dynamic";

const KOVA = "gorseller";

export default async function FotografYonetim() {
  const db = await sunucuIstemcisi();
  const {
    data: { user },
  } = await db.auth.getUser();
  if (!user) redirect("/yonetim");

  const { data, error } = await db.storage
    .from(KOVA)
    .list("", { limit: 200, sortBy: { column: "created_at", order: "desc" } });

  const temel = db.storage.from(KOVA);
  const dosyalar: Dosya[] = (data ?? [])
    // Supabase boş klasörleri bu gizli dosyayla işaretliyor; listeye girmemeli.
    .filter((d) => d.name !== ".emptyFolderPlaceholder")
    .map((d) => ({
      ad: d.name,
      url: temel.getPublicUrl(d.name).data.publicUrl,
      boyutKb: Math.round(((d.metadata?.size as number) ?? 0) / 1024),
      tarih: String(d.created_at ?? "").slice(0, 10),
    }));

  return (
    <>
      <h1 className="font-display text-3xl tracking-tight text-bone sm:text-4xl">
        Fotoğraflar
      </h1>
      <p className="mt-2 max-w-[64ch] font-sans text-sm text-bone/50">
        Yüklediğin görselin adresini kopyalayıp menü ürününe veya blog yazısına
        yapıştırabilirsin. Dosya adları otomatik olarak arama dostu biçime
        çevriliyor.
      </p>

      {error && (
        <p role="alert" className="mt-6 font-sans text-sm text-red">
          Liste okunamadı: {error.message}
        </p>
      )}

      <div className="mt-10">
        <FotografEkran baslangic={dosyalar} />
      </div>
    </>
  );
}
