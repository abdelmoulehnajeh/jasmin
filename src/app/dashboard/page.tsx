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
            query: `query { myBookings { id car_id start_date end_date total_days total_price status pickup_location dropoff_location notes created_at car { id name brand model image_base64 price_per_day } } }`,
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
                <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"/>
                <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6a1 1 0 001 1h.05a2.5 2.5 0 014.9 0h.05a1 1 0 001-1v-4.5a1 1 0 00-.293-.707l-2-2A1 1 0 0017 7h-3z"/>
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
              {user ? (user.full_name ? user.full_name.split(' ').map((s:any)=>s[0]).slice(0,2).join('') : user.email?.[0]?.toUpperCase()) : 'U'}
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
      <main className={`${isCollapsed ? 'lg:ml-20' : 'lg:ml-72'} p-6 max-w-6xl mx-auto` }>
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-4xl font-black">{view === 'bookings' ? 'My Bookings' : view === 'reviews' ? 'My Reviews' : 'Profile'}</h1>
          <div className="text-gray-400">Manage your bookings and reviews</div>
        </div>

        {view === 'bookings' && (
          <>
            {bookings.length === 0 && (
              <div className="bg-gray-900 border border-gray-800 rounded-lg p-8 text-center">
                <p className="text-gray-400">You have no bookings yet.</p>
                <button onClick={() => router.push('/')} className="mt-4 px-4 py-2 bg-gold-600 rounded-lg font-bold">Browse Cars</button>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              {bookings.map((b) => (
                <div key={b.id} className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
                  <div className="flex">
                    <div className="w-40 h-32 bg-gray-800 flex items-center justify-center">
                      {b.car?.image_base64 ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={b.car.image_base64} alt={typeof b.car?.name === 'string' ? b.car.name : (b.car?.name?.en || Object.values(b.car?.name || {})[0])} className="w-full h-full object-cover" />
                      ) : (
                        <div className="text-4xl">🚗</div>
                      )}
                    </div>
                    <div className="p-4 flex-1">
                      <h3 className="text-xl font-bold">{b.car?.brand} {b.car?.model}</h3>
                      <p className="text-gray-400 text-sm mb-2">{new Date(b.start_date).toLocaleDateString()} → {new Date(b.end_date).toLocaleDateString()}</p>
                      <p className="text-gold-500 font-bold">${b.total_price.toFixed(2)}</p>
                      <p className="text-gray-400 text-xs mt-2">Status: {b.status}</p>
                    </div>
                  </div>
                  <div className="p-4 border-t border-gray-800 bg-black/30 flex items-center justify-between">
                    <div className="text-xs text-gray-400">Booked on {new Date(b.created_at).toLocaleString()}</div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => router.push(`/cars/${b.car?.id}`)} className="px-3 py-1 bg-gray-700 rounded">View Car</button>
                      <button onClick={() => setRatingState({ bookingId: b.id, rating: 5, comment: '' })} className="px-3 py-1 bg-gold-600 rounded">Rate</button>
                    </div>
                  </div>

                  {/* Inline rating form when selected */}
                  {ratingState.bookingId === b.id && (
                    <div className="p-4 border-t border-gray-800 bg-gray-900">
                      <div className="mb-2 text-sm text-gray-300">Leave a rating</div>
                      <div className="flex items-center gap-2 mb-2">
                        {[1,2,3,4,5].map((n) => (
                          <button key={n} onClick={() => setRatingState(s => ({ ...s, rating: n }))} className={`px-2 py-1 rounded ${ratingState.rating >= n ? 'bg-gold-500 text-black' : 'bg-gray-700 text-gray-300'}`}>{n}★</button>
                        ))}
                      </div>
                      <textarea value={ratingState.comment} onChange={(e) => setRatingState(s => ({ ...s, comment: e.target.value }))} className="w-full bg-black/50 border border-gray-800 rounded p-2 text-sm text-white mb-2" placeholder="Write a short review..." />
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
                        }} className="px-4 py-2 bg-gold-600 rounded font-bold">Submit</button>
                        <button onClick={() => setRatingState({ bookingId: null, rating: 5, comment: '' })} className="px-3 py-2 bg-gray-700 rounded">Cancel</button>
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
