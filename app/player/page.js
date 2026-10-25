import Sidebar from "../../components/Sidebar";
import Card from "../../components/Card";
import InteractBar from "../../components/InteractBar";
import Comments from "../../components/Comments";
import { video, play } from "../../lib/bstation";
import Link from "next/link";
export const dynamic = "force-dynamic";
function SafeText({ value, fallback = "-" }) {
  if (value == null) return fallback;
  if (typeof value === "string" || typeof value === "number") return String(value);
  if (Array.isArray(value)) return value.map(v => typeof v === "object" ? (v.title || v.name || JSON.stringify(v)) : String(v)).join(", ");
  if (typeof value === "object") return value.title || value.name || value.text || JSON.stringify(value);
  return String(value);
}
export default async function PlayerPage({ searchParams }) {
  const id = searchParams?.id;
  const type = searchParams?.type;
  let data = null, seasonData = null, isAnime = false, errorMsg = null;
  if (!id) {
    return (<main><Sidebar /><div className="md:ml-[72px] p-8 text-center"><h1 className="text-xl font-black">Pilih Video</h1><Link href="/" className="mt-4 inline-block px-6 py-2 rounded-full bg-white text-black font-bold">Kembali ke Home</Link></div></main>);
  }
  try {
    if (type === "ogv") { try { seasonData = await play(id, "id"); isAnime = !!seasonData?.season; if (!isAnime) throw new Error("not anime"); } catch (e) { data = await video(id, "id"); } }
    else { try { data = await video(id, "id"); } catch (e) { seasonData = await play(id, "id"); isAnime = !!seasonData?.season; if (!isAnime) throw e; } }
  } catch (e) { errorMsg = e.message; }
  if (errorMsg) {
    return (<main><Sidebar /><div className="md:ml-[72px] min-h-[60vh] flex flex-col items-center justify-center p-8 text-center"><div className="text-xl font-black">Video Tidak Ditemukan</div><p className="text-sm text-zinc-500 mt-2 max-w-[400px] break-words">ID {id} tidak ada / region tidak tersedia. Error: {errorMsg}</p><div className="mt-4 flex gap-3 justify-center flex-wrap"><Link href="/" className="px-6 py-2 rounded-full bg-white text-black text-sm font-bold">Kembali ke Home</Link><a href={`https://www.bilibili.tv/id/video/${id}`} target="_blank" className="px-6 py-2 rounded-full bg-[#E50914] text-white text-sm font-bold">Coba di Bstation</a></div></div></main>);
  }
  if (isAnime && seasonData?.season) {
    const s = seasonData.season;
    const styles = Array.isArray(s.styles) ? s.styles : [];
    return (
      <main className="page-enter">
        <Sidebar />
        <div className="md:ml-[72px]">
          <header className="sticky top-0 z-40 glass-strong border-b border-white/5 px-4 md:px-8 h-[56px] flex items-center gap-3">
            <Link href="/" className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition">←</Link>
            <span className="font-black text-sm">Wibu.ID</span>
            <span className="hidden md:inline text-xs text-zinc-400 truncate">/ <SafeText value={s.title} /></span>
            <span className="ml-auto text-[11px] bg-[#E50914] px-3 py-1 rounded-full font-bold">Anime • Glass</span>
          </header>
          <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-6 grid grid-cols-1 lg:grid-cols-[1.6fr_0.8fr] gap-6">
            <div>
              <div className="relative aspect-video rounded-2xl overflow-hidden glass-strong p-1">
                <div className="relative w-full h-full rounded-xl overflow-hidden bg-black">
                  <iframe src={`https://www.bilibili.tv/id/play/${seasonData.seasonId}`} className="absolute inset-0 w-full h-full" frameBorder="0" allow="autoplay; fullscreen; encrypted-media" allowFullScreen loading="eager" />
                </div>
              </div>
              <div className="mt-4 glass rounded-2xl p-6">
                <h1 className="text-xl md:text-2xl font-black leading-tight"><SafeText value={s.title} /></h1>
                <p className="text-xs text-zinc-400 mt-2 flex items-center gap-2"><span className="glass px-2 py-1 rounded-full"><SafeText value={s.views} /></span> <span className="text-emerald-400"><SafeText value={s.index_show} /></span></p>
                <InteractBar id={String(seasonData.seasonId)} title={typeof s.title === 'string' ? s.title : String(s.title?.title||'')} cover={s.cover} stats={{ view: s.views, like: s.follow_count||0 }} />
                <p className="mt-4 text-sm text-zinc-300 leading-relaxed"><SafeText value={s.evaluate || s.desc || s.brief || 'Nonton anime legal via embed resmi Bstation — auto play lancar di HP & laptop.'} /></p>
                <div className="mt-3 flex flex-wrap gap-2">{styles.map((st,i)=>{ const name = typeof st === "object" ? (st.title || st.name || JSON.stringify(st)) : String(st); return <span key={i} className="px-3 py-1 rounded-full glass text-xs font-medium">{name}</span>;})}</div>
                <div className="mt-4 flex gap-2"><a href={seasonData.url} target="_blank" className="px-5 py-2 rounded-full bg-white text-black text-xs font-black hover:scale-105 transition">Buka di Bstation</a><span className="px-3 py-2 rounded-full bg-emerald-500/15 border border-emerald-500/20 text-emerald-400 text-xs font-bold">✔ Auto Play Lancar</span></div>
              </div>
              <div className="glass rounded-2xl mt-4 overflow-hidden"><Comments videoId={String(seasonData.seasonId)} /></div>
            </div>
            <div className="space-y-4">
              <div className="glass-strong rounded-2xl p-5">
                <h3 className="text-sm font-black flex items-center justify-between">Daftar Episode <span className="glass px-2 py-1 rounded-full text-xs">{seasonData.sections?.flatMap(s=>s.episodes||[]).length || 0}</span></h3>
                <div className="mt-4 space-y-2 max-h-[480px] overflow-auto pr-1">
                  {(seasonData.sections?.flatMap(sec=>sec.episodes||[]) || []).slice(0,80).map((ep,i)=>(
                    <a key={ep.episode_id||i} href={`https://www.bilibili.tv/id/play/${seasonData.seasonId}/${ep.episode_id||''}`} target="_blank" className="flex items-center gap-3 p-3 rounded-xl glass hover:bg-white hover:text-black group transition-all duration-300">
                      <span className="w-8 h-8 rounded-lg bg-white text-black group-hover:bg-[#E50914] group-hover:text-white flex items-center justify-center text-xs font-black shrink-0 transition">{i+1}</span>
                      <span className="text-xs font-semibold truncate">{ep.title || ep.long_title || `Episode ${i+1}`}</span>
                      <span className="ml-auto text-xs text-zinc-500 group-hover:text-zinc-600 shrink-0">{ep.duration||""}</span>
                    </a>
                  ))}
                </div>
              </div>
              <div className="glass rounded-2xl p-5">
                <h3 className="text-sm font-black">Rekomendasi</h3>
                <div className="mt-4 grid grid-cols-2 gap-3">{(seasonData.recommend || []).slice(0,6).map(it=> <Card key={it.id} item={it} />)}</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }
  return (
    <main className="page-enter">
      <Sidebar />
      <div className="md:ml-[72px]">
        <header className="sticky top-0 z-40 glass-strong border-b border-white/5 px-4 md:px-8 h-[56px] flex items-center gap-3">
          <Link href="/" className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center">←</Link>
          <span className="font-black text-sm">Wibu.ID</span>
          <span className="hidden md:inline text-xs text-zinc-400 truncate">/ {data?.title?.slice(0,40) || "Player"}</span>
          <span className="ml-auto text-[11px] bg-[#E50914] px-3 py-1 rounded-full font-bold">UGC • Glass</span>
        </header>
        <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-6 grid grid-cols-1 lg:grid-cols-[1.6fr_0.8fr] gap-6">
          <div>
            <div className="relative aspect-video rounded-2xl overflow-hidden glass-strong p-1">
              <div className="relative w-full h-full rounded-xl overflow-hidden bg-black">{id ? <iframe src={`https://www.bilibili.tv/id/video/${id}`} className="absolute inset-0 w-full h-full" frameBorder="0" allow="autoplay; fullscreen; encrypted-media" allowFullScreen loading="eager" /> : <div className="p-8 text-sm text-zinc-500">Pilih video</div>}</div>
            </div>
            <div className="mt-4 glass rounded-2xl p-6">
              <h1 className="text-xl md:text-2xl font-black leading-tight">{data?.title || "Memuat..."}</h1>
              <p className="mt-2 text-xs text-zinc-400">{data?.publishedAt || ""} • {data?.durationSec ? Math.floor(data.durationSec/60)+":"+String(data.durationSec%60).padStart(2,"0") : ""} • {data?.uploader?.name || ""}</p>
              <InteractBar id={String(id)} title={data?.title || ""} cover={data?.cover} stats={data?.stats} />
              <p className="mt-4 text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap">{data?.description || "Tidak ada deskripsi"}</p>
              {data?.stats && (<div className="mt-4 grid grid-cols-3 gap-3 text-center">{["Views","Likes","Durasi"].map((k,i)=>{ const v = [data.stats.view||"-", data.stats.like||"-", data.durationSec?Math.floor(data.durationSec/60)+"m":"-"][i]; return <div key={k} className="glass rounded-xl p-3"><div className="font-black text-sm">{String(v)}</div><div className="text-[11px] text-zinc-500">{k}</div></div>})}</div>)}
              <div className="mt-4 flex gap-2 flex-wrap"><a href={data ? `https://www.bilibili.tv/id/video/${id}` : "#"} target="_blank" className="px-5 py-2 rounded-full bg-white text-black text-xs font-black">Buka di Bstation</a><span className="px-3 py-2 rounded-full bg-emerald-500/15 border border-emerald-500/20 text-emerald-400 text-xs font-bold">✔ Auto Play</span></div>
            </div>
            <div className="glass rounded-2xl mt-4 overflow-hidden"><Comments videoId={String(id)} /></div>
          </div>
          <div className="space-y-4">
            <div className="glass rounded-2xl p-5"><h3 className="text-sm font-black">Uploader</h3>{data?.uploader && <div className="mt-3 flex items-center gap-3"><img src={data.uploader.avatar?.startsWith("//")?"https:"+data.uploader.avatar:data.uploader.avatar} alt={data.uploader.name} className="w-10 h-10 rounded-full object-cover border border-white/10" /><div><div className="text-sm font-bold">{data.uploader.name}</div><div className="text-xs text-zinc-500">ID: {data.uploader.id}</div></div><a href={`https://www.bilibili.tv/id/space/${data.uploader.id}`} target="_blank" className="ml-auto text-xs bg-white text-black px-3 py-1.5 rounded-full font-bold">Follow</a></div>}</div>
            <div className="glass rounded-2xl p-5"><h3 className="text-sm font-black">Rekomendasi • {data?.related?.length||0}</h3><div className="mt-4 grid grid-cols-2 gap-3">{(data?.related || []).slice(0,8).map(it=> <Card key={it.id} item={it} />)}</div><Link href="/trending" className="mt-4 inline-block text-xs font-bold text-[#E50914] bg-white px-3 py-1.5 rounded-full">Lihat Trending →</Link></div>
          </div>
        </div>
      </div>
    </main>
  );
}
