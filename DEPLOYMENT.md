# Production Deployment Guide — BALMANDAISA Live Presentation

This guide covers deploying the **BALMANDAISA by DAC** cinematic live availability presentation system to **Vercel** for 24/7 continuous operation on sales lounge LED video walls, 4K displays, and mobile/desktop browsers.

---

## 1. Prerequisites

1. **GitHub / GitLab / Bitbucket** account.
2. **Vercel** account linked to your Git provider.
3. **Google Cloud Service Account** with Google Sheets API access.
4. **Google Spreadsheet** containing the project stock and availability data.

---

## 2. Google Cloud Service Account & Sheet Permissions

1. Open the [Google Cloud Console](https://console.cloud.google.com/).
2. Enable the **Google Sheets API**.
3. Create a **Service Account** under **IAM & Admin** → **Service Accounts**.
4. Create and download a **JSON Key** for the Service Account.
5. Note the Service Account email (e.g. `your-service-account@project-id.iam.gserviceaccount.com`).
6. Open your **Google Spreadsheet** with BALMANDAISA stock data, click **Share**, and share with the Service Account email with **Viewer** permission.

---

## 3. Vercel Environment Variables Setup

When importing the repository into Vercel, configure the following Environment Variables in **Project Settings** → **Environment Variables**:

| Variable Name | Description | Example Value |
| :--- | :--- | :--- |
| `GOOGLE_SHEET_ID` | The ID from your Google Sheets URL | `1k15-aKz8wV1a8k7e6b8c...` |
| `GOOGLE_SHEET_NAME` | The tab name in your spreadsheet | `Sheet1` |
| `GOOGLE_SERVICE_ACCOUNT_KEY` | Entire JSON key contents as a string | `{"type":"service_account",...}` |

*(Alternative to `GOOGLE_SERVICE_ACCOUNT_KEY`: set `GOOGLE_CLIENT_EMAIL` and `GOOGLE_PRIVATE_KEY` separately).*

---

## 4. Local Production Build Testing

Before deploying, run a full local production build to verify zero errors:

```bash
# Install dependencies
npm install

# Test production build
npm run build

# Start local production server
npm start
```

Open `http://localhost:3000` to verify:
* Introductory cinematic sequence.
* Building elevation with level hotspots.
* 13 residential floor plans with live availability tags.
* 6-second auto-play transition cycle.

---

## 5. One-Click Vercel Deployment

1. Push your code to your GitHub repository.
2. In Vercel, click **Add New** → **Project**.
3. Select your repository.
4. Framework Preset: **Next.js** (auto-detected).
5. Add the Environment Variables listed in Section 3.
6. Click **Deploy**.

---

## 6. Post-Deployment Verification

Once deployed to your production Vercel URL (e.g. `https://balmandaisa.vercel.app`):

1. **Live Presentation**: Confirm the presentation automatically starts and plays smoothly through Intro → Elevation → Floor 1 → ... → Floor 13 → Summary.
2. **Google Sheets Sync**: Change a unit's status in Google Sheets (e.g. change an `AVAILABLE` unit to `BOOKED`). Confirm the presentation automatically updates within 15 seconds.
3. **Resilience Test**: Confirm that if Google Sheets is momentarily unreachable, the presentation continues playing uninterrupted using cached data.
4. **Full-Screen TV Mode**: Press `F` or click the fullscreen icon to launch full-screen mode for sales displays.

---

## 7. Keyboard & Display Controls Reference

* `Space` or `P`: Play / Pause presentation autoplay.
* `Right Arrow` / `Left Arrow`: Step to next or previous floor.
* `0`: Jump to 3D Building Elevation view.
* `1` – `9`: Jump directly to Floor 01 – Floor 09.
* `F`: Toggle full-screen mode.
* `R`: Force immediate Google Sheets live data refresh.
