const { StatusCodes } = require('http-status-codes');
const isAdmin = require('../middleware/isAdmin');
const isAuthenticated = require('../middleware/isAuthenticated');
const isAuthorized = require('../middleware/isAuthorized');
const Order = require('../models/Order');

const router = require('express').Router();

/**
 * GET all orders (only admin)
 */
router.get('', isAuthenticated, isAdmin, async (req, res) => {
    const foundOrders = await Order.find(req.query);

    res.status(OK).send(foundOrders);
});

/**
 * GET orders for user (only logged in user)
 */
router.get('/:userId', isAuthenticated, isAuthorized, async (req, res) => {
    const foundOrders = await Order.find({ userId: req.params.userId });

    res.status(StatusCodes.OK).send(foundOrders);
});

/**
 * GET order by id
 */
router.get('/:id', isAuthenticated, isAdmin, async (req, res) => {
    const foundOrder = await Order.findById(req.params.id);

    if (foundOrder) {
        res.status(StatusCodes.OK).send(foundOrder);
    }

    res.status(StatusCodes.NOT_FOUND).send('Order with id ' + req.params.id + ' was not found');
})

/**
 * POST order
 */
router.post('/addOrder', async (req, res) => {
    const newOrder = new Order({
        userId: req.body.userId,
        products: req.body.products,
        address: req.body.address,
        amount: req.body.amount,
    });

    try {
        const savedOrder = await newOrder.save();

        res.status(StatusCodes.OK).send(savedOrder);
    } catch (err) {
        res.status(StatusCodes.BAD_REQUEST).send(err.message);
    }
});

module.exports = router;