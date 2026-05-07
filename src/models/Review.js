import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    reviewer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reviewee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
      trim: true,
      maxLength: 500,
    },
    status: {
      type: String,
      enum: ["published", "hidden", "flagged"],
      default: "published",
    },
  },
  { timestamps: true }
);

reviewSchema.index({ reviewer: 1, reviewee: 1, property: 1 }, { unique: true });

reviewSchema.statics.calculateAverageTrustScore = async function (revieweeId) {
  const stats = await this.aggregate([
    { $match: { reviewee: new mongoose.Types.ObjectId(revieweeId), status: "published" } },
    {
      $group: {
        _id: "$reviewee",
        averageRating: { $avg: "$rating" },
        numReviews: { $sum: 1 },
      },
    },
  ]);

  if (stats.length > 0) {
    await mongoose.model("User").findByIdAndUpdate(revieweeId, {
      trustScore: Math.round(stats[0].averageRating * 10) / 10,
      reviewCount: stats[0].numReviews,
    });
  } else {
    await mongoose.model("User").findByIdAndUpdate(revieweeId, {
      trustScore: 0,
      reviewCount: 0,
    });
  }
};

reviewSchema.post("save", function () {
  this.constructor.calculateAverageTrustScore(this.reviewee);
});

reviewSchema.post("remove", function () {
  this.constructor.calculateAverageTrustScore(this.reviewee);
});

const Review = mongoose.models.Review || mongoose.model("Review", reviewSchema);
export default Review;
