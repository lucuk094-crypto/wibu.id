const bstation = require('../lib/bstation');
module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Cache-Control','s-maxage=30, stale-while-revalidate=60');
  const { cmd, q, keyword, id, aid, lang='id', path } = req.query || {};
  const query = q || keyword;
  const vid = id || aid;
  try{
    let result;
    if(cmd==='home') result = await bstation.home(lang);
    else if(cmd==='timeline') result = await bstation.timeline(lang);
    else if(cmd==='trending') result = await bstation.trending(lang);
    else if(cmd==='search'){
      if(!query) return res.status(400).json({error:'q required'});
      result = await bstation.search(query, {lang});
    }
    else if(cmd==='video'){
      if(!vid && !query) return res.status(400).json({error:'id required'});
      result = await bstation.video(vid||query, lang);
    }
    else if(cmd==='play'){
      if(!vid) return res.status(400).json({error:'id required'});
      result = await bstation.play(vid, lang);
    }
    else if(cmd==='raw'){
      result = await bstation.raw(path||'/', lang);
    }
    else return res.status(400).json({error:'unknown cmd. use home|trending|timeline|search|video|play|raw'});
    return res.status(200).json(result);
  }catch(e){
    return res.status(500).json({error:e.message, cmd});
  }
};