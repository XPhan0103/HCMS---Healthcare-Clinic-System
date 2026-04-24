import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from './Button';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, ...props }, ref) => {
    return (
      <div className="w-full relative group">
        {label && <label className="block text-sm font-semibold text-slate-700 mb-1.5 transition-colors group-focus-within:text-blue-600">{label}</label>}
        <div className="relative">
          <input
            type={type}
            className={cn(
              "input-field",
              error && "border-red-500 focus:ring-red-500 bg-red-50/50",
              className
            )}
            ref={ref}
            {...props}
          />
          {/* Subtle glow effect behind the input */}
          <div className="absolute inset-0 -z-10 rounded-xl bg-gradient-to-r from-blue-400/0 to-indigo-400/0 opacity-0 blur transition-all duration-300 group-focus-within:from-blue-400/20 group-focus-within:to-indigo-400/20 group-focus-within:opacity-100" />
        </div>
        {error && <p className="mt-1.5 text-sm text-red-500 animate-fade-in-up">{error}</p>}
      </div>
    );
  }
);
Input.displayName = 'Input';
