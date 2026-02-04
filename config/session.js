const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const fs = require("fs");

const dataDir = process.env.DATA_DIR
  ? path.resolve(process.env.DATA_DIR)
  : path.join(__dirname, "..");

fs.mkdirSync(dataDir, { recursive: true });

const dbPath = path.join(dataDir, "db.sqlite");

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Failed to open SQLite DB:", err);
  } else {
    console.log("SQLite DB path:", dbPath);
  }
});

db.serialize(() => {
  db.run(`PRAGMA foreign_keys = ON`);
  db.run(`PRAGMA journal_mode = WAL`);
  db.run(`PRAGMA synchronous = NORMAL`);

  db.run(`
    CREATE TABLE IF NOT EXISTS Users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      fullName TEXT NOT NULL,
      passwordHash TEXT NOT NULL,
      createdAt TEXT NOT NULL
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS Favorites (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      videoId TEXT NOT NULL,
      title TEXT NOT NULL,
      channelTitle TEXT,
      thumbnailUrl TEXT,
      createdAt TEXT NOT NULL,
      UNIQUE(userId, videoId),
      FOREIGN KEY(userId) REFERENCES Users(id) ON DELETE CASCADE
    )
  `);

  // Helpful indexes (optional but good)
  db.run(`CREATE INDEX IF NOT EXISTS idx_favorites_userId ON Favorites(userId)`);
});

module.exports = db;
