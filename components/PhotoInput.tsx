'use client';

import { useState, useRef, ChangeEvent } from 'react';
import { Camera, Upload, Image as ImageIcon, X } from 'lucide-react';
import Image from 'next/image';
import { useSettings } from '@/context/SettingsContext';

interface PhotoInputProps {
    onPhotoSelected?: (file: File) => void;
}

export default function PhotoInput({ onPhotoSelected }: PhotoInputProps) {
    const { t } = useSettings();
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [isDragOver, setIsDragOver] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            processFile(file);
        }
    };

    const processFile = (file: File) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            setSelectedImage(e.target?.result as string);
            if (onPhotoSelected) {
                onPhotoSelected(file);
            }
        };
        reader.readAsDataURL(file);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
        const file = e.dataTransfer.files?.[0];
        if (file && file.type.startsWith('image/')) {
            processFile(file);
        }
    };

    const clearImage = () => {
        setSelectedImage(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="w-full mx-auto">
            <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileChange}
            />

            {selectedImage ? (
                <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden shadow-lg border border-zinc-200 dark:border-zinc-800 group bg-white dark:bg-zinc-900">
                    <Image
                        src={selectedImage}
                        alt="Selected Photo"
                        fill
                        className="object-cover"
                    />
                    <button
                        onClick={clearImage}
                        className="absolute top-3 right-3 p-2 bg-black/60 text-white rounded-full hover:bg-black/80 transition-colors backdrop-blur-sm"
                        aria-label="Delete photo"
                    >
                        <X size={18} />
                    </button>
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        <p className="text-white text-sm font-bold drop-shadow-md">{t.common.ready}</p>
                    </div>
                </div>
            ) : (
                <div
                    className={`
                        relative flex flex-col items-center justify-center w-full aspect-[3/4] 
                        border-2 border-dashed rounded-2xl transition-all duration-300 bg-white dark:bg-zinc-900/50
                        ${isDragOver
                            ? 'border-zinc-900 dark:border-zinc-100 bg-zinc-50 dark:bg-zinc-800'
                            : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 hover:bg-zinc-50 dark:hover:bg-zinc-900'
                        }
                    `}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                >
                    <div className="flex flex-col items-center space-y-6 text-zinc-500 p-6 text-center">
                        <div className="p-5 rounded-full bg-zinc-50 dark:bg-zinc-800 text-zinc-400 group-hover:scale-110 transition-transform">
                            <ImageIcon size={40} strokeWidth={1} />
                        </div>
                        <div className="space-y-2">
                            <h3 className="font-bold text-lg text-zinc-900 dark:text-zinc-100">
                                {t.common.upload}
                            </h3>
                            <p className="text-xs text-zinc-400 dark:text-zinc-500 max-w-[200px] leading-relaxed">
                                {t.common.dragDesc}
                            </p>
                        </div>

                        <div className="flex gap-3 w-full mt-4 justify-center">
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="flex items-center gap-2 px-4 py-2.5 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-bold rounded-xl hover:scale-105 active:scale-95 transition-all shadow-md"
                            >
                                <Upload size={14} />
                                <span>{t.common.gallery}</span>
                            </button>

                            <button
                                onClick={() => {
                                    if (fileInputRef.current) {
                                        fileInputRef.current.setAttribute('capture', 'environment');
                                        fileInputRef.current.click();
                                        fileInputRef.current.removeAttribute('capture');
                                    }
                                }}
                                className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800 text-xs font-bold rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:scale-105 active:scale-95 transition-all shadow-sm"
                            >
                                <Camera size={14} />
                                <span>{t.common.camera}</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

