# Kokology web — proje durumu

**Son güncelleme:** 6 Ağustos 2026
**Dal:** `kokology-faz1` · 17 commit · çalışma ağacı temiz

> Bu dosya "nerede kaldık" sorusunun tek cevabı. Projeye aradan zaman geçtikten
> sonra dönüldüğünde önce burası okunmalı.

---

## Projeyi açma

```bash
cd "~/Desktop/Kokology website proje/kokology-web"
git checkout kokology-faz1     # ŞART — main'de yalnızca boş Next.js iskeleti var
npm install
npm run dev                    # http://localhost:3000
```

Panel: `http://localhost:3000/yonetim`

---

## Ne bitti

| Faz | Kapsam | Durum |
| --- | --- | --- |
| Faz 1 | Tanıtım sitesi, marka tasarım sistemi, erişilebilirlik | ✅ |
| SEO paketi | Favicon/ikonlar, OG görseli, manifest, S.S.S., sitemap, robots | ✅ |
| Faz A | Çok sayfalı mimari, yeni hero, hareket dili, cila | ✅ |
| Faz B | Görselli menü, QR sistemi, içecek görselleri, fotoğraf denetimi | ✅ |
| Faz C | Blog (7 yazı), SEO denetimi, `llms.txt` + GEO | ✅ |
| Faz D1 | Supabase + 10 ekranlık yönetim paneli, istatistik | ✅ |
| Faz D2 | KVKK çerez onayı + izleme kodu yükleyicisi | ✅ |
| **Faz D3** | **Yayınlama** | ⏳ alan adı bekleniyor |

### Sayfalar (19 rota)

`/` · `/menu` · `/menu/{kokorec,kofte,sucuk,midye,pilav,icecekler}` ·
`/blog` + 7 yazı · `/hakkimizda` · `/bul-bizi` · `/qr` ·
`llms.txt` · `sitemap.xml` · `robots.txt` · `/yonetim/*` (10 ekran)

---

## Altyapı ve erişimler

| Ne | Nerede |
| --- | --- |
| Kod | `~/Desktop/Kokology website proje/kokology-web` (klasör adında boşluk var, yolu tırnak içinde yaz) |
| Supabase projesi | `kokology` · id `mcdztalchglavwnzrdmh` · eu-central-1 (Frankfurt) · ücretsiz plan |
| Supabase anahtarları | `.env.local` (git'e girmez). Örnek şablon: `.env.ornek` |
| Panel girişi | Supabase Auth. Kullanıcı Supabase panelinden elle eklendi; kayıt formu YOK |
| Görsel arşivi | `~/Desktop/KOKOLOGY/` (ham çekim) ve `~/Desktop/KOKOLOGY BİLGİLER /` (menü, logo, ekran görüntüleri) |
| Ekran görüntüleri | `~/Desktop/KOKOLOGY SITE EKRAN GORUNTULERI/` |

**Servis anahtarı hiçbir yerde kullanılmıyor.** Yazma yetkisi Postgres satır
seviyesi güvenliğinden (RLS) geliyor.

### Veritabanı tabloları

`menu_kategoriler` · `menu_urunler` · `calisma_saatleri` · `site_ayarlar` ·
`sss` · `yorumlar` · `blog_yazilar` · `olaylar`
Depo kovası: `gorseller`

---

## İşletme bilgileri (teyitli)

- **Ad:** Kokology · Google profili: "Kokology Ataevler | Kokoreç & Street Food"
- **Adres:** Yılmaz Akkılıç Cd. No:18/A, Ataevler, 16140 Nilüfer / Bursa
  (Cadde Ataevler içinde)
- **Koordinat:** 40.2206, 28.96009 · Google CID `6399837262169871067`
- **Telefon:** 0531 715 11 95
- **Saatler:** her gün 11.00 – 02.00
- **Ödeme:** tüm kredi/banka kartları + Sodexo, Multinet, Ticket, Setcard,
  Metropol, Edenred
- **Olanaklar:** ücretsiz açık ve kapalı otopark, açık hava bölümü, Wi-Fi,
  çocuk oyun alanı
- **Instagram:** @kokologybursa
- **Google puanı:** 5,0 / 20 yorum (6 tanesi sitede)
- **Açılış:** 1 Ağustos 2026

### Menü
6 kategori, 27 kalem. İmza ürün: **Special Atom** (uykuluklu kokoreç, 1200 ₺).
Döner ve burger YOK — ürün yelpazesi menüdekilerle sınırlı.

---

## Bekleyenler

### Kullanıcıda

1. **Alan adı** — Natro'dan alındı, transfer bekleniyor.
   Gelene kadar QR bastırılamaz, yayına çıkılamaz.
2. **Sipariş platformu linkleri** — Yemeksepeti, Getir Yemek, Uber Eats,
   Migros Yemek, Trendyol Yemek işletme sayfası adresleri.
   İlk link girildiği an kırmızı CTA "Ara"dan "Sipariş"e döner.
3. **Ölçüm kodları** (isteğe bağlı) — GA4, GTM, Meta Pixel, Google Ads.
   Girildiği an çerez onayı bandı devreye girer.
4. **Panel geliştirme listesi** — kullanıcı birkaç iyileştirme isteyecek.
   Panel değişiklikleri yayından sonra da aynı kolaylıkta yapılabilir;
   veritabanı yapısı ve adres değişiklikleri ise yayından ÖNCE ucuz.

### Yapılacak iş

**Faz D3 — yayınlama.** Adım adım: `YAYIN.md`.
GitHub (özel depo) → Vercel + ortam değişkenleri → alan adı/DNS →
panelden alan adını gir → QR'ı yeniden üret → Search Console → Google
İşletme Profiline site adresi.

`gh` ve `vercel` CLI kurulu değil, Homebrew da yok — depo ve Vercel
bağlantısı kullanıcının hesabından elle yapılacak.

---

## Mimari kararlar (değiştirmeden önce oku)

**Veritabanı kaynak, `content/*.ts` geri düşme.** Veritabanı erişilemezse site
sessizce dosyalardan okur ve çalışmaya devam eder. Bir restoran sitesinin
"panel çöktü" diye menüsünü gösterememesi kabul edilemez.

**Sayfalar statik kalmalı.** Kök düzende `cookies()` veya `headers()` çağırmak
TÜM sayfaları dinamikleştirir. Bu bir kez oldu ve geri alındı. Derleme
çıktısında `○`/`●` işaretleri kaybolduysa gerileme var demektir.

**Kırmızı yalnızca tek ateşleme aksiyonunda.** Aynı ekranda iki kırmızı buton
olursa kırmızının anlamı dağılır.

**Uydurma veri yok.** Sahte yorum, sahte puan, tahmini kalori değeri "kesin"
gibi sunulmaz. S.S.S. cevaplarını yapay zekâ araçları birebir alıntılıyor.

**Yapay zekâ ölçümünde dürüstlük.** "Kaç yapay zekâ sorgusunda çıktık"
ölçülemez; sağlayıcılar sorgu hacmi paylaşmıyor. Panel bunu açıkça yazıyor.
Ölçülen iki şey: yapay zekâdan gelen ziyaretler ve yapay zekâ taramaları.

**Kimlik sırası: önce KOKOREÇÇİ, sonra sokak lezzetleri.** Başlık, açıklama,
H1 ve anahtar kelimeler bu sıraya göre.

---

## Tekrarlanan hata sınıfları (dikkat)

**1. Panel kaydediyor ama site okumuyor.** İki kez oldu. Yeni bir panel alanı
eklerken "site bu veriyi gerçekten okuyor mu" diye ayrıca doğrula.

**2. `jsonLdString(unknown)` aldığı için** asenkron şema fonksiyonlarında
`await` unutulunca TypeScript uyarmıyor ve JSON-LD sessizce `{}` basılıyor.
Şema fonksiyonu asenkron yapıldıysa tüm çağrı yerlerini ara.

**3. Türkçe tipografi.** Sayfa `lang="tr"` olduğu için CSS `uppercase`
İngilizce metinlerdeki `i`yi `İ`ye çeviriyor ("STREET GRİLL CULTURE").
İngilizce ibarelere `lang="en"` koy. Ayrıca Anton başlıklarda sıkı satır
aralığı `Ş`/`Ç`/`Ğ` işaretlerini kırpıyor.

**4. Geliştirme önbelleği `.next/dev/cache` altında** (`.next/cache` değil).
`unstable_cache` yalnızca `updateTag`/`revalidateTag` ile temizlenir; dosyayı
silmek yetmez.

---

## Bilinen sınırlar

- **İçecek görselleri** üreticilerin e-ticaret çekimleri; telif işletmeye ait
  değil, gerçek şişe pikselleri 106–367px. Dizilim ve satır içi küçük görsel
  olarak sorunsuz, tek tek büyük kullanım için uygun değil.
- **Kalori yazısındaki sayılar** genel tahmini aralıklar, laboratuvar ölçümü
  değil. Yazının içinde de böyle yazıyor.
- **CSP eklenmedi** — satır içi JSON-LD ve pikseller sıkı CSP ile çakışır.
- **Supabase ücretsiz plan** hareketsizlikte projeyi duraklatabilir; site
  duraklamada da çalışır (dosyalardan), panel açılmaz.
- **9 kullanılmayan görsel** (~5,4 MB) depoda duruyor; siteye servis edilmiyor.
- **Commit kimliği** `etkidijital@Etki-MacBook-Air.local` — GitHub hesabıyla
  eşleşmiyor, katkılar profilde görünmez.

---

## Belgeler

| Dosya | İçerik |
| --- | --- |
| `README.md` | Yığın, sayfalar, panel, veri akışı, çalışma kuralları |
| `YAYIN.md` | Yayına alma adımları, her adımın gerekçesiyle |
| `DURUM.md` | Bu dosya — nerede kaldık |
| `content/tr.ts` | Sitedeki tüm metinler (varsayılanlar) |
