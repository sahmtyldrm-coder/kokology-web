import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Sunucu tarafı Supabase bağlantısı — panel sayfaları ve sunucu eylemleri.
 *
 * `server-only`: bu modül yanlışlıkla bir istemci bileşenine import edilirse
 * derleme anında hata verir. `next/headers` istemci paketine sızarsa derleme
 * kırılıyor; bu koruma o hatayı kaynağında yakalar.
 *
 * Tarayıcı tarafı için `lib/supabase-tarayici.ts`.
 */

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

/** Yapılandırma eksikse site veritabanısız çalışmaya devam eder. */
export const supabaseHazir = Boolean(URL && KEY);

export async function sunucuIstemcisi() {
  const cerezler = await cookies();
  return createServerClient(URL!, KEY!, {
    cookies: {
      getAll: () => cerezler.getAll(),
      setAll: (yeni) => {
        try {
          yeni.forEach(({ name, value, options }) =>
            cerezler.set(name, value, options),
          );
        } catch {
          // Server Component içinden çağrıldığında çerez yazılamaz; oturum
          // yenilemesi sunucu eylemlerinde yapıldığı için güvenle yutulabilir.
        }
      },
    },
  });
}
