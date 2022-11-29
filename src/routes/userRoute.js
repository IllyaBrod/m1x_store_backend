const router = require('express').Router();
const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');
const bcrypt = require('bcrypt');

const isAuthenticated = require('../middleware/isAuthenticated');
const isAuthorized = require('../middleware/isAuthorized');
const isAdmin = require('../middleware/isAdmin');

/**
 * GET all users
 */
router.get('', isAuthenticated, isAdmin, async (req, res) => {
    const users = await User.find();
    const allUsers = users.filter(user => user._id != req.user.id);

    res.status(StatusCodes.OK).send(allUsers);
});

/**
 * PUT request
 */
router.put('/:id', isAuthenticated, isAuthorized, async (req, res) => {
    if (req.body.password) {
        req.body.password = bcrypt.hashSync(req.body.password, 10);
    }

    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, 
            {
                $set: req.body,
            },
            { new: true } // test this line with false and see what happens
        );

        res.status(StatusCodes.OK).send({ ...updatedUser._doc, token: req.user.token });
    } catch (err) {
        res.status(StatusCodes.NOT_FOUND).send(err);
    }
});

/**
 * DELETE request
 */
router.delete('/:id', isAuthenticated, isAuthorized, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);

        res.status(StatusCodes.OK).send(`User with id ${req.params.id} was deleted`);
    } catch (err) {
        res.status(StatusCodes.BAD_REQUEST).send(err);
    }
})

module.exports = router;
