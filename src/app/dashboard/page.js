"use client";

import { useState, useEffect } from "react";
import { 
  LayoutDashboard, 
  Building2, 
  MessageSquare, 
  Settings, 
  LogOut, 
  ExternalLink, 
  Trash2, 
  Edit3,
  User as UserIcon,
  Phone,
  Mail,
  Calendar,
  CheckCircle2,
  MapPin,
  ChevronRight,
  X,
  Send,
  Loader2,
  ChevronDown
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

const TABS = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "listings", label: "My Listings", icon: Building2 },
  { id: "leads", label: "Received Leads", icon: MessageSquare },
  { id: "settings", label: "Settings", icon: Settings },
];

export default function DashboardPage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState("overview");
  const [listings, setListings] = useState([]);
  const [leads, setLeads] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Lead Response State
  const [selectedLead, setSelectedLead] = useState(null);
  const [responseMsg, setResponseMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const [propsRes, leadsRes] = await Promise.all([
        fetch("/api/properties"),
        fetch("/api/leads")
      ]);
      
      const propsData = await propsRes.json();
      const leadsData = await leadsRes.json();
      
      if (propsData.success) {
        setListings(propsData.data.filter(p => p.owner?.email === session?.user?.email));
      }
      if (leadsData.success) setLeads(leadsData.data);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRespond = async () => {
    if (!responseMsg.trim()) return;
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/leads/${selectedLead._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Contacted" })
      });
      
      if (res.ok) {
        setLeads(leads.map(l => l._id === selectedLead._id ? { ...l, status: "Contacted" } : l));
        setSelectedLead(null);
        setResponseMsg("");
      }
    } catch (error) {
      console.error("Response failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 flex">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-gray-100 flex flex-col sticky top-16 h-[calc(100vh-64px)]">
        <div className="p-8">
          <div className="flex items-center gap-4 mb-10 p-4 bg-gray-50 rounded-3xl border border-gray-100">
            <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-primary/20">
              {session?.user?.name ? session.user.name[0].toUpperCase() : 'D'}
            </div>
            <div>
              <h4 className="font-black text-gray-900 leading-tight truncate w-32">{session?.user?.name || 'User'}</h4>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{session?.user?.role || 'Owner'}</p>
            </div>
          </div>

          <nav className="space-y-2">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-black text-sm transition-all ${
                    isActive 
                      ? "bg-primary text-white shadow-xl shadow-primary/20" 
                      : "text-gray-400 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <Icon size={20} />
                  {tab.label}
                  {tab.id === "leads" && leads.length > 0 && (
                    <span className={`ml-auto w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                      isActive ? "bg-white text-primary" : "bg-primary text-white"
                    }`}>
                      {leads.filter(l => l.status === "New").length}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto p-8 border-t border-gray-50 space-y-4">
          <button 
            onClick={() => setActiveTab("settings")}
            className={`w-full flex items-center gap-4 px-6 py-3 rounded-2xl font-black text-sm transition-colors ${
              activeTab === "settings" ? "bg-primary text-white shadow-lg" : "text-gray-400 hover:text-primary hover:bg-gray-50"
            }`}
          >
            <Settings size={20} /> Settings
          </button>
          <button 
            onClick={() => signOut()}
            className="w-full flex items-center gap-4 px-6 py-3 rounded-2xl font-black text-sm text-gray-400 hover:text-red-500 transition-colors"
          >
            <LogOut size={20} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-12 overflow-y-auto relative">
        <header className="mb-12 flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight">
              {TABS.find(t => t.id === activeTab)?.label}
            </h1>
            <p className="text-gray-500 font-medium mt-1">Manage your properties and inquiries in one place.</p>
          </div>
          <Link 
            href="/post-property" 
            className="bg-gray-900 text-white font-black px-8 py-3 rounded-2xl text-xs uppercase tracking-widest hover:bg-primary transition-all flex items-center gap-2"
          >
            Post New Property
          </Link>
        </header>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-64 bg-white rounded-[40px] animate-pulse" />
            ))}
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {/* Overview Tab */}
              {activeTab === "overview" && (
                <div className="space-y-12">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm">
                      <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-primary mb-6">
                        <Building2 size={24} />
                      </div>
                      <h4 className="text-4xl font-black text-gray-900 leading-none">{listings.length}</h4>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-2">Active Listings</p>
                    </div>
                    <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm">
                      <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-600 mb-6">
                        <MessageSquare size={24} />
                      </div>
                      <h4 className="text-4xl font-black text-gray-900 leading-none">{leads.length}</h4>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-2">Total Leads</p>
                    </div>
                    <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm">
                      <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 mb-6">
                        <UserIcon size={24} />
                      </div>
                      <h4 className="text-4xl font-black text-gray-900 leading-none">1.2k</h4>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-2">Profile Views</p>
                    </div>
                  </div>

                  <div className="bg-white rounded-[40px] border border-gray-100 p-10">
                    <h3 className="text-xl font-black text-gray-900 mb-8 uppercase tracking-tight">Recent Activity</h3>
                    <div className="space-y-6">
                      {leads.length > 0 ? leads.slice(0, 3).map((lead) => (
                        <div key={lead._id} className="flex items-center gap-6 p-4 hover:bg-gray-50 rounded-3xl transition-colors group">
                          <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400">
                            <MessageSquare size={18} />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-gray-900">
                              New enquiry from <span className="text-primary">{lead.name}</span>
                            </p>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                              {new Date(lead.createdAt).toLocaleDateString()} • Property Interest
                            </p>
                          </div>
                          <ChevronRight size={16} className="ml-auto text-gray-300 group-hover:text-primary transition-colors" />
                        </div>
                      )) : (
                        <p className="text-gray-400 font-medium italic">No recent activity to show.</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Listings Tab */}
              {activeTab === "listings" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {listings.map((property) => (
                    <div key={property._id} className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden group hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-500">
                      <div className="flex h-full">
                        <div className="w-48 relative overflow-hidden">
                          <img 
                            src={property.images[0]} 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                            alt={property.title} 
                          />
                          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest text-primary">
                            {property.type}
                          </div>
                        </div>
                        <div className="flex-1 p-6 flex flex-col">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-black text-gray-900 leading-tight group-hover:text-primary transition-colors truncate max-w-[200px]">
                              {property.title}
                            </h3>
                            <span className="text-sm font-black text-primary">₹{property.price} {property.priceLabel}</span>
                          </div>
                          <div className="flex items-center gap-1 text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-4">
                            <MapPin size={12} /> {property.location.area}, {property.location.city}
                          </div>
                          
                          <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
                            <div className="flex gap-2">
                              <button className="p-2 text-gray-400 hover:text-primary hover:bg-blue-50 rounded-xl transition-all">
                                <Edit3 size={18} />
                              </button>
                              <button className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                                <Trash2 size={18} />
                              </button>
                            </div>
                            <Link 
                              href={`/property/${property._id}`}
                              className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-primary flex items-center gap-1"
                            >
                              View Listing <ExternalLink size={12} />
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {listings.length === 0 && (
                    <div className="col-span-2 py-20 text-center bg-white rounded-[40px] border border-dashed border-gray-200">
                      <p className="text-gray-400 font-bold uppercase tracking-widest">No listings found</p>
                      <Link href="/post-property" className="text-primary font-black mt-2 inline-block">Post your first property</Link>
                    </div>
                  )}
                </div>
              )}

              {/* Leads Tab */}
              {activeTab === "leads" && (
                <div className="space-y-4">
                  {leads.map((lead) => (
                    <div key={lead._id} className={`bg-white rounded-3xl border ${lead.status === 'Contacted' ? 'border-green-100 bg-green-50/20' : 'border-gray-100'} p-6 flex items-center justify-between hover:shadow-xl transition-all group relative`}>
                      {lead.status === 'Contacted' && (
                        <div className="absolute top-0 right-10 -translate-y-1/2 bg-green-500 text-white text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg">
                          Responded
                        </div>
                      )}
                      <div className="flex items-center gap-6">
                        <div className={`w-14 h-14 ${lead.status === 'Contacted' ? 'bg-green-100 text-green-600' : 'bg-blue-50 text-primary'} rounded-2xl flex items-center justify-center transition-colors`}>
                          <UserIcon size={28} />
                        </div>
                        <div>
                          <h4 className="font-black text-gray-900 text-lg leading-tight">{lead.name}</h4>
                          <div className="flex items-center gap-4 mt-1">
                            <span className="flex items-center gap-1.5 text-xs font-bold text-gray-500">
                              <Phone size={14} className="text-gray-400" /> {lead.mobile}
                            </span>
                            <span className="flex items-center gap-1.5 text-xs font-bold text-gray-500">
                              <Mail size={14} className="text-gray-400" /> {lead.email}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-8">
                        <div className="text-right">
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Interested In</p>
                          <p className="text-sm font-bold text-gray-900 truncate max-w-[200px]">Property ID: {lead.propertyId?.slice(-6).toUpperCase()}</p>
                        </div>
                        <div className="flex gap-2">
                          {lead.status !== 'Contacted' ? (
                            <button 
                              onClick={() => setSelectedLead(lead)}
                              className="bg-primary text-white text-[10px] font-black px-6 py-2.5 rounded-xl uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
                            >
                              Respond
                            </button>
                          ) : (
                            <div className="flex items-center gap-2 text-green-600 font-black text-[10px] uppercase tracking-widest px-4 py-2.5">
                              <CheckCircle2 size={16} /> Contacted
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  {leads.length === 0 && (
                    <div className="py-20 text-center bg-white rounded-[40px] border border-dashed border-gray-200">
                      <p className="text-gray-400 font-bold uppercase tracking-widest">No inquiries received yet</p>
                    </div>
                  )}
                </div>
              )}

              {/* Settings Tab */}
              {activeTab === "settings" && (
                <div className="max-w-4xl space-y-8">
                  <div className="bg-white rounded-[40px] border border-gray-100 p-10 shadow-sm">
                    <h3 className="text-xl font-black text-gray-900 mb-8 uppercase tracking-tight">Profile Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Full Name</label>
                        <input type="text" defaultValue="Demo Owner" className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:border-primary font-bold text-gray-900 transition-all" />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Email Address</label>
                        <input type="email" defaultValue="demo@99acres-replica.com" className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:border-primary font-bold text-gray-900 transition-all" />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Phone Number</label>
                        <input type="tel" defaultValue="+91 98765 43210" className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:border-primary font-bold text-gray-900 transition-all" />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Account Type</label>
                        <div className="relative group">
                          <select className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:border-primary font-bold text-gray-900 transition-all appearance-none cursor-pointer pr-12">
                            <option>Owner</option>
                            <option>Buyer</option>
                            <option>Agent</option>
                            <option>Builder</option>
                          </select>
                          <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary pointer-events-none transition-colors" size={18} />
                        </div>
                      </div>
                    </div>
                    <button className="mt-10 bg-primary text-white font-black px-10 py-4 rounded-2xl text-xs uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
                      Save Changes
                    </button>
                  </div>

                  <div className="bg-white rounded-[40px] border border-gray-100 p-10 shadow-sm">
                    <h3 className="text-xl font-black text-gray-900 mb-8 uppercase tracking-tight">Security</h3>
                    <div className="flex items-center justify-between p-6 bg-gray-50 rounded-3xl border border-gray-100 group hover:border-primary transition-all">
                      <div>
                        <p className="font-black text-gray-900">Password</p>
                        <p className="text-xs font-bold text-gray-400 mt-1">Last changed 3 months ago</p>
                      </div>
                      <button className="bg-white text-gray-900 border border-gray-200 font-black px-6 py-2.5 rounded-xl text-[10px] uppercase tracking-widest hover:border-primary hover:text-primary transition-all">
                        Update Password
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        )}

        {/* Response Modal */}
        <AnimatePresence>
          {selectedLead && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedLead(null)}
                className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative bg-white w-full max-w-lg rounded-[40px] shadow-2xl overflow-hidden"
              >
                <div className="p-10">
                  <div className="flex justify-between items-start mb-8">
                    <div>
                      <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">Responding to</p>
                      <h2 className="text-3xl font-black text-gray-900 tracking-tight">{selectedLead.name}</h2>
                    </div>
                    <button 
                      onClick={() => setSelectedLead(null)}
                      className="p-3 hover:bg-gray-100 rounded-2xl transition-colors text-gray-400"
                    >
                      <X size={24} />
                    </button>
                  </div>

                  <div className="space-y-6">
                    <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Their Message</p>
                      <p className="text-sm font-medium text-gray-600 leading-relaxed italic">
                        "{selectedLead.message || "I am interested in this property. Please contact me."}"
                      </p>
                    </div>

                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Your Response</label>
                      <textarea 
                        rows={4}
                        placeholder="Type your message here..."
                        className="w-full p-6 bg-gray-50 border border-gray-100 rounded-[32px] focus:outline-none focus:border-primary font-medium text-gray-900 resize-none transition-all"
                        value={responseMsg}
                        onChange={(e) => setResponseMsg(e.target.value)}
                      />
                    </div>

                    <button 
                      onClick={handleRespond}
                      disabled={!responseMsg.trim() || isSubmitting}
                      className={`w-full py-5 rounded-[32px] font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 transition-all ${
                        !responseMsg.trim() || isSubmitting 
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                          : "bg-primary text-white shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98]"
                      }`}
                    >
                      {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
                      {isSubmitting ? "Sending..." : "Send Response"}
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
