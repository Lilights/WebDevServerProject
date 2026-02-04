class YouTubeService {
  async search(query) {
    const key = process.env.YOUTUBE_API_KEY;
    const q = (query || "").trim();

    if (!q) return [];
    if (!key) throw new Error("Missing YOUTUBE_API_KEY");

    const url = new URL("https://www.googleapis.com/youtube/v3/search");
    url.searchParams.set("part", "snippet");
    url.searchParams.set("type", "video");
    url.searchParams.set("maxResults", "8");
    url.searchParams.set("q", q);
    url.searchParams.set("key", key);

    const resp = await fetch(url);
    if (!resp.ok) throw new Error("YouTube API error");

    const data = await resp.json();
    return (data.items || [])
      .map((item) => {
        const videoId = item?.id?.videoId;
        const sn = item?.snippet || {};
        const thumb =
          sn?.thumbnails?.medium?.url || sn?.thumbnails?.default?.url || "";

        return {
          videoId,
          title: sn.title || "",
          channelTitle: sn.channelTitle || "",
          thumbnailUrl: thumb,
        };
      })
      .filter((v) => v.videoId);
  }
}

module.exports = new YouTubeService();
