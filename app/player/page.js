import Sidebar from "../../components/Sidebar";
import Card from "../../components/Card";
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
    return (
      <main><Sidebar /><div className="md:ml-[68px] p-8 text-center"><h1 className="text-xl font-black">Pilih Video</h1><Link href="/" className="mt-4 inline-block px-6 py-2 rounded-full bg-white text-black font-bold">Kembali ke Home</Link></div></main>
    );
  }

  try {
    if (type === "ogv") {
      try { seasonData = await play(id, "id"); isAnime = !!seasonData?.season; if (!isAnime) throw new Error("not anime"); } catch (e) { data = await video(id, "id"); }
    } else {
      try { data = await video(id, "id"); } catch (e) { seasonData = await play(id, "id"); isAnime = !!seasonData?.season; if (!isAnime) throw e; }
    }
  } catch (e) {
    errorMsg = e.message;
  }

  if (errorMsg) {
    return (
      <main>
        <Sidebar />
        <div className="md:ml-[68px] min-h-[60vh] flex flex-col items-center justify-center p-8 text-center">
          <div className="text-xl font-black">Video Tidak Ditemukan</div>
          <p className="text-sm text-zinc-500 mt-2 max-w-[400px] break-words">ID {id} tidak ada di Bstation / region tidak tersedia. Error: {errorMsg}</p>
          <div className="mt-4 flex gap-3">
            <Link href="/" className="px-6 py-2 rounded-full bg-white text-black text-sm font-bold">Kembali ke Home</Link>
            <a href={`https://www.bilibili.tv/id/video/${id}`} target="_blank" className="px-6 py-2 rounded-full bg-[#E50914] text-white text-sm font-bold">Coba di Bstation</a>
          </div>
        </div>
      </main>
    );
  }

  if (isAnime && seasonData?.season) {
    const s = seasonData.season;
    const styles = Array.isArray(s.styles) ? s.styles : [];
    return (
      <main>
        <Sidebar />
        <div className="md:ml-[68px]">
          <header className="sticky top-0 z-40 bg-black/90 backdrop-blur border-b border-white/5 px-4 md:px-8 h-[52px] flex items-center gap-3">
            <Link href="/" className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center">←</Link>
            <span className="font-bold text-sm">Wibu.ID</span>
            <span className="hidden md:inline text-xs text-zinc-400 truncate">/ <SafeText value={s.title} /></span>
            <span className="ml-auto text-[11px] bg-[#E50914] px-2.5 py-1 rounded-full">Anime • Embed</span>
          </header>
          <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-4 grid grid-cols-1 lg:grid-cols-[1.6fr_0.8fr] gap-5">
            <div>
              <div className="relative aspect-video rounded-lg overflow-hidden bg-black border border-white/10">
                <iframe src={`https://www.bilibili.tv/id/play/${seasonData.seasonId}`} className="absolute inset-0 w-full h-full" frameBorder="0" allow="fullscreen" allowFullScreen />
              </div>
              <div className="mt-4 bg-[#141414] rounded-lg border border-white/5 p-5">
                <h1 className="text-xl font-black"><SafeText value={s.title} /></h1>
                <p className="text-xs text-zinc-400 mt-1"><SafeText value={s.views} /> • <SafeText value={s.index_show} /></p>
                <p className="mt-3 text-sm text-zinc-300 leading-relaxed"><SafeText value={s.evaluate || s.desc} /></p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {styles.map((st, i) => {
                    const name = typeof st === "object" ? (st.title || st.name || JSON.stringify(st)) : String(st);
                    return <span key={i} className="px-2 py-1 rounded-full bg-white/10 text-xs border border-white/10">{name}</span>;
                  })}
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="bg-[#141414] rounded-lg border border-white/5 p-4">
                <h3 className="text-sm font-bold">Daftar Episode • {(seasonData.sections?.[0]?.episodes?.length)||0}</h3>
                <div className="mt-3 space-y-2 max-h-[500px] overflow-auto pr-1">
                  {(seasonData.sections?.flatMap(sec=>sec.episodes||[]) || []).slice(0,50).map((ep,i)=>(
                    <div key={ep.episode_id||i} className="flex items-center gap-3 p-2 rounded bg-[#1a1a1a] border border-white/5">
                      <span className="w-7 h-7 rounded bg-white text-black flex items-center justify-center text-xs font-bold">{i+1}</span>
                      <span className="text-xs font-semibold truncate">{ep.title || ep.long_title || `Episode ${i+1}`}</span>
                      <span className="ml-auto text-xs text-zinc-500">{ep.duration||""}</span>
                    </div>
                  ))}
                  {(!seasonData.sections || seasonData.sections.length===0) && <div className="text-xs text-zinc-500">Tidak ada episode — buka di Bstation</div>}
                </div>
              </div>
              <div className="bg-[#111] rounded-lg border border-white/5 p-4 text-xs text-zinc-400">
                <div className="font-bold text-white">Tentang Anime</div>
                <p className="mt-2">Studio: <SafeText value={s.studio} /> • Tahun: <SafeText value={s.year} /> • Total: <SafeText value={s.total_episodes} /></p>
                <a href={seasonData.url} target="_blank" className="inline-block mt-3 px-4 py-2 rounded-full bg-white text-black font-bold">Buka di Bstation</a>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main>
      <Sidebar />
      <div className="md:ml-[68px]">
        <header className="sticky top-0 z-40 bg-black/90 backdrop-blur border-b border-white/5 px-4 md:px-8 h-[52px] flex items-center gap-3">
          <Link href="/" className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center">←</Link>
          <span className="font-bold text-sm">Wibu.ID</span>
          <span className="hidden md:inline text-xs text-zinc-400 truncate">/ {data?.title || "Player"}</span>
          <span className="ml-auto text-[11px] bg-[#E50914] px-2.5 py-1 rounded-full">UGC • Embed</span>
        </header>
        <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-4 grid grid-cols-1 lg:grid-cols-[1.6fr_0.8fr] gap-5">
          <div>
            <div className="relative aspect-video rounded-lg overflow-hidden bg-black border border-white/10">
              {id ? <iframe src={`https://www.bilibili.tv/id/video/${id}`} className="absolute inset-0 w-full h-full" frameBorder="0" allow="fullscreen" allowFullScreen /> : <div className="p-8 text-sm text-zinc-500">Pilih video</div>}
            </div>
            <div className="mt-4 bg-[#141414] rounded-lg border border-white/5 p-5">
              <h1 className="text-xl font-black leading-tight">{data?.title || "Memuat..."}</h1>
              <p className="mt-1 text-xs text-zinc-400">{data?.publishedAt || ""} • {data?.durationSec ? Math.floor(data.durationSec/60)+":"+String(data.durationSec%60).padStart(2,"0") : ""} • {data?.uploader?.name || ""}</p>
              <div className="mt-3 flex gap-2">
                <button id="saveListBtn" className="px-4 py-2 rounded-full bg-[#E50914] text-white text-xs font-bold">♡ Simpan ke List</button>
                <a href={data ? `https://www.bilibili.tv/id/video/${id}` : "#"} target="_blank" className="px-4 py-2 rounded-full bg-white/10 border border-white/10 text-xs font-bold">Buka di Bstation</a>
              </div>
              <p className="mt-4 text-sm text-zinc-300 leading-relaxed">{data?.description || "Tidak ada deskripsi"}</p>
              {data?.stats && (
                <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                  <div className="bg-[#0f0f0f] p-3 rounded"><div className="font-black text-sm">{String(data.stats.view || "-")}</div><div className="text-[11px] text-zinc-500">Views</div></div>
                  <div className="bg-[#0f0f0f] p-3 rounded"><div className="font-black text-sm">{String(data.stats.like || data.stats.like_count || "-")}</div><div className="text-[11px] text-zinc-500">Likes</div></div>
                  <div className="bg-[#0f0f0f] p-3 rounded"><div className="font-black text-sm">{String(data.durationSec || "-")}</div><div className="text-[11px] text-zinc-500">Detik</div></div>
                </div>
              )}
            </div>
            <script dangerouslySetInnerHTML={{__html:`
              document.getElementById('saveListBtn')?.addEventListener('click', ()=>{
                try{
                  const data=${JSON.stringify(data).replace(/</g,'\\u003c')};
                  if(!data || !data.id) return;
                  const list=JSON.parse(localStorage.getItem('wibu_list')||'[]');
                  if(!list.find(x=>x.id===data.id)){ list.push({id:data.id, title:data.title, cover:data.cover}); localStorage.setItem('wibu_list', JSON.stringify(list)); alert('Ditambahkan ke List!'); } else alert('Sudah di List');
                  const h=JSON.parse(localStorage.getItem('wibu_history')||'[]');
                  h.unshift({id:data.id, title:data.title, cover:data.cover, time: Date.now()}); localStorage.setItem('wibu_history', JSON.stringify(h.slice(0,50)));
                }catch(e){}
              });
              try{
                const data=${JSON.stringify(data).replace(/</g,'\\u003c')};
                if(data && data.id){
                  const h=JSON.parse(localStorage.getItem('wibu_history')||'[]');
                  h.unshift({id:data.id, title:data.title, cover:data.cover, time: Date.now()}); localStorage.setItem('wibu_history', JSON.stringify(h.slice(0,50)));
                }
              }catch(e){}
            `}} />
          </div>
          <div className="space-y-4">
            <div className="bg-[#141414] rounded-lg border border-white/5 p-4">
              <h3 className="text-sm font-bold">Uploader</h3>
              {data?.uploader && <div className="mt-3 flex items-center gap-3"><img src={data.uploader.avatar?.startsWith("//")?"https:"+data.uploader.avatar:data.uploader.avatar} alt={data.uploader.name} className="w-10 h-10 rounded-full" /><div><div className="text-sm font-bold">{data.uploader.name}</div><div className="text-xs text-zinc-500">ID: {data.uploader.id}</div></div><a href={`https://www.bilibili.tv/id/space/${data.uploader.id}`} target="_blank" className="ml-auto text-xs bg-white text-black px-3 py-1 rounded-full font-bold">Follow</a></div>}
            </div>
            <div className="bg-[#141414] rounded-lg border border-white/5 p-4">
              <h3 className="text-sm font-bold">Rekomendasi</h3>
              <div className="mt-3 flex gap-3 overflow-x-auto no-scrollbar pb-2 flex-wrap">
                {(data?.related || []).slice(0,6).map(it=> <Card key={it.id} item={it} />)}
                {(!data?.related || data.related.length===0) && <span className="text-xs text-zinc-500">Tidak ada rekomendasi</span>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
