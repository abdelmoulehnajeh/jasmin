'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import AdminLayout from '@/components/admin/AdminLayout';

interface User {
  id: number;
  email: string;
  full_name: string;
  role: string;
}

interface HeroSettings {
  id: string;
  video_url: string;
  mobile_image_url: string | null;
  desktop_image_url: string | null;
  title: string;
  subtitle: string;
  is_active: boolean;
}

export default function HeroSettingsPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    video_url: '',
    mobile_image_url: '',
    desktop_image_url: '',
    title: '',
    subtitle: '',
  });

  useEffect(() => {
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
    fetchHeroSettings(token);
  }, [router]);

  const fetchHeroSettings = async (token: string) => {
    try {
      const response = await fetch('/api/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          query: `
            query {
              heroSettings(language: "en") {
                id
                video_url
                mobile_image_url
                desktop_image_url
                title
                subtitle
                is_active
              }
            }
          `,
        }),
      });

      const data = await response.json();
      if (data.data?.heroSettings) {
        const settings = data.data.heroSettings;
        setFormData({
          video_url: settings.video_url || '',
          mobile_image_url: settings.mobile_image_url || '',
          desktop_image_url: settings.desktop_image_url || '',
          title: settings.title || '',
          subtitle: settings.subtitle || '',
        });
      }
    } catch (error) {
      console.error('Error fetching hero settings:', error);
      toast.error(t('loadingError'));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          query: `
            mutation UpdateHeroSettings($input: HeroSettingsInput!) {
              updateHeroSettings(input: $input) {
                id
                video_url
                title
                subtitle
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
        toast.error(data.errors[0].message);
      } else {
        toast.success(t('heroUpdated'));
      }
    } catch (error) {
      toast.error(t('loadingError'));
      console.error('Error:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-gold-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white font-bold text-xl">{t('loadingText')}</p>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout userName={user?.full_name} userRole={user?.role}>
      <Toaster position="top-right" />

      <div className="space-y-6 sm:space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-2">
            {t('heroSettings')}
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-gray-400">{t('manageHeroVideo')}</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-gray-900 border border-gold-500/20 rounded-2xl p-6 sm:p-8 space-y-6">
            {/* Video URL */}
            <div>
              <label className="block text-white font-bold text-lg mb-2">
                {t('videoUrl')} <span className="text-red-500">*</span>
              </label>
              <p className="text-gray-400 text-sm mb-3">
                {t('videoUrlRequired')}
              </p>
              <input
                type="url"
                required
                value={formData.video_url}
                onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:border-gold-500 focus:ring-2 focus:ring-gold-500 outline-none transition-all"
                placeholder="https://example.com/video.mp4"
              />
            </div>

            {/* Mobile Image URL */}
            <div>
              <label className="block text-white font-bold text-lg mb-2">
                {t('mobileImageUrl')}
              </label>
              <p className="text-gray-400 text-sm mb-3">
                {t('mobileImageOptional')}
              </p>
              <input
                type="url"
                value={formData.mobile_image_url}
                onChange={(e) => setFormData({ ...formData, mobile_image_url: e.target.value })}
                className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:border-gold-500 focus:ring-2 focus:ring-gold-500 outline-none transition-all"
                placeholder="https://example.com/mobile-image.jpg"
              />
            </div>

            {/* Desktop Image URL */}
            <div>
              <label className="block text-white font-bold text-lg mb-2">
                {t('desktopImageUrl')}
              </label>
              <p className="text-gray-400 text-sm mb-3">
                {t('desktopImageOptional')}
              </p>
              <input
                type="url"
                value={formData.desktop_image_url}
                onChange={(e) => setFormData({ ...formData, desktop_image_url: e.target.value })}
                className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:border-gold-500 focus:ring-2 focus:ring-gold-500 outline-none transition-all"
                placeholder="https://example.com/desktop-image.jpg"
              />
            </div>

            {/* Title */}
            <div>
              <label className="block text-white font-bold text-lg mb-2">
                {t('titleHero')}
              </label>
              <p className="text-gray-400 text-sm mb-3">
                {t('mainHeroTitle')}
              </p>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:border-gold-500 focus:ring-2 focus:ring-gold-500 outline-none transition-all"
                placeholder="Bienvenue à Jasmin Rent Cars"
              />
            </div>

            {/* Subtitle */}
            <div>
              <label className="block text-white font-bold text-lg mb-2">
                {t('subtitleHero')}
              </label>
              <p className="text-gray-400 text-sm mb-3">
                {t('heroSubtitleDesc')}
              </p>
              <textarea
                value={formData.subtitle}
                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                rows={3}
                className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:border-gold-500 focus:ring-2 focus:ring-gold-500 outline-none transition-all resize-none"
                placeholder="Votre expérience de location de voiture premium"
              />
            </div>
          </div>

          {/* Preview */}
          {formData.video_url && (
            <div className="bg-gray-900 border border-gold-500/20 rounded-2xl p-6 sm:p-8">
              <h3 className="text-white font-bold text-xl mb-4">{t('videoPreview')}</h3>
              <div className="aspect-video bg-black rounded-lg overflow-hidden">
                {formData.video_url.includes('youtube.com') || formData.video_url.includes('youtu.be') ? (
                  <iframe
                    src={formData.video_url.replace('watch?v=', 'embed/')}
                    className="w-full h-full"
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                  />
                ) : formData.video_url.includes('vimeo.com') ? (
                  <iframe
                    src={formData.video_url.replace('vimeo.com/', 'player.vimeo.com/video/')}
                    className="w-full h-full"
                    allow="autoplay; fullscreen"
                    allowFullScreen
                  />
                ) : (
                  <video
                    src={formData.video_url}
                    controls
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-4 bg-gradient-to-r from-gold-600 to-burgundy-600 hover:from-gold-700 hover:to-burgundy-700 text-white font-black text-lg rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-gold-900/50"
            >
              {saving ? t('saving') : t('saveChanges')}
            </button>
            <button
              type="button"
              onClick={() => router.push('/admin')}
              className="px-8 py-4 bg-gray-800 hover:bg-gray-700 text-white font-bold text-lg rounded-xl transition-all"
            >
              {t('cancelBtn')}
            </button>
          </div>
        </form>

        {/* Help Section */}
        <div className="bg-blue-900/20 border border-blue-500/30 rounded-2xl p-6">
          <h3 className="text-blue-400 font-bold text-lg mb-3 flex items-center">
            <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            {t('usageTips')}
          </h3>
          <ul className="text-blue-300 space-y-2 text-sm">
            <li>{t('tip1')}</li>
            <li>{t('tip2')}</li>
            <li>{t('tip3')}</li>
            <li>{t('tip4')}</li>
          </ul>
        </div>
      </div>
    </AdminLayout>
  );
}
