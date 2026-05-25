"use client";

import { useState, useEffect } from "react";
import { 
  TrendingUp, 
  Users, 
  Home, 
  CheckCircle, 
  Clock, 
  ArrowUpRight,
  ArrowDownRight,
  MoreVertical,
  ChevronRight,
  ShieldCheck,
  ExternalLink,
  Trash2
} from "lucide-react";
import Link from "next/link";

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activePropId, setActivePropId] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState(null);
  const [activeUserId, setActiveUserId] = useState(null);
  const [userConfirmOpen, setUserConfirmOpen] = useState(false);
  const [userToUpdate, setUserToUpdate] = useState(null);
  const [targetRole, setTargetRole] = useState("");

  const fetchDashboardData = async () => {
    try {
      const res = await fetch("/api/admin/stats");
      const resData = await res.json();
      if (resData.success) {
        setData(resData.data);
      }
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleVerify = async (id) => {
    try {
      const res = await fetch(`/api/admin/properties/${id}/verify`, { method: "POST" });
      if (res.ok) {
        fetchDashboardData();
      }
    } catch (err) {
      console.error("Error verifying property:", err);
    }
  };

  const handleDeleteClick = (prop) => {
    setPropertyToDelete(prop);
    setDeleteConfirmOpen(true);
  };

  const executeDelete = async (id) => {
    try {
      const res = await fetch(`/api/admin/properties/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchDashboardData();
      }
    } catch (err) {
      console.error("Error deleting property:", err);
    }
  };

  const handleUserRoleClick = (user, role) => {
    setUserToUpdate(user);
    setTargetRole(role);
    setUserConfirmOpen(true);
  };

  const executeUserRoleChange = async () => {
    if (!userToUpdate || !targetRole) return;
    try {
      const res = await fetch(`/api/admin/users/${userToUpdate._id}/role`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: targetRole })
      });
      if (res.ok) {
        fetchDashboardData();
      }
    } catch (err) {
      console.error("Error updating user role:", err);
    }
  };

  if (loading) return <div className="animate-pulse space-y-8">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {[1,2,3,4].map(i => <div key={i} className="h-32 bg-gray-200 rounded-3xl" />)}
    </div>
    <div className="h-96 bg-gray-200 rounded-3xl" />
  </div>;

  const stats = [
    { label: "Total Properties", value: data.stats.totalProperties, icon: Home, color: "text-blue-600", bg: "bg-blue-50", trend: "+12%" },
    { label: "Verified Listings", value: data.stats.verifiedProperties, icon: CheckCircle, color: "text-green-600", bg: "bg-green-50", trend: "+5%" },
    { label: "Total Users", value: data.stats.totalUsers, icon: Users, color: "text-purple-600", bg: "bg-purple-50", trend: "+18%" },
    { label: "Active Leads", value: data.stats.activeLeads, icon: TrendingUp, color: "text-orange-600", bg: "bg-orange-50", trend: "+24%" },
  ];

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color}`}>
                <stat.icon size={24} />
              </div>
              <div className="flex items-center gap-1 text-[10px] font-black text-green-500 bg-green-50 px-2 py-1 rounded-full uppercase tracking-tighter">
                <ArrowUpRight size={12} /> {stat.trend}
              </div>
            </div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-2">{stat.label}</p>
            <p className="text-3xl font-black text-gray-900 tracking-tight">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Properties */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-gray-50 flex justify-between items-center">
            <h2 className="text-lg font-black text-gray-900 uppercase tracking-tight">Recent Property Submissions</h2>
            <Link href="/admin/properties" className="text-xs font-black text-primary uppercase tracking-widest hover:underline flex items-center gap-1">
              View All <ChevronRight size={14} />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Property</th>
                  <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Price</th>
                  <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                  <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {data.recentProperties.map((prop) => (
                  <tr key={prop._id} className="hover:bg-gray-50/30 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                          <img 
                            src={prop.images[0]} 
                            onError={(e) => {
                              e.target.src = "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=800";
                            }}
                            className="w-full h-full object-cover" 
                            alt="" 
                          />
                        </div>
                        <div>
                          <p className="text-sm font-black text-gray-900 line-clamp-1">{prop.title}</p>
                          <p className="text-[10px] font-bold text-gray-400 uppercase leading-none mt-1">{prop.propertyType} • {prop.address.city}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <p className="text-sm font-black text-gray-900">₹{prop.price}{prop.priceLabel}</p>
                    </td>
                    <td className="px-8 py-5">
                      <span className={`text-[9px] font-black px-2 py-1 rounded-full uppercase ${
                        prop.isVerified ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'
                      }`}>
                        {prop.isVerified ? 'Verified' : 'Pending'}
                      </span>
                    </td>
                    <td className="px-8 py-5 relative">
                      <button 
                        onClick={() => setActivePropId(activePropId === prop._id ? null : prop._id)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-400"
                      >
                        <MoreVertical size={16} />
                      </button>

                      {activePropId === prop._id && (
                        <>
                          <div 
                            className="fixed inset-0 z-40" 
                            onClick={() => setActivePropId(null)}
                          />
                          <div className="absolute right-8 top-12 mt-1 w-48 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                            {!prop.isVerified && (
                              <button 
                                onClick={() => {
                                  handleVerify(prop._id);
                                  setActivePropId(null);
                                }}
                                className="w-full text-left px-4 py-2 text-xs font-black uppercase tracking-wider text-green-600 hover:bg-green-50 transition-colors flex items-center gap-2"
                              >
                                <ShieldCheck size={14} /> Verify Property
                              </button>
                            )}
                            <Link 
                              href={`/property/${prop._id}`}
                              target="_blank"
                              onClick={() => setActivePropId(null)}
                              className="w-full text-left px-4 py-2 text-xs font-black uppercase tracking-wider text-blue-600 hover:bg-blue-50 transition-colors flex items-center gap-2"
                            >
                              <ExternalLink size={14} /> View Details
                            </Link>
                            <button 
                              onClick={() => {
                                handleDeleteClick(prop);
                                setActivePropId(null);
                              }}
                              className="w-full text-left px-4 py-2 text-xs font-black uppercase tracking-wider text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                            >
                              <Trash2 size={14} /> Delete Property
                            </button>
                          </div>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Users */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-gray-50 flex justify-between items-center">
            <h2 className="text-lg font-black text-gray-900 uppercase tracking-tight">New Users</h2>
            <Link href="/admin/users" className="text-xs font-black text-primary uppercase tracking-widest hover:underline">
              View All
            </Link>
          </div>
          <div className="p-8 space-y-6">
            {data.recentUsers.map((user) => (
              <div key={user._id} className="flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-black text-primary">
                    {user.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-black text-gray-900 group-hover:text-primary transition-colors">{user.name}</p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter leading-none mt-1">{user.role || 'Buyer'}</p>
                  </div>
                </div>
                <div className="relative">
                  <button 
                    onClick={() => setActiveUserId(activeUserId === user._id ? null : user._id)}
                    className="p-2 bg-gray-50 hover:bg-primary hover:text-white rounded-xl text-gray-400 transition-all"
                  >
                    <ArrowUpRight size={16} />
                  </button>

                  {activeUserId === user._id && (
                    <>
                      <div 
                        className="fixed inset-0 z-40" 
                        onClick={() => setActiveUserId(null)}
                      />
                      <div className="absolute right-0 mt-1 w-48 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                        {user.role !== 'Agent' && (
                          <button 
                            onClick={() => {
                              handleUserRoleClick(user, 'Agent');
                              setActiveUserId(null);
                            }}
                            className="w-full text-left px-4 py-2 text-xs font-black uppercase tracking-wider text-blue-600 hover:bg-blue-50 transition-colors flex items-center gap-2"
                          >
                            <Users size={14} /> Make Agent
                          </button>
                        )}
                        {user.role !== 'Admin' && (
                          <button 
                            onClick={() => {
                              handleUserRoleClick(user, 'Admin');
                              setActiveUserId(null);
                            }}
                            className="w-full text-left px-4 py-2 text-xs font-black uppercase tracking-wider text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                          >
                            <ShieldCheck size={14} /> Make Admin
                          </button>
                        )}
                        {user.role !== 'Buyer' && user.role !== undefined && (
                          <button 
                            onClick={() => {
                              handleUserRoleClick(user, 'Buyer');
                              setActiveUserId(null);
                            }}
                            className="w-full text-left px-4 py-2 text-xs font-black uppercase tracking-wider text-gray-600 hover:bg-gray-50 transition-colors flex items-center gap-2"
                          >
                            <Home size={14} /> Demote to Buyer
                          </button>
                        )}
                        <Link 
                          href="/admin/users"
                          className="w-full text-left px-4 py-2 text-xs font-black uppercase tracking-wider text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2 border-t border-gray-50 mt-1 pt-2"
                        >
                          <ChevronRight size={14} /> User Directory
                        </Link>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
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

      {/* Premium Confirm User Role Modal */}
      {userConfirmOpen && userToUpdate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div 
            className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
            onClick={() => {
              setUserConfirmOpen(false);
              setUserToUpdate(null);
            }}
          />
          <div className="relative bg-white rounded-[32px] max-w-md w-full p-8 border border-gray-100 shadow-2xl z-10 animate-in zoom-in-95 duration-200">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
                <Users size={28} />
              </div>
              <h3 className="text-xl font-black text-gray-900 tracking-tight mb-2 uppercase">Update User Access</h3>
              <p className="text-gray-500 text-sm font-medium mb-6">
                Are you sure you want to change <span className="font-bold text-gray-900">{userToUpdate.name}</span>'s role to <span className="font-bold text-primary uppercase">{targetRole}</span>?
              </p>
              <div className="flex gap-3 w-full">
                <button
                  onClick={() => {
                    setUserConfirmOpen(false);
                    setUserToUpdate(null);
                  }}
                  className="flex-1 py-3.5 bg-gray-50 hover:bg-gray-100 rounded-2xl text-xs font-black uppercase tracking-widest text-gray-500 transition-all font-bold"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    await executeUserRoleChange();
                    setUserConfirmOpen(false);
                    setUserToUpdate(null);
                  }}
                  className="flex-1 py-3.5 bg-primary hover:bg-blue-600 active:scale-[0.98] rounded-2xl text-xs font-black uppercase tracking-widest text-white transition-all shadow-lg shadow-blue-500/20 font-bold"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
