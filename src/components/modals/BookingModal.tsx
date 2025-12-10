"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { Car } from '@/types';

interface BookingModalProps {
  car: Car;
  isOpen: boolean;
  onClose: () => void;
}

export default function BookingModal({ car, isOpen, onClose }: BookingModalProps) {
  const { t, i18n } = useTranslation();
  const lang = (i18n.language || 'en').split('-')[0] as keyof import('@/types').MultiLanguageText;

  const getLocalized = (text: any) => {
    if (!text) return '';
    if (typeof text === 'string') return text;
    return text[lang] || text.en || Object.values(text)[0] || '';
  };

  const nameText = getLocalized(car.name);
  const descriptionText = getLocalized(car.description);
  const featuresArr: string[] = (() => {
    const f = (car as any).features;
    if (!f) return [];
    if (Array.isArray(f)) return f as string[];
    if (typeof f === 'string') return f.split(',').map(s => s.trim()).filter(Boolean);
    const localized = getLocalized(f);
    return localized ? localized.split(',').map((s: string) => s.trim()).filter(Boolean) : [];
  })();
  const router = useRouter();
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [pickupTime, setPickupTime] = useState('10:00');
  const [notes, setNotes] = useState('');
  const [flightNumber, setFlightNumber] = useState('');
  const [step, setStep] = useState<'details' | 'booking'>('details');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Build gallery array - use gallery if available, otherwise use main image
  const galleryImages = (car.gallery && car.gallery.length > 0)
    ? car.gallery
    : (car.image_base64 ? [car.image_base64] : []);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!startDate || !pickupTime) {
      alert('Please select date and time');
      return;
    }

    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    // Get active promo code from localStorage
    let promoCode: string | undefined;
    try {
      const storedPromo = localStorage.getItem('activePromoCode');
      if (storedPromo) {
        const promoData = JSON.parse(storedPromo);
        promoCode = promoData.code;
      }
    } catch (e) {
      console.error('Failed to read promo code', e);
    }

    // Construct start date with time
    const [hours, minutes] = pickupTime.split(':').map(Number);
    const startDateTime = new Date(startDate);
    startDateTime.setHours(hours, minutes, 0, 0);

    // End date is start date + 24 hours
    const endDateTime = new Date(startDateTime);
    endDateTime.setDate(endDateTime.getDate() + 1);

    const payload = {
      car_id: car.id,
      start_date: startDateTime.toISOString(),
      end_date: endDateTime.toISOString(),
      notes,
      flight_number: flightNumber || undefined,
      promo_code: promoCode,
    };

    // If user is not logged in, save pending booking and redirect to login
    if (!token) {
      try {
        localStorage.setItem('pendingBooking', JSON.stringify(payload));
        toast('Please sign in to complete your booking', { icon: '🔒' });
        // Redirect to login with tab=signup to prompt account creation
        router.push('/login?tab=signup');
      } catch (e) {
        console.error('Failed to store pending booking', e);
        toast.error('Unable to proceed');
      }
      return;
    }

    // Create booking directly
    try {
      const mutation = `mutation CreateBooking($input: BookingInput!) { createBooking(input: $input) { id } }`;
      const response = await fetch('/api/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ query: mutation, variables: { input: payload } }),
      });

      const data = await response.json();
      if (data.errors) {
        console.error('Booking error', data.errors);
        toast.error(data.errors[0]?.message || 'Booking failed');
        return;
      }

      // Clear used promo code after successful booking
      if (promoCode) {
        localStorage.removeItem('activePromoCode');
        toast.success('Booking confirmed with discount!');
      } else {
        toast.success('Booking confirmed!');
      }

      onClose();
      router.push('/dashboard');
    } catch (error) {
      console.error('Booking submit error:', error);
      toast.error('Booking failed');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-75 transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-[#FFC800]/30 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 w-10 h-10 flex items-center justify-center bg-black/40 hover:bg-red-600 text-white rounded-full transition-colors backdrop-blur-sm shadow-sm border border-white/10"
          >
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>

          {/* Car Header */}
          <div className="p-4 sm:p-6 border-b border-gray-700">
            <div className="flex flex-col gap-4 sm:gap-6">
              {/* Car Image Gallery - Full Width */}
              <div className="w-full relative">
                {galleryImages.length > 0 ? (
                  <div className="relative">
                    <img
                      src={galleryImages[selectedImageIndex]}
                      alt={`${nameText} - Image ${selectedImageIndex + 1}`}
                      className="w-full h-64 sm:h-80 md:h-96 object-cover rounded-lg"
                    />

                    {/* Gallery Navigation */}
                    {galleryImages.length > 1 && (
                      <>
                        {/* Previous Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedImageIndex((prev) =>
                              prev === 0 ? galleryImages.length - 1 : prev - 1
                            );
                          }}
                          className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 bg-black/70 hover:bg-[#FFC800] text-white rounded-full p-3 sm:p-4 transition-all shadow-lg hover:scale-110"
                        >
                          <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
                          </svg>
                        </button>

                        {/* Next Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedImageIndex((prev) =>
                              prev === galleryImages.length - 1 ? 0 : prev + 1
                            );
                          }}
                          className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 bg-black/70 hover:bg-[#FFC800] text-white rounded-full p-3 sm:p-4 transition-all shadow-lg hover:scale-110"
                        >
                          <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>

                        {/* Image Counter */}
                        <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-full text-sm sm:text-base font-bold">
                          {selectedImageIndex + 1} / {galleryImages.length}
                        </div>
                      </>
                    )}

                    {/* Thumbnail Strip */}
                    {galleryImages.length > 1 && (
                      <div className="flex gap-2 sm:gap-3 mt-3 sm:mt-4 overflow-x-auto pb-2">
                        {galleryImages.map((img, idx) => (
                          <button
                            key={idx}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedImageIndex(idx);
                            }}
                            className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-lg overflow-hidden border-3 transition-all ${
                              idx === selectedImageIndex
                                ? 'border-[#FFC800] border-4 scale-105 shadow-lg'
                                : 'border-gray-600 border-2 opacity-60 hover:opacity-100 hover:border-[#FFC800]/50'
                            }`}
                          >
                            <img
                              src={img}
                              alt={`Thumbnail ${idx + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="w-full h-64 sm:h-80 md:h-96 bg-gray-700 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-16 h-16 sm:w-20 sm:h-20 text-gray-600"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path>
                    </svg>
                  </div>
                )}
              </div>

              {/* Car Details */}
              <div className="w-full">
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">{car.brand} {car.model}</h2>
                <p className="text-gray-200 mb-3 sm:mb-4 text-sm sm:text-base">{descriptionText}</p>

                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <span className="text-gold-300 text-xs sm:text-sm">{t('brandLabel') || 'Brand'}</span>
                    <p className="text-white font-semibold text-sm sm:text-base">{car.brand}</p>
                  </div>
                  <div>
                    <span className="text-gold-300 text-xs sm:text-sm">{t('modelLabel') || 'Model'}</span>
                    <p className="text-white font-semibold text-sm sm:text-base">{car.model}</p>
                  </div>
                  <div>
                    <span className="text-gold-300 text-xs sm:text-sm">{t('yearLabel') || 'Year'}</span>
                    <p className="text-white font-semibold text-sm sm:text-base">{car.year}</p>
                  </div>
                  <div>
                    <span className="text-[#FFC800] text-xs sm:text-sm">{t('priceLabel')}</span>
                    <p className="text-gray-300 text-xs">{t('startingFrom')}</p>
                    <p className="text-[#FFC800] font-bold text-lg sm:text-xl">
                      DT {car.price_per_day}/{t('perDay')}
                    </p>
                  </div>
                </div>
                <div className="mt-3">
                  <span className="text-gold-300 text-xs sm:text-sm">{t('rating') || 'Rating'}</span>
                  <p className="text-white font-semibold text-sm sm:text-base">⭐ {car.average_rating.toFixed(1)} ({car.total_ratings})</p>
                </div>
              </div>
            </div>
          </div>

          {/* Step Navigation */}
          <div className="flex border-b border-[#FFC800]/20">
            <button
              onClick={() => setStep('details')}
              className={`flex-1 py-3 sm:py-4 text-center transition-colors text-xs sm:text-base font-bold ${step === 'details'
                ? 'bg-[#FFC800] text-black'
                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
            >
              {t('ourServicesTab')}
            </button>
            <button
              onClick={() => setStep('booking')}
              className={`flex-1 py-3 sm:py-4 text-center transition-colors text-xs sm:text-base font-bold ${step === 'booking'
                ? 'bg-[#FFC800] text-black'
                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
            >
              {t('selectDates')}
            </button>
          </div>

          {/* Modal Content */}
          <div className="p-4 sm:p-6">
            {step === 'details' && (
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4">{t('features')}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 mb-4 sm:mb-6">
                  {featuresArr.map((feature, index) => (
                    <div key={index} className="flex items-center text-gray-300 text-sm sm:text-base">
                      <svg
                        className="w-4 h-4 sm:w-5 sm:h-5 text-gold-500 mr-2"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path d="M5 13l4 4L19 7"></path>
                      </svg>
                      {feature}
                    </div>
                  ))}
                </div>

                {car.specs && (
                  <>
                    <h3 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4">{t('specifications')}</h3>
                    <div className="bg-gray-700 rounded-lg p-3 sm:p-4 space-y-2 text-sm sm:text-base">
                      {car.specs.engine && (
                        <div className="flex justify-between">
                          <span className="text-gray-400">{t('engine') || 'Engine'}:</span>
                          <span className="text-white">{car.specs.engine}</span>
                        </div>
                      )}
                      {car.specs.transmission && (
                        <div className="flex justify-between">
                          <span className="text-gray-400">{t('transmission') || 'Transmission'}:</span>
                          <span className="text-white">{car.specs.transmission}</span>
                        </div>
                      )}
                      {car.specs.fuelType && (
                        <div className="flex justify-between">
                          <span className="text-gray-400">{t('fuelType') || 'Fuel Type'}:</span>
                          <span className="text-white">{car.specs.fuelType}</span>
                        </div>
                      )}
                      {car.specs.seats && (
                        <div className="flex justify-between">
                          <span className="text-gray-400">{t('seats') || 'Seats'}:</span>
                          <span className="text-white">{car.specs.seats}</span>
                        </div>
                      )}
                      {car.specs.color && (
                        <div className="flex justify-between">
                          <span className="text-gray-400">{t('color') || 'Color'}:</span>
                          <span className="text-white">{car.specs.color}</span>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            )}

            {step === 'booking' && (
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4">{t('selectDates')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-gray-400 mb-2 text-sm sm:text-base">{t('startDate')}</label>
                    <input
                      type="date"
                      value={startDate ? startDate.toISOString().split('T')[0] : ''}
                      onChange={(e) => {
                        const selectedDate = new Date(e.target.value);
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);

                        // Only allow dates from today onwards
                        if (selectedDate >= today) {
                          setStartDate(selectedDate);
                        }
                      }}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full bg-gray-700 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg focus:ring-2 focus:ring-[#FFC800] outline-none text-sm sm:text-base"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 mb-2 text-sm sm:text-base">{t('pickupTime')}</label>
                    <input
                      type="time"
                      value={pickupTime}
                      onChange={(e) => setPickupTime(e.target.value)}
                      className="w-full bg-gray-700 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg focus:ring-2 focus:ring-[#FFC800] outline-none text-sm sm:text-base"
                    />
                  </div>
                </div>

                <div className="mt-4 sm:mt-6">
                  <label className="block text-gray-400 mb-2 text-sm sm:text-base">{t('notes')} ({t('optional')})</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Any special requests or notes..."
                    rows={4}
                    className="w-full bg-gray-700 text-white px-3 py-2 sm:px-4 sm:py-3 rounded-lg focus:ring-2 focus:ring-gold-500 outline-none resize-none text-sm sm:text-base"
                  />
                </div>

                {car.service_type === 'transfer' && (
                  <div className="mt-4 sm:mt-6">
                    <label className="block text-gray-400 mb-2 text-sm sm:text-base">
                      ✈️ {t('flightNumber') || 'Flight Number'} ({t('optional') || 'Optional'})
                    </label>
                    <input
                      type="text"
                      value={flightNumber}
                      onChange={(e) => setFlightNumber(e.target.value.toUpperCase())}
                      placeholder="e.g., TU123, AF456"
                      className="w-full bg-gray-700 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg focus:ring-2 focus:ring-[#FFC800] outline-none text-sm sm:text-base"
                    />
                    <p className="text-gray-500 text-xs mt-1">{t('enterFlightNumber') || 'Enter your flight number for tracking purposes'}</p>
                  </div>
                )}

              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 sm:p-6 border-t border-gray-700 flex justify-end items-center gap-4">
            <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
              <button
                onClick={onClose}
                className="flex-1 sm:flex-none px-4 py-2 sm:px-6 sm:py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors text-sm sm:text-base"
              >
                {t('cancel')}
              </button>

              {step === 'details' ? (
                <button
                  onClick={() => setStep('booking')}
                  className="flex-1 sm:flex-none px-4 py-2 sm:px-6 sm:py-3 bg-gradient-to-r from-[#FFC800] to-[#FFD700] hover:from-[#FFD700] hover:to-[#FFC800] text-black rounded-lg font-bold transition-all shadow-lg hover:shadow-xl text-sm sm:text-base"
                >
                  {t('nextStep')} →
                </button>
              ) : (
                <>
                  <button
                    onClick={() => setStep('details')}
                    className="flex-1 sm:flex-none px-4 py-2 sm:px-6 sm:py-3 bg-gray-600 hover:bg-gray-500 text-white rounded-lg font-bold transition-all text-sm sm:text-base"
                  >
                    ← {t('back')}
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={!startDate || !pickupTime}
                    className={`flex-1 sm:flex-none px-4 py-2 sm:px-6 sm:py-3 rounded-lg font-bold transition-all text-sm sm:text-base ${startDate && pickupTime
                      ? 'bg-gradient-to-r from-[#FFC800] to-[#FFD700] hover:from-[#FFD700] hover:to-[#FFC800] text-black shadow-lg hover:shadow-xl'
                      : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                      }`}
                  >
                    {t('confirmBooking')}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
