import React from 'react';
import { Compass, ShieldCheck, Heart, MapPin, CheckCircle2 } from 'lucide-react';

interface FooterProps {
  isVipMode?: boolean;
  onOpenPrivacyModal?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ isVipMode = false, onOpenPrivacyModal }) => {
  return (
    <footer className="site-footer">
      <div className="container footer-container">
        <div className="footer-top-grid">
          {/* Marca & Slogan */}
          <div className="footer-brand-col">
            <div className="footer-logo">
              <div className="footer-logo-icon">
                <Compass size={22} color="#00B4D8" />
              </div>
              <div className="footer-logo-text">
                <span className="brand-main">JAMPA<span className="brand-accent">EXPERIENCE</span></span>
                <span className="brand-sub">GUIA TURÍSTICO PREMIUM</span>
              </div>
            </div>

            <p className="footer-slogan">
              "Extraia o melhor que Jampa tem a oferecer."
            </p>
            <p className="footer-about">
              A plataforma definitiva para explorar praias, restaurantes premiados, falésias e passeios náuticos em João Pessoa — Paraíba.
            </p>

            <div className="footer-location-tag">
              <MapPin size={14} color="#F4A261" />
              <span>João Pessoa, Paraíba • Brasil</span>
            </div>
          </div>

          {/* Categorias Principais */}
          <div className="footer-links-col">
            <h5 className="footer-col-title">Explorar Jampa</h5>
            <ul className="footer-links-list">
              <li><a href="#previa">Praias & Recifes</a></li>
              <li><a href="#previa">Restaurantes & Gastronomia</a></li>
              <li><a href="#roteiros">Roteiros de 1, 3 e 5 Dias</a></li>
              <li><a href="#mapa">Mapa Turístico com GPS</a></li>
              <li><a href="#previa">Centro Histórico & Cultura</a></li>
            </ul>
          </div>

          {/* Informações Comerciais ou Área de Membros */}
          <div className="footer-links-col">
            {isVipMode ? (
              <>
                <h5 className="footer-col-title">Área do Membro VIP</h5>
                <ul className="footer-links-list">
                  <li><a href="#previa">Locais & Dicas Liberados</a></li>
                  <li><a href="#roteiros">8 Roteiros Completos</a></li>
                  <li><a href="#mapa">Mapa GPS Interativo</a></li>
                  <li><a href="#previa">Avaliações de Turistas</a></li>
                </ul>
              </>
            ) : (
              <>
                <h5 className="footer-col-title">Acesso & Planos</h5>
                <ul className="footer-links-list">
                  <li><a href="#oferta">Acesso Vitalício (R$ 39,90)</a></li>
                  <li><a href="#comparativo">Por que usar o Jampa Experience</a></li>
                  <li><a href="#oferta">Garantia de 7 Dias</a></li>
                  <li><a href="#oferta">Pagamento via PIX ou Cartão</a></li>
                </ul>
              </>
            )}
          </div>

          {/* Segurança & Suporte */}
          <div className="footer-links-col">
            <h5 className="footer-col-title">Segurança & Suporte</h5>
            <div className="footer-security-box glass-panel">
              {isVipMode ? (
                <>
                  <CheckCircle2 size={20} color="#10B981" />
                  <div className="sec-text">
                    <strong>Acesso Vitalício Ativo</strong>
                    <span>Licença definitiva verificada</span>
                  </div>
                </>
              ) : (
                <>
                  <ShieldCheck size={20} color="#10B981" />
                  <div className="sec-text">
                    <strong>Compra 100% Segura</strong>
                    <span>Criptografia SSL 256-bit</span>
                  </div>
                </>
              )}
            </div>

            <p className="footer-support-note">
              Suporte oficial: <br />
              <a href="mailto:jampaexperience@gmail.com" className="support-email">
                jampaexperience@gmail.com
              </a>
            </p>
          </div>
        </div>

        {/* Linha Divisória e Rodapé Inferior */}
        <div className="footer-bottom-row">
          <div className="copyright-group">
            <p className="copyright-text">
              © 2026 JAMPA EXPERIENCE. Todos os direitos reservados.
            </p>
            {onOpenPrivacyModal && (
              <button
                type="button"
                className="footer-privacy-btn"
                onClick={onOpenPrivacyModal}
              >
                Privacidade & Termos (LGPD)
              </button>
            )}
          </div>

          <div className="developer-credit-group">
            <span>Criado e desenvolvido por</span>
            <a
              href="https://multyplique.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="developer-link"
              title="Acessar Multy Technology"
            >
              <strong>Multy Technology</strong>
            </a>
          </div>

          <div className="made-with-love">
            Feito com <Heart size={14} fill="#E63946" color="#E63946" /> para apaixonados por João Pessoa
          </div>
        </div>
      </div>

      <style>{`
        .site-footer {
          background: #04070B;
          border-top: 1px solid var(--border-subtle);
          padding: var(--space-4xl) 0 var(--space-2xl);
          margin-top: var(--space-4xl);
        }

        .footer-container {
          display: flex;
          flex-direction: column;
          gap: var(--space-3xl);
        }

        .footer-top-grid {
          display: grid;
          grid-template-columns: 1.5fr 1fr 1fr 1.2fr;
          gap: var(--space-2xl);
        }

        .footer-brand-col {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .footer-logo {
          display: flex;
          align-items: center;
          gap: 0.65rem;
        }

        .footer-logo-icon {
          width: 36px;
          height: 36px;
          border-radius: var(--radius-md);
          background: rgba(0, 180, 216, 0.15);
          border: 1px solid rgba(0, 180, 216, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .footer-logo-text {
          display: flex;
          flex-direction: column;
        }

        .brand-main {
          font-family: var(--font-display);
          font-size: 1.1rem;
          font-weight: 800;
          color: #F8FAFC;
          letter-spacing: 0.05em;
        }

        .brand-accent {
          color: #00B4D8;
        }

        .brand-sub {
          font-size: 0.5625rem;
          font-weight: 700;
          letter-spacing: 0.15em;
          color: #F4A261;
        }

        .footer-slogan {
          font-style: italic;
          font-size: 0.875rem;
          color: #F4A261;
          font-weight: 600;
        }

        .footer-about {
          font-size: 0.8125rem;
          color: #94A3B8;
          line-height: 1.5;
        }

        .footer-location-tag {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.75rem;
          color: #CBD5E1;
          margin-top: 0.25rem;
        }

        .footer-col-title {
          font-family: var(--font-display);
          font-size: 0.875rem;
          font-weight: 800;
          color: #F8FAFC;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-bottom: var(--space-md);
        }

        .footer-links-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
        }

        .footer-links-list a {
          font-size: 0.8125rem;
          color: #94A3B8;
          transition: color var(--transition-fast);
        }

        .footer-links-list a:hover {
          color: #38BDF8;
        }

        .footer-security-box {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          padding: 0.75rem;
          background: rgba(12, 20, 31, 0.8);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          margin-bottom: var(--space-sm);
        }

        .sec-text {
          display: flex;
          flex-direction: column;
        }

        .sec-text strong {
          font-size: 0.75rem;
          color: #F8FAFC;
        }

        .sec-text span {
          font-size: 0.6875rem;
          color: #94A3B8;
        }

        .footer-support-note {
          font-size: 0.75rem;
          color: #64748B;
          line-height: 1.4;
        }

        .support-email {
          color: #00B4D8;
          font-weight: 600;
        }

        .footer-bottom-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: var(--space-lg);
          border-top: 1px solid var(--border-subtle);
          font-size: 0.75rem;
          color: #64748B;
          flex-wrap: wrap;
          gap: var(--space-md);
        }

        .copyright-group {
          display: flex;
          align-items: center;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .footer-privacy-btn {
          background: transparent;
          border: none;
          padding: 0;
          color: #38BDF8;
          font-size: 0.75rem;
          cursor: pointer;
          text-decoration: underline;
          text-underline-offset: 2px;
        }

        .footer-privacy-btn:hover {
          color: #00B4D8;
        }

        .developer-credit-group {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.75rem;
          color: #94A3B8;
        }

        .developer-link {
          color: #00B4D8;
          text-decoration: none;
          font-weight: 700;
          transition: color var(--transition-fast), text-shadow var(--transition-fast);
        }

        .developer-link:hover {
          color: #38BDF8;
          text-decoration: underline;
          text-underline-offset: 3px;
          text-shadow: 0 0 10px rgba(56, 189, 248, 0.4);
        }

        .made-with-love {
          display: flex;
          align-items: center;
          gap: 0.35rem;
        }

        @media (max-width: 960px) {
          .footer-top-grid {
            grid-template-columns: 1fr 1fr;
          }
        }

        @media (max-width: 768px) {
          .site-footer {
            padding-bottom: calc(var(--space-3xl) + 4.5rem);
          }
          .footer-bottom-row {
            flex-direction: column;
            align-items: center;
            text-align: center;
            gap: 0.75rem;
          }
          .copyright-group {
            justify-content: center;
          }
        }

        @media (max-width: 540px) {
          .footer-top-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </footer>
  );
};
