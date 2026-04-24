"use client";

import { useState } from "react";
import { Phone, Mail } from "lucide-react";
import EnquiryModal from "./EnquiryModal";

export default function ContactActions({ property }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="space-y-4">
        <button 
          onClick={() => setIsModalOpen(true)}
          className="w-full bg-[#0041C2] hover:bg-[#0035A3] text-white font-black py-5 rounded-2xl flex items-center justify-center gap-3 transition-all transform hover:-translate-y-1 active:translate-y-0 shadow-xl shadow-[#0041C2]/20"
        >
          <Phone size={20} /> Contact Seller
        </button>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="w-full bg-white border-2 border-[#0041C2] text-[#0041C2] hover:bg-[#0041C2] hover:text-white font-black py-5 rounded-2xl flex items-center justify-center gap-3 transition-colors duration-300"
        >
          <Mail size={20} /> Enquiry Form
        </button>
      </div>

      <EnquiryModal 
        property={property} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
}
