const express = require("express");
const requireAuth = require("../middleware/requireAuth");
const videoController = require("../controllers/videoController");

const router = express.Router();

router.get("/videos", requireAuth, (req, res) => videoController.show(req, res));
router.post("/favorites/add", requireAuth, (req, res) => videoController.addFavorite(req, res));
router.post("/favorites/:id/delete", requireAuth, (req, res) => videoController.deleteFavorite(req, res));

module.exports = router;
