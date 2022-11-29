const { StatusCodes } = require('http-status-codes');
const Cart = require('../models/Cart')

const getOrCreateCart = async (userId) => {
    const foundCart = await checkIfCartExists(userId);
    if (foundCart) return foundCart;

    const cart = new Cart({
        userId: userId,
        products: [],
        amount: 0,
    });

    try {
        const savedCart = await cart.save();
        return savedCart;
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).send('Could not create a cart');
    }
}

const checkIfCartExists = async (userId) => {
    const foundCart = await Cart.findOne({ userId: userId });

    return foundCart;
}

module.exports = {
    getOrCreateCart,
}