var express = require("express");
var userRoutes = require("./users.js");

const router = express.Router();

// เพิ่ม route หลักสำหรับ /api/v1/
router.get("/", (req, res) => {
  res.json({
    message: "Welcome to API v1",
    version: "1.0.0",
    endpoints: {
      users: "/api/v1/users",
    },
  });
});

router.use("/users", userRoutes);

module.exports = router;
