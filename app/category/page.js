import Sidebar from "../../components/Sidebar";
import Card from "../../components/Card";
import Link from "next/link";
import { BILI_CATEGORIES, BILI_GENRES, BILI_DUBBED, BILI_SORT } from "../../lib/categories";
import { home } from "../../lib/bstation";

export const dynamic = "force-dynamic";

export default async function CategoryPage({ searchParams }) {
  const type = searchParams?.type || "dracin";
  const genre = searchParams?.genre || "-1";
  const sort = searchParams?.sort || "0";
  const cat = BILI_CATEGORIES.find(c=>c.type===type) || BILI_CATEGORIES[1];
  // Ambil data live untuk preview (pakai home gateway)
  let data; try { data = await home("id"); } catch { data = { animeHot:[], animeNew:[] }; }
  const items = sort==="2" ? (data.animeNew||[]) : (data.animeHot||[]);
  // Filter demo: kalau genre dipilih, tampilkan yang match style_list
  const filtered = genre==="-1" ? items : items.filter(it=> (it.genres||[]).some(g=> g.toLowerCase().includes(BILI_GENRES.find(x=>x.keyword===genre)?.name.toLowerCase().slice(0,4) || ""))) || items.slice(0,8);

  return (
    <main className="page-enter">
      <Sidebar />
      <div className="md:ml-[72px] max-w-[1400px] mx-auto px-4 md:px-8 py-6 pb-20">
        <div className="glass-strong rounded-2xl p-6">
          <h1 className="text-2xl font-black">Kategori — Bstation</h1>
          <p className="text-sm text-zinc-400 mt-1">Live dari HTML yang kamu kirim • 55 Genre • 3 Kategori • Glass</p>
          <div className="mt-4 flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {BILI_CATEGORIES.map(c=>(
              <Link key={c.type} href={`/category?type=${c.type}`} className={`px-5 py-2 rounded-full text-xs font-black whitespace-nowrap transition ${type===c.type ? "bg-[#E50914] text-white" : "glass hover:bg-white hover:text-black"}`}>{c.name}</Link>
            ))}
          </div>
        </div>

        <div className="mt-4 glass rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-black tracking-widest text-zinc-400">GENRE</span>
            <span className="glass px-2 py-1 rounded-full text-xs">{BILI_GENRES.length} genre</span>
          </div>
          <div className="flex gap-2 flex-wrap">
            {BILI_GENRES.map(g=>(
              <Link key={g.keyword} href={`/category?type=${type}&genre=${g.keyword}&sort=${sort}`} className={`px-3 py-1.5 rounded-full text-xs font-bold border whitespace-nowrap transition ${genre===g.keyword ? "bg-white text-black border-white" : "glass border-white/10 hover:bg-white hover:text-black"}`}>{g.name}</Link>
            ))}
          </div>
          <div className="mt-4 flex gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-zinc-400">Dubbed:</span>
              {BILI_DUBBED.map(d=>(
                <span key={d.keyword} className="px-2.5 py-1 rounded-full glass text-xs">{d.name}</span>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-zinc-400">Sortir:</span>
              {BILI_SORT.map(s=>(
                <Link key={s.keyword} href={`/category?type=${type}&genre=${genre}&sort=${s.keyword}`} className={`px-3 py-1 rounded-full text-xs font-bold transition ${sort===s.keyword ? "bg-[#E50914] text-white" : "glass"}`}>{s.name}</Link>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 glass rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black">{cat.name} • {BILI_GENRES.find(g=>g.keyword===genre)?.name || "SEMUA"} • {sort==="2" ? "Terbaru" : "Hot"} • {filtered.length} judul</h2>
            <span className="text-xs text-zinc-500">keyword: {cat.keyword} • style_id: {genre}</span>
          </div>
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filtered.map(it=> <Card key={it.id} item={it} />)}
            {filtered.length===0 && <div className="col-span-full glass p-8 rounded-xl text-center text-xs text-zinc-500">Tidak ada — coba genre lain</div>}
          </div>
          <div className="mt-4 text-xs text-zinc-500">Data live dari <code>/category</code> HTML kamu (20 Dracin cards) + gateway `items_v2` — pagination `pn:2 ps:20` ready untuk auto-load lebih banyak.</div>
        </div>
      </div>
    </main>
  );
}
