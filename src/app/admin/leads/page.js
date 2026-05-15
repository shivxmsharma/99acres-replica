"use client";

import { useState } from "react";
import { 
  FileText, 
  Search, 
  Download, 
  Filter, 
  MoreVertical,
  Mail,
  Phone,
  Calendar,
  ExternalLink,
  MessageSquare
} from "lucide-react";
import Link from "next/link";

const MOCK_LEADS = [
  { id: 1, name: "Rahul Sharma", email: "rahul@example.com", phone: "+91 98765 43210", property: "3 BHK Apartment in Gurgaon", date: "2026-05-14", status: "New" },
  { id: 2, name: "Priya Patel", email: "priya@example.com", phone: "+91 87654 32109", property: "Luxury Villa in South Delhi", date: "2026-05-13", status: "Contacted" },
  { id: 3, name: "Amit Singh", email: "amit@example.com", phone: "+91 76543 21098", property: "Commercial Office in Mumbai", date: "2026-05-12", status: "Qualified" },
  { id: 4, name: "Sonia Verma", email: "sonia@example.com", phone: "+91 65432 10987", property: "Penthouse in Bangalore", date: "2026-05-11", status: "Closed" },
];

export default function AdminLeads() {
  const [leads] = useState(MOCK_LEADS);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Lead Reports</h2>
          <p className="text-gray-500 text-sm font-medium">Monitor all property inquiries and sales leads.</p>
        </div>
        <button className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-900/20">
          <Download size={16} /> Export CSV
        </button>
      </div>

      <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-gray-50 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search leads by name, email or property..."
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm font-medium"
            />
          </div>
          <div className="flex items-center gap-3">
            <button className="p-3 bg-gray-50 text-gray-400 hover:text-primary rounded-xl transition-all">
              <Filter size={18} />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Lead Name</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Property Interested</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Date</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {leads.map((lead) => (
                <tr key={lead.id} className="hover:bg-gray-50/30 transition-colors group">
                  <td className="px-8 py-6">
                    <div>
                      <p className="text-base font-black text-gray-900 tracking-tight">{lead.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Mail size={12} className="text-gray-400" />
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{lead.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-sm font-bold text-gray-700 line-clamp-1">{lead.property}</p>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2 text-gray-400">
                      <Calendar size={14} />
                      <span className="text-xs font-bold">{lead.date}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                      lead.status === 'New' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                      lead.status === 'Contacted' ? 'bg-orange-50 text-orange-600 border-orange-100' :
                      lead.status === 'Qualified' ? 'bg-green-50 text-green-600 border-green-100' :
                      'bg-gray-50 text-gray-600 border-gray-100'
                    }`}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2.5 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-xl transition-all">
                        <Phone size={18} />
                      </button>
                      <button className="p-2.5 bg-green-50 text-green-600 hover:bg-green-600 hover:text-white rounded-xl transition-all">
                        <MessageSquare size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
