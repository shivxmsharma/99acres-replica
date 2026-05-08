"use client";

import { calculateTrustScore, getTrustLabel } from "@/lib/trustScore";
import { ShieldCheck, ShieldAlert, Shield } from "lucide-react";

export default function PropertyTrustBadge({ property }) {
  const score = calculateTrustScore(property);
  const { label, color, bg } = getTrustLabel(score);

  return (
    <div className={`inline-flex items-center gap-3 px-4 py-2 rounded-2xl border border-gray-100 shadow-sm bg-white`}>
      <div className={`p-2 rounded-xl ${bg} ${color}`}>
        {score >= 80 ? <ShieldCheck size={20} /> : score >= 40 ? <Shield size={20} /> : <ShieldAlert size={20} />}
      </div>
      <div>
        <div className="flex items-center gap-2">
          <span className={`text-[10px] font-black uppercase tracking-widest ${color}`}>{label}</span>
          <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Trust Score</span>
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className={`h-full ${score >= 80 ? 'bg-emerald-500' : score >= 40 ? 'bg-[#0041C2]' : 'bg-amber-500'} transition-all`} 
              style={{ width: `${score}%` }} 
            />
          </div>
          <span className="text-xs font-black text-gray-900">{score}%</span>
        </div>
      </div>
    </div>
  );
}
