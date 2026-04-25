"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Menu, User, Bell, ChevronDown, Plus } from "lucide-react";
import { useSession, signIn, signOut } from "next-auth/react";

const NAV_LINKS = [
  { name: "For Buyers", links: ["Residential", "Commercial", "New Projects"] },
  { name: "For Tenants", links: ["Rent a House", "PG/Hostels", "Flatmates"] },
  { name: "For Owners", links: ["Post Property", "Owner Services"] },
  { name: "For Dealers", links: ["Post Property", "Agent Services"] },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session, status } = useSession();

  return (
    <nav className="bg-primary text-white sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-black tracking-tighter italic">99acres</span>
              <span className="ml-1 text-[10px] font-bold bg-secondary px-1 rounded">REPLICA</span>
            </Link>

            {/* Desktop Links */}
            <div className="hidden lg:flex items-center gap-6">
              {NAV_LINKS.map((item) => (
                <div key={item.name} className="group relative">
                  <button className="flex items-center gap-1 text-sm font-medium hover:text-blue-200 py-4">
                    {item.name} <ChevronDown size={14} />
                  </button>
                  <div className="absolute top-full left-0 w-48 bg-white text-gray-800 shadow-xl rounded-b-lg hidden group-hover:block border-t-2 border-primary">
                    {item.links.map((sub) => (
                      <Link key={sub} href="#" className="block px-4 py-2 text-sm hover:bg-blue-50 transition-colors">
                        {sub}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-4">
            <Link href="/post-property" className="hidden md:flex items-center gap-2 bg-white text-primary px-4 py-1.5 rounded-full text-xs font-bold hover:bg-blue-50 transition-all shadow-lg">
              <Plus size={14} /> Post Property <span className="bg-secondary text-white text-[8px] px-1 rounded ml-1 uppercase">FREE</span>
            </Link>
            
            <div className="flex items-center gap-3">
              <button className="p-2 hover:bg-blue-700 rounded-full transition-colors relative">
                <Bell size={20} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-secondary rounded-full border-2 border-primary"></span>
              </button>
              <div className="relative group">
                {status === "authenticated" ? (
                  <>
                    <button className="p-1 hover:bg-blue-700 rounded-full transition-all flex items-center gap-2">
                      {session.user.image ? (
                        <img src={session.user.image} className="w-8 h-8 rounded-full border-2 border-white/20 shadow-sm" alt="" />
                      ) : (
                        <div className="w-8 h-8 bg-blue-700 rounded-full flex items-center justify-center">
                          <User size={18} />
                        </div>
                      )}
                    </button>
                    <div className="absolute top-full right-0 w-56 bg-white text-gray-800 shadow-2xl rounded-2xl hidden group-hover:block border border-gray-100 py-3 overflow-hidden mt-1 transform origin-top-right transition-all">
                      <div className="px-4 py-2 mb-2 border-b border-gray-50">
                        <p className="text-[8px] font-black text-primary uppercase tracking-widest">{session.user.role || 'Buyer'}</p>
                        <p className="text-sm font-black text-gray-900 truncate leading-tight">{session.user.name}</p>
                      </div>
                      <Link href="/dashboard" className="block px-4 py-2.5 text-xs font-bold text-gray-600 hover:text-primary hover:bg-blue-50 transition-all">
                        Dashboard
                      </Link>
                      <Link href="/post-property" className="block px-4 py-2.5 text-xs font-bold text-gray-600 hover:text-primary hover:bg-blue-50 transition-all">
                        Post Property
                      </Link>
                      <hr className="my-2 border-gray-50" />
                      <button 
                        onClick={() => signOut()}
                        className="w-full text-left px-4 py-2.5 text-xs font-bold hover:bg-red-50 text-red-500 transition-all"
                      >
                        Logout
                      </button>
                    </div>
                  </>
                ) : (
                  <Link 
                    href="/login"
                    className="flex items-center gap-2 bg-blue-700 hover:bg-blue-600 px-5 py-2 rounded-full text-xs font-black transition-all border border-white/10"
                  >
                    Login
                  </Link>
                )}
              </div>
              <button 
                className="lg:hidden p-2 hover:bg-blue-700 rounded-full transition-colors"
                onClick={() => setIsOpen(!isOpen)}
              >
                <Menu size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden bg-blue-900 border-t border-blue-800 p-4 animate-in slide-in-from-top duration-300">
          {NAV_LINKS.map((item) => (
            <div key={item.name} className="py-2">
              <div className="font-bold text-blue-200 text-xs uppercase tracking-widest mb-1">{item.name}</div>
              <div className="grid grid-cols-2 gap-2">
                {item.links.map((sub) => (
                  <Link key={sub} href="#" className="text-sm py-1 hover:text-blue-300">{sub}</Link>
                ))}
              </div>
            </div>
          ))}
          <Link href="/post-property" className="w-full mt-4 bg-secondary text-white font-bold py-2 rounded-lg flex items-center justify-center gap-2 shadow-lg">
            <Plus size={18} /> Post Property
          </Link>
        </div>
      )}
    </nav>
  );
}
