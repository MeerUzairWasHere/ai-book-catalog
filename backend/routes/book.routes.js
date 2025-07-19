const express = require("express");
const router = express.Router();
const {
  getBooks,
  getBookDetails,
  addBook,
  deleteBooks,
  getSingleBook,
  updateBook,
} = require("../controller/book.controller");

// Route for auto-fill feature
router.route("/autofill").get(getBookDetails);

// CRUD operations for books
router
  .route("/")
  .get(getBooks) // Get all books
  .post(addBook); // Add new book

router
  .route("/:id")
  .get(getSingleBook) // Get single book
  .put(updateBook) // Update book
  .delete(deleteBooks); // Delete book

module.exports = router;
