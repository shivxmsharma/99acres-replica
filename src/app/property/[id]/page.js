import dbConnect from "@/lib/db";
import Property from "@/models/Property";
import { notFound } from "next/navigation";
import { 
  MapPin, 
  Home, 
  Maximize2, 
  ShieldCheck, 
  Bath, 
  Bed, 
  Info, 
  Phone, 
  Mail, 
  Share2, 
  Heart,
  ChevronRight,
  CheckCircle2
} from "lucide-react";

import ContactActions from "@/components/property/ContactActions";

async function getProperty(id) {
  await dbConnect();
  const property = await Property.findById(id).lean();
  if (property) {
    // Ensure the object is plain and serializable for Client Components
    return JSON.parse(JSON.stringify(property));
  }
  return null;
}

export default async function PropertyDetailsPage({ params }) {
  const { id } = await params;
  const property = await getProperty(id);

  if (!property) {
    notFound();
  }

  const {
    title,
    price,
    priceLabel,
    location,
    features,
    images,
    owner,
    isVerified,
    description,
    amenities,
    type,
    status
  } = property;

  return (
    <div className="bg-white min-h-screen">
      {/* Sub-Navbar / Breadcrumbs */}
      <div className="border-b border-gray-100 bg-gray-50/50 py-3">
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
          <span>Home</span> <ChevronRight size={12} />
          <span>{location.city}</span> <ChevronRight size={12} />
          <span>{location.area}</span> <ChevronRight size={12} />
          <span className="text-gray-900 truncate max-w-[200px]">{title}</span>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Left Column: Content */}
          <div className="lg:col-span-2 space-y-10">
            
            {/* Header Section */}
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-start">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    {isVerified && (
                      <span className="bg-green-100 text-green-700 text-[10px] font-black px-2 py-1 rounded flex items-center gap-1">
                        <ShieldCheck size={12} /> VERIFIED BY 99ACRES
                      </span>
                    )}
                    <span className="bg-blue-50 text-primary text-[10px] font-black px-2 py-1 rounded">
                      {type.toUpperCase()} FOR {status.toUpperCase()}
                    </span>
                  </div>
                  <h1 className="text-3xl font-black text-gray-900 tracking-tight leading-tight">
                    {title}
                  </h1>
                  <div className="flex items-center gap-2 text-gray-500 font-medium">
                    <MapPin size={18} className="text-primary" />
                    {location.address}, {location.area}, {location.city}
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-4xl font-black text-gray-900">₹{price}<span className="text-xl uppercase ml-1">{priceLabel}</span></div>
                  <div className="text-sm font-bold text-gray-400 uppercase mt-1">₹{Math.round((price * 10000000) / features.sqft)} per sqft</div>
                </div>
              </div>

              {/* Action Bar */}
              <div className="flex items-center gap-4 py-4 border-y border-gray-100 mt-4">
                <button className="flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-primary transition-colors">
                  <Share2 size={18} /> Share
                </button>
                <button className="flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-red-500 transition-colors">
                  <Heart size={18} /> Shortlist
                </button>
                <button className="flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-primary transition-colors">
                  <Info size={18} /> Report
                </button>
              </div>
            </div>

            {/* Gallery Section */}
            <div className="grid grid-cols-4 grid-rows-2 gap-4 h-[500px]">
              <div className="col-span-3 row-span-2 rounded-3xl overflow-hidden relative group">
                <img 
                  src={images[0] || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=1000"} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  alt="Main view"
                />
              </div>
              <div className="rounded-3xl overflow-hidden">
                <img src={images[1] || images[0]} className="w-full h-full object-cover" alt="View 2" />
              </div>
              <div className="rounded-3xl overflow-hidden relative">
                <img src={images[2] || images[0]} className="w-full h-full object-cover" alt="View 3" />
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white font-bold cursor-pointer hover:bg-black/40 transition-colors">
                  +12 Photos
                </div>
              </div>
            </div>

            {/* Key Features Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-8 bg-gray-50 rounded-[40px] border border-gray-100">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Config</span>
                <div className="flex items-center gap-2 font-black text-gray-900">
                  <Bed className="text-primary" size={20} /> {features.bhk} BHK
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Bathrooms</span>
                <div className="flex items-center gap-2 font-black text-gray-900">
                  <Bath className="text-primary" size={20} /> {features.bathrooms} Baths
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Area</span>
                <div className="flex items-center gap-2 font-black text-gray-900">
                  <Maximize2 className="text-primary" size={20} /> {features.sqft} sqft
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Furnishing</span>
                <div className="flex items-center gap-2 font-black text-gray-900">
                  <Home className="text-primary" size={20} /> {features.furnishing}
                </div>
              </div>
            </div>

            {/* Description Section */}
            <div className="space-y-4">
              <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tight">About this property</h3>
              <div className="h-1.5 w-12 bg-primary rounded-full" />
              <p className="text-gray-600 leading-relaxed text-lg font-medium whitespace-pre-line">
                {description}
              </p>
            </div>

            {/* Amenities Section */}
            <div className="space-y-6">
              <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Amenities</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {amenities.map((item) => (
                  <div key={item} className="flex items-center gap-3 p-4 border border-gray-100 rounded-2xl hover:border-primary hover:bg-primary/5 transition-all cursor-default group">
                    <CheckCircle2 className="text-green-500 group-hover:scale-110 transition-transform" size={18} />
                    <span className="font-bold text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Sidebar */}
          <div className="space-y-6">
            <div className="sticky top-24 space-y-6">
              
              {/* Contact Card */}
              <div className="bg-white text-gray-900 rounded-[40px] p-8 shadow-2xl shadow-gray-100 border border-gray-100">
                <div className="flex items-center gap-4 mb-8 pb-8 border-b border-gray-100">
                  <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-black">
                    {owner.name[0]}
                  </div>
                  <div>
                    <div className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">{owner.type}</div>
                    <div className="text-xl font-bold text-gray-900">{owner.name}</div>
                  </div>
                </div>

                <ContactActions property={property} />

                <div className="mt-8 text-center">
                  <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest leading-tight">
                    Please quote property ID: <span className="text-gray-900">{id.slice(-8).toUpperCase()}</span> <br />
                    when calling for a faster response.
                  </p>
                </div>
              </div>

              {/* Safety Tip */}
              <div className="bg-blue-50 rounded-3xl p-6 border border-blue-100">
                <h4 className="font-black text-blue-900 text-xs uppercase mb-2 tracking-widest">Safety Tips</h4>
                <p className="text-blue-700/70 text-xs leading-relaxed font-medium">
                  Never pay any token amount in advance without visiting the property and meeting the owner in person.
                </p>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
