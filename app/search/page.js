import Sidebar from "../../components/Sidebar";
import { search } from "../../lib/bstation";
import Card from "../../components/Card";

export const dynamic = "force-dynamic";

export default async function SearchPage({ searchParams }) {
  const q = searchParams?.q || "";
  let result = null;
  if (q) { try { result = await search(q, "id"); } catch (e) {} }
  return (
    <main>
      <Sidebar />
      <div className="md:ml-[68px] max-w-[1400px] mx-auto px-4 md:px-8 py-6 pb-20">
        <h1 className="text-2xl font-black">Cari Anime & Video</h1>
        <p className="text-sm text-zinc-500 mt-1">Live Bstation — semua tombol aktif, thumbnail anti-error</p>
        <form action="/search" className="mt-4 flex gap-2">
          <input name="q" defaultValue={q} placeholder="Ketik: naruto, one piece, frieren..." className="flex-1 h-11 px-4 rounded-full bg-[#141414] border border-white/10 text-sm focus:outline-none focus:border-white/20" />
          <button className="px-6 h-11 rounded-full bg-[#E50914] text-white text-sm font-bold">Cari</button>
        </form>
        {q && !result && <div className="mt-6 text-xs text-red-400">Gagal memuat pencarian — coba keyword lain</div>}
        {result && (
          <div className="mt-6 space-y-6">
            <div className="text-xs text-zinc-400">Ditemukan <span className="text-white font-bold">{result.totals.anime}</span> anime • <span className="text-white font-bold">{result.totals.videos}</span> video untuk "{result.keyword}" • <a href={`https://www.bilibili.tv/id/search-result?q=${encodeURIComponent(q)}`} target="_blank" className="text-violet-400 underline">Lihat di Bstation</a></div>
            <div>
              <h2 className="text-sm font-bold">Anime • {result.anime.length}</h2>
              <div className="mt-3 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {result.anime.map(it=> <Card key={it.id} item={it} />)}
                {result.anime.length===0 && <span className="text-xs text-zinc-500">Tidak ada anime</span>}
              </div>
            </div>
            <div>
              <h2 className="text-sm font-bold">Video • {result.videos.length}</h2>
              <div className="mt-3 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {result.videos.map(it=> <Card key={it.id} item={it} />)}
                {result.videos.length===0 && <span className="text-xs text-zinc-500">Tidak ada video</span>}
              </div>
            </div>
          </div>
        )}
        {!q && (
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <a href="/search?q=naruto" className="p-4 rounded-xl bg-[#141414] border border-white/5 hover:border-white/20">🔍 Naruto</a>
            <a href="/search?q=one+piece" className="p-4 rounded-xl bg-[#141414] border border-white/5 hover:border-white/20">🏴‍☠️ One Piece</a>
            <a href="/search?q=frieren" className="p-4 rounded-xl bg-[#141414] border border-white/5 hover:border-white/20">🧝 Frieren</a>
            <a href="/search?q=solo+leveling" className="p-4 rounded-xl bg-[#141414] border border-white/5 hover:border-white/20">⚔️ Solo Leveling</a>
          </div>
        )}
      </div>
    </main>
  );
}
