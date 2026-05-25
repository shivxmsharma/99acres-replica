"use client";

import { useCompare } from "@/context/CompareContext";
import { X, ArrowRightLeft, Trash2 } from "lucide-react";
import Link from "next/link";
import SafeImage from "../common/SafeImage";
import { motion, AnimatePresence } from "framer-motion";

export default function CompareBar() {
  const { compareList, removeFromCompare, clearCompare } = useCompare();

  return (
    <AnimatePresence>
      {compareList.length > 0 && (
        <motion.div 
          initial={{ y: 100, x: "-50%", opacity: 0 }}
          animate={{ y: 0, x: "-50%", opacity: 1 }}
          exit={{ y: 100, x: "-50%", opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-8 left-1/2 z-[60] w-full max-w-4xl px-4"
        >
          <div className="bg-white rounded-[40px] shadow-2xl border border-gray-100 p-6 flex items-center justify-between gap-8">
            <div className="flex items-center gap-4 flex-1 overflow-x-auto no-scrollbar">
              {compareList.map((item) => {
                const itemId = item._id || item.objectID;
                return (
                  <div key={itemId} className="relative shrink-0 group">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden border border-gray-50">
                      <SafeImage src={item.coverPhoto || item.images?.[0]} alt="" fill className="object-cover" />
                    </div>
                    <button 
                      onClick={() => removeFromCompare(itemId)}
                      className="absolute -top-2 -right-2 p-1 bg-white border border-gray-100 rounded-full shadow-sm hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"
                    >
                      <X size={12} />
                    </button>
                  </div>
                );
              })}
              {compareList.length < 4 && (
                <div className="w-16 h-16 rounded-2xl border-2 border-dashed border-gray-100 flex items-center justify-center text-gray-200">
                  <ArrowRightLeft size={20} />
                </div>
              )}
            </div>

            <div className="flex items-center gap-4 border-l border-gray-50 pl-8">
              <button 
                onClick={clearCompare}
                className="p-3 text-gray-400 hover:text-red-500 transition-colors"
                title="Clear all"
              >
                <Trash2 size={20} />
              </button>
              <Link 
                href="/compare"
                className="bg-[#0041C2] text-white px-8 py-4 rounded-3xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all flex items-center gap-3 whitespace-nowrap shadow-xl shadow-blue-900/20"
              >
                Compare <span className="bg-white/20 px-2 py-0.5 rounded-full">{compareList.length}</span>
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
