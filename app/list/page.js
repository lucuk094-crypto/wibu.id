"use client";
import Sidebar from "../../components/Sidebar";
import Link from "next/link";
import { useEffect, useState } from "react";
export default function ListPage(){
  const [list, setList] = useState([]);
  useEffect(()=>{ setList(JSON.parse(localStorage.getItem("wibu_list")||"[]")); },[]);
  const clear = ()=> { localStorage.removeItem("wibu_list"); setList([]); };
  return (
    <main className="page-enter">
      <Sidebar />
      <div className="md:ml-[72px] max-w-[1400px] mx-auto px-4 md:px-8 py-6 pb-20">
        <div className="glass-strong rounded-2xl p-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black">List Saya</h1>
            <p className="text-sm text-zinc-400 mt-1">{list.length} items • simpan lokal • Glass</p>
          </div>
          <button onClick={clear} className="px-4 py-2 rounded-full glass hover:bg-white hover:text-black text-xs font-bold transition">Hapus Semua</button>
        </div>
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {list.map(it=>(
            <Link key={it.id} href={`/player?id=${it.id}`} className="glass-card rounded-xl overflow-hidden block">
              <img src={it.cover?.startsWith("//")?"https:"+it.cover:it.cover} alt={it.title} className="w-full aspect-[2/3] object-cover" referrerPolicy="no-referrer" />
              <div className="p-3 text-xs font-semibold line-clamp-2 leading-tight">{it.title}</div>
            </Link>
          ))}
          {list.length===0 && <div className="col-span-full glass p-8 rounded-2xl text-center text-xs text-zinc-500">Belum ada list — klik ♡ di player untuk simpan</div>}
        </div>
      </div>
    </main>
  )
}
