import { createBrowserClient } from "@supabase/ssr";

/**
 * Tarayıcı tarafı Supabase bağlantısı — panel formları ve oturum.
 *
 * Sunucu istemcisinden AYRI dosyada: sunucu tarafı `next/headers` kullanıyor
 * ve ikisi aynı modülde olursa o import istemci paketine sızıp derlemeyi
 * kırıyor.
 *
 * Yalnızca publishable (anon) anahtar kullanılır; servis anahtarı hiçbir yerde
 * yok. Yazma yetkisi Postgres'in satır seviyesi güvenliğinden gelir — okuma
 * herkese açık, yazma yalnızca giriş yapmışa. Bu anahtar tek başına hiçbir
 * şey yazamaz.
 */
export function tarayiciIstemcisi() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  );
}
