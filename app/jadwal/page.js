import Sidebar from "../../components/Sidebar";
import Card from "../../components/Card";
import { timeline } from "../../lib/bstation";
export const dynamic = "force-dynamic";
export default async function JadwalPage(){
  let data;
  try{ data = await timeline("id"); } catch(e){ data = { days: [] }; }
  return (
    <main>
      <Sidebar />
      <div className="md:ml-[68px] max-w-[1400px] mx-auto px-4 md:px-8 py-6 pb-20">
        <h1 className="text-2xl font-black">Jadwal Tayang</h1>
        <p className="text-sm text-zinc-500 mt-1">Jadwal rilis anime per hari — live dari Bstation</p>
        <div className="mt-6 space-y-8">
          {(data.days || []).map((d, idx)=>(
            <div key={idx} className={`p-4 rounded-xl border ${d.today ? 'bg-[#E50914]/10 border-[#E50914]/30' : 'bg-[#141414] border-white/5'}`}>
              <div className="flex items-center gap-3">
                <h2 className="text-sm font-black">{d.day} • {d.date}</h2>
                {d.today && <span className="bg-[#E50914] text-white text-[11px] font-bold px-2 py-0.5 rounded-full">HARI INI</span>}
                <span className="ml-auto text-xs text-zinc-500">{d.items?.length || 0} anime</span>
              </div>
              <div className="mt-3 flex gap-3 overflow-x-auto no-scrollbar pb-2">
                {(d.items || []).map(it=> <Card key={it.id} item={it} />)}
                {(!d.items || d.items.length===0) && <span className="text-xs text-zinc-500">Tidak ada jadwal hari ini</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
