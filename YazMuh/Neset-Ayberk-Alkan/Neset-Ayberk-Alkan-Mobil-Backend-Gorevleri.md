# Neset Ayberk Alkan'ın Mobil Backend Görevleri
**Mobil Front-end ile Back-end Bağlanmış Test Videosu:** [Link buraya eklenecek](https://example.com)

## 1. Kayıt Ol Servisi
- **API Endpoint:** `POST /api/Auth/register`
- **Görev:** Mobil uygulamada yeni kullanıcı kayıt işlemini gerçekleştiren servis entegrasyonu
- **İşlevler:**
  - Kullanıcı bilgilerini (username, email, password) toplama
  - API'ye POST isteği gönderme (axios kütüphanesi)
  - Başarılı kayıt durumunda dönen JWT token'ı alarak MainScreen'e yönlendirme
  - Hata durumlarını yakalama ve kullanıcıya gösterme
- **Teknik Detaylar:**
  - React Native + axios ile HTTP istek yönetimi
  - JWT token AsyncStorage olmadan doğrudan navigation params ile taşıma
  - API log kutusu: endpoint, istek gövdesi, durum kodu ve yanıt ekranda gösterilir

## 2. Giriş Yap Servisi
- **API Endpoint:** `POST /api/Auth/login`
- **Görev:** Kayıtlı kullanıcının e-posta ve şifresiyle mobil uygulamaya güvenli giriş yapması
- **İşlevler:**
  - Email ve şifre bilgilerini API'ye gönderme
  - Başarılı girişte JWT token alarak ana ekrana yönlendirme
  - Hatalı giriş durumunda kullanıcıya hata mesajı gösterme
- **Teknik Detaylar:**
  - Authorization header: `Bearer {token}` formatı
  - API log kutusu ekranda canlı olarak görünür (endpoint, istek, durum, yanıt)

## 3. Antrenman Ekle Servisi
- **API Endpoint:** `POST /api/Workout`
- **Görev:** Kullanıcının yeni antrenman kaydı oluşturmasını sağlayan servis entegrasyonu
- **İşlevler:**
  - Antrenman adı, süresi ve kategorisini API'ye gönderme
  - Başarılı ekleme sonrası antrenman geçmişini yenileme (refreshData)
  - RabbitMQ üzerinden "workout.logged" kuyruğuna mesaj yayınlanması (backend tarafında)
  - Redis cache invalidasyonu (yeni antrenman sonrası bildirim cache'i temizlenir)
- **Teknik Detaylar:**
  - Request body: `{ name, durationMinutes, category }`
  - Response: 201 Created + oluşturulan antrenman verisi
  - API log kutusu ArenaTab ekranında görünür

## 4. Antrenman Sil Servisi
- **API Endpoint:** `DELETE /api/Workout/{id}`
- **Görev:** Kullanıcının antrenman geçmişinden kayıt silmesi
- **İşlevler:**
  - Silme öncesi Alert dialog ile onay alma
  - API'ye DELETE isteği gönderme
  - Başarılı silme sonrası liste güncelleme
- **Teknik Detaylar:**
  - Path parametresi olarak antrenman ID'si
  - API log kutusu işlem sonucunu gösterir

## 5. Bildirim Al Servisi
- **API Endpoint:** `GET /api/Notification`
- **Görev:** Kullanıcıya ait bildirimleri API'den çekip NotificationsTab ekranında listeleme
- **İşlevler:**
  - JWT token ile kimlik doğrulama
  - Bildirimleri tarih sırasına göre listeleme
  - Okunmamış bildirim sayısını alt navigasyon rozeti olarak gösterme
  - "Tümünü Okundu İşaretle" → `PATCH /api/Notification/read-all`
  - Redis cache: aynı kullanıcı 30 saniye içinde tekrar isterse veritabanı yerine cache'den yanıt döner
- **Teknik Detaylar:**
  - Backend: IDistributedCache (Redis) ile `notifications:{userId}` anahtarında önbellekleme
  - Cache HIT/MISS durumu backend loglarında izlenebilir

## 6. Profil Getir ve Güncelle Servisi
- **API Endpoint:** `GET /api/Profile` | `PATCH /api/Profile`
- **Görev:** Kullanıcı profil bilgilerini çekme ve güncelleme
- **İşlevler:**
  - Profil bilgilerini (username, email, title, totalWorkouts, badgeCount) getirme
  - Kullanıcı adı ve e-posta güncelleme
  - Şifre değiştirme (currentPassword + newPassword)
- **Teknik Detaylar:**
  - PATCH body: `{ username?, email?, currentPassword?, newPassword? }`
  - Hata durumları: 400 Bad Request, 401 Unauthorized
  - API log kutusu ProfileTab ekranında görünür

## 7. İlerleme Takibi Servisi
- **API Endpoint:** `GET /api/Progress`
- **Görev:** Kullanıcının antrenman istatistiklerini ve unvan bilgisini getirme
- **İşlevler:**
  - Toplam antrenman sayısı, toplam dakika, mevcut unvan, sonraki unvan
  - Rozet listesi ve kazanılan rozet sayısı
  - Ana ekran açıldığında ve antrenman eklendiğinde otomatik yenileme
- **Teknik Detaylar:**
  - MainScreen seviyesinde fetchUserData fonksiyonu; tüm tablara prop olarak geçirilir
  - refreshData callback'i ile her işlem sonrası senkronizasyon sağlanır
