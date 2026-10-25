export default function Loading(){
  return (
    <div className="md:ml-[72px] min-h-screen bg-[#070709] flex flex-col">
      <div className="h-[560px] relative overflow-hidden bg-[#0f0f12]">
        <div className="absolute inset-0" style={{background:"linear-gradient(90deg, #141418 25%, #1a1a1e 50%, #141418 75%)", backgroundSize:"400px 100%", animation:"shimmer 1.2s infinite"}} />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="glass-strong px-8 py-6 rounded-2xl flex flex-col items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#E50914] animate-float flex items-center justify-center font-black">W</div>
            <div className="flex gap-1.5">
              <span className="w-2 h-2 rounded-full bg-white" style={{animation:"dotPulse 1s infinite"}} />
              <span className="w-2 h-2 rounded-full bg-white" style={{animation:"dotPulse 1s 0.2s infinite"}} />
              <span className="w-2 h-2 rounded-full bg-white" style={{animation:"dotPulse 1s 0.4s infinite"}} />
            </div>
            <span className="text-xs font-bold tracking-widest text-zinc-400">LOADING WIBU.ID</span>
          </div>
        </div>
      </div>
      <div className="max-w-[1400px] mx-auto w-full px-4 md:px-8 mt-6 pb-10">
        <div className="flex gap-2 overflow-hidden">
          {[...Array(6)].map((_,i)=><div key={i} className="w-[172px] h-[260px] glass rounded-xl flex-shrink-0 animate-pulse" style={{animationDelay:`${i*0.1}s`}} />)}
        </div>
      </div>
    </div>
  )
}
