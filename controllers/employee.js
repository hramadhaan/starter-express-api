const Employee = require("../models/employee");
const { errorHandler } = require("../utils/error-handler");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { isEmpty } = require("lodash");

exports.registerEmployee = async (req, res, next) => {
  errorHandler(req);
  try {
    const { email, password, role, name } = req.body;
    const encryptedPassword = await bcryptjs.hash(password, 12);
    const employee = new Employee({
      email: email,
      password: encryptedPassword,
      role: role,
      name,
    });

    const responseEmployee = await employee.save();

    res.status(201).json({
      message: "Registered employee successfully",
      success: true,
      data: responseEmployee,
    });
  } catch (err) {
    if (!res.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.loginEmployee = async (req, res, next) => {
  errorHandler(req);
  try {
    const { email, password } = req.body;
    const findEmployee = await Employee.findOne({ email: email });
    if (isEmpty(findEmployee)) {
      return res.status(404).json({
        message: "Employee not found",
        success: false,
      });
    }

    const isMatch = await bcryptjs.compare(password, findEmployee.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
        success: false,
      });
    }

    const token = jwt.sign(
      {
        employeeId: findEmployee._id.toString(),
      },
      process.env.JWT_SECRET
    );

    res.status(201).json({
      message: "Logged in successfully",
      success: true,
      data: {
        token: token,
        employee: findEmployee,
      },
    });
  } catch (err) {
    if (!res.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
