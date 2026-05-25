"use client";

import { useState, useEffect } from "react";
import { 
  Search, 
  User, 
  Mail, 
  Shield, 
  ShieldAlert, 
  MoreVertical,
  UserCheck,
  UserX,
  Loader2,
  Calendar
} from "lucide-react";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [userConfirmOpen, setUserConfirmOpen] = useState(false);
  const [userToUpdate, setUserToUpdate] = useState(null);
  const [targetRole, setTargetRole] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      if (data.success) setUsers(data.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleRoleChangeClick = (user, newRole) => {
    setUserToUpdate(user);
    setTargetRole(newRole);
    setUserConfirmOpen(true);
  };

  const executeRoleChange = async () => {
    if (!userToUpdate || !targetRole) return;
    try {
      const res = await fetch(`/api/admin/users/${userToUpdate._id}/role`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: targetRole })
      });
      if (res.ok) fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) || 
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">User Management</h2>
          <p className="text-gray-500 text-sm font-medium">Control user access, roles, and platform permissions.</p>
        </div>
        
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search users by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-100 rounded-2xl outline-none focus:border-primary transition-all text-sm font-medium shadow-sm"
          />
        </div>
      </div>

      {/* Users Grid */}
      <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-20 flex flex-col items-center justify-center text-gray-400">
            <Loader2 className="animate-spin mb-4" size={40} />
            <p className="text-sm font-bold uppercase tracking-widest">Loading users...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Identity</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Contact</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Current Role</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Joined</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Access Control</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50/30 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black text-lg border-2 border-white shadow-sm">
                          {user.name[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="text-base font-black text-gray-900 tracking-tight">{user.name}</p>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">ID: {user._id.slice(-6)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2 text-gray-500 font-medium">
                        <Mail size={14} className="text-primary" />
                        <span className="text-sm">{user.email}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`flex items-center w-fit gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                        user.role === 'Admin' 
                          ? 'bg-red-50 text-red-600 border-red-100' 
                          : user.role === 'Agent'
                          ? 'bg-blue-50 text-blue-600 border-blue-100'
                          : 'bg-green-50 text-green-600 border-green-100'
                      }`}>
                        {user.role === 'Admin' ? <ShieldAlert size={12} /> : user.role === 'Agent' ? <Shield size={12} /> : <User size={12} />}
                        {user.role || 'Buyer'}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2 text-gray-400">
                        <Calendar size={14} />
                        <span className="text-xs font-bold">{new Date(user.createdAt).toLocaleDateString()}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center justify-end gap-2">
                        {user.role !== 'Agent' && (
                          <button 
                            onClick={() => handleRoleChangeClick(user, 'Agent')}
                            className="px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                          >
                            Make Agent
                          </button>
                        )}
                        {user.role !== 'Admin' && (
                          <button 
                            onClick={() => handleRoleChangeClick(user, 'Admin')}
                            className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                          >
                            Make Admin
                          </button>
                        )}
                        {user.role !== 'Buyer' && (
                          <button 
                            onClick={() => handleRoleChangeClick(user, 'Buyer')}
                            className="p-2.5 bg-gray-50 text-gray-400 hover:bg-gray-900 hover:text-white rounded-xl transition-all"
                            title="Demote to Buyer"
                          >
                            <UserX size={18} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

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
                <User size={28} />
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
                    await executeRoleChange();
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
