import React from 'react';
import {
  Sparkles,
  Check,
  X,
  MapPin,
  Compass,
  Lightbulb,
  Smartphone,
  Infinity,
  DollarSign,
  Heart
} from 'lucide-react';
import { Badge } from '../common/Badge';

export const ComparisonSection: React.FC = () => {
  const highlights = [
    {
      icon: <Compass size={22} color="#00B4D8" />,
      title: 'Tudo em um só lugar',
      desc: 'Praias, alta gastronomia, passeios náuticos, cultura e noites vibrantes reunidos num app fluido.'
    },
    {
      icon: <MapPin size={22} color="#F4A261" />,
      title: 'Localização Inteligente',
      desc: 'Rotas integradas em 1 toque no Google Maps, Apple Maps e Waze com coordenadas precisas.'
    },
    {
      icon: <Lightbulb size={22} color="#10B981" />,
      title: 'Dicas de Quem Vive em Jampa',
      desc: 'Segredos da maré baixa, onde estacionar sem flanelinha e o prato com melhor custo-benefício.'
    },
    {
      icon: <Compass size={22} color="#A78BFA" />,
      title: 'Roteiros Prontos & Otimizados',
      desc: 'Roteiros de 1, 3 e 5 dias, gastronômico, romântico e econômico para você não perder tempo.'
    },
    {
      icon: <Heart size={22} color="#E76F51" />,
      title: 'Lugares Favoritos & Notas',
      desc: 'Salve os pontos imperdíveis da sua viagem e monte o seu itinerário dos sonhos personalizado.'
    },
    {
      icon: <Smartphone size={22} color="#38BDF8" />,
      title: 'Funciona Perfeito no Celular',
      desc: 'PWA instalável, ultra-rápido, sem propagandas invasivas e pronto para consultar na praia.'
    },
    {
      icon: <Infinity size={22} color="#F59E0B" />,
      title: 'Acesso Vitalício sem Mensalidade',
      desc: 'Pague uma única vez. Acesse todas as atualizações de novos locais para sempre.'
    },
    {
      icon: <DollarSign size={22} color="#2EC4B6" />,
      title: 'Apenas R$ 39,90',
      desc: 'Menos do que o valor de um único drinque à beira-mar para transformar todas as suas férias.'
    }
  ];

  const comparisonRows = [
    {
      feature: 'Experiência 3D Interativa e Moderna',
      traditional: false,
      blogs: false,
      jampa: true
    },
    {
      feature: 'Tábua de Marés e Horários Ideais de Visita',
      traditional: false,
      blogs: 'Parcial / Desatualizado',
      jampa: '100% Preciso & Verificado'
    },
    {
      feature: 'Integração Direta com GPS (Waze / Google / Apple)',
      traditional: false,
      blogs: false,
      jampa: true
    },
    {
      feature: 'Roteiros Inteligentes Passo a Passo',
      traditional: 'Genérico',
      blogs: 'Poluído de Anúncios',
      jampa: 'Otimizados por Região'
    },
    {
      feature: 'Sem Propagandas Chutas ou Banners Invasivos',
      traditional: true,
      blogs: false,
      jampa: true
    },
    {
      feature: 'Modelo de Pagamento',
      traditional: 'R$ 60 - R$ 90 (Livro)',
      blogs: 'Gratuito com 100 anúncios',
      jampa: 'R$ 39,90 Único (Vitalício)'
    }
  ];

  return (
    <section className="comparison-section" id="comparativo">
      <div className="container">
        <div className="comparison-header">
          <Badge variant="gold" icon={<Sparkles size={14} />}>
            POR QUE ESCOLHER O JAMPA EXPERIENCE?
          </Badge>
          <h2 className="comparison-heading">
            A forma mais inteligente de <span className="text-gold">viajar por Jampa</span>
          </h2>
          <p className="comparison-sub">
            Esqueça panfletos velhos e blogs lotados de anúncios que só fazem você perder tempo nas férias.
          </p>
        </div>

        {/* Grade dos 8 Benefícios Cardinais */}
        <div className="highlights-grid">
          {highlights.map((item, idx) => (
            <div key={idx} className="highlight-card glass-panel">
              <div className="highlight-icon-box">{item.icon}</div>
              <h3 className="highlight-title">{item.title}</h3>
              <p className="highlight-desc">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Tabela Comparativa de Mercado */}
        <div className="comparison-table-wrap glass-panel">
          <h3 className="table-heading">Comparativo Direto de Experiência</h3>

          <div className="table-responsive">
            <table className="comp-table">
              <thead>
                <tr>
                  <th className="th-feature">Recursos & Benefícios</th>
                  <th className="th-other">Guias Impressos / PDFs</th>
                  <th className="th-other">Blogs do Google</th>
                  <th className="th-jampa">
                    <div className="jampa-col-header">
                      <span>JAMPA EXPERIENCE</span>
                      <span className="premium-badge">PREMIUM</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row, idx) => (
                  <tr key={idx}>
                    <td className="td-feature">{row.feature}</td>
                    <td className="td-other">
                      {typeof row.traditional === 'boolean' ? (
                        row.traditional ? <Check size={18} color="#10B981" /> : <X size={18} color="#EF4444" />
                      ) : (
                        row.traditional
                      )}
                    </td>
                    <td className="td-other">
                      {typeof row.blogs === 'boolean' ? (
                        row.blogs ? <Check size={18} color="#10B981" /> : <X size={18} color="#EF4444" />
                      ) : (
                        row.blogs
                      )}
                    </td>
                    <td className="td-jampa">
                      {typeof row.jampa === 'boolean' ? (
                        <div className="jampa-check-wrap">
                          <Check size={20} color="#00B4D8" />
                          <span className="jampa-check-text">Incluso</span>
                        </div>
                      ) : (
                        <span className="jampa-custom-text">{row.jampa}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <style>{`
        .comparison-section {
          padding: var(--space-4xl) 0;
          background: linear-gradient(180deg, transparent 0%, rgba(12, 20, 31, 0.6) 50%, transparent 100%);
        }

        .comparison-header {
          text-align: center;
          max-width: 680px;
          margin: 0 auto var(--space-3xl);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--space-xs);
        }

        .comparison-heading {
          font-size: clamp(1.85rem, 3.8vw, 2.75rem);
          color: #F8FAFC;
        }

        .text-gold {
          color: #F4A261;
        }

        .comparison-sub {
          font-size: 1rem;
          color: #94A3B8;
        }

        .highlights-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: var(--space-lg);
          margin-bottom: var(--space-3xl);
        }

        .highlight-card {
          padding: var(--space-xl);
          display: flex;
          flex-direction: column;
          gap: var(--space-xs);
          background: rgba(12, 20, 31, 0.75);
          border: 1px solid var(--border-subtle);
          transition: transform var(--transition-normal), border-color var(--transition-normal);
        }

        .highlight-card:hover {
          transform: translateY(-4px);
          border-color: rgba(244, 162, 97, 0.4);
        }

        .highlight-icon-box {
          width: 48px;
          height: 48px;
          border-radius: var(--radius-md);
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--border-subtle);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: var(--space-xs);
        }

        .highlight-title {
          font-family: var(--font-display);
          font-size: 1.15rem;
          font-weight: 700;
          color: #F8FAFC;
        }

        .highlight-desc {
          font-size: 0.875rem;
          color: #94A3B8;
          line-height: 1.55;
        }

        .comparison-table-wrap {
          padding: var(--space-2xl);
          background: rgba(10, 17, 26, 0.95);
          border: 1px solid rgba(0, 180, 216, 0.25);
          border-radius: var(--radius-xl);
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.5);
        }

        .table-heading {
          font-size: 1.35rem;
          color: #F8FAFC;
          margin-bottom: var(--space-lg);
          text-align: center;
        }

        .table-responsive {
          overflow-x: auto;
        }

        .comp-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }

        .comp-table th, .comp-table td {
          padding: 1.1rem 1.25rem;
          border-bottom: 1px solid var(--border-subtle);
        }

        .th-feature {
          font-size: 0.875rem;
          color: #94A3B8;
          width: 38%;
        }

        .th-other {
          font-size: 0.8125rem;
          color: #64748B;
          text-align: center;
          width: 20%;
        }

        .th-jampa {
          width: 22%;
          background: rgba(0, 180, 216, 0.08);
          border-top-left-radius: var(--radius-md);
          border-top-right-radius: var(--radius-md);
          text-align: center;
        }

        .jampa-col-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.2rem;
          font-family: var(--font-display);
          font-size: 0.875rem;
          font-weight: 800;
          color: #00B4D8;
        }

        .premium-badge {
          font-size: 0.625rem;
          font-weight: 800;
          background: linear-gradient(135deg, #F4A261 0%, #E76F51 100%);
          color: #060B11;
          padding: 0.1rem 0.4rem;
          border-radius: var(--radius-full);
          letter-spacing: 0.05em;
        }

        .td-feature {
          font-size: 0.9375rem;
          color: #E2E8F0;
          font-weight: 600;
        }

        .td-other {
          text-align: center;
          font-size: 0.8125rem;
          color: #64748B;
        }

        .td-jampa {
          background: rgba(0, 180, 216, 0.08);
          text-align: center;
        }

        .jampa-check-wrap {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.35rem;
        }

        .jampa-check-text {
          font-size: 0.8125rem;
          font-weight: 700;
          color: #38BDF8;
        }

        .jampa-custom-text {
          font-size: 0.875rem;
          font-weight: 800;
          color: #F4A261;
        }

        @media (max-width: 768px) {
          .comparison-table-wrap {
            padding: var(--space-md);
          }
          .comp-table th, .comp-table td {
            padding: 0.75rem 0.5rem;
          }
        }
      `}</style>
    </section>
  );
};
