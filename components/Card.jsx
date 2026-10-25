import Link from "next/link";
export default function Card({ item }) {
  const cover = item.cover?.startsWith("//") ? "https:" + item.cover : item.cover;
  const isAnime = item.type === "ogv";
  const href = isAnime ? `/player?id=${item.id}&type=ogv` : `/player?id=${item.id}&type=ugc`;
  // badge pendek biar tidak nutup title
  const badgeText = item.badge ? (item.badge.length > 14 ? item.badge.slice(0,13)+"…" : item.badge) : (isAnime ? "Anime" : "UGC");
  return (
    <Link href={href} className="card-hover flex-shrink-0 w-[148px] md:w-[168px] rounded-lg overflow-hidden bg-[#141414] block border border-white/5 hover:border-white/15">
      <div className="aspect-[2/3] relative overflow-hidden bg-[#0f0f0f]">
        <img
          src={cover}
          alt=""
          className="w-full h-full object-cover"
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={(e)=>{ e.currentTarget.src="https://via.placeholder.com/300x400/141414/ffffff?text="+encodeURIComponent(item.title.slice(0,18)); e.currentTarget.style.objectFit="cover"; }}
        />
        <span className={`absolute top-1.5 left-1.5 text-white text-[9px] font-bold px-1.5 py-0.5 rounded leading-none max-w-[86px] truncate ${item.badge === "Gratis" ? "bg-emerald-600" : "bg-black/75 backdrop-blur"}`}>{badgeText}</span>
        {item.duration && <span className="absolute bottom-1 right-1 bg-black/80 text-white text-[10px] px-1 py-0.5 rounded">{item.duration}</span>}
      </div>
      <div className="px-2.5 py-2.5 bg-[#141414]">
        <div className="text-[12px] font-semibold leading-[1.3] line-clamp-2 min-h-[32px] text-white">{item.title}</div>
        <div className="text-[11px] text-zinc-400 mt-1 truncate">{item.views || ""}</div>
        {item.status && <div className="text-[11px] text-emerald-400 truncate mt-0.5">{item.status}</div>}
      </div>
    </Link>
  );
}
