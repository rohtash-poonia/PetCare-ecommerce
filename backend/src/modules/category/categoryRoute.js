const express = require("express");

// yahan category ke controller import ho rahe hain
const {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} = require("./categoryController");

const router = express.Router();

// new category banao
router.post("/", createCategory);

// sab categories dekho
router.get("/", getCategories);

// ek specific category dekho
router.get("/:id", getCategoryById);

// category update karo
router.put("/:id", updateCategory);

// category delete karo
router.delete("/:id", deleteCategory);

module.exports = router;
