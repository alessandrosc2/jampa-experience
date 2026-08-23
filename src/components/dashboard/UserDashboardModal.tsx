import React, { useState } from 'react';
import {
  User as UserIcon,
  Crown,
  Infinity,
  CheckCircle2,
  Calendar,
  Mail,
  Heart,
  Compass,
  Star,
  MapPin,
  Lightbulb,
  LogOut,
  Sparkles,
  ShieldAlert,
  ArrowRight,
  Receipt,
  Settings
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { User } from '../../types/user';

interface UserDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  favoriteCount?: number;
  onLogout: () => void;
  onOpenCheckout: () => void;
  onOpenFavorites: () => void;
  onExploreClick: () => void;
}

export const UserDashboardModal: React.FC<UserDashboardModalProps> = ({
  isOpen,
  onClose,
  user,
  favoriteCount = 0,
  onLogout,
  onOpenCheckout,
  onOpenFavorites,
  onExploreClick
}) => {
  if (!user) return null;

  const isLifetimeActive = user.accessStatus === 'active' && user.accessType === 'lifetime';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="740px"
      title={
        <div className="dashboard-header-title">
          <Crown size={20} color="#F4A261" />
          <span>Minha Conta — JAMPA EXPERIENCE</span>
        </div>
      }
    >
      <div className="dashboard-content">
        {/* Banner de Boas-Vindas do Perfil */}
        <div className="user-profile-hero glass-panel">
          <div className="user-hero-main">
            <img
              src={user.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name)}`}
              alt={user.name}
              className="user-avatar-lg"
            />
            <div className="user-info-text">
              <div className="user-name-row">
                <h3 className="user-greeting">Olá, {user.name.split(' ')[0]} 👋</h3>
                {isLifetimeActive ? (
                  <Badge variant="emerald" icon={<Infinity size={13} />}>
                    Acesso Vitalício Ativo
                  </Badge>
                ) : (
                  <Badge variant="warning" icon={<ShieldAlert size={13} />}>
                    Pagamento Pendente
                  </Badge>
                )}
              </div>
              <span className="user-email-text">{user.email}</span>
              {user.phone && <span className="user-phone-text">WhatsApp: {user.phone}</span>}
              <span className="user-since-text">Membro desde: {user.createdAt}</span>
            </div>
          </div>

          <div className="user-hero-actions">
            <button
              className="logout-action-btn"
              onClick={() => {
                onLogout();
                onClose();
              }}
              title="Sair da conta"
            >
              <LogOut size={16} />
              <span>Sair</span>
            </button>
          </div>
        </div>

        {/* ALERTA SE NÃO FOR VITALÍCIO PAGO */}
        {!isLifetimeActive && (
          <div className="pending-upgrade-card glass-panel">
            <div className="pending-info">
              <h4 className="pending-title">Seu Acesso Vitalício ainda não foi ativado</h4>
              <p className="pending-desc">
                Desbloqueie todo o conteúdo de João Pessoa: dicas secretas de nativos, rotas no Waze/Google Maps e roteiros prontos por apenas <strong>R$ 39,90</strong> (pagamento único).
              </p>
            </div>
            <Button
              variant="gold"
              size="md"
              iconLeft={<Sparkles size={16} />}
              onClick={() => {
                onClose();
                onOpenCheckout();
              }}
            >
              ATIVAR ACESSO VITALÍCIO (R$ 39,90)
            </Button>
          </div>
        )}

        {/* HUB DE RECURSOS RÁPIDOS DO DASHBOARD */}
        <div className="dashboard-hubs-section">
          <div className="hub-section-header">
            <h4 className="hub-heading">Explore João Pessoa com seu App</h4>
            <Button
              variant="primary"
              size="sm"
              iconRight={<ArrowRight size={14} />}
              onClick={() => {
                onClose();
                onExploreClick();
              }}
            >
              Explorar Jampa
            </Button>
          </div>

          <div className="dashboard-grid-tools">
            {/* 1. Favoritos */}
            <div
              className="tool-card glass-panel"
              onClick={() => {
                onClose();
                onOpenFavorites();
              }}
            >
              <div className="tool-icon-circle heart">
                <Heart size={20} />
              </div>
              <div className="tool-details">
                <span className="tool-title">❤️ Meus Favoritos ({favoriteCount})</span>
                <span className="tool-sub">Lugares salvos para sua viagem</span>
              </div>
            </div>

            {/* 2. Roteiros */}
            <div className="tool-card glass-panel" onClick={() => { onClose(); onExploreClick(); }}>
              <div className="tool-icon-circle compass">
                <Compass size={20} />
              </div>
              <div className="tool-details">
                <span className="tool-title">🧭 Meus Roteiros</span>
                <span className="tool-sub">1, 3 e 5 dias em Jampa</span>
              </div>
            </div>

            {/* 3. Minhas Avaliações */}
            <div className="tool-card glass-panel" onClick={() => { onClose(); onExploreClick(); }}>
              <div className="tool-icon-circle star">
                <Star size={20} />
              </div>
              <div className="tool-details">
                <span className="tool-title">⭐ Minhas Avaliações</span>
                <span className="tool-sub">Opiniões de locais visitados</span>
              </div>
            </div>

            {/* 4. Lugares Próximos */}
            <div className="tool-card glass-panel" onClick={() => { onClose(); onExploreClick(); }}>
              <div className="tool-icon-circle pin">
                <MapPin size={20} />
              </div>
              <div className="tool-details">
                <span className="tool-title">📍 Lugares Próximos</span>
                <span className="tool-sub">Orla, centro e praias do sul</span>
              </div>
            </div>

            {/* 5. Dicas Secretas */}
            <div className="tool-card glass-panel" onClick={() => { onClose(); onExploreClick(); }}>
              <div className="tool-icon-circle bulb">
                <Lightbulb size={20} />
              </div>
              <div className="tool-details">
                <span className="tool-title">💡 Dicas dos Nativos</span>
                <span className="tool-sub">Tábua de maré e horários</span>
              </div>
            </div>
          </div>
        </div>

        {/* DETALHES DO PLANO & STATUS */}
        <div className="account-details-block glass-panel">
          <h4 className="details-block-title">Detalhes da Assinatura</h4>
          <div className="details-row-grid">
            <div className="detail-item">
              <span className="d-label">Tipo de Acesso:</span>
              <span className="d-val">{isLifetimeActive ? 'Vitalício (Para Sempre)' : 'Gratuito / Visitante'}</span>
            </div>
            <div className="detail-item">
              <span className="d-label">Status da Conta:</span>
              <span className="d-val">{isLifetimeActive ? '🟢 Ativo' : '🟡 Pagamento Pendente'}</span>
            </div>
            {user.purchasedAt && (
              <div className="detail-item">
                <span className="d-label">Comprado em:</span>
                <span className="d-val">{user.purchasedAt}</span>
              </div>
            )}
            {user.orderId && (
              <div className="detail-item">
                <span className="d-label">Código do Pedido:</span>
                <span className="d-val mono">{user.orderId}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .dashboard-header-title {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-family: var(--font-display);
          font-size: 1.15rem;
          font-weight: 700;
          color: #F8FAFC;
        }

        .dashboard-content {
          display: flex;
          flex-direction: column;
          gap: var(--space-xl);
        }

        .user-profile-hero {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--space-lg) var(--space-xl);
          background: rgba(12, 20, 31, 0.9);
          border: 1px solid var(--border-medium);
          border-radius: var(--radius-lg);
          gap: var(--space-md);
        }

        .user-hero-main {
          display: flex;
          align-items: center;
          gap: var(--space-md);
        }

        .user-avatar-lg {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid #00B4D8;
          box-shadow: 0 0 15px rgba(0, 180, 216, 0.3);
        }

        .user-info-text {
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
        }

        .user-name-row {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          flex-wrap: wrap;
        }

        .user-greeting {
          font-family: var(--font-display);
          font-size: 1.35rem;
          font-weight: 800;
          color: #F8FAFC;
        }

        .user-email-text {
          font-size: 0.8125rem;
          color: #94A3B8;
        }

        .user-since-text {
          font-size: 0.75rem;
          color: #64748B;
        }

        .logout-action-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.45rem 0.9rem;
          background: rgba(239, 68, 68, 0.12);
          border: 1px solid rgba(239, 68, 68, 0.3);
          border-radius: var(--radius-full);
          color: #FCA5A5;
          font-size: 0.8125rem;
          font-weight: 600;
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .logout-action-btn:hover {
          background: rgba(239, 68, 68, 0.25);
          color: #FFFFFF;
        }

        .pending-upgrade-card {
          padding: var(--space-lg);
          background: linear-gradient(135deg, rgba(244, 162, 97, 0.15) 0%, rgba(12, 20, 31, 0.9) 100%);
          border: 1px solid rgba(244, 162, 97, 0.4);
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: var(--space-md);
          flex-wrap: wrap;
        }

        .pending-info {
          max-width: 440px;
        }

        .pending-title {
          font-family: var(--font-display);
          font-size: 1.05rem;
          color: #F4A261;
          font-weight: 700;
          margin-bottom: 0.25rem;
        }

        .pending-desc {
          font-size: 0.8125rem;
          color: #CBD5E1;
          line-height: 1.45;
        }

        .dashboard-hubs-section {
          display: flex;
          flex-direction: column;
          gap: var(--space-md);
        }

        .hub-section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .hub-heading {
          font-family: var(--font-display);
          font-size: 1.15rem;
          color: #F8FAFC;
        }

        .dashboard-grid-tools {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: var(--space-md);
        }

        .tool-card {
          padding: var(--space-md);
          background: rgba(12, 20, 31, 0.8);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          gap: 0.75rem;
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .tool-card:hover {
          transform: translateY(-3px);
          border-color: #00B4D8;
          background: rgba(18, 30, 46, 0.95);
        }

        .tool-icon-circle {
          width: 42px;
          height: 42px;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .tool-icon-circle.heart { background: rgba(231, 111, 81, 0.15); color: #E76F51; }
        .tool-icon-circle.compass { background: rgba(0, 180, 216, 0.15); color: #00B4D8; }
        .tool-icon-circle.star { background: rgba(245, 158, 11, 0.15); color: #F59E0B; }
        .tool-icon-circle.pin { background: rgba(46, 196, 182, 0.15); color: #2EC4B6; }
        .tool-icon-circle.bulb { background: rgba(167, 139, 250, 0.15); color: #A78BFA; }

        .tool-details {
          display: flex;
          flex-direction: column;
        }

        .tool-title {
          font-family: var(--font-display);
          font-size: 0.875rem;
          font-weight: 700;
          color: #F8FAFC;
        }

        .tool-sub {
          font-size: 0.6875rem;
          color: #94A3B8;
        }

        .account-details-block {
          padding: var(--space-lg);
          background: rgba(8, 14, 22, 0.9);
          border-radius: var(--radius-md);
        }

        .details-block-title {
          font-size: 0.95rem;
          color: #F8FAFC;
          margin-bottom: var(--space-md);
        }

        .details-row-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: var(--space-md);
        }

        .detail-item {
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
        }

        .d-label {
          font-size: 0.75rem;
          text-transform: uppercase;
          color: #64748B;
          font-weight: 700;
        }

        .d-val {
          font-size: 0.875rem;
          color: #E2E8F0;
          font-weight: 600;
        }

        .d-val.mono {
          font-family: var(--font-mono);
          color: #00B4D8;
          font-size: 0.8125rem;
        }

        @media (max-width: 640px) {
          .user-profile-hero {
            flex-direction: column;
            align-items: flex-start;
          }
          .pending-upgrade-card {
            flex-direction: column;
            align-items: stretch;
          }
        }
      `}</style>
    </Modal>
  );
};
