const express = require("express");
const isAuth = require("../middleware/employee");
const productController = require("../controllers/product");

const router = express.Router();

router.post("/create", isAuth, productController.addProduct);
router.post("/udpate", isAuth, productController.updateProduct);
router.get("/remove/:id", isAuth, productController.removeProduct);
router.get("/show", productController.getProducts);
router.get("/show/:id", productController.getProductById);
router.get("/:id", productController.getProductsByCategory);

module.exports = router;
