import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import mongoose from "mongoose";
import { algoliasearch } from "algoliasearch";

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, "../.env.local") });

// Import Property model using ESM
// Note: We need to define the schema here because the model file uses imports that might not work in a simple script
const PropertySchema = new mongoose.Schema({
  title: String,
  price: Number,
  priceLabel: String,
  location: {
    address: String,
    area: String,
    city: String,
    coordinates: [Number]
  },
  features: {
    bhk: Number,
    bathrooms: Number,
    sqft: Number,
    furnishing: String
  },
  images: [String],
  owner: {
    name: String,
    type: String,
    phone: String
  },
  isVerified: Boolean,
  description: String,
  amenities: [String],
  type: String,
  status: String,
  createdAt: Date
});

const Property = mongoose.models.Property || mongoose.model("Property", PropertySchema);

function toAlgoliaRecord(property) {
  const area = property.location?.area || "";
  const city = property.location?.city || "";
  const bhk = property.features?.bhk;

  const record = {
    objectID: property._id.toString(),
    title:
      property.title ||
      `${bhk ? bhk + " BHK " : ""}${property.type} in ${area}, ${city}`,
    type: property.type,
    price: property.price || 0,
    priceLabel: property.priceLabel,
    city,
    area,
    address: property.location?.address || "",
    bhk: bhk || 0,
    bathrooms: property.features?.bathrooms || 0,
    sqft: property.features?.sqft || 0,
    furnishing: property.features?.furnishing || "",
    isVerified: property.isVerified || false,
    coverPhoto: property.images?.[0] || "",
    amenities: property.amenities || [],
    status: property.status || "active",
    createdAt: property.createdAt ? new Date(property.createdAt).getTime() : Date.now(),
  };

  if (property.location?.coordinates?.length === 2) {
    record._geoloc = {
      lat: property.location.coordinates[1],
      lng: property.location.coordinates[0],
    };
  }

  return record;
}

async function syncToAlgolia() {
  if (!process.env.NEXT_PUBLIC_ALGOLIA_APP_ID || !process.env.ALGOLIA_ADMIN_KEY) {
    console.warn("Algolia keys missing in .env.local. Skipping Algolia sync.");
    return;
  }

  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI not found in .env.local");
  }

  const client = algoliasearch(
    process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
    process.env.ALGOLIA_ADMIN_KEY
  );
  const indexName = "99acres_properties";

  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected to MongoDB. Fetching active properties...");

  const properties = await Property.find({ status: "active" }).lean();
  const records = properties.map(toAlgoliaRecord);

  console.log(`Syncing ${records.length} properties to Algolia...`);

  // v5 replaceAllObjects equivalent
  await client.replaceAllObjects({
    indexName,
    objects: records,
  });

  console.log("Algolia sync complete. Updated", records.length, "objects.");
  await mongoose.disconnect();
}

syncToAlgolia().catch(async (err) => {
  console.error("Sync failed:", err);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
