const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const authenticateUser = async (req, res, next) => {
  const token = req.header("Authorization").split(" ")[1];
  console.log(token);
  if(token){
    return res.status(200).json({ success :" User Confirmed"});

  }

  if (!token) {
    return res.status(401).json({ error: "Unauthorized - Missing token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "defaultSecret");

    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ error: "Unauthorized - User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Unauthorized - Token expired" });
    }

    return res.status(401).json({ error: "Unauthorized - Invalid token" });
  }
};

module.exports = authenticateUser;
