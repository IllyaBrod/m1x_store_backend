const { StatusCodes } = require('http-status-codes');

const isAuthorized = (req, res, next) => {
    if (req.user.id == req.params.id) {
        return next();
    }

    console.log(req.user);
    res.status(StatusCodes.UNAUTHORIZED).send('You are not allowed to do this action!');
};

module.exports = isAuthorized;
