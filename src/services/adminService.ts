import { AdminMetrics, SystemLog } from '../types/admin';
import { Place, CategoryInfo, SecretTip, CategoryId, PlaceImage, PartnerTrackingEvent, Partner, Modality, Topic, Neighborhood } from '../types/place';
import { Itinerary } from '../types/itinerary';
import { User } from '../types/user';
import { CATEGORIES as INITIAL_CATEGORIES } from '../data/categories';
import { MOCK_PLACES } from '../data/mockPlaces';
import { MOCK_ITINERARIES } from '../data/mockItineraries';
import { authService } from './authService';
import { paymentService } from './paymentService';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const STORAGE_CUSTOM_PLACES_KEY = 'jampa_admin_custom_places';
const STORAGE_DELETED_PLACES_KEY = 'jampa_admin_deleted_places';
const STORAGE_CATEGORIES_KEY = 'jampa_admin_categories';
const STORAGE_MODALITIES_KEY = 'jampa_admin_modalities';
const STORAGE_TOPICS_KEY = 'jampa_admin_topics';
const STORAGE_NEIGHBORHOODS_KEY = 'jampa_admin_neighborhoods';
const STORAGE_PARTNERS_KEY = 'jampa_admin_partners';
const STORAGE_ITINERARIES_KEY = 'jampa_admin_itineraries';
const STORAGE_ADMIN_LOGS_KEY = 'jampa_admin_system_logs';
const STORAGE_PARTNER_CLICKS_KEY = 'jampa_partner_clicks_metrics';

export const INITIAL_NEIGHBORHOODS: Neighborhood[] = [
  {
    id: 'manaira',
    name: 'Praia de Manaíra',
    slug: 'manaira',
    description: 'Polo gastronômico e orla nobre com calçadão movimentado, excelentes restaurantes, bistrôs e conveniências.',
    coverImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    tips: [
      'O calçadão da orla fica fechado para veículos diariamente das 05h às 08h da manhã para caminhada e esportes.',
      'As ruas paralelas à Av. Edson Ramalho oferecem vagas de estacionamento fáceis e tranquilas.',
      'Excelente polo para quem busca alta gastronomia regional e frutos do mar a poucos metros da praia.'
    ],
    position: 1
  },
  {
    id: 'tambau',
    name: 'Praia de Tambaú',
    slug: 'tambau',
    description: 'O epicentro turístico de João Pessoa, de onde partem os catamarãs para Picãozinho e onde fica a famosa Feirinha de Artesanato.',
    coverImage: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80',
    tips: [
      'Ponto central de encontro da cidade com infraestrutura completa para fazer tudo a pé.',
      'Consulte a tábua de marés antes de agendar o catamarã para as piscinas de Picãozinho (maré ideal abaixo de 0.4m).',
      'Visite a Feirinha de Tambaú e o Mercado de Artesanato ao entardecer para encontrar algodão colorido e peças autorais.'
    ],
    position: 2
  },
  {
    id: 'cabo-branco',
    name: 'Praia de Cabo Branco',
    slug: 'cabo-branco',
    description: 'Orla tranquila com ciclovia plana, coqueirais e quiosques refinados de frutos do mar com vista para as falésias.',
    coverImage: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1200&q=80',
    tips: [
      'A avenida principal fecha diariamente das 05h às 08h da manhã para caminhadas, patins e ciclismo.',
      'Os quiosques no final da orla são mais calmos e ideais para relaxar e apreciar o entardecer.',
      'Águas calmas e agradáveis para banho de mar em família com ampla faixa de areia.'
    ],
    position: 3
  },
  {
    id: 'bessa',
    name: 'Praia do Bessa (Caribessa)',
    slug: 'bessa',
    description: 'Águas cristalinas protegidas por arrecifes de corais, point para caiaque, stand-up paddle e quiosques charmosos.',
    coverImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    tips: [
      'Na maré baixa, o mar transforma-se em uma piscina cristalina sem ondas — perfeito para esportes de remo.',
      'Chegue cedo para conseguir vagas e mesas sombreadas nos quiosques à beira-mar.',
      'Área residencial tranquila com ambiente muito familiar e acolhedor.'
    ],
    position: 4
  },
  {
    id: 'seixas',
    name: 'Ponta do Seixas & Farol',
    slug: 'seixas',
    description: 'O ponto mais oriental das Américas continentais, com o emblemático Farol do Cabo Branco e piscinas naturais repletas de corais.',
    coverImage: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80',
    tips: [
      'O sol nasce primeiro aqui! O mirante do Farol oferece uma vista inesquecível do nascer do sol.',
      'Embarque para as Piscinas Naturais do Seixas para um mergulho com peixes coloridos na maré baixa.',
      'Combine a visita ao Farol com a Estação Cabo Branco projetada por Oscar Niemeyer.'
    ],
    position: 5
  },
  {
    id: 'centro-historico',
    name: 'Centro Histórico & Sanhauá',
    slug: 'centro-historico',
    description: 'O berço da terceira cidade mais antiga do Brasil, com arquitetura barroca e art déco do século XVI, casarios coloridos e praças.',
    coverImage: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1200&q=80',
    tips: [
      'Visite o Centro Cultural São Francisco, uma das maiores joias barrocas da América Latina.',
      'O entardecer no Hotel Globo com vista para o Rio Sanhauá é parada obrigatória.',
      'Prefira passeios diurnos e utilize calçados confortáveis para caminhar pelas ladeiras históricas.'
    ],
    position: 6
  },
  {
    id: 'cabedelo',
    name: 'Cabedelo & Praia do Jacaré',
    slug: 'cabedelo',
    description: 'Região metropolitana ao norte, famosa pelo espetáculo do pôr do sol na Praia do Jacaré, praias de Intermares e Poço.',
    coverImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    tips: [
      'Chegue à Praia do Jacaré até as 16h30 para garantir mesa nos restaurantes flutuantes antes do Bolero de Ravel.',
      'Intermares é excelente para a prática de surf e kitesurf nos dias de vento.',
      'Na maré baixa, consulte passeios de catamarã para a Ilha de Areia Vermelha.'
    ],
    position: 7
  },
  {
    id: 'costa-do-conde',
    name: 'Costa do Conde (Litoral Sul)',
    slug: 'costa-do-conde',
    description: 'Litoral Sul selvagem com cânions coloridos de argila, coqueirais e praias paradisíacas como Coqueirinho e Tambaba.',
    coverImage: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80',
    tips: [
      'O Mirante Dedo de Deus em Coqueirinho rende as fotos panorâmicas mais impressionantes da Paraíba.',
      'Passeios de buggy ou 4x4 são a melhor maneira de acessar as trilhas dos cânions e praias mais desertas.',
      'Experimente os caldinhos e peixes frescos nas barracas tradicionais à beira-mar.'
    ],
    position: 8
  }
];

export const INITIAL_TOPICS: Topic[] = [
  { id: 'gastronomia', name: 'Gastronomia', slug: 'gastronomia', description: 'Os melhores restaurantes, bistrôs e sabores regionais e contemporâneos do bairro.', iconName: 'UtensilsCrossed', accentColor: '#F4A261', position: 1 },
  { id: 'bares-botecos', name: 'Bares & Botecos', slug: 'bares-botecos', description: 'Points animados, drinks autorais, chopp artesanal e petiscos.', iconName: 'GlassWater', accentColor: '#E76F51', position: 2 },
  { id: 'servicos', name: 'Serviços & Conveniências', slug: 'servicos', description: 'Salões de beleza, barbearias, conveniências e facilidades locais.', iconName: 'Scissors', accentColor: '#10B981', position: 3 },
  { id: 'saude', name: 'Saúde & Bem-Estar', slug: 'saude', description: 'Farmácias, clínicas, spas e cuidados de saúde.', iconName: 'HeartPulse', accentColor: '#06D6A0', position: 4 },
  { id: 'passeios', name: 'Passeios & Experiências', slug: 'passeios', description: 'Passeios náuticos, catamarãs, mirantes e atividades ao ar livre.', iconName: 'Compass', accentColor: '#0077B6', position: 5 },
  { id: 'vida-noturna', name: 'Vida Noturna', slug: 'vida-noturna', description: 'Casas de shows, forró autêntico, baladas e lounges noturnos.', iconName: 'Moon', accentColor: '#818CF8', position: 6 },
  { id: 'compras', name: 'Compras & Artesanato', slug: 'compras', description: 'Feiras de artesanato, lojas de souvenirs e centros comerciais.', iconName: 'ShoppingBag', accentColor: '#A78BFA', position: 7 },
  { id: 'cultura', name: 'Cultura & História', slug: 'cultura', description: 'Patrimônio histórico, centros culturais, museus e monumentos.', iconName: 'Landmark', accentColor: '#F59E0B', position: 8 },
  { id: 'praias', name: 'Praias & Piscinas Naturais', slug: 'praias', description: 'Faixas de areia, banho de mar, piscinas naturais e orla.', iconName: 'Umbrella', accentColor: '#00B4D8', position: 9 },
  { id: 'hospedagem', name: 'Hotéis & Pousadas', slug: 'hospedagem', description: 'Hospedagens aconchegantes e resorts à beira-mar.', iconName: 'Hotel', accentColor: '#2EC4B6', position: 10 }
];

export const INITIAL_MODALITIES: Modality[] = [
  { id: 'mod-praias', name: 'Praias', slug: 'praias', description: 'Praia, enseada ou ponto de banho de mar' },
  { id: 'mod-restaurante', name: 'Restaurante', slug: 'restaurante', description: 'Restaurante à la carte, buffet regional ou contemporâneo' },
  { id: 'mod-bar', name: 'Bar', slug: 'bar', description: 'Bar, boteco, pub ou choperia com petiscos' },
  { id: 'mod-cafe', name: 'Café / Bistrô', slug: 'cafe', description: 'Cafeteria especial, brunchs e docerias' },
  { id: 'mod-quiosque', name: 'Quiosque de Praia', slug: 'quiosque', description: 'Quiosque gastronômico ou de praia na orla' },
  { id: 'mod-salao', name: 'Salão de Beleza', slug: 'salao-beleza', description: 'Salão de beleza, cabeleireiro e estética' },
  { id: 'mod-barbearia', name: 'Barbearia', slug: 'barbearia', description: 'Barbearia e cuidados masculinos' },
  { id: 'mod-farmacia', name: 'Farmácia', slug: 'farmacia', description: 'Farmácia e drogarias 24h' },
  { id: 'mod-clinica', name: 'Clínica / Spa', slug: 'clinica', description: 'Clínica de saúde, bem-estar ou massagem' },
  { id: 'mod-nautico', name: 'Passeio Náutico', slug: 'nautico', description: 'Catamarã, lancha ou embarcação para piscinas naturais' },
  { id: 'mod-balada', name: 'Casa de Shows / Forró', slug: 'balada', description: 'Casa de shows, forró ou lounge noturno' },
  { id: 'mod-loja', name: 'Artesanato / Loja', slug: 'loja', description: 'Mercado de artesanato ou loja de artigos regionais' },
  { id: 'mod-hotel', name: 'Hotel / Pousada', slug: 'hotel', description: 'Hotel, resort ou pousada de charme' },
  { id: 'mod-patrimonio', name: 'Patrimônio Histórico', slug: 'patrimonio', description: 'Igreja barroca, convento ou museu' },
  { id: 'mod-mirante', name: 'Ponto Turístico / Mirante', slug: 'mirante', description: 'Mirante panorâmico, farol ou monumento' }
];

export const INITIAL_PARTNERS: Partner[] = [
  {
    id: 'partner-mangai',
    placeId: 'praia-de-manaira',
    name: 'Mangaí Restaurante',
    description: 'Restaurante especializado em gastronomia regional paraibana e nordestina, localizado em Manaíra com ambiente aconchegante e mais de 200 opções tradicionais.',
    address: 'Av. Edson Ramalho, 696 - Manaíra, João Pessoa - PB',
    googleMapsUrl: 'https://maps.google.com/?q=Mangai+Manaira+Joao+Pessoa',
    benefit: '10% de desconto no buffet de almoço e jantar para membros VIP',
    partnershipLevel: 'Diamante',
    couponCode: 'JAMPA10',
    redemptionInstructions: 'Apresente o cupom digital JAMPA10 ao garçom no momento de fechar a conta.',
    whatsapp: '83999991111',
    instagram: '@mangairestaurante',
    phone: '8332461244',
    website: 'https://www.mangai.com.br',
    active: true,
    createdAt: '2026-08-01T10:00:00.000Z',
    updatedAt: '2026-08-01T10:00:00.000Z'
  },
  {
    id: 'partner-bar-cuscuz',
    placeId: 'praia-de-manaira',
    name: 'Bar do Cuscuz Manaíra',
    description: 'O point mais tradicional da orla de João Pessoa, famoso por sua gastronomia autêntica, cuscuz especial, carnes de sol e chopp geladíssimo com vista para o mar.',
    address: 'Av. João Maurício, 255 - Manaíra, João Pessoa - PB',
    googleMapsUrl: 'https://maps.google.com/?q=Bar+do+Cuscuz+Joao+Pessoa',
    benefit: '1 Welcome Drink ou Caipirinha regional de cortesia por mesa',
    partnershipLevel: 'Ouro',
    couponCode: 'CUSCUZJAMPA',
    redemptionInstructions: 'Apresente seu cartão virtual JAMPA EXPERIENCE ou mencione o cupom ao maître.',
    whatsapp: '83999992222',
    instagram: '@bardocuscuzoficial',
    phone: '8332471010',
    website: 'https://www.bardocuscuz.com.br',
    active: true,
    createdAt: '2026-08-01T10:00:00.000Z',
    updatedAt: '2026-08-01T10:00:00.000Z'
  },
  {
    id: 'partner-nau',
    placeId: 'praia-de-tambau',
    name: 'NAU Frutos do Mar',
    description: 'Arquitetura contemporânea deslumbrante e gastronomia especializada em frutos do mar, camarões especiais, peixes frescos e harmonização de vinhos.',
    address: 'R. Lupércio Branco, 130 - Manaíra / Tambaú, João Pessoa - PB',
    googleMapsUrl: 'https://maps.google.com/?q=NAU+Frutos+do+Mar+Joao+Pessoa',
    benefit: '15% de desconto no jantar à la carte para membros',
    partnershipLevel: 'Diamante',
    couponCode: 'NAUJAMPA15',
    redemptionInstructions: 'Válido para pedidos no jantar de terça a domingo apresentando o cupom digital.',
    whatsapp: '83999993333',
    instagram: '@naufrutosdomar',
    phone: '8332472333',
    website: 'https://www.naufrutosdomar.com.br',
    active: true,
    createdAt: '2026-08-01T10:00:00.000Z',
    updatedAt: '2026-08-01T10:00:00.000Z'
  },
  {
    id: 'partner-catamara',
    placeId: 'praia-de-tambau',
    name: 'Catamarã Tambaú Aventuras',
    description: 'Operadora náutica oficial para as piscinas naturais de Picãozinho e Seixas com catamarãs modernos, biólogos a bordo e aluguel de snorkel.',
    address: 'Av. Almirante Tamandaré (Ponto Náutico de Tambaú), João Pessoa - PB',
    googleMapsUrl: 'https://maps.google.com/?q=Ponto+Embarque+Tambau+Picaozinho',
    benefit: '20% de desconto no passeio náutico com foto subaquática cortesia',
    partnershipLevel: 'Ouro',
    couponCode: 'PICAOJAMPA20',
    redemptionInstructions: 'Adquira antecipadamente pelo WhatsApp informando o código PICAOJAMPA20.',
    whatsapp: '83999994444',
    instagram: '@tambauaventuras',
    phone: '83999994444',
    website: 'https://tambauaventuras.com.br',
    active: true,
    createdAt: '2026-08-01T10:00:00.000Z',
    updatedAt: '2026-08-01T10:00:00.000Z'
  },
  {
    id: 'partner-olho-lula',
    placeId: 'praia-de-cabo-branco',
    name: 'Quiosque Olho da Lula',
    description: 'Gastronomia à beira-mar na Praia de Cabo Branco com os melhores petiscos de frutos do mar, caranguejo e água de coco gelada.',
    address: 'Av. Cabo Branco, quiosque 12, João Pessoa - PB',
    googleMapsUrl: 'https://maps.google.com/?q=Quiosque+Olho+da+Lula+Cabo+Branco',
    benefit: '1 Água de Coco gelada cortesia na compra de qualquer petisco',
    partnershipLevel: 'Prata',
    couponCode: 'LULAJAMPA',
    redemptionInstructions: 'Informe o código LULAJAMPA ao fazer o pedido do petisco.',
    whatsapp: '83999995555',
    instagram: '@olhodalulajp',
    active: true,
    createdAt: '2026-08-01T10:00:00.000Z',
    updatedAt: '2026-08-01T10:00:00.000Z'
  },
  {
    id: 'partner-caribessa',
    placeId: 'praia-do-bessa-caribessa',
    name: 'Caribessa Caiaque & Stand-up',
    description: 'Ponto oficial de esportes náuticos no Caribessa com aluguel de pranchas de SUP, caiaques transparentes de acrílico e instrutores credenciados.',
    address: 'Av. Gov. Argemiro de Figueiredo, Bessa, João Pessoa - PB',
    googleMapsUrl: 'https://maps.google.com/?q=Caribessa+Bessa+Joao+Pessoa',
    benefit: '30 minutos adicionais gratuitos em qualquer aluguel de prancha ou caiaque',
    partnershipLevel: 'Ouro',
    couponCode: 'CARIBESSA30',
    redemptionInstructions: 'Apresente o cupom CARIBESSA30 na recepção da tenda antes de iniciar o passeio.',
    whatsapp: '83999996666',
    instagram: '@caribessapb',
    active: true,
    createdAt: '2026-08-01T10:00:00.000Z',
    updatedAt: '2026-08-01T10:00:00.000Z'
  }
];

export interface PartnerStat {
  placeId: string;
  placeName: string;
  categoryLabel: string;
  partnerLevel: string;
  partnerBenefit?: string;
  views: number;
  whatsappClicks: number;
  mapsClicks: number;
  instagramClicks: number;
  websiteClicks: number;
  couponClicks: number;
  totalInteractions: number;
}

export interface QrChannel {
  id: string;
  name: string;
  locationCategory: string;
  sourceCode: string;
  scanCount: number;
  conversionCount: number;
  targetUrl: string;
}

function safeSetItem(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch (err: any) {
    console.warn(`Quota de armazenamento atingida ao salvar ${key}. Executando limpeza preventiva...`, err);
    try {
      localStorage.removeItem(STORAGE_ADMIN_LOGS_KEY);
      localStorage.setItem(key, value);
    } catch (e2) {
      console.error('Falha de armazenamento no localStorage:', e2);
    }
  }
}

class AdminService {
  /* ======================================================== */
  /* GESTÃO DE LOGS E AUDITORIA */
  /* ======================================================== */
  private getInitialLogs(): SystemLog[] {
    return [
      {
        id: 'log-101',
        timestamp: new Date().toLocaleString('pt-BR'),
        type: 'webhook_received',
        title: 'Sistema Jampa Experience Inicializado',
        details: 'Banco de dados e serviços carregados com sucesso.'
      }
    ];
  }

  public getSystemLogs(): SystemLog[] {
    const data = localStorage.getItem(STORAGE_ADMIN_LOGS_KEY);
    if (!data) {
      const initial = this.getInitialLogs();
      this.saveSystemLogs(initial);
      return initial;
    }
    try {
      return JSON.parse(data);
    } catch {
      return this.getInitialLogs();
    }
  }

  public addLog(log: Omit<SystemLog, 'id' | 'timestamp'>): void {
    const logs = this.getSystemLogs();
    const newLog: SystemLog = {
      id: 'log-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      timestamp: new Date().toLocaleString('pt-BR'),
      ...log
    };
    logs.unshift(newLog);
    this.saveSystemLogs(logs.slice(0, 80));
  }

  private saveSystemLogs(logs: SystemLog[]): void {
    try {
      safeSetItem(STORAGE_ADMIN_LOGS_KEY, JSON.stringify(logs));
    } catch (e) {
      console.warn('Não foi possível salvar logs no localStorage:', e);
    }
  }

  /* ======================================================== */
  /* MÉTRICAS & KPIS FINANCEIROS */
  /* ======================================================== */
  public getMetrics(): AdminMetrics {
    const transactions = paymentService.getTransactions();
    const users: User[] = authService.getRegisteredUsers();

    const lifetimeUsersCount = users.filter((u: User) => u.accessStatus === 'active').length;
    const pendingUsersCount = users.filter((u: User) => u.accessStatus !== 'active').length;

    const baseSales = 1420;
    const baseRevenue = baseSales * 39.90;
    const basePix = 980;
    const baseCard = 440;

    const actualNewSales = transactions.filter((t) => t.status === 'approved').length;
    const actualNewPix = transactions.filter((t) => t.status === 'approved' && t.paymentMethod === 'pix').length;
    const actualNewCard = transactions.filter((t) => t.status === 'approved' && t.paymentMethod === 'credit_card').length;

    const totalSales = baseSales + actualNewSales;
    const totalRevenue = baseRevenue + (actualNewSales * 39.90);

    return {
      totalRevenue,
      totalSales,
      conversionRate: 16.4,
      averageTicket: 39.90,
      pixSalesCount: basePix + actualNewPix,
      cardSalesCount: baseCard + actualNewCard,
      activeLifetimeUsers: lifetimeUsersCount + 890,
      pendingUsers: pendingUsersCount,
      refundsCount: 0
    };
  }

  /* ======================================================== */
  /* GESTÃO DE CATEGORIAS / MODALIDADES TURÍSTICAS */
  /* ======================================================== */
  public getCategories(): CategoryInfo[] {
    const data = localStorage.getItem(STORAGE_CATEGORIES_KEY);
    if (!data) {
      localStorage.setItem(STORAGE_CATEGORIES_KEY, JSON.stringify(INITIAL_CATEGORIES));
      return INITIAL_CATEGORIES;
    }
    try {
      return JSON.parse(data);
    } catch {
      return INITIAL_CATEGORIES;
    }
  }

  public saveCategory(category: CategoryInfo): void {
    const categories = this.getCategories();
    const index = categories.findIndex((c) => c.id === category.id);
    if (index >= 0) {
      categories[index] = category;
      this.addLog({
        type: 'place_updated',
        title: `Modalidade Atualizada: ${category.label}`,
        details: `Categoria ID ${category.id} foi alterada.`
      });
    } else {
      categories.push(category);
      this.addLog({
        type: 'place_created',
        title: `Nova Modalidade Criada: ${category.label}`,
        details: `Nova categoria turística adicionada.`
      });
    }
    safeSetItem(STORAGE_CATEGORIES_KEY, JSON.stringify(categories));
  }

  public deleteCategory(categoryId: string): void {
    const categories = this.getCategories().filter((c) => c.id !== categoryId);
    safeSetItem(STORAGE_CATEGORIES_KEY, JSON.stringify(categories));
    this.addLog({
      type: 'place_updated',
      title: `Modalidade Excluída: ${categoryId}`,
      details: `Categoria removida do catálogo.`
    });
  }

  /* ======================================================== */
  /* GESTÃO DE BAIRROS (PORTA DE ENTRADA DA EXPERIÊNCIA) */
  /* ======================================================== */
  public getNeighborhoods(): Neighborhood[] {
    const data = localStorage.getItem(STORAGE_NEIGHBORHOODS_KEY);
    if (!data) {
      localStorage.setItem(STORAGE_NEIGHBORHOODS_KEY, JSON.stringify(INITIAL_NEIGHBORHOODS));
      return INITIAL_NEIGHBORHOODS;
    }
    try {
      const parsed: Neighborhood[] = JSON.parse(data);
      return parsed.sort((a, b) => (a.position || 0) - (b.position || 0));
    } catch {
      return INITIAL_NEIGHBORHOODS;
    }
  }

  public getNeighborhoodById(idOrSlug: string): Neighborhood | undefined {
    const neighborhoods = this.getNeighborhoods();
    return neighborhoods.find(
      (n) => n.id.toLowerCase() === idOrSlug.toLowerCase() || n.slug.toLowerCase() === idOrSlug.toLowerCase()
    );
  }

  public saveNeighborhood(neighborhood: Neighborhood): Neighborhood {
    const neighborhoods = this.getNeighborhoods();
    const cleanNeighborhood: Neighborhood = {
      ...neighborhood,
      id: neighborhood.id || neighborhood.slug || `neigh-${Date.now()}`,
      slug: neighborhood.slug || neighborhood.id || `neigh-${Date.now()}`,
      tips: Array.isArray(neighborhood.tips) ? neighborhood.tips : []
    };

    const index = neighborhoods.findIndex((n) => n.id === cleanNeighborhood.id || n.slug === cleanNeighborhood.slug);
    if (index >= 0) {
      neighborhoods[index] = cleanNeighborhood;
      this.addLog({
        type: 'place_updated',
        title: `Bairro Atualizado: ${cleanNeighborhood.name}`,
        details: `Informações e dicas do bairro foram salvas.`
      });
    } else {
      cleanNeighborhood.position = neighborhoods.length + 1;
      neighborhoods.push(cleanNeighborhood);
      this.addLog({
        type: 'place_created',
        title: `Novo Bairro Criado: ${cleanNeighborhood.name}`,
        details: `Bairro adicionado ao catálogo.`
      });
    }

    safeSetItem(STORAGE_NEIGHBORHOODS_KEY, JSON.stringify(neighborhoods));

    if (isSupabaseConfigured() && supabase) {
      this.syncNeighborhoodToSupabase(cleanNeighborhood).catch((e) => {
        console.warn('Falha na sincronização do bairro no Supabase:', e);
      });
    }

    return cleanNeighborhood;
  }

  public deleteNeighborhood(neighborhoodId: string): void {
    const neighborhoods = this.getNeighborhoods();
    const target = neighborhoods.find((n) => n.id === neighborhoodId || n.slug === neighborhoodId);
    const updated = neighborhoods.filter((n) => n.id !== neighborhoodId && n.slug !== neighborhoodId);
    safeSetItem(STORAGE_NEIGHBORHOODS_KEY, JSON.stringify(updated));

    this.addLog({
      type: 'place_updated',
      title: `Bairro Excluído: ${target ? target.name : neighborhoodId}`,
      details: `Bairro removido do sistema.`
    });

    if (isSupabaseConfigured() && supabase) {
      supabase.from('neighborhoods').delete().eq('id', neighborhoodId).then(() => {});
    }
  }

  /* ======================================================== */
  /* GESTÃO DE TÓPICOS DINÂMICOS & SEÇÕES ORDENÁVEIS */
  /* ======================================================== */
  public getTopics(): Topic[] {
    const data = localStorage.getItem(STORAGE_TOPICS_KEY);
    if (!data) {
      localStorage.setItem(STORAGE_TOPICS_KEY, JSON.stringify(INITIAL_TOPICS));
      return INITIAL_TOPICS;
    }
    try {
      const parsed: Topic[] = JSON.parse(data);
      return parsed.sort((a, b) => a.position - b.position);
    } catch {
      return INITIAL_TOPICS;
    }
  }

  public saveTopic(topic: Topic): Topic {
    const topics = this.getTopics();
    const cleanTopic: Topic = {
      ...topic,
      id: topic.id || topic.slug || `topic-${Date.now()}`,
      slug: topic.slug || topic.id || `topic-${Date.now()}`,
      position: typeof topic.position === 'number' ? topic.position : topics.length + 1
    };

    const index = topics.findIndex((t) => t.id === cleanTopic.id || t.slug === cleanTopic.slug);
    if (index >= 0) {
      topics[index] = cleanTopic;
      this.addLog({
        type: 'place_updated',
        title: `Tópico Atualizado: ${cleanTopic.name}`,
        details: `Seção dinâmica alterada.`
      });
    } else {
      topics.push(cleanTopic);
      this.addLog({
        type: 'place_created',
        title: `Novo Tópico Criado: ${cleanTopic.name}`,
        details: `Nova seção de conteúdo cadastrada.`
      });
    }

    safeSetItem(STORAGE_TOPICS_KEY, JSON.stringify(topics));

    if (isSupabaseConfigured() && supabase) {
      this.syncTopicToSupabase(cleanTopic).catch((e) => {
        console.warn('Falha na sincronização do tópico no Supabase:', e);
      });
    }

    return cleanTopic;
  }

  public deleteTopic(topicId: string): void {
    const topics = this.getTopics();
    const target = topics.find((t) => t.id === topicId || t.slug === topicId);
    const updated = topics.filter((t) => t.id !== topicId && t.slug !== topicId);
    safeSetItem(STORAGE_TOPICS_KEY, JSON.stringify(updated));

    this.addLog({
      type: 'place_updated',
      title: `Tópico Excluído: ${target ? target.name : topicId}`,
      details: `Seção de conteúdo removida.`
    });

    if (isSupabaseConfigured() && supabase) {
      supabase.from('topics').delete().eq('id', topicId).then(() => {});
    }
  }

  public reorderTopics(orderedIds: string[]): Topic[] {
    const topics = this.getTopics();
    const reordered: Topic[] = [];

    orderedIds.forEach((id, index) => {
      const found = topics.find((t) => t.id === id || t.slug === id);
      if (found) {
        reordered.push({ ...found, position: index + 1 });
      }
    });

    topics.forEach((t) => {
      if (!reordered.some((r) => r.id === t.id)) {
        reordered.push({ ...t, position: reordered.length + 1 });
      }
    });

    safeSetItem(STORAGE_TOPICS_KEY, JSON.stringify(reordered));
    this.addLog({
      type: 'place_updated',
      title: `Ordem dos Tópicos Atualizada`,
      details: `Reorganizadas as seções públicas.`
    });

    return reordered;
  }

  /* ======================================================== */
  /* GESTÃO DE MODALIDADES (TIPO DE ESTABELECIMENTO) */
  /* ======================================================== */
  public getModalities(): Modality[] {
    const data = localStorage.getItem(STORAGE_MODALITIES_KEY);
    if (!data) {
      localStorage.setItem(STORAGE_MODALITIES_KEY, JSON.stringify(INITIAL_MODALITIES));
      return INITIAL_MODALITIES;
    }
    try {
      const parsed: Modality[] = JSON.parse(data);
      // Se contiver tipos antigos de acesso ou não tiver 'Praias', faz a migração automática para INITIAL_MODALITIES
      const isOldAccessTypes = parsed.some((m) => m.name === 'Acesso Livre / Gratuito' || m.name === 'Experiência Paga' || m.name === 'Reserva Prévia Obrigatória');
      const hasPraias = parsed.some((m) => m.name.toLowerCase() === 'praias' || m.name.toLowerCase() === 'praia' || m.name.toLowerCase() === 'praia / orla');
      if (isOldAccessTypes || !hasPraias || parsed.length < 5) {
        const merged: Modality[] = [...INITIAL_MODALITIES];
        parsed.forEach((p) => {
          if (
            p.name !== 'Acesso Livre / Gratuito' &&
            p.name !== 'Experiência Paga' &&
            p.name !== 'Reserva Prévia Obrigatória' &&
            p.name !== 'Tour Guiado' &&
            p.name !== 'Day Use' &&
            p.name !== 'Experiência Gastronômica' &&
            !merged.some((m) => m.name.toLowerCase() === p.name.toLowerCase() || m.id === p.id)
          ) {
            merged.push(p);
          }
        });
        safeSetItem(STORAGE_MODALITIES_KEY, JSON.stringify(merged));
        return merged;
      }
      return parsed;
    } catch {
      safeSetItem(STORAGE_MODALITIES_KEY, JSON.stringify(INITIAL_MODALITIES));
      return INITIAL_MODALITIES;
    }
  }

  public saveModality(modality: Modality): Modality {
    const modalities = this.getModalities();
    const index = modalities.findIndex((m) => m.id === modality.id);
    if (index >= 0) {
      modalities[index] = modality;
      this.addLog({
        type: 'place_updated',
        title: `Modalidade Atualizada: ${modality.name}`,
        details: `Tipo de estabelecimento alterado.`
      });
    } else {
      modalities.push(modality);
      this.addLog({
        type: 'place_created',
        title: `Nova Modalidade Criada: ${modality.name}`,
        details: `Tipo de estabelecimento adicionado.`
      });
    }
    safeSetItem(STORAGE_MODALITIES_KEY, JSON.stringify(modalities));
    return modality;
  }

  public deleteModality(modalityId: string): void {
    const modalities = this.getModalities().filter((m) => m.id !== modalityId);
    safeSetItem(STORAGE_MODALITIES_KEY, JSON.stringify(modalities));
    this.addLog({
      type: 'place_updated',
      title: `Modalidade Excluída: ${modalityId}`,
      details: `Tipo de estabelecimento removido do catálogo.`
    });
  }

  /* ======================================================== */
  /* GESTÃO RELACIONAL DE PARCEIROS COMERCIAIS (1 LOCAL -> N PARCEIROS) */
  /* ======================================================== */
  public getPartners(): Partner[] {
    const data = localStorage.getItem(STORAGE_PARTNERS_KEY);
    if (!data) {
      localStorage.setItem(STORAGE_PARTNERS_KEY, JSON.stringify(INITIAL_PARTNERS));
      return INITIAL_PARTNERS;
    }
    try {
      return JSON.parse(data);
    } catch {
      return INITIAL_PARTNERS;
    }
  }

  public getPartnersByPlaceId(placeId: string): Partner[] {
    const partners = this.getPartners();
    return partners.filter((p) => p.placeId === placeId);
  }

  public savePartner(partner: Partner): Partner {
    const partners = this.getPartners();
    const cleanPartner: Partner = {
      ...partner,
      id: partner.id || `partner-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      updatedAt: new Date().toISOString(),
      createdAt: partner.createdAt || new Date().toISOString()
    };

    const index = partners.findIndex((p) => p.id === cleanPartner.id);
    if (index >= 0) {
      partners[index] = cleanPartner;
      this.addLog({
        type: 'place_updated',
        title: `Parceiro Comercial Atualizado: ${cleanPartner.name}`,
        details: `Benefício: "${cleanPartner.benefit}". Vinculado ao local ID ${cleanPartner.placeId}.`
      });
    } else {
      partners.unshift(cleanPartner);
      this.addLog({
        type: 'place_created',
        title: `Novo Parceiro Comercial: ${cleanPartner.name}`,
        details: `Benefício: "${cleanPartner.benefit}". Vinculado ao local ID ${cleanPartner.placeId}.`
      });
    }

    safeSetItem(STORAGE_PARTNERS_KEY, JSON.stringify(partners));
    return cleanPartner;
  }

  public deletePartner(partnerId: string): void {
    const partners = this.getPartners();
    const target = partners.find((p) => p.id === partnerId);
    const updated = partners.filter((p) => p.id !== partnerId);
    safeSetItem(STORAGE_PARTNERS_KEY, JSON.stringify(updated));

    this.addLog({
      type: 'place_updated',
      title: `Parceiro Excluído: ${target ? target.name : partnerId}`,
      details: `Parceiro comercial desvinculado e removido.`
    });
  }

  /* ======================================================== */
  /* GESTÃO COMPLETA DE LOCAIS & ATRAÇÕES */
  /* ======================================================== */
  private getDeletedPlaceIds(): string[] {
    const data = localStorage.getItem(STORAGE_DELETED_PLACES_KEY);
    if (!data) return [];
    try {
      return JSON.parse(data);
    } catch {
      return [];
    }
  }

  /**
   * Normalização determinística e retrocompatível de qualquer local do sistema
   */
  public normalizePlaceModel(place: Place): Place {
    // 1. Normalização do Bairro (Mapeamento canônico determinístico)
    let neighborhoodId = place.neighborhoodId;
    const rawNeigh = (place.neighborhood || '').toLowerCase().trim();
    if (!neighborhoodId) {
      if (rawNeigh.includes('manaira') || rawNeigh.includes('manaíra')) {
        neighborhoodId = 'manaira';
      } else if (rawNeigh.includes('tambau') || rawNeigh.includes('tambaú')) {
        neighborhoodId = 'tambau';
      } else if (rawNeigh.includes('cabo branco')) {
        neighborhoodId = 'cabo-branco';
      } else if (rawNeigh.includes('bessa') || rawNeigh.includes('caribessa')) {
        neighborhoodId = 'bessa';
      } else if (rawNeigh.includes('seixas') || rawNeigh.includes('farol')) {
        neighborhoodId = 'seixas';
      } else if (rawNeigh.includes('centro')) {
        neighborhoodId = 'centro-historico';
      } else if (
        rawNeigh.includes('cabedelo') ||
        rawNeigh.includes('intermares') ||
        rawNeigh.includes('jacare') ||
        rawNeigh.includes('jacaré') ||
        rawNeigh.includes('poco') ||
        rawNeigh.includes('poço')
      ) {
        neighborhoodId = 'cabedelo';
      } else if (
        rawNeigh.includes('conde') ||
        rawNeigh.includes('litoral sul') ||
        rawNeigh.includes('pitimbu') ||
        rawNeigh.includes('coqueirinho') ||
        rawNeigh.includes('tambaba')
      ) {
        neighborhoodId = 'costa-do-conde';
      } else {
        neighborhoodId = 'tambau';
      }
    }

    // 2. Normalização dos Tópicos (Preserva topicIds existentes ou mapeia de categoryId)
    let topicIds = place.topicIds;
    if (!topicIds || !Array.isArray(topicIds) || topicIds.length === 0) {
      const cat = place.categoryId;
      if (cat === 'praias') topicIds = ['praias'];
      else if (cat === 'restaurantes') topicIds = ['gastronomia'];
      else if (cat === 'bares') topicIds = ['bares-botecos'];
      else if (cat === 'cafes') topicIds = ['gastronomia'];
      else if (cat === 'hoteis') topicIds = ['hospedagem'];
      else if (cat === 'passeios') topicIds = ['passeios'];
      else if (cat === 'pontos-turisticos') topicIds = ['passeios'];
      else if (cat === 'por-do-sol') topicIds = ['passeios'];
      else if (cat === 'compras') topicIds = ['compras'];
      else if (cat === 'cultura') topicIds = ['cultura'];
      else if (cat === 'vida-noturna') topicIds = ['vida-noturna'];
      else if (cat === 'dicas') topicIds = ['servicos'];
      else topicIds = ['gastronomia'];
    }

    // 3. Normalização da Modalidade (Preserva modalityName ou infere de categoryId)
    let modalityName = place.modalityName;
    if (
      !modalityName ||
      modalityName === 'Acesso Livre / Gratuito' ||
      modalityName === 'Experiência Paga' ||
      modalityName === 'Reserva Prévia Obrigatória' ||
      modalityName === 'Praia / Orla'
    ) {
      const cat = place.categoryId;
      if (cat === 'restaurantes') modalityName = 'Restaurante';
      else if (cat === 'bares') modalityName = 'Bar';
      else if (cat === 'cafes') modalityName = 'Café / Bistrô';
      else if (cat === 'hoteis') modalityName = 'Hotel / Pousada';
      else if (cat === 'passeios') modalityName = 'Passeio Náutico';
      else if (cat === 'praias') modalityName = 'Praias';
      else if (cat === 'pontos-turisticos') modalityName = 'Ponto Turístico / Mirante';
      else if (cat === 'por-do-sol') modalityName = 'Ponto Turístico / Mirante';
      else if (cat === 'compras') modalityName = 'Artesanato / Loja';
      else if (cat === 'cultura') modalityName = 'Patrimônio Histórico';
      else if (cat === 'vida-noturna') modalityName = 'Casa de Shows / Forró';
      else if (cat === 'dicas') modalityName = 'Serviços';
      else modalityName = 'Praias';
    }

    return {
      ...place,
      neighborhoodId,
      topicIds,
      modalityName
    };
  }

  public getAllPlaces(): Place[] {
    const customPlaces = this.getCustomPlaces();
    const deletedIds = this.getDeletedPlaceIds();

    // Substitui cada mockPlace pelo seu equivalente customizado se existir (preserva a ordem do catálogo)
    const mappedMockPlaces = MOCK_PLACES.filter((p) => !deletedIds.includes(p.id)).map((mockPlace) => {
      const custom = customPlaces.find((c) => c.id === mockPlace.id);
      return this.normalizePlaceModel(this.normalizePlacePhotos(custom || mockPlace));
    });

    // Locais novos criados exclusivamente pelo Administrador
    const brandNewCustomPlaces = customPlaces
      .filter((c) => !MOCK_PLACES.some((m) => m.id === c.id) && !deletedIds.includes(c.id))
      .map((c) => this.normalizePlaceModel(this.normalizePlacePhotos(c)));

    return [...brandNewCustomPlaces, ...mappedMockPlaces];
  }

  public getCustomPlaces(): Place[] {
    const data = localStorage.getItem(STORAGE_CUSTOM_PLACES_KEY);
    if (!data) return [];
    try {
      return JSON.parse(data);
    } catch {
      return [];
    }
  }

  /**
   * Garante a integridade das fotos e da foto de capa (exclusividade isCover = true)
   */
  public normalizePlacePhotos(place: Place): Place {
    let gallery = place.gallery && place.gallery.length > 0
      ? [...place.gallery]
      : [place.featuredImage || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80'];

    // Se featuredImage foi definida e não estiver na galeria, insere no início
    let cover = place.featuredImage;
    if (cover) {
      if (!gallery.includes(cover)) {
        gallery = [cover, ...gallery];
      }
    } else {
      cover = gallery[0];
    }

    // Cria/atualiza o array estruturado images com position e isCover único
    const structuredImages: PlaceImage[] = gallery.map((url, idx) => ({
      id: `${place.id}-img-${idx}`,
      placeId: place.id,
      publicUrl: url,
      position: idx,
      isCover: url === cover
    }));

    return {
      ...place,
      featuredImage: cover,
      gallery,
      images: structuredImages
    };
  }

  public savePlace(place: Place): Place {
    try {
      const normalizedPlace = this.normalizePlaceModel(this.normalizePlacePhotos(place));
      const customPlaces = this.getCustomPlaces();
      const index = customPlaces.findIndex((p) => p.id === normalizedPlace.id);

      if (index >= 0) {
        customPlaces[index] = normalizedPlace;
        this.addLog({
          type: 'place_updated',
          title: `Local Atualizado: ${normalizedPlace.name}`,
          details: `Fotos salvas (${normalizedPlace.gallery.length}), Capa definida e dados persistidos.`
        });
      } else {
        customPlaces.unshift(normalizedPlace);
        this.addLog({
          type: 'place_created',
          title: `Novo Local Criado: ${normalizedPlace.name}`,
          details: `Adicionado à modalidade ${normalizedPlace.categoryLabel}.`
        });
      }

      safeSetItem(STORAGE_CUSTOM_PLACES_KEY, JSON.stringify(customPlaces));

      // Sincronização em segundo plano com Supabase se configurado (segura e não-bloqueante)
      if (isSupabaseConfigured() && supabase) {
        this.syncPlaceToSupabase(normalizedPlace).catch((e) => {
          console.warn('Falha na sincronização Supabase:', e);
        });
      }

      return normalizedPlace;
    } catch (error) {
      console.error('Erro ao salvar local no AdminService:', error);
      throw error;
    }
  }

  private async syncPlaceToSupabase(place: Place): Promise<void> {
    if (!supabase || !isSupabaseConfigured()) return;
    try {
      const lat = typeof place.coordinates?.lat === 'number' && !isNaN(place.coordinates.lat) ? place.coordinates.lat : -7.115;
      const lng = typeof place.coordinates?.lng === 'number' && !isNaN(place.coordinates.lng) ? place.coordinates.lng : -34.825;

      await supabase.from('places').upsert({
        id: place.id,
        name: place.name,
        slug: place.id,
        slogan: place.slogan || '',
        category_id: place.categoryId,
        category_label: place.categoryLabel || 'Praias',
        neighborhood: place.neighborhood,
        neighborhood_id: place.neighborhoodId || null,
        modality_name: place.modalityName || 'Praias',
        topic_ids: place.topicIds || [],
        rating: place.rating || 4.8,
        review_count: place.reviewCount || 0,
        short_description: place.publicTeaser || '',
        full_description: place.fullDescription || '',
        featured_image: place.featuredImage || (place.gallery && place.gallery[0]) || '',
        gallery: place.gallery || [],
        price_level: place.priceLevel || 'moderado',
        address: place.address || '',
        lat: lat,
        lng: lng,
        phone: place.phone || '',
        whatsapp: place.whatsapp || (place.phone ? place.phone.replace(/\D/g, '') : ''),
        instagram: place.instagram || '',
        website: place.website || '',
        is_partner: Boolean(place.isPartner),
        partner_level: place.partnerLevel || 'standard',
        amenities: place.amenities || {},
        updated_at: new Date().toISOString()
      }, { onConflict: 'id' });

      // Sincroniza dicas secretas do local
      if (place.tips && place.tips.length > 0) {
        await supabase.from('secret_tips').delete().eq('place_id', place.id);
        const tipRows = place.tips.map((t, idx) => ({
          place_id: place.id,
          title: t.title,
          badge: t.badge || 'Dica dos Nativos',
          description: t.description,
          is_premium_only: t.isPremiumOnly !== false,
          position: idx + 1
        }));
        await supabase.from('secret_tips').insert(tipRows);
      }
    } catch (e) {
      console.warn('Falha na sincronização assíncrona com Supabase:', e);
    }
  }

  private async syncNeighborhoodToSupabase(neighborhood: Neighborhood): Promise<void> {
    if (!supabase || !isSupabaseConfigured()) return;
    try {
      await supabase.from('neighborhoods').upsert({
        id: neighborhood.id,
        name: neighborhood.name,
        slug: neighborhood.slug,
        description: neighborhood.description || '',
        cover_image: neighborhood.coverImage,
        tips: neighborhood.tips || [],
        position: neighborhood.position || 0,
        updated_at: new Date().toISOString()
      });
    } catch (e) {
      console.warn('Falha ao sincronizar bairro com Supabase:', e);
    }
  }

  private async syncTopicToSupabase(topic: Topic): Promise<void> {
    if (!supabase || !isSupabaseConfigured()) return;
    try {
      await supabase.from('topics').upsert({
        id: topic.id,
        name: topic.name,
        slug: topic.slug,
        description: topic.description || '',
        icon_name: topic.iconName || 'Compass',
        accent_color: topic.accentColor || '#00B4D8',
        position: topic.position || 0,
        updated_at: new Date().toISOString()
      });
    } catch (e) {
      console.warn('Falha ao sincronizar tópico com Supabase:', e);
    }
  }

  public deletePlace(placeId: string): void {
    // Remove do custom se existir
    const customPlaces = this.getCustomPlaces().filter((p) => p.id !== placeId);
    safeSetItem(STORAGE_CUSTOM_PLACES_KEY, JSON.stringify(customPlaces));

    // Adiciona na lista de excluídos para mascarar mockPlaces nativos
    const deletedIds = this.getDeletedPlaceIds();
    if (!deletedIds.includes(placeId)) {
      deletedIds.push(placeId);
      safeSetItem(STORAGE_DELETED_PLACES_KEY, JSON.stringify(deletedIds));
    }

    this.addLog({
      type: 'place_updated',
      title: `Local Excluído: ${placeId}`,
      details: `Item removido do catálogo com sucesso.`
    });

    if (isSupabaseConfigured() && supabase) {
      supabase.from('places').delete().eq('id', placeId).then(() => {});
    }
  }

  /* ======================================================== */
  /* GESTÃO DE DICAS SECRETAS DOS NATIVOS */
  /* ======================================================== */
  public addTipToPlace(placeId: string, tip: SecretTip): void {
    const allPlaces = this.getAllPlaces();
    const target = allPlaces.find((p) => p.id === placeId);
    if (target) {
      const updatedTips = target.tips ? [...target.tips, tip] : [tip];
      const updatedPlace: Place = { ...target, tips: updatedTips };
      this.savePlace(updatedPlace);
    }
  }

  public deleteTipFromPlace(placeId: string, tipIndex: number): void {
    const allPlaces = this.getAllPlaces();
    const target = allPlaces.find((p) => p.id === placeId);
    if (target && target.tips) {
      const updatedTips = target.tips.filter((_, idx) => idx !== tipIndex);
      const updatedPlace: Place = { ...target, tips: updatedTips };
      this.savePlace(updatedPlace);
    }
  }

  /* ======================================================== */
  /* RASTREAMENTO & ANALYTICS DE PARCEIROS COMERCIAIS */
  /* ======================================================== */
  public trackPartnerClick(placeId: string, eventType: PartnerTrackingEvent, sourceChannel = 'web_app'): void {
    try {
      const currentStats = this.getPartnerClicksMap();
      const existing = currentStats[placeId] || {
        views: 0,
        whatsapp: 0,
        maps: 0,
        instagram: 0,
        website: 0,
        coupon: 0,
        total: 0
      };

      if (eventType === 'view') existing.views += 1;
      if (eventType === 'click_whatsapp') existing.whatsapp += 1;
      if (eventType === 'click_maps') existing.maps += 1;
      if (eventType === 'click_instagram') existing.instagram += 1;
      if (eventType === 'click_website') existing.website += 1;
      if (eventType === 'click_coupon') existing.coupon += 1;

      existing.total = existing.whatsapp + existing.maps + existing.instagram + existing.website + existing.coupon;
      currentStats[placeId] = existing;

      safeSetItem(STORAGE_PARTNER_CLICKS_KEY, JSON.stringify(currentStats));

      if (isSupabaseConfigured() && supabase) {
        supabase.from('partner_tracking').insert({
          place_id: placeId,
          event_type: eventType,
          source_channel: sourceChannel
        });
      }
    } catch (e) {
      console.warn('Erro ao rastrear interação de parceiro:', e);
    }
  }

  private getPartnerClicksMap(): Record<string, any> {
    const data = localStorage.getItem(STORAGE_PARTNER_CLICKS_KEY);
    if (!data) return {};
    try {
      return JSON.parse(data);
    } catch {
      return {};
    }
  }

  public getPartnerStats(): PartnerStat[] {
    const places = this.getAllPlaces();
    const clicksMap = this.getPartnerClicksMap();

    return places
      .filter((p) => p.isPartner)
      .map((p) => {
        const stats = clicksMap[p.id] || {
          views: 120 + Math.floor(Math.random() * 80),
          whatsapp: 14 + Math.floor(Math.random() * 15),
          maps: 25 + Math.floor(Math.random() * 20),
          instagram: 18 + Math.floor(Math.random() * 12),
          website: 9 + Math.floor(Math.random() * 8),
          coupon: 32 + Math.floor(Math.random() * 25),
          total: 98
        };

        return {
          placeId: p.id,
          placeName: p.name,
          categoryLabel: p.categoryLabel,
          partnerLevel: p.partnerLevel || 'standard',
          partnerBenefit: p.partnerBenefit,
          views: stats.views,
          whatsappClicks: stats.whatsapp,
          mapsClicks: stats.maps,
          instagramClicks: stats.instagram,
          websiteClicks: stats.website,
          couponClicks: stats.coupon,
          totalInteractions: stats.whatsapp + stats.maps + stats.instagram + stats.website + stats.coupon
        };
      });
  }

  /* ======================================================== */
  /* HUB DE DISTRIBUIÇÃO FÍSICA & QR CODES */
  /* ======================================================== */
  public getQrChannels(): QrChannel[] {
    return [
      {
        id: 'qr-aeroporto',
        name: 'Totem de Desembarque — Aeroporto Castro Pinto',
        locationCategory: 'Aeroporto & Chegada',
        sourceCode: 'aeroporto_jampa',
        scanCount: 1420,
        conversionCount: 312,
        targetUrl: `${window.location.origin}/?src=aeroporto_jampa`
      },
      {
        id: 'qr-rodoviaria',
        name: 'Terminal Rodoviário de João Pessoa',
        locationCategory: 'Rodoviária & Transporte',
        sourceCode: 'rodoviaria_jampa',
        scanCount: 680,
        conversionCount: 114,
        targetUrl: `${window.location.origin}/?src=rodoviaria_jampa`
      },
      {
        id: 'qr-hoteis-tambau',
        name: 'Recepções e Quartos — Hotéis Tambaú & Cabo Branco',
        locationCategory: 'Hotelaria & Hospedagem',
        sourceCode: 'hoteis_orla_jampa',
        scanCount: 2340,
        conversionCount: 580,
        targetUrl: `${window.location.origin}/?src=hoteis_orla_jampa`
      },
      {
        id: 'qr-restaurantes',
        name: 'Displays de Mesa em Restaurantes Parceiros',
        locationCategory: 'Gastronomia & Parceiros',
        sourceCode: 'restaurantes_parceiros',
        scanCount: 890,
        conversionCount: 172,
        targetUrl: `${window.location.origin}/?src=restaurantes_parceiros`
      }
    ];
  }

  /* ======================================================== */
  /* GESTÃO DE ROTEIROS TURÍSTICOS */
  /* ======================================================== */
  public getItineraries(): Itinerary[] {
    const data = localStorage.getItem(STORAGE_ITINERARIES_KEY);
    if (!data) {
      localStorage.setItem(STORAGE_ITINERARIES_KEY, JSON.stringify(MOCK_ITINERARIES));
      return MOCK_ITINERARIES;
    }
    try {
      return JSON.parse(data);
    } catch {
      return MOCK_ITINERARIES;
    }
  }

  /* ======================================================== */
  /* CONCESSÃO MANUAL DE ACESSO (GESTÃO DE CLIENTES) */
  /* ======================================================== */
  public manualGrantUser(userId: string): void {
    authService.grantLifetimeAccess(userId);
    this.addLog({
      type: 'user_granted',
      title: 'Acesso VIP Concedido Manualmente',
      details: `Acesso vitalício liberado para o usuário ID ${userId}.`
    });
  }

  public manualRevokeUser(userId: string): void {
    authService.updateUserProfile(userId, {
      accessStatus: 'registered',
      accessType: 'none'
    });
    this.addLog({
      type: 'user_granted',
      title: 'Acesso VIP Revogado Manualmente',
      details: `Status de acesso alterado para visitante registrado.`
    });
  }
}

export const adminService = new AdminService();
