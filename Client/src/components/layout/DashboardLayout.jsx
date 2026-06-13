import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutGrid, 
  FileText, 
  Layers,
  Inbox, 
  BarChart3, 
  Download, 
  Settings, 
  Menu, 
  X, 
  LogOut,
  Bot
} from 'lucide-react';
import { useFormStore } from '../../store/useFormStore';

export const DashboardLayout = ({ children }) => {
  const { user, logout } = useFormStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Clean Sidebar Navigation
  const navigation = [
    { name: 'Dashboard', to: '/dashboard', icon: LayoutGrid },
    { name: 'Forms', to: '/forms', icon: FileText },
    { name: 'Templates', to: '/forms/templates', icon: Layers },
    { name: 'AI Generator', to: '/forms/ai', icon: Bot },
    { name: 'Responses', to: '/responses', icon: Inbox },
    { name: 'Exports', to: '/exports', icon: Download },
    { name: 'Settings', to: '/settings', icon: Settings },
  ];

  // Fix: make navigation routes align with actual AppRoutes pathways
  const getNavPath = (name, targetPath) => {
    return targetPath;
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path, name) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    if (path === '/forms') {
      return location.pathname.startsWith('/forms') && 
             !location.pathname.startsWith('/forms/templates') && 
             !location.pathname.startsWith('/forms/ai');
    }
    if (name === 'Responses') {
      return location.pathname.startsWith('/responses') && !location.pathname.includes('/export');
    }
    if (name === 'Exports') {
      return location.pathname.includes('/export');
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col md:flex-row antialiased font-sans">
      
      {/* Mobile Top Navbar Bar */}
      <header className="md:hidden flex items-center justify-between px-5 py-4 bg-white border-b border-[#E2E8F0] shadow-sm shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-base font-extrabold tracking-tight text-[#0F172A]">
            FormForge
          </span>
        </div>
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className="btn btn-square btn-ghost text-[#64748B] hover:text-[#0F172A]"
        >
          <Menu className="h-5 w-5" />
        </button>
      </header>

      {/* Left Sidebar (Desktop & Drawer Mobile) */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 md:sticky md:top-0 md:h-screen w-64 bg-white border-r border-[#E2E8F0] flex flex-col transform transition-transform duration-200 ease-in-out md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Mobile close menu trigger */}
        <div className="md:hidden absolute top-4 right-4">
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="btn btn-square btn-xs btn-ghost text-[#64748B]"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        </div>

        {/* Sidebar Title Logo */}
        <div className="px-6 py-6.5 border-b border-[#E2E8F0] flex items-center gap-2 shrink-0">
          <span className="text-lg font-bold tracking-tight text-[#0F172A]">
            FormForge
          </span>
          <span className="text-[10px] font-bold text-[#4F46E5] bg-[#4F46E5]/10 px-2 py-0.5 rounded">
            SaaS
          </span>
        </div>

        {/* Sidebar Nav list links */}
        <nav className="flex-1 px-3 py-6 overflow-y-auto space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            const targetPath = getNavPath(item.name, item.to);
            const active = isActive(item.to, item.name);
            return (
              <Link
                key={item.name}
                to={targetPath}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  active 
                    ? 'bg-[#4F46E5]/10 text-[#4F46E5]' 
                    : 'text-[#64748B] hover:text-[#0F172A] hover:bg-slate-50'
                }`}
              >
                <Icon className={`h-4.5 w-4.5 shrink-0 ${active ? 'text-[#4F46E5]' : 'text-[#64748B]'}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Profile panel */}
        {user && (
          <div className="p-4 border-t border-[#E2E8F0] bg-slate-50/50 flex items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <img 
                src={user.avatar} 
                alt={user.name} 
                className="h-8 w-8 rounded-lg object-cover border border-[#E2E8F0]"
              />
              <div className="overflow-hidden">
                <div className="text-xs font-bold truncate text-[#0F172A]">{user.name}</div>
                <div className="text-[10px] text-[#64748B] truncate">{user.email}</div>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="p-1.5 text-slate-400 hover:text-[#EF4444] rounded hover:bg-red-50 transition-colors shrink-0"
              title="Log out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        )}
      </aside>

      {/* Backdrop for mobile drawer toggle */}
      {isSidebarOpen && (
        <div 
          onClick={() => setIsSidebarOpen(false)}
          className="md:hidden fixed inset-0 z-40 bg-slate-900/20"
        />
      )}

      {/* Main Workspace Frame */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Desktop top navbar */}
        <header className="hidden md:flex items-center justify-between px-8 py-4 bg-white border-b border-[#E2E8F0] shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-[#64748B]">Platform Console</span>
            <span className="text-slate-300">/</span>
            <span className="text-xs font-semibold text-[#0F172A]">Workspace</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2.5">
              <div className="text-right">
                <div className="text-xs font-bold text-[#0F172A]">{user?.name}</div>
                <div className="text-[10px] text-[#64748B] font-semibold">{user?.role}</div>
              </div>
              <img 
                src={user?.avatar} 
                alt={user?.name} 
                className="h-8 w-8 rounded-lg object-cover border border-[#E2E8F0]"
              />
            </div>
          </div>
        </header>

        {/* Workspace content region */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-[1280px] mx-auto space-y-8">
            {children}
          </div>
        </main>
      </div>

    </div>
  );
};

export default DashboardLayout;
