import { Place } from '../types/place';

/**
 * SHOWCASE PÚBLICO (VITRINE DE MARKETING COM PAYWALL RIGOROSO)
 * Este dataset é utilizado exclusivamente para visitantes não autenticados / não pagos.
 * NÃO contém nomes de estabelecimentos comerciais, praias específicas, endereços reais, telefones, WhatsApp ou coordenadas GPS proprietárias.
 */
export const SHOWCASE_PLACES: Place[] = [
  // ==========================================
  // PRAIAS
  // ==========================================
  {
    id: 'showcase-praia-01',
    name: 'Praia Selecionada #01 — Águas Mornas & Piscinas Naturais',
    slogan: 'Orla urbana com calçadão protegido e saída de embarcações para recifes de corais',
    categoryId: 'praias',
    categoryLabel: 'Praias & Enseadas',
    neighborhood: 'Orla Marítima',
    rating: 4.9,
    reviewCount: 428,
    featuredImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80'
    ],
    publicTeaser: 'Praia de águas calmas e mornas ideal para caminhada matinal e banho de mar. Nome da praia, tábua de marés favorável e rota no GPS liberados após o desbloqueio.',
    fullDescription: 'Experiência litorânea selecionada por nativos. O guia completo revela o nome exato, melhor trecho para banho, tábua de marés favorável e horários ideais.',
    isFeatured: true,
    priceLevel: 'moderado',
    openingHours: 'Acesso livre',
    tags: ['Praia Urbana', 'Mar Calmo', 'Caminhada', 'Curadoria Nativa'],
    coordinates: { lat: -7.115, lng: -34.825 },
    address: 'João Pessoa - PB (Localização exata revelada no guia)',
    amenities: { parking: true, accessibility: true, familyFriendly: true, petFriendly: true, cardPayment: true, pixPayment: true },
    tips: [
      { title: 'Dica dos Nativos', description: 'Conteúdo estratégico exclusivo liberado após a compra.', badge: 'Exclusivo VIP', isPremiumOnly: true }
    ],
    reviews: []
  },
  {
    id: 'showcase-praia-02',
    name: 'Praia Selecionada #02 — Falésias Coloridas & Mar Manso',
    slogan: 'Cânions de areia avermelhada, coqueirais ondulantes e enseada protegida',
    categoryId: 'praias',
    categoryLabel: 'Praias & Enseadas',
    neighborhood: 'Litoral Sul',
    rating: 5.0,
    reviewCount: 740,
    featuredImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80'
    ],
    publicTeaser: 'Uma das paisagens mais deslumbrantes da costa paraibana, cercada por mirantes e águas cristalinas. Desbloqueie para ver nome e rotas.',
    fullDescription: 'Enseada cinematográfica no Litoral Sul. O guia exclusivo entrega como chegar sem pegar estrada de terra ruim, melhor mirante e onde estacionar com segurança.',
    isFeatured: true,
    priceLevel: 'moderado',
    tags: ['Falésias', 'Cânions', 'Litoral Sul', 'Mirante'],
    coordinates: { lat: -7.318, lng: -34.800 },
    address: 'Costa Sul da Paraíba (Localização exata revelada no guia)',
    amenities: { parking: true, accessibility: false, familyFriendly: true, petFriendly: true, cardPayment: true, pixPayment: true },
    tips: [
      { title: 'Dica dos Nativos', description: 'Conteúdo estratégico exclusivo liberado após a compra.', badge: 'Exclusivo VIP', isPremiumOnly: true }
    ],
    reviews: []
  },
  {
    id: 'showcase-praia-03',
    name: 'Praia Selecionada #03 — Águas Cristalinas estilo Caribe',
    slogan: 'Mar azul-turquesa protegido por recifes, ideal para stand-up paddle e caiaque',
    categoryId: 'praias',
    categoryLabel: 'Praias & Enseadas',
    neighborhood: 'Litoral Norte',
    rating: 4.9,
    reviewCount: 460,
    featuredImage: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80'
    ],
    publicTeaser: 'Trecho famoso pelo mar verde-esmeralda transparente na maré baixa. Desbloqueie para descobrir a praia e o melhor ponto de aluguel de pranchas.',
    fullDescription: 'Piscina natural urbana formada por arrecifes. O guia completo revela as condições perfeitas de maré para encontrar a água no tom mais cristalino.',
    isFeatured: true,
    priceLevel: 'moderado',
    tags: ['Mar Manso', 'Stand Up Paddle', 'Águas Claras', 'Família'],
    coordinates: { lat: -7.078, lng: -34.829 },
    address: 'Litoral Norte, João Pessoa - PB (Localização exata revelada no guia)',
    amenities: { parking: true, accessibility: true, familyFriendly: true, petFriendly: true, cardPayment: true, pixPayment: true },
    tips: [
      { title: 'Dica dos Nativos', description: 'Conteúdo estratégico exclusivo liberado após a compra.', badge: 'Exclusivo VIP', isPremiumOnly: true }
    ],
    reviews: []
  },

  // ==========================================
  // RESTAURANTES & GASTRONOMIA
  // ==========================================
  {
    id: 'showcase-restaurante-01',
    name: 'Experiência Gastronômica #01 — Buffet Regional Sertanejo',
    slogan: 'Mais de 200 opções tradicionais: carne de sol na nata, queijo coalho e doces típicos',
    categoryId: 'restaurantes',
    categoryLabel: 'Gastronomia & Sabores',
    neighborhood: 'Polo Gastronômico',
    rating: 4.9,
    reviewCount: 890,
    featuredImage: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80'
    ],
    publicTeaser: 'O restaurante mais premiado de culinária paraibana sertaneja. Nome do estabelecimento, pratos imperdíveis e horário sem filas liberados após a compra.',
    fullDescription: 'Ícone da gastronomia nordestina em João Pessoa. O JAMPA EXPERIENCE entrega o nome, endereço, horário estratégico sem fila de espera e o que não deixar de pedir.',
    isFeatured: true,
    priceLevel: 'moderado',
    tags: ['Buffet Regional', 'Culinária Típica', 'Carne de Sol', 'Imperdível'],
    coordinates: { lat: -7.108, lng: -34.832 },
    address: 'Zona Gastronômica, João Pessoa - PB (Revelado após o desbloqueio)',
    amenities: { parking: true, accessibility: true, familyFriendly: true, petFriendly: false, cardPayment: true, pixPayment: true },
    tips: [
      { title: 'Dica Gastronômica', description: 'Conteúdo estratégico exclusivo liberado após a compra.', badge: 'Exclusivo VIP', isPremiumOnly: true }
    ],
    reviews: []
  },
  {
    id: 'showcase-restaurante-02',
    name: 'Experiência Gastronômica #02 — Frutos do Mar & Camarões Nobres',
    slogan: 'Alta gastronomia litorânea com camarões gigantes, polvos grelhados e vinhos selecionados',
    categoryId: 'restaurantes',
    categoryLabel: 'Gastronomia & Sabores',
    neighborhood: 'Bairro Nobre',
    rating: 4.9,
    reviewCount: 620,
    featuredImage: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80'
    ],
    publicTeaser: 'Experiência gastronômica sofisticada de frutos do mar frescos. Nome do restaurante, melhor custo-benefício e rotas no GPS revelados no guia.',
    fullDescription: 'Ambiente refinado com porções generosas para compartilhar. O guia completo revela o nome do restaurante, mesa mais agradável e o prato assinatura da casa.',
    isFeatured: true,
    priceLevel: 'alto',
    tags: ['Frutos do Mar', 'Camarões Nobres', 'Sofisticado', 'Vinhos'],
    coordinates: { lat: -7.104, lng: -34.836 },
    address: 'Zona Nobre, João Pessoa - PB (Revelado após o desbloqueio)',
    amenities: { parking: true, accessibility: true, familyFriendly: true, petFriendly: false, cardPayment: true, pixPayment: true },
    tips: [
      { title: 'Dica do Chef', description: 'Conteúdo estratégico exclusivo liberado após a compra.', badge: 'Exclusivo VIP', isPremiumOnly: true }
    ],
    reviews: []
  },

  // ==========================================
  // BARES & BEACH LOUNGES
  // ==========================================
  {
    id: 'showcase-bar-01',
    name: 'Beach Lounge & Bar Selecionado #01 — Drinques & Vista Mar',
    slogan: 'Ambiente praiano sofisticado com carta de drinques autorais e petiscos gourmet',
    categoryId: 'bares',
    categoryLabel: 'Bares & Beach Lounges',
    neighborhood: 'Orla Marítima',
    rating: 4.8,
    reviewCount: 380,
    featuredImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1000&q=80',
    gallery: ['https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80'],
    publicTeaser: 'O bar de praia mais charmoso da orla. Nome, melhor mesa com vista do mar e benefício exclusivo para membros desbloqueados no guia.',
    fullDescription: 'Beach club com lounge, DJ no entardecer e coquetelaria de ponta. Desbloqueie para conferir nome, localização exata e cupons.',
    isFeatured: true,
    priceLevel: 'moderado',
    tags: ['Drinques Autorais', 'Pé na Areia', 'DJ', 'Lounge'],
    coordinates: { lat: -7.112, lng: -34.823 },
    address: 'Orla de João Pessoa - PB (Revelado no Guia VIP)',
    amenities: { parking: true, accessibility: true, familyFriendly: true, petFriendly: true, cardPayment: true, pixPayment: true },
    tips: [{ title: 'Dica de Drinque', description: 'Conteúdo exclusivo liberado no guia VIP.', isPremiumOnly: true }],
    reviews: []
  },

  // ==========================================
  // CAFÉS ESPECIAIS
  // ==========================================
  {
    id: 'showcase-cafe-01',
    name: 'Cafeteria Especial Selecionada #01 — Grãos Selecionados',
    slogan: 'Cafés filtrados em métodos especiais, ambiente aconchegante e doces artesanais',
    categoryId: 'cafes',
    categoryLabel: 'Cafés & Confeitarias',
    neighborhood: 'Bairro Charmoso',
    rating: 4.9,
    reviewCount: 290,
    featuredImage: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1000&q=80',
    gallery: ['https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80'],
    publicTeaser: 'Parada perfeita para o café da tarde com torra fresca e confeitaria autoral. Nome e endereço liberados após o desbloqueio.',
    fullDescription: 'Eleito um dos melhores cafés do Nordeste. O guia VIP entrega o nome, endereço com GPS e as melhores combinações de sobremesa.',
    isFeatured: true,
    priceLevel: 'moderado',
    tags: ['Café Especial', 'Tortas Artesanais', 'Ambiente Climatizado', 'Wi-Fi'],
    coordinates: { lat: -7.110, lng: -34.830 },
    address: 'João Pessoa - PB (Revelado no Guia VIP)',
    amenities: { parking: true, accessibility: true, familyFriendly: true, petFriendly: true, cardPayment: true, pixPayment: true },
    tips: [{ title: 'Dica de Pedido', description: 'Conteúdo exclusivo liberado no guia VIP.', isPremiumOnly: true }],
    reviews: []
  },

  // ==========================================
  // HOTÉIS & POUSADAS
  // ==========================================
  {
    id: 'showcase-hotel-01',
    name: 'Hospedagem & Pousada Selecionada #01 — Frente Mar',
    slogan: 'Conforto à beira-mar com café da manhã regional farto e piscina com borda infinita',
    categoryId: 'hoteis',
    categoryLabel: 'Hotéis & Pousadas',
    neighborhood: 'Beira-Mar',
    rating: 4.9,
    reviewCount: 510,
    featuredImage: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=80',
    gallery: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80'],
    publicTeaser: 'Localização imbatível na melhor quadra da praia. Nome da pousada, contato direto sem taxas e dicas de quartos com vista liberados após a compra.',
    fullDescription: 'Hospedagem selecionada a dedo pelo custo-benefício e hospitalidade paraibana. Desbloqueie o acesso para ver nome, WhatsApp e rota.',
    isFeatured: true,
    priceLevel: 'alto',
    tags: ['Pé na Areia', 'Piscina', 'Café da Manhã Regional', 'Vista Mar'],
    coordinates: { lat: -7.118, lng: -34.822 },
    address: 'Av. Beira-Mar, João Pessoa - PB (Revelado no Guia VIP)',
    amenities: { parking: true, accessibility: true, familyFriendly: true, petFriendly: false, cardPayment: true, pixPayment: true },
    tips: [{ title: 'Dica de Reserva', description: 'Conteúdo exclusivo liberado no guia VIP.', isPremiumOnly: true }],
    reviews: []
  },

  // ==========================================
  // PASSEIOS & EXPERIÊNCIAS
  // ==========================================
  {
    id: 'showcase-passeio-01',
    name: 'Passeio Selecionado #01 — Piscinas Naturais de Catamarã',
    slogan: 'Navegação até recifes de corais em maré baixa com peixes coloridos e águas mornas',
    categoryId: 'passeios',
    categoryLabel: 'Passeios & Aventuras',
    neighborhood: 'Recifes Costeiros',
    rating: 5.0,
    reviewCount: 950,
    featuredImage: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1000&q=80',
    gallery: ['https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80'],
    publicTeaser: 'O passeio marítimo mais procurado de João Pessoa. Nome da empresa de catamarã confiável, tábua de marés e ponto de embarque liberados.',
    fullDescription: 'Experiência imperdível de mergulho com snorkel em águas transparentes. O guia entrega a tábua de maré ideal e contato direto.',
    isFeatured: true,
    priceLevel: 'moderado',
    tags: ['Mergulho', 'Catamarã', 'Piscinas Naturais', 'Snorkel'],
    coordinates: { lat: -7.113, lng: -34.819 },
    address: 'Ponto de Embarque, João Pessoa - PB (Revelado no Guia VIP)',
    amenities: { parking: true, accessibility: false, familyFriendly: true, petFriendly: false, cardPayment: true, pixPayment: true },
    tips: [{ title: 'Segredo da Maré', description: 'Conteúdo exclusivo liberado no guia VIP.', isPremiumOnly: true }],
    reviews: []
  },

  // ==========================================
  // PONTOS TURÍSTICOS
  // ==========================================
  {
    id: 'showcase-turistico-01',
    name: 'Ponto Turístico Selecionado #01 — Onde o Sol Nasce Primeiro',
    slogan: 'O ponto mais oriental das Américas com vista infinita do oceano Atlântico',
    categoryId: 'pontos-turisticos',
    categoryLabel: 'Pontos Turísticos',
    neighborhood: 'Extremo Oriental',
    rating: 4.9,
    reviewCount: 1100,
    featuredImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80',
    gallery: ['https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80'],
    publicTeaser: 'Marco geográfico histórico de João Pessoa. Nome do mirante, melhor horário de luz para fotos e rota no GPS liberados após a compra.',
    fullDescription: 'Monumento emblemático no ponto mais ao leste de todo o continente americano. O guia completo revela os segredos de visitação sem aglomeração.',
    isFeatured: true,
    priceLevel: 'economico',
    tags: ['Ponto Mais Oriental', 'Mirante', 'História', 'Fotos Panorâmicas'],
    coordinates: { lat: -7.148, lng: -34.796 },
    address: 'Extremo Oriental das Américas, João Pessoa - PB (Revelado no Guia VIP)',
    amenities: { parking: true, accessibility: true, familyFriendly: true, petFriendly: true, cardPayment: true, pixPayment: true },
    tips: [{ title: 'Dica de Fotografia', description: 'Conteúdo exclusivo liberado no guia VIP.', isPremiumOnly: true }],
    reviews: []
  },

  // ==========================================
  // PÔR DO SOL
  // ==========================================
  {
    id: 'showcase-sunset-01',
    name: 'Experiência de Pôr do Sol Selecionada #01 — Saxofone no Rio',
    slogan: 'O pôr do sol mais famoso do Brasil ao som do Bolero de Ravel sobre o leito do rio',
    categoryId: 'por-do-sol',
    categoryLabel: 'Pôr do Sol Mágico',
    neighborhood: 'Margem do Rio',
    rating: 5.0,
    reviewCount: 1420,
    featuredImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80',
    gallery: ['https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80'],
    publicTeaser: 'Cerimônia emocionante com o sol se pondo no horizonte fluvial. Nome do local, melhor catamarã para assistir da água e horário exato liberados.',
    fullDescription: 'A atração de entardecer mais aclamada da Paraíba. O guia exclusivo ensina como fugir dos engarrafamentos e qual o melhor ângulo para assistir.',
    isFeatured: true,
    priceLevel: 'moderado',
    tags: ['Pôr do Sol', 'Saxofone', 'Rio', 'Inesquecível', 'Música ao Vivo'],
    coordinates: { lat: -7.039, lng: -34.856 },
    address: 'Margem do Rio, Região Metropolitana de João Pessoa - PB (Revelado no Guia VIP)',
    amenities: { parking: true, accessibility: true, familyFriendly: true, petFriendly: true, cardPayment: true, pixPayment: true },
    tips: [{ title: 'Horário sem Trânsito', description: 'Conteúdo exclusivo liberado no guia VIP.', isPremiumOnly: true }],
    reviews: []
  },

  // ==========================================
  // COMPRAS & FEIRINHAS
  // ==========================================
  {
    id: 'showcase-compras-01',
    name: 'Feirinha de Artesanato & Compras Selecionada #01',
    slogan: 'Renda renascença, redes paraibanas, cachaças premiadas e castanhas frescas de caju',
    categoryId: 'compras',
    categoryLabel: 'Compras & Artesanato',
    neighborhood: 'Centro de Artesanato',
    rating: 4.8,
    reviewCount: 670,
    featuredImage: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1000&q=80',
    gallery: ['https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80'],
    publicTeaser: 'O melhor polo de compras de produtos regionais da Paraíba com preços diretos de artesãos. Desbloqueie para conferir nome e dicas de negociação.',
    fullDescription: 'Dezenas de boxes com lembranças autênticas de Jampa. O guia revela quais boxes possuem melhor procedência e qualidade comprovada.',
    isFeatured: true,
    priceLevel: 'economico',
    tags: ['Artesanato', 'Renda Renascença', 'Cachaças', 'Castanhas'],
    coordinates: { lat: -7.114, lng: -34.825 },
    address: 'Polo de Artesanato, João Pessoa - PB (Revelado no Guia VIP)',
    amenities: { parking: true, accessibility: true, familyFriendly: true, petFriendly: true, cardPayment: true, pixPayment: true },
    tips: [{ title: 'Dica de Compra', description: 'Conteúdo exclusivo liberado no guia VIP.', isPremiumOnly: true }],
    reviews: []
  },

  // ==========================================
  // CULTURA & HISTÓRIA
  // ==========================================
  {
    id: 'showcase-cultura-01',
    name: 'Patrimônio Histórico & Cultural Selecionado #01 — Barroco',
    slogan: 'Conjunto arquitetônico do século XVI com azulejaria portuguesa e claustro dourado',
    categoryId: 'cultura',
    categoryLabel: 'Cultura & Patrimônio',
    neighborhood: 'Centro Histórico',
    rating: 4.9,
    reviewCount: 540,
    featuredImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1000&q=80',
    gallery: ['https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80'],
    publicTeaser: 'A terceira cidade mais antiga do Brasil guarda tesouros barrocos fascinantes. Nome do convento e horários de visita guiada liberados.',
    fullDescription: 'Um dos monumentos religiosos mais importantes da história brasileira. O guia completo entrega o roteiro a pé seguro pelo centro histórico.',
    isFeatured: true,
    priceLevel: 'economico',
    tags: ['Centro Histórico', 'Século XVI', 'Arquitetura Barroca', 'Cultura'],
    coordinates: { lat: -7.115, lng: -34.885 },
    address: 'Centro Histórico de João Pessoa - PB (Revelado no Guia VIP)',
    amenities: { parking: true, accessibility: true, familyFriendly: true, petFriendly: false, cardPayment: true, pixPayment: true },
    tips: [{ title: 'Roteiro Seguro no Centro', description: 'Conteúdo exclusivo liberado no guia VIP.', isPremiumOnly: true }],
    reviews: []
  },

  // ==========================================
  // VIDA NOTURNA & FORRÓ
  // ==========================================
  {
    id: 'showcase-noturna-01',
    name: 'Casa de Forró & Noite Selecionada #01 — Tradição Pé de Serra',
    slogan: 'O verdadeiro forró tradicional nordestino com sanfona, triângulo, zabumba e cerveja gelada',
    categoryId: 'vida-noturna',
    categoryLabel: 'Vida Noturna & Forró',
    neighborhood: 'Polo Noturno',
    rating: 4.9,
    reviewCount: 480,
    featuredImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1000&q=80',
    gallery: ['https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80'],
    publicTeaser: 'A melhor noite paraibana para dançar forró autêntico. Nome da casa, dia da melhor programação e benefício na entrada liberados no guia.',
    fullDescription: 'Experiência musical envolvente e segura. Desbloqueie seu acesso para descobrir a programação da semana e descontos exclusivos.',
    isFeatured: true,
    priceLevel: 'moderado',
    tags: ['Forró Pé de Serra', 'Dança', 'Noite Paraibana', 'Música ao Vivo'],
    coordinates: { lat: -7.117, lng: -34.828 },
    address: 'João Pessoa - PB (Revelado no Guia VIP)',
    amenities: { parking: true, accessibility: true, familyFriendly: false, petFriendly: false, cardPayment: true, pixPayment: true },
    tips: [{ title: 'Melhor Dia da Semana', description: 'Conteúdo exclusivo liberado no guia VIP.', isPremiumOnly: true }],
    reviews: []
  },

  // ==========================================
  // DICAS ESTRATÉGICAS
  // ==========================================
  {
    id: 'showcase-dicas-01',
    name: 'Guia Estratégico #01 — Tábua de Marés & Melhores Horários',
    slogan: 'Como planejar cada dia da sua viagem de acordo com a maré para encontrar piscinas transparentes',
    categoryId: 'dicas',
    categoryLabel: 'Dicas Estratégicas',
    neighborhood: 'Toda João Pessoa',
    rating: 5.0,
    reviewCount: 820,
    featuredImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80',
    gallery: ['https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80'],
    publicTeaser: 'O segredo mais valioso dos nativos: entender a maré para não perder viagens em dias ruins. Conteúdo exclusivo para membros.',
    fullDescription: 'Tabela explicativa e regras práticas de ouro para economizar tempo, dinheiro e aproveitar as praias em seu ápice de beleza.',
    isFeatured: true,
    priceLevel: 'economico',
    tags: ['Tábua de Marés', 'Planejamento', 'Economia', 'Segredos Locais'],
    coordinates: { lat: -7.115, lng: -34.825 },
    address: 'João Pessoa - PB',
    amenities: { parking: true, accessibility: true, familyFriendly: true, petFriendly: true, cardPayment: true, pixPayment: true },
    tips: [{ title: 'Regra de Ouro da Maré', description: 'Conteúdo exclusivo liberado no guia VIP.', isPremiumOnly: true }],
    reviews: []
  }
];
