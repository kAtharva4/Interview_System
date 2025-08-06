// routes/answerRoutes.js
const express = require("express");
const router = express.Router();
const { submitAnswer } = require("../controllers/answerController");
const {getUserProgress}=require("../controllers/answerController")
const { protect } = require("../middleware/authMiddleware");

router.post("/submit", protect, submitAnswer);
router.get("/detail", protect, getUserProgress);

module.exports = router;
