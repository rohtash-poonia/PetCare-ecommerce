
const Cart = require("./cartModel");
const Product = require("../product/productModel");


// ==========================================
// GET CART
// GET /api/cart
// ==========================================
exports.getCart = async (req, res) => {
  try {
    const userId = req.user._id;

    const cart = await Cart.findOne({
      user: userId,
    }).populate("items.product");

    // Cart doesn't exist
    if (!cart) {
      return res.status(200).json({
        success: true,
        message: "Cart is empty",
        data: {
          items: [],
        },
      });
    }

    res.status(200).json({
      success: true,
      data: cart,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get cart",
      error: error.message,
    });
  }
};


// ==========================================
// ADD TO CART
// POST /api/cart/add
// ==========================================
exports.addToCart = async (req, res) => {
  try {
    const userId = req.user._id;

    const { productId, quantity } = req.body;

    // Validation
    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    const itemQuantity = quantity || 1;

    if (itemQuantity < 1) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be at least 1",
      });
    }

    // Check product
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Find user's cart
    let cart = await Cart.findOne({
      user: userId,
    });

    // If cart doesn't exist, create it
    if (!cart) {
      cart = await Cart.create({
        user: userId,
        items: [
          {
            product: productId,
            quantity: itemQuantity,
          },
        ],
      });

      await cart.populate("items.product");

      return res.status(201).json({
        success: true,
        message: "Product added to cart",
        data: cart,
      });
    }

    // Check if product already exists
    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId
    );

    if (existingItem) {
      // Increase quantity
      existingItem.quantity += itemQuantity;
    } else {
      // Add new product
      cart.items.push({
        product: productId,
        quantity: itemQuantity,
      });
    }

    await cart.save();

    await cart.populate("items.product");

    res.status(200).json({
      success: true,
      message: "Product added to cart",
      data: cart,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to add product to cart",
      error: error.message,
    });
  }
};
