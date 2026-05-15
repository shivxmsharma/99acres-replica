"use client";

import { Mail, Phone, MapPin, Send, MessageSquare, Clock } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <div className="bg-primary py-24 text-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-black tracking-tight mb-4 italic">Get in Touch</h1>
          <p className="text-blue-100 text-lg font-medium max-w-2xl mx-auto">
            Have questions about a property or need help with your listing? Our support team is here to help you 24/7.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-16 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Contact Info Cards */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-8 rounded-[40px] shadow-2xl shadow-gray-100 border border-gray-100">
              <div className="w-12 h-12 bg-blue-50 text-primary rounded-2xl flex items-center justify-center mb-6">
                <Phone size={24} />
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-2">Call Us</h3>
              <p className="text-gray-500 font-medium mb-4 text-sm">Toll Free Customer Support</p>
              <p className="text-lg font-black text-primary">1800 419 9099</p>
            </div>

            <div className="bg-white p-8 rounded-[40px] shadow-2xl shadow-gray-100 border border-gray-100">
              <div className="w-12 h-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mb-6">
                <Mail size={24} />
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-2">Email Us</h3>
              <p className="text-gray-500 font-medium mb-4 text-sm">General Inquiries</p>
              <p className="text-lg font-black text-green-600">support@99acres-replica.com</p>
            </div>

            <div className="bg-white p-8 rounded-[40px] shadow-2xl shadow-gray-100 border border-gray-100">
              <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-6">
                <MapPin size={24} />
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-2">Office</h3>
              <p className="text-gray-500 font-medium mb-4 text-sm">Headquarters</p>
              <p className="text-sm font-bold text-gray-800 leading-relaxed">
                A-88, Sector 2, Noida,<br />
                Uttar Pradesh, India - 201301
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2 bg-white rounded-[40px] shadow-2xl shadow-gray-100 border border-gray-100 p-12">
            <h2 className="text-3xl font-black text-gray-900 mb-8 tracking-tight">Send us a Message</h2>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Full Name</label>
                  <input type="text" placeholder="John Doe" className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Email Address</label>
                  <input type="email" placeholder="john@example.com" className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Subject</label>
                <input type="text" placeholder="How can we help?" className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Message</label>
                <textarea rows="5" placeholder="Tell us more about your inquiry..." className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold resize-none" />
              </div>
              <button className="w-full bg-primary text-white py-5 rounded-[24px] font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-blue-900/20 hover:bg-blue-700 transition-all flex items-center justify-center gap-3">
                <Send size={18} /> Send Message
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}
