#!/usr/bin/env node
const vm = require('vm');
const ORIGIN = 'https://www.bilibili.tv';
const CREATOR = 'xemoz';
const UA = 'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Mobile Safari/537.36';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const abs = (u) => {
  if(!u) return 'https://via.placeholder.com/300x400?text=No+Cover';
  if(u.startsWith('//')) return 'https:' + u;
  if(u.startsWith('http')) return u;
  return u;
};

async function http(path, lang='id', retries=2){
  let url;
  if(path.startsWith('http')) url = path;
  else if(path.match(/^\/(id|en|th|vi|ms)\//)) url = ORIGIN + path;
  else url = `${ORIGIN}/${lang}${path.startsWith('/')?path:'/'+path}`;
  for(let i=0;i<=retries;i++){
    try{
      const res = await fetch(url, { headers:{ 'User-Agent': UA, 'Accept-Language': `${lang},en;q=0.5`, Accept:'text/html', Referer: ORIGIN+'/', Origin: ORIGIN }});
      if(res.status===429 || res.status>=500){
        if(i===retries) throw new Error(`HTTP ${res.status} untuk ${url}`);
        await sleep(800*(i+1)); continue;
      }
      if(!res.ok) throw new Error(`HTTP ${res.status} untuk ${url}`);
      return await res.text();
    }catch(e){
      if(i===retries) throw e;
      await sleep(600*(i+1));
    }
  }
}

function extractState(html){
  const marker='window.__initialState=';
  const start=html.indexOf(marker);
  if(start<0) throw new Error('__initialState tidak ditemukan (struktur berubah / diblokir)');
  const end=html.indexOf('</script>', start);
  let expr=html.slice(start+marker.length, end).trim().replace(/;$/,'');
  if(expr.endsWith(';')) expr=expr.slice(0,-1);
  return vm.runInNewContext('('+expr+')', Object.create(null), {timeout:3000});
}
const getState = async (path, lang='id') => extractState(await http(path, lang));

function expiresFromUrl(u){
  const m=String(u||'').match(/[?&]deadline=(\d+)/) || String(u||'').match(/exp=(\d+)/);
  return m? new Date(Number(m[1])*1000).toISOString():null;
}
function ugcCard(c){
  return {
    type:'ugc', id:c.aid, title:c.title || (c.highlights? (Array.isArray(c.highlights)?c.highlights.map(x=>x.str).join(''):c.highlights):''),
    cover:abs(c.cover), views:c.view, duration:c.duration,
    author: c.author ? { id:c.author.mid, name:c.author.nickname, avatar:abs(c.author.avatar), url:`${ORIGIN}/id/space/${c.author.mid}` } : null,
    url:`${ORIGIN}/id/video/${c.aid}`,
  };
}
function ogvCard(c){
  return {
    type:'ogv', id:c.season_id, title:c.title, cover:abs(c.cover), views:c.view, danmaku:c.dm||null,
    genres:c.style_list||c.styles||[], status:c.index_show||null,
    rank: c.rank_info && c.rank_info.rank ? c.rank_info.rank : null,
    badge: c.corner_mark ? c.corner_mark.text : null,
    url:`${ORIGIN}/id/play/${c.season_id}`,
  };
}
const highlightText=(h)=> Array.isArray(h)? h.map(x=>x.str).join(''):'';

function timelineOf(days=[]){
  return (days||[]).map(d=>({
    day:d.full_day_of_week || d.day_of_week,
    date:d.full_date_text || d.date_text,
    today:!!d.is_today,
    items: (d.cards||[]).map(c=>({...ogvCard(c), updatesAt:c.index_show})),
  }));
}
async function home(lang='id'){
  const s=(await getState('/', lang)).home;
  if(!s) throw new Error('state home kosong');
  // handle loading fallback - bstation sometimes lazy loads via client fetch, so check fallback arrays if empty
  // Try to fetch additional data via API fallback if empty
  let popular = (s.ugcTrending||[]).map(ugcCard);
  let animeTrending = (s.ogvTrending||[]).map(ogvCard);
  // If empty, try fallback booleans are not useful; we will try trending page as补充
  if(popular.length===0 && animeTrending.length===0){
    // try trending as补充 for anime
    try{
      const t=(await getState('/trending', lang)).trending;
      if(t && t.ogvCards) animeTrending = t.ogvCards.slice(0,8).map(ogvCard);
    }catch(e){}
  }
  if(popular.length===0){
    // try search fallback for popular
    try{
      const se=(await getState('/search-result?q=anime', lang)).searchAll;
      if(se && se.allList){
        for(const g of se.allList) if(g.type==='ugc') popular = (g.items||[]).slice(0,8).map(it=>ugcCard({...it, title: it.title || highlightText(it.highlights)}));
      }
    }catch(e){}
  }
  return { creator:CREATOR, lang, popular, animeTrending, timeline: timelineOf(s.timeline||[]) };
}
async function timeline(lang='id'){
  const s=(await getState('/', lang)).home;
  return { creator:CREATOR, lang, days: timelineOf(s && s.timeline) };
}
async function search(keyword, {type, lang='id'}={}){
  const s=(await getState('/search-result?q='+encodeURIComponent(keyword), lang)).searchAll;
  if(!s) throw new Error('state searchAll kosong');
  const anime=[]; const videos=[];
  for(const g of s.allList||[]){
    if(g.type==='ogv'){
      for(const it of g.items||[]) anime.push({ type:'ogv', id:it.season_id, title:it.title, cover:abs(it.cover), views:it.view, genres:(it.styles||[]).map(x=>x.title), synopsis:it.description||'', status:it.index_show||null, badge:it.corner_mark?it.corner_mark.text:null, url:`${ORIGIN}/${lang}/play/${it.season_id}` });
    } else if(g.type==='ugc'){
      for(const it of g.items||[]) videos.push({ ...ugcCard({...it, title: it.title || highlightText(it.highlights)}) });
    }
  }
  const all={anime, videos};
  return { creator:CREATOR, lang, keyword, hasMore: !!s.hasMore, pageSize: s.allParams && s.allParams.ps, anime: type==='ugc'?[]:anime, videos: type==='ogv'?[]:videos, totals:{anime: all.anime.length, videos: all.videos.length} };
}
async function trending(lang='id'){
  const s=(await getState('/trending', lang)).trending;
  if(!s) throw new Error('state trending kosong');
  return { creator:CREATOR, lang, tabs:(s.ogvTabs||[]).map(t=>({name:String(t.name).trim(), id:t.id, type:t.type})), ranking:(s.ogvCards||[]).map(ogvCard) };
}
function qualityName(options){
  const list = Array.isArray(options) ? options : [];
  const map=new Map(); for(const o of list) map.set(o.value, {label:o.label, tag:o.tag||null});
  return (id)=>(map.get(id)||{}).label||String(id);
}
async function video(input, lang='id'){
  const id=String(input).match(/video\/(\d+)/)?.[1] || String(input).replace(/\D/g,'');
  if(!id) throw new Error('ID video tidak valid: '+input);
  const st=await getState(`/video/${id}`, lang);
  const a=st.ugc && st.ugc.archive;
  if(!a) throw new Error('Video tidak ditemukan / tidak tersedia di region ini (coba ganti lang atau cek ID)');
  const p=st.player||{};
  const dash=(p.playUrl && p.playUrl.dash)||{};
  const nameOf=qualityName(p.playerQualityOptions);
  const videos=(dash.video||[]).map(v=>({ quality:nameOf(v.id), qualityId:v.id, codec:v.codecs, width:v.width, height:v.height, fps:v.frameRate||v.frame_rate||null, bandwidth:v.bandwidth, mime:v.mimeType||v.mime_type, url:v.baseUrl||v.base_url, backup:v.backupUrl||v.backup_url||[], initRange:v.SegmentBase && v.SegmentBase.Initialization, indexRange:v.SegmentBase && v.SegmentBase.indexRange, expiresAt: expiresFromUrl(v.baseUrl||v.base_url) }));
  const audios=(dash.audio||[]).map(x=>({ audioId:x.id, codec:x.codecs, bandwidth:x.bandwidth, mime:x.mimeType||x.mime_type, url:x.baseUrl||x.base_url, backup:x.backupUrl||x.backup_url||[], expiresAt: expiresFromUrl(x.baseUrl||x.base_url) }));
  return { creator:CREATOR, lang, id:a.aid, title:a.title, description:a.desc||'', cover:abs(a.cover), publishedAt:a.formatted_pub_date||null, durationSec:a.duration, uploader: a.uploader && {id:a.uploader.mid, name:a.uploader.name, avatar:abs(a.uploader.avatar)}, stats:a.stat, repostForbidden:!!a.repost_forbidden, url:`${ORIGIN}/${lang}/video/${a.aid}`, qualityOptions:(p.playerQualityOptions||[]).map(o=>({quality:o.label, tag:o.tag||null, available:!!o.url})), subtitles:p.subtitleList||[], streams:{dash:{video:videos, audio:audios}}, related:((st.playRecommend && st.playRecommend.recommends)||[]).map(ugcCard) };
}
async function play(seasonId, lang='id'){
  const id=String(seasonId).match(/play\/(\d+)/)?.[1] || String(seasonId).replace(/\D/g,'');
  const st=await getState(`/play/${id}`, lang);
  const o=st.ogv||{};
  return { creator:CREATOR, lang, seasonId:id, url:`${ORIGIN}/${lang}/play/${id}`, season:o.season||null, sections:o.sectionsList||[], series:o.series||[], note:'Detail season dari /play' };
}
async function raw(path, lang='id'){ return getState(path, lang); }

module.exports={ extractState, home, timeline, search, trending, video, play, raw, ugcCard, ogvCard, expiresFromUrl, abs };
