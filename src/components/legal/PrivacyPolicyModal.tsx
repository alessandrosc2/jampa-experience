import React from 'react';
import { ShieldCheck, Lock, CheckCircle2, Eye, Server, FileText } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({
  isOpen,
  onClose
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="720px"
      title={
        <div className="legal-modal-title">
          <ShieldCheck size={22} color="#00B4D8" />
          <span>Privacidade, Proteção de Dados (LGPD) & Termos</span>
        </div>
      }
    >
      <div className="legal-modal-content">
        <div className="legal-intro glass-panel">
          <p>
            O <strong>JAMPA EXPERIENCE</strong> valoriza a sua privacidade e segurança. Esta política explica de forma clara e transparente como coletamos, tratamos e protegemos suas informações de acordo com a <strong>Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018)</strong> e o Marco Civil da Internet.
          </p>
        </div>

        <div className="legal-section">
          <h3>1. Dados Coletados e Finalidade</h3>
          <ul>
            <li>
              <strong>Geolocalização do Dispositivo:</strong> Utilizada única e exclusivamente de forma anônima no seu próprio navegador para calcular a distância física em quilômetros (km) entre sua posição atual e os pontos turísticos de João Pessoa. Não rastreamos ou armazenamos seu histórico de movimentação.
            </li>
            <li>
              <strong>Dados de Cadastro e Compra (Membros VIP):</strong> Nome completo, e-mail e comprovante de transação (PIX / Stripe) coletados estritamente para liberação do acesso vitalício ao conteúdo exclusivo e suporte.
            </li>
            <li>
              <strong>Favoritos e Preferências:</strong> Armazenados localmente no seu aparelho (LocalStorage) para permitir que você consulte seus locais salvos mesmo offline na praia.
            </li>
          </ul>
        </div>

        <div className="legal-section">
          <h3>2. Processamento Seguro de Pagamentos</h3>
          <p>
            Todos os pagamentos com cartão são processados diretamente na infraestrutura certificada PCI-DSS Nível 1 da <strong>Stripe</strong>. Transações via PIX são realizadas diretamente no padrão do <strong>Banco Central do Brasil</strong>. O JAMPA EXPERIENCE não armazena números de cartões de crédito nem códigos de segurança.
          </p>
        </div>

        <div className="legal-section">
          <h3>3. Não Compartilhamento de Dados</h3>
          <p>
            Nenhum dado pessoal de turistas ou compradores é vendido, alugado ou compartilhado com redes de publicidade de terceiros.
          </p>
        </div>

        <div className="legal-section">
          <h3>4. Direitos do Titular (LGPD)</h3>
          <p>
            Você pode a qualquer momento solicitar a confirmação, correção, anonimização ou exclusão definitiva dos seus dados de cadastro entrando em contato com nosso Encarregado de Proteção de Dados (DPO) pelo canal de atendimento oficial.
          </p>
        </div>

        <div className="legal-footer">
          <Button variant="gold" size="md" fullWidth onClick={onClose}>
            Entendido e Concordo
          </Button>
        </div>
      </div>

      <style>{`
        .legal-modal-title {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-family: var(--font-display);
          font-size: 1.125rem;
          font-weight: 700;
          color: #F8FAFC;
        }

        .legal-modal-content {
          display: flex;
          flex-direction: column;
          gap: var(--space-md);
          max-height: 70vh;
          overflow-y: auto;
          padding-right: 0.5rem;
          color: #CBD5E1;
          font-size: 0.875rem;
          line-height: 1.6;
        }

        .legal-intro {
          padding: 1rem;
          background: rgba(0, 180, 216, 0.08);
          border: 1px solid rgba(0, 180, 216, 0.25);
          border-radius: var(--radius-md);
          color: #E2E8F0;
        }

        .legal-section {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }

        .legal-section h3 {
          font-size: 0.9375rem;
          font-weight: 700;
          color: #F8FAFC;
        }

        .legal-section ul {
          padding-left: 1.2rem;
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }

        .legal-section li strong {
          color: #38BDF8;
        }

        .legal-footer {
          margin-top: var(--space-sm);
          padding-top: var(--space-sm);
          border-top: 1px solid var(--border-subtle);
        }
      `}</style>
    </Modal>
  );
};
