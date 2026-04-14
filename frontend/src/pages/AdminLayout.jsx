import { NavLink, useNavigate, Outlet } from 'react-router-dom';
import {
  LayoutDashboard, CalendarPlus, Users, ClipboardList,
  CheckSquare, LogOut, Zap, Menu, X
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const navItems = [
  { to: '/admin',          label: 'Dashboard',    icon: LayoutDashboard, end: true },
  { to: '/admin/events',   label: 'Events',       icon: CalendarPlus },
  { to: '/admin/members',  label: 'Members',      icon: Users },
  { to: '/admin/attendance',label: 'Attendance',  icon: CheckSquare },
  { to: '/admin/rsvp',     label: 'RSVP',         icon: ClipboardList },
];

export default function AdminLayout() {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Logged out');
    navigate('/');
  };

  const Sidebar = () => (
    <aside className="flex flex-col h-full bg-brand-950 text-white w-60 flex-shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-white/10">
        <div className="w-8 h-8 bg-accent-500 rounded-lg flex items-center justify-center">
          <Zap className="w-4 h-4 text-white" />
        </div>
        <div>
          <p className="font-display font-bold text-sm leading-none">CFC FarWest</p>
          <p className="text-brand-400 text-xs mt-0.5">Admin Dashboard</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-3 space-y-0.5">
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-white/15 text-white'
                  : 'text-brand-300 hover:bg-white/8 hover:text-white'
              }`
            }
          >
            <Icon className="w-4 h-4 flex-shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Admin info + Logout */}
      <div className="border-t border-white/10 p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 bg-brand-700 rounded-full flex items-center justify-center text-xs font-bold">
            {admin?.fullName?.[0]?.toUpperCase() || 'A'}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium truncate">{admin?.fullName || 'Admin'}</p>
            <p className="text-xs text-brand-400">{admin?.username}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-brand-300 hover:bg-white/10 hover:text-white transition-colors"
        >
          <LogOut className="w-4 h-4" /> Log out
        </button>
      </div>
    </aside>
  );

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex">
        <Sidebar />
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="flex-1" onClick={() => setSidebarOpen(false)} />
          <Sidebar />
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-auto">
        {/* Mobile topbar */}
        <div className="md:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-brand-600" />
            <span className="font-display font-bold text-sm">CFC FarWest Admin</span>
          </div>
          <button onClick={() => setSidebarOpen(v => !v)} className="p-1.5 rounded-lg hover:bg-slate-100">
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
