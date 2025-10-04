# 🚀 AstroPulse - Quick Start Guide

## Hızlı Kurulum (5 Dakika)

### 1. Gereksinimleri Kontrol Et

```bash
# Node.js versiyonunu kontrol et (v14+ olmalı)
node --version

# npm versiyonunu kontrol et
npm --version
```

Eğer Node.js yüklü değilse: https://nodejs.org/

### 2. Bağımlılıkları Yükle

```bash
npm install
```

⏳ Bu işlem 1-2 dakika sürebilir.

### 3. Oyunu Başlat

```bash
npm start
```

Bir QR kodu göreceksiniz! 📱

### 4. Telefonunuzda Test Et (Önerilen)

1. **App Store** (iOS) veya **Google Play** (Android)'den **Expo Go** uygulamasını indirin
2. Expo Go'yu açın
3. QR kodu tarayın
4. Oyun yüklenecek - **Oyna!** 🎮

### 5. Alternatif: Bilgisayarda Test

```bash
# Web browser'da (test için)
npm run web

# Android emulator (Android Studio gerekli)
npm run android

# iOS simulator (sadece Mac, Xcode gerekli)
npm run ios
```

---

## 🎮 Oyun Nasıl Oynanır?

1. **TAP** → Gemi yukarı çıkar 🚀
2. **BIRAK** → Yer çekimi çeker ⬇️
3. **TOPLA** → Yıldızlar = Puan + Coin ⭐
4. **KAÇIN** → Asteroidler ve düşmanlardan uzak dur ☄️
5. **COMBO** → Hızlı tap'ler = Yüksek skor 🔥

---

## ⚙️ Oyunu Özelleştir

### Zorluğu Değiştir

`src/constants/GameConfig.js` dosyasını aç:

```javascript
export const PHYSICS = {
  GRAVITY: 900,        // Daha yüksek = Daha zor
  JUMP_IMPULSE: -330,  // Daha negatif = Daha güçlü zıplama
  // ...
};

export const SPAWN = {
  INITIAL_INTERVAL: 1.4,  // Daha düşük = Daha hızlı spawn
  // ...
};
```

### Renkleri Değiştir

Aynı dosyada:

```javascript
export const COLORS = {
  BACKGROUND: '#0a0e27',  // Arkaplan
  PRIMARY: '#00d4ff',     // Ana renk (cyan)
  SECONDARY: '#ff00ff',   // İkincil (magenta)
  // ...
};
```

---

## 🔧 Sorun mu Var?

### "Cannot find module" hatası
```bash
rm -rf node_modules
npm install
```

### Expo cache temizle
```bash
npm start -- --clear
```

### Port zaten kullanımda
```bash
npm start -- --port 19002
```

---

## 📱 Fiziksel Cihazda Test (En İyi Deneyim)

Neden gerçek cihaz?
- ✅ Dokunmatik kontroller test edilebilir
- ✅ Gerçek performans
- ✅ Haptic feedback çalışır
- ✅ Tam ekran deneyimi

Emülatör sadece hızlı test için!

---

## 🎨 Asset Ekleme (Opsiyonel)

### Ses Efektleri

1. `assets/sounds/` klasörüne ses dosyalarını koy:
   - sfx_thrust.mp3
   - sfx_collect.mp3
   - sfx_explosion_small.mp3
   - vb.

2. Oyunu yeniden başlat - Sesler otomatik yüklenecek!

### Görseller

1. `assets/` klasörüne ekle:
   - icon.png (1024x1024)
   - splash.png (1242x2436)

2. Uygulamayı yeniden başlat

---

## 📊 Geliştirme Modu

### Console Logları Görmek İçin

Tarayıcıda Expo Dev Tools açıldığında:
- **Console** sekmesine tıkla
- Tüm console.log çıktılarını göreceksin

### Hızlı Yeniden Yükleme

Kod değiştiğinde otomatik yeniden yüklenir!
- Kaydet → Oyun otomatik güncellenir

Manuel yenileme:
- Cihazda oyunu salla → Geliştirici menüsü açılır
- "Reload" seçeneğine tıkla

---

## 🏗️ Production Build

Oyun hazır olduğunda:

```bash
# Android APK build et
expo build:android

# iOS build et (Mac gerekli)
expo build:ios
```

Detaylar için `DEPLOYMENT.md` dosyasına bak!

---

## 📚 Daha Fazla Bilgi

- **Tam Rehber**: `INSTRUCTIONS.md`
- **Deploy**: `DEPLOYMENT.md`
- **Değişiklikler**: `CHANGELOG.md`
- **Assetler**: `assets/README.md`

---

## 🎯 Sonraki Adımlar

1. ✅ Oyunu çalıştır ve oyna
2. 📝 Parametreleri tweakle
3. 🎨 Kendi assetlerini ekle
4. 🚀 Build al ve paylaş!

---

**Keyifli oyunlar ve geliştirmeler! 🚀✨**

Sorular? `README.md` dosyasına bak veya Expo dökümanlarını kontrol et: https://docs.expo.dev/

