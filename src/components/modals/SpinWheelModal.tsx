'use client';

import { useState, useRef, useEffect } from 'react';
import { useClientTranslation } from '@/hooks/useClientTranslation';

interface SpinWheelModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Prize {
  id: number;
  label: string;
  color: string;
  discount: number;
}

const prizes: Prize[] = [
  { id: 1, label: '5%', color: '#FFC800', discount: 5 },
  { id: 2, label: '10%', color: '#E6B500', discount: 10 },
  { id: 3, label: '15%', color: '#FFC800', discount: 15 },
  { id: 4, label: '20%', color: '#E6B500', discount: 20 },
  { id: 5, label: '25%', color: '#FFC800', discount: 25 },
  { id: 6, label: '30%', color: '#E6B500', discount: 30 },
];

export default function SpinWheelModal({ isOpen, onClose }: SpinWheelModalProps) {
  const { t } = useClientTranslation();
  const [step, setStep] = useState<'register' | 'spin' | 'result'>('register');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [selectedPrize, setSelectedPrize] = useState<Prize | null>(null);
  const [promoCode, setPromoCode] = useState('');
  const wheelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) {
      // Reset state when modal closes
      setStep('register');
      setFormData({ name: '', email: '', phone: '' });
      setSpinning(false);
      setRotation(0);
      setSelectedPrize(null);
      setPromoCode('');
    }
  }, [isOpen]);

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (!formData.name || !formData.email || !formData.phone) {
      alert(t('pleaseFillAllFields'));
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert(t('invalidEmail'));
      return;
    }

    // Move to spin step
    setStep('spin');
  };

  const generatePromoCode = (discount: number): string => {
    const prefix = 'GIFT';
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `${prefix}${discount}-${random}`;
  };

  const spinWheel = () => {
    if (spinning) return;

    setSpinning(true);

    // Random prize selection
    const randomPrizeIndex = Math.floor(Math.random() * prizes.length);
    const prize = prizes[randomPrizeIndex];

    // Calculate rotation - 5 full rotations + angle to land on prize
    const segmentAngle = 360 / prizes.length;
    const prizeAngle = randomPrizeIndex * segmentAngle;
    const extraRotations = 5 * 360; // 5 full rotations
    const finalRotation = extraRotations + (360 - prizeAngle) + segmentAngle / 2;

    setRotation(finalRotation);

    // After animation completes
    setTimeout(() => {
      setSpinning(false);
      setSelectedPrize(prize);
      const code = generatePromoCode(prize.discount);
      setPromoCode(code);
      setStep('result');

      // Save to backend
      savePromoCode(code, prize.discount);
    }, 5000);
  };

  const savePromoCode = async (code: string, discount: number) => {
    try {
      await fetch('/api/promo-codes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          discount,
          userEmail: formData.email,
          userName: formData.name,
          userPhone: formData.phone,
        }),
      });
    } catch (error) {
      console.error('Failed to save promo code:', error);
    }
  };

  const copyPromoCode = () => {
    navigator.clipboard.writeText(promoCode);
    alert(t('promoCodeCopied'));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-2 sm:p-4">
      <div className="relative bg-[#1a1a1a] border-2 border-[#FFC800] rounded-lg max-w-2xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:text-[#FFC800] transition-colors z-10"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="p-4 sm:p-6 md:p-8 lg:p-10">
          {/* Registration Step */}
          {step === 'register' && (
            <div className="text-center">
              <div className="text-5xl sm:text-6xl mb-4">🎁</div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 uppercase tracking-wide">
                {t('winADiscount')}
              </h2>
              <p className="text-gray-300 mb-6 text-sm sm:text-base">
                {t('spinWheelDescription')}
              </p>

              <form onSubmit={handleSubmitForm} className="space-y-4 max-w-md mx-auto">
                <div>
                  <label className="block text-left text-xs sm:text-sm font-bold text-gray-300 mb-2 uppercase tracking-wide">
                    {t('fullName')}
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder={t('enterYourName')}
                    className="w-full px-4 py-3 border-2 border-gray-700 focus:border-[#FFC800] outline-none text-white bg-[#0a0a0a] placeholder-gray-500 text-sm sm:text-base"
                    required
                  />
                </div>

                <div>
                  <label className="block text-left text-xs sm:text-sm font-bold text-gray-300 mb-2 uppercase tracking-wide">
                    {t('email')}
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder={t('enterYourEmail')}
                    className="w-full px-4 py-3 border-2 border-gray-700 focus:border-[#FFC800] outline-none text-white bg-[#0a0a0a] placeholder-gray-500 text-sm sm:text-base"
                    required
                  />
                </div>

                <div>
                  <label className="block text-left text-xs sm:text-sm font-bold text-gray-300 mb-2 uppercase tracking-wide">
                    {t('phone')}
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder={t('enterYourPhone')}
                    className="w-full px-4 py-3 border-2 border-gray-700 focus:border-[#FFC800] outline-none text-white bg-[#0a0a0a] placeholder-gray-500 text-sm sm:text-base"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full px-6 py-4 bg-[#FFC800] hover:bg-[#E6B500] text-black font-bold text-sm sm:text-base uppercase tracking-wider transition-colors"
                >
                  {t('continueToSpin')}
                </button>
              </form>
            </div>
          )}

          {/* Spin Step */}
          {step === 'spin' && (
            <div className="text-center">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6 uppercase tracking-wide">
                {t('spinTheWheel')}
              </h2>

              <div className="relative w-full max-w-[280px] sm:max-w-md mx-auto mb-6 sm:mb-8">
                {/* Wheel Container */}
                <div className="relative aspect-square spin-wheel-container">
                  {/* Arrow Pointer */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-10">
                    <div className="w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-t-[30px] border-t-[#FFC800]"></div>
                  </div>

                  {/* Wheel */}
                  <div
                    ref={wheelRef}
                    className="relative w-full h-full rounded-full border-8 border-white shadow-2xl overflow-hidden"
                    style={{
                      transform: `rotate(${rotation}deg)`,
                      transition: spinning ? 'transform 5s cubic-bezier(0.17, 0.67, 0.12, 0.99)' : 'none',
                    }}
                  >
                    {prizes.map((prize, index) => {
                      const angle = (360 / prizes.length) * index;
                      return (
                        <div
                          key={prize.id}
                          className="absolute w-full h-full"
                          style={{
                            transform: `rotate(${angle}deg)`,
                            clipPath: `polygon(50% 50%, 100% 0, 100% ${100 / prizes.length}%)`,
                          }}
                        >
                          <div
                            className="w-full h-full flex items-center justify-end pr-8"
                            style={{ backgroundColor: prize.color }}
                          >
                            <span className="text-2xl font-bold text-black transform rotate-[30deg]">
                              {prize.label}
                            </span>
                          </div>
                        </div>
                      );
                    })}

                    {/* Center Circle */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-[#1a1a1a] border-4 border-white rounded-full flex items-center justify-center">
                      <span className="text-2xl">🎁</span>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={spinWheel}
                disabled={spinning}
                className={`px-8 py-4 bg-[#FFC800] hover:bg-[#E6B500] text-black font-bold text-lg uppercase tracking-wider transition-all transform hover:scale-105 ${
                  spinning ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {spinning ? t('spinning') : t('spinNow')}
              </button>
            </div>
          )}

          {/* Result Step */}
          {step === 'result' && selectedPrize && (
            <div className="text-center">
              <div className="text-6xl sm:text-7xl mb-4 animate-bounce">🎉</div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 uppercase tracking-wide">
                {t('congratulations')}!
              </h2>
              <p className="text-gray-300 mb-6 text-lg">
                {t('youWon')} <span className="text-[#FFC800] font-bold text-2xl">{selectedPrize.discount}%</span> {t('discount')}!
              </p>

              <div className="bg-[#0a0a0a] border-2 border-[#FFC800] p-6 rounded-lg mb-6">
                <p className="text-gray-300 text-sm mb-2 uppercase tracking-wide">{t('yourPromoCode')}</p>
                <div className="flex items-center justify-center gap-3">
                  <span className="text-[#FFC800] font-mono text-2xl sm:text-3xl font-bold">{promoCode}</span>
                  <button
                    onClick={copyPromoCode}
                    className="p-2 bg-[#FFC800] hover:bg-[#E6B500] text-black rounded transition-colors"
                    title={t('copyCode')}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="text-gray-400 text-sm mb-6 space-y-2">
                <p>{t('promoCodeSentEmail')}</p>
                <p className="text-[#FFC800]">{formData.email}</p>
              </div>

              <button
                onClick={onClose}
                className="px-8 py-4 bg-[#FFC800] hover:bg-[#E6B500] text-black font-bold text-base uppercase tracking-wider transition-colors"
              >
                {t('startBooking')}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
