import Link from "next/link";
export default function Card({ item }) {
  const cover = item.cover?.startsWith("//") ? "https:" + item.cover : item.cover;
  const isAnime = item.type === "ogv";
  const href = isAnime ? `/player?id=${item.id}&type=ogv` : `/player?id=${item.id}&type=ugc`;
  return (
    <Link href={href} className="card-hover flex-shrink-0 w-[145px] md:w-[168px] rounded-[6px] overflow-hidden bg-[#141414] block border border-white/5">
      <div className="aspect-[2/3] relative overflow-hidden bg-zinc-900">
        <img src={cover} alt={item.title} className="w-full h-full object-cover" loading="lazy" />
        <span className={`absolute top-1.5 left-1.5 text-white text-[9px] font-bold px-1.5 py-0.5 rounded ${item.badge === "Gratis" ? "bg-emerald-600" : item.badge ? "bg-[#E50914]" : "bg-black/70"}`}>{item.badge || (isAnime ? "Anime" : "N")}</span>
        {item.duration && <span className="absolute bottom-1 right-1 bg-black/80 text-white text-[10px] px-1 py-0.5 rounded">{item.duration}</span>}
        {item.rank && <span className="absolute top-1.5 right-1.5 bg-white text-black text-[10px] font-black w-6 h-6 rounded-full flex items-center justify-center">#{item.rank}</span>}
      </div>
      <div className="px-2 py-2">
        <div className="text-[11px] font-semibold leading-tight line-clamp-2 min-h-[30px]">{item.title}</div>
        <div className="text-[10px] text-zinc-500 mt-1 truncate">{item.views || ""} {item.genres?.length ? "• " + item.genres.slice(0,2).join(", ") : ""}</div>
        {item.status && <div className="text-[10px] text-emerald-400 truncate">{item.status}</div>}
      </div>
    </Link>
  );
}
