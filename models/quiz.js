const mongoose = require('mongoose');

const optionSchema = new mongoose.Schema({
  text: { type: String, default: "" },
  imageURL: { type: String, default: "" },
});

const questionSchema = new mongoose.Schema({
  pollQuestion: { type: String, default: "" },
  timerType: { type: String, default: "" },
  options: [optionSchema],
  ansOption: { type: Number, default: null },
});

const quizSchema = new mongoose.Schema({
  quizName: { type: String, default: "" },
  quizType: { type: String, default: "" },
  questions: [questionSchema],
});

const Quiz = mongoose.model('Quiz', quizSchema);

module.exports = Quiz;
