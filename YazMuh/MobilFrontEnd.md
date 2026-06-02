# Mobil Frontend Görev Dağılımı

Bu dokümanda mobil uygulamanın kullanıcı arayüzü (UI) görevleri listelenmektedir.

**REST API Adresi:** [https://ashura-forge-api.onrender.com](https://ashura-forge-api.onrender.com/index.html)

---

## Ekip Üyelerinin Mobil Frontend Görevleri

1. [Neset Ayberk Alkan'ın Mobil Frontend Görevleri](Neset-Ayberk-Alkan/Neset-Ayberk-Alkan-Mobil-Frontend-Gorevleri.md)

---

## Uygulanan Ekranlar ve Özellikler

### Giriş & Kayıt Ekranları
- LinearGradient turuncu tema, dumbbell ikonu
- API log kutusu (canlı istek/yanıt görünümü)
- JWT token ile MainScreen'e yönlendirme

### Ana Ekran — 4 Sekmeli Navigasyon
- **Arena:** Unvan kartı, istatistikler, antrenman ekleme/silme, geçmiş
- **Programlar:** 9 hazır program (Strength/Balance/Flexibility), egzersiz oynatıcı
- **Bildirimler:** Tip bazlı renkli bildirim listesi, tümünü okundu işaretleme
- **Profil:** Kullanıcı bilgileri görüntüleme ve düzenleme, şifre değiştirme

### Teknik Detaylar
- React Native + Expo SDK 54
- expo-linear-gradient ile glow efektleri
- @expo/vector-icons (Ionicons, MaterialCommunityIcons)
- Her ekranda API İstek/Yanıt log kutusu
