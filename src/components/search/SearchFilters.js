"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

export default function SearchFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Multi-select states
  const [bhk, setBhk] = useState(searchParams.get("bhk")?.split(",") || []);
  const [types, setTypes] = useState(searchParams.get("type")?.split(",") || []);
  const [status, setStatus] = useState(searchParams.get("constructionStatus")?.split(",") || []);
  const [roles, setRoles] = useState(searchParams.get("ownerRole")?.split(",") || []);
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "10");

  const toggleFilter = (list, setList, value) => {
    if (list.includes(value)) {
      setList(list.filter(item => item !== value));
    } else {
      setList([...list, value]);
    }
  };

  const handleApply = () => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (bhk.length > 0) params.set("bhk", bhk.join(","));
    else params.delete("bhk");

    if (types.length > 0) params.set("type", types.join(","));
    else params.delete("type");

    if (status.length > 0) params.set("constructionStatus", status.join(","));
    else params.delete("constructionStatus");

    if (roles.length > 0) params.set("ownerRole", roles.join(","));
    else params.delete("ownerRole");

    if (maxPrice && maxPrice !== "10") params.set("maxPrice", maxPrice);
    else params.delete("maxPrice");

    router.push(`/search?${params.toString()}`);
  };

  const handleReset = () => {
    setBhk([]);
    setTypes([]);
    setStatus([]);
    setRoles([]);
    setMaxPrice("10");
    router.push("/search");
  };

  const FilterGroup = ({ title, options, list, setList }) => (
    <div className="border-b border-gray-50 pb-6 mb-6 last:border-0 last:pb-0 last:mb-0">
      <label className="text-[10px] font-black text-gray-400 uppercase mb-4 block tracking-tighter">{title}</label>
      <div className="grid grid-cols-2 gap-2">
        {options.map(val => (
          <button 
            key={val} 
            onClick={() => toggleFilter(list, setList, val)}
            className={`px-3 py-2 border rounded-xl text-[11px] font-bold transition-all text-left flex items-center justify-between ${
              list.includes(val) 
              ? "border-primary bg-primary text-white shadow-lg shadow-primary/20" 
              : "border-gray-100 text-gray-600 hover:border-primary hover:text-primary hover:bg-primary/5"
            }`}
          >
            {val}
            {list.includes(val) && <span className="w-1.5 h-1.5 bg-white rounded-full" />}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="p-8 bg-white rounded-[40px] shadow-2xl shadow-gray-200/50 border border-gray-100">
      <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-50">
        <h3 className="font-black text-gray-900 uppercase text-[11px] tracking-widest">Filters</h3>
        <button onClick={handleReset} className="text-[11px] font-black text-primary hover:underline uppercase tracking-tighter">Reset</button>
      </div>
      
      <div className="space-y-2">
        <FilterGroup 
          title="BHK Type" 
          options={['1', '2', '3', '4+']} 
          list={bhk} 
          setList={setBhk} 
        />

        <FilterGroup 
          title="Property Type" 
          options={['Apartment', 'Villa', 'Plot', 'Commercial']} 
          list={types} 
          setList={setTypes} 
        />

        <FilterGroup 
          title="Construction Status" 
          options={['Ready to Move', 'Under Construction']} 
          list={status} 
          setList={setStatus} 
        />

        <FilterGroup 
          title="Posted By" 
          options={['Owner', 'Agent', 'Builder']} 
          list={roles} 
          setList={setRoles} 
        />

        <div className="pt-4">
          <div className="flex justify-between items-center mb-4">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Budget Limit</label>
            <span className="text-sm font-black text-primary">₹{maxPrice} Cr</span>
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
          <div className="flex justify-between text-[9px] font-black text-gray-300 mt-3 uppercase tracking-widest">
            <span>50 L</span>
            <span>10 Cr+</span>
          </div>
        </div>
      </div>

      <button 
        onClick={handleApply}
        className="w-full mt-10 bg-gray-900 text-white font-black py-5 rounded-3xl text-xs uppercase tracking-widest shadow-2xl hover:bg-primary transition-all hover:-translate-y-1 active:translate-y-0"
      >
        Apply Filters
      </button>
    </div>
  );
}
