const { StatusCodes } = require('http-status-codes');
const jwt = require('jsonwebtoken');
const { createAccessToken } = require('../helpFunctions/tokenFunctions');

const isAuthenticated = (req, res, next) => {
    const token = getTokenFromRequest(req);

    // Check if access token exists
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                // NOT SURE I CAN DO IT IN MIDDLEWARE/HERE

                // If access token expired we check refresh token
                const refreshToken = req.cookies.refreshToken;

                if (refreshToken) {
                    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET,
                        (err, user) => {
                            if (err) {
                                res.status(StatusCodes.FORBIDDEN).send(err);
                            } else {
                                // If refresh token is verified, create a new access token
                                const accessToken = createAccessToken(user.id, user.isAdmin, process.env.JWT_SECRET);

                                // Add new access token to user object in request so we can access this token and send it from the router
                                user.token = accessToken;
                                req.user = user;
                                return next();
                            }
                        });
                } else {
                    res.status(StatusCodes.FORBIDDEN).send(err);
                }
                // res.status(StatusCodes.FORBIDDEN).send(err);
            } else {
                req.user = user;
                return next();
            }
        });
    } else {
        res.status(StatusCodes.UNAUTHORIZED).send('Wrong credentials!');
    }
};

const getTokenFromRequest = (req) => {
    const authHeader = req.headers['authorization'];

    if (authHeader) {
        return authHeader.split(' ')[1];
    }

    return false;
};

module.exports = isAuthenticated;
