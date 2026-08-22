import React, { useEffect, useState } from 'react';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Image as ImageIcon } from 'lucide-react';

interface LightboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: string[];
  initialIndex?: number;
  placeName?: string;
}

export const LightboxModal: React.FC<LightboxModalProps> = ({
  isOpen,
  onClose,
  images,
  initialIndex = 0,
  placeName = ''
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isZoomed, setIsZoomed] = useState(false);

  useEffect(() => {
    setCurrentIndex(initialIndex);
    setIsZoomed(false);
  }, [initialIndex, isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, currentIndex, images.length]);

  if (!isOpen || images.length === 0) return null;

  const handlePrev = () => {
    setIsZoomed(false);
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const handleNext = () => {
    setIsZoomed(false);
    setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  return (
    <div className="lightbox-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
        {/* Barra Superior */}
        <div className="lightbox-header">
          <div className="lightbox-info">
            <span className="lightbox-place-title">{placeName}</span>
            <span className="lightbox-counter">
              Foto {currentIndex + 1} de {images.length}
            </span>
          </div>

          <div className="lightbox-controls">
            <button
              className="ctrl-btn"
              onClick={() => setIsZoomed(!isZoomed)}
              title={isZoomed ? 'Reduzir Zoom' : 'Aumentar Zoom'}
            >
              {isZoomed ? <ZoomOut size={20} /> : <ZoomIn size={20} />}
            </button>
            <button className="ctrl-btn close-btn" onClick={onClose} title="Fechar Galeria">
              <X size={22} />
            </button>
          </div>
        </div>

        {/* Imagem Principal */}
        <div className="lightbox-main-view">
          <button className="nav-arrow-btn left" onClick={handlePrev} aria-label="Foto anterior">
            <ChevronLeft size={28} />
          </button>

          <div className={`lightbox-image-container ${isZoomed ? 'zoomed' : ''}`}>
            <img
              src={images[currentIndex]}
              alt={`${placeName} foto ${currentIndex + 1}`}
              className="lightbox-active-img"
              onClick={() => setIsZoomed(!isZoomed)}
            />
          </div>

          <button className="nav-arrow-btn right" onClick={handleNext} aria-label="Próxima foto">
            <ChevronRight size={28} />
          </button>
        </div>

        {/* Tira de Miniaturas (Thumbnails) */}
        {images.length > 1 && (
          <div className="lightbox-thumbnails-row">
            {images.map((img, idx) => (
              <button
                key={idx}
                className={`thumb-item ${idx === currentIndex ? 'active' : ''}`}
                onClick={() => {
                  setCurrentIndex(idx);
                  setIsZoomed(false);
                }}
              >
                <img src={img} alt={`Miniatura ${idx + 1}`} />
              </button>
            ))}
          </div>
        )}
      </div>

      <style>{`
        .lightbox-overlay {
          position: fixed;
          inset: 0;
          z-index: 1100;
          background: rgba(4, 7, 11, 0.96);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          display: flex;
          align-items: center;
          justify-content: center;
          animation: fadeIn 0.2s ease-out;
        }

        .lightbox-content {
          position: relative;
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: var(--space-md);
        }

        .lightbox-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.5rem 1rem;
          background: rgba(10, 17, 26, 0.85);
          border-radius: var(--radius-full);
          border: 1px solid var(--border-subtle);
          max-width: 900px;
          margin: 0 auto;
          width: 100%;
          z-index: 10;
        }

        .lightbox-info {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .lightbox-place-title {
          font-family: var(--font-display);
          font-size: 1rem;
          font-weight: 700;
          color: #F8FAFC;
        }

        .lightbox-counter {
          font-size: 0.75rem;
          color: #94A3B8;
        }

        .lightbox-controls {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .ctrl-btn {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid var(--border-subtle);
          color: #CBD5E1;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .ctrl-btn:hover {
          background: rgba(255, 255, 255, 0.18);
          color: #F8FAFC;
        }

        .close-btn:hover {
          background: rgba(239, 68, 68, 0.25);
          color: #FCA5A5;
        }

        .lightbox-main-view {
          position: relative;
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          margin: var(--space-md) 0;
        }

        .nav-arrow-btn {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: rgba(10, 17, 26, 0.75);
          border: 1px solid var(--border-medium);
          color: #F8FAFC;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 10;
          transition: all var(--transition-fast);
        }

        .nav-arrow-btn:hover {
          background: rgba(0, 180, 216, 0.3);
          border-color: #00B4D8;
          transform: translateY(-50%) scale(1.1);
        }

        .nav-arrow-btn.left { left: 20px; }
        .nav-arrow-btn.right { right: 20px; }

        .lightbox-image-container {
          max-width: 85%;
          max-height: 80vh;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .lightbox-image-container.zoomed {
          transform: scale(1.4);
          cursor: zoom-out;
        }

        .lightbox-active-img {
          max-width: 100%;
          max-height: 75vh;
          object-fit: contain;
          border-radius: var(--radius-md);
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8);
          cursor: zoom-in;
        }

        .lightbox-thumbnails-row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.5rem 0;
          overflow-x: auto;
        }

        .thumb-item {
          width: 60px;
          height: 45px;
          border-radius: var(--radius-sm);
          overflow: hidden;
          border: 2px solid transparent;
          opacity: 0.5;
          cursor: pointer;
          transition: all var(--transition-fast);
          flex-shrink: 0;
        }

        .thumb-item img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .thumb-item:hover, .thumb-item.active {
          opacity: 1;
          border-color: #00B4D8;
          transform: scale(1.08);
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @media (max-width: 640px) {
          .nav-arrow-btn.left { left: 8px; }
          .nav-arrow-btn.right { right: 8px; }
          .lightbox-place-title { font-size: 0.875rem; }
        }
      `}</style>
    </div>
  );
};
