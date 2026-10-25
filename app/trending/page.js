import Sidebar from "../../components/Sidebar";
import Card from "../../components/Card";
import Link from "next/link";
import { trending } from "../../lib/bstation";
export const dynamic = "force-dynamic";
export default async function TrendingPage({ searchParams }){
  let data;
  try{ data = await trending("id"); } catch(e){ data = { ranking: [], tabs: [] }; }
  return (
    <main>
      <Sidebar />
      <div className="md:ml-[68px] max-w-[1400px] mx-auto px-4 md:px-8 py-6 pb-20">
        <h1 className="text-2xl font-black">Trending & Ranking</h1>
        <p className="text-sm text-zinc-500 mt-1">Ranking anime umum + genre — live Bstation</p>
        <div className="mt-4 flex gap-2 overflow-x-auto no-scrollbar pb-2">
          {(data.tabs || []).map(t=>(
            <Link key={t.id+t.name} href={`/genre?name=${encodeURIComponent(t.name)}&id=${t.id||''}`} className="px-4 py-1.5 rounded-full text-xs font-semibold bg-[#141414] border border-white/5 hover:border-white/20 whitespace-nowrap">{t.name}</Link>
          ))}
        </div>
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {(data.ranking || []).map(it=> <Card key={it.id} item={it} />)}
          {(!data.ranking || data.ranking.length===0) && <span className="text-xs text-zinc-500 col-span-full">Gagal memuat ranking — coba refresh</span>}
        </div>
      </div>
    </main>
  )
}
