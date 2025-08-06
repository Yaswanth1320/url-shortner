const mongoose = require("mongoose");

const urlSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
    },
    shortCode: {
      type: String,
      required: true,
      unique: true,
    },
    accessCount: {
      type: Number,
      default: 0,
    },
    expiresAt: {
      type: Date,
      default: function () {
        // Set expiration to 30 days from now
        const date = new Date();
        date.setDate(date.getDate() + 30);
        return date;
      },
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Add index for automatic cleanup
urlSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model("Url", urlSchema);
