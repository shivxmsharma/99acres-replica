"use client";

import { Shield, Lock, Eye, FileText } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="bg-white min-h-screen pb-24">
      <div className="bg-gray-900 py-24 text-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-black tracking-tight mb-4">Privacy Policy</h1>
          <p className="text-gray-400 text-sm font-bold uppercase tracking-[0.3em]">Last Updated: May 2026</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-16 prose prose-blue">
        <div className="bg-white rounded-[48px] p-12 border border-gray-100 shadow-2xl shadow-gray-100">
          <h2 className="text-2xl font-black text-gray-900 mb-6 uppercase tracking-tight flex items-center gap-3">
            <Shield className="text-primary" /> 1. Data Collection
          </h2>
          <p className="text-gray-600 leading-relaxed font-medium mb-8">
            We collect information you provide directly to us when you create an account, post a property, or contact us. This includes your name, email address, phone number, and property details.
          </p>

          <h2 className="text-2xl font-black text-gray-900 mb-6 uppercase tracking-tight flex items-center gap-3">
            <Eye className="text-primary" /> 2. How We Use Data
          </h2>
          <p className="text-gray-600 leading-relaxed font-medium mb-8">
            Your data is used to provide our services, communicate with you, and improve our platform's functionality. We may also use your data for marketing purposes if you've consented to it.
          </p>

          <h2 className="text-2xl font-black text-gray-900 mb-6 uppercase tracking-tight flex items-center gap-3">
            <Lock className="text-primary" /> 3. Data Security
          </h2>
          <p className="text-gray-600 leading-relaxed font-medium mb-8">
            We implement industry-standard security measures to protect your personal information from unauthorized access, disclosure, or alteration.
          </p>

          <h2 className="text-2xl font-black text-gray-900 mb-6 uppercase tracking-tight flex items-center gap-3">
            <FileText className="text-primary" /> 4. Cookies
          </h2>
          <p className="text-gray-600 leading-relaxed font-medium">
            We use cookies and similar technologies to track activity on our platform and hold certain information to enhance your browsing experience.
          </p>
        </div>
      </div>
    </div>
  );
}
