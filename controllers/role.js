const Role = require("../models/role");
const { errorHandler } = require("../utils/error-handler");

exports.addRole = async (req, res, next) => {
  errorHandler(req, res, next);

  const { name } = req.body;
  try {
    const role = new Role({ name });
    const responseRole = await role.save();

    res.status(201).json({
      success: true,
      message: "Role added successfully",
      data: responseRole,
    });
  } catch (err) {
    if (!res.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.showRole = async (req, res, next) => {
  errorHandler(req, res, next);

  try {
    const responseRole = await Role.find();
    res.status(200).json({
      success: true,
      message: "Role fetched successfully",
      data: responseRole,
    });
  } catch (err) {
    if (!res.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
