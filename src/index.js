const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");

// Routers
const authRoute = require("./routes/authRoute");
const userRoute = require("./routes/userRoute");
const watchRoute = require("./routes/watchRoute");
const cartRoute = require("./routes/cartRoute");
const orderRoute = require("./routes/orderRoute");
const imageRoute = require("./routes/imageRoute");

dotenv.config();
const port = process.env.PORT || 3000;

mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log("DB is connected successfully"))
    .catch((error) => console.log(error));

app.use(cookieParser());
app.use(express.json());

app.use("/auth", authRoute);
app.use("/users", userRoute);
app.use("/products", watchRoute);
app.use("/carts", cartRoute);
app.use("/orders", orderRoute);
app.use("/images", imageRoute);

app.listen(port, () => {
  console.log("Server is running on port " + port);
});


