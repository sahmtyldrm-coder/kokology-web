import { redirect } from "next/navigation";
import { YorumEkran } from "@/components/yonetim/YorumEkran";
import { sunucuIstemcisi } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default async function YorumYonetim() {
  const db = await sunucuIstemcisi();
  const {
    data: { user },
  } = await db.auth.getUser();
  if (!user) redirect("/yonetim");

  const { data, error } = await db
    .from("yorumlar")
    .select("id, yazan, puan, metin, tarih")
    .order("sira");

  if (error) {
    return <p className="font-sans text-base text-red">Okunamadı: {error.message}</p>;
  }

  return (
    <>
      <h1 className="font-display text-3xl tracking-tight text-bone sm:text-4xl">
        Öne çıkan yorumlar
      </h1>
      <p className="mt-2 max-w-[64ch] font-sans text-sm text-bone/50">
        Sitede gösterilecek Google yorumları. Yalnızca <strong className="text-bone/80">gerçek</strong>{" "}
        yorumları gir — uydurma yorum yayınlamak Google için manipülasyondur ve
        işletme profilinin cezalandırılma sebebidir.
      </p>

      <div className="mt-10">
        <YorumEkran kayitlar={data ?? []} />
      </div>
    </>
  );
}
