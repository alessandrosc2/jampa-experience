import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'cyan' | 'gold' | 'emerald' | 'subtle' | 'warning' | 'danger';
  size?: 'sm' | 'md';
  icon?: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'cyan',
  size = 'md',
  icon,
  className = ''
}) => {
  const variantStyles = {
    cyan: {
      bg: 'rgba(0, 180, 216, 0.12)',
      border: 'rgba(0, 180, 216, 0.35)',
      color: '#38BDF8'
    },
    gold: {
      bg: 'rgba(244, 162, 97, 0.15)',
      border: 'rgba(244, 162, 97, 0.4)',
      color: '#F4A261'
    },
    emerald: {
      bg: 'rgba(16, 185, 129, 0.15)',
      border: 'rgba(16, 185, 129, 0.35)',
      color: '#34D399'
    },
    subtle: {
      bg: 'rgba(255, 255, 255, 0.06)',
      border: 'rgba(255, 255, 255, 0.12)',
      color: '#94A3B8'
    },
    warning: {
      bg: 'rgba(245, 158, 11, 0.15)',
      border: 'rgba(245, 158, 11, 0.4)',
      color: '#FBBF24'
    },
    danger: {
      bg: 'rgba(239, 68, 68, 0.15)',
      border: 'rgba(239, 68, 68, 0.4)',
      color: '#F87171'
    }
  }[variant];

  const padding = size === 'sm' ? '0.2rem 0.55rem' : '0.35rem 0.85rem';
  const fontSize = size === 'sm' ? '0.75rem' : '0.8125rem';

  return (
    <span
      className={`badge-pill ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.35rem',
        padding,
        fontSize,
        fontWeight: 600,
        borderRadius: '9999px',
        backgroundColor: variantStyles.bg,
        borderColor: variantStyles.border,
        borderWidth: '1px',
        borderStyle: 'solid',
        color: variantStyles.color,
        letterSpacing: '0.01em',
        lineHeight: 1.2
      }}
    >
      {icon && <span style={{ display: 'inline-flex', alignItems: 'center' }}>{icon}</span>}
      <span>{children}</span>
    </span>
  );
};
