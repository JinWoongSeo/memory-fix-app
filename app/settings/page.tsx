'use client';

import { Sparkles, FileDown, Globe, Moon, Monitor, ChevronRight } from 'lucide-react';
import { useSettings } from '@/context/SettingsContext';

export default function SettingsPage() {
    const { quality, setQuality, format, setFormat, darkMode, setDarkMode, language, setLanguage, t } = useSettings();

    const toggleLanguage = () => {
        setLanguage(language === 'ko' ? 'en' : 'ko');
    };

    return (
        <div className="w-full space-y-8 animate-in fade-in duration-500 pb-12">
            <div className="text-center space-y-2">
                <h1 className="text-2xl font-serif font-bold text-zinc-900 dark:text-zinc-100">{t.settings.title}</h1>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">{t.settings.subtitle}</p>
            </div>

            <div className="space-y-6">
                {/* AI & Restoration Settings */}
                <section className="space-y-3">
                    <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-wider px-1">{t.settings.aiSection}</h2>
                    <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-100 dark:border-zinc-800 shadow-sm overflow-hidden">
                        <div className="w-full flex items-center justify-between p-4 border-b border-zinc-50 dark:border-zinc-800">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-zinc-600 dark:text-zinc-400">
                                    <Sparkles size={18} />
                                </div>
                                <div>
                                    <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{t.settings.quality}</div>
                                    <div className="text-xs text-zinc-500 dark:text-zinc-400">{t.settings.qualityDesc}</div>
                                </div>
                            </div>
                            <select
                                value={quality}
                                onChange={(e) => setQuality(e.target.value)}
                                className="text-xs font-bold text-zinc-600 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-800 border-none rounded-md px-2 py-1 focus:ring-1 focus:ring-zinc-200 outline-none"
                            >
                                <option value="balanced">{t.settings.qualityBalanced}</option>
                                <option value="high">{t.settings.qualityHigh}</option>
                                <option value="ultra">{t.settings.qualityUltra}</option>
                            </select>
                        </div>

                        <div className="w-full flex items-center justify-between p-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-zinc-600 dark:text-zinc-400">
                                    <FileDown size={18} />
                                </div>
                                <div>
                                    <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{t.settings.format}</div>
                                    <div className="text-xs text-zinc-500 dark:text-zinc-400">{t.settings.formatDesc}</div>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                {['jpg', 'png'].map((f) => (
                                    <button
                                        key={f}
                                        onClick={() => setFormat(f)}
                                        className={`px-3 py-1 rounded-md text-[10px] font-black uppercase transition-all ${format === f
                                            ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-md scale-105'
                                            : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                                            }`}
                                    >
                                        {f}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>



                    {/* Display & Interface */}
                    <section className="space-y-3">
                        <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-wider px-1">{t.settings.displaySection}</h2>
                        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-100 dark:border-zinc-800 shadow-sm overflow-hidden">

                            <div className="flex items-center justify-between p-4 border-b border-zinc-50 dark:border-zinc-800">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-zinc-600 dark:text-zinc-400">
                                        <Globe size={18} />
                                    </div>
                                    <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{t.settings.language}</div>
                                </div>
                                <button
                                    onClick={toggleLanguage}
                                    className="flex items-center gap-2 text-xs font-bold text-zinc-600 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-800 px-3 py-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors"
                                >
                                    <span>{language === 'ko' ? '한국어' : 'English'}</span>
                                    <ChevronRight size={14} className="text-zinc-300" />
                                </button>
                            </div>

                            <div className="flex items-center justify-between p-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-zinc-600 dark:text-zinc-400">
                                        <Moon size={18} />
                                    </div>
                                    <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{t.settings.darkMode}</div>
                                </div>
                                <button
                                    onClick={() => setDarkMode(!darkMode)}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${darkMode ? 'bg-zinc-800 border border-zinc-700' : 'bg-zinc-200'}`}
                                >
                                    <span className={`${darkMode ? 'translate-x-6 bg-white' : 'translate-x-1 bg-white shadow-sm'} inline-block h-4 w-4 transform rounded-full transition-transform duration-300`} />
                                </button>
                            </div>
                        </div>
                    </section>

                    {/* Information */}
                    <section className="space-y-3">
                        <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-wider px-1">{t.settings.infoSection}</h2>
                        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-100 dark:border-zinc-800 shadow-sm overflow-hidden">
                            <div className="w-full flex items-center justify-between p-4 bg-zinc-50/10 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-zinc-600 dark:text-zinc-400">
                                        <Monitor size={18} />
                                    </div>
                                    <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{t.settings.version}</div>
                                </div>
                                <span className="text-xs font-mono text-zinc-400">v1.0.0</span>
                            </div>
                        </div>
                    </section>

                    <div className="py-8 text-center">
                        <p className="text-[10px] text-zinc-400 dark:text-zinc-500 leading-relaxed italic opacity-80">
                            {t.settings.quote}
                        </p>
                    </div>
            </div>
        </div>
    );
}
