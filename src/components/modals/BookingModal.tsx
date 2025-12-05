"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import Calendar from 'react-calendar';
import { Car } from '@/types';
import 'react-calendar/dist/Calendar.css';

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
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [pickupLocation, setPickupLocation] = useState('');
  const [dropoffLocation, setDropoffLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [step, setStep] = useState<'details' | 'dates' | 'locations'>('details');

  if (!isOpen) return null;

  const calculateTotalDays = () => {
    if (!startDate || !endDate) return 0;
    const diff = endDate.getTime() - startDate.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

    // If end date is before start date, return 0 (invalid)
    if (days < 0) return 0;

    // If same day rental, count as 1 day minimum
    return days === 0 ? 1 : days;
  };

  const totalDays = calculateTotalDays();
  const totalPrice = totalDays * car.price_per_day;

  const handleSubmit = async () => {
    if (!startDate || !endDate) {
      alert('Please select dates');
      return;
    }

    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    const payload = {
      car_id: car.id,
      start_date: startDate.toISOString(),
      end_date: endDate.toISOString(),
      pickup_location: pickupLocation,
      dropoff_location: dropoffLocation,
      notes,
    };

    // If user is not logged in, save pending booking and redirect to login
    if (!token) {
      try {
        localStorage.setItem('pendingBooking', JSON.stringify(payload));
        toast('Please sign in to complete your booking', { icon: '🔒' });
        router.push('/login');
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

      toast.success('Booking confirmed!');
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
            className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 text-gray-400 hover:text-white transition-colors"
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
            <div className="flex flex-col md:flex-row gap-4 sm:gap-6">
              {/* Car Image */}
              <div className="w-full md:w-1/3">
                {car.image_base64 ? (
                  <img
                    src={car.image_base64}
                    alt={nameText}
                    className="w-full h-40 sm:h-48 object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-full h-40 sm:h-48 bg-gray-700 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-12 h-12 sm:w-16 sm:h-16 text-gray-600"
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
              <div className="flex-1">
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">{car.brand} {car.model}</h2>
                <p className="text-gray-200 mb-3 sm:mb-4 text-sm sm:text-base">{descriptionText}</p>

                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <span className="text-gold-300 text-xs sm:text-sm">Brand</span>
                    <p className="text-white font-semibold text-sm sm:text-base">{car.brand}</p>
                  </div>
                  <div>
                    <span className="text-gold-300 text-xs sm:text-sm">Model</span>
                    <p className="text-white font-semibold text-sm sm:text-base">{car.model}</p>
                  </div>
                  <div>
                    <span className="text-gold-300 text-xs sm:text-sm">Year</span>
                    <p className="text-white font-semibold text-sm sm:text-base">{car.year}</p>
                  </div>
                  <div>
                    <span className="text-[#FFC800] text-xs sm:text-sm">Price</span>
                    <p className="text-[#FFC800] font-bold text-lg sm:text-xl">
                      DT {car.price_per_day}/{t('perDay')}
                    </p>
                  </div>
                </div>
                <div className="mt-3">
                  <span className="text-gold-300 text-xs sm:text-sm">Rating</span>
                  <p className="text-white font-semibold text-sm sm:text-base">⭐ {car.average_rating.toFixed(1)} ({car.total_ratings})</p>
                </div>
              </div>
            </div>
          </div>

          {/* Step Navigation */}
          <div className="flex border-b border-[#FFC800]/20">
            <button
              onClick={() => setStep('details')}
              className={`flex-1 py-3 sm:py-4 text-center transition-colors text-xs sm:text-base font-bold ${
                step === 'details'
                  ? 'bg-[#FFC800] text-black'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              {t('details')}
            </button>
            <button
              onClick={() => setStep('dates')}
              className={`flex-1 py-3 sm:py-4 text-center transition-colors text-xs sm:text-base font-bold ${
                step === 'dates'
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
                          <span className="text-gray-400">Engine:</span>
                          <span className="text-white">{car.specs.engine}</span>
                        </div>
                      )}
                      {car.specs.transmission && (
                        <div className="flex justify-between">
                          <span className="text-gray-400">Transmission:</span>
                          <span className="text-white">{car.specs.transmission}</span>
                        </div>
                      )}
                      {car.specs.fuelType && (
                        <div className="flex justify-between">
                          <span className="text-gray-400">Fuel Type:</span>
                          <span className="text-white">{car.specs.fuelType}</span>
                        </div>
                      )}
                      {car.specs.seats && (
                        <div className="flex justify-between">
                          <span className="text-gray-400">Seats:</span>
                          <span className="text-white">{car.specs.seats}</span>
                        </div>
                      )}
                      {car.specs.color && (
                        <div className="flex justify-between">
                          <span className="text-gray-400">Color:</span>
                          <span className="text-white">{car.specs.color}</span>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            )}

            {step === 'dates' && (
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4">{t('selectDates')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-gray-400 mb-2 text-sm sm:text-base">{t('startDate')}</label>
                    <input
                      type="date"
                      value={startDate ? startDate.toISOString().split('T')[0] : ''}
                      onChange={(e) => {
                        const newStartDate = new Date(e.target.value);
                        setStartDate(newStartDate);
                        // If end date is now before start date, reset end date
                        if (endDate && endDate < newStartDate) {
                          setEndDate(null);
                        }
                      }}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full bg-gray-700 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg focus:ring-2 focus:ring-[#FFC800] outline-none text-sm sm:text-base"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 mb-2 text-sm sm:text-base">{t('endDate')}</label>
                    <input
                      type="date"
                      value={endDate ? endDate.toISOString().split('T')[0] : ''}
                      onChange={(e) => {
                        const newEndDate = new Date(e.target.value);
                        // Validate that end date is not before start date
                        if (startDate && newEndDate < startDate) {
                          alert('End date cannot be before start date!');
                          return;
                        }
                        setEndDate(newEndDate);
                      }}
                      min={startDate ? startDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0]}
                      className="w-full bg-gray-700 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg focus:ring-2 focus:ring-[#FFC800] outline-none text-sm sm:text-base"
                    />
                  </div>
                </div>

                {startDate && endDate && (
                  <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-[#FFC800]/20 border-2 border-[#FFC800] rounded-lg">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
                      <div>
                        <span className="text-gray-300 text-sm sm:text-base">Total Days:</span>
                        <span className="text-white font-bold ml-2">{totalDays}</span>
                      </div>
                      <div>
                        <span className="text-gray-300 text-sm sm:text-base">Total Price:</span>
                        <span className="text-[#FFC800] font-bold text-xl sm:text-2xl ml-2">
                          ${totalPrice.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {step === 'locations' && (
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <label className="block text-gray-400 mb-2 text-sm sm:text-base">{t('pickupLocation')}</label>
                  <input
                    type="text"
                    value={pickupLocation}
                    onChange={(e) => setPickupLocation(e.target.value)}
                    placeholder="Enter pickup location"
                    className="w-full bg-gray-700 text-white px-3 py-2 sm:px-4 sm:py-3 rounded-lg focus:ring-2 focus:ring-gold-500 outline-none text-sm sm:text-base"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-2 text-sm sm:text-base">{t('dropoffLocation')}</label>
                  <input
                    type="text"
                    value={dropoffLocation}
                    onChange={(e) => setDropoffLocation(e.target.value)}
                    placeholder="Enter dropoff location"
                    className="w-full bg-gray-700 text-white px-3 py-2 sm:px-4 sm:py-3 rounded-lg focus:ring-2 focus:ring-gold-500 outline-none text-sm sm:text-base"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-2 text-sm sm:text-base">{t('notes')} (Optional)</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Any special requests or notes..."
                    rows={4}
                    className="w-full bg-gray-700 text-white px-3 py-2 sm:px-4 sm:py-3 rounded-lg focus:ring-2 focus:ring-gold-500 outline-none resize-none text-sm sm:text-base"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 sm:p-6 border-t border-gray-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="w-full sm:w-auto">
              {totalDays > 0 && (
                <div className="text-left sm:text-right">
                  <span className="text-gray-300 text-sm sm:text-base">Total: </span>
                  <span className="text-[#FFC800] font-bold text-2xl sm:text-3xl">
                    ${totalPrice.toFixed(2)}
                  </span>
                </div>
              )}
            </div>
            <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
              <button
                onClick={onClose}
                className="flex-1 sm:flex-none px-4 py-2 sm:px-6 sm:py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors text-sm sm:text-base"
              >
                {t('cancel')}
              </button>
              <button
                onClick={handleSubmit}
                disabled={!startDate || !endDate}
                className={`flex-1 sm:flex-none px-4 py-2 sm:px-6 sm:py-3 rounded-lg font-bold transition-all text-sm sm:text-base ${
                  startDate && endDate
                    ? 'bg-gradient-to-r from-[#FFC800] to-[#FFD700] hover:from-[#FFD700] hover:to-[#FFC800] text-black shadow-lg hover:shadow-xl'
                    : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                }`}
              >
                {t('confirmBooking')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
