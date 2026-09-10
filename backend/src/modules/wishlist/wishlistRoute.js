const express = require("express");
const {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} = require("./wishlistController");

const router = express.Router();

// GET Wishlist
router.get("/", getWishlist);

// ADD Product to Wishlist
router.post("/add", addToWishlist);

// REMOVE Product from Wishlist
router.delete("/:productid", removeFromWishlist);

module.exports = router;
