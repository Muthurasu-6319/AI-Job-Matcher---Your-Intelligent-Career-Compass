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
        { name: "Live Jobs Feed", path: "/dashboard", icon: <Briefcase /> },
        { name: "Applied Jobs", path: "/dashboard/applied", icon: <CheckCircle2 /> },
        { name: "Selected/Interviews", path: "/dashboard/selected", icon: <Star className="text-yellow-400 fill-yellow-400/20" /> },
        { name: "Rejected Jobs", path: "/dashboard/rejected", icon: <XCircle className="text-red-400" /> },
    ];

    return (
        <div className="flex bg-background min-h-screen text-foreground font-sans">
            {/* Sidebar */}
            <aside className="w-72 border-r border-white/5 bg-black/40 glass hidden lg:flex flex-col z-50">
                <div className="p-6 border-b border-white/5 flex items-center gap-3">
                    <div className="p-2 bg-primary/20 rounded-xl"><Sparkles className="text-primary w-6 h-6" /></div>
                    <div className="font-black text-xl tracking-tight">AI<span className="text-primary">JobBot</span></div>
                </div>
                <div className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
                    {navs.map(nav => {
                        const active = pathname === nav.path;
                        return (
                            <a key={nav.path} href={nav.path} className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold transition-all ${active ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-muted-foreground hover:bg-white/5 hover:text-white'}`}>
                                {nav.icon}
                                {nav.name}
                            </a>
                        )
                    })}
                </div>
                <div className="p-6 border-t border-white/5">
                    <button onClick={handleLogout} className="flex items-center gap-3 text-red-400 hover:text-red-300 font-bold transition">
                        <LogOut className="w-5 h-5" /> Terminate Session
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                {/* Top Header */}
                <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 bg-background/50 backdrop-blur-md z-40 fixed lg:relative w-full lg:w-auto">
                    <h2 className="text-xl font-bold hidden md:block capitalize tracking-tight">
                        {pathname.split('/').pop() === 'dashboard' ? 'Agent Feed' : pathname.split('/').pop() || 'Dashboard'}
                    </h2>
                    <div className="flex items-center gap-4 ml-auto">
                        <span className="text-sm font-semibold text-muted-foreground mr-2">Agent: {userData?.name?.split(' ')[0]}</span>
                        <a href="/dashboard/profile" className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/20 border border-primary/40 text-primary font-bold hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/10">
                            <User className="w-5 h-5" />
                        </a>
                    </div>
                </header>

                {/* Scrollable Children */}
                <main className="flex-1 overflow-y-auto bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-background to-background p-6 md:p-12 pb-32">
                    {React.Children.map(children, child => {
                        if (React.isValidElement(child)) {
                            // Pass userData down implicitly or let them fetch. Best is Context, but we can also use custom hooks.
                            // For simplicity, we'll let pages fetch user or rely on auth state.
                        }
                        return child;
                    })}
                </main>
            </div>
        </div>
    );
}
