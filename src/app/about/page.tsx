'use client';

import { useEffect, useState } from 'react';
import { useClientTranslation } from '@/hooks/useClientTranslation';
import AnimatedBackground from '@/components/AnimatedBackground';
import LanguageSelector from '@/components/ui/LanguageSelector';
import Link from 'next/link';

export default function AboutPage() {
    const { t } = useClientTranslation();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const socialLinks = [
        {
            name: 'Facebook',
            url: 'https://www.facebook.com/share/1AXCENKzae/?mibextid=wwXIfr',
            icon: (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
            ),
            color: 'hover:text-[#1877F2]'
        },
        {
            name: 'Instagram',
            url: 'https://www.instagram.com/jasmin.locationdevoiture/',
            icon: (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
            ),
            color: 'hover:text-[#E4405F]'
        },
        {
            name: 'WhatsApp',
            url: 'https://wa.me/21622420360',
            icon: (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.298-.347.446-.520.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
            ),
            color: 'hover:text-[#25D366]'
        }
    ];

    return (
        <div className="min-h-screen bg-black text-white relative flex flex-col items-center selection:bg-orange-500 selection:text-white">
            <AnimatedBackground />

            {/* Header */}
            <nav className="w-full z-10 px-4 py-6 md:px-6 md:py-8 flex justify-between items-center max-w-7xl">
                <Link href="/" className="flex items-center gap-2 md:gap-3 group">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-[#FFC800] to-[#FF8000] rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20 transition-transform duration-300 group-hover:scale-105">
                        <span className="text-black font-black text-lg md:text-xl">JRC</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-white font-black text-lg md:text-2xl tracking-tighter uppercase leading-none">Jasmin Rent Cars</span>
                        <span className="text-[#FFC800] text-[8px] md:text-[10px] font-bold tracking-[0.2em] md:tracking-[0.3em] uppercase mt-0.5 md:mt-1">Premium Excellence</span>
                    </div>
                </Link>
                <div className="flex items-center">
                    <LanguageSelector />
                </div>
            </nav>

            {/* Main Content */}
            <main className="flex-1 w-full max-w-5xl px-4 md:px-6 py-10 md:py-16 z-10 flex flex-col items-center justify-center">
                <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-[2rem] md:rounded-[3rem] p-6 md:p-12 shadow-2xl relative overflow-hidden w-full">
                    {/* Decorative glows */}
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-600/10 rounded-full blur-[100px] pointer-events-none" />
                    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#FFC800]/5 rounded-full blur-[100px] pointer-events-none" />

                    <div className="relative z-10">
                        <div className="inline-block px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 text-[10px] font-black uppercase tracking-widest mb-6">
                            Premium Services
                        </div>

                        <h1 className="text-3xl md:text-6xl font-black mb-4 bg-gradient-to-r from-white via-orange-100 to-[#FFC800] bg-clip-text text-transparent uppercase tracking-tight leading-tight">
                            {t('aboutTitle')}
                        </h1>

                        <p className="text-base md:text-xl text-gray-400 mb-10 md:mb-12 font-medium max-w-2xl">
                            {t('aboutDescription')}
                        </p>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
                            {/* Contact Details */}
                            <div className="space-y-6 md:space-y-8">
                                <div className="flex items-center gap-4 group/item">
                                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-white/5 flex items-center justify-center text-xl md:text-2xl shrink-0 border border-white/10 group-hover/item:border-orange-500/50 transition-colors duration-300">
                                        📍
                                    </div>
                                    <div className="overflow-hidden">
                                        <h4 className="text-orange-500 font-black uppercase tracking-widest text-[10px] mb-0.5">Location</h4>
                                        <p className="text-white text-base md:text-lg font-bold truncate">cité el ghazala ariana, tunisie</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 group/item">
                                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-white/5 flex items-center justify-center text-xl md:text-2xl shrink-0 border border-white/10 group-hover/item:border-orange-500/50 transition-colors duration-300">
                                        📧
                                    </div>
                                    <div className="overflow-hidden">
                                        <h4 className="text-orange-500 font-black uppercase tracking-widest text-[10px] mb-0.5">{t('emailLabel')}</h4>
                                        <p className="text-white text-base md:text-lg font-bold truncate">jasmin.weddings.cars@gmail.com</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 group/item">
                                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-white/5 flex items-center justify-center text-xl md:text-2xl shrink-0 border border-white/10 group-hover/item:border-orange-500/50 transition-colors duration-300">
                                        📞
                                    </div>
                                    <div>
                                        <h4 className="text-orange-500 font-black uppercase tracking-widest text-[10px] mb-0.5">{t('phoneLabel')}</h4>
                                        <p className="text-white text-2xl md:text-3xl font-black">+216 22 420 360</p>
                                    </div>
                                </div>

                                {/* Social Media Link Icons */}
                                <div className="pt-6 border-t border-white/10">
                                    <h4 className="text-gray-500 font-black uppercase tracking-widest text-[10px] mb-4">Follow Us</h4>
                                    <div className="flex gap-4">
                                        {socialLinks.map((social) => (
                                            <a
                                                key={social.name}
                                                href={social.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className={`w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 transition-all duration-300 hover:scale-110 hover:border-orange-500/50 ${social.color}`}
                                                title={social.name}
                                            >
                                                {social.icon}
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Map Preview */}
                            <div className="relative h-48 md:h-full min-h-[200px]">
                                <a
                                    href="https://maps.google.com/?q=36.892422,10.176791"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block h-full w-full rounded-2xl overflow-hidden border border-white/10 hover:border-orange-500/50 transition-all duration-300 relative group/map"
                                >
                                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center grayscale opacity-40 transition-all duration-700 group-hover/map:grayscale-0 group-hover/map:opacity-60" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                                        <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-2xl shadow-xl shadow-orange-500/40">
                                            📍
                                        </div>
                                        <span className="text-white font-black text-[10px] uppercase tracking-widest px-4 py-2 bg-black/50 backdrop-blur-md rounded-lg border border-white/10">
                                            {t('viewOnMap')}
                                        </span>
                                    </div>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Button */}
                <div className="mt-10 md:mt-12">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#FFC800] to-orange-600 text-black font-black rounded-2xl hover:shadow-[0_0_30px_rgba(255,200,0,0.3)] transition-all transform hover:-translate-y-1 active:scale-95 uppercase tracking-tighter"
                    >
                        <span>←</span>
                        <span>{t('backToHome')}</span>
                    </Link>
                </div>
            </main>

            {/* Footer */}
            <footer className="w-full py-8 md:py-10 px-4 md:px-6 border-t border-white/5 backdrop-blur-sm z-10 text-center">
                <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">
                    &copy; 2026 Jasmin Rent Cars. {t('allRightsReserved')}
                </p>
            </footer>
        </div>
    );
}
