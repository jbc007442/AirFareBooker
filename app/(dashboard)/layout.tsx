'use client';

import React, { useState } from 'react';
import { Menu, LinkIcon, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import Link from 'next/link';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [collapsed, setCollapsed] = useState(false);
  const router = useRouter();

  // ✅ Logout function (same as dashboard)
  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    toast.info('Session ended safely');
    router.push('/login');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`bg-white border-r transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'}`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-center shadow-lg text-black font-bold text-lg">
          {collapsed ? 'D' : 'Dashboard'}
        </div>

        {/* Menu */}
        <nav className="p-3 space-y-2 text-black text-sm">
          <Link href="/link">
            <SidebarItem
              icon={<LinkIcon size={20} />}
              label="Generate the link"
              collapsed={collapsed}
            />
          </Link>
        </nav>

        {/* Bottom */}
        <div className="absolute bottom-0 p-3 text-black">
          <SidebarItem
            icon={<LogOut size={20} />}
            label="Logout"
            collapsed={collapsed}
            onClick={handleLogout} // ✅ attach logout here
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col shadow-inner">
        {/* Header */}
        <header className="h-16 bg-white flex items-center text-black justify-between px-4">
          <button onClick={() => setCollapsed(!collapsed)}>
            <Menu />
          </button>

          <div className="font-medium">Welcome, Tarun 👋</div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
};

export default Layout;

/* Sidebar Item Component */
const SidebarItem = ({
  icon,
  label,
  collapsed,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  collapsed: boolean;
  onClick?: () => void;
}) => {
  return (
    <div
      onClick={onClick} // ✅ clickable
      className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 cursor-pointer transition"
    >
      {icon}
      {!collapsed && <span>{label}</span>}
    </div>
  );
};
