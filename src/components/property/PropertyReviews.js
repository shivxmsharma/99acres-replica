"use client";

import { useState, useEffect } from "react";
import { Star, User, MessageCircle, Send, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";

export default function PropertyReviews({ propertyId }) {
  const { data: session } = useSession();
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, [propertyId]);

  const fetchReviews = async () => {
    try {
      const res = await fetch(`/api/reviews?propertyId=${propertyId}`);
      const data = await res.json();
      if (data.success) setReviews(data.data);
    } catch (error) {
      console.error("Failed to fetch reviews");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!session) {
      toast.error("Please login to post a review");
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ propertyId, rating, comment })
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Review posted!");
        setComment("");
        fetchReviews();
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-12">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Reviews & Ratings</h3>
        <div className="flex items-center gap-2">
          <span className="text-2xl font-black text-[#0041C2]">
            {reviews.length > 0 ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) : "0.0"}
          </span>
          <Star className="text-amber-400 fill-amber-400" size={24} />
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">({reviews.length} Reviews)</span>
        </div>
      </div>

      {/* Post Review */}
      {session && (
        <form onSubmit={handleSubmit} className="bg-white rounded-[40px] border border-gray-100 p-8 shadow-sm">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-6">Share your experience</p>
          <div className="flex gap-2 mb-6">
            {[1, 2, 3, 4, 5].map((num) => (
              <button 
                key={num} 
                type="button"
                onClick={() => setRating(num)}
                className="transition-transform active:scale-90"
              >
                <Star size={28} className={num <= rating ? "text-amber-400 fill-amber-400" : "text-gray-200"} />
              </button>
            ))}
          </div>
          <div className="relative">
            <textarea 
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="What did you like or dislike about this property?"
              className="w-full p-6 bg-gray-50 border border-gray-100 rounded-3xl focus:outline-none focus:border-[#0041C2] font-medium text-gray-900 resize-none transition-all pr-16"
              rows={3}
              required
            />
            <button 
              type="submit"
              disabled={isSubmitting}
              className="absolute bottom-4 right-4 p-4 bg-[#0041C2] text-white rounded-2xl shadow-lg shadow-blue-900/20 hover:scale-105 transition-all disabled:opacity-50"
            >
              {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
            </button>
          </div>
        </form>
      )}

      {/* Review List */}
      <div className="space-y-6">
        {isLoading ? (
          <div className="flex justify-center py-12"><Loader2 className="animate-spin text-gray-200" size={32} /></div>
        ) : reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review._id} className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm flex gap-6">
              <div className="w-12 h-12 bg-blue-50 text-[#0041C2] rounded-2xl flex items-center justify-center shrink-0">
                {review.userId?.image ? (
                  <img src={review.userId.image} className="w-full h-full object-cover rounded-2xl" alt="" />
                ) : (
                  <User size={24} />
                )}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-black text-gray-900">{review.userId?.name || "Verified User"}</h4>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <Star key={num} size={12} className={num <= review.rating ? "text-amber-400 fill-amber-400" : "text-gray-200"} />
                    ))}
                  </div>
                </div>
                <p className="text-gray-500 font-medium leading-relaxed italic text-sm">"{review.comment}"</p>
                <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest mt-4">
                  {new Date(review.createdAt).toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 border-2 border-dashed border-gray-100 rounded-[40px]">
            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">No reviews yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
