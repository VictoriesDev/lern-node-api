const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    email: { type: String },
    password: { type: String },
    role: { type: String, enum: ["seller", "buyer"], default: "buyer" },
    status_approve: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema, "users");
