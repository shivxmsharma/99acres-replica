"use client";

import { Scale, AlertCircle, CheckCircle } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="bg-white min-h-screen pb-24">
      <div className="bg-gray-100 py-24 text-gray-900">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-black tracking-tight mb-4">Terms & Conditions</h1>
          <p className="text-gray-500 text-sm font-bold uppercase tracking-[0.3em]">Legal Agreement</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="space-y-12">
          <section>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-black">1</div>
              <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Acceptance of Terms</h2>
            </div>
            <p className="text-gray-600 leading-relaxed font-medium pl-14">
              By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement.
            </p>
          </section>

          <section>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-black">2</div>
              <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">User Obligations</h2>
            </div>
            <p className="text-gray-600 leading-relaxed font-medium pl-14">
              Users are responsible for providing accurate property details and maintaining the confidentiality of their account credentials.
            </p>
          </section>

          <section>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-black">3</div>
              <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Property Listings</h2>
            </div>
            <p className="text-gray-600 leading-relaxed font-medium pl-14">
              NestIQ reserves the right to remove any listing that violates our quality standards or contains fraudulent information.
            </p>
          </section>

          <div className="bg-red-50 p-8 rounded-[32px] border border-red-100 flex gap-4">
            <AlertCircle className="text-red-600 shrink-0" size={24} />
            <p className="text-red-700 text-sm font-bold leading-relaxed">
              Disclaimer: This application is a technical demonstration (Replica). All data provided is for demonstration purposes only.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
