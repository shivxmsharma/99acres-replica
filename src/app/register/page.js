"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, Mail, Lock, ArrowRight, Loader2, AlertCircle, CheckCircle2, UserCircle, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "Buyer",
  });
  const [errors, setErrors] = useState({});
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const validateForm = () => {
    let newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Full name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        router.push("/login?registered=true");
      } else {
        setError(data.error || "Registration failed");
      }
    } catch (error) {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 py-20">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xl"
      >
        <div className="bg-white rounded-[40px] shadow-2xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
          <div className="p-12">
            <div className="text-center mb-10">
              <Link href="/" className="inline-block mb-6">
                <span className="text-3xl font-black tracking-tighter italic text-primary">99acres</span>
                <span className="ml-1 text-[10px] font-bold bg-secondary text-white px-1 rounded">REPLICA</span>
              </Link>
              <h1 className="text-3xl font-black text-gray-900 tracking-tight">Create Account</h1>
              <p className="text-gray-500 font-medium mt-1">Join the community of property seekers and sellers</p>
            </div>

            <form onSubmit={handleSubmit} noValidate className="space-y-8">
              <AnimatePresence>
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-2xl flex items-center gap-3 text-sm font-bold"
                  >
                    <AlertCircle size={18} /> {error}
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Full Name */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                  <div className="relative group">
                    <User className={`absolute left-5 top-1/2 -translate-y-1/2 transition-colors ${errors.name ? 'text-red-400' : 'text-gray-400 group-focus-within:text-primary'}`} size={20} />
                    <input 
                      type="text" 
                      placeholder="e.g. John Doe"
                      className={`w-full pl-14 pr-6 py-4 bg-gray-50 border rounded-2xl focus:outline-none focus:bg-white font-bold text-gray-900 transition-all ${errors.name ? 'border-red-200 focus:border-red-500' : 'border-gray-100 focus:border-primary'}`}
                      value={formData.name}
                      onChange={(e) => {
                        setFormData({ ...formData, name: e.target.value });
                        if (errors.name) setErrors({ ...errors, name: null });
                      }}
                    />
                  </div>
                  {errors.name && <p className="text-[10px] font-bold text-red-500 ml-1 uppercase tracking-wider">{errors.name}</p>}
                </div>

                {/* Email Address */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                  <div className="relative group">
                    <Mail className={`absolute left-5 top-1/2 -translate-y-1/2 transition-colors ${errors.email ? 'text-red-400' : 'text-gray-400 group-focus-within:text-primary'}`} size={20} />
                    <input 
                      type="email" 
                      placeholder="e.g. john@example.com"
                      className={`w-full pl-14 pr-6 py-4 bg-gray-50 border rounded-2xl focus:outline-none focus:bg-white font-bold text-gray-900 transition-all ${errors.email ? 'border-red-200 focus:border-red-500' : 'border-gray-100 focus:border-primary'}`}
                      value={formData.email}
                      onChange={(e) => {
                        setFormData({ ...formData, email: e.target.value });
                        if (errors.email) setErrors({ ...errors, email: null });
                      }}
                    />
                  </div>
                  {errors.email && <p className="text-[10px] font-bold text-red-500 ml-1 uppercase tracking-wider">{errors.email}</p>}
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Password</label>
                  <div className="relative group">
                    <Lock className={`absolute left-5 top-1/2 -translate-y-1/2 transition-colors ${errors.password ? 'text-red-400' : 'text-gray-400 group-focus-within:text-primary'}`} size={20} />
                    <input 
                      type="password" 
                      placeholder="••••••••"
                      className={`w-full pl-14 pr-6 py-4 bg-gray-50 border rounded-2xl focus:outline-none focus:bg-white font-bold text-gray-900 transition-all ${errors.password ? 'border-red-200 focus:border-red-500' : 'border-gray-100 focus:border-primary'}`}
                      value={formData.password}
                      onChange={(e) => {
                        setFormData({ ...formData, password: e.target.value });
                        if (errors.password) setErrors({ ...errors, password: null });
                      }}
                    />
                  </div>
                  {errors.password && <p className="text-[10px] font-bold text-red-500 ml-1 uppercase tracking-wider">{errors.password}</p>}
                </div>

                {/* Account Type */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Account Type</label>
                  <div className="relative group">
                    <UserCircle className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={20} />
                    <select 
                      className="w-full pl-14 pr-12 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:border-primary focus:bg-white font-bold text-gray-900 transition-all appearance-none cursor-pointer"
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    >
                      <option value="Buyer">Buyer</option>
                      <option value="Owner">Owner</option>
                      <option value="Agent">Agent</option>
                      <option value="Builder">Builder</option>
                    </select>
                    <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary pointer-events-none transition-colors" size={18} />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-primary/5 border border-primary/10 rounded-2xl">
                <CheckCircle2 className="text-primary" size={20} />
                <p className="text-[10px] font-black text-primary uppercase tracking-widest leading-relaxed">
                  By clicking "Create Account", you agree to our Terms & Privacy Policy.
                </p>
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full py-5 bg-primary text-white rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
              >
                {isLoading ? <Loader2 className="animate-spin" size={20} /> : "Create Account"}
                {!isLoading && <ArrowRight size={18} />}
              </button>
            </form>

            <div className="relative my-12 text-center">
              <hr className="border-gray-100" />
              <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Already have an account?</span>
            </div>

            <Link 
              href="/login" 
              className="w-full py-4 bg-white border-2 border-primary text-primary rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center hover:bg-primary/5 transition-all"
            >
              Back to Login
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
