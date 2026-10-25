import Sidebar from "../components/Sidebar";
import Hero from "../components/Hero";
import Card from "../components/Card";
import Link from "next/link";
import { home } from "../lib/bstation";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Home() {
  let data;
  try { data = await home("id"); } catch { data = null; }
  if (!data) {
    data = {
      popular: [{ id:"4786398590799360", type:"ugc", title:"KIMI NO NAWA", cover:"https://pic.bstarstatic.com/ugc/1866aec5ec961b7ac03b2b42aa258e94.jpg", views:"117K", badge:"Gratis" }],
      animeHot: [{ id:"2117053", type:"ogv", title:"Kisah Penggembala Dewa", cover:"https://pic.bstarstatic.com/ogv/bac6048b713c32beea4a489e6be4a38c.png", views:"43.2M", status:"E 105", badge:"Gratis" }],
      animeNew: [],
      animeTrending: [],
      timeline: [],
      tabs: [{name:"Hot",id:"0"},{name:"Terbaru",id:"2"},{name:"Aksi",id:"aksi"}],
    };
  }
  const heroItem = data.animeHot?.[0] || data.animeTrending?.[0] || data.popular?.[0];
  const today = data.timeline?.find(d=>d.today);

  const Section = ({ title, subtitle, items, href, count }) => (
    <div className="max-w-[1400px] mx-auto px-4 md:px-8 mt-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[15px] md:text-[16px] font-black tracking-tight flex items-center gap-2">{title} {count!=null && <span className="glass px-2 py-0.5 rounded-full text-[11px] font-bold text-zinc-300">{count}</span>}</h2>
          {subtitle && <p className="text-xs text-zinc-500 mt-0.5">{subtitle}</p>}
        </div>
        {href && <Link href={href} className="text-xs font-bold text-zinc-400 hover:text-white glass px-3 py-1.5 rounded-full hover:bg-white hover:text-black transition-all">Lihat →</Link>}
      </div>
      <div className="mt-4 flex gap-4 overflow-x-auto no-scrollbar pb-4 snap-x">
        {(items || []).map(it => <div key={it.id+it.title.slice(0,6)} className="snap-start"><Card item={it} /></div>)}
        {(!items || items.length===0) && <span className="text-xs text-zinc-500 py-8">Memuat...</span>}
      </div>
    </div>
  );

  return (
    <main className="page-enter">
      <Sidebar />
      <div className="md:ml-[72px] pb-20 md:pb-0 bg-[#070709] min-h-screen">
        <Hero item={heroItem} />

        <div className="max-w-[1400px] mx-auto px-4 md:px-8 mt-6">
          <div className="glass rounded-2xl p-3 flex gap-2 overflow-x-auto no-scrollbar">
            <Link href="/genre" className="px-5 py-2 rounded-full text-xs font-black bg-white text-black whitespace-nowrap shadow">Semua Genre</Link>
            {(data.tabs || []).slice(0,14).map(t=>(
              <Link key={t.id+t.name} href={`/genre?name=${encodeURIComponent(t.name)}&id=${t.id||''}`} className="px-4 py-2 rounded-full text-xs font-semibold glass hover:bg-white hover:text-black whitespace-nowrap transition-all">
                {t.name}
              </Link>
            ))}
          </div>
        </div>

        {today && today.items?.length>0 && (
          <div className="max-w-[1400px] mx-auto px-4 md:px-8 mt-6">
            <div className="glass-strong rounded-2xl p-5">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-black flex items-center gap-2">📅 Jadwal Hari Ini <span className="text-zinc-400 font-semibold">• {today.day} {today.date}</span></h2>
                <Link href="/jadwal" className="text-xs font-bold text-[#E50914]">Lihat Jadwal →</Link>
              </div>
              <div className="mt-4 flex gap-4 overflow-x-auto no-scrollbar pb-1">
                {today.items.slice(0,10).map(it=> <Card key={it.id} item={it} />)}
              </div>
            </div>
          </div>
        )}

        <Section title="New this week" subtitle="UGC pilihan — update tiap jam" items={data.popular} href="/search?q=anime" count={data.popular?.length} />
        <Section title="Trending Now • Hot" subtitle="Paling banyak ditonton — gateway Hot" items={data.animeHot?.slice(0,16)} href="/trending" count={data.animeHot?.length} />
        <Section title="Terbaru" subtitle="Rilis terbaru — gateway Terbaru" items={data.animeNew?.slice(0,16)} href="/genre?name=Terbaru&id=2" count={data.animeNew?.length} />
        {data.animeTrending?.length>0 && <Section title="Rekomendasi Untukmu" subtitle="Anime trending pilihan" items={data.animeTrending.slice(0,10)} href="/genre" count={data.animeTrending.length} />}

        <div className="max-w-[1400px] mx-auto px-4 md:px-8 mt-8 grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            {title:"Auto Play Lancar", desc:"Embed resmi HD, HP & laptop"},
            {title:"Glass Morphism", desc:"Blur elegan tanpa neon"},
            {title:"Komentar Live", desc:"Like • balas • terpopuler"},
            {title:"Semua Genre", desc:`${data.tabs?.length||14}+ filter lengkap`},
          ].map(f=>(
            <div key={f.title} className="glass rounded-xl p-4 hover:bg-white/[0.08] transition">
              <div className="font-bold text-sm text-white">{f.title}</div><div className="text-xs text-zinc-500 mt-1">{f.desc}</div>
            </div>
          ))}
        </div>

        <footer className="max-w-[1400px] mx-auto px-4 md:px-8 py-8 mt-8 border-t border-white/5 text-[11px] text-zinc-500 flex flex-wrap gap-3">
          <span>© 2026 Wibu.ID • Glass • Live Bstation</span>
          <span className="glass px-2 py-1 rounded-full text-emerald-400">● Live</span>
          <Link href="/search" className="hover:text-white">Cari</Link>
          <Link href="/jadwal" className="hover:text-white">Jadwal</Link>
          <Link href="/trending" className="hover:text-white">Trending</Link>
          <Link href="/genre" className="hover:text-white">Genre</Link>
        </footer>
      </div>
    </main>
  );
}
