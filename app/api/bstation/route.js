import { home, search, video } from "../../../lib/bstation";
export const dynamic = "force-dynamic";
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const cmd = searchParams.get("cmd");
  const q = searchParams.get("q") || searchParams.get("keyword");
  const id = searchParams.get("id");
  const lang = searchParams.get("lang") || "id";
  try {
    if (cmd === "home") return Response.json(await home(lang));
    if (cmd === "search") {
      if (!q) return Response.json({ error: "q required" }, { status: 400 });
      return Response.json(await search(q, lang));
    }
    if (cmd === "video") {
      if (!id && !q) return Response.json({ error: "id required" }, { status: 400 });
      return Response.json(await video(id || q, lang));
    }
    return Response.json({ error: "unknown cmd" }, { status: 400 });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}
