import { redirect } from "next/navigation";
import { BlogEkran, type PanelYazi } from "@/components/yonetim/BlogEkran";
import { sunucuIstemcisi } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default async function BlogYonetim() {
  const db = await sunucuIstemcisi();
  const {
    data: { user },
  } = await db.auth.getUser();
  if (!user) redirect("/yonetim");

  const { data, error } = await db
    .from("blog_yazilar")
    .select("id, slug, baslik, etiket, durum, yayin_tarihi")
    .order("yayin_tarihi", { ascending: false });

  if (error) {
    return <p className="font-sans text-base text-red">Okunamadı: {error.message}</p>;
  }

  return (
    <>
      <h1 className="font-display text-3xl tracking-tight text-bone sm:text-4xl">
        Blog
      </h1>
      <p className="mt-2 max-w-[64ch] font-sans text-sm text-bone/50">
        Taslaktaki yazılar sitede görünmez ve sitemap&apos;e girmez. Yayından
        almak silmek değildir — hatalı bir yazıyı gizleyip düzeltebilirsin.
      </p>

      <div className="mt-10">
        <BlogEkran yazilar={(data ?? []) as PanelYazi[]} />
      </div>
    </>
  );
}
