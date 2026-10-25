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
      <div className="md:ml-[68px] max-w-[1400px] mx-auto px-4 md:px-8 py-6">
        <h1 className="text-2xl font-black">Cari Anime & Video</h1>
        <p className="text-sm text-zinc-500 mt-1">Live Bstation — semua tombol aktif, thumbnail anti-error</p>
        <form action="/search" className="mt-4 flex gap-2">
          <input name="q" defaultValue={q} placeholder="Ketik: naruto, one piece, frieren..." className="flex-1 h-11 px-4 rounded-full bg-[#141414] border border-white/10 text-sm focus:outline-none focus:border-white/20" />
          <button className="px-6 h-11 rounded-full bg-[#E50914] text-white text-sm font-bold">Cari</button>
        </form>
        {result && (
          <div className="mt-6">
            <div className="text-xs text-zinc-400">Ditemukan {result.totals.anime} anime • {result.totals.videos} video untuk {result.keyword}</div>
            <h2 className="mt-4 text-sm font-bold">Anime</h2>
            <div className="mt-2 flex gap-3 overflow-x-auto no-scrollbar pb-3 flex-wrap">{result.anime.map(it => <Card key={it.id} item={it} />)}</div>
            <h2 className="mt-4 text-sm font-bold">Video</h2>
            <div className="mt-2 flex gap-3 overflow-x-auto no-scrollbar pb-3 flex-wrap">{result.videos.map(it => <Card key={it.id} item={it} />)}</div>
          </div>
        )}
      </div>
    </main>
  );
}
