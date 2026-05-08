"use client";

import { useCompare } from "@/context/CompareContext";
import SafeImage from "@/components/common/SafeImage";
import { X, Check, Minus, IndianRupee, MapPin, Maximize2, Bed, Building, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function ComparePage() {
  const { compareList, removeFromCompare } = useCompare();

  if (compareList.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8">
        <div className="bg-white rounded-[48px] p-16 text-center max-w-lg shadow-2xl shadow-gray-200 border border-gray-100">
          <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-8">
            <X size={40} className="text-[#0041C2]" />
          </div>
          <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tight mb-4">No Properties to Compare</h1>
          <p className="text-gray-500 mb-10 font-medium italic">Add properties from the search page to see them side-by-side here.</p>
          <Link href="/search" className="bg-[#0041C2] text-white px-10 py-5 rounded-3xl font-black uppercase tracking-widest text-xs shadow-xl shadow-blue-900/20 hover:bg-blue-700 transition-all">
            Go to Search
          </Link>
        </div>
      </div>
    );
  }

  const features = [
    { label: "Price", key: "price", icon: IndianRupee, format: (v) => `₹${v?.toLocaleString('en-IN')}` },
    { label: "Type", key: "type", icon: Building },
    { label: "BHK", key: "bhk", icon: Bed },
    { label: "Area", key: "sqft", icon: Maximize2, format: (v) => `${v} sq.ft` },
    { label: "City", key: "city", icon: MapPin },
    { label: "Locality", key: "area", icon: MapPin },
    { label: "Verified", key: "isVerified", type: "boolean", icon: ShieldCheck },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-12 flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight uppercase mb-2">Compare Properties</h1>
            <p className="text-gray-500 font-medium">Analyzing {compareList.length} properties side-by-side</p>
          </div>
          <Link href="/search" className="text-[#0041C2] font-black text-xs uppercase tracking-widest hover:underline">
            + Add more properties
          </Link>
        </div>

        <div className="bg-white rounded-[48px] shadow-2xl shadow-gray-200 border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className="p-8 w-64 bg-gray-50/50"></th>
                  {compareList.map((property) => (
                    <th key={property._id} className="p-8 min-w-[300px] align-top relative group">
                      <button 
                        onClick={() => removeFromCompare(property._id)}
                        className="absolute top-4 right-4 p-2 bg-gray-50 text-gray-400 hover:text-red-500 rounded-full transition-all"
                      >
                        <X size={16} />
                      </button>
                      <div className="relative h-48 rounded-3xl overflow-hidden mb-6">
                        <SafeImage src={property.coverPhoto} alt="" fill className="object-cover" />
                      </div>
                      <Link href={`/property/${property.objectID || property._id}`} className="text-lg font-black text-gray-900 hover:text-[#0041C2] line-clamp-2 leading-tight uppercase tracking-tighter">
                        {property.title}
                      </Link>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {features.map((feature, idx) => (
                  <tr key={feature.label} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50/30"}>
                    <td className="p-8 border-r border-gray-50">
                      <div className="flex items-center gap-3">
                        <feature.icon size={16} className="text-[#0041C2]" />
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{feature.label}</span>
                      </div>
                    </td>
                    {compareList.map((property) => (
                      <td key={property._id} className="p-8">
                        {feature.type === "boolean" ? (
                          property[feature.key] ? (
                            <Check className="text-emerald-500" size={20} />
                          ) : (
                            <Minus className="text-gray-200" size={20} />
                          )
                        ) : (
                          <span className="font-black text-gray-900">
                            {feature.format ? feature.format(property[feature.key]) : property[feature.key]}
                          </span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
                <tr>
                  <td className="p-8 bg-gray-50/50"></td>
                  {compareList.map((property) => (
                    <td key={property._id} className="p-8">
                      <Link 
                        href={`/property/${property.objectID || property._id}`}
                        className="block text-center bg-blue-50 text-[#0041C2] px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#0041C2] hover:text-white transition-all shadow-sm"
                      >
                        View Details
                      </Link>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
