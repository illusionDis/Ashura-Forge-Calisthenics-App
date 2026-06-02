# Video Sunum

## Sunum Videosu

> **Video Linki:** [Sunum videosu linki buraya eklenecek](https://example.com)

---

## Ekip Üyelerinin Sunum Sırası

### Neset Ayberk Alkan

**Kişisel Tanıtım:**
- İsim: Neset Ayberk Alkan
- Rol: Tam Yığın Geliştirici (Backend + Web Frontend + Mobil)

**Gereksinimlerin Demo Sırası:**

1. **Kayıt Ol** — `POST /api/Auth/register` — Yeni kullanıcı oluşturma (web + mobil)
2. **Giriş Yap** — `POST /api/Auth/login` — JWT token ile giriş (web + mobil)
3. **Antrenman Ekle** — `POST /api/Workout` — Arena/Dashboard'dan antrenman kaydetme
4. **Antrenman Sil** — `DELETE /api/Workout/{id}` — Geçmişten antrenman silme
5. **Rozet Kazan** — Antrenman hedeflerine ulaşınca otomatik rozet atanması
6. **Bildirim Al** — `GET /api/Notification` — Bildirimler sekmesi (Redis cache gösterimi)
7. **Profil Fotoğrafı Değiştir** — `PUT /api/Profile/image` — URL ile fotoğraf güncelleme
8. **Profil Düzenle** — `PATCH /api/Profile` — Kullanıcı adı, e-posta, şifre güncelleme
9. **Title Kazan** — Antrenman sayısına göre otomatik unvan kazanımı
10. **Progress Tracking** — `GET /api/Progress` — İlerleme istatistikleri
11. **Hazır Programlar** — 9 hazır program, egzersiz oynatıcı, tamamlayınca kayıt
12. **Antrenman Takibi** — `GET /api/Workout` — Geçmiş listeleme ve filtreleme

---

## Sunum Hazırlık Kontrol Listesi

- [ ] Mobil uygulama telefonda çalışıyor
- [ ] Web uygulaması tarayıcıda açık
- [ ] API log kutuları görünür durumda
- [ ] RabbitMQ Management UI açık (localhost:15672)
- [ ] Redis monitor aktif (docker exec ashura_redis redis-cli monitor)
- [ ] Jenkins pipeline çalıştırıldı (localhost:8081)
- [ ] Docker Compose servisleri ayakta (docker compose ps)
- [ ] Ses kaydı için mikrofon hazır
- [ ] Ekran kaydı yazılımı aktif
