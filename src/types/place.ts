export type CategoryId = 
  | 'praias'
  | 'restaurantes'
  | 'bares'
  | 'cafes'
  | 'hoteis'
  | 'passeios'
  | 'pontos-turisticos'
  | 'por-do-sol'
  | 'compras'
  | 'cultura'
  | 'vida-noturna'
  | 'dicas';

export type PriceLevel = 'economico' | 'moderado' | 'alto' | 'luxo';

export type PartnerLevel = 'standard' | 'destaque' | 'fundador';

export type PartnerTrackingEvent = 
  | 'view'
  | 'click_whatsapp'
  | 'click_maps'
  | 'click_instagram'
  | 'click_website'
  | 'click_coupon';

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Review {
  id: string;
  author: string;
  avatar: string;
  rating: number;
  date: string;
  comment: string;
  isVerifiedBuyer: boolean;
}

export interface SecretTip {
  id?: string;
  title: string;
  description: string;
  badge?: string;
  isPremiumOnly: boolean;
  position?: number;
}

export interface PlaceImage {
  id: string;
  placeId: string;
  storagePath?: string;
  publicUrl: string;
  position: number;
  isCover: boolean;
  caption?: string;
}

export interface Place {
  id: string;
  name: string;
  slogan?: string;
  categoryId: CategoryId;
  categoryLabel: string;
  neighborhood: string; // Bairro (ex: Tambaú, Cabo Branco, Manaíra, Ponta do Seixas, Centro Histórico)
  city?: string;
  state?: string;
  rating: number;
  reviewCount: number;
  featuredImage: string;
  gallery: string[];
  images?: PlaceImage[];
  publicTeaser: string;
  fullDescription: string;
  isFeatured?: boolean;
  priceLevel: PriceLevel;
  openingHours?: string;
  tags: string[];
  
  // Coordenadas reais para mapeamento
  coordinates: Coordinates;
  address: string;
  
  // Detalhes de contato & links diretos
  phone?: string;
  whatsapp?: string;
  instagram?: string;
  facebook?: string;
  website?: string;
  googleMapsUrl?: string;
  
  // ========================================================
  // MODELO DE PARCERIA COMERCIAL
  // ========================================================
  isPartner?: boolean;
  partnerLevel?: PartnerLevel;
  partnerBadge?: string;
  partnerBenefit?: string; // Ex: "10% de desconto no cardápio", "Sobremesa cortesia"
  partnerDescription?: string;
  partnerCouponCode?: string; // Ex: "JAMPA10"
  partnerActive?: boolean;
  
  // Métricas de visualizações e cliques direcionados ao parceiro
  viewsCount?: number;
  clicksCount?: {
    whatsapp: number;
    maps: number;
    instagram: number;
    website: number;
    coupon: number;
    total: number;
  };
  
  // ========================================================
  // REORGANIZAÇÃO POR BAIRRO & TÓPICOS DINÂMICOS
  // ========================================================
  neighborhoodId?: string; // Slug canônico do bairro (ex: 'manaira', 'tambau')
  modalityId?: string;     // ID da modalidade (ex: 'mod-restaurante', 'mod-bar')
  modalityName?: string;   // Nome amigável da modalidade exibido acima do nome (ex: 'Restaurante', 'Salão de Beleza')
  topicIds?: string[];     // Array de tópicos associados (ex: ['gastronomia', 'vida-noturna'])
  
  // Dicas exclusivas protegidas por paywall do estabelecimento
  tips: SecretTip[];
  
  // Recursos & facilidades
  amenities: {
    parking: boolean;
    accessibility: boolean;
    familyFriendly: boolean;
    petFriendly: boolean;
    cardPayment: boolean;
    pixPayment: boolean;
  };
  
  // Avaliações de membros
  reviews: Review[];
  
  // Marcador especial 3D no mapa
  landmark3d?: {
    pinTitle: string;
    description: string;
    altitudeOffset: number;
  };
}

export type PartnershipLevel =
  | 'Bronze'
  | 'Prata'
  | 'Ouro'
  | 'Diamante'
  | 'Exclusivo'
  | 'Oficial'
  | 'standard'
  | 'destaque'
  | 'fundador';

export interface Partner {
  id: string;
  placeId: string; // Foreign key vinculado ao Place
  name: string;
  description: string;
  address: string;
  googleMapsUrl: string;
  benefit: string;
  partnershipLevel: PartnershipLevel;
  couponCode?: string;
  redemptionInstructions?: string;
  whatsapp?: string;
  instagram?: string;
  phone?: string;
  website?: string;
  active?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Modality {
  id: string;
  name: string;
  slug: string;
  description?: string;
  badge?: string;
}

export interface Topic {
  id: string;              // ex: 'gastronomia', 'bares-botecos', 'servicos', 'saude', 'passeios'
  name: string;            // ex: 'Gastronomia', 'Bares & Botecos', 'Serviços'
  slug: string;
  description?: string;    // Subtítulo descritivo do tópico
  iconName?: string;
  accentColor?: string;
  position: number;        // Ordem configurável pelo administrador
}

export interface Neighborhood {
  id: string;              // ex: 'manaira', 'tambau', 'cabo-branco', 'bessa', 'seixas', 'centro-historico'
  name: string;            // ex: 'Praia de Manaíra', 'Praia de Tambaú'
  slug: string;
  description: string;     // Descrição detalhada do bairro e características
  coverImage: string;      // Foto de capa imersiva do bairro
  tips: string[];          // Dicas Secretas & Melhores Práticas textuais do bairro
  position?: number;
}

export interface CategoryInfo {
  id: CategoryId;
  label: string;
  iconName: string;
  description: string;
  accentColor: string;
  badgeCount?: number;
  position?: number;
}

