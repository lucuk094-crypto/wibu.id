import Link from "next/link";
import { Play, Info, Star } from "lucide-react";
export default function Hero({ item }) {
  if (!item) return null;
  const cover = item.cover?.startsWith("//") ? "https:" + item.cover : item.cover;
  const title = item.title || "Wibu.ID";
  const words = title.split(" ");
  const first = words.slice(0, Math.ceil(words.length/2)).join(" ");
  const second = words.slice(Math.ceil(words.length/2)).join(" ");
  return (
    <section className="relative h-[480px] md:h-[560px] overflow-hidden bg-black">
      <img src={cover} alt={title} className="absolute inset-0 w-full h-full object-cover scale-105" />
      <div className="absolute inset-0" style={{ background: "linear-gradient(90deg, #000 0%, rgba(0,0,0,0.88) 32%, rgba(0,0,0,0.45) 55%, rgba(0,0,0,0.12) 75%, transparent 100%), linear-gradient(0deg, #070709 0%, rgba(0,0,0,0) 45%)" }}></div>
      <div className="relative h-full max-w-[1400px] mx-auto px-4 md:px-10 flex flex-col justify-center">
        <div className="max-w-[580px] animate-slideIn">
          <div className="flex items-center gap-2">
            <span className="text-[#E50914] font-black text-[13px] tracking-[0.18em]">N</span>
            <span className="text-zinc-300 text-[11px] font-semibold tracking-[0.22em]">SERIES • LIVE Bstation</span>
            <span className="ml-2 px-2 py-0.5 rounded-full glass text-[10px] font-bold text-white/90">HD • Embed</span>
          </div>
          <h1 className="hero-title mt-3 text-[30px] md:text-[48px] text-white leading-none drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">{first} <span className="red-box">{second}</span></h1>
          <div className="mt-2 flex items-center gap-2 flex-wrap">
            <span className="bg-[#f5c518] text-black text-[11px] font-black px-1.5 py-0.5 rounded flex items-center gap-1"><Star size={10} fill="black"/> 8.8/10</span>
            <span className="glass px-2.5 py-1 rounded-full text-xs font-bold text-white">▶ {item.views || "Trending"}</span>
            {item.status && <span className="text-emerald-400 text-xs font-bold">{item.status}</span>}
          </div>
          <div className="mt-5 flex items-center gap-3">
            <Link href={`/player?id=${item.id}&type=${item.type||'ogv'}`} className="inline-flex items-center gap-2 bg-[#E50914] hover:bg-[#b80710] text-white px-6 py-2.5 rounded-full text-[13px] font-bold shadow-lg shadow-[#E50914]/25 hover:scale-105 transition-all duration-300">
              <Play size={16} fill="white" /> Play
            </Link>
            <Link href={item.type==='ogv' ? `/player?id=${item.id}&type=ogv` : `/player?id=${item.id}`} className="inline-flex items-center gap-2 glass-strong hover:bg-white text-white hover:text-black px-5 py-2.5 rounded-full text-[13px] font-semibold transition-all duration-300">
              <Info size={16} /> Detail
            </Link>
          </div>
          <p className="hidden md:block mt-4 text-[13px] text-zinc-300 line-clamp-2 max-w-[520px] leading-relaxed">{item.status || item.views || "Nonton sekarang via embed resmi Bilibili.tv — HD, lancar di HP & laptop, tanpa iklan."}</p>
        </div>
      </div>
    </section>
  );
}
