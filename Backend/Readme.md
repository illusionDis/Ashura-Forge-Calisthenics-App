# AshuraForge API

Fitness takip uygulaması backend'i. ASP.NET Core 8 + PostgreSQL + JWT.

## Kurulum

### 1. Gereksinimler
- [.NET 8 SDK](https://dotnet.microsoft.com/download)
- PostgreSQL (veya [Railway](https://railway.app) ücretsiz PostgreSQL)

### 2. Bağlantı Ayarları
`appsettings.json` içindeki connection string'i güncelle:
```json
"ConnectionStrings": {
  "DefaultConnection": "Host=localhost;Database=ashuraforge;Username=postgres;Password=SİFREN"
}
```

### 3. Migration & Çalıştırma
```bash
cd AshuraForge.API

# Paketleri yükle
dotnet restore

# Migration oluştur
dotnet ef migrations add InitialCreate

# Veritabanını oluştur
dotnet ef database update

# Uygulamayı çalıştır
dotnet run
```

### 4. Swagger
Uygulama çalışınca: `http://localhost:5000`

---

## Deploy (Railway)

1. [railway.app](https://railway.app) → New Project → Deploy from GitHub Repo
2. PostgreSQL servisi ekle → connection string'i Environment Variables'a ekle
3. `ASPNETCORE_ENVIRONMENT=Production` ekle

---

## API Endpoint Özeti

| # | Gereksinim | Method | Endpoint |
|---|---|---|---|
| 1 | Kayıt ol | POST | `/api/auth/register` |
| 2 | Giriş yap | POST | `/api/auth/login` |
| 3 | Antrenman ekle | POST | `/api/workout` |
| 4 | Antrenman sil | DELETE | `/api/workout/{id}` |
| 5 | Rozet kazan | PATCH | `/api/badge/check` |
| 6 | Bildirim al | GET | `/api/notification` |
| 7 | Profil fotoğrafı değiştir | PUT | `/api/profile/image` |
| 8 | Profil düzenle | PATCH | `/api/profile` |
| 9 & 10 | Title + Progress | GET | `/api/progress` |
