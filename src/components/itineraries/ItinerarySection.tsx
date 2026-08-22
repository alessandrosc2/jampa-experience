import React, { useState } from 'react';
import { Compass, Sparkles, Calendar, Layers, CheckCircle2 } from 'lucide-react';
import { Itinerary, ItineraryDuration } from '../../types/itinerary';
import { MOCK_ITINERARIES } from '../../data/mockItineraries';
import { ItineraryCard } from './ItineraryCard';
import { ItineraryDetailModal } from './ItineraryDetailModal';
import { Badge } from '../common/Badge';

interface ItinerarySectionProps {
  isVipMode: boolean;
  onOpenCheckout: () => void;
}

export const ItinerarySection: React.FC<ItinerarySectionProps> = ({
  isVipMode,
  onOpenCheckout
}) => {
  const [filterDuration, setFilterDuration] = useState<ItineraryDuration | 'all'>('all');
  const [selectedItinerary, setSelectedItinerary] = useState<Itinerary | null>(null);

  const filtered = MOCK_ITINERARIES.filter((itin) => {
    if (filterDuration === 'all') return true;
    return itin.durationCategory === filterDuration;
  });

  return (
    <section className="itineraries-section" id="roteiros">
      <div className="container">
        {/* Cabeçalho da Seção */}
        <div className="section-header text-center">
          <Badge variant="gold" icon={<Compass size={14} />}>
            Roteiros Prontos & Otimizados
          </Badge>
          <h2 className="section-title">
            Não Perca Tempo Planejando. <br />
            <span className="text-gradient-cyan">Siga Roteiros Criados por Nativos.</span>
          </h2>
          <p className="section-subtitle">
            Cronogramas inteligentes de 1, 3 e 5 dias, além de roteiros temáticos (econômico, casal, família, praias e gastronomia) com tábua de marés e horários estratégicos sem fila.
          </p>
        </div>

        {/* Barra de Filtros de Duração */}
        <div className="itin-filter-bar">
          <button
            className={`itin-tab-pill ${filterDuration === 'all' ? 'active' : ''}`}
            onClick={() => setFilterDuration('all')}
          >
            Todos os 8 Roteiros
          </button>
          <button
            className={`itin-tab-pill ${filterDuration === '1-dia' ? 'active' : ''}`}
            onClick={() => setFilterDuration('1-dia')}
          >
            ⚡ 1 Dia (Express)
          </button>
          <button
            className={`itin-tab-pill ${filterDuration === '3-dias' ? 'active' : ''}`}
            onClick={() => setFilterDuration('3-dias')}
          >
            🌟 3 Dias (Clássico)
          </button>
          <button
            className={`itin-tab-pill ${filterDuration === '5-dias' ? 'active' : ''}`}
            onClick={() => setFilterDuration('5-dias')}
          >
            🏝️ 5 Dias (Completo)
          </button>
          <button
            className={`itin-tab-pill ${filterDuration === 'tematico' ? 'active' : ''}`}
            onClick={() => setFilterDuration('tematico')}
          >
            🎯 Temáticos (Casal, Família, Praias...)
          </button>
        </div>

        {/* Grid de Roteiros */}
        <div className="itineraries-grid">
          {filtered.map((itin) => (
            <ItineraryCard
              key={itin.id}
              itinerary={itin}
              isVipMode={isVipMode}
              onSelect={(item) => setSelectedItinerary(item)}
            />
          ))}
        </div>
      </div>

      {/* Modal de Detalhes do Roteiro */}
      <ItineraryDetailModal
        itinerary={selectedItinerary}
        isOpen={!!selectedItinerary}
        isVipMode={isVipMode}
        onClose={() => setSelectedItinerary(null)}
        onUnlockClick={() => {
          setSelectedItinerary(null);
          onOpenCheckout();
        }}
      />

      <style>{`
        .itineraries-section {
          padding: var(--space-4xl) 0;
          background: linear-gradient(180deg, rgba(6, 11, 17, 0.4) 0%, rgba(10, 17, 26, 0.9) 50%, rgba(6, 11, 17, 0.4) 100%);
          position: relative;
        }

        .itin-filter-bar {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          margin-bottom: var(--space-2xl);
          flex-wrap: wrap;
        }

        .itin-tab-pill {
          padding: 0.55rem 1.15rem;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-full);
          font-family: var(--font-display);
          font-size: 0.875rem;
          font-weight: 700;
          color: #94A3B8;
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .itin-tab-pill:hover {
          background: rgba(255, 255, 255, 0.08);
          color: #F8FAFC;
        }

        .itin-tab-pill.active {
          background: rgba(244, 162, 97, 0.2);
          border-color: #F4A261;
          color: #F4A261;
          box-shadow: 0 0 15px rgba(244, 162, 97, 0.2);
        }

        .itineraries-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: var(--space-xl);
        }
      `}</style>
    </section>
  );
};
