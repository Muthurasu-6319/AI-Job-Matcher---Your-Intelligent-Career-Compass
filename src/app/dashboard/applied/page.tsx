"use client";
import React, { useEffect, useState } from 'react';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { CheckCircle2, Briefcase, MapPin, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AppliedJobsPage() {
    const [jobs, setJobs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const q = query(
                    collection(db, "users", user.uid, "appliedJobs"),
                    where("status", "==", "Applied") // Ensure it matches what we saved
                );
                const querySnapshot = await getDocs(q);
                const fetched = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setJobs(fetched);
                setLoading(false);
            }
        });
        return () => unsub();
    }, []);

    if (loading) return <div className="flex justify-center p-20"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>;

    return (
        <div className="max-w-5xl mx-auto">
            <h1 className="text-3xl font-black mb-8 flex items-center gap-3"><CheckCircle2 className="text-green-400 w-8 h-8" /> Sent Applications</h1>
            {jobs.length === 0 ? (
                <div className="text-center p-12 glass rounded-3xl border border-white/5 opacity-75">
                    <p className="text-xl font-bold">No applications sent yet.</p>
                    <p className="text-muted-foreground mt-2">Go to Live Jobs Feed to initiate auto-apply!</p>
                </div>
            ) : (
                <div className="grid gap-6">
                    {jobs.map((job, idx) => (
                        <motion.div key={job.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.1 }} className="bg-black/40 p-6 rounded-2xl border border-green-500/20 hover:border-green-500/40 transition-all flex justify-between items-center group relative overflow-hidden">
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-green-500 opacity-50 group-hover:opacity-100 transition-opacity" />
                            <div>
                                <h3 className="text-xl font-bold mb-2">{job.title}</h3>
                                <div className="flex gap-4 text-sm text-muted-foreground font-semibold">
                                    <span className="flex items-center gap-1 text-primary"><Briefcase className="w-4 h-4" /> {job.company}</span>
                                    <span className="flex items-center gap-1 text-purple-400"><MapPin className="w-4 h-4" /> {job.location}</span>
                                </div>
                            </div>
                            <div className="bg-green-500/10 text-green-400 font-bold px-4 py-2 rounded-xl flex items-center gap-2 border border-green-500/20 text-sm">
                                <CheckCircle2 className="w-4 h-4" /> Sent
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
