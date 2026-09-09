
const Order = require("./orderModel");
const Cart = require("../cart/cartModel");
const Product = require("../product/productModel");


// ==========================================
// CREATE ORDER
// POST /api/orders
// ==========================================
exports.createOrder = async (req, res) => {
  try {
    const userId = req.user._id;

    const {
      shippingAddress,
      paymentMethod,
    } = req.body;

    // Check shipping address
    if (
      !shippingAddress ||
      !shippingAddress.name ||
      !shippingAddress.phone ||
      !shippingAddress.address ||
      !shippingAddress.city ||
      !shippingAddress.state ||
      !shippingAddress.pincode
    ) {
      return res.status(400).json({
        success: false,
        message: "Complete shipping address is required",
      });
    }

    // Get user's cart
    const cart = await Cart.findOne({
      user: userId,
    }).populate("items.product");

    // Check cart
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Your cart is empty",
      });
    }

    // Create order items
    const orderItems = cart.items.map((item) => {
      const product = item.product;

      return {
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        image: product.image || "",
      };
    });

    // Calculate total
    const totalAmount = orderItems.reduce(
      (total, item) => {
        return total + item.price * item.quantity;
      },
      0
    );

    // Create order
    const order = await Order.create({
      user: userId,
      items: orderItems,
      totalAmount,
      shippingAddress,
      paymentMethod: paymentMethod || "COD",
    });

    // Clear cart after order
    cart.items = [];
    await cart.save();

    // Populate user
    await order.populate("user", "name email");

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      data: order,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create order",
      error: error.message,
    });
  }
};


// ==========================================
// GET MY ORDERS
// GET /api/orders
// ==========================================
exports.getOrders = async (req, res) => {
  try {
    const userId = req.user._id;

    const orders = await Order.find({
      user: userId,
    })
      .populate("user", "name email")
      .populate("items.product", "name price image")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get orders",
      error: error.message,
    });
  }
};

