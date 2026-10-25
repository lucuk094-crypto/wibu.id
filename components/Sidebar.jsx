"use client";
import { Search, House, TrendingUp, Calendar, Film, Bookmark, Clock, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
export default function Sidebar() {
  const pathname = usePathname();
  const isActive = (p) => pathname === p;
  return (
    <>
      <aside className="hidden md:flex fixed left-0 top-0 bottom-0 w-[72px] z-50 flex-col items-center py-6 glass-strong border-r border-white/[0.06]">
        <Link href="/" className="w-9 h-9 rounded-xl bg-[#E50914] flex items-center justify-center font-black text-sm shadow-lg shadow-[#E50914]/20 hover:scale-105 transition">W</Link>
        <nav className="mt-8 flex flex-col items-center gap-2 w-full px-2">
          {[
            {href:"/search", icon:Search, label:"Cari"},
            {href:"/", icon:House, label:"Home"},
            {href:"/trending", icon:TrendingUp, label:"Trending"},
            {href:"/jadwal", icon:Calendar, label:"Jadwal"},
            {href:"/genre", icon:Film, label:"Genre"},
            {href:"/list", icon:Bookmark, label:"List"},
            {href:"/history", icon:Clock, label:"Riwayat"},
            {href:"/profile", icon:User, label:"Saya"},
          ].map(it=>(
            <Link key={it.href} href={it.href} title={it.label} className={`w-full flex justify-center py-2.5 rounded-xl transition-all duration-300 ${isActive(it.href) ? "bg-white text-black shadow-lg" : "text-zinc-500 hover:text-white hover:bg-white/[0.06]"}`}>
              <it.icon size={19} />
            </Link>
          ))}
        </nav>
        <div className="mt-auto">
          <Link href="/profile" className="block hover:scale-105 transition">
            <img src="https://i.pravatar.cc/100?img=15" alt="profile" className="w-8 h-8 rounded-full border-2 border-white/10 shadow-lg" />
          </Link>
        </div>
      </aside>
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass-strong border-t border-white/10 h-[64px] flex items-center justify-around px-2 pb-1">
        {[
          {href:"/", icon:House, label:"Home"},
          {href:"/search", icon:Search, label:"Cari"},
          {href:"/trending", icon:TrendingUp, label:"Top"},
          {href:"/jadwal", icon:Calendar, label:"Jadwal"},
          {href:"/profile", icon:User, label:"Saya"},
        ].map(it=>(
          <Link key={it.href} href={it.href} className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition ${pathname===it.href?"text-white bg-white/10":"text-zinc-500"}`}>
            <it.icon size={18} /><span className="text-[10px] font-medium">{it.label}</span>
          </Link>
        ))}
      </nav>
    </>
  );
}
