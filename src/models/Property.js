import mongoose from "mongoose";

const PropertySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide a title for this property."],
      maxlength: [100, "Title cannot be more than 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Please provide a description."],
    },
    price: {
      type: Number,
      required: [true, "Please provide a price."],
    },
    priceLabel: {
      type: String, // e.g., "Cr", "Lakh"
      default: "Lakh",
    },
    location: {
      city: { type: String, required: true },
      area: { type: String, required: true },
      address: String,
    },
    type: {
      type: String,
      enum: ["Apartment", "Independent House", "Villa", "Plot", "Commercial"],
      required: true,
    },
    status: {
      type: String,
      enum: ["Buy", "Rent"],
      required: true,
    },
    features: {
      bhk: Number,
      bathrooms: Number,
      sqft: Number,
      furnishing: {
        type: String,
        enum: ["Furnished", "Semi-Furnished", "Unfurnished"],
      },
    },
    amenities: [String],
    images: [String],
    owner: {
      name: String,
      type: { type: String, enum: ["Owner", "Dealer", "Builder"] },
      contact: String,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isVerified: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Property || mongoose.model("Property", PropertySchema);
