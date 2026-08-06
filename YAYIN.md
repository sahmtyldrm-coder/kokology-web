# Yayına alma — adım adım

Alan adı hazır olduğunda bu sırayı takip et. Her adımın altında "neden" yazıyor;
sırayı bozmak işe yarar ama bazı adımlar öncekine bağlı.

---

## 0. Ön kontrol (5 dakika)

```bash
cd "~/Desktop/Kokology website proje/kokology-web"
git checkout kokology-faz1
npm ci            # bağımlılıkları kilit dosyasından kur
npm run build     # hatasız derlenmeli
```

Derleme çıktısında `○ (Static)` ve `● (SSG)` işaretlerini gör. Sayfaların
`ƒ (Dynamic)` olması bir gerileme demektir — `/yonetim/*` ve `/api/olay`
dışındakiler statik olmalı.

---

## 1. GitHub deposu

Kod şu an yalnızca bu bilgisayarda. Depo **özel (private)** olmalı — panel
kodu ve yapılandırma herkese açık olmasın.

```bash
# github.com'da yeni özel depo aç: kokology-web
git remote add origin https://github.com/<kullanici>/kokology-web.git
git push -u origin kokology-faz1
```

> **Commit kimliği:** şu an commit'ler `etkidijital@Etki-MacBook-Air.local`
> adresiyle atılıyor. Bu GitHub hesabınla eşleşmediği için katkılar profilinde
> görünmez. Düzeltmek istersen push'tan önce:
> ```bash
> git config user.email "github-hesabindaki-eposta"
> ```

`.env.local` git'e girmiyor — anahtarlar bir sonraki adımda Vercel'e elle
girilecek.

---

## 2. Vercel

1. vercel.com → **Add New → Project** → GitHub deposunu seç
2. Framework otomatik **Next.js** olarak algılanır, ayar değiştirme
3. **Environment Variables** bölümüne şunları gir:

| Değişken | Değer |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://mcdztalchglavwnzrdmh.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | `.env.local` içindeki değer |
| `NEXT_PUBLIC_GSC_VERIFICATION` | 5. adımda alınacak, şimdilik boş |

4. **Deploy** → birkaç dakikada `kokology-web-xxx.vercel.app` adresi verir
5. Bu geçici adreste siteyi ve `/yonetim` girişini test et

> Analytics, GTM, Meta Pixel kimlikleri buraya **girilmez** — onlar panelden
> giriliyor ve çerez onayına bağlı çalışıyor.

---

## 3. Alan adı

1. Vercel → proje → **Settings → Domains** → alan adını ekle
2. Vercel sana DNS kayıtlarını verir (genelde `A` ve `CNAME`)
3. Natro panelinde alan adının DNS kayıtlarını bu değerlerle güncelle
4. Yayılma birkaç dakika ile birkaç saat sürebilir; Vercel doğrulayınca
   HTTPS sertifikasını kendisi alır

---

## 4. Alan adını sisteme tanıt

Bu adım atlanırsa canonical adresler, sitemap, Open Graph ve QR kodu hâlâ
varsayılan alan adını gösterir.

1. `/yonetim/iletisim` → **Alan adı** → site adresini gir → Kaydet
2. `/yonetim/qr` → uyarı kaybolmalı → **SVG indir** → masa kartlarını bastır

QR'ı bu adımdan önce bastırma.

---

## 5. Google Search Console

1. search.google.com/search-console → **Mülk ekle** → alan adını gir
2. Doğrulama yöntemi **HTML etiketi** → `content="..."` içindeki değeri kopyala
3. Vercel → Environment Variables → `NEXT_PUBLIC_GSC_VERIFICATION` → yapıştır
4. Vercel'de **Redeploy** (değişken değişince yeniden derleme gerekir)
5. Search Console'da **Doğrula**
6. **Site Haritaları** → `sitemap.xml` gönder

---

## 6. Google İşletme Profili

Profildeki **"Web sitesi"** alanı şu an boş. Alan adını oraya gir.

Site ile işletme profili arasındaki bağ yerel SEO'nun en güçlü
sinyallerinden biri — bu adım atlanırsa diğer her şeyin etkisi azalır.

---

## 7. Yayın sonrası

- **Ölçüm kodları:** GA4 / GTM / Meta Pixel kimliklerini `/yonetim/iletisim` →
  Ölçüm kodları bölümüne gir. Girdiğin an çerez onayı bandı devreye girer.
- **Sipariş linkleri:** platform sayfalarının adreslerini gir. İlk link
  girildiği anda sitedeki kırmızı butonlar "Ara"dan "Sipariş"e döner.
- **İstatistik:** `/yonetim/istatistik` birkaç gün içinde dolmaya başlar.
  Yapay zekâ taramaları genelde daha erken görünür.

Sonraki her `git push` Vercel'de otomatik yeni sürüm yayınlar.

---

## Bilinen sınırlar

- **Supabase ücretsiz plan** hareketsizlik sonrası projeyi duraklatabilir.
  Site duraklamada da çalışır (dosyalardaki içerikle) ama panel açılmaz.
  Trafik oluşunca bu sorun ortadan kalkar.
- **İçerik Güvenlik Politikası (CSP)** eklenmedi. Satır içi JSON-LD ve onay
  sonrası yüklenen pikseller sıkı bir CSP ile çakışır. Kullanılacak pikseller
  kesinleştiğinde nonce tabanlı CSP eklenebilir.
- **Yedek:** içerik Supabase'de. Supabase → Database → Backups bölümünden
  yedekleme politikasını kontrol et.
