const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const authRouter = require("./routes/authRoutes");
const quizRouter = require("./routes/quiz");

dotenv.config();
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.use("/", authRouter);
app.use("/quiz", quizRouter);

app.get("/health", (req, res) => {
  const dbstatus =
    mongoose.connection.readyState === 1 ? "connected" : "disconnected";
  res.status(200).json({
    server: "Running",
    database: dbstatus,
  });
});

module.exports = app;