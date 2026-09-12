// Import the Product model to interact with the products collection in the database
const Product = require("./productModel");

// Controller method to fetch all products
exports.getProducts = async (req, res) => {
  try {
    // Retrieve all product documents from the database
    const products = await Product.find();

    // Return a 200 OK response with the fetched products
    return res.status(200).json({
      success: true, // Indicate successful operation
      count: products.length, // Include the total number of products found
      products, // The array of product objects
    });
  } catch (error) {
    // Return a 500 Internal Server Error if something goes wrong during the database query
    return res.status(500).json({
      success: false, // Indicate failure
      message: "Failed to fetch products", // High-level error message
      error: error.message, // Detailed error message
    });
  }
};

// Controller method to fetch a single product by its unique ID
// GET /api/products/:id
exports.getProductById = async (req, res) => {
  try {
    // Extract the product ID from the route parameters (e.g., /products/123)
    const { id } = req.params;

    // Search the database for a product with the specified ID
    const product = await Product.findById(id);

    // If no product is found with the given ID
    if (!product) {
      // Return a 404 Not Found response
      return res.status(404).json({
        success: false, // Indicate failure
        message: "Product not found", // Error message
      });
    }

    // Return a 200 OK response with the found product
    return res.status(200).json({
      success: true, // Indicate successful operation
      product, // The product object
    });
  } catch (error) {
    // Return a 500 Internal Server Error if the database query fails (e.g., invalid ID format)
    return res.status(500).json({
      success: false, // Indicate failure
      message: "Failed to fetch product", // High-level error message
      error: error.message, // Detailed error message
    });
  }
};