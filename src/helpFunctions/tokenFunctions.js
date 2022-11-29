const jwt = require('jsonwebtoken');

const createAccessToken = (id, isAdmin, accessTokenSecret) => {
    const accessToken = jwt.sign({
        id: id,
        isAdmin: isAdmin,
    }, accessTokenSecret,
    { expiresIn: '15m' });

    return accessToken;
};

const createRefreshToken = (id, isAdmin, refreshTokenSecret) => {
    const refreshToken = jwt.sign({
        id: id,
        isAdmin: isAdmin,
    }, refreshTokenSecret,
    { expiresIn: '3d' });

    return refreshToken;
};

module.exports = {
    createAccessToken,
    createRefreshToken,
};
