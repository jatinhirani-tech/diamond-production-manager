import React from 'react';

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  type = 'button',
  onClick,
  disabled = false,
  className = '',
  icon: Icon,
  iconPosition = 'left',
  fullWidth = false,
  ...props
}) {
  const baseClasses = 'inline-flex items-center justify-center font-medium transition-all duration-150 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]';

  const sizes = {
    sm: 'px-3 py-1.5 text-xs font-semibold gap-1.5',
    md: 'px-4 py-2.5 text-sm gap-2',
    lg: 'px-6 py-3.5 text-base gap-2.5 shadow-sm',
    xl: 'px-7 py-4 text-lg font-semibold gap-3 shadow-md',
  };

  const variants = {
    primary: 'bg-slate-900 hover:bg-slate-800 text-white focus:ring-slate-900 shadow-sm border border-slate-900',
    secondary: 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 focus:ring-slate-400 shadow-sm',
    accent: 'bg-indigo-600 hover:bg-indigo-700 text-white focus:ring-indigo-600 shadow-sm shadow-indigo-100',
    luxury: 'bg-gradient-to-r from-slate-900 via-slate-850 to-indigo-950 hover:from-slate-800 hover:to-indigo-900 text-white shadow-md border border-slate-700/50',
    danger: 'bg-rose-600 hover:bg-rose-700 text-white focus:ring-rose-500 shadow-sm',
    dangerOutline: 'bg-white hover:bg-rose-50 text-rose-600 border border-rose-200 focus:ring-rose-400',
    ghost: 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus:ring-slate-300',
    success: 'bg-emerald-600 hover:bg-emerald-700 text-white focus:ring-emerald-600 shadow-sm',
  };

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${sizes[size]} ${variants[variant]} ${widthClass} ${className}`}
      {...props}
    >
      {Icon && iconPosition === 'left' && <Icon className="w-4 h-4 shrink-0" />}
      <span>{children}</span>
      {Icon && iconPosition === 'right' && <Icon className="w-4 h-4 shrink-0" />}
    </button>
  );
}
