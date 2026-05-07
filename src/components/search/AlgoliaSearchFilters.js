"use client";

import { useRefinementList, useRange } from "react-instantsearch";

function CustomRefinementList({ attribute, title }) {
  const { items, refine } = useRefinementList({ attribute });

  if (items.length === 0) return null;

  return (
    <div className="border-b border-gray-50 pb-6 mb-6 last:border-0 last:pb-0 last:mb-0">
      <label className="text-[10px] font-black text-gray-400 uppercase mb-4 block tracking-tighter">{title}</label>
      <div className="grid grid-cols-2 gap-2">
        {items.map(item => (
          <button 
            key={item.label} 
            onClick={() => refine(item.value)}
            className={`px-3 py-2 border rounded-xl text-[11px] font-bold transition-all text-left flex items-center justify-between ${
              item.isRefined 
              ? "border-[#0041C2] bg-[#0041C2] text-white shadow-lg shadow-blue-900/20" 
              : "border-gray-100 text-gray-600 hover:border-[#0041C2] hover:text-[#0041C2] hover:bg-blue-50"
            }`}
          >
            {item.label}
            {item.isRefined && <span className="w-1.5 h-1.5 bg-white rounded-full" />}
          </button>
        ))}
      </div>
    </div>
  );
}

function PriceRangeSlider({ attribute, title }) {
  const { start, range, refine } = useRange({ attribute });
  const [min, max] = start;

  const handleChange = (e) => {
    refine([parseFloat(e.target.value), range.max]);
  };

  return (
    <div className="pt-4">
      <div className="flex justify-between items-center mb-4">
        <label className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">{title}</label>
        <span className="text-sm font-black text-[#0041C2]">₹{min?.toLocaleString('en-IN')}</span>
      </div>
      <input 
        type="range" 
        min={range.min} 
        max={range.max} 
        step={100000}
        value={min || range.min}
        onChange={handleChange}
        className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-[#0041C2]" 
      />
      <div className="flex justify-between text-[9px] font-black text-gray-300 mt-3 uppercase tracking-widest">
        <span>Min</span>
        <span>Max</span>
      </div>
    </div>
  );
}

export default function AlgoliaSearchFilters() {
  return (
    <div className="p-8 bg-white rounded-[40px] shadow-2xl shadow-gray-200/50 border border-gray-100">
      <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-50">
        <h3 className="font-black text-gray-900 uppercase text-[11px] tracking-widest">Filters</h3>
      </div>
      
      <div className="space-y-2">
        <CustomRefinementList title="BHK Type" attribute="bhk" />
        <CustomRefinementList title="Property Type" attribute="type" />
        <CustomRefinementList title="City" attribute="city" />
        <CustomRefinementList title="Area" attribute="area" />
        <PriceRangeSlider title="Price Range" attribute="price" />
      </div>
    </div>
  );
}
