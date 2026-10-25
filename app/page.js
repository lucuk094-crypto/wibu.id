import Sidebar from "../components/Sidebar";
import Hero from "../components/Hero";
import Card from "../components/Card";
import { home } from "../lib/bstation";

export const dynamic = "force-dynamic";

export default async function Home() {
  let data;
  try {
    data = await home("id");
  } catch (e) {
    data = { popular: [], animeTrending: [], timeline: [] };
  }
  const heroItem = data.animeTrending?.[0] || data.popular?.[0];
  const newItems = data.popular?.length ? data.popular : data.animeTrending;
  const trendingItems = data.animeTrending?.length ? data.animeTrending : data.popular;

  return (
    <main>
      <Sidebar />
      <div className="md:ml-[68px] pb-20 md:pb-0">
        <Hero item={heroItem} />
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 mt-6">
          <div className="flex items-center justify-between">
            <h2 className="text-[13px] md:text-[14px] font-bold">New this week • Bstation UGC • {newItems?.length} video</h2>
            <span className="text-[11px] text-zinc-500">Live anti-error</span>
          </div>
          <div className="mt-3 flex gap-3 overflow-x-auto no-scrollbar pb-3">
            {(newItems || []).map((it) => <Card key={it.id} item={it} />)}
          </div>
        </div>
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 mt-2">
          <h2 className="text-[13px] md:text-[14px] font-bold">Trending Now • Anime OGV • {trendingItems?.length} anime</h2>
          <div className="mt-3 flex gap-3 overflow-x-auto no-scrollbar pb-6">
            {(trendingItems || []).map((it) => <Card key={it.id} item={it} />)}
          </div>
        </div>
        <footer className="max-w-[1400px] mx-auto px-4 md:px-8 py-6 border-t border-white/5 text-[11px] text-zinc-500">© 2026 Wibu.ID — Katalog Legal • Live Bstation via SSR Next.js • Embed Resmi • Ikon Lucide</footer>
      </div>
    </main>
  );
}
