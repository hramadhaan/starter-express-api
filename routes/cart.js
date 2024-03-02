const express = require("express");
const isAuth = require("../middleware/authentication");

const cartController = require("../controllers/cart");
const cartV2Controller = require('../controllers/v2/cart')

const router = express.Router();

router.post("/add-to-cart/:cartId", isAuth, cartController.addToCart);
router.post("/add-to-cart", isAuth, cartController.addToCart);
router.post("/update-cart/:cartId", isAuth, cartController.udpateCart);
router.post('/update-cart', isAuth, cartController.udpateCart)
// Cart V2
router.post('/v2/add-to-cart', isAuth, cartV2Controller.addToCart)
router.post('/v2/update-cart', isAuth, cartV2Controller.updateCart)

module.exports = router;
