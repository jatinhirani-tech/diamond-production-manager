import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, BookOpen, PlusCircle, Calculator, History } from 'lucide-react';

const MOBILE_NAV_ITEMS = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/records', label: 'Records', icon: BookOpen },
  { path: '/add', label: 'Add', icon: PlusCircle, isPrimary: true },
  { path: '/monthly', label: 'Monthly', icon: Calculator },
  { path: '/history', label: 'History', icon: History },
];

export default function MobileNavigation() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200/90 shadow-lg px-2 py-1.5 safe-area-pb">
      <div className="flex items-center justify-around">
        {MOBILE_NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-colors ${
                  item.isPrimary
                    ? 'text-indigo-600 font-semibold'
                    : isActive
                    ? 'text-indigo-600 font-semibold'
                    : 'text-slate-500 hover:text-slate-900 font-medium'
                }`
              }
              end={item.path === '/'}
            >
              {({ isActive }) => (
                <>
                  <div
                    className={`p-1 rounded-full transition-transform ${
                      item.isPrimary
                        ? 'bg-indigo-600 text-white -mt-3.5 shadow-md shadow-indigo-600/30 ring-4 ring-white'
                        : isActive
                        ? 'bg-indigo-50 text-indigo-600'
                        : ''
                    }`}
                  >
                    <Icon className={item.isPrimary ? 'w-6 h-6' : 'w-5 h-5'} />
                  </div>
                  <span className={`text-[10px] tracking-tight mt-0.5 ${isActive ? 'text-indigo-600 font-bold' : ''}`}>
                    {item.label}
                  </span>
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
