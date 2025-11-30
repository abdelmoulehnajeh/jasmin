'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import AdminLayout from '@/components/admin/AdminLayout';

export default function Settings() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

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
  }, [router]);

  return (
    <AdminLayout userName={user?.full_name} userRole={user?.role}>
      <Toaster position="top-right" />
      
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-black text-white mb-2">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-500 to-burgundy-500">PARAMÈTRES</span>
          </h1>
          <p className="text-gray-400">Configuration de la plateforme</p>
        </div>

        {/* Settings Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* General Settings */}
          <div className="bg-gray-900 border-2 border-gold-500/20 rounded-2xl p-8">
            <div className="flex items-center space-x-3 mb-6">
              <span className="text-4xl">⚙️</span>
              <h2 className="text-2xl font-black text-white">Général</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-gold-500 font-bold mb-2">Nom de la plateforme</label>
                <input
                  type="text"
                  defaultValue="Jasmin Rent Cars"
                  className="w-full px-4 py-3 bg-black border-2 border-gray-700 focus:border-gold-500 rounded-lg text-white outline-none"
                />
              </div>
              <div>
                <label className="block text-gold-500 font-bold mb-2">Email contact</label>
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
              <h2 className="text-2xl font-black text-white">Notifications</h2>
            </div>
            <div className="space-y-4">
              {[
                'Email pour nouvelles réservations',
                'Email pour nouveaux utilisateurs',
                'Email pour paiements reçus',
                'Notifications push',
              ].map((item, i) => (
                <label key={i} className="flex items-center space-x-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-6 h-6 rounded bg-gray-800 border-2 border-gray-700 checked:bg-gold-600 checked:border-gold-600"
                  />
                  <span className="text-white font-semibold group-hover:text-gold-500 transition-colors">
                    {item}
                  </span>
                </label>
              ))}
              <button className="w-full px-6 py-3 bg-gradient-to-r from-gold-600 to-burgundy-600 hover:from-gold-700 hover:to-burgundy-700 text-white font-bold rounded-xl transition-all">
                Sauvegarder
              </button>
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-gray-900 border-2 border-gold-500/20 rounded-2xl p-8">
            <div className="flex items-center space-x-3 mb-6">
              <span className="text-4xl">💰</span>
              <h2 className="text-2xl font-black text-white">Tarification</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-gold-500 font-bold mb-2">Commission (%)</label>
                <input
                  type="number"
                  defaultValue="15"
                  className="w-full px-4 py-3 bg-black border-2 border-gray-700 focus:border-gold-500 rounded-lg text-white outline-none"
                />
              </div>
              <div>
                <label className="block text-gold-500 font-bold mb-2">TVA (%)</label>
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
              <h2 className="text-2xl font-black text-white">Sécurité</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-gold-500 font-bold mb-2">Changer mot de passe</label>
                <input
                  type="password"
                  placeholder="Nouveau mot de passe"
                  className="w-full px-4 py-3 bg-black border-2 border-gray-700 focus:border-gold-500 rounded-lg text-white outline-none mb-3"
                />
                <input
                  type="password"
                  placeholder="Confirmer mot de passe"
                  className="w-full px-4 py-3 bg-black border-2 border-gray-700 focus:border-gold-500 rounded-lg text-white outline-none"
                />
              </div>
              <button className="w-full px-6 py-3 bg-gradient-to-r from-gold-600 to-burgundy-600 hover:from-gold-700 hover:to-burgundy-700 text-white font-bold rounded-xl transition-all">
                Mettre à jour
              </button>
            </div>
          </div>
        </div>

        {/* System Info */}
        <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-gold-500/20 rounded-2xl p-8">
          <div className="flex items-center space-x-3 mb-6">
            <span className="text-4xl">💻</span>
            <h2 className="text-2xl font-black text-white">Informations Système</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-gray-400 text-sm mb-1">Version</p>
              <p className="text-white font-black text-2xl">v1.0.0</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-1">Base de données</p>
              <p className="text-green-500 font-black text-2xl">✓ Connectée</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-1">Serveur</p>
              <p className="text-green-500 font-black text-2xl">✓ En ligne</p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
