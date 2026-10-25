# Wibu.ID — Netflix Dark + Live Bstation Scraper

**Desain sesuai gambar:** Netflix dark, sidebar vertikal, ikon Lucide SVG resmi (tanpa emoji, tanpa neon)

**Data LIVE dari Bstation (xemoz scraper):**
- Semua thumbnail & cover sudah di-`abs()` (`//` → `https://`) + `onerror` fallback → **tidak ada thumbnail error**
- Detail lengkap: title, cover HD, views, duration, author + avatar, stats (views/likes/coins), publishedAt, qualityOptions, subtitles, related videos
- Timeline, trending, search live via `/api/bstation`

**Cara kerja (Legal Opsi A):**
- Katalog = hasil scraper `bstation.js` (judul/cover/deskripsi)
- Player = `iframe` Embed Resmi `https://www.bilibili.tv/id/video/[ID]` → aman DMCA, tidak re-host

**File:**
- `index.html` — homepage Netflix-style, hero live, 2 carousel live
- `player.html` — player detail lengkap + embed resmi
- `server.js` — Node server (preview lokal + Vercel dev)
- `lib/bstation.js` — scraper logic (fix thumbnail + no-error)
- `api/bstation.js` — Serverless Function untuk Vercel
- `app.js` / `styles.css` / `data.js` (fallback jika API down)

**Deploy ke Vercel:**
1. Push folder `wibu-id` ke GitHub
2. Vercel → New Project → Import → Deploy (Vercel otomatis deteksi `api/` sebagai Functions)
3. Config: Framework = Other, Build Command kosong, Output = .
4. Jadi: `https://wibu-id.vercel.app` + API `https://wibu-id.vercel.app/api/bstation?cmd=home`

**API Endpoint:**
- `GET /api/bstation?cmd=home&lang=id` → popular + animeTrending + timeline
- `GET /api/bstation?cmd=search&q=naruto&lang=id` → anime + videos
- `GET /api/bstation?cmd=video&id=4801381259549184&lang=id` → detail lengkap + related
- `GET /api/bstation?cmd=trending&lang=id` → ranking + tabs
- `GET /api/bstation?cmd=play&id=2117053&lang=id` → season anime
- `GET /api/bstation?cmd=raw&path=/id/trending&lang=id` → state mentah

**Preview lokal:**
```
node server.js
# http://localhost:8000
```
