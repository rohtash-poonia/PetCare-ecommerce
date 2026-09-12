// Import the Cart model to interact with the carts collection in the database
const Cart = require("./cartModel");
// Import the Product model to interact with the products collection in the database
const Product = require("../product/productModel");


// ==========================================
// GET CART
// GET /api/cart
// ==========================================
exports.getCart = async (req, res) => {
  try {
    // Extract the user ID from the authenticated user's request object
    const userId = req.user._id;

    // Find the cart document belonging to the user and populate the product details for each item
    const cart = await Cart.findOne({
      user: userId, // Match cart by user ID
    }).populate("items.product"); // Replace product IDs with full product documents

    // If the cart doesn't exist for this user
    if (!cart) {
      // Return a 200 OK response with an empty items array
      return res.status(200).json({
        success: true, // Indicate successful operation
        message: "Cart is empty", // Informational message
        data: {
          items: [], // Return an empty cart structure
        },
      });
    }

    // Return a 200 OK response with the populated cart data
    res.status(200).json({
      success: true, // Indicate successful operation
      data: cart, // Return the cart object
    });

  } catch (error) {
    // Return a 500 Internal Server Error if the database query fails
    res.status(500).json({
      success: false, // Indicate failure
      message: "Failed to get cart", // High-level error message
      error: error.message, // Detailed error message
    });
  }
};


// ==========================================
// ADD TO CART
// POST /api/cart/add
// ==========================================
exports.addToCart = async (req, res) => {
  try {
    // Extract the user ID from the authenticated user's request object
    const userId = req.user._id;

    // Extract the product ID and quantity from the request body
    const { productId, quantity } = req.body;

    // Validation: Check if a product ID is provided
    if (!productId) {
      // Return a 400 Bad Request if validation fails
      return res.status(400).json({
        success: false, // Indicate failure
        message: "Product ID is required", // Error message
      });
    }

    // Default quantity to 1 if not provided
    const itemQuantity = quantity || 1;

    // Validation: Ensure the quantity is at least 1
    if (itemQuantity < 1) {
      // Return a 400 Bad Request if validation fails
      return res.status(400).json({
        success: false, // Indicate failure
        message: "Quantity must be at least 1", // Error message
      });
    }

    // Check if the requested product actually exists in the database
    const product = await Product.findById(productId);

    // If the product is not found
    if (!product) {
      // Return a 404 Not Found response
      return res.status(404).json({
        success: false, // Indicate failure
        message: "Product not found", // Error message
      });
    }

    // Find the existing cart for the user
    let cart = await Cart.findOne({
      user: userId, // Match cart by user ID
    });

    // If the user does not have a cart yet
    if (!cart) {
      // Create a new cart document with the first item
      cart = await Cart.create({
        user: userId, // Associate cart with the user
        items: [
          {
            product: productId, // Add the product ID to the items array
            quantity: itemQuantity, // Set the initial quantity
          },
        ],
      });

      // Populate the product details in the newly created cart before returning
      await cart.populate("items.product");

      // Return a 201 Created response indicating the cart was created and item added
      return res.status(201).json({
        success: true, // Indicate successful operation
        message: "Product added to cart", // Success message
        data: cart, // Return the populated cart object
      });
    }

    // If the cart exists, check if the product is already in it
    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId
    );

    // If the product is already in the cart
    if (existingItem) {
      // Increase the existing item's quantity by the requested amount
      existingItem.quantity += itemQuantity;
    } else {
      // Add the new product as a new item in the cart's items array
      cart.items.push({
        product: productId, // Add the product ID
        quantity: itemQuantity, // Set the initial quantity
      });
    }

    // Save the updated cart document back to the database
    await cart.save();

    // Populate the product details for all items in the updated cart
    await cart.populate("items.product");

    // Return a 200 OK response indicating successful addition
    res.status(200).json({
      success: true, // Indicate successful operation
      message: "Product added to cart", // Success message
      data: cart, // Return the populated cart object
    });

  } catch (error) {
    // Return a 500 Internal Server Error if the operation fails
    res.status(500).json({
      success: false, // Indicate failure
      message: "Failed to add product to cart", // High-level error message
      error: error.message, // Detailed error message
    });
  }
};
