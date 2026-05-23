




const express = require("express");

const {
 createVideo,
     getVideos,
  likeVideo,
  commentVideo,
  getComments,
  shareVideo,
  getMyVideos,
  deleteMyVideo,
} = require("../controllers/videoController");
const { interactionLimiter } = require("../middleware/rateLimiter");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();




router.post("/", protect, createVideo);
router.get("/", getVideos);

router.post("/like", interactionLimiter, likeVideo);
router.post("/comment", interactionLimiter, commentVideo);


router.get('/my-videos', protect, getMyVideos);          // ✅ GET MY VIDEOS
router.delete('/my-videos/:videoId', protect, deleteMyVideo);

router.get("/:videoId/comments", getComments);

router.post("/share", shareVideo);


module.exports = router;