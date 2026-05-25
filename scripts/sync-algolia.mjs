import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import mongoose from "mongoose";
import { algoliasearch } from "algoliasearch";

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, "../.env.local") });

// Define Schema to match exactly what's in the DB
const PropertySchema = new mongoose.Schema({
  title: String,
  listingType: String,
  propertyType: String,
  price: Number,
  priceLabel: String,
  address: {
    locality: String,
    city: String,
    state: String
  },
  details: {
    bedrooms: Number,
    bathrooms: Number,
    area: Number,
    furnishing: String,
    constructionStatus: String
  },
  images: [String],
  isVerified: Boolean,
  isFeatured: Boolean,
  trustScore: Number,
  status: { type: String, default: 'active' },
  createdAt: Date
});

const Property = mongoose.models.Property || mongoose.model("Property", PropertySchema);

function toAlgoliaRecord(property) {
  const locality = property.address?.locality || "";
  const city = property.address?.city || "";
  const beds = property.details?.bedrooms;

  const record = {
    objectID: property._id.toString(),
    title:
      property.title ||
      `${beds ? beds + " BHK " : ""}${property.propertyType} in ${locality}, ${city}`,
    listingType: property.listingType,
    propertyType: property.propertyType,
    type: property.propertyType,
    price: property.price || 0,
    priceLabel: property.priceLabel,
    city,
    locality,
    area: locality,
    state: property.address?.state || "",
    bhk: beds || 0,
    bathrooms: property.details?.bathrooms || 0,
    sqft: property.details?.area || 0,
    furnishing: property.details?.furnishing || "",
    constructionStatus: property.details?.constructionStatus || "",
    isVerified: property.isVerified || false,
    isFeatured: property.isFeatured || false,
    trustScore: property.trustScore || 70,
    coverPhoto: property.images?.[0] || "",
    status: property.status || "active",
    createdAt: property.createdAt ? new Date(property.createdAt).getTime() : Date.now(),
  };

  return record;
}

async function syncToAlgolia() {
  if (!process.env.NEXT_PUBLIC_ALGOLIA_APP_ID || !process.env.ALGOLIA_ADMIN_KEY) {
    console.warn("Algolia keys missing in .env.local. Skipping Algolia sync.");
    return;
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

  await client.replaceAllObjects({
    indexName,
    objects: records,
  });

  console.log("Configuring Algolia index settings (searchable attributes, faceting, and ranking)...");
  await client.setSettings({
    indexName,
    indexSettings: {
      attributesForFaceting: [
        "listingType",
        "type",
        "city",
        "locality",
        "bhk",
        "price",
        "isFeatured"
      ],
      searchableAttributes: [
        "title",
        "locality",
        "city",
        "propertyType"
      ],
      customRanking: [
        "desc(isFeatured)",
        "desc(trustScore)"
      ]
    }
  });

  console.log("Algolia sync complete. Updated", records.length, "objects.");
  await mongoose.disconnect();
}

syncToAlgolia().catch(async (err) => {
  console.error("Sync failed:", err);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
