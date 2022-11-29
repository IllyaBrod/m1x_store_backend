const { StatusCodes } = require('http-status-codes');

const isAdmin = (req, res, next) => {
    if (req.user.isAdmin) {
        return next();
    }

    console.log(req.user);
    res.status(StatusCodes.UNAUTHORIZED).send("You are not allowed to do this action!");
};

module.exports = isAdmin;