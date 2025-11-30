'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';

interface SidebarProps {
  userName?: string;
  userRole?: string;
}

export default function AdminSidebar({ userName = 'Admin', userRole = 'ADMIN' }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  };

  const menuItems = [
    {
      icon: '📊',
      label: 'Dashboard',
      path: '/admin',
      description: 'Vue d\'ensemble'
    },
    {
      icon: '🎬',
      label: 'Hero Video',
      path: '/admin/hero',
      description: 'Gérer vidéo accueil'
    },
    {
      icon: '🚗',
      label: 'Voitures',
      path: '/admin/cars',
      description: 'Gestion flotte'
    },
    {
      icon: '📅',
      label: 'Réservations',
      path: '/admin/bookings',
      description: 'Gérer bookings'
    },
    {
      icon: '👥',
      label: 'Utilisateurs',
      path: '/admin/users',
      description: 'Gérer clients'
    },
    {
      icon: '⚙️',
      label: 'Paramètres',
      path: '/admin/settings',
      description: 'Configuration'
    },
  ];

  return (
    <>
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
        <div
          className="lg:hidden fixed inset-0 bg-black/75 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 h-screen bg-gray-900 border-r-2 border-gold-500/20 transition-all duration-300 z-50 ${
        isCollapsed ? 'w-20' : 'w-72'
      } ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`}>
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-gold-500/20">
          <div className="flex items-center justify-between">
            {!isCollapsed && (
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-gold-500 to-burgundy-600 rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"/>
                    <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6a1 1 0 001 1h.05a2.5 2.5 0 014.9 0h.05a1 1 0 001-1v-4.5a1 1 0 00-.293-.707l-2-2A1 1 0 0017 7h-3z"/>
                  </svg>
                </div>
                <div>
                  <h1 className="text-white font-black text-base sm:text-lg">VELOCITY</h1>
                  <p className="text-gold-500 text-xs font-bold">ADMIN</p>
                </div>
              </div>
            )}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden lg:flex w-10 h-10 rounded-lg bg-gold-500/10 hover:bg-gold-500/20 items-center justify-center transition-colors"
            >
              <svg className={`w-5 h-5 text-gold-500 transition-transform ${isCollapsed ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              </svg>
            </button>
          </div>
        </div>

        {/* User Info */}
        {!isCollapsed && (
          <div className="p-4 sm:p-6 border-b border-gold-500/20">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-gold-600 to-burgundy-600 rounded-full flex items-center justify-center font-black text-white text-lg sm:text-xl">
                {userName.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <p className="text-white font-bold text-sm">{userName}</p>
                <p className="text-gold-500 text-xs font-semibold">{userRole}</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 p-3 sm:p-4 space-y-2 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 280px)' }}>
          {menuItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => {
                  router.push(item.path);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 sm:px-4 sm:py-3 rounded-xl transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-gold-600 to-burgundy-600 text-white shadow-lg shadow-gold-900/50'
                    : 'text-gray-400 hover:bg-gold-500/10 hover:text-white'
                }`}
              >
                <span className="text-xl sm:text-2xl">{item.icon}</span>
                {!isCollapsed && (
                  <div className="flex-1 text-left">
                    <p className="font-bold text-sm sm:text-base">{item.label}</p>
                    <p className="text-xs opacity-75">{item.description}</p>
                  </div>
                )}
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-3 sm:p-4 border-t border-gold-500/20">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-3 py-2.5 sm:px-4 sm:py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold transition-colors text-sm sm:text-base"
          >
            <span className="text-xl sm:text-2xl">🚪</span>
            {!isCollapsed && <span>Déconnexion</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
