import { NextResponse, type NextRequest } from "next/server";
import { botBelirle } from "@/lib/takip";

/**
 * Yapay zekâ tarayıcılarının kaydı.
 *
 * Bu botlar JavaScript çalıştırmıyor, dolayısıyla istemci tarafındaki olay
 * kaydına hiç düşmüyorlar. Görünürlüğü ölçmek için isteği sunucuda yakalamak
 * şart. Proxy her istekte çalışıyor ama yalnızca YAPAY ZEKÂ BOTU olduğunda
 * veritabanına yazıyor — normal ziyaretçide hiçbir ek iş yapılmıyor, gecikme
 * eklenmiyor ve satır israf edilmiyor.
 *
 * Yazma isteği bilerek beklenmiyor (`void`): ölçüm, sayfanın açılmasını
 * geciktirmemeli. Kayıt başarısız olursa istatistik eksilir, sayfa etkilenmez.
 */
export function proxy(istek: NextRequest) {
  const ua = istek.headers.get("user-agent") ?? "";
  const { bot, botAd } = botBelirle(ua);

  if (bot) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
    if (url && key) {
      void fetch(`${url}/rest/v1/olaylar`, {
        method: "POST",
        headers: {
          apikey: key,
          Authorization: `Bearer ${key}`,
          "Content-Type": "application/json",
          Prefer: "return=minimal",
        },
        body: JSON.stringify({
          tip: "sayfa",
          yol: istek.nextUrl.pathname.slice(0, 200),
          kaynak: "yapay_zeka",
          kaynak_ad: botAd,
          bot: true,
          bot_ad: botAd,
        }),
      }).catch(() => {
        // Ölçüm hatası sayfayı etkilememeli.
      });
    }
  }

  return NextResponse.next();
}

export const config = {
  /**
   * Statik dosyalar, görseller ve panel hariç tut: bot taraması sayfa
   * içeriğiyle ilgili, favicon veya JS paketiyle değil.
   */
  matcher: [
    "/((?!_next/static|_next/image|api|yonetim|favicon.ico|icon.png|apple-icon.png|images|.*\\.(?:png|jpg|jpeg|svg|webp|avif|ico|txt|xml|webmanifest)$).*)",
  ],
};
