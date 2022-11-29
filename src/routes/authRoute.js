const router = require("express").Router();
const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const bcrypt = require("bcrypt");
const { createAccessToken, createRefreshToken } = require("../helpFunctions/tokenFunctions");
const isAuthenticated = require("../middleware/isAuthenticated");
const { getOrCreateCart } = require("../helpFunctions/cartFunctions");

/**
 * Registering the user
 */
router.post("/register", async (req, res) => {
  const newUser = new User({
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 10),
  });

  try {
    const savedUser = await newUser.save();
    const accessToken = createAccessToken(foundUser._id, foundUser.isAdmin, process.env.JWT_SECRET);

    const refreshToken = createRefreshToken(foundUser._id, foundUser.isAdmin, process.env.JWT_REFRESH_SECRET);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      path: '/'
    });

    res.status(StatusCodes.OK).send({...savedUser, token: accessToken});
  } catch (err) {
    res.status(StatusCodes.BAD_REQUEST).send(err);
  }
});

/**
 * Login user and create cart if it does not exist
 */
router.get("", async (req, res) => {
  const foundUser = await User.findOne({email: req.body.email});

  if (foundUser) {
    const passwordsMatch = bcrypt.compareSync(req.body.password, foundUser.password);

    if (passwordsMatch) {
      // TODO: add this token to database
      
      const accessToken = createAccessToken(foundUser._id, foundUser.isAdmin, process.env.JWT_SECRET);

      const refreshToken = createRefreshToken(foundUser._id, foundUser.isAdmin, process.env.JWT_REFRESH_SECRET);

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        path: '/'
      });
      res.status(StatusCodes.OK).send({...foundUser._doc, token: accessToken});
    } else {
      res.status(StatusCodes.UNAUTHORIZED).send("Password incorrect!");
    }
  } else {
    res.status(StatusCodes.NOT_FOUND).send(`There is no registered user with email ${req.body.email}`)
  }
});

/**
 * Log out
 */
router.delete("/logout", isAuthenticated, async (req, res) => {
  res.clearCookie("refreshToken");
  res.send("Logged out successfully");
});

module.exports = router;