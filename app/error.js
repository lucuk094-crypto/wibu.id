"use client";
export default function Error({ error, reset }){
  return (
    <div className="md:ml-[68px] min-h-[60vh] flex flex-col items-center justify-center p-8 text-center">
      <div className="text-sm font-bold text-[#E50914]">Terjadi Kesalahan</div>
      <p className="text-xs text-zinc-500 mt-2 max-w-[400px]">{error?.message || "Gagal memuat data Bstation — coba refresh"}</p>
      <button onClick={()=>reset()} className="mt-4 px-6 py-2 rounded-full bg-white text-black text-sm font-bold">Coba Lagi</button>
    </div>
  )
}
