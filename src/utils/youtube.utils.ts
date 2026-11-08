/**
 * Turns a YouTube link (youtube.com/watch?v=…, youtu.be/…, youtube.com/embed/…, youtube.com/shorts/…)
 * into the embeddable URL https://www.youtube.com/embed/<id>, or null if no video id can be found.
 */
export function toYouTubeEmbedUrl(url: string): string | null {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\.|^m\./, "");
    let id: string | null = null;
    if (host === "youtu.be") {
      id = parsed.pathname.slice(1);
    } else if (host === "youtube.com") {
      if (parsed.pathname === "/watch") {
        id = parsed.searchParams.get("v");
      } else if (/^\/(embed|shorts)\//.test(parsed.pathname)) {
        id = parsed.pathname.split("/")[2];
      }
    }
    return id && /^[\w-]{6,}$/.test(id)
      ? `https://www.youtube.com/embed/${id}`
      : null;
  } catch {
    return null;
  }
}
