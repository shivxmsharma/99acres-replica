"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  LayoutDashboard, 
  Users, 
  Home, 
  ClipboardList, 
  Settings, 
  LogOut,
  ShieldCheck,
  Menu,
  X
} from "lucide-react";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function AdminLayout({ children }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated" && session.user.role !== "Admin") {
      router.push("/");
    }
  }, [status, session, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  if (!session || session.user.role !== "Admin") {
    return null;
  }

  const menuItems = [
    { label: "Overview", icon: LayoutDashboard, href: "/admin" },
    { label: "Properties", icon: Home, href: "/admin/properties" },
    { label: "Users", icon: Users, href: "/admin/users" },
    { label: "Leads", icon: ClipboardList, href: "/admin/leads" },
    { label: "Settings", icon: Settings, href: "/admin/settings" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside 
        className={`${
          isSidebarOpen ? "w-64" : "w-20"
        } bg-white border-r border-gray-100 transition-all duration-300 flex flex-col fixed h-full z-40`}
      >
        <div className="p-6 flex items-center justify-between">
          <Link href="/" className={`flex items-center gap-2 ${!isSidebarOpen && "hidden"}`}>
            <span className="text-xl font-black italic text-primary">99acres</span>
            <span className="text-[8px] font-bold bg-secondary text-white px-1 rounded uppercase">Admin</span>
          </Link>
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-gray-50 rounded-lg transition-colors"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="flex items-center gap-4 px-4 py-3 rounded-2xl text-gray-500 hover:text-primary hover:bg-primary/5 transition-all group"
            >
              <item.icon size={20} className="group-hover:scale-110 transition-transform" />
              {isSidebarOpen && <span className="font-bold text-sm tracking-tight">{item.label}</span>}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-50">
          <div className={`flex items-center gap-3 p-4 bg-gray-50 rounded-3xl ${!isSidebarOpen && "justify-center"}`}>
            <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-black">
              {session?.user?.name ? session.user.name[0] : 'A'}
            </div>
            {isSidebarOpen && (
              <div className="min-w-0">
                <p className="text-xs font-black text-gray-900 truncate">{session?.user?.name}</p>
                <p className="text-[10px] font-bold text-gray-400 uppercase">System Admin</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-20"}`}>
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-10 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <ShieldCheck size={24} className="text-primary" />
            <h1 className="text-xl font-black text-gray-900 tracking-tight uppercase">Admin Control Center</h1>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="text-right hidden sm:block">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Server Status</p>
              <p className="text-xs font-black text-green-500 flex items-center gap-1.5 justify-end mt-1">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" /> Operational
              </p>
            </div>
          </div>
        </header>

        <div className="p-10">
          {children}
        </div>
      </main>
    </div>
  );
}
