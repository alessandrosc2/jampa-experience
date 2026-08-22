import React, { useState, useEffect } from 'react';
import { Download, Smartphone, X, Sparkles, CheckCircle2, Share2, PlusSquare } from 'lucide-react';
import { Button } from '../common/Button';

export const PwaInstallBanner: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);

  useEffect(() => {
    // Verifica se já está rodando em modo standalone (app instalado)
    const isApp = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
    setIsStandalone(isApp);
    if (isApp) return;

    // Detecta se é dispositivo iOS (iPhone / iPad)
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isAppleDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isAppleDevice);

    // Captura evento de instalação do Chrome / Edge / Android
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Exibe o banner após 3 segundos
      setTimeout(() => setShowBanner(true), 3000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Se for iOS e não instalado, exibe banner após 5 segundos se não foi dispensado recentemente
    const dismissed = localStorage.getItem('jampa_pwa_dismissed');
    if (isAppleDevice && !dismissed) {
      setTimeout(() => setShowBanner(true), 4000);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setShowBanner(false);
      }
      setDeferredPrompt(null);
    } else if (isIOS) {
      setShowIOSInstructions(true);
    }
  };

  const handleDismiss = () => {
    setShowBanner(false);
    localStorage.setItem('jampa_pwa_dismissed', 'true');
  };

  if (!showBanner || isStandalone) return null;

  return (
    <aside className="pwa-install-container" aria-label="Instalação do Aplicativo">
      <div className="pwa-install-banner glass-panel">
        <button className="pwa-close-btn" onClick={handleDismiss} title="Fechar aviso de instalação" aria-label="Fechar banner">
          <X size={16} />
        </button>

        <div className="pwa-banner-left">
          <div className="pwa-icon-box">
            <img src="/icons/icon-192.svg" alt="Ícone Jampa Experience" className="pwa-logo-img" />
          </div>

          <div className="pwa-text-box">
            <div className="pwa-title-row">
              <span className="pwa-title">Instalar App JAMPA EXPERIENCE</span>
              <span className="pwa-free-tag">Grátis & Leve</span>
            </div>
            <p className="pwa-desc">
              Instale na tela de início do seu celular para navegação offline rápida, sem gastar memória.
            </p>
          </div>
        </div>

        <div className="pwa-actions-group">
          <Button
            variant="gold"
            size="sm"
            iconLeft={<Download size={14} />}
            onClick={handleInstallClick}
          >
            {isIOS ? 'Como Instalar no iPhone' : 'Instalar Agora'}
          </Button>
        </div>
      </div>

      {/* Modal / Card com Instruções para iOS Safari */}
      {showIOSInstructions && (
        <div className="ios-instructions-modal glass-panel">
          <div className="ios-header">
            <h4>Como instalar no seu iPhone / iPad:</h4>
            <button className="ios-close-btn" onClick={() => setShowIOSInstructions(false)}>
              <X size={16} />
            </button>
          </div>
          <ol className="ios-steps-list">
            <li>
              <span>1. Toque no botão de <strong>Compartilhar</strong> na barra inferior do Safari</span>
              <Share2 size={16} color="#00B4D8" />
            </li>
            <li>
              <span>2. Role para baixo e selecione <strong>"Adicionar à Tela de Início"</strong></span>
              <PlusSquare size={16} color="#F4A261" />
            </li>
            <li>
              <span>3. Toque em <strong>Adicionar</strong> no canto superior direito.</span>
            </li>
          </ol>
          <Button variant="primary" size="sm" fullWidth onClick={() => setShowIOSInstructions(false)}>
            Entendi!
          </Button>
        </div>
      )}

      <style>{`
        .pwa-install-container {
          position: fixed;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 999;
          width: 92%;
          max-width: 640px;
          animation: slideUpPwa 0.35s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .pwa-install-banner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.85rem 1.25rem;
          background: rgba(10, 17, 26, 0.95);
          border: 1px solid rgba(0, 180, 216, 0.4);
          border-radius: var(--radius-xl);
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.7), 0 0 25px rgba(0, 180, 216, 0.2);
          position: relative;
          gap: var(--space-md);
        }

        .pwa-close-btn {
          position: absolute;
          top: -8px;
          right: -8px;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: rgba(239, 68, 68, 0.85);
          color: #FFFFFF;
          border: 1px solid rgba(255, 255, 255, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: transform var(--transition-fast);
        }

        .pwa-close-btn:hover {
          transform: scale(1.15);
        }

        .pwa-banner-left {
          display: flex;
          align-items: center;
          gap: 0.85rem;
          flex: 1;
        }

        .pwa-icon-box {
          width: 44px;
          height: 44px;
          border-radius: var(--radius-md);
          overflow: hidden;
          flex-shrink: 0;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
        }

        .pwa-logo-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .pwa-text-box {
          display: flex;
          flex-direction: column;
          gap: 0.15rem;
        }

        .pwa-title-row {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .pwa-title {
          font-family: var(--font-display);
          font-size: 0.95rem;
          font-weight: 700;
          color: #F8FAFC;
        }

        .pwa-free-tag {
          font-size: 0.625rem;
          font-weight: 700;
          color: #2EC4B6;
          background: rgba(46, 196, 182, 0.15);
          padding: 0.1rem 0.4rem;
          border-radius: var(--radius-full);
        }

        .pwa-desc {
          font-size: 0.75rem;
          color: #94A3B8;
          line-height: 1.35;
        }

        .pwa-actions-group {
          flex-shrink: 0;
        }

        .ios-instructions-modal {
          margin-top: 0.5rem;
          padding: 1rem;
          background: rgba(10, 17, 26, 0.98);
          border: 1px solid #F4A261;
          border-radius: var(--radius-lg);
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .ios-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          color: #F8FAFC;
          font-size: 0.875rem;
          font-weight: 700;
        }

        .ios-close-btn {
          color: #94A3B8;
          cursor: pointer;
        }

        .ios-steps-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          padding-left: 0;
          list-style: none;
        }

        .ios-steps-list li {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.78125rem;
          color: #CBD5E1;
          background: rgba(255, 255, 255, 0.04);
          padding: 0.4rem 0.6rem;
          border-radius: var(--radius-sm);
        }

        @keyframes slideUpPwa {
          from { opacity: 0; transform: translate(-50%, 20px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }

        @media (max-width: 640px) {
          .pwa-install-banner {
            flex-direction: column;
            align-items: stretch;
            padding: 1rem;
          }
          .pwa-actions-group {
            margin-top: 0.5rem;
          }
        }
      `}</style>
    </aside>
  );
};
