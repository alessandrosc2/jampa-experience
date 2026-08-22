import React from 'react';
import { Star, MapPin, Lock, Unlock, Eye, Sparkles, Heart, Compass, ShieldCheck, Handshake, Gift } from 'lucide-react';
import { Place } from '../../types/place';
import { Badge } from '../common/Badge';

interface PlacePreviewCardProps {
  place: Place;
  isVipMode: boolean;
  isFavorite?: boolean;
  onToggleFavorite?: (placeId: string) => void;
  onViewDetails: (place: Place) => void;
}

export const PlacePreviewCard: React.FC<PlacePreviewCardProps> = ({
  place,
  isVipMode,
  isFavorite = false,
  onToggleFavorite,
  onViewDetails
}) => {
  return (
    <div className="place-preview-card glass-panel" onClick={() => onViewDetails(place)}>
      {/* Imagem com Overlay & Badges */}
      <div className="card-image-wrap">
        <img
          src={place.featuredImage}
          alt={place.name}
          className="card-img"
          loading="lazy"
        />
        <div className="card-img-gradient" />

        {/* Categoria & Avaliação */}
        <div className="card-top-badges">
          <div className="card-top-left-badges">
            <Badge variant="cyan" size="sm">
              {place.modalityName || place.categoryLabel || 'Praias'}
            </Badge>
          </div>

          <div className="top-right-actions">
            <div className="rating-pill">
              <Star size={13} fill="#F59E0B" color="#F59E0B" />
              <span>{place.rating.toFixed(1)}</span>
            </div>

            {/* Botão de Favorito (somente VIP pode salvar locais específicos) */}
            {isVipMode && (
              <button
                type="button"
                className={`fav-toggle-btn ${isFavorite ? 'active' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite?.(place.id);
                }}
                title={isFavorite ? 'Remover dos favoritos' : 'Salvar nos favoritos'}
                aria-label={`Favoritar ${place.name}`}
              >
                <Heart
                  size={16}
                  fill={isFavorite ? '#E76F51' : 'transparent'}
                  color={isFavorite ? '#E76F51' : '#F8FAFC'}
                />
              </button>
            )}
          </div>
        </div>

        {/* Indicador de Status VIP / Paywall */}
        <div className="card-lock-indicator">
          {isVipMode ? (
            <div className="vip-unlocked-badge">
              <Unlock size={13} />
              <span>Desbloqueado</span>
            </div>
          ) : (
            <div className="visitor-locked-badge">
              <Lock size={13} />
              <span>Conteúdo Exclusivo</span>
            </div>
          )}
        </div>
      </div>

      {/* Conteúdo do Card */}
      <div className="card-body">
        {/* Localização / Bairro */}
        <div className="card-loc-row">
          <MapPin size={13} className="loc-pin-icon" />
          <span className="loc-text">{place.neighborhood}</span>
        </div>

        {/* MODALIDADE EM DESTAQUE ELEGANTE ACIMA DO NOME */}
        <div className="card-modality-badge">
          {place.modalityName || place.categoryLabel}
        </div>

        <h3 className="card-title">{place.name}</h3>
        <p className="card-teaser">{place.publicTeaser}</p>

        {/* Benefício Exclusivo para Membros VIP (sem rótulo de parceiro comercial) */}
        {isVipMode && place.partnerBenefit && (
          <div className="card-member-benefit-pill">
            <Gift size={12} color="#F4A261" />
            <span>{place.partnerBenefit}</span>
          </div>
        )}

        {/* Prévia das Dicas com Bloqueio Visual */}
        <div className="card-tips-teaser">
          <span className="tips-teaser-header">
            <Sparkles size={13} color="#F4A261" /> Dicas Secretas dos Nativos
          </span>
          <div className="tips-preview-box">
            {isVipMode ? (
              <span className="unlocked-tip-preview">
                {place.tips[0]?.title || 'Horários sem fila & Segredos da maré baixa'}
              </span>
            ) : (
              <span className="blur-lock-tag">
                <Lock size={12} /> Nome exato, tábua de marés e rota GPS protegidos
              </span>
            )}
          </div>
        </div>

        {/* Botão de Ação */}
        <div className="card-footer">
          <button className={`card-action-btn ${!isVipMode ? 'btn-unlock-style' : ''}`} aria-label={`Ver detalhes de ${place.name}`}>
            {isVipMode ? (
              <>
                <Eye size={16} />
                <span>Ver Guia Completo</span>
              </>
            ) : (
              <>
                <Lock size={15} color="#F4A261" />
                <span>Desbloquear Experiência</span>
              </>
            )}
          </button>
        </div>
      </div>

      <style>{`
        .place-preview-card {
          border-radius: var(--radius-lg);
          overflow: hidden;
          background: rgba(12, 20, 31, 0.85);
          border: 1px solid var(--border-subtle);
          transition: all var(--transition-normal);
          cursor: pointer;
          display: flex;
          flex-direction: column;
        }

        .place-preview-card:hover {
          transform: translateY(-6px);
          border-color: rgba(0, 180, 216, 0.4);
          box-shadow: 0 16px 35px rgba(0, 0, 0, 0.5), 0 0 25px rgba(0, 180, 216, 0.15);
        }

        .card-image-wrap {
          position: relative;
          width: 100%;
          height: 220px;
          overflow: hidden;
          background: #09111b;
        }

        .card-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .place-preview-card:hover .card-img {
          transform: scale(1.06);
        }

        .card-img-gradient {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(6, 11, 17, 0.3) 0%, rgba(6, 11, 17, 0.85) 100%);
        }

        .card-top-badges {
          position: absolute;
          top: var(--space-sm);
          left: var(--space-sm);
          right: var(--space-sm);
          display: flex;
          align-items: center;
          justify-content: space-between;
          z-index: 2;
        }

        .top-right-actions {
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }

        .rating-pill {
          display: flex;
          align-items: center;
          gap: 0.3rem;
          background: rgba(6, 11, 17, 0.8);
          backdrop-filter: blur(8px);
          padding: 0.25rem 0.6rem;
          border-radius: var(--radius-full);
          border: 1px solid rgba(255, 255, 255, 0.1);
          font-size: 0.8125rem;
          font-weight: 700;
          color: #F8FAFC;
        }

        .fav-toggle-btn {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: rgba(6, 11, 17, 0.8);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .fav-toggle-btn:hover {
          background: rgba(231, 111, 81, 0.25);
          border-color: #E76F51;
          transform: scale(1.1);
        }

        .fav-toggle-btn.active {
          background: rgba(231, 111, 81, 0.2);
          border-color: #E76F51;
        }

        .card-lock-indicator {
          position: absolute;
          bottom: var(--space-sm);
          right: var(--space-sm);
          z-index: 2;
        }

        .visitor-locked-badge {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          background: rgba(244, 162, 97, 0.9);
          backdrop-filter: blur(8px);
          color: #060B11;
          font-size: 0.6875rem;
          font-weight: 800;
          padding: 0.25rem 0.65rem;
          border-radius: var(--radius-full);
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
        }

        .vip-unlocked-badge {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          background: rgba(16, 185, 129, 0.85);
          backdrop-filter: blur(8px);
          color: #FFFFFF;
          font-size: 0.6875rem;
          font-weight: 700;
          padding: 0.25rem 0.65rem;
          border-radius: var(--radius-full);
          box-shadow: 0 0 15px rgba(16, 185, 129, 0.4);
        }

        .card-body {
          padding: var(--space-md) var(--space-lg) var(--space-lg);
          display: flex;
          flex-direction: column;
          gap: var(--space-xs);
          flex-grow: 1;
        }

        .card-loc-row {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.78125rem;
          color: #00B4D8;
          font-weight: 600;
        }

        .card-title {
          font-family: var(--font-display);
          font-size: 1.15rem;
          font-weight: 700;
          color: #F8FAFC;
          line-height: 1.3;
        }

        .card-teaser {
          font-size: 0.875rem;
          color: #94A3B8;
          line-height: 1.5;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .card-top-left-badges {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          flex-wrap: wrap;
        }

        .card-modality-badge {
          display: inline-flex;
          align-items: center;
          font-family: var(--font-display);
          font-size: 0.6875rem;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #00B4D8;
          margin-top: 0.15rem;
          margin-bottom: -0.15rem;
        }

        .card-member-benefit-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.25rem 0.55rem;
          background: rgba(244, 162, 97, 0.12);
          border: 1px solid rgba(244, 162, 97, 0.3);
          border-radius: var(--radius-md);
          font-size: 0.75rem;
          font-weight: 700;
          color: #F4A261;
          margin-top: 0.25rem;
        }

        .card-tips-teaser {
          margin-top: var(--space-xs);
          padding: var(--space-xs) var(--space-sm);
          background: rgba(255, 255, 255, 0.03);
          border: 1px dashed var(--border-subtle);
          border-radius: var(--radius-md);
        }

        .tips-teaser-header {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.75rem;
          font-weight: 700;
          color: #F4A261;
        }

        .tips-preview-box {
          position: relative;
          margin-top: 0.25rem;
          font-size: 0.78125rem;
          color: #94A3B8;
        }

        .unlocked-tip-preview {
          color: #CBD5E1;
        }

        .blur-lock-tag {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.71875rem;
          color: #FCA5A5;
          font-weight: 600;
        }

        .card-footer {
          margin-top: auto;
          padding-top: var(--space-sm);
        }

        .card-action-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.6rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-full);
          font-family: var(--font-display);
          font-size: 0.8125rem;
          font-weight: 700;
          color: #E2E8F0;
          transition: all var(--transition-fast);
        }

        .btn-unlock-style {
          background: rgba(244, 162, 97, 0.12);
          border-color: rgba(244, 162, 97, 0.4);
          color: #F4A261;
        }

        .place-preview-card:hover .card-action-btn {
          background: #F4A261;
          color: #060B11;
          border-color: #F4A261;
        }
      `}</style>
    </div>
  );
};
