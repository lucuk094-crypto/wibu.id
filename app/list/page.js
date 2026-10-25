"use client";
import Sidebar from "../../components/Sidebar";
import Link from "next/link";
import { useEffect, useState } from "react";
export default function ListPage(){
  const [list, setList] = useState([]);
  useEffect(()=>{
    const saved = JSON.parse(localStorage.getItem("wibu_list")||"[]");
    setList(saved);
  },[]);
  const clear = ()=> { localStorage.removeItem("wibu_list"); setList([]); };
  return (
    <main>
      <Sidebar />
      <div className="md:ml-[68px] max-w-[1400px] mx-auto px-4 md:px-8 py-6 pb-20">
        <h1 className="text-2xl font-black">List Saya</h1>
        <p className="text-sm text-zinc-500 mt-1">Disimpan di browser (localStorage) — {list.length} items</p>
        <button onClick={clear} className="mt-4 px-4 py-2 rounded-full bg-white/10 border border-white/10 text-xs font-bold">Hapus Semua</button>
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {list.map(it=>(
            <Link key={it.id} href={`/player?id=${it.id}`} className="bg-[#141414] rounded-lg overflow-hidden border border-white/5">
              <img src={it.cover?.startsWith("//")?"https:"+it.cover:it.cover} alt={it.title} className="w-full aspect-[2/3] object-cover" />
              <div className="p-2 text-xs font-semibold line-clamp-2">{it.title}</div>
            </Link>
          ))}
          {list.length===0 && <div className="col-span-full text-xs text-zinc-500">Belum ada list — klik ♡ di player untuk simpan</div>}
        </div>
      </div>
    </main>
  )
}
