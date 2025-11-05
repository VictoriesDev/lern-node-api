var express = require("express");
const ApiV1 = require("./v1/index.js");
const router = express.Router();

router.use("/v1", ApiV1);

module.exports = router;
