const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const PropertySchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  priceLabel: String,
  location: {
    city: String,
    area: String,
    address: String,
  },
  type: String,
  status: String,
  features: {
    bhk: Number,
    bathrooms: Number,
    sqft: Number,
    furnishing: String,
  },
  amenities: [String],
  images: [String],
  owner: {
    name: String,
    type: { type: String },
    contact: String,
  },
  isFeatured: Boolean,
  isVerified: Boolean,
}, { timestamps: true });

const Property = mongoose.models.Property || mongoose.model('Property', PropertySchema);

const SAMPLE_PROPERTIES = [
  {
    title: "3 BHK Ultra Luxury Apartment in DLF Phase 5",
    description: "East facing, corner property with all modern amenities and 24x7 security.",
    price: 4.5,
    priceLabel: "Cr",
    location: {
      city: "Gurgaon",
      area: "DLF Phase 5",
      address: "DLF The Aralias, Golf Course Road",
    },
    type: "Apartment",
    status: "Buy",
    features: {
      bhk: 3,
      bathrooms: 3,
      sqft: 2800,
      furnishing: "Semi-Furnished",
    },
    amenities: ["Pool", "Gym", "Clubhouse", "Parking"],
    images: ["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=1000"],
    owner: { name: "DLF Builders", type: "Builder", contact: "1800-123-456" },
    isFeatured: true,
    isVerified: true,
  },
  {
    title: "Spacious 2 BHK for Rent in HSR Layout",
    description: "Close to IT parks, fully ventilated and ready to move.",
    price: 45000,
    priceLabel: "/ month",
    location: {
      city: "Bangalore",
      area: "HSR Layout",
      address: "Sector 2, Near BDA Complex",
    },
    type: "Apartment",
    status: "Rent",
    features: {
      bhk: 2,
      bathrooms: 2,
      sqft: 1200,
      furnishing: "Semi-Furnished",
    },
    amenities: ["Parking", "Lift", "Power Backup"],
    images: ["https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1000"],
    owner: { name: "Suresh Kumar", type: "Owner", contact: "9876543210" },
    isFeatured: false,
    isVerified: true,
  },
  {
    title: "Modern Villa in ECR",
    description: "Beachfront villa with private pool and garden area.",
    price: 8.2,
    priceLabel: "Cr",
    location: {
      city: "Chennai",
      area: "ECR",
      address: "Olive Beach Road",
    },
    type: "Villa",
    status: "Buy",
    features: {
      bhk: 5,
      bathrooms: 6,
      sqft: 5000,
      furnishing: "Furnished",
    },
    amenities: ["Private Pool", "Garden", "Beach Access"],
    images: ["https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&q=80&w=1000"],
    owner: { name: "Luxury Estates", type: "Dealer", contact: "044-2456-7890" },
    isFeatured: true,
    isVerified: true,
  }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    await Property.deleteMany({});
    console.log('Cleared existing properties');

    await Property.insertMany(SAMPLE_PROPERTIES);
    console.log('Successfully seeded database with 99acres sample data');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seed();
