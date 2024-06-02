const { validationResult } = require("express-validator");

exports.errorHandler = function (req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation Failed");
    error.statusCode = 422;
    error.data = errors.array();
    next(error);
  }
};
