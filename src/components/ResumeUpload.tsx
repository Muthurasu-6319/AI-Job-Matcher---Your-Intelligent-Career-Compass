"use client";

import React, { useState, useRef } from 'react';
import { Upload, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ResumeUploadProps {
    onUploadSuccess: (data: any, fileName: string) => void;
    initialFileName?: string;
}

export const ResumeUpload: React.FC<ResumeUploadProps> = ({ onUploadSuccess, initialFileName }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [status, setStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>(initialFileName ? 'success' : 'idle');
    const [fileName, setFileName] = useState<string | null>(initialFileName || null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFile(files[0]);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            handleFile(e.target.files[0]);
        }
    };

    const handleFile = async (file: File) => {
        if (file.type !== 'application/pdf') {
            setStatus('error');
            return;
        }

        setFileName(file.name);
        setStatus('uploading');

        const formData = new FormData();
        formData.append('resume', file);

        try {
            const response = await fetch('/api/parse-resume', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) throw new Error('Failed to parse resume');

            const data = await response.json();
            setStatus('success');
            onUploadSuccess(data, file.name);
        } catch (error: any) {
            console.error(error);
            setErrorMsg(error.message || "An unexpected error occurred");
            setStatus('error');
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto p-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                    "relative border-2 border-dashed rounded-2xl p-12 transition-all duration-300 flex flex-col items-center justify-center cursor-pointer glass",
                    isDragging ? "border-primary scale-[1.02] bg-primary/5" : "border-white/10 hover:border-white/20",
                    status === 'error' && "border-red-500/50 bg-red-500/5",
                    status === 'success' && "border-green-500/50 bg-green-500/5"
                )}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
            >
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept=".pdf"
                    className="hidden"
                />

                <AnimatePresence mode="wait">
                    {status === 'idle' || status === 'uploading' ? (
                        <motion.div
                            key="idle"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            className="flex flex-col items-center"
                        >
                            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                                <Upload className={cn("w-8 h-8 text-primary", status === 'uploading' && "animate-bounce")} />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">
                                {status === 'uploading' ? 'Parsing Resume...' : 'Upload your Resume'}
                            </h3>
                            <p className="text-muted-foreground text-center">
                                Drag and drop your PDF resume here, or click to browse
                            </p>
                        </motion.div>
                    ) : status === 'success' ? (
                        <motion.div
                            key="success"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="flex flex-col items-center"
                        >
                            <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mb-4">
                                <CheckCircle2 className="w-8 h-8 text-green-500" />
                            </div>
                            <h3 className="text-xl font-semibold mb-1 text-green-400">Successfully Parsed!</h3>
                            <p className="text-muted-foreground">{fileName}</p>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="error"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="flex flex-col items-center"
                        >
                            <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
                                <AlertCircle className="w-8 h-8 text-red-500" />
                            </div>
                            <h3 className="text-xl font-semibold mb-1 text-red-400">Analysis Failed</h3>
                            <p className="text-muted-foreground text-center max-w-xs">{errorMsg || "Please upload a valid PDF file"}</p>
                            <button
                                onClick={(e) => { e.stopPropagation(); setStatus('idle'); setErrorMsg(null); }}
                                className="mt-4 text-sm text-primary hover:underline"
                            >
                                Try again
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {status === 'uploading' && (
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-white/5 overflow-hidden rounded-b-2xl">
                        <motion.div
                            className="h-full bg-primary"
                            initial={{ x: '-100%' }}
                            animate={{ x: '100%' }}
                            transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
                        />
                    </div>
                )}
            </motion.div>
        </div>
    );
};
