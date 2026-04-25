"use client";

import { useState, useEffect, Suspense } from "react";
import { useSession, signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, ArrowRight, Globe, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function LoginForm() {
  const { data: session, status } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const isRegistered = searchParams.get("registered");
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  useEffect(() => {
    if (status === "authenticated") {
      router.replace(callbackUrl);
    }
  }, [status, router, callbackUrl]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res.error) {
        setError("Invalid email or password");
        setIsLoading(false);
        return;
      }

      router.replace(callbackUrl);
    } catch (error) {
      setError("An unexpected error occurred");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-[40px] shadow-2xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
          <div className="p-10">
            <div className="text-center mb-10">
              <Link href="/" className="inline-block mb-6">
                <span className="text-3xl font-black tracking-tighter italic text-primary">99acres</span>
                <span className="ml-1 text-[10px] font-bold bg-secondary text-white px-1 rounded">REPLICA</span>
              </Link>
              <h1 className="text-2xl font-black text-gray-900 tracking-tight">Welcome Back</h1>
              <p className="text-gray-500 font-medium mt-1">Sign in to manage your real estate journey</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <AnimatePresence>
                {isRegistered && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="bg-green-50 border border-green-100 text-green-600 px-4 py-3 rounded-2xl flex items-center gap-3 text-sm font-bold mb-4"
                  >
                    <CheckCircle2 size={18} /> Account created! Please login.
                  </motion.div>
                )}
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

              <div className="space-y-4">
                <div className="relative group">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={20} />
                  <input 
                    type="email" 
                    placeholder="Email Address" 
                    required
                    className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:border-primary focus:bg-white font-bold text-gray-900 transition-all"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="relative group">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={20} />
                  <input 
                    type="password" 
                    placeholder="Password" 
                    required
                    className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:border-primary focus:bg-white font-bold text-gray-900 transition-all"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button type="button" className="text-xs font-black text-primary uppercase tracking-widest hover:underline">
                  Forgot Password?
                </button>
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full py-4 bg-primary text-white rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
              >
                {isLoading ? <Loader2 className="animate-spin" size={20} /> : "Sign In"}
                {!isLoading && <ArrowRight size={18} />}
              </button>
            </form>

            <div className="relative my-10 text-center">
              <hr className="border-gray-100" />
              <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">or continue with</span>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <button 
                onClick={() => signIn('google')}
                className="flex items-center justify-center gap-3 py-3 border border-gray-100 rounded-2xl hover:bg-gray-50 transition-all group"
              >
                <Globe size={20} className="text-gray-400 group-hover:text-primary transition-colors" />
                <span className="text-xs font-black text-gray-600 uppercase tracking-widest">Continue with Google</span>
              </button>
            </div>
          </div>
          <div className="bg-gray-50 p-8 text-center border-t border-gray-100">
            <p className="text-sm font-medium text-gray-500">
              Don't have an account?{" "}
              <Link href="/register" className="text-primary font-black uppercase tracking-widest hover:underline">
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
