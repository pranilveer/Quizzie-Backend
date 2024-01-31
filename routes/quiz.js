const express = require("express");
const router = express.Router();
const Quiz = require("../models/quiz");
const Question = require("../models/question");
const authenticateUser = require("../middleware/authMiddleware");

// Create a new quiz
router.post("/quizzes", authenticateUser, async (req, res) => {
  try {
    const { title, type } = req.body;
    const userId = req.user._id;

    const quiz = new Quiz({ title, type, userId });
    await quiz.save();
    res.status(201).json(quiz);
  } catch (error) {
    res.status(500).json({ error: "Quiz creation failed" });
  }
});

// Get all quizzes
router.get("/quizzes", authenticateUser, async (req, res) => {
  try {
    const quizzes = await Quiz.find({ userId: req.user._id });
    res.status(200).json(quizzes);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch quizzes" });
  }
});

// Share a quiz by generating a unique link or code
router.get("/quizzes/:quizId/share", async (req, res) => {
  const quizId = req.params.quizId;
  try {
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ error: "Quiz not found" });
    }

    // Generate a unique link or code for sharing
    const shareLink = `http://localhost:3000/quiz/${quizId}`;

    res.status(200).json({ shareLink });
  } catch (error) {
    res.status(500).json({ error: "Failed to generate share link" });
  }
});

// Track impressions for a quiz
router.get("/quizzes/:quizId", async (req, res) => {
  const quizId = req.params.quizId;
  try {
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ error: "Quiz not found" });
    }
    
    // Increment the impression count
    quiz.impressionCount = (quiz.impressionCount || 0) + 1;
    const quizImpression = await quiz.save();

    res
      .status(200)
      .json({ message: "Impression tracked successfully", quizImpression });
  } catch (error) {
    res.status(500).json({ error: "Failed to track impression" });
  }
});

router.get("/quizzes/read/:quizId", async (req, res) => {
  const quizId = req.params.quizId;
  try {
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ error: "Quiz not found" });
    }

    res.status(200).json(quiz);
  } catch (error) {
    res.status(500).json({ error: "Failed to track impression" });
  }
});

// checking for answers
router.post("/quizzes/check-answer", async (req, res) => {
  const { chooseAnswers, quizId } = req.body;
  const quiz = await Quiz.findById(quizId);

  let score = 0;

  for (const answer of chooseAnswers) {
    const question = await Question.findById(answer.questionId);
    if (!question) continue;
    const correctAnswer = question.options.find((opt) => opt.isCorrect);
    const correct = answer.id?.toString() === correctAnswer._id?.toString();
    const updateField = correct ? "correct" : "incorrect";
    await Question.findByIdAndUpdate(answer.questionId, {
      $inc: { [updateField]: 1, attempt: 1 },
    });
    if (correct) {
      score++;
    }
  }

  res.status(200).json({ status: true, score });
});

router.delete("/quizzes/:quizId", authenticateUser, async (req, res) => {
  try {
    const quizId = req.params.quizId;
    const userId = req.user._id; // Use _id of the user, not quizId

    const quiz = await Quiz.findOne({ _id: quizId, userId });

    if (!quiz) {
      return res.status(404).json({ error: "Quiz not found" });
    }

    await Quiz.deleteOne({ _id: quizId }); // Use deleteOne to delete the quiz

    res.status(204).send(); // No content response for successful deletion
  } catch (error) {
    console.error("Error deleting quiz:", error);
    res.status(500).json({ error: "Quiz deletion failed" });
  }
});

// PUT /quizzes/:quizId
router.put("/quizzes/:quizId", authenticateUser, async (req, res) => {
  try {
    const quizId = req.params.quizId; // Extract the quiz ID from the route parameters
    const { title, type } = req.body;

    // Check if the user has permission to edit this quiz (e.g., make sure the user owns the quiz)
    const userId = req.user._id;
    const quiz = await Quiz.findOne({ _id: quizId, userId });

    if (!quiz) {
      return res.status(404).json({ error: "Quiz not found" });
    }

    // Update the quiz with the new title and type
    quiz.title = title;
    quiz.type = type;

    // Save the updated quiz
    await quiz.save();

    res.status(200).json(quiz);
  } catch (error) {
    res.status(500).json({ error: "Quiz update failed" });
  }
});

module.exports = router;
