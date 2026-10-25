import Link from "next/link";
import { Play, Info } from "lucide-react";
export default function Hero({ item }) {
  if (!item) return null;
  const cover = item.cover?.startsWith("//") ? "https:" + item.cover : item.cover;
  const title = item.title || "Wibu.ID";
  const words = title.split(" ");
  const first = words.slice(0, Math.ceil(words.length/2)).join(" ");
  const second = words.slice(Math.ceil(words.length/2)).join(" ");
  return (
    <section className="relative h-[420px] md:h-[520px] overflow-hidden bg-black">
      <img src={cover} alt={title} className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0" style={{ background: "linear-gradient(90deg, #000 0%, rgba(0,0,0,0.92) 28%, rgba(0,0,0,0.55) 48%, rgba(0,0,0,0.15) 70%, transparent 100%), linear-gradient(0deg, #080808 0%, rgba(0,0,0,0) 38%)" }}></div>
      <div className="relative h-full max-w-[1400px] mx-auto px-4 md:px-10 flex flex-col justify-center">
        <div className="max-w-[560px]">
          <div className="flex items-center gap-2"><span className="text-[#E50914] font-black text-[13px] tracking-[0.18em]">N</span><span className="text-zinc-300 text-[11px] font-semibold tracking-[0.22em]">SERIES • LIVE Bstation</span></div>
          <h1 className="hero-title mt-2 text-[28px] md:text-[48px] text-white leading-none">{first} <span className="red-box">{second}</span></h1>
          <div className="mt-1 text-white/90 text-[11px] font-bold tracking-[0.2em]">{item.badge || "Gratis"} • {item.views || ""}</div>
          <div className="mt-3 flex items-center gap-2">
            <span className="bg-[#f5c518] text-black text-[11px] font-black px-1.5 py-0.5 rounded">IMDb 8.8/10</span>
            <span className="text-[#E50914] text-xs font-bold">2B+ <span className="text-white">Streams</span></span>
          </div>
          <div className="mt-5 flex items-center gap-3">
            <Link href={`/player?id=${item.id}&type=${item.type||'ugc'}`} className="inline-flex items-center gap-2 bg-[#E50914] hover:bg-[#b80710] text-white px-6 py-[9px] rounded-full text-[13px] font-bold"><Play size={16} fill="white" /> Play</Link>
            <Link href={item.type==='ogv' ? `/play?id=${item.id}` : `/player?id=${item.id}`} className="inline-flex items-center gap-2 bg-white/90 hover:bg-white text-black px-5 py-[9px] rounded-full text-[13px] font-semibold"><Info size={16} /> Detail</Link>
          </div>
          <p className="hidden md:block mt-4 text-[13px] text-zinc-300 line-clamp-2">{item.status || "Nonton sekarang via embed resmi Bilibili.tv — aman & HD"}</p>
        </div>
      </div>
    </section>
  );
}
