import React, { useState, useEffect } from 'react';
import { WifiOff, CheckCircle2 } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [showBackOnlineToast, setShowBackOnlineToast] = useState(false);

  useEffect(() => {
    const handleOffline = () => {
      setIsOffline(true);
      setShowBackOnlineToast(false);
    };

    const handleOnline = () => {
      setIsOffline(false);
      setShowBackOnlineToast(true);
      setTimeout(() => setShowBackOnlineToast(false), 3500);
    };

    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);

    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    };
  }, []);

  if (!isOffline && !showBackOnlineToast) return null;

  return (
    <div className={`network-status-bar ${isOffline ? 'offline' : 'online'}`} role="status">
      {isOffline ? (
        <div className="status-inner">
          <WifiOff size={14} />
          <span>Você está no <strong>Modo Offline</strong>. Seus roteiros e favoritos continuam disponíveis no cache local.</span>
        </div>
      ) : (
        <div className="status-inner">
          <CheckCircle2 size={14} />
          <span>Conexão restaurada com sucesso!</span>
        </div>
      )}

      <style>{`
        .network-status-bar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 10000;
          padding: 0.35rem 1rem;
          font-family: var(--font-display);
          font-size: 0.75rem;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          animation: slideDownBar 0.3s ease;
        }

        .network-status-bar.offline {
          background: #B91C1C;
          color: #FEF2F2;
        }

        .network-status-bar.online {
          background: #047857;
          color: #ECFDF5;
        }

        .status-inner {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        @keyframes slideDownBar {
          from { transform: translateY(-100%); }
          to { transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};
