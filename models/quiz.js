const mongoose = require("mongoose");

const quizSchema = new mongoose.Schema(
  {
    quizName: { type: String, required: true },
    impressionCount: { type: Number, default: 0 },
    type: { type: String, enum: ["Q&A", "Poll"], required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Quiz", quizSchema);
