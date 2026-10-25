import Sidebar from "../components/Sidebar";
import Hero from "../components/Hero";
import Card from "../components/Card";
import Link from "next/link";
import { home } from "../lib/bstation";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const FALLBACK = {
  popular: [
    { id: "4786398590799360", type: "ugc", title: "KIMI NO NAWA — Anime Trending Romance", cover: "https://pic.bstarstatic.com/ugc/1866aec5ec961b7ac03b2b42aa258e94.jpg", views: "117K Ditonton", duration: "1:46:36", badge: "Gratis" },
    { id: "4801381259549184", type: "ugc", title: "A Good Day to Ascend Eps 17 Sub Indo", cover: "https://pic.bstarstatic.com/ugc/7fe7123fb6984b1e65ea67a13697756c.jpg", views: "1.5K Ditonton", duration: "18:41", badge: "Gratis" },
  ],
  animeTrending: [
    { id: "2117053", type: "ogv", title: "Kisah Penggembala Dewa", cover: "https://pic.bstarstatic.com/ogv/bac6048b713c32beea4a489e6be4a38c.png", views: "43.2M Putar", status: "Diperbarui ke E 105", badge: "Gratis" },
  ],
};

async function getDataSafe() {
  try {
    const d = await home("id");
    if (!d) return null;
    // ensure minimal fields
    if ((!d.popular || d.popular.length===0) && (!d.animeHot || d.animeHot.length===0)) return null;
    return d;
  } catch { return null; }
}

export default async function Home() {
  let data = await getDataSafe();
  // ultimate fallback if gateway + html both down
  if (!data) {
    data = {
      popular: FALLBACK.popular,
      animeTrending: FALLBACK.animeTrending,
      animeHot: FALLBACK.animeTrending,
      animeHot2: [],
      animeNew: FALLBACK.popular,
      timeline: [],
      tabs: [{name:"Semua", id:"all"},{name:"Hot", id:"0"},{name:"Terbaru", id:"2"},{name:"Aksi", id:"aksi"},{name:"Romance", id:"romance"},{name:"Fantasi", id:"fantasi"}],
      filterOrder: [],
      meta: { gw:{ hot:false } }
    };
  }

  const heroItem = data.animeHot?.[0] || data.animeTrending?.[0] || data.popular?.[0] || FALLBACK.popular[0];
  const today = data.timeline?.find(d=>d.today);

  return (
    <main>
      <Sidebar />
      <div className="md:ml-[68px] pb-20 md:pb-0">
        <Hero item={heroItem} />

        {/* Genre / Filter pills — lengkap dari gateway filters */}
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 mt-4 flex gap-2 overflow-x-auto no-scrollbar pb-2">
          <Link href="/genre" className="px-4 py-1.5 rounded-full text-xs font-bold bg-white text-black whitespace-nowrap">Semua Genre</Link>
          {(data.tabs || []).slice(0,14).map(t=>(
            <Link key={(t.id||t.name)+t.name} href={`/genre?name=${encodeURIComponent(t.name)}&id=${t.id||''}`} className="px-4 py-1.5 rounded-full text-xs font-semibold bg-[#141414] text-zinc-300 border border-white/5 hover:border-white/20 whitespace-nowrap">
              {t.name}
            </Link>
          ))}
          <span className="px-3 py-1.5 text-[11px] text-zinc-600 whitespace-nowrap">{data.meta?.gw?.hot ? "● Gateway Live" : "● Cache"}</span>
        </div>

        {/* Jadwal Hari Ini */}
        {today && today.items?.length>0 && (
          <div className="max-w-[1400px] mx-auto px-4 md:px-8 mt-4 bg-[#141414] rounded-xl border border-white/5 p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold">📅 Jadwal Hari Ini • {today.day} {today.date}</h2>
              <Link href="/jadwal" className="text-xs text-violet-400 font-bold">Lihat Jadwal →</Link>
            </div>
            <div className="mt-3 flex gap-3 overflow-x-auto no-scrollbar pb-1">
              {today.items.slice(0,10).map(it=> <Card key={it.id} item={it} />)}
            </div>
          </div>
        )}

        {/* New this week — UGC popular */}
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 mt-6">
          <div className="flex items-center justify-between">
            <h2 className="text-[13px] md:text-[14px] font-bold">New this week • UGC • {data.popular?.length || 0} video</h2>
            <Link href="/search?q=anime" className="text-xs text-zinc-400 hover:text-white">Lihat Semua →</Link>
          </div>
          <div className="mt-3 flex gap-3 overflow-x-auto no-scrollbar pb-3">
            {(data.popular || []).map((it) => <Card key={`pop-${it.id}`} item={it} />)}
            {(!data.popular || data.popular.length===0) && <span className="text-xs text-zinc-500">Memuat video...</span>}
          </div>
        </div>

        {/* Trending Now — Hot via gateway items_v2 order=0 */}
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 mt-2">
          <div className="flex items-center justify-between">
            <h2 className="text-[13px] md:text-[14px] font-bold">Trending Now • Hot • {data.animeHot?.length || 0} anime</h2>
            <Link href="/trending" className="text-xs text-[#E50914] font-bold">Ranking Lengkap →</Link>
          </div>
          <div className="mt-3 flex gap-3 overflow-x-auto no-scrollbar pb-3">
            {(data.animeHot || []).slice(0,16).map((it) => <Card key={`hot-${it.id}`} item={it} />)}
            {(!data.animeHot || data.animeHot.length===0) && <span className="text-xs text-zinc-500">Memuat trending...</span>}
          </div>
        </div>

        {/* Terbaru via gateway order=2 */}
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 mt-2">
          <div className="flex items-center justify-between">
            <h2 className="text-[13px] md:text-[14px] font-bold">Terbaru • {data.animeNew?.length || 0} judul</h2>
            <Link href="/genre?name=Terbaru&id=2" className="text-xs text-zinc-400 hover:text-white">Lihat Terbaru →</Link>
          </div>
          <div className="mt-3 flex gap-3 overflow-x-auto no-scrollbar pb-3">
            {(data.animeNew || []).slice(0,16).map((it) => <Card key={`new-${it.id}`} item={it} />)}
          </div>
        </div>

        {/* Lanjutan Hot page 2 + Anime Trending legacy */}
        {(data.animeHot2?.length>0 || data.animeTrending?.length>0) && (
          <div className="max-w-[1400px] mx-auto px-4 md:px-8 mt-2">
            <div className="flex items-center justify-between">
              <h2 className="text-[13px] md:text-[14px] font-bold">Rekomendasi Untukmu • { (data.animeHot2?.length||0) + (data.animeTrending?.length||0)} judul</h2>
              <Link href="/genre" className="text-xs text-zinc-400 hover:text-white">Jelajahi Genre →</Link>
            </div>
            <div className="mt-3 flex gap-3 overflow-x-auto no-scrollbar pb-6">
              {(data.animeHot2 || []).slice(0,8).map((it) => <Card key={`hot2-${it.id}`} item={it} />)}
              {(data.animeTrending || []).slice(0,8).map((it) => <Card key={`trend-${it.id}`} item={it} />)}
            </div>
          </div>
        )}

        {/* Info bar */}
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 mt-2 grid grid-cols-2 md:grid-cols-4 gap-2 text-[11px]">
          <div className="bg-[#141414] border border-white/5 rounded-lg p-3"><div className="font-bold text-white">● Auto Play Lancar</div><div className="text-zinc-500">Embed resmi Bilibili.tv — HD, no lag, mobile OK</div></div>
          <div className="bg-[#141414] border border-white/5 rounded-lg p-3"><div className="font-bold text-white">♡ Like & Save</div><div className="text-zinc-500">Like/dislike + simpan ke List tanpa login</div></div>
          <div className="bg-[#141414] border border-white/5 rounded-lg p-3"><div className="font-bold text-white">💬 Komentar</div><div className="text-zinc-500">Komentar per video + terpopuler/terbaru</div></div>
          <div className="bg-[#141414] border border-white/5 rounded-lg p-3"><div className="font-bold text-white">🔎 Semua Genre</div><div className="text-zinc-500">{data.tabs?.length || 0}+ filter Hot/Terbaru + pencarian</div></div>
        </div>

        <footer className="max-w-[1400px] mx-auto px-4 md:px-8 py-6 border-t border-white/5 mt-6 text-[11px] text-zinc-500">© 2026 Wibu.ID — Data live via gateway + HTML fallback • Embed Resmi Bstation • <Link href="/search" className="text-violet-400">Cari</Link> • <Link href="/jadwal" className="text-violet-400">Jadwal</Link> • <Link href="/trending" className="text-violet-400">Trending</Link> • <Link href="/genre" className="text-violet-400">Genre</Link> • <span className="text-emerald-400">● Live</span></footer>
      </div>
    </main>
  );
}
