import { Place } from '../types/place';

export const MOCK_PLACES: Place[] = [
  // ==========================================
  // 10 PRAIAS DE JOÃO PESSOA & LITORAL
  // ==========================================
  {
    id: 'praia-de-tambau',
    name: 'Praia de Tambaú',
    slogan: 'O coração vibrante da orla com calçadão movimentado e saída para Picãozinho',
    categoryId: 'praias',
    categoryLabel: 'Praias',
    neighborhood: 'Tambaú',
    rating: 4.9,
    reviewCount: 428,
    featuredImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1000&q=80'
    ],
    publicTeaser: 'Principal ponto de encontro da orla marítima de Jampa, com águas mornas e calçadão fechado para pedestres nas primeiras horas da manhã.',
    fullDescription: 'A Praia de Tambaú é o epicentro turístico de João Pessoa. Com quiosques modernos, ciclofaixa, coqueirais e feirinha de artesanato bem em frente, oferece infraestrutura completa. É daqui que partem os catamarãs para as famosas piscinas naturais de Picãozinho durante a maré baixa.',
    isFeatured: true,
    priceLevel: 'moderado',
    openingHours: 'Acesso livre 24h (Quiosques das 08h às 23h)',
    tags: ['Orla', 'Piscinas Naturais', 'Caminhada', 'Quiosques', 'Família'],
    coordinates: { lat: -7.1147, lng: -34.8236 },
    address: 'Av. Almirante Tamandaré, Tambaú, João Pessoa - PB',
    phone: '(83) 3214-8000',
    instagram: '@tambau.jampa',
    amenities: { parking: true, accessibility: true, familyFriendly: true, petFriendly: true, cardPayment: true, pixPayment: true },
    tips: [
      { title: 'Horário do Calçadão Fechado', description: 'A avenida da orla é fechada para veículos diariamente das 05h às 08h da manhã. Perfeito para caminhar, correr, pedalar e ver o nascer do sol.', badge: 'Dica Local', isPremiumOnly: true },
      { title: 'Embarque para Picãozinho', description: 'Consulte a tábua de marés antes de agendar! O passeio só vale a pena com maré abaixo de 0.4m. Compre com antecedência nos quiosques credenciados.', badge: 'Imperdível', isPremiumOnly: true },
      { title: 'Estacionamento sem Estresse', description: 'Vagas públicas ao longo da Av. Olavo Bilac (1 quadra para dentro) costumam ser muito mais fáceis e tranquilas nos fins de semana.', badge: 'Segredo de Jampa', isPremiumOnly: true }
    ],
    reviews: [
      { id: 'rev-1', author: 'Juliana Medeiros', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80', rating: 5, date: '10/08/2026', comment: 'Água morninha e orla super segura. O calçadão de manhã cedo com o nascer do sol é uma das melhores experiências da vida!', isVerifiedBuyer: true }
    ],
    landmark3d: { pinTitle: 'Praia de Tambaú', description: 'Orla central & Saída de Catamarãs', altitudeOffset: 0.1 }
  },
  {
    id: 'praia-de-cabo-branco',
    name: 'Praia de Cabo Branco',
    slogan: 'Orla tranquila com falésias ao fundo e ciclovia plana perfeita para passeios',
    categoryId: 'praias',
    categoryLabel: 'Praias',
    neighborhood: 'Cabo Branco',
    rating: 4.9,
    reviewCount: 390,
    featuredImage: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80'
    ],
    publicTeaser: 'Continuação natural de Tambaú, com faixa de areia larga, ambiente residencial nobre e mar com ondas suaves.',
    fullDescription: 'Cabo Branco é famosa pela sua tranquilidade e elegância. O calçadão arborizado conta com academias ao ar livre, quiosques gastronômicos de frutos do mar e uma vista privilegiada para as falésias no horizonte.',
    isFeatured: true,
    priceLevel: 'moderado',
    openingHours: 'Acesso livre 24h',
    tags: ['Ciclovia', 'Corrida', 'Tranquilidade', 'Quiosques Gourmet', 'Água Morna'],
    coordinates: { lat: -7.1352, lng: -34.8211 },
    address: 'Av. Cabo Branco, João Pessoa - PB',
    amenities: { parking: true, accessibility: true, familyFriendly: true, petFriendly: true, cardPayment: true, pixPayment: true },
    tips: [
      { title: 'Trecho Final das Falésias', description: 'O trecho final da Av. Cabo Branco, próximo à Barreira, é o mais calmo e com mar estilo piscina natural na maré seca.', badge: 'Dica dos Nativos', isPremiumOnly: true },
      { title: 'Coco Gelado no Quiosque Olho da Lula', description: 'Excelente custo-benefício para petiscar camarão e água de coco fresca pós-caminhada.', badge: 'Gastronomia na Praia', isPremiumOnly: true }
    ],
    reviews: [
      { id: 'rev-2', author: 'Thiago Barreto', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80', rating: 5, date: '04/08/2026', comment: 'Praia limpa e extremamente agradável. Correr no calçadão no final da tarde é maravilhoso.', isVerifiedBuyer: true }
    ]
  },
  {
    id: 'praia-do-bessa-caribessa',
    name: 'Praia do Bessa (Caribessa)',
    slogan: 'O famoso mar azul-turquesa caribenho com piscinas de corais perfeitas para stand-up paddle',
    categoryId: 'praias',
    categoryLabel: 'Praias',
    neighborhood: 'Bessa',
    rating: 4.9,
    reviewCount: 460,
    featuredImage: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1000&q=80'
    ],
    publicTeaser: 'Trecho do Bessa conhecido carinhosamente como Caribessa devido à cor esmeralda das águas protegidas por corais.',
    fullDescription: 'Localizada no litoral norte de João Pessoa, a praia conta com uma barreira de recifes a cerca de 800m da areia. O mar vira uma lagoa calma sem ondas durante a maré baixa, ideal para aluguel de caiaque transparente e SUP.',
    isFeatured: true,
    priceLevel: 'moderado',
    openingHours: 'Acesso livre 24h (Aluguel de pranchas das 08h às 16h)',
    tags: ['Stand Up Paddle', 'Caribessa', 'Águas Cristalinas', 'Caiaque', 'Família'],
    coordinates: { lat: -7.0789, lng: -34.8294 },
    address: 'Av. Gov. Argemiro de Figueiredo, Bessa, João Pessoa - PB',
    amenities: { parking: true, accessibility: true, familyFriendly: true, petFriendly: true, cardPayment: true, pixPayment: true },
    tips: [
      { title: 'Caiaque Transparente até os Corais', description: 'Alugue o caiaque de acrílico transparente para remar até os recifes e ver peixes ornamentais e tartarugas.', badge: 'Atividade Top', isPremiumOnly: true },
      { title: 'Golfinhos de Manhã', description: 'Entre 06h30 e 08h30 é muito comum avistar botos e golfinhos nadando perto da arrebentação.', badge: 'Vida Marinha', isPremiumOnly: true }
    ],
    reviews: [
      { id: 'rev-3', author: 'Mariana Duarte', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80', rating: 5, date: '01/08/2026', comment: 'Sem dúvidas o mar mais bonito da área urbana de João Pessoa. O apelido Caribessa faz total sentido!', isVerifiedBuyer: true }
    ]
  },
  {
    id: 'praia-de-manaira',
    name: 'Praia de Manaíra',
    slogan: 'Orla urbana com calçadão gastronômico, shoppings e praças arborizadas',
    categoryId: 'praias',
    categoryLabel: 'Praias',
    neighborhood: 'Manaíra',
    rating: 4.6,
    reviewCount: 310,
    featuredImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1000&q=80'
    ],
    publicTeaser: 'Bairro nobre com grande oferta de restaurantes, quiosques descolados e proximidade dos melhores shoppings.',
    fullDescription: 'Manaíra é conhecida por concentrar os melhores restaurantes e a vida comercial da orla. Seu calçadão é muito frequentado para caminhadas, passeios com pets e happy hours de frente para o mar.',
    isFeatured: false,
    priceLevel: 'moderado',
    tags: ['Gastronomia', 'Pet Friendly', 'Passeio', 'Orla'],
    coordinates: { lat: -7.0982, lng: -34.8288 },
    address: 'Av. João Maurício, Manaíra, João Pessoa - PB',
    amenities: { parking: true, accessibility: true, familyFriendly: true, petFriendly: true, cardPayment: true, pixPayment: true },
    tips: [
      { title: 'Melhor para Caminhar e Comer', description: 'Embora o banho seja mais procurado em Tambaú e Bessa, o calçadão de Manaíra é imbatível para o fim de tarde e jantar.', badge: 'Dica Prática', isPremiumOnly: true }
    ],
    reviews: []
  },
  {
    id: 'ponta-do-seixas-praia',
    name: 'Praia da Ponta do Seixas',
    slogan: 'Praia rústica aos pés da falésia com piscinas naturais de corais intocados',
    categoryId: 'praias',
    categoryLabel: 'Praias',
    neighborhood: 'Ponta do Seixas',
    rating: 4.8,
    reviewCount: 410,
    featuredImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1000&q=80'
    ],
    publicTeaser: 'Ponto continental mais a leste de todas as Américas. Ponto de partida de catamarãs para as Piscinas Naturais do Seixas.',
    fullDescription: 'A praia da Ponta do Seixas oferece uma atmosfera rústica e autêntica de vila de pescadores. Na maré baixa, formam-se piscinas naturais de águas esmeraldas repletas de vida marinha.',
    isFeatured: true,
    priceLevel: 'economico',
    tags: ['Ponto Oriental', 'Piscinas Naturais', 'Peixe Frito', 'Rústico'],
    coordinates: { lat: -7.1524, lng: -34.7938 },
    address: 'Praia do Seixas, João Pessoa - PB',
    amenities: { parking: true, accessibility: false, familyFriendly: true, petFriendly: true, cardPayment: true, pixPayment: true },
    tips: [
      { title: 'Piscinas do Seixas vs Picãozinho', description: 'As piscinas do Seixas são mais extensas e geralmente menos cheias que as de Tambaú. Não deixe de levar snorkel.', badge: 'Segredo VIP', isPremiumOnly: true }
    ],
    reviews: []
  },
  {
    id: 'praia-de-coqueirinho',
    name: 'Praia de Coqueirinho (Litoral Sul)',
    slogan: 'Falésias de areia colorida, coqueirais ondulantes e mar calmo em formato de ferradura',
    categoryId: 'praias',
    categoryLabel: 'Praias',
    neighborhood: 'Conde / Costa do Conde',
    rating: 5.0,
    reviewCount: 740,
    featuredImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1000&q=80'
    ],
    publicTeaser: 'Considerada uma das 10 praias mais deslumbrantes do Brasil, cercada por cânions e falésias avermelhadas.',
    fullDescription: 'Localizada no município de Conde (a apenas 35 minutos de João Pessoa), Coqueirinho tem duas enseadas: uma de mar aberto para surf e uma enseada protegida de águas calmas e mornas, perfeita para banho e crianças.',
    isFeatured: true,
    priceLevel: 'moderado',
    openingHours: 'Acesso livre; Quiosques das 09h às 17h',
    tags: ['Falésias', 'Litoral Sul', 'Cânions', 'Mar Calmo', 'Passeio de Buggy'],
    coordinates: { lat: -7.3186, lng: -34.7997 },
    address: 'Costa do Conde, Litoral Sul da Paraíba',
    amenities: { parking: true, accessibility: false, familyFriendly: true, petFriendly: true, cardPayment: true, pixPayment: true },
    tips: [
      { title: 'Mirante Dedo de Deus', description: 'Antes de descer para a praia, pare no mirante no topo da falésia para a foto panorâmica mais espetacular da Paraíba.', badge: 'Ponto Fotográfico', isPremiumOnly: true },
      { title: 'Descida Íngreme', description: 'A descida de carro convencional exige atenção no trecho final. Se preferir, deixe no estacionamento superior ou faça o tour de Buggy.', badge: 'Acesso Seguro', isPremiumOnly: true }
    ],
    reviews: [],
    landmark3d: { pinTitle: 'Praia de Coqueirinho', description: 'Falésias e Cânions do Litoral Sul', altitudeOffset: 0.18 }
  },
  {
    id: 'praia-de-tambaba',
    name: 'Praia de Tambaba (Falésias & Naturismo)',
    slogan: 'Pioneira no naturismo no Nordeste, cercada por pedras vulcânicas e piscinas marinhas',
    categoryId: 'praias',
    categoryLabel: 'Praias',
    neighborhood: 'Conde / Litoral Sul',
    rating: 4.8,
    reviewCount: 490,
    featuredImage: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80'
    ],
    publicTeaser: 'Famosa mundialmente, dividida em um setor aberto com roupas e um setor naturista com regras rigorosas de respeito.',
    fullDescription: 'Tambaba é uma joia esculpida na rocha. A primeira enseada é aberta ao público em geral com roupas de banho e conta com o famoso coqueiro nascido em cima da pedra. A segunda enseada é a área naturista oficial.',
    isFeatured: true,
    priceLevel: 'moderado',
    tags: ['Falésias', 'Naturismo', 'Coqueiro na Pedra', 'Litoral Sul', 'Natureza'],
    coordinates: { lat: -7.3627, lng: -34.7972 },
    address: 'Área de Proteção Ambiental de Tambaba, Conde - PB',
    amenities: { parking: true, accessibility: false, familyFriendly: true, petFriendly: false, cardPayment: true, pixPayment: true },
    tips: [
      { title: 'Mirante na Chegada', description: 'A vista panorâmica das pedras negras contrastando com a água azul royal é uma das mais marcantes do Nordeste.', badge: 'Vista Panorâmica', isPremiumOnly: true },
      { title: 'Regras da Área Naturista', description: 'Homens desacompanhados necessitam de passaporte naturista da FBN ou devem estar acompanhados de casal para entrar na área restrita.', badge: 'Atenção às Regras', isPremiumOnly: true }
    ],
    reviews: []
  },
  {
    id: 'praia-bela',
    name: 'Praia Bela (Encontro do Rio com o Mar)',
    slogan: 'O encontro paradisíaco do Rio Mucatu com o oceano, com mesas dentro da água doce',
    categoryId: 'praias',
    categoryLabel: 'Praias',
    neighborhood: 'Pitimbu / Litoral Sul',
    rating: 4.9,
    reviewCount: 520,
    featuredImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80',
    gallery: ['https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80'],
    publicTeaser: 'Cenário cinematográfico onde você degusta petiscos com os pés na água morna do rio enquanto contempla o mar.',
    fullDescription: 'Localizada no município de Pitimbu (cerca de 45 minutos ao sul de Jampa), Praia Bela é famosa pelos quiosques rústicos montados nas margens do Rio Mucatu. Oferece tirolesa, caiaque e travessia até a praia oceânica.',
    isFeatured: true,
    priceLevel: 'moderado',
    tags: ['Rio e Mar', 'Tirolesa', 'Mesas na Água', 'Litoral Sul', 'Família'],
    coordinates: { lat: -7.4721, lng: -34.8078 },
    address: 'Foz do Rio Mucatu, Pitimbu - PB',
    amenities: { parking: true, accessibility: false, familyFriendly: true, petFriendly: true, cardPayment: true, pixPayment: true },
    tips: [
      { title: 'Tirolesa do Rio Mucatu', description: 'Faça a descida de tirolesa que cai direto nas águas mornas do rio (valor médio de R$ 20).', badge: 'Aventura', isPremiumOnly: true }
    ],
    reviews: []
  },
  {
    id: 'praia-de-tabatinga',
    name: 'Praia de Tabatinga',
    slogan: 'Enseada selvagem de falésias coloridas com lagoas de água doce formadas por maceiós',
    categoryId: 'praias',
    categoryLabel: 'Praias',
    neighborhood: 'Conde / Litoral Sul',
    rating: 4.8,
    reviewCount: 330,
    featuredImage: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1000&q=80',
    gallery: ['https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=800&q=80'],
    publicTeaser: 'Praia quase deserta com extenso paredão de falésias e encontro do Rio Santo Antônio com o mar.',
    fullDescription: 'Tabatinga é dividida pelo Rio Santo Antônio. De um lado, mar aberto com ondas revigorantes; do outro, uma lagoa mansa de água doce perfeita para relaxar após o banho de mar salgado.',
    isFeatured: false,
    priceLevel: 'economico',
    tags: ['Falésias', 'Lagoa', 'Deserta', 'Tranquilidade'],
    coordinates: { lat: -7.3364, lng: -34.7981 },
    address: 'Costa do Conde, Litoral Sul - PB',
    amenities: { parking: true, accessibility: false, familyFriendly: true, petFriendly: true, cardPayment: true, pixPayment: true },
    tips: [
      { title: 'Argila Medicinal nas Falésias', description: 'Em certos pontos da falésia há argila natural utilizada para hidratação e esfoliação da pele.', badge: 'Dica Natural', isPremiumOnly: true }
    ],
    reviews: []
  },
  {
    id: 'praia-barra-de-gramame',
    name: 'Barra de Gramame',
    slogan: 'O encontro do Rio Gramame com o oceano com pôr do sol espetacular sobre o manguezal',
    categoryId: 'praias',
    categoryLabel: 'Praias',
    neighborhood: 'Litoral Sul',
    rating: 4.7,
    reviewCount: 380,
    featuredImage: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1000&q=80',
    gallery: ['https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80'],
    publicTeaser: 'Ampla faixa de areia dourada entre o rio e o mar, com quiosques servindo caranguejo fresco e caldinhos típicos.',
    fullDescription: 'Localizada no limite sul de João Pessoa, a Barra de Gramame é muito procurada para esportes náuticos (kitesurf e caiaque) e piqueniques à sombra de coqueiros.',
    isFeatured: false,
    priceLevel: 'economico',
    tags: ['Rio Gramame', 'Kitesurf', 'Caranguejo', 'Pôr do Sol'],
    coordinates: { lat: -7.2155, lng: -34.8105 },
    address: 'Foz do Rio Gramame, João Pessoa / Conde - PB',
    amenities: { parking: true, accessibility: false, familyFriendly: true, petFriendly: true, cardPayment: true, pixPayment: true },
    tips: [
      { title: 'Pôr do Sol no Rio', description: 'Fique até o final da tarde no lado do rio para assistir o sol poente refletindo no espelho d’água.', badge: 'Visual Mágico', isPremiumOnly: true }
    ],
    reviews: []
  },

  // ==========================================
  // 10 RESTAURANTES SELECIONADOS DE JOÃO PESSOA
  // ==========================================
  {
    id: 'restaurante-mangai',
    name: 'Restaurante Mangai',
    slogan: 'O templo sagrado da gastronomia regional nordestina com mais de 200 pratos',
    categoryId: 'restaurantes',
    categoryLabel: 'Restaurantes',
    neighborhood: 'Manaíra',
    rating: 4.9,
    reviewCount: 890,
    featuredImage: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80'
    ],
    publicTeaser: 'Referência nacional de comida sertaneja paraibana: carne de sol na nata, baião de dois, queijo coalho e sobremesas divinas.',
    fullDescription: 'Nascido em João Pessoa, o Mangai se transformou em uma lenda gastronômica. Em um ambiente ricamente decorado com peças do folclore nordestino, oferece o buffet a quilo mais completo e premiado do Brasil.',
    isFeatured: true,
    priceLevel: 'moderado',
    openingHours: 'Segunda a Domingo: 11h30 às 22h00',
    tags: ['Buffet Regional', 'Carne de Sol', 'Queijo Coalho', 'Sobremesas', 'Ar Condicionado'],
    coordinates: { lat: -7.1089, lng: -34.8322 },
    address: 'Av. Gen. Edson Ramalho, 696, Manaíra, João Pessoa - PB',
    phone: '(83) 3244-3300',
    whatsapp: '5583991234567',
    instagram: '@mangairestaurante',
    amenities: { parking: true, accessibility: true, familyFriendly: true, petFriendly: false, cardPayment: true, pixPayment: true },
    tips: [
      { title: 'Pratos Obrigatórios no Prato', description: 'Experimente a Carne de Sol com Nata, o Feijão Verde com Queijo Coalho e o famoso Escondidinho de Macaxeira com Charque.', badge: 'O que pedir', isPremiumOnly: true },
      { title: 'Sobremesa de Cartola', description: 'Peça a Cartola tradicional feita na hora (banana frita, queijo manteiga derretido, açúcar e canela).', badge: 'Segredo Doce', isPremiumOnly: true },
      { title: 'Horário sem Fila', description: 'Aos sábados e domingos chegue antes das 12h15 ou após as 14h30 para pegar mesa sem espera.', badge: 'Planejamento', isPremiumOnly: true }
    ],
    reviews: [
      { id: 'rev-5', author: 'Eduardo Guedes', avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=150&q=80', rating: 5, date: '05/08/2026', comment: 'Indiscutivelmente o melhor restaurante regional do país. Tudo fresco, quentinho e com um sabor indescritível.', isVerifiedBuyer: true }
    ],
    landmark3d: { pinTitle: 'Restaurante Mangai', description: 'Tradição Gastronômica Paraibana', altitudeOffset: 0.12 }
  },
  {
    id: 'restaurante-nau-frutos-do-mar',
    name: 'NAU Frutos do Mar',
    slogan: 'Alta gastronomia litorânea e contemporânea em ambiente de arquitetura monumental',
    categoryId: 'restaurantes',
    categoryLabel: 'Restaurantes',
    neighborhood: 'Manaíra',
    rating: 4.9,
    reviewCount: 620,
    featuredImage: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=800&q=80'
    ],
    publicTeaser: 'Pratos exuberantes com camarões gigantes, polvos grelhados, pescados nobres e carta de vinhos impecável.',
    fullDescription: 'O NAU combina requinte arquitetônico assinado com a abundância do mar paraibano. Cada prato é uma obra de arte com porções generosas perfeitas para compartilhar.',
    isFeatured: true,
    priceLevel: 'alto',
    openingHours: 'Terça a Domingo: 12h00 às 15h30 e 18h30 às 23h30',
    tags: ['Frutos do Mar', 'Camarão', 'Alta Gastronomia', 'Romântico', 'Vinhos'],
    coordinates: { lat: -7.1042, lng: -34.8364 },
    address: 'Rua Lupércio Branco, 130, Manaíra, João Pessoa - PB',
    phone: '(83) 3247-1588',
    amenities: { parking: true, accessibility: true, familyFriendly: true, petFriendly: false, cardPayment: true, pixPayment: true },
    tips: [
      { title: 'Prato Estrela: Camarão NAU Frutos do Mar', description: 'Camarões salteados na manteiga da terra, arroz cremoso com queijo coalho e redução especial de rapadura e ervas.', badge: 'Recomendação do Chef', isPremiumOnly: true }
    ],
    reviews: []
  },
  {
    id: 'restaurante-adega-do-alfredo',
    name: 'Adega do Alfredo',
    slogan: 'Tradição portuguesa e mediterrânea com bacalhaus nobres e carta de vinhos histórica',
    categoryId: 'restaurantes',
    categoryLabel: 'Restaurantes',
    neighborhood: 'Tambaú',
    rating: 4.8,
    reviewCount: 340,
    featuredImage: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=1000&q=80',
    gallery: ['https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=800&q=80'],
    publicTeaser: 'Um dos mais tradicionais restaurantes finos de João Pessoa, famoso pelos autênticos pratos de bacalhau e ambiente intimista.',
    fullDescription: 'Fundada há mais de 30 anos, a Adega do Alfredo é parada obrigatória para os apreciadores da boa culinária portuguesa, frutos do mar e carnes selecionadas.',
    isFeatured: false,
    priceLevel: 'alto',
    openingHours: 'Segunda a Sábado: 12h às 15h e 19h às 23h30',
    tags: ['Bacalhau', 'Cozinha Portuguesa', 'Vinhos', 'Intimista'],
    coordinates: { lat: -7.1129, lng: -34.8272 },
    address: 'Rua Coração de Jesus, s/n, Tambaú, João Pessoa - PB',
    amenities: { parking: true, accessibility: true, familyFriendly: true, petFriendly: false, cardPayment: true, pixPayment: true },
    tips: [
      { title: 'Bacalhau à Lagareiro', description: 'Lombo alto de bacalhau confitado no azeite extra virgem com batatas ao murro e alho tostado.', badge: 'Prato do Chef', isPremiumOnly: true }
    ],
    reviews: []
  },
  {
    id: 'restaurante-bar-do-cuscuz',
    name: 'Bar do Cuscuz',
    slogan: 'O ponto de encontro mais animado da orla de Cabo Branco com cuscuz recheado e chopp trincando',
    categoryId: 'restaurantes',
    categoryLabel: 'Restaurantes',
    neighborhood: 'Cabo Branco',
    rating: 4.8,
    reviewCount: 780,
    featuredImage: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1000&q=80',
    gallery: ['https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80'],
    publicTeaser: 'Gigantesco complexo à beira-mar com telões para esportes, música ao vivo, carnes na brasa e variedades de cuscuz.',
    fullDescription: 'O Bar do Cuscuz é uma verdadeira instituição paraibana. Combina a vista para a praia de Cabo Branco com petiscos generosos, chopp geladíssimo e ambiente descontraído.',
    isFeatured: true,
    priceLevel: 'moderado',
    openingHours: 'Diariamente: 11h às 00h',
    tags: ['Cuscuz', 'Chopp Gelado', 'Música ao Vivo', 'Frente Mar', 'Happy Hour'],
    coordinates: { lat: -7.1268, lng: -34.8222 },
    address: 'Av. Cabo Branco, 3056, Cabo Branco, João Pessoa - PB',
    amenities: { parking: true, accessibility: true, familyFriendly: true, petFriendly: true, cardPayment: true, pixPayment: true },
    tips: [
      { title: 'Cuscuz de Charque com Queijo Coalho', description: 'Porção individual super generosa que serve como uma refeição completa e deliciosa.', badge: 'Mais Pedido', isPremiumOnly: true }
    ],
    reviews: []
  },
  {
    id: 'restaurante-toca-do-caju',
    name: 'Toca do Caju (Litoral Sul)',
    slogan: 'Alta gastronomia litorânea com peixes frescos na brasa e vista panorâmica para o mar',
    categoryId: 'restaurantes',
    categoryLabel: 'Restaurantes',
    neighborhood: 'Conde / Litoral Sul',
    rating: 4.9,
    reviewCount: 310,
    featuredImage: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1000&q=80',
    gallery: ['https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80'],
    publicTeaser: 'Localizado dentro de pousada charmosa no Conde, perfeito para almoçar durante o roteiro do Litoral Sul.',
    fullDescription: 'Com mesas em deck de madeira debruçadas sobre o verde e o mar, a Toca do Caju serve peixes grelhados inteiros, moquecas aromáticas e drinks tropicais artesanais.',
    isFeatured: false,
    priceLevel: 'alto',
    tags: ['Vista Mar', 'Litoral Sul', 'Peixe na Brasa', 'Moqueca', 'Romântico'],
    coordinates: { lat: -7.3241, lng: -34.8012 },
    address: 'Praia de Tabatinga, Conde - PB',
    amenities: { parking: true, accessibility: false, familyFriendly: true, petFriendly: true, cardPayment: true, pixPayment: true },
    tips: [
      { title: 'Reserva Antecipada no Almoço', description: 'Nos fins de semana reserve mesa com antecedência para garantir a melhor vista no deck frontal.', badge: 'Reserva VIP', isPremiumOnly: true }
    ],
    reviews: []
  },
  {
    id: 'restaurante-gulliver-mar',
    name: 'Gulliver Mar',
    slogan: 'Restaurante sofisticado com arquitetura contemporânea e vista deslumbrante da orla do Cabo Branco',
    categoryId: 'restaurantes',
    categoryLabel: 'Restaurantes',
    neighborhood: 'Cabo Branco',
    rating: 4.8,
    reviewCount: 420,
    featuredImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1000&q=80',
    gallery: ['https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80'],
    publicTeaser: 'Ambiente climatizado elegante com janelões de vidro panorâmicos voltados para o mar de Cabo Branco.',
    fullDescription: 'Especializado em frutos do mar e carnes nobres com toques da culinária francesa e italiana, o Gulliver Mar é perfeito para comemorações especiais e jantares românticos.',
    isFeatured: false,
    priceLevel: 'luxo',
    tags: ['Vista Panorâmica', 'Alta Gastronomia', 'Romântico', 'Vinhos Nobres'],
    coordinates: { lat: -7.1389, lng: -34.8202 },
    address: 'Av. Cabo Branco, 5100, Cabo Branco, João Pessoa - PB',
    amenities: { parking: true, accessibility: true, familyFriendly: true, petFriendly: false, cardPayment: true, pixPayment: true },
    tips: [
      { title: 'Polvo Grelhado com Risoto de Limão Siciliano', description: 'Textura macia impecável e harmonização perfeita com vinhos brancos leves.', badge: 'Prato Especial', isPremiumOnly: true }
    ],
    reviews: []
  },
  {
    id: 'restaurante-peixada-do-guiomar',
    name: 'Peixada do Guiomar',
    slogan: 'A mais tradicional e autêntica peixada paraibana servida na panela de barro há 40 anos',
    categoryId: 'restaurantes',
    categoryLabel: 'Restaurantes',
    neighborhood: 'Tambaú',
    rating: 4.7,
    reviewCount: 360,
    featuredImage: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1000&q=80',
    gallery: ['https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80'],
    publicTeaser: 'Receita caseira e afetiva de peixe em posta cozido com leite de coco, pirão fumegante e arroz branquinho.',
    fullDescription: 'Ambiente familiar e tradicional próximo à feirinha de Tambaú, a Peixada do Guiomar mantém a receita original paraibana inalterada há décadas.',
    isFeatured: false,
    priceLevel: 'moderado',
    tags: ['Peixada Paraibana', 'Pirão', 'Tradição', 'Panela de Barro'],
    coordinates: { lat: -7.1141, lng: -34.8255 },
    address: 'Av. Olavo Bilac, Tambaú, João Pessoa - PB',
    amenities: { parking: true, accessibility: true, familyFriendly: true, petFriendly: true, cardPayment: true, pixPayment: true },
    tips: [
      { title: 'Pirão com Molho de Pimenta da Casa', description: 'Peça o molho de pimenta artesanal feito na casa para acompanhar o pirão de peixe.', badge: 'Dica de Sabor', isPremiumOnly: true }
    ],
    reviews: []
  },
  {
    id: 'restaurante-canoa-dos-camaroes',
    name: 'Canoa dos Camarões',
    slogan: 'Festival completo com mais de 20 variações de camarão servidas na orla de Manaíra',
    categoryId: 'restaurantes',
    categoryLabel: 'Restaurantes',
    neighborhood: 'Manaíra',
    rating: 4.7,
    reviewCount: 450,
    featuredImage: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1000&q=80',
    gallery: ['https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80'],
    publicTeaser: 'Rodízio e sequência de camarão em frente à praia: empanado, ao alho e óleo, ao catupiry e no coco.',
    fullDescription: 'Para quem ama camarão em abundância com vista para o mar e ótimo custo-benefício, o Canoa dos Camarões é um dos endereços mais tradicionais de Jampa.',
    isFeatured: false,
    priceLevel: 'moderado',
    tags: ['Rodízio de Camarão', 'Sequência', 'Frutos do Mar', 'Frente Mar'],
    coordinates: { lat: -7.1005, lng: -34.8279 },
    address: 'Av. João Maurício, 1211, Manaíra, João Pessoa - PB',
    amenities: { parking: true, accessibility: true, familyFriendly: true, petFriendly: false, cardPayment: true, pixPayment: true },
    tips: [
      { title: 'Sequência de Camarão para 2 Pessoas', description: 'Muito bem servida, ideal para compartilhar com a família após uma manhã de praia.', badge: 'Custo-Benefício', isPremiumOnly: true }
    ],
    reviews: []
  },
  {
    id: 'restaurante-sal-e-brasa',
    name: 'Sal & Brasa Churrascaria Prime',
    slogan: 'Rodízio nobre de carnes premium, buffet com frutos do mar, sushi e queijos importados',
    categoryId: 'restaurantes',
    categoryLabel: 'Restaurantes',
    neighborhood: 'Bessa / Aeroclube',
    rating: 4.8,
    reviewCount: 510,
    featuredImage: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1000&q=80',
    gallery: ['https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80'],
    publicTeaser: 'Cortes seletos de picanha nobre, bife ancho, cordeiro e buffet internacional monumental.',
    fullDescription: 'Com espaço imponente e estacionamento próprio, o Sal & Brasa oferece o rodízio de carnes mais completo da capital paraibana.',
    isFeatured: false,
    priceLevel: 'alto',
    tags: ['Churrasco', 'Picanha', 'Buffet Internacional', 'Estacionamento Próprio'],
    coordinates: { lat: -7.0855, lng: -34.8412 },
    address: 'Av. Fernando Luis Henrique dos Santos, 2026, Bessa, João Pessoa - PB',
    amenities: { parking: true, accessibility: true, familyFriendly: true, petFriendly: false, cardPayment: true, pixPayment: true },
    tips: [
      { title: 'Paleta de Cordeiro com Geleia de Menta', description: 'Um dos cortes mais aclamados do rodízio, extremamente macio e suculento.', badge: 'Recomendação', isPremiumOnly: true }
    ],
    reviews: []
  },
  {
    id: 'restaurante-estolano',
    name: 'Estolano Gastronomia',
    slogan: 'Cozinha autoral e sofisticada com ingredientes locais em ambiente acolhedor',
    categoryId: 'restaurantes',
    categoryLabel: 'Restaurantes',
    neighborhood: 'Tambaú',
    rating: 4.9,
    reviewCount: 290,
    featuredImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1000&q=80',
    gallery: ['https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80'],
    publicTeaser: 'Menu contemporâneo com foco em produtos da agricultura familiar e da costa paraibana.',
    fullDescription: 'Criado por chefs premiados, o Estolano oferece uma experiência intimista com harmonizações de vinhos e coquetelaria autoral.',
    isFeatured: false,
    priceLevel: 'alto',
    tags: ['Cozinha Autoral', 'Chefs Premiados', 'Intimista', 'Coquetelaria'],
    coordinates: { lat: -7.1165, lng: -34.8285 },
    address: 'Rua Antônio Lira, 212, Tambaú, João Pessoa - PB',
    amenities: { parking: true, accessibility: true, familyFriendly: false, petFriendly: false, cardPayment: true, pixPayment: true },
    tips: [
      { title: 'Menu Degustação em 5 Etapas', description: 'Disponível às sextas e sábados mediante reserva prévia.', badge: 'Experiência Gourmet', isPremiumOnly: true }
    ],
    reviews: []
  },

  // ==========================================
  // 5 HOTÉIS & POUSADAS EM JOÃO PESSOA
  // ==========================================
  {
    id: 'hotel-nord-luxxor-tambau',
    name: 'Nord Luxxor Tambaú',
    slogan: 'Hotel 4 estrelas pé na areia com piscina de borda infinita de frente para a praia de Tambaú',
    categoryId: 'hoteis',
    categoryLabel: 'Hotéis & Pousadas',
    neighborhood: 'Tambaú',
    rating: 4.9,
    reviewCount: 460,
    featuredImage: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=80',
    gallery: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80'],
    publicTeaser: 'Localização imbatível na orla de Tambaú, próximo à feirinha e aos melhores restaurantes da cidade.',
    fullDescription: 'Com quartos modernos com vista para o mar, café da manhã regional farto e piscina no rooftop, o Nord Luxxor é um dos hotéis mais concorridos de Jampa.',
    isFeatured: true,
    priceLevel: 'alto',
    tags: ['Pé na Areia', 'Piscina Rooftop', 'Café da Manhã Regional', 'Vista Mar'],
    coordinates: { lat: -7.1152, lng: -34.8231 },
    address: 'Av. Almirante Tamandaré, 740, Tambaú, João Pessoa - PB',
    amenities: { parking: true, accessibility: true, familyFriendly: true, petFriendly: false, cardPayment: true, pixPayment: true },
    tips: [
      { title: 'Quarto com Varanda Lateral para o Mar', description: 'Excelente custo-benefício com vista panorâmica do nascer do sol.', badge: 'Dica de Hospedagem', isPremiumOnly: true }
    ],
    reviews: []
  },
  {
    id: 'hotel-oceana-atlantico',
    name: 'Oceana Atlântico Hotel',
    slogan: 'Resort urbano 5 estrelas pé na areia no Bessa com piscinas integradas e alta gastronomia',
    categoryId: 'hoteis',
    categoryLabel: 'Hotéis & Pousadas',
    neighborhood: 'Bessa',
    rating: 4.9,
    reviewCount: 530,
    featuredImage: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1000&q=80',
    gallery: ['https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80'],
    publicTeaser: 'O hotel mais luxuoso de João Pessoa, de frente para as águas calmas do Caribessa.',
    fullDescription: 'Projetado com arquitetura contemporânea e paisagismo tropical, o Oceana Atlântico conta com spa completo, academia de frente para o mar e restaurante assinado.',
    isFeatured: true,
    priceLevel: 'luxo',
    tags: ['Resort Urbano', '5 Estrelas', 'Spa Completo', 'Pé na Areia', 'Luxo'],
    coordinates: { lat: -7.0722, lng: -34.8315 },
    address: 'Av. Gov. Argemiro de Figueiredo, 2100, Bessa, João Pessoa - PB',
    amenities: { parking: true, accessibility: true, familyFriendly: true, petFriendly: true, cardPayment: true, pixPayment: true },
    tips: [
      { title: 'Acesso Direto à Praia', description: 'Serviço de praia exclusivo com espreguiçadeiras e atendimento do bar na areia.', badge: 'Exclusividade', isPremiumOnly: true }
    ],
    reviews: []
  },
  {
    id: 'hotel-laguna-praia',
    name: 'Laguna Praia Hotel',
    slogan: 'Estrutura completa na orla de Tambaú com piscina panorâmica e excelente atendimento',
    categoryId: 'hoteis',
    categoryLabel: 'Hotéis & Pousadas',
    neighborhood: 'Tambaú',
    rating: 4.8,
    reviewCount: 380,
    featuredImage: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=80',
    gallery: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80'],
    publicTeaser: 'Frente ao mar de Tambaú, perfeito para famílias com fácil acesso a passeios e vida noturna.',
    fullDescription: 'Oferece apartamentos confortáveis, piscina climatizada no terraço com vista para o oceano e café da manhã premiado com tapiocas feitas na hora.',
    isFeatured: false,
    priceLevel: 'alto',
    tags: ['Frente Mar', 'Família', 'Piscina Panorâmica', 'Tapiocaria'],
    coordinates: { lat: -7.1135, lng: -34.8239 },
    address: 'Av. Almirante Tamandaré, 316, Tambaú, João Pessoa - PB',
    amenities: { parking: true, accessibility: true, familyFriendly: true, petFriendly: false, cardPayment: true, pixPayment: true },
    tips: [
      { title: 'Tapioca com Carne de Sol no Café', description: 'Peça no balcão ao vivo do café da manhã a tapioca de queijo coalho com carne de sol.', badge: 'Gastronomia', isPremiumOnly: true }
    ],
    reviews: []
  },
  {
    id: 'pousada-aconchego-cabo-branco',
    name: 'Pousada Aconchego do Cabo Branco',
    slogan: 'Pousada boutique charmosa e intimista a apenas 100m da praia do Cabo Branco',
    categoryId: 'hoteis',
    categoryLabel: 'Hotéis & Pousadas',
    neighborhood: 'Cabo Branco',
    rating: 4.8,
    reviewCount: 290,
    featuredImage: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1000&q=80',
    gallery: ['https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80'],
    publicTeaser: 'Ambiente tranquilo com jardim arborizado, piscina e atendimento acolhedor estilo casa de praia.',
    fullDescription: 'Ideal para casais que buscam paz e sossego sem abrir mão da proximidade com a praia e bons restaurantes.',
    isFeatured: false,
    priceLevel: 'moderado',
    tags: ['Pousada Boutique', 'Romântico', 'Jardim Tropical', 'Silêncio'],
    coordinates: { lat: -7.1315, lng: -34.8242 },
    address: 'Rua Edvaldo Bezerra Cavalcanti Pinho, 88, Cabo Branco, João Pessoa - PB',
    amenities: { parking: true, accessibility: false, familyFriendly: true, petFriendly: false, cardPayment: true, pixPayment: true },
    tips: [
      { title: 'Quartos Térreos com Varanda', description: 'Acesso direto para o jardim e piscina com rede para descanso.', badge: 'Conforto', isPremiumOnly: true }
    ],
    reviews: []
  },
  {
    id: 'hotel-manaira',
    name: 'Hotel Manaíra',
    slogan: 'Design moderno, sustentabilidade e rooftop com vista 360 graus da cidade e da praia',
    categoryId: 'hoteis',
    categoryLabel: 'Hotéis & Pousadas',
    neighborhood: 'Manaíra',
    rating: 4.8,
    reviewCount: 410,
    featuredImage: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=80',
    gallery: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80'],
    publicTeaser: 'Hotel executivo e de lazer sofisticado com bicicletas elétricas gratuitas para hóspedes.',
    fullDescription: 'Localizado a poucas quadras da praia de Manaíra, combina tecnologia, quartos acústicos, gastronomia contemporânea e lazer na cobertura.',
    isFeatured: false,
    priceLevel: 'alto',
    tags: ['Rooftop 360', 'Bicicletas Grátis', 'Design Moderno', 'Sustentável'],
    coordinates: { lat: -7.1035, lng: -34.8351 },
    address: 'Av. Gen. Edson Ramalho, 1131, Manaíra, João Pessoa - PB',
    amenities: { parking: true, accessibility: true, familyFriendly: true, petFriendly: false, cardPayment: true, pixPayment: true },
    tips: [
      { title: 'Bicicleta na Orla', description: 'Aproveite as bikes gratuitas do hotel para pedalar até a ponta do Cabo Branco no amanhecer.', badge: 'Passeio Saudável', isPremiumOnly: true }
    ],
    reviews: []
  },

  // ==========================================
  // 5 PASSEIOS & EXPERIÊNCIAS NÁUTICAS
  // ==========================================
  {
    id: 'piscinas-naturais-picaozinho',
    name: 'Piscinas Naturais de Picãozinho',
    slogan: 'Aquário natural de águas cristalinas a 1,5 km da costa de Tambaú',
    categoryId: 'passeios',
    categoryLabel: 'Passeios & Náutica',
    neighborhood: 'Tambaú',
    rating: 4.8,
    reviewCount: 560,
    featuredImage: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1000&q=80',
    gallery: ['https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80'],
    publicTeaser: 'Formação de recifes de corais habitada por cardumes coloridos, ideal para mergulho com snorkel durante a maré baixa.',
    fullDescription: 'Acessível por catamarã a partir da praia de Tambaú, Picãozinho é um santuário ecológico de águas mornas e translúcidas onde é possível nadar lado a lado com peixes sargentinhos e polvos.',
    isFeatured: true,
    priceLevel: 'moderado',
    openingHours: 'Depende estritamente do horário da maré baixa (entre 08h e 13h)',
    tags: ['Mergulho', 'Snorkel', 'Peixes', 'Corais', 'Catamarã'],
    coordinates: { lat: -7.1082, lng: -34.8091 },
    address: 'Ponto de embarque: Orla de Tambaú, João Pessoa - PB',
    amenities: { parking: true, accessibility: false, familyFriendly: true, petFriendly: false, cardPayment: true, pixPayment: true },
    tips: [
      { title: 'Regra de Ouro da Maré', description: 'Nunca compre o passeio com maré acima de 0.5m. As melhores condições são marés de 0.0m a 0.3m com luas nova e cheia.', badge: 'Segredo de Ouro', isPremiumOnly: true },
      { title: 'Calçado de Neoprene / Crocs', description: 'Traga sapatilha para não machucar os pés nos corais e máscara de snorkel própria para economizar.', badge: 'Equipamento', isPremiumOnly: true }
    ],
    reviews: []
  },
  {
    id: 'piscinas-naturais-do-seixas',
    name: 'Piscinas Naturais do Seixas',
    slogan: 'As maiores piscinas de corais da Paraíba no ponto mais oriental do continente',
    categoryId: 'passeios',
    categoryLabel: 'Passeios & Náutica',
    neighborhood: 'Ponta do Seixas',
    rating: 4.9,
    reviewCount: 480,
    featuredImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80',
    gallery: ['https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80'],
    publicTeaser: 'Águas esmeralda com grande banco de corais, catamarãs modernos com toboágua e mergulho livre.',
    fullDescription: 'Mais amplas que Picãozinho, as piscinas do Seixas contam com estrutura de catamarãs com bar a bordo e toboágua que cai direto na água tépida e transparente.',
    isFeatured: true,
    priceLevel: 'moderado',
    tags: ['Catamarã com Toboágua', 'Piscinas Naturais', 'Snorkel', 'Seixas'],
    coordinates: { lat: -7.1555, lng: -34.7885 },
    address: 'Embarque na Praia do Seixas, João Pessoa - PB',
    amenities: { parking: true, accessibility: false, familyFriendly: true, petFriendly: false, cardPayment: true, pixPayment: true },
    tips: [
      { title: 'Catamarã com Toboágua', description: 'Opção super divertida para quem viaja com crianças e adolescentes.', badge: 'Diversão Família', isPremiumOnly: true }
    ],
    reviews: []
  },
  {
    id: 'ilha-de-areia-vermelha',
    name: 'Ilha de Areia Vermelha (Cabedelo)',
    slogan: 'Banco de areia avermelhada que emerge no meio do mar durante a maré baixa',
    categoryId: 'passeios',
    categoryLabel: 'Passeios & Náutica',
    neighborhood: 'Cabedelo / Poço',
    rating: 4.9,
    reviewCount: 610,
    featuredImage: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1000&q=80',
    gallery: ['https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80'],
    publicTeaser: 'Parque Estadual Marinho a 1,5 km da costa de Camboinha, com piscinas naturais de corais ao redor.',
    fullDescription: 'Areia Vermelha é um fenômeno natural único. Um banco de areia de cor avermelhada surge no meio do mar com águas calmas e cristalinas.',
    isFeatured: true,
    priceLevel: 'moderado',
    tags: ['Parque Marinho', 'Banco de Areia', 'Catamarã', 'Lancha', 'Cabedelo'],
    coordinates: { lat: -7.0189, lng: -34.8215 },
    address: 'Praia de Camboinha / Poço, Cabedelo - PB',
    amenities: { parking: true, accessibility: false, familyFriendly: true, petFriendly: false, cardPayment: true, pixPayment: true },
    tips: [
      { title: 'Embarque por Camboinha', description: 'A travessia de lancha ou catamarã por Camboinha dura menos de 10 minutos.', badge: 'Acesso Rápido', isPremiumOnly: true }
    ],
    reviews: []
  },
  {
    id: 'por-do-sol-do-jacare',
    name: 'Pôr do Sol na Praia do Jacaré',
    slogan: 'O ritual poético do Bolero de Ravel executado ao vivo sobre as águas do Rio Paraíba',
    categoryId: 'por-do-sol',
    categoryLabel: 'Pôr do Sol',
    neighborhood: 'Cabedelo / Intermares',
    rating: 4.9,
    reviewCount: 680,
    featuredImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?auto=format&fit=crop&w=800&q=80'
    ],
    publicTeaser: 'Uma das atrações mais famosas e emocionantes do Brasil. Jurandy do Sax toca saxofone a bordo de uma canoa.',
    fullDescription: 'Diariamente, por volta das 17h, o sol dourado desce sobre o Rio Paraíba ao som suave do Bolero de Ravel tocado por Jurandy do Sax.',
    isFeatured: true,
    priceLevel: 'moderado',
    openingHours: 'Lojas abrem às 14h; Saxofone inicia rigorosamente às 17h00',
    tags: ['Música ao Vivo', 'Pôr do Sol', 'Cultura Paraibana', 'Catamarã', 'Imperdível'],
    coordinates: { lat: -7.0425, lng: -34.8561 },
    address: 'Parque Linear da Praia do Jacaré, Cabedelo - PB',
    amenities: { parking: true, accessibility: true, familyFriendly: true, petFriendly: true, cardPayment: true, pixPayment: true },
    tips: [
      { title: 'Calçadão Público vs. Catamarã Festivo', description: 'Você pode assistir 100% de graça do calçadão de madeira ou pagar cerca de R$ 40 para embarcar no catamarã com forró.', badge: 'Dica Financeira', isPremiumOnly: true }
    ],
    reviews: [],
    landmark3d: { pinTitle: 'Pôr do Sol do Jacaré', description: 'Ritual do Bolero de Ravel no Rio Paraíba', altitudeOffset: 0.15 }
  },
  {
    id: 'passeio-buggy-litoral-sul',
    name: 'Passeio de Buggy no Litoral Sul',
    slogan: 'Aventura pelas falésias, cânions, mirantes e praias secretas da Costa do Conde',
    categoryId: 'passeios',
    categoryLabel: 'Passeios & Náutica',
    neighborhood: 'Conde / Litoral Sul',
    rating: 5.0,
    reviewCount: 590,
    featuredImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80',
    gallery: ['https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80'],
    publicTeaser: 'Roteiro de dia inteiro visitando Coqueirinho, Tambaba, Tabatinga, Cânions de Coqueirinho e Mirante Dedo de Deus.',
    fullDescription: 'O passeio de buggy credenciado busca você no hotel em João Pessoa e percorre trilhas exclusivas, falésias multicoloridas e mirantes com paradas para banho de mar e almoço regional.',
    isFeatured: true,
    priceLevel: 'alto',
    tags: ['Buggy', 'Falésias', 'Cânions', 'Mirantes', 'Costa do Conde'],
    coordinates: { lat: -7.3211, lng: -34.8015 },
    address: 'Saída dos hotéis de João Pessoa / Costa do Conde',
    amenities: { parking: true, accessibility: false, familyFriendly: true, petFriendly: false, cardPayment: true, pixPayment: true },
    tips: [
      { title: 'Contrate Somente Bugueiros Credenciados', description: 'Certifique-se do selo da Associação de Bugueiros da Paraíba para segurança e seguro turístico completo.', badge: 'Segurança', isPremiumOnly: true }
    ],
    reviews: []
  },

  // ==========================================
  // 5 PONTOS TURÍSTICOS & CULTURA
  // ==========================================
  {
    id: 'ponta-do-seixas-e-farol',
    name: 'Ponta do Seixas & Farol do Cabo Branco',
    slogan: 'O ponto mais oriental das Américas, onde o sol nasce primeiro no continente',
    categoryId: 'pontos-turisticos',
    categoryLabel: 'Pontos Turísticos',
    neighborhood: 'Ponta do Seixas',
    rating: 5.0,
    reviewCount: 512,
    featuredImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80',
    gallery: ['https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80'],
    publicTeaser: 'Marco geográfico histórico do Brasil. Vista panorâmica inigualável sobre a falésia com arquitetura triangular do Farol.',
    fullDescription: 'A Ponta do Seixas é o extremo oriental das Américas (Latitude 7° 09′ 28″ S, Longitude 34° 47′ 36″ W). No alto da falésia ergue-se o icônico Farol do Cabo Branco.',
    isFeatured: true,
    priceLevel: 'economico',
    openingHours: 'Farol aberto das 06h às 18h (Vista exterior 24h)',
    tags: ['Marco Geográfico', 'Vista Panorâmica', 'Nascer do Sol', 'Fotografia'],
    coordinates: { lat: -7.1492, lng: -34.7964 },
    address: 'Falésia do Cabo Branco, Ponta do Seixas, João Pessoa - PB',
    amenities: { parking: true, accessibility: true, familyFriendly: true, petFriendly: true, cardPayment: true, pixPayment: true },
    tips: [
      { title: 'Nascer do Sol às 05h10', description: 'Estar no mirante no primeiro clarão do dia é uma experiência mística.', badge: 'Experiência VIP', isPremiumOnly: true }
    ],
    reviews: [],
    landmark3d: { pinTitle: 'Ponta do Seixas & Farol', description: 'Extremo Oriental das Américas', altitudeOffset: 0.25 }
  },
  {
    id: 'estacao-cabo-branco-niemeyer',
    name: 'Estação Cabo Branco (Oscar Niemeyer)',
    slogan: 'Complexo futurista de Ciência, Cultura e Artes projetado por Oscar Niemeyer',
    categoryId: 'cultura',
    categoryLabel: 'Cultura & História',
    neighborhood: 'Cabo Branco',
    rating: 4.8,
    reviewCount: 430,
    featuredImage: 'https://images.unsplash.com/photo-1548625361-16a9117a26f8?auto=format&fit=crop&w=1000&q=80',
    gallery: ['https://images.unsplash.com/photo-1548625361-16a9117a26f8?auto=format&fit=crop&w=800&q=80'],
    publicTeaser: 'Torre octogonal de concreto e vidro com espelho d’água, planetário, exposições de artes plásticas e mirante.',
    fullDescription: 'Projetada por Oscar Niemeyer no alto do Cabo Branco, a Estação é um dos monumentos arquitetônicos mais imponentes do Nordeste com entrada gratuita.',
    isFeatured: true,
    priceLevel: 'economico',
    openingHours: 'Terça a Domingo: 09h às 18h',
    tags: ['Oscar Niemeyer', 'Arquitetura', 'Planetário', 'Exposições', 'Gratuito'],
    coordinates: { lat: -7.1485, lng: -34.8012 },
    address: 'Av. João Cirillo Silva, s/n, Cabo Branco, João Pessoa - PB',
    amenities: { parking: true, accessibility: true, familyFriendly: true, petFriendly: false, cardPayment: true, pixPayment: true },
    tips: [
      { title: 'Visita ao Planetário', description: 'Sessões gratuitas nos fins de semana para observação das constelações do céu austral.', badge: 'Atração Grátis', isPremiumOnly: true }
    ],
    reviews: []
  },
  {
    id: 'centro-historico-sao-francisco',
    name: 'Centro Cultural São Francisco',
    slogan: 'Um dos mais ricos e preservados complexos barrocos franciscanos da América Latina',
    categoryId: 'cultura',
    categoryLabel: 'Cultura & História',
    neighborhood: 'Centro Histórico',
    rating: 4.9,
    reviewCount: 380,
    featuredImage: 'https://images.unsplash.com/photo-1548625361-16a9117a26f8?auto=format&fit=crop&w=1000&q=80',
    gallery: ['https://images.unsplash.com/photo-1548625361-16a9117a26f8?auto=format&fit=crop&w=800&q=80'],
    publicTeaser: 'Construído a partir de 1589, impressiona com azulejos portugueses, tetos pintados em trompe-l’oeil e talha dourada.',
    fullDescription: 'Patrimônio histórico nacional tombado pelo IPHAN, inclui a Igreja de São Francisco, o Convento de Santo Antônio e o museu de arte sacra paraibana.',
    isFeatured: false,
    priceLevel: 'economico',
    openingHours: 'Terça a Sábado: 09h às 16h30; Domingo: 09h às 14h',
    tags: ['Barroco', 'Arte Sacra', 'Século XVI', 'Azulejos Portugueses', 'Patrimônio Histórico'],
    coordinates: { lat: -7.1158, lng: -34.8872 },
    address: 'Praça São Francisco, s/n, Centro Histórico, João Pessoa - PB',
    amenities: { parking: true, accessibility: true, familyFriendly: true, petFriendly: false, cardPayment: true, pixPayment: true },
    tips: [
      { title: 'Visita com Guia Credenciado', description: 'Contrate o guia no balcão da entrada por um valor simbólico para ouvir as lendas secretas.', badge: 'Dica Cultural', isPremiumOnly: true }
    ],
    reviews: []
  },
  {
    id: 'hotel-globo-centro-historico',
    name: 'Hotel Globo & Pôr do Sol no Sanhauá',
    slogan: 'Edifício histórico art déco de 1928 debruçado sobre a curva bucólica do Rio Sanhauá',
    categoryId: 'cultura',
    categoryLabel: 'Cultura & História',
    neighborhood: 'Centro Histórico / Varadouro',
    rating: 4.8,
    reviewCount: 320,
    featuredImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1000&q=80',
    gallery: ['https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80'],
    publicTeaser: 'Antigo hotel de luxo transformado em museu, com jardins com a vista mais poética do pôr do sol no rio.',
    fullDescription: 'Localizado no Largo de São Frei Pedro Gonçalves, o Hotel Globo oferece um mirante deslumbrante para a várzea do Rio Sanhauá, onde a cidade de João Pessoa nasceu em 1585.',
    isFeatured: false,
    priceLevel: 'economico',
    openingHours: 'Diariamente: 08h30 às 17h30 (Entrada Gratuita)',
    tags: ['Art Déco', 'Rio Sanhauá', 'Pôr do Sol', 'Centro Histórico', 'Gratuito'],
    coordinates: { lat: -7.1145, lng: -34.8912 },
    address: 'Praça de São Frei Pedro Gonçalves, Centro Histórico, João Pessoa - PB',
    amenities: { parking: true, accessibility: true, familyFriendly: true, petFriendly: true, cardPayment: true, pixPayment: true },
    tips: [
      { title: 'Chegue às 16h45', description: 'Assista o sol dourado sumir na curva do rio em silêncio e brisa fresca.', badge: 'Pôr do Sol Secreto', isPremiumOnly: true }
    ],
    reviews: []
  },
  {
    id: 'parque-solon-de-lucena-lagoa',
    name: 'Parque Solon de Lucena (A Lagoa)',
    slogan: 'O cartão-postal central da cidade cercado por palmeiras imperiais centenárias e fonte luminosa',
    categoryId: 'pontos-turisticos',
    categoryLabel: 'Pontos Turísticos',
    neighborhood: 'Centro',
    rating: 4.7,
    reviewCount: 370,
    featuredImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80',
    gallery: ['https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80'],
    publicTeaser: 'Parque urbano revitalizado com espelho d’água circular, pista de caminhada e pistas de skate.',
    fullDescription: 'Coração geográfico do centro de João Pessoa, a Lagoa é emoldurada por belíssimas palmeiras imperiais e conta com deck panorâmico.',
    isFeatured: false,
    priceLevel: 'economico',
    openingHours: 'Aberto 24h (Fonte luminosa das 18h às 21h)',
    tags: ['Palmeiras Imperiais', 'Parque Urbano', 'Caminhada', 'Centro'],
    coordinates: { lat: -7.1232, lng: -34.8819 },
    address: 'Parque Solon de Lucena, Centro, João Pessoa - PB',
    amenities: { parking: true, accessibility: true, familyFriendly: true, petFriendly: true, cardPayment: true, pixPayment: true },
    tips: [
      { title: 'Show das Águas à Noite', description: 'A fonte dançante com jatos coloridos no meio da lagoa funciona todas as noites.', badge: 'Show Noturno', isPremiumOnly: true }
    ],
    reviews: []
  },

  // ==========================================
  // SERVIÇOS DE EMERGÊNCIA & UTILIDADES 24H
  // ==========================================
  {
    id: 'hospital-trauma-joao-pessoa',
    name: 'Hospital de Emergência e Trauma Senador Humberto Lucena',
    slogan: 'Principal complexo hospitalar de urgência e trauma 24 horas da Paraíba',
    categoryId: 'emergencias',
    categoryLabel: 'Emergências 24h',
    neighborhood: 'Pedro Gondim / BR-230',
    rating: 4.8,
    reviewCount: 512,
    featuredImage: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=1000&q=80'
    ],
    publicTeaser: 'Hospital de referência estadual para urgências e emergências médicas de alta complexidade com plantão 24h ininterrupto.',
    fullDescription: 'O Hospital Estadual de Emergência e Trauma Senador Humberto Lucena é a maior unidade pública de pronto atendimento do estado, localizado às margens da BR-230, com suporte para ortopedia, cirurgia geral, neurologia e queimados.',
    isFeatured: true,
    priceLevel: 'economico',
    openingHours: 'Aberto 24h (Plantão Ininterrupto)',
    tags: ['Hospital 24h', 'Emergência Médica', 'UTI', 'Trauma', 'Público'],
    coordinates: { lat: -7.1082, lng: -34.8698 },
    address: 'Av. Orestes Lisboa, s/n - Pedro Gondim, João Pessoa - PB (BR-230)',
    phone: '(83) 3216-5700',
    amenities: { parking: true, accessibility: true, familyFriendly: true, petFriendly: false, cardPayment: false, pixPayment: false },
    tips: [
      { title: 'Acesso Rápido pela BR-230', description: 'O acesso para ambulâncias e emergências particulares é direto pela marginal da BR-230 sentido Cabedelo.', badge: 'Emergência 24h', isPremiumOnly: false },
      { title: 'Documentos Necessários', description: 'Tenha em mãos documento oficial com foto e Cartão SUS para agilizar a triagem no balcão de acolhimento.', badge: 'Dica Importante', isPremiumOnly: false }
    ],
    reviews: []
  },
  {
    id: 'hospital-memorial-sao-francisco',
    name: 'Hospital Memorial São Francisco (Emergência 24h)',
    slogan: 'Pronto atendimento particular e convênios com cardiologia e emergência médica 24h',
    categoryId: 'emergencias',
    categoryLabel: 'Emergências 24h',
    neighborhood: 'Torre / Centro',
    rating: 4.9,
    reviewCount: 388,
    featuredImage: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=1000&q=80'
    ],
    publicTeaser: 'Um dos hospitais privados mais tradicionais de João Pessoa com pronto-socorro adulto 24h, UTI moderna e exames de imagem.',
    fullDescription: 'Referência em atendimento particular e planos de saúde em João Pessoa, o Memorial São Francisco oferece atendimento ágil com equipe multidisciplinar de plantão, centro de diagnóstico completo e emergência cardiológica.',
    isFeatured: true,
    priceLevel: 'alto',
    openingHours: 'Aberto 24 horas',
    tags: ['Hospital Particular', 'Pronto Atendimento 24h', 'Cardiologia', 'Convênios'],
    coordinates: { lat: -7.1265, lng: -34.8789 },
    address: 'Av. Ministro José Américo de Almeida, 1450 - Torre, João Pessoa - PB',
    phone: '(83) 3133-3000',
    amenities: { parking: true, accessibility: true, familyFriendly: true, petFriendly: false, cardPayment: true, pixPayment: true },
    tips: [
      { title: 'Emergência Particular & Planos', description: 'Atende Unimed, Bradesco Saúde, Amil, SulAmérica, Cassi e consultas particulares com triagem rápida.', badge: 'Convênios', isPremiumOnly: false }
    ],
    reviews: []
  },
  {
    id: 'upa-oceania-bessa',
    name: 'UPA Oceania 24h (Bessa / Jardim Oceania)',
    slogan: 'Unidade de Pronto Atendimento 24 horas na orla norte de João Pessoa',
    categoryId: 'emergencias',
    categoryLabel: 'Emergências 24h',
    neighborhood: 'Bessa / Jardim Oceania',
    rating: 4.7,
    reviewCount: 295,
    featuredImage: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1000&q=80'
    ],
    publicTeaser: 'Pronto atendimento público para casos de urgência médica, febre alta, suturas, mal-estar e primeiros socorros na orla.',
    fullDescription: 'A UPA Oceania atende a população e turistas da região de Manaíra, Bessa, Intermares e Tambaú com equipe de médicos clínicos, pediatras, enfermagem e sala de estabilização 24 horas por dia.',
    isFeatured: false,
    priceLevel: 'economico',
    openingHours: 'Aberto 24h todos os dias',
    tags: ['UPA 24h', 'SUS', 'Pronto Atendimento', 'Orla Norte', 'Gratuito'],
    coordinates: { lat: -7.0856, lng: -34.8389 },
    address: 'Av. Flávio Ribeiro Coutinho, 70 - Jardim Oceania / Bessa, João Pessoa - PB',
    phone: '(83) 3214-3800',
    amenities: { parking: true, accessibility: true, familyFriendly: true, petFriendly: false, cardPayment: false, pixPayment: false },
    tips: [
      { title: 'Localização Próxima aos Shoppings', description: 'Fica situada no início do Retão de Manaíra / Jardim Oceania, de fácil acesso de carro ou aplicativo.', badge: 'Fácil Acesso', isPremiumOnly: false }
    ],
    reviews: []
  },
  {
    id: 'drogasil-24h-epitacio',
    name: 'Drogasil 24h - Av. Epitácio Pessoa',
    slogan: 'Drogaria completa com atendimento farmacêutico e conveniência 24 horas na principal avenida',
    categoryId: 'emergencias',
    categoryLabel: 'Emergências 24h',
    neighborhood: 'Tambauzinho / Epitácio',
    rating: 4.9,
    reviewCount: 340,
    featuredImage: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=1000&q=80'
    ],
    publicTeaser: 'Farmácia 24h com amplo estacionamento privativo, medicamentos de referência, dermocosméticos e delivery noturno.',
    fullDescription: 'Localizada na artéria principal que liga o centro à orla, a Drogasil Epitácio funciona 24h ininterruptamente com farmacêutico de plantão para aplicação de injetáveis, aferição de pressão e medicamentos controlados.',
    isFeatured: true,
    priceLevel: 'moderado',
    openingHours: 'Aberto 24 horas (Balcão & Estacionamento)',
    tags: ['Farmácia 24h', 'Medicamentos', 'Conveniência', 'Estacionamento Próprio'],
    coordinates: { lat: -7.1218, lng: -34.8512 },
    address: 'Av. Presidente Epitácio Pessoa, 2151 - Tambauzinho, João Pessoa - PB',
    phone: '(83) 3224-8800',
    whatsapp: '83993595124',
    amenities: { parking: true, accessibility: true, familyFriendly: true, petFriendly: true, cardPayment: true, pixPayment: true },
    tips: [
      { title: 'Plantão Noturno Seguro', description: 'Conta com estacionamento iluminado e segurança na porta durante toda a madrugada.', badge: 'Plantão Seguro', isPremiumOnly: false }
    ],
    reviews: []
  },
  {
    id: 'pague-menos-24h-tambau',
    name: 'Farmácia Pague Menos 24h - Tambaú',
    slogan: 'Farmácia 24h a passos do calçadão de Tambaú e da Feirinha de Artesanato',
    categoryId: 'emergencias',
    categoryLabel: 'Emergências 24h',
    neighborhood: 'Tambaú',
    rating: 4.8,
    reviewCount: 280,
    featuredImage: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=1000&q=80'
    ],
    publicTeaser: 'Ideal para quem está hospedado na orla de Tambaú ou Cabo Branco e precisa de remédios ou conveniências de madrugada.',
    fullDescription: 'Drogaria localizada estrategicamente na orla de Tambaú, oferecendo linha completa de medicamentos, protetores solares, itens de primeiros socorros, produtos infantis e serviço Clinic Farma.',
    isFeatured: false,
    priceLevel: 'moderado',
    openingHours: 'Aberto 24 horas',
    tags: ['Farmácia 24h', 'Orla de Tambaú', 'Medicamentos', 'Primeiros Socorros'],
    coordinates: { lat: -7.1156, lng: -34.8252 },
    address: 'Av. Olinda, 102 - Tambaú, João Pessoa - PB',
    phone: '(83) 3247-4500',
    amenities: { parking: true, accessibility: true, familyFriendly: true, petFriendly: true, cardPayment: true, pixPayment: true },
    tips: [
      { title: 'Atendimento a Pé na Orla', description: 'A apenas 2 quadras da beira-mar de Tambaú, permitindo ir a pé com tranquilidade.', badge: 'Orla de Jampa', isPremiumOnly: false }
    ],
    reviews: []
  },
  {
    id: 'teletaxi-joao-pessoa-24h',
    name: 'Teletáxi & Coopertáxi João Pessoa 24h',
    slogan: 'Central oficial de rádio táxi com atendimento 24h, agendamento de corridas e aeroporto',
    categoryId: 'emergencias',
    categoryLabel: 'Emergências 24h',
    neighborhood: 'Toda João Pessoa / Aeroporto',
    rating: 4.9,
    reviewCount: 460,
    featuredImage: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=1000&q=80'
    ],
    publicTeaser: 'Serviço de táxi 24 horas para translados de emergência, saídas de madrugada, aeroporto Castro Pinto e rodoviária.',
    fullDescription: 'Central unificada de táxis credenciados de João Pessoa com monitoramento GPS, motoristas profissionais e atendimento imediato por telefone ou WhatsApp a qualquer hora do dia ou da noite.',
    isFeatured: true,
    priceLevel: 'moderado',
    openingHours: '24 horas ininterrupto',
    tags: ['Táxi 24h', 'Translado Aeroporto', 'Transporte', 'Emergência', 'Madrugada'],
    coordinates: { lat: -7.115, lng: -34.825 },
    address: 'Atendimento em toda a Região Metropolitana de João Pessoa - PB',
    phone: '(83) 3244-4000',
    whatsapp: '83999814000',
    amenities: { parking: true, accessibility: true, familyFriendly: true, petFriendly: true, cardPayment: true, pixPayment: true },
    tips: [
      { title: 'Chame direto pelo WhatsApp', description: 'Envie sua localização pelo WhatsApp para receber o prefixo do veículo e o tempo estimado de chegada.', badge: 'Atendimento Rápido', isPremiumOnly: false }
    ],
    reviews: []
  },
  {
    id: 'hospital-veterinario-vet-24h',
    name: 'Hospital Veterinário & Pronto-Socorro Vet 24h',
    slogan: 'Emergência veterinária ininterrupta com UTI, cirurgia e exames laboratoriais na orla',
    categoryId: 'emergencias',
    categoryLabel: 'Emergências 24h',
    neighborhood: 'Manaíra',
    rating: 4.9,
    reviewCount: 310,
    featuredImage: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=1000&q=80'
    ],
    publicTeaser: 'Pronto-socorro veterinário 24 horas especializado em cães e gatos, com internação, oxigenoterapia e raio-x.',
    fullDescription: 'Clínica veterinária de emergência em Manaíra com médicos veterinários de plantão durante toda a madrugada, preparada para atender intoxicações, traumas, partos emergenciais e procedimentos cirúrgicos urgentes.',
    isFeatured: false,
    priceLevel: 'moderado',
    openingHours: 'Plantão Veterinário 24h',
    tags: ['Veterinário 24h', 'Pet Friendly', 'Emergência Animal', 'Cirurgia Vet', 'Manaíra'],
    coordinates: { lat: -7.1023, lng: -34.8341 },
    address: 'Av. Senador Ruy Carneiro, 650 - Manaíra, João Pessoa - PB',
    phone: '(83) 3247-9000',
    whatsapp: '83988229000',
    amenities: { parking: true, accessibility: true, familyFriendly: true, petFriendly: true, cardPayment: true, pixPayment: true },
    tips: [
      { title: 'Avise pelo WhatsApp antes de ir', description: 'Para casos graves com necessidade de oxigênio ou maca, avise a equipe 10 minutos antes para prepararem o leito.', badge: 'Emergência Vet', isPremiumOnly: false }
    ],
    reviews: []
  },
  {
    id: 'chaveiro-24h-orla-jampa',
    name: 'Chaveiro 24h Orla & Auto João Pessoa',
    slogan: 'Socorro móvel 24h para abertura de portas residenciais, cofres e veículos na orla',
    categoryId: 'emergencias',
    categoryLabel: 'Emergências 24h',
    neighborhood: 'Tambaú / Cabo Branco / Manaíra',
    rating: 4.9,
    reviewCount: 220,
    featuredImage: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&w=1000&q=80'
    ],
    publicTeaser: 'Atendimento móvel rápido com motolink para aberturas emergenciais de fechaduras residenciais, hotéis, flats e carros.',
    fullDescription: 'Especialista em chaves codificadas, abertura de portas travadas sem danificar a fechadura, cópias urgentes e atendimento emergencial a qualquer horário da madrugada em hotéis, pousadas e condomínios de Jampa.',
    isFeatured: false,
    priceLevel: 'moderado',
    openingHours: 'Plantão 24h móvel',
    tags: ['Chaveiro 24h', 'Socorro Móvel', 'Abertura de Carros', 'Chaves Codificadas'],
    coordinates: { lat: -7.1147, lng: -34.8236 },
    address: 'Atendimento móvel em toda a orla e Grande João Pessoa',
    phone: '(83) 99123-4567',
    whatsapp: '83991234567',
    amenities: { parking: true, accessibility: true, familyFriendly: true, petFriendly: true, cardPayment: true, pixPayment: true },
    tips: [
      { title: 'Tempo Médio de Chegada', description: 'Na orla (Tambaú, Cabo Branco, Manaíra e Bessa) o tempo médio de chegada de moto é de 15 a 25 minutos.', badge: 'Atendimento Rápido', isPremiumOnly: false }
    ],
    reviews: []
  }
];
