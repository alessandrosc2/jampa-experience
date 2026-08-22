import React, { useEffect, useRef, useState } from 'react';
import {
  MapPin,
  Navigation,
  Sparkles,
  Layers,
  Compass,
  Star,
  Crosshair,
  Eye,
  CheckCircle2,
  Lock,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Place, CategoryId } from '../../types/place';
import { CATEGORIES } from '../../data/categories';
import { geolocationService, UserCoordinates } from '../../services/geolocationService';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';

interface InteractiveMapSectionProps {
  places: Place[];
  isVipMode: boolean;
  onSelectPlace: (place: Place) => void;
  onOpenCheckout?: () => void;
}

// Ícones SVG temáticos para marcadores dinâmicos
const CATEGORY_SVGS: Record<string, string> = {
  praias: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20"/><path d="M17.5 7.5A6.5 6.5 0 0 0 12 4.1 6.5 6.5 0 0 0 6.5 7.5"/><path d="M22 13a10 10 0 0 0-20 0Z"/><path d="M14 18.5a2.5 2.5 0 0 1-5 0"/></svg>`,
  restaurantes: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m16 2-2.3 2.3a3 3 0 0 0 0 4.2l1.8 1.8a3 3 0 0 0 4.2 0L22 8Z"/><path d="M15 15 3.3 3.3a4.2 4.2 0 0 0 0 6l7.3 7.3c.7.7 2 .7 2.8 0L15 15Zm0 0 7 7"/><path d="m2.1 21.8 6.4-6.3"/><path d="m19 5-7 7"/></svg>`,
  bares: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8 22h8"/><path d="M12 15v7"/><path d="M5 3h14l-2 9a5 5 0 0 1-5 4 5 5 0 0 1-5-4Z"/></svg>`,
  cafes: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10 2v2"/><path d="M14 2v2"/><path d="M6 2v2"/><path d="M18 8a3 3 0 0 1 0 6h-1"/><path d="M3 8h14v7a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/><path d="M6 20h10"/></svg>`,
  hoteis: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2 4v16"/><path d="M2 8h18a2 2 0 0 1 2 2v10"/><path d="M2 17h20"/><path d="M6 8v9"/></svg>`,
  passeios: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>`,
  'pontos-turisticos': `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>`,
  'por-do-sol': `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 10V2"/><path d="m4.93 10.93 1.41 1.41"/><path d="M2 18h2"/><path d="M20 18h2"/><path d="m19.07 10.93-1.41 1.41"/><path d="M22 22H2"/><path d="m8 6 4-4 4 4"/><path d="M16 18a4 4 0 0 0-8 0"/></svg>`,
  cultura: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="3" x2="21" y1="22" y2="22"/><line x1="6" x2="6" y1="18" y2="11"/><line x1="10" x2="10" y1="18" y2="11"/><line x1="14" x2="14" y1="18" y2="11"/><line x1="18" x2="18" y1="18" y2="11"/><polygon points="12 2 20 7 4 7"/></svg>`,
  'vida-noturna': `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>`,
  compras: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>`,
  dicas: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>`
};

export const InteractiveMapSection: React.FC<InteractiveMapSectionProps> = ({
  places,
  isVipMode,
  onSelectPlace,
  onOpenCheckout
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersGroupRef = useRef<L.LayerGroup | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);

  const [selectedMapCategory, setSelectedMapCategory] = useState<CategoryId | 'all'>('all');
  const [userLocation, setUserLocation] = useState<UserCoordinates | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [gpsStatusMessage, setGpsStatusMessage] = useState<string | null>(null);

  // Inicialização do Mapa Leaflet (Somente se for VIP)
  useEffect(() => {
    if (!isVipMode) {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
      return;
    }

    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Coordenadas centrais de João Pessoa (Tambaú / Cabo Branco)
    const map = L.map(mapContainerRef.current, {
      center: [-7.125, -34.835],
      zoom: 12,
      zoomControl: true,
      attributionControl: true
    });

    // Camada de Mapa OpenStreetMap (Dark Carto Voyager / CARTO Dark Matter)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 19
    }).addTo(map);

    const markersGroup = L.layerGroup().addTo(map);
    markersGroupRef.current = markersGroup;
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [isVipMode]);

  // Atualização dos Marcadores Dinâmicos quando for VIP
  useEffect(() => {
    if (!isVipMode || !mapInstanceRef.current || !markersGroupRef.current) return;

    markersGroupRef.current.clearLayers();

    const filteredPlaces = places.filter((p) => {
      if (selectedMapCategory === 'all') return true;
      return p.categoryId === selectedMapCategory;
    });

    filteredPlaces.forEach((place, index) => {
      const cat = CATEGORIES.find((c) => c.id === place.categoryId);
      const markerColor = cat ? cat.accentColor : '#00B4D8';
      const iconSvg = CATEGORY_SVGS[place.categoryId] || CATEGORY_SVGS.praias;
      const isFeatured = !!place.isFeatured;
      const animDelay = (index % 5) * 0.4;

      // Marcador dinâmico flutuante com ondas pulsantes e ícone da categoria
      const customIcon = L.divIcon({
        className: 'dynamic-leaflet-marker-wrapper',
        html: `
          <div class="dynamic-map-pin ${isFeatured ? 'is-featured-pin' : ''}" style="--pin-color: ${markerColor}; --anim-delay: ${animDelay}s;">
            <div class="pin-radar-wave"></div>
            <div class="pin-radar-wave wave-delayed"></div>
            <div class="pin-body">
              <span class="pin-icon-wrap">${iconSvg}</span>
            </div>
            <div class="pin-pointer"></div>
            <div class="pin-glow-halo"></div>
          </div>
        `,
        iconSize: [36, 46],
        iconAnchor: [18, 44],
        popupAnchor: [0, -44]
      });

      const marker = L.marker([place.coordinates.lat, place.coordinates.lng], {
        icon: customIcon
      });

      // Popup informativo elegante com foto e botão interativo
      const popupHtml = `
        <div class="leaflet-popup-card">
          <img src="${place.featuredImage}" alt="${place.name}" class="popup-thumb" />
          <div class="popup-info">
            <span class="popup-cat" style="color: ${markerColor}">${place.categoryLabel}</span>
            <h4 class="popup-title">${place.name}</h4>
            <p class="popup-loc">${place.neighborhood}</p>
            <div class="popup-rating">⭐ ${place.rating.toFixed(1)} (${place.reviewCount} avaliações)</div>
            <button class="popup-btn" id="btn-popup-${place.id}">Ver Detalhes do Guia</button>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml, {
        maxWidth: 260,
        className: 'jampa-map-popup'
      });

      marker.on('popupopen', () => {
        const btn = document.getElementById(`btn-popup-${place.id}`);
        if (btn) {
          btn.onclick = () => {
            onSelectPlace(place);
          };
        }
      });

      markersGroupRef.current?.addLayer(marker);
    });
  }, [places, selectedMapCategory, isVipMode, onSelectPlace]);

  // Geolocalização do Usuário com Radar Dinâmico Ativo
  const handleLocateUser = async () => {
    setIsLocating(true);
    setGpsStatusMessage('Detectando sua localização GPS...');

    try {
      const coords = await geolocationService.getCurrentPosition();
      setUserLocation(coords);
      setGpsStatusMessage('Localização detectada com sucesso!');

      if (mapInstanceRef.current) {
        mapInstanceRef.current.flyTo([coords.lat, coords.lng], 14, {
          duration: 1.5
        });

        if (userMarkerRef.current) {
          userMarkerRef.current.setLatLng([coords.lat, coords.lng]);
        } else {
          // Marcador de GPS com radar pulsante de alta visibilidade
          const userIcon = L.divIcon({
            className: 'user-dynamic-gps-wrapper',
            html: `
              <div class="user-dynamic-radar">
                <div class="radar-scan-wave"></div>
                <div class="radar-scan-wave-outer"></div>
                <div class="radar-center-core">
                  <div class="radar-dot"></div>
                </div>
              </div>
            `,
            iconSize: [40, 40],
            iconAnchor: [20, 20]
          });

          const uMarker = L.marker([coords.lat, coords.lng], {
            icon: userIcon
          }).addTo(mapInstanceRef.current);

          uMarker.bindPopup('<strong>Você está aqui!</strong><br>Calculando distâncias para os locais.');
          userMarkerRef.current = uMarker;
        }
      }
    } catch {
      setGpsStatusMessage('Não foi possível obter a localização.');
    }

    setIsLocating(false);
    setTimeout(() => setGpsStatusMessage(null), 4000);
  };

  return (
    <section className="map-section-wrapper" id="mapa">
      <div className="container">
        {/* Cabeçalho da Seção */}
        <div className="section-header text-center">
          <Badge variant="cyan" icon={<MapPin size={14} />}>
            Mapeamento Turístico Dinâmico
          </Badge>
          <h2 className="section-title">
            Explore João Pessoa no <br />
            <span className="text-gradient-cyan">Mapa Turístico Interativo</span>
          </h2>
          <p className="section-subtitle">
            Localização exata de cada praia, restaurante premiado, falésia e monumento histórico com marcadores dinâmicos, cálculo de distância em tempo real e rotas diretas no GPS.
          </p>
        </div>

        {/* ======================================================== */}
        {/* MODO VISITANTE: MAPA BLOQUEADO COM PREVIEW ELEGANTE */}
        {/* ======================================================== */}
        {!isVipMode ? (
          <div className="map-locked-preview-container glass-panel">
            {/* Fundo ilustrativo estilizado do mapa de João Pessoa */}
            <div className="map-mock-bg">
              <div className="map-zone-pill zone-norte">
                <Compass size={14} color="#00B4D8" />
                <span>Litoral Norte & Cabedelo</span>
              </div>
              <div className="map-zone-pill zone-centro">
                <Compass size={14} color="#F59E0B" />
                <span>Centro Histórico & Rio</span>
              </div>
              <div className="map-zone-pill zone-orla">
                <Compass size={14} color="#00B4D8" />
                <span>Orla de Tambaú & Cabo Branco</span>
              </div>
              <div className="map-zone-pill zone-leste">
                <Compass size={14} color="#38BDF8" />
                <span>Ponta do Seixas (Extremo Oriental)</span>
              </div>
              <div className="map-zone-pill zone-sul">
                <Compass size={14} color="#2EC4B6" />
                <span>Costa do Conde & Falésias do Sul</span>
              </div>
            </div>

            {/* Card Central de Bloqueio & Desbloqueio */}
            <div className="map-lock-glass-card">
              <div className="map-lock-icon-box">
                <Lock size={32} color="#F4A261" />
              </div>

              <Badge variant="gold" size="sm">
                MAPA INTERATIVO EXCLUSIVO
              </Badge>

              <h3 className="map-lock-title">
                Dezenas de Praias, Restaurantes e Pontos Turísticos Mapeados
              </h3>

              <p className="map-lock-desc">
                Disponível instantaneamente após desbloquear o <strong>JAMPA EXPERIENCE</strong>. Acesse coordenadas precisas, filtros por categoria e rotas automáticas no Google Maps e Waze.
              </p>

              <div className="map-features-mini-row">
                <span>📍 Rotas no GPS</span>
                <span>🧭 Cálculo de Distância</span>
                <span>🏖️ Tábua de Marés</span>
                <span>⭐ Avaliações Reais</span>
              </div>

              <Button
                variant="gold"
                size="lg"
                iconLeft={<Sparkles size={18} />}
                iconRight={<ArrowRight size={18} />}
                onClick={onOpenCheckout}
                className="map-unlock-cta-btn"
              >
                DESBLOQUEAR MAPA COMPLETO (R$ 39,90)
              </Button>
            </div>
          </div>
        ) : (
          /* ======================================================== */
          /* MODO VIP: MAPA LEAFLET INTERATIVO COMPLETO E DINÂMICO */
          /* ======================================================== */
          <div className="map-interactive-container glass-panel">
            {/* Barra de Controles Superior do Mapa */}
            <div className="map-top-controls">
              {/* Filtro de Categorias no Mapa */}
              <div className="map-cat-filter-scroll">
                <button
                  className={`map-pill ${selectedMapCategory === 'all' ? 'active' : ''}`}
                  onClick={() => setSelectedMapCategory('all')}
                >
                  Todos os Locais
                </button>
                {CATEGORIES.slice(0, 7).map((cat) => (
                  <button
                    key={cat.id}
                    className={`map-pill ${selectedMapCategory === cat.id ? 'active' : ''}`}
                    onClick={() => setSelectedMapCategory(cat.id)}
                    style={{
                      '--cat-col': cat.accentColor
                    } as React.CSSProperties}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Botão de Geolocalização */}
              <button
                className={`gps-locate-btn ${isLocating ? 'locating' : ''}`}
                onClick={handleLocateUser}
                disabled={isLocating}
                title="Detectar minha localização atual no GPS"
              >
                <Crosshair size={16} />
                <span>{isLocating ? 'Detectando GPS...' : 'Minha Localização'}</span>
              </button>
            </div>

            {/* Notificação de Status do GPS */}
            {gpsStatusMessage && (
              <div className="gps-status-banner">
                <Sparkles size={14} color="#00B4D8" />
                <span>{gpsStatusMessage}</span>
              </div>
            )}

            {/* Container Leaflet */}
            <div className="map-leaflet-wrapper" ref={mapContainerRef} />

            {/* Legenda do Mapa */}
            <div className="map-footer-legend">
              <div className="legend-item">
                <span className="legend-dot" style={{ backgroundColor: '#00B4D8' }} />
                <span>Praias & Náutica</span>
              </div>
              <div className="legend-item">
                <span className="legend-dot" style={{ backgroundColor: '#F4A261' }} />
                <span>Restaurantes & Gastronomia</span>
              </div>
              <div className="legend-item">
                <span className="legend-dot" style={{ backgroundColor: '#F59E0B' }} />
                <span>Cultura & História</span>
              </div>
              <div className="legend-item">
                <span className="legend-dot" style={{ backgroundColor: '#FB923C' }} />
                <span>Pôr do Sol</span>
              </div>
              <div className="legend-item">
                <span className="legend-dot" style={{ backgroundColor: '#2EC4B6' }} />
                <span>Hotéis & Pousadas</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .map-section-wrapper {
          padding: var(--space-4xl) 0;
          background: linear-gradient(180deg, transparent 0%, rgba(12, 20, 31, 0.6) 100%);
        }

        /* MAPA BLOQUEADO (VISITANTE) */
        .map-locked-preview-container {
          position: relative;
          width: 100%;
          min-height: 480px;
          border-radius: var(--radius-xl);
          overflow: hidden;
          background: #060B11;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: var(--space-xl);
          border: 1px solid rgba(244, 162, 97, 0.3);
        }

        .map-mock-bg {
          position: absolute;
          inset: 0;
          opacity: 0.35;
          background: 
            radial-gradient(circle at 70% 30%, rgba(0, 180, 216, 0.15) 0%, transparent 60%),
            radial-gradient(circle at 30% 70%, rgba(244, 162, 97, 0.12) 0%, transparent 60%),
            linear-gradient(135deg, #04080D 0%, #0A141F 100%);
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          padding: var(--space-xl);
          pointer-events: none;
        }

        .map-zone-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.35rem 0.8rem;
          background: rgba(12, 20, 31, 0.85);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-full);
          font-size: 0.75rem;
          color: #94A3B8;
          font-weight: 600;
          width: fit-content;
        }

        .zone-norte { align-self: flex-start; margin-left: 10%; }
        .zone-centro { align-self: flex-start; margin-left: 25%; }
        .zone-orla { align-self: center; }
        .zone-leste { align-self: flex-end; margin-right: 15%; }
        .zone-sul { align-self: flex-end; margin-right: 25%; }

        .map-lock-glass-card {
          position: relative;
          z-index: 2;
          max-width: 580px;
          text-align: center;
          padding: var(--space-2xl) var(--space-xl);
          background: rgba(8, 14, 22, 0.92);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(244, 162, 97, 0.4);
          border-radius: var(--radius-xl);
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.7), 0 0 35px rgba(244, 162, 97, 0.15);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--space-sm);
        }

        .map-lock-icon-box {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: rgba(244, 162, 97, 0.15);
          border: 1px solid rgba(244, 162, 97, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: var(--space-xs);
        }

        .map-lock-title {
          font-family: var(--font-display);
          font-size: 1.35rem;
          font-weight: 800;
          color: #F8FAFC;
          line-height: 1.25;
        }

        .map-lock-desc {
          font-size: 0.875rem;
          color: #CBD5E1;
          line-height: 1.5;
        }

        .map-features-mini-row {
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
          justify-content: center;
          font-size: 0.75rem;
          color: #00B4D8;
          font-weight: 600;
          padding: var(--space-xs) 0;
        }

        .map-unlock-cta-btn {
          margin-top: var(--space-xs);
          box-shadow: 0 0 25px rgba(244, 162, 97, 0.35);
        }

        /* MAPA INTERATIVO VIP */
        .map-interactive-container {
          border-radius: var(--radius-xl);
          overflow: hidden;
          background: rgba(12, 20, 31, 0.85);
          border: 1px solid var(--border-subtle);
          display: flex;
          flex-direction: column;
        }

        .map-top-controls {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--space-md);
          background: rgba(6, 11, 17, 0.95);
          border-bottom: 1px solid var(--border-subtle);
          gap: var(--space-md);
          flex-wrap: wrap;
        }

        .map-cat-filter-scroll {
          display: flex;
          gap: 0.4rem;
          overflow-x: auto;
          padding-bottom: 2px;
        }

        .map-pill {
          padding: 0.4rem 0.85rem;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-full);
          font-family: var(--font-display);
          font-size: 0.75rem;
          font-weight: 700;
          color: #94A3B8;
          cursor: pointer;
          transition: all var(--transition-fast);
          white-space: nowrap;
        }

        .map-pill:hover, .map-pill.active {
          background: rgba(0, 180, 216, 0.15);
          border-color: #00B4D8;
          color: #F8FAFC;
        }

        .gps-locate-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.45rem 0.9rem;
          background: rgba(0, 180, 216, 0.15);
          border: 1px solid #00B4D8;
          border-radius: var(--radius-full);
          color: #38BDF8;
          font-family: var(--font-display);
          font-size: 0.75rem;
          font-weight: 700;
          cursor: pointer;
          transition: all var(--transition-fast);
          flex-shrink: 0;
        }

        .gps-locate-btn:hover {
          background: #00B4D8;
          color: #060B11;
        }

        .gps-locate-btn.locating {
          opacity: 0.7;
          animation: pulse 1s infinite;
        }

        .gps-status-banner {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.4rem var(--space-md);
          background: rgba(0, 180, 216, 0.1);
          border-bottom: 1px solid rgba(0, 180, 216, 0.2);
          font-size: 0.75rem;
          color: #38BDF8;
        }

        .map-leaflet-wrapper {
          width: 100%;
          height: 520px;
          background: #060B11;
          z-index: 1;
        }

        .map-footer-legend {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--space-lg);
          padding: var(--space-sm) var(--space-md);
          background: rgba(6, 11, 17, 0.95);
          border-top: 1px solid var(--border-subtle);
          font-size: 0.75rem;
          color: #94A3B8;
          flex-wrap: wrap;
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 0.35rem;
        }

        .legend-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
        }

        /* ======================================================== */
        /* MARCADORES DINÂMICOS LEAFLET VIBRANTES E ANIMADOS */
        /* ======================================================== */
        .dynamic-leaflet-marker-wrapper {
          background: transparent !important;
          border: none !important;
        }

        .dynamic-map-pin {
          position: relative;
          width: 36px;
          height: 46px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-start;
          cursor: pointer;
          animation: pinFloat 3.4s ease-in-out infinite;
          animation-delay: var(--anim-delay, 0s);
          transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .dynamic-map-pin:hover {
          transform: translateY(-6px) scale(1.18);
          z-index: 999;
        }

        @keyframes pinFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }

        .pin-body {
          position: relative;
          z-index: 3;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--pin-color) 0%, #060B11 150%);
          border: 2px solid #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #FFFFFF;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.5), 0 0 16px var(--pin-color);
          transition: all 0.2s ease;
        }

        .dynamic-map-pin:hover .pin-body {
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.7), 0 0 25px var(--pin-color);
          border-color: #F8FAFC;
        }

        .pin-icon-wrap {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .pin-pointer {
          position: relative;
          z-index: 2;
          width: 0;
          height: 0;
          border-left: 6px solid transparent;
          border-right: 6px solid transparent;
          border-top: 8px solid var(--pin-color);
          margin-top: -2px;
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.5));
        }

        /* ONDAS DE RADAR DINÂMICAS PULSANTES */
        .pin-radar-wave {
          position: absolute;
          top: 4px;
          left: 6px;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: var(--pin-color);
          opacity: 0.6;
          z-index: 1;
          pointer-events: none;
          animation: radarWavePulse 2.4s cubic-bezier(0.16, 1, 0.3, 1) infinite;
          animation-delay: var(--anim-delay, 0s);
        }

        .pin-radar-wave.wave-delayed {
          animation-delay: calc(var(--anim-delay, 0s) + 1.2s);
        }

        @keyframes radarWavePulse {
          0% {
            transform: scale(0.6);
            opacity: 0.8;
          }
          100% {
            transform: scale(2.6);
            opacity: 0;
          }
        }

        .is-featured-pin .pin-body {
          border-color: #F4A261;
          box-shadow: 0 4px 18px rgba(0, 0, 0, 0.6), 0 0 22px #F4A261;
        }

        .is-featured-pin .pin-radar-wave {
          background: #F4A261;
        }

        /* MARCADOR DE GPS DINÂMICO */
        .user-dynamic-gps-wrapper {
          background: transparent !important;
          border: none !important;
        }

        .user-dynamic-radar {
          position: relative;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .radar-center-core {
          position: relative;
          z-index: 4;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #10B981;
          border: 3px solid #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 15px #10B981;
        }

        .radar-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #FFFFFF;
        }

        .radar-scan-wave {
          position: absolute;
          inset: 0;
          border: 2px solid #10B981;
          border-radius: 50%;
          animation: userPulse 1.8s infinite cubic-bezier(0.16, 1, 0.3, 1);
        }

        .radar-scan-wave-outer {
          position: absolute;
          inset: -6px;
          border: 1px dashed rgba(16, 185, 129, 0.6);
          border-radius: 50%;
          animation: userRotate 6s linear infinite;
        }

        @keyframes userPulse {
          0% { transform: scale(0.5); opacity: 1; }
          100% { transform: scale(2.4); opacity: 0; }
        }

        @keyframes userRotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        /* POPUP CUSTOMIZADO */
        .leaflet-popup-content-wrapper {
          background: rgba(12, 20, 31, 0.95) !important;
          backdrop-filter: blur(12px);
          border: 1px solid rgba(0, 180, 216, 0.4);
          border-radius: var(--radius-md) !important;
          color: #F8FAFC !important;
          padding: 0 !important;
          overflow: hidden;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.6) !important;
        }

        .leaflet-popup-content {
          margin: 0 !important;
          line-height: 1.4 !important;
        }

        .leaflet-popup-tip {
          background: rgba(12, 20, 31, 0.95) !important;
        }

        .leaflet-popup-card {
          width: 220px;
          overflow: hidden;
        }

        .popup-thumb {
          width: 100%;
          height: 100px;
          object-fit: cover;
        }

        .popup-info {
          padding: 0.75rem;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .popup-cat {
          font-size: 0.6875rem;
          font-weight: 700;
          text-transform: uppercase;
        }

        .popup-title {
          font-family: var(--font-display);
          font-size: 0.875rem;
          font-weight: 700;
          color: #F8FAFC;
          line-height: 1.2;
        }

        .popup-loc {
          font-size: 0.75rem;
          color: #94A3B8;
        }

        .popup-rating {
          font-size: 0.75rem;
          color: #F59E0B;
          font-weight: 700;
        }

        .popup-btn {
          margin-top: 0.4rem;
          width: 100%;
          padding: 0.4rem;
          background: #00B4D8;
          border: none;
          border-radius: var(--radius-sm);
          color: #060B11;
          font-family: var(--font-display);
          font-size: 0.75rem;
          font-weight: 700;
          cursor: pointer;
          transition: background 0.2s ease;
        }

        .popup-btn:hover {
          background: #38BDF8;
        }
      `}</style>
    </section>
  );
};
