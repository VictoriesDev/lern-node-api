var express = require("express");
var router = express.Router();
const multer = require("multer");
var brypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/images");
  },
  filename: function (req, file, cb) {
    const filename = new Date().getTime() + "-" + file.originalname;
    cb(null, filename);
  },
});
const tokenMiddleware = require("../middleware/token.middleware");

const upload = multer({ storage: storage });
// MODEL
var UserSchema = require("../models/users.model");

/* GET users listing. */
router.get("/", async function (req, res, next) {
  let users = await UserSchema.find({});
  res.send({
    status: "success",
    data: users,
  });
});

router.post("/", async function (req, res, next) {
  const { name, age, password } = req.body;

  console.log(name);
  console.log(age);
  const newUser = new UserSchema({
    name,
    age,
    password,
  });
  await newUser.save();
  res.send({
    status: "success",
  });
});

router.put("/:id", async function (req, res, next) {
  const { name, age, password } = req.body;
  const { id } = req.params;
  const updatedUser = await UserSchema.findByIdAndUpdate(
    id,
    {
      name,
      age,
      password,
    },
    { new: true }
  );
  res.send({
    status: "success",
    result: updatedUser,
  });
});

router.delete("/:id", async function (req, res, next) {
  const { id } = req.params;
  const deletedUser = await UserSchema.findByIdAndDelete(id);
  res.send({
    status: "success",
    result: deletedUser,
  });
});

// upload image
router.post(
  "/upload",
  [tokenMiddleware, upload.single("file")],
  async function (req, res, next) {
    const { name, age, password } = req.body;
    const newUser = new UserSchema({
      name,
      age,
      password: await brypt.hash(password, 10),
    });
    await newUser.save();

    const token = jwt.sign({ id: "TEST " }, "1234");
    res.send({
      status: "success",
      token,
    });
  }
);
module.exports = router;
