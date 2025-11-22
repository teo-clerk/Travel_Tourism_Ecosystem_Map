# 🚀 How to Share Your Map (QR Code & Hosting)

To let others view your map on their phones by scanning a QR code, you need to **host** the website online. Here is the easiest way to do it for free.

## Option 1: The "Pro" Way (Vercel or Netlify)
*Best for sharing with anyone, anywhere.*

1.  **Push to GitHub**:
    *   Make sure your project is uploaded to a GitHub repository.
2.  **Deploy on Vercel** (Recommended):
    *   Go to [Vercel.com](https://vercel.com) and sign up.
    *   Click **"Add New Project"**.
    *   Select your GitHub repository.
    *   Click **"Deploy"**.
    *   Vercel will give you a link (e.g., `travel-map.vercel.app`).
3.  **Generate QR Code**:
    *   Copy your new Vercel link.
    *   Go to a site like [QRCode Monkey](https://www.qrcode-monkey.com/).
    *   Paste your link and download the QR Code image.
    *   Print it or show it on your screen!

## Option 2: The "Local" Way (Same Wi-Fi Only)
*Best for testing on your phone while developing.*

1.  **Run with Host Flag**:
    In your terminal, run:
    ```bash
    npm run dev -- --host
    ```
2.  **Find Network URL**:
    The terminal will show a "Network" URL, usually looking like:
    `http://192.168.1.XX:5173`
3.  **Scan**:
    *   Make sure your phone is on the **same Wi-Fi** as your computer.
    *   Type that number into your phone's browser.
    *   (Or use a QR generator for that local IP address).

## 📱 Mobile Optimization Tips
Since you want people to view this on phones:
*   The current app is responsive, but complex graphs can be heavy on mobile batteries.
*   The "Glassmorphism" effects look great on modern OLED phone screens!
