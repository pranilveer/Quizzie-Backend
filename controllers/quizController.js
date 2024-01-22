const Quiz = require("../models/quiz");
// for creating new quiz
const createQuiz = async (req, res, next) => {
  const { quizName, quizType, questions } = req.body;

  console.log("Received Request Body:", req.body); // Add this line for logging

  const newQuiz = new Quiz({
    quizName,
    quizType,
    questions
  });

  try {
    await newQuiz.save();
    res.status(201).json({ msg: "Successfully created quiz" });
  } catch (err) {
    console.error(`Error creating quiz: ${err.message}`);
    console.error(err.stack);
    res.status(400).json({ error: "Bad Request" });
    next(err);
  }
};

// get all quizzes
const getAllQuizzes = async (req, res, next) => {
  try {
    const quizzes = await Quiz.find({});
    res.status(200).json(quizzes);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

// get quiz details by id
const getQuizDetails = async (req, res, next) => {
  const { quiz_id } = req.params;

  try {
    const quiz = await Quiz.findById(quiz_id).populate("userId", "name email");

    if (quiz) {
      res.status(200).json(quiz);
    } else {
      const error = new Error("Quiz not found");
      error.status = 404;
      next(error);
    }
  } catch (err) {
    next(err);
  }
};

// total question
const totalQuestions = async (req, res, next) => {
  try {
    const quizzes = await Quiz.find({});
    let totalQuestionCount = 0;

    if (quizzes && quizzes.length) {
      for (const quiz of quizzes) {
        totalQuestionCount += quiz.questions.length;
      }
    }

    res.status(200).json({ total: totalQuestionCount });
  } catch (err) {
    next(err);
  }
};
// total impression
const totalImpressions = async (req, res, next) => {
  try {
    const quizzes = await Quiz.find({});
    let impressions = 0;
    if (quizzes.length) {
      for (const quiz of quizzes) {
        impressions += quiz.impressions;
      }
    }
    res.status(200).json({ impressions });
  } catch (err) {
    next(err);
  }
};

// increased impression
const increaseImpressions = async (req, res, next) => {
  const { quiz_id } = req.params;

  try {
    const quiz = await Quiz.findOne({ _id: quiz_id });

    if (quiz) {
      quiz.impressions++;
      await quiz.save();

      res.status(200).json({ msg: "Increased impression count" });
    } else {
      const error = new Error("Quiz not found");
      error.status = 404;
      next(error);
    }
  } catch (err) {
    next(err);
  }
};

// deleting the quiz
const deleteQuiz = async (req, res, next) => {
  const { quiz_id } = req.params;

  try {
    const quiz = await Quiz.findByIdAndDelete(quiz_id);

    if (quiz) {
      res.status(200).json({ msg: "Successfully deleted quiz" });
    } else {
      const error = new Error("Quiz not found");
      error.status = 404;
      next(error);
    }
  } catch (err) {
    next(err);
  }
};

//  editing the quiz

const editQuiz = async (req, res, next) => {
  const { name, quiz_type, options_type, timer, questions } = req.body;
  const { quiz_id } = req.params;

  try {
    const quiz = await Quiz.findByIdAndUpdate(
      quiz_id,
      {
        name,
        quizType: quiz_type,
        optionsType: options_type,
        timer,
        questions,
      },
      { new: true }
    );

    if (quiz) {
      res.status(200).json({ msg: "Successfully updated quiz", quiz });
    } else {
      const error = new Error("Quiz not found");
      error.status = 404;
      next(error);
    }
  } catch (err) {
    next(err);
  }
};

// quiz questionss
const quizQuestions = async (req, res, next) => {
  const { quiz_id } = req.params;

  try {
    const quiz = await Quiz.findOne({ _id: quiz_id });
    const { questions } = quiz;

    if (questions) {
      res.status(200).json(questions);
    } else {
      const error = new Error("No questions found");
      error.status = 404;
      next(error);
    }
  } catch (err) {
    next(err);
  }
};

const createQuestion = async (req, res, next) => {
  const {
    userId,
    quiz_id,
    options,
    answer,
    totalAttempts,
    correctAttempts,
    incorrectAttempts,
  } = req.body;

  try {
    // Find the quiz based on its ID
    const quiz = await Quiz.findOne({ _id: quiz_id });

    // Destructure the questions array from the quiz
    const { questions } = quiz;

    // Check if the number of questions is less than 5 (the limit)
    if (questions.length < 5) {
      // Calculate the serial number for the new question
      const serialNum = questions.length + 1;

      // Create a new question object
      const newQuestion = {
        answer,
        total: 0,
        correctAttempts: 0,
        incorrectAttempts: 0,
        choices: options.map((option) => ({
          optionText: option,
          selectionCount: 0,
        })),
        userId: req.headers.user._id,
        quizId: quiz_id,
      };

      // Update the questions array with the new question
      const updatedQuestions = questions.length
        ? [...questions, newQuestion]
        : [newQuestion];
      quiz.questions = updatedQuestions;

      // Save the updated quiz with the new question
      await quiz.save();

      // Respond with a success message
      res.status(200).json({ msg: "Added question successfully" });
    } else {
      // If the question limit is reached, send an error
      const error = new Error("Question limit reached");
      error.status = 400;
      next(error);
    }
  } catch (err) {
    // Handle any errors that occur during the process
    next(err);
  }
};
// -------------------------edit--------------------------------------//

const editQuestion = async (req, res, next) => {
  const { quizId, questionId } = req.params;
  const { answer, choices } = req.body;

  try {
    // Find the quiz
    const quiz = await Quiz.findById(quizId);

    if (!quiz) {
      const error = new Error("Quiz not found");
      error.status = 404;
      throw error;
    }

    // Find the question within the quiz
    const question = quiz.questions.find(
      (q) => q._id.toString() === questionId
    );

    if (!question) {
      const error = new Error("Question not found");
      error.status = 404;
      throw error;
    }

    // Update the question properties
    question.answer = answer;

    // Update choices if provided
    if (choices && Array.isArray(choices)) {
      question.choices = choices.map((option) => ({
        optionText: option.optionText,
        selectionCount: option.selectionCount || 0,
      }));
    }

    // Save the changes
    await quiz.save();

    res.status(200).json({ msg: "Question updated successfully", question });
  } catch (err) {
    next(err);
  }
};

// ------------------------delete-----------------------------//
const deleteQuestion = async (req, res, next) => {
  const { question_id } = req.params;
  const { quiz_id } = req.params;

  try {
    const quiz = await Quiz.findOne({ _id: quiz_id });

    if (quiz) {
      const { questions } = quiz;

      // Check if there are more than one question before allowing deletion
      if (questions.length > 1) {
        const updatedQuestions = questions.filter(
          (question) => question._id != question_id
        );
        quiz.questions = updatedQuestions;
        await quiz.save();
        res.status(200).json({ msg: "Question deleted Successfully" });
      } else {
        const error = new Error("Minimum one question is required");
        error.status = 400;
        next(error);
      }
    } else {
      const error = new Error("Quiz not found");
      error.status = 404;
      next(error);
    }
  } catch (err) {
    next(err);
  }
};

// -----------------------------------answeredquestion--------------------//

const answeredQuestion = async (req, res, next) => {
  const { user_answer } = req.body;
  const { quiz_id, question_id } = req.params;

  try {
    const quiz = await Quiz.findOne({ _id: quiz_id });

    if (!quiz) {
      const error = new Error("Quiz not found");
      error.status = 404;
      throw error;
    }

    const { quiztype, questions } = quiz;
    const question = questions.find((q) => q._id == question_id);

    if (!question) {
      const error = new Error("Question not found");
      error.status = 404;
      throw error;
    }

    // Handle answer based on quiz type
    if (quiztype === "Poll") {
      poll(question, user_answer);
    } else if (quiztype === "QA") {
      qna(question, user_answer);
    }

    await quiz.save();

    res.status(201).json({ msg: "Answered Question" });
  } catch (err) {
    next(err);
  }
};

// ---------------------------------QA AND POLL--------------------------//
const poll = (question, answer) => {
  const { options } = question;
  for (const option of options) {
    if (option.value === answer) {
      option.timesSelected++;
    }
  }
  question.totalAttempts++;
};
const qna = (question, user_answer) => {
  const { answer, choices } = question;
  question.totalAttempts++;
  if (user_answer === answer) {
    question.correctAttempts++;
  } else {
    question.incorrectAttempts++;
  }

  // Assuming choices is an array of objects with optionText and selectionCount properties
  const selectedChoice = choices.find(
    (choice) => choice.optionText === user_answer
  );

  if (selectedChoice) {
    // If the user's answer corresponds to an existing choice, increment its selectionCount
    selectedChoice.selectionCount++;
  } else {
    question.choices.push({ optionText: user_answer, selectionCount: 1 });
  }
};

// ----------------------------------------------------------------------------------------//

module.exports = {
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
};
