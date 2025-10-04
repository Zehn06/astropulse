# 🚀 GitHub Pages Kurulum Rehberi

## 1️⃣ GitHub Repository Oluşturun

1. **GitHub'a gidin**: https://github.com
2. **"New Repository"** butonuna tıklayın
3. **Repository adı**: `astropulse`
4. **Public** seçin (GitHub Pages için gerekli)
5. **"Create repository"** tıklayın

## 2️⃣ Kodu GitHub'a Yükleyin

```bash
# Terminal'de proje klasöründe:
git init
git add .
git commit -m "Initial commit: AstroPulse game"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/astropulse.git
git push -u origin main
```

## 3️⃣ GitHub Pages'i Aktifleştirin

1. **Repository'ye gidin**: https://github.com/YOUR_USERNAME/astropulse
2. **Settings** sekmesine tıklayın
3. **Pages** bölümüne gidin (sol menüde)
4. **Source**: "GitHub Actions" seçin
5. **Save** tıklayın

## 4️⃣ Otomatik Deploy

- Kod her `main` branch'e push edildiğinde otomatik deploy olur
- **Actions** sekmesinden deploy durumunu takip edebilirsiniz
- Deploy tamamlandıktan sonra oyun şu adreste olacak:
  **https://YOUR_USERNAME.github.io/astropulse**

## 5️⃣ Manuel Deploy (İsteğe Bağlı)

```bash
# Manuel deploy için:
npm run deploy
```

## 6️⃣ URL'yi Güncelleyin

Deploy tamamlandıktan sonra:

1. `package.json`'da `homepage` kısmını güncelleyin
2. `README.md`'de tüm `YOUR_USERNAME` yerine kendi kullanıcı adınızı yazın
3. Değişiklikleri commit edin:

```bash
git add .
git commit -m "Update URLs for GitHub Pages"
git push
```

## ✅ Tamamlandı!

Oyununuz artık **https://YOUR_USERNAME.github.io/astropulse** adresinde yayında!

## 🔧 Sorun Giderme

### Deploy Başarısız Olursa:
1. **Actions** sekmesine gidin
2. **Deploy** işlemini kontrol edin
3. Hata mesajlarını okuyun
4. Gerekirse `.github/workflows/deploy.yml` dosyasını düzenleyin

### Oyun Açılmazsa:
1. **Settings** → **Pages** → **Source** kontrol edin
2. **Actions** sekmesinde deploy durumunu kontrol edin
3. Browser cache'ini temizleyin

## 🎮 Test Edin

Deploy tamamlandıktan sonra:
1. **https://YOUR_USERNAME.github.io/astropulse** adresine gidin
2. Oyunun açıldığını kontrol edin
3. Tüm özelliklerin çalıştığını test edin

---

**🎉 Tebrikler! Oyununuz artık internette yayında!**
