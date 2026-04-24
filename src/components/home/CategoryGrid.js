"use client";

import { Home, Key, TrendingUp, UserPlus, Map, Lightbulb, User, Building2, Building } from "lucide-react";
import { motion } from "framer-motion";

const CATEGORIES = [
  { id: 1, name: "Buying a home", desc: "Find, Buy & Own Your Dream Home", icon: Home, color: "bg-blue-50 text-blue-600" },
  { id: 2, name: "Renting a home", desc: "Rental Homes for Everyone", icon: Key, color: "bg-green-50 text-green-600" },
  { id: 3, name: "Invest in Real Estate", desc: "Investment options for every budget", icon: TrendingUp, color: "bg-orange-50 text-orange-600", isNew: true },
  { id: 4, name: "Sell/Rent property", desc: "Register to get Genuine Leads", icon: UserPlus, color: "bg-purple-50 text-purple-600" },
  { id: 5, name: "Plots/Land", desc: "Residential & Agricultural Plots/Land", icon: Map, color: "bg-yellow-50 text-yellow-600" },
  { id: 6, name: "Explore Insights", desc: "Expert insights on Indian real estate", icon: Lightbulb, color: "bg-cyan-50 text-cyan-600", isNew: true },
  { id: 7, name: "PG and co-living", desc: "Co-living and PG for Rent", icon: User, color: "bg-rose-50 text-rose-600" },
  { id: 8, name: "Buy Commercial", desc: "Buy Commercial properties", icon: Building2, color: "bg-indigo-50 text-indigo-600" },
  { id: 9, name: "Lease Commercial", desc: "Lease Commercial properties", icon: Building, color: "bg-slate-50 text-slate-600" },
];

export default function CategoryGrid() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-8 uppercase tracking-wide">
          GET STARTED WITH EXPLORING REAL ESTATE OPTIONS
        </h2>

        <div className="flex overflow-x-auto no-scrollbar gap-6 pb-8">
          {CATEGORIES.map((cat) => (
            <motion.div
              key={cat.id}
              whileHover={{ y: -5 }}
              className="flex-shrink-0 w-[240px] p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all cursor-pointer group bg-white"
            >
              <div className={`w-12 h-12 ${cat.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <cat.icon size={24} />
              </div>
              
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-bold text-gray-900 text-lg leading-tight">{cat.name}</h3>
                {cat.isNew && (
                  <span className="text-[10px] font-black bg-secondary text-white px-1.5 py-0.5 rounded uppercase tracking-tighter">
                    NEW
                  </span>
                )}
              </div>
              
              <p className="text-sm text-gray-500 font-medium">
                {cat.desc}
              </p>

              <div className="mt-6 flex items-center text-primary font-bold text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                Explore Now <span className="ml-1">→</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
