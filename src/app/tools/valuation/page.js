"use client";

import { useState } from "react";
import Link from "next/link";
import { Sparkles, MapPin, Maximize2, Building, BedDouble, Hammer, TrendingUp, AlertCircle, IndianRupee, Activity, Target, ChevronRight, Loader2 } from "lucide-react";

export default function ValuationPage() {
  const [form, setForm] = useState({
    location: "Gurgaon, Sector 45",
    size: 1500,
    propertyType: "Apartment",
    bedrooms: 3,
    condition: "Well Maintained",
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/ai/valuation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (res.ok) {
        setResult(data);
      } else {
        setError(data.error || "Failed to get valuation.");
      }
    } catch (err) {
      setError("Network error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12">
      <div className="w-full max-w-6xl px-4 flex flex-col">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-8">
          <Link href="/" className="hover:text-[#0041C2]">Home</Link>
          <ChevronRight size={10} />
          <span className="text-gray-900">Property Valuation</span>
        </div>

        <div className="mb-12 text-center lg:text-left">
          <div className="inline-flex items-center gap-3 px-4 py-2 bg-blue-50 text-[#0041C2] rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
            <Sparkles size={14} className="text-amber-500" /> AI-Powered Valuation
          </div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight uppercase mb-4">
            Smart Valuation Engine
          </h1>
          <p className="text-gray-500 max-w-2xl text-sm font-medium">
            Instantly estimate your property's market value based on real-time trends, locality pricing, and automated AI analysis.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* Input Form */}
          <div className="lg:col-span-5 bg-white rounded-[48px] shadow-2xl shadow-gray-200 border border-gray-100 p-10">
            <h2 className="text-xs font-black text-gray-900 uppercase tracking-widest mb-8">
              Property Parameters
            </h2>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <MapPin className="w-3 h-3 text-[#0041C2]" /> Locality / Sector
                </label>
                <input
                  type="text"
                  required
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-100 rounded-3xl px-6 py-4 text-gray-900 font-bold focus:outline-none focus:ring-2 focus:ring-[#0041C2]/20 transition-all"
                  placeholder="e.g. Sector 15, Gurgaon"
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">
                    Size (sq.ft)
                  </label>
                  <input
                    type="number"
                    required
                    value={form.size}
                    onChange={(e) => setForm({ ...form, size: Number(e.target.value) })}
                    className="w-full bg-gray-50 border border-gray-100 rounded-3xl px-6 py-4 text-gray-900 font-bold focus:outline-none focus:ring-2 focus:ring-[#0041C2]/20 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">
                    Bedrooms
                  </label>
                  <select
                    value={form.bedrooms}
                    onChange={(e) => setForm({ ...form, bedrooms: Number(e.target.value) })}
                    className="w-full bg-gray-50 border border-gray-100 rounded-3xl px-6 py-4 text-gray-900 font-bold focus:outline-none focus:ring-2 focus:ring-[#0041C2]/20 transition-all appearance-none"
                  >
                    {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n} BHK</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">
                  Property Type
                </label>
                <select
                  value={form.propertyType}
                  onChange={(e) => setForm({ ...form, propertyType: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-100 rounded-3xl px-6 py-4 text-gray-900 font-bold focus:outline-none focus:ring-2 focus:ring-[#0041C2]/20 transition-all appearance-none"
                >
                  <option value="Apartment">Apartment / Flat</option>
                  <option value="Villa">Independent Villa</option>
                  <option value="House">Independent House</option>
                  <option value="Plot">Empty Plot</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">
                  Condition & Age
                </label>
                <select
                  value={form.condition}
                  onChange={(e) => setForm({ ...form, condition: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-100 rounded-3xl px-6 py-4 text-gray-900 font-bold focus:outline-none focus:ring-2 focus:ring-[#0041C2]/20 transition-all appearance-none"
                >
                  <option value="Newly Built">Newly Built / Brand New</option>
                  <option value="Well Maintained">Well Maintained</option>
                  <option value="Older">Older (10+ Years)</option>
                  <option value="Needs Renovation">Needs Renovation</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-5 bg-[#0041C2] hover:bg-blue-700 text-white font-black rounded-3xl transition-all shadow-2xl shadow-blue-900/20 uppercase tracking-widest text-xs flex items-center justify-center gap-3"
              >
                {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Analyzing...</> : "Generate Valuation"}
              </button>

              {error && (
                <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-[10px] font-black uppercase tracking-wide flex items-center gap-2">
                  <AlertCircle size={16} /> {error}
                </div>
              )}
            </form>
          </div>

          {/* Results Area */}
          <div className="lg:col-span-7 flex flex-col gap-8">
            {!result && !loading ? (
              <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center p-12 bg-white rounded-[48px] border border-gray-100 shadow-sm border-dashed">
                <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-6">
                  <TrendingUp className="w-10 h-10 text-[#0041C2]" />
                </div>
                <h3 className="text-xl font-black text-gray-900 mb-2 uppercase tracking-tight">Ready to Valuate</h3>
                <p className="text-gray-400 max-w-sm text-sm font-medium">
                  Enter your property details and our AI will crunch market data to give you an instant estimate.
                </p>
              </div>
            ) : result && !loading ? (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="bg-[#0041C2] rounded-[48px] p-12 text-white shadow-2xl shadow-blue-900/20 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
                  <p className="text-[10px] font-black text-blue-200 uppercase tracking-[0.2em] mb-4">Estimated Market Value</p>
                  <h2 className="text-5xl font-black tracking-tighter mb-6">{result.estimatedRange}</h2>
                  <div className="flex items-center gap-3">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      result.confidence === 'High' ? 'bg-emerald-400 text-[#0041C2]' : 'bg-amber-400 text-[#0041C2]'
                    }`}>
                      {result.confidence} Confidence
                    </span>
                    <span className="text-xs font-bold text-blue-100 opacity-80 italic">Validated against local trends</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-white rounded-[40px] p-8 border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-3 bg-blue-50 text-[#0041C2] rounded-2xl">
                        <IndianRupee size={20} />
                      </div>
                      <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Avg Rate / Sq.ft</h4>
                    </div>
                    <p className="text-2xl font-black text-gray-900 tracking-tight">{result.averageRatePerSqFt}</p>
                  </div>

                  <div className="bg-white rounded-[40px] p-8 border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-3 bg-blue-50 text-[#0041C2] rounded-2xl">
                        <Activity size={20} />
                      </div>
                      <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Rental Yield</h4>
                    </div>
                    <p className="text-2xl font-black text-gray-900 tracking-tight">{result.rentalYieldEstimate}</p>
                  </div>

                  <div className="bg-white rounded-[40px] p-8 border border-gray-100 shadow-sm md:col-span-2">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-blue-50 text-[#0041C2] rounded-2xl mt-1">
                        <TrendingUp size={20} />
                      </div>
                      <div>
                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Market Insight</h4>
                        <p className="text-sm font-bold text-gray-600 leading-relaxed">{result.marketTrendSummary}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center p-12 bg-white rounded-[48px] border border-gray-100 shadow-sm">
                <Loader2 className="w-12 h-12 text-[#0041C2] animate-spin mb-6" />
                <h3 className="text-xl font-black text-gray-900 mb-2 uppercase tracking-tight">AI at work...</h3>
                <p className="text-gray-400 max-w-sm text-sm font-medium">Analyzing regional sales data and current market demand.</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
