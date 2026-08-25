import React, { useState, useMemo } from 'react';
import {
  Search,
  SlidersHorizontal,
  MapPin,
  Sparkles,
  Navigation,
  Compass,
  DollarSign,
  CheckCircle2,
  Crosshair,
  Lock,
  UtensilsCrossed,
  GlassWater,
  Coffee,
  Hotel,
  Camera,
  Sunset,
  ShoppingBag,
  Landmark,
  Moon,
  HeartPulse,
  Scissors,
  Palmtree,
  Car,
  Lightbulb
} from 'lucide-react';
import { Place, CategoryId, Topic, Neighborhood } from '../../types/place';
import { PlacePreviewCard } from './PlacePreviewCard';
import { adminService } from '../../services/adminService';
import { geolocationService, UserCoordinates } from '../../services/geolocationService';

interface PreviewGridProps {
  places: Place[];
  selectedCategory: CategoryId | 'all';
  isVipMode: boolean;
  favoriteIds?: string[];
  onToggleFavorite?: (placeId: string) => void;
  onViewPlaceDetails: (place: Place) => void;
  onOpenCheckout?: () => void;
}

const topicIconMap: Record<string, React.ReactNode> = {
  UtensilsCrossed: <UtensilsCrossed size={18} color="#00B4D8" />,
  GlassWater: <GlassWater size={18} color="#00B4D8" />,
  Coffee: <Coffee size={18} color="#00B4D8" />,
  Hotel: <Hotel size={18} color="#00B4D8" />,
  Compass: <Compass size={18} color="#00B4D8" />,
  Camera: <Camera size={18} color="#00B4D8" />,
  Sunset: <Sunset size={18} color="#00B4D8" />,
  ShoppingBag: <ShoppingBag size={18} color="#00B4D8" />,
  Landmark: <Landmark size={18} color="#00B4D8" />,
  Moon: <Moon size={18} color="#00B4D8" />,
  HeartPulse: <HeartPulse size={18} color="#00B4D8" />,
  Scissors: <Scissors size={18} color="#00B4D8" />,
  Palmtree: <Palmtree size={18} color="#00B4D8" />,
  Car: <Car size={18} color="#00B4D8" />,
  Sparkles: <Sparkles size={18} color="#00B4D8" />
};

// Funções de correspondência robusta (Case-Insensitive, Acentuação & Substrings)
function normalizeText(str: string): string {
  return (str || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
}

function isPlaceInNeighborhood(
  place: Place,
  selectedNeighborhood: string,
  currentNeighborhoodObj: Neighborhood | null
): boolean {
  if (selectedNeighborhood === 'all') return true;

  const selNorm = normalizeText(selectedNeighborhood);
  const pNeighNorm = normalizeText(place.neighborhood || '');
  const pNeighIdNorm = normalizeText(place.neighborhoodId || '');

  // 1. Correspondência direta por ID/Slug ou Nome
  if (pNeighNorm === selNorm || pNeighIdNorm === selNorm) return true;

  // 2. Correspondência através do objeto do CMS do Bairro
  if (currentNeighborhoodObj) {
    const objNameNorm = normalizeText(currentNeighborhoodObj.name);
    const objSlugNorm = normalizeText(currentNeighborhoodObj.slug);
    const objIdNorm = normalizeText(currentNeighborhoodObj.id);

    if (pNeighIdNorm === objIdNorm || pNeighIdNorm === objSlugNorm) return true;
    if (pNeighNorm === objNameNorm) return true;
    if (pNeighNorm.includes(objSlugNorm) || objNameNorm.includes(pNeighNorm)) return true;
  }

  // 3. Correspondência por substring/inclusão
  if (pNeighNorm.includes(selNorm) || selNorm.includes(pNeighNorm)) return true;

  return false;
}

function isPlaceInTopic(place: Place, topic: Topic): boolean {
  const tIds = place.topicIds || [];
  const topicIdNorm = normalizeText(topic.id);
  const topicSlugNorm = normalizeText(topic.slug || topic.id);
  const topicNameNorm = normalizeText(topic.name);

  // 1. Verifica se topicIds do local contém o tópico selecionado
  const hasMatchingTopicId = tIds.some((tId) => {
    const tIdNorm = normalizeText(String(tId));
    return (
      tIdNorm === topicIdNorm ||
      tIdNorm === topicSlugNorm ||
      tIdNorm === topicNameNorm ||
      topicNameNorm.includes(tIdNorm) ||
      tIdNorm.includes(topicSlugNorm)
    );
  });

  if (hasMatchingTopicId) return true;

  // 2. Fallback por categoria original se topicIds ainda não foi preenchido
  const catNorm = normalizeText(place.categoryId || '');
  if (topicIdNorm === 'praias' && catNorm === 'praias') return true;
  if (topicIdNorm === 'gastronomia' && (catNorm === 'restaurantes' || catNorm === 'cafes')) return true;
  if (topicIdNorm === 'bares-botecos' && catNorm === 'bares') return true;
  if (topicIdNorm === 'passeios' && (catNorm === 'passeios' || catNorm === 'pontos-turisticos' || catNorm === 'por-do-sol')) return true;
  if (topicIdNorm === 'hospedagem' && catNorm === 'hoteis') return true;
  if (topicIdNorm === 'compras' && catNorm === 'compras') return true;
  if (topicIdNorm === 'cultura' && catNorm === 'cultura') return true;
  if (topicIdNorm === 'vida-noturna' && catNorm === 'vida-noturna') return true;
  if (topicIdNorm === 'saude' && (catNorm === 'emergencias' || catNorm === 'saude')) return true;
  if (topicIdNorm === 'emergencias' && catNorm === 'emergencias') return true;
  if (topicIdNorm === 'servicos' && (catNorm === 'emergencias' || catNorm === 'servicos')) return true;

  return false;
}

export const PreviewGrid: React.FC<PreviewGridProps> = ({
  places,
  selectedCategory,
  isVipMode,
  favoriteIds = [],
  onToggleFavorite,
  onViewPlaceDetails,
  onOpenCheckout
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<string>('all');
  const [selectedPrice, setSelectedPrice] = useState<string>('all');
  const [sortByDistance, setSortByDistance] = useState(false);
  const [userLocation, setUserLocation] = useState<UserCoordinates | null>(null);
  const [isLocating, setIsLocating] = useState(false);

  // Bairros e Tópicos dinâmicos do CMS Admin
  const cmsNeighborhoods = useMemo(() => adminService.getNeighborhoods(), [places]);
  const cmsTopics = useMemo(() => adminService.getTopics(), [places]);

  // Lista única e organizada de bairros para o seletor do filtro
  const neighborhoodsList = useMemo(() => {
    const list: { id: string; name: string }[] = cmsNeighborhoods.map((n) => ({
      id: n.slug || n.id,
      name: n.name
    }));

    // Adiciona outros bairros de locais caso não existam no CMS
    places.forEach((p) => {
      if (
        p.neighborhood &&
        !list.some(
          (item) =>
            normalizeText(item.name) === normalizeText(p.neighborhood) ||
            normalizeText(item.id) === normalizeText(p.neighborhoodId || '')
        )
      ) {
        list.push({
          id: p.neighborhoodId || normalizeText(p.neighborhood),
          name: p.neighborhood
        });
      }
    });

    return list;
  }, [places, cmsNeighborhoods]);

  // Informações do bairro atualmente selecionado
  const currentNeighborhoodObj = useMemo(() => {
    if (selectedNeighborhood === 'all') return null;
    const selNorm = normalizeText(selectedNeighborhood);
    return (
      cmsNeighborhoods.find(
        (n) =>
          normalizeText(n.id) === selNorm ||
          normalizeText(n.slug) === selNorm ||
          normalizeText(n.name) === selNorm ||
          normalizeText(n.name).includes(selNorm) ||
          selNorm.includes(normalizeText(n.slug))
      ) || null
    );
  }, [selectedNeighborhood, cmsNeighborhoods]);

  const handleToggleDistanceSort = async () => {
    if (!sortByDistance) {
      if (!userLocation) {
        setIsLocating(true);
        try {
          const coords = await geolocationService.getCurrentPosition();
          setUserLocation(coords);
          setSortByDistance(true);
        } catch {
          // GPS indisponível
        } finally {
          setIsLocating(false);
        }
      } else {
        setSortByDistance(true);
      }
    } else {
      setSortByDistance(false);
    }
  };

  // Filtragem base dos locais
  const filteredPlaces = useMemo(() => {
    let list = places.filter((place) => {
      // Se um bairro estiver selecionado, a visualização exibe todos os tópicos do bairro
      const matchesCat =
        selectedNeighborhood !== 'all' ||
        selectedCategory === 'all' ||
        place.categoryId === selectedCategory;

      const matchesNeighborhood = isPlaceInNeighborhood(place, selectedNeighborhood, currentNeighborhoodObj);
      const matchesPrice = selectedPrice === 'all' || place.priceLevel === selectedPrice;
      const matchesSearch =
        searchQuery.trim() === '' ||
        place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        place.neighborhood.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (place.modalityName ? place.modalityName.toLowerCase().includes(searchQuery.toLowerCase()) : false) ||
        place.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (place.slogan ? place.slogan.toLowerCase().includes(searchQuery.toLowerCase()) : false);

      return matchesCat && matchesNeighborhood && matchesPrice && matchesSearch;
    });

    if (sortByDistance && userLocation) {
      list = [...list].sort((a, b) => {
        const distA = geolocationService.calculateDistanceKm(userLocation, a.coordinates);
        const distB = geolocationService.calculateDistanceKm(userLocation, b.coordinates);
        return distA - distB;
      });
    }

    return list;
  }, [places, selectedCategory, selectedNeighborhood, currentNeighborhoodObj, selectedPrice, searchQuery, sortByDistance, userLocation]);

  // Se um bairro específico foi selecionado, agrupamos os locais por Tópicos ativos
  const topicSections = useMemo(() => {
    if (selectedNeighborhood === 'all') return [];

    const sections: { topic: Topic; places: Place[] }[] = [];
    const usedPlaceIds = new Set<string>();

    // 1. Itera sobre os tópicos cadastrados no Admin
    cmsTopics.forEach((topic) => {
      const matchingPlaces = filteredPlaces.filter((p) => isPlaceInTopic(p, topic));

      // REGRA: Se o tópico não possuir locais naquele bairro, NÃO MOSTRA
      if (matchingPlaces.length > 0) {
        sections.push({
          topic,
          places: matchingPlaces
        });
        matchingPlaces.forEach((p) => usedPlaceIds.add(p.id));
      }
    });

    // 2. Locais que não foram vinculados a tópicos específicos aparecem em uma seção geral
    const remainingPlaces = filteredPlaces.filter((p) => !usedPlaceIds.has(p.id));
    if (remainingPlaces.length > 0) {
      sections.push({
        topic: {
          id: 'outros',
          name: 'Outras Experiências no Bairro',
          slug: 'outros',
          description: 'Mais opções selecionadas para você aproveitar',
          iconName: 'Compass',
          accentColor: '#00B4D8',
          position: 999
        },
        places: remainingPlaces
      });
    }

    return sections;
  }, [selectedNeighborhood, cmsTopics, filteredPlaces]);

  return (
    <section className="preview-grid-section" id="previa">
      <div className="container">
        {/* Barra Principal de Busca & Ferramentas (Design Original Preservado) */}
        <div className="preview-toolbar">
          <div className="search-box glass-panel">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder={
                isVipMode
                  ? 'Buscar praias, restaurantes, salões, clínicas, dicas...'
                  : 'Buscar por mar calmo, falésias, gastronomia regional, pôr do sol...'
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            {searchQuery && (
              <button className="clear-search-btn" onClick={() => setSearchQuery('')}>
                Limpar
              </button>
            )}
          </div>

          <div className="toolbar-controls-right">
            {/* Seletor de Bairro / Região */}
            <select
              value={selectedNeighborhood}
              onChange={(e) => setSelectedNeighborhood(e.target.value)}
              className="filter-select-input glass-panel"
            >
              <option value="all">📍 {isVipMode ? 'Todos os Bairros' : 'Todas as Regiões'}</option>
              {neighborhoodsList.map((n) => (
                <option key={n.id} value={n.id}>
                  {n.name}
                </option>
              ))}
            </select>

            {/* Seletor de Faixa de Preço */}
            <select
              value={selectedPrice}
              onChange={(e) => setSelectedPrice(e.target.value)}
              className="filter-select-input glass-panel"
            >
              <option value="all">💵 Todos os Preços</option>
              <option value="economico">Econômico ($)</option>
              <option value="moderado">Moderado ($$)</option>
              <option value="alto">Sofisticado ($$$)</option>
              <option value="luxo">Luxo ($$$$)</option>
            </select>

            {/* Ordenação por GPS (somente VIP) */}
            {isVipMode && (
              <button
                type="button"
                className={`distance-sort-btn glass-panel ${sortByDistance ? 'active' : ''}`}
                onClick={handleToggleDistanceSort}
                disabled={isLocating}
                title="Ordenar locais mais próximos da sua localização GPS"
              >
                <Crosshair size={15} />
                <span>{isLocating ? 'Calculando...' : 'Mais Próximos'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Chips de Busca Rápida por Intenção Turística (Mobile Ergonomics) */}
        <div className="tourist-quick-tags-scroll" aria-label="Filtros Rápidos por Intenção">
          {[
            { label: '🌊 Piscinas Naturais', query: 'piscina' },
            { label: '🌅 Pôr do Sol', query: 'por do sol' },
            { label: '🍤 Frutos do Mar', query: 'frutos do mar' },
            { label: '👨‍👩‍👧 Família & Crianças', query: 'calm' },
            { label: '✨ Dica dos Nativos', query: 'dica' },
            { label: '💎 Locais VIP', query: 'vip' }
          ].map((tag) => {
            const isActive = searchQuery.toLowerCase().includes(tag.query);
            return (
              <button
                key={tag.label}
                type="button"
                className={`quick-tag-chip ${isActive ? 'active' : ''}`}
                onClick={() => {
                  if (isActive) {
                    setSearchQuery('');
                  } else {
                    setSearchQuery(tag.query);
                  }
                }}
              >
                {tag.label}
              </button>
            );
          })}
        </div>

        {/* ======================================================== */}
        {/* CASO 1: BAIRRO ESPECÍFICO SELECIONADO -> ORGANIZADO POR TÓPICOS */}
        {/* ======================================================== */}
        {selectedNeighborhood !== 'all' ? (
          <div className="neighborhood-organized-view">
            {/* Cabeçalho do Bairro Selecionado */}
            <div className="neighborhood-header-banner glass-panel">
              <div className="neigh-banner-top">
                <span className="neigh-banner-tag">
                  <MapPin size={14} color="#00B4D8" />
                  <span>GUIA COMPLETO DO BAIRRO</span>
                </span>
                <button
                  className="neigh-back-all-btn"
                  onClick={() => setSelectedNeighborhood('all')}
                  type="button"
                >
                  Ver Todos os Bairros
                </button>
              </div>

              <h2 className="neigh-banner-title">
                {currentNeighborhoodObj ? currentNeighborhoodObj.name.toUpperCase() : selectedNeighborhood.toUpperCase()}
              </h2>

              {currentNeighborhoodObj?.description && (
                <p className="neigh-banner-desc">{currentNeighborhoodObj.description}</p>
              )}

              {/* DICAS SECRETAS & MELHORES PRÁTICAS DO BAIRRO (TEXTUAL) */}
              {currentNeighborhoodObj?.tips && currentNeighborhoodObj.tips.length > 0 && (
                <div className="neigh-tips-textual-card">
                  <div className="neigh-tips-textual-header">
                    <Sparkles size={16} color="#F4A261" />
                    <strong>Dicas Secretas & Melhores Práticas — {currentNeighborhoodObj.name}</strong>
                  </div>
                  <ul className="neigh-tips-textual-list">
                    {currentNeighborhoodObj.tips.map((tipText, idx) => (
                      <li key={idx}>
                        <span className="tip-bullet">💡</span>
                        <span>{tipText}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* SEÇÕES DINÂMICAS DOS TÓPICOS ATIVOS NO BAIRRO */}
            {topicSections.length > 0 ? (
              <div className="topics-sections-wrapper">
                {topicSections.map(({ topic, places: topicPlaces }) => (
                  <div key={topic.id} className="topic-section-block">
                    <div className="topic-section-header">
                      <div className="topic-section-title-wrap">
                        <div className="topic-icon-pill">
                          {(topic.iconName && topicIconMap[topic.iconName]) || <Compass size={18} color="#00B4D8" />}
                        </div>
                        <div>
                          <h3 className="topic-section-title">{topic.name}</h3>
                          {topic.description && (
                            <p className="topic-section-desc">{topic.description}</p>
                          )}
                        </div>
                      </div>
                      <span className="topic-places-count-tag">
                        {topicPlaces.length} {topicPlaces.length === 1 ? 'local' : 'locais'}
                      </span>
                    </div>

                    {/* Cards dos locais daquele tópico no design original */}
                    <div className="places-cards-grid">
                      {topicPlaces.map((place) => (
                        <PlacePreviewCard
                          key={place.id}
                          place={place}
                          isVipMode={isVipMode}
                          isFavorite={favoriteIds.includes(place.id)}
                          onToggleFavorite={onToggleFavorite}
                          onViewDetails={onViewPlaceDetails}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-results-state glass-panel">
                <Sparkles size={32} color="#00B4D8" />
                <h3 className="no-res-title">Nenhum local encontrado para os filtros selecionados</h3>
                <p className="no-res-desc">
                  Tente ajustar os filtros de busca ou faixa de preço.
                </p>
                <button
                  className="reset-filters-btn"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedPrice('all');
                  }}
                >
                  Limpar Filtros
                </button>
              </div>
            )}
          </div>
        ) : (
          /* ======================================================== */
          /* CASO 2: VISUALIZAÇÃO GERAL (TODOS OS BAIRROS / CATEGORIA) */
          /* ======================================================== */
          <>
            {filteredPlaces.length > 0 ? (
              <div className="places-cards-grid">
                {filteredPlaces.map((place) => (
                  <PlacePreviewCard
                    key={place.id}
                    place={place}
                    isVipMode={isVipMode}
                    isFavorite={favoriteIds.includes(place.id)}
                    onToggleFavorite={onToggleFavorite}
                    onViewDetails={onViewPlaceDetails}
                  />
                ))}
              </div>
            ) : (
              <div className="no-results-state glass-panel">
                <Sparkles size={32} color="#00B4D8" />
                <h3 className="no-res-title">Nenhuma experiência encontrada</h3>
                <p className="no-res-desc">
                  Tente ajustar sua busca ou selecionar outra categoria temática.
                </p>
                <button
                  className="reset-filters-btn"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedNeighborhood('all');
                    setSelectedPrice('all');
                  }}
                >
                  Restaurar Filtros
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <style>{`
        .preview-grid-section {
          padding: var(--space-2xl) 0 var(--space-4xl);
        }

        .view-mode-selector-wrap {
          display: flex;
          justify-content: center;
          margin-bottom: var(--space-xl);
        }

        .view-mode-pill-box {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.35rem;
          background: rgba(12, 20, 31, 0.9);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: var(--radius-full);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
        }

        .view-mode-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.6rem 1.25rem;
          border-radius: var(--radius-full);
          background: transparent;
          border: none;
          color: #94A3B8;
          font-family: var(--font-display);
          font-size: 0.875rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .view-mode-btn:hover {
          color: #F8FAFC;
        }

        .view-mode-btn.active {
          background: linear-gradient(135deg, rgba(0, 180, 216, 0.2), rgba(0, 168, 150, 0.2));
          border: 1px solid #00B4D8;
          color: #00B4D8;
          box-shadow: 0 0 15px rgba(0, 180, 216, 0.25);
        }

        .preview-toolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: var(--space-md);
          margin-bottom: var(--space-2xl);
          flex-wrap: wrap;
        }

        .search-box {
          flex: 1;
          min-width: 280px;
          display: flex;
          align-items: center;
          padding: 0.6rem 1rem;
          border-radius: var(--radius-full);
          border: 1px solid var(--border-subtle);
          background: rgba(12, 20, 31, 0.85);
          transition: border-color var(--transition-fast);
        }

        .search-box:focus-within {
          border-color: #00B4D8;
          box-shadow: 0 0 15px rgba(0, 180, 216, 0.2);
        }

        .search-icon {
          color: #94A3B8;
          margin-right: 0.6rem;
        }

        .search-input {
          width: 100%;
          background: transparent;
          border: none;
          outline: none;
          color: #F8FAFC;
          font-size: 0.875rem;
          font-family: var(--font-sans);
        }

        .search-input::placeholder {
          color: #64748B;
        }

        .clear-search-btn {
          background: none;
          border: none;
          color: #94A3B8;
          font-size: 0.75rem;
          cursor: pointer;
          padding: 0.2rem 0.4rem;
        }

        .toolbar-controls-right {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
          flex-wrap: wrap;
        }

        .filter-select-input {
          padding: 0.6rem 1rem;
          border-radius: var(--radius-full);
          border: 1px solid var(--border-subtle);
          background: rgba(12, 20, 31, 0.85);
          color: #E2E8F0;
          font-family: var(--font-display);
          font-size: 0.8125rem;
          font-weight: 600;
          cursor: pointer;
          outline: none;
          transition: border-color var(--transition-fast);
        }

        .filter-select-input:hover, .filter-select-input:focus {
          border-color: #00B4D8;
        }

        .filter-select-input option {
          background: #0C141F;
          color: #F8FAFC;
        }

        .distance-sort-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.6rem 1rem;
          border-radius: var(--radius-full);
          border: 1px solid var(--border-subtle);
          background: rgba(12, 20, 31, 0.85);
          color: #94A3B8;
          font-family: var(--font-display);
          font-size: 0.8125rem;
          font-weight: 700;
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .distance-sort-btn:hover {
          color: #F8FAFC;
          border-color: #00B4D8;
        }

        .distance-sort-btn.active {
          background: rgba(0, 180, 216, 0.15);
          border-color: #00B4D8;
          color: #38BDF8;
          box-shadow: 0 0 15px rgba(0, 180, 216, 0.25);
        }

        .places-cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: var(--space-xl);
        }

        .no-results-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: var(--space-4xl) var(--space-xl);
          border-radius: var(--radius-xl);
          background: rgba(12, 20, 31, 0.6);
          border: 1px dashed var(--border-subtle);
          gap: var(--space-md);
        }

        .no-res-title {
          font-family: var(--font-display);
          font-size: 1.25rem;
          font-weight: 800;
          color: #F8FAFC;
        }

        .no-res-desc {
          font-size: 0.875rem;
          color: #94A3B8;
          max-width: 400px;
        }

        .reset-filters-btn {
          padding: 0.5rem 1.25rem;
          background: #00B4D8;
          color: #060B11;
          border: none;
          border-radius: var(--radius-full);
          font-family: var(--font-display);
          font-size: 0.8125rem;
          font-weight: 700;
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .reset-filters-btn:hover {
          background: #38BDF8;
          transform: translateY(-2px);
        }

        /* ORGANIZAÇÃO POR BAIRROS & TÓPICOS */
        .neighborhood-organized-view {
          display: flex;
          flex-direction: column;
          gap: var(--space-3xl);
        }

        .neighborhood-header-banner {
          padding: var(--space-xl) var(--space-2xl);
          border-radius: var(--radius-xl);
          background: linear-gradient(135deg, rgba(12, 20, 31, 0.95), rgba(7, 12, 20, 0.98));
          border: 1px solid rgba(0, 180, 216, 0.25);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
          display: flex;
          flex-direction: column;
          gap: var(--space-md);
        }

        .neigh-banner-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: var(--space-sm);
        }

        .neigh-banner-tag {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.25rem 0.75rem;
          background: rgba(0, 180, 216, 0.12);
          border: 1px solid rgba(0, 180, 216, 0.3);
          border-radius: var(--radius-full);
          font-family: var(--font-display);
          font-size: 0.75rem;
          font-weight: 800;
          color: #00B4D8;
          letter-spacing: 0.05em;
        }

        .neigh-back-all-btn {
          background: none;
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: var(--radius-full);
          padding: 0.35rem 0.85rem;
          color: #94A3B8;
          font-size: 0.75rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .neigh-back-all-btn:hover {
          color: #F8FAFC;
          border-color: #00B4D8;
        }

        .neigh-banner-title {
          font-family: var(--font-display);
          font-size: 1.75rem;
          font-weight: 900;
          color: #F8FAFC;
          letter-spacing: -0.02em;
          margin: 0;
        }

        .neigh-banner-desc {
          font-size: 0.9375rem;
          color: #94A3B8;
          line-height: 1.5;
          margin: 0;
          max-width: 800px;
        }

        /* DICAS SECRETAS DO BAIRRO (TEXTUAL) */
        .neigh-tips-textual-card {
          margin-top: 0.5rem;
          padding: 1rem 1.25rem;
          background: rgba(244, 162, 97, 0.05);
          border: 1px solid rgba(244, 162, 97, 0.25);
          border-radius: var(--radius-lg);
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .neigh-tips-textual-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-family: var(--font-display);
          font-size: 0.9375rem;
          font-weight: 800;
          color: #F4A261;
        }

        .neigh-tips-textual-list {
          margin: 0;
          padding: 0;
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .neigh-tips-textual-list li {
          display: flex;
          align-items: flex-start;
          gap: 0.5rem;
          font-size: 0.85rem;
          color: #CBD5E1;
          line-height: 1.45;
        }

        .tip-bullet {
          flex-shrink: 0;
        }

        /* SEÇÕES DE TÓPICOS */
        .topics-sections-wrapper {
          display: flex;
          flex-direction: column;
          gap: var(--space-4xl);
        }

        .topic-section-block {
          display: flex;
          flex-direction: column;
          gap: var(--space-lg);
        }

        .topic-section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          flex-wrap: wrap;
          gap: var(--space-sm);
        }

        .topic-section-title-wrap {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .topic-icon-pill {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: rgba(0, 180, 216, 0.12);
          border: 1px solid rgba(0, 180, 216, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .topic-section-title {
          font-family: var(--font-display);
          font-size: 1.35rem;
          font-weight: 800;
          color: #F8FAFC;
          margin: 0;
        }

        .topic-section-desc {
          font-size: 0.8125rem;
          color: #94A3B8;
          margin: 0;
        }

        .topic-places-count-tag {
          font-size: 0.75rem;
          font-weight: 700;
          padding: 0.25rem 0.65rem;
          border-radius: var(--radius-full);
          background: rgba(255, 255, 255, 0.05);
          color: #94A3B8;
          border: 1px solid rgba(255, 255, 255, 0.08);
        }

        /* CHIPS DE BUSCA RÁPIDA (MOBILE ERGONOMICS) */
        .tourist-quick-tags-scroll {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          overflow-x: auto;
          padding: 0.25rem 0 0.75rem;
          margin-bottom: var(--space-lg);
          scrollbar-width: none;
          -webkit-overflow-scrolling: touch;
        }

        .tourist-quick-tags-scroll::-webkit-scrollbar {
          display: none;
        }

        .quick-tag-chip {
          padding: 0.45rem 0.9rem;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: var(--radius-full);
          color: #94A3B8;
          font-size: 0.8125rem;
          font-weight: 600;
          white-space: nowrap;
          cursor: pointer;
          transition: all 0.2s ease;
          flex-shrink: 0;
        }

        .quick-tag-chip:hover {
          background: rgba(0, 180, 216, 0.1);
          color: #38BDF8;
          border-color: rgba(0, 180, 216, 0.3);
        }

        .quick-tag-chip.active {
          background: linear-gradient(135deg, rgba(0, 180, 216, 0.25), rgba(244, 162, 97, 0.15));
          border-color: #00B4D8;
          color: #F8FAFC;
          font-weight: 700;
          box-shadow: 0 0 12px rgba(0, 180, 216, 0.3);
        }

        @media (max-width: 768px) {
          .places-cards-grid {
            grid-template-columns: 1fr;
          }
          .search-box {
            width: 100%;
          }
          .toolbar-controls-right {
            width: 100%;
            justify-content: space-between;
          }
          .filter-select-input {
            flex: 1;
          }
          .neighborhood-header-banner {
            padding: var(--space-lg);
          }
          .neigh-banner-title {
            font-size: 1.35rem;
          }
        }
      `}</style>
    </section>
  );
};
