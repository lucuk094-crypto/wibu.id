import Sidebar from "../components/Sidebar";
import Hero from "../components/Hero";
import Card from "../components/Card";
import Link from "next/link";
import { home, trending } from "../lib/bstation";

export const dynamic = "force-dynamic";

export default async function Home() {
  let data, trendData;
  try { data = await home("id"); } catch (e) { data = { popular: [], animeTrending: [], timeline: [] }; }
  try { trendData = await trending("id"); } catch (e) { trendData = { ranking: [], tabs: [] }; }

  const heroItem = data.animeTrending?.[0] || data.popular?.[0] || trendData.ranking?.[0];
  const newItems = data.popular?.length ? data.popular : data.animeTrending;
  const trendingItems = trendData.ranking?.length ? trendData.ranking : data.animeTrending;
  const jadwalHariIni = data.timeline?.find(d=>d.today) || data.timeline?.[0];

  return (
    <main>
      <Sidebar />
      <div className="md:ml-[68px] pb-20 md:pb-0">
        <Hero item={heroItem} />

        {/* GENRE PILLS */}
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 mt-4 flex gap-2 overflow-x-auto no-scrollbar pb-2">
          <Link href="/genre" className="px-4 py-1.5 rounded-full text-xs font-bold bg-white text-black whitespace-nowrap">Semua Genre</Link>
          {(trendData.tabs || []).slice(0,10).map(t=>(
            <Link key={t.id || t.name} href={`/genre?name=${encodeURIComponent(t.name)}&id=${t.id||''}`} className="px-4 py-1.5 rounded-full text-xs font-semibold bg-[#141414] text-zinc-300 border border-white/5 hover:border-white/20 whitespace-nowrap">{t.name}</Link>
          ))}
          <Link href="/genre" className="px-4 py-1.5 rounded-full text-xs font-semibold bg-[#141414] text-zinc-400 border border-white/5 whitespace-nowrap">Lihat Semua →</Link>
        </div>

        {/* JADWAL HARI INI */}
        {jadwalHariIni && (
          <div className="max-w-[1400px] mx-auto px-4 md:px-8 mt-4 bg-[#141414] rounded-xl border border-white/5 p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold">📅 Jadwal Hari Ini • {jadwalHariIni.day} {jadwalHariIni.date} {jadwalHariIni.today && <span className="ml-2 bg-[#E50914] text-white text-[10px] px-2 py-0.5 rounded-full">HARI INI</span>}</h2>
              <Link href="/jadwal" className="text-xs text-violet-400 font-bold">Lihat Jadwal →</Link>
            </div>
            <div className="mt-3 flex gap-3 overflow-x-auto no-scrollbar pb-1">
              {(jadwalHariIni.items || []).slice(0,8).map(it=> <Card key={it.id} item={it} />)}
              {(!jadwalHariIni.items || jadwalHariIni.items.length===0) && <span className="text-xs text-zinc-500">Tidak ada jadwal hari ini — cek hari lain di jadwal</span>}
            </div>
          </div>
        )}

        {/* NEW THIS WEEK */}
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 mt-6">
          <div className="flex items-center justify-between">
            <h2 className="text-[13px] md:text-[14px] font-bold">New this week • Bstation UGC • {newItems?.length} video</h2>
            <Link href="/search?q=anime" className="text-xs text-zinc-400 hover:text-white">Lihat Semua →</Link>
          </div>
          <div className="mt-3 flex gap-3 overflow-x-auto no-scrollbar pb-3">
            {(newItems || []).map((it) => <Card key={it.id} item={it} />)}
            {newItems?.length===0 && <span className="text-xs text-zinc-500">Gagal memuat — coba refresh</span>}
          </div>
        </div>

        {/* TRENDING NOW */}
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 mt-2">
          <div className="flex items-center justify-between">
            <h2 className="text-[13px] md:text-[14px] font-bold">Trending Now • Ranking Anime • {trendingItems?.length}</h2>
            <Link href="/trending" className="text-xs text-violet-400 font-bold">Ranking Lengkap →</Link>
          </div>
          <div className="mt-3 flex gap-3 overflow-x-auto no-scrollbar pb-6">
            {(trendingItems || []).map((it) => <Card key={it.id} item={it} />)}
          </div>
        </div>

        {/* STATS FOOTER */}
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 grid grid-cols-3 gap-3">
          <div className="bg-[#141414] border border-white/5 rounded-xl p-4 text-center"><div className="text-lg font-black">{data.popular?.length || 0}</div><div className="text-xs text-zinc-500">Video UGC Live</div></div>
          <div className="bg-[#141414] border border-white/5 rounded-xl p-4 text-center"><div className="text-lg font-black">{data.animeTrending?.length || 0}</div><div className="text-xs text-zinc-500">Anime Trending</div></div>
          <div className="bg-[#141414] border border-white/5 rounded-xl p-4 text-center"><div className="text-lg font-black">{trendData.ranking?.length || 0}</div><div className="text-xs text-zinc-500">Ranking</div></div>
        </div>

        <footer className="max-w-[1400px] mx-auto px-4 md:px-8 py-6 border-t border-white/5 mt-6 text-[11px] text-zinc-500">© 2026 Wibu.ID — Katalog Legal • Live Bstation SSR Next.js • Embed Resmi • Ikon Lucide • <Link href="/search" className="text-violet-400">Cari</Link> • <Link href="/jadwal" className="text-violet-400">Jadwal</Link> • <Link href="/trending" className="text-violet-400">Trending</Link></footer>
      </div>
    </main>
  );
}
