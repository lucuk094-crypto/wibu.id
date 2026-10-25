const API = '/api/bstation';
let LIVE = { popular: [], animeTrending: [], ranking: [], timeline: [] };

const FALLBACK_COVER = 'https://via.placeholder.com/300x400/141414/ffffff?text=No+Cover';

function safeCover(u){
  if(!u) return FALLBACK_COVER;
  if(u.startsWith('//')) return 'https:'+u;
  return u;
}

function cardHTML(a){
  const cover = safeCover(a.cover);
  const title = (a.title || 'Tanpa Judul').replace(/"/g,'');
  const views = a.views || a.view || '';
  const badge = a.badge ? `<span class="absolute top-1.5 left-1.5 bg-black/70 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">${a.badge}</span>` : `<span class="absolute top-1.5 left-1.5 bg-black/70 text-white text-[9px] font-bold px-1 py-0.5 rounded">N</span>`;
  const duration = a.duration ? `<span class="absolute bottom-1 right-1 bg-black/80 text-white text-[10px] font-semibold px-1 py-0.5 rounded">${a.duration}</span>` : '';
  const isUGC = a.type==='ugc';
  return `
  <a href="player.html?id=${a.id}&type=${a.type||'ogv'}" class="card-hover flex-shrink-0 w-[145px] md:w-[168px] rounded-[6px] overflow-hidden bg-[#141414] block border border-white/5">
    <div class="aspect-[2/3] relative overflow-hidden bg-zinc-900">
      <img src="${cover}" alt="${title}" loading="lazy" onerror="this.src='${FALLBACK_COVER}'" class="w-full h-full object-cover">
      ${badge}
      ${duration}
      ${isUGC ? `<span class="absolute bottom-1 left-1 bg-[#E50914] text-white text-[8px] font-black px-1 py-0.5 rounded">UGC</span>` : ''}
    </div>
    <div class="px-2 py-2">
      <div class="text-[11px] font-semibold leading-tight line-clamp-2 min-h-[30px]">${a.title || 'Tanpa Judul'}</div>
      <div class="text-[10px] text-zinc-500 mt-1 truncate">${views} ${a.genres ? '• '+(Array.isArray(a.genres)?a.genres.slice(0,2).join(', '):a.genres) : ''}</div>
      ${a.status ? `<div class="text-[10px] text-emerald-400 mt-0.5 truncate">${a.status}</div>`:''}
    </div>
  </a>`;
}

async function fetchAPI(params){
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${API}?${qs}`);
  if(!res.ok){
    const err = await res.json().catch(()=>({error:res.statusText}));
    throw new Error(err.error || res.statusText);
  }
  return res.json();
}

async function loadHome(){
  const newGrid = document.getElementById('newGrid');
  const trendingGrid = document.getElementById('trendingGrid');
  if(newGrid) newGrid.innerHTML = `<div class="text-xs text-zinc-500 py-8 flex items-center gap-2"><span class="w-3 h-3 border-2 border-zinc-600 border-t-white rounded-full animate-spin"></span> Memuat data Bstation...</div>`;

  // 1. Cek SSR data dari server (SOLUSI SANDBOX TOKEN)
  if(window.__INITIAL_DATA__ && window.__INITIAL_DATA__.home){
    try{
      const homeData = window.__INITIAL_DATA__.home;
      const trendingData = window.__INITIAL_DATA__.trending || {};
      LIVE.popular = homeData.popular || [];
      LIVE.animeTrending = homeData.animeTrending || [];
      LIVE.timeline = homeData.timeline || [];
      LIVE.ranking = trendingData.ranking || [];
      console.log('SSR data loaded', LIVE);
      renderHome();
      // still refresh in background via API if token allowed, but don't block
      refreshInBackground();
      return;
    }catch(e){ console.error('SSR render fail', e); }
  }

  // 2. Fallback: fetch API (untuk Vercel / localhost tanpa token issue)
  try{
    const [homeData, trendingData] = await Promise.all([
      fetchAPI({cmd:'home', lang:'id'}).catch(e=>{console.warn('home fail',e); return null}),
      fetchAPI({cmd:'trending', lang:'id'}).catch(e=>{console.warn('trending fail',e); return null})
    ]);
    if(homeData){
      LIVE.popular = homeData.popular || [];
      LIVE.animeTrending = homeData.animeTrending || [];
      LIVE.timeline = homeData.timeline || [];
    }
    if(trendingData) LIVE.ranking = trendingData.ranking || [];
    if(LIVE.popular.length===0 && LIVE.animeTrending.length===0 && LIVE.ranking.length===0){
      const searchFallback = await fetchAPI({cmd:'search', q:'anime', lang:'id'}).catch(()=>null);
      if(searchFallback){
        LIVE.popular = searchFallback.videos || [];
        LIVE.animeTrending = searchFallback.anime || [];
      }
    }
    renderHome();
  }catch(e){
    console.error('loadHome error', e);
    if(newGrid) newGrid.innerHTML = `<div class="text-xs text-red-400 p-3 bg-red-500/10 border border-red-500/20 rounded">Gagal memuat data: ${e.message}<br><span class="text-zinc-500">Gunakan fallback data.js</span></div>` + (typeof animeData!=='undefined' ? animeData.slice(0,6).map(cardHTML).join('') : '');
    if(trendingGrid && typeof animeData!=='undefined') trendingGrid.innerHTML = animeData.slice(0,6).map(cardHTML).join('');
    if(window.lucide) lucide.createIcons();
  }
}

function renderHome(){
  const newGrid = document.getElementById('newGrid');
  const trendingGrid = document.getElementById('trendingGrid');

  const heroSource = LIVE.animeTrending[0] || LIVE.popular[0] || LIVE.ranking[0];
  if(heroSource){
    const heroImg = document.getElementById('heroImg');
    const heroTitle = document.getElementById('heroTitle');
    const heroSyn = document.getElementById('heroSynopsis');
    const heroMeta = document.getElementById('heroMeta');
    const heroPlay = document.getElementById('heroPlay');
    if(heroImg) heroImg.src = safeCover(heroSource.cover);
    if(heroTitle){
      const t = heroSource.title || 'Wibu.ID';
      const words = t.split(' ');
      if(words.length>1){
        const first = words.slice(0, Math.ceil(words.length/2)).join(' ');
        const second = words.slice(Math.ceil(words.length/2)).join(' ');
        heroTitle.innerHTML = `${first} <span class="red-box">${second}</span>`;
      } else heroTitle.textContent = t;
    }
    if(heroSyn) heroSyn.textContent = heroSource.status || heroSource.views || 'Tonton sekarang di Wibu.ID via embed resmi Bilibili.tv';
    if(heroMeta) heroMeta.textContent = `${heroSource.badge || 'Gratis'} • ${heroSource.views || ''} • Live dari Bstation`;
    if(heroPlay) heroPlay.href = `player.html?id=${heroSource.id}&type=${heroSource.type||'ogv'}`;
  }

  if(newGrid){
    const newData = LIVE.popular.length ? LIVE.popular : LIVE.animeTrending;
    if(newData.length) newGrid.innerHTML = newData.map(cardHTML).join('');
    else newGrid.innerHTML = `<div class="text-xs text-zinc-500">Tidak ada data. Coba refresh.</div>`;
  }
  if(trendingGrid){
    const trendData = LIVE.ranking.length ? LIVE.ranking : LIVE.animeTrending;
    if(trendData.length) trendingGrid.innerHTML = trendData.map(cardHTML).join('');
    else if(LIVE.popular.length) trendingGrid.innerHTML = LIVE.popular.slice(0,8).map(cardHTML).join('');
    else trendingGrid.innerHTML = `<div class="text-xs text-zinc-500">Tidak ada data trending.</div>`;
  }
  const info = document.getElementById('liveInfo');
  if(info) info.textContent = `${LIVE.popular.length} video • ${LIVE.animeTrending.length} anime • ${LIVE.ranking.length} ranking • Live dari Bstation (SSR)`;
  if(window.lucide) lucide.createIcons();
}

async function refreshInBackground(){
  // coba refresh via API tanpa blokir UI - kalau sandbox token error, diabaikan saja karena SSR sudah tampil
  try{
    const fresh = await fetchAPI({cmd:'home', lang:'id'});
    if(fresh && fresh.popular.length){
      LIVE.popular = fresh.popular;
      LIVE.animeTrending = fresh.animeTrending;
      renderHome();
      console.log('Background refresh success');
    }
  }catch(e){ console.log('Background refresh skip (token sandbox)', e.message); }
}

function setupSearch(){
  const desktop = document.getElementById('searchInput');
  const mobile = document.getElementById('searchInputMobile');
  async function doSearch(q){
    if(!q || q.length<2){ loadHome(); return; }
    const newGrid = document.getElementById('newGrid');
    if(newGrid) newGrid.innerHTML = `<div class="text-xs text-zinc-500 py-4">Mencari "${q}"...</div>`;
    try{
      const res = await fetchAPI({cmd:'search', q, lang:'id'});
      const combined = [...(res.anime||[]), ...(res.videos||[])];
      const trendingGrid = document.getElementById('trendingGrid');
      if(newGrid){
        if(combined.length) newGrid.innerHTML = combined.map(cardHTML).join('');
        else newGrid.innerHTML = `<div class="text-xs text-zinc-500">Tidak ada hasil untuk "${q}"</div>`;
      }
      if(trendingGrid) trendingGrid.innerHTML = `<div class="text-xs text-zinc-500">Hasil: ${res.totals.anime} anime, ${res.totals.videos} video • Mode preview sandbox butuh reload halaman untuk search (token)</div>`;
      if(window.lucide) lucide.createIcons();
    }catch(e){
      if(newGrid) newGrid.innerHTML = `<div class="text-xs text-amber-300 p-3 bg-amber-500/10 border border-amber-500/20 rounded">Search di preview sandbox butuh token.<br>Coba buka langsung: <a href="/api/bstation?cmd=search&q=${encodeURIComponent(q)}" target="_blank" class="underline">/api/bstation?cmd=search&q=${q}</a><br>Error: ${e.message}</div>`;
    }
  }
  let t;
  [desktop, mobile].forEach(inp=>{
    if(!inp) return;
    inp.addEventListener('input', (e)=>{
      clearTimeout(t);
      t=setTimeout(()=> doSearch(e.target.value), 600);
    });
  });
}

async function initPlayer(){
  const params = new URLSearchParams(location.search);
  const id = params.get('id');
  const type = params.get('type') || 'ugc';
  if(!id) return;
  const frame = document.getElementById('embedFrame');
  const crumb = document.getElementById('crumbTitle');
  const openLink = document.getElementById('openBstation');
  const titleEl = document.getElementById('playerTitle');
  const metaEl = document.getElementById('playerMeta');
  const synEl = document.getElementById('playerSynopsis');

  if(frame) frame.src = `https://www.bilibili.tv/id/video/${id}`;
  if(openLink) openLink.href = `https://www.bilibili.tv/id/video/${id}`;

  // 1. SSR data dulu
  if(window.__INITIAL_DATA__ && window.__INITIAL_DATA__.video){
    const data = window.__INITIAL_DATA__.video;
    console.log('SSR video data', data);
    renderVideoDetail(data);
    return;
  }
  // 2. Fetch API fallback
  try{
    let data = null;
    if(type==='ugc'){
      data = await fetchAPI({cmd:'video', id, lang:'id'}).catch(()=>null);
      if(!data) data = await fetchAPI({cmd:'play', id, lang:'id'}).catch(()=>null);
    } else {
      data = await fetchAPI({cmd:'play', id, lang:'id'}).catch(()=>null);
      if(!data) data = await fetchAPI({cmd:'video', id, lang:'id'}).catch(()=>null);
    }
    if(data) renderVideoDetail(data);
  }catch(e){ console.error('player fetch fail', e); }
}

function renderVideoDetail(data){
  const titleEl = document.getElementById('playerTitle');
  const metaEl = document.getElementById('playerMeta');
  const synEl = document.getElementById('playerSynopsis');
  const crumb = document.getElementById('crumbTitle');
  const frame = document.getElementById('embedFrame');
  const openLink = document.getElementById('openBstation');
  const coverEl = document.getElementById('playerCover');

  // UGC video
  if(data.title && data.id){
    if(titleEl) titleEl.textContent = data.title;
    if(metaEl) metaEl.textContent = `${data.durationSec ? Math.floor(data.durationSec/60)+':'+String(data.durationSec%60).padStart(2,'0') : ''} • ${data.views || data.stats?.view || ''} • ${data.publishedAt || ''}`;
    if(synEl) synEl.textContent = data.description || data.desc || 'Tidak ada deskripsi';
    if(crumb) crumb.textContent = data.title;
    if(coverEl) coverEl.src = safeCover(data.cover);
    const statsBox = document.getElementById('statsBox');
    if(statsBox){
      statsBox.innerHTML = `
        <div class="grid grid-cols-3 gap-2 text-center">
          <div class="bg-[#0f0f0f] p-2 rounded"><div class="text-xs font-black">${data.stats?.view || '-'}</div><div class="text-[10px] text-zinc-500">Views</div></div>
          <div class="bg-[#0f0f0f] p-2 rounded"><div class="text-xs font-black">${data.stats?.like || data.stats?.like_count || '-'}</div><div class="text-[10px] text-zinc-500">Likes</div></div>
          <div class="bg-[#0f0f0f] p-2 rounded"><div class="text-xs font-black">${data.stats?.coin || '-'}</div><div class="text-[10px] text-zinc-500">Coins</div></div>
        </div>
        <div class="mt-2 text-[11px] text-zinc-400">Durasi: ${data.durationSec||'-'} detik • ${data.publishedAt||''} • Uploader: ${data.uploader?.name||'-'}</div>
      `;
    }
    const rec = document.getElementById('recGrid');
    if(rec && data.related) rec.innerHTML = data.related.slice(0,6).map(cardHTML).join('');
    const epWrap = document.getElementById('episodeList');
    if(epWrap) epWrap.innerHTML = `<div class="p-3 bg-[#141414] rounded border border-white/5 text-xs"><div class="font-bold">${data.title}</div><div class="text-zinc-500 mt-1">${data.durationSec||''} detik • ${data.publishedAt||''}</div></div>`;
  }
  // OGV season
  else if(data.season){
    if(titleEl) titleEl.textContent = data.season.title || data.season.season_title || 'Judul Anime';
    if(metaEl) metaEl.textContent = `${data.season.views || ''} • ${data.season.index_show || ''}`;
    if(synEl) synEl.textContent = data.season.evaluate || data.season.description || '';
    if(crumb) crumb.textContent = data.season.title || '';
    if(frame) frame.src = `https://www.bilibili.tv/id/play/${data.seasonId}`;
    if(openLink) openLink.href = `https://www.bilibili.tv/id/play/${data.seasonId}`;
    const epWrap = document.getElementById('episodeList');
    if(epWrap && data.sections){
      const eps = data.sections.flatMap(s=> s.episodes || []);
      epWrap.innerHTML = eps.slice(0,20).map((ep,i)=>`
        <button class="w-full text-left flex items-center gap-3 px-3 py-2.5 rounded bg-[#141414] hover:bg-[#1f1f1f] border border-white/5">
          <span class="w-7 h-7 rounded bg-white text-black flex items-center justify-center text-xs font-bold">${i+1}</span>
          <span class="text-xs font-semibold truncate">${ep.title || ep.long_title || 'Episode '+(i+1)}</span>
          <span class="ml-auto text-[11px] text-zinc-500">${ep.duration || ''}</span>
        </button>
      `).join('') || '<div class="text-xs text-zinc-500">Tidak ada episode</div>';
    }
  }
  if(window.lucide) lucide.createIcons();
}

document.addEventListener('DOMContentLoaded', ()=>{
  if(document.getElementById('newGrid') || document.getElementById('trendingGrid')){
    loadHome();
    setupSearch();
  }
  if(location.pathname.includes('player.html')){
    initPlayer();
  }
});
