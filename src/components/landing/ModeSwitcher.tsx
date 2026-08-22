import React from 'react';
import { Lock, Unlock, Crown, Sparkles, Sliders } from 'lucide-react';

interface ModeSwitcherProps {
  isVipMode: boolean;
  onToggle: () => void;
}

export const ModeSwitcher: React.FC<ModeSwitcherProps> = ({ isVipMode, onToggle }) => {
  return (
    <div className="mode-switcher-floating">
      <div className="mode-switcher-card glass-panel">
        <div className="mode-info">
          <div className="mode-badge-wrap">
            {isVipMode ? (
              <span className="vip-dot-active" />
            ) : (
              <span className="visitor-dot" />
            )}
            <span className="mode-current-label">
              {isVipMode ? 'Modo VIP Vitalício' : 'Modo Visitante'}
            </span>
          </div>
          <span className="mode-helper">
            {isVipMode ? 'Dicas e rotas desbloqueadas' : 'Demonstração de paywall ativa'}
          </span>
        </div>

        <button
          className={`mode-toggle-pill ${isVipMode ? 'vip-active' : ''}`}
          onClick={onToggle}
          aria-label="Alternar entre modo visitante e modo VIP"
        >
          <span className="toggle-thumb">
            {isVipMode ? <Crown size={14} color="#060B11" /> : <Lock size={14} color="#060B11" />}
          </span>
          <span className="toggle-text">
            {isVipMode ? 'VIP Ativo' : 'Desbloquear'}
          </span>
        </button>
      </div>

      <style>{`
        .mode-switcher-floating {
          position: fixed;
          bottom: 24px;
          right: 24px;
          z-index: 99;
          animation: slideUpFloat 0.4s ease-out;
        }

        .mode-switcher-card {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.65rem 1rem;
          background: rgba(10, 17, 26, 0.95);
          border: 1px solid rgba(0, 180, 216, 0.35);
          border-radius: var(--radius-full);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.6), 0 0 20px rgba(0, 180, 216, 0.2);
          backdrop-filter: blur(16px);
        }

        .mode-info {
          display: flex;
          flex-direction: column;
          text-align: left;
        }

        .mode-badge-wrap {
          display: flex;
          align-items: center;
          gap: 0.35rem;
        }

        .visitor-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #F87171;
          box-shadow: 0 0 8px #F87171;
        }

        .vip-dot-active {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #10B981;
          box-shadow: 0 0 8px #10B981;
        }

        .mode-current-label {
          font-family: var(--font-display);
          font-size: 0.8125rem;
          font-weight: 700;
          color: #F8FAFC;
        }

        .mode-helper {
          font-size: 0.6875rem;
          color: #94A3B8;
        }

        .mode-toggle-pill {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.35rem 0.75rem 0.35rem 0.45rem;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid var(--border-medium);
          border-radius: var(--radius-full);
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .mode-toggle-pill:hover {
          background: rgba(255, 255, 255, 0.15);
        }

        .mode-toggle-pill.vip-active {
          background: linear-gradient(135deg, #F4A261 0%, #E76F51 100%);
          border-color: rgba(255, 255, 255, 0.3);
          box-shadow: 0 0 15px rgba(244, 162, 97, 0.4);
        }

        .toggle-thumb {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: #F8FAFC;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .toggle-text {
          font-family: var(--font-display);
          font-size: 0.75rem;
          font-weight: 800;
          color: #F8FAFC;
        }

        .mode-toggle-pill.vip-active .toggle-text {
          color: #060B11;
        }

        @keyframes slideUpFloat {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 640px) {
          .mode-switcher-floating {
            bottom: 16px;
            right: 16px;
            left: 16px;
          }
          .mode-switcher-card {
            justify-content: space-between;
          }
        }
      `}</style>
    </div>
  );
};
