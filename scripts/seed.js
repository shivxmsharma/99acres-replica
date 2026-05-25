const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env.local' });

// Define Schemas
const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: { type: String, default: 'password123' },
  role: { type: String, enum: ['Admin', 'Owner', 'Buyer', 'Agent', 'Builder'], default: 'Owner' }
}, { timestamps: true });

const PropertySchema = new mongoose.Schema({
  title: String,
  description: String,
  listingType: String,
  propertyType: String,
  price: Number,
  priceLabel: String,
  address: { locality: String, city: String, state: String },
  details: { bedrooms: Number, bathrooms: Number, area: Number, furnishing: String, constructionStatus: String },
  amenities: [String],
  images: [String],
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isFeatured: { type: Boolean, default: false },
  isVerified: { type: Boolean, default: true },
  trustScore: { type: Number, default: 85 },
  views: { type: Number, default: 0 },
  status: { type: String, default: 'active' },
  location: { type: { type: String, default: "Point" }, coordinates: [Number] },
  localityIntelligence: { walkabilityScore: Number, nearestMetroDistance: Number, nearestSchoolDistance: Number, airQualityIndex: Number }
}, { timestamps: true });

const LeadSchema = new mongoose.Schema({
  propertyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Property' },
  name: String,
  email: String,
  mobile: String,
  message: String,
  status: { type: String, default: 'New' }
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', UserSchema);
const Property = mongoose.models.Property || mongoose.model('Property', PropertySchema);
const Lead = mongoose.models.Lead || mongoose.model('Lead', LeadSchema);

const SEED_USERS = [
  { name: "System Admin", email: "admin@nestiq.com", role: "Admin" },
  { name: "Shiv Sharma", email: "demo@nestiq.com", role: "Owner" },
  { name: "Priya Realty", email: "priya@agent.com", role: "Agent" },
  { name: "DLF Builders", email: "sales@dlf.in", role: "Builder" },
  { name: "Rahul Malhotra", email: "rahul@buyer.com", role: "Buyer" },
  { name: "Ananya Iyer", email: "ananya@buyer.com", role: "Buyer" }
];

const CITIES = [
  { city: "Gurgaon", state: "Haryana", coords: [77.1025, 28.4595] },
  { city: "Bangalore", state: "Karnataka", coords: [77.5946, 12.9716] },
  { city: "Mumbai", state: "Maharashtra", coords: [72.8777, 19.0760] },
  { city: "New Delhi", state: "Delhi", coords: [77.2090, 28.6139] },
  { city: "Pune", state: "Maharashtra", coords: [73.8567, 18.5204] },
  { city: "Hyderabad", state: "Telangana", coords: [78.4867, 17.3850] }
];

const CORE_PROPERTIES = [
  {
    title: "DLF The Aralias - Ultra Luxury Penthouse",
    description: "Experience the pinnacle of luxury living on Golf Course Road. Panoramic views, private elevator, and world-class interiors.",
    listingType: "Buy",
    propertyType: "Penthouse",
    price: 12.5,
    priceLabel: "Cr",
    address: { locality: "Golf Course Road", city: "Gurgaon", state: "Haryana" },
    details: { bedrooms: 4, bathrooms: 5, area: 5400, furnishing: "Fully Furnished", constructionStatus: "Ready to Move" },
    amenities: ["Private Pool", "Home Theatre", "Gym", "Concierge", "4 Car Parking"],
    images: ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200"],
    isFeatured: true,
    isVerified: true,
    trustScore: 98,
    views: 1240,
    location: { coordinates: [77.1025, 28.4595] },
    localityIntelligence: { walkabilityScore: 92, nearestMetroDistance: 0.8, nearestSchoolDistance: 1.2, airQualityIndex: 120 }
  },
  {
    title: "Modern 3BHK Apartment in HSR Layout",
    description: "Sun-drenched apartment with spacious balconies. Close to top IT hubs and cafes in HSR Sector 2.",
    listingType: "Rent",
    propertyType: "Apartment",
    price: 65000,
    priceLabel: "/ month",
    address: { locality: "HSR Layout", city: "Bangalore", state: "Karnataka" },
    details: { bedrooms: 3, bathrooms: 3, area: 1850, furnishing: "Semi-Furnished", constructionStatus: "Ready to Move" },
    amenities: ["Lift", "Power Backup", "Clubhouse", "Security"],
    images: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=1200"],
    isFeatured: false,
    isVerified: true,
    trustScore: 82,
    views: 850,
    location: { coordinates: [77.6371, 12.9121] },
    localityIntelligence: { walkabilityScore: 88, nearestMetroDistance: 2.1, nearestSchoolDistance: 0.5, airQualityIndex: 65 }
  },
  {
    title: "Sea-Facing Villa in Juhu",
    description: "Iconic residence overlooking the Arabian Sea. Private terrace, bespoke interiors, and unmatched exclusivity.",
    listingType: "Buy",
    propertyType: "Villa",
    price: 45.0,
    priceLabel: "Cr",
    address: { locality: "Juhu", city: "Mumbai", state: "Maharashtra" },
    details: { bedrooms: 6, bathrooms: 7, area: 8500, furnishing: "Fully Furnished", constructionStatus: "Ready to Move" },
    amenities: ["Sea View", "Private Lift", "Terrace Garden", "Smart Home", "Staff Quarters"],
    images: ["https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=1200"],
    isFeatured: true,
    isVerified: true,
    trustScore: 99,
    views: 3100,
    location: { coordinates: [72.8272, 19.1027] },
    localityIntelligence: { walkabilityScore: 85, nearestMetroDistance: 1.5, nearestSchoolDistance: 0.9, airQualityIndex: 78 }
  }
];

const PROP_TYPES = ["Apartment", "Villa", "Penthouse", "Studio", "Independent House", "Builder Floor"];
const AMENITIES_POOL = ["Gym", "Pool", "Clubhouse", "Security", "Parking", "Power Backup", "Garden", "WiFi", "Lift"];
const PHOTO_POOL = [
  "1600585154340-be6161a56a0c", "1605276374104-dee2a0ed3cd6", "1580587767376-042a4b9ae275",
  "1512917774080-9991f1c4c750", "1613490493576-7fde63acd811", "1564013463113-d3dfbb3b2464",
  "1513694203232-719a280e022f", "1484154218962-a197022b5858", "1502672260266-1c1ef2d93688",
  "1522708323590-d24dbb6b0267", "1613977257363-707ba9348227", "1600566752355-3979c5813476"
];

function generateExtraProperties(ownerIds, count = 27) {
  const props = [];
  for (let i = 0; i < count; i++) {
    const cityObj = CITIES[i % CITIES.length];
    const type = PROP_TYPES[i % PROP_TYPES.length];
    const isBuy = i % 2 === 0;
    
    props.push({
      title: `${isBuy ? 'Luxurious' : 'Charming'} ${type} in ${cityObj.city}`,
      description: `Beautifully designed ${type} in ${cityObj.city}. Ready for immediate possession with premium amenities.`,
      listingType: isBuy ? "Buy" : "Rent",
      propertyType: type,
      price: isBuy ? (Math.random() * 5 + 1).toFixed(1) : Math.floor(Math.random() * 40000 + 15000),
      priceLabel: isBuy ? "Cr" : "/ month",
      address: {
        locality: `Sector ${Math.floor(Math.random() * 80 + 10)}`,
        city: cityObj.city,
        state: cityObj.state
      },
      details: {
        bedrooms: Math.floor(Math.random() * 3 + 1),
        bathrooms: Math.floor(Math.random() * 2 + 1),
        area: Math.floor(Math.random() * 2000 + 700),
        furnishing: i % 2 === 0 ? "Semi-Furnished" : "Unfurnished",
        constructionStatus: "Ready to Move"
      },
      amenities: AMENITIES_POOL.slice(0, Math.floor(Math.random() * 4 + 2)),
      images: [
        `https://images.unsplash.com/photo-${PHOTO_POOL[i % PHOTO_POOL.length]}?auto=format&fit=crop&q=80&w=1200`,
        `https://images.unsplash.com/photo-${PHOTO_POOL[(i + 1) % PHOTO_POOL.length]}?auto=format&fit=crop&q=80&w=1200`
      ],
      owner: ownerIds[i % ownerIds.length],
      isFeatured: i % 7 === 0,
      isVerified: true,
      trustScore: Math.floor(Math.random() * 20 + 75),
      views: Math.floor(Math.random() * 1000),
      location: { coordinates: cityObj.coords },
      localityIntelligence: {
        walkabilityScore: Math.floor(Math.random() * 30 + 60),
        nearestMetroDistance: (Math.random() * 4).toFixed(1),
        nearestSchoolDistance: (Math.random() * 2).toFixed(1),
        airQualityIndex: Math.floor(Math.random() * 100 + 40)
      }
    });
  }
  return props;
}

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    await User.deleteMany({});
    await Property.deleteMany({});
    await Lead.deleteMany({});
    console.log('Cleared database');

    const hashedUsers = await Promise.all(SEED_USERS.map(async (u) => ({
      ...u,
      password: await bcrypt.hash('password123', 10)
    })));

    const createdUsers = await User.insertMany(hashedUsers);
    console.log(`Created ${createdUsers.length} users with hashed passwords`);

    const ownerIds = createdUsers.filter(u => ['Owner', 'Agent', 'Builder'].includes(u.role)).map(u => u._id);
    
    // Combine core properties with generated ones
    const finalProperties = [
      ...CORE_PROPERTIES.map((p, i) => ({ ...p, owner: ownerIds[i % ownerIds.length] })),
      ...generateExtraProperties(ownerIds, 27)
    ];

    const properties = await Property.insertMany(finalProperties);
    console.log(`Seeded ${properties.length} total properties`);

    const sampleLeads = properties.slice(0, 12).map((p, i) => ({
      propertyId: p._id,
      name: SEED_USERS[4 + (i % 2)].name,
      email: SEED_USERS[4 + (i % 2)].email,
      mobile: "998877665" + i,
      message: `Enquiry for ${p.title}. Please share more details.`,
      status: i % 4 === 0 ? "Contacted" : "New"
    }));

    await Lead.insertMany(sampleLeads);
    console.log('Seeded 12 sample leads');

    console.log('\n--- SEEDED USERS & CREDENTIALS ---');
    console.table(createdUsers.map(u => ({
      Name: u.name,
      Email: u.email,
      Role: u.role,
      Password: 'password123'
    })));

    console.log('\n--- SEEDING COMPLETE ---');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

seed();
