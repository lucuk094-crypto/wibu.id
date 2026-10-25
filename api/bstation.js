import vm from 'vm';
const ORIGIN = 'https://www.bilibili.tv';
const CREATOR = 'xemoz';
const UA = 'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Mobile Safari/537.36';
const sleep = (ms) => new Promise(r=>setTimeout(r,ms));
const abs = (u) => {
  if(!u) return 'https://via.placeholder.com/300x400?text=No+Cover';
  if(u.startsWith('//')) return 'https:'+u;
  return u;
};
async function http(path, lang='id', retries=2){
  let url;
  if(path.startsWith('http')) url=path;
  else if(path.match(/^\/(id|en|th|vi|ms)\//)) url=ORIGIN+path;
  else url=`${ORIGIN}/${lang}${path.startsWith('/')?path:'/'+path}`;
  for(let i=0;i<=retries;i++){
    try{
      const _fetch = globalThis.fetch;
      const res = await _fetch(url, { headers:{ 'User-Agent': UA, 'Accept-Language': `${lang},en;q=0.5`, Accept:'text/html', Referer: ORIGIN+'/', Origin: ORIGIN }});
      if(res.status===429 || res.status>=500){ if(i===retries) throw new Error(`HTTP ${res.status}`); await sleep(800*(i+1)); continue; }
      if(!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.text();
    }catch(e){ if(i===retries) throw e; await sleep(600*(i+1)); }
  }
}
function extractState(html){
  const m='window.__initialState='; const s=html.indexOf(m); if(s<0) throw new Error('__initialState tidak ditemukan'); const e=html.indexOf('</script>', s); let expr=html.slice(s+m.length, e).trim().replace(/;$/,''); if(expr.endsWith(';')) expr=expr.slice(0,-1); return vm.runInNewContext('('+expr+')', Object.create(null), {timeout:3000});
}
const getState = async (path, lang='id') => extractState(await http(path, lang));
function ugcCard(c){ return { type:'ugc', id:c.aid, title:c.title|| (Array.isArray(c.highlights)?c.highlights.map(x=>x.str).join(''):''), cover:abs(c.cover), views:c.view, duration:c.duration, author: c.author?{id:c.author.mid, name:c.author.nickname, avatar:abs(c.author.avatar)}:null, url:`${ORIGIN}/id/video/${c.aid}` }; }
function ogvCard(c){ return { type:'ogv', id:c.season_id, title:c.title, cover:abs(c.cover), views:c.view, status:c.index_show||null, badge: c.corner_mark?c.corner_mark.text:null, url:`${ORIGIN}/id/play/${c.season_id}` }; }
export default async function handler(req, res){
  res.setHeader('Access-Control-Allow-Origin','*');
  const { cmd, q, keyword, id, aid, lang='id' } = req.query || {};
  const query=q||keyword; const vid=id||aid;
  try{
    if(cmd==='home'){
      const s=(await getState('/', lang)).home;
      let popular=(s.ugcTrending||[]).map(ugcCard);
      let animeTrending=(s.ogvTrending||[]).map(ogvCard);
      if(popular.length===0 && animeTrending.length===0){ try{ const t=(await getState('/trending', lang)).trending; if(t&&t.ogvCards) animeTrending=t.ogvCards.slice(0,8).map(ogvCard); }catch(e){} }
      if(popular.length===0){ try{ const se=(await getState('/search-result?q=anime', lang)).searchAll; if(se&&se.allList) for(const g of se.allList) if(g.type==='ugc') popular=(g.items||[]).slice(0,8).map(it=>ugcCard({...it, title: it.title || (Array.isArray(it.highlights)?it.highlights.map(x=>x.str).join(''):'' ) })); }catch(e){} }
      return res.status(200).json({ creator:CREATOR, lang, popular, animeTrending, timeline: (s.timeline||[]).map(d=>({ day:d.full_day_of_week||d.day_of_week, date:d.full_date_text||d.date_text, today:!!d.is_today, items:(d.cards||[]).map(c=>({...ogvCard(c)})) })) });
    }
    if(cmd==='search'){
      if(!query) return res.status(400).json({error:'q required'});
      const s=(await getState('/search-result?q='+encodeURIComponent(query), lang)).searchAll;
      const anime=[]; const videos=[];
      for(const g of s.allList||[]){ if(g.type==='ogv'){ for(const it of g.items||[]) anime.push({ type:'ogv', id:it.season_id, title:it.title, cover:abs(it.cover), views:it.view }); } else if(g.type==='ugc'){ for(const it of g.items||[]) videos.push(ugcCard({...it, title: it.title || (Array.isArray(it.highlights)?it.highlights.map(x=>x.str).join(''):'' ) })); } }
      return res.status(200).json({ creator:CREATOR, lang, keyword:query, anime, videos, totals:{anime:anime.length, videos:videos.length}});
    }
    if(cmd==='video'){
      const iid=String(vid||query).match(/video\/(\d+)/)?.[1] || String(vid||query).replace(/\D/g,'');
      const st=await getState(`/video/${iid}`, lang);
      const a=st.ugc && st.ugc.archive;
      if(!a) throw new Error('Video tidak ditemukan');
      return res.status(200).json({ creator:CREATOR, lang, id:a.aid, title:a.title, description:a.desc||'', cover:abs(a.cover), publishedAt:a.formatted_pub_date||null, durationSec:a.duration, uploader: a.uploader && {id:a.uploader.mid, name:a.uploader.name, avatar:abs(a.uploader.avatar)}, stats:a.stat, url:`${ORIGIN}/${lang}/video/${a.aid}`, related:((st.playRecommend && st.playRecommend.recommends)||[]).map(ugcCard) });
    }
    return res.status(400).json({error:'unknown cmd'});
  }catch(e){
    console.error(e);
    return res.status(500).json({error:e.message, stack:e.stack?.slice(0,800)});
  }
}
