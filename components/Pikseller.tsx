import Script from "next/script";

/**
 * Üçüncü taraf izleme kodları.
 *
 * ÖNEMLİ: `Pikseller` yalnızca ziyaretçi onay verdiğinde render edilir.
 * "Yükle ama bekle" değil — onay yoksa kodlar sayfaya hiç basılmaz. Yüklenip
 * sonra susturulan bir piksel, ağ isteğini zaten yapmış olur ve rıza öncesi
 * veri toplamış sayılır.
 *
 * Boş bırakılan kimlik için ilgili kod hiç eklenmez; panelde sadece kullandığın
 * aracı doldurman yeterli.
 *
 * İstisna Google (GA4 + Google Ads): `GoogleEtiketi` onaydan bağımsız
 * yüklenir ama Google İzin Modu v2 ile "reddedildi" varsayımıyla başlar.
 * Onay yokken çerez yazmaz, kimlik saklamaz; yalnızca çerezsiz sinyal
 * gönderir ve Google eksik dönüşümleri bundan modelliyor. Onay yoksa hiç
 * yüklememek, onay vermeyen ziyaretçilerin telefon ve yol tarifi
 * tıklamalarını Google Ads'ten tamamen düşürüyordu. Meta'nın böyle bir modu
 * yok; o yine yalnızca onayla yüklenir.
 */
export type TakipKodlari = {
  gtm?: string;
  ga4?: string;
  metaPixel?: string;
  googleAds?: string;
};

const temiz = (v?: string) => v?.trim() || undefined;

export function Pikseller({ kodlar }: { kodlar: TakipKodlari }) {
  // Kimlikler panele elle yapıştırılıyor ve baştaki/sondaki görünmez boşluk
  // (sekme, satır sonu) çok kolay geliyor. Temizlenmezse script adresi ve
  // gtag config'i bozulur, kod sessizce hiç çalışmaz.
  const gtm = temiz(kodlar.gtm);
  const metaPixel = temiz(kodlar.metaPixel);

  // GA4 / Google Ads burada değil, `GoogleEtiketi`nde: onlar onaydan bağımsız
  // yükleniyor (Google izin modu). GTM'e GA4 de koyarsan sayfa görüntüleme iki
  // kez sayılır — GTM kullanacaksan GA4 kimliğini panelden boşalt.
  return (
    <>
      {gtm && (
        <Script id="gtm" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${gtm}');`}
        </Script>
      )}

      {metaPixel && (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('init','${metaPixel}');fbq('track','PageView');`}
        </Script>
      )}
    </>
  );
}

/**
 * GA4 + Google Ads, İzin Modu v2 (gelişmiş).
 *
 * Varsayılan izinler ilk satırda ve gtag.js'ten ÖNCE "denied" olarak
 * kuyruğa giriyor; config ondan sonra geliyor. Onay çerezi zaten "kabul"
 * ise aynı betikte hemen "granted"a çekiliyor — daha önce kabul etmiş
 * ziyaretçinin ilk sayfa görüntülemesi çerezsiz gitmesin. Sonradan verilen
 * onay `lib/onay.ts` içinde `consent update` ile iletiliyor.
 *
 * url_passthrough: çerez yazılamadığında reklam tıklama kimliği (gclid)
 * site içi linklerde taşınıyor, dönüşüm reklam tıklamasına bağlanabiliyor.
 */
export function GoogleEtiketi({
  kodlar,
  onayCerezi,
}: {
  kodlar: TakipKodlari;
  onayCerezi: string;
}) {
  const ga4 = temiz(kodlar.ga4);
  const googleAds = temiz(kodlar.googleAds);
  if (!ga4 && !googleAds) return null;

  return (
    <>
      <Script id="gtag" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];
function gtag(){dataLayer.push(arguments);}
gtag('consent','default',{ad_storage:'denied',analytics_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',wait_for_update:500});
if(/(?:^|;\\s*)${onayCerezi}=kabul/.test(document.cookie)){gtag('consent','update',{ad_storage:'granted',analytics_storage:'granted',ad_user_data:'granted',ad_personalization:'granted'});}
gtag('set','ads_data_redaction',true);
gtag('set','url_passthrough',true);
gtag('js', new Date());
${ga4 ? `gtag('config','${ga4}');` : ""}
${googleAds ? `gtag('config','${googleAds}');` : ""}`}
      </Script>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${ga4 || googleAds}`}
        strategy="afterInteractive"
      />
    </>
  );
}
