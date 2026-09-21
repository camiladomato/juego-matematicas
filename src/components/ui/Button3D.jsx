import React from 'react';
import { motion } from 'framer-motion';

export default function Button3D({
  children,
  onClick,
  variant = 'orange', // 'orange', 'green', 'blue', 'yellow', 'red', 'purple'
  size = 'md',        // 'sm', 'md', 'lg', 'xl'
  disabled = false,
  className = '',
  type = 'button',
}) {
  // Paletas de colores con efecto 3D (Fondo + Borde inferior/Sombra 3D + Texto)
  const variants = {
    orange: 'bg-orange-500 hover:bg-orange-400 text-white shadow-[0_6px_0_#c2410c] active:shadow-[0_0px_0_#c2410c]',
    green:  'bg-emerald-500 hover:bg-emerald-400 text-white shadow-[0_6px_0_#047857] active:shadow-[0_0px_0_#047857]',
    blue:   'bg-blue-600 hover:bg-blue-500 text-white shadow-[0_6px_0_#1e3a8a] active:shadow-[0_0px_0_#1e3a8a]',
    yellow: 'bg-amber-400 hover:bg-amber-300 text-amber-950 shadow-[0_6px_0_#b45309] active:shadow-[0_0px_0_#b45309]',
    red:    'bg-rose-500 hover:bg-rose-400 text-white shadow-[0_6px_0_#be123c] active:shadow-[0_0px_0_#be123c]',
    purple: 'bg-purple-600 hover:bg-purple-500 text-white shadow-[0_6px_0_#6b21a8] active:shadow-[0_0px_0_#6b21a8]',
  };

  // Tamaños disponibles
  const sizes = {
    sm: 'py-2 px-4 text-sm rounded-xl',
    md: 'py-3 px-6 text-base font-bold rounded-2xl',
    lg: 'py-4 px-8 text-xl font-black rounded-2xl',
    xl: 'py-5 px-10 text-3xl font-black rounded-3xl',
  };

  const selectedVariant = variants[variant] || variants.orange;
  const selectedSize = sizes[size] || sizes.md;

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileTap={disabled ? {} : { y: 6 }}
      transition={{ type: 'spring', stiffness: 500, damping: 20 }}
      className={`
        relative inline-flex items-center justify-center font-black select-none
        transition-all duration-75 cursor-pointer touch-manipulation
        disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:translate-y-1.5
        ${selectedVariant}
        ${selectedSize}
        ${className}
      `}
    >
      {children}
    </motion.button>
  );
}