# Assets Directory

## Required Assets

### Images

#### App Icons
- `icon.png` (1024x1024) - Main app icon
- `adaptive-icon.png` (1024x1024) - Android adaptive icon
- `splash.png` (1242x2436) - Splash screen

#### Game Sprites (optional enhancements)
You can add custom sprites here to replace the programmatic graphics:
- Ship sprites (idle, thrust, explode animations)
- Asteroid variations
- Enemy drone sprites
- Power-up icons
- Particle effects

### Sounds

Place audio files in the `sounds/` directory:

- **sfx_thrust.mp3** - Played when player taps (short, punchy)
- **sfx_collect.mp3** - Played when collecting stars (pleasant chime)
- **sfx_explosion_small.mp3** - Small collision sound
- **sfx_explosion_big.mp3** - Large collision sound
- **sfx_powerup.mp3** - Power-up collection (bright, energetic)
- **sfx_gameover.mp3** - Game over sound (somber)
- **sfx_ui_click.mp3** - UI button clicks
- **music_ambient.mp3** - Background music (2-3 minute loop, ambient synth)

## Asset Guidelines

### Images
- Use PNG format with transparency
- High resolution for crisp display on all devices
- Follow the neon sci-fi aesthetic (dark blue, cyan, magenta colors)

### Audio
- MP3 or M4A format
- Keep file sizes small (< 100KB for SFX)
- Normalize audio levels
- Background music should be subtle and not distract from gameplay

## Color Scheme

Based on GameConfig.js:
- Background: `#0a0e27` (dark blue)
- Primary: `#00d4ff` (neon cyan)
- Secondary: `#ff00ff` (neon magenta)
- Accent: `#ffff00` (yellow)
- Star: `#ffd700` (gold)
- Danger: `#ff3366` (red)
- Success: `#00ff88` (green)

## Current Status

Currently the game uses:
- ✅ Programmatic graphics (shapes drawn with React Native)
- ❌ Placeholder icon/splash (need custom designs)
- ❌ Audio files (need to be added)

The game is fully playable without custom assets, but adding them will significantly enhance the experience!

