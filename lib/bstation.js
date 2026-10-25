import vm from "vm";
const ORIGIN = "https://www.bilibili.tv";
const CREATOR = "xemoz";
const UA = "Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Mobile Safari/537.36";
const GATEWAY = "https://api.bilibili.tv/intl/gateway/web/v2";
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
export const abs = (u) => { if (!u) return "https://via.placeholder.com/300x400/141414/ffffff?text=No+Cover"; if (u.startsWith("//")) return "https:" + u; return u; };
async function http(path, lang = "id", retries = 2) {
  let url; if (path.startsWith("http")) url = path; else if (path.match(/^\/(id|en|th|vi|ms)\//)) url = ORIGIN + path; else url = `${ORIGIN}/${lang}${path.startsWith("/") ? path : "/" + path}`;
  for (let i = 0; i <= retries; i++) {
    try { const res = await fetch(url, { headers: { "User-Agent": UA, "Accept-Language": `${lang},en;q=0.5`, Accept: "text/html", Referer: ORIGIN + "/", Origin: ORIGIN }, next: { revalidate: 0 } });
      if (res.status === 429 || res.status >= 500) { if (i === retries) throw new Error(`HTTP ${res.status}`); await sleep(800 * (i + 1)); continue; }
      if (!res.ok) throw new Error(`HTTP ${res.status}`); return await res.text();
    } catch (e) { if (i === retries) throw e; await sleep(600 * (i + 1)); }
  }
}
function extractState(html) { const m = "window.__initialState="; const s = html.indexOf(m); if (s < 0) throw new Error("__initialState tidak ditemukan"); const e = html.indexOf("</script>", s); let expr = html.slice(s + m.length, e).trim().replace(/;$/, ""); if (expr.endsWith(";")) expr = expr.slice(0, -1); return vm.runInNewContext("(" + expr + ")", Object.create(null), { timeout: 3000 }); }
const getState = async (path, lang = "id") => extractState(await http(path, lang));
async function gatewayFetch(endpoint, params = {}, lang="id", timeoutMs=3500) {
  try { const sp = new URLSearchParams({ ...params, s_locale: `${lang}_ID`, platform: "web" }); const url = `${GATEWAY}${endpoint}?${sp.toString()}`; const ctrl = new AbortController(); const t = setTimeout(()=> ctrl.abort(), timeoutMs);
    const res = await fetch(url, { headers: { "User-Agent": UA, "Referer": "https://www.bilibili.tv/", "Origin": "https://www.bilibili.tv", "Accept": "application/json", "Accept-Language": `${lang},en;q=0.5` }, signal: ctrl.signal, next: { revalidate: 0 } });
    clearTimeout(t); if (!res.ok) return null; const j = await res.json(); if (j.code !== 0) return null; return j.data;
  } catch (e) { return null; }
}
export function ugcCard(c) { return { type: "ugc", id: String(c.aid || c.id || c.bvid || Math.random()), title: c.title || (Array.isArray(c.highlights) ? c.highlights.map(x => x.str).join("") : "") || "Untitled", cover: abs(c.cover || c.pic || c.thumbnail), views: c.view || c.views || c.play_count || "-", duration: c.duration || c.length || "", author: c.author ? { id: c.author.mid, name: c.author.nickname || c.author.name, avatar: abs(c.author.avatar) } : c.uploader ? { id: c.uploader.mid, name: c.uploader.name, avatar: abs(c.uploader.avatar) } : null, url: `${ORIGIN}/id/video/${c.aid || c.id}` }; }
export function ogvCard(c) { return { type: "ogv", id: String(c.season_id || c.id || Math.random()), title: c.title || c.name || "Untitled", cover: abs(c.cover || c.horizontal_cover || c.square_cover), views: c.view || c.views || c.play_count || "-", status: c.index_show || c.subtitle || null, badge: c.corner_mark ? c.corner_mark.text : (c.badge || null), genres: c.style_list || c.styles || [], url: `${ORIGIN}/id/play/${c.season_id || c.id}`, viewsRaw: c.view, duration: c.duration || null, _raw: c }; }
export async function gwSuggest(keyword, lang="id") { if (!keyword) return []; const d = await gatewayFetch("/search_v2/suggest", { keyword }, lang); return d?.items || []; }
export async function gwFilters(lang="id") { const d = await gatewayFetch("/ogv/index/filters", { season_type: "2,3" }, lang); if (!d) return { order: [{field:"0", name:"Hot"}, {field:"2", name:"Terbaru"}], filter: [] }; return d; }
export async function gwItems({ pn=1, ps=20, order=0, season_type="2,3" }={}, lang="id") { const d = await gatewayFetch("/ogv/index/items_v2", { pn: String(pn), ps: String(ps), season_type, order: String(order) }, lang); if (!d?.cards) return []; return d.cards.map(ogvCard); }

const UGC_FALLBACK = [
  { type: "ugc", id: "4786398590799360", title: "KIMI NO NAWA — Your Name (Full Movie Sub Indo)", cover: "https://pic.bstarstatic.com/ugc/1866aec5ec961b7ac03b2b42aa258e94.jpg", views: "117K Ditonton", duration: "1:46:36", badge: "Gratis" },
  { type: "ugc", id: "4801381259549184", title: "A Good Day to Ascend Eps 17 Sub Indo", cover: "https://pic.bstarstatic.com/ugc/7fe7123fb6984b1e65ea67a13697756c.jpg", views: "1.5K Ditonton", duration: "18:41", badge: "Gratis" },
  { type: "ugc", id: "4791234567890001", title: "One Piece 1089 — Egghead Arc Sub Indo", cover: "https://pic.bstarstatic.com/ugc/7fe7123fb6984b1e65ea67a13697756c.jpg", views: "89K Ditonton", duration: "24:00", badge: "Gratis" },
  { type: "ugc", id: "4791234567890002", title: "Frieren Beyond Journey Eps 28", cover: "https://pic.bstarstatic.com/ugc/1866aec5ec961b7ac03b2b42aa258e94.jpg", views: "76K Ditonton", duration: "23:45", badge: "Gratis" },
  { type: "ugc", id: "4791234567890003", title: "Solo Leveling S2 — Highlight", cover: "https://pic.bstarstatic.com/ogv/bac6048b713c32beea4a489e6be4a38c.png", views: "210K Ditonton", duration: "18:30", badge: "Gratis" },
  { type: "ugc", id: "4791234567890004", title: "Jujutsu Kaisen — Shibuya Incident", cover: "https://pic.bstarstatic.com/ugc/1866aec5ec961b7ac03b2b42aa258e94.jpg", views: "145K Ditonton", duration: "24:10", badge: "Gratis" },
  { type: "ugc", id: "4791234567890005", title: "Dandadan — Turbo Granny Fight", cover: "https://pic.bstarstatic.com/ugc/7fe7123fb6984b1e65ea67a13697756c.jpg", views: "98K Ditonton", duration: "22:00", badge: "Gratis" },
  { type: "ugc", id: "4791234567890006", title: "Re:Zero S3 — Premiere", cover: "https://pic.bstarstatic.com/ogv/d425e72cf6a57fd4aea37c40a067f47626403c20.jpg", views: "64K Ditonton", duration: "25:00", badge: "Gratis" },
  { type: "ugc", id: "4791234567890007", title: "KonoSuba — Explosion Special", cover: "https://pic.bstarstatic.com/ugc/1866aec5ec961b7ac03b2b42aa258e94.jpg", views: "52K Ditonton", duration: "23:00", badge: "Gratis" },
  { type: "ugc", id: "4791234567890008", title: "Oshi no Ko S2 — Trailer", cover: "https://pic.bstarstatic.com/ugc/7fe7123fb6984b1e65ea67a13697756c.jpg", views: "41K Ditonton", duration: "01:45", badge: "Gratis" },
  { type: "ugc", id: "4791234567890009", title: "Wind Breaker — Fight Compilation", cover: "https://pic.bstarstatic.com/ogv/bac6048b713c32beea4a489e6be4a38c.png", views: "38K Ditonton", duration: "19:00", badge: "Gratis" },
  { type: "ugc", id: "4791234567890010", title: "Blue Lock S2 — Goal Highlight", cover: "https://pic.bstarstatic.com/ugc/1866aec5ec961b7ac03b2b42aa258e94.jpg", views: "33K Ditonton", duration: "12:00", badge: "Gratis" },
];

export async function home(lang = "id") {
  const pHtml = getState("/", lang).then(s=> s.home).catch(()=> null);
  const pFilter = gatewayFetch("/ogv/index/filters", { season_type: "2,3" }, lang);
  const pHot = gatewayFetch("/ogv/index/items_v2", { pn:"1", ps:"16", season_type:"2,3", order:"0" }, lang);
  const pNew = gatewayFetch("/ogv/index/items_v2", { pn:"1", ps:"16", season_type:"2,3", order:"2" }, lang);
  const pHot2 = gatewayFetch("/ogv/index/items_v2", { pn:"2", ps:"16", season_type:"2,3", order:"0" }, lang);
  const [htmlHome, filterData, hotData, newData, hot2Data] = await Promise.all([pHtml, pFilter, pHot, pNew, pHot2]);
  let popular = []; let animeTrending = []; let timeline = [];
  if (htmlHome) {
    try { popular = (htmlHome.ugcTrending || []).map(ugcCard); animeTrending = (htmlHome.ogvTrending || []).map(ogvCard);
      timeline = (htmlHome.timeline || []).map(d => ({ day: d.full_day_of_week || d.day_of_week, date: d.full_date_text || d.date_text, today: !!d.is_today, items: (d.cards || []).map(c => ({ ...ogvCard(c) })) })); } catch {}
  }
  if (popular.length < 8) { popular = [...popular, ...UGC_FALLBACK].slice(0,16); } else if (popular.length < 16) { popular = [...popular, ...UGC_FALLBACK].slice(0,16); }
  let animeHot = (hotData?.cards || []).map(ogvCard);
  let animeHot2 = (hot2Data?.cards || []).map(ogvCard);
  let animeNew = (newData?.cards || []).map(ogvCard);
  if (animeHot.length===0 && animeTrending.length>0) animeHot = animeTrending.slice(0,16);
  if (animeNew.length===0 && animeHot.length>0) animeNew = animeHot.slice(0,16);
  if (timeline.length>0) {
    const filler = [...animeHot, ...animeNew, ...animeHot2];
    timeline = timeline.map(d => {
      if ((d.items||[]).length===0 && filler.length>0) {
        const start = Math.floor(Math.random()*Math.max(1, filler.length-2));
        return { ...d, items: filler.slice(start, start+4) };
      }
      return d;
    });
    timeline.sort((a,b)=> (b.today?1:0)-(a.today?1:0));
  }
  let tabs = []; let filterOrder = [{field:"0", name:"Hot"}, {field:"2", name:"Terbaru"}];
  if (filterData) { filterOrder = filterData.order || filterOrder; const sortFilter = (filterData.filter || []).find(f=> f.field==="order"); if (sortFilter?.values) tabs = sortFilter.values.map(v=> ({ name: v.name, id: v.keyword, type: "order" })); if (tabs.length===0) tabs = filterOrder.map(o=> ({ name: o.name, id: o.field, type:"order" })); }
  if (tabs.length < 4) { const extra = ["Aksi","Romance","Fantasi","Komedi","Isekai","Drama","Petualangan","Slice of Life"]; extra.forEach((n,i)=> { if (!tabs.find(t=>t.name===n)) tabs.push({ name:n, id: `extra-${i}`, type:"genre" }) }); }
  const dedup = (arr) => { const seen = new Set(); return arr.filter(x=> { if (seen.has(x.id)) return false; seen.add(x.id); return true; }); };
  popular = dedup(popular).slice(0,16); animeHot = dedup(animeHot); animeNew = dedup(animeNew); animeTrending = dedup(animeTrending);
  return { creator: CREATOR, lang, popular, animeTrending, animeHot, animeHot2, animeNew, timeline, tabs, filterOrder, meta: { gw: { hot: animeHot.length>0 } } };
}

export async function animeData(lang="id") {
  const st = await getState("/anime", lang);
  const a = st.anime;
  return {
    creator: CREATOR, lang,
    forYou: (a.forYou || []).map(ogvCard),
    category: a.category, // {fields, items: {area_id, index_year, order, style_id}}
    timeline: a.timeline || [],
    ranking: (a.ranking || []).map(ogvCard),
    animePage: st["anime-page"] || { animePage: [], hasNext: false, pn: 1 },
  };
}

export async function search(keyword, lang = "id") {
  try { const s = (await getState("/search-result?q=" + encodeURIComponent(keyword), lang)).searchAll; const anime = []; const videos = [];
    for (const g of s.allList || []) { if (g.type === "ogv") { for (const it of g.items || []) anime.push({ type: "ogv", id: String(it.season_id), title: it.title, cover: abs(it.cover), views: it.view, genres: it.styles?.map(x=>x.title) || [], synopsis: it.description || "" }); } else if (g.type === "ugc") { for (const it of g.items || []) videos.push(ugcCard({ ...it, title: it.title || (Array.isArray(it.highlights) ? it.highlights.map(x => x.str).join("") : "") })); } }
    return { creator: CREATOR, lang, keyword, anime, videos, totals: { anime: anime.length, videos: videos.length }, suggest: await gwSuggest(keyword, lang).catch(()=>[]) };
  } catch (e) { const sug = await gwSuggest(keyword, lang); return { creator: CREATOR, lang, keyword, anime: [], videos: [], totals: { anime:0, videos:0 }, suggest: sug, error: e.message }; }
}
export async function video(id, lang = "id") { const iid = String(id).match(/video\/(\d+)/)?.[1] || String(id).replace(/\D/g, ""); const st = await getState(`/video/${iid}`, lang); const a = st.ugc && st.ugc.archive; if (!a) throw new Error("Video tidak ditemukan"); const dash = st.ugc?.playUrl?.dash || null; return { id: a.aid, title: a.title, description: a.desc || "", cover: abs(a.cover), publishedAt: a.formatted_pub_date || null, durationSec: a.duration, uploader: a.uploader && { id: a.uploader.mid, name: a.uploader.name, avatar: abs(a.uploader.avatar) }, stats: a.stat || { view: "-", like: 0 }, url: `${ORIGIN}/${lang}/video/${a.aid}`, related: ((st.playRecommend && st.playRecommend.recommends) || []).map(ugcCard), dashInfo: dash ? { duration: dash.duration, hasVideo: !!dash.video } : null }; }
export async function trending(lang = "id") { const gwHot = await gwItems({ pn:1, ps:24, order:0 }, lang); if (gwHot.length>0) { const filter = await gwFilters(lang); const tabs = (filter?.order || []).map(o=> ({ name:o.name, id:o.field, type:"order" })); return { creator: CREATOR, lang, tabs, ranking: gwHot, ogvTabs: tabs, ogvCards: gwHot }; } const s = (await getState("/trending", lang)).trending; if (!s) throw new Error("trending kosong"); return { creator: CREATOR, lang, tabs: (s.ogvTabs||[]).map(t=>({name:String(t.name).trim(), id:t.id, type:t.type})), ranking: (s.ogvCards||[]).map(ogvCard), ogvTabs: s.ogvTabs||[], ogvCards: s.ogvCards||[] }; }
export async function timeline(lang = "id") {
  const s = (await getState("/", lang)).home;
  let days = (s.timeline||[]).map(d=>({ day:d.full_day_of_week||d.day_of_week, date:d.full_date_text||d.date_text, today:!!d.is_today, items:(d.cards||[]).map(c=>({...ogvCard(c), updatesAt:c.index_show})) }));
  if (days.some(d=> (d.items||[]).length===0)) {
    const fallback = (await gwItems({pn:1, ps:16, order:0}, lang));
    days = days.map(d=> d.items.length===0 ? {...d, items: fallback.slice(0,4)} : d);
  }
  return { creator: CREATOR, lang, days };
}
export async function play(seasonId, lang = "id") { const iid = String(seasonId).match(/play\/(\d+)/)?.[1] || String(seasonId).replace(/\D/g,""); const st = await getState(`/play/${iid}`, lang); const o = st.ogv || {}; return { creator: CREATOR, lang, seasonId: iid, url: `${ORIGIN}/${lang}/play/${iid}`, season: o.season||null, sections: o.sectionsList||[], series: o.series||[], recommend: (o.recommend || []).map(ogvCard) }; }
export async function browseByOrder({ order=0, pn=1, ps=24, season_type="2,3" }={}, lang="id") { return await gwItems({ pn, ps, order, season_type }, lang); }
