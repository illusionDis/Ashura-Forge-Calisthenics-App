# Neşet Ayberk Alkan - Web Frontend Görevleri
**Front-end Test Videosu:** [https://youtu.be/_u__mLPsIl4]
**Canlı Web Sitesi (Vercel):** [https://ashura-forge-calisthenics-app.vercel.app]

## 1. Üye Olma ve Kimlik Doğrulama (Auth) Ekranı
- **API Endpoints:** `POST /api/Auth/register` & `POST /api/Auth/login`
- **Görev:** Kullanıcıların sisteme kayıt olması, giriş yapması ve JWT token tabanlı oturum yönetimi tasarımı.
- **UI Bileşenleri:**
  - Tek ekranda "Giriş" ve "Kayıt" modları arasında geçiş yapabilen akıllı form yapısı (Toggle form).
  - Karanlık tema (Dark mode) uyumlu, gradient glow (parlama) efektli kart tasarımı.
  - Lucide-React ikonları (Kullanıcı, Mail, Kilit) ile zenginleştirilmiş input alanları.
  - Form gönderimi sırasında buton içinde dönen "Loading spinner" ve disabled state.
  - Arka planda animasyonlu (pulse efekti) dambıl logosu ve görsel geri bildirimler.
- **Form Validasyonu:**
  - HTML5 native validation (`required`, `type="email"`).
  - Şifre inputları için güvenlik kuralları.
  - API'den dönen HTTP 400 (Bad Request) veya 401 (Unauthorized) hatalarını anlık yakalama.
- **Kullanıcı Deneyimi (UX):**
  - Hatalı girişlerde kırmızı shake (titreme) animasyonlu error box.
  - Başarılı girişte JWT token'ın `localStorage`'a kaydedilip sayfa yenilenmeden ana sayfaya (Dashboard) yönlendirme.
  - Form submission double-click koruması.
- **Teknik Detaylar:**
  - Framework: React.js (Vite ile build edilmiştir).
  - State Management: React Hook (`useState`).
  - Network Client: Axios.

## 2. Ana Sayfa (Arena) ve Antrenman Yönetimi
- **API Endpoints:** `POST /api/Workout`, `DELETE /api/Workout/{id}`, `GET /api/Progress`
- **Görev:** Kullanıcının seviyesini görmesi, yeni antrenman eklemesi ve geçmişini yönetmesi.
- **UI Bileşenleri:**
  - Dinamik "Unvan (Title)" kartı ve bir sonraki seviyeye kalan antrenman sayısını gösteren ilerleme çubuğu (Progress Bar).
  - İstatistik kartları (Toplam Seans, Dakika).
  - Antrenman ekleme formu (Dakika ve Kategori seçicili).
  - Scrollable (özel kaydırma çubuklu) Antrenman Geçmişi listesi.
  - Hover (üzerine gelince) durumunda beliren silme (Çöp Kutusu) butonu.
- **Kullanıcı Deneyimi (UX):**
  - Antrenman eklendiğinde veya silindiğinde optimistic update/re-fetch ile listelerin ve unvanın anında güncellenmesi.
  - Silme işlemi öncesi `window.confirm` ile güvenlik (kazara silmeyi önleme) uyarısı.
  - Animasyonlu (shimmer) skeleton benzeri yükleme efektleri.
- **Teknik Detaylar:**
  - Component Lifecycle: `useEffect` ile sayfa yüklendiğinde `fetchUserData` çağrılması.
  - Dinamik class yönetimi (Tailwind CSS).
  - Bearer Token'ın Axios header'ına dinamik enjekte edilmesi.

## 3. Profil Görüntüleme ve Düzenleme Sayfası
- **API Endpoints:** `PUT /api/Profile/image`, `PATCH /api/Profile`
- **Görev:** Kullanıcının hesap bilgilerini ve profil fotoğrafını modern yöntemlerle değiştirmesi.
- **UI Bileşenleri:**
  - Responsive iki kolonlu grid yapısı (Fotoğraf Yükleme ve Hesap Ayarları).
  - Drag & Drop hissi veren, gizli input file entegrasyonlu modern fotoğraf yükleme alanı.
  - Anlık fotoğraf önizleme (Preview) alanı.
  - Email, Ad, Mevcut Şifre ve Yeni Şifre inputları.
- **Form Validasyonu:**
  - Resim dosya boyutu kontrolü (Maksimum 5MB limiti istemci tarafında).
  - Hesap güncellemelerinde "Mevcut Şifre" zorunluluğu.
  - Geçerli resim formatı (`accept="image/*"`) validasyonu.
- **Kullanıcı Deneyimi (UX):**
  - Seçilen fotoğrafın API'ye gitmeden saniyeler önce `FileReader` ile okunup önizlemesinin gösterilmesi.
  - Seçilen profil fotoğrafının anında `Sticky Header` (sol üst köşe) üzerinde güncellenmesi.
  - Yükleme sırasında loading butonu.
- **Teknik Detaylar:**
  - Base64 Encoding: Yerel fotoğrafı sunucuya `profileImageUrl` olarak yollamadan önce Base64 metnine çevirme.
  - Global State Synchronization: Profil fotoğrafının `localStorage` üzerinde saklanıp uygulamanın her yerinde tutarlı gösterilmesi.
  - Hata yakalama (`try-catch`) ve toast/alert bildirimleri.

## 4. Gamification (Rozetler) ve Bildirim Sistemi
- **API Endpoints:** `PATCH /api/Badge/check`, `GET /api/Notification`
- **Görev:** Kazanılan rozetlerin sergilenmesi ve sistem bildirimlerinin okunması.
- **UI Bileşenleri:**
  - Rozetleri listeleyen responsive grid card yapısı.
  - Navigation bar üzerinde dinamik "Badge (Bildirim Sayısı)" ikonu (Kırmızı yuvarlak uyarı).
  - Bildirimleri zaman damgasıyla (Timestamp) listeyen timeline tasarımı.
- **Kullanıcı Deneyimi (UX):**
  - Hiç bildirim veya rozet yoksa ekranda kullanıcı dostu "Empty State" (Boş Durum) göstergeleri.
  - Bildirimlerin en yeniden eskiye tarih formatı (LocaleDateString) ile okunabilir hale getirilmesi.
- **Teknik Detaylar:**
  - API'den gelen `Array` verilerinin `.map()` ile dinamik component'lere dönüştürülmesi.
  - Conditional Rendering (`badges.length > 0 ?`) ile boş liste kontrolü.

## 5. Uygulama Geneli Mimari ve Prensipler
- **Responsive Tasarım:** Tailwind CSS `md:` ve `lg:` breakpointleri kullanılarak tüm paneller mobil ve desktop için optimize edilmiştir.
- **Performans Optimizasyonu:** Vite modül paketleyicisi sayesinde bundle size minimumda tutulmuş, resimler Base64 ile local storage'da cache'lenerek sunucu yükü hafifletilmiştir.
- **Erişilebilirlik (A11y):** Formlarda proper focus states (`focus:ring`), contrast oranlarına uygun karanlık tema renkleri tercih edilmiştir.
- **Routing:** Tek sayfa uygulaması (SPA) mantığı ile State tabanlı (`activeTab`) bileşen geçişleri tasarlanmış, component re-render maliyetleri düşürülmüştür.