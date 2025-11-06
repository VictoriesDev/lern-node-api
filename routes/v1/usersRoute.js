var express = require("express");
var router = express.Router();
const multer = require("multer");
const { response } = require("../../func/response.js");

// MODEL
var UserSchema = require("../../models/users.model");

// TODO : update user
router.put("/:id/approve", async function (req, res, next) {
  const { id } = req.params;

  const userRole = req.user_role;
  try {
    if (userRole !== "admin") {
      return await response(res, 403, {
        status: 403,
        message: "คุณไม่มีสิทธิ์อนุมัติผู้ใช้",
        data: null,
      });
    }
    await UserSchema.findByIdAndUpdate(
      id,
      {
        status_approve: true,
      },
      { new: true }
    );

    return await response(res, 200, {
      status: 200,
      message: "อนุมัติผู้ใช้สำเร็จ",
      data: [],
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
