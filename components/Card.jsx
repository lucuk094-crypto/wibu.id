import Link from "next/link";
export default function Card({ item }) {
  const cover = item.cover?.startsWith("//") ? "https:" + item.cover : item.cover;
  return (
    <Link href={`/player?id=${item.id}&type=${item.type||'ugc'}`} className="card-hover flex-shrink-0 w-[145px] md:w-[168px] rounded-[6px] overflow-hidden bg-[#141414] block border border-white/5">
      <div className="aspect-[2/3] relative overflow-hidden bg-zinc-900">
        <img src={cover} alt={item.title} className="w-full h-full object-cover" loading="lazy" />
        <span className="absolute top-1.5 left-1.5 bg-black/70 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">{item.badge || "N"}</span>
        {item.duration && <span className="absolute bottom-1 right-1 bg-black/80 text-white text-[10px] px-1 py-0.5 rounded">{item.duration}</span>}
      </div>
      <div className="px-2 py-2">
        <div className="text-[11px] font-semibold leading-tight line-clamp-2 min-h-[30px]">{item.title}</div>
        <div className="text-[10px] text-zinc-500 mt-1 truncate">{item.views || ""}</div>
      </div>
    </Link>
  );
}
