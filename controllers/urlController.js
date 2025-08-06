const Url = require("../models/url");
const { nanoid } = require("nanoid");

// Create a new short URL
exports.createShortUrl = async (req, res, next) => {
  try {
    const { url } = req.body;
    if (!url || typeof url !== "string") {
      return res.status(400).json({ error: "A valid URL is required." });
    }
    const shortCode = nanoid(6);
    const newUrl = await Url.create({ url, shortCode });
    return res.status(201).json(newUrl);
  } catch (err) {
    if (err.code === 11000) {
      return res
        .status(400)
        .json({ error: "Short code already exists. Try again." });
    }
    next(err);
  }
};

// Retrieve the original URL
exports.getOriginalUrl = async (req, res, next) => {
  try {
    const { shortCode } = req.params;
    const urlDoc = await Url.findOne({
      shortCode,
      expiresAt: { $gt: new Date() }, // Only return if not expired
    });
    if (!urlDoc)
      return res.status(404).json({ error: "Short URL not found or expired." });
    urlDoc.accessCount += 1;
    await urlDoc.save();
    return res.status(200).json(urlDoc);
  } catch (err) {
    next(err);
  }
};

// Update an existing short URL
exports.updateShortUrl = async (req, res, next) => {
  try {
    const { shortCode } = req.params;
    const { url } = req.body;
    if (!url || typeof url !== "string") {
      return res.status(400).json({ error: "A valid URL is required." });
    }
    const urlDoc = await Url.findOneAndUpdate(
      {
        shortCode,
        expiresAt: { $gt: new Date() }, // Only update if not expired
      },
      {
        url,
        updatedAt: new Date(),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Reset expiration to 30 days
      },
      { new: true }
    );
    if (!urlDoc)
      return res.status(404).json({ error: "Short URL not found or expired." });
    return res.status(200).json(urlDoc);
  } catch (err) {
    next(err);
  }
};

// Delete an existing short URL
exports.deleteShortUrl = async (req, res, next) => {
  try {
    const { shortCode } = req.params;
    const result = await Url.findOneAndDelete({
      shortCode,
      expiresAt: { $gt: new Date() }, // Only delete if not expired
    });
    if (!result)
      return res.status(404).json({ error: "Short URL not found or expired." });
    return res.status(204).send();
  } catch (err) {
    next(err);
  }
};

// Get statistics for a short URL
exports.getUrlStats = async (req, res, next) => {
  try {
    const { shortCode } = req.params;
    const urlDoc = await Url.findOne({
      shortCode,
      expiresAt: { $gt: new Date() }, // Only return if not expired
    });
    if (!urlDoc)
      return res.status(404).json({ error: "Short URL not found or expired." });
    return res.status(200).json(urlDoc);
  } catch (err) {
    next(err);
  }
};

// Redirect to original URL
exports.redirectToOriginal = async (req, res, next) => {
  try {
    const { shortCode } = req.params;
    console.log("Redirect requested for shortCode:", shortCode);

    const urlDoc = await Url.findOne({
      shortCode,
      expiresAt: { $gt: new Date() }, // Only redirect if not expired
    });
    if (!urlDoc) {
      console.log("Short URL not found or expired:", shortCode);
      return res.status(404).json({ error: "Short URL not found or expired." });
    }

    console.log("Found URL:", urlDoc.url, "Redirecting...");

    // Increment access count
    urlDoc.accessCount += 1;
    await urlDoc.save();

    // Redirect to original URL
    res.redirect(urlDoc.url);
  } catch (err) {
    console.error("Redirect error:", err);
    next(err);
  }
};

// Cleanup expired URLs (can be called manually or via cron job)
exports.cleanupExpiredUrls = async () => {
  try {
    const result = await Url.deleteMany({
      expiresAt: { $lt: new Date() },
    });
    console.log(`Cleaned up ${result.deletedCount} expired URLs`);
    return result.deletedCount;
  } catch (err) {
    console.error("Cleanup error:", err);
    throw err;
  }
};
