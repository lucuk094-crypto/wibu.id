import { home, search, video, trending, timeline, play, gwSuggest, gwFilters, gwItems, browseByOrder } from "../../../lib/bstation";
export const dynamic = "force-dynamic";
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const cmd = searchParams.get("cmd");
  const q = searchParams.get("q") || searchParams.get("keyword");
  const id = searchParams.get("id");
  const lang = searchParams.get("lang") || "id";
  const pn = searchParams.get("pn") || "1";
  const ps = searchParams.get("ps") || "20";
  const order = searchParams.get("order") || "0";
  try {
    if (cmd === "home") return Response.json(await home(lang));
    if (cmd === "trending") return Response.json(await trending(lang));
    if (cmd === "timeline") return Response.json(await timeline(lang));
    if (cmd === "filters") return Response.json(await gwFilters(lang));
    if (cmd === "suggest") return Response.json(await gwSuggest(q||"", lang));
    if (cmd === "items" || cmd === "browse") return Response.json(await gwItems({ pn:Number(pn), ps:Number(ps), order:Number(order) }, lang));
    if (cmd === "play") {
      if (!id) return Response.json({ error: "id required" }, { status: 400 });
      return Response.json(await play(id, lang));
    }
    if (cmd === "search") {
      if (!q) return Response.json({ error: "q required" }, { status: 400 });
      return Response.json(await search(q, lang));
    }
    if (cmd === "video") {
      if (!id && !q) return Response.json({ error: "id required" }, { status: 400 });
      return Response.json(await video(id || q, lang));
    }
    return Response.json({ error: "unknown cmd: home|trending|timeline|play|search|video|filters|suggest|items" }, { status: 400 });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}
