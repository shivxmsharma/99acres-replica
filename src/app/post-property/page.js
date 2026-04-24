"use client";

import { useState } from "react";
import { 
  Building2, 
  MapPin, 
  CheckCircle2, 
  ChevronRight, 
  ChevronLeft, 
  Upload, 
  Home, 
  Coins, 
  ShieldCheck 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

const STEPS = [
  { id: 1, title: "Property Basics", icon: Building2 },
  { id: 2, title: "Property Profile", icon: Home },
  { id: 3, title: "Pricing & Photos", icon: Coins },
];

const PROPERTY_TYPES = ["Apartment", "Independent House", "Villa", "Plot", "Commercial"];
const BHKS = ["1", "2", "3", "4", "5"];
const FURNISHING = ["Unfurnished", "Semi-Furnished", "Furnished"];

export default function PostPropertyPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    type: "Apartment",
    status: "Buy",
    price: "",
    priceLabel: "Cr",
    location: {
      address: "",
      area: "",
      city: "Gurgaon",
    },
    features: {
      bhk: "2",
      bathrooms: "2",
      sqft: "",
      furnishing: "Semi-Furnished",
    },
    description: "",
    amenities: ["Security", "Parking", "Gym"],
    images: ["https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=1000"],
    owner: {
      name: "Demo Owner",
      type: "Owner",
      contact: "+91 9876543210"
    }
  });

  const validateStep = (step) => {
    let newErrors = {};
    if (step === 1) {
      if (!formData.title.trim()) newErrors.title = "Title is required";
      if (!formData.location.city.trim()) newErrors.city = "City is required";
      if (!formData.location.area.trim()) newErrors.area = "Area is required";
    } else if (step === 2) {
      if (!formData.features.sqft) newErrors.sqft = "Property area is required";
    } else if (step === 3) {
      if (!formData.price) newErrors.price = "Expected price is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, STEPS.length));
    }
  };

  const handleBack = () => {
    setErrors({});
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(3)) return;
    
    setIsSubmitting(true);
    
    try {
      const res = await fetch("/api/properties", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        router.push("/");
      }
    } catch (error) {
      console.error("Failed to post property:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        
        {/* Progress Header */}
        <div className="bg-white rounded-[40px] p-8 shadow-sm border border-gray-100 mb-8">
          <div className="flex justify-between items-center relative">
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-100 -translate-y-1/2 z-0" />
            {STEPS.map((step) => {
              const Icon = step.icon;
              const isActive = currentStep >= step.id;
              const isCurrent = currentStep === step.id;
              
              return (
                <div key={step.id} className="relative z-10 flex flex-col items-center gap-3">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 ${
                    isActive ? "bg-primary text-white shadow-lg shadow-primary/20 scale-110" : "bg-white text-gray-400 border-2 border-gray-100"
                  }`}>
                    {isActive && !isCurrent && currentStep > step.id ? <CheckCircle2 size={24} /> : <Icon size={24} />}
                  </div>
                  <span className={`text-[10px] font-black uppercase tracking-widest ${isActive ? "text-gray-900" : "text-gray-400"}`}>
                    {step.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-[40px] shadow-2xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
          <div className="p-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                {/* Step 1: Basics */}
                {currentStep === 1 && (
                  <div className="space-y-8">
                    <div>
                      <h2 className="text-3xl font-black text-gray-900 tracking-tight">Tell us about your property</h2>
                      <p className="text-gray-500 font-medium mt-1">Start with the basic information to get your listing live.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">I want to</label>
                        <div className="flex gap-2">
                          {["Buy", "Rent"].map(status => (
                            <button
                              key={status}
                              type="button"
                              onClick={() => setFormData({...formData, status})}
                              className={`flex-1 py-3 rounded-2xl font-black transition-all ${
                                formData.status === status ? "bg-primary text-white shadow-lg shadow-primary/20" : "bg-gray-50 text-gray-500 border border-gray-100 hover:bg-gray-100"
                              }`}
                            >
                              {status === "Buy" ? "SELL" : "RENT OUT"}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Property Type</label>
                        <select 
                          className="w-full py-3.5 px-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:border-primary font-bold text-gray-900"
                          value={formData.type}
                          onChange={(e) => setFormData({...formData, type: e.target.value})}
                        >
                          {PROPERTY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                      </div>

                      <div className="md:col-span-2 space-y-3">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Property Title</label>
                        <input 
                          type="text"
                          placeholder="e.g. 3 BHK Luxury Apartment in DLF Phase 5"
                          className={`w-full py-3.5 px-4 bg-gray-50 border ${errors.title ? 'border-red-400 bg-red-50/30' : 'border-gray-100'} rounded-2xl focus:outline-none focus:border-primary font-bold text-gray-900 transition-all`}
                          value={formData.title}
                          onChange={(e) => {
                            setFormData({...formData, title: e.target.value});
                            if (errors.title) setErrors({...errors, title: null});
                          }}
                        />
                        {errors.title && <p className="text-[10px] font-bold text-red-500 ml-4 tracking-tight">{errors.title}</p>}
                      </div>

                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">City</label>
                        <div className="relative">
                          <MapPin size={18} className={`absolute left-4 top-1/2 -translate-y-1/2 ${errors.city ? 'text-red-400' : 'text-gray-400'}`} />
                          <input 
                            type="text"
                            className={`w-full pl-12 pr-4 py-3.5 bg-gray-50 border ${errors.city ? 'border-red-400 bg-red-50/30' : 'border-gray-100'} rounded-2xl focus:outline-none focus:border-primary font-bold text-gray-900 transition-all`}
                            value={formData.location.city}
                            onChange={(e) => {
                              setFormData({...formData, location: {...formData.location, city: e.target.value}});
                              if (errors.city) setErrors({...errors, city: null});
                            }}
                          />
                        </div>
                        {errors.city && <p className="text-[10px] font-bold text-red-500 ml-4 tracking-tight">{errors.city}</p>}
                      </div>

                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Area/Sector</label>
                        <input 
                          type="text"
                          placeholder="e.g. Sector 54"
                          className={`w-full px-4 py-3.5 bg-gray-50 border ${errors.area ? 'border-red-400 bg-red-50/30' : 'border-gray-100'} rounded-2xl focus:outline-none focus:border-primary font-bold text-gray-900 transition-all`}
                          value={formData.location.area}
                          onChange={(e) => {
                            setFormData({...formData, location: {...formData.location, area: e.target.value}});
                            if (errors.area) setErrors({...errors, area: null});
                          }}
                        />
                        {errors.area && <p className="text-[10px] font-bold text-red-500 ml-4 tracking-tight">{errors.area}</p>}
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Profile */}
                {currentStep === 2 && (
                  <div className="space-y-8">
                    <div>
                      <h2 className="text-3xl font-black text-gray-900 tracking-tight">Property Features</h2>
                      <p className="text-gray-500 font-medium mt-1">Tell us about the configuration and layout.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">BHK Type</label>
                        <div className="grid grid-cols-3 gap-2">
                          {BHKS.map(bhk => (
                            <button
                              key={bhk}
                              type="button"
                              onClick={() => setFormData({...formData, features: {...formData.features, bhk}})}
                              className={`py-2.5 rounded-xl font-black text-xs transition-all ${
                                formData.features.bhk === bhk ? "bg-primary text-white shadow-lg" : "bg-gray-50 text-gray-500 border border-gray-100"
                              }`}
                            >
                              {bhk} BHK
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Bathrooms</label>
                        <div className="flex gap-2">
                          {["1", "2", "3", "4"].map(bath => (
                            <button
                              key={bath}
                              type="button"
                              onClick={() => setFormData({...formData, features: {...formData.features, bathrooms: bath}})}
                              className={`flex-1 py-2.5 rounded-xl font-black text-xs transition-all ${
                                formData.features.bathrooms === bath ? "bg-primary text-white" : "bg-gray-50 text-gray-500 border border-gray-100"
                              }`}
                            >
                              {bath}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Area (sqft)</label>
                        <input 
                          type="number"
                          placeholder="e.g. 1500"
                          className={`w-full px-4 py-3.5 bg-gray-50 border ${errors.sqft ? 'border-red-400 bg-red-50/30' : 'border-gray-100'} rounded-2xl focus:outline-none focus:border-primary font-bold text-gray-900 transition-all`}
                          value={formData.features.sqft}
                          onChange={(e) => {
                            setFormData({...formData, features: {...formData.features, sqft: e.target.value}});
                            if (errors.sqft) setErrors({...errors, sqft: null});
                          }}
                        />
                        {errors.sqft && <p className="text-[10px] font-bold text-red-500 ml-4 tracking-tight">{errors.sqft}</p>}
                      </div>

                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Furnishing</label>
                        <select 
                          className="w-full py-3.5 px-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:border-primary font-bold text-gray-900"
                          value={formData.features.furnishing}
                          onChange={(e) => setFormData({...formData, features: {...formData.features, furnishing: e.target.value}})}
                        >
                          {FURNISHING.map(f => <option key={f} value={f}>{f}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Price & Media */}
                {currentStep === 3 && (
                  <div className="space-y-8">
                    <div>
                      <h2 className="text-3xl font-black text-gray-900 tracking-tight">Pricing & Media</h2>
                      <p className="text-gray-500 font-medium mt-1">Almost there! Set your price and add some photos.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Expected Price</label>
                        <div className="flex gap-2">
                          <input 
                            type="number"
                            placeholder="e.g. 2.5"
                            className={`flex-1 px-4 py-3.5 bg-gray-50 border ${errors.price ? 'border-red-400 bg-red-50/30' : 'border-gray-100'} rounded-2xl focus:outline-none focus:border-primary font-bold text-gray-900 transition-all`}
                            value={formData.price}
                            onChange={(e) => {
                              setFormData({...formData, price: e.target.value});
                              if (errors.price) setErrors({...errors, price: null});
                            }}
                          />
                          <select 
                            className="w-24 py-3.5 px-2 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none font-black text-xs"
                            value={formData.priceLabel}
                            onChange={(e) => setFormData({...formData, priceLabel: e.target.value})}
                          >
                            <option value="L">Lakh</option>
                            <option value="Cr">Crore</option>
                          </select>
                        </div>
                        {errors.price && <p className="text-[10px] font-bold text-red-500 ml-4 tracking-tight">{errors.price}</p>}
                      </div>

                      <div className="md:col-span-2">
                        <div className="border-2 border-dashed border-gray-200 rounded-[32px] p-12 text-center hover:border-primary hover:bg-primary/5 transition-all cursor-pointer group">
                          <Upload className="mx-auto text-gray-300 group-hover:text-primary transition-colors mb-4" size={48} />
                          <h4 className="font-black text-gray-900 text-lg">Upload Photos</h4>
                          <p className="text-gray-400 text-sm font-medium mt-1">Drag and drop or click to browse</p>
                        </div>
                      </div>

                      <div className="md:col-span-2 space-y-3">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Description</label>
                        <textarea 
                          rows={4}
                          placeholder="Describe your property's best features, surroundings, and why someone should buy/rent it..."
                          className="w-full px-4 py-4 bg-gray-50 border border-gray-100 rounded-[32px] focus:outline-none focus:border-primary font-medium text-gray-900"
                          value={formData.description}
                          onChange={(e) => setFormData({...formData, description: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex items-center justify-between pt-10 border-t border-gray-50">
                  <button
                    onClick={handleBack}
                    className={`flex items-center gap-2 font-black text-[10px] uppercase tracking-widest transition-all ${
                      currentStep === 1 ? "opacity-0 pointer-events-none" : "text-gray-400 hover:text-gray-900"
                    }`}
                  >
                    <ChevronLeft size={16} /> Previous
                  </button>
                  
                  {currentStep < STEPS.length ? (
                    <button
                      onClick={handleNext}
                      className="bg-primary text-white font-black px-8 py-4 rounded-2xl flex items-center gap-3 shadow-xl shadow-primary/20 hover:scale-105 transition-all uppercase text-[10px] tracking-widest"
                    >
                      Continue <ChevronRight size={16} />
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className="bg-green-600 text-white font-black px-10 py-4 rounded-2xl flex items-center gap-3 shadow-xl shadow-green-600/20 hover:scale-105 transition-all uppercase text-[10px] tracking-widest disabled:opacity-50"
                    >
                      {isSubmitting ? "Posting..." : "Post Property"} <ShieldCheck size={16} />
                    </button>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Support Section */}
        <div className="mt-12 text-center">
          <p className="text-gray-400 text-sm font-medium">
            Need help? Call our expert at <span className="text-primary font-black">1800-41-9999</span>
          </p>
        </div>
      </div>
    </div>
  );
}
