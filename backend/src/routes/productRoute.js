const express = require("express");
const { getProducts } = require("../modules/product/productController");

const router = express.Router();

router.get("/products", getProducts);

module.exports = router;
