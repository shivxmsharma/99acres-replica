"use client";

import Link from "next/link";
import { MapPin, Bed, Bath, Maximize2, ShieldCheck, Heart } from "lucide-react";
import SafeImage from "@/components/common/SafeImage";

export default function AlgoliaHit({ hit }) {
  return (
    <Link href={`/property/${hit.objectID}`} className="group block">
      <div className="bg-white rounded-[40px] overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-gray-200 transition-all duration-500 hover:-translate-y-2 flex flex-col h-full">
        
        {/* Image Container */}
        <div className="relative h-64 overflow-hidden shrink-0">
          <SafeImage 
            src={hit.coverPhoto} 
            alt={hit.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
          
          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {hit.isVerified && (
              <span className="bg-white/90 backdrop-blur-md text-emerald-600 text-[10px] font-black px-3 py-1.5 rounded-full flex items-center gap-1 shadow-sm">
                <ShieldCheck size={12} /> VERIFIED
              </span>
            )}
            <span className="bg-[#0041C2]/90 backdrop-blur-md text-white text-[10px] font-black px-3 py-1.5 rounded-full shadow-sm">
              {hit.type?.toUpperCase()}
            </span>
          </div>

          <button className="absolute top-4 right-4 p-3 bg-white/90 backdrop-blur-md rounded-full shadow-sm hover:bg-white transition-colors group/heart">
            <Heart size={18} className="text-gray-400 group-hover/heart:text-red-500 transition-colors" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 flex flex-col flex-1">
          <div className="flex justify-between items-start gap-4 mb-4">
            <h3 className="text-xl font-black text-gray-900 tracking-tight leading-tight line-clamp-2 group-hover:text-[#0041C2] transition-colors">
              {hit.title}
            </h3>
          </div>

          <div className="flex items-center gap-1.5 text-gray-400 font-bold text-[11px] uppercase tracking-widest mb-6">
            <MapPin size={14} className="text-[#0041C2]" />
            <span className="truncate">{hit.area}, {hit.city}</span>
          </div>

          <div className="flex items-center justify-between py-6 border-y border-gray-50 mt-auto">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 text-gray-900 font-black text-xs">
                <Bed size={16} className="text-[#0041C2]" /> {hit.bhk} BHK
              </div>
              <div className="flex items-center gap-1.5 text-gray-900 font-black text-xs">
                <Maximize2 size={16} className="text-[#0041C2]" /> {hit.sqft} sqft
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-6">
            <div className="text-2xl font-black text-gray-900 tracking-tighter">
              ₹{hit.price?.toLocaleString('en-IN')}<span className="text-sm uppercase ml-1 font-bold text-gray-400">{hit.priceLabel}</span>
            </div>
            <div className="bg-blue-50 text-[#0041C2] px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest group-hover:bg-[#0041C2] group-hover:text-white transition-all">
              Details
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
