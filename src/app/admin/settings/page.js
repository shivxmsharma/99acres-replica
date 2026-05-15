"use client";

import { 
  Settings, 
  Shield, 
  Bell, 
  Globe, 
  Lock, 
  User, 
  CreditCard,
  ChevronRight,
  Save
} from "lucide-react";

export default function AdminSettings() {
  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Platform Settings</h2>
        <p className="text-gray-500 text-sm font-medium">Configure global platform behavior and security.</p>
      </div>

      <div className="grid gap-6">
        {/* Settings Sections */}
        {[
          { icon: User, title: "Admin Profile", desc: "Manage your personal information and roles." },
          { icon: Shield, title: "Security & Access", desc: "Manage authentication methods and user permissions." },
          { icon: Bell, title: "Notification Settings", desc: "Configure how system alerts are delivered." },
          { icon: Globe, title: "Localization", desc: "Update default currency, language, and regional formats." },
          { icon: CreditCard, title: "Subscription Plans", desc: "Manage pricing tiers for agents and builders." },
          { icon: Lock, title: "API Configuration", desc: "Manage external keys for Cloudinary and Algolia." }
        ].map((item, i) => (
          <div key={i} className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-xl transition-all cursor-pointer group flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-primary/10 group-hover:text-primary transition-all">
                <item.icon size={24} />
              </div>
              <div>
                <h3 className="text-base font-black text-gray-900 group-hover:text-primary transition-colors">{item.title}</h3>
                <p className="text-xs font-medium text-gray-400 mt-1">{item.desc}</p>
              </div>
            </div>
            <ChevronRight className="text-gray-300 group-hover:text-primary transform group-hover:translate-x-1 transition-all" size={20} />
          </div>
        ))}
      </div>

      <div className="pt-8 flex justify-end">
        <button className="flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-900/20">
          <Save size={18} /> Save Global Changes
        </button>
      </div>
    </div>
  );
}
