# BALMANDAISA BY DAC — Live Cinematic Availability Presentation

A luxury architectural visualization and live inventory availability presentation system built for **BALMANDAISA by DAC**. Designed for continuous 24/7 playback on 4K sales lounge displays, LED video walls, and mobile/desktop browsers with real-time Google Sheets synchronization.

---

## 🌟 Key Features

* **Architectural Hero Presentation**: Minimal, editorial, high-end presentation where actual CAD blueprints and 3D elevations take center stage without distracting dashboard clutter.
* **13 Residential Floors & Duplex Levels**: Authentic CAD floor plans (including dedicated Floor 13 with duplex second levels) rendered at ultra-sharp vector clarity.
* **Live Google Sheets Availability**: Real-time background synchronization with Google Sheets inventory via Google Cloud Service Account.
* **Resilient Offline Fallback**: Zero-crash architecture — seamlessly uses cached data or embedded seed stock if network or Google APIs temporarily disconnect.
* **Ultra-Lightweight 90%+ Compressed Assets**: High-fidelity WebP floor plans (`~450KB` each) with instant eager background preloading (0ms transition lag).
* **Distance-Legible Unit Pins**: High-contrast, non-interfering architectural unit badges with collision-aware property tooltips.
* **Cinematic Autoplay Loop**: 6-second dwell per floor with smooth easing transitions and interactive keyboard shortcuts (`Space`, `Arrow Keys`, `0`–`9`, `F`, `R`).

---

## 🚀 Quick Start (Local Development)

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env.local

# 3. Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the live presentation.

---

## 📦 Production Build & Testing

```bash
# Production build check
npm run build

# Run production server locally
npm start
```

---

## 🌐 Production Deployment (Vercel)

See [DEPLOYMENT.md](./DEPLOYMENT.md) for full step-by-step instructions on setting up Google Service Account credentials and deploying to Vercel.

---

## 📄 License & Confidentiality
Property of DAC Developers. All architectural drawings, elevations, and unit configurations are proprietary.
