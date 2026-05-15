"use client";

import { useState, useEffect } from "react";
import { Bell, ShieldCheck, TrendingUp, Info, ChevronRight, Check } from "lucide-react";
import Link from "next/link";

const MOCK_NOTIFICATIONS = [
  {
    id: 1,
    type: "verification",
    title: "Property Verified!",
    message: "Your property 'Luxury Villa in Goa' has been successfully verified by our team.",
    time: "2 hours ago",
    isRead: false,
    icon: ShieldCheck,
    color: "text-green-600 bg-green-50"
  },
  {
    id: 2,
    type: "lead",
    title: "New Inquiry Received",
    message: "A potential buyer has shown interest in your listing. Check your dashboard.",
    time: "5 hours ago",
    isRead: false,
    icon: TrendingUp,
    color: "text-blue-600 bg-blue-50"
  },
  {
    id: 3,
    type: "system",
    title: "Complete Your Profile",
    message: "Improve your Trust Score by adding a phone number to your account.",
    time: "1 day ago",
    isRead: true,
    icon: Info,
    color: "text-orange-600 bg-orange-50"
  }
];

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 hover:bg-blue-700 rounded-full transition-colors relative group"
      >
        <Bell size={20} className={isOpen ? "text-secondary" : ""} />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-3 h-3 bg-secondary rounded-full border-2 border-primary flex items-center justify-center text-[6px] font-black">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full right-0 w-[350px] bg-white text-gray-900 shadow-2xl rounded-[32px] border border-gray-100 py-6 z-50 mt-2 transform origin-top-right animate-in fade-in zoom-in duration-200">
            <div className="px-6 pb-4 border-b border-gray-50 flex justify-between items-center">
              <div>
                <h3 className="text-sm font-black uppercase tracking-tight">Notifications</h3>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{unreadCount} Unread Messages</p>
              </div>
              <button 
                onClick={markAllRead}
                className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline flex items-center gap-1"
              >
                Mark all as read <Check size={12} />
              </button>
            </div>

            <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
              {notifications.length > 0 ? (
                notifications.map((notif) => (
                  <div 
                    key={notif.id}
                    className={`px-6 py-4 flex gap-4 hover:bg-gray-50 transition-colors relative cursor-pointer group ${!notif.isRead ? "bg-blue-50/30" : ""}`}
                  >
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${notif.color}`}>
                      <notif.icon size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2">
                        <p className={`text-xs font-black ${notif.isRead ? "text-gray-900" : "text-primary"}`}>{notif.title}</p>
                        <span className="text-[9px] font-bold text-gray-400 whitespace-nowrap">{notif.time}</span>
                      </div>
                      <p className="text-[11px] text-gray-500 font-medium leading-relaxed mt-1 line-clamp-2">
                        {notif.message}
                      </p>
                    </div>
                    {!notif.isRead && (
                      <div className="absolute right-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-primary rounded-full" />
                    )}
                  </div>
                ))
              ) : (
                <div className="p-12 text-center text-gray-400">
                  <Bell size={40} className="mx-auto mb-3 opacity-20" />
                  <p className="text-[10px] font-black uppercase tracking-widest">No notifications yet</p>
                </div>
              )}
            </div>

            <div className="px-6 pt-4 border-t border-gray-50">
              <Link 
                href="/dashboard"
                onClick={() => setIsOpen(false)}
                className="block w-full bg-gray-50 hover:bg-gray-100 text-gray-900 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest text-center transition-all"
              >
                View All Activity
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
