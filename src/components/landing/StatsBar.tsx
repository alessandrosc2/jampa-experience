import React from 'react';
import { Star, Infinity, ShieldCheck, MapPinned } from 'lucide-react';

export const StatsBar: React.FC = () => {
  const stats = [
    {
      icon: <Infinity size={22} color="#F4A261" />,
      value: 'Vitalício',
      label: 'Pague 1x e use para sempre'
    },
    {
      icon: <MapPinned size={22} color="#00B4D8" />,
      value: 'Seleção VIP',
      label: 'Curadoria 100% verificada'
    },
    {
      icon: <Star size={22} color="#F59E0B" />,
      value: '4.9 ★',
      label: 'Aprovado por turistas e nativos'
    },
    {
      icon: <ShieldCheck size={22} color="#2EC4B6" />,
      value: '100% Seguro',
      label: 'PIX instantâneo ou Cartão'
    }
  ];

  return (
    <section className="stats-bar-section">
      <div className="container">
        <div className="stats-grid glass-panel">
          {stats.map((stat, idx) => (
            <div key={idx} className="stat-card">
              <div className="stat-icon-wrap">{stat.icon}</div>
              <div className="stat-info">
                <span className="stat-value">{stat.value}</span>
                <span className="stat-label">{stat.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .stats-bar-section {
          position: relative;
          z-index: 10;
          margin-top: -2.5rem;
          padding-bottom: var(--space-2xl);
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: var(--space-md);
          padding: var(--space-lg) var(--space-xl);
          background: rgba(12, 20, 31, 0.88);
          border: 1px solid var(--border-medium);
          box-shadow: 0 12px 35px rgba(0, 0, 0, 0.45);
        }

        .stat-card {
          display: flex;
          align-items: center;
          gap: var(--space-md);
        }

        .stat-icon-wrap {
          width: 46px;
          height: 46px;
          border-radius: var(--radius-md);
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border-subtle);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .stat-info {
          display: flex;
          flex-direction: column;
        }

        .stat-value {
          font-family: var(--font-display);
          font-size: 1.25rem;
          font-weight: 800;
          color: #F8FAFC;
          line-height: 1.1;
        }

        .stat-label {
          font-size: 0.78125rem;
          color: #94A3B8;
        }

        @media (max-width: 900px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: var(--space-lg);
          }
        }

        @media (max-width: 540px) {
          .stats-grid {
            grid-template-columns: 1fr;
            padding: var(--space-md);
          }
        }
      `}</style>
    </section>
  );
};
