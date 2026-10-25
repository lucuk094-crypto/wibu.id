"use client";
import Sidebar from "../../components/Sidebar";
import { useState, useEffect } from "react";
export default function ProfilePage(){
  const [lang,setLang]=useState("id");
  useEffect(()=>{ setLang(localStorage.getItem("wibu_lang")||"id"); },[]);
  const save=(v)=>{ localStorage.setItem("wibu_lang",v); setLang(v); alert("Bahasa disimpan: "+v+" — refresh untuk pakai lang baru"); };
  return (
    <main>
      <Sidebar />
      <div className="md:ml-[68px] max-w-[1400px] mx-auto px-4 md:px-8 py-6 pb-20">
        <h1 className="text-2xl font-black">Profile & Settings</h1>
        <p className="text-sm text-zinc-500 mt-1">Kelola preferensi Wibu.ID</p>
        <div className="mt-6 grid md:grid-cols-2 gap-4">
          <div className="bg-[#141414] border border-white/5 rounded-xl p-5">
            <h3 className="text-sm font-bold">Bahasa / Language</h3>
            <p className="text-xs text-zinc-500 mt-1">Pilih bahasa untuk scraper Bstation</p>
            <div className="mt-3 grid grid-cols-5 gap-2">
              {["id","en","th","vi","ms"].map(l=>(
                <button key={l} onClick={()=>save(l)} className={`py-2 rounded-full text-xs font-bold border ${lang===l?"bg-white text-black border-white":"bg-[#1a1a1a] text-white border-white/10"}`}>{l.toUpperCase()}</button>
              ))}
            </div>
            <div className="mt-3 text-xs text-zinc-500">Aktif: <span className="text-white font-bold">{lang}</span> • API: <code>/api/bstation?cmd=home&lang={lang}</code></div>
          </div>
          <div className="bg-[#141414] border border-white/5 rounded-xl p-5">
            <h3 className="text-sm font-bold">Akun</h3>
            <p className="text-xs text-zinc-500 mt-1">Hobby • Surabaya, ID</p>
            <div className="mt-3 flex items-center gap-3">
              <img src="https://i.pravatar.cc/100?img=15" alt="avatar" className="w-10 h-10 rounded-full" />
              <div><div className="text-sm font-bold">Wibu.ID User</div><div className="text-xs text-zinc-500">wibu@wibu.id</div></div>
            </div>
            <div className="mt-4 flex gap-2">
              <a href="/list" className="px-4 py-2 rounded-full bg-[#E50914] text-white text-xs font-bold">List Saya</a>
              <a href="/history" className="px-4 py-2 rounded-full bg-white/10 border border-white/10 text-xs font-bold">History</a>
            </div>
          </div>
        </div>
        <div className="mt-6 bg-[#141414] border border-white/5 rounded-xl p-5">
          <h3 className="text-sm font-bold">Tentang Wibu.ID</h3>
          <p className="text-xs text-zinc-400 mt-2 leading-relaxed">Wibu.ID adalah katalog anime Netflix Dark + Live Bstation via scraper xemoz. Semua video diputar via Embed Resmi Bilibili.tv — aman DMCA. Dibuat dengan Next.js 14, Tailwind, Lucide. Credits: xemoz, Vercel, Lucide. MIT © 2026 Surabaya.</p>
          <div className="mt-3 flex gap-2 text-xs">
            <a href="https://github.com/lucuk094-crypto/wibu.id" target="_blank" className="px-3 py-1.5 rounded-full bg-white text-black font-bold">GitHub</a>
            <a href="https://wibu-five.vercel.app" target="_blank" className="px-3 py-1.5 rounded-full bg-white/10 border border-white/10">Live Demo</a>
          </div>
        </div>
      </div>
    </main>
  )
}
