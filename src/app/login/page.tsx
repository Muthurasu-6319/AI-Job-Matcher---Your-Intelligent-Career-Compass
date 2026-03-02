"use client";
import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

export default function LoginPage() {
    const router = useRouter();
    const [form, setForm] = useState({ email: '', password: '' });
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e: any) => setForm({ ...form, [e.target.name]: e.target.value });

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await signInWithEmailAndPassword(auth, form.email, form.password);
            router.push('/dashboard');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };



    return (
        <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-6 relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm h-[400px] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="w-full max-w-md glass p-10 rounded-3xl border border-white/5 shadow-2xl relative z-10">
                <h1 className="text-3xl font-black text-center mb-8">Access Job Matcher 🎯</h1>
                {error && <div className="p-3 mb-6 bg-red-500/10 text-red-400 font-bold border border-red-500/20 text-center rounded-xl">{error}</div>}
                <form onSubmit={onSubmit} className="space-y-4">
                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <input type="email" name="email" onChange={handleChange} placeholder="Email Address" required className="w-full bg-black/40 border border-white/10 rounded-xl pl-12 pr-4 py-4 outline-none focus:border-primary/50 text-sm" />
                    </div>
                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <input type={showPass ? "text" : "password"} name="password" onChange={handleChange} placeholder="Password" required className="w-full bg-black/40 border border-white/10 rounded-xl pl-12 pr-10 py-4 outline-none focus:border-primary/50 text-sm" />
                        <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white transition">
                            {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                    </div>
                    <button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl flex items-center justify-center transition disabled:opacity-50 mt-6 shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95">
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Launch Dashboard"}
                    </button>
                </form>
                <p className="text-center mt-6 text-sm text-muted-foreground">No profile yet? <a href="/signup" className="text-primary font-bold hover:underline">Sign up for free</a></p>
            </div>
        </div>
    );
}
