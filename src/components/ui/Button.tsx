import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'dark' | 'outline' | 'link';
  showArrow?: boolean;
  fullWidth?: boolean;
  asAnchor?: boolean;
  href?: string;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'dark',
  showArrow = true,
  fullWidth = false,
  asAnchor = false,
  href,
  children,
  className = '',
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center gap-3 font-sans text-xs tracking-editorial uppercase transition-all duration-300 group cursor-pointer';

  const variantStyles = {
    dark: 'bg-warm-dark text-warm-bg border border-warm-dark hover:bg-[#383430] hover:border-[#383430] hover:text-white px-7 py-3.5',
    outline: 'bg-transparent text-charcoal-main border border-charcoal-main hover:bg-warm-dark hover:text-warm-bg px-7 py-3.5',
    link: 'bg-transparent text-charcoal-main hover:text-accent-terracotta p-0 font-semibold tracking-wider',
  };

  const widthStyle = fullWidth ? 'w-full' : '';
  const combinedClasses = `${baseStyles} ${variantStyles[variant]} ${widthStyle} ${className}`;

  const content = (
    <>
      <span>{children}</span>
      {showArrow && (
        <span className="transition-transform duration-200 group-hover:translate-x-1">
          →
        </span>
      )}
    </>
  );

  if (asAnchor && href) {
    return (
      <a href={href} className={combinedClasses}>
        {content}
      </a>
    );
  }

  return (
    <button className={combinedClasses} {...props}>
      {content}
    </button>
  );
};
