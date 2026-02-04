const db = require("../config/db");
const Favorite = require("../models/favorite");

class FavoriteRepository {
  async listByUser(userId) {
    return new Promise((resolve, reject) => {
      db.all(
        `SELECT * FROM Favorites WHERE userId = ? ORDER BY id DESC`,
        [userId],
        (err, rows) => {
          if (err) return reject(err);
          resolve(rows.map((r) => new Favorite(r)));
        }
      );
    });
  }

  async add({ userId, videoId, title, channelTitle, thumbnailUrl }) {
    const createdAt = new Date().toISOString();
    return new Promise((resolve, reject) => {
      db.run(
        `INSERT OR IGNORE INTO Favorites (userId, videoId, title, channelTitle, thumbnailUrl, createdAt)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [userId, videoId, title, channelTitle, thumbnailUrl, createdAt],
        function (err) {
          if (err) return reject(err);
          resolve({ ok: true });
        }
      );
    });
  }

  async remove({ id, userId }) {
    return new Promise((resolve, reject) => {
      db.run(
        `DELETE FROM Favorites WHERE id = ? AND userId = ?`,
        [id, userId],
        function (err) {
          if (err) return reject(err);
          resolve({ deleted: this.changes });
        }
      );
    });
  }
}

module.exports = new FavoriteRepository();
