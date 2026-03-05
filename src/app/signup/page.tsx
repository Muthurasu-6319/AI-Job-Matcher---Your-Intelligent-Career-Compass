"use client";
import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, User, Calendar, MapPin, Globe, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/lib/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

export default function SignupPage() {
    const router = useRouter();
    const [form, setForm] = useState({
        name: '', dob: '', email: '', password: '', confirm: '', city: '', state: '', country: 'India'
    });
    const [showPass, setShowPass] = useState(false);
    const [showConf, setShowConf] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e: any) => setForm({ ...form, [e.target.name]: e.target.value });

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (form.password !== form.confirm) return setError("Passwords don't match");
        setLoading(true);
        setError('');
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, form.email, form.password);
            await setDoc(doc(db, "users", userCredential.user.uid), {
                name: form.name,
                dob: form.dob,
                email: form.email,
                city: form.city,
                state: form.state,
                country: form.country,
                role: '',
                skills: [],
                experience: [],
                education: [],
                projects: [],
                preferences: null,
                createdAt: new Date().toISOString()
            });
            // Send Welcome Email
            try {
                await fetch('/api/welcome-email', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email: form.email, name: form.name }),
                });
            } catch (emailError) {
                console.error("Failed to send welcome email:", emailError);
            }

            router.push('/login');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };



    return (
        <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-6 relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="w-full max-w-xl glass p-8 rounded-3xl border border-white/5 shadow-2xl relative z-10">
                <h1 className="text-3xl font-black text-center mb-8">Create Matcher Profile ✨</h1>
                {error && <div className="p-3 mb-6 bg-red-500/10 text-red-400 font-bold border border-red-500/20 text-center rounded-xl">{error}</div>}
                <form onSubmit={onSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <input name="name" onChange={handleChange} placeholder="Full Name" required className="w-full bg-black/40 border border-white/10 rounded-xl pl-11 pr-4 py-3 outline-none focus:border-primary/50 text-sm" />
                        </div>
                        <div className="relative">
                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <input type="date" name="dob" onChange={handleChange} required className="w-full bg-black/40 border border-white/10 rounded-xl pl-10 pr-4 py-3 outline-none focus:border-primary/50 text-sm text-muted-foreground" />
                        </div>
                    </div>
                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <input type="email" name="email" onChange={handleChange} placeholder="Email" required className="w-full bg-black/40 border border-white/10 rounded-xl pl-11 pr-4 py-3 outline-none focus:border-primary/50 text-sm" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <input type={showPass ? "text" : "password"} name="password" onChange={handleChange} placeholder="Password" required className="w-full bg-black/40 border border-white/10 rounded-xl pl-11 pr-10 py-3 outline-none focus:border-primary/50 text-sm" />
                            <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white transition">
                                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <input type={showConf ? "text" : "password"} name="confirm" onChange={handleChange} placeholder="Confirm" required className="w-full bg-black/40 border border-white/10 rounded-xl pl-11 pr-10 py-3 outline-none focus:border-primary/50 text-sm" />
                            <button type="button" onClick={() => setShowConf(!showConf)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white transition">
                                {showConf ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                        <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <input name="city" onChange={handleChange} placeholder="City" required className="w-full bg-black/40 border border-white/10 rounded-xl pl-9 pr-3 py-3 outline-none focus:border-primary/50 text-sm" />
                        </div>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <input name="state" onChange={handleChange} placeholder="State" required className="w-full bg-black/40 border border-white/10 rounded-xl pl-9 pr-3 py-3 outline-none focus:border-primary/50 text-sm" />
                        </div>
                        <div className="relative">
                            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <input name="country" value={form.country} readOnly className="w-full bg-black/40 border border-white/10 rounded-xl pl-9 pr-3 py-3 outline-none focus:border-primary/50 text-sm text-foreground/50 cursor-not-allowed" />
                        </div>
                    </div>
                    <button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl flex items-center justify-center transition disabled:opacity-50 mt-6 shadow-xl shadow-primary/20">
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign Up & Access Matcher"}
                    </button>
                </form>
                <p className="text-center mt-6 text-sm text-muted-foreground">Already have a profile? <a href="/login" className="text-primary font-bold hover:underline">Log In</a></p>
            </div>
        </div>
    );
}
