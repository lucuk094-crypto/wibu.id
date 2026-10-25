export default function Loading(){
  return (
    <div className="md:ml-[68px] p-8">
      <div className="max-w-[1400px] mx-auto">
        <div className="h-[420px] bg-[#141414] animate-pulse rounded-xl"></div>
        <div className="mt-6 flex gap-3">
          {[...Array(6)].map((_,i)=><div key={i} className="w-[168px] h-[250px] bg-[#141414] animate-pulse rounded"></div>)}
        </div>
      </div>
    </div>
  )
}
