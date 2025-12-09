'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import toast, { Toaster } from 'react-hot-toast';
import AdminLayout from '@/components/admin/AdminLayout';

interface User {
  id: number;
  email: string;
  full_name: string;
  phone?: string;
  role: string;
  created_at: string;
}

export default function UsersManagement() {
  const { t } = useTranslation();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [filter, setFilter] = useState<string>('ALL');

  const formatDate = (dateString: string | number) => {
    if (!dateString) return '';
    try {
      let date;
      // Check if it's a timestamp number or stringified number
      if (!isNaN(Number(dateString)) && !isNaN(parseFloat(String(dateString)))) {
        date = new Date(Number(dateString));
      } else {
        // Fix PostgreSQL timestamp format "YYYY-MM-DD HH:MM:SS.ms" -> "YYYY-MM-DDTHH:MM:SS.ms"
        const normalizedDate = String(dateString).replace(' ', 'T');
        date = new Date(normalizedDate);
      }

      if (isNaN(date.getTime())) {
        return String(dateString);
      }

      return date.toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return String(dateString);
    }
  };

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

    setCurrentUser(parsedUser);
    fetchUsers(token);
  }, [router]);

  const fetchUsers = async (token: string) => {
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
              allUsers {
                id email full_name phone role created_at
              }
            }
          `,
        }),
      });

      const data = await response.json();
      if (!data.errors) {
        setUsers(data.data.allUsers || []);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error(t('loadingError'));
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (id: number, newRole: string) => {
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
              updateUserRole(id: ${id}, role: "${newRole}") {
                id role
              }
            }
          `,
        }),
      });

      const data = await response.json();
      if (!data.errors) {
        toast.success(t('roleUpdated'));
        fetchUsers(token!);
      }
    } catch (error) {
      toast.error(t('error'));
    }
  };

  const deleteUser = async (id: number) => {
    if (!confirm(t('confirmDeleteUser'))) return;

    const token = localStorage.getItem('token');
    try {
      const response = await fetch('/api/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          query: `mutation { deleteUser(id: ${id}) }`,
        }),
      });

      const data = await response.json();
      if (!data.errors) {
        toast.success(t('userDeleted'));
        fetchUsers(token!);
      }
    } catch (error) {
      toast.error(t('error'));
    }
  };

  const filteredUsers = filter === 'ALL'
    ? users
    : users.filter(u => u.role === filter);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-20 h-20 border-4 border-gold-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <AdminLayout userName={currentUser?.full_name} userRole={currentUser?.role}>
      <Toaster position="top-right" />

      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-black text-white mb-2">
            {t('usersManagement').split(' ')[0]} <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-500 to-burgundy-500">{t('usersManagement').split(' ')[1]}</span>
          </h1>
          <p className="text-gray-400">{t('manageAllUsers')}</p>
        </div>

        {/* Filters */}
        <div className="flex space-x-4">
          {['ALL', 'ADMIN', 'USER'].map((role) => (
            <button
              key={role}
              onClick={() => setFilter(role)}
              className={`px-6 py-3 rounded-xl font-bold transition-all ${filter === role
                ? 'bg-gradient-to-r from-gold-600 to-burgundy-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
            >
              {role === 'ALL' ? t('allUsers') : role}
            </button>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: t('totalUsersLabel'), count: users.length, color: 'from-blue-600 to-cyan-600', icon: '👥' },
            { label: t('admins'), count: users.filter(u => u.role === 'ADMIN').length, color: 'from-gold-600 to-burgundy-600', icon: '👑' },
            { label: t('clients'), count: users.filter(u => u.role === 'USER').length, color: 'from-green-600 to-emerald-600', icon: '👤' },
          ].map((stat, i) => (
            <div key={i} className={`bg-gradient-to-br ${stat.color} p-6 rounded-2xl`}>
              <div className="flex justify-between items-start mb-2">
                <span className="text-4xl">{stat.icon}</span>
              </div>
              <p className="text-white/80 font-bold text-sm mb-1">{stat.label}</p>
              <p className="text-5xl font-black text-white">{stat.count}</p>
            </div>
          ))}
        </div>

        {/* Users Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map((user) => (
            <div key={user.id} className="bg-gray-900 border-2 border-gold-500/20 hover:border-gold-500 rounded-2xl p-6 transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-gold-600 to-burgundy-600 rounded-full flex items-center justify-center font-black text-white text-2xl">
                  {user.full_name.charAt(0).toUpperCase()}
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${user.role === 'ADMIN' ? 'bg-gold-500/20 text-gold-500' : 'bg-blue-500/20 text-blue-500'
                  }`}>
                  {user.role}
                </span>
              </div>

              <h3 className="text-xl font-black text-white mb-2">{user.full_name}</h3>
              <p className="text-gray-400 text-sm mb-1">📧 {user.email}</p>
              {user.phone && <p className="text-gray-400 text-sm mb-3">📱 {user.phone}</p>}
              <p className="text-gray-500 text-xs mb-4">
                {t('registeredOn')} {formatDate(user.created_at)}
              </p>

              <div className="space-y-2">
                <select
                  value={user.role}
                  onChange={(e) => updateUserRole(user.id, e.target.value)}
                  disabled={user.id === currentUser?.id}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white font-bold outline-none cursor-pointer hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="USER">USER</option>
                  <option value="ADMIN">ADMIN</option>
                </select>

                {user.id !== currentUser?.id && (
                  <button
                    onClick={() => deleteUser(user.id)}
                    className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-colors"
                  >
                    🗑️ {t('delete')}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-20">
            <span className="text-8xl mb-4 block">👥</span>
            <p className="text-2xl text-gray-400">{t('noUsersFound')}</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
