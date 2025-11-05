const jwt = require("jsonwebtoken");

// MODEL
const UserSchema = require("../models/users.model");
module.exports = async function (req, res, next) {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res
        .status(401)
        .send({ status: "error", message: "No token provided" });
    }
    console.log("token", token);

    const decoded = jwt.verify(token, "1234");
    console.log("decoded", decoded);
    const checkUser = await UserSchema.findById(decoded.id);
    if (!checkUser) {
      return res
        .status(401)
        .send({ status: "error", message: "User not found" });
    }
    console.log("Login ผ่านแล้วนะ");
    next();
  } catch (error) {
    return res.status(401).send({ status: "error", message: "Invalid token" });
  }
};
