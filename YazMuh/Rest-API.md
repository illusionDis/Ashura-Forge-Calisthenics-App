# AshuraForge REST API

> **Domain:** `https://ashura-forge-production-7424.up.railway.app`  
> **Swagger UI:** `https://ashura-forge-production-7424.up.railway.app/index.html`
> **Başarı Kanıtı (YouTube):** `https://youtu.be/Me5AuXSdm0M`

---

## Gereksinimler ve Uç Noktalar

### GEREKSİNİM 1 – Kayıt ol
**POST** `/api/Auth/register`

**Body:**
```json
{
  "email": "test@test.com",
  "password": "Password123*",
  "username": "test_kullanici"
}
```
**Başarılı Yanıt (200):**
```json
{
  "success": true,
  "message": "Kayıt başarılı! Hoş geldiniz.",
  "data": {
    "token": "eyJhbGciOi...",
    "username": "neset",
    "email": "neset@example.com",
    "title": "Acemi Savaşçı",
    "expiresAt": "2026-04-05T12:00:00Z"
  }
}
```

---

### GEREKSİNİM 2 – Giriş yap
**POST** `/api/Auth/login`

**Body:**
```json
{
  "email": "test@test.com",
  "password": "Password123*"
}
```

---

### GEREKSİNİM 3 – Antrenman ekle
**POST** `/api/Workout`  
🔒 *Auth gerekli*

**Body:**
```json
{
  "name": "Barfiks Antrenmanı",
  "durationInMinutes": 45,
  "difficulty": "Medium"
}
```

---

### GEREKSİNİM 4 – Antrenman sil
**DELETE** `/api/Workout/{id}`  
🔒 *Auth gerekli*

---

### GEREKSİNİM 5 – Rozet kazan
**PATCH** `/api/Badge/check`  
🔒 *Auth gerekli*

> Not: Rozet kontrolü otomatik olarak antrenman eklendikten sonra da tetiklenir.

---

### GEREKSİNİM 6 – Bildirim al
**GET** `/api/Notification`  
🔒 *Auth gerekli*

---

### GEREKSİNİM 7 – Profil fotoğrafı değiştir
**PUT** `/api/Profile/image`  
🔒 *Auth gerekli*

**Body:**
```json
{
  "profileImageUrl": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJdkPNNzfXQQvYT2auhVTXh3nopus1hrTe_w&s"
}
```

---

### GEREKSİNİM 8 – Profil düzenle
**PATCH** `/api/Profile`  
🔒 *Auth gerekli*

**Body:**
```json
{
  "firstName": "Ayberk",
  "lastName": "Developer",
  "bio": "FullstackLoneWolf"
}
```

---

### GEREKSİNİM 9 & 10 – Title kazan + Progress tracking
**GET** `/api/Progress`  
🔒 *Auth gerekli*

**Başarılı Yanıt (200):**
```json
{
  "success": true,
  "data": {
    "currentTitle": "Bronz Savaşçı",
    "totalWorkouts": 7,
    "totalMinutes": 210,
    "badgeCount": 2,
    "nextTitle": "Gümüş Savaşçı",
    "workoutsToNextTitle": 8,
    "recentWorkouts": [],
    "earnedBadges": []
  }
}
```

---

## Title Seviyeleri (Gereksinim 9)

| Antrenman Sayısı | Unvan |
|---|---|
| 0 | Acemi Savaşçı |
| 5 | Bronz Savaşçı |
| 15 | Gümüş Savaşçı |
| 30 | Altın Savaşçı |
| 50 | Platin Savaşçı |
| 75 | Elmas Savaşçı |
| 100 | Efsane Savaşçı |

## Rozet Seviyeleri (Gereksinim 5)

| Gerekli Antrenman | Rozet |
|---|---|
| 1 | 🏃 İlk Adım |
| 5 | 🔥 Isınma |
| 15 | 💪 Demir İrade |
| 30 | ⚡ Kesintisiz Güç |
| 50 | ⚔️ Savaşçı Ruhu |
| 100 | 👑 Efsane |

---

## Authentication

Tüm 🔒 işaretli endpoint'ler için Header'a ekleyin:
```
Authorization: Bearer {token}
```