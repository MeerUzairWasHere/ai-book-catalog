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

router.route("/autofill").get(getBookDetails);

// Get all books
router.route("/").get(getBooks).post(addBook);
router.route("/:id").delete(deleteBooks).put(updateBook).get(getSingleBook);

// Auto-fill book details

module.exports = router;
