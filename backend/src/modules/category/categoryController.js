// Import the Category model to interact with the categories collection in the database
const Category = require("./cateroryModel");

// Controller method to handle category creation
exports.createCategory = async (req, res) => {
  try {
    // Extract name, description, and image from the request body
    const { name, description, image } = req.body;

    // Check if the required name field is provided
    if (!name) {
      // Return a 400 Bad Request if validation fails
      return res.status(400).json({
        success: false, // Indicate failure
        message: "Category name is required", // Error message
      });
    }

    // Check if a category with the same name already exists (ignoring leading/trailing spaces)
    const existingCategory = await Category.findOne({
      name: name.trim(),
    });

    // If a category with the same name is found
    if (existingCategory) {
      // Return a 409 Conflict indicating a duplicate entry
      return res.status(409).json({
        success: false, // Indicate failure
        message: "Category already exists", // Error message
      });
    }

    // Create a new category document in the database
    const category = await Category.create({
      name: name.trim(), // Save the trimmed name
      description, // Save the description
      image, // Save the image URL or path
    });

    // Return a 201 Created response indicating successful creation
    res.status(201).json({
      success: true, // Indicate successful operation
      message: "Category created successfully", // Success message
      data: category, // Return the created category object
    });
  } catch (error) {
    // Return a 500 Internal Server Error if something goes wrong
    res.status(500).json({
      success: false, // Indicate failure
      message: "Failed to create category", // High-level error message
      error: error.message, // Detailed error message
    });
  }
};

// Controller method to fetch all categories
exports.getCategories = async (req, res) => {
  try {
    // Retrieve all category documents from the database, sorted by creation date (newest first)
    const categories = await Category.find().sort({ createdAt: -1 });

    // Return a 200 OK response with the fetched categories
    res.status(200).json({
      success: true, // Indicate successful operation
      count: categories.length, // Include the total number of categories found
      data: categories, // The array of category objects
    });
  } catch (error) {
    // Return a 500 Internal Server Error if the query fails
    res.status(500).json({
      success: false, // Indicate failure
      message: "Failed to get categories", // High-level error message
      error: error.message, // Detailed error message
    });
  }
};

// Controller method to fetch a single category by its unique ID
exports.getCategoryById = async (req, res) => {
  try {
    // Search the database for a category using the ID from the route parameters
    const category = await Category.findById(req.params.id);

    // If no category is found with the given ID
    if (!category) {
      // Return a 404 Not Found response
      return res.status(404).json({
        success: false, // Indicate failure
        message: "Category not found", // Error message
      });
    }

    // Return a 200 OK response with the found category
    res.status(200).json({
      success: true, // Indicate successful operation
      data: category, // The category object
    });
  } catch (error) {
    // Return a 500 Internal Server Error if the query fails (e.g., invalid ID format)
    res.status(500).json({
      success: false, // Indicate failure
      message: "Failed to get category", // High-level error message
      error: error.message, // Detailed error message
    });
  }
};

// Controller method to update an existing category
exports.updateCategory = async (req, res) => {
  try {
    // Extract the updated fields from the request body
    const { name, description, image, isActive } = req.body;

    // Find the category by ID and update it with the new values
    const category = await Category.findByIdAndUpdate(
      req.params.id, // The ID of the category to update
      {
        name,
        description,
        image,
        isActive, // Update active status if provided
      },
      {
        new: true, // Return the modified document rather than the original
        runValidators: true, // Run model validators on the update operation
      },
    );

    // If the category with the given ID was not found
    if (!category) {
      // Return a 404 Not Found response
      return res.status(404).json({
        success: false, // Indicate failure
        message: "Category not found", // Error message
      });
    }

    // Return a 200 OK response with the updated category
    res.status(200).json({
      success: true, // Indicate successful operation
      message: "Category updated successfully", // Success message
      data: category, // The updated category object
    });
  } catch (error) {
    // Return a 500 Internal Server Error if the update operation fails
    res.status(500).json({
      success: false, // Indicate failure
      message: "Failed to update category", // High-level error message
      error: error.message, // Detailed error message
    });
  }
};

// Controller method to delete a category
exports.deleteCategory = async (req, res) => {
  try {
    // Find the category by ID and remove it from the database
    const category = await Category.findByIdAndDelete(req.params.id);

    // If the category with the given ID was not found
    if (!category) {
      // Return a 404 Not Found response
      return res.status(404).json({
        success: false, // Indicate failure
        message: "Category not found", // Error message
      });
    }

    // Return a 200 OK response indicating successful deletion
    res.status(200).json({
      success: true, // Indicate successful operation
      message: "Category deleted successfully", // Success message
    });
  } catch (error) {
    // Return a 500 Internal Server Error if the deletion operation fails
    res.status(500).json({
      success: false, // Indicate failure
      message: "Failed to delete category", // High-level error message
      error: error.message, // Detailed error message
    });
  }
};
