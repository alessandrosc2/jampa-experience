import React, { useState } from 'react';
import { Heart, Trash2, MapPin, Star, Sparkles, ArrowRight, LayoutGrid } from 'lucide-react';
import { Place, CategoryId } from '../../types/place';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';

interface FavoritesModalProps {
  isOpen: boolean;
  onClose: () => void;
  favorites: Place[];
  onRemoveFavorite: (placeId: string) => void;
  onSelectPlace: (place: Place) => void;
  onExploreMore: () => void;
}

export const FavoritesModal: React.FC<FavoritesModalProps> = ({
  isOpen,
  onClose,
  favorites,
  onRemoveFavorite,
  onSelectPlace,
  onExploreMore
}) => {
  const [filterCat, setFilterCat] = useState<string>('all');

  const categories = Array.from(new Set(favorites.map((p) => p.categoryLabel)));

  const filtered = favorites.filter((p) => {
    if (filterCat === 'all') return true;
    return p.categoryLabel === filterCat;
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="760px"
      title={
        <div className="fav-modal-title">
          <Heart size={20} fill="#E76F51" color="#E76F51" />
          <span>Meus Lugares Favoritos ({favorites.length})</span>
        </div>
      }
    >
      <div className="favorites-modal-content">
        {favorites.length > 0 ? (
          <>
            {/* Categorias de Filtro Interno */}
            {categories.length > 1 && (
              <div className="fav-category-filter">
                <button
                  className={`cat-btn ${filterCat === 'all' ? 'active' : ''}`}
                  onClick={() => setFilterCat('all')}
                >
                  Todos ({favorites.length})
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    className={`cat-btn ${filterCat === cat ? 'active' : ''}`}
                    onClick={() => setFilterCat(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}

            {/* Grid de Favoritos */}
            <div className="favorites-items-grid">
              {filtered.map((place) => (
                <div key={place.id} className="fav-place-card glass-panel">
                  <div
                    className="fav-img-wrap"
                    onClick={() => {
                      onClose();
                      onSelectPlace(place);
                    }}
                  >
                    <img src={place.featuredImage} alt={place.name} />
                    <div className="fav-card-overlay" />
                    <Badge variant="cyan" size="sm" className="fav-badge-cat">
                      {place.categoryLabel}
                    </Badge>
                  </div>

                  <div className="fav-card-body">
                    <div className="fav-loc-line">
                      <MapPin size={12} color="#00B4D8" />
                      <span>{place.neighborhood}</span>
                      <div className="fav-star-tag">
                        <Star size={11} fill="#F59E0B" color="#F59E0B" />
                        <span>{place.rating.toFixed(1)}</span>
                      </div>
                    </div>

                    <h4
                      className="fav-place-name"
                      onClick={() => {
                        onClose();
                        onSelectPlace(place);
                      }}
                    >
                      {place.name}
                    </h4>

                    <div className="fav-actions-row">
                      <button
                        className="fav-view-btn"
                        onClick={() => {
                          onClose();
                          onSelectPlace(place);
                        }}
                      >
                        Ver Detalhes
                      </button>

                      <button
                        className="fav-remove-btn"
                        onClick={() => onRemoveFavorite(place.id)}
                        title="Remover dos favoritos"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          /* ESTADO VAZIO */
          <div className="empty-fav-state glass-panel">
            <Heart size={48} color="#64748B" />
            <h4 className="empty-fav-title">Nenhum lugar favoritado ainda</h4>
            <p className="empty-fav-desc">
              Você pode clicar no coração nos cards das praias, restaurantes e passeios para salvá-los e montar o roteiro perfeito das suas férias.
            </p>
            <Button
              variant="gold"
              size="md"
              iconRight={<ArrowRight size={16} />}
              onClick={() => {
                onClose();
                onExploreMore();
              }}
            >
              Explorar Locais de Jampa
            </Button>
          </div>
        )}
      </div>

      <style>{`
        .fav-modal-title {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-family: var(--font-display);
          font-size: 1.15rem;
          font-weight: 700;
          color: #F8FAFC;
        }

        .favorites-modal-content {
          display: flex;
          flex-direction: column;
          gap: var(--space-md);
        }

        .fav-category-filter {
          display: flex;
          gap: 0.5rem;
          overflow-x: auto;
          padding-bottom: 0.25rem;
        }

        .cat-btn {
          padding: 0.35rem 0.8rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-full);
          font-size: 0.75rem;
          font-weight: 700;
          color: #94A3B8;
          cursor: pointer;
          transition: all var(--transition-fast);
          white-space: nowrap;
        }

        .cat-btn.active, .cat-btn:hover {
          background: rgba(0, 180, 216, 0.2);
          border-color: #00B4D8;
          color: #F8FAFC;
        }

        .favorites-items-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: var(--space-md);
        }

        .fav-place-card {
          border-radius: var(--radius-md);
          overflow: hidden;
          background: rgba(12, 20, 31, 0.85);
          border: 1px solid var(--border-subtle);
          display: flex;
          flex-direction: column;
          transition: transform var(--transition-fast);
        }

        .fav-place-card:hover {
          transform: translateY(-3px);
          border-color: var(--border-medium);
        }

        .fav-img-wrap {
          position: relative;
          width: 100%;
          height: 120px;
          cursor: pointer;
        }

        .fav-img-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .fav-card-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, transparent 0%, rgba(6, 11, 17, 0.8) 100%);
        }

        .fav-badge-cat {
          position: absolute;
          top: 8px;
          left: 8px;
        }

        .fav-card-body {
          padding: 0.75rem;
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
          flex: 1;
        }

        .fav-loc-line {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.6875rem;
          color: #00B4D8;
        }

        .fav-star-tag {
          margin-left: auto;
          display: flex;
          align-items: center;
          gap: 0.2rem;
          color: #F59E0B;
          font-weight: 700;
        }

        .fav-place-name {
          font-family: var(--font-display);
          font-size: 0.95rem;
          font-weight: 700;
          color: #F8FAFC;
          cursor: pointer;
          line-height: 1.2;
        }

        .fav-actions-row {
          margin-top: auto;
          padding-top: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.5rem;
        }

        .fav-view-btn {
          flex: 1;
          padding: 0.35rem;
          background: rgba(0, 180, 216, 0.15);
          border: 1px solid rgba(0, 180, 216, 0.3);
          border-radius: var(--radius-sm);
          color: #38BDF8;
          font-size: 0.75rem;
          font-weight: 700;
          cursor: pointer;
          transition: background var(--transition-fast);
        }

        .fav-view-btn:hover {
          background: rgba(0, 180, 216, 0.25);
        }

        .fav-remove-btn {
          padding: 0.35rem 0.5rem;
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.25);
          border-radius: var(--radius-sm);
          color: #FCA5A5;
          cursor: pointer;
          transition: background var(--transition-fast);
        }

        .fav-remove-btn:hover {
          background: rgba(239, 68, 68, 0.25);
        }

        .empty-fav-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: var(--space-3xl) var(--space-lg);
          gap: var(--space-sm);
        }

        .empty-fav-title {
          font-family: var(--font-display);
          font-size: 1.25rem;
          color: #F8FAFC;
        }

        .empty-fav-desc {
          font-size: 0.875rem;
          color: #94A3B8;
          max-width: 440px;
          line-height: 1.5;
        }
      `}</style>
    </Modal>
  );
};
