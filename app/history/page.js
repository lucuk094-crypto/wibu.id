"use client";
import Sidebar from "../../components/Sidebar";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Clock, Trash2 } from "lucide-react";
export default function HistoryPage(){
  const [h, setH] = useState([]);
  useEffect(()=>{ setH(JSON.parse(localStorage.getItem("wibu_history")||"[]")); },[]);
  const clear=()=>{ localStorage.removeItem("wibu_history"); setH([]); };
  return (
    <main>
      <Sidebar />
      <div className="md:ml-[68px] max-w-[1400px] mx-auto px-4 md:px-8 py-6 pb-20">
        <h1 className="text-2xl font-black flex items-center gap-2"><Clock size={22}/> Riwayat Tonton</h1>
        <p className="text-sm text-zinc-500 mt-1">{h.length} video pernah diputar — disimpan di browser</p>
        <button onClick={clear} className="mt-4 px-4 py-2 rounded-full bg-white/10 border border-white/10 text-xs font-bold flex items-center gap-2"><Trash2 size={14}/> Hapus Riwayat</button>
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {h.map(it=>(
            <Link key={it.id+it.time} href={`/player?id=${it.id}`} className="bg-[#141414] rounded-lg overflow-hidden border border-white/5">
              <img src={it.cover} alt={it.title} className="w-full aspect-[2/3] object-cover" />
              <div className="p-2"><div className="text-xs font-semibold line-clamp-2">{it.title}</div><div className="text-[11px] text-zinc-500">{new Date(it.time).toLocaleString("id-ID")}</div></div>
            </Link>
          ))}
          {h.length===0 && <div className="col-span-full text-xs text-zinc-500">Belum ada riwayat — tonton video dulu</div>}
        </div>
      </div>
    </main>
  )
}
