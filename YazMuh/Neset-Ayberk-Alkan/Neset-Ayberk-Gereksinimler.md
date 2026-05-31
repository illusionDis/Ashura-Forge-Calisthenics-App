1. **Kayıt Ol**
   - **API Metodu:** `POST /auth/register`
   - **Açıklama:** Kullanıcıların hesap oluşturarak Ashura Forge sistemine kayıt olmasını sağlar.

2. **Giriş Yap**
   - **API Metodu:** `POST /auth/login`
   - **Açıklama:** Kayıtlı kullanıcıların e-posta/kullanıcı adı ve şifreleriyle sisteme güvenli şekilde giriş yapmasını sağlar.

3. **Antrenman Ekle**
   - **API Metodu:** `POST /workouts/add`
   - **Açıklama:** Kullanıcının calisthenics antrenmanlarını ve hareketlerini sisteme kaydetmesini sağlar.

4. **Antrenman Sil**
   - **API Metodu:** `DELETE /workouts/{id}`
   - **Açıklama:** Kullanıcının yanlış eklediği veya iptal etmek istediği antrenman kaydını sistemden siler.

5. **Rozet Kazan**
   - **API Metodu:** `PATCH /users/{id}/badges`
   - **Açıklama:** Belirli hedefleri tamamlayan kullanıcının profiline motivasyon amaçlı yeni rozet tanımlar.

6. **Bildirim Al**
   - **API Metodu:** `GET /notifications`
   - **Açıklama:** Antrenman hatırlatmaları ve kullanıcının sürekliliğini destekleyen sistem bildirimlerini getirir.

7. **Profil Fotoğrafı Değiştir**
   - **API Metodu:** `PUT /users/{id}/avatar`
   - **Açıklama:** Kullanıcının profil fotoğrafını yüklemesini veya mevcut fotoğrafını değiştirmesini sağlar.

8. **Profil Düzenle**
   - **API Metodu:** `PUT /users/{id}/profile`
   - **Açıklama:** Kullanıcının boy, kilo, hedefler gibi kişisel profil bilgilerini güncellemesini sağlar.

9. **Title (Unvan) Kazan**
   - **API Metodu:** `PATCH /users/{id}/titles`
   - **Açıklama:** Disiplinli antrenman yapan kullanıcılara seviyelerine göre özel statü unvanları atar.

10. **Progress Tracking (İlerleme Takibi)**
   - **API Metodu:** `GET /progress/stats`
   - **Açıklama:** Kullanıcının geçmiş verilerini analiz ederek gelişimini istatistiksel olarak listeler.