// models/UserProgress.js
const mongoose = require("mongoose");

const userProgressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    unique: true,
    required: true
  },
  totalAnswered: {
    type: Number,
    default: 0
  },
  totalScore: {
    type: Number,
    default: 0
  },
  averageScore: {
    type: Number,
    default: 0
  },
  categories: {
    type: Map,
    of: {
      attempted: Number,
      score: Number
    },
    default: {}
  }
}, { timestamps: true });

module.exports = mongoose.model("UserProgress", userProgressSchema);
