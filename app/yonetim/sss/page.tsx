import { redirect } from "next/navigation";
import { SssEkran } from "@/components/yonetim/SssEkran";
import { sunucuIstemcisi } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default async function SssYonetim() {
  const db = await sunucuIstemcisi();
  const {
    data: { user },
  } = await db.auth.getUser();
  if (!user) redirect("/yonetim");

  const { data, error } = await db
    .from("sss")
    .select("id, soru, cevap")
    .order("sira");

  if (error) {
    return <p className="font-sans text-base text-red">Okunamadı: {error.message}</p>;
  }

  return (
    <>
      <h1 className="font-display text-3xl tracking-tight text-bone sm:text-4xl">
        Sık sorulan sorular
      </h1>
      <p className="mt-2 max-w-[64ch] font-sans text-sm text-bone/50">
        Yapay zekâ araçları bu cevapları birebir alıntılıyor. Yalnızca
        doğruladığın bilgiyi yaz — tahmin yazmak yanlış bilginin yayılması
        demek.
      </p>

      <div className="mt-10">
        <SssEkran kayitlar={data ?? []} />
      </div>
    </>
  );
}
