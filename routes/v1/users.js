var express = require("express");
var router = express.Router();
const multer = require("multer");
var bcrypt = require("bcrypt");
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
const tokenMiddleware = require("../../middleware/token.middleware");

const upload = multer({ storage: storage });
// MODEL
var UserSchema = require("../../models/users.model");

// TODO : get users
router.get("/", async function (req, res, next) {
  let users = await UserSchema.find({});
  res.send({
    status: "success",
    data: users,
  });
});

// TODO : create user
router.post("/insert", async function (req, res, next) {
  const { name, age, password } = req.body;

  console.log(name);
  console.log(age);
  const newUser = new UserSchema({
    name,
    age,
    password: await bcrypt.hash(password, 10),
  });
  await newUser.save();
  res.send({
    status: "success",
  });
});

// TODO : update user
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
      password: await bcrypt.hash(password, 10),
    });
    await newUser.save();
    res.send({
      status: "success",
      token,
    });
  }
);

router.post("/login", async (req, res, next) => {
  const { name, password } = req.body;
  const user = await UserSchema.findOne({ name });
  try {
    if (!user) {
      return res.status(401).send({
        status: "error",
        message: "User not found",
      });
    }

    // check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).send({
        status: "error",
        message: "Invalid password",
      });
    }
    const token = jwt.sign({ id: user._id }, "1234");
    return res.send({
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
