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
  const [selectedService, setSelectedService] = useState<ServiceType | null>(null);
  const [loading, setLoading] = useState(true);
  const [heroSettings, setHeroSettings] = useState<HeroSettings | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isSpinWheelOpen, setIsSpinWheelOpen] = useState(false);

  const getTranslatedText = (data: string | object | undefined, fallback: string): string => {
    if (!data) return fallback;

    try {
      let translations: any;

      // If data is already an object, use it directly
      if (typeof data === 'object') {
        translations = data;
      }
      // If data is a string, try to parse it
      else if (typeof data === 'string') {
        translations = JSON.parse(data);
      } else {
        return fallback;
      }

      // Check if translations is a valid object with language keys
      if (typeof translations === 'object' && translations !== null) {
        // Try current language, then English, then Italian, then French, then Arabic, then fallback
        const translated = translations[i18n.language] ||
          translations['en'] ||
          translations['it'] ||
          translations['fr'] ||
          translations['ar'] ||
          fallback;

        // console.log(`Translation for ${i18n.language}:`, translated, 'from:', translations);
        return translated;
      }

      // If it's a plain string after parsing, return it
      if (typeof translations === 'string') {
        return translations;
      }

      return fallback;
    } catch (error) {
      console.error('Error parsing translation:', error, data);
      // If parsing fails and data is a string, return it as is
      if (typeof data === 'string') {
        return data;
      }
      return fallback;
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
    // Lightweight parallax for hero only
    gsap.to('.hero-content', {
      yPercent: 20,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero-section',
        start: 'top top',
        end: 'bottom top',
        scrub: 0.5,
      },
    });

    // Simple fade-in for sections (NO scrub, much faster)
    const sections = gsap.utils.toArray<HTMLElement>('section[id]');
    sections.forEach((section) => {
      gsap.fromTo(
        section,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 85%',
            toggleActions: 'play none none none',
            once: true,
          },
        }
      );
    });

    // Simplified service cards animation (removed rotateY and reduced complexity)
    gsap.utils.toArray('.service-card').forEach((card: any, index) => {
      gsap.fromTo(
        card,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          delay: index * 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            toggleActions: 'play none none none',
            once: true,
          },
        }
      );
    });

    // Simplified headings (removed skew and scale)
    gsap.utils.toArray('h2').forEach((heading: any) => {
      gsap.fromTo(
        heading,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: heading,
            start: 'top 90%',
            toggleActions: 'play none none none',
            once: true,
          },
        }
      );
    });

    // Simplified feature cards (removed rotation)
    gsap.utils.toArray('.feature-card').forEach((card: any, index) => {
      gsap.fromTo(
        card,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          delay: index * 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            toggleActions: 'play none none none',
            once: true,
          },
        }
      );
    });

    // Simplified car cards
    gsap.utils.toArray('.car-card').forEach((card: any, index) => {
      gsap.fromTo(
        card,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          delay: index * 0.08,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 90%',
            toggleActions: 'play none none none',
            once: true,
          },
        }
      );
    });

    // Simplified CTA
    gsap.fromTo(
      '.cta-section',
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.cta-section',
          start: 'top 80%',
          toggleActions: 'play none none none',
          once: true,
        },
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      // console.log('🌍 Fetching data for language:', i18n.language);
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
        if (result.data?.heroSettings) {
          // console.log('Hero settings received:', result.data.heroSettings);
          // console.log('Title:', result.data.heroSettings.title);
          // console.log('Subtitle:', result.data.heroSettings.subtitle);
          setHeroSettings(result.data.heroSettings);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [i18n.language]);

  const filteredCars = selectedService ? cars.filter(car => car.service_type === selectedService) : [];

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
      {/* Navigation - Premium Design */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ease-in-out ${scrolled
        ? 'bg-[#0a0a0a]/98 backdrop-blur-xl shadow-2xl'
        : 'bg-gradient-to-b from-black/80 via-black/50 to-transparent'
        }`}>
        {/* Main Navigation Container */}
        <div className="max-w-[2000px] mx-auto">
          {/* Primary Bar - Logo, Language, CTA */}
          <div className="flex items-center justify-between px-4 sm:px-6 md:px-10 lg:px-16 py-3 sm:py-4 md:py-5 lg:py-6">

            {/* Logo with Animation */}
            <div className="relative group">
              <a href="/" className="block relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-[#FFC800]/0 via-[#FFC800]/10 to-[#FFC800]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <Image
                  src="/logo2.png"
                  alt="Jasmin Rent Cars"
                  width={900}
                  height={900}
                  className={`relative w-auto object-contain transition-all duration-500 ease-out transform group-hover:scale-105 ${scrolled ? 'h-14 sm:h-16 md:h-20' : 'h-16 sm:h-20 md:h-24 lg:h-28'
                    }`}
                  priority
                />
              </a>
            </div>

            {/* Right Actions - Language & CTA */}
            <div className="flex items-center gap-3 sm:gap-4 md:gap-5">
              {/* Language Selector with Animation */}
              <div className="transform transition-all duration-300 hover:scale-105">
                <LanguageSelector />
              </div>

              {/* Premium Book Now Button */}
              <button
                onClick={() => document.querySelector('#fleet')?.scrollIntoView({ behavior: 'smooth' })}
                className="group relative px-5 sm:px-7 md:px-10 py-2.5 sm:py-3 md:py-4 bg-gradient-to-r from-[#FFC800] to-[#FFD700] hover:from-[#FFD700] hover:to-[#FFC800] text-black text-xs sm:text-sm md:text-base lg:text-lg font-black uppercase tracking-wider transition-all duration-500 transform hover:scale-105 hover:shadow-2xl overflow-hidden"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></span>
                <span className="relative flex items-center gap-2">
                  {t('bookNow')}
                  <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </button>
            </div>
          </div>

          {/* Secondary Bar - Menu & Social with Separator */}
          <div className={`relative border-t transition-all duration-500 ${scrolled ? 'border-[#FFC800]/20' : 'border-white/10'
            }`}>
            {/* Animated gradient line */}
            <div className={`absolute top-0 left-0 h-[1px] bg-gradient-to-r from-transparent via-[#FFC800] to-transparent transition-all duration-500 ${scrolled ? 'w-full opacity-100' : 'w-0 opacity-0'
              }`}></div>

            <div className="flex items-center justify-between px-4 sm:px-6 md:px-10 lg:px-16 py-3 sm:py-4 md:py-5">

              {/* Menu Button with Animation */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="group flex items-center gap-2 sm:gap-3 text-white hover:text-[#FFC800] transition-all duration-300 transform hover:scale-105"
              >
                <div className="relative">
                  <svg className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 transition-transform duration-300 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                  <div className="absolute inset-0 bg-[#FFC800]/20 rounded-full blur-lg scale-0 group-hover:scale-150 transition-transform duration-500"></div>
                </div>
                <span className="text-[10px] sm:text-base md:text-lg font-bold uppercase tracking-widest">{t('menu')}</span>
              </button>

              {/* Social Media Icons with Premium Animation */}
              <div className="flex items-center gap-5 sm:gap-4 md:gap-5 lg:gap-6">
                {/* Phone Icon with Text */}
                <a
                  href="tel:+21622420360"
                  className="group relative flex items-center gap-1.5 sm:gap-2 text-[#FFC800] sm:text-white hover:text-[#FFC800] transition-all duration-300 transform hover:scale-105 px-2 py-2 bg-[#FFC800]/10 sm:bg-transparent rounded-lg sm:rounded-none"
                  title="Call Us"
                >
                  <svg className="relative w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 00-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z" />
                  </svg>
                  <span className="relative text-[10px] sm:text-xs md:text-sm font-bold uppercase tracking-wider">{t('callUsNow')}</span>
                </a>

                {/* Facebook */}
                <a
                  href="https://www.facebook.com/share/1AXCENKzae/?mibextid=wwXIfr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative text-[#1877F2] transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 p-2"
                  title="Facebook"
                >
                  <div className="absolute inset-0 bg-[#1877F2]/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 scale-150"></div>
                  <svg className="relative w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 lg:w-9 lg:h-9" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>

                {/* Instagram */}
                <a
                  href="https://www.instagram.com/jasmin.locationdevoiture/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative text-[#E4405F] transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 p-2"
                  title="Instagram"
                >
                  <div className="absolute inset-0 bg-gradient-to-tr from-[#F58529] via-[#E4405F] to-[#C13584] rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 scale-150"></div>
                  <svg className="relative w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 lg:w-9 lg:h-9" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>

                {/* WhatsApp */}
                <a
                  href="https://wa.me/21622420360"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative text-[#25D366] transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 p-2"
                  title="WhatsApp"
                >
                  <div className="absolute inset-0 bg-[#25D366]/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 scale-150"></div>
                  <svg className="relative w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 lg:w-9 lg:h-9" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                </a>

                {/* Sign In with Divider */}
                <div className="flex items-center gap-2 sm:gap-3 md:gap-4 ml-1 sm:ml-2 md:ml-3">
                  <div className="h-8 sm:h-6 md:h-8 w-[1px] bg-gradient-to-b from-transparent via-white/30 to-transparent"></div>
                  <a
                    href="/login"
                    className="group relative text-[10px] sm:text-sm md:text-base lg:text-lg font-bold uppercase tracking-widest text-white hover:text-[#FFC800] transition-all duration-300 transform hover:scale-105"
                  >
                    <span className="relative">
                      {t('signIn')}
                      <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-gradient-to-r from-[#FFC800] to-[#FFD700] group-hover:w-full transition-all duration-500"></span>
                    </span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Sidebar */}
      {menuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm"
            onClick={() => setMenuOpen(false)}
          />

          {/* Sidebar */}
          <div className="fixed top-0 left-0 h-full w-[85%] sm:w-[400px] z-[60] bg-black overflow-y-auto">

            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-[#FFC800]/30">
              <div className="flex items-center gap-2">
                <Image
                  src="/logo2.png"
                  alt="Jasmin Cars"
                  width={50}
                  height={50}
                  className="w-10 h-10 object-contain"
                />
                <span className="text-white text-sm font-bold uppercase">MENU</span>
              </div>

              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setMenuOpen(false);
                }}
                className="flex items-center gap-2 px-3 py-2 bg-[#FFC800] hover:bg-[#FFD700] rounded-md transition-colors"
              >
                <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
                </svg>
                <span className="text-xs font-bold text-black uppercase">BACK</span>
              </button>
            </div>

            {/* Menu Items */}
            <div className="p-4">

              {/* Services */}
              <div className="mb-6">
                <h3 className="text-[#FFC800] text-xs font-bold uppercase mb-3 tracking-wider">SERVICES</h3>
                <div className="space-y-1">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setMenuOpen(false);
                      setTimeout(() => {
                        const el = document.querySelector('#services');
                        el?.scrollIntoView({ behavior: 'auto', block: 'start' });
                      }, 100);
                    }}
                    className="w-full text-left px-3 py-3 text-white hover:bg-[#FFC800]/20 rounded-md transition-all flex items-center gap-3"
                  >
                    <span className="text-xl">💍</span>
                    <span className="text-sm font-semibold">{t('weddingCars')}</span>
                  </button>

                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setMenuOpen(false);
                      setTimeout(() => {
                        const el = document.querySelector('#services');
                        el?.scrollIntoView({ behavior: 'auto', block: 'start' });
                      }, 100);
                    }}
                    className="w-full text-left px-3 py-3 text-white hover:bg-[#FFC800]/20 rounded-md transition-all flex items-center gap-3"
                  >
                    <span className="text-xl">✈️</span>
                    <span className="text-sm font-semibold">{t('airportTransfers')}</span>
                  </button>

                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setMenuOpen(false);
                      setTimeout(() => {
                        const el = document.querySelector('#fleet');
                        el?.scrollIntoView({ behavior: 'auto', block: 'start' });
                      }, 100);
                    }}
                    className="w-full text-left px-3 py-3 text-white hover:bg-[#FFC800]/20 rounded-md transition-all flex items-center gap-3"
                  >
                    <span className="text-xl">🚗</span>
                    <span className="text-sm font-semibold">{t('ourFleetMenu')}</span>
                  </button>
                </div>
              </div>

              {/* Company */}
              <div className="mb-6">
                <h3 className="text-[#FFC800] text-xs font-bold uppercase mb-3 tracking-wider">COMPANY</h3>
                <div className="space-y-1">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setMenuOpen(false);
                      setTimeout(() => {
                        const el = document.querySelector('#why-choose');
                        el?.scrollIntoView({ behavior: 'auto', block: 'start' });
                      }, 100);
                    }}
                    className="w-full text-left px-3 py-3 text-white hover:bg-[#FFC800]/20 rounded-md transition-all flex items-center gap-3"
                  >
                    <span className="text-xl">ℹ️</span>
                    <span className="text-sm font-semibold">{t('aboutUs')}</span>
                  </button>

               

                  <a
                    href="/login"
                    onClick={() => setMenuOpen(false)}
                    className="w-full text-left px-3 py-3 text-white hover:bg-[#FFC800]/20 rounded-md transition-all flex items-center gap-3"
                  >
                    <span className="text-xl">👔</span>
                    <span className="text-sm font-semibold">{t('businessAccounts')}</span>
                  </a>
                </div>
              </div>

              {/* Social */}
              <div className="border-t border-[#FFC800]/30 pt-4 mt-6">
                <h3 className="text-[#FFC800] text-xs font-bold uppercase mb-3 tracking-wider">FOLLOW US</h3>
                <div className="flex gap-3">
                  <a href="tel:+21622420360" className="p-2 bg-[#1a1a1a] hover:bg-[#FFC800] rounded-md transition-all">
                    <svg className="w-5 h-5 text-[#FFC800]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 00-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z" />
                    </svg>
                  </a>
                  <a href="https://www.facebook.com/share/1AXCENKzae/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" className="p-2 bg-[#1a1a1a] hover:bg-[#1877F2] rounded-md transition-all">
                    <svg className="w-5 h-5 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </a>
                  <a href="https://www.instagram.com/jasmin.locationdevoiture/" target="_blank" rel="noopener noreferrer" className="p-2 bg-[#1a1a1a] hover:bg-[#E4405F] rounded-md transition-all">
                    <svg className="w-5 h-5 text-[#E4405F]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  </a>
                  <a href="https://wa.me/21622420360" target="_blank" rel="noopener noreferrer" className="p-2 bg-[#1a1a1a] hover:bg-[#25D366] rounded-md transition-all">
                    <svg className="w-5 h-5 text-[#25D366]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Hero Section */}
      <section className="hero-section relative min-h-screen flex items-center justify-center overflow-hidden pt-32 sm:pt-36 md:pt-0">
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
        <div className="hero-content relative z-10 w-full px-4 sm:px-6 md:px-12 lg:px-16 xl:px-24 py-12 sm:py-16 md:py-20" key={i18n.language}>
          <div className="max-w-[1400px] mx-auto text-center md:text-left">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-bold text-white leading-tight mb-4 sm:mb-6 md:mb-8">
              {getTranslatedText(heroSettings?.title, 'Welcome to Jasmin Rent Cars')}
            </h1>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-white/90 mb-6 sm:mb-8 md:mb-12 max-w-2xl mx-auto md:mx-0 leading-relaxed">
              {getTranslatedText(heroSettings?.subtitle, 'Your Premium Car Rental Experience')}
            </p>
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
              { type: 'marriage', icon: '💍', image: '/mariage.png', title: t('wedding'), desc: t('weddingServiceDesc'), gradient: 'from-pink-900/20 to-purple-900/20' },
              { type: 'transfer', icon: '✈️', image: '/transfert.png', title: t('transferTitle'), desc: t('transferServiceDesc'), gradient: 'from-blue-900/20 to-cyan-900/20' }
            ].map((service) => (
              <div key={service.type}
                onClick={() => { setSelectedService(service.type as ServiceType); document.querySelector('#fleet')?.scrollIntoView({ behavior: 'smooth' }); }}
                className="service-card group cursor-pointer bg-[#1a1a1a] border border-gray-800 shadow-2xl hover:shadow-[0_0_40px_rgba(255,200,0,0.3)] transition-all duration-500 overflow-hidden"
              >
                <div className={`relative h-40 sm:h-52 md:h-64 lg:h-80 bg-gradient-to-br ${service.gradient} overflow-hidden border-b border-gray-800`}>
                  <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/0 transition-all duration-500">
                    {/* @ts-ignore */}
                    {service.image ? (
                      <div className="relative w-full h-full transform group-hover:scale-110 transition-transform duration-700">
                        <Image
                          src={service.image}
                          alt={service.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="text-[60px] sm:text-[80px] md:text-[100px] lg:text-[140px] transform group-hover:scale-125 transition-transform duration-700">{service.icon}</div>
                    )}
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
      {/* Fleet Section */}
      <section id="fleet" className="py-12 sm:py-16 md:py-24 bg-[#0a0a0a]">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-3 sm:mb-4 md:mb-6 uppercase tracking-wide">{t('ourPremiumFleet')}</h2>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-gray-300 mb-4 sm:mb-6 md:mb-10">
              {selectedService ? (
                <>
                  {filteredCars.length} {t('luxuryVehiclesFor')} {selectedService === 'marriage' ? t('weddingsSpecialEvents') : t('airportLocationTransfers')}
                </>
              ) : (
                t('selectServiceToViewFleet') || "Select a service to view our fleet"
              )}
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
          ) : !selectedService ? (
            <div className="text-center py-12 sm:py-20 md:py-32 bg-[#1a1a1a] shadow-lg border border-gray-800">
              <div className="text-5xl sm:text-6xl md:text-8xl mb-4 sm:mb-6 md:mb-8">👆</div>
              <h3 className="text-lg sm:text-xl md:text-3xl font-bold text-white mb-3 sm:mb-4 md:mb-6 uppercase tracking-wide">{t('chooseService')}</h3>
              <p className="text-gray-300 text-xs sm:text-sm md:text-lg max-w-2xl mx-auto leading-relaxed px-4">
                {t('selectServiceDesc') || "Please select a service above to view available vehicles."}
              </p>
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
        {/* CTA Buttons Section */}
        <section className="relative py-12 sm:py-16 md:py-20 bg-gradient-to-b from-[#0a0a0a] to-[#000000]">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 md:gap-8 justify-center items-center">
              <button
                onClick={() => setIsSpinWheelOpen(true)}
                className="group relative inline-flex items-center justify-center gap-3 px-6 sm:px-8 md:px-12 lg:px-16 py-4 sm:py-5 md:py-6 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 hover:from-purple-700 hover:via-pink-700 hover:to-purple-700 text-white text-sm sm:text-base md:text-lg lg:text-xl font-black uppercase tracking-wider transition-all duration-500 transform hover:scale-105 shadow-2xl hover:shadow-purple-500/50 overflow-hidden w-full sm:w-auto"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></span>
                <span className="relative text-2xl sm:text-3xl md:text-4xl">🎁</span>
                <span className="relative">{t('giftOffer')}</span>
              </button>
         
            </div>
          </div>
        </section>
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
                { title: t('company'), links: [ { label: t('servicesFooter'), href: '#fleet' }, { label: t('fleet'), href: '#fleet' }, { label: t('careers'), href: '/login' }] },
                { title: t('about'), links: [{ label: t('ourStory'), href: '#' }, { label: t('accreditations'), href: '#' }, { label: t('signUpFooter'), href: '/login' }] },
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
