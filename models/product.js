const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    image: {
      type: Schema.Types.Array,
      required: false,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "category",
      required: true,
    },
    sku: {
      type: String,
      required: false,
    },
    status: {
      type: String,
      required: true,
      default: "available", //available and disabled
    },
    quantity: {
      type: Number,
      required: true,
      default: 1,
    },
    rating: {
      type: Number,
      default: 0,
    },
    reviews: {
      type: Schema.Types.ObjectId,
      ref: "review",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("product", productSchema);
