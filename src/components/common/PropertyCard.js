import Image from "next/image";
import { MapPin, Home, Maximize2, ShieldCheck } from "lucide-react";

export default function PropertyCard({ property }) {
  const {
    title,
    price,
    priceLabel,
    location,
    features,
    images,
    owner,
    isVerified,
  } = property;

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-2xl transition-all duration-300 group cursor-pointer flex flex-col h-full">
      {/* Image Section */}
      <div className="relative h-56 w-full overflow-hidden">
        <img
          src={images[0] || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=1000"}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {isVerified && (
          <div className="absolute top-4 left-4 bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1 shadow-lg">
            <ShieldCheck size={12} /> VERIFIED
          </div>
        )}
        <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md text-white text-xs px-3 py-1.5 rounded-full font-medium">
          {property.type}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5 flex-grow flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-gray-900">₹{price}</span>
            <span className="text-sm font-bold text-gray-500 uppercase">{priceLabel}</span>
          </div>
        </div>

        <h3 className="font-bold text-gray-800 text-lg line-clamp-1 mb-1 group-hover:text-primary transition-colors">
          {title}
        </h3>

        <div className="flex items-center gap-1 text-gray-500 text-sm mb-4">
          <MapPin size={14} className="flex-shrink-0 text-gray-400" />
          <span className="truncate">{location.area}, {location.city}</span>
        </div>

        {/* Features Row */}
        <div className="flex items-center gap-4 py-4 border-y border-gray-50 mb-4 mt-auto">
          <div className="flex items-center gap-1.5">
            <Home size={16} className="text-primary/60" />
            <span className="text-sm font-bold text-gray-700">{features.bhk} BHK</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Maximize2 size={16} className="text-primary/60" />
            <span className="text-sm font-bold text-gray-700">{features.sqft} sqft</span>
          </div>
        </div>

        {/* Owner Info */}
        <div className="flex justify-between items-center">
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-400 uppercase font-black tracking-tighter leading-none">Listed by</span>
            <span className="text-sm font-bold text-gray-900">{owner.name}</span>
          </div>
          <button className="bg-primary hover:bg-secondary text-white text-xs font-black px-4 py-2 rounded-lg transition-colors shadow-sm uppercase tracking-wider">
            Contact
          </button>
        </div>
      </div>
    </div>
  );
}
