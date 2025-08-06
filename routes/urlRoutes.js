const express = require("express");
const router = express.Router();
const urlController = require("../controllers/urlController");

// API routes - these must come before the redirect route
router.post("/shorten", urlController.createShortUrl);
router.get("/shorten/:shortCode", urlController.getOriginalUrl);
router.put("/shorten/:shortCode", urlController.updateShortUrl);
router.delete("/shorten/:shortCode", urlController.deleteShortUrl);
router.get("/shorten/:shortCode/stats", urlController.getUrlStats);

// Cleanup route (for manual cleanup)
router.post("/cleanup", urlController.cleanupExpiredUrls);

// Redirect route for short URLs - this must come LAST
router.get("/:shortCode", urlController.redirectToOriginal);

module.exports = router;
