"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Search, Briefcase, Zap, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0f0f13] text-white selection:bg-purple-500/30 overflow-hidden font-sans">
      {/* Dynamic Background Elements */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] mix-blend-screen" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[120px] mix-blend-screen" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
      </div>

      <header className="container mx-auto px-6 py-8 flex items-center justify-between z-50 relative">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-2xl font-black tracking-tighter flex items-center gap-2"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-white">AI<span className="text-primary font-bold opacity-90">Matcher</span></span>
        </motion.div>

        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold tracking-wide text-white/70">
          <Link href="#features" className="hover:text-white transition cursor-pointer">How it Works</Link>
          <Link href="#benefits" className="hover:text-white transition cursor-pointer">Benefits</Link>
        </nav>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex gap-4"
        >
          <Link href="/login" className="px-5 py-2.5 rounded-xl font-bold hover:bg-white/10 transition border border-white/5">
            Log In
          </Link>
          <Link href="/signup" className="px-6 py-2.5 bg-white text-black font-black rounded-xl hover:scale-105 active:scale-95 transition shadow-[0_0_30px_-5px_var(--tw-shadow-color)] shadow-white/30 hidden sm:flex">
            Get Started
          </Link>
        </motion.div>
      </header>

      <main className="container mx-auto px-6 pt-32 pb-24 text-center flex flex-col items-center z-10 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-primary text-xs font-bold uppercase tracking-widest mb-8 backdrop-blur-md"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          Next-Gen Career Discovery Intelligence
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-6xl md:text-8xl font-black mb-8 leading-[1.1] tracking-tighter max-w-5xl"
        >
          Stop searching. <br className="hidden md:block" />
          Start <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-400 to-indigo-500">Matching</span>.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-xl md:text-2xl text-white/50 max-w-2xl mb-12 font-medium"
        >
          Upload your resume and let our intelligent algorithm instantly pair you with highly-relevant, high-quality jobs tailored perfectly to your skills.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-5"
        >
          <Link href="/signup" className="flex items-center justify-center gap-2 px-9 py-5 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white text-lg font-black rounded-2xl hover:scale-105 active:scale-95 transition shadow-2xl shadow-primary/25">
            Create Profile <ArrowRight className="w-5 h-5" />
          </Link>
          <Link href="#features" className="flex items-center justify-center px-9 py-5 bg-white/5 border border-white/10 text-lg font-bold rounded-2xl hover:bg-white/10 transition backdrop-blur-sm">
            Explore Features
          </Link>
        </motion.div>
      </main>

      {/* Features Grid */}
      <section id="features" className="container mx-auto px-6 py-24 z-10 relative">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black mb-4">How the <span className="text-primary">Matcher</span> Works</h2>
          <p className="text-white/50 text-lg">A frictionless experience from resume to application.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {(
            [
              {
                icon: <Brain className="w-8 h-8 text-blue-400" />,
                title: "AI Skill Parsing",
                desc: "We analyze your resume using deep learning to understand your true value, looking beyond just keywords.",
                color: "from-blue-500/20 to-transparent",
                border: "border-blue-500/20"
              },
              {
                icon: <Search className="w-8 h-8 text-primary" />,
                title: "Deep Web Scanning",
                desc: "Our engine scans top platforms like LinkedIn daily to hunt down roles that match your exact parameters.",
                color: "from-primary/20 to-transparent",
                border: "border-primary/20"
              },
              {
                icon: <ShieldCheck className="w-8 h-8 text-green-400" />,
                title: "Safe Manual Apply",
                desc: "100% account safety. We find the perfect matches; you click apply. No bot blocks, no CAPTCHAs.",
                color: "from-green-500/20 to-transparent",
                border: "border-green-500/20"
              }
            ] || [] // Added `|| []` to ensure the value is always an array before calling map.
          ).map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`p-8 rounded-3xl bg-gradient-to-b ${feature.color} bg-black/40 border ${feature.border} backdrop-blur-md hover:-translate-y-2 transition-transform duration-300`}
            >
              <div className="w-16 h-16 rounded-2xl bg-black/50 border border-white/10 flex items-center justify-center mb-6 shadow-xl">
                {feature.icon}
              </div>
              <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
              <p className="text-white/60 leading-relaxed font-medium">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-24 mb-20 z-10 relative text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-primary/20 via-purple-500/20 to-primary/20 border border-white/10 p-12 md:p-20 rounded-[3rem] backdrop-blur-xl relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-30 mix-blend-overlay"></div>
          <Zap className="w-16 h-16 text-yellow-400 mx-auto mb-6 drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]" />
          <h2 className="text-4xl md:text-6xl font-black mb-6 relative z-10">Stop wasting time on <br />irrelevant job boards.</h2>
          <Link href="/signup" className="inline-flex items-center gap-2 px-10 py-5 bg-white text-black text-xl font-black rounded-2xl hover:scale-105 active:scale-95 transition shadow-[0_0_40px_-10px_rgba(255,255,255,0.5)] relative z-10 mt-4">
            Get Matched Now
          </Link>
        </motion.div>
      </section>
    </div>
  );
}