"use client";
import Link from "next/link";
export default function Card({ item }) {
  const cover = item.cover?.startsWith("//") ? "https:" + item.cover : item.cover;
  const isAnime = item.type === "ogv";
  const href = isAnime ? `/player?id=${item.id}&type=ogv` : `/player?id=${item.id}&type=ugc`;
  const badgeText = item.badge ? (item.badge.length > 14 ? item.badge.slice(0,13)+"…" : item.badge) : (isAnime ? "Anime" : "UGC");
  const fallback = "https://via.placeholder.com/300x400/1a1a1e/9a9aa0?text="+encodeURIComponent(item.title.slice(0,18));
  return (
    <Link href={href} className="card-hover flex-shrink-0 w-[150px] md:w-[172px] rounded-xl overflow-hidden glass-card block group">
      <div className="aspect-[2/3] relative overflow-hidden bg-[#0f0f12]">
        <img
          src={cover || fallback}
          alt=""
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={(e)=>{ if(e.currentTarget.src !== fallback) e.currentTarget.src = fallback; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <span className={`absolute top-2 left-2 text-white text-[10px] font-bold px-2 py-1 rounded-full backdrop-blur-md border border-white/10 ${item.badge === "Gratis" ? "bg-emerald-500/90" : "bg-black/60"}`}>{badgeText}</span>
        {item.duration && <span className="absolute bottom-2 right-2 bg-black/75 backdrop-blur text-white text-[10px] px-1.5 py-0.5 rounded-full border border-white/10">{item.duration}</span>}
      </div>
      <div className="p-3">
        <div className="text-[13px] font-semibold leading-[1.35] line-clamp-2 min-h-[36px] text-white group-hover:text-white transition-colors">{item.title}</div>
        <div className="text-[11px] text-zinc-400 mt-1.5 truncate flex items-center gap-1.5">
          <span className="w-1 h-1 rounded-full bg-zinc-600" /> {item.views || "—"}
        </div>
        {item.status && <div className="text-[11px] text-emerald-400 truncate mt-1 font-medium">{item.status}</div>}
      </div>
    </Link>
  );
}
