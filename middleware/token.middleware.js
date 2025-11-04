const jwt = require("jsonwebtoken");
module.exports = async function (req, res, next) {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res
        .status(401)
        .send({ status: "error", message: "No token provided" });
    }

    req.auth = token;
    next();
  } catch (error) {
    return res.status(401).send({ status: "error", message: "Invalid token" });
  }
};
