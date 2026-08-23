import React from 'react';
import {
  Compass,
  MapPin,
  Palmtree,
  Heart,
  UserCheck,
  Sparkles
} from 'lucide-react';

interface MobileBottomNavProps {
  activeTab: 'explore' | 'map' | 'itineraries' | 'favorites' | 'vip';
  favoriteCount: number;
  isVipMode: boolean;
  onSelectTab: (tab: 'explore' | 'map' | 'itineraries' | 'favorites' | 'vip') => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  favoriteCount,
  isVipMode,
  onSelectTab
}) => {
  return (
    <nav className="mobile-bottom-nav" aria-label="Navegação Principal Mobile">
      <div className="bottom-nav-container glass-panel">
        {/* 1. Explorar Catálogo */}
        <button
          type="button"
          className={`bottom-nav-item ${activeTab === 'explore' ? 'active' : ''}`}
          onClick={() => onSelectTab('explore')}
          aria-label="Explorar Praias e Atrações"
        >
          <div className="nav-icon-wrapper">
            <Compass size={22} className="nav-icon" />
            {activeTab === 'explore' && <span className="active-dot" />}
          </div>
          <span className="nav-label">Explorar</span>
        </button>

        {/* 2. Mapa Turístico */}
        <button
          type="button"
          className={`bottom-nav-item ${activeTab === 'map' ? 'active' : ''}`}
          onClick={() => onSelectTab('map')}
          aria-label="Abrir Mapa Turístico com GPS"
        >
          <div className="nav-icon-wrapper">
            <MapPin size={22} className="nav-icon" />
            {activeTab === 'map' && <span className="active-dot" />}
          </div>
          <span className="nav-label">Mapa GPS</span>
        </button>

        {/* 3. Roteiros */}
        <button
          type="button"
          className={`bottom-nav-item ${activeTab === 'itineraries' ? 'active' : ''}`}
          onClick={() => onSelectTab('itineraries')}
          aria-label="Ver Roteiros Prontos"
        >
          <div className="nav-icon-wrapper">
            <Palmtree size={22} className="nav-icon" />
            {activeTab === 'itineraries' && <span className="active-dot" />}
          </div>
          <span className="nav-label">Roteiros</span>
        </button>

        {/* 4. Favoritos */}
        <button
          type="button"
          className={`bottom-nav-item ${activeTab === 'favorites' ? 'active' : ''}`}
          onClick={() => onSelectTab('favorites')}
          aria-label={`Ver Meus Favoritos (${favoriteCount})`}
        >
          <div className="nav-icon-wrapper">
            <Heart size={22} className="nav-icon" />
            {favoriteCount > 0 && (
              <span className="fav-badge-count">{favoriteCount}</span>
            )}
            {activeTab === 'favorites' && <span className="active-dot" />}
          </div>
          <span className="nav-label">Salvos</span>
        </button>

        {/* 5. Acesso VIP / Perfil */}
        <button
          type="button"
          className={`bottom-nav-item vip-tab ${activeTab === 'vip' ? 'active' : ''} ${
            isVipMode ? 'is-vip' : ''
          }`}
          onClick={() => onSelectTab('vip')}
          aria-label={isVipMode ? 'Meu Acesso VIP' : 'Desbloquear VIP'}
        >
          <div className="nav-icon-wrapper">
            {isVipMode ? (
              <UserCheck size={22} className="nav-icon gold" />
            ) : (
              <Sparkles size={22} className="nav-icon gold" />
            )}
            {activeTab === 'vip' && <span className="active-dot gold" />}
          </div>
          <span className="nav-label gold">{isVipMode ? 'Meu VIP' : 'Quero VIP'}</span>
        </button>
      </div>

      <style>{`
        .mobile-bottom-nav {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 990;
          padding: 0.5rem 0.75rem calc(0.5rem + env(safe-area-inset-bottom, 0px));
          pointer-events: none;
          display: none;
        }

        @media (max-width: 768px) {
          .mobile-bottom-nav {
            display: block;
          }
        }

        .bottom-nav-container {
          pointer-events: auto;
          max-width: 480px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-around;
          background: rgba(6, 11, 17, 0.92);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(0, 180, 216, 0.25);
          border-radius: 9999px;
          padding: 0.4rem 0.6rem;
          box-shadow: 0 10px 35px rgba(0, 0, 0, 0.6), 0 0 20px rgba(0, 180, 216, 0.15);
        }

        .bottom-nav-item {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.18rem;
          background: transparent;
          border: none;
          padding: 0.35rem 0.2rem;
          cursor: pointer;
          border-radius: 9999px;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          color: #94A3B8;
          min-width: 0;
          -webkit-tap-highlight-color: transparent;
        }

        .bottom-nav-item:active {
          transform: scale(0.92);
        }

        .nav-icon-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 28px;
        }

        .nav-icon {
          transition: transform 0.2s ease, color 0.2s ease;
        }

        .bottom-nav-item.active .nav-icon {
          color: #00B4D8;
          transform: translateY(-2px);
        }

        .bottom-nav-item.active .nav-icon.gold {
          color: #F4A261;
        }

        .active-dot {
          position: absolute;
          bottom: -4px;
          width: 5px;
          height: 5px;
          background: #00B4D8;
          border-radius: 50%;
          box-shadow: 0 0 8px #00B4D8;
        }

        .active-dot.gold {
          background: #F4A261;
          box-shadow: 0 0 8px #F4A261;
        }

        .fav-badge-count {
          position: absolute;
          top: -2px;
          right: -2px;
          background: #EF4444;
          color: #FFFFFF;
          font-size: 0.625rem;
          font-weight: 800;
          padding: 0.1rem 0.3rem;
          border-radius: 9999px;
          line-height: 1;
          box-shadow: 0 2px 6px rgba(239, 68, 68, 0.5);
        }

        .nav-label {
          font-size: 0.6875rem;
          font-weight: 600;
          letter-spacing: 0.02em;
          transition: color 0.2s ease;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .bottom-nav-item.active .nav-label {
          color: #F8FAFC;
          font-weight: 700;
        }

        .bottom-nav-item .nav-label.gold {
          color: #F4A261;
        }

        .bottom-nav-item.vip-tab.active .nav-label.gold {
          color: #F8FAFC;
        }
      `}</style>
    </nav>
  );
};
