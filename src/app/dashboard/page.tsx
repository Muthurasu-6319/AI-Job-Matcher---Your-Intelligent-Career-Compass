"use client";
import React, { useEffect, useState } from 'react';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, collection, addDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Zap, Briefcase, MapPin, Check, RefreshCcw, ChevronLeft, ChevronRight, X, ExternalLink, CalendarDays, Award, Bell } from 'lucide-react';

export default function DashboardJobsPage() {
    const [profile, setProfile] = useState<any>(null);
    const [uid, setUid] = useState<string | null>(null);
    const [jobs, setJobs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [currentPage, setCurrentPage] = useState(1);
    const jobsPerPage = 5;

    // Full Details Modal
    const [selectedJob, setSelectedJob] = useState<any>(null);
    const [jobDetailsLoading, setJobDetailsLoading] = useState(false);
    const [liveDetails, setLiveDetails] = useState<any>(null);

    // Filters
    const [filterRole, setFilterRole] = useState('');
    const [filterLocation, setFilterLocation] = useState('');
    const [filterSalary, setFilterSalary] = useState('');

    // Alerts
    const [alertFrequency, setAlertFrequency] = useState<string | null>(null);
    const [alertLoading, setAlertLoading] = useState(false);

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setUid(user.uid);
                const docRef = doc(db, "users", user.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setProfile(data);

                    // Initialize filters from profile if available
                    const initialRole = data.role || '';
                    const initialLocation = data.preferences?.location || '';
                    const initialSalary = data.preferences?.minSalary || '';

                    setFilterRole(initialRole);
                    setFilterLocation(initialLocation);
                    setFilterSalary(initialSalary);
                    setAlertFrequency(data.preferences?.jobAlertFrequency || null);

                    if (initialRole && initialLocation) {
                        fetchJobs(data, initialRole, initialLocation, initialSalary);
                    } else {
                        setLoading(false);
                        setError("Please configure your Target Role and Location in the Profile section or use the filters here.");
                    }
                }
            }
        });
        return () => unsub();
    }, []);

    const fetchJobs = async (userData: any, role: string, location: string, minSalary: string) => {
        if (!role || !location) {
            setError("Role and Location are required to search jobs.");
            return;
        }
        try {
            setLoading(true);
            setError(null);
            const res = await fetch('/api/search-jobs', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    preferences: { title: role, location: location, minSalary: minSalary },
                    resumeData: userData
                })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            setJobs(data.jobs || []);
            setCurrentPage(1); // Reset page on new fetch
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        fetchJobs(profile, filterRole, filterLocation, filterSalary);
    };

    const updateAlertFrequency = async (freq: string) => {
        if (!uid || !profile) return;
        setAlertLoading(true);
        try {
            const updatedProfile = {
                ...profile,
                preferences: { ...(profile.preferences || {}), jobAlertFrequency: freq }
            };
            await updateDoc(doc(db, "users", uid), updatedProfile);
            setProfile(updatedProfile);
            setAlertFrequency(freq);
        } catch (err) {
            console.error("Failed to update alert frequency", err);
        } finally {
            setAlertLoading(false);
        }
    };

    const fetchLiveDetails = async (job: any) => {
        setSelectedJob(job);
        setJobDetailsLoading(true);
        setLiveDetails(null);
        try {
            const res = await fetch('/api/job-details', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ link: job.applyLink })
            });
            const data = await res.json();
            setLiveDetails(data);
        } catch (e) {
            console.error(e);
        } finally {
            setJobDetailsLoading(false);
        }
    };
    // Removed Auto Apply logic here

    if (loading) return <div className="flex flex-col items-center justify-center p-20"><Loader2 className="w-12 h-12 text-primary animate-spin mb-4" /><p className="font-bold text-muted-foreground">AI is scanning the web for the best jobs matching your profile...</p></div>;

    return (
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
            {/* Left Filter Sidebar */}
            <div className="w-full lg:w-80 flex-shrink-0 space-y-6">
                <div className="bg-black/40 border border-white/5 p-6 rounded-3xl backdrop-blur-md glass shadow-xl sticky top-24">
                    <h3 className="text-xl font-bold mb-6 text-white flex items-center gap-2"><Briefcase className="w-5 h-5 text-primary" /> Filter Jobs</h3>

                    <div className="space-y-4">
                        <div>
                            <label className="text-xs font-bold uppercase text-muted-foreground mb-1 block">Job Role</label>
                            <input
                                value={filterRole}
                                onChange={(e) => setFilterRole(e.target.value)}
                                placeholder="e.g. Frontend Developer"
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary/50 text-sm font-semibold transition"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold uppercase text-muted-foreground mb-1 block">Location</label>
                            <input
                                value={filterLocation}
                                onChange={(e) => setFilterLocation(e.target.value)}
                                placeholder="e.g. Remote, Bangalore"
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary/50 text-sm font-semibold transition"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold uppercase text-muted-foreground mb-1 block">Min Salary</label>
                            <input
                                value={filterSalary}
                                onChange={(e) => setFilterSalary(e.target.value)}
                                placeholder="e.g. 15LPA, $100k"
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary/50 text-sm font-semibold transition"
                            />
                        </div>

                        <button
                            onClick={handleSearch}
                            disabled={loading || !filterRole || !filterLocation}
                            className="w-full mt-4 bg-primary hover:bg-primary/90 text-white font-bold py-3 px-4 rounded-xl transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <RefreshCcw className="w-5 h-5" />} Search Jobs
                        </button>
                    </div>
                </div>

                <div className="bg-black/40 border border-white/5 p-6 rounded-3xl backdrop-blur-md glass shadow-xl sticky top-[28rem]">
                    <h3 className="text-xl font-bold mb-4 text-white flex items-center gap-2"><Bell className="w-5 h-5 text-yellow-400" /> Job Alerts</h3>
                    <p className="text-xs text-muted-foreground mb-4 font-semibold uppercase">Get notified of new matches</p>

                    <div className="flex flex-col gap-3">
                        {['Daily', 'Weekly', 'Monthly'].map((freq) => (
                            <button
                                key={freq}
                                onClick={() => updateAlertFrequency(freq)}
                                disabled={alertLoading}
                                className={`flex items-center justify-between p-3 rounded-xl border transition-all ${alertFrequency === freq ? 'bg-primary/20 border-primary text-white shadow-[0_0_15px_rgba(79,70,229,0.3)]' : 'bg-black/40 border-white/10 text-muted-foreground hover:bg-white/5'}`}
                            >
                                <span className="font-bold text-sm">{freq} Alerts</span>
                                {alertFrequency === freq && <Check className="w-4 h-4 text-primary" />}
                            </button>
                        ))}
                    </div>
                    {alertFrequency && (
                        <p className="text-xs text-green-400 mt-4 text-center font-bold">✓ Automated for {alertFrequency}</p>
                    )}
                </div>
            </div>

            {/* Right Jobs Feed */}
            <div className="flex-1 min-w-0">
                {error && (
                    <div className="bg-white/5 border border-white/10 p-8 rounded-3xl text-center glass mb-8">
                        <h2 className="text-2xl font-bold text-red-400 mb-2">Setup Needed</h2>
                        <p className="text-muted-foreground">{error}</p>
                    </div>
                )}

                {jobs.length > 0 && !error && (
                    <>
                        <div className="flex flex-col md:flex-row justify-between items-center bg-black/40 p-6 rounded-3xl border border-white/5 mb-8 backdrop-blur-md shadow-2xl glass">
                            <div>
                                <h2 className="text-2xl font-bold text-white mb-1">Your AI Job Matches</h2>
                                <p className="text-sm text-primary/80 font-medium">We found {jobs.length} highly relevant roles.</p>
                            </div>
                        </div>

                        <div className="grid gap-6">
                            {jobs.slice((currentPage - 1) * jobsPerPage, currentPage * jobsPerPage).map((job, idx) => (
                                <motion.div key={job.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} className="bg-black/30 p-6 rounded-2xl border border-white/5 hover:border-primary/30 transition-all flex flex-col md:flex-row gap-6 group">
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="text-2xl font-bold">{job.title}</h3>
                                            {job.isMatch && <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs font-bold uppercase rounded-full border border-green-500/30">{job.matchScore}% Match</span>}
                                        </div>
                                        <div className="flex flex-wrap gap-4 text-sm font-medium text-muted-foreground mb-4">
                                            <span className="flex items-center gap-1.5"><Briefcase className="w-4 h-4 text-primary" /> {job.company}</span>
                                            <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-purple-400" /> {job.location}</span>
                                            <span className="text-xs ml-auto">Uploaded: {new Date(job.postedAt).toLocaleString()}</span>
                                        </div>
                                        <div className="bg-white/5 p-4 rounded-xl text-sm leading-relaxed border border-white/5 border-l-2 border-l-primary">
                                            <strong className="text-white">AI Reason:</strong> {job.matchReasoning}
                                        </div>
                                    </div>
                                    <div className="flex flex-col justify-center gap-3 min-w-[200px]">
                                        <button onClick={() => fetchLiveDetails(job)} className="w-full text-center px-4 py-3 rounded-xl border border-white/10 hover:bg-white/10 font-bold text-sm transition text-white">View Live Details</button>
                                        <a href={job.applyLink} target="_blank" rel="noopener noreferrer" className="w-full text-center px-4 py-3 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95">
                                            Manual Apply <ExternalLink className="w-4 h-4" />
                                        </a>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Pagination Controls */}
                        {jobs.length > jobsPerPage && (
                            <div className="flex justify-center items-center gap-4 mt-8">
                                <button
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    className="p-3 rounded-xl glass hover:bg-white/10 disabled:opacity-50 transition"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                                <div className="font-bold flex gap-2">
                                    {Array.from({ length: Math.ceil(jobs.length / jobsPerPage) }).map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setCurrentPage(i + 1)}
                                            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${currentPage === i + 1 ? 'bg-primary text-white shadow-lg' : 'hover:bg-white/10'}`}
                                        >
                                            {i + 1}
                                        </button>
                                    ))}
                                </div>
                                <button
                                    onClick={() => setCurrentPage(p => Math.min(Math.ceil(jobs.length / jobsPerPage), p + 1))}
                                    disabled={currentPage === Math.ceil(jobs.length / jobsPerPage)}
                                    className="p-3 rounded-xl glass hover:bg-white/10 disabled:opacity-50 transition"
                                >
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        )}
                    </>
                )}

                {/* Live Details Modal */}
                <AnimatePresence>
                    {selectedJob && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                className="bg-[#0f0f13] border border-white/10 w-full max-w-4xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col relative"
                            >
                                {/* Modal Header */}
                                <div className="p-6 border-b border-white/10 flex justify-between items-start bg-black/20">
                                    <div>
                                        <h2 className="text-2xl font-black mb-1 pr-12">{selectedJob.title}</h2>
                                        <div className="flex gap-4 text-sm font-semibold text-muted-foreground">
                                            <span className="flex items-center gap-1 text-primary"><Briefcase className="w-4 h-4" /> {selectedJob.company}</span>
                                            <span className="flex items-center gap-1 text-purple-400"><MapPin className="w-4 h-4" /> {selectedJob.location}</span>
                                        </div>
                                    </div>
                                    <button onClick={() => setSelectedJob(null)} className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/10 transition">
                                        <X className="w-6 h-6 text-muted-foreground" />
                                    </button>
                                </div>

                                {/* Modal Body */}
                                <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8">
                                    {jobDetailsLoading ? (
                                        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                                            <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
                                            <p className="font-bold">AI is scraping LinkedIn for the full job description...</p>
                                        </div>
                                    ) : liveDetails ? (
                                        <div className="animate-in fade-in zoom-in duration-500 space-y-8">
                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                                <div className="bg-white/5 border border-white/5 p-4 rounded-2xl flex flex-col gap-1">
                                                    <span className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-1"><Award className="w-3 h-3" /> Seniority</span>
                                                    <span className="font-semibold text-white">{liveDetails.seniority || 'Not Specified'}</span>
                                                </div>
                                                <div className="bg-white/5 border border-white/5 p-4 rounded-2xl flex flex-col gap-1">
                                                    <span className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-1"><CalendarDays className="w-3 h-3" /> Employment Type</span>
                                                    <span className="font-semibold text-white">{liveDetails.employmentType || 'Not Specified'}</span>
                                                </div>
                                                <div className="bg-green-500/10 border border-green-500/20 p-4 rounded-2xl flex flex-col gap-1 md:col-span-1 col-span-2">
                                                    <span className="text-xs font-bold uppercase text-green-500 flex items-center gap-1"><Zap className="w-3 h-3" /> AI Match Index</span>
                                                    <span className="font-black text-green-400 text-lg">{selectedJob.matchScore}% - {selectedJob.isMatch ? 'Highly Recommended' : 'Average'}</span>
                                                </div>
                                            </div>

                                            <div>
                                                <h3 className="text-lg font-bold mb-4 flex items-center gap-2 border-b border-white/10 pb-2">Full Job Description</h3>
                                                <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap font-medium">
                                                    {liveDetails.fullDescription || "Detailed description could not be scraped. Check Original Link."}
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="py-20 text-center text-red-400 font-bold border border-red-500/20 bg-red-500/10 rounded-2xl">
                                            Failed to scrape dynamic data.
                                        </div>
                                    )}
                                </div>

                                {/* Modal Footer */}
                                <div className="p-6 border-t border-white/10 bg-black/40 flex justify-end gap-4 mt-auto">
                                    <button onClick={() => setSelectedJob(null)} className="px-6 py-3 rounded-xl font-bold text-muted-foreground hover:text-white hover:bg-white/5 transition">
                                        Close Menu
                                    </button>
                                    <a href={selectedJob.applyLink} target="_blank" rel="noopener noreferrer" className="px-8 py-3 rounded-xl font-bold bg-primary text-white hover:scale-105 active:scale-95 transition flex items-center gap-2 shadow-lg shadow-primary/20">
                                        Apply Manually <ExternalLink className="w-4 h-4" />
                                    </a>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
