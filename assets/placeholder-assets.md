# Placeholder Assets Guide

Since we can't generate actual image files, here are the specifications for creating your assets:

## App Icon (icon.png) - 1024x1024

Create a square icon with:
- **Background**: Dark blue gradient (#0a0e27 to #1a1e47)
- **Main Element**: White/cyan triangle (spaceship) pointing right
- **Accent**: Yellow/gold thruster glow behind the ship
- **Border**: Optional thin cyan glow
- **Style**: Minimalist, neon sci-fi

## Splash Screen (splash.png) - 1242x2436

Create a vertical splash screen with:
- **Background**: Same dark blue as app (#0a0e27)
- **Title**: "ASTROPULSE" in large cyan (#00d4ff) letters
- **Subtitle**: "Tap to survive" in smaller white text
- **Visual**: Small spaceship with thruster trail
- **Elements**: Scattered small stars in background

## Adaptive Icon (adaptive-icon.png) - 1024x1024

Same as icon.png but ensure the important elements are within the safe zone (center 66% of the canvas) as Android will crop it into different shapes.

## Online Tools to Create Assets

### For Icons:
1. **Canva** (https://canva.com)
   - Use templates, customize colors
   - Export as PNG at 1024x1024

2. **Figma** (https://figma.com)
   - Professional design tool
   - Free tier available

3. **GIMP** (https://gimp.org)
   - Free, open-source
   - Full-featured

### For Quick Placeholders:
1. **Placeholder.com**
   - Generate solid color placeholders
   - https://placeholder.com/

2. **Icon Generator** (Expo)
   ```bash
   npx @expo/image-utils generate-icon --foreground ./path/to/icon.png --background "#0a0e27"
   ```

## Temporary Solution

Until you create proper assets, the app will use Expo's default icon/splash. The game is fully functional without custom icons!

## Color Reference

Copy these hex codes for your design tool:

```
Background Dark: #0a0e27
Primary Cyan: #00d4ff
Secondary Magenta: #ff00ff
Accent Yellow: #ffff00
Star Gold: #ffd700
Danger Red: #ff3366
Success Green: #00ff88
```

## Asset Checklist

- [ ] icon.png (1024x1024)
- [ ] splash.png (1242x2436)
- [ ] adaptive-icon.png (1024x1024)
- [ ] Sound effects (optional but recommended)
- [ ] Background music (optional)

Once you have these files, simply place them in the `assets/` directory and Expo will automatically use them!

