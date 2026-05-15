const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

async function clear() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Define temporary schemas for clearing
    const User = mongoose.models.User || mongoose.model('User', new mongoose.Schema({}));
    const Property = mongoose.models.Property || mongoose.model('Property', new mongoose.Schema({}));
    const Lead = mongoose.models.Lead || mongoose.model('Lead', new mongoose.Schema({}));

    await User.deleteMany({});
    await Property.deleteMany({});
    await Lead.deleteMany({});
    
    console.log('--- DATABASE CLEARED SUCCESSFULLY ---');
    process.exit(0);
  } catch (error) {
    console.error('Clear failed:', error);
    process.exit(1);
  }
}

clear();
