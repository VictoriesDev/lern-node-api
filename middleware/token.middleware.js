const jwt = require("jsonwebtoken");
const { response } = require("../func/response.js");

// MODEL
const UserSchema = require("../models/users.model");
module.exports = async function (req, res, next) {
  try {
    const token = req.headers["authorization"]?.split(" ")[1];
    // console.log("token", token);

    if (!token) {
      return response(res, 401, {
        status: 401,
        message: "No token provided",
      });
    }
    console.log("token", token);

    const decoded = jwt.verify(token, "1234");
    console.log("decoded", decoded);
    const checkUser = await UserSchema.findById(decoded.id);
    if (!checkUser) {
      return response(res, 401, {
        status: 401,
        message: "Token not found",
      });
    }
    req.user_id = decoded.id;
    req.user_role = decoded.role;
    next();
  } catch (error) {
    return response(res, 401, {
      status: 401,
      message: "Invalid token",
    });
  }
};
