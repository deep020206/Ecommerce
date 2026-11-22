const express = require("express");
const app = express();
// CORS middleware
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });
const connectDB = require("./config/db");
const PORT = process.env.PORT || 5000;

// middlewares
const cors = require("cors");
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:3000" }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

// connect to the mongodb database
app.use("/api/items", require("./routes/items"));
app.use("/api/payment", cors(), require("./routes/payment"));
app.use("/api/auth", require("./routes/auth"));

const startServer = async () => {
  try {
    await connectDB();
  } catch (error) {
    console.error("Server stopped because MongoDB could not be connected.");
    process.exit(1);
  }

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

startServer();
