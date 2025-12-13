'use client';

import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';

export default function ContactAgentPage() {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-all mb-6"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            {t('back')}
          </button>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            💬 {t('discussWithAgent') || 'Discuss with Agent'}
          </h1>
          <p className="text-gray-400 text-base sm:text-lg">
            {t('chooseContactMethod') || 'Choose your preferred method to contact us'}
          </p>
        </div>

        {/* Contact Options */}
        <div className="space-y-4">
          {/* WhatsApp */}
          <a
            href="https://wa.me/21622420360"
            target="_blank"
            rel="noopener noreferrer"
            className="group block bg-gradient-to-br from-gray-900 to-gray-800 border-2 border-gray-700 hover:border-[#25D366] rounded-xl p-6 sm:p-8 transition-all hover:scale-105 hover:shadow-2xl hover:shadow-[#25D366]/20"
          >
            <div className="flex items-center gap-4 sm:gap-6">
              <div className="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 bg-[#25D366]/10 group-hover:bg-[#25D366]/20 rounded-full flex items-center justify-center transition-all">
                <span className="text-4xl sm:text-5xl group-hover:scale-110 transition-transform">💬</span>
              </div>
              <div className="flex-1">
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 group-hover:text-[#25D366] transition-colors">
                  {t('whatsapp') || 'WhatsApp'}
                </h3>
                <p className="text-gray-400 text-sm sm:text-base mb-2">
                  {t('chatOnWhatsApp') || 'Chat with us on WhatsApp for instant responses'}
                </p>
                <p className="text-[#25D366] font-bold text-sm sm:text-base">+216 22 420 360</p>
              </div>
              <svg className="w-6 h-6 sm:w-8 sm:h-8 text-gray-600 group-hover:text-[#25D366] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </a>

          {/* Messenger */}
          <a
            href="https://m.me/100083471611688"
            target="_blank"
            rel="noopener noreferrer"
            className="group block bg-gradient-to-br from-gray-900 to-gray-800 border-2 border-gray-700 hover:border-[#0084FF] rounded-xl p-6 sm:p-8 transition-all hover:scale-105 hover:shadow-2xl hover:shadow-[#0084FF]/20"
          >
            <div className="flex items-center gap-4 sm:gap-6">
              <div className="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 bg-[#0084FF]/10 group-hover:bg-[#0084FF]/20 rounded-full flex items-center justify-center transition-all">
                <span className="text-4xl sm:text-5xl group-hover:scale-110 transition-transform">💬</span>
              </div>
              <div className="flex-1">
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 group-hover:text-[#0084FF] transition-colors">
                  {t('messenger') || 'Messenger'}
                </h3>
                <p className="text-gray-400 text-sm sm:text-base mb-2">
                  {t('chatOnMessenger') || 'Connect with us via Facebook Messenger'}
                </p>
                <p className="text-[#0084FF] font-bold text-sm sm:text-base">Jasmin Cars</p>
              </div>
              <svg className="w-6 h-6 sm:w-8 sm:h-8 text-gray-600 group-hover:text-[#0084FF] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </a>

          {/* Call */}
          <a
            href="tel:+21622420360"
            className="group block bg-gradient-to-br from-gray-900 to-gray-800 border-2 border-gray-700 hover:border-green-500 rounded-xl p-6 sm:p-8 transition-all hover:scale-105 hover:shadow-2xl hover:shadow-green-500/20"
          >
            <div className="flex items-center gap-4 sm:gap-6">
              <div className="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 bg-green-500/10 group-hover:bg-green-500/20 rounded-full flex items-center justify-center transition-all">
                <span className="text-4xl sm:text-5xl group-hover:scale-110 transition-transform">📞</span>
              </div>
              <div className="flex-1">
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 group-hover:text-green-400 transition-colors">
                  {t('callUs') || 'Call Us'}
                </h3>
                <p className="text-gray-400 text-sm sm:text-base mb-2">
                  {t('callUsDirectly') || 'Call us directly for immediate assistance'}
                </p>
                <p className="text-green-400 font-bold text-sm sm:text-base">+216 22 420 360</p>
              </div>
              <svg className="w-6 h-6 sm:w-8 sm:h-8 text-gray-600 group-hover:text-green-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </a>
        </div>

        {/* Footer Info */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">
            {t('availableSupport') || 'Our team is available to help you 24/7'}
          </p>
        </div>
      </div>
    </div>
  );
}
