# Neset Ayberk Alkan'ın Mobil Frontend Görevleri
**Mobile Front-end Demo Videosu:** [Link buraya eklenecek](https://example.com)

## 1. Giriş (Login) Ekranı
- **API Endpoint:** `POST /api/Auth/login`
- **Görev:** Kullanıcının e-posta ve şifresiyle giriş yapabileceği mobil ekran
- **UI Bileşenleri:**
  - ASHURA FORGE logosu (LinearGradient turuncu gradient, dumbbell ikonu)
  - E-posta ve şifre input alanları (Ionicons ikonlu)
  - Gradient "GİRİŞ YAP" butonu
  - "Hesabın yok mu? Hemen oluştur" yönlendirme linki
  - API İstek/Yanıt log kutusu (canlı endpoint, istek, durum, yanıt gösterimi)
- **Teknik Detaylar:**
  - React Native + Expo SDK 54
  - expo-linear-gradient ile turuncu gradient tasarım
  - @expo/vector-icons (Ionicons) ile ikon kullanımı
  - SafeAreaView + KeyboardAvoidingView + ScrollView yapısı
  - navigation.replace('Main', { token }) ile ana ekrana geçiş

## 2. Kayıt (Register) Ekranı
- **API Endpoint:** `POST /api/Auth/register`
- **Görev:** Yeni kullanıcı oluşturma ekranı
- **UI Bileşenleri:**
  - Kullanıcı adı, e-posta ve şifre input alanları
  - Gradient "KAYIT OL" butonu
  - Hata mesajı kutusu (kırmızı border, uyarı ikonu)
  - API log kutusu
- **Teknik Detaylar:**
  - Başarılı kayıt sonrası direkt MainScreen'e yönlendirme
  - ActivityIndicator ile yüklenme durumu gösterimi

## 3. Ana Ekran — 4 Sekmeli Navigasyon (MainScreen)
- **Görev:** Alt navigasyon çubuğu ile 4 sekme arasında geçiş sağlayan ana ekran
- **UI Bileşenleri:**
  - Header: turuncu gradient avatar, "ASHURA FORGE" başlığı, kullanıcı unvanı, online dot, çıkış butonu
  - Alt navigasyon: Arena, Programlar, Bildirimler, Profil sekmeleri
  - Aktif sekme LinearGradient turuncu highlight ile gösterilir
  - Bildirimler sekmesinde okunmamış sayısı rozet olarak görünür
- **Teknik Detaylar:**
  - useState ile activeTab yönetimi (React Navigation yerine manuel tab sistemi)
  - GET /api/Progress ile userData çekilir; alt sekmelere prop olarak iletilir

## 4. Arena Sekmesi (ArenaTab)
- **API Endpoint:** `GET /api/Progress`, `POST /api/Workout`, `DELETE /api/Workout/{id}`
- **Görev:** Kullanıcının antrenman geçmişini görüntüleyip yeni antrenman ekleyebildiği ana sekme
- **UI Bileşenleri:**
  - GlowCard bileşeni: renkli glow efekti (backgroundColor + '22' ile Android uyumlu)
  - Unvan kartı: trophy ikonu, mevcut unvan, ilerleme bar (LinearGradient), sonraki unvana kalan
  - İstatistik kartları: toplam seans (turuncu alev) + toplam dakika (mavi saat)
  - Rozet grid'i (varsa)
  - Yeni antrenman formu: ad, dakika, kategori seçici (yatay scroll), gradient kaydet butonu
  - Antrenman geçmişi listesi: her satırda dumbbell ikonu, kategori, tarih, süre, silme butonu
  - API log kutusu
- **Teknik Detaylar:**
  - Pull-to-refresh (RefreshControl)
  - Alert.alert ile silme onayı

## 5. Programlar Sekmesi (ProgramsTab) + Program Oynatıcı (ProgramDetailScreen)
- **API Endpoint:** `POST /api/Workout`
- **Görev:** Hazır programları listeleyen sekme ve egzersiz oynatıcı ekranı
- **UI Bileşenleri (ProgramsTab):**
  - Yatay kaydırmalı kategori filtresi: Tümü / Strength / Balance / Flexibility
  - Program kartları: renkli sol şerit, program adı, zorluk rozeti, süre, ilk 2 egzersiz önizleme
  - "Programı Başlat" gradient butonu → ProgramDetailScreen'e navigation.navigate
- **UI Bileşenleri (ProgramDetailScreen):**
  - Geri butonu, program başlığı, zorluk ve süre bilgisi
  - Egzersiz ilerleme barı (tamamlanan / toplam)
  - Egzersiz listesi: her birine tap ile işaretleme (checkbox + üstü çizili animasyon)
  - "Antrenmanı Tamamla" gradient butonu → POST /api/Workout
  - Başarı kartı: yeşil trophy ikonu, "Ana Sayfaya Dön" butonu
  - API log kutusu
- **Teknik Detaylar:**
  - 9 hazır program: 3 Strength, 3 Balance, 3 Flexibility
  - Her program için barColor, zorluk seviyesi, egzersiz listesi tanımlı

## 6. Bildirimler Sekmesi (NotificationsTab)
- **API Endpoint:** `GET /api/Notification`, `PATCH /api/Notification/read-all`
- **Görev:** Kullanıcıya ait bildirimleri listeleyen sekme
- **UI Bileşenleri:**
  - Bildirim sayısı rozeti (okunmamışlar için)
  - "Tümünü Oku" butonu
  - Bildirim kartları: type'a göre renk ve ikon (rozet=mor, unvan=altın, milestone=turuncu, sistem=mavi)
  - Okunmamış bildirimlere renkli sol şerit + nokta göstergesi
  - Tarih ve saat bilgisi
  - Boş durum ekranı (hiç bildirim yoksa)
  - API log kutusu
- **Teknik Detaylar:**
  - Pull-to-refresh desteği
  - useCallback + useEffect ile otomatik veri çekimi

## 7. Profil Sekmesi (ProfileTab)
- **API Endpoint:** `GET /api/Profile`, `PATCH /api/Profile`
- **Görev:** Kullanıcı profil bilgilerini görüntüleme ve düzenleme sekmesi
- **UI Bileşenleri:**
  - Gradient avatar dairesi, kullanıcı adı, e-posta, unvan rozeti
  - İstatistik pill'leri: toplam seans, rozet sayısı, üyelik tarihi
  - Profil düzenleme formu: kullanıcı adı + e-posta alanları, gradient kaydet butonu
  - Şifre değiştirme bölümü: mevcut şifre + yeni şifre (göster/gizle toggle'ı)
  - API log kutusu
- **Teknik Detaylar:**
  - GET /api/Profile ile mevcut bilgiler form'a otomatik doldurulur
  - Şifre alanları için showPassword state yönetimi
  - Başarılı güncelleme sonrası Alert.alert + refreshData tetiklenir
