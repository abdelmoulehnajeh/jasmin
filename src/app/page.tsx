'use client';

import { useEffect, useState, useRef } from 'react';
import { useClientTranslation } from '@/hooks/useClientTranslation';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';
import CarCard from '@/components/CarCard';
import BookingModal from '@/components/modals/BookingModal';
import SpinWheelModal from '@/components/modals/SpinWheelModal';
import LanguageSelector from '@/components/ui/LanguageSelector';
import { Car } from '@/types';

gsap.registerPlugin(ScrollTrigger);

type ServiceType = 'marriage' | 'transfer';

interface HeroSettings {
  video_url: string;
  title: string;
  subtitle: string;
}

export default function LandingPage() {
  const { t, i18n } = useClientTranslation();
  const [cars, setCars] = useState<Car[]>([]);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<ServiceType>('marriage');
  const [loading, setLoading] = useState(true);
  const [heroSettings, setHeroSettings] = useState<HeroSettings | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isSpinWheelOpen, setIsSpinWheelOpen] = useState(false);

  const getTranslatedText = (jsonString: string | undefined, fallback: string): string => {
    if (!jsonString) return fallback;
    try {
      const translations = JSON.parse(jsonString);
      if (typeof translations === 'object' && translations !== null) {
        return translations[i18n.language] || translations['en'] || fallback;
      }
      return jsonString;
    } catch {
      return jsonString;
    }
  };

  const [bookingForm, setBookingForm] = useState({
    pickupLocation: '',
    dropoffLocation: '',
    pickupDate: '',
    pickupTime: '',
    serviceType: 'marriage' as ServiceType,
  });

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    gsap.to('.hero-content', {
      yPercent: 30,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero-section',
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
      },
    });

    const sections = gsap.utils.toArray<HTMLElement>('section[id]');
    sections.forEach((section) => {
      gsap.fromTo(
        section,
        { opacity: 0, y: 150, scale: 0.95 },
        {
          opacity: 1, y: 0, scale: 1, duration: 1.5, ease: 'expo.out',
          scrollTrigger: { trigger: section, start: 'top 85%', end: 'top 30%', scrub: 1.5 },
        }
      );
    });

    gsap.utils.toArray('.service-card').forEach((card: any, index) => {
      gsap.fromTo(
        card,
        { opacity: 0, rotateY: index % 2 === 0 ? -30 : 30, x: index % 2 === 0 ? -100 : 100, scale: 0.8 },
        {
          opacity: 1, rotateY: 0, x: 0, scale: 1, duration: 1.5, ease: 'back.out(1.4)',
          scrollTrigger: { trigger: card, start: 'top 80%', end: 'top 40%', scrub: 1.2 },
        }
      );
    });

    gsap.utils.toArray('h2').forEach((heading: any) => {
      gsap.fromTo(
        heading,
        { opacity: 0, y: 100, skewY: 7, scale: 0.9 },
        {
          opacity: 1, y: 0, skewY: 0, scale: 1, duration: 1.2, ease: 'expo.out',
          scrollTrigger: { trigger: heading, start: 'top 90%', toggleActions: 'play none none none' },
        }
      );
    });

    gsap.utils.toArray('.feature-card').forEach((card: any, index) => {
      gsap.fromTo(
        card,
        { opacity: 0, y: 80, rotation: index % 2 === 0 ? -5 : 5, scale: 0.85 },
        {
          opacity: 1, y: 0, rotation: 0, scale: 1, duration: 1, ease: 'back.out(1.2)',
          scrollTrigger: { trigger: card, start: 'top 85%', end: 'top 50%', scrub: 1 },
        }
      );
    });

    gsap.utils.toArray('.car-card').forEach((card: any, index) => {
      gsap.fromTo(
        card,
        { opacity: 0, y: 100, scale: 0.9 },
        {
          opacity: 1, y: 0, scale: 1, duration: 0.8, delay: index * 0.15, ease: 'power3.out',
          scrollTrigger: { trigger: card, start: 'top 90%', toggleActions: 'play none none none' },
        }
      );
    });

    gsap.utils.toArray('.form-input').forEach((input: any, index) => {
      gsap.fromTo(
        input,
        { opacity: 0, x: -50 },
        {
          opacity: 1, x: 0, duration: 0.6, delay: index * 0.1, ease: 'power2.out',
          scrollTrigger: { trigger: input, start: 'top 95%', toggleActions: 'play none none none' },
        }
      );
    });

    gsap.fromTo(
      '.cta-section',
      { opacity: 0, scale: 0.9 },
      {
        opacity: 1, scale: 1, duration: 1.5, ease: 'elastic.out(1, 0.5)',
        scrollTrigger: { trigger: '.cta-section', start: 'top 80%', toggleActions: 'play none none none' },
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/graphql', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query: `query GetLandingData($language: String) {
              cars(language: $language) {
                id name brand model year price_per_day description
                image_base64 gallery model_3d_url status service_type features
                specs { engine transmission fuelType seats color }
                total_count available_count average_rating total_ratings
              }
              heroSettings(language: $language) {
                video_url title subtitle
              }
            }`,
            variables: { language: i18n.language || 'en' },
          }),
        });
        const result = await response.json();
        if (result.data?.cars) setCars(result.data.cars);
        if (result.data?.heroSettings) setHeroSettings(result.data.heroSettings);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [i18n.language]);

  const filteredCars = cars.filter(car => car.service_type === selectedService);

  const handleCarClick = (car: Car) => {
    setSelectedCar(car);
    setIsModalOpen(true);
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    document.querySelector('#fleet')?.scrollIntoView({ behavior: 'smooth' });
    setSelectedService(bookingForm.serviceType);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-[#1a1a1a]' : 'bg-transparent'}`}>
        <div className={`transition-all duration-300 ${scrolled ? 'border-b border-gray-700' : 'border-b border-white/10'}`}>
          {/* Main Navigation Row */}
          <div className="w-full px-2 sm:px-3 md:px-6 lg:px-8 py-2 sm:py-2.5 md:py-4">
            <div className="flex justify-between items-center gap-1 sm:gap-2">
              {/* Menu Button - Left */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center space-x-1 text-white hover:text-gray-300 transition-colors z-50 flex-shrink-0"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                <span className="hidden sm:inline text-[9px] sm:text-[10px] md:text-xs font-semibold uppercase tracking-wider">{t('menu')}</span>
              </button>

              {/* Logo - Center */}
              <div className="flex-shrink-0">
                <a href="/" className={`block transition-all duration-300 ${scrolled ? 'bg-white/5 p-1 rounded-md shadow-sm' : ''}`}>
                  <Image src="/logo2.png" alt="Jasmin Rent Cars" width={900} height={900}
                    className={`w-auto object-contain transition-all duration-300 ${scrolled ? 'h-10 sm:h-12 md:h-14 lg:h-16' : 'h-14 sm:h-18 md:h-22 lg:h-26'}`} priority />
                </a>
              </div>

              {/* Right Side Actions */}
              <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2 flex-shrink-0">
                <LanguageSelector />
                <a href="/login" className="text-[8px] sm:text-[9px] md:text-xs font-semibold uppercase tracking-wider text-white hover:text-gray-300 transition-colors whitespace-nowrap">
                  {t('signIn')}
                </a>
                <button
                  onClick={() => document.querySelector('#fleet')?.scrollIntoView({ behavior: 'smooth' })}
                  className="px-2 sm:px-3 md:px-4 lg:px-5 py-1.5 sm:py-2 md:py-2.5 bg-[#FFC800] hover:bg-[#E6B500] text-black text-[9px] sm:text-[10px] md:text-xs font-bold uppercase tracking-wider transition-colors rounded-sm whitespace-nowrap"
                >
                  {t('bookNow')}
                </button>
              </div>
            </div>
          </div>

          {/* Social Media Icons Row - Below Main Nav */}
          <div className="w-full px-2 sm:px-3 md:px-6 lg:px-8 pb-2 sm:pb-2.5 md:pb-3">
            <div className="flex items-center justify-center gap-3 sm:gap-4 md:gap-5">
              {/* Phone Call Icon */}
              <a href="tel:+1234567890" className="text-white hover:text-[#FFC800] transition-colors" title="Call Us">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 00-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z"/>
                </svg>
              </a>

              {/* Facebook */}
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-[#1877F2] transition-colors" title="Facebook">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>

              {/* Instagram */}
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-[#E4405F] transition-colors" title="Instagram">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>

              {/* YouTube */}
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-[#FF0000] transition-colors" title="YouTube">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Menu Overlay */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 bg-black/95 backdrop-blur-sm animate-fadeIn overflow-y-auto">
          <button
            onClick={() => setMenuOpen(false)}
            className="fixed top-4 right-4 sm:top-6 sm:right-6 z-50 text-white hover:text-[#FFC800] transition-colors"
          >
            <svg className="w-8 h-8 sm:w-10 sm:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10 lg:gap-12">
              <div>
                <h3 className="text-white text-xs sm:text-sm font-bold uppercase tracking-widest mb-6 sm:mb-8 opacity-60">{t('services')}</h3>
                <ul className="space-y-4 sm:space-y-6">
                  {[
                    { label: t('weddingCars'), href: '#services' },
                    { label: t('airportTransfers'), href: '#services' },
                    { label: t('ourFleetMenu'), href: '#fleet' },
                    { label: t('getQuoteMenu'), href: '#quote-form' }
                  ].map((item, i) => (
                    <li key={i}>
                      <a href={item.href}
                        onClick={() => { setMenuOpen(false); document.querySelector(item.href)?.scrollIntoView({ behavior: 'smooth' }); }}
                        className="text-white text-2xl sm:text-3xl font-bold hover:text-[#FFC800] transition-colors block"
                      >{item.label}</a>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-white text-xs sm:text-sm font-bold uppercase tracking-widest mb-6 sm:mb-8 opacity-60">{t('company')}</h3>
                <ul className="space-y-4 sm:space-y-6">
                  {[
                    { label: t('aboutUs'), href: '#' },
                    { label: t('contactUs'), href: '#' },
                    { label: t('driverRecruitment'), href: '/login' },
                    { label: t('businessAccounts'), href: '/login' }
                  ].map((item, i) => (
                    <li key={i}>
                      <a href={item.href}
                        className="text-white text-2xl sm:text-3xl font-bold hover:text-[#FFC800] transition-colors block"
                      >{item.label}</a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="hero-section relative min-h-screen flex items-center justify-center overflow-hidden pt-16 sm:pt-20 md:pt-0">
        {heroSettings?.video_url ? (
          <div className="absolute inset-0 z-0">
            <video autoPlay loop muted playsInline className="w-full h-full object-cover">
              <source src={heroSettings.video_url} type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-black/40" />
          </div>
        ) : (
          <div className="absolute inset-0 z-0 bg-gradient-to-br from-gray-700 to-gray-900" />
        )}
        <div className="hero-content relative z-10 w-full px-4 sm:px-6 md:px-12 lg:px-16 xl:px-24 py-12 sm:py-16 md:py-20">
          <div className="max-w-[1400px] mx-auto text-center md:text-left">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-bold text-white leading-tight mb-4 sm:mb-6 md:mb-8">
              {heroSettings?.title || 'Welcome to Jasmin Rent Cars'}
            </h1>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-white/90 mb-6 sm:mb-8 md:mb-12 max-w-2xl mx-auto md:mx-0 leading-relaxed">
              {heroSettings?.subtitle || 'Your Premium Car Rental Experience'}
            </p>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 md:gap-4 w-full sm:w-auto">
              <button
                onClick={() => setIsSpinWheelOpen(true)}
                className="inline-flex items-center justify-center space-x-2 px-4 sm:px-6 md:px-8 lg:px-10 py-3 sm:py-3 md:py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-xs sm:text-sm font-bold uppercase tracking-wider transition-all rounded-sm shadow-lg hover:shadow-xl w-full sm:w-auto"
              >
                <span>🎁</span>
                <span>{t('giftOffer')}</span>
              </button>
              <button
                onClick={() => document.querySelector('#quote-form')?.scrollIntoView({ behavior: 'smooth' })}
                className="inline-flex items-center justify-center space-x-2 px-4 sm:px-6 md:px-8 lg:px-10 py-3 sm:py-3 md:py-4 bg-[#FFC800] hover:bg-[#E6B500] text-black text-xs sm:text-sm font-bold uppercase tracking-wider transition-all rounded-sm shadow-lg hover:shadow-xl w-full sm:w-auto"
              >
                <span>{t('getQuote')}</span>
                <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>

    



      {/* Fleet Section */}
      <section id="fleet" className="py-12 sm:py-16 md:py-24 bg-[#0a0a0a]">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-3 sm:mb-4 md:mb-6 uppercase tracking-wide">{t('ourPremiumFleet')}</h2>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-gray-300 mb-4 sm:mb-6 md:mb-10">
              {filteredCars.length} {t('luxuryVehiclesFor')} {selectedService === 'marriage' ? t('weddingsSpecialEvents') : t('airportLocationTransfers')}
            </p>
            <div className="inline-flex bg-[#1a1a1a] shadow-lg p-1 sm:p-2 border border-gray-800">
              {[{ type: 'marriage', icon: '💍', label: t('wedding') }, { type: 'transfer', icon: '✈️', label: t('transferTitle') }].map((btn) => (
                <button key={btn.type} onClick={() => setSelectedService(btn.type as ServiceType)}
                  className={`px-3 sm:px-5 md:px-8 py-2 sm:py-3 md:py-4 font-bold uppercase tracking-wide transition-all text-[10px] sm:text-xs md:text-sm ${selectedService === btn.type ? 'bg-[#FFC800] text-black' : 'text-gray-300 hover:text-white'}`}>
                  {btn.icon} {btn.label}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="text-center py-16 sm:py-24 md:py-32">
              <div className="inline-block animate-spin rounded-full h-10 w-10 sm:h-14 sm:w-14 md:h-20 md:w-20 border-4 border-[#FFC800] border-t-transparent"></div>
              <p className="mt-4 sm:mt-6 text-gray-300 text-sm sm:text-base md:text-xl font-semibold">{t('loadingPremiumFleet')}</p>
            </div>
          ) : filteredCars.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
              {filteredCars.map((car) => (
                <div key={car.id} className="car-card transform hover:scale-105 transition-all duration-300 hover:shadow-2xl">
                  <CarCard car={car} onBook={() => handleCarClick(car)} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 sm:py-20 md:py-32 bg-[#1a1a1a] shadow-lg border border-gray-800">
              <div className="text-5xl sm:text-6xl md:text-8xl mb-4 sm:mb-6 md:mb-8">🚗</div>
              <h3 className="text-lg sm:text-xl md:text-3xl font-bold text-white mb-3 sm:mb-4 md:mb-6 uppercase tracking-wide">{t('noVehiclesAvailable')}</h3>
              <p className="text-gray-300 text-xs sm:text-sm md:text-lg max-w-2xl mx-auto leading-relaxed px-4">
                {t('updatingFleet')}
              </p>
            </div>
          )}
        </div>
      </section>
  {/* Quote Form Section */}
      <section id="quote-form" className="py-12 sm:py-16 md:py-20 bg-[#0a0a0a]">
        <div className="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#1a1a1a] p-4 sm:p-6 md:p-8 lg:p-10 shadow-2xl border border-gray-800">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4 sm:mb-6 md:mb-8 text-center uppercase tracking-wide">{t('getYourQuote')}</h2>
            <form onSubmit={handleBookingSubmit} className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div className="form-input">
                  <label className="block text-xs sm:text-sm font-bold text-gray-300 mb-2 sm:mb-3 uppercase tracking-wide">{t('serviceType')}</label>
                  <select
                    value={bookingForm.serviceType}
                    onChange={(e) => setBookingForm({ ...bookingForm, serviceType: e.target.value as ServiceType })}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 md:py-4 border-2 border-gray-700 focus:border-[#FFC800] outline-none text-white text-sm sm:text-base bg-[#0a0a0a]"
                  >
                    <option value="marriage">{t('weddingSpecialEvents')}</option>
                    <option value="transfer">{t('airportLocationTransfer')}</option>
                  </select>
                </div>
                <div className="form-input">
                  <label className="block text-xs sm:text-sm font-bold text-gray-300 mb-2 sm:mb-3 uppercase tracking-wide">{t('pickupLocation')}</label>
                  <input type="text" value={bookingForm.pickupLocation} onChange={(e) => setBookingForm({ ...bookingForm, pickupLocation: e.target.value })}
                    placeholder={t('enterPickupAddress')} className="w-full px-3 sm:px-4 py-2.5 sm:py-3 md:py-4 border-2 border-gray-700 focus:border-[#FFC800] outline-none text-white bg-[#0a0a0a] placeholder-gray-500 text-sm sm:text-base" required />
                </div>
                <div className="form-input">
                  <label className="block text-xs sm:text-sm font-bold text-gray-300 mb-2 sm:mb-3 uppercase tracking-wide">{t('dropoffLocation')}</label>
                  <input type="text" value={bookingForm.dropoffLocation} onChange={(e) => setBookingForm({ ...bookingForm, dropoffLocation: e.target.value })}
                    placeholder={t('enterDestination')} className="w-full px-3 sm:px-4 py-2.5 sm:py-3 md:py-4 border-2 border-gray-700 focus:border-[#FFC800] outline-none text-white bg-[#0a0a0a] placeholder-gray-500 text-sm sm:text-base" required />
                </div>
                <div className="form-input">
                  <label className="block text-xs sm:text-sm font-bold text-gray-300 mb-2 sm:mb-3 uppercase tracking-wide">{t('pickupDate')}</label>
                  <input type="date" value={bookingForm.pickupDate} onChange={(e) => setBookingForm({ ...bookingForm, pickupDate: e.target.value })}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 md:py-4 border-2 border-gray-700 focus:border-[#FFC800] outline-none text-white bg-[#0a0a0a] text-sm sm:text-base" required />
                </div>
                <div className="md:col-span-2 form-input">
                  <label className="block text-xs sm:text-sm font-bold text-gray-300 mb-2 sm:mb-3 uppercase tracking-wide">{t('pickupTime')}</label>
                  <input type="time" value={bookingForm.pickupTime} onChange={(e) => setBookingForm({ ...bookingForm, pickupTime: e.target.value })}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 md:py-4 border-2 border-gray-700 focus:border-[#FFC800] outline-none text-white bg-[#0a0a0a] text-sm sm:text-base" required />
                </div>
              </div>
              <button type="submit" className="w-full px-4 sm:px-6 py-3 sm:py-4 md:py-5 bg-[#FFC800] hover:bg-[#E6B500] text-black font-bold text-sm sm:text-base md:text-lg uppercase tracking-wider transition-colors">
                {t('viewAvailableVehicles')}
              </button>
            </form>
          </div>
        </div>
      </section>

            {/* Services Section */}
      <section id="services" className="py-12 sm:py-16 md:py-24 lg:py-32 bg-[#0a0a0a]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-3 sm:mb-4 md:mb-6 uppercase tracking-wide">{t('ourServices')}</h2>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-gray-300 max-w-3xl mx-auto">{t('premiumLuxuryTransport')}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
            {[
              { type: 'marriage', icon: '💍', title: t('wedding'), desc: t('weddingServiceDesc'), gradient: 'from-pink-900/20 to-purple-900/20' },
              { type: 'transfer', icon: '✈️', title: t('transferTitle'), desc: t('transferServiceDesc'), gradient: 'from-blue-900/20 to-cyan-900/20' }
            ].map((service) => (
              <div key={service.type}
                onClick={() => { setSelectedService(service.type as ServiceType); document.querySelector('#fleet')?.scrollIntoView({ behavior: 'smooth' }); }}
                className="service-card group cursor-pointer bg-[#1a1a1a] border border-gray-800 shadow-2xl hover:shadow-[0_0_40px_rgba(255,200,0,0.3)] transition-all duration-500 overflow-hidden"
              >
                <div className={`relative h-40 sm:h-52 md:h-64 lg:h-80 bg-gradient-to-br ${service.gradient} overflow-hidden border-b border-gray-800`}>
                  <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/0 transition-all duration-500">
                    <div className="text-[60px] sm:text-[80px] md:text-[100px] lg:text-[140px] transform group-hover:scale-125 transition-transform duration-700">{service.icon}</div>
                  </div>
                </div>
                <div className="p-4 sm:p-5 md:p-6 lg:p-10">
                  <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white mb-2 sm:mb-3 md:mb-4">{service.title}</h3>
                  <p className="text-gray-400 text-xs sm:text-sm md:text-base leading-relaxed mb-3 sm:mb-4">{service.desc}</p>
                  <div className="flex items-center text-white font-bold text-xs sm:text-sm md:text-base group-hover:text-[#FFC800] transition-colors">
                    {t('learnMore')}
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 ml-2 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Video Section - Airport Transfers */}
      <section className="relative min-h-[50vh] sm:min-h-[60vh] md:min-h-screen flex items-center overflow-hidden">
        {heroSettings?.video_url ? (
          <div className="absolute inset-0 z-0">
            <video autoPlay loop muted playsInline className="w-full h-full object-cover">
              <source src={heroSettings.video_url} type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-black/40" />
          </div>
        ) : (
          <div className="absolute inset-0 z-0 bg-gradient-to-br from-gray-800 to-gray-900" />
        )}
        <div className="relative z-10 w-full px-4 sm:px-6 md:px-12 lg:px-16 xl:px-24 py-10 sm:py-14 md:py-20">
          <div className="max-w-[1400px] mx-auto">
            <div className="max-w-2xl">
              <h2 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight mb-3 sm:mb-4 md:mb-6">{t('airportAssuredService')}</h2>
              <p className="text-xs sm:text-sm md:text-lg lg:text-xl text-white mb-4 sm:mb-6 md:mb-8 leading-relaxed">
                {t('airportTransferDesc')}
              </p>
              <ul className="space-y-2 sm:space-y-3 md:space-y-4 mb-4 sm:mb-6 md:mb-10">
                {[t('realTimeFlightTracking'), t('fixedPricingNoHiddenFees'), t('professionalChauffeurs')].map((item) => (
                  <li key={item} className="flex items-start text-white">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-[#FFC800] mr-2 sm:mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-xs sm:text-sm md:text-lg">{item}</span>
                  </li>
                ))}
              </ul>
              <button onClick={() => document.querySelector('#quote-form')?.scrollIntoView({ behavior: 'smooth' })}
                className="inline-flex items-center space-x-2 px-4 sm:px-6 md:px-10 py-2.5 sm:py-3 md:py-4 bg-[#FFC800] hover:bg-[#E6B500] text-black text-[10px] sm:text-xs md:text-sm font-bold uppercase tracking-wider transition-all rounded-sm">
                <span>{t('bookAirportTransfer')}</span>
                <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FULL VIDEO BACKGROUND - Why Choose + CTA + Footer */}
      <div className="relative">
        {/* Single Full Video Background for all 3 sections */}
        <div className="absolute inset-0 z-0">
          <video 
            autoPlay 
            loop 
            muted 
            playsInline 
            className="w-full h-full object-cover"
          >
            <source src="/back1.mp4" type="video/mp4" />
          </video>
        </div>

        {/* Why Choose Us Section */}
        <section id="why-choose" className="relative py-12 sm:py-16 md:py-24 z-10">
          {/* Dark overlay that fades */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-black/70 to-black/50 z-0" />
          
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-8 sm:mb-12 md:mb-16 lg:mb-20">
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-3 sm:mb-4 md:mb-6 uppercase tracking-wide">{t('whyChooseJasmin')}</h2>
              <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-gray-300 max-w-3xl mx-auto">{t('trustedByThousands')}</p>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-8 lg:gap-12">
              {[
                { icon: '💎', title: t('premiumQuality'), desc: t('premiumQualityDesc') },
                { icon: '⚡', title: t('instantBooking'), desc: t('instantBookingDesc') },
                { icon: '🔒', title: t('securePayment'), desc: t('securePaymentDesc') },

              ].map((feature) => (
                <div key={feature.title} className="feature-card text-center group">
                  <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl mb-2 sm:mb-3 md:mb-6 transform group-hover:scale-110 transition-transform duration-300">{feature.icon}</div>
                  <h3 className="text-xs sm:text-sm md:text-base lg:text-xl font-bold text-white mb-1 sm:mb-2 md:mb-3 uppercase tracking-wide">{feature.title}</h3>
                  <p className="text-gray-300 text-[10px] sm:text-xs md:text-sm lg:text-base leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta-section relative py-12 sm:py-16 md:py-24 lg:py-32 text-white text-center z-10">
          {/* Lighter overlay for CTA */}
          <div className="absolute inset-0 bg-black/40 z-0" />

          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-bold mb-3 sm:mb-4 md:mb-6 lg:mb-8 uppercase tracking-wide">{t('readyToBook')}</h2>
            <p className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl text-gray-300 mb-4 sm:mb-6 md:mb-8 lg:mb-12 max-w-3xl mx-auto leading-relaxed">
              {t('experienceProfessional')}
            </p>
            <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="inline-flex items-center space-x-2 sm:space-x-3 px-5 sm:px-6 md:px-8 lg:px-12 py-2.5 sm:py-3 md:py-4 lg:py-6 bg-[#FFC800] hover:bg-[#E6B500] text-black font-bold text-xs sm:text-sm md:text-base lg:text-xl uppercase tracking-wider transition-all transform hover:scale-105">
              <span>{t('getStartedCta')}</span>
              <svg className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-6 lg:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </section>

        {/* Footer */}
        <footer className="relative text-white py-8 sm:py-10 md:py-12 lg:py-16 z-10">
          {/* Darker overlay for footer readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/50 z-0" />
          
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6 md:gap-8 lg:gap-12 mb-6 sm:mb-8 md:mb-12 lg:mb-16">
              {[
                { title: t('company'), links: [{ label: t('getQuoteFooter'), href: '#quote-form' }, { label: t('servicesFooter'), href: '#fleet' }, { label: t('fleet'), href: '#fleet' }, { label: t('careers'), href: '/login' }] },
                { title: t('about'), links: [{ label: t('ourStory'), href: '#' }, { label: t('accreditations'), href: '#' }, { label: t('signUpFooter'), href: '/login' }, { label: t('mobileApp'), href: '#' }] },
                { title: t('support'), links: [{ label: t('helpCenter'), href: '#' }, { label: t('contactUs'), href: '#' }, { label: t('faqs'), href: '#' }, { label: t('support247'), href: '#' }] },
                { title: t('services'), links: [{ label: t('weddingCarsFooter'), href: '#fleet' }, { label: t('airportTransferFooter'), href: '#fleet' }, { label: t('luxuryFleetFooter'), href: '#fleet' }, { label: t('chauffeurService'), href: '#fleet' }] },
              ].map((col) => (
                <div key={col.title}>
                  <h3 className="font-bold text-xs sm:text-sm md:text-base lg:text-lg mb-2 sm:mb-3 md:mb-4 lg:mb-6 uppercase tracking-wide">{col.title}</h3>
                  <ul className="space-y-1.5 sm:space-y-2 md:space-y-3 lg:space-y-4 text-gray-300">
                    {col.links.map((link) => (
                      <li key={link.label}><a href={link.href} className="hover:text-white transition-colors text-[10px] sm:text-xs md:text-sm lg:text-base">{link.label}</a></li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-600/50 pt-4 sm:pt-6 md:pt-8 lg:pt-10">
              <div className="flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0 gap-3 sm:gap-4">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <span className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-[#D4AF37]">JRC</span>
                  <span className="text-xs sm:text-sm md:text-base lg:text-lg font-bold uppercase tracking-wider">{t('jasminRentCars')}</span>
                </div>
                <p className="text-gray-400 text-[10px] sm:text-xs md:text-sm lg:text-base text-center">{t('allRightsReserved')}</p>
             
              </div>
            </div>
          </div>
        </footer>
      </div>

      {/* Booking Modal */}
      {selectedCar && (
        <BookingModal car={selectedCar} isOpen={isModalOpen}
          onClose={() => { setIsModalOpen(false); setSelectedCar(null); }} />
      )}

      {/* Spin Wheel Modal */}
      <SpinWheelModal
        isOpen={isSpinWheelOpen}
        onClose={() => setIsSpinWheelOpen(false)}
      />
    </div>
  );
}
