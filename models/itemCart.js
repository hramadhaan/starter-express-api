const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const itemCartSchema = new Schema({
  product: {
    type: Schema.Types.ObjectId,
    ref: "product",
  },
  quantity: {
    type: Number,
    default: 1,
  },
  isChecked: {
    type: Boolean,
    default: false,
  },
  itemPrice: {
    type: Number,
    default: 0,
  },
  cartId: {
    type: Schema.Types.ObjectId,
    ref: "cart",
  },
}, { timestamps: true });

module.exports = mongoose.model("itemcart", itemCartSchema);
