const express = require("express");
const connectDB = require("./config/database");
const { cloudinaryConnect } = require("./config/cloudinary");
const testRoute = require("./Router/testRoute");
const authRoute = require("./Router/Auth");
const categoryRoute = require("./Router/Category");
const restaurantRoute = require("./Router/Restaurant");
const dishRoute = require("./Router/Dish");
const cartRoute = require("./Router/Cart");
const orderRoute = require("./Router/placeOrder");
const paymentRoute = require("./Router/Payment");
const cors = require("cors");

const fileUpload = require("express-fileupload");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(fileUpload({ useTempFiles: true }));
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

//database connected successfully
connectDB();

//cloudinary connection
cloudinaryConnect();

//routes
app.use("/api/v1", testRoute);
app.use("/api/v1", authRoute);
app.use("/api/v1", categoryRoute);
app.use("/api/v1", restaurantRoute);
app.use("/api/v1", dishRoute);
app.use("/api/v1", cartRoute);
app.use("/api/v1", orderRoute);
app.use("/api/v1", paymentRoute);

// test route
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

app.listen(PORT, () => {
  console.log(`🚀Server started on http://localhost:${PORT}`);
});
