"use client";

import { useState, useEffect } from "react";
import { 
  Search, 
  Filter, 
  MoreVertical, 
  ShieldCheck, 
  Trash2, 
  ExternalLink,
  MapPin,
  Home as HomeIcon,
  CheckCircle2,
  XCircle,
  Loader2
} from "lucide-react";
import Link from "next/link";
import SafeImage from "@/components/common/SafeImage";

export default function AdminProperties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, pending, verified
  const [search, setSearch] = useState("");
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState(null);

  useEffect(() => {
    fetchProperties();
  }, [filter]);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/properties?filter=${filter}`);
      const data = await res.json();
      if (data.success) setProperties(data.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleVerify = async (id) => {
    try {
      const res = await fetch(`/api/admin/properties/${id}/verify`, { method: "POST" });
      if (res.ok) fetchProperties();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteClick = (prop) => {
    setPropertyToDelete(prop);
    setDeleteConfirmOpen(true);
  };

  const executeDelete = async (id) => {
    try {
      const res = await fetch(`/api/admin/properties/${id}`, { method: "DELETE" });
      if (res.ok) fetchProperties();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredProperties = properties.filter(p => 
    p.title.toLowerCase().includes(search.toLowerCase()) || 
    p.address.city.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Property Moderation</h2>
          <p className="text-gray-500 text-sm font-medium">Manage and verify property listings across the platform.</p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search properties..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-100 rounded-xl outline-none focus:border-primary transition-all text-sm font-medium shadow-sm"
            />
          </div>
          <div className="flex bg-white p-1 rounded-xl border border-gray-100 shadow-sm">
            {["all", "pending", "verified"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                  filter === f ? "bg-primary text-white" : "text-gray-400 hover:text-gray-600"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Property List */}
      <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-20 flex flex-col items-center justify-center text-gray-400">
            <Loader2 className="animate-spin mb-4" size={40} />
            <p className="text-sm font-bold uppercase tracking-widest">Loading properties...</p>
          </div>
        ) : filteredProperties.length === 0 ? (
          <div className="p-20 text-center text-gray-400">
            <HomeIcon className="mx-auto mb-4 opacity-20" size={64} />
            <p className="text-sm font-bold uppercase tracking-widest">No properties found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Property Details</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Owner / Agent</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Price & Type</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredProperties.map((prop) => (
                  <tr key={prop._id} className="hover:bg-gray-50/30 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0 shadow-sm relative">
                          <SafeImage src={prop.images[0]} alt={prop.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-base font-black text-gray-900 truncate tracking-tight">{prop.title}</p>
                          <div className="flex items-center gap-1.5 text-gray-400 mt-1">
                            <MapPin size={12} />
                            <span className="text-[10px] font-bold uppercase tracking-wide truncate">{prop.address.locality}, {prop.address.city}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-[10px] font-black">
                          {prop.owner?.name?.[0] || "U"}
                        </div>
                        <div>
                          <p className="text-xs font-black text-gray-900 leading-none">{prop.owner?.name || "Unknown User"}</p>
                          <p className="text-[9px] font-bold text-gray-400 uppercase mt-1 tracking-tighter">{prop.owner?.email || "No Email"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div>
                        <p className="text-sm font-black text-gray-900">₹{prop.price} {prop.priceLabel}</p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase mt-1">{prop.propertyType} • {prop.listingType}</p>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        {prop.isVerified ? (
                          <span className="flex items-center gap-1.5 bg-green-50 text-green-600 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border border-green-100">
                            <CheckCircle2 size={12} /> Verified
                          </span>
                        ) : (
                          <span className="flex items-center gap-1.5 bg-orange-50 text-orange-600 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border border-orange-100">
                            <Clock size={12} /> Pending
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center justify-end gap-2">
                        {!prop.isVerified && (
                          <button 
                            onClick={() => handleVerify(prop._id)}
                            className="p-2.5 bg-green-50 text-green-600 hover:bg-green-600 hover:text-white rounded-xl transition-all shadow-sm"
                            title="Verify Property"
                          >
                            <ShieldCheck size={18} />
                          </button>
                        )}
                        <Link 
                          href={`/property/${prop._id}`}
                          target="_blank"
                          className="p-2.5 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-xl transition-all shadow-sm"
                          title="View Live"
                        >
                          <ExternalLink size={18} />
                        </Link>
                        <button 
                          onClick={() => handleDeleteClick(prop)}
                          className="p-2.5 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-xl transition-all shadow-sm"
                          title="Delete Listing"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Premium Confirm Delete Modal */}
      {deleteConfirmOpen && propertyToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div 
            className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
            onClick={() => {
              setDeleteConfirmOpen(false);
              setPropertyToDelete(null);
            }}
          />
          <div className="relative bg-white rounded-[32px] max-w-md w-full p-8 border border-gray-100 shadow-2xl z-10 animate-in zoom-in-95 duration-200">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mb-6 animate-pulse">
                <Trash2 size={28} />
              </div>
              <h3 className="text-xl font-black text-gray-900 tracking-tight mb-2 uppercase">Delete Listing</h3>
              <p className="text-gray-500 text-sm font-medium mb-6">
                Are you sure you want to delete <span className="font-bold text-gray-900">"{propertyToDelete.title}"</span>? This action cannot be undone.
              </p>
              <div className="flex gap-3 w-full">
                <button
                  onClick={() => {
                    setDeleteConfirmOpen(false);
                    setPropertyToDelete(null);
                  }}
                  className="flex-1 py-3.5 bg-gray-50 hover:bg-gray-100 rounded-2xl text-xs font-black uppercase tracking-widest text-gray-500 transition-all font-bold"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    await executeDelete(propertyToDelete._id);
                    setDeleteConfirmOpen(false);
                    setPropertyToDelete(null);
                  }}
                  className="flex-1 py-3.5 bg-red-500 hover:bg-red-600 active:scale-[0.98] rounded-2xl text-xs font-black uppercase tracking-widest text-white transition-all shadow-lg shadow-red-500/20 font-bold"
                >
                  Confirm Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
