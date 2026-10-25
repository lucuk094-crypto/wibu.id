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
    <main className="page-enter">
      <Sidebar />
      <div className="md:ml-[72px] max-w-[1400px] mx-auto px-4 md:px-8 py-6 pb-20">
        <div className="glass-strong rounded-2xl p-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black flex items-center gap-2"><Clock size={22}/> Riwayat Tonton</h1>
            <p className="text-sm text-zinc-400 mt-1">{h.length} video • tersimpan lokal • Glass</p>
          </div>
          <button onClick={clear} className="px-4 py-2 rounded-full glass hover:bg-white hover:text-black text-xs font-bold flex items-center gap-2 transition"><Trash2 size={14}/> Hapus</button>
        </div>
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {h.map(it=>(
            <Link key={it.id+it.time} href={`/player?id=${it.id}`} className="glass-card rounded-xl overflow-hidden block">
              <img src={it.cover} alt={it.title} className="w-full aspect-[2/3] object-cover" referrerPolicy="no-referrer" />
              <div className="p-3"><div className="text-xs font-semibold line-clamp-2 leading-tight">{it.title}</div><div className="text-[11px] text-zinc-500 mt-1">{new Date(it.time).toLocaleString("id-ID")}</div></div>
            </Link>
          ))}
          {h.length===0 && <div className="col-span-full glass p-8 rounded-2xl text-center text-xs text-zinc-500">Belum ada riwayat — tonton video dulu</div>}
        </div>
      </div>
    </main>
  )
}
