# Wibu.ID — Netflix Dark + Live Bstation

![Wibu.ID Banner](https://img.shields.io/badge/Wibu.ID-Netflix%20Dark-E50914?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-14.2.5-black?style=flat-square&logo=next.js)
![Vercel](https://img.shields.io/badge/Vercel-Ready-black?style=flat-square&logo=vercel)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

**Wibu.ID** adalah katalog anime modern bergaya **Netflix Dark** dengan data **LIVE dari Bstation (bilibili.tv)** via scraper `xemoz`. Semua pemutaran menggunakan **Embed Resmi Bilibili.tv (iframe)** — aman DMCA, tidak re-host.

🔗 **Live Demo:** https://wibu-five.vercel.app  
📦 **Repo:** https://github.com/lucuk094-crypto/wibu.id

---

## ✨ Fitur Lengkap

| Fitur | Deskripsi | Status |
|-------|-----------|--------|
| **Homepage Netflix** | Hero live + 2 carousel + genre pills + jadwal hari ini | ✅ |
| **Jadwal Tayang** | 7 hari jadwal rilis anime, highlight *Hari Ini* | ✅ |
| **Trending & Ranking** | Ranking anime + tabs genre live | ✅ |
| **Genre Browse** | Filter by Isekai, Fantasi, Aksi, dll | ✅ |
| **Search Live** | Cari anime & video, pisah totals | ✅ |
| **Player UGC** | Detail video, uploader, stats, related | ✅ |
| **Player Anime OGV** | Season, studio, episode list 50, sinopsis | ✅ |
| **List Saya** | Watchlist localStorage, simpan/hapus | ✅ |
| **History** | Riwayat tonton (localStorage) | ✅ |
| **Profile & Settings** | Ganti bahasa id/en/th/vi, tema | ✅ |
| **Thumbnail Anti-Error** | `abs()` + `onerror` fallback, tidak ada broken image | ✅ |
| **Semua Tombol Aktif** | Sidebar desktop + bottom nav mobile 100% linked | ✅ |
| **Vercel Green** | Next.js 14 + Node 24.x, build ✓, no document error | ✅ |

---

## 🖼️ Desain

- **Tema:** Netflix Dark (#080808, #141414, #E50914)
- **Ikon:** Lucide React resmi (tanpa emoji, tanpa neon)
- **Sidebar:** Desktop vertikal 68px + Mobile bottom nav
- **Hero:** Gradient Netflix, N SERIES, IMDb badge, 2B+ Streams
- **Card:** 2:3 poster, hover scale 1.04, badge Gratis/N, duration, rank

---

## 🛠️ Tech Stack

- **Framework:** Next.js 14.2.5 (App Router, Server Components, force-dynamic)
- **Styling:** Tailwind CSS 3.4.4 + Inter font
- **Ikon:** lucide-react 0.400.0
- **Runtime:** Node 24.x (Vercel)
- **Scraper:** `lib/bstation.js` by **xemoz** — `window.__initialState` + `vm` sandbox, no dependency
- **Deploy:** Vercel (auto deploy dari GitHub)

---

## 📦 Instalasi Lokal

```bash
git clone https://github.com/lucuk094-crypto/wibu.id.git
cd wibu.id
npm install
npm run dev
# buka http://localhost:3000
```

Build production:
```bash
npm run build
npm start
```

---

## 🔌 API Bstation

Semua via `GET /api/bstation?cmd=&lang=id`

| Endpoint | Contoh | Deskripsi |
|----------|--------|-----------|
| `cmd=home` | `/api/bstation?cmd=home&lang=id` | Popular + animeTrending + timeline |
| `cmd=trending` | `/api/bstation?cmd=trending&lang=id` | Ranking + tabs genre |
| `cmd=timeline` | `/api/bstation?cmd=timeline&lang=id` | Jadwal 7 hari |
| `cmd=search` | `/api/bstation?cmd=search&q=naruto&lang=id` | Cari anime & video |
| `cmd=video` | `/api/bstation?cmd=video&id=480138...&lang=id` | Detail UGC + related |
| `cmd=play` | `/api/bstation?cmd=play&id=2117053&lang=id` | Detail Anime season + episodes |

**Thumbnail Fix:** Semua `cover` di-`abs()` (`//` → `https://`) + fallback placeholder.

---

## 🚀 Deploy ke Vercel

1. Fork repo ini
2. Vercel → New Project → Import `wibu.id`
3. Settings: Framework **Next.js**, Build kosong, Node **24.x**
4. Deploy → `https://wibu-id.vercel.app`

Atau via CLI:
```bash
npm i -g vercel
vercel --prod
```

---

## 📁 Struktur Proyek

```
wibu.id/
├─ app/
│  ├─ page.js              # Homepage + Hero + Jadwal hari ini
│  ├─ jadwal/page.js       # 7 hari timeline
│  ├─ trending/page.js     # Ranking + genre tabs
│  ├─ genre/page.js        # Filter genre
│  ├─ search/page.js       # Search live
│  ├─ player/page.js       # Player UGC + OGV anime
│  ├─ list/page.js         # Watchlist localStorage
│  ├─ history/page.js      # Riwayat localStorage
│  ├─ profile/page.js      # Settings bahasa
│  └─ api/bstation/route.js # API Route Handler
├─ components/
│  ├─ Sidebar.jsx          # Sidebar + bottom nav (Lucide)
│  ├─ Hero.jsx             # Hero Netflix
│  └─ Card.jsx             # Poster card anti-error
├─ lib/bstation.js         # Scraper xemoz (vm)
├─ public/                 # Static fallback
└─ vercel.json
```

---

## ⚖️ Legal & Etika

- Wibu.ID **tidak menyimpan video**. Pemutaran via **iframe resmi** `https://www.bilibili.tv/id/video/[ID]` — stream tetap dari server Bstation.
- Jangan gunakan untuk re-upload / leeching. Hormati hak cipta pemilik anime.
- Data katalog (judul, cover, deskripsi) dari scraper untuk tujuan katalog/edukasi.

---

## 🙏 Credits

- **Scraper:** [xemoz](https://github.com/xemoz) — `bstation.js` single-file no dependency
- **Desain:** Terinspirasi Netflix
- **Ikon:** [Lucide](https://lucide.dev)
- **Deploy:** [Vercel](https://vercel.com)

---

## 📄 Lisensi

MIT © 2026 Wibu.ID — Dibuat di Surabaya dengan ♥
