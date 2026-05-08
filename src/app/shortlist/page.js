"use client";

import { useShortlist } from "@/context/ShortlistContext";
import PropertyCard from "@/components/common/PropertyCard";
import Link from "next/link";
import { Heart, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function ShortlistPage() {
  const { shortlist } = useShortlist();

  if (shortlist.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[48px] p-16 text-center max-w-lg shadow-2xl shadow-gray-200 border border-gray-100"
        >
          <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-8">
            <Heart size={40} className="text-red-500" />
          </div>
          <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tight mb-4">Your Shortlist is Empty</h1>
          <p className="text-gray-500 mb-10 font-medium italic">Save properties you like to view them later and compare them easily.</p>
          <Link href="/search" className="bg-[#0041C2] text-white px-10 py-5 rounded-3xl font-black uppercase tracking-widest text-xs shadow-xl shadow-blue-900/20 hover:bg-blue-700 transition-all inline-flex items-center gap-2">
            Explore Properties <ArrowRight size={16} />
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="bg-red-50 text-red-500 p-2 rounded-xl">
                <Heart size={20} fill="currentColor" />
              </span>
              <h1 className="text-4xl font-black text-gray-900 tracking-tight uppercase">My Shortlist</h1>
            </div>
            <p className="text-gray-500 font-medium ml-12">You have {shortlist.length} properties saved</p>
          </div>
          
          <div className="flex items-center gap-4">
            <Link 
              href="/compare" 
              className="bg-white text-gray-900 border border-gray-200 px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-50 transition-all shadow-sm"
            >
              Compare Tool
            </Link>
            <Link 
              href="/search" 
              className="bg-[#0041C2] text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-900/10"
            >
              Find More
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {shortlist.map((property, idx) => (
            <motion.div
              key={property._id || property.objectID}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <PropertyCard property={property} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
