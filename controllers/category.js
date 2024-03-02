const { isEmpty } = require("lodash");
const Category = require("../models/category");
const { errorHandler } = require("../utils/error-handler");

exports.createCategory = async function (req, res, next) {
  errorHandler(req);

  const { name, description } = req.body;

  try {
    const category = new Category({
      name,
      description,
    });

    const responseCategory = await category.save();

    res.status(201).json({
      success: true,
      message: "Category saved successfully",
      data: responseCategory,
    });
  } catch (err) {
    if (!res.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.showCategory = async function (req, res, next) {
  errorHandler(req);

  const responseCategory = await Category.find();

  res.status(200).json({
    success: true,
    message: "Category fetched successfully",
    data: responseCategory,
  });
};

exports.showCategoryById = async function (req, res, next) {
  errorHandler(req);

  try {
    const { id } = req.params;

    const responseCategory = await Category.findById(id);

    if (isEmpty(responseCategory)) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Category found",
      data: responseCategory,
    });
  } catch (err) {
    if (!res.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.updateCategory = async function (req, res, next) {
  errorHandler(req);

  const { name, description, id } = req.body;

  const categoryById = await Category.findById(id);
  categoryById.name = name;
  categoryById.description = description;

  const responseCategory = await categoryById.save();

  res.status(201).json({
    success: true,
    message: "Category updated successfully",
    data: responseCategory,
  });
};

exports.removeCategory = async function (req, res, next) {
  errorHandler(req);
  const { id } = req.params;

  const responseCategory = await Category.findById(id);

  if (!responseCategory) {
    return res.status(404).json({
      success: false,
      message: "Category not found",
    });
  }

  const removeCategory = await Category.findByIdAndRemove(id);

  res.status(200).json({
    success: true,
    message: "Category deleted successfully",
    data: removeCategory,
  });
};
