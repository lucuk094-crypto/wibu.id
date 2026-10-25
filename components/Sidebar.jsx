"use client";
import { Search, House, Clapperboard, Monitor, TrendingUp, Plus, Shuffle, Calendar, Crown, Film, Bookmark } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
export default function Sidebar() {
  const pathname = usePathname();
  const isActive = (p) => pathname === p ? "text-white relative after:absolute after:left-0 after:top-1/2 after:-translate-y-1/2 after:w-[3px] after:h-[22px] after:bg-[#E50914] after:rounded-r" : "text-zinc-500 hover:text-white";
  return (
    <>
      <aside className="hidden md:flex fixed left-0 top-0 bottom-0 w-[68px] bg-black border-r border-white/[0.06] flex-col items-center py-5 z-50">
        <Link href="/" className="w-8 h-8 rounded bg-[#E50914] flex items-center justify-center font-black text-sm">W</Link>
        <nav className="mt-6 flex flex-col items-center gap-5 w-full">
          <Link href="/search" className={`w-full flex justify-center py-1 ${isActive("/search")}`} title="Cari"><Search size={20} /></Link>
          <Link href="/" className={`w-full flex justify-center py-1 ${isActive("/")}`} title="Home"><House size={20} /></Link>
          <Link href="/trending" className={`w-full flex justify-center py-1 ${isActive("/trending")}`} title="Trending"><TrendingUp size={20} /></Link>
          <Link href="/jadwal" className={`w-full flex justify-center py-1 ${isActive("/jadwal")}`} title="Jadwal"><Calendar size={20} /></Link>
          <Link href="/genre" className={`w-full flex justify-center py-1 ${isActive("/genre")}`} title="Genre"><Film size={20} /></Link>
          <Link href="/list" className={`w-full flex justify-center py-1 ${isActive("/list")}`} title="List Saya"><Bookmark size={20} /></Link>
          <Link href="/search?q=anime" className="w-full flex justify-center py-1 text-zinc-500 hover:text-white" title="Shuffle"><Shuffle size={20} /></Link>
        </nav>
        <div className="mt-auto flex flex-col items-center gap-3">
          <div className="w-7 h-7 rounded-full bg-zinc-800 flex items-center justify-center text-xs">👤</div>
        </div>
      </aside>
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-black border-t border-white/10 h-[62px] flex items-center justify-around px-2">
        <Link href="/" className={`flex flex-col items-center gap-1 ${pathname==="/"?"text-white":"text-zinc-500"}`}><House size={18} /><span className="text-[10px]">Home</span></Link>
        <Link href="/search" className={`flex flex-col items-center gap-1 ${pathname==="/search"?"text-white":"text-zinc-500"}`}><Search size={18} /><span className="text-[10px]">Cari</span></Link>
        <Link href="/trending" className="flex flex-col items-center gap-1 text-zinc-500"><TrendingUp size={18} /><span className="text-[10px]">Top</span></Link>
        <Link href="/jadwal" className="flex flex-col items-center gap-1 text-zinc-500"><Calendar size={18} /><span className="text-[10px]">Jadwal</span></Link>
        <Link href="/list" className="flex flex-col items-center gap-1 text-zinc-500"><Bookmark size={18} /><span className="text-[10px]">Saya</span></Link>
      </nav>
    </>
  );
}
