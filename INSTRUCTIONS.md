# AstroPulse - Kurulum ve Çalıştırma Talimatları

## 🚀 Hızlı Başlangıç

### Gereksinimler
1. **Node.js** (v14 veya üzeri) - [İndir](https://nodejs.org/)
2. **npm** veya **yarn** (Node.js ile birlikte gelir)
3. **Expo CLI** (opsiyonel ama önerilir)
4. Mobil cihaz için: **Expo Go** uygulaması ([iOS](https://apps.apple.com/app/expo-go/id982107779) | [Android](https://play.google.com/store/apps/details?id=host.exp.exponent))

### Kurulum Adımları

#### 1. Bağımlılıkları Yükle
```bash
npm install
```

veya yarn kullanıyorsanız:
```bash
yarn install
```

#### 2. Geliştirme Sunucusunu Başlat
```bash
npm start
```

Bu komut Expo Dev Tools'u açacak. Bir QR kodu göreceksiniz.

#### 3. Oyunu Çalıştır

**Fiziksel Cihazda (Önerilen):**
1. Telefonunuza Expo Go uygulamasını indirin
2. QR kodu Expo Go ile tarayın
3. Oyun cihazınızda yüklenecek ve çalışacak

**Android Emülatör:**
```bash
npm run android
```

**iOS Simulator (Sadece Mac):**
```bash
npm run ios
```

**Web Browser (Test için):**
```bash
npm run web
```

## 🎮 Nasıl Oynanır

1. **Dokunma**: Ekrana dokunarak gemiye yukarı doğru itme ver
2. **Bırakma**: Yer çekimi gemini aşağı çekecek
3. **Yıldız Topla**: ⭐ yıldızları toplayarak puan ve coin kazan
4. **Engelleri Kaçın**: Asteroidler ve düşman gemilerinden uzak dur
5. **Combo Yap**: Hızlı ardışık dokunuşlarla combo oluştur ve çarpanları artır

## 🛠️ Geliştirme

### Proje Yapısı
```
src/
├── components/       # Oyun bileşenleri (gemi, düşmanlar, HUD)
├── screens/          # Ekranlar (menü, oyun, game over)
├── engine/           # Oyun motoru ve fizik
├── constants/        # Oyun konfigürasyonu ve sabitler
├── utils/            # Yardımcı sınıflar (storage, ses, haptic)
└── GameManager.js    # Ana oyun koordinatörü
```

### Oyun Parametrelerini Değiştirme

Oyun dengesini ayarlamak için `src/constants/GameConfig.js` dosyasını düzenleyin:

```javascript
export const PHYSICS = {
  GRAVITY: 900,        // Yer çekimi kuvveti
  JUMP_IMPULSE: -330,  // Zıplama gücü (daha negatif = daha güçlü)
  MAX_FALL_SPEED: 750, // Maksimum düşme hızı
  // ...
};
```

### Ses Efektleri Ekleme

1. Ses dosyalarınızı `assets/sounds/` klasörüne koyun
2. `src/utils/SoundManager.js` dosyasında ses yükleme kodunu aktif edin

### Grafikleri Özelleştirme

**Renkleri değiştirmek için:**
`src/constants/GameConfig.js` içindeki `COLORS` objesini düzenleyin.

**Sprite'lar eklemek için:**
`src/components/` klasöründeki bileşenleri güncelleyin ve `assets/` klasörüne görsellerinizi ekleyin.

## 📱 Yayın (Production Build)

### Android APK
```bash
expo build:android
```

### iOS IPA (Mac gerektirir)
```bash
expo build:ios
```

### EAS Build (Yeni Yöntem)
```bash
npm install -g eas-cli
eas build --platform android
eas build --platform ios
```

## 🐛 Sorun Giderme

### "Module not found" Hatası
```bash
rm -rf node_modules
npm install
```

### Expo Cache Temizleme
```bash
expo start -c
```

### Metro Bundler Sorunları
```bash
npx react-native start --reset-cache
```

### Port Zaten Kullanımda
Expo farklı bir port kullanacaktır, ancak manuel seçmek için:
```bash
expo start --port 19001
```

## 🎨 Asset'leri Hazırlama

### Oyun İkonları (İsteğe Bağlı)
- `assets/icon.png` (1024x1024)
- `assets/splash.png` (1242x2436)
- `assets/adaptive-icon.png` (1024x1024)

Şu anki oyun programatik grafikler kullanıyor, bu yüzden bu dosyalar opsiyonel.

### Ses Dosyaları (İsteğe Bağlı)
Daha iyi deneyim için `assets/sounds/` klasörüne şu dosyaları ekleyin:
- sfx_thrust.mp3
- sfx_collect.mp3
- sfx_explosion_small.mp3
- sfx_explosion_big.mp3
- sfx_powerup.mp3
- sfx_gameover.mp3
- sfx_ui_click.mp3
- music_ambient.mp3

## 📊 Oyun Özellikleri

### Şu Anda Çalışan
- ✅ Tek dokunuş kontrolü
- ✅ Fizik tabanlı hareket
- ✅ Skor ve coin sistemi
- ✅ Combo mekanikleri
- ✅ Çoklu engel tipleri
- ✅ Power-up sistemi
- ✅ Ana menü ve game over ekranları
- ✅ Best score kaydı
- ✅ Haptic feedback
- ✅ Parallax background
- ✅ Dinamik zorluk

### Planlanmış Özellikler
- ⏳ Günlük ödüller
- ⏳ Liderlik tablosu
- ⏳ Gemi skinleri
- ⏳ Yükseltme sistemi
- ⏳ Tutorial ekranı
- ⏳ Reklam entegrasyonu
- ⏳ IAP (In-App Purchase)

## 💡 İpuçları

### Performans Optimizasyonu
- Gerçek cihazda test edin (emülatörler yavaş olabilir)
- Development modundan production build'e geçin
- Çok fazla particle effect kullanmayın

### Oyun Dengesi Test Etme
`src/constants/GameConfig.js` içindeki değerleri değiştirerek:
- Zorluğu ayarlayın (SPAWN.INITIAL_INTERVAL)
- Fizik parametrelerini tweak edin (PHYSICS.GRAVITY)
- Skor çarpanlarını değiştirin (SCORING)

### Debug Modu
Konsol logları için:
```javascript
console.log('Debug info:', gameState);
```

## 🤝 Katkıda Bulunma

Bu proje şu anda kapalı kaynak ve öğrenme amaçlıdır.

## 📞 Destek

Sorularınız için proje sahibiyle iletişime geçin.

---

**Keyifli oyunlar! 🚀✨**

