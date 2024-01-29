const express = require("express");
const router = express.Router();
const Question = require("../models/question");
const authenticateUser = require("../middleware/authMiddleware");
const Quiz = require("../models/quiz");

// Add a new question to a quiz
router.get("/stats", authenticateUser, async (req, res) => {
  try {
    const quizzes = await Quiz.find({ userId: req.user._id });
    const questions = await Question.find({ userId: req.user._id });
    const trendy = quizzes.filter((quiz) => {
      return quiz.impressionCount > 1;
    });
    let impression = 0;
    for (let i = 0; i < quizzes.length; i++) {
      impression += quizzes[i].impressionCount;
    }
    res.status(201).json({
      quizzes: quizzes.length,
      questions: questions.length,
      impression,
      trendy,
    });
  } catch (error) {
    res.status(500).json({ error: "Question creation failed" });
  }
});

module.exports = router;
