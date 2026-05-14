"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
  X, MapPin, Building2, Home, Maximize2, 
  Sparkles, CheckCircle2, TrendingUp, Phone, MessageSquare 
} from "lucide-react";
import Link from "next/link";
import PropertyAiInsights from "../ai/PropertyAiInsights";

export default function QuickViewModal({ property, isOpen, onClose }) {
  if (!isOpen || !property) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 md:p-8">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-white w-full max-w-5xl h-full max-h-[85vh] rounded-[48px] shadow-2xl overflow-hidden flex flex-col md:flex-row"
        >
          {/* Left: Image Gallery */}
          <div className="md:w-1/2 relative bg-gray-100 overflow-hidden group">
            <img 
              src={property.images?.[0] || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=1000"} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              alt={property.title}
            />
            <div className="absolute top-6 left-6 flex flex-wrap gap-2">
              <span className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest text-primary shadow-sm border border-white/20">
                {property.propertyType || property.type}
              </span>
              <span className="bg-primary/90 backdrop-blur-md px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white shadow-sm">
                {property.status || "Buy"}
              </span>
            </div>
            
            <div className="absolute bottom-6 left-6 right-6 p-6 bg-white/10 backdrop-blur-xl rounded-[32px] border border-white/20">
              <h3 className="text-xl font-black text-white leading-tight mb-2 truncate">{property.title}</h3>
              <div className="flex items-center gap-2 text-white/80 text-xs font-bold uppercase tracking-widest">
                <MapPin size={14} className="text-white" />
                {property.location?.area || property.address?.locality}, {property.location?.city || property.address?.city}
              </div>
            </div>
          </div>

          {/* Right: Details & AI */}
          <div className="md:w-1/2 flex flex-col h-full bg-white relative">
            {/* Close Button */}
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 z-10 w-10 h-10 bg-gray-50 hover:bg-gray-100 text-gray-400 hover:text-gray-900 rounded-2xl flex items-center justify-center transition-all shadow-sm"
            >
              <X size={20} />
            </button>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-10 space-y-8">
              {/* Header Info */}
              <div>
                <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-2">Exclusive Listing</p>
                <div className="flex items-end gap-3">
                  <h2 className="text-4xl font-black text-gray-900 tracking-tight">₹{property.price.toLocaleString('en-IN')}</h2>
                  <span className="text-lg font-bold text-gray-400 mb-1">{property.priceLabel || "Cr"}</span>
                </div>
              </div>

              {/* Key Specs */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded-3xl border border-gray-100">
                  <Building2 size={18} className="text-primary mb-2" />
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">BHK</p>
                  <p className="text-sm font-black text-gray-900">{property.details?.bedrooms || property.features?.bhk} BHK</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-3xl border border-gray-100">
                  <Maximize2 size={18} className="text-primary mb-2" />
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Area</p>
                  <p className="text-sm font-black text-gray-900">{property.details?.sqft || property.features?.sqft} sqft</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-3xl border border-gray-100">
                  <Home size={18} className="text-primary mb-2" />
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</p>
                  <p className="text-sm font-black text-gray-900">Ready</p>
                </div>
              </div>

              {/* AI Insights Integration */}
              <div className="pt-2">
                <PropertyAiInsights propertyId={property._id} />
              </div>

              {/* Amenities */}
              <div className="space-y-4">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Key Amenities</p>
                <div className="flex flex-wrap gap-2">
                  {property.amenities?.slice(0, 4).map((item, idx) => (
                    <span key={idx} className="px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-[10px] font-bold text-gray-600">
                      {item}
                    </span>
                  ))}
                  {property.amenities?.length > 4 && (
                    <span className="px-4 py-2 text-[10px] font-bold text-gray-400">
                      +{property.amenities.length - 4} more
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-8 border-t border-gray-100 bg-gray-50/50 flex gap-4">
              <Link 
                href={`/property/${property._id}`}
                className="flex-1 bg-[#0041C2] hover:bg-blue-700 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest text-center shadow-xl shadow-blue-900/10 transition-all flex items-center justify-center gap-2"
              >
                View Full Details
              </Link>
              <button className="px-6 bg-white border border-gray-200 text-gray-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:border-primary hover:text-primary transition-all flex items-center gap-2">
                <Phone size={18} />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
