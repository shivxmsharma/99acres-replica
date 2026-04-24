"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

export default function SearchFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [bhk, setBhk] = useState(searchParams.get("bhk") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "10"); // Default 10Cr

  const handleBhkChange = (value) => {
    setBhk(value === bhk ? "" : value);
  };

  const handleApply = () => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (bhk) params.set("bhk", bhk);
    else params.delete("bhk");

    if (maxPrice && maxPrice !== "10") params.set("maxPrice", maxPrice);
    else params.delete("maxPrice");

    router.push(`/search?${params.toString()}`);
  };

  const handleReset = () => {
    setBhk("");
    setMaxPrice("10");
    router.push("/search");
  };

  return (
    <div className="p-6 bg-white rounded-3xl shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-black text-gray-900 uppercase text-[10px] tracking-widest">Refine Search</h3>
        <button 
          onClick={handleReset}
          className="text-[10px] font-bold text-primary hover:underline"
        >
          Reset
        </button>
      </div>
      
      <div className="space-y-8">
        <div>
          <label className="text-[10px] font-black text-gray-400 uppercase mb-3 block tracking-tighter">BHK Type</label>
          <div className="grid grid-cols-2 gap-2">
            {['1', '2', '3', '4+'].map(val => (
              <button 
                key={val} 
                onClick={() => handleBhkChange(val)}
                className={`px-3 py-2 border rounded-xl text-sm font-bold transition-all ${
                  bhk === val 
                  ? "border-primary bg-primary text-white" 
                  : "border-gray-100 text-gray-600 hover:border-primary hover:text-primary hover:bg-primary/5"
                }`}
              >
                {val} BHK
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-3">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Max Price</label>
            <span className="text-[10px] font-bold text-gray-900">₹{maxPrice} Cr</span>
          </div>
          <input 
            type="range" 
            min="0.5" 
            max="10" 
            step="0.5"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-primary" 
          />
          <div className="flex justify-between text-[8px] font-bold text-gray-400 mt-2 uppercase tracking-widest">
            <span>50 L</span>
            <span>10 Cr+</span>
          </div>
        </div>
      </div>

      <button 
        onClick={handleApply}
        className="w-full mt-10 bg-primary text-white font-black py-4 rounded-2xl text-xs uppercase tracking-widest shadow-xl shadow-primary/20 hover:bg-blue-700 transition-all hover:-translate-y-0.5 active:translate-y-0"
      >
        Apply Filters
      </button>
    </div>
  );
}
