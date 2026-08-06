# Kokology — Faz 1 tanıtım sitesi

Bursa Nilüfer / Cadde Ataevler. Tek scroll tanıtım sitesi: menü, mekân, konum,
tıkla-ara, yol tarifi. Hedef yerel SEO ve mobil kullanışlılık.

## Çalıştırma

```bash
npm run dev     # http://localhost:3000
npm run build   # üretim derlemesi (tüm sayfalar statik)
npm start
```

## Yığın

| Katman | Seçim |
| --- | --- |
| Framework | Next.js 16.3 (App Router, Turbopack) |
| Dil | TypeScript |
| Stil | Tailwind CSS v4 |
| Animasyon | `motion` (Framer Motion'ın güncel paketi) |
| Font | `next/font` — Anton, Fraunces, Hanken Grotesk, Caveat |
| Deploy | Vercel |

### Brief'ten iki sapma

1. **`tailwind.config.ts` yok.** Tailwind v4 CSS-first yapılandırma kullanıyor;
   marka renk ve font tokenları `app/globals.css` içindeki `@theme` bloğunda.
   Sınıflar aynı çalışır: `bg-charcoal`, `text-brass`, `font-display`.
2. **`next-sitemap` kurulmadı.** Next 16'nın yerleşik `app/sitemap.ts` ve
   `app/robots.ts` dosyaları aynı işi ek bağımlılık olmadan yapıyor.

## Sayfalar

| Yol | Amaç | Dizine girer mi |
| --- | --- | --- |
| `/` | Tek scroll tanıtım — hero, manifesto, menü, mekân, miras, kültür, S.S.S., bul bizi | Evet |
| `/menu` | Menü ve fiyatların kendi başlığı/açıklamasıyla ayrı sayfası. "bursa kokoreç fiyatları" gibi sorgular için ikinci giriş kapısı | Evet |
| `/qr` | Masadan okutulan QR menü. Görselsiz, tek sütun, kategori sekmeli | Hayır — içerik `/menu` ile aynı olduğu için `noindex` + canonical `/menu` |

Yol tablosuna `/menu/[kategori]` de girer: `kokorec`, `kofte`, `sucuk`,
`midye`, `pilav`, `icecekler`. Her biri ayrı arama hedefi, ayrı yapısal veri.
Ayrıca `/hakkimizda` ve `/bul-bizi`.

### QR kodu

```bash
npm run qr     # public/qr-menu.svg (baskı) + public/qr-menu.png üretir
```

Kodun gittiği adres `business.siteUrl` + `business.qr.hedefYol` birleşimidir.
**Hedef yol ayrı tutuluyor ki kampanyada kodu yeniden bastırmadan yönlendirme
değiştirilebilsin** — bayram menüsü için `/menu/kokorec`, duyuru için `/`.
Faz D'de bu alan admin panelinden düzenlenecek.

> **`business.siteUrl` gerçek alan adıyla güncellenmeden basılan QR yanlış
> adrese gider.** Script bunu tespit edip uyarıyor; alan adı netleşince komutu
> tekrar çalıştır, masa kartlarını ondan sonra bastır.

### Görsel standardı

Sitedeki her görsel şu kurallara uyar:

- **Dosya adı** küçük harf, tireli, Türkçe anahtar kelimeli, konum içerir
- **Alt metin** ne göründüğünü + nerede olduğunu söyler (Bursa / Nilüfer / Ataevler)
- **Sunum formatı** `next/image` üzerinden AVIF/WebP; kaynaklar sıkıştırılmış JPEG/PNG

Denetim script'i `scripts/` altında değil, geliştirme sırasında kullanıldı;
yeni görsel eklerken aynı kurallara uyulması yeterli.

**İçecek görselleri hakkında:** üreticilerin e-ticaret çekimleri. Beyaz zemin
köşelerden taşırma yöntemiyle kaldırıldı (eşik tabanlı silme cam şişeleri
deler). Gerçek şişe pikselleri 106–367px arasında — satır içi küçük görsel ve
dizilim olarak sorunsuz, tek tek büyük kullanım için uygun değiller. Telifleri
işletmeye ait değil.

## Ölçümleme

`.env.ornek` dosyasını `.env.local` olarak kopyala:

- `NEXT_PUBLIC_GA_ID` — Google Analytics 4 ölçüm kimliği
- `NEXT_PUBLIC_GSC_VERIFICATION` — Search Console doğrulama kodu

İkisi de boş bırakılabilir; tanımlı değilse ilgili etiket hiç basılmaz.

## Klasör yapısı

```
app/
  layout.tsx      fontlar, metadata, Open Graph, JSON-LD
  page.tsx        bölümleri sıraya dizen tek sayfa
  globals.css     marka tokenları (@theme) + doku/erişilebilirlik katmanı
  sitemap.ts robots.ts
components/       Hero, Manifesto, Menu, Space, Heritage, Culture, FindUs,
                  Footer, Nav, StickyCTA, ScrollProgress, Reveal, Wordmark
content/tr.ts     SİTEDEKİ TÜM METİNLER — tek doğruluk noktası
lib/
  hours.ts        "şu an açık" hesabı (Europe/Istanbul sabitli)
  schema.ts       JSON-LD üretimi + kırmızı CTA'nın hedefi
public/images/    urun/ (13 ürün) · mekan/ (15 mekân ve dış cephe)
```

## Çalışma kuralları

**Metin değiştirmek için bileşene dokunma.** Her metin `content/tr.ts` içinde.
Faz 2'de `content/en.ts` aynı şekli uygulayarak İngilizce eklenebilir.

**Kırmızı yalnızca tek aksiyon içindir.** `lib/schema.ts` içindeki
`primaryAction()`, `business.ordering` altında herhangi bir sipariş linki
varsa CTA'yı "Sipariş"e, yoksa "Ara"ya çevirir. Şu an sipariş linki yok,
bu yüzden tüm kırmızı butonlar telefonu arıyor.

**Fiyat opsiyonel.** `menu.items[].price` `null` bırakılırsa fiyat alanı hiç
render edilmez ve JSON-LD'ye `offers` yazılmaz. Site fiyatsız da doğru görünür.

**Sahte yorum yok.** `culture.reviews` boş olduğu sürece yorum bloğu ve
`AggregateRating` yapısal verisi üretilmez. Uydurma puan yayınlamak Google
için manipülasyondur ve işletme profilinin cezalandırılma sebebidir.

**S.S.S.'ye yalnızca doğrulanmış bilgi.** Yapay zekâ araçları bu cevapları
birebir alıntılıyor; tahmin yazmak yanlış bilginin yayılması demek. Teyit
edilmemiş sorular `content/tr.ts` → `faq` üstündeki TODO listesinde bekletilir.

**Kimlik sırası: önce kokoreççi, sonra sokak lezzetleri.** Başlık, açıklama,
H1 ve anahtar kelimeler bu sıraya göre kurulu. Yeni metin yazarken ana terim
"kokoreç", ikincil terim "sokak lezzetleri".

**Yapısal veri sayfaya bağlıdır.** `siteSchema()` her sayfada (işletme + site),
`homeSchema()` yalnızca ana sayfada (menü + S.S.S.), `menuPageSchema()` yalnızca
`/menu` sayfasında basılır. Sayfada karşılığı olmayan içeriği işaretlemek yanlış
beyandır; Google da onu eler.

## Türkçe tipografi notları

- Dört fontun hepsi `latin-ext` alt kümesiyle yükleniyor — `ş ğ ı İ ç ö ü` tam.
- Anton başlıklarda satır yüksekliği bilinçli olarak gevşetildi; 0.84 gibi sıkı
  bir değer `Ş` ve `Ç` sedillerini bir sonraki satıra bindirip kırpıyordu.
  `.font-display` ayrıca `padding-bottom: 0.07em` taşıyor.
- Sayfa `lang="tr"` olduğu için CSS `uppercase`, İngilizce metinlerdeki `i`
  harfini `İ`ye çeviriyor ("STREET GRİLL CULTURE"). İngilizce ibareler
  (`Street Grill Culture`, `Old Turkish Delicious`, sosyal medya adları)
  `lang="en"` ile işaretlendi. **Yeni İngilizce metin eklerken aynısını yap.**

## Erişilebilirlik

- `prefers-reduced-motion` açıkken tüm reveal/parallax devre dışı; içerik ilk
  karede tam ve yerinde. `components/Reveal.tsx` bunu `useReducedMotion` ile
  bileşen seviyesinde de uyguluyor.
- Dokunmatik hedefler ≥ 44px; ana aksiyon butonları 52–56px.
- Durum rozeti renge tek başına yaslanmıyor (nokta + metin birlikte).
- İçeriğe atlama bağlantısı, `:focus-visible` pirinç halka, H1→H2→H3 hiyerarşisi.

---

## ⚠️ Canlıya çıkmadan önce doldurulacaklar

Hepsi `content/tr.ts` içinde `TODO:` ile işaretli. Yerel SEO'nun tamamı bu
verilere dayanıyor ve **Google İşletme Profili ile birebir aynı** olmalı
(NAP tutarlılığı).

| # | Alan | Neden kritik |
| --- | --- | --- |
| 1 | `business.hours[].opens` | **Kapanış 02:00 teyitli, AÇILIŞ saatleri hâlâ tahmin (11:00).** Yanlışsa "şu an açık" rozeti yanlış gösterir. |
| 2 | `business.siteUrl` | Alan adı alınınca. Canonical, Open Graph, sitemap ve JSON-LD'deki tüm mutlak adresler buradan türüyor. |
| 3 | `business.legalName` | Faturadaki resmi ticari unvan |
| 4 | `business.ordering.*` | Platformlar aktifleşince. İlk link girildiği an tüm kırmızı butonlar "Sipariş"e döner. |

### Yayına çıkar çıkmaz

Google İşletme Profilinde **"Web sitesi ekle"** boş — alan adı yayına
alındığında oraya girilmeli. Site ↔ profil bağı yerel SEO'nun en güçlü
sinyallerinden biri.

### Tamamlananlar

- **NAP** girildi: 0531 715 11 95 · Yılmaz Akkılıç Cd. No:18/A, Ataevler,
  16140 Nilüfer/Bursa · 40.2206, 28.96009. Hepsi Google İşletme Profilinden
  teyitli.
- **Menü** basılı menüden birebir girildi: 6 kategori, 27 kalem, fiyatlarıyla
  (`menu.sections`). Basılı menünün iki yüzü `public/images/menu/` altında ve
  "Basılı menüyü gör" bağlantısıyla açılıyor.
- **Logo** marka PDF'inden (saf vektör) alfa kanalı korunarak
  `public/logo-kokology.png` olarak üretildi; nav ve footer'da rozet + Anton
  wordmark lockup'ı hâlinde.
- **Yorumlar** Google'dan 6 gerçek yorum + profilin toplam puanı (5,0 / 20).
- **Olanaklar** (açık hava bölümü, Wi-Fi, oyun alanı) Bul Bizi'de ve schema
  `amenityFeature` içinde.
- **Ürün kapsamı**: döner ve burger yok, menüdekiler yelpazenin tamamı.

### İki not

> Basılı menüde **"Uludağ Minarelli Su"** yazıyor; muhtemelen "Mineralli"
> olacaktı. Siteye basılı hâliyle girildi — `content/tr.ts` → `icecekler`.

> `aggregateRating`, Google'ın kendi profilinden alınan 5,0 / 20 yorum. Google,
> işletmenin kendi sitesinde yayınladığı bu tür "self-serving" puanları yıldızlı
> zengin sonuç olarak göstermez — yani markup ceza değil, yok sayılabilir.
> Ziyaretçi için ve diğer arama/AI motorları için değerli olduğundan bırakıldı.
> Puan Google'da değiştikçe `culture.rating` elle güncellenmeli.

### Sonraki faz — planlanan

1. **Admin paneli (Supabase).** Giriş, menü/fiyat, saat/iletişim, fotoğraf
   yükleme, metin ve yorum yönetimi. İçerik `content/tr.ts`'ten veritabanına
   taşınır; dosya yapısı aynı kalır, kaynak değişir.
2. **Blog.** `/blog` ve `/blog/[slug]`, `Article` yapısal verisi, panelden
   yazı girişi. Yerel SEO için sürekli tazelenen içerik kaynağı.
3. **Panel istatistikleri.** Ziyaret, tıkla-ara / yol tarifi / sipariş
   tıklamaları, yorum takibi.
4. **Yapay zekâ görünürlüğü.** Ayrıntı ve sınırlar için aşağıdaki nota bak.
5. İleride: online rezervasyon/sipariş, İngilizce (`content/en.ts`), bülten
   formunun gerçek servise bağlanması, Instagram feed'i.

#### Yapay zekâ ölçümü hakkında dürüst not

"Son 30 günde kaç yapay zekâ sorgusunda çıktık" **ölçülemez** — ChatGPT,
Gemini veya Perplexity kendi sorgu hacmini kimseyle paylaşmıyor. Bunu vaat eden
araçlar tahmin üretiyor.

Gerçekten ölçülebilen iki şey var ve ikisi de panele konabilir:

- **Yapay zekâdan gelen ziyaretler** — `referrer` alanı `chatgpt.com`,
  `perplexity.ai`, `gemini.google.com`, `copilot.microsoft.com`, `claude.ai`
  olan oturumlar. "Bir yapay zekâ bizi önerdi ve kullanıcı tıkladı" demektir.
- **Yapay zekâ botlarının taramaları** — `GPTBot`, `OAI-SearchBot`,
  `ChatGPT-User`, `PerplexityBot`, `ClaudeBot`, `Google-Extended` gibi
  ajanların hangi sayfayı ne sıklıkla çektiği. "İçeriğimiz modellerin
  görüş alanında mı" sorusunun cevabı.

Bu ikisi birlikte gerçek bir görünürlük eğrisi verir; "sorgu sayısı" vermez.
