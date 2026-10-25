import Sidebar from "../../components/Sidebar";
import Card from "../../components/Card";
import { search } from "../../lib/bstation";
export const dynamic = "force-dynamic";
export default async function GenrePage({ searchParams }){
  const name = searchParams?.name || "Fantasi";
  const q = searchParams?.q || name;
  let result=null;
  try{ result = await search(q, "id"); } catch(e){}
  const items = result ? [...(result.anime||[]), ...(result.videos||[])] : [];
  return (
    <main>
      <Sidebar />
      <div className="md:ml-[68px] max-w-[1400px] mx-auto px-4 md:px-8 py-6 pb-20">
        <h1 className="text-2xl font-black">Genre: {name}</h1>
        <p className="text-sm text-zinc-500 mt-1">Menampilkan hasil untuk genre "{q}" • {items.length} items</p>
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {items.map(it=> <Card key={it.id} item={it} />)}
          {items.length===0 && <span className="text-xs text-zinc-500">Tidak ada hasil — coba keyword lain</span>}
        </div>
      </div>
    </main>
  )
}
