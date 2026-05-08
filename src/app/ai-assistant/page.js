"use client";

import { useState } from "react";
import { Bot, Send, User, Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";

export default function AiAssistantPage() {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "👋 Namaste! I'm your 99acres AI Assistant. How can I help you find your dream home or navigate the Indian real estate market today?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const SUGGESTIONS = [
    { label: "Calculate EMI", prompt: "Help me calculate the EMI for a 50 lakh loan at 8.5% for 20 years." },
    { label: "Check Valuation", prompt: "How do I check the valuation of a 3BHK in Sector 15, Gurgaon?" },
    { label: "Compare Properties", prompt: "Show me how to compare properties side-by-side." }
  ];

  const sendMessage = async (e, customInput = null) => {
    if (e) e.preventDefault();
    const finalInput = customInput || input;
    if (!finalInput.trim() || loading) return;

    const userMessage = { role: "user", content: finalInput };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMessage]
        }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Failed to fetch response");

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply },
      ]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "I'm sorry, I'm having trouble connecting right now. Please try again later." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12">
      <div className="w-full max-w-4xl px-4 flex flex-col h-[calc(100vh-200px)]">

        <div className="flex items-center gap-6 mb-10 px-4">
          <div className="inline-flex items-center justify-center p-4 bg-white rounded-[24px] shadow-xl shadow-blue-900/5 border border-blue-50">
            <Bot className="w-10 h-10 text-[#0041C2]" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight uppercase tracking-widest">99Assistant</h1>
            <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mt-1">Intelligent Real Estate Advisory</p>
          </div>
        </div>

        <div className="flex-1 bg-white border border-gray-100 rounded-[40px] overflow-hidden flex flex-col shadow-2xl shadow-blue-900/5">

          {/* Chat Window */}
          <div className="flex-1 p-8 overflow-y-auto space-y-8 custom-scrollbar">
            {messages.map((m, i) => (
              <div key={i} className={`flex gap-5 ${m.role === 'assistant' ? 'items-start' : 'items-start flex-row-reverse'}`}>
                <div className={`w-12 h-12 shrink-0 rounded-2xl flex items-center justify-center border ${m.role === 'assistant' ? 'bg-blue-50 text-[#0041C2] border-blue-100' : 'bg-gray-900 text-white border-gray-900'}`}>
                  {m.role === 'assistant' ? <Bot className="w-6 h-6" /> : <User className="w-6 h-6" />}
                </div>
                <div className={`px-6 py-4 rounded-3xl text-sm leading-relaxed max-w-[80%] shadow-sm ${m.role === 'assistant'
                  ? 'bg-gray-50 text-gray-800 rounded-tl-sm prose prose-sm max-w-none prose-p:leading-relaxed'
                  : 'bg-[#0041C2] text-white rounded-tr-sm font-medium'
                  }`}>
                  {m.role === 'assistant' ? (
                    <ReactMarkdown>{m.content}</ReactMarkdown>
                  ) : (
                    <p className="whitespace-pre-wrap">{m.content}</p>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex gap-5 items-start">
                <div className="w-12 h-12 shrink-0 rounded-2xl flex items-center justify-center bg-blue-50 text-[#0041C2] border border-blue-100">
                  <Bot className="w-6 h-6" />
                </div>
                <div className="px-8 py-5 rounded-3xl bg-gray-50 border border-gray-100 flex gap-2 items-center shadow-sm">
                  {[0, 150, 300].map((d) => (
                    <span key={d} className="w-2 h-2 rounded-full bg-[#0041C2] animate-bounce" style={{ animationDelay: `${d}ms` }}></span>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Suggestions */}
          <div className="px-8 py-4 bg-gray-50/50 border-t border-gray-100 flex gap-3 overflow-x-auto no-scrollbar">
            {SUGGESTIONS.map((s) => (
              <button
                key={s.label}
                onClick={() => sendMessage(null, s.prompt)}
                className="whitespace-nowrap px-4 py-2 bg-white border border-gray-100 rounded-full text-[10px] font-black uppercase tracking-widest text-[#0041C2] hover:bg-[#0041C2] hover:text-white transition-all shadow-sm"
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <div className="p-6 bg-white border-t border-gray-100">
            <form onSubmit={sendMessage} className="relative flex items-center gap-4">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about properties, trends, or area insights..."
                className="w-full bg-gray-50 border-none text-gray-900 text-sm rounded-[24px] pl-8 pr-20 py-5 focus:ring-2 focus:ring-[#0041C2]/20 font-medium"
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="absolute right-3 p-4 bg-[#0041C2] hover:bg-blue-700 text-white rounded-[18px] transition-all disabled:opacity-50 disabled:scale-95 active:scale-90 shadow-lg shadow-blue-900/20"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </div>

        </div>

        <div className="mt-8 flex justify-center gap-6">
          <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
            <Sparkles className="w-3 h-3 text-amber-400" /> Powered by Gemini 1.5 Flash
          </div>
          <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
            🛡️ Private & Secure
          </div>
        </div>

      </div>
    </div>
  );
}
