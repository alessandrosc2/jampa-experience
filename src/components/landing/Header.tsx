import React, { useState, useEffect } from 'react';
import { Compass, Sparkles, UserCheck, Shield, Menu, X, Crown, LogIn, Heart, Map, Navigation } from 'lucide-react';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { User } from '../../types/user';

interface HeaderProps {
  currentUser: User | null;
  isVipMode: boolean;
  favoriteCount?: number;
  onOpenCheckout: () => void;
  onOpenAuth: (tab?: 'login' | 'register') => void;
  onOpenDashboard: () => void;
  onOpenFavorites: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  isVipMode,
  favoriteCount = 0,
  onOpenCheckout,
  onOpenAuth,
  onOpenDashboard,
  onOpenFavorites
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`site-header ${isScrolled ? 'header-scrolled' : ''}`}>
      <div className="container header-inner">
        {/* Brand Logo */}
        <a href="#" className="brand-logo" aria-label="JAMPA EXPERIENCE Início">
          <div className="logo-icon-wrapper">
            <Compass className="logo-compass" size={24} />
          </div>
          <div className="logo-text-group">
            <span className="logo-main">JAMPA<span className="logo-accent">EXPERIENCE</span></span>
            <span className="logo-sub">GUIA TURÍSTICO PREMIUM</span>
          </div>
        </a>

        {/* Desktop Nav Links */}
        <nav className="desktop-nav" aria-label="Navegação Principal">
          <a href="#previa" className="nav-link">Locais & Dicas</a>
          <a href="#roteiros" className="nav-link">Roteiros</a>
          <a href="#mapa" className="nav-link">Mapa Interativo</a>
          {!isVipMode && <a href="#comparativo" className="nav-link">Por que Nós?</a>}
          {!isVipMode && <a href="#oferta" className="nav-link">Acesso Vitalício</a>}
        </nav>

        {/* Action Controls & User State */}
        <div className="header-actions">
          {/* Botão de Atalho para Meus Favoritos */}
          <button
            className="fav-header-btn"
            onClick={onOpenFavorites}
            title="Ver meus locais favoritos"
            aria-label="Abrir favoritos"
          >
            <Heart size={18} fill={favoriteCount > 0 ? '#E76F51' : 'transparent'} color={favoriteCount > 0 ? '#E76F51' : '#CBD5E1'} />
            {favoriteCount > 0 && <span className="fav-counter-badge">{favoriteCount}</span>}
          </button>

          {currentUser ? (
            /* USUÁRIO LOGADO */
            <div className="logged-user-pill glass-panel" onClick={onOpenDashboard} title="Abrir Minha Conta">
              <img
                src={currentUser.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(currentUser.name)}`}
                alt={currentUser.name}
                className="user-nav-avatar"
              />
              <div className="user-nav-meta">
                <span className="user-nav-name">{currentUser.name.split(' ')[0]}</span>
                {isVipMode ? (
                  <span className="user-nav-status vip">👑 Vitalício</span>
                ) : (
                  <span className="user-nav-status free">Visitante</span>
                )}
              </div>
            </div>
          ) : (
            /* VISITANTE DESLOGADO */
            <button
              className="login-nav-btn"
              onClick={() => onOpenAuth('login')}
              title="Entrar na sua conta"
            >
              <LogIn size={16} />
              <span>Entrar</span>
            </button>
          )}

          {/* CTA Principal de Conversão (SOMENTE PARA QUEM NÃO É VIP PAGO) */}
          {!isVipMode && (
            <Button
              variant="gold"
              size="sm"
              iconLeft={<Sparkles size={15} />}
              onClick={onOpenCheckout}
              className="header-cta-btn"
            >
              Garantir R$ 39,90
            </Button>
          )}

          {/* Mobile Menu Toggle */}
          <button
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Abrir menu mobile"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-drawer glass-panel">
          <nav className="mobile-nav">
            <a href="#previa" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>
              Locais & Dicas
            </a>
            <a href="#roteiros" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>
              Roteiros
            </a>
            <a href="#mapa" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>
              Mapa Interativo
            </a>
            {!isVipMode && (
              <a href="#comparativo" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>
                Por que Nós?
              </a>
            )}
            {!isVipMode && (
              <a href="#oferta" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>
                Acesso Vitalício
              </a>
            )}

            <div className="mobile-drawer-footer">
              {!isVipMode && (
                <Button
                  variant="gold"
                  size="md"
                  iconLeft={<Sparkles size={16} />}
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenCheckout();
                  }}
                  className="w-full"
                >
                  Garantir Acesso (R$ 39,90)
                </Button>
              )}

              {!currentUser && (
                <Button
                  variant="outline"
                  size="md"
                  iconLeft={<LogIn size={16} />}
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAuth('login');
                  }}
                  className="w-full"
                >
                  Entrar na Conta
                </Button>
              )}
            </div>
          </nav>
        </div>
      )}

      <style>{`
        .site-header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          height: var(--header-height);
          background: rgba(6, 11, 17, 0.7);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid var(--border-subtle);
          transition: all var(--transition-normal);
        }

        .header-scrolled {
          background: rgba(6, 11, 17, 0.95);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
          border-bottom-color: rgba(0, 180, 216, 0.25);
        }

        .header-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 100%;
        }

        .brand-logo {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          text-decoration: none;
          user-select: none;
        }

        .logo-icon-wrapper {
          width: 38px;
          height: 38px;
          border-radius: var(--radius-md);
          background: rgba(0, 180, 216, 0.15);
          border: 1px solid rgba(0, 180, 216, 0.35);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #00B4D8;
          box-shadow: 0 0 15px rgba(0, 180, 216, 0.2);
          transition: all var(--transition-fast);
        }

        .brand-logo:hover .logo-icon-wrapper {
          transform: rotate(45deg);
          border-color: #00B4D8;
        }

        .logo-text-group {
          display: flex;
          flex-direction: column;
        }

        .logo-main {
          font-family: var(--font-display);
          font-size: 1.15rem;
          font-weight: 800;
          color: #F8FAFC;
          letter-spacing: 0.05em;
          line-height: 1.1;
        }

        .logo-accent {
          color: #00B4D8;
        }

        .logo-sub {
          font-size: 0.5625rem;
          font-weight: 700;
          letter-spacing: 0.15em;
          color: #F4A261;
          text-transform: uppercase;
        }

        .desktop-nav {
          display: flex;
          align-items: center;
          gap: var(--space-xl);
        }

        .nav-link {
          font-family: var(--font-display);
          font-size: 0.875rem;
          font-weight: 600;
          color: #CBD5E1;
          transition: color var(--transition-fast);
          position: relative;
        }

        .nav-link:hover {
          color: #00B4D8;
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: var(--space-md);
        }


        .fav-header-btn {
          position: relative;
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border-subtle);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .fav-header-btn:hover {
          background: rgba(231, 111, 81, 0.2);
          border-color: #E76F51;
        }

        .fav-counter-badge {
          position: absolute;
          top: -4px;
          right: -4px;
          background: #E76F51;
          color: #FFFFFF;
          font-size: 0.625rem;
          font-weight: 800;
          width: 17px;
          height: 17px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid #060B11;
        }

        .logged-user-pill {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.25rem 0.75rem 0.25rem 0.35rem;
          border-radius: var(--radius-full);
          background: rgba(12, 20, 31, 0.8);
          border: 1px solid var(--border-subtle);
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .logged-user-pill:hover {
          border-color: #00B4D8;
          background: rgba(0, 180, 216, 0.1);
        }

        .user-nav-avatar {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          object-fit: cover;
          border: 1px solid #00B4D8;
        }

        .user-nav-meta {
          display: flex;
          flex-direction: column;
        }

        .user-nav-name {
          font-size: 0.75rem;
          font-weight: 700;
          color: #F8FAFC;
          line-height: 1.1;
        }

        .user-nav-status {
          font-size: 0.625rem;
          font-weight: 700;
        }

        .user-nav-status.vip {
          color: #F4A261;
        }

        .user-nav-status.free {
          color: #94A3B8;
        }

        .login-nav-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.45rem 0.85rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-full);
          color: #CBD5E1;
          font-family: var(--font-display);
          font-size: 0.8125rem;
          font-weight: 600;
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .login-nav-btn:hover {
          background: rgba(255, 255, 255, 0.1);
          color: #F8FAFC;
          border-color: rgba(255, 255, 255, 0.3);
        }

        .header-cta-btn {
          box-shadow: 0 0 15px rgba(244, 162, 97, 0.3);
        }

        .mobile-menu-btn {
          display: none;
          background: transparent;
          border: none;
          color: #F8FAFC;
          cursor: pointer;
          padding: 0.3rem;
        }

        .mobile-drawer {
          display: none;
          position: absolute;
          top: var(--header-height);
          left: 0;
          right: 0;
          background: rgba(6, 11, 17, 0.98);
          border-bottom: 1px solid var(--border-medium);
          padding: var(--space-xl);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.8);
        }

        .mobile-nav {
          display: flex;
          flex-direction: column;
          gap: var(--space-md);
        }

        .mobile-link {
          font-family: var(--font-display);
          font-size: 1.1rem;
          font-weight: 700;
          color: #F8FAFC;
          padding: 0.5rem 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .mobile-drawer-footer {
          display: flex;
          flex-direction: column;
          gap: var(--space-sm);
          margin-top: var(--space-md);
        }

        .w-full {
          width: 100%;
        }

        @media (max-width: 900px) {
          .desktop-nav {
            display: none;
          }
          .mobile-menu-btn {
            display: block;
          }
          .mobile-drawer {
            display: block;
          }
          .header-cta-btn {
            display: none;
          }
        }
      `}</style>
    </header>
  );
};
