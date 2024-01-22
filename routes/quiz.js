const express = require("express");
const {
  createQuiz,
  getAllQuizzes,
  getQuizDetails,
  totalQuestions,
  totalImpressions,
  increaseImpressions,
  deleteQuiz,
  editQuiz,
  quizQuestions,
  createQuestion,
  editQuestion,
  deleteQuestion,
  answeredQuestion,
} = require("../controllers/quizController");
const quizRouter = express.Router();

// Route for creating a new quiz
quizRouter.post("/create", createQuiz);

// Route for getting all quizzes
quizRouter.get("/allquiz", getAllQuizzes);

// Route for getting quiz details by ID
quizRouter.get("/:quiz_id", getQuizDetails);

// Route for getting total number of questions
quizRouter.get("/total/questions", totalQuestions);

// Route for getting total impressions
quizRouter.get("/total/impressions", totalImpressions);

// Route for increasing impressions for a quiz
quizRouter.put("/increase/impressions/:quiz_id", increaseImpressions);

// Route for deleting a quiz
quizRouter.delete("/delete/:quiz_id", deleteQuiz);

// Route for editing a quiz
quizRouter.put("/edit/:quiz_id", editQuiz);

// Route for getting all questions for a quiz
quizRouter.get("/questions/:quiz_id", quizQuestions);

// Route for creating a new question for a quiz
quizRouter.post("/questions/create", createQuestion);

// Route for editing a question
quizRouter.put("/questions/edit/:quizId/:questionId", editQuestion);

// Route for deleting a question
quizRouter.delete("/questions/delete/:quiz_id/:question_id", deleteQuestion);

// Route for answering a question
quizRouter.post("/questions/answer/:quiz_id/:question_id", answeredQuestion);

module.exports = quizRouter;
