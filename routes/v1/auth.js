var express = require("express");
var router = express.Router();
const multer = require("multer");
var bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const { response } = require("../../func/response.js");
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
// MODEL
var UserSchema = require("../../models/users.model");

router.get("/", function (req, res, next) {
  res.send("API v1 - Login/Register");
});

// TODO : Register
router.post("/register", async function (req, res, next) {
  const { email, password } = req.body;

  const newUser = new UserSchema({
    email,
    password: await bcrypt.hash(password, 10),
    role: "admin",
    status: "approved",
  });

  await newUser.save();

  await response(res, 201, {
    status: "success",
    message: "User registered successfully",
  });
});

// TODO เข้าสู่ระบบ
router.post("/login", async (req, res, next) => {
  const { email, password } = req.body;
  console.log("email", email);
  const check_user = await UserSchema.findOne({ email });
  try {
    // ถ้าไม่พบ user
    if (check_user.email == "") {
      return await response(res, 400, {
        status: "error",
        message: "User not found",
      });
    }

    // check password
    const isPasswordValid = bcrypt.compare(password, check_user.password);
    if (!isPasswordValid) {
      return await response(res, 401, {
        status: "error",
        message: "Invalid password",
      });
    }

    if (check_user.status !== "approved") {
      return await response(res, 401, {
        status: "error",
        message: "User not approved",
      });
    }

    const token = jwt.sign(
      { id: check_user._id, role: check_user.role },
      "1234"
    );
    return await response(res, 200, {
      status: "success",
      token,
    });
  } catch (error) {
    console.log("error", error);
    return res.status(500).send({
      status: "error",
      message: "Internal server error",
    });
  }
});

module.exports = router;
