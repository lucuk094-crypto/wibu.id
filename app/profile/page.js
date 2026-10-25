"use client";
import Sidebar from "../../components/Sidebar";
import { useState, useEffect } from "react";
export default function ProfilePage(){
  const [lang,setLang]=useState("id");
  useEffect(()=>{ setLang(localStorage.getItem("wibu_lang")||"id"); },[]);
  const save=(v)=>{ localStorage.setItem("wibu_lang",v); setLang(v); alert("Bahasa disimpan: "+v); };
  return (
    <main className="page-enter">
      <Sidebar />
      <div className="md:ml-[72px] max-w-[1400px] mx-auto px-4 md:px-8 py-6 pb-20">
        <div className="glass-strong rounded-2xl p-6">
          <h1 className="text-2xl font-black">Profile & Settings</h1>
          <p className="text-sm text-zinc-400 mt-1">Kelola preferensi Wibu.ID • Glass Morphism</p>
        </div>
        <div className="mt-6 grid md:grid-cols-2 gap-4">
          <div className="glass rounded-2xl p-6">
            <h3 className="text-sm font-black">Bahasa / Language</h3>
            <p className="text-xs text-zinc-500 mt-1">Pilih bahasa Bstation</p>
            <div className="mt-4 grid grid-cols-5 gap-2">
              {["id","en","th","vi","ms"].map(l=>(
                <button key={l} onClick={()=>save(l)} className={`py-2.5 rounded-full text-xs font-black border transition ${lang===l?"bg-white text-black border-white shadow":"glass text-white border-white/10 hover:bg-white hover:text-black"}`}>{l.toUpperCase()}</button>
              ))}
            </div>
            <div className="mt-3 text-xs text-zinc-500">Aktif: <span className="text-white font-bold">{lang}</span></div>
          </div>
          <div className="glass rounded-2xl p-6">
            <h3 className="text-sm font-black">Akun</h3>
            <div className="mt-3 flex items-center gap-3">
              <img src="https://i.pravatar.cc/100?img=15" alt="avatar" className="w-10 h-10 rounded-full border border-white/10" />
              <div><div className="text-sm font-bold">Wibu.ID User</div><div className="text-xs text-zinc-500">Surabaya • Glass Edition</div></div>
            </div>
            <div className="mt-4 flex gap-2">
              <a href="/list" className="px-5 py-2 rounded-full bg-[#E50914] text-white text-xs font-bold">List Saya</a>
              <a href="/history" className="px-5 py-2 rounded-full glass text-xs font-bold">History</a>
            </div>
          </div>
        </div>
        <div className="mt-6 glass rounded-2xl p-6">
          <h3 className="text-sm font-black">Tentang Wibu.ID</h3>
          <p className="text-xs text-zinc-400 mt-2 leading-relaxed">Netflix Dark + Glass Morphism • Embed resmi Bstation • Next.js 14 • Lucide • Surabaya © 2026. Semua video auto play lancar HP & laptop.</p>
        </div>
      </div>
    </main>
  )
}
