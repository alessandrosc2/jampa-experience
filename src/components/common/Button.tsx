import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'gold' | 'outline' | 'ghost' | 'glass';
  size?: 'sm' | 'md' | 'lg';
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  fullWidth?: boolean;
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  iconLeft,
  iconRight,
  fullWidth = false,
  isLoading = false,
  className = '',
  style,
  disabled,
  ...props
}) => {
  const sizeStyles = {
    sm: { padding: '0.45rem 0.9rem', fontSize: '0.875rem', height: '36px' },
    md: { padding: '0.65rem 1.4rem', fontSize: '0.9375rem', height: '46px' },
    lg: { padding: '0.85rem 2rem', fontSize: '1.0625rem', height: '54px' }
  }[size];

  const variantClass = `btn-${variant}`;

  return (
    <button
      className={`btn-base ${variantClass} ${fullWidth ? 'btn-full' : ''} ${className}`}
      disabled={disabled || isLoading}
      style={{
        ...sizeStyles,
        ...style
      }}
      {...props}
    >
      {isLoading ? (
        <span className="btn-spinner" />
      ) : (
        <>
          {iconLeft && <span className="btn-icon-left">{iconLeft}</span>}
          <span className="btn-text">{children}</span>
          {iconRight && <span className="btn-icon-right">{iconRight}</span>}
        </>
      )}

      <style>{`
        .btn-base {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          font-family: var(--font-display);
          font-weight: 700;
          border-radius: var(--radius-full);
          transition: all var(--transition-normal);
          text-decoration: none;
          white-space: nowrap;
          user-select: none;
          cursor: pointer;
          overflow: hidden;
        }

        .btn-base:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          filter: grayscale(0.5);
        }

        .btn-full {
          width: 100%;
        }

        /* Variant: Primary (Ocean Cyan) */
        .btn-primary {
          background: linear-gradient(135deg, #00B4D8 0%, #0077B6 100%);
          color: #040911;
          box-shadow: 0 4px 18px rgba(0, 180, 216, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        .btn-primary:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 28px rgba(0, 180, 216, 0.55), inset 0 1px 0 rgba(255, 255, 255, 0.4);
          filter: brightness(1.08);
        }
        .btn-primary:active:not(:disabled) {
          transform: scale(0.97);
        }

        /* Variant: Gold (Sunset Luxury) */
        .btn-gold {
          background: linear-gradient(135deg, #F59E0B 0%, #EA580C 50%, #D97706 100%);
          color: #060B11;
          box-shadow: 0 4px 22px rgba(234, 88, 12, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.35);
          border: 1px solid rgba(255, 255, 255, 0.25);
          text-shadow: 0 1px 0 rgba(255, 255, 255, 0.2);
        }
        .btn-gold:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 32px rgba(234, 88, 12, 0.65), inset 0 1px 0 rgba(255, 255, 255, 0.45);
          filter: brightness(1.08);
        }
        .btn-gold:active:not(:disabled) {
          transform: scale(0.97);
        }

        /* Variant: Outline */
        .btn-outline {
          background: rgba(255, 255, 255, 0.04);
          color: #F8FAFC;
          border: 1px solid var(--border-medium);
          backdrop-filter: blur(8px);
        }
        .btn-outline:hover:not(:disabled) {
          background: rgba(255, 255, 255, 0.09);
          border-color: #00B4D8;
          color: #38BDF8;
          transform: translateY(-2px);
        }

        /* Variant: Glass */
        .btn-glass {
          background: rgba(12, 20, 31, 0.7);
          color: #F8FAFC;
          border: 1px solid rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(12px);
        }
        .btn-glass:hover:not(:disabled) {
          background: rgba(18, 30, 46, 0.9);
          border-color: var(--border-accent);
        }

        /* Variant: Ghost */
        .btn-ghost {
          background: transparent;
          color: var(--text-secondary);
          border: 1px solid transparent;
        }
        .btn-ghost:hover:not(:disabled) {
          background: rgba(255, 255, 255, 0.06);
          color: var(--text-primary);
        }

        .btn-icon-left, .btn-icon-right {
          display: inline-flex;
          align-items: center;
        }

        .btn-spinner {
          width: 20px;
          height: 20px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: currentColor;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </button>
  );
};
