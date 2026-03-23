const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);

const cartRoutes = require('./routes/cart');
app.use('/api/cart', cartRoutes);
app.listen(5000, () => {
  console.log("Server running on port 5000");
});