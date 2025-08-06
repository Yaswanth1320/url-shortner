const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const urlRoutes = require("./routes/urlRoutes");
const errorHandler = require("./middleware/errorHandler");
const { cleanupExpiredUrls } = require("./controllers/urlController");

// Load environment variables
dotenv.config();

const app = express();

// Configure CORS to allow requests from localhost during development
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:5173", // Vite default
      "http://localhost:8080", // Common dev server
      "https://url-shortner-sigma-nine.vercel.app", // Allow same origin
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(bodyParser.json());

// API routes - these must come before static files
app.use("/", urlRoutes);

// Serve static files from public directory
app.use(express.static("public"));

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
const MONGO_URI =
  process.env.MOGODB_URL || "mongodb://localhost:27017/urlshortener";
console.log(MONGO_URI);

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB successfully");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

    // Run cleanup every 24 hours
    setInterval(async () => {
      try {
        await cleanupExpiredUrls();
      } catch (err) {
        console.error("Automatic cleanup failed:", err);
      }
    }, 24 * 60 * 60 * 1000); // 24 hours

    // Run initial cleanup
    cleanupExpiredUrls().catch((err) => {
      console.error("Initial cleanup failed:", err);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });
