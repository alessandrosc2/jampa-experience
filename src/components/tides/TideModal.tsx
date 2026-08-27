import React, { useState, useEffect } from 'react';
import {
  Waves,
  Calendar,
  Clock,
  Compass,
  Sparkles,
  ExternalLink,
  RotateCcw,
  ShieldCheck,
  ArrowDown,
  ArrowUp,
  AlertCircle,
  Sun,
  Anchor,
  X
} from 'lucide-react';
import { tideService, OFFICIAL_TABUA_MARES_URL } from '../../services/tideService';
import { TideForecast, TideDay, TideHour } from '../../types/tide';

interface TideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TideModal: React.FC<TideModalProps> = ({ isOpen, onClose }) => {
  const [forecast, setForecast] = useState<TideForecast | null>(null);
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const loadForecast = async (forceRefresh = false) => {
    try {
      if (forceRefresh) setIsRefreshing(true);
      else setIsLoading(true);
      setErrorMsg(null);

      const data = await tideService.get7DayForecast(forceRefresh);
      setForecast(data);
    } catch (err: any) {
      console.error('Erro ao carregar tábua de marés:', err);
      setErrorMsg('Não foi possível carregar os dados ao vivo. Exibindo estimativa local.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadForecast();
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const selectedDay: TideDay | null = forecast?.days?.[selectedDayIndex] || null;

  return (
    <div className="tide-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="tide-modal-content glass-panel" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="tide-modal-header">
          <div className="tide-modal-header-left">
            <div className="tide-modal-pill">
              <Waves size={14} color="#00B4D8" />
              <span>PREVISÃO OFICIAL • JOÃO PESSOA - PB</span>
            </div>
            <h2 className="tide-modal-title">
              Tábua de Marés & <span className="text-cyan">Piscinas Naturais</span>
            </h2>
            <p className="tide-modal-subtitle">
              Planeje seus passeios em Picãozinho, Seixas e Areia Vermelha nos melhores horários de <strong>maré baixa</strong>.
            </p>
          </div>

          <button
            type="button"
            className="tide-modal-close-btn"
            onClick={onClose}
            aria-label="Fechar Tábua de Marés"
          >
            <X size={20} />
          </button>
        </div>

        {/* Status em Tempo Real */}
        {forecast?.currentStatus && (
          <div className="tide-live-status-bar">
            <div className="status-live-indicator">
              <span className="live-dot" />
              <span className="live-text">TEMPO REAL</span>
            </div>
            <div className="status-info-row">
              <span>Maré agora: <strong>{forecast.currentStatus.estimatedLevel.toFixed(2)}m</strong></span>
              <span className="status-sep">•</span>
              <span className={`status-trend ${forecast.currentStatus.trend}`}>
                {forecast.currentStatus.trend === 'subindo' ? (
                  <>
                    <ArrowUp size={13} /> Enchendo
                  </>
                ) : (
                  <>
                    <ArrowDown size={13} /> Baixando (Secando)
                  </>
                )}
              </span>
              <span className="status-sep">•</span>
              <span>
                Próxima {forecast.currentStatus.nextTide.type === 'low' ? 'baixa' : 'alta'}: <strong>{forecast.currentStatus.nextTide.hour}</strong> ({forecast.currentStatus.timeRemainingText})
              </span>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && !forecast && (
          <div className="tide-modal-loading">
            <div className="tide-spinner" />
            <p>Consultando Tábua de Marés oficial de João Pessoa...</p>
          </div>
        )}

        {/* Conteúdo Principal da Tábua */}
        {forecast && selectedDay && (
          <div className="tide-modal-body">
            {/* Seletor Horizontal de 7 Dias */}
            <div className="tide-days-strip" role="tablist" aria-label="Seletor de dias da maré">
              {forecast.days.map((day, idx) => {
                const isSelected = selectedDayIndex === idx;
                return (
                  <button
                    key={day.dateStr}
                    type="button"
                    role="tab"
                    aria-selected={isSelected}
                    className={`tide-day-btn ${isSelected ? 'active' : ''} ${day.isToday ? 'is-today' : ''}`}
                    onClick={() => setSelectedDayIndex(idx)}
                  >
                    <span className="day-top-label">
                      {day.isToday ? 'Hoje' : day.isTomorrow ? 'Amanhã' : day.shortWeekday}
                    </span>
                    <span className="day-date-number">{day.formattedDate}</span>
                    <span className="day-moon-icon" title={day.moonPhase}>{day.moonIcon}</span>
                    <span className={`day-min-tide-badge ${day.condition}`}>
                      🏖️ {day.minTide.level.toFixed(2)}m
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Banner de Condição do Dia */}
            <div className={`tide-condition-banner ${selectedDay.condition}`}>
              <div className="cond-banner-left">
                <span className="cond-badge-icon">
                  {selectedDay.condition === 'excelente' ? '🌟' : selectedDay.condition === 'boa' ? '✨' : '🌊'}
                </span>
                <div>
                  <h3 className="cond-title">
                    {selectedDay.weekdayName}, {selectedDay.formattedDate} — {selectedDay.conditionLabel}
                  </h3>
                  <p className="cond-desc">{selectedDay.conditionDesc}</p>
                </div>
              </div>

              <div className="cond-banner-right">
                <div className="moon-phase-pill">
                  <span>{selectedDay.moonIcon}</span>
                  <span>{selectedDay.moonPhase}</span>
                </div>
              </div>
            </div>

            {/* Grid dos Horários de Maré */}
            <div className="tide-hours-grid">
              {selectedDay.hours.map((h, hIdx) => {
                const isMinTide = h.level === selectedDay.minTide.level;

                return (
                  <div
                    key={hIdx}
                    className={`tide-hour-card ${h.type === 'low' ? 'is-low' : 'is-high'} ${isMinTide ? 'is-golden-min' : ''}`}
                  >
                    <div className="tide-card-header">
                      <span className="tide-type-tag">
                        {h.type === 'low' ? (
                          <>
                            <ArrowDown size={13} color="#00B4D8" /> MARÉ BAIXA (SECA)
                          </>
                        ) : (
                          <>
                            <ArrowUp size={13} color="#F4A261" /> MARÉ ALTA (CHEIA)
                          </>
                        )}
                      </span>
                      {isMinTide && (
                        <span className="golden-star-badge" title="Maré mais baixa do dia">
                          ⭐ Mínima
                        </span>
                      )}
                    </div>

                    <div className="tide-card-time-row">
                      <Clock size={16} className="clock-icon" />
                      <strong className="tide-time">{h.hour}</strong>
                    </div>

                    <div className="tide-card-level-row">
                      <span className="tide-level-number">{h.level.toFixed(2)}m</span>
                      <div className="tide-level-bar-bg">
                        <div
                          className={`tide-level-bar-fill ${h.type === 'low' ? 'fill-low' : 'fill-high'}`}
                          style={{ width: `${Math.min(100, (h.level / 2.7) * 100)}%` }}
                        />
                      </div>
                    </div>

                    {h.isBestForPiscinas && (
                      <div className="tide-pool-recommend-pill">
                        <Sparkles size={11} color="#00B4D8" />
                        <span>Ideal para Piscinas & Areia Vermelha</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Box Informativo de Recomendações Estratégicas */}
            <div className="tide-tourist-tips-box">
              <div className="tourist-tips-header">
                <Compass size={17} color="#00B4D8" />
                <h4>Guia de Passeios Náuticos para {selectedDay.isToday ? 'Hoje' : selectedDay.isTomorrow ? 'Amanhã' : selectedDay.weekdayName}:</h4>
              </div>

              <div className="tips-columns-grid">
                <div className="tip-col-card">
                  <span className="tip-col-label">⏰ Janela Ideal de Embarque:</span>
                  <strong className="tip-col-val text-cyan">{selectedDay.bestWindow}</strong>
                  <span className="tip-col-sub">Chegue ao ponto de embarque 40 minutos antes da maré mínima ({selectedDay.minTide.hour}).</span>
                </div>

                <div className="tip-col-card">
                  <span className="tip-col-label">🐠 Melhores Atrações no Horário:</span>
                  <span className="tip-col-val">
                    Picãozinho (Tambaú), Piscinas do Seixas, Ilha de Areia Vermelha e Caribessa.
                  </span>
                </div>

                <div className="tip-col-card">
                  <span className="tip-col-label">🛡️ Dica de Segurança & Preservação:</span>
                  <span className="tip-col-val">
                    Use sapatilha de neoprene nos recifes e não pise sobre os corais vivos.
                  </span>
                </div>
              </div>
            </div>

            {/* Footer com Ações e Link Oficial */}
            <div className="tide-modal-footer">
              <div className="station-info">
                📍 Referência: <strong>Porto de Cabedelo / João Pessoa - PB</strong> (Marinha do Brasil / DHN)
              </div>

              <div className="tide-footer-buttons">
                <button
                  type="button"
                  className="tide-refresh-btn"
                  onClick={() => loadForecast(true)}
                  disabled={isRefreshing}
                  title="Atualizar dados ao vivo"
                >
                  <RotateCcw size={13} className={isRefreshing ? 'spin-animation' : ''} />
                  <span>{isRefreshing ? 'Atualizando...' : 'Atualizar'}</span>
                </button>

                <a
                  href={OFFICIAL_TABUA_MARES_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="tide-official-link-btn"
                  title="Abrir Tábua de Marés completa de João Pessoa no TabuaDeMares.com"
                >
                  <span>Ver no TábuaDeMarés.com</span>
                  <ExternalLink size={13} />
                </a>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .tide-modal-backdrop {
          position: fixed;
          inset: 0;
          z-index: 1200;
          background: rgba(3, 7, 18, 0.75);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
          animation: fadeIn 0.2s ease-out;
        }

        .tide-modal-content {
          width: 100%;
          max-width: 980px;
          max-height: 90vh;
          overflow-y: auto;
          background: #0B132B;
          border: 1px solid rgba(0, 180, 216, 0.3);
          box-shadow: 0 25px 60px -15px rgba(0, 0, 0, 0.7), 0 0 30px rgba(0, 180, 216, 0.15);
          border-radius: var(--radius-2xl, 20px);
          padding: 1.75rem;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          position: relative;
          animation: modalSlideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes modalSlideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        .tide-modal-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 1rem;
        }

        .tide-modal-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.25rem 0.65rem;
          background: rgba(0, 180, 216, 0.12);
          border: 1px solid rgba(0, 180, 216, 0.3);
          border-radius: var(--radius-full);
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          color: #00B4D8;
          text-transform: uppercase;
          margin-bottom: 0.35rem;
        }

        .tide-modal-title {
          font-family: var(--font-display);
          font-size: clamp(1.4rem, 2.5vw, 1.85rem);
          font-weight: 800;
          color: #F8FAFC;
          line-height: 1.2;
          margin-bottom: 0.2rem;
        }

        .tide-modal-subtitle {
          font-size: 0.875rem;
          color: #94A3B8;
        }

        .tide-modal-subtitle strong {
          color: #F4A261;
        }

        .tide-modal-close-btn {
          width: 38px;
          height: 38px;
          min-width: 38px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #94A3B8;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .tide-modal-close-btn:hover {
          background: rgba(239, 68, 68, 0.2);
          border-color: rgba(239, 68, 68, 0.4);
          color: #EF4444;
          transform: rotate(90deg);
        }

        /* Status em tempo real */
        .tide-live-status-bar {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.5rem 1rem;
          background: rgba(15, 23, 42, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: var(--radius-lg);
          font-size: 0.825rem;
          color: #E2E8F0;
          flex-wrap: wrap;
        }

        .status-live-indicator {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          background: rgba(16, 185, 129, 0.2);
          border: 1px solid rgba(16, 185, 129, 0.4);
          padding: 0.15rem 0.45rem;
          border-radius: var(--radius-full);
          font-size: 0.675rem;
          font-weight: 800;
          color: #10B981;
          letter-spacing: 0.05em;
        }

        .live-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #10B981;
          box-shadow: 0 0 8px #10B981;
          animation: pulse-dot 1.5s infinite;
        }

        @keyframes pulse-dot {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.4); opacity: 0.6; }
        }

        .status-info-row {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .status-sep {
          color: #475569;
        }

        .status-trend {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          font-weight: 700;
        }

        .status-trend.baixando { color: #00B4D8; }
        .status-trend.subindo { color: #F4A261; }

        /* Modal Body */
        .tide-modal-body {
          display: flex;
          flex-direction: column;
          gap: 1.15rem;
        }

        /* Seletor Horizontal de 7 Dias */
        .tide-days-strip {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 0.5rem;
          overflow-x: auto;
          padding-bottom: 0.25rem;
        }

        .tide-day-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.25rem;
          padding: 0.65rem 0.35rem;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: var(--radius-md, 10px);
          cursor: pointer;
          transition: all 0.2s ease;
          color: var(--text-primary);
        }

        .tide-day-btn:hover {
          background: rgba(0, 180, 216, 0.08);
          border-color: rgba(0, 180, 216, 0.3);
        }

        .tide-day-btn.active {
          background: linear-gradient(180deg, rgba(0, 180, 216, 0.2) 0%, rgba(15, 23, 42, 0.8) 100%);
          border-color: #00B4D8;
          box-shadow: 0 0 16px rgba(0, 180, 216, 0.25);
        }

        .tide-day-btn.is-today .day-top-label {
          color: #00B4D8;
          font-weight: 800;
        }

        .day-top-label {
          font-size: 0.725rem;
          font-weight: 600;
          color: #94A3B8;
          text-transform: uppercase;
        }

        .day-date-number {
          font-size: 1.05rem;
          font-weight: 800;
          color: #F8FAFC;
        }

        .day-moon-icon {
          font-size: 1rem;
        }

        .day-min-tide-badge {
          display: inline-block;
          font-size: 0.7rem;
          font-weight: 700;
          padding: 0.15rem 0.35rem;
          border-radius: var(--radius-full);
        }

        .day-min-tide-badge.excelente {
          background: rgba(16, 185, 129, 0.2);
          color: #34D399;
          border: 1px solid rgba(16, 185, 129, 0.4);
        }

        .day-min-tide-badge.boa {
          background: rgba(0, 180, 216, 0.2);
          color: #38BDF8;
          border: 1px solid rgba(0, 180, 216, 0.4);
        }

        .day-min-tide-badge.regular,
        .day-min-tide-badge.alta {
          background: rgba(244, 162, 97, 0.2);
          color: #F4A261;
          border: 1px solid rgba(244, 162, 97, 0.4);
        }

        /* Banner de Condição */
        .tide-condition-banner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.9rem 1.15rem;
          border-radius: var(--radius-lg);
          gap: 0.75rem;
        }

        .tide-condition-banner.excelente {
          background: linear-gradient(90deg, rgba(16, 185, 129, 0.15) 0%, rgba(15, 23, 42, 0.6) 100%);
          border: 1px solid rgba(16, 185, 129, 0.4);
        }

        .tide-condition-banner.boa {
          background: linear-gradient(90deg, rgba(0, 180, 216, 0.15) 0%, rgba(15, 23, 42, 0.6) 100%);
          border: 1px solid rgba(0, 180, 216, 0.4);
        }

        .tide-condition-banner.regular,
        .tide-condition-banner.alta {
          background: linear-gradient(90deg, rgba(244, 162, 97, 0.15) 0%, rgba(15, 23, 42, 0.6) 100%);
          border: 1px solid rgba(244, 162, 97, 0.4);
        }

        .cond-banner-left {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .cond-badge-icon {
          font-size: 1.5rem;
        }

        .cond-title {
          font-size: 1rem;
          font-weight: 700;
          color: #F8FAFC;
          margin-bottom: 0.15rem;
        }

        .cond-desc {
          font-size: 0.825rem;
          color: #CBD5E1;
        }

        .moon-phase-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.3rem 0.65rem;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: var(--radius-full);
          font-size: 0.75rem;
          font-weight: 600;
          color: #E2E8F0;
          white-space: nowrap;
        }

        /* Grid dos Horários de Maré */
        .tide-hours-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 0.75rem;
        }

        .tide-hour-card {
          padding: 0.95rem;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: var(--radius-md);
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .tide-hour-card.is-golden-min {
          background: rgba(0, 180, 216, 0.1);
          border-color: #00B4D8;
          box-shadow: 0 0 14px rgba(0, 180, 216, 0.2);
        }

        .tide-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .tide-type-tag {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          font-size: 0.675rem;
          font-weight: 700;
          color: #94A3B8;
        }

        .golden-star-badge {
          display: inline-block;
          font-size: 0.65rem;
          font-weight: 800;
          padding: 0.1rem 0.35rem;
          background: linear-gradient(135deg, #F4A261, #E76F51);
          color: #0F172A;
          border-radius: var(--radius-full);
        }

        .tide-card-time-row {
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }

        .clock-icon { color: #64748B; }

        .tide-time {
          font-size: 1.35rem;
          font-weight: 800;
          color: #F8FAFC;
          font-family: monospace;
        }

        .tide-card-level-row {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .tide-level-number {
          font-size: 0.95rem;
          font-weight: 700;
          color: #E2E8F0;
        }

        .tide-level-bar-bg {
          width: 100%;
          height: 5px;
          background: rgba(255, 255, 255, 0.08);
          border-radius: 4px;
          overflow: hidden;
        }

        .tide-level-bar-fill {
          height: 100%;
          border-radius: 4px;
        }

        .tide-level-bar-fill.fill-low {
          background: linear-gradient(90deg, #00B4D8, #38BDF8);
        }

        .tide-level-bar-fill.fill-high {
          background: linear-gradient(90deg, #F4A261, #E76F51);
        }

        .tide-pool-recommend-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          font-size: 0.675rem;
          font-weight: 700;
          color: #00B4D8;
          background: rgba(0, 180, 216, 0.12);
          border: 1px solid rgba(0, 180, 216, 0.3);
          border-radius: 4px;
          padding: 0.25rem 0.45rem;
        }

        /* Tips Box */
        .tide-tourist-tips-box {
          padding: 1rem 1.15rem;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: var(--radius-lg);
        }

        .tourist-tips-header {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          margin-bottom: 0.75rem;
        }

        .tourist-tips-header h4 {
          font-size: 0.875rem;
          font-weight: 700;
          color: #F8FAFC;
        }

        .tips-columns-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 0.75rem;
        }

        .tip-col-card {
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.05);
          padding: 0.75rem;
          border-radius: var(--radius-md);
        }

        .tip-col-label {
          font-size: 0.7rem;
          font-weight: 700;
          color: #94A3B8;
          text-transform: uppercase;
        }

        .tip-col-val {
          font-size: 0.825rem;
          font-weight: 600;
          color: #E2E8F0;
        }

        .tip-col-sub {
          font-size: 0.725rem;
          color: #64748B;
        }

        /* Modal Footer */
        .tide-modal-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.75rem;
          padding-top: 0.75rem;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          flex-wrap: wrap;
        }

        .station-info {
          font-size: 0.75rem;
          color: #64748B;
        }

        .station-info strong {
          color: #94A3B8;
        }

        .tide-footer-buttons {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .tide-refresh-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: var(--radius-full);
          padding: 0.4rem 0.8rem;
          color: #94A3B8;
          font-size: 0.785rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .tide-refresh-btn:hover {
          background: rgba(0, 180, 216, 0.15);
          border-color: #00B4D8;
          color: #00B4D8;
        }

        .tide-official-link-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          background: linear-gradient(135deg, rgba(0, 180, 216, 0.2), rgba(0, 119, 182, 0.3));
          border: 1px solid rgba(0, 180, 216, 0.5);
          border-radius: var(--radius-full);
          padding: 0.4rem 0.95rem;
          color: #00B4D8;
          font-size: 0.785rem;
          font-weight: 700;
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .tide-official-link-btn:hover {
          background: linear-gradient(135deg, #00B4D8, #0077B6);
          color: #0F172A;
          box-shadow: 0 0 14px rgba(0, 180, 216, 0.4);
        }

        .spin-animation {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .tide-modal-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.85rem;
          padding: var(--space-2xl);
          text-align: center;
          color: #94A3B8;
        }

        .tide-spinner {
          width: 32px;
          height: 32px;
          border: 3px solid rgba(0, 180, 216, 0.2);
          border-top-color: #00B4D8;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @media (max-width: 768px) {
          .tide-modal-content {
            padding: 1.15rem;
            max-height: 94vh;
          }

          .tide-days-strip {
            grid-template-columns: repeat(7, 105px);
          }

          .tide-condition-banner {
            flex-direction: column;
            align-items: flex-start;
          }

          .tide-modal-footer {
            flex-direction: column;
            align-items: flex-start;
          }

          .tide-footer-buttons {
            width: 100%;
            justify-content: space-between;
          }
        }
      `}</style>
    </div>
  );
};
