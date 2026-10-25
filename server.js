const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const bstation = require('./lib/bstation');

const PORT = process.env.PORT || 8000;
const ROOT = __dirname;

const MIME = {
  '.html':'text/html; charset=utf-8',
  '.js':'application/javascript; charset=utf-8',
  '.css':'text/css; charset=utf-8',
  '.json':'application/json; charset=utf-8',
  '.png':'image/png',
  '.jpg':'image/jpeg',
  '.jpeg':'image/jpeg',
  '.svg':'image/svg+xml',
  '.ico':'image/x-icon'
};

// simple memory cache for SSR (30s)
let cacheHome = { data: null, time: 0 };
async function getHomeCached(lang='id'){
  const now = Date.now();
  if(cacheHome.data && (now - cacheHome.time) < 30000) return cacheHome.data;
  try{
    const d = await bstation.home(lang);
    cacheHome = { data: d, time: now };
    return d;
  }catch(e){
    console.error('SSR home fetch fail', e.message);
    return cacheHome.data || { popular:[], animeTrending:[], timeline:[], ranking:[] };
  }
}

function sendJSON(res, obj, status=200){
  res.writeHead(status, {'Content-Type':'application/json; charset=utf-8', 'Access-Control-Allow-Origin':'*', 'Cache-Control':'no-store'});
  res.end(JSON.stringify(obj));
}
function sendText(res, text, code=200, type='text/html'){
  res.writeHead(code, {'Content-Type': type});
  res.end(text);
}

const server = http.createServer(async (req, res)=>{
  const parsed = url.parse(req.url, true);
  let pathname = parsed.pathname;

  if(req.method==='OPTIONS'){
    res.writeHead(204, {'Access-Control-Allow-Origin':'*','Access-Control-Allow-Methods':'GET,POST,OPTIONS','Access-Control-Allow-Headers':'Content-Type'});
    return res.end();
  }

  // API ROUTES
  if(pathname.startsWith('/api/')){
    const cmd = parsed.query.cmd || pathname.split('/').pop().replace('.js','');
    const lang = parsed.query.lang || 'id';
    const q = parsed.query.q || parsed.query.keyword || parsed.query.query;
    const id = parsed.query.id || parsed.query.aid || parsed.query.season_id;
    try{
      let result;
      if(cmd==='home') result = await bstation.home(lang);
      else if(cmd==='timeline') result = await bstation.timeline(lang);
      else if(cmd==='trending') result = await bstation.trending(lang);
      else if(cmd==='search'){
        if(!q) return sendJSON(res, {error:'q required'},400);
        result = await bstation.search(q, {lang});
      }
      else if(cmd==='video'){
        if(!id && !q) return sendJSON(res, {error:'id required'},400);
        result = await bstation.video(id||q, lang);
      }
      else if(cmd==='play'){
        if(!id) return sendJSON(res, {error:'id required'},400);
        result = await bstation.play(id, lang);
      }
      else if(cmd==='raw'){
        const p = parsed.query.path || '/';
        result = await bstation.raw(p, lang);
      }
      else if(pathname==='/api/health'){
        return sendJSON(res, {ok:true, time: new Date().toISOString()});
      }
      else {
        return sendJSON(res, {error:'unknown cmd. use cmd=home|trending|timeline|search|video|play|raw'},400);
      }
      res.writeHead(200, {'Content-Type':'application/json; charset=utf-8','Access-Control-Allow-Origin':'*','Cache-Control':'s-maxage=30, stale-while-revalidate=60'});
      return res.end(JSON.stringify(result));
    }catch(e){
      console.error('API error', cmd, e.message);
      return sendJSON(res, {error:e.message, cmd}, 500);
    }
  }

  // SSR: index.html -> inject home data
  if(pathname==='/' || pathname==='/index.html'){
    try{
      const filePath = path.join(ROOT,'index.html');
      let html = fs.readFileSync(filePath,'utf8');
      const homeData = await getHomeCached(parsed.query.lang || 'id');
      // also try trending for ranking
      let trendingData = { ranking: [] };
      try{ trendingData = await bstation.trending(parsed.query.lang || 'id'); }catch(e){}
      const initial = { home: homeData, trending: trendingData };
      const inject = `<script>window.__INITIAL_DATA__ = ${JSON.stringify(initial)};</script>`;
      html = html.replace('</head>', inject + '</head>');
      res.writeHead(200, {'Content-Type':'text/html; charset=utf-8', 'Cache-Control':'no-cache'});
      return res.end(html);
    }catch(e){
      console.error('SSR index fail', e.message);
    }
  }

  // SSR: player.html -> inject video detail
  if(pathname==='/player.html'){
    try{
      const filePath = path.join(ROOT,'player.html');
      let html = fs.readFileSync(filePath,'utf8');
      const vid = parsed.query.id;
      let videoData = null;
      if(vid){
        try{ videoData = await bstation.video(vid, parsed.query.lang || 'id'); }catch(e){ 
          try{ videoData = await bstation.play(vid, parsed.query.lang || 'id'); }catch(e2){}
        }
      }
      const homeData = await getHomeCached(parsed.query.lang || 'id');
      const initial = { video: videoData, home: homeData };
      const inject = `<script>window.__INITIAL_DATA__ = ${JSON.stringify(initial)};</script>`;
      html = html.replace('</head>', inject + '</head>');
      res.writeHead(200, {'Content-Type':'text/html; charset=utf-8', 'Cache-Control':'no-cache'});
      return res.end(html);
    }catch(e){
      console.error('SSR player fail', e.message);
    }
  }

  // STATIC FILES
  if(pathname==='/') pathname='/index.html';
  let filePath = path.join(ROOT, pathname);
  if(!filePath.startsWith(ROOT)) return sendText(res,'Forbidden',403);
  if(!fs.existsSync(filePath) && !path.extname(filePath)){
    if(fs.existsSync(filePath+'.html')) filePath += '.html';
  }
  if(fs.existsSync(filePath) && fs.statSync(filePath).isFile()){
    const ext = path.extname(filePath).toLowerCase();
    const mime = MIME[ext] || 'application/octet-stream';
    const stream = fs.createReadStream(filePath);
    res.writeHead(200, {'Content-Type': mime, 'Cache-Control': ext==='.html'?'no-cache':'public, max-age=3600'});
    return stream.pipe(res);
  } else {
    if(!pathname.startsWith('/api/')){
      const fallback = path.join(ROOT,'index.html');
      if(fs.existsSync(fallback)){
        res.writeHead(200, {'Content-Type':'text/html'});
        return fs.createReadStream(fallback).pipe(res);
      }
    }
    return sendText(res,'Not Found',404,'text/plain');
  }
});

server.listen(PORT, '0.0.0.0', ()=> console.log(`Wibu.ID server running at http://0.0.0.0:${PORT} (SSR enabled)`));
