import Link from "next/link";
import { Calculator, ShieldCheck, ArrowRightLeft, TrendingUp } from "lucide-react";

const TOOLS = [
  {
    title: "EMI Calculator",
    desc: "Calculate your monthly home loan installments easily.",
    href: "/tools/emi-calculator",
    icon: Calculator,
    color: "bg-blue-50 text-blue-600"
  },
  {
    title: "Stamp Duty",
    desc: "Estimate stamp duty and registration charges in seconds.",
    href: "/tools/stamp-duty",
    icon: ShieldCheck,
    color: "bg-emerald-50 text-emerald-600"
  },
  {
    title: "AI Valuation",
    desc: "Get an instant AI-powered market estimate for any property.",
    href: "/tools/valuation",
    icon: TrendingUp,
    color: "bg-purple-50 text-purple-600"
  },
  {
    title: "Compare tool",
    desc: "Add properties to compare them side-by-side.",
    href: "/compare",
    icon: ArrowRightLeft,
    color: "bg-amber-50 text-amber-600"
  }
];

export default function RealEstateTools() {
  return (
    <section className="py-24 relative">
      {/* Dotted background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] bg-gray-50/50 -z-10"></div>
      
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="mb-12 text-center md:text-left">
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight uppercase mb-3">Real Estate Toolkit</h2>
          <p className="text-gray-500 font-medium text-lg">Smart tools to help you make informed property decisions.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {TOOLS.map((tool) => (
            <Link 
              key={tool.title} 
              href={tool.href}
              className="group relative bg-white/80 backdrop-blur-sm p-8 rounded-[40px] border border-gray-200/60 shadow-sm hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] transition-all duration-500 overflow-hidden"
            >
              {/* Subtle hover gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

              <div className={`relative z-10 w-16 h-16 ${tool.color} rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300 shadow-sm`}>
                <tool.icon size={32} strokeWidth={2.5} />
              </div>
              <h3 className="relative z-10 text-xl font-black text-gray-900 uppercase tracking-tight mb-3 group-hover:text-primary transition-colors">
                {tool.title}
              </h3>
              <p className="relative z-10 text-gray-500 text-sm font-medium leading-relaxed">
                {tool.desc}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
