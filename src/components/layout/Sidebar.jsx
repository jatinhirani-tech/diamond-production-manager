import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BookOpen, 
  PlusCircle, 
  Calculator, 
  History, 
  Settings, 
  Gem, 
  HardDrive
} from 'lucide-react';
import { storageService } from '../../services/storageService';

const NAV_ITEMS = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/records', label: 'Daily Records', icon: BookOpen },
  { path: '/add', label: 'Add Diamond', icon: PlusCircle },
  { path: '/monthly', label: 'Monthly Summary', icon: Calculator },
  { path: '/history', label: 'Monthly History', icon: History },
  { path: '/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar({ onCloseMobile }) {
  const storageUsage = storageService.getStorageUsage();

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col h-full border-r border-slate-800 shrink-0 select-none">
      {/* Brand Header */}
      <div className="p-6 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 via-sky-400 to-indigo-300 flex items-center justify-center text-slate-950 shadow-lg shadow-sky-500/20">
            <Gem className="w-5 h-5 fill-slate-950" />
          </div>
          <div>
            <h1 className="font-bold text-white text-base tracking-tight leading-none flex items-center gap-1.5">
              <span>Diamond Prod.</span>
            </h1>
            <p className="text-[11px] font-medium text-slate-400 mt-1 uppercase tracking-wider">
              Maheshbhai Hirani's Diary
            </p>
          </div>
        </div>
      </div>

      {/* Nav List */}
      <nav className="flex-1 px-3 py-5 space-y-1.5 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onCloseMobile}
              className={({ isActive }) =>
                `flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 font-semibold'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/70'
                }`
              }
              end={item.path === '/'}
            >
              <Icon className="w-4.5 h-4.5 shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom Local Storage Notice */}
      <div className="p-4 m-3 rounded-xl bg-slate-800/60 border border-slate-800 text-xs">
        <div className="flex items-center gap-2 text-emerald-400 font-semibold mb-1">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Local Storage Active</span>
        </div>
        <p className="text-slate-400 text-[11px] leading-relaxed">
          All data is kept private on this browser. Zero cloud dependencies.
        </p>
        <div className="mt-2.5 pt-2 border-t border-slate-700/60 flex items-center justify-between text-[10px] text-slate-500">
          <span className="flex items-center gap-1">
            <HardDrive className="w-3 h-3" /> Used: {storageUsage.kb} KB
          </span>
          <span className="text-slate-400">Offline Ready</span>
        </div>
      </div>
    </aside>
  );
}
