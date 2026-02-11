'use client';

import { useState } from 'react';
import PhotoInput from '@/components/PhotoInput';
import { Loader2, CheckCircle2, Download, User, Shirt, Sparkles, Wand2 } from 'lucide-react';
import Image from 'next/image';
import { useSettings } from '@/context/SettingsContext';

type ProcessingStep = 'upload' | 'analyzing' | 'clothing' | 'finalizing' | 'completed';
type Gender = 'male' | 'female';
type TransformationType = 'suit' | 'hanbok';

export default function ConvertPage() {
    const { format: saveFormat, quality, t } = useSettings();
    const [step, setStep] = useState<ProcessingStep>('upload');
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);
    const [detectedGender, setDetectedGender] = useState<Gender>('female'); // Default simulated detection
    const [selectedTransformation, setSelectedTransformation] = useState<TransformationType | null>(null);

    const handlePhotoSelected = async (file: File) => {
        const objectUrl = URL.createObjectURL(file);
        setUploadedImage(objectUrl);
        setStep('analyzing');

        try {
            // Convert file to base64 for API
            const reader = new FileReader();
            reader.onloadend = async () => {
                const base64data = reader.result;

                try {
                    // Call gender analysis API
                    const response = await fetch('/api/analyze-gender', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ imageUrl: base64data }),
                    });

                    if (response.ok) {
                        const data = await response.json();
                        console.log('Gender analysis result:', data);
                        setDetectedGender(data.gender || 'female');
                    } else {
                        // Fallback to female on error
                        setDetectedGender('female');
                    }
                } catch (error) {
                    console.error('Gender analysis failed:', error);
                    setDetectedGender('female');
                }

                setStep('clothing');
            };

            reader.readAsDataURL(file);
        } catch (error) {
            console.error('File reading failed:', error);
            setDetectedGender('female');
            setStep('clothing');
        }
    };

    const handleTransformationSelect = async (type: TransformationType) => {
        setSelectedTransformation(type);
        setStep('finalizing');

        try {
            // Helper to convert blob/url to base64
            const response = await fetch(uploadedImage!);
            const blob = await response.blob();
            const reader = new FileReader();

            reader.onloadend = async () => {
                const base64data = (reader.result as string).split(',')[1]; // Remove data URL prefix for Colab

                try {
                    let resultUrl = '';

                    // Call the new Try-On API
                    console.log('Calling Try-On API for:', type);
                    const apiResponse = await fetch('/api/try-on', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            personImage: reader.result, // Send full Base64 Data URL
                            garmentType: type
                        }),
                    });

                    if (apiResponse.ok) {
                        const data = await apiResponse.json();
                        if (data.result) {
                            // Result might be a URL or base64. 
                            // Gradio client usually returns a URL to a temp file on HF spaces.
                            resultUrl = data.result;
                        }
                    } else {
                        console.error('Try-On API Error:', apiResponse.statusText);
                    }

                    if (resultUrl) {
                        setUploadedImage(resultUrl);
                    } else {
                        // Fallback to mock behavior if API fails or returns nothing (for testing)
                        console.log('API returned no result, using fallback (or error)');
                    }

                } catch (e) {
                    console.error("API Call failed", e);
                }

                // Always move to completion
                setStep('completed');
            };

            reader.readAsDataURL(blob);

        } catch (error) {
            console.error("Processing failed", error);
            setStep('completed');
        }
    };

    const handleDownload = async () => {
        if (!uploadedImage) return;

        try {
            const response = await fetch(uploadedImage);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;

            // Generate filename with timestamp
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
            const clothingType = selectedTransformation || 'restored';
            link.download = `${t.common.appName}_${clothingType}_${timestamp}.${saveFormat}`;

            // Trigger download
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Download failed:', error);
        }
    };

    return (
        <div className="w-full max-w-sm mx-auto flex flex-col items-center space-y-8 min-h-[70vh]">
            <div className="text-center space-y-2">
                <h1 className="text-2xl font-serif font-bold text-zinc-900 dark:text-zinc-100">{t.convert.title}</h1>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">{t.convert.uploadDesc}</p>
            </div>

            {/* Step 1: Upload */}
            {step === 'upload' && (
                <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <PhotoInput onPhotoSelected={handlePhotoSelected} />
                </div>
            )}

            {/* Step 2: Analyzing */}
            {step === 'analyzing' && (
                <div className="w-full py-20 flex flex-col items-center space-y-6 animate-in fade-in duration-500">
                    <div className="relative">
                        <Loader2 className="w-12 h-12 text-zinc-900 dark:text-zinc-100 animate-spin" strokeWidth={1.5} />
                        <User className="absolute inset-0 m-auto w-5 h-5 text-zinc-400 animate-pulse" />
                    </div>
                    <div className="text-center space-y-2">
                        <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-100">{t.convert.analyzing}</h3>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 px-8 break-keep leading-relaxed">
                            {t.convert.analyzingDesc}
                        </p>
                    </div>
                </div>
            )}

            {/* Step 3: Clothing Selection */}
            {step === 'clothing' && (
                <div className="w-full space-y-6 animate-in fade-in zoom-in-95 duration-500">
                    <div className="flex flex-col items-center gap-4 p-6 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm">
                        <div className="p-3 bg-zinc-50 dark:bg-zinc-800 rounded-full text-zinc-600 dark:text-zinc-400">
                            <CheckCircle2 size={24} className="text-green-600" />
                        </div>
                        <div className="text-center">
                            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{t.convert.genderDetected}</h3>
                            <p className="text-xs text-zinc-500 mt-1 capitalize">
                                {detectedGender === 'male' ? t.convert.male : t.convert.female}
                            </p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest text-center">{t.convert.selectClothing}</h4>
                        <div className="grid grid-cols-2 gap-4">
                            {(['suit', 'hanbok'] as TransformationType[]).map((type) => (
                                <button
                                    key={type}
                                    onClick={() => handleTransformationSelect(type)}
                                    className="flex flex-col items-center gap-3 p-6 rounded-2xl border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm hover:border-zinc-900 dark:hover:border-zinc-100 hover:shadow-md transition-all group"
                                >
                                    <div className="p-3 bg-zinc-50 dark:bg-zinc-800 rounded-xl text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-colors">
                                        {(type === 'suit' || type === 'hanbok') && <Shirt size={24} />}
                                    </div>
                                    <span className="text-xs font-bold text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-100">{t.convert[type]}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Step 4: Finalizing */}
            {step === 'finalizing' && (
                <div className="w-full py-20 flex flex-col items-center space-y-6 animate-in fade-in duration-500">
                    <div className="relative">
                        <Sparkles className="w-12 h-12 text-zinc-900 dark:text-zinc-100 animate-pulse" strokeWidth={1.5} />
                        <Wand2 className="absolute -top-1 -right-1 w-5 h-5 text-amber-500 animate-bounce" />
                    </div>
                    <div className="text-center space-y-2">
                        <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-100">{t.convert.processing}</h3>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 px-8 break-keep leading-relaxed">
                            {t.convert.processingDesc} (Free AI: ~30s)
                        </p>
                    </div>
                </div>
            )}

            {/* Step 5: Completed */}
            {step === 'completed' && uploadedImage && (
                <div className="w-full space-y-6 animate-in zoom-in-95 duration-500">
                    <div className="relative w-full aspect-[3/4] rounded-lg overflow-hidden shadow-2xl border border-white/50 dark:border-zinc-700/50 soft-glow-container">
                        <Image
                            src={uploadedImage}
                            alt="Processed Result"
                            fill
                            className="object-cover custom-memorial-filter"
                        />

                        <div className="absolute inset-0 bg-white/5 mix-blend-overlay pointer-events-none"></div>

                        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white/95 dark:bg-zinc-900/95 backdrop-blur text-zinc-900 dark:text-zinc-100 px-4 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-2 border border-zinc-100 dark:border-zinc-800 whitespace-nowrap">
                            <CheckCircle2 size={14} className="text-green-600" />
                            <span>{t.convert.done}</span>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3">
                        <button
                            onClick={handleDownload}
                            className="flex items-center justify-center gap-2 w-full py-4 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-xl font-bold shadow-lg hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all active:scale-[0.98]"
                        >
                            <Download size={18} />
                            <span>{t.convert.downloadHigh}</span>
                        </button>

                        <button
                            onClick={() => setStep('upload')}
                            className="flex items-center justify-center gap-2 w-full py-4 bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 rounded-xl font-medium border border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all"
                        >
                            <span>{t.convert.convertAgain}</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
