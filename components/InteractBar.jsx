"use client";
import { useEffect, useState } from "react";
import { ThumbsUp, ThumbsDown, Share2, Bookmark, MessageSquare } from "lucide-react";

export default function InteractBar({ id, title, cover, stats }) {
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [liked, setLiked] = useState(null); // 'like'|'dislike'|null
  const [saved, setSaved] = useState(false);
  const [showShare, setShowShare] = useState(false);

  useEffect(()=>{
    try {
      const key = `wibu_react_${id}`;
      const savedKey = `wibu_saved_${id}`;
      const l = JSON.parse(localStorage.getItem(key) || "null");
      if (l) { setLikes(l.likes||0); setDislikes(l.dislikes||0); setLiked(l.liked||null); }
      else if (stats?.like) {
        // seed from server stat biar tidak 0 semua
        const seed = parseInt(String(stats.like).replace(/\D/g,"")) || Math.floor(Math.random()*5000)+1200;
        setLikes(seed);
      }
      setSaved(!!JSON.parse(localStorage.getItem(savedKey) || "false"));
      // history
      const h=JSON.parse(localStorage.getItem('wibu_history')||'[]');
      h.unshift({id, title, cover, time: Date.now()}); 
      localStorage.setItem('wibu_history', JSON.stringify(h.slice(0,50).filter((v,i,a)=> a.findIndex(t=>t.id===v.id)===i)));
    } catch {}
  },[id, title, cover, stats]);

  const persist = (nLikes, nDislikes, nLiked) => {
    try { localStorage.setItem(`wibu_react_${id}`, JSON.stringify({ likes:nLikes, dislikes:nDislikes, liked:nLiked })); } catch {}
  };

  const handleLike = () => {
    let nl=likes, nd=dislikes, nLiked=liked;
    if (liked==="like") { nl=Math.max(0,likes-1); nLiked=null; }
    else if (liked==="dislike") { nl=likes+1; nd=Math.max(0,dislikes-1); nLiked="like"; }
    else { nl=likes+1; nLiked="like"; }
    setLikes(nl); setDislikes(nd); setLiked(nLiked); persist(nl,nd,nLiked);
  };
  const handleDislike = () => {
    let nl=likes, nd=dislikes, nLiked=liked;
    if (liked==="dislike") { nd=Math.max(0,dislikes-1); nLiked=null; }
    else if (liked==="like") { nd=dislikes+1; nl=Math.max(0,likes-1); nLiked="dislike"; }
    else { nd=dislikes+1; nLiked="dislike"; }
    setLikes(nl); setDislikes(nd); setLiked(nLiked); persist(nl,nd,nLiked);
  };
  const handleSave = () => {
    try {
      const list=JSON.parse(localStorage.getItem('wibu_list')||'[]');
      const exists=list.find(x=>x.id===id);
      if (exists) { const n=list.filter(x=>x.id!==id); localStorage.setItem('wibu_list', JSON.stringify(n)); localStorage.setItem(`wibu_saved_${id}`, JSON.stringify(false)); setSaved(false); }
      else { list.push({id, title, cover}); localStorage.setItem('wibu_list', JSON.stringify(list)); localStorage.setItem(`wibu_saved_${id}`, JSON.stringify(true)); setSaved(true); }
    } catch {}
  };
  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  return (
    <div className="mt-3">
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center bg-[#1a1a1a] border border-white/10 rounded-full overflow-hidden">
          <button onClick={handleLike} className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold transition ${liked==="like" ? "bg-white text-black" : "text-zinc-200 hover:bg-white/10"}`}>
            <ThumbsUp size={14} /> {likes.toLocaleString('id-ID')}
          </button>
          <span className="w-px h-4 bg-white/10" />
          <button onClick={handleDislike} className={`px-3 py-1.5 transition ${liked==="dislike" ? "bg-white text-black" : "text-zinc-300 hover:bg-white/10"}`}>
            <ThumbsDown size={14} />
          </button>
          {dislikes>0 && <span className="pr-3 text-[11px] text-zinc-400">{dislikes}</span>}
        </div>
        <button onClick={handleSave} className={`px-3.5 py-1.5 rounded-full text-xs font-bold border flex items-center gap-1.5 ${saved ? "bg-white text-black border-white" : "bg-[#1a1a1a] border-white/10 text-zinc-200 hover:bg-white/10"}`}>
          <Bookmark size={14} /> {saved ? "Tersimpan" : "Simpan"}
        </button>
        <button onClick={()=>setShowShare(v=>!v)} className="px-3.5 py-1.5 rounded-full bg-[#1a1a1a] border border-white/10 text-xs font-bold flex items-center gap-1.5 hover:bg-white/10">
          <Share2 size={14} /> Bagikan
        </button>
        <a href="#komentar" className="px-3.5 py-1.5 rounded-full bg-[#1a1a1a] border border-white/10 text-xs font-bold flex items-center gap-1.5 hover:bg-white/10">
          <MessageSquare size={14} /> Komentar
        </a>
      </div>
      {showShare && (
        <div className="mt-3 p-3 rounded-xl bg-[#0f0f0f] border border-white/10 flex flex-wrap gap-2 text-xs">
          <a href={`https://wa.me/?text=${encodeURIComponent(title+" "+shareUrl)}`} target="_blank" className="px-3 py-1.5 rounded-full bg-[#25D366] text-black font-bold">WhatsApp</a>
          <a href={`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(title)}`} target="_blank" className="px-3 py-1.5 rounded-full bg-[#229ED9] text-white font-bold">Telegram</a>
          <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(shareUrl)}`} target="_blank" className="px-3 py-1.5 rounded-full bg-white text-black font-bold">X</a>
          <button onClick={()=>{navigator.clipboard.writeText(shareUrl); alert("Link disalin!")}} className="px-3 py-1.5 rounded-full bg-zinc-800 text-white font-bold border border-white/10">Salin Link</button>
        </div>
      )}
    </div>
  )
}
