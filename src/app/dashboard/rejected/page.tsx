"use client";
import React, { useEffect, useState } from 'react';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { XCircle, Briefcase, MapPin, Loader2, FileX } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function RejectedJobsPage() {
    const [jobs, setJobs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedId, setSelectedId] = useState<string | null>(null);

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const q = query(collection(db, "users", user.uid, "appliedJobs"), where("status", "==", "Rejected"));
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
            <h1 className="text-3xl font-black mb-8 flex items-center gap-3"><XCircle className="text-red-400 w-8 h-8" /> Rejected Applications</h1>
            {jobs.length === 0 ? (
                <div className="text-center p-12 glass rounded-3xl border border-white/5 opacity-75">
                    <p className="text-xl font-bold">No rejections found.</p>
                    <p className="text-muted-foreground mt-2">Looks like your AI agent is doing a great job finding matches!</p>
                </div>
            ) : (
                <div className="grid gap-6">
                    {jobs.map((job, idx) => (
                        <motion.div key={job.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.1 }} className="bg-black/40 p-6 rounded-2xl border border-red-500/20 hover:border-red-500/40 transition-all group relative overflow-hidden">
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500 opacity-50 transition-opacity" />
                            <div className="flex justify-between items-center mb-4">
                                <div>
                                    <h3 className="text-xl font-bold mb-2">{job.title}</h3>
                                    <div className="flex gap-4 text-sm text-muted-foreground font-semibold">
                                        <span className="flex items-center gap-1 text-primary"><Briefcase className="w-4 h-4" /> {job.company}</span>
                                        <span className="flex items-center gap-1 text-purple-400"><MapPin className="w-4 h-4" /> {job.location}</span>
                                    </div>
                                </div>
                                <button onClick={() => setSelectedId(selectedId === job.id ? null : job.id)} className="bg-red-500/10 hover:bg-red-500/20 text-red-400 font-bold px-4 py-2 rounded-xl flex items-center gap-2 border border-red-500/20 text-sm transition transition-all active:scale-95">
                                    <FileX className="w-4 h-4" /> {selectedId === job.id ? 'Close Reason' : 'View Reason'}
                                </button>
                            </div>
                            <AnimatePresence>
                                {selectedId === job.id && (
                                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="pt-4 border-t border-white/10 mt-4 overflow-hidden">
                                        <h4 className="font-bold text-red-300 mb-2">Automated ATS Rejection Insight:</h4>
                                        <div className="bg-white/5 p-4 rounded-xl border border-white/5 text-sm leading-relaxed text-muted-foreground">
                                            {job.rejectionReason || `Your profile was flagged lacking specific enterprise architecture experience tailored exactly for ${job.company}'s custom stack. We recommend adding related keywords to your 'Professional Genome' in settings if you wish to target this role in the future.`}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
