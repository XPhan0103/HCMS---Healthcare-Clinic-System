import { ButtonHTMLAttributes } from 'react';
import { Loader2 } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  isLoading?: boolean;
}

export const Button = ({ variant = 'primary', isLoading, className, children, ...props }: ButtonProps) => {
  const baseStyles = "relative inline-flex items-center justify-center rounded-xl px-5 py-2.5 font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-95 overflow-hidden group";
  
  const variants = {
    primary: "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-500 hover:to-indigo-500 shadow-md shadow-blue-500/20 hover:shadow-blue-500/40 focus:ring-blue-500",
    secondary: "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:text-slate-900 shadow-sm hover:shadow focus:ring-slate-200",
    outline: "border-2 border-slate-200 bg-transparent hover:border-slate-300 hover:bg-slate-50 focus:ring-slate-200 text-slate-700",
    ghost: "bg-transparent hover:bg-slate-100 text-slate-700 focus:ring-slate-200",
    danger: "bg-gradient-to-r from-red-500 to-rose-600 text-white hover:from-red-400 hover:to-rose-500 shadow-md shadow-red-500/20 hover:shadow-red-500/40 focus:ring-red-500",
  };

  return (
    <button className={cn(baseStyles, variants[variant], className)} disabled={isLoading || props.disabled} {...props}>
      {/* Shine effect overlay for primary and danger buttons */}
      {(variant === 'primary' || variant === 'danger') && (
        <div className="absolute inset-0 -translate-x-full bg-white/20 group-hover:animate-[shimmer_1.5s_infinite] transform skew-x-12" />
      )}
      
      {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin relative z-10" /> : null}
      <span className="relative z-10 flex items-center">{children}</span>
    </button>
  );
};
