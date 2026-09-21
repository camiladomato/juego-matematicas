import React from 'react';
import { motion } from 'framer-motion';
import { soundFx } from '../../utils/sound';

export default function Button3D({
  children,
  onClick,
  variant = 'blue',
  size = 'md',
  disabled = false,
  className = '',
  ...props
}) {
  const handleClick = (e) => {
    if (disabled) return;
    soundFx.playClick();
    if (onClick) onClick(e);
  };

  const variants = {
    blue: 'bg-blue-500 hover:bg-blue-400 border-blue-700 text-white shadow-blue-900',
    green: 'bg-emerald-500 hover:bg-emerald-400 border-emerald-700 text-white shadow-emerald-950',
    amber: 'bg-amber-400 hover:bg-amber-300 border-amber-600 text-slate-950 shadow-amber-900',
    purple: 'bg-purple-600 hover:bg-purple-500 border-purple-800 text-white shadow-purple-950',
    red: 'bg-rose-600 hover:bg-rose-500 border-rose-800 text-white shadow-rose-950',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs rounded-xl border-b-4',
    md: 'px-5 py-2.5 text-base rounded-2xl border-b-4',
    lg: 'px-8 py-4 text-xl rounded-2xl border-b-6',
  };

  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { y: 2, scale: 0.98 } : {}}
      onClick={handleClick}
      disabled={disabled}
      className={`
        font-black tracking-wide transition-colors border-b-4 shadow-lg flex items-center justify-center gap-2 select-none active:border-b-0 active:translate-y-1
        ${variants[variant] || variants.blue}
        ${sizes[size] || sizes.md}
        ${disabled ? 'opacity-50 cursor-not-allowed grayscale' : 'cursor-pointer'}
        ${className}
      `}
      {...props}
    >
      {children}
    </motion.button>
  );
}