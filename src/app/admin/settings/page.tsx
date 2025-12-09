'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import toast, { Toaster } from 'react-hot-toast';
import AdminLayout from '@/components/admin/AdminLayout';

export default function Settings() {
  const { t } = useTranslation();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      router.push('/login');
      return;
    }

    const parsedUser = JSON.parse(userData);
    if (parsedUser.role !== 'ADMIN') {
      toast.error(t('accessDenied'));
      router.push('/');
      return;
    }

    setUser(parsedUser);
  }, [router, t]);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-20 h-20 border-4 border-gold-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <AdminLayout userName={user?.full_name} userRole={user?.role}>
      <Toaster position="top-right" />

      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-black text-white mb-2">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-500 to-burgundy-500">{t('settingsTitle')}</span>
          </h1>
          <p className="text-gray-400">{t('platformConfiguration')}</p>
        </div>

        {/* Settings Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* General Settings */}
          <div className="bg-gray-900 border-2 border-gold-500/20 rounded-2xl p-8">
            <div className="flex items-center space-x-3 mb-6">
              <span className="text-4xl">⚙️</span>
              <h2 className="text-2xl font-black text-white">{t('general')}</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-gold-500 font-bold mb-2">{t('platformName')}</label>
                <input
                  type="text"
                  defaultValue="Jasmin Rent Cars"
                  className="w-full px-4 py-3 bg-black border-2 border-gray-700 focus:border-gold-500 rounded-lg text-white outline-none"
                />
              </div>
              <div>
                <label className="block text-gold-500 font-bold mb-2">{t('contactEmail')}</label>
                <input
                  type="email"
                  defaultValue="contact@velocity.com"
                  className="w-full px-4 py-3 bg-black border-2 border-gray-700 focus:border-gold-500 rounded-lg text-white outline-none"
                />
              </div>
              <button className="w-full px-6 py-3 bg-gradient-to-r from-gold-600 to-burgundy-600 hover:from-gold-700 hover:to-burgundy-700 text-white font-bold rounded-xl transition-all">
                Sauvegarder
              </button>
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-gray-900 border-2 border-gold-500/20 rounded-2xl p-8">
            <div className="flex items-center space-x-3 mb-6">
              <span className="text-4xl">🔔</span>
              <h2 className="text-2xl font-black text-white">{t('notifications')}</h2>
            </div>
            <div className="space-y-4">
              {[
                { label: t('emailNewBookings'), checked: true },
                { label: t('emailNewUsers'), checked: true },
                { label: t('emailPayments'), checked: true },
                { label: t('pushNotifications'), checked: true },
              ].map((item, i) => (
                <label key={i} className="flex items-center space-x-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    defaultChecked={item.checked}
                    className="w-6 h-6 rounded bg-gray-800 border-2 border-gray-700 checked:bg-gold-600 checked:border-gold-600"
                  />
                  <span className="text-white font-semibold group-hover:text-gold-500 transition-colors">
                    {item.label}
                  </span>
                </label>
              ))}
              <button className="w-full px-6 py-3 bg-gradient-to-r from-gold-600 to-burgundy-600 hover:from-gold-700 hover:to-burgundy-700 text-white font-bold rounded-xl transition-all">
                {t('save')}
              </button>
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-gray-900 border-2 border-gold-500/20 rounded-2xl p-8">
            <div className="flex items-center space-x-3 mb-6">
              <span className="text-4xl">💰</span>
              <h2 className="text-2xl font-black text-white">{t('pricing')}</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-gold-500 font-bold mb-2">{t('commission')}</label>
                <input
                  type="number"
                  defaultValue="15"
                  className="w-full px-4 py-3 bg-black border-2 border-gray-700 focus:border-gold-500 rounded-lg text-white outline-none"
                />
              </div>
              <div>
                <label className="block text-gold-500 font-bold mb-2">{t('vat')}</label>
                <input
                  type="number"
                  defaultValue="20"
                  className="w-full px-4 py-3 bg-black border-2 border-gray-700 focus:border-gold-500 rounded-lg text-white outline-none"
                />
              </div>
              <button className="w-full px-6 py-3 bg-gradient-to-r from-gold-600 to-burgundy-600 hover:from-gold-700 hover:to-burgundy-700 text-white font-bold rounded-xl transition-all">
                Sauvegarder
              </button>
            </div>
          </div>

          {/* Security */}
          <div className="bg-gray-900 border-2 border-gold-500/20 rounded-2xl p-8">
            <div className="flex items-center space-x-3 mb-6">
              <span className="text-4xl">🔒</span>
              <h2 className="text-2xl font-black text-white">{t('security')}</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-gold-500 font-bold mb-2">{t('changePassword')}</label>
                <input
                  type="password"
                  placeholder={t('newPassword')}
                  className="w-full px-4 py-3 bg-black border-2 border-gray-700 focus:border-gold-500 rounded-lg text-white outline-none mb-3"
                />
                <input
                  type="password"
                  placeholder={t('confirmNewPassword')}
                  className="w-full px-4 py-3 bg-black border-2 border-gray-700 focus:border-gold-500 rounded-lg text-white outline-none"
                />
              </div>
              <button className="w-full px-6 py-3 bg-gradient-to-r from-gold-600 to-burgundy-600 hover:from-gold-700 hover:to-burgundy-700 text-white font-bold rounded-xl transition-all">
                {t('updateBtn')}
              </button>
            </div>
          </div>
        </div>

        {/* System Info */}
        <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-gold-500/20 rounded-2xl p-8">
          <div className="flex items-center space-x-3 mb-6">
            <span className="text-4xl">💻</span>
            <h2 className="text-2xl font-black text-white">{t('systemInfo')}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-gray-400 text-sm mb-1">{t('version')}</p>
              <p className="text-white font-black text-2xl">v1.0.0</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-1">{t('database')}</p>
              <p className="text-green-500 font-black text-2xl">✓ {t('connected')}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-1">{t('server')}</p>
              <p className="text-green-500 font-black text-2xl">✓ {t('online')}</p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
