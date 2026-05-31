# Neşet Ayberk Alkan'ın REST API Metotları

**API Test Videosu:** [https://youtu.be/Me5AuXSdm0M]

## 1. Kayıt Ol (Register)
- **Endpoint:** `POST /api/Auth/register`
- **Request Body:** ```json
  {
    "username": "savasci123",
    "email": "kullanici@example.com",
    "password": "Guvenli123!"
  }
  ```
- **Authentication:** Gerekli değil
- **Response:** `200 OK` - Kullanıcı başarıyla oluşturuldu

## 2. Giriş Yap (Login)
- **Endpoint:** `POST /api/Auth/login`
- **Request Body:** ```json
  {
    "email": "kullanici@example.com",
    "password": "Guvenli123!"
  }
  ```
- **Authentication:** Gerekli değil
- **Response:** `200 OK` - Doğrulama başarılı, JWT Bearer Token döndürüldü

## 3. Antrenman Ekleme
- **Endpoint:** `POST /api/Workout`
- **Request Body:** ```json
  {
    "name": "100 Şınav",
    "durationMinutes": 30,
    "category": "Strength"
  }
  ```
- **Authentication:** Bearer Token gerekli
- **Response:** `200 OK` - Antrenman başarıyla eklendi ve istatistikler güncellendi

## 4. Antrenman Silme
- **Endpoint:** `DELETE /api/Workout/{id}`
- **Path Parameters:** - `id` (integer, required) - Silinecek antrenmanın ID'si
- **Authentication:** Bearer Token gerekli
- **Response:** `200 OK` - Antrenman başarıyla silindi ve veriler geri alındı

## 5. Rozet Kazanma ve Kontrol
- **Endpoint:** `PATCH /api/Badge/check`
- **Request Body:** Boş gönderilebilir
- **Authentication:** Bearer Token gerekli
- **Response:** `200 OK` - Kullanıcının antrenman metrikleri tarandı ve hak edilen yeni rozetler atandı

## 6. Bildirim Alma
- **Endpoint:** `GET /api/Notification`
- **Authentication:** Bearer Token gerekli
- **Response:** `200 OK` - Kullanıcıya ait sistem bildirimleri kronolojik sırayla getirildi

## 7. Profil Fotoğrafı Değiştirme
- **Endpoint:** `PUT /api/Profile/image`
- **Request Body:** ```json
  {
    "profileImageUrl": "https://ui-avatars.com/api/?name=Ashura"
  }
  ```
- **Authentication:** Bearer Token gerekli
- **Response:** `200 OK` - Profil fotoğrafı başarıyla güncellendi

## 8. Profil Düzenleme
- **Endpoint:** `PATCH /api/Profile`
- **Request Body:** ```json
  {
    "username": "yeniSavasci",
    "email": "yeniemail@example.com",
    "currentPassword": "EskiSifre123!",
    "newPassword": "YeniSifre123!"
  }
  ```
- **Authentication:** Bearer Token gerekli
- **Response:** `200 OK` - Mevcut şifre doğrulandıktan sonra kullanıcı bilgileri başarıyla güncellendi

## 9. Unvan (Title) Kazanma ve Güncelleme
- **Endpoint:** `PATCH /api/Progress/title`
- **Request Body:** Boş gönderilebilir
- **Authentication:** Bearer Token gerekli
- **Response:** `200 OK` - Kullanıcının seviyesi kontrol edildi ve yeni unvan başarıyla atandı

## 10. İlerleme Takibi (Progress Tracking)
- **Endpoint:** `GET /api/Progress`
- **Authentication:** Bearer Token gerekli
- **Response:** `200 OK` - Kullanıcının toplam antrenman sayısı, harcanan dakika, güncel unvanı ve genel istatistikleri başarıyla getirildi