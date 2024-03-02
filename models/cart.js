const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cartSchema = new Schema({
  items: {
    type: [Schema.Types.ObjectId],
    ref: "itemcart",
    default: []
  },
  price: {
    type: Number,
    default: 0,
  },
  totalQuantity: {
    type: Number,
    default: 0
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "auth",
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model("cart", cartSchema);
