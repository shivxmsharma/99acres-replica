"use client";

import { Share2, Heart, Info } from "lucide-react";
import { useShortlist } from "@/context/ShortlistContext";
import { useState } from "react";
import { toast } from "react-hot-toast";

export default function PropertyActionBar({ property }) {
  const { isShortlisted, toggleShortlist } = useShortlist();
  const [isSharing, setIsSharing] = useState(false);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: property.title,
          text: `Check out this property: ${property.title}`,
          url: window.location.href,
        });
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  const handleReport = () => {
    toast.error("Thank you for your feedback. Our moderation team will review this listing.");
  };

  const shortlisted = isShortlisted(property._id);

  return (
    <div className="flex items-center gap-6 py-4 border-y border-gray-100 mt-4">
      <button 
        onClick={handleShare}
        className="flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-primary transition-all group"
      >
        <div className="p-2 rounded-full bg-gray-50 group-hover:bg-blue-50 transition-colors">
          <Share2 size={18} />
        </div>
        Share
      </button>

      <button 
        onClick={() => {
          toggleShortlist(property);
        }}
        className={`flex items-center gap-2 text-sm font-bold transition-all group ${
          shortlisted ? "text-red-500" : "text-gray-600 hover:text-red-500"
        }`}
      >
        <div className={`p-2 rounded-full transition-colors ${
          shortlisted ? "bg-red-50" : "bg-gray-50 group-hover:bg-red-50"
        }`}>
          <Heart size={18} fill={shortlisted ? "currentColor" : "none"} />
        </div>
        {shortlisted ? "Shortlisted" : "Shortlist"}
      </button>

      <button 
        onClick={handleReport}
        className="flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-orange-600 transition-all group"
      >
        <div className="p-2 rounded-full bg-gray-50 group-hover:bg-orange-50 transition-colors">
          <Info size={18} />
        </div>
        Report
      </button>
    </div>
  );
}
