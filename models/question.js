const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  quizId: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz" },
  options: [
    {
      optionText: String,
      optionImage: String,
      isCorrect: Boolean,
      count: Number,
    },
  ],
  selectedOption: { type: String },
  timer: { type: Number, default: 0 },
  attempt: { type: Number, default: 0 },
  correct: { type: Number, default: 0 },
  incorrect: { type: Number, default: 0 },
});

module.exports = mongoose.model("Question", questionSchema);
