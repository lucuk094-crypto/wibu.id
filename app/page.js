import Sidebar from "../components/Sidebar";
import Hero from "../components/Hero";
import Card from "../components/Card";
import Link from "next/link";
import { home, trending } from "../lib/bstation";

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
  timeline: [],
  ranking: [],
  tabs: []
};

async function getDataWithTimeout(promise, ms=4000){
  return Promise.race([
    promise,
    new Promise(resolve => setTimeout(()=> resolve(null), ms))
  ]);
}

export default async function Home() {
  let data = FALLBACK, trendData = { ranking: [], tabs: [] };

  // Fetch dengan timeout 4 detik + fallback — biar tidak loading selamanya di Vercel
  const freshHome = await getDataWithTimeout(home("id"), 4000);
  if (freshHome) data = freshHome;
  
  const freshTrend = await getDataWithTimeout(trending("id"), 3000);
  if (freshTrend) trendData = freshTrend;

  const heroItem = data.animeTrending?.[0] || data.popular?.[0] || trendData.ranking?.[0] || FALLBACK.popular[0];
  const newItems = data.popular?.length ? data.popular : data.animeTrending;
  const trendingItems = trendData.ranking?.length ? trendData.ranking : data.animeTrending;

  return (
    <main>
      <Sidebar />
      <div className="md:ml-[68px] pb-20 md:pb-0">
        <Hero item={heroItem} />
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 mt-4 flex gap-2 overflow-x-auto no-scrollbar pb-2">
          <Link href="/genre" className="px-4 py-1.5 rounded-full text-xs font-bold bg-white text-black whitespace-nowrap">Semua Genre</Link>
          {(trendData.tabs || []).slice(0,10).map(t=>(
            <Link key={t.id || t.name} href={`/genre?name=${encodeURIComponent(t.name)}&id=${t.id||''}`} className="px-4 py-1.5 rounded-full text-xs font-semibold bg-[#141414] text-zinc-300 border border-white/5 hover:border-white/20 whitespace-nowrap">{t.name}</Link>
          ))}
        </div>
        {data.timeline?.find(d=>d.today) && (
          <div className="max-w-[1400px] mx-auto px-4 md:px-8 mt-4 bg-[#141414] rounded-xl border border-white/5 p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold">📅 Jadwal Hari Ini • {data.timeline.find(d=>d.today)?.day} {data.timeline.find(d=>d.today)?.date}</h2>
              <Link href="/jadwal" className="text-xs text-violet-400 font-bold">Lihat Jadwal →</Link>
            </div>
            <div className="mt-3 flex gap-3 overflow-x-auto no-scrollbar pb-1">
              {(data.timeline.find(d=>d.today)?.items || []).slice(0,8).map(it=> <Card key={it.id} item={it} />)}
            </div>
          </div>
        )}
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 mt-6">
          <div className="flex items-center justify-between">
            <h2 className="text-[13px] md:text-[14px] font-bold">New this week • Bstation UGC • {newItems?.length} video</h2>
            <Link href="/search?q=anime" className="text-xs text-zinc-400 hover:text-white">Lihat Semua →</Link>
          </div>
          <div className="mt-3 flex gap-3 overflow-x-auto no-scrollbar pb-3">
            {(newItems || []).map((it) => <Card key={it.id} item={it} />)}
          </div>
        </div>
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 mt-2">
          <div className="flex items-center justify-between">
            <h2 className="text-[13px] md:text-[14px] font-bold">Trending Now • {trendingItems?.length || 0} items</h2>
            <Link href="/trending" className="text-xs text-violet-400 font-bold">Ranking Lengkap →</Link>
          </div>
          <div className="mt-3 flex gap-3 overflow-x-auto no-scrollbar pb-6">
            {(trendingItems || []).slice(0,12).map((it) => <Card key={it.id} item={it} />)}
            {trendingItems?.length===0 && <span className="text-xs text-zinc-500">Memuat trending...</span>}
          </div>
        </div>
        <footer className="max-w-[1400px] mx-auto px-4 md:px-8 py-6 border-t border-white/5 mt-6 text-[11px] text-zinc-500">© 2026 Wibu.ID — Live Bstation SSR • Embed Resmi • <Link href="/search" className="text-violet-400">Cari</Link> • <Link href="/jadwal" className="text-violet-400">Jadwal</Link> • <Link href="/trending" className="text-violet-400">Trending</Link> • <span className="text-emerald-400">● Live</span></footer>
      </div>
    </main>
  );
}
