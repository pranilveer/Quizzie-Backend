const express = require("express");
const { login, register } = require("../controllers/auth");

const authRouter = express.Router();

authRouter.route("/signup").post(register);
authRouter.route("/login").post(login);

module.exports = authRouter;