var express = require("express");
var router = express.Router();
const multer = require("multer");
var bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const { response } = require("../../func/response.js");

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
  });

  await newUser.save();

  return await response(res, 201, {
    status: 201,
    message: "สมัคร User สำเร็จ",
  });
});

// TODO เข้าสู่ระบบ
router.post("/login", async (req, res, next) => {
  const { email, password } = req.body;
  const check_user = await UserSchema.findOne({ email });
  try {
    // ถ้าไม่พบ user
    if (check_user.email == "") {
      return await response(res, 400, {
        status: 400,
        message: "ไม่พบผู้ใช้ในระบบ",
      });
    }

    // check password
    const isPasswordValid = bcrypt.compare(password, check_user.password);
    if (!isPasswordValid) {
      return await response(res, 401, {
        status: 401,
        message: "รหัสผ่านไม่ถูกต้อง",
      });
    }

    if (check_user.status_approve !== true) {
      return await response(res, 401, {
        status: 401,
        message: "ผู้ใช้ยังไม่ได้รับการอนุมัติ",
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
    return response(res, 500, {
      status: 500,
      message: "Internal server error",
    });
  }
});

module.exports = router;
