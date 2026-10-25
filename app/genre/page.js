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
  // Jika id numeric 0/2 => gateway order
  if (id==="0" || id==="2" || name==="Hot" || name==="Terbaru") {
    const order = id==="2" || name==="Terbaru" ? 2 : 0;
    try { items = await browseByOrder({ order, pn:1, ps:24 }); } catch {}
  }
  if (items.length===0) {
    // fallback search by genre name
    via="search";
    try {
      const r = await search(q, "id");
      items = [...(r.anime||[]), ...(r.videos||[])];
    } catch {}
  }

  return (
    <main>
      <Sidebar />
      <div className="md:ml-[68px] max-w-[1400px] mx-auto px-4 md:px-8 py-6 pb-20">
        <h1 className="text-2xl font-black">Genre: {name}</h1>
        <p className="text-sm text-zinc-500 mt-1">Via {via} • Menampilkan {items.length} judul • Hot/Terbaru lengkap dari gateway</p>
        <div className="mt-4 flex gap-2 overflow-x-auto no-scrollbar pb-2">
          <a href="/genre?name=Hot&id=0" className={`px-4 py-1.5 rounded-full text-xs font-bold border whitespace-nowrap ${name==="Hot"?"bg-white text-black":"bg-[#141414] text-zinc-300 border-white/5"}`}>Hot</a>
          <a href="/genre?name=Terbaru&id=2" className={`px-4 py-1.5 rounded-full text-xs font-bold border whitespace-nowrap ${name==="Terbaru"?"bg-white text-black":"bg-[#141414] text-zinc-300 border-white/5"}`}>Terbaru</a>
          {["Aksi","Romance","Fantasi","Komedi","Isekai","Drama"].map(g=>(
            <a key={g} href={`/genre?name=${g}`} className="px-4 py-1.5 rounded-full text-xs font-semibold bg-[#141414] border border-white/5 whitespace-nowrap">{g}</a>
          ))}
        </div>
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {items.map(it=> <Card key={it.id+it.title.slice(0,5)} item={it} />)}
          {items.length===0 && <span className="text-xs text-zinc-500 col-span-full">Tidak ada hasil — coba Hot/Terbaru atau cari di Search</span>}
        </div>
      </div>
    </main>
  )
}
