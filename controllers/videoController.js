const youtubeService = require("../services/youtubeService");
const favoriteRepo = require("../repositories/favoriteRepository");

class VideoController {
  async show(req, res) {
    const userId = req.session.user.id;
    const query = req.query.q || "";

    const favorites = await favoriteRepo.listByUser(userId);

    let results = [];
    let error = null;

    if (query.trim()) {
      try {
        results = await youtubeService.search(query);
      } catch (e) {
        error = e.message;
      }
    }

    res.render("videos", {
      user: req.session.user,
      query,
      results,
      favorites,
      error,
    });
  }

  async addFavorite(req, res) {
    const userId = req.session.user.id;
    const { videoId, title, channelTitle, thumbnailUrl } = req.body;

    await favoriteRepo.add({ userId, videoId, title, channelTitle, thumbnailUrl });
    res.redirect(req.get("referer") || "/videos");
  }

  async deleteFavorite(req, res) {
    const userId = req.session.user.id;
    const id = req.params.id;

    await favoriteRepo.remove({ id, userId });
    res.redirect(req.get("referer") || "/videos");
  }
}

module.exports = new VideoController();
