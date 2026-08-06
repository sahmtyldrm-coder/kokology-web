import { redirect } from "next/navigation";
import { SaatDuzenle, type PanelSaat } from "@/components/yonetim/SaatDuzenle";
import { sunucuIstemcisi } from "@/lib/supabase";

export const dynamic = "force-dynamic";

/** Pazartesi başta görünsün; veritabanında 0 = Pazar. */
const SIRA = [1, 2, 3, 4, 5, 6, 0];

export default async function SaatlerYonetim() {
  const db = await sunucuIstemcisi();
  const {
    data: { user },
  } = await db.auth.getUser();
  if (!user) redirect("/yonetim");

  const { data, error } = await db
    .from("calisma_saatleri")
    .select("gun, etiket, acilis, kapanis, kapali");

  if (error) {
    return (
      <p className="font-sans text-base text-red">
        Saatler okunamadı: {error.message}
      </p>
    );
  }

  const saatler: PanelSaat[] = SIRA.map(
    (g) => (data ?? []).find((s) => s.gun === g),
  ).filter(Boolean) as PanelSaat[];

  return (
    <>
      <h1 className="font-display text-3xl tracking-tight text-bone sm:text-4xl">
        Çalışma saatleri
      </h1>
      <p className="mt-2 max-w-[62ch] font-sans text-sm text-bone/50">
        Sitedeki &ldquo;şu an açık&rdquo; rozeti ve Google&apos;a giden yapısal
        veri buradan besleniyor. Kapanış açılıştan küçük olabilir — 11.00–02.00
        gibi gece yarısını aşan vardiyalar doğru hesaplanır.
      </p>

      <div className="mt-10">
        <SaatDuzenle saatler={saatler} />
      </div>
    </>
  );
}
