var express = require("express");
const tokenMiddleware = require("../../middleware/token.middleware");
const AuthRouter = require("./auth.js");
const UserRouter = require("./users.js");
const ProductRouter = require("./product.js");
const OrderRouter = require("./orders.js");
const router = express.Router();

// LOGIN
router.use("/", AuthRouter);
router.use("/users", tokenMiddleware, UserRouter);
router.use("/products", tokenMiddleware, ProductRouter);
router.use("/orders", tokenMiddleware, OrderRouter);

module.exports = router;
