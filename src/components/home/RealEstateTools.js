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
    <section className="py-24 bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-12">
          <h2 className="text-3xl font-black text-gray-900 tracking-tight uppercase mb-2">Real Estate Toolkit</h2>
          <p className="text-gray-500 font-medium">Smart tools to help you make informed property decisions.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {TOOLS.map((tool) => (
            <Link 
              key={tool.title} 
              href={tool.href}
              className="group bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-500"
            >
              <div className={`w-14 h-14 ${tool.color} rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform`}>
                <tool.icon size={28} />
              </div>
              <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight mb-3 group-hover:text-[#0041C2] transition-colors">
                {tool.title}
              </h3>
              <p className="text-gray-500 text-sm font-medium leading-relaxed">
                {tool.desc}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
