
const express = require("express");
const { createOrder, getOrders } = require("../modules/order/orderController");



const router = express.Router();


// Create Order
router.post("/createOrder", createOrder);


// Get My Orders
router.get("/getOrders", getOrders);



module.exports = router;

