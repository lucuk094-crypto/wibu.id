import Sidebar from "../../components/Sidebar";
import Card from "../../components/Card";
import Link from "next/link";
import { trending, gwItems } from "../../lib/bstation";
export const dynamic = "force-dynamic";

export default async function TrendingPage(){
  let data = { ranking: [], tabs: [] };
  let hot=[], newest=[];
  try { data = await trending("id"); } catch {}
  try { hot = await gwItems({ order:0, pn:1, ps:12 }); newest = await gwItems({ order:2, pn:1, ps:12 }); } catch {}

  const ranking = data.ranking?.length ? data.ranking : hot;

  return (
    <main>
      <Sidebar />
      <div className="md:ml-[68px] max-w-[1400px] mx-auto px-4 md:px-8 py-6 pb-20">
        <h1 className="text-2xl font-black">Trending & Ranking</h1>
        <p className="text-sm text-zinc-500 mt-1">Ranking anime umum + genre — live gateway Bstation (Hot/Terbaru)</p>
        <div className="mt-4 flex gap-2 overflow-x-auto no-scrollbar pb-2">
          {(data.tabs || [{name:"Hot",id:0},{name:"Terbaru",id:2}]).map(t=>(
            <Link key={t.id+t.name} href={`/genre?name=${encodeURIComponent(t.name)}&id=${t.id||''}`} className="px-4 py-1.5 rounded-full text-xs font-semibold bg-[#141414] border border-white/5 hover:border-white/20 whitespace-nowrap">{t.name}</Link>
          ))}
        </div>

        <div className="mt-6">
          <h2 className="text-sm font-bold">🔥 Hot Trending • {ranking.length} judul</h2>
          <div className="mt-3 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {ranking.map(it=> <Card key={it.id} item={it} />)}
            {ranking.length===0 && <span className="text-xs text-zinc-500 col-span-full">Gagal memuat ranking — coba refresh</span>}
          </div>
        </div>

        {hot.length>0 && (
          <div className="mt-8">
            <h2 className="text-sm font-bold">Hot via Gateway • {hot.length}</h2>
            <div className="mt-3 flex gap-3 overflow-x-auto no-scrollbar pb-3">
              {hot.map(it=> <Card key={`h-${it.id}`} item={it} />)}
            </div>
          </div>
        )}
        {newest.length>0 && (
          <div className="mt-4">
            <h2 className="text-sm font-bold">Terbaru • {newest.length}</h2>
            <div className="mt-3 flex gap-3 overflow-x-auto no-scrollbar pb-3">
              {newest.map(it=> <Card key={`n-${it.id}`} item={it} />)}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
