const express = require("express");
const router = express.Router();
const Question = require("../models/Question");
const Answer = require("../models/Answer");
const auth = require("../middleware/saveQMiddleware");

// Save questions
router.post("/save", async (req, res) => {
  try {
    const { category, topic, questions } = req.body;
    const qa = new Question({ category, topic, questions });
    await qa.save();
    res.status(201).json({ message: "Exported questions saved to DB" });
  } catch (error) {
    console.error("Error saving exported QA:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Save answer with user ref
router.post("/answer", auth, async (req, res) => {
  try {
    const { question, userAnswer, category, topic, feedback } = req.body;

    const answer = new Answer({
      question,
      userAnswer,
      category,
      topic,
      feedback,
      user: req.user._id // from decoded token
    });

    await answer.save();
    res.status(201).json({ message: "Answer saved successfully" });
  } catch (error) {
    console.error("Error saving answer:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
