var express = require("express");
var router = express.Router();
const multer = require("multer");
const tokenMiddleware = require("../middleware/token.middleware");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/images");
  },
  filename: function (req, file, cb) {
    const filename = new Date().getTime() + "-" + file.originalname;
    cb(null, filename);
  },
});

const upload = multer({ storage: storage });
/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.get("/home", tokenMiddleware, function (req, res, next) {
  res.send("Welcome to home page");
});

module.exports = router;
