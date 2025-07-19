const Book = require("../models/Book");
const { fetchBookDetails } = require("../services/bookService");

exports.getBooks = async (req, res) => {
  try {
    const { search, genre = "all" } = req.query;

    const query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { author: { $regex: search, $options: "i" } },
      ];
    }

    if (genre !== "all") {
      query.genre = { $regex: new RegExp(`^${genre}$`, "i") };
    }

    const books = await Book.find(query);
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addBook = async (req, res) => {
  const book = new Book(req.body);
  try {
    const newBook = await book.save();
    res.status(201).json(newBook);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getBookDetails = async (req, res) => {
  try {
    const { title } = req.query;
    if (!title) return res.status(400).json({ message: "Title is required" });

    const details = await fetchBookDetails(title);
    res.json(details);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteBooks = async (req, res) => {
  try {
    const books = await Book.findOneAndDelete({ _id: req.params.id });
    if (!books) return res.status(404).json({ message: "Book not found" });
    res.status(204).json(books);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getSingleBook = async (req, res) => {
  try {
    const book = await Book.findById({ _id: req.params.id });
    if (!book) return res.status(404).json({ message: "Book not found" });
    res.status(200).json(book);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateBook = async (req, res) => {
  try {
    const book = await Book.findOneAndUpdate({ _id: req.params.id }, req.body, {
      new: true,
      runValidators: true,
    });
    if (!book) return res.status(404).json({ message: "Book not found" });

    res.status(200).json(book);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
