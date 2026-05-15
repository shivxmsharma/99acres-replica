"use client";

import { Building2, Users, Target, ShieldCheck, Globe } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="bg-white min-h-screen">
      <div className="bg-primary py-24 text-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-black tracking-tight mb-4 italic">About NestIQ</h1>
          <p className="text-blue-100 text-lg font-medium max-w-2xl mx-auto uppercase tracking-widest">
            Innovating the future of Indian Real Estate
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-24 space-y-24">
        {/* Mission */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl font-black text-gray-900 mb-6 tracking-tight">Our Mission</h2>
            <p className="text-gray-600 text-lg leading-relaxed font-medium">
              NestIQ (99acres-Replica) was founded with a single vision: to simplify the home buying and selling process through cutting-edge technology and transparent data. We aim to be the most trusted property portal in India, providing a seamless experience for buyers, sellers, and agents alike.
            </p>
          </div>
          <div className="bg-blue-50 rounded-[48px] p-12 flex items-center justify-center">
            <Target size={120} className="text-primary opacity-20" />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { label: "Listings", value: "5M+", icon: Building2 },
            { label: "Happy Users", value: "20M+", icon: Users },
            { label: "Verified Properties", value: "100%", icon: ShieldCheck },
            { label: "Cities Covered", value: "600+", icon: Globe }
          ].map((stat, i) => (
            <div key={i} className="text-center p-8 bg-gray-50 rounded-[32px] border border-gray-100">
              <div className="w-12 h-12 bg-white text-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                <stat.icon size={24} />
              </div>
              <p className="text-3xl font-black text-gray-900 mb-1">{stat.value}</p>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
