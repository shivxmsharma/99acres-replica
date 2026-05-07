"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { pusherClient } from "@/lib/pusherClient";
import toast from "react-hot-toast";
import { Bell } from "lucide-react";

export default function NotificationListener() {
  const { data: session } = useSession();

  useEffect(() => {
    if (!session?.user?.email) return;

    const channelName = `user-${session.user.email.replace(/[^a-zA-Z0-9]/g, "_")}`;
    const channel = pusherClient.subscribe(channelName);

    channel.bind("new-lead", (data) => {
      toast.custom((t) => (
        <div
          className={`${
            t.visible ? "animate-enter" : "animate-leave"
          } max-w-md w-full bg-white shadow-2xl rounded-[32px] pointer-events-auto flex ring-1 ring-black ring-opacity-5 border border-blue-50 overflow-hidden`}
        >
          <div className="flex-1 w-0 p-6">
            <div className="flex items-start">
              <div className="flex-shrink-0 pt-0.5">
                <div className="h-12 w-12 rounded-2xl bg-blue-50 flex items-center justify-center text-[#0041C2]">
                  <Bell size={24} />
                </div>
              </div>
              <div className="ml-4 flex-1">
                <p className="text-xs font-black text-[#0041C2] uppercase tracking-widest mb-1">
                  New Lead Received
                </p>
                <p className="text-sm font-black text-gray-900 leading-tight">
                  {data.lead.name} inquired about {data.lead.propertyTitle}
                </p>
                <p className="mt-1 text-xs font-medium text-gray-500">
                  Mobile: {data.lead.mobile}
                </p>
              </div>
            </div>
          </div>
          <div className="flex border-l border-gray-50">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-xs font-black text-gray-400 hover:text-gray-600 focus:outline-none"
            >
              Close
            </button>
          </div>
        </div>
      ), {
        duration: 6000,
        position: "top-right"
      });
    });

    return () => {
      pusherClient.unsubscribe(channelName);
    };
  }, [session]);

  return null;
}
