
const express = require("express");
const { getCart, addToCart } = require("../modules/cart/cartController");


  

const router = express.Router();


// Get user's cart
router.get("/getCart", getCart);


// Add product to cart
router.post("/addCart", addToCart);


module.exports = router;

