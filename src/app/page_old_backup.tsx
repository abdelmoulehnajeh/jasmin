'use client';

import { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import CarCard from '@/components/CarCard';
import BookingModal from '@/components/modals/BookingModal';
import LanguageSelector from '@/components/ui/LanguageSelector';
import { Car } from '@/types';

type ServiceType = 'marriage' | 'transfer';

interface HeroSettings {
  video_url: string;
  title: string;
  subtitle: string;
}

export default function LandingPage() {
  const { t, i18n } = useTranslation();
  const [cars, setCars] = useState<Car[]>([]);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<ServiceType>('marriage');
  const [loading, setLoading] = useState(true);
  const [heroSettings, setHeroSettings] = useState<HeroSettings | null>(null);
  const [scrolled, setScrolled] = useState(false);

  const observerRef = useRef<IntersectionObserver | null>(null);

  // Booking form state
  const [bookingForm, setBookingForm] = useState({
    pickupLocation: '',
    dropoffLocation: '',
    pickupDate: '',
    pickupTime: '',
    serviceType: 'marriage' as ServiceType,
  });

  // Scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Intersection Observer for scroll animations
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -100px 0px' }
    );

    const elements = document.querySelectorAll('.animate-on-scroll');
    elements.forEach((el) => observerRef.current?.observe(el));

    return () => observerRef.current?.disconnect();
  }, [cars]);

  // Fetch hero settings and cars
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
                video_url
                title
                subtitle
              }
            }`,
            variables: { language: i18n.language || 'en' },
          }),
        });

        const result = await response.json();
        if (result.data?.cars) {
          setCars(result.data.cars);
        }
        if (result.data?.heroSettings) {
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

  // Filter cars by selected service
  const filteredCars = cars.filter(car => car.service_type === selectedService);

  const handleCarClick = (car: Car) => {
    setSelectedCar(car);
    setIsModalOpen(true);
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    document.querySelector('#services')?.scrollIntoView({ behavior: 'smooth' });
    setSelectedService(bookingForm.serviceType);
  };

  return (
    <div className="min-h-screen bg-white">
      <style jsx global>{`
        .animate-on-scroll {
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.6s ease-out, transform 0.6s ease-out;
        }

        .animate-in {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }

        .slide-in-left {
          opacity: 0;
          transform: translateX(-50px);
          transition: opacity 0.8s ease-out, transform 0.8s ease-out;
        }

        .slide-in-right {
          opacity: 0;
          transform: translateX(50px);
          transition: opacity 0.8s ease-out, transform 0.8s ease-out;
        }

        .fade-in {
          opacity: 0;
          transition: opacity 1s ease-out;
        }

        .scale-in {
          opacity: 0;
          transform: scale(0.95);
          transition: opacity 0.6s ease-out, transform 0.6s ease-out;
        }
      `}</style>

      {/* Navigation - Addison Lee Style */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-white shadow-md' : 'bg-transparent'
      }`}>
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 rounded flex items-center justify-center transition-colors ${
                scrolled ? 'bg-black' : 'bg-white'
              }`}>
                <svg className={`w-6 h-6 transition-colors ${scrolled ? 'text-white' : 'text-black'}`} fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"/>
                  <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6a1 1 0 001 1h.05a2.5 2.5 0 014.9 0h.05a1 1 0 001-1v-4.5a1 1 0 00-.293-.707l-2-2A1 1 0 0017 7h-3z"/>
                </svg>
              </div>
              <span className={`text-xl font-bold transition-colors ${
                scrolled ? 'text-black' : 'text-white'
              }`}>
                Jasmin Rent Cars
              </span>
            </div>

            {/* Right side */}
            <div className="flex items-center space-x-6">
              <LanguageSelector />
              <a
                href="/login"
                className={`text-sm font-medium transition-colors hidden md:block ${
                  scrolled ? 'text-gray-700 hover:text-black' : 'text-white hover:text-gray-200'
                }`}
              >
                Sign In
              </a>
              <button
                onClick={() => document.querySelector('#hero-form')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-6 py-2.5 bg-black text-white text-sm font-semibold rounded-full hover:bg-gray-800 transition-all hover:scale-105"
              >
                Get a Quote
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - Addison Lee Exact Style */}
      <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden">
        {/* Background Video/Image */}
        {heroSettings?.video_url ? (
          <div className="absolute inset-0 z-0">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            >
              <source src={heroSettings.video_url} type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />
          </div>
        ) : (
          <div className="absolute inset-0 z-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700" />
        )}

        <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12 py-32 w-full">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight fade-in animate-in">
              {heroSettings?.title || 'Book your premium car rental'}
            </h1>
            <p className="text-2xl md:text-3xl text-white/90 mb-8 font-light fade-in animate-in" style={{ animationDelay: '0.2s' }}>
              {heroSettings?.subtitle || 'The Service You Deserve'}
            </p>
            <button
              onClick={() => document.querySelector('#hero-form')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-4 bg-white text-black text-lg font-bold rounded-full hover:bg-gray-100 transition-all hover:scale-105 shadow-xl scale-in animate-in"
              style={{ animationDelay: '0.4s' }}
            >
              Get a Quote
            </button>
          </div>
        </div>
      </section>

      {/* Booking Form Section - Full Width like Addison Lee */}
      <section id="hero-form" className="bg-white py-16 animate-on-scroll">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gray-50 rounded-2xl shadow-lg p-8 md:p-12">
              <h2 className="text-3xl md:text-4xl font-bold text-black mb-8 text-center">Get Your Quote</h2>

              <form onSubmit={handleBookingSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Service Type */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Service Type
                    </label>
                    <select
                      value={bookingForm.serviceType}
                      onChange={(e) => setBookingForm({ ...bookingForm, serviceType: e.target.value as ServiceType })}
                      className="w-full px-5 py-4 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none text-gray-900 text-base"
                    >
                      <option value="marriage">Wedding & Special Events</option>
                      <option value="transfer">Airport & Location Transfer</option>
                    </select>
                  </div>

                  {/* Pickup Location */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Pickup Location
                    </label>
                    <input
                      type="text"
                      value={bookingForm.pickupLocation}
                      onChange={(e) => setBookingForm({ ...bookingForm, pickupLocation: e.target.value })}
                      placeholder="Enter pickup address"
                      className="w-full px-5 py-4 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none text-gray-900"
                      required
                    />
                  </div>

                  {/* Dropoff Location */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Dropoff Location
                    </label>
                    <input
                      type="text"
                      value={bookingForm.dropoffLocation}
                      onChange={(e) => setBookingForm({ ...bookingForm, dropoffLocation: e.target.value })}
                      placeholder="Enter destination"
                      className="w-full px-5 py-4 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none text-gray-900"
                      required
                    />
                  </div>

                  {/* Date */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Pickup Date
                    </label>
                    <input
                      type="date"
                      value={bookingForm.pickupDate}
                      onChange={(e) => setBookingForm({ ...bookingForm, pickupDate: e.target.value })}
                      className="w-full px-5 py-4 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none text-gray-900"
                      required
                    />
                  </div>

                  {/* Time */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Pickup Time
                    </label>
                    <input
                      type="time"
                      value={bookingForm.pickupTime}
                      onChange={(e) => setBookingForm({ ...bookingForm, pickupTime: e.target.value })}
                      className="w-full px-5 py-4 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none text-gray-900"
                      required
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full px-6 py-5 bg-black hover:bg-gray-900 text-white font-bold text-lg rounded-full transition-all hover:scale-105 shadow-lg"
                >
                  View Available Vehicles
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid - 4 Cards like Addison Lee */}
      <section id="services" className="py-20 bg-white">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="text-center mb-16 animate-on-scroll">
            <h2 className="text-4xl md:text-5xl font-bold text-black mb-4">
              Our Services
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Premium transportation for every occasion
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
            {/* Wedding Service Card */}
            <div
              onClick={() => {
                setSelectedService('marriage');
                document.querySelector('#fleet')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="animate-on-scroll bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer group"
            >
              <div className="relative h-[400px] bg-gradient-to-br from-pink-50 to-purple-50 overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-700">
                  <div className="text-9xl">💍</div>
                </div>
              </div>
              <div className="p-8">
                <h3 className="text-3xl font-bold text-black mb-4">
                  Wedding & Special Events
                </h3>
                <p className="text-gray-600 text-lg leading-relaxed mb-6">
                  Luxury wedding car service with professional chauffeurs for your special day
                </p>
                <div className="flex items-center text-black font-semibold group-hover:translate-x-2 transition-transform">
                  Learn More
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Transfer Service Card */}
            <div
              onClick={() => {
                setSelectedService('transfer');
                document.querySelector('#fleet')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="animate-on-scroll bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer group"
            >
              <div className="relative h-[400px] bg-gradient-to-br from-blue-50 to-cyan-50 overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-700">
                  <div className="text-9xl">✈️</div>
                </div>
              </div>
              <div className="p-8">
                <h3 className="text-3xl font-bold text-black mb-4">
                  Airport & Location Transfers
                </h3>
                <p className="text-gray-600 text-lg leading-relaxed mb-6">
                  Reliable airport transfers with flight tracking and fixed pricing
                </p>
                <div className="flex items-center text-black font-semibold group-hover:translate-x-2 transition-transform">
                  Learn More
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Fleet Section */}
      <section id="fleet" className="py-20 bg-gray-50">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="text-center mb-16 animate-on-scroll">
            <h2 className="text-4xl md:text-5xl font-bold text-black mb-4">
              Our Premium Fleet
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              {filteredCars.length} luxury vehicles for{' '}
              {selectedService === 'marriage' ? 'weddings' : 'transfers'}
            </p>

            {/* Service Toggle */}
            <div className="inline-flex bg-white rounded-full p-1 shadow-md">
              <button
                onClick={() => setSelectedService('marriage')}
                className={`px-8 py-3 rounded-full font-semibold transition-all ${
                  selectedService === 'marriage'
                    ? 'bg-black text-white shadow-lg'
                    : 'text-gray-700 hover:text-black'
                }`}
              >
                💍 Wedding
              </button>
              <button
                onClick={() => setSelectedService('transfer')}
                className={`px-8 py-3 rounded-full font-semibold transition-all ${
                  selectedService === 'transfer'
                    ? 'bg-black text-white shadow-lg'
                    : 'text-gray-700 hover:text-black'
                }`}
              >
                ✈️ Transfer
              </button>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-black border-t-transparent"></div>
              <p className="mt-6 text-gray-600 text-lg">Loading vehicles...</p>
            </div>
          ) : filteredCars.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCars.map((car, idx) => (
                <div
                  key={car.id}
                  className="animate-on-scroll transform hover:scale-105 transition-transform duration-300"
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  <CarCard car={car} onBook={() => handleCarClick(car)} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-2xl animate-on-scroll">
              <div className="text-8xl mb-6">🚗</div>
              <h3 className="text-3xl font-bold text-black mb-4">No vehicles available</h3>
              <p className="text-gray-600 text-lg max-w-md mx-auto">
                We're updating our fleet. Please check back soon or contact us directly.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Features Section - Like Addison Lee's Trust Section */}
      <section className="py-20 bg-white">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="text-center mb-16 animate-on-scroll">
            <h2 className="text-4xl md:text-5xl font-bold text-black mb-4">
              Why Choose Jasmin Rent Cars
            </h2>
            <p className="text-xl text-gray-600">
              Trusted by thousands for professional service
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
            {[
              { icon: '💎', title: 'Premium Quality', desc: 'Luxury vehicles with professional chauffeurs' },
              { icon: '💰', title: 'Fixed Pricing', desc: 'Transparent pricing with no hidden fees' },
              { icon: '📍', title: 'Flight Tracking', desc: 'Real-time monitoring for airport transfers' },
              { icon: '⚡', title: 'Instant Booking', desc: 'Book online with immediate confirmation' },
              { icon: '🔒', title: 'Secure Payment', desc: 'Bank-level encryption for safety' },
              { icon: '🏆', title: 'Award Winning', desc: 'Excellence in luxury transportation' },
            ].map((item, idx) => (
              <div
                key={idx}
                className="text-center animate-on-scroll"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <div className="text-7xl mb-6 transform hover:scale-110 transition-transform duration-300">
                  {item.icon}
                </div>
                <h3 className="text-2xl font-bold text-black mb-3">{item.title}</h3>
                <p className="text-gray-600 text-lg">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Black Background like Addison Lee */}
      <section className="py-20 bg-black text-white">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 text-center animate-on-scroll">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to book your ride?
          </h2>
          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
            Experience luxury transportation with professional service and fixed pricing
          </p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="px-10 py-5 bg-white text-black font-bold text-lg rounded-full hover:bg-gray-100 transition-all hover:scale-105 shadow-xl"
          >
            Get Started
          </button>
        </div>
      </section>

      {/* Footer - Multi-column like Addison Lee */}
      <footer className="bg-[#313131] text-white py-16">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 mb-12">
            {/* Company */}
            <div>
              <h3 className="font-bold text-lg mb-4">Company</h3>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#hero-form" className="hover:text-white transition-colors">Get a Quote</a></li>
                <li><a href="#services" className="hover:text-white transition-colors">Services</a></li>
                <li><a href="#fleet" className="hover:text-white transition-colors">Fleet</a></li>
                <li><a href="/login" className="hover:text-white transition-colors">Careers</a></li>
              </ul>
            </div>

            {/* About */}
            <div>
              <h3 className="font-bold text-lg mb-4">About</h3>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Our Story</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Accreditations</a></li>
                <li><a href="/login" className="hover:text-white transition-colors">Sign Up</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Mobile App</a></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="font-bold text-lg mb-4">Support</h3>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">FAQs</a></li>
              </ul>
            </div>

            {/* Services */}
            <div>
              <h3 className="font-bold text-lg mb-4">Services</h3>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#services" className="hover:text-white transition-colors">Wedding Cars</a></li>
                <li><a href="#services" className="hover:text-white transition-colors">Airport Transfer</a></li>
                <li><a href="#fleet" className="hover:text-white transition-colors">Luxury Fleet</a></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="font-bold text-lg mb-4">Legal</h3>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Cookie Policy</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-700 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              {/* Logo */}
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white rounded flex items-center justify-center">
                  <svg className="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"/>
                    <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6a1 1 0 001 1h.05a2.5 2.5 0 014.9 0h.05a1 1 0 001-1v-4.5a1 1 0 00-.293-.707l-2-2A1 1 0 0017 7h-3z"/>
                  </svg>
                </div>
                <span className="text-lg font-bold">Jasmin Rent Cars</span>
              </div>

              {/* Copyright */}
              <p className="text-gray-400 text-sm">
                © 2024 Jasmin Rent Cars. All rights reserved.
              </p>

              {/* Social Links */}
              <div className="flex items-center space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                </a>
              </div>
            </div>
          </div>
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
    </div>
  );
}
