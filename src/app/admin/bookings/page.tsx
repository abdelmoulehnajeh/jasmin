'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import AdminLayout from '@/components/admin/AdminLayout';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

interface Booking {
  id: number;
  start_date: string;
  end_date: string;
  total_price: number;
  status: string;
  user: {
    id: number;
    full_name: string;
    email: string;
  };
  car: {
    id: number;
    brand: string;
    model: string;
  };
}

export default function BookingsManagement() {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [filter, setFilter] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      router.push('/login');
      return;
    }

    const parsedUser = JSON.parse(userData);
    if (parsedUser.role !== 'ADMIN') {
      toast.error('Accès non autorisé');
      router.push('/');
      return;
    }

    setUser(parsedUser);
    fetchBookings(token);
  }, [router]);

  const fetchBookings = async (token: string) => {
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
              allBookings {
                id start_date end_date total_price status
                user { id full_name email }
                car { id brand model }
              }
            }
          `,
        }),
      });

      const data = await response.json();
      if (!data.errors) {
        setBookings(data.data.allBookings || []);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Erreur de chargement');
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (id: number, newStatus: string) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('/api/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          query: `
            mutation {
              updateBookingStatus(id: ${id}, status: "${newStatus}") {
                id status
              }
            }
          `,
        }),
      });

      const data = await response.json();
      if (!data.errors) {
        toast.success('Statut mis à jour!');
        fetchBookings(token!);
        if (selectedBooking?.id === id) {
          setSelectedBooking({ ...selectedBooking, status: newStatus });
        }
      }
    } catch (error) {
      toast.error('Erreur de mise à jour');
    }
  };

  // Improved date parsing to handle various formats
  const parseDate = (dateString: string): Date => {
    if (!dateString) return new Date();

    // Try parsing as ISO string first
    let date = new Date(dateString);

    // If invalid, try parsing as timestamp
    if (isNaN(date.getTime())) {
      const timestamp = parseInt(dateString);
      if (!isNaN(timestamp)) {
        date = new Date(timestamp);
      }
    }

    // If still invalid, try manual parsing
    if (isNaN(date.getTime())) {
      const parts = dateString.split(/[-/]/);
      if (parts.length >= 3) {
        // Assume YYYY-MM-DD or DD-MM-YYYY format
        if (parseInt(parts[0]) > 1000) {
          // YYYY-MM-DD
          date = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
        } else {
          // DD-MM-YYYY
          date = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
        }
      }
    }

    return date;
  };

  const formatDate = (dateString: string): string => {
    const date = parseDate(dateString);
    if (isNaN(date.getTime())) return 'Invalid Date';

    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Get bookings for a specific date
  const getBookingsForDate = (date: Date): Booking[] => {
    return bookings.filter(booking => {
      const startDate = parseDate(booking.start_date);
      const endDate = parseDate(booking.end_date);

      // Normalize dates to compare only year/month/day
      const normalizedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const normalizedStart = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
      const normalizedEnd = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());

      return normalizedDate >= normalizedStart && normalizedDate <= normalizedEnd;
    });
  };

  // Add tile content to show booking indicators
  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view === 'month') {
      const dayBookings = getBookingsForDate(date);
      if (dayBookings.length > 0) {
        return (
          <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex gap-0.5">
            {dayBookings.slice(0, 3).map((booking, i) => (
              <div
                key={i}
                className={`w-1.5 h-1.5 rounded-full ${
                  booking.status === 'CONFIRMED' ? 'bg-green-500' :
                  booking.status === 'PENDING' ? 'bg-yellow-500' :
                  booking.status === 'COMPLETED' ? 'bg-blue-500' :
                  'bg-red-500'
                }`}
                title={`${booking.user.full_name} - ${booking.car.brand} ${booking.car.model}`}
              />
            ))}
          </div>
        );
      }
    }
    return null;
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    const dayBookings = getBookingsForDate(date);
    if (dayBookings.length > 0) {
      setSelectedBooking(dayBookings[0]);
    } else {
      setSelectedBooking(null);
    }
  };

  const filteredBookings = filter === 'ALL'
    ? bookings
    : bookings.filter(b => b.status === filter);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-20 h-20 border-4 border-gold-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED': return 'bg-green-500/20 text-green-500';
      case 'PENDING': return 'bg-yellow-500/20 text-yellow-500';
      case 'CANCELLED': return 'bg-red-500/20 text-red-500';
      case 'COMPLETED': return 'bg-blue-500/20 text-blue-500';
      default: return 'bg-gray-500/20 text-gray-500';
    }
  };

  return (
    <AdminLayout userName={user?.full_name} userRole={user?.role}>
      <Toaster position="top-right" />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-black text-white mb-2">
              GESTION <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-500 to-burgundy-500">RÉSERVATIONS</span>
            </h1>
            <p className="text-gray-400">Gérer toutes les réservations</p>
          </div>

          {/* View Toggle */}
          <div className="flex bg-gray-800 rounded-xl p-1">
            <button
              onClick={() => setViewMode('list')}
              className={`px-6 py-3 rounded-lg font-bold transition-all ${
                viewMode === 'list'
                  ? 'bg-gradient-to-r from-gold-600 to-burgundy-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              📋 Liste
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-6 py-3 rounded-lg font-bold transition-all ${
                viewMode === 'calendar'
                  ? 'bg-gradient-to-r from-gold-600 to-burgundy-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              📅 Calendrier
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: 'Total', count: bookings.length, color: 'from-blue-600 to-cyan-600' },
            { label: 'En attente', count: bookings.filter(b => b.status === 'PENDING').length, color: 'from-yellow-600 to-gold-600' },
            { label: 'Confirmées', count: bookings.filter(b => b.status === 'CONFIRMED').length, color: 'from-green-600 to-emerald-600' },
            { label: 'Complétées', count: bookings.filter(b => b.status === 'COMPLETED').length, color: 'from-purple-600 to-pink-600' },
          ].map((stat, i) => (
            <div key={i} className={`bg-gradient-to-br ${stat.color} p-6 rounded-2xl`}>
              <p className="text-white/80 font-bold text-sm mb-1">{stat.label}</p>
              <p className="text-5xl font-black text-white">{stat.count}</p>
            </div>
          ))}
        </div>

        {/* Calendar View */}
        {viewMode === 'calendar' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Calendar */}
            <div className="lg:col-span-2 bg-gray-900 border-2 border-gold-500/20 rounded-2xl p-6">
              <div className="calendar-container">
                <style jsx global>{`
                  .calendar-container .react-calendar {
                    width: 100%;
                    background: transparent;
                    border: none;
                    font-family: inherit;
                    color: white;
                  }
                  .calendar-container .react-calendar__tile {
                    position: relative;
                    padding: 1.5rem 0.5rem;
                    background: #1f2937;
                    border: 1px solid #374151;
                    color: white;
                    font-weight: 600;
                    transition: all 0.2s;
                  }
                  .calendar-container .react-calendar__tile:hover {
                    background: #374151;
                  }
                  .calendar-container .react-calendar__tile--active {
                    background: linear-gradient(135deg, #D4AF37, #8B0000) !important;
                    color: white;
                  }
                  .calendar-container .react-calendar__tile--now {
                    background: #374151;
                    border: 2px solid #FFC800;
                  }
                  .calendar-container .react-calendar__navigation button {
                    color: #FFC800;
                    font-weight: 800;
                    font-size: 1.25rem;
                    background: #1f2937;
                    border: 1px solid #374151;
                  }
                  .calendar-container .react-calendar__navigation button:hover {
                    background: #374151;
                  }
                  .calendar-container .react-calendar__month-view__weekdays {
                    color: #FFC800;
                    font-weight: 800;
                    text-transform: uppercase;
                  }
                `}</style>
                <Calendar
                  onChange={(value) => handleDateClick(value as Date)}
                  value={selectedDate}
                  tileContent={tileContent}
                  locale="fr-FR"
                />
              </div>

              {/* Legend */}
              <div className="mt-6 pt-6 border-t border-gray-700">
                <p className="text-gray-400 font-bold mb-3">Légende:</p>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <span className="text-sm text-gray-300">Confirmée</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <span className="text-sm text-gray-300">En attente</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500" />
                    <span className="text-sm text-gray-300">Complétée</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <span className="text-sm text-gray-300">Annulée</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Selected Date Info */}
            <div className="bg-gray-900 border-2 border-gold-500/20 rounded-2xl p-6">
              <h3 className="text-xl font-black text-white mb-4">
                {selectedDate ? formatDate(selectedDate.toISOString()) : 'Sélectionnez une date'}
              </h3>

              {selectedDate && (
                <>
                  {getBookingsForDate(selectedDate).length === 0 ? (
                    <div className="text-center py-8">
                      <span className="text-6xl mb-3 block">📭</span>
                      <p className="text-gray-400">Aucune réservation</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {getBookingsForDate(selectedDate).map((booking) => (
                        <div
                          key={booking.id}
                          onClick={() => setSelectedBooking(booking)}
                          className={`p-4 rounded-xl cursor-pointer transition-all ${
                            selectedBooking?.id === booking.id
                              ? 'bg-gradient-to-r from-gold-600/20 to-burgundy-600/20 border-2 border-gold-500'
                              : 'bg-gray-800 hover:bg-gray-700 border-2 border-transparent'
                          }`}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <p className="font-bold text-white">#{booking.id}</p>
                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${getStatusColor(booking.status)}`}>
                              {booking.status}
                            </span>
                          </div>
                          <p className="text-white font-bold">{booking.user.full_name}</p>
                          <p className="text-sm text-gray-400">{booking.car.brand} {booking.car.model}</p>
                          <p className="text-gold-500 font-bold mt-2">${booking.total_price}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}

              {/* Booking Details */}
              {selectedBooking && (
                <div className="mt-6 pt-6 border-t border-gray-700">
                  <h4 className="text-lg font-black text-white mb-4">Détails de la réservation</h4>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-bold mb-1">Client</p>
                      <p className="text-white font-bold">{selectedBooking.user.full_name}</p>
                      <p className="text-sm text-gray-400">{selectedBooking.user.email}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-bold mb-1">Véhicule</p>
                      <p className="text-white font-bold">{selectedBooking.car.brand} {selectedBooking.car.model}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-bold mb-1">Période</p>
                      <p className="text-white">{formatDate(selectedBooking.start_date)}</p>
                      <p className="text-gray-400 text-sm">→ {formatDate(selectedBooking.end_date)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-bold mb-1">Prix Total</p>
                      <p className="text-2xl font-black text-gold-500">${selectedBooking.total_price}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-bold mb-1">Changer le statut</p>
                      <select
                        value={selectedBooking.status}
                        onChange={(e) => updateBookingStatus(selectedBooking.id, e.target.value)}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white font-bold outline-none cursor-pointer hover:bg-gray-700"
                      >
                        <option value="PENDING">PENDING</option>
                        <option value="CONFIRMED">CONFIRMED</option>
                        <option value="COMPLETED">COMPLETED</option>
                        <option value="CANCELLED">CANCELLED</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* List View */}
        {viewMode === 'list' && (
          <>
            {/* Filters */}
            <div className="flex flex-wrap gap-2 sm:gap-4">
              {['ALL', 'PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-3 sm:px-6 py-2 sm:py-3 rounded-xl font-bold transition-all text-xs sm:text-base ${
                    filter === status
                      ? 'bg-gradient-to-r from-gold-600 to-burgundy-600 text-white'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  {status === 'ALL' ? 'TOUTES' : status}
                </button>
              ))}
            </div>

            {/* Desktop Table View - Hidden on mobile */}
            <div className="hidden lg:block bg-gray-900 border-2 border-gold-500/20 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-800 border-b-2 border-gold-500/20">
                      <th className="px-6 py-4 text-left text-gold-500 font-black">ID</th>
                      <th className="px-6 py-4 text-left text-gold-500 font-black">CLIENT</th>
                      <th className="px-6 py-4 text-left text-gold-500 font-black">VOITURE</th>
                      <th className="px-6 py-4 text-left text-gold-500 font-black">DATES</th>
                      <th className="px-6 py-4 text-left text-gold-500 font-black">PRIX</th>
                      <th className="px-6 py-4 text-left text-gold-500 font-black">STATUT</th>
                      <th className="px-6 py-4 text-left text-gold-500 font-black">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBookings.map((booking) => (
                      <tr key={booking.id} className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                        <td className="px-6 py-4 text-white font-bold">#{booking.id}</td>
                        <td className="px-6 py-4">
                          <p className="text-white font-bold">{booking.user.full_name}</p>
                          <p className="text-gray-400 text-sm">{booking.user.email}</p>
                        </td>
                        <td className="px-6 py-4 text-white font-bold">
                          {booking.car.brand} {booking.car.model}
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-white">{formatDate(booking.start_date)}</p>
                          <p className="text-gray-400 text-sm">→ {formatDate(booking.end_date)}</p>
                        </td>
                        <td className="px-6 py-4 text-gold-500 font-black text-lg">
                          ${booking.total_price}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(booking.status)}`}>
                            {booking.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <select
                            value={booking.status}
                            onChange={(e) => updateBookingStatus(booking.id, e.target.value)}
                            className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white font-bold outline-none cursor-pointer hover:bg-gray-700"
                          >
                            <option value="PENDING">PENDING</option>
                            <option value="CONFIRMED">CONFIRMED</option>
                            <option value="COMPLETED">COMPLETED</option>
                            <option value="CANCELLED">CANCELLED</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredBookings.length === 0 && (
                <div className="text-center py-20">
                  <span className="text-8xl mb-4 block">📅</span>
                  <p className="text-2xl text-gray-400">Aucune réservation trouvée</p>
                </div>
              )}
            </div>

            {/* Mobile Card View - Visible only on mobile */}
            <div className="lg:hidden space-y-4">
              {filteredBookings.length === 0 ? (
                <div className="bg-gray-900 border-2 border-gold-500/20 rounded-2xl p-8 text-center">
                  <span className="text-6xl mb-4 block">📅</span>
                  <p className="text-xl text-gray-400">Aucune réservation trouvée</p>
                </div>
              ) : (
                filteredBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="bg-gray-900 border-2 border-gold-500/20 rounded-2xl p-4 sm:p-6 space-y-4"
                  >
                    {/* Header - ID and Status */}
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-xs text-gray-500 uppercase font-bold mb-1">Réservation</p>
                        <p className="text-white font-black text-lg">#{booking.id}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                    </div>

                    {/* Client Info */}
                    <div className="border-t border-gray-800 pt-3">
                      <p className="text-xs text-gray-500 uppercase font-bold mb-1">Client</p>
                      <p className="text-white font-bold">{booking.user.full_name}</p>
                      <p className="text-gray-400 text-sm">{booking.user.email}</p>
                    </div>

                    {/* Vehicle Info */}
                    <div className="border-t border-gray-800 pt-3">
                      <p className="text-xs text-gray-500 uppercase font-bold mb-1">Véhicule</p>
                      <p className="text-white font-bold">{booking.car.brand} {booking.car.model}</p>
                    </div>

                    {/* Dates */}
                    <div className="border-t border-gray-800 pt-3">
                      <p className="text-xs text-gray-500 uppercase font-bold mb-1">Période</p>
                      <div className="flex items-center gap-2">
                        <p className="text-white">{formatDate(booking.start_date)}</p>
                        <span className="text-gray-400">→</span>
                        <p className="text-white">{formatDate(booking.end_date)}</p>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="border-t border-gray-800 pt-3">
                      <p className="text-xs text-gray-500 uppercase font-bold mb-1">Prix Total</p>
                      <p className="text-gold-500 font-black text-2xl">${booking.total_price}</p>
                    </div>

                    {/* Action - Status Change */}
                    <div className="border-t border-gray-800 pt-3">
                      <p className="text-xs text-gray-500 uppercase font-bold mb-2">Changer le statut</p>
                      <select
                        value={booking.status}
                        onChange={(e) => updateBookingStatus(booking.id, e.target.value)}
                        className="w-full px-4 py-3 bg-gray-800 border-2 border-gray-700 rounded-xl text-white font-bold outline-none cursor-pointer hover:bg-gray-700 focus:border-gold-500 transition-all"
                      >
                        <option value="PENDING">PENDING</option>
                        <option value="CONFIRMED">CONFIRMED</option>
                        <option value="COMPLETED">COMPLETED</option>
                        <option value="CANCELLED">CANCELLED</option>
                      </select>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}
