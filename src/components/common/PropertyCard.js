"use client";

import { useState } from "react";
import Link from "next/link";
import { MapPin, Home, Maximize2, ShieldCheck, ChevronLeft, ChevronRight, User, CheckCircle2, Heart, ArrowRightLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCompare } from "@/context/CompareContext";
import { useShortlist } from "@/context/ShortlistContext";

export default function PropertyCard({ property }) {
  const { addToCompare } = useCompare();
  const { isShortlisted, toggleShortlist } = useShortlist();
  const [imgIndex, setImgIndex] = useState(0);

  const {
    _id,
    title,
    price,
    priceLabel,
    location,
    features,
    images = [],
    owner,
    isVerified,
    constructionStatus
  } = property;

  const nextImg = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setImgIndex((prev) => (prev + 1) % images.length);
  };

  const prevImg = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setImgIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="relative group block h-full">
      <Link href={`/property/${_id}`} className="block h-full">
        <div className="bg-white rounded-[40px] overflow-hidden shadow-sm border border-gray-100 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 flex flex-col h-full relative">
          
          {/* Image Section with Slider */}
          <div className="relative h-64 w-full overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.img
                key={imgIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                src={images[imgIndex] || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=1000"}
                alt={title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </AnimatePresence>

            {/* Badges */}
            <div className="absolute top-5 left-5 flex flex-col gap-2">
              {isVerified && (
                <div className="bg-white/90 backdrop-blur-md text-green-600 text-[10px] font-black px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-xl">
                  <ShieldCheck size={14} /> VERIFIED
                </div>
              )}
              <div className="bg-primary/90 backdrop-blur-md text-white text-[10px] font-black px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-xl">
                <User size={14} /> {owner.role?.toUpperCase() || 'OWNER'}
              </div>
            </div>

            {constructionStatus && (
              <div className="absolute top-5 right-5 z-20 bg-black/40 backdrop-blur-md text-white text-[9px] font-black px-3 py-1.5 rounded-full border border-white/20">
                {constructionStatus.toUpperCase()}
              </div>
            )}

            {/* Slider Controls */}
            {images.length > 1 && (
              <>
                <button 
                  onClick={prevImg}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-md text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:text-primary z-10"
                >
                  <ChevronLeft size={20} />
                </button>
                <button 
                  onClick={nextImg}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-md text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:text-primary z-10"
                >
                  <ChevronRight size={20} />
                </button>
                <div className="absolute bottom-4 right-6 bg-black/40 backdrop-blur-md text-white text-[10px] font-black px-3 py-1 rounded-full border border-white/10">
                  {imgIndex + 1} / {images.length}
                </div>
              </>
            )}
          </div>

          {/* Content Section */}
          <div className="p-8 flex-grow flex flex-col">
            <div className="flex justify-between items-baseline mb-4">
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-black text-gray-900 tracking-tight">₹{price}</span>
                <span className="text-xs font-black text-primary uppercase tracking-widest">{priceLabel}</span>
              </div>
              <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                ₹{Math.round((price * 100000) / (features.sqft || 1000))} / sqft
              </div>
            </div>

            <h3 className="font-black text-gray-900 text-xl line-clamp-1 mb-2 group-hover:text-primary transition-colors tracking-tight">
              {title}
            </h3>

            <div className="flex items-center gap-2 text-gray-500 font-medium mb-6">
              <MapPin size={16} className="flex-shrink-0 text-primary" />
              <span className="truncate text-sm">{location.area}, {location.city}</span>
            </div>

            {/* Features Row */}
            <div className="grid grid-cols-2 gap-4 py-6 border-y border-gray-50 mb-6 mt-auto">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gray-50 flex items-center justify-center text-primary">
                  <Home size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase leading-none mb-1">Config</p>
                  <p className="text-sm font-black text-gray-900">{features.bhk} BHK</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gray-50 flex items-center justify-center text-primary">
                  <Maximize2 size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase leading-none mb-1">Area</p>
                  <p className="text-sm font-black text-gray-900">{features.sqft} sqft</p>
                </div>
              </div>
            </div>

            {/* Footer Action */}
            <div className="flex justify-between items-center pt-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black text-sm">
                  {owner.name ? owner.name[0].toUpperCase() : 'O'}
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Contact</p>
                  <p className="text-sm font-black text-gray-900">{owner.name}</p>
                </div>
              </div>
              <button className="bg-gray-900 hover:bg-primary text-white text-[10px] font-black px-6 py-3 rounded-2xl transition-all shadow-xl hover:-translate-y-1 active:translate-y-0 uppercase tracking-widest">
                View Details
              </button>
            </div>
          </div>
        </div>
      </Link>

      {/* Floating Buttons */}
      <div className="absolute top-5 right-5 flex flex-col gap-2 z-30">
        <button 
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleShortlist(property);
          }}
          className={`p-3 backdrop-blur-md rounded-full shadow-lg transition-all ${
            isShortlisted(_id) 
              ? "bg-red-50 text-red-500 hover:bg-red-100" 
              : "bg-white/90 text-gray-400 hover:bg-white hover:text-red-500"
          }`}
          title={isShortlisted(_id) ? "Remove from Shortlist" : "Add to Shortlist"}
        >
          <Heart size={18} fill={isShortlisted(_id) ? "currentColor" : "none"} />
        </button>
        <button 
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            addToCompare(property);
          }}
          className="p-3 bg-white/90 backdrop-blur-md rounded-full shadow-lg hover:bg-primary hover:text-white transition-all text-gray-400"
          title="Compare"
        >
          <ArrowRightLeft size={18} />
        </button>
      </div>
    </div>
  );
}
