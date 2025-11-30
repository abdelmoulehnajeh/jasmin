'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import CarCard from './CarCard';
import BookingModal from './modals/BookingModal';
import LanguageSelector from './ui/LanguageSelector';
import { Car } from '@/types';

gsap.registerPlugin(ScrollTrigger);

interface LandingPageProps {
  cars: Car[];
}

type ServiceType = 'marriage' | 'transfer';

export default function LandingPage({ cars }: LandingPageProps) {
  const { t, i18n } = useTranslation();
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<ServiceType>('marriage');
  const [showSignupModal, setShowSignupModal] = useState(false);

  // Filter cars by service type
  const filteredCars = cars.filter(car => car.service_type === selectedService);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate each car from the horizon
      filteredCars.forEach((_, index) => {
        const carElement = document.querySelector(`[data-car-index="${index}"]`);
        if (carElement) {
          gsap.fromTo(
            carElement,
            {
              y: '200vh',
              scale: 0.2,
              opacity: 0,
            },
            {
              y: 0,
              scale: 1,
              opacity: 1,
              scrollTrigger: {
                trigger: carElement,
                start: 'top bottom',
                end: 'center center',
                scrub: 2,
              },
            }
          );

          gsap.to(carElement, {
            y: '-50vh',
            scale: 0.8,
            opacity: 0,
            scrollTrigger: {
              trigger: carElement,
              start: 'center center',
              end: 'top top',
              scrub: 2,
            },
          });
        }
      });
    });

    return () => ctx.revert();
  }, [filteredCars]);

  const handleCarClick = (car: Car) => {
    setSelectedCar(car);
    setIsModalOpen(true);
  };

  const handleGetStarted = () => {
    setShowSignupModal(true);
  };

  return (
    <div className="relative bg-black min-h-screen overflow-x-hidden">
      {/* Highway Road Background - Animated */}
      <div className="fixed inset-0 z-0">
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse at center, rgba(255, 102, 0, 0.1) 0%, transparent 70%),
              linear-gradient(to bottom, #000 0%, #0a0a0a 50%, #000 100%)
            `,
          }}
        />
        
        {/* Road with perspective */}
        <div
          className="absolute inset-0"
          style={{
            background: `
              repeating-linear-gradient(
                0deg,
                transparent,
                transparent 120px,
                rgba(255, 102, 0, 0.3) 120px,
                rgba(255, 102, 0, 0.3) 130px,
                transparent 130px,
                transparent 250px
              )
            `,
            transform: 'perspective(600px) rotateX(60deg)',
            transformOrigin: 'center bottom',
            animation: 'roadMove 4s linear infinite',
          }}
        />

        {/* Side lines */}
        <div className="absolute left-[20%] top-0 w-1 h-full bg-gradient-to-b from-transparent via-gold-500/50 to-transparent" />
        <div className="absolute right-[20%] top-0 w-1 h-full bg-gradient-to-b from-transparent via-gold-500/50 to-transparent" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-xl border-b border-gold-500/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-gold-500 to-burgundy-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 sm:w-7 sm:h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"/>
                  <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6a1 1 0 001 1h.05a2.5 2.5 0 014.9 0h.05a1 1 0 001-1v-4.5a1 1 0 00-.293-.707l-2-2A1 1 0 0017 7h-3z"/>
                </svg>
              </div>
              <div>
                <h1 className="text-lg sm:text-2xl font-black text-white tracking-wider">VELOCITY</h1>
                <p className="text-[8px] sm:text-xs text-gold-500 tracking-widest hidden sm:block">{t('heroSubtitle')}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-6">
              <LanguageSelector />
              <a href="/login" className="text-gray-300 hover:text-gold-500 transition-colors font-bold text-xs sm:text-base hidden sm:inline">{t('login').toUpperCase()}</a>
              <a href="/login" className="text-gray-300 hover:text-gold-500 transition-colors font-bold text-xs sm:hidden">LOGIN</a>
              <button
                onClick={handleGetStarted}
                className="px-3 py-2 sm:px-6 sm:py-3 bg-gradient-to-r from-gold-600 to-burgundy-600 hover:from-gold-700 hover:to-burgundy-700 text-white font-black text-xs sm:text-base rounded-lg transform hover:scale-105 transition-all"
              >
                {t('getStarted')}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 min-h-screen flex items-center justify-center px-4 sm:px-6 pt-20 sm:pt-0">
        <div className="text-center max-w-5xl">
          <div className="mb-6 sm:mb-8">
            <div className="inline-block px-4 py-2 sm:px-6 sm:py-3 bg-gold-500/10 border-2 border-gold-500 rounded-full backdrop-blur-sm">
              <span className="text-gold-500 font-black tracking-[0.2em] sm:tracking-[0.3em] text-xs sm:text-sm">{t('selectService')}</span>
            </div>
          </div>

          <h1 className="text-4xl sm:text-7xl md:text-[10rem] font-black text-white mb-6 sm:mb-8 leading-none">
            {t('heroTitle').split(' ')[0]}
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-500 via-burgundy-500 to-gold-600">
              {t('heroTitle').split(' ').slice(1).join(' ')}
            </span>
          </h1>

          <p className="text-base sm:text-2xl md:text-3xl text-gray-300 mb-6 sm:mb-8 font-light leading-relaxed px-2">
            {t('heroDescription')}
            <br />
            <span className="text-gold-500 font-bold">{t('heroDescriptionHighlight')}</span>
          </p>

          {/* Service Selection Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 mb-8 sm:mb-12 px-2">
            <button
              onClick={() => setSelectedService('marriage')}
              className={`group px-6 py-4 sm:px-12 sm:py-8 rounded-2xl font-black text-lg sm:text-2xl transition-all transform hover:scale-105 ${
                selectedService === 'marriage'
                  ? 'bg-gradient-to-r from-gold-600 to-burgundy-600 text-white shadow-2xl shadow-gold-900/50'
                  : 'bg-gray-900 border-2 border-gray-700 text-gray-400 hover:border-gold-500'
              }`}
            >
              <div className="text-3xl sm:text-5xl mb-2 sm:mb-3">💍</div>
              <div>{t('marriageService')}</div>
              <div className="text-xs sm:text-sm font-normal mt-1 sm:mt-2 opacity-80">{t('marriageDesc')}</div>
            </button>

            <button
              onClick={() => setSelectedService('transfer')}
              className={`group px-6 py-4 sm:px-12 sm:py-8 rounded-2xl font-black text-lg sm:text-2xl transition-all transform hover:scale-105 ${
                selectedService === 'transfer'
                  ? 'bg-gradient-to-r from-gold-600 to-burgundy-600 text-white shadow-2xl shadow-gold-900/50'
                  : 'bg-gray-900 border-2 border-gray-700 text-gray-400 hover:border-gold-500'
              }`}
            >
              <div className="text-3xl sm:text-5xl mb-2 sm:mb-3">✈️</div>
              <div>{t('transferService')}</div>
              <div className="text-xs sm:text-sm font-normal mt-1 sm:mt-2 opacity-80">{t('transferDesc')}</div>
            </button>
          </div>

          <button
            onClick={() => {
              document.querySelector('[data-car-index="0"]')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="group px-6 py-3 sm:px-12 sm:py-6 bg-gradient-to-r from-gold-600 to-burgundy-600 hover:from-gold-700 hover:to-burgundy-700 text-white font-black text-base sm:text-2xl rounded-xl transform hover:scale-110 transition-all shadow-2xl shadow-gold-900/50 flex items-center space-x-2 sm:space-x-4 mx-auto"
          >
            <span>{t('startScrolling')}</span>
            <svg className="w-6 h-6 sm:w-8 sm:h-8 group-hover:translate-y-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </button>

          <div className="mt-10 sm:mt-16 grid grid-cols-3 gap-3 sm:gap-8 px-2">
            {[
              { num: t('statReal'), label: t('statRealLabel') },
              { num: t('statOne'), label: t('statOneLabel') },
              { num: t('statSmooth'), label: t('statSmoothLabel') },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-2xl sm:text-5xl font-black text-gold-500 mb-1 sm:mb-2">{stat.num}</div>
                <div className="text-[10px] sm:text-sm text-gray-400 font-bold tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HIGHWAY - Cars appear ONE BY ONE from horizon */}
      <section className="relative z-10 py-10 sm:py-20">
        <div className="text-center mb-12 sm:mb-20 px-4 sm:px-6">
          <div className="inline-block px-4 py-2 sm:px-6 sm:py-3 bg-gold-500/10 border-2 border-gold-500 rounded-full backdrop-blur-sm mb-6 sm:mb-8">
            <span className="text-gold-500 font-black tracking-[0.2em] sm:tracking-[0.3em] text-xs sm:text-sm">{t('ourFleet')}</span>
          </div>
          <h2 className="text-3xl sm:text-7xl font-black text-white mb-3 sm:mb-4 px-2">
            {t('premiumCars').split(' ')[0]} <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-500 to-burgundy-500">{t('premiumCars').split(' ')[1]}</span>
          </h2>
          <p className="text-base sm:text-2xl text-gray-400">{t('watchArrive')}</p>
        </div>

        {/* Each car takes full screen height */}
        <div className="space-y-[50vh] sm:space-y-[100vh]">
          {filteredCars.map((car, index) => (
            <div
              key={car.id}
              data-car-index={index}
              className="min-h-[70vh] sm:min-h-screen flex items-center justify-center px-4 sm:px-6"
            >
              <div className="max-w-5xl w-full">
                {/* Car number badge */}
                <div className="text-center mb-4 sm:mb-8">
                  <div className="inline-block px-4 py-2 sm:px-8 sm:py-4 bg-gold-500/20 border-2 border-gold-500 rounded-2xl backdrop-blur-sm">
                    <span className="text-gold-500 font-black text-3xl sm:text-6xl tracking-wider">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>
                </div>

                {/* Car name */}
                <h3 className="text-2xl sm:text-6xl font-black text-white text-center mb-6 sm:mb-12 px-2">
                  {car.brand} <span className="text-gold-500">{car.model}</span>
                </h3>

                {/* Car card */}
                <div className="transform hover:scale-105 transition-all duration-500">
                  <CarCard car={car} onBook={() => handleCarClick(car)} />
                </div>

                {/* Speed indicator */}
                <div className="text-center mt-4 sm:mt-8">
                  <div className="inline-flex items-center space-x-2 sm:space-x-3 px-4 py-2 sm:px-6 sm:py-3 bg-black/50 border border-gold-500/30 rounded-full backdrop-blur-sm">
                    <div className="w-2 h-2 sm:w-3 sm:h-3 bg-gold-500 rounded-full animate-pulse" />
                    <span className="text-gray-400 font-bold text-xs sm:text-base">{t('onTheHighway')}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 py-16 sm:py-32 bg-gradient-to-b from-black via-gray-950 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-12">
            {[
              { icon: '💍', title: t('featureMarriageTitle'), desc: t('featureMarriageDesc') },
              { icon: '✈️', title: t('featureTransferTitle'), desc: t('featureTransferDesc') },
              { icon: '🏎️', title: t('featureLuxuryTitle'), desc: t('featureLuxuryDesc') },
            ].map((item, i) => (
              <div key={i} className="text-center group">
                <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-gold-500/20 hover:border-gold-500 rounded-3xl p-6 sm:p-12 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl hover:shadow-gold-900/50">
                  <div className="text-5xl sm:text-8xl mb-4 sm:mb-6">{item.icon}</div>
                  <h3 className="text-xl sm:text-3xl font-black text-white mb-3 sm:mb-4">{item.title}</h3>
                  <p className="text-gray-400 text-sm sm:text-lg leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 bg-black border-t-2 border-gold-500/20 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <div className="flex items-center justify-center space-x-2 sm:space-x-3 mb-3 sm:mb-4">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-gold-500 to-burgundy-600 rounded-lg" />
            <span className="text-white font-black text-xl sm:text-2xl tracking-wider">VELOCITY</span>
          </div>
          <p className="text-gray-500 text-xs sm:text-base">&copy; 2024 Velocity Motors. {t('heroSubtitle')}</p>
        </div>
      </footer>

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

      {/* Signup Modal */}
      {showSignupModal && (
        <SignupModal
          isOpen={showSignupModal}
          onClose={() => setShowSignupModal(false)}
          selectedService={selectedService}
        />
      )}

      <style jsx>{`
        @keyframes roadMove {
          0% {
            background-position: 0 0;
          }
          100% {
            background-position: 0 250px;
          }
        }
      `}</style>
    </div>
  );
}

// Signup Modal Component
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
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `
            mutation Signup($input: SignupInput!) {
              signup(input: $input) {
                token
                user {
                  id
                  email
                  full_name
                  role
                }
              }
            }
          `,
          variables: {
            input: formData,
          },
        }),
      });

      const data = await response.json();

      if (data.errors) {
        setError(data.errors[0].message);
      } else {
        // Store token and user data
        localStorage.setItem('token', data.data.signup.token);
        localStorage.setItem('user', JSON.stringify(data.data.signup.user));
        
        // Redirect to home or dashboard
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
        <div className="relative bg-gray-800 rounded-xl shadow-2xl max-w-md w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10"
          >
            <svg className="w-6 h-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>

          <h2 className="text-2xl sm:text-3xl font-black text-white mb-4 sm:mb-6">{t('signup')}</h2>

          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-500 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            <div>
              <label className="block text-gray-400 mb-2 text-sm sm:text-base">{t('fullName')}</label>
              <input
                type="text"
                required
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                className="w-full bg-gray-700 text-white px-3 py-2 sm:px-4 sm:py-3 rounded-lg focus:ring-2 focus:ring-gold-500 outline-none text-sm sm:text-base"
              />
            </div>

            <div>
              <label className="block text-gray-400 mb-2 text-sm sm:text-base">{t('email')}</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-gray-700 text-white px-3 py-2 sm:px-4 sm:py-3 rounded-lg focus:ring-2 focus:ring-gold-500 outline-none text-sm sm:text-base"
              />
            </div>

            <div>
              <label className="block text-gray-400 mb-2 text-sm sm:text-base">{t('phone')}</label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-gray-700 text-white px-3 py-2 sm:px-4 sm:py-3 rounded-lg focus:ring-2 focus:ring-gold-500 outline-none text-sm sm:text-base"
              />
            </div>

            <div>
              <label className="block text-gray-400 mb-2 text-sm sm:text-base">{t('password')}</label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full bg-gray-700 text-white px-3 py-2 sm:px-4 sm:py-3 rounded-lg focus:ring-2 focus:ring-gold-500 outline-none text-sm sm:text-base"
              />
            </div>

            <div>
              <label className="block text-gray-400 mb-2 text-sm sm:text-base">{t('selectService')}</label>
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, service_type: 'marriage' })}
                  className={`p-3 sm:p-4 rounded-lg font-bold transition-all text-sm sm:text-base ${
                    formData.service_type === 'marriage'
                      ? 'bg-gold-600 text-white'
                      : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                  }`}
                >
                  💍 {t('marriage')}
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, service_type: 'transfer' })}
                  className={`p-3 sm:p-4 rounded-lg font-bold transition-all text-sm sm:text-base ${
                    formData.service_type === 'transfer'
                      ? 'bg-gold-600 text-white'
                      : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                  }`}
                >
                  ✈️ {t('transfer')}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 sm:py-3 bg-gradient-to-r from-gold-600 to-burgundy-600 hover:from-gold-700 hover:to-burgundy-700 text-white font-black rounded-lg transition-all disabled:opacity-50 text-sm sm:text-base"
            >
              {loading ? t('loading') : t('signup')}
            </button>
          </form>

          <p className="mt-4 text-center text-gray-400 text-xs sm:text-sm">
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