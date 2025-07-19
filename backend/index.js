require("dotenv").config();
const connectDB = require("./db");
const express = require("express");
const path = require("path");
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
app.use(express.static(path.resolve(__dirname, "../frontend/dist")));

const bookRoutes = require("./routes/book.routes");

app.use("/api/v1/books", bookRoutes);
app.get("/api/v1/health", (req, res) => {
  res.status(200).json({ msg: "Server is running!" });
});

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../frontend/dist", "index.html"));
});

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
