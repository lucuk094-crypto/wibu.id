import Sidebar from "../../components/Sidebar";
import { search, gwSuggest } from "../../lib/bstation";
import Card from "../../components/Card";
export const dynamic = "force-dynamic";
export default async function SearchPage({ searchParams }) {
  const q = searchParams?.q || "";
  let result = null;
  let suggest=[];
  if (q) { try { result = await search(q, "id"); } catch {} try { suggest = await gwSuggest(q, "id"); } catch {}
  }
  return (
    <main className="page-enter">
      <Sidebar />
      <div className="md:ml-[72px] max-w-[1400px] mx-auto px-4 md:px-8 py-6 pb-20">
        <div className="glass-strong rounded-2xl p-6">
          <h1 className="text-2xl font-black">Cari Anime & Video</h1>
          <p className="text-sm text-zinc-400 mt-1">Gateway suggest + live search • Glass smooth</p>
          <form action="/search" className="mt-4 flex gap-2">
            <input name="q" defaultValue={q} placeholder="Ketik: naruto, one piece, frieren..." className="flex-1 h-11 px-5 rounded-full glass border border-white/10 text-sm focus:outline-none focus:border-white/20 placeholder:text-zinc-500" />
            <button className="px-7 h-11 rounded-full bg-[#E50914] text-white text-sm font-bold shadow-lg hover:scale-105 transition">Cari</button>
          </form>
          {suggest.length>0 && (
            <div className="mt-4 flex gap-2 overflow-x-auto no-scrollbar pb-1">
              {suggest.slice(0,8).map(s=>(
                <a key={s.keyword} href={`/search?q=${encodeURIComponent(s.keyword)}`} className="px-3.5 py-1.5 rounded-full glass text-xs whitespace-nowrap hover:bg-white hover:text-black transition">{s.keyword}</a>
              ))}
            </div>
          )}
        </div>
        {q && result && (
          <div className="mt-6 space-y-6">
            <div className="glass rounded-full px-4 py-2 text-xs text-zinc-400 inline-flex gap-2">Ditemukan <span className="text-white font-bold">{result.totals.anime}</span> anime • <span className="text-white font-bold">{result.totals.videos}</span> video untuk "{result.keyword}"</div>
            <div className="glass rounded-2xl p-5">
              <h2 className="text-sm font-black">Anime • {result.anime.length}</h2>
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {result.anime.map(it=> <Card key={it.id} item={it} />)}
              </div>
            </div>
            <div className="glass rounded-2xl p-5">
              <h2 className="text-sm font-black">Video • {result.videos.length}</h2>
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {result.videos.map(it=> <Card key={it.id} item={it} />)}
              </div>
            </div>
          </div>
        )}
        {!q && (
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              {q:"naruto", label:"Naruto", icon:"🍥"},
              {q:"one piece", label:"One Piece", icon:"🏴‍☠️"},
              {q:"frieren", label:"Frieren", icon:"🧝"},
              {q:"solo leveling", label:"Solo Leveling", icon:"⚔️"},
            ].map(it=>(
              <a key={it.q} href={`/search?q=${encodeURIComponent(it.q)}`} className="glass rounded-xl p-5 hover:bg-white/[0.08] transition group">
                <div className="text-lg group-hover:scale-110 transition">{it.icon}</div><div className="text-sm font-bold mt-1">{it.label}</div>
              </a>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
