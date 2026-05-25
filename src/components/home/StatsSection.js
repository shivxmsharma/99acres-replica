"use client";

import { motion } from "framer-motion";

const STATS = [
  { value: "15", suffix: "M+", sub: "Monthly Visitors" },
  { value: "1.2", suffix: "M+", sub: "Verified Listings" },
  { value: "500", suffix: "k+", sub: "Owners/Dealers" },
  { value: "100", suffix: "k+", sub: "New Projects" },
];

export default function StatsSection() {
  return (
    <section className="py-24 bg-gradient-to-r from-[#0041C2]/5 to-[#0041C2]/10 relative overflow-hidden">
      {/* Decorative patterns */}
      <div className="absolute inset-0 bg-[radial-gradient(#0041C2_1px,transparent_1px)] [background-size:20px_20px] opacity-[0.05] -z-10"></div>
      
      <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white text-primary rounded-full text-xs font-black uppercase tracking-widest mb-4 shadow-sm border border-primary/10">
            Trust & Transparency
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight uppercase">
            India's No. 1 Property Portal
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-16 text-lg font-medium">
            Providing a seamless experience for buyers, sellers and renters with our advanced technology and verification systems.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {STATS.map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.1, type: "spring" }}
              className="p-8 bg-white/60 backdrop-blur-md rounded-[32px] border border-white/50 shadow-sm hover:shadow-xl transition-all duration-300 group"
            >
              <div className="text-5xl font-black text-primary mb-2 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                {stat.value}
                <span className="text-4xl text-primary/70">{stat.suffix}</span>
              </div>
              <div className="text-gray-600 font-bold uppercase tracking-widest text-sm mt-4">
                {stat.sub}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
