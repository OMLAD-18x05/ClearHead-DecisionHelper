
import { Loader2 } from 'lucide-react';

const Button = ({
  children,
  size = 'md', // sm | md | lg
  disabled = false,
  loading = false,
  icon: Icon = null,
  className = '',
  fullWidth = false,
  type = 'button',
  onClick,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-300 rounded-xl focus:outline-none disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98] hover:scale-[1.02] cursor-pointer';
  
  const sizes = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2.5 text-sm gap-2',
    lg: 'px-6 py-3.5 text-base gap-2.5',
  };

  const widthStyle = fullWidth ? 'w-full' : '';

  return (
    <button
      type={type}
      className={`${baseStyles}  ${sizes[size]} ${widthStyle} ${className}`}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : Icon ? (
        <Icon className={size === 'sm' ? 'h-3.5 w-3.5' : size === 'lg' ? 'h-5 w-5' : 'h-4 w-4'} />
      ) : null}
      <span>{children}</span>
    </button>
  );
};

export default Button;
