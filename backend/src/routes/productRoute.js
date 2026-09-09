const express = require("express");
const { getProducts, getProductById } = require("../modules/product/productController");

const router = express.Router();

// Get all products
router.get("/products", getProducts);

// Get single product
router.get("/products/:id", getProductById);
module.exports = router;
