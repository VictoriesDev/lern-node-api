var express = require("express");
const tokenMiddleware = require("../../middleware/token.middleware");
const AuthRouter = require("./authRoute.js");
const UserRouter = require("./usersRoute.js");
const ProductRouter = require("./productRoute.js");
const OrderRouter = require("./ordersRoute.js");
const router = express.Router();

// LOGIN
router.use("/", AuthRouter);
router.use("/users" , tokenMiddleware, UserRouter);
router.use("/products" , tokenMiddleware, ProductRouter);
router.use("/orders", tokenMiddleware, OrderRouter);

module.exports = router;
