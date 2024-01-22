const mongoose = require('mongoose');

// Define the option schema
const optionSchema = new mongoose.Schema({
  text: String,
  imageURL: String,
});

// Define the question schema
const questionSchema = new mongoose.Schema({
  pollQuestion: String,
  timerType: String,
  options: [optionSchema],
  ansOption: Number,
});

// Define the quiz schema
const quizSchema = new mongoose.Schema({
  quizName: String,
  quizType: String,
  questions: [questionSchema],
});

// Create a Mongoose model
const Quiz = mongoose.model('Quiz', quizSchema);

module.exports = Quiz;