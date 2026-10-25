import Sidebar from "../../components/Sidebar";
import Card from "../../components/Card";
import Link from "next/link";
import { animeData } from "../../lib/bstation";

export const dynamic = "force-dynamic";

export default async function AnimePage() {
  let data;
  try { data = await animeData("id"); } catch (e) { data = { forYou:[], category:{fields:[], items:{}}, timeline:[], ranking:[] }; }

  const cat = data.category || { fields:[], items:{} };
  const styleId = cat.items?.style_id;
  const areaId = cat.items?.area_id;
  const yearId = cat.items?.index_year;
  const order = cat.items?.order;

  return (
    <main className="page-enter">
      <Sidebar />
      <div className="md:ml-[72px] pb-20 md:pb-0 bg-[#070709] min-h-screen">
        {/* Header */}
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 pt-6">
          <div className="glass-strong rounded-2xl p-6">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-black">Anime</h1>
              <span className="glass px-3 py-1 rounded-full text-xs font-bold">Bilibili.tv Mirror • Glass</span>
              <span className="ml-auto hidden md:inline text-xs text-zinc-500">For You {data.forYou?.length||0} • Ranking {data.ranking?.length||0} • Tahun 2015-2026</span>
            </div>
            <p className="text-sm text-zinc-400 mt-1">Scrape detail dari <code className="glass px-1.5 py-0.5 rounded text-xs">/id/anime</code> — For You, Kategori, Ranking, Timeline — Glass smooth tanpa neon</p>
          </div>
        </div>

        {/* For You - 12 */}
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 mt-6">
          <div className="glass rounded-2xl p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-black flex items-center gap-2">✨ Untukmu • For You <span className="glass px-2 py-0.5 rounded-full text-xs">{data.forYou?.length||0}</span></h2>
              <span className="text-xs text-zinc-500">Scrape live 12 judul</span>
            </div>
            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {(data.forYou || []).map(it=> <Card key={it.id} item={it} />)}
              {(!data.forYou || data.forYou.length===0) && <span className="text-xs text-zinc-500">Memuat forYou...</span>}
            </div>
          </div>
        </div>

        {/* Category Filters - 4 fields */}
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 mt-6 space-y-3">
          {styleId && (
            <div className="glass rounded-2xl p-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black tracking-widest text-zinc-400">{styleId.name.toUpperCase()}</span>
                <span className="glass px-2 py-0.5 rounded-full text-xs">{styleId.values?.length} genre</span>
              </div>
              <div className="mt-3 flex gap-2 flex-wrap">
                {styleId.values?.map(v=>(
                  <Link key={v.keyword} href={`/search?q=${encodeURIComponent(v.name)}`} className="px-3 py-1.5 rounded-full text-xs font-bold glass hover:bg-white hover:text-black border border-white/5 transition">
                    {v.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
          <div className="grid md:grid-cols-3 gap-3">
            {areaId && (
              <div className="glass rounded-xl p-4">
                <div className="text-xs font-black text-zinc-400">{areaId.name}</div>
                <div className="mt-2 flex gap-2 flex-wrap">
                  {areaId.values?.map(v=> <span key={v.keyword} className="px-3 py-1 rounded-full glass text-xs font-bold">{v.name} • {v.keyword}</span>)}
                </div>
              </div>
            )}
            {order && (
              <div className="glass rounded-xl p-4">
                <div className="text-xs font-black text-zinc-400">{order.name}</div>
                <div className="mt-2 flex gap-2">
                  {order.values?.map(v=> <Link key={v.keyword} href={`/genre?name=${encodeURIComponent(v.name)}&id=${v.keyword}`} className="px-4 py-1.5 rounded-full text-xs font-black glass hover:bg-[#E50914] hover:text-white transition">{v.name}</Link>)}
                </div>
              </div>
            )}
            {yearId && (
              <div className="glass rounded-xl p-4">
                <div className="text-xs font-black text-zinc-400">{yearId.name}</div>
                <div className="mt-2 flex gap-2 flex-wrap">
                  {yearId.values?.slice(0,6).map(v=> <span key={v.keyword} className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-bold">{v.name}</span>)}
                </div>
              </div>
            )}
          </div>
          <div className="glass rounded-xl p-3 flex gap-2 overflow-x-auto no-scrollbar">
            <span className="text-xs font-black text-zinc-400 whitespace-nowrap py-1">Tahun lengkap:</span>
            {yearId?.values?.map(v=> <span key={v.keyword} className="px-2.5 py-1 rounded-full glass text-xs whitespace-nowrap">{v.name} <span className="text-zinc-500">{v.keyword}</span></span>)}
          </div>
        </div>

        {/* Ranking */}
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 mt-6">
          <div className="glass-strong rounded-2xl p-5">
            <h2 className="text-sm font-black">🏆 Ranking Anime • {data.ranking?.length||0} </h2>
            <div className="mt-4 flex gap-4 overflow-x-auto no-scrollbar pb-2">
              {(data.ranking || []).map((it, i)=>(
                <div key={it.id} className="relative flex-shrink-0">
                  <span className="absolute -top-2 -left-2 w-6 h-6 rounded-full bg-[#E50914] text-white text-xs font-black flex items-center justify-center z-10">#{i+1}</span>
                  <Card item={it} />
                </div>
              ))}
              {(!data.ranking || data.ranking.length===0) && <span className="text-xs text-zinc-500">Memuat ranking...</span>}
            </div>
          </div>
        </div>

        {/* Timeline info */}
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 mt-6">
          <div className="glass rounded-2xl p-5">
            <h3 className="text-sm font-black">Timeline • 7 hari</h3>
            <p className="text-xs text-zinc-500 mt-1">Data scrape dari `anime.timeline` (saat ini `cards:null` — jadwal diambil dari `home.timeline` yang sudah ada di /jadwal)</p>
            <div className="mt-3 flex gap-2 flex-wrap">
              {(data.timeline || []).map(d=>(
                <span key={d.full_date_text} className={`px-3 py-1.5 rounded-full text-xs font-bold border ${d.is_today ? "bg-[#E50914] text-white border-[#E50914]" : "glass border-white/5"}`}>{d.full_day_of_week} {d.full_date_text}</span>
              ))}
            </div>
          </div>
        </div>

        <footer className="max-w-[1400px] mx-auto px-4 md:px-8 py-8 mt-6 border-t border-white/5 text-[11px] text-zinc-500">
          Scrape: <code className="glass px-1.5 py-0.5 rounded">window.__initialState.anime</code> • forYou 12 + category 4 fields + ranking • Auto-push glass
        </footer>
      </div>
    </main>
  );
}
