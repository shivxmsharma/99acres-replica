"use client";

import { useState } from "react";
import { X, ShieldCheck, Mail, Phone, User as UserIcon, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function EnquiryModal({ property, isOpen, onClose }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    userType: "Buyer",
    message: `I'm interested in "${property.title}". Please get in touch with me.`
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validate = () => {
    let newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Full name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    if (!formData.mobile.trim()) {
      newErrors.mobile = "Mobile number is required";
    } else if (!/^\d{10}$/.test(formData.mobile.replace(/\D/g, ''))) {
      newErrors.mobile = "Enter a valid 10-digit number";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    setIsSubmitting(true);
    
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          propertyId: property._id,
          ...formData
        })
      });
      
      if (res.ok) {
        setIsSuccess(true);
        setTimeout(() => {
          onClose();
          setIsSuccess(false);
          setFormData({ ...formData, name: "", email: "", mobile: "" });
          setErrors({});
        }, 3000);
      }
    } catch (error) {
      console.error("Failed to submit enquiry:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-white w-full max-w-md rounded-[32px] overflow-hidden shadow-2xl"
          >
            {/* Header */}
            <div className="bg-[#0041C2] p-6 text-white relative">
              <button 
                onClick={onClose}
                className="absolute top-5 right-5 p-1.5 hover:bg-white/10 rounded-full transition-colors"
              >
                <X size={18} />
              </button>
              <div className="flex items-center gap-2 mb-1.5">
                <ShieldCheck size={16} className="text-green-400" />
                <span className="text-[9px] font-black uppercase tracking-widest text-white/80">Verified Listing</span>
              </div>
              <h3 className="text-xl font-black tracking-tight leading-tight pr-8">
                Contact Seller for {property.title}
              </h3>
            </div>

            {/* Content */}
            <div className="p-6">
              {!isSuccess ? (
                <form onSubmit={handleSubmit} noValidate className="space-y-5">
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <div className="relative group">
                        <UserIcon className={`absolute left-4 top-3.5 ${errors.name ? 'text-red-400' : 'text-gray-400'} group-focus-within:text-primary transition-colors`} size={16} />
                        <input 
                          type="text"
                          placeholder="Your Full Name"
                          className={`w-full pl-11 pr-4 py-3 bg-gray-50 border ${errors.name ? 'border-red-200 bg-red-50/30' : 'border-gray-100'} rounded-xl focus:outline-none focus:border-primary focus:bg-white transition-all font-bold text-sm text-gray-900`}
                          value={formData.name}
                          onChange={(e) => {
                            setFormData({...formData, name: e.target.value});
                            if (errors.name) setErrors({...errors, name: null});
                          }}
                        />
                      </div>
                      {errors.name && <p className="text-[10px] font-bold text-red-500 ml-4 tracking-tight">{errors.name}</p>}
                    </div>
                    
                    <div className="space-y-1">
                      <div className="relative group">
                        <Mail className={`absolute left-4 top-3.5 ${errors.email ? 'text-red-400' : 'text-gray-400'} group-focus-within:text-primary transition-colors`} size={16} />
                        <input 
                          type="email"
                          placeholder="Email Address"
                          className={`w-full pl-11 pr-4 py-3 bg-gray-50 border ${errors.email ? 'border-red-200 bg-red-50/30' : 'border-gray-100'} rounded-xl focus:outline-none focus:border-primary focus:bg-white transition-all font-bold text-sm text-gray-900`}
                          value={formData.email}
                          onChange={(e) => {
                            setFormData({...formData, email: e.target.value});
                            if (errors.email) setErrors({...errors, email: null});
                          }}
                        />
                      </div>
                      {errors.email && <p className="text-[10px] font-bold text-red-500 ml-4 tracking-tight">{errors.email}</p>}
                    </div>

                    <div className="space-y-1">
                      <div className="relative group">
                        <Phone className={`absolute left-4 top-3.5 ${errors.mobile ? 'text-red-400' : 'text-gray-400'} group-focus-within:text-primary transition-colors`} size={16} />
                        <input 
                          type="tel"
                          placeholder="Mobile Number"
                          className={`w-full pl-11 pr-4 py-3 bg-gray-50 border ${errors.mobile ? 'border-red-200 bg-red-50/30' : 'border-gray-100'} rounded-xl focus:outline-none focus:border-primary focus:bg-white transition-all font-bold text-sm text-gray-900`}
                          value={formData.mobile}
                          onChange={(e) => {
                            setFormData({...formData, mobile: e.target.value});
                            if (errors.mobile) setErrors({...errors, mobile: null});
                          }}
                        />
                      </div>
                      {errors.mobile && <p className="text-[10px] font-bold text-red-500 ml-4 tracking-tight">{errors.mobile}</p>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">I am a</label>
                    <div className="flex flex-wrap gap-2">
                      {["Buyer", "Agent", "Tenant"].map(type => (
                        <button 
                          key={type}
                          type="button"
                          onClick={() => setFormData({...formData, userType: type})}
                          className={`px-3 py-1.5 rounded-lg text-[10px] font-black transition-all ${
                            formData.userType === type 
                            ? "bg-primary text-white shadow-md shadow-primary/20" 
                            : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                          }`}
                        >
                          {type.toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button 
                    disabled={isSubmitting}
                    type="submit"
                    className="w-full bg-[#0041C2] hover:bg-[#0035A3] text-white font-black py-4 rounded-xl flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5 active:translate-y-0 shadow-lg shadow-primary/20 disabled:opacity-50 disabled:transform-none text-sm uppercase tracking-widest"
                  >
                    {isSubmitting ? "Sending..." : "Request Details"}
                  </button>
                  
                  <p className="text-[9px] text-gray-400 text-center font-bold px-4 leading-tight">
                    By clicking you agree to our Terms of Use and Privacy Policy. Your details will be shared with the advertiser.
                  </p>
                </form>
              ) : (
                <div className="py-8 flex flex-col items-center text-center">
                  <motion.div 
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-16 h-16 bg-green-50 text-green-500 rounded-full flex items-center justify-center mb-4"
                  >
                    <CheckCircle2 size={32} />
                  </motion.div>
                  <h4 className="text-xl font-black text-gray-900 mb-1.5">Request Sent!</h4>
                  <p className="text-gray-400 text-sm font-medium max-w-[200px]">
                    The owner will receive your contact details shortly.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
