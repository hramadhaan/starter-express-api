const { isEmpty } = require("lodash")

const { errorHandler } = require("../../utils/error-handler")
// Models
const Auth = require('../../models/auth')
const Cart = require('../../models/cart')
const Product = require('../../models/product')
const ItemCart = require('../../models/itemCart')

/**
 * 
 * @param {'new' | 'update'} type 
 * @param {number} quantity 
 * @param {string} cartId 
 * @param {number} productPrice 
 * @param {string} itemCartId 
 * @returns 
 */
async function handlerChangeQtyPriceCartId(type, quantity, cartId, productPrice, itemCartId, res) {
    // Tambahkan item cart id ke cart id
    const cartIdLatest = await Cart.findById(cartId)
    if (type === 'new') {
        cartIdLatest.items.push(itemCartId)
    }
    cartIdLatest.price = Number(
        cartIdLatest.price + parseInt(quantity) * productPrice
    )
    cartIdLatest.totalQuantity = Number(
        cartIdLatest.totalQuantity + parseInt(quantity)
    )
    const saveCart = await cartIdLatest.save()
    let message = 'Berhasil menambahkan barang ke keranjang'
    if (type === 'update') {
        message = 'Berhasil mengubah quantity barang di keranjang'
    }
    res.status(201).json({
        message: message,
        success: true,
        data: await saveCart.populate(['items', 'userId'])
    })
    return
}

exports.addToCart = async (req, res, next) => {
    errorHandler(req)
    try {
        /**
         * 1. cek cartId user
         * 2. Buat cartId jika user tidak mempunyai cartId
         * 3. Membuat validasi jika ID item cart
         * 4. Jika ID item cart tersebut ada maka akan update quantity
         * 5. Jika ID item cart tersebut tidak ada makan akan membuat ID Item cart baru
         * 6. Jika ID Item cart tersebut ada maka tidak perlu ada penambahan ID di list items CART
         * 7. JIka ID Item cart tersebut tidak ada amaka perlu penamanbahan ID di list items CART
         */
        const userId = req.userId
        const { productId = '', quantity = 0, isChecked = true } = req.body
        const auth = await Auth.findById(userId)

        if (!auth) {
            res.status(403).json({
                message: 'User not found',
                success: false
            })
            return
        }

        let cartId = ''

        if (!isEmpty(auth?.cartId?.toString())) {
            cartId = auth?.cartId?.toString()
        } else {
            const newCartId = new Cart({ items: [], price: 0, totalQuantity: 0, userId: userId })
            const saveCartId = await newCartId.save()
            auth.cartId = saveCartId._id.toString()
            cartId = saveCartId._id.toString()
            await auth.save()
        }

        // Check product first
        const product = await Product.findById(productId)
        if (!product) {
            res.status(404).json({
                message: 'Product not found.',
                success: false
            })
            return
        }

        if (product.quantity < 1) {
            res.status(403).json({
                message: 'Stok produk habis.',
                success: false
            })
            return
        }

        // Check item cart
        const findCurrentItemCart = await ItemCart.findOne({
            product: product,
            cartId: cartId
        })

        let itemCartId = ''

        if (!findCurrentItemCart) {
            // Jika item cart id tidak ada
            const createNewItemCart = new ItemCart({ isChecked: isChecked, quantity: quantity, cartId: cartId, product: product, itemPrice: Number(parseInt(quantity) * product.price) })
            const saveNewItemCart = await createNewItemCart.save()
            itemCartId = saveNewItemCart._id.toString()

            handlerChangeQtyPriceCartId('new', quantity, cartId, product.price, itemCartId, res)
        } else {
            // jika ada item cart id
            itemCartId = findCurrentItemCart._id.toString()
            findCurrentItemCart.quantity = Number(
                findCurrentItemCart.quantity + parseInt(quantity)
            )
            findCurrentItemCart.itemPrice = Number(
                findCurrentItemCart.itemPrice + parseInt(quantity) * product.price
            )
            await findCurrentItemCart.save()
            handlerChangeQtyPriceCartId('update', quantity, cartId, product.price, itemCartId, res)
        }
    } catch (err) {
        console.log('Error v2 add to cart: ', err)
        if (!res.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.updateCart = async (req, res, next) => {
    errorHandler(req)
    try {
        // Payload Body
        const userId = req.userId
        const { quantity = 0, itemCartId = '', isChecked = true } = req.body

        /**
         * 1. Check Cart Id ada atau ga
         * 2. Check Item cart id ada atau ga
         * 3. Jika isChecked false maka qty & price pada cartId tidak terhitung
         */

        const auth = await Auth.findById(userId)
        if (!auth) {
            res.status(404).json({
                message: 'User not found',
                success: false
            })
        }
        const itemCart = await ItemCart.findById(itemCartId)
        if (!itemCart) {
            res.status(404).json({
                message: 'Item cart not found',
                success: false
            })
        }

        const product = await Product.findById(itemCart.product.toString())

        itemCart.isChecked = isChecked
        itemCart.itemPrice = Number(parseInt(quantity) * product.price)
        itemCart.quantity = Number(parseInt(quantity))
        await itemCart.save()

        const cartId = auth.cartId.toString()
        const cart = await Cart.findById(cartId).populate('items')
        let countTotalPrice = 0
        let countTotalQty = 0
        cart?.items?.forEach((item, index) => {
            if (item.isChecked === true) {
                countTotalPrice += parseInt(item.itemPrice)
                countTotalQty += parseInt(item.quantity)
            }
        })
        cart.price = countTotalPrice
        cart.totalQuantity = countTotalQty
        const saveNewCart = await cart.save()

        res.status(201).json({
            message: 'Cart saved successfully',
            success: true,
            data: await saveNewCart.populate('items')
        })


    } catch (err) {
        console.log('Error v2 update cart: ', err)
        if (!res.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}