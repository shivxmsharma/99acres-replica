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
  ChevronRight
} from "lucide-react";
import Link from "next/link";

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then(res => res.json())
      .then(res => {
        if (res.success) setData(res.data);
        setLoading(false);
      });
  }, []);

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
                          <img src={prop.images[0]} className="w-full h-full object-cover" alt="" />
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
                    <td className="px-8 py-5">
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-400">
                        <MoreVertical size={16} />
                      </button>
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
                <button className="p-2 bg-gray-50 hover:bg-primary hover:text-white rounded-xl text-gray-400 transition-all">
                  <ArrowUpRight size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
