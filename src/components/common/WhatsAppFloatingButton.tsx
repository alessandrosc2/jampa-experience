import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface WhatsAppFloatingButtonProps {
  phoneNumber?: string;
  defaultMessage?: string;
}

export const WhatsAppFloatingButton: React.FC<WhatsAppFloatingButtonProps> = ({
  phoneNumber = '5583993595124',
  defaultMessage = 'Olá! Gostaria de tirar dúvidas sobre o Jampa Experience.'
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipDismissed, setTooltipDismissed] = useState(false);

  // Exibir balão de boas-vindas após 2.5 segundos
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!tooltipDismissed) {
        setShowTooltip(true);
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, [tooltipDismissed]);

  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(defaultMessage)}`;

  return (
    <div className="whatsapp-floating-container">
      {/* Balãozinho de Mensagem (Tooltip / Chat Bubble) */}
      {showTooltip && !tooltipDismissed && (
        <div className="whatsapp-balloon animate-balloon">
          <button
            className="balloon-close-btn"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowTooltip(false);
              setTooltipDismissed(true);
            }}
            aria-label="Fechar balão de WhatsApp"
          >
            <X size={12} />
          </button>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="balloon-content"
          >
            <div className="balloon-avatar-dot" />
            <div className="balloon-text-col">
              <span className="balloon-title">Suporte WhatsApp</span>
              <span className="balloon-msg">Dúvidas sobre o Guia? Fale com a gente! 🌴</span>
            </div>
          </a>
          <div className="balloon-arrow" />
        </div>
      )}

      {/* Botão Principal Redondo do WhatsApp */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-btn"
        aria-label="Falar no WhatsApp (83) 99359-5124"
        title="Atendimento no WhatsApp: (83) 99359-5124"
        onMouseEnter={() => !tooltipDismissed && setShowTooltip(true)}
      >
        {/* Anel de Pulso / Glow */}
        <span className="whatsapp-pulse-ring" />
        
        {/* SVG Oficial WhatsApp */}
        <svg
          viewBox="0 0 24 24"
          width="30"
          height="30"
          stroke="currentColor"
          strokeWidth="0"
          fill="currentColor"
          className="whatsapp-svg-icon"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.888 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
        </svg>

        {/* Indicador de Online */}
        <span className="whatsapp-online-badge" />
      </a>

      <style>{`
        .whatsapp-floating-container {
          position: fixed;
          bottom: 28px;
          right: 28px;
          z-index: 990;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 10px;
          pointer-events: auto;
        }

        .whatsapp-btn {
          position: relative;
          width: 58px;
          height: 58px;
          border-radius: 50%;
          background: linear-gradient(135deg, #25D366 0%, #128C7E 100%);
          color: #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 25px rgba(37, 211, 102, 0.4), 0 4px 12px rgba(0, 0, 0, 0.4);
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s;
          text-decoration: none;
          cursor: pointer;
        }

        .whatsapp-btn:hover {
          transform: scale(1.08) translateY(-2px);
          box-shadow: 0 12px 32px rgba(37, 211, 102, 0.55), 0 6px 16px rgba(0, 0, 0, 0.5);
        }

        .whatsapp-btn:active {
          transform: scale(0.95);
        }

        .whatsapp-pulse-ring {
          position: absolute;
          inset: -4px;
          border-radius: 50%;
          border: 2px solid rgba(37, 211, 102, 0.6);
          animation: whatsappPulse 2s infinite cubic-bezier(0.45, 0, 0.55, 1);
          pointer-events: none;
        }

        @keyframes whatsappPulse {
          0% {
            transform: scale(0.95);
            opacity: 0.9;
          }
          70% {
            transform: scale(1.35);
            opacity: 0;
          }
          100% {
            transform: scale(1.4);
            opacity: 0;
          }
        }

        .whatsapp-svg-icon {
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
        }

        .whatsapp-online-badge {
          position: absolute;
          top: 2px;
          right: 2px;
          width: 14px;
          height: 14px;
          background: #4ADE80;
          border: 2px solid #060B11;
          border-radius: 50%;
        }

        /* BALÃO DE MENSAGEM */
        .whatsapp-balloon {
          position: relative;
          background: rgba(14, 25, 40, 0.95);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(37, 211, 102, 0.35);
          border-radius: 14px;
          padding: 10px 14px;
          max-width: 240px;
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.6), 0 0 20px rgba(37, 211, 102, 0.15);
        }

        .animate-balloon {
          animation: balloonPop 0.35s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes balloonPop {
          from {
            opacity: 0;
            transform: translateY(10px) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .balloon-close-btn {
          position: absolute;
          top: 6px;
          right: 6px;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.1);
          border: none;
          color: #94A3B8;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 0.2s, color 0.2s;
        }

        .balloon-close-btn:hover {
          background: rgba(239, 68, 68, 0.3);
          color: #EF4444;
        }

        .balloon-content {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          text-decoration: none;
        }

        .balloon-avatar-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #25D366;
          margin-top: 5px;
          flex-shrink: 0;
          box-shadow: 0 0 8px #25D366;
        }

        .balloon-text-col {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .balloon-title {
          font-family: var(--font-display);
          font-size: 0.75rem;
          font-weight: 700;
          color: #25D366;
        }

        .balloon-msg {
          font-size: 0.8125rem;
          color: #F8FAFC;
          line-height: 1.35;
        }

        .balloon-arrow {
          position: absolute;
          bottom: -6px;
          right: 22px;
          width: 10px;
          height: 10px;
          background: rgba(14, 25, 40, 0.95);
          border-right: 1px solid rgba(37, 211, 102, 0.35);
          border-bottom: 1px solid rgba(37, 211, 102, 0.35);
          transform: rotate(45deg);
        }

        /* RESPONSIVIDADE MOBILE: Posicionar acima da bottom nav */
        @media (max-width: 768px) {
          .whatsapp-floating-container {
            bottom: calc(4.6rem + env(safe-area-inset-bottom, 14px) + 10px);
            right: 16px;
          }

          .whatsapp-btn {
            width: 52px;
            height: 52px;
          }

          .whatsapp-svg-icon {
            width: 26px;
            height: 26px;
          }

          .whatsapp-balloon {
            max-width: 210px;
            padding: 8px 12px;
          }

          .balloon-msg {
            font-size: 0.75rem;
          }
        }
      `}</style>
    </div>
  );
};
