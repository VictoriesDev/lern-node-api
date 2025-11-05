var express = require("express");
var router = express.Router();
const multer = require("multer");
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
const tokenMiddleware = require("../../middleware/token.middleware");

const upload = multer({ storage: storage });
// MODEL
var UserSchema = require("../../models/users.model");

// TODO : update user
router.put("/:id/approve", async function (req, res, next) {
  const { id } = req.params;
  try {
    const updatedUser = await UserSchema.findByIdAndUpdate(
      id,
      {
        status: "approved",
      },
      { new: true }
    );

    return await response(res, 200, {
      status: "success",
      message: "User approved successfully",
      data: updatedUser,
    });
  } catch (error) {
    return await response(res, 500, {
      status: "error",
      message: error.message,
    });
  }
});

module.exports = router;
