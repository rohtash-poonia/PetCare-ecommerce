// Import the Order model to interact with the orders collection in the database
const Order = require("./orderModel");
// Import the Cart model to interact with the carts collection in the database
const Cart = require("../cart/cartModel");
// Import the Product model to interact with the products collection in the database
const Product = require("../product/productModel");


// ==========================================
// CREATE ORDER
// POST /api/orders
// ==========================================
exports.createOrder = async (req, res) => {
  try {
    // Extract the user ID from the authenticated user's request object
    const userId = req.user._id;

    // Extract shipping address and payment method from the request body
    const {
      shippingAddress,
      paymentMethod,
    } = req.body;

    // Validation: Check if the shipping address is complete
    if (
      !shippingAddress ||
      !shippingAddress.name ||
      !shippingAddress.phone ||
      !shippingAddress.address ||
      !shippingAddress.city ||
      !shippingAddress.state ||
      !shippingAddress.pincode
    ) {
      // Return a 400 Bad Request if validation fails
      return res.status(400).json({
        success: false, // Indicate failure
        message: "Complete shipping address is required", // Error message
      });
    }

    // Get the user's cart from the database and populate the product details
    const cart = await Cart.findOne({
      user: userId, // Match cart by user ID
    }).populate("items.product"); // Populate full product data

    // Check if the cart exists and is not empty
    if (!cart || cart.items.length === 0) {
      // Return a 400 Bad Request if the cart is empty
      return res.status(400).json({
        success: false, // Indicate failure
        message: "Your cart is empty", // Error message
      });
    }

    // Create order items from the populated cart items
    const orderItems = cart.items.map((item) => {
      const product = item.product;

      // Structure the item for the order document
      return {
        product: product._id, // Product ID
        name: product.name, // Snapshot of the product name at time of order
        price: product.price, // Snapshot of the product price at time of order
        quantity: item.quantity, // Quantity ordered
        image: product.image || "", // Snapshot of the product image
      };
    });

    // Calculate the total amount for the order
    const totalAmount = orderItems.reduce(
      (total, item) => {
        return total + item.price * item.quantity;
      },
      0 // Initial total is 0
    );

    // Create a new order document in the database
    const order = await Order.create({
      user: userId, // Associate order with the user
      items: orderItems, // Add the generated order items
      totalAmount, // Set the calculated total
      shippingAddress, // Save the shipping address
      paymentMethod: paymentMethod || "COD", // Default to Cash On Delivery if not provided
    });

    // Clear the user's cart after the order is successfully placed
    cart.items = [];
    await cart.save(); // Save the cleared cart

    // Populate the user field in the response with just name and email
    await order.populate("user", "name email");

    // Return a 201 Created response indicating successful order placement
    res.status(201).json({
      success: true, // Indicate successful operation
      message: "Order placed successfully", // Success message
      data: order, // Return the newly created order object
    });

  } catch (error) {
    // Return a 500 Internal Server Error if something goes wrong
    res.status(500).json({
      success: false, // Indicate failure
      message: "Failed to create order", // High-level error message
      error: error.message, // Detailed error message
    });
  }
};


// ==========================================
// GET MY ORDERS
// GET /api/orders
// ==========================================
exports.getOrders = async (req, res) => {
  try {
    // Extract the user ID from the authenticated user's request object
    const userId = req.user._id;

    // Retrieve all orders belonging to this user
    const orders = await Order.find({
      user: userId, // Match by user ID
    })
      .populate("user", "name email") // Populate user name and email
      .populate("items.product", "name price image") // Populate basic product info for each item
      .sort({ createdAt: -1 }); // Sort by creation date, newest first

    // Return a 200 OK response with the fetched orders
    res.status(200).json({
      success: true, // Indicate successful operation
      count: orders.length, // Include the total number of orders found
      data: orders, // The array of order objects
    });

  } catch (error) {
    // Return a 500 Internal Server Error if the query fails
    res.status(500).json({
      success: false, // Indicate failure
      message: "Failed to get orders", // High-level error message
      error: error.message, // Detailed error message
    });
  }
};
