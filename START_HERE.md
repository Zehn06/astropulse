# 🎮 AstroPulse - Buradan Başla!

Hoş geldiniz! Bu, GDevelop GDD'nizden React Native mobil oyuna dönüştürülmüş **AstroPulse** oyununuz.

## ⚡ Hızlı Başlangıç (3 Adım)

### 1️⃣ Kurulum
```bash
npm install
```

### 2️⃣ Başlat
```bash
npm start
```

### 3️⃣ Oyna!
- **Telefonda**: Expo Go ile QR kodu tara
- **Bilgisayarda**: `w` tuşuna bas (web)
- **Android**: `a` tuşuna bas
- **iOS**: `i` tuşuna bas (sadece Mac)

## 📚 Hangi Dosyayı Okuyayım?

### Hızlıca Başlamak İstiyorum!
➡️ **`QUICKSTART.md`** - 5 dakikada başla

### Detaylı Bilgi İstiyorum
➡️ **`README.md`** - Ana dokümantasyon

### Oyunu Özelleştirmek İstiyorum
➡️ **`src/constants/GameConfig.js`** - Tüm ayarlar burada

### Yayınlamak İstiyorum
➡️ **`DEPLOYMENT.md`** - Play Store & App Store rehberi

### Ses/Görsel Eklemek İstiyorum
➡️ **`assets/README.md`** - Asset rehberi

### Ne Değişti?
➡️ **`CHANGELOG.md`** - Versiyon geçmişi

### Genel Bakış
➡️ **`PROJECT_SUMMARY.md`** - Proje özeti

## 🎮 Oyun Hakkında

**AstroPulse** tek dokunuşla oynanan, uzay temalı, endless runner tarzı bir mobil oyun.

### Kontroller
- **TAP** = Yukarı git
- **BIRAK** = Aşağı düş

### Amaç
- ⭐ Yıldız topla
- ☄️ Engelleri kaçın
- 🏆 Yüksek skor yap
- 🔥 Kombo oluştur

## ✅ Özellikler

- ✅ Tek dokunuş kontrol
- ✅ Fizik tabanlı hareket
- ✅ Dinamik zorluk
- ✅ Combo sistemi
- ✅ Power-up'lar
- ✅ Coin & skor sistemi
- ✅ Best score kaydı
- ✅ Haptic feedback
- ✅ 60 FPS oynanış

## 🛠️ Hızlı Özelleştirme

Oyun parametrelerini değiştirmek çok kolay:

**Dosya**: `src/constants/GameConfig.js`

```javascript
// Daha kolay yapmak için:
GRAVITY: 700,  // (varsayılan: 900)

// Daha zor yapmak için:
SPAWN.INITIAL_INTERVAL: 1.0,  // (varsayılan: 1.4)

// Renkleri değiştir:
COLORS.PRIMARY: '#ff0000',  // (varsayılan: '#00d4ff')
```

Değiştir → Kaydet → Otomatik güncellenir!

## 📱 Test Etme

### En İyi Deneyim
Gerçek telefonda test edin (haptic feedback ve touch kontroller için)!

1. Expo Go indir ([iOS](https://apps.apple.com/app/expo-go/id982107779) / [Android](https://play.google.com/store/apps/details?id=host.exp.exponent))
2. `npm start` komutu
3. QR kodu tara
4. Oyna!

## 🎨 Asset Ekleme (Opsiyonel)

Oyun programatik grafikler kullanıyor (shapes), ama kendi assetlerinizi ekleyebilirsiniz:

### Ses Dosyaları
`assets/sounds/` klasörüne `.mp3` dosyalarını koyun:
- sfx_thrust.mp3
- sfx_collect.mp3
- sfx_explosion_small.mp3
- vb.

### Görseller (icon/splash)
`assets/` klasörüne:
- icon.png (1024x1024)
- splash.png (1242x2436)

Detaylar: `assets/README.md`

## 🚀 Production Build

Oyun hazır olduğunda:

```bash
# Android
expo build:android

# iOS (Mac gerekli)
expo build:ios
```

Detaylar: `DEPLOYMENT.md`

## 🐛 Sorun mu Var?

```bash
# Cache temizle
npm start -- --clear

# Node modules yeniden yükle
rm -rf node_modules
npm install

# Metro bundler reset
npx react-native start --reset-cache
```

Daha fazla: `INSTRUCTIONS.md` → Sorun Giderme

## 📊 Proje Yapısı

```
src/
├── components/      # UI bileşenleri
├── screens/         # Oyun ekranları
├── engine/          # Oyun motoru
├── constants/       # Config (buraya bak!)
└── utils/           # Yardımcılar
```

## 🎯 Sonraki Adımlar

1. ✅ Oyunu çalıştır ve oyna
2. 📝 `GameConfig.js` ile tweak yap
3. 🎨 Kendi assetlerini ekle
4. 🚀 Build al ve paylaş!

## 💡 Pro İpuçları

- **Gerçek cihazda test et** - Emülatörler yavaş olabilir
- **Config dosyasını keşfet** - Her şey orada!
- **Console'u izle** - Debug için değerli
- **Hot reload** - Kod değişince otomatik güncellenir

## 🆘 Yardım

- Dokümantasyonu oku: Yukarıdaki listeden seç
- Expo dökümanları: https://docs.expo.dev/
- React Native dökümanları: https://reactnative.dev/

## 📞 İletişim

Sorular için proje sahibiyle iletişime geçin.

---

## 🎉 Hazırsın!

```bash
npm install
npm start
```

**Keyifli oyunlar! 🚀✨**

---

_Bu oyun, GDevelop için yazılmış kapsamlı bir Game Design Document'ten React Native'e uyarlanmıştır. Tüm mekanikler, fizik parametreleri ve oyun dengesi orijinal GDD'ye sadık kalınarak implementle edilmiştir._

