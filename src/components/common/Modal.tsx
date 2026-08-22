import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children: React.ReactNode;
  maxWidth?: string;
  closeOnOverlayClick?: boolean;
  closeOnEsc?: boolean;
  showCloseBtn?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = '780px',
  closeOnOverlayClick = true,
  closeOnEsc = true,
  showCloseBtn = true
}) => {
  const isMouseDownOnOverlay = useRef(false);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (closeOnEsc && e.key === 'Escape') {
        onClose();
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose, closeOnEsc]);

  if (!isOpen) return null;

  const handleOverlayMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      isMouseDownOnOverlay.current = true;
    } else {
      isMouseDownOnOverlay.current = false;
    }
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (closeOnOverlayClick && isMouseDownOnOverlay.current && e.target === e.currentTarget) {
      onClose();
    }
    isMouseDownOnOverlay.current = false;
  };

  return (
    <div
      className="modal-overlay"
      onMouseDown={handleOverlayMouseDown}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="modal-container glass-panel"
        style={{ maxWidth }}
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          {title ? (
            <div className="modal-title-wrapper">{title}</div>
          ) : (
            <div />
          )}
          {showCloseBtn && (
            <button
              className="modal-close-btn"
              onClick={onClose}
              aria-label="Fechar janela"
              type="button"
            >
              <X size={20} />
            </button>
          )}
        </div>

        <div className="modal-body">
          {children}
        </div>
      </div>

      <style>{`
        .modal-overlay {
          position: fixed;
          inset: 0;
          z-index: 1000;
          background: rgba(4, 7, 11, 0.85);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: var(--space-md);
          animation: modalFadeIn 0.2s ease-out;
        }

        .modal-container {
          position: relative;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          background: rgba(10, 17, 26, 0.95);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: var(--radius-xl);
          box-shadow: 0 25px 60px rgba(0, 0, 0, 0.7), 0 0 40px rgba(0, 180, 216, 0.15);
          animation: modalScaleUp 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          display: flex;
          flex-direction: column;
        }

        .modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--space-lg) var(--space-xl);
          border-bottom: 1px solid var(--border-subtle);
          position: sticky;
          top: 0;
          background: rgba(10, 17, 26, 0.92);
          backdrop-filter: blur(12px);
          z-index: 10;
        }

        .modal-close-btn {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.06);
          color: var(--text-secondary);
          border: 1px solid var(--border-subtle);
          transition: all var(--transition-fast);
          cursor: pointer;
        }

        .modal-close-btn:hover {
          background: rgba(255, 255, 255, 0.15);
          color: #F8FAFC;
          transform: rotate(90deg);
        }

        .modal-body {
          padding: var(--space-xl);
          overflow-y: auto;
        }

        @keyframes modalFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes modalScaleUp {
          from { opacity: 0; transform: scale(0.96) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }

        @media (max-width: 640px) {
          .modal-overlay {
            padding: 0;
            align-items: flex-end;
          }
          .modal-container {
            max-height: 94vh;
            border-bottom-left-radius: 0;
            border-bottom-right-radius: 0;
          }
          .modal-header {
            padding: var(--space-md) var(--space-lg);
          }
          .modal-body {
            padding: var(--space-lg);
          }
        }
      `}</style>
    </div>
  );
};
