import React from 'react';
import {
  Umbrella,
  UtensilsCrossed,
  GlassWater,
  Coffee,
  Hotel,
  Compass,
  Camera,
  Sunset,
  ShoppingBag,
  Landmark,
  Moon,
  Lightbulb,
  Sparkles,
  LayoutGrid,
  Trees,
  Car,
  Palmtree,
  Ship,
  Sparkle,
  HeartPulse,
  ShieldAlert,
  PhoneCall,
  Phone,
  Stethoscope,
  Key,
  Wrench,
  AlertCircle,
  Scissors,
  Activity,
  Shield,
  Flame,
  Crosshair,
  Waves
} from 'lucide-react';
import { CategoryId, CategoryInfo } from '../../types/place';
import { CATEGORIES as DEFAULT_CATEGORIES } from '../../data/categories';
import { analyticsService } from '../../services/analyticsService';

interface CategoryNavProps {
  categories?: CategoryInfo[];
  selectedCategory: CategoryId | 'all';
  onSelectCategory: (id: CategoryId | 'all') => void;
  onOpenTides?: () => void;
}

const iconMap: Record<string, React.ReactNode> = {
  Umbrella: <Umbrella size={18} />,
  UtensilsCrossed: <UtensilsCrossed size={18} />,
  GlassWater: <GlassWater size={18} />,
  Coffee: <Coffee size={18} />,
  Hotel: <Hotel size={18} />,
  Compass: <Compass size={18} />,
  Camera: <Camera size={18} />,
  Sunset: <Sunset size={18} />,
  ShoppingBag: <ShoppingBag size={18} />,
  Landmark: <Landmark size={18} />,
  Moon: <Moon size={18} />,
  Lightbulb: <Lightbulb size={18} />,
  Trees: <Trees size={18} />,
  Car: <Car size={18} />,
  Palmtree: <Palmtree size={18} />,
  Ship: <Ship size={18} />,
  Sparkles: <Sparkles size={18} />,
  HeartPulse: <HeartPulse size={18} />,
  ShieldAlert: <ShieldAlert size={18} />,
  PhoneCall: <PhoneCall size={18} />,
  Phone: <Phone size={18} />,
  Stethoscope: <Stethoscope size={18} />,
  Key: <Key size={18} />,
  Wrench: <Wrench size={18} />,
  AlertCircle: <AlertCircle size={18} />,
  Scissors: <Scissors size={18} />,
  Activity: <Activity size={18} />,
  Shield: <Shield size={18} />,
  Flame: <Flame size={18} />,
  Crosshair: <Crosshair size={18} />,
  Waves: <Waves size={18} />
};

export const CategoryNav: React.FC<CategoryNavProps> = ({
  categories = DEFAULT_CATEGORIES,
  selectedCategory,
  onSelectCategory,
  onOpenTides
}) => {
  return (
    <div className="category-nav-wrapper" id="categorias">
      <div className="container">
        <div className="category-header-wrap">
          <div className="section-title-tag">
            <Sparkles size={14} color="#00B4D8" />
            <span>CATEGORIAS TEMÁTICAS</span>
          </div>
          <h2 className="section-main-heading">
            O que você quer viver em <span className="text-cyan">João Pessoa?</span>
          </h2>
          <p className="section-subtext">
            Conteúdo cuidadosamente selecionado para você aproveitar o melhor de João Pessoa com tranquilidade e praticidade.
          </p>

          {/* Botão de Destaque da Tábua de Marés */}
          {onOpenTides && (
            <button
              type="button"
              className="tide-header-shortcut-btn"
              onClick={onOpenTides}
              title="Abrir Tábua de Marés de João Pessoa (7 Dias)"
            >
              <Waves size={15} color="#00B4D8" />
              <span>🌊 Consultar Tábua de Marés Oficial (7 Dias)</span>
              <span className="tide-shortcut-badge">Ao Vivo</span>
            </button>
          )}
        </div>

        {/* Scrollable Categories List */}
        <div className="category-scroll-container">
          <button
            className={`category-pill ${selectedCategory === 'all' ? 'active' : ''}`}
            onClick={() => {
              analyticsService.trackSelectCategory('all', 'Todas as Experiências');
              onSelectCategory('all');
            }}
          >
            <div className="cat-icon-box">
              <LayoutGrid size={18} />
            </div>
            <span className="cat-label">Todas as Experiências</span>
          </button>

          {/* Botão Direto na Grade de Categorias */}
          {onOpenTides && (
            <button
              type="button"
              className="category-pill tide-pill"
              onClick={() => {
                analyticsService.trackTideView();
                onOpenTides();
              }}
              style={{ '--cat-accent': '#00B4D8' } as React.CSSProperties}
            >
              <div className="cat-icon-box">
                <Waves size={18} color="#00B4D8" />
              </div>
              <span className="cat-label">🌊 Tábua de Marés</span>
            </button>
          )}

          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                className={`category-pill ${isSelected ? 'active' : ''}`}
                onClick={() => {
                  analyticsService.trackSelectCategory(cat.id, cat.label);
                  onSelectCategory(cat.id);
                }}
                style={{
                  '--cat-accent': cat.accentColor
                } as React.CSSProperties}
              >
                <div className="cat-icon-box">
                  {iconMap[cat.iconName] || <Compass size={18} />}
                </div>
                <span className="cat-label">{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <style>{`
        .category-nav-wrapper {
          padding: var(--space-3xl) 0 var(--space-xl);
          background: linear-gradient(180deg, transparent 0%, rgba(12, 20, 31, 0.4) 100%);
        }

        .category-header-wrap {
          text-align: center;
          max-width: 650px;
          margin: 0 auto var(--space-xl);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--space-xs);
        }

        .section-title-tag {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          color: #00B4D8;
          text-transform: uppercase;
        }

        .section-main-heading {
          font-family: var(--font-display);
          font-size: clamp(1.75rem, 3.5vw, 2.5rem);
          font-weight: 800;
          color: #F8FAFC;
          line-height: 1.2;
        }

        .section-subtext {
          font-size: 0.95rem;
          color: #94A3B8;
          line-height: 1.5;
        }

        .tide-header-shortcut-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.45rem 1.15rem;
          margin-top: 0.5rem;
          background: rgba(0, 180, 216, 0.08);
          border: 1px solid rgba(0, 180, 216, 0.3);
          border-radius: var(--radius-full);
          color: #E2E8F0;
          font-size: 0.85rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .tide-header-shortcut-btn:hover {
          background: rgba(0, 180, 216, 0.2);
          border-color: #00B4D8;
          color: #F8FAFC;
          box-shadow: 0 0 16px rgba(0, 180, 216, 0.3);
          transform: translateY(-1px);
        }

        .tide-shortcut-badge {
          font-size: 0.675rem;
          font-weight: 800;
          padding: 0.1rem 0.45rem;
          background: rgba(16, 185, 129, 0.2);
          border: 1px solid rgba(16, 185, 129, 0.4);
          color: #34D399;
          border-radius: var(--radius-full);
          text-transform: uppercase;
        }

        .category-pill.tide-pill {
          background: rgba(0, 180, 216, 0.12);
          border-color: rgba(0, 180, 216, 0.4);
          color: #00B4D8;
        }

        .category-pill.tide-pill:hover {
          background: rgba(0, 180, 216, 0.25);
          border-color: #00B4D8;
          box-shadow: 0 0 16px rgba(0, 180, 216, 0.35);
        }

        .category-scroll-container {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
          overflow-x: auto;
          padding: var(--space-xs) var(--space-xs) var(--space-md);
          scrollbar-width: thin;
          scrollbar-color: rgba(0, 180, 216, 0.3) transparent;
        }

        .category-scroll-container::-webkit-scrollbar {
          height: 4px;
        }

        .category-scroll-container::-webkit-scrollbar-thumb {
          background: rgba(0, 180, 216, 0.3);
          border-radius: 4px;
        }

        .category-pill {
          display: flex;
          align-items: center;
          gap: 0.55rem;
          padding: 0.5rem 1.15rem 0.5rem 0.6rem;
          background: rgba(12, 20, 31, 0.85);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-full);
          color: #CBD5E1;
          font-family: var(--font-display);
          font-size: 0.875rem;
          font-weight: 600;
          white-space: nowrap;
          cursor: pointer;
          transition: all var(--transition-fast);
          flex-shrink: 0;
        }

        .cat-icon-box {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.05);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #94A3B8;
          transition: all var(--transition-fast);
        }

        .category-pill:hover {
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(255, 255, 255, 0.2);
          color: #F8FAFC;
          transform: translateY(-2px);
        }

        .category-pill:hover .cat-icon-box {
          background: rgba(0, 180, 216, 0.2);
          color: #00B4D8;
        }

        .category-pill.active {
          background: rgba(0, 180, 216, 0.15);
          border-color: #00B4D8;
          color: #F8FAFC;
          box-shadow: 0 0 15px rgba(0, 180, 216, 0.25);
        }

        .category-pill.active .cat-icon-box {
          background: #00B4D8;
          color: #060B11;
        }
      `}</style>
    </div>
  );
};
