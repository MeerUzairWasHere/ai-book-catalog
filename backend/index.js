require("dotenv").config();
const connectDB = require("./db");
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const bookRoutes = require("./routes/book.routes");

app.use("/api/v1/books", bookRoutes);

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
    process.exit(0);
  }
};

start();
