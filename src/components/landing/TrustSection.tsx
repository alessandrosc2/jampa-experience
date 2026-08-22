import React from 'react';
import { ShieldCheck, Lock, CreditCard, Infinity, UserCheck, Smartphone } from 'lucide-react';

export const TrustSection: React.FC = () => {
  const trustPillars = [
    {
      icon: <Lock size={24} color="#00B4D8" />,
      title: 'Pagamento 100% Blindado',
      desc: 'Transações criptografadas com os mais altos padrões bancários via PIX e Cartão.'
    },
    {
      icon: <Infinity size={24} color="#F4A261" />,
      title: 'Acesso Vitalício Real',
      desc: 'Sem taxas escondidas, sem cobrança recorrente e sem expiração de conta.'
    },
    {
      icon: <UserCheck size={24} color="#10B981" />,
      title: 'Conta Pessoal Segura',
      desc: 'Seus favoritos, anotações de viagem e preferências salvas na nuvem.'
    },
    {
      icon: <Smartphone size={24} color="#38BDF8" />,
      title: 'Multi-Dispositivos',
      desc: 'Abra no celular enquanto caminha na orla ou no computador planejando o roteiro.'
    }
  ];

  return (
    <section className="trust-section">
      <div className="container">
        <div className="trust-grid">
          {trustPillars.map((item, idx) => (
            <div key={idx} className="trust-card glass-panel">
              <div className="trust-card-icon">{item.icon}</div>
              <h4 className="trust-card-title">{item.title}</h4>
              <p className="trust-card-desc">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .trust-section {
          padding: var(--space-2xl) 0 var(--space-4xl);
        }

        .trust-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: var(--space-lg);
        }

        .trust-card {
          padding: var(--space-xl);
          background: rgba(12, 20, 31, 0.7);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-lg);
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          transition: transform var(--transition-fast);
        }

        .trust-card:hover {
          transform: translateY(-3px);
          border-color: var(--border-medium);
        }

        .trust-card-icon {
          width: 44px;
          height: 44px;
          border-radius: var(--radius-md);
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--border-subtle);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: var(--space-xs);
        }

        .trust-card-title {
          font-family: var(--font-display);
          font-size: 1.05rem;
          font-weight: 700;
          color: #F8FAFC;
        }

        .trust-card-desc {
          font-size: 0.8125rem;
          color: #94A3B8;
          line-height: 1.5;
        }
      `}</style>
    </section>
  );
};
