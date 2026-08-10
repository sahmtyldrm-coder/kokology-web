import Script from "next/script";

/**
 * Üçüncü taraf izleme kodları.
 *
 * ÖNEMLİ: Bu bileşen yalnızca ziyaretçi onay verdiğinde render edilir.
 * "Yükle ama bekle" değil — onay yoksa kodlar sayfaya hiç basılmaz. Yüklenip
 * sonra susturulan bir piksel, ağ isteğini zaten yapmış olur ve rıza öncesi
 * veri toplamış sayılır.
 *
 * Boş bırakılan kimlik için ilgili kod hiç eklenmez; panelde sadece kullandığın
 * aracı doldurman yeterli.
 */
export type TakipKodlari = {
  gtm?: string;
  ga4?: string;
  metaPixel?: string;
  googleAds?: string;
};

export function Pikseller({ kodlar }: { kodlar: TakipKodlari }) {
  // Kimlikler panele elle yapıştırılıyor ve baştaki/sondaki görünmez boşluk
  // (sekme, satır sonu) çok kolay geliyor. Temizlenmezse script adresi ve
  // gtag config'i bozulur, kod sessizce hiç çalışmaz.
  const temiz = (v?: string) => v?.trim() || undefined;
  const gtm = temiz(kodlar.gtm);
  const ga4 = temiz(kodlar.ga4);
  const metaPixel = temiz(kodlar.metaPixel);
  const googleAds = temiz(kodlar.googleAds);

  // GTM varsa diğerlerini onun içinden yönetmek daha doğru; ama panelde ayrı
  // ayrı girilebildiği için burada da bağımsız yükleniyorlar. İkisini birden
  // dolduracaksan GA4'ü GTM içine taşı, yoksa sayfa görüntüleme iki kez sayılır.
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

      {(ga4 || googleAds) && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${ga4 || googleAds}`}
            strategy="afterInteractive"
          />
          <Script id="gtag" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
${ga4 ? `gtag('config','${ga4}');` : ""}
${googleAds ? `gtag('config','${googleAds}');` : ""}`}
          </Script>
        </>
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
