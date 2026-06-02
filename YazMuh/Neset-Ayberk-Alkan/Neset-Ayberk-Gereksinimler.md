1. **Kayıt Ol**
   - **API Metodu:** `POST /api/Auth/register`
   - **Açıklama:** Kullanıcıların hesap oluşturarak Ashura Forge sistemine kayıt olmasını sağlar.

2. **Giriş Yap**
   - **API Metodu:** `POST /api/Auth/login`
   - **Açıklama:** Kayıtlı kullanıcıların e-posta/kullanıcı adı ve şifreleriyle sisteme güvenli şekilde giriş yapmasını sağlar.

3. **Antrenman Ekle**
   - **API Metodu:** `POST /api/Workout`
   - **Açıklama:** Kullanıcının calisthenics antrenmanlarını ve hareketlerini sisteme kaydetmesini sağlar.

4. **Antrenman Sil**
   - **API Metodu:** `DELETE /api/Workout/{id}`
   - **Açıklama:** Kullanıcının yanlış eklediği veya iptal etmek istediği antrenman kaydını sistemden siler.

5. **Rozet Kazan**
   - **API Metodu:** `GET /api/Badge`
   - **Açıklama:** Belirli hedefleri tamamlayan kullanıcının profiline motivasyon amaçlı yeni rozet tanımlar.

6. **Bildirim Al**
   - **API Metodu:** `GET /api/Notification`
   - **Açıklama:** Antrenman hatırlatmaları ve kullanıcının sürekliliğini destekleyen sistem bildirimlerini getirir.

7. **Profil Fotoğrafı Değiştir**
   - **API Metodu:** `PUT /api/Profile/image`
   - **Açıklama:** Kullanıcının profil fotoğrafını yüklemesini veya mevcut fotoğrafını değiştirmesini sağlar.

8. **Profil Düzenle**
   - **API Metodu:** `PATCH /api/Profile`
   - **Açıklama:** Kullanıcının kullanıcı adı, e-posta ve şifre gibi kişisel profil bilgilerini güncellemesini sağlar.

9. **Title (Unvan) Kazan**
   - **API Metodu:** `GET /api/Progress`
   - **Açıklama:** Disiplinli antrenman yapan kullanıcılara seviyelerine göre özel statü unvanları atar. Antrenman sayısına göre unvan otomatik güncellenir.

10. **Progress Tracking (İlerleme Takibi)**
    - **API Metodu:** `GET /api/Progress`
    - **Açıklama:** Kullanıcının geçmiş verilerini analiz ederek gelişimini istatistiksel olarak listeler. Toplam seans, toplam dakika ve sonraki unvana kalan antrenman sayısını gösterir.

11. **Hazır Programlar (Kullanıcı Dostu)**
    - **API Metodu:** `POST /api/Workout`
    - **Açıklama:** Kullanıcıya Strength, Balance ve Flexibility kategorilerinde önceden tanımlanmış 9 antrenman programı sunar. Kullanıcı bir programı seçtiğinde egzersizleri tek tek tamamlayarak işaretleyebilir; tamamlama sonunda program otomatik olarak antrenman geçmişine kaydedilir.

12. **Antrenman Takibi**
    - **API Metodu:** `GET /api/Workout`
    - **Açıklama:** Kullanıcının geçmişte kaydettiği tüm antrenmanları tarih sırasına göre listeler. Her antrenman için ad, kategori, süre ve tarih bilgisi gösterilir. Toplam seans sayısı ve toplam süre istatistikleri ilerleme ekranında anlık olarak güncellenir.
