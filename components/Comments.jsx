"use client";
import { useEffect, useState } from "react";
import { Send, MessageSquare, Heart } from "lucide-react";

const AVATARS = ["https://i.pravatar.cc/100?img=11","https://i.pravatar.cc/100?img=33","https://i.pravatar.cc/100?img=15","https://i.pravatar.cc/100?img=8"];
const NAMES = ["Riko","Akira","Miya","Hana","Ken","Sora","Yuki","Kaito"];

export default function Comments({ videoId }) {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [sort, setSort] = useState("terbaru");

  useEffect(()=>{
    try {
      const key=`wibu_comments_${videoId}`;
      const stored=JSON.parse(localStorage.getItem(key)||"null");
      if (stored && Array.isArray(stored) && stored.length>0) setComments(stored);
      else {
        // seed 3 komentar demo biar tidak kosong
        const seed=[
          { id:"1", name:"Miya", avatar:AVATARS[2], text:"Animasi nya keren parah! Wibu.ID paling lengkap 🔥", time:"2 jam lalu", likes:12, liked:false },
          { id:"2", name:"Kaito", avatar:AVATARS[0], text:"Auto play lancar di HP, tidak nge-lag sama sekali. Mantap!", time:"5 jam lalu", likes:8, liked:false },
          { id:"3", name:"Sora", avatar:AVATARS[3], text:"Request dong tambahin One Piece terbaru 🙏", time:"1 hari lalu", likes:34, liked:false },
        ];
        setComments(seed);
      }
    } catch {}
  },[videoId]);

  const persist = (next) => {
    setComments(next);
    try { localStorage.setItem(`wibu_comments_${videoId}`, JSON.stringify(next)); } catch {}
  };

  const submit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    const c = {
      id: Date.now().toString(),
      name: NAMES[Math.floor(Math.random()*NAMES.length)],
      avatar: AVATARS[Math.floor(Math.random()*AVATARS.length)],
      text: text.trim().slice(0,300),
      time: "Baru saja",
      likes: 0,
      liked: false
    };
    const next=[c, ...comments];
    persist(next);
    setText("");
  };

  const toggleLike = (id) => {
    const next=comments.map(c=> c.id===id ? { ...c, liked:!c.liked, likes: c.liked ? c.likes-1 : c.likes+1 } : c);
    persist(next);
  };

  const sorted = [...comments].sort((a,b)=> sort==="terpopuler" ? b.likes-a.likes : 0);

  return (
    <div id="komentar" className="mt-6 bg-[#141414] rounded-xl border border-white/5 p-4 md:p-5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-black flex items-center gap-2"><MessageSquare size={16}/> Komentar • {comments.length}</h3>
        <select value={sort} onChange={e=>setSort(e.target.value)} className="bg-[#0f0f0f] border border-white/10 rounded-full px-3 py-1 text-xs">
          <option value="terbaru">Terbaru</option>
          <option value="terpopuler">Terpopuler</option>
        </select>
      </div>

      <form onSubmit={submit} className="mt-4 flex gap-2">
        <img src="https://i.pravatar.cc/100?img=15" className="w-8 h-8 rounded-full" alt="me" />
        <div className="flex-1 flex gap-2">
          <input value={text} onChange={e=>setText(e.target.value)} placeholder="Tulis komentar... (maks 300 karakter)" maxLength={300} className="flex-1 h-9 px-3 rounded-full bg-[#0f0f0f] border border-white/10 text-sm focus:outline-none focus:border-white/20" />
          <button type="submit" className="w-9 h-9 rounded-full bg-[#E50914] flex items-center justify-center text-white"><Send size={14}/></button>
        </div>
      </form>
      <p className="text-[11px] text-zinc-500 mt-2">Komentar tersimpan di perangkat kamu (local). Fitur full like & balas auto tanpa login.</p>

      <div className="mt-4 space-y-3 max-h-[420px] overflow-auto pr-1">
        {sorted.map(c=>(
          <div key={c.id} className="flex gap-3">
            <img src={c.avatar} className="w-7 h-7 rounded-full mt-0.5" alt={c.name} />
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2">
                <span className="text-xs font-bold text-white">{c.name}</span>
                <span className="text-[11px] text-zinc-500">{c.time}</span>
              </div>
              <p className="text-sm text-zinc-300 leading-relaxed break-words">{c.text}</p>
              <button onClick={()=>toggleLike(c.id)} className={`mt-1 flex items-center gap-1 text-[11px] ${c.liked ? "text-[#E50914]" : "text-zinc-500 hover:text-zinc-300"}`}>
                <Heart size={12} fill={c.liked ? "currentColor" : "none"} /> {c.likes} Suka
              </button>
            </div>
          </div>
        ))}
        {comments.length===0 && <div className="text-xs text-zinc-500 text-center py-6">Belum ada komentar — jadi yang pertama!</div>}
      </div>
    </div>
  )
}
