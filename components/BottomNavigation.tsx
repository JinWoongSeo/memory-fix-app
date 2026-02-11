'use client';

import { Home, Wand2, Settings } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSettings } from '@/context/SettingsContext';

export default function BottomNavigation() {
    const pathname = usePathname();
    const { t } = useSettings();

    const navItems = [
        { name: t.nav.home, href: '/', icon: Home },
        { name: t.nav.convert, href: '/convert', icon: Wand2 },
        { name: t.nav.settings, href: '/settings', icon: Settings },
    ];

    return (
        <nav className="fixed bottom-0 left-0 w-full bg-white border-t border-zinc-200 z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
            <div className="flex justify-around items-center h-16 max-w-md mx-auto px-2">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${isActive ? 'text-zinc-900' : 'text-zinc-400 hover:text-zinc-600'
                                }`}
                        >
                            <item.icon size={24} strokeWidth={isActive ? 2 : 1.5} />
                            <span className={`text-[10px] font-medium ${isActive ? 'font-bold' : ''}`}>
                                {item.name}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
