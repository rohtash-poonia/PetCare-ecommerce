
const Wishlist = require("./wishlistModel");
const Product = require("../product/productModel");


// ==========================================
// GET WISHLIST
// GET /api/wishlist
// ==========================================
exports.getWishlist = async (req, res) => {
  try {
    const userId = req.user._id;

    const wishlist = await Wishlist.findOne({
      user: userId,
    }).populate("products");

    // Wishlist doesn't exist
    if (!wishlist) {
      return res.status(200).json({
        success: true,
        message: "Wishlist is empty",
        data: {
          products: [],
        },
      });
    }

    res.status(200).json({
      success: true,
      count: wishlist.products.length,
      data: wishlist,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get wishlist",
      error: error.message,
    });
  }
};


// ==========================================
// ADD TO WISHLIST
// POST /api/wishlist/add
// ==========================================
exports.addToWishlist = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.body;

    // Check productId
    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    // Check product exists
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Find wishlist
    let wishlist = await Wishlist.findOne({
      user: userId,
    });

    // Create wishlist if it doesn't exist
    if (!wishlist) {
      wishlist = await Wishlist.create({
        user: userId,
        products: [productId],
      });

      await wishlist.populate("products");

      return res.status(201).json({
        success: true,
        message: "Product added to wishlist",
        data: wishlist,
      });
    }

    // Check product already exists
    const alreadyExists = wishlist.products.some(
      (id) => id.toString() === productId
    );

    if (alreadyExists) {
      return res.status(400).json({
        success: false,
        message: "Product already exists in wishlist",
      });
    }

    // Add product
    wishlist.products.push(productId);

    await wishlist.save();

    await wishlist.populate("products");

    res.status(200).json({
      success: true,
      message: "Product added to wishlist",
      data: wishlist,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to add product to wishlist",
      error: error.message,
    });
  }
};


// ==========================================
// REMOVE FROM WISHLIST
// DELETE /api/wishlist/:productid
// ==========================================
exports.removeFromWishlist = async (req, res) => {
  try {
    const userId = req.user._id;
    const productId = req.params.productid;

    // Find wishlist
    const wishlist = await Wishlist.findOne({
      user: userId,
    });

    if (!wishlist) {
      return res.status(404).json({
        success: false,
        message: "Wishlist not found",
      });
    }

    // Check product exists in wishlist
    const productExists = wishlist.products.some(
      (id) => id.toString() === productId
    );

    if (!productExists) {
      return res.status(404).json({
        success: false,
        message: "Product not found in wishlist",
      });
    }

    // Remove product
    wishlist.products = wishlist.products.filter(
      (id) => id.toString() !== productId
    );

    await wishlist.save();

    await wishlist.populate("products");

    res.status(200).json({
      success: true,
      message: "Product removed from wishlist",
      data: wishlist,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to remove product from wishlist",
      error: error.message,
    });
  }
};

