import Sidebar from "../../components/Sidebar";
import Card from "../../components/Card";
import { video } from "../../lib/bstation";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function PlayerPage({ searchParams }) {
  const id = searchParams?.id;
  let data = null;
  if (id) {
    try { data = await video(id, "id"); } catch (e) { data = null; }
  }
  return (
    <main>
      <Sidebar />
      <div className="md:ml-[68px]">
        <header className="sticky top-0 z-40 bg-black/90 backdrop-blur border-b border-white/5 px-4 md:px-8 h-[52px] flex items-center gap-3">
          <Link href="/" className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center">←</Link>
          <span className="font-bold text-sm">Wibu.ID</span>
          <span className="hidden md:inline text-zinc-600">/</span>
          <span className="hidden md:inline text-sm text-zinc-300 truncate max-w-[400px]">{data?.title || "Player"}</span>
          <span className="ml-auto text-[11px] font-bold bg-[#E50914] px-2.5 py-1 rounded-full">Embed Resmi</span>
        </header>
        <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-4 md:py-6 grid grid-cols-1 lg:grid-cols-[1.6fr_0.8fr] gap-5">
          <div>
            <div className="relative aspect-video rounded-lg overflow-hidden bg-black border border-white/10">
              {id ? <iframe src={`https://www.bilibili.tv/id/video/${id}`} className="absolute inset-0 w-full h-full" frameBorder="0" allow="fullscreen; encrypted-media" allowFullScreen /> : <div className="p-8 text-sm text-zinc-500">Pilih video dari homepage</div>}
            </div>
            <div className="mt-4 bg-[#141414] rounded-lg border border-white/5 p-4 md:p-5">
              <h1 className="text-[18px] md:text-[22px] font-black leading-tight">{data?.title || "Pilih video"}</h1>
              <p className="mt-1 text-xs text-zinc-400">{data?.publishedAt || ""} • {data?.durationSec ? Math.floor(data.durationSec/60) + ":" + String(data.durationSec%60).padStart(2,"0") : ""} • {data?.uploader?.name || ""}</p>
              <div className="mt-3 flex flex-wrap gap-2 text-xs">
                <span className="px-3 py-1 rounded-full bg-white text-black font-bold">Sub Indo</span>
                <span className="px-3 py-1 rounded-full bg-white/10 border border-white/10">{data?.stats?.view || ""} views</span>
              </div>
              <p className="mt-4 text-[13px] leading-relaxed text-zinc-300">{data?.description || "Deskripsi akan muncul setelah video dimuat. Data live dari Bstation."}</p>
              {data?.stats && (
                <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="bg-[#0f0f0f] p-3 rounded"><div className="font-black">{data.stats.view || "-"}</div><div className="text-zinc-500">Views</div></div>
                  <div className="bg-[#0f0f0f] p-3 rounded"><div className="font-black">{data.stats.like || data.stats.like_count || "-"}</div><div className="text-zinc-500">Likes</div></div>
                  <div className="bg-[#0f0f0f] p-3 rounded"><div className="font-black">{data.durationSec || "-"}</div><div className="text-zinc-500">Detik</div></div>
                </div>
              )}
            </div>
          </div>
          <div className="space-y-4">
            <div className="bg-[#141414] rounded-lg border border-white/5 p-4">
              <h3 className="text-sm font-bold">Rekomendasi</h3>
              <div className="mt-3 flex gap-3 overflow-x-auto no-scrollbar pb-2">
                {(data?.related || []).slice(0,6).map((it) => <Card key={it.id} item={it} />)}
              </div>
            </div>
            <div className="bg-[#111] rounded-lg border border-white/5 p-4 text-xs text-zinc-400">
              <div className="font-bold text-white">Embed Resmi</div>
              <p className="mt-1">Player pakai iframe https://www.bilibili.tv/id/video/[ID] — aman DMCA.</p>
              <a href={data ? `https://www.bilibili.tv/id/video/${id}` : "#"} target="_blank" className="inline-block mt-3 px-4 py-2 rounded-full bg-white text-black font-bold">Buka di Bstation</a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
