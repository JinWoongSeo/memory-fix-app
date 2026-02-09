'use client';

import Image from "next/image";
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useSettings } from '@/context/SettingsContext';

export default function Home() {
  const { t } = useSettings();

  return (
    <div className="flex flex-col items-center space-y-12 w-full animate-in fade-in duration-700 pb-8">

      {/* Hero Section */}
      <section className="text-center space-y-6 pt-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-xs font-medium">
          <Sparkles size={12} className="text-amber-500" />
          <span>{t.home.feature1}</span>
        </div>
        <h1 className="text-3xl font-serif font-bold text-zinc-900 dark:text-zinc-100 leading-tight whitespace-pre-line">
          {t.home.title}
        </h1>
        <p className="text-zinc-600 dark:text-zinc-300 text-sm leading-relaxed px-4 break-keep">
          {t.home.subtitle}
        </p>
      </section>

      {/* Sample Showcase */}
      <section className="w-full space-y-4">
        <div className="text-center space-y-2">
          <h2 className="text-sm font-bold text-zinc-800 dark:text-zinc-200">복원 예시</h2>
          <p className="text-xs text-zinc-500">사진을 옆으로 밀어 전후 차이를 확인해보세요</p>
        </div>

        <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden shadow-lg border border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900">
          <Image
            src="/images/sample.jpg"
            alt="AI Restoration Sample"
            fill
            className="object-cover"
          />
          <div className="absolute bottom-2 left-2 bg-black/50 text-white text-[10px] px-2 py-1 rounded backdrop-blur-sm">
            AI Before & After
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="w-full px-4">
        <Link
          href="/convert"
          className="group flex items-center justify-center gap-2 w-full py-4 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-xl font-medium shadow-lg shadow-zinc-200 dark:shadow-none hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <span>{t.convert.title} {t.common.appName}</span>
          <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </section>

      {/* Features */}
      <section className="grid grid-cols-1 gap-6 w-full pt-8 border-t border-zinc-100 dark:border-zinc-800">
        {[
          { title: t.home.feature1, desc: t.home.desc1 },
          { title: t.home.feature2, desc: t.home.desc2 },
          { title: t.home.feature3, desc: t.home.desc3 },
        ].map((feature, i) => (
          <div key={i} className="flex gap-4 items-start p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 shadow-sm">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 font-serif font-bold">
              {i + 1}
            </div>
            <div>
              <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-100 mb-1">{feature.title}</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">{feature.desc}</p>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}

