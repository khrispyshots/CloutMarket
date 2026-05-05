import React from 'react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

interface BrutalistCardProps {
  children: React.ReactNode;
  variant?: 'yellow' | 'green' | 'purple' | 'pink' | 'white' | 'blue' | 'surface';
  className?: string;
  noShadow?: boolean;
  onClick?: () => void;
}

export const BrutalistCard: React.FC<BrutalistCardProps> = ({
  children,
  variant = 'white',
  className,
  noShadow = false,
  onClick
}) => {
  const variantStyles = {
    yellow: 'bg-[#FFF8DC] text-border-dark',
    green: 'bg-[#E9F8EF] text-border-dark',
    purple: 'bg-clout-purple text-border-dark',
    pink: 'bg-clout-pink text-border-dark',
    blue: 'bg-clout-blue text-border-dark',
    white: 'bg-white text-border-dark',
    surface: 'bg-clout-bg text-border-dark',
  };

  const classNameMerged = cn(
    'border border-slate-200 rounded-lg p-5 text-left block w-full overflow-hidden',
    !noShadow && 'hard-shadow',
    variantStyles[variant],
    className
  );

  if (onClick) {
    return (
      <motion.button
        type="button"
        onClick={onClick}
        whileTap={{ scale: 0.98, x: 2, y: 2 }}
        className={classNameMerged}
      >
        {children}
      </motion.button>
    );
  }

  return (
    <motion.div className={classNameMerged}>
      {children}
    </motion.div>
  );
};

interface StickerButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const StickerButton: React.FC<StickerButtonProps> = ({
  children,
  variant = 'primary',
  fullWidth = false,
  className,
  leftIcon,
  rightIcon,
  onClick,
  disabled,
  type = 'button',
  ...props
}) => {
  const variantStyles = {
    primary: 'bg-border-dark text-white border border-border-dark hard-shadow-sm hover:bg-slate-800',
    secondary: 'bg-clout-green text-white border border-clout-green hard-shadow-sm hover:bg-emerald-700',
    outline: 'bg-white text-border-dark border border-slate-300 hard-shadow-sm hover:bg-slate-50',
    ghost: 'bg-transparent text-border-dark hover:bg-black/5',
  };

  return (
    <motion.button
      type={type}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.96, x: 2, y: 2 }}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'rounded-full font-extrabold tracking-tight flex items-center justify-center gap-3 px-8 transition-colors disabled:opacity-30 disabled:pointer-events-none',
        fullWidth ? 'w-full' : 'w-auto',
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {leftIcon && <span className="shrink-0">{leftIcon}</span>}
      <span className="flex-1 text-center">{children}</span>
      {rightIcon && <span className="shrink-0">{rightIcon}</span>}
    </motion.button>
  );
};

export const Avatar: React.FC<{ src: string; size?: 'sm' | 'md' | 'lg' | 'xl'; className?: string; isVerified?: boolean; alt?: string }> = ({ src, size = 'md', className, isVerified, alt = 'Profile photo' }) => {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
    xl: 'w-32 h-32',
  };

  return (
    <div className={cn('relative inline-block', className)}>
      <div className={cn(
        'rounded-full border border-slate-200 overflow-hidden bg-white hard-shadow-sm',
        sizes[size]
      )}>
        <img src={src} alt={alt} className="w-full h-full object-cover" loading="lazy" />
      </div>
      {isVerified && (
        <div className="absolute -bottom-1 -right-1 bg-clout-green border border-white rounded-full px-1.5 py-0.5 text-[8px] font-bold text-white shadow-sm">
          Verified
        </div>
      )}
    </div>
  );
};
