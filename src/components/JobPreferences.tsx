"use client";

import React, { useState } from 'react';
import { Briefcase, MapPin, IndianRupee, Send, Check } from 'lucide-react';
import { motion } from 'framer-motion';

interface JobPreferencesProps {
    onSubmit: (prefs: { title: string; location: string; minSalary: string }) => void;
}

export const JobPreferences: React.FC<JobPreferencesProps> = ({ onSubmit }) => {
    const [isSaved, setIsSaved] = useState(false);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        onSubmit({
            title: formData.get('title') as string,
            location: formData.get('location') as string,
            minSalary: formData.get('minSalary') as string,
        });
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 3000);
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full max-w-2xl mx-auto p-8 rounded-2xl glass"
        >
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Briefcase className="text-primary" />
                Job Preferences
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                        Target Job Title
                    </label>
                    <div className="relative">
                        <input
                            name="title"
                            type="text"
                            placeholder="e.g. Senior Frontend Developer"
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary/50 transition-colors"
                            required
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            <MapPin className="w-4 h-4" /> Location
                        </label>
                        <input
                            name="location"
                            type="text"
                            placeholder="e.g. Dubai, Remote"
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary/50 transition-colors"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            <IndianRupee className="w-4 h-4" /> Min Salary (Yearly)
                        </label>
                        <input
                            name="minSalary"
                            type="text"
                            placeholder="e.g. ₹12,00,000"
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary/50 transition-colors"
                            required
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    className={`w-full text-white font-semibold py-4 rounded-xl transition-all flex items-center justify-center gap-2 group shadow-lg ${isSaved ? 'bg-green-600 hover:bg-green-700 shadow-green-600/20' : 'bg-primary hover:bg-primary/90 shadow-primary/20'}`}
                >
                    {isSaved ? (
                        <>
                            Preferences Saved!
                            <Check className="w-4 h-4" />
                        </>
                    ) : (
                        <>
                            Save Preferences
                            <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </>
                    )}
                </button>
            </form>
        </motion.div>
    );
};
