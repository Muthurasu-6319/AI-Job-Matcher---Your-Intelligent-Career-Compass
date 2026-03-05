"use client";
import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { Briefcase, CheckCircle2, XCircle, Star, User, LogOut, Loader2, Sparkles } from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState<any>(null);

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const docRef = doc(db, "users", user.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setUserData({ ...docSnap.data(), uid: user.uid });
                }
                setLoading(false);
            } else {
                router.push('/login');
            }
        });
        return () => unsub();
    }, [router]);

    const handleLogout = async () => {
        await signOut(auth);
        router.push('/');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center">
                <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
                <p className="font-bold text-muted-foreground animate-pulse">Initializing Agent Environment...</p>
            </div>
        );
    }

    const navs = [
        { name: "Feed", path: "/dashboard", icon: <Briefcase className="w-4 h-4" /> },
        { name: "Applied", path: "/dashboard/applied", icon: <CheckCircle2 className="w-4 h-4" /> },
        { name: "Selected", path: "/dashboard/selected", icon: <Star className="w-4 h-4 text-yellow-400 fill-yellow-400/20" /> },
        { name: "Rejected", path: "/dashboard/rejected", icon: <XCircle className="w-4 h-4 text-red-400" /> },
    ];

    return (
        <div className="flex flex-col bg-background min-h-screen text-foreground font-sans">
            {/* Top Header with Navigation */}
            <header className="h-16 md:h-20 border-b border-white/5 flex items-center justify-between px-4 md:px-8 bg-black/40 backdrop-blur-md z-40 sticky top-0 w-full shadow-lg glass">
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/20 rounded-xl"><Sparkles className="text-primary w-5 h-5" /></div>
                        <div className="font-black text-xl tracking-tight hidden sm:block">AI<span className="text-primary">JobBot</span></div>
                    </div>
                    {/* Header Navs */}
                    <nav className="hidden md:flex items-center gap-2 lg:gap-4 ml-4">
                        {navs.map(nav => {
                            const active = pathname === nav.path;
                            return (
                                <a key={nav.path} href={nav.path} className={`flex items-center gap-2 px-3 lg:px-4 py-2 rounded-xl font-bold transition-all text-sm ${active ? 'bg-primary text-white shadow-md shadow-primary/20' : 'text-muted-foreground hover:bg-white/5 hover:text-white'}`}>
                                    {nav.icon}
                                    {nav.name}
                                </a>
                            )
                        })}
                    </nav>
                </div>

                <div className="flex items-center gap-4 ml-auto">
                    <button onClick={handleLogout} className="hidden md:flex items-center gap-2 text-red-400 hover:bg-red-500/10 px-3 py-2 rounded-xl font-bold transition text-sm">
                        <LogOut className="w-4 h-4" /> Exit
                    </button>
                    <span className="text-sm font-semibold text-muted-foreground hidden lg:block">Agent: {userData?.name?.split(' ')[0]}</span>
                    <a href="/dashboard/profile" className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary/20 border border-primary/40 text-primary font-bold hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/10">
                        <User className="w-5 h-5" />
                    </a>
                </div>
            </header>

            {/* Mobile Nav Header Extension if needed, or simply keep it simple for now */}
            <div className="md:hidden flex overflow-x-auto p-2 border-b border-white/5 bg-black/20 gap-2 scrollbar-none">
                 {navs.map(nav => {
                    const active = pathname === nav.path;
                    return (
                        <a key={nav.path} href={nav.path} className={`flex whitespace-nowrap items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all text-sm ${active ? 'bg-primary text-white shadow-md shadow-primary/20' : 'text-muted-foreground hover:bg-white/5 hover:text-white'}`}>
                            {nav.icon}
                            {nav.name}
                        </a>
                    )
                })}
            </div>

            {/* Scrollable Children */}
            <main className="flex-1 overflow-y-auto bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-background to-background p-4 md:p-8">
                {children}
            </main>
        </div>
    );
}
