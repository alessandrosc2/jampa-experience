import { Itinerary } from '../types/itinerary';

export const MOCK_ITINERARIES: Itinerary[] = [
  // ========================================================
  // 1. ROTEIRO DE 1 DIA (JAMPA EXPRESS)
  // ========================================================
  {
    id: 'roteiro-1-dia-express',
    slug: 'jampa-express-1-dia',
    title: 'Jampa Express — O Melhor em 24 Horas',
    slogan: 'O essencial absoluto para quem tem apenas 1 dia para se apaixonar por João Pessoa',
    durationLabel: '1 Dia Completo',
    durationCategory: '1-dia',
    daysCount: 1,
    pace: 'intenso',
    estimatedCost: 'R$ 130 - R$ 220 por pessoa',
    featuredImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80',
    highlights: [
      'Primeiro raio de sol no Farol do Cabo Branco',
      'Piscinas Naturais de Picãozinho ou Seixas',
      'Buffet sertanejo no Mangai',
      'Pôr do Sol épico ao som do Bolero de Ravel na Praia do Jacaré'
    ],
    description: 'Um roteiro milimetricamente cronometrado para extrair a alma de João Pessoa em um único dia inesquecível, do amanhecer nas falésias ao pôr do sol no Rio Paraíba.',
    tags: ['Imperdível', 'Primeira Vez', 'Express', 'Pôr do Sol'],
    isPremium: true,
    days: [
      {
        dayNumber: 1,
        dayTitle: 'Dia Único: Do Extremo Oriental ao Bolero de Ravel',
        summary: 'Um dia intenso contemplando o nascer do sol, mergulho em corais, banquete regional e pôr do sol lendário.',
        stops: [
          {
            timeSlot: '05:10 - 06:45',
            placeId: 'ponta-do-seixas-e-farol',
            title: 'Nascer do Sol no Farol do Cabo Branco',
            location: 'Ponta do Seixas',
            description: 'Assista o primeiro raio de sol tocar o continente americano nas falésias do Cabo Branco.',
            secretTip: 'Chegue às 05h05 para ver o gradiente púrpura no mar calmo. Não esqueça a câmera!',
            image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
            durationEst: '1h30',
            costEst: 'Gratuito',
            coordinates: { lat: -7.1492, lng: -34.7964 }
          },
          {
            timeSlot: '08:00 - 11:30',
            placeId: 'piscinas-naturais-picaozinho',
            title: 'Passeio de Catamarã às Piscinas de Picãozinho',
            location: 'Orla de Tambaú',
            description: 'Embarque em Tambaú para mergulhar com snorkel entre recifes e cardumes de peixes coloridos.',
            secretTip: 'Confira a tábua de marés: a saída só acontece na maré baixa. Leve sua sapatilha de neoprene.',
            image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
            durationEst: '3h30',
            costEst: 'R$ 60 - R$ 80',
            coordinates: { lat: -7.1082, lng: -34.8091 }
          },
          {
            timeSlot: '12:00 - 14:00',
            placeId: 'restaurante-mangai',
            title: 'Almoço Típico no Restaurante Mangai',
            location: 'Manaíra',
            description: 'O maior buffet de gastronomia sertaneja do país: carne de sol na nata, queijo coalho e cartola.',
            secretTip: 'Peça a tradicional Cartola com canela na saída do buffet quente. Chegue antes das 12h30 para evitar fila.',
            image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
            durationEst: '2h00',
            costEst: 'R$ 60 - R$ 95',
            coordinates: { lat: -7.1089, lng: -34.8322 }
          },
          {
            timeSlot: '16:00 - 18:30',
            placeId: 'por-do-sol-do-jacare',
            title: 'Pôr do Sol com Jurandy do Sax na Praia do Jacaré',
            location: 'Cabedelo',
            description: 'O momento mais poético da Paraíba: o sol sumindo no Rio Paraíba ao som do Bolero de Ravel executado de dentro de uma canoa.',
            secretTip: 'Você pode assistir 100% grátis do calçadão ou pagar R$ 40 para embarcar no catamarã festivo com forró e Lampião & Maria Bonita.',
            image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
            durationEst: '2h30',
            costEst: 'Gratuito no calçadão',
            coordinates: { lat: -7.0425, lng: -34.8561 }
          },
          {
            timeSlot: '20:00 - 22:30',
            placeId: 'restaurante-bar-do-cuscuz',
            title: 'Jantar e Chopp na Orla de Cabo Branco',
            location: 'Bar do Cuscuz, Cabo Branco',
            description: 'Encerre seu dia com a brisa da orla de Cabo Branco, cuscuz recheado e chopp trincando de gelado.',
            secretTip: 'Peça o Cuscuz de Charque com Queijo Coalho para dividir. A vista superior da varanda é a melhor.',
            image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
            durationEst: '2h30',
            costEst: 'R$ 40 - R$ 70',
            coordinates: { lat: -7.1268, lng: -34.8222 }
          }
        ]
      }
    ]
  },

  // ========================================================
  // 2. ROTEIRO DE 3 DIAS (JAMPA CLÁSSICO)
  // ========================================================
  {
    id: 'roteiro-3-dias-classico',
    slug: 'jampa-classico-3-dias',
    title: 'Jampa Clássico — O Roteiro Perfeito de 3 Dias',
    slogan: 'A combinação equilibrada de orla urbana, praias cinematográficas do sul e história barroca',
    durationLabel: '3 Dias',
    durationCategory: '3-dias',
    daysCount: 3,
    pace: 'moderado',
    estimatedCost: 'R$ 380 - R$ 650 por pessoa',
    featuredImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80',
    highlights: [
      'Dia 1: Orla, Piscinas Naturais de Picãozinho e Mangai',
      'Dia 2: Expedição Costa do Conde (Coqueirinho, Tambaba e Praia Bela)',
      'Dia 3: Centro Histórico Barroco, Hotel Globo e Pôr do Sol no Jacaré'
    ],
    description: 'O roteiro mais recomendado para quem visita João Pessoa pela primeira vez em um feriadão ou fim de semana prolongado.',
    tags: ['Mais Vendido', 'Praias do Sul', 'Cultura', 'Piscinas Naturais'],
    isPremium: true,
    days: [
      {
        dayNumber: 1,
        dayTitle: 'Dia 1: Orla de Tambaú, Piscinas Naturais & Gastronomia',
        summary: 'Chegada, caminhada no calçadão, mergulho nos corais e banquete sertanejo.',
        stops: [
          {
            timeSlot: '08:30 - 12:00',
            placeId: 'praia-de-tambau',
            title: 'Praia de Tambaú & Piscinas Naturais de Picãozinho',
            location: 'Tambaú',
            description: 'Mergulho de snorkel com peixes nos recifes de corais a 15 minutos da orla.',
            secretTip: 'Compre o ingresso na feirinha de Tambaú com antecedência nas manhãs de maré seca.',
            image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
            durationEst: '3h30',
            costEst: 'R$ 70'
          },
          {
            timeSlot: '12:30 - 15:00',
            placeId: 'restaurante-mangai',
            title: 'Almoço no Tradicional Mangai',
            location: 'Manaíra',
            description: 'Buffet sertanejo premiado com o melhor do Nordeste.',
            secretTip: 'Deguste o feijão verde na nata com carne de sol desfiada.',
            image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
            durationEst: '2h00',
            costEst: 'R$ 75'
          },
          {
            timeSlot: '17:00 - 20:00',
            placeId: 'praia-de-cabo-branco',
            title: 'Caminhada ao Entardecer na Orla de Cabo Branco',
            location: 'Cabo Branco',
            description: 'Calçadão plano e arborizado com paradas nos quiosques para água de coco gelada.',
            secretTip: 'Assista a iluminação noturna das falésias acendendo no final da praia.',
            image: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=800&q=80',
            durationEst: '3h00',
            costEst: 'Gratuito'
          }
        ]
      },
      {
        dayNumber: 2,
        dayTitle: 'Dia 2: As Famosas Falésias do Litoral Sul (Costa do Conde)',
        summary: 'Passeio de dia inteiro pelas praias mais cinematográficas da Paraíba.',
        stops: [
          {
            timeSlot: '08:30 - 12:30',
            placeId: 'praia-de-coqueirinho',
            title: 'Praia de Coqueirinho & Mirante Dedo de Deus',
            location: 'Conde',
            description: 'Cânions vermelhos, coqueirais e enseada protegida de mar manso.',
            secretTip: 'Suba até o Mirante Dedo de Deus para a foto clássica do litoral sul.',
            image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
            durationEst: '4h00',
            costEst: 'R$ 15 (estacionamento)'
          },
          {
            timeSlot: '13:00 - 15:30',
            placeId: 'praia-de-tambaba',
            title: 'Praia de Tambaba (Setor Aberto & Falésias)',
            location: 'Conde',
            description: 'Piscinas naturais esculpidas na rocha vulcânica e o famoso coqueiro na pedra.',
            secretTip: 'A primeira praia com roupas é liberada para todos e conta com piscinas naturais mornas.',
            image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80',
            durationEst: '2h30',
            costEst: 'Gratuito'
          },
          {
            timeSlot: '16:00 - 18:30',
            placeId: 'praia-bela',
            title: 'Fim de Tarde em Praia Bela (Rio Mucatu)',
            location: 'Pitimbu',
            description: 'Encontro do rio com o mar com mesas dentro da água doce e tirolesa.',
            secretTip: 'Tome um banho de rio morno antes de voltar para o hotel.',
            image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
            durationEst: '2h30',
            costEst: 'R$ 20 (tirolesa opcional)'
          }
        ]
      },
      {
        dayNumber: 3,
        dayTitle: 'Dia 3: Riqueza Histórica Barroca & Pôr do Sol no Jacaré',
        summary: 'Mergulho na fundação da cidade em 1585 e encerramento com o Bolero de Ravel.',
        stops: [
          {
            timeSlot: '09:00 - 12:00',
            placeId: 'centro-historico-sao-francisco',
            title: 'Centro Cultural São Francisco & Casario Colonial',
            location: 'Centro Histórico',
            description: 'Um dos maiores complexos barrocos do Brasil com claustro e azulejos do séc. XVI.',
            secretTip: 'Contrate a visita guiada oficial na bilheteria por R$ 10 para conhecer as histórias secretas dos freis.',
            image: 'https://images.unsplash.com/photo-1548625361-16a9117a26f8?auto=format&fit=crop&w=800&q=80',
            durationEst: '3h00',
            costEst: 'R$ 10'
          },
          {
            timeSlot: '12:30 - 14:30',
            placeId: 'hotel-globo-centro-historico',
            title: 'Hotel Globo & Almoço com Vista para o Rio Sanhauá',
            location: 'Varadouro',
            description: 'Visita ao museu art déco e mirante panorâmico onde a cidade foi fundada.',
            secretTip: 'Aproveite para almoçar em um dos bistrôs charmosos do Centro Histórico.',
            image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
            durationEst: '2h00',
            costEst: 'Gratuito'
          },
          {
            timeSlot: '16:00 - 18:30',
            placeId: 'por-do-sol-do-jacare',
            title: 'Consagração do Pôr do Sol na Praia do Jacaré',
            location: 'Cabedelo',
            description: 'O ritual emocionante com Jurandy do Sax tocando o Bolero de Ravel ao vivo.',
            secretTip: 'Faça compras na feira de rendas e artesanato de algodão colorido do Jacaré.',
            image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
            durationEst: '2h30',
            costEst: 'Gratuito'
          }
        ]
      }
    ]
  },

  // ========================================================
  // 3. ROTEIRO DE 5 DIAS (EXPERIÊNCIA COMPLETA)
  // ========================================================
  {
    id: 'roteiro-5-dias-completo',
    slug: 'jampa-experiencia-completa-5-dias',
    title: 'Experiência Completa — 5 Dias Inesquecíveis em Jampa',
    slogan: 'A imersão definitiva cobrindo orla, corais, praias do sul e norte, história e alta gastronomia',
    durationLabel: '5 Dias',
    durationCategory: '5-dias',
    daysCount: 5,
    pace: 'moderado',
    estimatedCost: 'R$ 700 - R$ 1.200 por pessoa',
    featuredImage: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1000&q=80',
    highlights: [
      'Dia 1: Tambaú, Piscinas Naturais e Orla',
      'Dia 2: Costa do Conde e Falésias de Buggy',
      'Dia 3: Centro Histórico, Estação Niemeyer e Jacaré',
      'Dia 4: Litoral Norte, Areia Vermelha e Cabedelo',
      'Dia 5: Caribessa com Stand-Up e Jantar no NAU Frutos do Mar'
    ],
    description: 'O roteiro mais aclamado pelos turistas para viver tudo o que João Pessoa tem de melhor com tempo de sobra para relaxar.',
    tags: ['Completo', 'Férias', 'Buggy', 'Alta Gastronomia', 'Litoral Norte e Sul'],
    isPremium: true,
    days: [
      { dayNumber: 1, dayTitle: 'Dia 1: O Encanto da Orla Central & Picãozinho', summary: 'Orla de Tambaú, mergulho e Mangai.', stops: [] },
      { dayNumber: 2, dayTitle: 'Dia 2: Aventura de Buggy nas Falésias do Litoral Sul', summary: 'Coqueirinho, Tambaba, Tabatinga e Mirantes.', stops: [] },
      { dayNumber: 3, dayTitle: 'Dia 3: Monumentos Históricos, Oscar Niemeyer & Jacaré', summary: 'São Francisco, Estação Cabo Branco e Bolero de Ravel.', stops: [] },
      { dayNumber: 4, dayTitle: 'Dia 4: Ilha de Areia Vermelha & Fortaleza de Cabedelo', summary: 'Banco de areia em alto mar e Forte de Santa Catarina.', stops: [] },
      { dayNumber: 5, dayTitle: 'Dia 5: O Mar do Caribessa & Jantar Festivo no NAU', summary: 'Stand-up paddle nas águas calmas do Bessa e alta gastronomia.', stops: [] }
    ]
  },

  // ========================================================
  // 4. ROTEIRO ECONÔMICO (MOCHILEIRO INTELIGENTE)
  // ========================================================
  {
    id: 'roteiro-economico',
    slug: 'jampa-economico-baixo-custo',
    title: 'Roteiro Econômico — Jampa Inteligente sem Gastar Muito',
    slogan: 'Como curtir as melhores praias, atrações culturais e mirantes gastando o mínimo',
    durationLabel: '3 Dias Econômicos',
    durationCategory: 'tematico',
    daysCount: 3,
    pace: 'tranquilo',
    estimatedCost: 'Menos de R$ 90/dia por pessoa',
    featuredImage: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1000&q=80',
    highlights: [
      'Atrações 100% gratuitas: Estação Cabo Branco, Farol, Hotel Globo e Jacaré',
      'Praias acessíveis por ônibus circular e caminhada',
      'Melhores self-services com comida caseira paraibana a preço justo',
      'Dicas para economizar em passeios de barco'
    ],
    description: 'Guia definitivo para mochileiros e viajantes econômicos aproveitarem ao máximo a cidade mais verde do Brasil sem pesar no bolso.',
    tags: ['Econômico', 'Mochileiro', 'Gratuito', 'Dicas Financeiras'],
    isPremium: true,
    days: []
  },

  // ========================================================
  // 5. ROTEIRO ROMÂNTICO (CASAL EM JAMPA)
  // ========================================================
  {
    id: 'roteiro-romantico',
    slug: 'jampa-romantico-casal',
    title: 'Roteiro Romântico — Momentos a Dois em João Pessoa',
    slogan: 'Pousadas charmosas, jantares à luz de velas, praias desertas e pores do sol poéticos',
    durationLabel: '3 a 4 Dias',
    durationCategory: 'tematico',
    daysCount: 3,
    pace: 'tranquilo',
    estimatedCost: 'R$ 600 - R$ 1.100 por casal',
    featuredImage: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=1000&q=80',
    highlights: [
      'Jantar panorâmico com vista mar no Gulliver Mar',
      'Passeio privativo nas enseadas tranquilas de Coqueirinho',
      'Pôr do sol intimista no Hotel Globo com vista para o rio',
      'Drinks autorais nos melhores lounges à beira-mar'
    ],
    description: 'Perfeito para luas de mel, comemorações de aniversário de casamento e viagens a dois.',
    tags: ['Romântico', 'Lua de Mel', 'Casal', 'Gastronomia Nobre'],
    isPremium: true,
    days: []
  },

  // ========================================================
  // 6. ROTEIRO FAMÍLIA & CRIANÇAS
  // ========================================================
  {
    id: 'roteiro-familia-criancas',
    slug: 'jampa-familia-criancas',
    title: 'Roteiro Família — Diversão Segura para Todas as Idades',
    slogan: 'Praias de mar calmo tipo piscina, parques arborizados e passeios com estrutura completa',
    durationLabel: '4 Dias em Família',
    durationCategory: 'tematico',
    daysCount: 4,
    pace: 'tranquilo',
    estimatedCost: 'R$ 450/pessoa',
    featuredImage: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1000&q=80',
    highlights: [
      'Caribessa: mar sem ondas ideal para banho seguro com crianças',
      'Catamarã com toboágua nas Piscinas do Seixas',
      'Parque Solon de Lucena e Planetário da Estação Cabo Branco',
      'Restaurantes com espaço kids climatizado e recreação'
    ],
    description: 'Pensado especialmente para pais que viajam com bebês, crianças ou idosos, priorizando acessibilidade, conforto e segurança.',
    tags: ['Família', 'Crianças', 'Mar Manso', 'Acessibilidade'],
    isPremium: true,
    days: []
  },

  // ========================================================
  // 7. ROTEIRO GASTRONÔMICO PARAIBANO
  // ========================================================
  {
    id: 'roteiro-gastronomico',
    slug: 'jampa-gastronomico-sabores-da-paraiba',
    title: 'Roteiro Gastronômico — Uma Viagem pelos Sabores Paraibanos',
    slogan: 'Do cuscuz com carne de sol na manteiga de garrafa à alta gastronomia de frutos do mar',
    durationLabel: 'Tour Gastronômico',
    durationCategory: 'tematico',
    daysCount: 3,
    pace: 'tranquilo',
    estimatedCost: 'R$ 350 - R$ 700',
    featuredImage: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1000&q=80',
    highlights: [
      'O banquete sertanejo no Mangai',
      'Peixada paraibana com pirão artesanal no Guiomar',
      'Camarões nobres e carta de vinhos no NAU Frutos do Mar',
      'Bacalhau português na Adega do Alfredo e cuscuz no Bar do Cuscuz'
    ],
    description: 'Um verdadeiro roteiro para os amantes da boa mesa conhecerem os pratos e restaurantes mais premiados da Paraíba.',
    tags: ['Gastronomia', 'Comida Sertaneja', 'Frutos do Mar', 'Vinhos & Drinks'],
    isPremium: true,
    days: []
  },

  // ========================================================
  // 8. ROTEIRO MELHORES PRAIAS & FALÉSIAS
  // ========================================================
  {
    id: 'roteiro-melhores-praias',
    slug: 'jampa-circuito-melhores-praias',
    title: 'Circuito Melhores Praias & Falésias do Litoral Paraibano',
    slogan: 'O roteiro definitivo de sol e mar pelas 10 praias mais bonitas da Paraíba',
    durationLabel: 'Circuito Litoral',
    durationCategory: 'tematico',
    daysCount: 4,
    pace: 'moderado',
    estimatedCost: 'R$ 250 - R$ 500',
    featuredImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80',
    highlights: [
      'Caribessa com águas cristalinas para caiaque',
      'Coqueirinho e Cânions do Conde',
      'Tambaba e Praia Bela',
      'Areia Vermelha e Camboinha'
    ],
    description: 'Para quem ama passar o dia inteiro na praia curtindo mar morno, coqueirais, falésias e passeios náuticos.',
    tags: ['Praias', 'Sol & Mar', 'Snorkel', 'Falésias'],
    isPremium: true,
    days: []
  }
];
