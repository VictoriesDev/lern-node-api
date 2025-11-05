var express = require("express");
const tokenMiddleware = require("../../middleware/token.middleware");
const AuthRouter = require("./auth.js");
const UserRouter = require("./users.js");
const router = express.Router();

// LOGIN
router.use("/", AuthRouter);
router.use("/users", tokenMiddleware, UserRouter);

module.exports = router;
