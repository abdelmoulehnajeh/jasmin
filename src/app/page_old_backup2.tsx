'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import CarCard from '@/components/CarCard';
import BookingModal from '@/components/modals/BookingModal';
import LanguageSelector from '@/components/ui/LanguageSelector';
import { Car } from '@/types';

gsap.registerPlugin(ScrollTrigger);

type ServiceType = 'marriage' | 'transfer';

interface HeroSettings {
  video_url: string;
  mobile_image_url: string | null;
  desktop_image_url: string | null;
  title: string;
  subtitle: string;
}

export default function HomePage() {
  const { t, i18n } = useTranslation();
  const [cars, setCars] = useState<Car[]>([]);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<ServiceType>('marriage');
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [heroSettings, setHeroSettings] = useState<HeroSettings | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Fetch hero settings
    const fetchHeroSettings = async () => {
      try {
        const response = await fetch('/api/graphql', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query: `query GetHeroSettings($language: String) {
              heroSettings(language: $language) {
                video_url
                mobile_image_url
                desktop_image_url
                title
                subtitle
              }
            }`,
            variables: { language: i18n.language || 'en' },
          }),
        });

        const data = await response.json();
        if (data.data?.heroSettings) {
          setHeroSettings(data.data.heroSettings);
        }
      } catch (error) {
        console.error('Failed to fetch hero settings:', error);
      }
    };

    fetchHeroSettings();
  }, [i18n.language]);

  useEffect(() => {
    // Fetch cars from GraphQL API
    const fetchCars = async () => {
      try {
        const response = await fetch('/api/graphql', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query: `query GetCars($language: String) {
              cars(language: $language) {
                id name brand model year price_per_day description
                image_base64 gallery model_3d_url status service_type features
                specs { engine transmission fuelType seats color }
                total_count available_count average_rating total_ratings
              }
            }`,
            variables: { language: i18n.language || 'en' },
          }),
        });

        const data = await response.json();
        if (data.data?.cars) {
          setCars(data.data.cars);
        }
      } catch (error) {
        console.error('Failed to fetch cars:', error);
      }
    };

    fetchCars();
  }, [i18n.language]);

  const filteredCars = cars.filter(car => car.service_type === selectedService);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero Title Animation - subtle fade in
      gsap.from('.hero-title', {
        opacity: 0,
        y: 30,
        duration: 1.2,
        ease: 'power2.out',
        delay: 0.3,
      });

      // Hero Subtitle Animation
      gsap.from('.hero-subtitle', {
        opacity: 0,
        y: 20,
        duration: 1,
        ease: 'power2.out',
        delay: 0.6,
      });

      // CTA Buttons Animation
      gsap.from('.cta-button', {
        opacity: 0,
        y: 20,
        duration: 0.8,
        ease: 'power2.out',
        delay: 0.9,
        stagger: 0.15,
      });

      // Service Cards Animation - simple fade and slide
      gsap.from('.service-card', {
        opacity: 0,
        y: 40,
        duration: 0.8,
        ease: 'power2.out',
        stagger: 0.15,
        scrollTrigger: {
          trigger: '.service-card',
          start: 'top 80%',
        },
      });

      // Cars Animation - simple fade in
      filteredCars.forEach((_, index) => {
        const carElement = document.querySelector(`[data-car-index="${index}"]`);
        if (carElement) {
          gsap.from(carElement, {
            opacity: 0,
            y: 30,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: carElement,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          });
        }
      });

      // Feature Cards - simple fade in
      gsap.from('.feature-card', {
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: 'power2.out',
        stagger: 0.15,
        scrollTrigger: {
          trigger: '.feature-card',
          start: 'top 80%',
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, [filteredCars]);

  const handleCarClick = (car: Car) => {
    setSelectedCar(car);
    setIsModalOpen(true);
  };

  const handleGetStarted = () => {
    setShowSignupModal(true);
  };

  const isVideoUrl = (url: string) => {
    return url.match(/\.(mp4|webm|ogg)$/i) && !url.includes('youtube') && !url.includes('vimeo');
  };

  return (
    <div ref={containerRef} className="relative min-h-screen overflow-x-hidden bg-white">

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-gold-500 to-gold-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"/>
                  <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6a1 1 0 001 1h.05a2.5 2.5 0 014.9 0h.05a1 1 0 001-1v-4.5a1 1 0 00-.293-.707l-2-2A1 1 0 0017 7h-3z"/>
                </svg>
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Jasmin Rent Cars</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4 sm:space-x-6">
              <LanguageSelector />
              <a href="/login" className="text-gray-700 hover:text-gold-600 transition-colors font-medium">
                {t('login')}
              </a>
              <button
                onClick={handleGetStarted}
                className="px-4 py-2 sm:px-6 sm:py-2.5 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-white font-semibold rounded-lg transition-all"
              >
                {t('getStarted')}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* CINEMATIC HERO with Full-Screen Video Background */}
      <section className="relative h-screen w-full overflow-hidden">
        {/* Full-Screen Video Background - ALWAYS VISIBLE */}
        <div className="absolute inset-0 w-full h-full">
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src="https://www.gocarz.co.uk/cd-content/themes/gocarz2019/video/gocarz01s2.mp4" type="video/mp4" />
          </video>

          {/* Cinematic Overlay with Gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" />

          {/* Animated Gold Shimmer Effect */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0 animate-pulse" style={{
              background: 'linear-gradient(45deg, transparent 30%, rgba(255,215,0,0.1) 50%, transparent 70%)',
              backgroundSize: '200% 200%',
              animation: 'shimmer 3s infinite linear'
            }} />
          </div>
        </div>

        {/* Hero Content with Beautiful Typography */}
        <div className="relative h-full flex items-center justify-center px-4 sm:px-6 z-10">
          <div className="text-center max-w-6xl">
            {/* Decorative Line Above */}
            <div className="hero-title mb-8 flex items-center justify-center gap-4">
              <div className="h-px w-12 sm:w-24 bg-gradient-to-r from-transparent to-gold-500" />
              <span className="text-gold-400 text-sm sm:text-base uppercase tracking-[0.3em] font-light">Premium Luxury</span>
              <div className="h-px w-12 sm:w-24 bg-gradient-to-l from-transparent to-gold-500" />
            </div>

            {/* Main Heading with Elegant Animation */}
            <h1 className="hero-title mb-6">
              <span className="block text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white leading-none mb-2" style={{
                textShadow: '0 4px 20px rgba(0,0,0,0.5), 0 0 40px rgba(255,215,0,0.3)'
              }}>
                VELOCITY HIGHWAY
              </span>
              <span className="block text-2xl sm:text-3xl md:text-4xl font-light text-gold-400 tracking-wider">
                Luxury Car Rental
              </span>
            </h1>

            {/* Beautiful Subtitle */}
            <p className="hero-subtitle text-lg sm:text-xl md:text-2xl text-white/90 mb-12 font-light leading-relaxed max-w-3xl mx-auto" style={{
              textShadow: '0 2px 10px rgba(0,0,0,0.5)'
            }}>
              Experience the ultimate driving experience with our exclusive fleet of premium vehicles
            </p>

            {/* Elegant CTA Buttons */}
            <div className="cta-button flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 mb-16">
              <button
                onClick={() => {
                  document.querySelector('[data-section="services"]')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="group relative px-12 py-4 bg-gold-500 hover:bg-gold-600 text-white font-bold text-lg rounded-none transform hover:scale-105 transition-all duration-300 overflow-hidden"
                style={{
                  boxShadow: '0 10px 40px rgba(255,215,0,0.4)'
                }}
              >
                <span className="relative z-10 tracking-wider">EXPLORE FLEET</span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
              </button>
              <button
                onClick={handleGetStarted}
                className="group relative px-12 py-4 border-2 border-white hover:bg-white hover:text-black text-white font-bold text-lg rounded-none transform hover:scale-105 transition-all duration-300"
                style={{
                  boxShadow: '0 10px 40px rgba(255,255,255,0.2)'
                }}
              >
                <span className="relative z-10 tracking-wider">BOOK NOW</span>
              </button>
            </div>

            {/* Scroll Indicator with Animation */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
              <div className="flex flex-col items-center gap-3 animate-bounce">
                <span className="text-white/60 text-xs uppercase tracking-[0.3em]">Scroll Down</span>
                <div className="w-6 h-10 border-2 border-white/40 rounded-full flex items-start justify-center p-2">
                  <div className="w-1 h-3 bg-white/60 rounded-full animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section with Modern Design */}
      <section data-section="services" className="relative z-10 py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Section Header */}
          <div className="text-center mb-20">
            <span className="inline-block px-4 py-2 bg-gold-100 text-gold-700 rounded-full text-sm font-semibold mb-4 uppercase tracking-wider">
              Our Services
            </span>
            <h2 className="text-5xl sm:text-6xl font-extrabold text-gray-900 mb-6">
              {t('chooseYourExperience')}
            </h2>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto">
              Premium luxury car rental for your special moments
            </p>
          </div>

          {/* SERVICE TYPE CARDS - Larger and More Impactful */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Marriage Service Card */}
            <button
              onClick={() => setSelectedService('marriage')}
              className={`service-card group relative overflow-hidden rounded-3xl transition-all duration-500 transform hover:scale-105 hover:shadow-2xl ${
                selectedService === 'marriage'
                  ? 'shadow-2xl'
                  : 'shadow-lg hover:shadow-xl'
              }`}
            >
              {/* Card Background */}
              <div className={`relative p-12 h-full ${
                selectedService === 'marriage'
                  ? 'bg-gradient-to-br from-gold-500 via-gold-600 to-yellow-600'
                  : 'bg-gradient-to-br from-gray-50 to-white'
              }`}>
                {/* Icon */}
                <div className={`text-8xl mb-6 transition-transform duration-300 group-hover:scale-110 ${
                  selectedService === 'marriage' ? 'filter drop-shadow-lg' : ''
                }`}>
                  💍
                </div>

                {/* Content */}
                <h3 className={`text-4xl font-bold mb-4 ${
                  selectedService === 'marriage' ? 'text-white' : 'text-gray-900'
                }`}>
                  {t('marriage')}
                </h3>
                <p className={`text-lg leading-relaxed ${
                  selectedService === 'marriage' ? 'text-white/90' : 'text-gray-600'
                }`}>
                  {t('marriageDesc')}
                </p>

                {/* Selection Indicator */}
                {selectedService === 'marriage' && (
                  <div className="absolute top-6 right-6">
                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-gold-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                )}
              </div>
            </button>

            {/* Transfer Service Card */}
            <button
              onClick={() => setSelectedService('transfer')}
              className={`service-card group relative overflow-hidden rounded-3xl transition-all duration-500 transform hover:scale-105 hover:shadow-2xl ${
                selectedService === 'transfer'
                  ? 'shadow-2xl'
                  : 'shadow-lg hover:shadow-xl'
              }`}
            >
              {/* Card Background */}
              <div className={`relative p-12 h-full ${
                selectedService === 'transfer'
                  ? 'bg-gradient-to-br from-gold-500 via-gold-600 to-yellow-600'
                  : 'bg-gradient-to-br from-gray-50 to-white'
              }`}>
                {/* Icon */}
                <div className={`text-8xl mb-6 transition-transform duration-300 group-hover:scale-110 ${
                  selectedService === 'transfer' ? 'filter drop-shadow-lg' : ''
                }`}>
                  ✈️
                </div>

                {/* Content */}
                <h3 className={`text-4xl font-bold mb-4 ${
                  selectedService === 'transfer' ? 'text-white' : 'text-gray-900'
                }`}>
                  {t('transfer')}
                </h3>
                <p className={`text-lg leading-relaxed ${
                  selectedService === 'transfer' ? 'text-white/90' : 'text-gray-600'
                }`}>
                  {t('transferDesc')}
                </p>

                {/* Selection Indicator */}
                {selectedService === 'transfer' && (
                  <div className="absolute top-6 right-6">
                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-gold-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                )}
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* Cars Section - Premium Display */}
      <section className="relative z-10 py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Section Header */}
          <div className="text-center mb-20">
            <span className="inline-block px-4 py-2 bg-gold-100 text-gold-700 rounded-full text-sm font-semibold mb-4 uppercase tracking-wider">
              Our Fleet
            </span>
            <h2 className="text-5xl sm:text-6xl font-extrabold text-gray-900 mb-6">
              {t('premiumFleet')}
            </h2>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto">
              {t('exploreOurCars')}
            </p>
          </div>

          {/* Cars Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCars.map((car, index) => (
              <div
                key={car.id}
                data-car-index={index}
                className="transform transition-all duration-500 hover:scale-105"
              >
                <CarCard car={car} onBook={() => handleCarClick(car)} />
              </div>
            ))}
          </div>

          {filteredCars.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-600 text-xl">{t('noCarsAvailable')}</p>
            </div>
          )}
        </div>
      </section>

      {/* Features Section - Why Choose Us */}
      <section className="relative z-10 py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Section Header */}
          <div className="text-center mb-20">
            <span className="inline-block px-4 py-2 bg-gold-100 text-gold-700 rounded-full text-sm font-semibold mb-4 uppercase tracking-wider">
              Why Choose Us
            </span>
            <h2 className="text-5xl sm:text-6xl font-extrabold text-gray-900 mb-6">
              {t('whyChooseUs')}
            </h2>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto">
              Experience the difference with our premium service
            </p>
          </div>

          {/* Features Grid - Modern Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: '🌟',
                title: t('premiumQuality'),
                desc: t('premiumQualityDesc'),
                color: 'from-yellow-400 to-gold-500'
              },
              {
                icon: '⚡',
                title: t('fastBooking'),
                desc: t('fastBookingDesc'),
                color: 'from-gold-400 to-amber-500'
              },
              {
                icon: '🔒',
                title: t('securePayment'),
                desc: t('securePaymentDesc'),
                color: 'from-amber-400 to-gold-600'
              },
            ].map((item, i) => (
              <div key={i} className="feature-card group">
                <div className="relative bg-white rounded-3xl p-10 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl shadow-lg border border-gray-100 overflow-hidden">
                  {/* Gradient Background on Hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />

                  {/* Icon with Gradient Background */}
                  <div className="relative mb-6">
                    <div className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br ${item.color} text-white text-4xl transform group-hover:scale-110 transition-transform duration-300`}>
                      {item.icon}
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-gold-600 transition-colors duration-300">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-lg">
                    {item.desc}
                  </p>

                  {/* Decorative Element */}
                  <div className={`absolute -bottom-2 -right-2 w-24 h-24 bg-gradient-to-br ${item.color} opacity-5 rounded-full transform group-hover:scale-150 transition-transform duration-500`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Premium Footer */}
      <footer className="relative z-10 bg-gradient-to-b from-gray-900 to-black py-16 border-t border-gold-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            {/* Brand Column */}
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-gold-500 to-gold-600 rounded-xl flex items-center justify-center">
                  <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"/>
                    <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6a1 1 0 001 1h.05a2.5 2.5 0 014.9 0h.05a1 1 0 001-1v-4.5a1 1 0 00-.293-.707l-2-2A1 1 0 0017 7h-3z"/>
                  </svg>
                </div>
                <span className="text-white font-bold text-2xl">Jasmin Rent Cars</span>
              </div>
              <p className="text-gray-400 text-lg mb-6 max-w-md leading-relaxed">
                {t('footerTagline')}
              </p>
              {/* Social Links */}
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-gold-500 rounded-full flex items-center justify-center transition-colors">
                  <span className="text-white text-sm">f</span>
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-gold-500 rounded-full flex items-center justify-center transition-colors">
                  <span className="text-white text-sm">in</span>
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-gold-500 rounded-full flex items-center justify-center transition-colors">
                  <span className="text-white text-sm">ig</span>
                </a>
              </div>
            </div>

            {/* Quick Links Column */}
            <div>
              <h3 className="text-white font-bold text-lg mb-6">{t('quickLinks')}</h3>
              <ul className="space-y-3">
                <li>
                  <a href="#services" className="text-gray-400 hover:text-gold-500 transition-colors text-lg">
                    {t('services')}
                  </a>
                </li>
                <li>
                  <a href="#fleet" className="text-gray-400 hover:text-gold-500 transition-colors text-lg">
                    {t('ourFleet')}
                  </a>
                </li>
                <li>
                  <a href="/login" className="text-gray-400 hover:text-gold-500 transition-colors text-lg">
                    {t('login')}
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact Column */}
            <div>
              <h3 className="text-white font-bold text-lg mb-6">{t('contact')}</h3>
              <ul className="space-y-3">
                <li className="text-gray-400 text-lg">contact@velocityhighway.com</li>
                <li className="text-gray-400 text-lg">+1 234 567 8900</li>
                <li className="text-gray-400 text-lg">24/7 Support</li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="text-center pt-8 border-t border-gray-800">
            <p className="text-gray-500 text-lg">
              &copy; 2024 Jasmin Rent Cars. {t('allRightsReserved')}
            </p>
          </div>
        </div>
      </footer>

      {/* Signup Modal */}
      {showSignupModal && (
        <SignupModal
          isOpen={showSignupModal}
          onClose={() => setShowSignupModal(false)}
          selectedService={selectedService}
        />
      )}

      {/* Booking Modal */}
      {selectedCar && (
        <BookingModal
          car={selectedCar}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedCar(null);
          }}
        />
      )}

      {/* Global Animations */}
      <style jsx global>{`
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease-out;
        }
      `}</style>
    </div>
  );
}

// Signup Modal Component (reuse from original)
function SignupModal({ isOpen, onClose, selectedService }: { isOpen: boolean; onClose: () => void; selectedService: ServiceType }) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    full_name: '',
    phone: '',
    service_type: selectedService,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `
            mutation Signup($input: SignupInput!) {
              signup(input: $input) {
                token
                user { id email full_name role }
              }
            }
          `,
          variables: { input: formData },
        }),
      });

      const data = await response.json();
      if (data.errors) {
        setError(data.errors[0].message);
      } else {
        localStorage.setItem('token', data.data.signup.token);
        localStorage.setItem('user', JSON.stringify(data.data.signup.user));
        window.location.href = '/';
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] overflow-y-auto">
      <div className="fixed inset-0 bg-black bg-opacity-75 transition-opacity" onClick={onClose}></div>
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-gray-800 rounded-xl shadow-2xl max-w-md w-full p-6 sm:p-8">
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>

          <h2 className="text-3xl font-black text-white mb-6">{t('signup')}</h2>

          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-500 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-400 mb-2">{t('fullName')}</label>
              <input
                type="text"
                required
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-gold-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-gray-400 mb-2">{t('email')}</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-gold-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-gray-400 mb-2">{t('phone')}</label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-gold-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-gray-400 mb-2">{t('password')}</label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-gold-500 outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-gold-600 to-burgundy-600 hover:from-gold-700 hover:to-burgundy-700 text-white font-black rounded-lg transition-all disabled:opacity-50"
            >
              {loading ? t('loading') : t('signup')}
            </button>
          </form>

          <p className="mt-4 text-center text-gray-400 text-sm">
            {t('alreadyHaveAccount')}{' '}
            <a href="/login" className="text-gold-500 hover:text-gold-400 font-bold">
              {t('login')}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
