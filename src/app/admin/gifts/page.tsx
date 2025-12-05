'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import AdminLayout from '@/components/admin/AdminLayout';

interface Gift {
  id: string;
  title: string;
  description: string;
  emoji: string;
  discount_percentage: number;
  promo_code: string | null;
  is_active: boolean;
  display_order: number;
}

interface User {
  id: number;
  email: string;
  full_name: string;
  role: string;
}

// Popular emoji options for gifts
const EMOJI_OPTIONS = [
  '🎁', '💎', '🎉', '🍀', '👑', '⭐', '🎊', '🏆',
  '💰', '🌟', '🔥', '✨', '🎈', '🎀', '💝', '🌈'
];

export default function AdminGiftsPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGift, setEditingGift] = useState<Gift | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    title_en: '',
    title_fr: '',
    title_ar: '',
    title_it: '',
    description_en: '',
    description_fr: '',
    description_ar: '',
    description_it: '',
    emoji: '🎁',
    discount_percentage: 10,
    promo_code: '',
    is_active: true,
    display_order: 0,
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
      toast.error('Access denied');
      router.push('/');
      return;
    }

    setUser(parsedUser);
    fetchGifts(token);
  }, [router]);

  const fetchGifts = async (token: string) => {
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
              allGifts {
                id title description emoji discount_percentage promo_code is_active display_order
              }
            }
          `,
        }),
      });

      const data = await response.json();
      if (!data.errors) {
        setGifts(data.data.allGifts);
      } else {
        toast.error('Failed to load gifts');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to load gifts');
    } finally {
      setLoading(false);
    }
  };

  const parseMultilingual = (text: string) => {
    try {
      const parsed = JSON.parse(text);
      return {
        en: parsed.en || '',
        fr: parsed.fr || '',
        ar: parsed.ar || '',
        it: parsed.it || '',
      };
    } catch {
      return { en: text, fr: text, ar: text, it: text };
    }
  };

  const openEditModal = (gift: Gift) => {
    const title = parseMultilingual(gift.title);
    const description = parseMultilingual(gift.description);

    setFormData({
      title_en: title.en,
      title_fr: title.fr,
      title_ar: title.ar,
      title_it: title.it,
      description_en: description.en,
      description_fr: description.fr,
      description_ar: description.ar,
      description_it: description.it,
      emoji: gift.emoji,
      discount_percentage: gift.discount_percentage,
      promo_code: gift.promo_code || '',
      is_active: gift.is_active,
      display_order: gift.display_order,
    });
    setEditingGift(gift);
    setIsModalOpen(true);
  };

  const openCreateModal = () => {
    setFormData({
      title_en: '',
      title_fr: '',
      title_ar: '',
      title_it: '',
      description_en: '',
      description_fr: '',
      description_ar: '',
      description_it: '',
      emoji: '🎁',
      discount_percentage: 10,
      promo_code: '',
      is_active: true,
      display_order: gifts.length + 1,
    });
    setEditingGift(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) return;

    const title = JSON.stringify({
      en: formData.title_en,
      fr: formData.title_fr,
      ar: formData.title_ar,
      it: formData.title_it,
    });

    const description = JSON.stringify({
      en: formData.description_en,
      fr: formData.description_fr,
      ar: formData.description_ar,
      it: formData.description_it,
    });

    const mutation = editingGift
      ? `mutation UpdateGift($id: String!, $input: GiftInput!) {
          updateGift(id: $id, input: $input) {
            id title description emoji discount_percentage promo_code is_active display_order
          }
        }`
      : `mutation CreateGift($input: GiftInput!) {
          createGift(input: $input) {
            id title description emoji discount_percentage promo_code is_active display_order
          }
        }`;

    const variables: any = {
      input: {
        title,
        description,
        emoji: formData.emoji,
        discount_percentage: parseInt(formData.discount_percentage.toString()),
        promo_code: formData.promo_code || null,
        is_active: formData.is_active,
        display_order: parseInt(formData.display_order.toString()),
      },
    };

    if (editingGift) {
      variables.id = editingGift.id;
    }

    try {
      const response = await fetch('/api/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ query: mutation, variables }),
      });

      const data = await response.json();
      if (!data.errors) {
        toast.success(editingGift ? 'Gift updated!' : 'Gift created!');
        setIsModalOpen(false);
        fetchGifts(token);
      } else {
        toast.error(data.errors[0].message);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Operation failed');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this gift?')) return;

    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch('/api/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          query: `mutation DeleteGift($id: String!) { deleteGift(id: $id) }`,
          variables: { id },
        }),
      });

      const data = await response.json();
      if (!data.errors) {
        toast.success('Gift deleted!');
        fetchGifts(token);
      } else {
        toast.error(data.errors[0].message);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Delete failed');
    }
  };

  const handleToggleStatus = async (id: string) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch('/api/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          query: `mutation ToggleGiftStatus($id: String!) {
            toggleGiftStatus(id: $id) {
              id is_active
            }
          }`,
          variables: { id },
        }),
      });

      const data = await response.json();
      if (!data.errors) {
        toast.success('Status updated!');
        fetchGifts(token);
      } else {
        toast.error(data.errors[0].message);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Toggle failed');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-gold-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white font-bold text-xl">LOADING...</p>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout userName={user?.full_name} userRole={user?.role}>
      <Toaster position="top-right" />

      <div className="space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-2">
              GIFT <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">OFFERS</span>
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-gray-400">Manage promotional gifts and discounts</p>
          </div>
          <button
            onClick={openCreateModal}
            className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-xl transition-all transform hover:scale-105"
          >
            + CREATE GIFT
          </button>
        </div>

        {/* Gifts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {gifts.map((gift) => {
            const title = parseMultilingual(gift.title);
            const description = parseMultilingual(gift.description);

            return (
              <div
                key={gift.id}
                className={`bg-gradient-to-br from-gray-900 to-gray-800 border-2 ${
                  gift.is_active ? 'border-purple-500/30' : 'border-gray-700/30'
                } rounded-2xl p-4 sm:p-6 shadow-xl relative overflow-hidden`}
              >
                {/* Active Badge */}
                {gift.is_active && (
                  <div className="absolute top-3 right-3 bg-green-500 text-black text-xs font-bold px-2 py-1 rounded-full">
                    ACTIVE
                  </div>
                )}

                {/* Emoji */}
                <div className="text-5xl sm:text-6xl mb-3 sm:mb-4">{gift.emoji}</div>

                {/* Title */}
                <h3 className="text-lg sm:text-xl font-black text-white mb-2">{title.en}</h3>

                {/* Description */}
                <p className="text-gray-400 text-sm mb-3 sm:mb-4 line-clamp-2">{description.en}</p>

                {/* Discount */}
                <div className="flex items-center gap-2 mb-3 sm:mb-4">
                  <span className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">
                    {gift.discount_percentage}%
                  </span>
                  <span className="text-gray-400 text-sm">OFF</span>
                </div>

                {/* Promo Code */}
                {gift.promo_code && (
                  <div className="bg-black/50 border border-purple-500/30 rounded-lg p-2 mb-3 sm:mb-4">
                    <span className="text-xs text-gray-400">CODE:</span>
                    <span className="text-sm font-bold text-purple-400 ml-2">{gift.promo_code}</span>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleToggleStatus(gift.id)}
                    className={`flex-1 py-2 ${
                      gift.is_active
                        ? 'bg-yellow-600 hover:bg-yellow-700'
                        : 'bg-green-600 hover:bg-green-700'
                    } text-white text-sm font-bold rounded-lg transition-colors`}
                  >
                    {gift.is_active ? 'DEACTIVATE' : 'ACTIVATE'}
                  </button>
                  <button
                    onClick={() => openEditModal(gift)}
                    className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-lg transition-colors"
                  >
                    EDIT
                  </button>
                  <button
                    onClick={() => handleDelete(gift.id)}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-lg transition-colors"
                  >
                    🗑
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {gifts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎁</div>
            <h3 className="text-xl font-bold text-white mb-2">No gifts yet</h3>
            <p className="text-gray-400 mb-6">Create your first promotional gift offer</p>
            <button
              onClick={openCreateModal}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-xl transition-all transform hover:scale-105"
            >
              CREATE FIRST GIFT
            </button>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 border-2 border-purple-500/30 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8">
            <h2 className="text-2xl sm:text-3xl font-black text-white mb-6">
              {editingGift ? 'EDIT GIFT' : 'CREATE NEW GIFT'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Emoji Selector */}
              <div>
                <label className="block text-sm font-bold text-purple-400 mb-3">SELECT EMOJI</label>
                <div className="grid grid-cols-8 gap-2">
                  {EMOJI_OPTIONS.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setFormData({ ...formData, emoji })}
                      className={`text-3xl p-3 rounded-lg border-2 transition-all ${
                        formData.emoji === emoji
                          ? 'border-purple-500 bg-purple-500/20 scale-110'
                          : 'border-gray-700 hover:border-purple-500/50'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              {/* Title (Multilingual) */}
              <div>
                <label className="block text-sm font-bold text-purple-400 mb-2">TITLE</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="English"
                    value={formData.title_en}
                    onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
                    className="px-4 py-3 bg-black/50 border-2 border-gray-700 focus:border-purple-500 rounded-lg text-white outline-none"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Français"
                    value={formData.title_fr}
                    onChange={(e) => setFormData({ ...formData, title_fr: e.target.value })}
                    className="px-4 py-3 bg-black/50 border-2 border-gray-700 focus:border-purple-500 rounded-lg text-white outline-none"
                  />
                  <input
                    type="text"
                    placeholder="العربية"
                    value={formData.title_ar}
                    onChange={(e) => setFormData({ ...formData, title_ar: e.target.value })}
                    className="px-4 py-3 bg-black/50 border-2 border-gray-700 focus:border-purple-500 rounded-lg text-white outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Italiano"
                    value={formData.title_it}
                    onChange={(e) => setFormData({ ...formData, title_it: e.target.value })}
                    className="px-4 py-3 bg-black/50 border-2 border-gray-700 focus:border-purple-500 rounded-lg text-white outline-none"
                  />
                </div>
              </div>

              {/* Description (Multilingual) */}
              <div>
                <label className="block text-sm font-bold text-purple-400 mb-2">DESCRIPTION</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <textarea
                    placeholder="English"
                    value={formData.description_en}
                    onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
                    className="px-4 py-3 bg-black/50 border-2 border-gray-700 focus:border-purple-500 rounded-lg text-white outline-none"
                    rows={3}
                    required
                  />
                  <textarea
                    placeholder="Français"
                    value={formData.description_fr}
                    onChange={(e) => setFormData({ ...formData, description_fr: e.target.value })}
                    className="px-4 py-3 bg-black/50 border-2 border-gray-700 focus:border-purple-500 rounded-lg text-white outline-none"
                    rows={3}
                  />
                  <textarea
                    placeholder="العربية"
                    value={formData.description_ar}
                    onChange={(e) => setFormData({ ...formData, description_ar: e.target.value })}
                    className="px-4 py-3 bg-black/50 border-2 border-gray-700 focus:border-purple-500 rounded-lg text-white outline-none"
                    rows={3}
                  />
                  <textarea
                    placeholder="Italiano"
                    value={formData.description_it}
                    onChange={(e) => setFormData({ ...formData, description_it: e.target.value })}
                    className="px-4 py-3 bg-black/50 border-2 border-gray-700 focus:border-purple-500 rounded-lg text-white outline-none"
                    rows={3}
                  />
                </div>
              </div>

              {/* Discount & Promo Code */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-purple-400 mb-2">DISCOUNT %</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.discount_percentage}
                    onChange={(e) => setFormData({ ...formData, discount_percentage: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 bg-black/50 border-2 border-gray-700 focus:border-purple-500 rounded-lg text-white outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-purple-400 mb-2">PROMO CODE (Optional)</label>
                  <input
                    type="text"
                    placeholder="GIFT20-ABC123"
                    value={formData.promo_code}
                    onChange={(e) => setFormData({ ...formData, promo_code: e.target.value.toUpperCase() })}
                    className="w-full px-4 py-3 bg-black/50 border-2 border-gray-700 focus:border-purple-500 rounded-lg text-white outline-none uppercase"
                  />
                </div>
              </div>

              {/* Display Order & Active Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-purple-400 mb-2">DISPLAY ORDER</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.display_order}
                    onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 bg-black/50 border-2 border-gray-700 focus:border-purple-500 rounded-lg text-white outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-purple-400 mb-2">STATUS</label>
                  <label className="flex items-center gap-3 px-4 py-3 bg-black/50 border-2 border-gray-700 rounded-lg cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.is_active}
                      onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                      className="w-5 h-5"
                    />
                    <span className="text-white font-bold">Active</span>
                  </label>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-lg transition-colors"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-lg transition-all"
                >
                  {editingGift ? 'UPDATE GIFT' : 'CREATE GIFT'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
