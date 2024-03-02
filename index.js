const express = require("express");
const PORT = process.env.PORT || 8080;
const mongoose = require("mongoose");
require("dotenv").config();

/**
 *
 * git branch -m main master
 * git fetch origin
 * git branch -u origin/master master
 * git remote set-head origin -a
 *
 */

// Import Router configuration
const authRoutes = require("./routes/auth");
const categoryRoutes = require("./routes/category");
const productRoutes = require("./routes/product");
const cartRoutes = require("./routes/cart");
const employeeRoutes = require("./routes/employee");

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

// Initial Route Configuration
app.use("/auth", authRoutes);
app.use("/category", categoryRoutes);
app.use("/product", productRoutes);
app.use("/cart", cartRoutes);
app.use("/employee", employeeRoutes);

app.use((error, req, res, next) => {
  const status = error.statusCode || 500;
  const message = error.data?.[0]?.msg || "Server Failure";
  res.status(status).json({
    success: false,
    message: message,
  });
});

mongoose
  .connect(
    `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASS}@cluster0.pnzdz4v.mongodb.net/?retryWrites=true&w=majority`
  )
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  }).catch((err) => {
    console.error('Error while listening on', err)
  });
