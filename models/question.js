const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  quizName: { type: String, required: true },
  quizType: { type: String, enum: ["Q&A", "Poll"], required: true },
  // quizId: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz" },
  questions: [
    {
      pollQuestion: String,
      timerType: Number,
      options: String,
      ansOption: String,
    },
  ],
  email: { type: String},
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
 
});

module.exports = mongoose.model("Question", questionSchema);