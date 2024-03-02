const express = require("express");
const isAuth = require("../middleware/authentication");
// const { body } = require("express-validator");

// const Category = require("../models/category");

const categoryController = require("../controllers/category");

const router = express.Router();

router.post("/create", isAuth, categoryController.createCategory);
router.post("/update", isAuth, categoryController.updateCategory);
router.get("/remove/:id", isAuth, categoryController.removeCategory);
router.get("/show", categoryController.showCategory);
router.get("/show/:id", categoryController.showCategoryById);

module.exports = router;
