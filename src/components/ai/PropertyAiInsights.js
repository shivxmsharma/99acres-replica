"use client";

import { useState } from "react";
import {
  Sparkles, CheckCircle2, AlertCircle, AlertTriangle,
  TrendingUp, Loader2, ChevronDown, ChevronUp, RefreshCw,
} from "lucide-react";

const VERDICT = {
  GOOD_DEAL: { label: "Good Deal", cls: "text-emerald-700 bg-emerald-50 border-emerald-100", emoji: "🟢" },
  FAIR: { label: "Fair Listing", cls: "text-blue-700 bg-blue-50 border-blue-100", emoji: "🔵" },
  NEEDS_CAUTION: { label: "Needs Caution", cls: "text-amber-700 bg-amber-50 border-amber-100", emoji: "🟡" },
};

export default function PropertyAiInsights({ propertyId }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState(true);

  async function run() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/ai/analyze/${propertyId}`);
      const json = await res.json();
      if (json.error) throw new Error(json.error);
      setData(json);
    } catch (e) {
      setError(e.message || "Analysis failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const analysis = data?.analysis;
  const verdict = analysis ? (VERDICT[analysis.overallVerdict] ?? VERDICT.FAIR) : null;

  return (
    <div className="rounded-[32px] border border-gray-100 bg-white overflow-hidden shadow-sm h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-gray-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-[#0041C2]" />
          </div>
          <div>
            <p className="font-black text-gray-900 text-sm uppercase tracking-wider">AI Property Insights</p>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Powered by Google Gemini</p>
          </div>
        </div>
        {analysis && (
          <button
            onClick={() => setExpanded((v) => !v)}
            className="text-gray-400 hover:text-gray-900 transition-colors"
          >
            {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        )}
      </div>

      {/* Prompt state */}
      {!analysis && !loading && (
        <div className="p-6">
          <p className="text-sm text-gray-600 mb-6 leading-relaxed">
            Get an instant AI breakdown of this listing — price fairness, pros & cons, red flags, and neighbourhood context.
          </p>
          <button
            onClick={run}
            className="w-full py-4 rounded-2xl bg-[#0041C2] hover:bg-blue-700 text-white text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-900/10 active:scale-95"
          >
            <Sparkles className="w-4 h-4" />
            Analyze this Property
          </button>
          {error && (
            <p className="mt-3 text-xs text-red-500 font-bold text-center italic">{error}</p>
          )}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="p-10 flex flex-col items-center justify-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-[#0041C2]" />
          <p className="text-xs font-black text-[#0041C2] uppercase tracking-[0.2em] animate-pulse">Analyzing...</p>
        </div>
      )}

      {/* Results */}
      {analysis && expanded && (
        <div className="p-6 space-y-6 overflow-y-auto max-h-[500px] custom-scrollbar">
          {/* Verdict chip */}
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-black uppercase tracking-widest shadow-sm ${verdict.cls}`}>
            <span>{verdict.emoji}</span> {verdict.label}
          </div>

          {/* Price */}
          <Section icon={<TrendingUp className="w-4 h-4" />} title="Price Assessment">
            <p className="text-sm text-gray-600 leading-relaxed font-medium">{analysis.priceAssessment}</p>
          </Section>

          {/* Pros */}
          {analysis.pros?.length > 0 && (
            <Section icon={<CheckCircle2 className="w-4 h-4 text-emerald-500" />} title="Pros">
              <ul className="space-y-2">
                {analysis.pros.map((p, i) => (
                  <li key={i} className="text-sm text-gray-600 flex items-start gap-3 font-medium">
                    <span className="text-emerald-500 mt-1 shrink-0">●</span>{p}
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {/* Cons */}
          {analysis.cons?.length > 0 && (
            <Section icon={<AlertCircle className="w-4 h-4 text-amber-500" />} title="Cons">
              <ul className="space-y-2">
                {analysis.cons.map((c, i) => (
                  <li key={i} className="text-sm text-gray-600 flex items-start gap-3 font-medium">
                    <span className="text-amber-500 mt-1 shrink-0">●</span>{c}
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {/* Red Flags */}
          {analysis.redFlags?.length > 0 && (
            <div className="bg-red-50 border border-red-100 rounded-2xl p-4 space-y-3">
              <p className="text-[10px] font-black text-red-600 uppercase tracking-[0.2em] flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" /> Red Flags
              </p>
              <ul className="space-y-2">
                {analysis.redFlags.map((f, i) => (
                  <li key={i} className="text-xs text-red-900 flex items-start gap-3 font-bold">
                    <span className="mt-1 shrink-0 text-red-500">!</span>{f}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Buyer Tips */}
          {analysis.buyerTips && (
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 shadow-sm">
              <p className="text-[10px] font-black text-[#0041C2] uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                <Bot className="w-4 h-4" /> AI Buyer Tips
              </p>
              <p className="text-xs text-blue-900 font-bold leading-relaxed">{analysis.buyerTips}</p>
            </div>
          )}

          <button
            onClick={run}
            className="flex items-center gap-2 text-[10px] font-black text-gray-400 hover:text-[#0041C2] uppercase tracking-widest transition-all mt-4"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Re-analyze
          </button>
        </div>
      )}
    </div>
  );
}

function Section({ icon, title, children }) {
  return (
    <div className="space-y-2">
      <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
        {icon}{title}
      </p>
      <div className="pl-6">
        {children}
      </div>
    </div>
  );
}
