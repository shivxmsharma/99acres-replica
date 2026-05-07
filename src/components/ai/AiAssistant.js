"use client";

import { useState, useRef, useEffect } from "react";
import { Sparkles, X, Send, ChevronDown, Bot } from "lucide-react";
import ReactMarkdown from "react-markdown";

const SUGGESTIONS = [
  "Best areas to buy in Delhi NCR?",
  "How to calculate home loan EMI?",
  "What is RERA verification?",
  "Current real estate trends in Bangalore?",
  "Tips for first-time home buyers in India",
];

export default function AiAssistant({ propertyContext = null }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (open) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      inputRef.current?.focus();
    }
  }, [messages, open]);

  async function send(text) {
    const msg = (text || input).trim();
    if (!msg || loading) return;
    setInput("");

    const updated = [...messages, { role: "user", content: msg }];
    setMessages(updated);
    setLoading(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updated, propertyContext }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply || "Sorry, I couldn't process that." },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "I'm having trouble connecting right now. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
      {/* Chat panel */}
      {open && (
        <div className="w-80 sm:w-96 bg-white rounded-3xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="bg-[#0041C2] px-5 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-white font-black text-sm uppercase tracking-wider">99Assistant</p>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                  <p className="text-blue-100 text-[10px] font-bold uppercase tracking-widest">Always Online</p>
                </div>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-white/70 hover:text-white transition-colors p-1"
            >
              <ChevronDown className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex flex-col gap-4 p-5 overflow-y-auto h-[400px] custom-scrollbar bg-gray-50/30">
            {messages.length === 0 && (
              <div className="space-y-4">
                <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
                  <p className="text-sm text-gray-700 leading-relaxed">
                    👋 Namaste! I'm your **99acres AI Assistant**. Ask me anything about property trends, area insights, or legal advice in the Indian real estate market.
                  </p>
                </div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">
                  Try asking…
                </p>
                <div className="flex flex-col gap-2">
                  {SUGGESTIONS.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => send(s)}
                      className="text-left text-xs font-bold text-[#0041C2] bg-blue-50/50 hover:bg-blue-100/50 border border-blue-100/50 rounded-xl px-4 py-3 transition-all active:scale-95"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] text-sm px-4 py-3 rounded-2xl leading-relaxed ${m.role === "user"
                    ? "bg-[#0041C2] text-white rounded-br-sm shadow-md"
                    : "bg-white text-gray-800 border border-gray-100 rounded-bl-sm shadow-sm prose prose-sm prose-p:leading-relaxed"
                    }`}
                >
                  <ReactMarkdown>{m.content}</ReactMarkdown>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-sm px-5 py-3 flex gap-1.5 items-center shadow-sm">
                  {[0, 150, 300].map((d) => (
                    <span
                      key={d}
                      className="w-1.5 h-1.5 bg-[#0041C2] rounded-full animate-bounce"
                      style={{ animationDelay: `${d}ms` }}
                    />
                  ))}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="p-4 bg-white border-t border-gray-100">
            <div className="relative flex items-center gap-2">
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send()}
                placeholder="Type your query here..."
                className="flex-1 text-sm bg-gray-50 border-none rounded-2xl px-5 py-3.5 focus:ring-2 focus:ring-[#0041C2]/20 text-gray-900 placeholder-gray-400 font-medium"
              />
              <button
                onClick={() => send()}
                disabled={!input.trim() || loading}
                className="w-12 h-12 shrink-0 rounded-2xl bg-[#0041C2] hover:bg-blue-700 disabled:bg-gray-100 disabled:text-gray-400 flex items-center justify-center transition-all active:scale-90 shadow-lg shadow-blue-900/10"
              >
                <Send className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FAB */}
      <button
        onClick={() => setOpen((v) => !v)}
        className={`group flex items-center gap-3 px-6 py-4 rounded-full shadow-2xl transition-all duration-500 hover:scale-105 active:scale-95 ${open
          ? "bg-white text-gray-900 border border-gray-100"
          : "bg-[#0041C2] text-white"
          }`}
      >
        <div className="relative">
          {open ? (
            <X className="w-6 h-6 animate-in spin-in-90 duration-300" />
          ) : (
            <>
              <Sparkles className="w-6 h-6 animate-pulse" />
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-400 rounded-full border-2 border-[#0041C2]" />
            </>
          )}
        </div>
        {!open && <span className="text-sm font-black uppercase tracking-widest">Ask AI</span>}
      </button>
    </div>
  );
}
