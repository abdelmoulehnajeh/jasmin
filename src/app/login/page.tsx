'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useClientTranslation } from '@/hooks/useClientTranslation';
import toast, { Toaster } from 'react-hot-toast';
import * as THREE from 'three';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t, i18n } = useClientTranslation();
  const initialTab = searchParams.get('tab') || 'login';

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isSignup, setIsSignup] = useState(initialTab === 'signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [promoValidated, setPromoValidated] = useState(false);
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoError, setPromoError] = useState('');
  const [loading, setLoading] = useState(false);
  const [validatingPromo, setValidatingPromo] = useState(false);

  // ... (keep useEffects and logic same until render) ...

  // Update isSignup if URL changes (client-side navigation)
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'signup') {
      setIsSignup(true);
    } else if (tab === 'login') {
      setIsSignup(false);
    }
  }, [searchParams]);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Three.js background
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, alpha: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    camera.position.z = 5;

    // Particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 3000;
    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 50;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.05,
      color: 0xffb020,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);

    // Animation
    let time = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      time += 0.001;

      particles.rotation.y = time;
      particles.rotation.x = time * 0.5;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, []);

  const validatePromoCode = async () => {
    if (!promoCode.trim()) {
      setPromoError('');
      setPromoValidated(false);
      setPromoDiscount(0);
      return;
    }

    setValidatingPromo(true);
    setPromoError('');

    try {
      const response = await fetch(`/api/promo-codes?code=${encodeURIComponent(promoCode.trim())}`);
      const data = await response.json();

      if (response.ok && data.success) {
        setPromoValidated(true);
        setPromoDiscount(data.promoCode.discount);
        setPromoError('');
        toast.success(`Promo code valid! ${data.promoCode.discount}% discount applied`);
      } else {
        setPromoValidated(false);
        setPromoDiscount(0);
        setPromoError(data.error || 'Invalid promo code');
        toast.error(data.error || 'Invalid promo code');
      }
    } catch (error) {
      console.error('Promo code validation error:', error);
      setPromoValidated(false);
      setPromoDiscount(0);
      setPromoError('Failed to validate promo code');
      toast.error('Failed to validate promo code');
    } finally {
      setValidatingPromo(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let query;
      let variables;

      if (isSignup) {
        query = `
          mutation Signup($input: SignupInput!) {
            signup(input: $input) {
              token
              user { id email full_name role }
            }
          }
        `;
        variables = {
          input: {
            email,
            password,
            full_name: fullName,
            phone,
            preferred_language: i18n.language || 'en',
            service_type: 'marriage', // Default
          }
        };
      } else {
        query = `
          mutation Login($input: LoginInput!) {
            login(input: $input) {
              token
              user { id email full_name role }
            }
          }
        `;
        variables = { input: { email, password } };
      }

      const response = await fetch('/api/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, variables }),
      });

      const data = await response.json();

      if (data.errors) {
        toast.error(data.errors[0].message);
        setLoading(false);
        return;
      }

      const result = isSignup ? data.data.signup : data.data.login;
      const { token, user } = result;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      // Update app language to match user preference
      if (user.preferred_language && user.preferred_language !== i18n.language) {
        i18n.changeLanguage(user.preferred_language);
        localStorage.setItem('language', user.preferred_language);
      } else if (!localStorage.getItem('language')) {
        // Eensure current language is saved if not present
        localStorage.setItem('language', i18n.language || 'en');
      }

      // Save validated promo code if exists
      if (promoValidated && promoCode) {
        localStorage.setItem('activePromoCode', JSON.stringify({
          code: promoCode.trim(),
          discount: promoDiscount,
          appliedAt: new Date().toISOString()
        }));
        toast.success(`Welcome ${user.full_name}! Your ${promoDiscount}% discount is active.`);
      } else {
        toast.success(`Welcome ${user.full_name}!`);
      }

      // If there's a pending booking saved (user attempted to book while unauthenticated), create it now
      try {
        const pending = localStorage.getItem('pendingBooking');
        if (pending) {
          const parsed = JSON.parse(pending);
          const mutation = `mutation CreateBooking($input: BookingInput!) { createBooking(input: $input) { id } }`;
          const resp = await fetch('/api/graphql', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ query: mutation, variables: { input: parsed } }),
          });

          const bookingData = await resp.json();
          if (!bookingData.errors) {
            localStorage.removeItem('pendingBooking');
            toast.success('Your booking was created. Redirecting to dashboard...');
          } else {
            console.warn('Pending booking creation failed', bookingData.errors);
          }
        }
      } catch (err) {
        console.error('Failed to create pending booking after auth', err);
      }

      setTimeout(() => {
        router.push(user.role === 'ADMIN' ? '/admin' : '/dashboard');
      }, 800);
    } catch (error) {
      console.error('Auth error:', error);
      toast.error('Authentication failed');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-black">
      <Toaster position="top-right" />

      {/* 3D Background */}
      <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full z-0" />

      {/* Scanlines */}
      <div className="fixed inset-0 z-10 pointer-events-none opacity-5">
        <div className="w-full h-full" style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255, 176, 32, 0.25) 2px, rgba(255, 176, 32, 0.25) 4px)',
        }} />
      </div>

      {/* Content */}
      <div className="relative z-20 min-h-screen flex items-center justify-center px-4 sm:px-6 py-8">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8 sm:mb-12">
            <div className="inline-block w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-gold-500 to-burgundy-600 rounded-2xl transform rotate-45 mb-4 sm:mb-6">
              <div className="w-full h-full flex items-center justify-center transform -rotate-45">
                <span className="text-white font-black text-2xl sm:text-3xl">JRC</span>
              </div>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-white mb-2 tracking-wider">Jasmin Rent Cars</h1>
            <p className="text-gold-500 font-bold tracking-[0.2em] sm:tracking-[0.3em] text-xs sm:text-sm"></p>
            <p className="text-gray-400 mt-3 sm:mt-4 text-sm sm:text-base">
              {isSignup ? t('createAccountTitle') : t('signInTitle')}
            </p>
          </div>

          {/* Form */}
          <div className="bg-gray-900/50 backdrop-blur-xl border-2 border-gold-500/20 rounded-2xl p-5 sm:p-8 shadow-2xl shadow-gold-900/20">
            {/* Toggle Login/Signup */}
            <div className="flex mb-6 bg-black/50 rounded-lg p-1">
              <button
                type="button"
                onClick={() => setIsSignup(false)}
                className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${!isSignup ? 'bg-[#FFC800] text-black shadow-lg' : 'text-gray-400 hover:text-white'
                  }`}
              >
                {t('signInBtn')}
              </button>
              <button
                type="button"
                onClick={() => setIsSignup(true)}
                className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${isSignup ? 'bg-[#FFC800] text-black shadow-lg' : 'text-gray-400 hover:text-white'
                  }`}
              >
                {t('signup').toUpperCase()}
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              {isSignup && (
                <>
                  {/* Full Name */}
                  <div>
                    <label className="block text-xs sm:text-sm font-bold text-gold-500 mb-2 tracking-wider">
                      {t('fullName').toUpperCase()}
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required={isSignup}
                      className="w-full px-4 py-3 sm:px-6 sm:py-4 bg-black/50 border-2 border-gold-500/30 hover:border-gold-500 focus:border-gold-500 rounded-xl text-white placeholder-gray-500 outline-none transition-all font-semibold text-sm sm:text-base"
                      placeholder="John Doe"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-xs sm:text-sm font-bold text-gold-500 mb-2 tracking-wider">
                      {t('phone').toUpperCase()}
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required={isSignup}
                      className="w-full px-4 py-3 sm:px-6 sm:py-4 bg-black/50 border-2 border-gold-500/30 hover:border-gold-500 focus:border-gold-500 rounded-xl text-white placeholder-gray-500 outline-none transition-all font-semibold text-sm sm:text-base"
                      placeholder="+1 234 567 890"
                    />
                  </div>
                </>
              )}

              {/* Email */}
              <div>
                <label className="block text-xs sm:text-sm font-bold text-gold-500 mb-2 tracking-wider">
                  {t('email').toUpperCase()}
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 sm:px-6 sm:py-4 bg-black/50 border-2 border-gold-500/30 hover:border-gold-500 focus:border-gold-500 rounded-xl text-white placeholder-gray-500 outline-none transition-all font-semibold text-sm sm:text-base"
                  placeholder="your@email.com"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs sm:text-sm font-bold text-gold-500 mb-2 tracking-wider">
                  {t('password').toUpperCase()}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-4 py-3 sm:px-6 sm:py-4 pr-12 sm:pr-14 bg-black/50 border-2 border-gold-500/30 hover:border-gold-500 focus:border-gold-500 rounded-xl text-white placeholder-gray-500 outline-none transition-all font-semibold text-sm sm:text-base"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#FFC800] transition-colors focus:outline-none"
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Promo Code (Optional) */}
              <div>
                <label className="block text-xs sm:text-sm font-bold text-purple-400 mb-2 tracking-wider">
                  {t('promoCodeLabel')}
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => {
                      setPromoCode(e.target.value.toUpperCase());
                      setPromoValidated(false);
                      setPromoError('');
                    }}
                    className={`flex-1 px-4 py-3 sm:px-6 sm:py-4 bg-black/50 border-2 ${promoValidated
                      ? 'border-green-500'
                      : promoError
                        ? 'border-red-500'
                        : 'border-gray-700 hover:border-purple-500 focus:border-purple-500'
                      } rounded-xl text-white placeholder-gray-500 outline-none transition-all font-semibold text-sm sm:text-base uppercase`}
                    placeholder="GIFT20-A7K9M2"
                  />
                  <button
                    type="button"
                    onClick={validatePromoCode}
                    disabled={validatingPromo || !promoCode.trim()}
                    className="w-full sm:w-auto px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-bold text-xs sm:text-sm rounded-xl transition-all whitespace-nowrap shrink-0"
                  >
                    {validatingPromo ? '...' : promoValidated ? '✓' : t('applyBtn')}
                  </button>
                </div>
                {promoValidated && (
                  <p className="mt-2 text-green-400 text-xs sm:text-sm font-bold">
                    ✓ {promoDiscount}% discount will be applied to your bookings
                  </p>
                )}
                {promoError && (
                  <p className="mt-2 text-red-400 text-xs sm:text-sm font-bold">
                    ✗ {promoError}
                  </p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 sm:py-4 bg-gradient-to-r from-gold-600 to-burgundy-600 hover:from-gold-700 hover:to-burgundy-700 text-white font-black text-base sm:text-lg rounded-xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg shadow-gold-900/50"
              >
                {loading ? t('processing') : (isSignup ? t('createAccountBtn') : t('signInBtn'))}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => setIsSignup(!isSignup)}
                className="text-gray-400 hover:text-white text-sm"
              >
                {isSignup ? `${t('alreadyHaveAccount')} ${t('login')}` : `${t('dontHaveAccount')} ${t('signup')}`}
              </button>
            </div>

            {/* Demo Accounts - hide on signup */}
            {!isSignup && (
              <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t-2 border-gray-800">
                <p className="text-xs sm:text-sm text-gray-400 text-center mb-3 sm:mb-4 font-bold">{t('demoAccounts')}</p>
                <div className="space-y-2 sm:space-y-3">
                  <div className="bg-black/50 border-2 border-gold-500/20 rounded-xl p-3 sm:p-4">
                    <p className="font-black text-gold-500 text-xs sm:text-sm mb-1 sm:mb-2">{t('adminAccess')}</p>
                    <p className="text-gray-400 text-xs sm:text-sm">Email: admin@carrental.com</p>
                    <p className="text-gray-400 text-xs sm:text-sm">Password: Admin@123</p>
                  </div>
                  <div className="bg-black/50 border-2 border-green-500/20 rounded-xl p-3 sm:p-4">
                    <p className="font-black text-green-500 text-xs sm:text-sm mb-1 sm:mb-2">{t('userAccess')}</p>
                    <p className="text-gray-400 text-xs sm:text-sm">Email: user@test.com</p>
                    <p className="text-gray-400 text-xs sm:text-sm">Password: User@123</p>
                  </div>
                </div>
              </div>
            )}

            {/* Links */}
            <div className="mt-6 sm:mt-8 text-center">
              <a href="/" className="text-gold-500 hover:text-gold-400 transition-colors font-bold text-sm sm:text-base">
                {t('backToHome')}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center"><div className="w-20 h-20 border-4 border-gold-500 border-t-transparent rounded-full animate-spin" /></div>}>
      <LoginContent />
    </Suspense>
  );
}
