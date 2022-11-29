const { StatusCodes } = require('http-status-codes');
const { getOrCreateCart } = require('../helpFunctions/cartFunctions');
const isAuthenticated = require('../middleware/isAuthenticated');
const isAuthorized = require('../middleware/isAuthorized');
const Cart = require('../models/Cart');

const router = require('express').Router();

/**
 * GET cart by user id
 */
router.get('/:userId', async (req, res) => {
    const foundCart = await getOrCreateCart(req.params.userId);

    res.status(StatusCodes.OK).send(foundCart);
});

/**
 * PUT request
 */
router.put('/:userId', isAuthenticated, isAuthorized, async (req, res) => {
    try {
        const updatedCart = await findOneAndUpdate({ userId: req.params.userId }, 
            {
                $set: req.body,
            },
            { new: true }
        );
    
        res.status(StatusCodes.OK).send(updatedCart);
    } catch (err) {
        res.status(StatusCodes.BAD_REQUEST).send(err.message);
    }
});

module.exports = router;
