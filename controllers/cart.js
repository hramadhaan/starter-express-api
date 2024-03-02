const ItemCart = require("../models/itemCart");
const Cart = require("../models/cart");
const Auth = require("../models/auth");
const Product = require("../models/product");
const { errorHandler } = require("../utils/error-handler");
const { isEmpty } = require("lodash");

exports.addToCart = async (req, res, next) => {
  errorHandler(req);
  try {
    const userId = req.userId;
    const { product, isChecked = true, quantity } = req.body;
    const auth = await Auth.findById(userId);
    let cartId = auth?.cartId?.toString() ?? "";
    if (isEmpty(auth?.cartId?.toString())) {
      cartId = req.params.cartId ?? "";
    }
    console.log("Cart ID", cartId);

    // Create cart ID if user is not have cart
    if (isEmpty(cartId)) {
      console.log("Empty cart ID");
      const createCartId = new Cart({ items: [], price: 0, userId: userId });
      auth.cartId = createCartId;
      await auth.save();
      const saveCartId = await createCartId.save();
      cartId = saveCartId._id.toString();
    }

    // Check the product
    const productData = await Product.findById(product);
    if (isEmpty(productData)) {
      return res.status(404).json({
        message: "Product not found",
        success: false,
      });
    }

    const checkItemCart = await ItemCart.findOne({
      product: product,
      cartId: cartId,
    });

    console.log("Checking product", { checkItemCart, product, cartId });

    // Perkondisian kalo item cart di cart tersebut tidak ada
    if (isEmpty(checkItemCart)) {
      // Save the product data
      const newItemCart = new ItemCart({
        isChecked: isChecked,
        quantity: quantity,
        product: product,
        itemPrice: Number(productData.price * parseInt(quantity)),
        cartId: cartId,
      });
      // response of product data
      const itemCartData = await newItemCart.save();

      // Find the cart data
      const cartData = await Cart.findById(cartId);
      cartData.items.push(itemCartData._id.toString());
      cartData.price = Number(
        cartData.price + parseInt(quantity) * productData.price
      );
      cartData.totalQuantity = Number(
        cartData.totalQuantity + parseInt(quantity)
      );

      const saveCart = await cartData.save();

      res.status(201).json({
        success: true,
        message: "Cart saved successfully",
        data: {
          cartId: cartId,
          cart: saveCart,
        },
      });
    } else {
      // Perkondisian jika item cart sudah ada di cart user tersebut
      checkItemCart.quantity = Number(
        checkItemCart.quantity + parseInt(quantity)
      );
      checkItemCart.itemPrice = Number(
        checkItemCart.itemPrice + parseInt(quantity) * productData.price
      );
      await checkItemCart.save();

      // Find the cart data
      const cartData = await Cart.findById(cartId);
      cartData.price = Number(
        cartData.price + parseInt(quantity) * productData.price
      );
      cartData.totalQuantity = Number(
        cartData.totalQuantity + parseInt(quantity)
      );

      const saveCart = await cartData.save();

      res.status(201).json({
        success: true,
        message: "Cart updated successfully",
        data: {
          cartId: cartId,
          cart: saveCart,
        },
      });
    }
  } catch (err) {
    if (!res.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.udpateCart = async (req, res, next) => {
  errorHandler(req);
  try {
    const userId = req.userId;
    const auth = await Auth.findById(userId);
    let cartId = auth?.cartId?.toString() ?? "";
    if (isEmpty(auth?.cartId?.toString())) {
      cartId = req.params.cartId ?? "";
    }
    if (isEmpty(cartId)) {
      res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }
    const { itemCart, isChecked = true, quantity } = req.body;
    // Find the item cart
    const itemCartData = await ItemCart.findById(itemCart);
    if (isEmpty(itemCartData)) {
      res.status(404).json({
        message: "Item cart not found",
        success: false,
      });
    }
    const checkProduct = await Product.findById(itemCartData.product);
    itemCartData.isChecked = isChecked;
    itemCartData.quantity = parseInt(quantity);
    itemCartData.itemPrice = Number(checkProduct.price * parseInt(quantity));
    await itemCartData.save();
    const checkCartId = await Cart.findById(cartId).populate("items");
    let countNewPrice = 0;
    let countTotalQty = 0;
    checkCartId?.items?.forEach((item) => {
      console.log("Hanif: ", item);
      if (item.isChecked === true) {
        countNewPrice += parseInt(item.itemPrice);
        countTotalQty += parseInt(item.quantity);
      }
    });
    checkCartId.price = parseInt(countNewPrice);
    checkCartId.totalQuantity = parseInt(countTotalQty);
    const saveNewCartId = await checkCartId.save();

    res.status(201).json({
      message: "Cart saved successfully",
      success: true,
      data: {
        cartId: cartId,
        cart: saveNewCartId,
      },
    });
  } catch (err) {
    if (!res.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
