// models/ExportedQA.js
const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  category: String,
  topic: String,
  generatedAt: { type: Date, default: Date.now },
  questions: [
    {
      question: String,
      userAnswer: String,
      correctAnswer: String,
      feedback: {
        score: Number,
        feedback: String,
        improvementSuggestions: String
      }
    }
  ]
});

module.exports = mongoose.model("Question", questionSchema);
