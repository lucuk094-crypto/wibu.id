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
    <main className="page-enter">
      <Sidebar />
      <div className="md:ml-[72px] max-w-[1400px] mx-auto px-4 md:px-8 py-6 pb-20">
        <div className="glass-strong rounded-2xl p-6">
          <h1 className="text-2xl font-black">Trending & Ranking</h1>
          <p className="text-sm text-zinc-400 mt-1">Gateway Bstation • Hot & Terbaru • Glass tanpa neon</p>
          <div className="mt-4 flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {(data.tabs || [{name:"Hot",id:0},{name:"Terbaru",id:2}]).map(t=>(
              <Link key={t.id+t.name} href={`/genre?name=${encodeURIComponent(t.name)}&id=${t.id||''}`} className="px-4 py-2 rounded-full text-xs font-bold glass hover:bg-white hover:text-black whitespace-nowrap transition">{t.name}</Link>
            ))}
          </div>
        </div>
        <div className="mt-6 glass rounded-2xl p-5">
          <h2 className="text-sm font-black">🔥 Hot Trending • {ranking.length} judul</h2>
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {ranking.map(it=> <Card key={it.id} item={it} />)}
          </div>
        </div>
        <div className="mt-6 grid md:grid-cols-2 gap-4">
          <div className="glass rounded-2xl p-5">
            <h3 className="text-sm font-bold">Hot Gateway • {hot.length}</h3>
            <div className="mt-3 flex gap-3 overflow-x-auto no-scrollbar pb-2">
              {hot.map(it=> <Card key={`h-${it.id}`} item={it} />)}
            </div>
          </div>
          <div className="glass rounded-2xl p-5">
            <h3 className="text-sm font-bold">Terbaru • {newest.length}</h3>
            <div className="mt-3 flex gap-3 overflow-x-auto no-scrollbar pb-2">
              {newest.map(it=> <Card key={`n-${it.id}`} item={it} />)}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
