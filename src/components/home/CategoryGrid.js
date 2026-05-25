"use client";

import { Home, Key, TrendingUp, UserPlus, Map, Lightbulb, User, Building2, Building } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

const CATEGORIES = [
  { id: 1, name: "Buying a home", desc: "Find, Buy & Own Your Dream Home", icon: Home, color: "bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white", href: "/search?status=Buy" },
  { id: 2, name: "Renting a home", desc: "Rental Homes for Everyone", icon: Key, color: "bg-green-50 text-green-600 hover:bg-green-600 hover:text-white", href: "/search?status=Rent" },
  { id: 3, name: "Invest in Real Estate", desc: "Investment options for every budget", icon: TrendingUp, color: "bg-orange-50 text-orange-600 hover:bg-orange-600 hover:text-white", isNew: true, href: "/search?type=Plot" },
  { id: 4, name: "Sell/Rent property", desc: "Register to get Genuine Leads", icon: UserPlus, color: "bg-purple-50 text-purple-600 hover:bg-purple-600 hover:text-white", href: "/post-property" },
  { id: 5, name: "Plots/Land", desc: "Residential & Agricultural Plots/Land", icon: Map, color: "bg-yellow-50 text-yellow-600 hover:bg-yellow-600 hover:text-white", href: "/search?type=Plot" },
  { id: 6, name: "Explore Insights", desc: "Expert insights on Indian real estate", icon: Lightbulb, color: "bg-cyan-50 text-cyan-600 hover:bg-cyan-600 hover:text-white", isNew: true, href: "/tools/valuation" },
  { id: 7, name: "PG and co-living", desc: "Co-living and PG for Rent", icon: User, color: "bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white", href: "/search?type=Studio" },
  { id: 8, name: "Buy Commercial", desc: "Buy Commercial properties", icon: Building2, color: "bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white", href: "/search?type=Commercial&status=Buy" },
  { id: 9, name: "Lease Commercial", desc: "Lease Commercial properties", icon: Building, color: "bg-slate-50 text-slate-600 hover:bg-slate-600 hover:text-white", href: "/search?type=Commercial&status=Rent" },
];

export default function CategoryGrid() {
  const router = useRouter();

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50/30 to-white relative overflow-hidden">
      {/* Decorative ambient background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-blue-50/40 rounded-full blur-3xl opacity-60"></div>
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-[#0041C2]/5 rounded-full blur-3xl opacity-50"></div>
      </div>

      <div className="max-w-full mx-auto px-4 sm:px-10 lg:px-16">
        
        {/* Modern Header System */}
        <div className="flex flex-col items-start mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-[#0041C2] rounded-full text-[10px] font-black uppercase tracking-widest mb-4 border border-blue-100 shadow-sm">
            <span>✨</span> Interactive Directory
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-gray-900 uppercase tracking-tight mb-3">
            Explore Property Segments
          </h2>
          <div className="h-1.5 w-24 bg-primary rounded-full mb-4" />
          <p className="text-gray-500 font-medium text-lg max-w-2xl mt-2">
            Choose from a wide spectrum of verified properties, expert advisory resources, and tools.
          </p>
        </div>

        {/* 3x3 Perfectly Balanced Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {CATEGORIES.map((cat, idx) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: idx * 0.05, type: "spring", stiffness: 100 }}
              whileHover={{ y: -8, scale: 1.02 }}
              onClick={() => router.push(cat.href || "/search")}
              className="relative p-8 bg-white/70 backdrop-blur-xl border border-gray-100 rounded-[36px] shadow-sm hover:shadow-[0_24px_50px_-16px_rgba(0,65,194,0.08)] hover:border-blue-100 transition-all duration-300 cursor-pointer group flex flex-col justify-between overflow-hidden"
            >
              {/* Soft ambient lighting */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

              <div>
                {/* Icon Capsule with rotation spring */}
                <div className="flex justify-between items-start mb-6">
                  <div className={`w-14 h-14 ${cat.color} rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:rotate-6 group-hover:scale-105 shadow-sm`}>
                    <cat.icon size={26} strokeWidth={2.2} />
                  </div>
                  {cat.isNew && (
                    <span className="text-[8px] font-black bg-secondary text-white px-2 py-0.5 rounded-full uppercase tracking-widest shadow-sm">
                      New
                    </span>
                  )}
                </div>

                {/* Details */}
                <h3 className="font-black text-gray-900 text-xl leading-tight mb-2 group-hover:text-primary transition-colors tracking-tight uppercase">
                  {cat.name}
                </h3>
                <p className="text-gray-500 text-sm font-medium leading-relaxed">
                  {cat.desc}
                </p>
              </div>

              {/* Expand Chevron Action */}
              <div className="mt-8 flex items-center text-primary font-black text-xs uppercase tracking-widest opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                Explore Segments <span className="ml-1.5 group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
