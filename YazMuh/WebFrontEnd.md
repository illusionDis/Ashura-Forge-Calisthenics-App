# AshuraForge Web Frontend Dokümantasyonu

> **Canlı Web Sitesi (Vercel):** `https://ashura-forge-calisthenics-app.vercel.app`
> **Bağlı Olduğu API (Railway):** `https://ashura-forge-production-7424.up.railway.app`
> **Başarı Kanıtı (YouTube):** `https://youtu.be/_u__mLPsIl4`

---

## 👥 Grup Üyeleri ve Görev Dağılımı

Bu proje uçtan uca tek kişi tarafından (Full-Stack) geliştirilmiştir. Tüm Frontend süreçleri tarafımca tamamlanmıştır.

1. **Neşet Ayberk Alkan - Frontend Görevleri:**
   * React ve Vite altyapısının kurulması.
   * `calisteniapp.com` referanslı Karanlık Tema (Dark Mode) UI/UX tasarımı.
   * Axios ile JWT tabanlı C# API entegrasyonu (Kayıt, Giriş, Antrenman Ekleme, İstatistik Çekme).
   * Vercel üzerinden CI/CD ve canlıya alma (Deployment) süreçleri.

---

## 🎯 Genel Web Frontend Prensipleri ve Uygulamamız

### 1. Responsive Tasarım
* **Mobile-First:** Tailwind CSS kullanılarak projede önce mobil uyumluluk hedeflenmiş, `md:` ve `lg:` breakpoint'leri ile tablet ve masaüstü görünümleri kusursuz hale getirilmiştir.
* **Flexible Layouts:** CSS Flexbox ve Grid yapıları kullanılarak kart tasarımları esnekleştirilmiştir.

### 2. Tasarım Sistemi
* **CSS Framework:** Tailwind CSS tercih edilmiştir.
* **Renk Paleti:** Özel dark mode paleti (`bg-gray-950`, `text-gray-100` ve aksan rengi olarak `amber-500`) kurgulanmıştır.
* **Iconography:** Modern ve hafif bir kütüphane olan `lucide-react` kullanılmıştır.

### 3. Performans Optimizasyonu
* **Bundle Size:** Vite derleyicisi sayesinde kodlar minimize edilmiş ve gereksiz kütüphaneler ayıklanarak (Tree shaking) yüksek performans elde edilmiştir.
* **Loading States:** API istekleri sırasında kullanıcıya anlık geri bildirim veren (Zıplayan/Dönen Dambıl) loading indikatörleri eklenmiştir.

### 4. SEO (Search Engine Optimization)
* **Semantic HTML:** Sayfa hiyerarşisine uygun olarak `<h1>`, `<h2>`, `<form>`, `<section>` gibi anlamsal (semantic) etiketler kullanılmıştır.

### 5. Erişilebilirlik (Accessibility)
* **Color Contrast:** Karanlık zemin üzerinde açık gri metinler ve dikkat çekici altın/kehribar (amber) butonlar kullanılarak kontrast standartları sağlanmıştır.
* **Focus Indicators:** Input (Girdi) alanlarına odaklanıldığında dış çerçevenin renk değiştirmesi (`focus:border-amber-500`) sağlanarak klavye navigasyonu kolaylaştırılmıştır.

### 6. Browser Compatibility
* **Modern Browsers:** Vite tarafından sunulan modern build mimarisi sayesinde Chrome, Firefox, Safari ve Edge tarayıcılarının güncel sürümlerinde %100 uyumluluk sağlanmıştır.

### 7. State Management
* **Local State:** React Hook'ları (`useState`, `useEffect`) kullanılarak form verileri, yükleme durumları ve kullanıcı metrikleri anlık olarak yönetilmektedir.

### 8. Routing
* **Protected Routes (Korumalı Yönlendirme):** LocalStorage üzerinden `token` kontrolü yapılarak; kullanıcının kimliği doğrulanmamışsa "Giriş Ekranı", doğrulanmışsa korumalı alan olan "Dashboard (Ana Sayfa)" render edilmektedir.

### 9. API Entegrasyonu
* **HTTP Client:** API istekleri için `Axios` kullanılmıştır.
* **Request Yönetimi:** C# tarafında yazılan güvenlik katmanı için her API isteğinin Header'ına dinamik olarak `Authorization: Bearer {token}` eklenmiştir.
* **Error Handling:** Backend'den gelen 400 ve 401 hataları (Örn: "Email veya şifre hatalı") yakalanıp UI üzerinde kullanıcı dostu kırmızı alert kutularında gösterilmiştir.

### 10. Testing
* **E2E ve Entegrasyon Testi:** Tarayıcı üzerinden kullanıcı kayıt, giriş, antrenman ekleme, rozet kontrolü ve unvan atlama senaryoları uçtan uca (End-to-End) başarıyla test edilmiş ve videoya çekilmiştir.

### 11. Build ve Deployment
* **Build Tool:** Projenin derleme aşamasında yeni nesil ve ultra hızlı `Vite` kullanılmıştır.
* **Hosting / CI-CD:** Kodlar GitHub'a pushlandığı anda `Vercel` tarafından otomatik olarak derlenmekte ve yayına alınmaktadır. Canlı URL sorunsuz çalışmaktadır.