// Import the Wishlist model to interact with the wishlists collection in the database
const Wishlist = require("./wishlistModel");
// Import the Product model to interact with the products collection in the database
const Product = require("../product/productModel");


// ==========================================
// GET WISHLIST
// GET /api/wishlist
// ==========================================
exports.getWishlist = async (req, res) => {
  try {
    // Extract the user ID from the authenticated user's request object
    const userId = req.user._id;

    // Find the wishlist document belonging to the user and populate the product details
    const wishlist = await Wishlist.findOne({
      user: userId, // Match wishlist by user ID
    }).populate("products"); // Replace product IDs with full product documents

    // If the wishlist doesn't exist for this user
    if (!wishlist) {
      // Return a 200 OK response with an empty products array
      return res.status(200).json({
        success: true, // Indicate successful operation
        message: "Wishlist is empty", // Informational message
        data: {
          products: [], // Return an empty wishlist structure
        },
      });
    }

    // Return a 200 OK response with the populated wishlist data
    res.status(200).json({
      success: true, // Indicate successful operation
      count: wishlist.products.length, // Include the total number of products in the wishlist
      data: wishlist, // Return the wishlist object
    });

  } catch (error) {
    // Return a 500 Internal Server Error if the database query fails
    res.status(500).json({
      success: false, // Indicate failure
      message: "Failed to get wishlist", // High-level error message
      error: error.message, // Detailed error message
    });
  }
};


// ==========================================
// ADD TO WISHLIST
// POST /api/wishlist/add
// ==========================================
exports.addToWishlist = async (req, res) => {
  try {
    // Extract the user ID from the authenticated user's request object
    const userId = req.user._id;
    // Extract the product ID from the request body
    const { productId } = req.body;

    // Validation: Check if a product ID is provided
    if (!productId) {
      // Return a 400 Bad Request if validation fails
      return res.status(400).json({
        success: false, // Indicate failure
        message: "Product ID is required", // Error message
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

    // Find the existing wishlist for the user
    let wishlist = await Wishlist.findOne({
      user: userId, // Match wishlist by user ID
    });

    // If the user does not have a wishlist yet
    if (!wishlist) {
      // Create a new wishlist document with the first product
      wishlist = await Wishlist.create({
        user: userId, // Associate wishlist with the user
        products: [productId], // Add the product ID to the products array
      });

      // Populate the product details in the newly created wishlist before returning
      await wishlist.populate("products");

      // Return a 201 Created response indicating the wishlist was created and product added
      return res.status(201).json({
        success: true, // Indicate successful operation
        message: "Product added to wishlist", // Success message
        data: wishlist, // Return the populated wishlist object
      });
    }

    // Check if the product is already in the wishlist
    const alreadyExists = wishlist.products.some(
      (id) => id.toString() === productId
    );

    // If the product is already in the wishlist
    if (alreadyExists) {
      // Return a 400 Bad Request indicating the duplicate
      return res.status(400).json({
        success: false, // Indicate failure
        message: "Product already exists in wishlist", // Error message
      });
    }

    // Add the new product ID to the wishlist's products array
    wishlist.products.push(productId);

    // Save the updated wishlist document back to the database
    await wishlist.save();

    // Populate the product details in the updated wishlist
    await wishlist.populate("products");

    // Return a 200 OK response indicating successful addition
    res.status(200).json({
      success: true, // Indicate successful operation
      message: "Product added to wishlist", // Success message
      data: wishlist, // Return the populated wishlist object
    });

  } catch (error) {
    // Return a 500 Internal Server Error if the operation fails
    res.status(500).json({
      success: false, // Indicate failure
      message: "Failed to add product to wishlist", // High-level error message
      error: error.message, // Detailed error message
    });
  }
};


// ==========================================
// REMOVE FROM WISHLIST
// DELETE /api/wishlist/:productid
// ==========================================
exports.removeFromWishlist = async (req, res) => {
  try {
    // Extract the user ID from the authenticated user's request object
    const userId = req.user._id;
    // Extract the product ID from the route parameters (e.g., /wishlist/123)
    const productId = req.params.productid;

    // Find the existing wishlist for the user
    const wishlist = await Wishlist.findOne({
      user: userId, // Match wishlist by user ID
    });

    // If the wishlist doesn't exist for this user
    if (!wishlist) {
      // Return a 404 Not Found response
      return res.status(404).json({
        success: false, // Indicate failure
        message: "Wishlist not found", // Error message
      });
    }

    // Check if the product is actually in the wishlist
    const productExists = wishlist.products.some(
      (id) => id.toString() === productId
    );

    // If the product is not in the wishlist
    if (!productExists) {
      // Return a 404 Not Found response
      return res.status(404).json({
        success: false, // Indicate failure
        message: "Product not found in wishlist", // Error message
      });
    }

    // Remove the product ID from the wishlist's products array using filter
    wishlist.products = wishlist.products.filter(
      (id) => id.toString() !== productId
    );

    // Save the updated wishlist document back to the database
    await wishlist.save();

    // Populate the product details in the updated wishlist
    await wishlist.populate("products");

    // Return a 200 OK response indicating successful removal
    res.status(200).json({
      success: true, // Indicate successful operation
      message: "Product removed from wishlist", // Success message
      data: wishlist, // Return the populated wishlist object
    });

  } catch (error) {
    // Return a 500 Internal Server Error if the operation fails
    res.status(500).json({
      success: false, // Indicate failure
      message: "Failed to remove product from wishlist", // High-level error message
      error: error.message, // Detailed error message
    });
  }
};
