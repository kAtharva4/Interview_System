// controllers/answerController.js
const Answer = require("../models/Answer");
const UserProgress = require("../models/UserProgress");

exports.submitAnswer = async (req, res) => {
  try {
    const { question, userAnswer, category, topic, feedback } = req.body;
    const userId = req.user._id;

    // 1. Save answer
    const newAnswer = new Answer({
      question,
      userAnswer,
      category,
      topic,
      feedback,
      user: userId
    });
    await newAnswer.save();

    const score = feedback.score || 0;

    // 2. Update UserProgress
    let progress = await UserProgress.findOne({ user: userId });

    if (!progress) {
      progress = new UserProgress({
        user: userId,
        totalAnswered: 1,
        totalScore: score,
        averageScore: score,
        categories: {
          [category]: {
            attempted: 1,
            score: score
          }
        }
      });
    } else {
      progress.totalAnswered += 1;
      progress.totalScore += score;
      progress.averageScore = progress.totalScore / progress.totalAnswered;

      const cat = progress.categories.get(category) || { attempted: 0, score: 0 };
      cat.attempted += 1;
      cat.score += score;
      progress.categories.set(category, cat);
    }

    await progress.save();

    res.status(201).json({ message: "Answer saved and progress updated." });
  } catch (error) {
    console.error("Error saving answer:", error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getUserProgress = async (req, res) => {
  try {
    const userId = req.user._id;

    const progress = await UserProgress.findOne({ user: userId });

    if (!progress) {
      return res.status(404).json({ message: "No progress found for this user." });
    }

    res.status(200).json(progress);
  } catch (error) {
    console.error("Error retrieving user progress:", error);
    res.status(500).json({ error: "Server error" });
  }
};
