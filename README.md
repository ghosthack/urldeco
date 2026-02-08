# 🌐 URL Deco

A simple, elegant URL encoder/decoder with dark/light theme support.

## Features

- **Encode/Decode URLs** - Instant conversion with copy-to-clipboard
- **Dark/Light Themes** - Toggle between modes with localStorage persistence
- **Web App** - Deployed on Cloudflare Pages
- **Desktop App** - Native apps for macOS, Windows, and Linux with auto-updater
- **Paste/Copy Buttons** - Quick clipboard operations

## Usage

### Web App
**Live at:** https://urldeco.pages.dev

### Desktop App
Download from [Releases](https://github.com/ghosthack/urldeco/releases)

## Development

```bash
# Install dependencies
npm install

# Web development
npm run dev

# Desktop development
npm run electron:dev

# Build desktop app
npm run electron:build
npm run electron:build:mac
npm run electron:build:win
npm run electron:build:linux
```

## Tech Stack

- React + TypeScript + Vite
- Electron (desktop)
- SCSS (theming with CSS variables)
- Cloudflare Pages (web hosting)
- GitHub Actions (CI/CD)

## License

MIT
