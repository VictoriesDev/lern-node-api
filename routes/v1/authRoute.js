var express = require("express");
var router = express.Router();
const multer = require("multer");
var bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const { response } = require("../../func/response.js");
const tokenMiddleware = require("../../middleware/token.middleware");
// MODEL
var UserSchema = require("../../models/users.model");

router.get("/", function (req, res, next) {
  res.send("API v1 - Login/Register");
});

// TODO : Register
router.post("/register", async function (req, res, next) {
  const { email, password } = req.body;

  try {
    const newUser = new UserSchema({
      email,
      password: await bcrypt.hash(password, 10),
    });

    await newUser.save();

    const cut_data = {
      _id: newUser._id,
      email: newUser.email,
    };

    return await response(res, 201, {
      status: 201,
      message: "สมัคร User สำเร็จ",
      data: cut_data || [],
    });
  } catch (error) {
    return await response(res, 500, {
      status: 500,
      message: error.message,
      data: null,
    });
  }
});

// TODO เข้าสู่ระบบ
router.post("/login", async (req, res, next) => {
  const { email, password } = req.body;
  console.log("email", email);
  const check_user = await UserSchema.findOne({ email });
  try {
    // ถ้าไม่พบ user
    if (!check_user) {
      return await response(res, 400, {
        status: 400,
        message: "ไม่พบผู้ใช้ในระบบ",
        data: null,
      });
    }

    // check password
    const isPasswordValid = bcrypt.compare(password, check_user.password);
    if (!isPasswordValid) {
      return await response(res, 401, {
        status: 401,
        message: "รหัสผ่านไม่ถูกต้อง",
        data: null,
      });
    }

    // if (check_user.status_approve !== true) {
    //   return await response(res, 401, {
    //     status: 401,
    //     message: "ผู้ใช้ยังไม่ได้รับการอนุมัติ",
    //     data: null,
    //   });
    // }

    const token = jwt.sign(
      { id: check_user._id, role: check_user.role },
      "1234"
    );

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 3600000,
      secure: true,
    });
    return await response(res, 200, {
      status: "200",
      message: "เข้าสู่ระบบสำเร็จ",
    });
  } catch (error) {
    console.log("error", error);
    return response(res, 500, {
      status: 500,
      message: "Internal server error",
      data: null,
    });
  }
});

// TODO checktoken
router.get("/token-info", async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return await response(res, 401, {
        status: 401,
        message: "No token provided",
      });
    }

    const decoded = jwt.verify(token, "1234");
    console.log("decoded", decoded);
    return await response(res, 200, {
      status: 200,
      message: "Token ใช้งานได้",
      data: decoded,
    });
  } catch (error) {
    console.log("error", error);
  }
});

router.post("/logout", async (req, res, next) => {
  try {
    res.clearCookie("token");
    return await response(res, 200, {
      status: 200,
      message: "Logout สำเร็จ",
    });
  } catch (error) {
    return await response(res, 500, {
      status: 500,
      message: error.message,
      data: null,
    });
  }
});

module.exports = router;
