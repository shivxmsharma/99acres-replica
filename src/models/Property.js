import mongoose from "mongoose";

const PhotoSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    publicId: { type: String },
  },
  { _id: false }
);

const AddressSchema = new mongoose.Schema(
  {
    street: { type: String, trim: true },
    locality: { type: String, trim: true, required: true },
    city: { type: String, trim: true, required: true },
    state: { type: String, trim: true },
    pincode: { type: String, trim: true },
  },
  { _id: false }
);

const DetailsSchema = new mongoose.Schema(
  {
    bedrooms: { type: Number, min: 0, max: 20 },
    bathrooms: { type: Number, min: 0, max: 20 },
    area: { type: Number, min: 0 },                  // sq.ft
    floor: { type: Number },
    totalFloors: { type: Number },
    furnishing: {
      type: String,
      enum: ["Unfurnished", "Semi-Furnished", "Fully Furnished", "Furnished", ""],
      default: "",
    },
    constructionStatus: {
      type: String,
      enum: ["Under Construction", "Ready to Move", ""],
      default: "",
    },
    facing: {
      type: String,
      enum: ["North", "South", "East", "West", "North-East", "North-West", "South-East", "South-West", ""],
      default: "",
    },
    ageOfProperty: { type: Number },                 // in years
  },
  { _id: false }
);

const CoordinateSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ["Point"], default: "Point" },
    coordinates: { type: [Number], default: [77.1025, 28.7041] }, // Default to Delhi coordinates
  },
  { _id: false }
);

const PropertySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxLength: 120,
    },
    description: {
      type: String,
      trim: true,
      maxLength: 2000,
    },
    listingType: {
      type: String,
      required: true,
      enum: ["Buy", "Rent", "PG", "buy", "rent", "pg"], // Supporting both formats for transition
    },
    propertyType: {
      type: String,
      required: true,
      enum: ["Apartment", "Villa", "Independent House", "Plot", "Studio", "Penthouse", "Builder Floor", "Commercial"],
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    priceLabel: {
      type: String, // e.g., "Cr", "Lakh"
      default: "Lakh",
    },
    address: {
      type: AddressSchema,
      required: true,
    },
    details: {
      type: DetailsSchema,
    },
    amenities: [{ type: String }],
    photos: [PhotoSchema],
    images: [String], // Legacy support

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    location: {
      type: CoordinateSchema,
    },

    // NestIQ Features
    trustScore: {
      type: Number,
      default: 70,
      min: 0,
      max: 100,
    },
    isReraVerified: {
      type: Boolean,
      default: false,
    },
    reraNumber: {
      type: String,
      trim: true,
      default: "",
    },
    localityIntelligence: {
      walkabilityScore: { type: Number },
      nearestMetroDistance: { type: Number },
      nearestSchoolDistance: { type: Number },
      airQualityIndex: { type: Number },
    },

    status: {
      type: String,
      enum: ["active", "inactive", "sold", "rented", "pending-review", "deleted"],
      default: "active",
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isVerified: {
      type: Boolean,
      default: true,
    },
    views: {
      type: Number,
      default: 0,
    },
    enquiryCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Indexes for performance
PropertySchema.index({ location: "2dsphere" });
PropertySchema.index({ title: "text", description: "text", "address.locality": "text" });
PropertySchema.index({ "address.city": 1, status: 1 });
PropertySchema.index({ listingType: 1, propertyType: 1 });
PropertySchema.index({ owner: 1 });
PropertySchema.index({ price: 1 });

export default mongoose.models.Property || mongoose.model("Property", PropertySchema);
