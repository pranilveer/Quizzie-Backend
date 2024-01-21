const Quiz = require('../models/quiz');

exports.createQuiz = async (req, res) => {
  try {
    const { quizName, quizType, questions } = req.body;

    const newQuiz = new Quiz({ quizName, quizType, questions });
    const savedQuiz = await newQuiz.save();

    res.status(201).json(savedQuiz);
  } catch (error) {
    console.error('Quiz creation failed:', error);
    res.status(500).json({ error: 'Quiz creation failed' });
  }
};