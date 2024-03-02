const express = require("express");
const { body } = require("express-validator");

const employeeController = require("../controllers/employee");
const Employee = require("../models/employee");

const router = express.Router();

router.post(
  "/register",
  [
    body("password")
      .trim()
      .isLength({ min: 5 })
      .withMessage("Minimum password 5 length"),
    body("email")
      .trim()
      .custom((value) => {
        return Employee.findOne({ email: value }).then((user) => {
          if (user) {
            return Promise.reject("Email already exists");
          }
        });
      }),
  ],
  employeeController.registerEmployee
);
router.post("/login", employeeController.loginEmployee);

module.exports = router;
