const { isEmpty } = require("lodash");
const Product = require("../models/product");
const { errorHandler } = require("../utils/error-handler");

exports.addProduct = async function (req, res, next) {
  errorHandler(req);

  const {
    name,
    description,
    price,
    category,
    sku,
    status = "available",
    quantity,
  } = req.body;

  const newProduct = new Product({
    name: name,
    description: description,
    price: price,
    category: category,
    sku: sku,
    status: status,
    quantity: quantity,
  });

  try {
    const result = await newProduct.save();

    res.status(201).json({
      success: true,
      message: "Product added",
      data: result,
    });
  } catch (err) {
    if (!res.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.updateProduct = async function (req, res, next) {
  errorHandler(req);
  const { name, description, price, category, sku, status, quantity, id } =
    req.body;

  try {
    const result = await Product.findByIdAndUpdate(id, {
      name: name,
      description: description,
      price: price,
      category: category,
      sku: sku,
      status: status,
      quantity: quantity,
    });

    res.status(200).json({
      success: true,
      message: "Product updated",
      data: result,
    });
  } catch (err) {
    if (!res.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.removeProduct = function (req, res, next) {
  errorHandler(req);

  const { id } = req.params;

  Product.findByIdAndRemove(id, (err, result) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product deleted",
      data: result,
    });
  });
};

exports.getProductById = async function (req, res, next) {
  errorHandler(req);

  try {
    const id = req.params.id;
    const productById = await Product.findById(id).populate("category");

    if (isEmpty(productById)) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Products found",
      data: productById,
    });
  } catch (err) {
    if (!res.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getProducts = async function (req, res, next) {
  errorHandler(req);

  try {
    const products = await Product.find().populate("category");

    res.status(200).json({
      success: true,
      message: "Products found",
      data: products,
    });
  } catch (err) {
    if (!res.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
