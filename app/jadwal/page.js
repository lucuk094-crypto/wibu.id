import Sidebar from "../../components/Sidebar";
import Card from "../../components/Card";
import { timeline } from "../../lib/bstation";
export const dynamic = "force-dynamic";
export default async function JadwalPage(){
  let data;
  try{ data = await timeline("id"); } catch(e){ data = { days: [] }; }
  return (
    <main className="page-enter">
      <Sidebar />
      <div className="md:ml-[72px] max-w-[1400px] mx-auto px-4 md:px-8 py-6 pb-20">
        <div className="glass-strong rounded-2xl p-6">
          <h1 className="text-2xl font-black">Jadwal Tayang</h1>
          <p className="text-sm text-zinc-400 mt-1">Rilis anime per hari — live Bstation • Glass smooth</p>
        </div>
        <div className="mt-6 space-y-4">
          {(data.days || []).map((d, idx)=>(
            <div key={idx} className={`p-5 rounded-2xl border ${d.today ? 'glass bg-[#E50914]/10 border-[#E50914]/30' : 'glass'}`}>
              <div className="flex items-center gap-3">
                <h2 className="text-sm font-black">{d.day} • {d.date}</h2>
                {d.today && <span className="bg-[#E50914] text-white text-[11px] font-black px-2 py-1 rounded-full">HARI INI</span>}
                <span className="ml-auto glass px-2.5 py-1 rounded-full text-xs font-bold">{d.items?.length || 0} anime</span>
              </div>
              <div className="mt-4 flex gap-4 overflow-x-auto no-scrollbar pb-2">
                {(d.items || []).map(it=> <Card key={it.id} item={it} />)}
                {(!d.items || d.items.length===0) && <span className="text-xs text-zinc-500 glass px-4 py-2 rounded-full">Tidak ada jadwal hari ini</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
