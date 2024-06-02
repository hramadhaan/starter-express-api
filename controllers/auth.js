const Auth = require("../models/auth");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { errorHandler } = require("../utils/error-handler");
const isEmpty = require("lodash/isEmpty");
require("dotenv").config();

exports.registration = async (req, res, next) => {
  errorHandler(req);

  const { name, email, password, phone, role } = req.body;

  try {
    const encryptedPassword = await bcryptjs.hash(password, 12);
    const dataAuth = new Auth({
      name,
      email,
      password: encryptedPassword,
      phone,
      role,
    });
    const authResponse = await dataAuth.save();

    res.status(201).json({
      success: true,
      message: "Registration Success",
      data: authResponse,
    });
  } catch (err) {
    if (!res.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.login = async (req, res, next) => {
  errorHandler(req, res, next);

  const { email, password } = req.body;

  try {
    const auth = await Auth.findOne({ email }).populate("role");

    if (isEmpty(auth)) {
      res.status(403).send({
        success: false,
        message: "Invalid Credentials",
      });
    }

    const passwordValidator = await bcryptjs.compare(password, auth.password);

    if (!passwordValidator) {
      res.status(403).send({
        success: false,
        message: "Password is incorrect",
      });
    }

    const token = jwt.sign(
      {
        userId: auth._id.toString(),
      },
      process.env.JWT_SECRET
    );

    res.status(201).json({
      success: true,
      message: "Login successful",
      token: token,
      data: auth,
    });
  } catch (err) {
    if (!res.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
