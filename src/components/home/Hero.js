"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, Mic, ChevronDown, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const TABS = [
  { id: "Buy", label: "Buy" },
  { id: "Rent", label: "Rent" },
  { id: "new-launch", label: "New Launch", hasDot: true },
  { id: "commercial", label: "Commercial" },
  { id: "plots", label: "Plots/Land" },
  { id: "projects", label: "Projects" },
  { id: "post", label: "Post Property", badge: "FREE", badgeColor: "bg-green-600" },
];

const PROPERTY_TYPES = ["All Residential", "Apartment", "Independent House", "Villa", "Plot", "Commercial"];

const PLACEHOLDERS = [
  'Search "3 BHK for sale in Mumbai"',
  'Search "Noida"',
  'Search "Flat for rent in Delhi"',
  'Search "Villa in Bangalore"',
];

export default function Hero() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Buy");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("All Residential");
  const [isTypeOpen, setIsTypeOpen] = useState(false);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  
  // Auto-suggest state
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % PLACEHOLDERS.length);
    }, 3000);
    
    // Load recent searches
    const saved = localStorage.getItem("recentSearches");
    if (saved) setRecentSearches(JSON.parse(saved));

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchQuery.length < 2) {
        setSuggestions([]);
        return;
      }
      try {
        const res = await fetch(`/api/locations/suggest?q=${searchQuery}`);
        const data = await res.json();
        if (data.success) setSuggestions(data.data);
      } catch (error) {
        console.error("Suggestion fetch failed", error);
      }
    };

    const timeoutId = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleSearch = (query = searchQuery) => {
    const params = new URLSearchParams();
    const cleanQuery = query.split(' (')[0];
    
    if (cleanQuery) {
      params.set("q", cleanQuery);
      const updated = [cleanQuery, ...recentSearches.filter(s => s !== cleanQuery)].slice(0, 5);
      setRecentSearches(updated);
      localStorage.setItem("recentSearches", JSON.stringify(updated));
    }
    
    // Status & Type Mapping based on Active Tab
    if (activeTab === "Buy" || activeTab === "Rent") {
      params.set("status", activeTab);
    } else if (activeTab === "commercial") {
      params.set("type", "Commercial");
    } else if (activeTab === "plots") {
      params.set("type", "Plot");
    } else if (activeTab === "new-launch") {
      params.set("status", "Buy");
      params.set("featured", "true");
    } else if (activeTab === "projects") {
      params.set("type", "Apartment");
    }

    if (selectedType !== "All Residential" && activeTab !== "commercial" && activeTab !== "plots") {
      params.set("type", selectedType);
    }
    
    router.push(`/search?${params.toString()}`);
    setShowSuggestions(false);
  };

  return (
    <div className="relative h-[550px] w-full flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: "url('/hero-bg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/30"></div>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 w-full max-w-7xl px-6 lg:px-16 flex flex-col items-center">
        {/* Promotional Banner */}
        <div className="mb-6 text-white text-sm md:text-base font-medium text-center animate-pulse">
           The Marq presents well-designed 3 and 4 BHK premium residences...
        </div>

        {/* Search Container */}
        <div className="w-full bg-white rounded-xl shadow-2xl overflow-hidden p-1 md:p-2">
          {/* Tabs */}
          <div className="flex items-center overflow-x-auto no-scrollbar border-b border-gray-100">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  if (tab.id === "post") {
                    router.push("/post-property");
                    return;
                  }
                  setActiveTab(tab.id);
                }}
                className={`relative px-4 py-4 text-sm font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === tab.id ? "text-primary" : "text-gray-500 hover:text-gray-800"
                }`}
              >
                {tab.label}
                {tab.hasDot && <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>}
                {tab.badge && (
                  <span className={`${tab.badgeColor} text-white text-[8px] px-1 rounded font-bold ml-1`}>
                    {tab.badge}
                  </span>
                )}
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-1 bg-primary"
                  />
                )}
              </button>
            ))}
          </div>

          {/* Search Input Area */}
          <div className="flex flex-col md:flex-row items-center p-2 gap-2">
            {/* Category Dropdown */}
            <div className="relative">
              <div 
                onClick={() => setIsTypeOpen(!isTypeOpen)}
                className="flex items-center gap-2 px-4 py-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors min-w-[160px] justify-between"
              >
                <span className="text-sm font-medium text-gray-700">{selectedType}</span>
                <ChevronDown size={16} className={`text-gray-400 transition-transform ${isTypeOpen ? 'rotate-180' : ''}`} />
              </div>

              <AnimatePresence>
                {isTypeOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-0 mt-1 w-full bg-white rounded-lg shadow-xl z-50 border border-gray-100 overflow-hidden"
                  >
                    {PROPERTY_TYPES.map((type) => (
                      <div
                        key={type}
                        onClick={() => {
                          setSelectedType(type);
                          setIsTypeOpen(false);
                        }}
                        className="px-4 py-2 text-sm text-gray-700 hover:bg-primary hover:text-white cursor-pointer transition-colors"
                      >
                        {type}
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="hidden md:block h-8 w-[1px] bg-gray-200"></div>

            {/* Input Box */}
            <div className="flex-1 relative flex items-center w-full">
              <Search className="absolute left-4 text-gray-400" size={20} />
              <input
                type="text"
                value={searchQuery}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="w-full pl-12 pr-24 py-4 bg-transparent outline-none text-gray-800 text-base placeholder-gray-400 font-medium"
                placeholder={PLACEHOLDERS[placeholderIndex]}
              />
              <div className="absolute right-4 flex items-center gap-4 text-gray-400">
                <MapPin size={20} className="cursor-pointer hover:text-primary transition-colors" />
                <Mic size={20} className="cursor-pointer hover:text-primary transition-colors" />
              </div>

              {/* Suggestions Dropdown */}
              <AnimatePresence>
                {showSuggestions && (searchQuery.length > 0 || recentSearches.length > 0) && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl z-[60] border border-gray-100 overflow-hidden"
                  >
                    {searchQuery.length === 0 && recentSearches.length > 0 && (
                      <div className="p-4 bg-gray-50/50 border-b border-gray-100 flex items-center gap-2">
                        <Clock className="text-gray-400" size={14} />
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Recent Searches</span>
                      </div>
                    )}
                    
                    {(searchQuery.length === 0 ? recentSearches : suggestions).map((item, idx) => (
                      <div
                        key={idx}
                        onClick={() => {
                          setSearchQuery(item.split(' (')[0]);
                          handleSearch(item);
                        }}
                        className="px-6 py-4 flex items-center gap-4 hover:bg-primary/5 cursor-pointer transition-all border-b border-gray-50 last:border-0 group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                          {searchQuery.length === 0 ? <Clock size={16} /> : <MapPin size={16} />}
                        </div>
                        <span className="text-sm font-bold text-gray-700 group-hover:text-gray-900">{item}</span>
                      </div>
                    ))}

                    {searchQuery.length > 0 && suggestions.length === 0 && (
                      <div className="p-10 text-center">
                        <p className="text-xs font-bold text-gray-400 italic">No exact locations found for "{searchQuery}"</p>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Search Button */}
            <button 
              onClick={handleSearch}
              className="w-full md:w-auto bg-primary text-white font-black py-4 px-10 rounded-xl transition-all shadow-xl shadow-primary/20 hover:brightness-110 active:scale-95 uppercase tracking-widest text-xs"
            >
              Search
            </button>
          </div>
        </div>

        {/* Subtitle */}
        <div className="mt-8 text-white text-center">
          <h1 className="text-2xl md:text-3xl font-bold drop-shadow-md">
            India's No. 1 Property Portal
          </h1>
          <p className="mt-2 text-sm md:text-lg text-gray-200 font-medium drop-shadow-sm">
            Find Better Places to Live, Work and Wonder...
          </p>
        </div>
      </div>
    </div>
  );
}
