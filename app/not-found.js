import Link from "next/link";
export default function NotFound(){
  return (
    <div className="md:ml-[68px] min-h-[60vh] flex flex-col items-center justify-center p-8 text-center">
      <div className="text-6xl font-black">404</div>
      <p className="text-sm text-zinc-500 mt-2">Halaman tidak ditemukan</p>
      <Link href="/" className="mt-4 px-6 py-2 rounded-full bg-white text-black text-sm font-bold">Kembali ke Home</Link>
    </div>
  )
}
