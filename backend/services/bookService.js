const axios = require("axios");

async function fetchBookDetails(title) {
  try {
    const response = await axios.get(
      `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
        title
      )}`
    );

    if (response.data.items && response.data.items.length > 0) {
      const bookInfo = response.data.items[0].volumeInfo;
      return {
        author: bookInfo.authors ? bookInfo.authors.join(", ") : "Unknown",
        genre: bookInfo.categories ? bookInfo.categories[0] : "Unknown",
        summary: bookInfo.description || "No description available",
        rating: bookInfo.ratingsCount || "No ratings available",
        coverImage:
          bookInfo.imageLinks?.thumbnail ||
          bookInfo.imageLinks?.smallThumbnail ||
          "",
      };
    }
    return null;
  } catch (error) {
    console.error("Error fetching book details:", error);
    return null;
  }
}

module.exports = { fetchBookDetails };
