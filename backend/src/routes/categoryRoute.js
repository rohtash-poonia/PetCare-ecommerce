
const express = require("express");

const {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");

const router = express.Router();

// Create Category
router.post("/", createCategory);

// Get All Categories
router.get("/", getCategories);

// Get Single Category
router.get("/:id", getCategoryById);

// Update Category
router.put("/:id", updateCategory);

// Delete Category
router.delete("/:id", deleteCategory);

module.exports = router;

