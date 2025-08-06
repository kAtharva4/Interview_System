const mongoose = require("mongoose");

const answerSchema = new mongoose.Schema({
  question: String,
  userAnswer: String,
  category: String,
  topic: String,
  feedback: {
    score: Number,
    feedback: String,
    improvementSuggestions: String
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to User model
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model("Answer", answerSchema);
