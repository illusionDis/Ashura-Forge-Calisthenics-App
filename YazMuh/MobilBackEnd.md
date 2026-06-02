# Mobil Backend (REST API Bağlantısı) Görev Dağılımı

Bu dokümanda mobil uygulamanın REST API ile iletişimini sağlayan backend entegrasyon görevleri listelenmektedir.

**REST API Adresi:** [https://ashura-forge-api.onrender.com](https://ashura-forge-api.onrender.com/index.html)

---

## Ekip Üyelerinin Mobil Backend Görevleri

1. [Neset Ayberk Alkan'ın Mobil Backend Görevleri](Neset-Ayberk-Alkan/Neset-Ayberk-Alkan-Mobil-Backend-Gorevleri.md)

---

## Entegre Edilen API Endpoint'leri

| Endpoint | Metod | Açıklama |
|---|---|---|
| `/api/Auth/register` | POST | Yeni kullanıcı kaydı |
| `/api/Auth/login` | POST | Kullanıcı girişi, JWT döner |
| `/api/Workout` | POST | Antrenman ekle |
| `/api/Workout/{id}` | DELETE | Antrenman sil |
| `/api/Workout` | GET | Antrenman geçmişi |
| `/api/Progress` | GET | İlerleme istatistikleri |
| `/api/Notification` | GET | Bildirimleri getir (Redis cache) |
| `/api/Notification/read-all` | PATCH | Tümünü okundu işaretle |
| `/api/Profile` | GET | Profil bilgileri |
| `/api/Profile` | PATCH | Profil güncelle |

## Altyapı Servisleri

- **Redis:** Bildirim endpoint'i için 30 saniyelik response cache
- **RabbitMQ:** Antrenman kaydedilince `workout.logged` kuyruğuna mesaj yayınlanır
- **Docker Compose:** Tüm servisler tek komutla ayağa kalkar (`docker compose up -d`)
- **Jenkins:** CI/CD pipeline (backend build + frontend build + Docker image)
