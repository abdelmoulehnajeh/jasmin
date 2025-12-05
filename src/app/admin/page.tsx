'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import AdminLayout from '@/components/admin/AdminLayout';

interface DashboardStats {
  totalCars: number;
  totalBookings: number;
  totalUsers: number;
  totalRevenue: number;
  activeBookings: number;
  availableCars: number;
}

interface User {
  id: number;
  email: string;
  full_name: string;
  role: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

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
    fetchDashboardStats(token);
  }, [router]);

  const fetchDashboardStats = async (token: string) => {
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
              dashboardStats {
                totalCars totalBookings totalUsers totalRevenue activeBookings availableCars
              }
            }
          `,
        }),
      });

      const data = await response.json();
      if (!data.errors) {
        setStats(data.data.dashboardStats);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-gold-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white font-bold text-xl">CHARGEMENT...</p>
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
            TABLEAU DE <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-500 to-burgundy-500">BORD</span>
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-gray-400">Vue d'ensemble en temps réel</p>
        </div>

        {/* Stats Grid */}
        {stats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              { label: 'Voitures', value: stats.totalCars, sublabel: `${stats.availableCars} disponibles`, gradient: 'from-blue-600 to-cyan-600', icon: '🚗', path: '/admin/cars' },
              { label: 'Réservations', value: stats.totalBookings, sublabel: `${stats.activeBookings} actives`, gradient: 'from-green-600 to-emerald-600', icon: '📅', path: '/admin/bookings' },
              { label: 'Utilisateurs', value: stats.totalUsers, sublabel: 'Clients total', gradient: 'from-purple-600 to-pink-600', icon: '👥', path: '/admin/users' },
              { label: 'Revenu', value: `$${stats.totalRevenue.toFixed(0)}`, sublabel: 'Total reçu', gradient: 'from-gold-600 to-burgundy-600', icon: '💰' },
            ].map((stat, i) => (
              <button
                key={i}
                type="button"
                onClick={() => stat.path && router.push(stat.path)}
                aria-label={`${stat.label} - ${stat.sublabel}`}
                className="group text-left"
              >
                <div className={`bg-gradient-to-br ${stat.gradient} p-4 sm:p-6 rounded-2xl shadow-xl transform hover:scale-105 transition-all duration-300 ${stat.path ? 'cursor-pointer focus:outline-none focus:ring-4 focus:ring-white/20' : ''}`}>
                  <div className="flex justify-between items-start mb-3 sm:mb-4">
                    <span className="text-3xl sm:text-4xl">{stat.icon}</span>
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-lg flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                    </div>
                  </div>
                  <p className="text-white/80 font-bold text-xs mb-1 uppercase tracking-wider">{stat.label}</p>
                  <p className="text-2xl sm:text-4xl font-black text-white mb-1">{stat.value}</p>
                  <p className="text-white/70 text-xs font-semibold">{stat.sublabel}</p>
                </div>
              </button>
            ))}
          </div>
        )}

   
      </div>
    </AdminLayout>
  );
}
