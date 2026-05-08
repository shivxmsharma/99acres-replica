"use client";

import { useState } from "react";
import { Calculator, MapPin, IndianRupee, ChevronRight, Info } from "lucide-react";
import Link from "next/link";

export default function StampDutyPage() {
  const [propertyValue, setPropertyValue] = useState(5000000);
  const [gender, setGender] = useState("male");
  const [location, setLocation] = useState("delhi");

  const calculateDuty = () => {
    // Basic approximate rates for major Indian cities
    const rates = {
      delhi: { male: 6, female: 4, joint: 5 },
      mumbai: { male: 6, female: 5, joint: 6 },
      bangalore: { male: 5, female: 5, joint: 5 },
      gurgaon: { male: 7, female: 5, joint: 6 },
      noida: { male: 7, female: 5, joint: 6 },
    };

    const percentage = rates[location][gender];
    const dutyAmount = (propertyValue * percentage) / 100;
    const registrationFee = Math.min((propertyValue * 1) / 100, 30000); // Capped at 30k in many places for demo

    return {
      percentage,
      dutyAmount,
      registrationFee,
      total: dutyAmount + registrationFee,
    };
  };

  const results = calculateDuty();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12">
      <div className="w-full max-w-6xl px-4 flex flex-col">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-8">
          <Link href="/" className="hover:text-[#0041C2]">Home</Link>
          <ChevronRight size={10} />
          <span className="text-gray-900">Stamp Duty Calculator</span>
        </div>

        <div className="mb-12 text-center lg:text-left">
          <div className="inline-flex items-center gap-3 px-4 py-2 bg-blue-50 text-[#0041C2] rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
            <Calculator size={14} /> Legal & Registration Tools
          </div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight uppercase mb-4">
            Stamp Duty & Registration Calculator
          </h1>
          <p className="text-gray-500 max-w-2xl text-sm font-medium">
            Estimate your property registration and stamp duty charges instantly. Avoid last-minute financial surprises during your property purchase.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* Inputs Section */}
          <div className="lg:col-span-7 bg-white rounded-[48px] shadow-2xl shadow-gray-200 border border-gray-100 p-10">
            <div className="space-y-12">

              <div className="space-y-6">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex justify-between">
                  <span>Property Value (₹)</span>
                  <span className="text-[#0041C2]">₹ {propertyValue.toLocaleString('en-IN')}</span>
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                    <IndianRupee className="h-5 w-5 text-gray-300 group-focus-within:text-[#0041C2] transition-colors" />
                  </div>
                  <input
                    type="number"
                    value={propertyValue}
                    onChange={(e) => setPropertyValue(Number(e.target.value))}
                    className="w-full pl-14 pr-8 py-5 bg-gray-50 border border-gray-100 rounded-3xl focus:ring-2 focus:ring-[#0041C2]/20 focus:border-[#0041C2] outline-none text-gray-900 text-lg font-black transition-all"
                    placeholder="e.g. 50,00,000"
                  />
                </div>
              </div>

              <div className="space-y-6">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">
                  Buyer Type / Gender
                </label>
                <div className="grid grid-cols-3 gap-4">
                  {['male', 'female', 'joint'].map((type) => (
                    <button
                      key={type}
                      onClick={() => setGender(type)}
                      className={`py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${gender === type
                          ? "bg-[#0041C2] text-white shadow-xl shadow-blue-900/20"
                          : "bg-gray-50 text-gray-400 border border-gray-100 hover:bg-white hover:text-[#0041C2]"
                        }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#0041C2]" /> City / State
                </label>
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-8 py-5 bg-gray-50 border border-gray-100 rounded-3xl focus:ring-2 focus:ring-[#0041C2]/20 focus:border-[#0041C2] outline-none text-gray-900 text-sm font-black transition-all appearance-none cursor-pointer"
                >
                  <option value="delhi">Delhi</option>
                  <option value="mumbai">Mumbai</option>
                  <option value="bangalore">Bangalore</option>
                  <option value="gurgaon">Gurgaon</option>
                  <option value="noida">Noida</option>
                </select>
              </div>

            </div>
          </div>

          {/* Results Section */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            <div className="bg-white rounded-[48px] shadow-2xl shadow-gray-200 border border-gray-100 p-10 relative overflow-hidden">
              <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest mb-10 border-b border-gray-50 pb-6">
                Estimated Charges
              </h3>

              <div className="space-y-8">
                <div className="flex justify-between items-center group">
                  <div>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-tight block">Stamp Duty ({results.percentage}%)</span>
                  </div>
                  <span className="text-xl font-black text-gray-900">
                    ₹ {results.dutyAmount.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="flex justify-between items-center group">
                  <div>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-tight block">Registration Fee</span>
                    <span className="text-[9px] text-gray-300 font-black uppercase mt-1 block">Government standard rate</span>
                  </div>
                  <span className="text-xl font-black text-gray-900">
                    ₹ {results.registrationFee.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="pt-10 mt-2 border-t border-gray-50">
                  <div className="flex flex-col gap-2">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Total Additional Cost</span>
                    <span className="text-5xl font-black text-[#0041C2] tracking-tighter">
                      ₹ {results.total.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-12 p-6 bg-blue-50 border border-blue-100 rounded-3xl flex gap-4">
                <Info size={20} className="text-[#0041C2] shrink-0" />
                <p className="text-[10px] text-blue-900/70 leading-relaxed font-bold uppercase tracking-wide">
                  Note: These are estimated standard rates. Actual stamp duty might vary based on exact locality, municipal rules, and legal surcharges.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
