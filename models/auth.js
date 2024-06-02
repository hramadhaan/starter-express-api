const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const authSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
    },
    avatar: {
      type: String,
    },
    cartId: {
      type: Schema.Types.ObjectId,
      ref: "cart",
    },
    role: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "role",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("auth", authSchema);
