const { StatusCodes } = require('http-status-codes');

const router = require('express').Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

router.post('/payment', (req, res) => {
    stripe.charges.create({
        source: req.body.tokenId,
        amount: req.body.amount,
        currency: 'usd',
    }, (stripeErr, stripeRes) => {
        if (stripeErr) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(stripeErr);
        } else {
            res.status(StatusCodes.OK).send(stripeRes);
        }
    })
})

module.exports = router;