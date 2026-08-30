import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FileText, PlusCircle, CheckSquare, X } from 'lucide-react';
import { useAuth } from '../../store/authStore.jsx';

export const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  
  if (!user) return null;

  const isStudent = user.role === 'student';

  const menuItems = isStudent
    ? [
        { name: 'Dashboard', path: '/student/dashboard', icon: LayoutDashboard },
        { name: 'My Complaints', path: '/student/complaints', icon: FileText },
        { name: 'Submit Complaint', path: '/student/complaints/new', icon: PlusCircle },
      ]
    : [
        { name: 'Admin Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
        { name: 'Manage Complaints', path: '/admin/complaints', icon: CheckSquare },
      ];

  const activeStyle = 'flex items-center space-x-3 rounded-xl bg-brand-600/10 border border-brand-500/20 px-4 py-3 text-sm font-semibold text-brand-400';
  const inactiveStyle = 'flex items-center space-x-3 rounded-xl border border-transparent px-4 py-3 text-sm font-medium text-slate-400 hover:bg-slate-800/40 hover:text-slate-200 transition-colors';

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
        ></div>
      )}

      <aside
        className={`fixed bottom-0 top-16 z-40 flex w-64 flex-col border-r border-slate-800/80 bg-[#0c101d] transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Mobile Header Close */}
        <div className="flex items-center justify-between px-6 py-4 lg:hidden">
          <span className="text-xs font-semibold uppercase text-slate-500 tracking-wider">Navigation</span>
          <button onClick={onClose} className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-slate-100">
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1.5 px-4 py-6">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) => (isActive ? activeStyle : inactiveStyle)}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Footer info */}
        <div className="border-t border-slate-800/60 p-4">
          <div className="rounded-xl bg-slate-900/40 border border-slate-800/50 p-3">
            <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Logged In As</p>
            <p className="text-xs font-semibold text-slate-300 mt-1 truncate">{user.name}</p>
            <p className="text-[10px] font-medium text-slate-500 mt-0.5 truncate">{user.email}</p>
          </div>
        </div>
      </aside>
    </>
  );
};
export default Sidebar;
