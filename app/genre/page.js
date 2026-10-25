import Sidebar from "../../components/Sidebar";
import Card from "../../components/Card";
import { browseByOrder, search } from "../../lib/bstation";
export const dynamic = "force-dynamic";
export default async function GenrePage({ searchParams }){
  const name = searchParams?.name || "Hot";
  const id = searchParams?.id || "0";
  const q = searchParams?.q || name;
  let items = [];
  let via = "gateway";
  if (id==="0" || id==="2" || name==="Hot" || name==="Terbaru") {
    const order = id==="2" || name==="Terbaru" ? 2 : 0;
    try { items = await browseByOrder({ order, pn:1, ps:24 }); } catch {}
  }
  if (items.length===0) {
    via="search";
    try { const r = await search(q, "id"); items = [...(r.anime||[]), ...(r.videos||[])]; } catch {}
  }
  return (
    <main className="page-enter">
      <Sidebar />
      <div className="md:ml-[72px] max-w-[1400px] mx-auto px-4 md:px-8 py-6 pb-20">
        <div className="glass-strong rounded-2xl p-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black">Genre: {name}</h1>
            <p className="text-sm text-zinc-400 mt-1">Via {via} • {items.length} judul • Glass elegan</p>
          </div>
          <span className="glass px-3 py-1.5 rounded-full text-xs font-bold">{items.length} items</span>
        </div>
        <div className="mt-4 flex gap-2 overflow-x-auto no-scrollbar pb-2">
          <a href="/genre?name=Hot&id=0" className={`px-5 py-2 rounded-full text-xs font-black border whitespace-nowrap transition ${name==="Hot"?"bg-white text-black border-white":"glass text-zinc-300"}`}>Hot</a>
          <a href="/genre?name=Terbaru&id=2" className={`px-5 py-2 rounded-full text-xs font-black border whitespace-nowrap transition ${name==="Terbaru"?"bg-white text-black border-white":"glass text-zinc-300"}`}>Terbaru</a>
          {["Aksi","Romance","Fantasi","Komedi","Isekai","Drama"].map(g=>(
            <a key={g} href={`/genre?name=${g}`} className="px-4 py-2 rounded-full text-xs font-bold glass whitespace-nowrap hover:bg-white hover:text-black transition">{g}</a>
          ))}
        </div>
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {items.map(it=> <Card key={it.id+it.title.slice(0,5)} item={it} />)}
          {items.length===0 && <span className="text-xs text-zinc-500 col-span-full glass p-8 rounded-xl text-center">Tidak ada hasil — coba Hot/Terbaru</span>}
        </div>
      </div>
    </main>
  )
}
