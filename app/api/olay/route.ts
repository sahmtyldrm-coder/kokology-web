import { createClient } from "@supabase/supabase-js";
import { kaynakBelirle, botBelirle } from "@/lib/takip";

/**
 * Olay kaydı — ziyaret ve tıklamalar.
 *
 * Kişisel veri toplanmıyor: IP, çerez kimliği, oturum kimliği hiçbiri
 * saklanmıyor. Yalnızca "ne oldu, hangi sayfada, nereden gelindi". Bu yüzden
 * çerez onayı beklemeden çalışabiliyor; Meta Pixel ve GA4 gibi araçlar farklı,
 * onlar onay sonrası devreye girecek.
 *
 * Yapay zekâ TARAYICILARI buradan geçmez — onlar JavaScript çalıştırmıyor.
 * Onların kaydı `proxy.ts` içinde sunucu tarafında tutuluyor.
 */

const IZINLI_TIPLER = new Set([
  "sayfa",
  "ara",
  "yol_tarifi",
  "siparis",
  "menu",
  "qr",
]);

export async function POST(istek: Request) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  // Ölçüm altyapısı yoksa sessizce başarılı dön — site çalışmaya devam etsin.
  if (!url || !key) return new Response(null, { status: 204 });

  let govde: { tip?: string; yol?: string; referrer?: string };
  try {
    govde = await istek.json();
  } catch {
    return new Response(null, { status: 400 });
  }

  const tip = String(govde.tip ?? "");
  if (!IZINLI_TIPLER.has(tip)) return new Response(null, { status: 400 });

  const ua = istek.headers.get("user-agent") ?? "";
  const { bot } = botBelirle(ua);
  // Bot trafiği burada sayılmaz; tarayıcı botları JS çalıştırmadığı için
  // buraya düşen bir bot varsa da ziyaret istatistiğini kirletmemeli.
  if (bot) return new Response(null, { status: 204 });

  // hostname (port'suz) karşılaştırılır: `host` port içerdiği için
  // localhost:3000 ile localhost eşleşmiyor ve site içi gezinme dış kaynak
  // sayılıyordu.
  const hostname = new URL(istek.url).hostname;
  const { kaynak, kaynakAd } = kaynakBelirle(
    String(govde.referrer ?? ""),
    hostname,
  );

  const db = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  await db.from("olaylar").insert({
    tip,
    yol: String(govde.yol ?? "").slice(0, 200),
    kaynak,
    kaynak_ad: kaynakAd.slice(0, 80),
    bot: false,
  });

  return new Response(null, { status: 204 });
}
