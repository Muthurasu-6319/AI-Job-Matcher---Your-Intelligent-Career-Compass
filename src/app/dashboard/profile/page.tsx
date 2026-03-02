"use client";
import React, { useEffect, useState } from 'react';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { ResumeUpload } from '@/components/ResumeUpload';
import { Loader2, Save, MapPin, Briefcase, Code, GraduationCap, CheckCircle2, User, Globe, Pencil, Building, Calendar, Mail } from 'lucide-react';

export default function ProfilePage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uid, setUid] = useState<string | null>(null);
    const [profile, setProfile] = useState<any>({});
    const [successMsg, setSuccessMsg] = useState('');

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setUid(user.uid);
                const docRef = doc(db, "users", user.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setProfile(docSnap.data());
                }
                setLoading(false);
            }
        });
        return () => unsub();
    }, []);

    const handleChange = (e: any) => setProfile({ ...profile, [e.target.name]: e.target.value });
    const handlePrefsChange = (e: any) => {
        setProfile({
            ...profile,
            preferences: {
                ...(profile.preferences || {}),
                [e.target.name]: e.target.value
            }
        });
    };

    const handleUploadSuccess = async (data: any, fileName: string) => {
        if (!uid) return;
        setSaving(true);
        const aiData = data.structured;
        const updatedProfile = {
            ...profile,
            skills: aiData.skills || profile.skills || [],
            experience: aiData.experience || profile.experience || [],
            education: aiData.education || profile.education || [],
            projects: aiData.projects || profile.projects || [],
            role: profile.role || aiData.summary?.substring(0, 50) || '',
            summary: profile.summary || aiData.summary || '',
            resumeFileName: fileName
        };

        try {
            await updateDoc(doc(db, "users", uid), updatedProfile);
            setProfile(updatedProfile);
            setSuccessMsg("Resume parsed & Saved LIVE automatically! ✓");
        } catch (e) {
            console.error(e);
        } finally {
            setSaving(false);
            setTimeout(() => setSuccessMsg(''), 5000);
        }
    };

    const onSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!uid) return;
        setSaving(true);
        setSuccessMsg('');
        try {
            await updateDoc(doc(db, "users", uid), profile);
            setSuccessMsg("Profile and Preferences Saved Successfully! ✓");
        } catch (err) {
            console.error(err);
        } finally {
            setSaving(false);
            setTimeout(() => setSuccessMsg(''), 5000);
        }
    };

    if (loading) return <div className="flex justify-center p-20"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>;

    return (
        <div className="max-w-5xl mx-auto pb-12">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-black">Agent Profile</h1>
                <div className="flex gap-4 items-center">
                    {successMsg && <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-green-500/20 text-green-400 font-bold px-4 py-2 rounded-xl border border-green-500/30 flex items-center gap-2"><CheckCircle2 className="w-5 h-5" /> {successMsg}</motion.div>}
                    <button onClick={onSave} disabled={saving} className="bg-primary hover:bg-primary/90 text-white font-bold px-6 py-3 rounded-xl shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition flex items-center gap-2 disabled:opacity-50">
                        {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />} Save Changes
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                {/* Left/Main Column: LinkedIn Style Profile */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Top Intro Card */}
                    <div className="glass rounded-3xl border border-white/5 overflow-hidden shadow-2xl relative">
                        {/* Banner */}
                        <div className="h-32 bg-gradient-to-r from-blue-900/50 to-purple-900/50 w-full relative group">
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-all"></div>
                        </div>
                        <div className="p-6 md:p-8 pt-0 relative">
                            {/* Profile Pic Placeholder */}
                            <div className="w-32 h-32 rounded-full border-4 border-[#0f0f13] bg-black/80 flex items-center justify-center -mt-16 mb-4 relative z-10 shadow-xl overflow-hidden">
                                {profile.photoURL ? <img src={profile.photoURL} className="w-full h-full object-cover" /> : <User className="w-16 h-16 text-muted-foreground" />}
                            </div>

                            <div className="flex justify-between items-start">
                                <div>
                                    <h2 className="text-3xl font-black mb-1 flex items-center gap-3">
                                        <input name="name" value={profile.name || ''} onChange={handleChange} className="bg-transparent outline-none border-b border-transparent focus:border-white/20 hover:border-white/10 transition" placeholder="Your Name" />
                                    </h2>
                                    <h3 className="text-lg text-muted-foreground font-medium mb-3">
                                        <input name="role" value={profile.role || ''} onChange={handleChange} className="w-full bg-transparent outline-none border-b border-transparent focus:border-white/20 hover:border-white/10 transition" placeholder="Add your Job Title / Headline e.g. Senior Software Engineer" />
                                    </h3>

                                    <div className="flex flex-wrap gap-4 text-sm font-semibold text-muted-foreground">
                                        <span className="flex items-center gap-1.5"><Globe className="w-4 h-4 text-primary" /> {profile.country || 'India'}</span>
                                        <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-purple-400" /> {profile.city || 'City'}, {profile.state || 'State'}</span>
                                        <span className="flex items-center gap-1.5"><Mail className="w-4 h-4 text-blue-400" /> {profile.email}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* About / Summary Card */}
                    <div className="glass p-6 md:p-8 rounded-3xl border border-white/5 shadow-xl relative group text-left">
                        <Pencil className="absolute top-6 right-6 w-5 h-5 text-muted-foreground opacity-50 group-hover:opacity-100 transition" />
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><User className="w-6 h-6 text-primary" /> About</h3>
                        <textarea
                            name="summary"
                            value={profile.summary || ''}
                            onChange={handleChange}
                            placeholder="Tell recruiters about yourself. What are your core strengths? (Or upload resume to auto-fill)"
                            className="w-full bg-transparent border-none outline-none resize-none text-muted-foreground leading-relaxed whitespace-pre-wrap font-medium min-h-[100px]"
                        />
                    </div>

                    {/* Experience Card */}
                    <div className="glass p-6 md:p-8 rounded-3xl border border-white/5 shadow-xl">
                        <h3 className="text-xl font-bold mb-6 flex items-center gap-2"><Briefcase className="w-6 h-6 text-blue-400" /> Experience</h3>
                        {profile.experience && profile.experience.length > 0 ? (
                            <div className="space-y-8">
                                {profile.experience.map((exp: any, idx: number) => (
                                    <div key={idx} className="flex gap-4">
                                        <div className="w-12 h-12 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center flex-shrink-0">
                                            <Building className="w-6 h-6 text-muted-foreground" />
                                        </div>
                                        <div className="border-b border-white/5 pb-6 flex-1 last:border-0 last:pb-0">
                                            <h4 className="text-lg font-bold text-white">{exp.role || exp.title || 'Role not specified'}</h4>
                                            <div className="font-semibold text-primary">{exp.company || 'Company not specified'}</div>
                                            <div className="text-sm font-semibold text-muted-foreground flex items-center gap-2 mt-1 mb-2">
                                                <Calendar className="w-4 h-4" /> {exp.duration || exp.dates || 'Duration not specified'}
                                            </div>
                                            <p className="text-muted-foreground text-sm font-medium leading-relaxed">
                                                {exp.description || 'No description listed.'}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-muted-foreground font-bold bg-white/5 rounded-2xl border border-dashed border-white/10">Upload your resume to instantly build your timeline.</div>
                        )}
                    </div>

                    {/* Education Card */}
                    <div className="glass p-6 md:p-8 rounded-3xl border border-white/5 shadow-xl">
                        <h3 className="text-xl font-bold mb-6 flex items-center gap-2"><GraduationCap className="w-6 h-6 text-purple-400" /> Education</h3>
                        {profile.education && profile.education.length > 0 ? (
                            <div className="space-y-6">
                                {profile.education.map((edu: any, idx: number) => (
                                    <div key={idx} className="flex gap-4 border-b border-white/5 pb-6 last:border-0 last:pb-0">
                                        <div className="w-12 h-12 bg-white/5 rounded-full border border-white/10 flex items-center justify-center flex-shrink-0">
                                            <GraduationCap className="w-6 h-6 text-muted-foreground" />
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-bold text-white">{edu.institution || edu.school || 'School not specified'}</h4>
                                            <div className="text-sm text-muted-foreground font-semibold mt-1">
                                                {edu.degree || edu.course || 'Degree'} {edu.field ? `in ${edu.field}` : ''}
                                            </div>
                                            <div className="text-sm font-bold text-primary mt-1">{edu.year || edu.duration || ''}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-6 text-muted-foreground font-bold bg-white/5 rounded-2xl border border-dashed border-white/10">No education data.</div>
                        )}
                    </div>

                    {/* Skills Card */}
                    <div className="glass p-6 md:p-8 rounded-3xl border border-white/5 shadow-xl relative group">
                        <Pencil className="absolute top-6 right-6 w-5 h-5 text-muted-foreground opacity-50 group-hover:opacity-100 transition" />
                        <h3 className="text-xl font-bold mb-6 flex items-center gap-2"><Code className="w-6 h-6 text-green-400" /> Technical Skills</h3>
                        <textarea
                            name="skills"
                            value={(profile.skills || []).join(', ')}
                            onChange={(e) => setProfile({ ...profile, skills: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-green-400/50 text-sm mb-4"
                            placeholder="Edit as comma separated: React, Node.js, Python..."
                        />
                        <div className="flex flex-wrap gap-2">
                            {profile.skills && profile.skills.map((skill: string, i: number) => (
                                <span key={i} className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm font-bold shadow-sm">{skill}</span>
                            ))}
                        </div>
                    </div>

                </div>

                {/* Right/Sidebar Column: Agent Settings & Upload */}
                <div className="lg:col-span-1 space-y-6 sticky top-8">
                    <div className="glass p-6 rounded-3xl border border-primary/30 shadow-[0_0_30px_rgba(79,70,229,0.15)] bg-gradient-to-b from-primary/10 to-transparent">
                        <h3 className="text-lg font-black mb-2 text-white">1-Click Profile Build</h3>
                        <p className="text-xs font-semibold text-muted-foreground mb-4 leading-relaxed">Let the AI read your resume and perfectly fill your entire LinkedIn-style profile instantly. It will Auto-Save.</p>
                        <ResumeUpload onUploadSuccess={handleUploadSuccess} initialFileName={profile.resumeFileName} />
                    </div>

                    <div className="glass p-6 rounded-3xl border border-white/5 shadow-xl space-y-5">
                        <h3 className="text-lg font-black flex items-center gap-2 border-b border-white/5 pb-4"><Briefcase className="text-primary w-5 h-5" /> Automation Targets</h3>
                        <div>
                            <label className="text-xs uppercase font-bold text-muted-foreground mb-1.5 block">Job Search Target Role</label>
                            <input name="role" value={profile.role || ''} onChange={handleChange} placeholder="e.g. Frontend React Developer" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary/50 text-sm font-bold" />
                        </div>
                        <div>
                            <label className="text-xs uppercase font-bold text-muted-foreground mb-1.5 block">Target Locations (Comma sep)</label>
                            <input name="location" value={profile.preferences?.location || ''} onChange={handlePrefsChange} placeholder="e.g. Bangalore, Remote, USA" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary/50 text-sm font-bold" />
                        </div>
                        <div>
                            <label className="text-xs uppercase font-bold text-muted-foreground mb-1.5 block">Minimum Salary Constraint</label>
                            <input name="minSalary" value={profile.preferences?.minSalary || ''} onChange={handlePrefsChange} placeholder="e.g. 15LPA or $100k" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary/50 text-sm font-bold" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
