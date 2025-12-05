'use client';

import { useTranslation } from 'react-i18next';
import { Car } from '@/types';
import Image from 'next/image';

interface CarCardProps {
  car: Car;
  onBook: () => void;
}

export default function CarCard({ car, onBook }: CarCardProps) {
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
    // assume multi-language object
    const localized = getLocalized(f);
    return localized ? localized.split(',').map((s: string) => s.trim()).filter(Boolean) : [];
  })();

  return (
    <div className="bg-gray-800 rounded-xl overflow-hidden shadow-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-primary-500/20">
      {/* Car Image */}
      <div className="relative h-48 sm:h-64 bg-gray-700">
        {car.image_base64 ? (
          <img
            src={car.image_base64}
            alt={nameText}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <svg
              className="w-24 h-24 text-gray-600"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
          </div>
        )}
        
        {/* Status Badge */}
        <div className="absolute top-4 right-4">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              car.status === 'AVAILABLE'
                ? 'bg-green-500 text-white'
                : 'bg-red-500 text-white'
            }`}
          >
            {t(car.status.toLowerCase())}
          </span>
        </div>

        {/* Rating */}
        {car.average_rating > 0 && (
          <div className="absolute bottom-4 left-4 bg-black/70 px-3 py-1 rounded-lg flex items-center">
            <svg
              className="w-5 h-5 text-yellow-400 mr-1"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
            </svg>
            <span className="text-white text-sm font-semibold">
              {car.average_rating.toFixed(1)}
            </span>
            <span className="text-gray-400 text-xs ml-1">
              ({car.total_ratings})
            </span>
          </div>
        )}
      </div>

      {/* Car Details */}
      <div className="p-4 sm:p-6">
        <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">{nameText}</h3>
        <p className="text-gray-400 mb-3 sm:mb-4 text-sm sm:text-base">{descriptionText}</p>

        {/* Car Info */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4">
          <div className="flex items-center text-gray-300">
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-primary-500"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
            <span className="text-xs sm:text-sm">{car.year}</span>
          </div>
          <div className="flex items-center text-gray-300">
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-primary-500"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
            <span className="text-xs sm:text-sm">
              {car.specs?.seats || 5} {t('seats')}
            </span>
          </div>
        </div>

        {/* Features */}
        {featuresArr.length > 0 && (
          <div className="mb-3 sm:mb-4">
            <div className="flex flex-wrap gap-2">
              {featuresArr.slice(0, 3).map((feature, index) => (
                <span
                  key={index}
                  className="bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded"
                >
                  {feature}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Price and CTA */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-3 sm:pt-4 border-t border-gray-700 gap-3 sm:gap-0">
          <div>
            <span className="text-2xl sm:text-3xl font-bold text-primary-500">
              DT {car.price_per_day}
            </span>
            <span className="text-gray-400 text-xs sm:text-sm ml-2">/ {t('perDay')}</span>
          </div>
          <button
            onClick={onBook}
            disabled={car.status !== 'AVAILABLE'}
            className={`w-full sm:w-auto px-4 py-2 sm:px-6 sm:py-3 rounded-lg font-semibold transition-all text-sm sm:text-base ${
              car.status === 'AVAILABLE'
                ? 'bg-primary-600 hover:bg-primary-700 text-white transform hover:scale-105'
                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
            }`}
          >
            {car.status === 'AVAILABLE' ? t('bookNow') : t('unavailable')}
          </button>
        </div>
      </div>
    </div>
  );
}
