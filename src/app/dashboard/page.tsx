'use client';

import { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';

export default function DashboardPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'bookings' | 'reviews' | 'account'>('bookings');
  const [ratingState, setRatingState] = useState<{ bookingId: string | null; rating: number; comment: string }>({ bookingId: null, rating: 5, comment: '' });
  const [user, setUser] = useState<any | null>(null);
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { t, i18n } = useTranslation();

  const [profileForm, setProfileForm] = useState({ full_name: '', phone: '', address: '', preferred_language: 'en' });

  useEffect(() => {
    const fetchMyBookings = async () => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      if (!token) {
        router.push('/login');
        return;
      }

      try {
        const response = await fetch('/api/graphql', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            query: `query { myBookings { id car_id start_date end_date total_days total_price status notes created_at car { id name brand model image_base64 price_per_day } } }`,
          }),
        });

        const data = await response.json();
        if (data.errors) {
          console.error(data.errors);
          toast.error('Failed to load bookings');
          setLoading(false);
          return;
        }

        setBookings(data.data.myBookings || []);
      } catch (error) {
        console.error('Error fetching bookings', error);
        toast.error('Failed to load bookings');
      } finally {
        setLoading(false);
      }
    };

    fetchMyBookings();
  }, [router]);

  useEffect(() => {
    try {
      const u = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
      if (u) setUser(JSON.parse(u));
    } catch (e) { /* ignore */ }
  }, []);

  useEffect(() => {
    if (user) {
      setProfileForm({
        full_name: user.full_name || '',
        phone: user.phone || '',
        address: user.address || '',
        preferred_language: user.preferred_language || (i18n.language || 'en'),
      });

      // Sync app language if different from user preference
      if (user.preferred_language && user.preferred_language !== i18n.language) {
        i18n.changeLanguage(user.preferred_language);
        localStorage.setItem('language', user.preferred_language);
      }
    }
  }, [user, i18n.language]);

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-20 h-20 border-4 border-gold-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Toaster position="top-right" />

      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-[60] w-12 h-12 bg-gray-900 border-2 border-gold-500/20 rounded-xl flex items-center justify-center"
      >
        <svg className="w-6 h-6 text-gold-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          {isMobileMenuOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/75 z-40" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      {/* Fixed left sidebar like Admin */}
      <aside className={`fixed left-0 top-0 h-screen bg-gray-900 border-r-2 border-gold-500/20 transition-all z-50 p-4 sm:p-6 ${isCollapsed ? 'w-20' : 'w-72'} ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-gold-500 to-burgundy-600 rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6a1 1 0 001 1h.05a2.5 2.5 0 014.9 0h.05a1 1 0 001-1v-4.5a1 1 0 00-.293-.707l-2-2A1 1 0 0017 7h-3z" />
              </svg>
            </div>
            <div>
              <h1 className="text-white font-black text-base sm:text-lg">JRC</h1>
              <p className="text-gold-500 text-xs font-bold">USER</p>
            </div>
          </div>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex w-10 h-10 rounded-lg bg-gold-500/10 hover:bg-gold-500/20 items-center justify-center transition-colors"
          >
            <svg className={`w-5 h-5 text-gold-500 transition-transform ${isCollapsed ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          </button>
        </div>

        <div className="mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full bg-gold-500 flex items-center justify-center text-black font-black text-lg">
              {user ? (user.full_name ? user.full_name.split(' ').map((s: any) => s[0]).slice(0, 2).join('') : user.email?.[0]?.toUpperCase()) : 'U'}
            </div>
            <div>
              <div className="text-sm text-gray-300 font-bold">{user?.full_name || 'User'}</div>
              <div className="text-xs text-gray-500">{user?.email || ''}</div>
            </div>
          </div>
        </div>

        <nav className="flex flex-col gap-2">
          <button onClick={() => setView('bookings')} className={`w-full text-left px-3 py-3 rounded-xl flex items-center gap-3 ${view === 'bookings' ? 'bg-gold-600 text-black font-bold' : 'text-gray-300 hover:bg-gold-500/10'}`}>
            <span className="text-xl">📅</span>
            <div className="flex-1 text-left"><p className="font-bold text-sm">My Bookings</p><p className="text-xs opacity-75">Your reservations</p></div>
          </button>

          <button onClick={() => setView('reviews')} className={`w-full text-left px-3 py-3 rounded-xl flex items-center gap-3 ${view === 'reviews' ? 'bg-gold-600 text-black font-bold' : 'text-gray-300 hover:bg-gold-500/10'}`}>
            <span className="text-xl">⭐</span>
            <div className="flex-1 text-left"><p className="font-bold text-sm">My Reviews</p><p className="text-xs opacity-75">Your feedback</p></div>
          </button>

          <button onClick={() => setView('account')} className={`w-full text-left px-3 py-3 rounded-xl flex items-center gap-3 ${view === 'account' ? 'bg-gold-600 text-black font-bold' : 'text-gray-300 hover:bg-gold-500/10'}`}>
            <span className="text-xl">👤</span>
            <div className="flex-1 text-left"><p className="font-bold text-sm">Profile</p><p className="text-xs opacity-75">Manage account</p></div>
          </button>
        </nav>

        <div className="mt-6">
          <button onClick={handleLogout} className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold">
            <span className="text-xl">🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main content shifted right to account for sidebar */}
      {/* Main content shifted right to account for sidebar */}
      <main className={`${isCollapsed ? 'lg:ml-20' : 'lg:ml-72'} p-6 pt-20 lg:pt-6 max-w-6xl mx-auto`}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black">{view === 'bookings' ? 'My Bookings' : view === 'reviews' ? 'My Reviews' : 'Profile'}</h1>
            <div className="text-gray-400 text-sm">Manage your bookings and reviews</div>
          </div>
        </div>

        {view === 'bookings' && (
          <>
            {/* Contact Support Section */}
            <div className="bg-gradient-to-r from-gray-900 to-black border border-gold-500/30 rounded-2xl p-6 mb-8 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gold-500/10 rounded-full blur-3xl -mr-16 -mt-16 transition-all group-hover:bg-gold-500/20"></div>
              <h2 className="text-xl font-bold text-white mb-4 relative z-10">Need Help with your Booking?</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 relative z-10">
                <a href="tel:+21622420360" className="flex items-center justify-center gap-3 px-4 py-3 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-xl transition-all group/btn">
                  <span className="text-xl group-hover/btn:scale-110 transition-transform">📞</span>
                  <span className="font-bold text-sm">Call Us</span>
                </a>
                <a href="https://wa.me/21622420360" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-3 px-4 py-3 bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/30 text-[#25D366] rounded-xl transition-all group/btn">
                  <span className="text-xl group-hover/btn:scale-110 transition-transform">💬</span>
                  <span className="font-bold text-sm">WhatsApp</span>
                </a>
                <a href="https://m.me/100083471611688" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-3 px-4 py-3 bg-[#0084FF]/10 hover:bg-[#0084FF]/20 border border-[#0084FF]/30 text-[#0084FF] rounded-xl transition-all group/btn">
                  <span className="text-xl group-hover/btn:scale-110 transition-transform">💬</span>
                  <span className="font-bold text-sm">Messenger</span>
                </a>
              </div>
            </div>

            {bookings.length === 0 && (
              <div className="bg-gray-900 border border-gray-800 rounded-lg p-8 text-center">
                <p className="text-gray-400">You have no bookings yet.</p>
                <button onClick={() => router.push('/')} className="mt-4 px-4 py-2 bg-gold-600 rounded-lg font-bold text-black">Browse Cars</button>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {bookings.map((b) => (
                <div key={b.id} className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden hover:border-gold-500/30 transition-colors">
                  <div className="flex flex-col sm:flex-row">
                    <div className="w-full sm:w-40 h-48 sm:h-auto bg-gray-800 flex items-center justify-center relative">
                      {b.car?.image_base64 ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={b.car.image_base64} alt={typeof b.car?.name === 'string' ? b.car.name : (b.car?.name?.en || Object.values(b.car?.name || {})[0])} className="w-full h-full object-cover" />
                      ) : (
                        <div className="text-4xl">🚗</div>
                      )}
                      <div className="absolute top-2 right-2 sm:hidden px-2 py-1 bg-black/60 backdrop-blur rounded text-xs font-bold border border-white/10">
                        {b.status}
                      </div>
                    </div>
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-1">
                          <h3 className="text-xl font-bold">{b.car?.brand} {b.car?.model}</h3>
                          <span className="hidden sm:block text-xs font-bold px-2 py-1 bg-gray-800 rounded border border-gray-700">{b.status}</span>
                        </div>
                        <p className="text-gray-400 text-sm mb-3">
                          {(() => {
                            try {
                              const start = new Date(b.start_date);
                              const end = new Date(b.end_date);
                              if (isNaN(start.getTime())) return 'Date pending...';
                              return `${start.toLocaleDateString()} ${start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} → ${end.toLocaleDateString()}`;
                            } catch { return 'Date pending...'; }
                          })()}
                        </p>
                      </div>
                      <div className="flex items-end justify-between mt-2">
                        <div className="text-gold-500 font-bold text-xl">${b.total_price.toFixed(2)}</div>
                        {/* Mobile Actions in Card Body for better touch target */}
                        <div className="sm:hidden flex gap-2 w-full mt-4">
                          <button onClick={() => router.push(`/cars/${b.car?.id}`)} className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm font-bold">View</button>
                          <button onClick={() => setRatingState({ bookingId: b.id, rating: 5, comment: '' })} className="flex-1 px-3 py-2 bg-gold-600 text-black rounded-lg text-sm font-bold">Rate</button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Desktop Actions Footer */}
                  <div className="hidden sm:flex p-4 border-t border-gray-800 bg-black/30 items-center justify-between">
                    <div className="text-xs text-gray-400">
                      Booked on {(() => {
                        try { return new Date(b.created_at).toLocaleDateString(); } catch { return '...'; }
                      })()}
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => router.push(`/cars/${b.car?.id}`)} className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm font-bold transition-colors">View Car</button>
                      <button onClick={() => setRatingState({ bookingId: b.id, rating: 5, comment: '' })} className="px-3 py-1.5 bg-gold-600 hover:bg-gold-500 text-black rounded-lg text-sm font-bold transition-colors">Rate</button>
                    </div>
                  </div>

                  {/* Inline rating form when selected */}
                  {ratingState.bookingId === b.id && (
                    <div className="p-4 border-t border-gray-800 bg-gray-900 border-2 border-gold-500/20 m-[-1px] rounded-b-2xl">
                      <div className="mb-3 flex justify-between items-center">
                        <div className="text-sm font-bold text-white">Rate your experience</div>
                        <button onClick={() => setRatingState({ bookingId: null, rating: 5, comment: '' })} className="text-gray-400 hover:text-white">✕</button>
                      </div>
                      <div className="flex items-center gap-2 mb-3 overflow-x-auto pb-1">
                        {[1, 2, 3, 4, 5].map((n) => (
                          <button key={n} onClick={() => setRatingState(s => ({ ...s, rating: n }))} className={`px-4 py-2 rounded-lg font-bold transition-all shrink-0 ${ratingState.rating >= n ? 'bg-gold-500 text-black shadow-lg shadow-gold-500/20' : 'bg-gray-800 text-gray-500'}`}>{n}★</button>
                        ))}
                      </div>
                      <textarea value={ratingState.comment} onChange={(e) => setRatingState(s => ({ ...s, comment: e.target.value }))} className="w-full bg-black/50 border border-gray-700 focus:border-gold-500 rounded-xl p-3 text-sm text-white mb-3 outline-none transition-colors" placeholder="Write a short review..." rows={3} />
                      <div className="flex gap-2">
                        <button onClick={async () => {
                          const token = localStorage.getItem('token');
                          if (!token) { router.push('/login'); return; }
                          try {
                            const mutation = `mutation CreateRating($input: RatingInput!) { createRating(input: $input) { id } }`;
                            const resp = await fetch('/api/graphql', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify({ query: mutation, variables: { input: { booking_id: ratingState.bookingId, rating: ratingState.rating, comment: ratingState.comment } } }) });
                            const res = await resp.json();
                            if (res.errors) { toast.error(res.errors[0]?.message || 'Failed'); return; }
                            toast.success('Thanks for your review');
                            setRatingState({ bookingId: null, rating: 5, comment: '' });
                          } catch (err) { console.error(err); toast.error('Failed to submit review'); }
                        }} className="flex-1 px-4 py-3 bg-gold-600 hover:bg-gold-500 text-black rounded-xl font-bold transition-all">Submit Review</button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}

        {view === 'reviews' && (
          <div className="bg-gray-900 rounded-2xl p-6">
            <p className="text-gray-300">Your reviews will appear here after you submit them.</p>
          </div>
        )}

        {view === 'account' && (
          <div className="bg-gray-900 rounded-2xl p-6 max-w-xl">
            <h2 className="text-2xl font-bold mb-4">Account Settings</h2>
            <form onSubmit={async (e) => {
              e.preventDefault();
              const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
              if (!token) { toast.error('Please login to update your profile'); router.push('/login'); return; }

              try {
                const input = { full_name: profileForm.full_name, phone: profileForm.phone, address: profileForm.address, preferred_language: profileForm.preferred_language };
                const mutation = `mutation UpdateUser($input: UpdateUserInput!) { updateUser(input: $input) { id email full_name phone address preferred_language } }`;
                const resp = await fetch('/api/graphql', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify({ query: mutation, variables: { input } }) });
                const res = await resp.json();
                if (res.errors) { console.error(res.errors); toast.error(res.errors[0]?.message || 'Update failed'); return; }
                const updated = res.data.updateUser;
                // update local state and storage
                setUser(updated);
                localStorage.setItem('user', JSON.stringify(updated));

                // If language changed, apply it immediately
                if (updated.preferred_language && updated.preferred_language !== i18n.language) {
                  i18n.changeLanguage(updated.preferred_language);
                  localStorage.setItem('language', updated.preferred_language);
                }

                toast.success('Profile updated');
              } catch (err) {
                console.error(err);
                toast.error('Failed to update profile');
              }
            }}>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Full name</label>
                  <input className="w-full px-3 py-2 bg-black border border-gray-800 rounded text-white" value={profileForm.full_name} onChange={(e) => setProfileForm(s => ({ ...s, full_name: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Phone</label>
                  <input className="w-full px-3 py-2 bg-black border border-gray-800 rounded text-white" value={profileForm.phone} onChange={(e) => setProfileForm(s => ({ ...s, phone: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Address</label>
                  <input className="w-full px-3 py-2 bg-black border border-gray-800 rounded text-white" value={profileForm.address} onChange={(e) => setProfileForm(s => ({ ...s, address: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Preferred language</label>
                  <select className="w-full px-3 py-2 bg-black border border-gray-800 rounded text-white" value={profileForm.preferred_language} onChange={(e) => setProfileForm(s => ({ ...s, preferred_language: e.target.value }))}>
                    <option value="en">English</option>
                    <option value="fr">Français</option>
                    <option value="ar">العربية</option>
                    <option value="it">Italiano</option>
                  </select>
                </div>
                <div className="flex gap-2 mt-3">
                  <button type="submit" className="px-4 py-2 bg-gold-600 rounded font-bold">Save</button>
                  <button type="button" onClick={() => { setProfileForm({ full_name: user?.full_name || '', phone: user?.phone || '', address: user?.address || '', preferred_language: user?.preferred_language || 'en' }); }} className="px-4 py-2 bg-gray-700 rounded">Reset</button>
                </div>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
