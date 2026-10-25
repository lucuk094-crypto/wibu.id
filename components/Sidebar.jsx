"use client";
import { Search, House, Clapperboard, Monitor, TrendingUp, Plus, Shuffle } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
export default function Sidebar() {
  const pathname = usePathname();
  return (
    <>
      <aside className="hidden md:flex fixed left-0 top-0 bottom-0 w-[68px] bg-black border-r border-white/[0.06] flex-col items-center py-5 z-50">
        <Link href="/" className="w-8 h-8 rounded bg-[#E50914] flex items-center justify-center font-black text-sm">W</Link>
        <nav className="mt-8 flex flex-col items-center gap-6 w-full">
          <Link href="/search" className={`w-full flex justify-center py-1 ${pathname==='/search'?'text-white':'text-zinc-500 hover:text-white'}`}><Search size={20} /></Link>
          <Link href="/" className={`w-full flex justify-center py-1 ${pathname==='/'?'text-white relative after:absolute after:left-0 after:top-1/2 after:-translate-y-1/2 after:w-[3px] after:h-[22px] after:bg-[#E50914] after:rounded-r': 'text-zinc-500 hover:text-white'}`}><House size={20} /></Link>
          <Link href="/#new" className="w-full flex justify-center py-1 text-zinc-500 hover:text-white"><Clapperboard size={20} /></Link>
          <Link href="/#trending" className="w-full flex justify-center py-1 text-zinc-500 hover:text-white"><Monitor size={20} /></Link>
          <Link href="/search?q=anime" className="w-full flex justify-center py-1 text-zinc-500 hover:text-white"><TrendingUp size={20} /></Link>
          <Link href="/search" className="w-full flex justify-center py-1 text-zinc-500 hover:text-white"><Plus size={20} /></Link>
          <Link href="/" className="w-full flex justify-center py-1 text-zinc-500 hover:text-white"><Shuffle size={20} /></Link>
        </nav>
        <div className="mt-auto"><img src="https://i.pravatar.cc/100?img=15" alt="profile" className="w-7 h-7 rounded-full" /></div>
      </aside>
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-black border-t border-white/10 h-[62px] flex items-center justify-around px-2">
        <Link href="/" className="flex flex-col items-center gap-1 text-white"><House size={18} /><span className="text-[10px]">Home</span></Link>
        <Link href="/search" className="flex flex-col items-center gap-1 text-zinc-500"><Search size={18} /><span className="text-[10px]">Search</span></Link>
        <Link href="/" className="flex flex-col items-center gap-1 text-zinc-500"><span className="w-9 h-9 rounded-full bg-white text-black flex items-center justify-center">▶</span></Link>
        <Link href="/#trending" className="flex flex-col items-center gap-1 text-zinc-500"><Clapperboard size={18} /><span className="text-[10px]">List</span></Link>
        <Link href="/search" className="flex flex-col items-center gap-1 text-zinc-500"><Plus size={18} /><span className="text-[10px]">Saya</span></Link>
      </nav>
    </>
  );
}
