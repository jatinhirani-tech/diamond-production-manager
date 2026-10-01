import React from 'react';
import { Menu, Plus, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../common/Button';

export default function Header({ onOpenMobileMenu }) {
  const navigate = useNavigate();

  const formattedDate = new Date().toLocaleDateString('en-GB', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });

  return (
    <header className="h-16 bg-white border-b border-slate-200/80 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30">
      {/* Mobile Menu Button & Mobile Title */}
      <div className="flex items-center gap-3 md:hidden">
        <button
          onClick={onOpenMobileMenu}
          className="p-2 -ml-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
          aria-label="Open Navigation Menu"
        >
          <Menu className="w-6 h-6" />
        </button>
        <span className="font-bold text-slate-900 text-base">Diamond Prod.</span>
      </div>

      {/* Current Date Badge */}
      <div className="hidden md:flex items-center gap-2 text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium">
        <Calendar className="w-3.5 h-3.5 text-slate-400" />
        <span>Today: {formattedDate}</span>
      </div>

      {/* Quick Action Button */}
      <div className="flex items-center gap-3">
        <Button
          variant="primary"
          size="sm"
          icon={Plus}
          onClick={() => navigate('/add')}
          className="sm:px-4 sm:py-2"
        >
          Add Diamond
        </Button>
      </div>
    </header>
  );
}
