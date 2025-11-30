'use client';

import { ReactNode } from 'react';
import AdminSidebar from './AdminSidebar';

interface AdminLayoutProps {
  children: ReactNode;
  userName?: string;
  userRole?: string;
}

export default function AdminLayout({ children, userName, userRole }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-black">
      <AdminSidebar userName={userName} userRole={userRole} />
      <main className="lg:ml-72 p-4 sm:p-6 lg:p-8 pt-20 lg:pt-8">
        {children}
      </main>
    </div>
  );
}
