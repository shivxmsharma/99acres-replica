"use client";

import { useState, useMemo } from "react";
import { Calculator, IndianRupee, Percent, Calendar, PieChart, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function EMICalculator() {
  const [principal, setPrincipal] = useState(5000000); // 50 Lakhs default
  const [interest, setInterest] = useState(8.5); // 8.5% default
  const [tenure, setTenure] = useState(20); // 20 years default

  const { emi, totalInterest, totalAmount } = useMemo(() => {
    const p = parseFloat(principal);
    const r = parseFloat(interest) / 12 / 100;
    const n = parseFloat(tenure) * 12;

    let emiCalc = 0;
    if (p > 0 && r > 0 && n > 0) {
      emiCalc = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    } else if (p > 0 && n > 0 && r === 0) {
      emiCalc = p / n;
    }

    const totalAmt = emiCalc * n;
    const totalInt = totalAmt - p;

    return {
      emi: emiCalc || 0,
      totalInterest: totalInt || 0,
      totalAmount: totalAmt || 0,
    };
  }, [principal, interest, tenure]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const principalPercentage = totalAmount > 0 ? (principal / totalAmount) * 100 : 100;
  const interestPercentage = totalAmount > 0 ? (totalInterest / totalAmount) * 100 : 0;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12">
      <div className="w-full max-w-6xl px-4 flex flex-col">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-8">
          <Link href="/" className="hover:text-[#0041C2]">Home</Link>
          <ChevronRight size={10} />
          <span className="text-gray-900">EMI Calculator</span>
        </div>

        <div className="mb-12 text-center lg:text-left">
          <div className="inline-flex items-center gap-3 px-4 py-2 bg-blue-50 text-[#0041C2] rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
            <Calculator size={14} /> Financial Planning Tools
          </div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight uppercase mb-4">
            Home Loan EMI Calculator
          </h1>
          <p className="text-gray-500 max-w-2xl text-sm font-medium">
            Plan your home purchase smartly. Estimate your monthly installments, total interest output, and structure your finances before buying your dream property.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* Inputs Section */}
          <div className="lg:col-span-7 bg-white rounded-[48px] shadow-2xl shadow-gray-200 border border-gray-100 p-10">

            {/* Principal Input */}
            <div className="mb-12">
              <div className="flex justify-between items-center mb-6">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <IndianRupee className="w-4 h-4 text-[#0041C2]" /> Loan Amount
                </label>
                <div className="bg-gray-50 border border-gray-100 rounded-2xl px-5 py-3 flex items-center">
                  <span className="text-[#0041C2] font-black text-sm mr-2">₹</span>
                  <input
                    type="number"
                    value={principal}
                    onChange={(e) => setPrincipal(Number(e.target.value))}
                    className="bg-transparent text-gray-900 font-black w-32 focus:outline-none text-right"
                  />
                </div>
              </div>
              <input
                type="range"
                min="100000"
                max="50000000"
                step="100000"
                value={principal}
                onChange={(e) => setPrincipal(Number(e.target.value))}
                className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-[#0041C2]"
              />
              <div className="flex justify-between mt-4 text-[10px] text-gray-400 font-black uppercase tracking-widest">
                <span>₹1 L</span>
                <span>₹5 Cr</span>
              </div>
            </div>

            {/* Interest Input */}
            <div className="mb-12">
              <div className="flex justify-between items-center mb-6">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <Percent className="w-4 h-4 text-[#0041C2]" /> Interest Rate (p.a.)
                </label>
                <div className="bg-gray-50 border border-gray-100 rounded-2xl px-5 py-3 flex items-center">
                  <input
                    type="number"
                    step="0.1"
                    value={interest}
                    onChange={(e) => setInterest(Number(e.target.value))}
                    className="bg-transparent text-gray-900 font-black w-16 focus:outline-none text-right"
                  />
                  <span className="text-[#0041C2] font-black text-sm ml-2">%</span>
                </div>
              </div>
              <input
                type="range"
                min="5"
                max="15"
                step="0.1"
                value={interest}
                onChange={(e) => setInterest(Number(e.target.value))}
                className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-[#0041C2]"
              />
              <div className="flex justify-between mt-4 text-[10px] text-gray-400 font-black uppercase tracking-widest">
                <span>5%</span>
                <span>15%</span>
              </div>
            </div>

            {/* Tenure Input */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-6">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#0041C2]" /> Loan Tenure
                </label>
                <div className="bg-gray-50 border border-gray-100 rounded-2xl px-5 py-3 flex items-center">
                  <input
                    type="number"
                    value={tenure}
                    onChange={(e) => setTenure(Number(e.target.value))}
                    className="bg-transparent text-gray-900 font-black w-16 focus:outline-none text-right"
                  />
                  <span className="text-[#0041C2] font-black text-sm ml-2">Yrs</span>
                </div>
              </div>
              <input
                type="range"
                min="1"
                max="30"
                step="1"
                value={tenure}
                onChange={(e) => setTenure(Number(e.target.value))}
                className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-[#0041C2]"
              />
              <div className="flex justify-between mt-4 text-[10px] text-gray-400 font-black uppercase tracking-widest">
                <span>1 Yr</span>
                <span>30 Yrs</span>
              </div>
            </div>

          </div>

          {/* Results Section */}
          <div className="lg:col-span-5 flex flex-col gap-8">

            {/* EMI Card */}
            <div className="bg-[#0041C2] rounded-[48px] p-10 text-center shadow-2xl shadow-blue-900/20">
              <p className="text-[10px] font-black text-blue-200 mb-2 uppercase tracking-[0.2em]">Monthly EMI</p>
              <h2 className="text-5xl font-black text-white tracking-tighter">
                {formatCurrency(emi)}
              </h2>
            </div>

            {/* Breakdown Card */}
            <div className="bg-white rounded-[48px] shadow-2xl shadow-gray-200 border border-gray-100 p-10">
              <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest flex items-center gap-2 mb-8">
                <PieChart className="w-4 h-4 text-[#0041C2]" /> Payment Breakdown
              </h3>

              <div className="space-y-6 mb-10">
                <div className="flex justify-between items-center pb-4 border-b border-gray-50">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-[#0041C2]" />
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-tight">Principal</span>
                  </div>
                  <span className="font-black text-gray-900">{formatCurrency(principal)}</span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-gray-50">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-gray-200" />
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-tight">Interest</span>
                  </div>
                  <span className="font-black text-gray-900">{formatCurrency(totalInterest)}</span>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-xs font-black text-gray-900 uppercase tracking-widest">Total Payable</span>
                  <span className="font-black text-[#0041C2] text-xl tracking-tighter">{formatCurrency(totalAmount)}</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-6 flex rounded-full overflow-hidden bg-gray-100 p-1">
                <div
                  className="h-full bg-[#0041C2] rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${principalPercentage}%` }}
                />
                <div
                  className="h-full bg-gray-200 rounded-full transition-all duration-1000 ease-out ml-1"
                  style={{ width: `${interestPercentage}%` }}
                />
              </div>
              <div className="flex justify-between text-[9px] font-black text-gray-400 mt-4 uppercase tracking-widest px-2">
                <span>Principal ({principalPercentage.toFixed(0)}%)</span>
                <span>Interest ({interestPercentage.toFixed(0)}%)</span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
