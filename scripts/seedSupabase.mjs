import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://likcbjgedhkisaxqdhwj.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxpa2NiamdlZGhraXNheHFkaHdqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY2NjQ0NzMsImV4cCI6MjEwMjI0MDQ3M30.PvPm8BarYdyC_R1rds89qc1dBrvl9kesQEZko-Oe1Mg';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const NEIGHBORHOODS = [
  { id: 'manaira', name: 'Praia de Manaíra', slug: 'manaira', description: 'Polo gastronômico e orla nobre com calçadão movimentado.', vibe: 'Gastronomia & Nobreza', hero_image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80', highlight_quote: 'O metro quadrado mais saboroso e cosmopolita da orla paraibana.', position: 1 },
  { id: 'tambau', name: 'Praia de Tambaú', slug: 'tambau', description: 'O epicentro turístico de João Pessoa, saída para Picãozinho.', vibe: 'Turismo & Agito', hero_image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80', highlight_quote: 'Onde tudo acontece a qualquer hora do dia ou da noite.', position: 2 },
  { id: 'cabo-branco', name: 'Praia de Cabo Branco', slug: 'cabo-branco', description: 'Orla tranquila com ciclovia plana, coqueirais e quiosques refinados.', vibe: 'Tranquilidade & Esportes', hero_image: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1200&q=80', highlight_quote: 'A melhor orla do Nordeste para caminhar ao nascer do sol.', position: 3 },
  { id: 'bessa', name: 'Praia do Bessa (Caribessa)', slug: 'bessa', description: 'Águas cristalinas protegidas por arrecifes de corais.', vibe: 'Caribe Paraibano & Remo', hero_image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80', highlight_quote: 'Mar calmo como piscina e energia jovem aos finais de semana.', position: 4 },
  { id: 'seixas', name: 'Ponta do Seixas & Farol', slug: 'seixas', description: 'O ponto mais oriental das Américas continentais.', vibe: 'Nascer do Sol & Corais', hero_image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80', highlight_quote: 'Onde o sol nasce primeiro nas Américas.', position: 5 },
  { id: 'centro-historico', name: 'Centro Histórico & Sanhauá', slug: 'centro-historico', description: 'O berço da terceira cidade mais antiga do Brasil.', vibe: 'História & Barroco', hero_image: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1200&q=80', highlight_quote: 'Quatro séculos de história entre igrejas barrocas e o pôr do sol no Rio Sanhauá.', position: 6 },
  { id: 'cabedelo', name: 'Cabedelo & Praia do Jacaré', slug: 'cabedelo', description: 'Região metropolitana ao norte, famosa pelo Bolero de Ravel no Jacaré.', vibe: 'Pôr do Sol & Náutica', hero_image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80', highlight_quote: 'O pôr do sol mais emocionante e poético do Brasil.', position: 7 },
  { id: 'costa-do-conde', name: 'Costa do Conde (Litoral Sul)', slug: 'costa-do-conde', description: 'Litoral Sul selvagem com cânions coloridos de argila e falésias.', vibe: 'Natureza Selvagem & Cânions', hero_image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80', highlight_quote: 'Praias intocadas e visuais cinematográficos esculpidos pela natureza.', position: 8 }
];

const MODALITIES = [
  { id: 'mod-praias', name: 'Praias', slug: 'praias', description: 'Praia, enseada ou ponto de banho de mar', position: 1 },
  { id: 'mod-restaurante', name: 'Restaurante', slug: 'restaurante', description: 'Restaurante à la carte, buffet regional ou contemporâneo', position: 2 },
  { id: 'mod-bar', name: 'Bar', slug: 'bar', description: 'Bar, boteco, pub ou choperia com petiscos', position: 3 },
  { id: 'mod-cafe', name: 'Café / Bistrô', slug: 'cafe', description: 'Cafeteria especial, brunchs e docerias', position: 4 },
  { id: 'mod-quiosque', name: 'Quiosque de Praia', slug: 'quiosque', description: 'Quiosque gastronômico ou de praia na orla', position: 5 },
  { id: 'mod-salao', name: 'Salão de Beleza', slug: 'salao-beleza', description: 'Salão de beleza, cabeleireiro e estética', position: 6 },
  { id: 'mod-barbearia', name: 'Barbearia', slug: 'barbearia', description: 'Barbearia e cuidados masculinos', position: 7 },
  { id: 'mod-farmacia', name: 'Farmácia', slug: 'farmacia', description: 'Farmácia e drogarias 24h', position: 8 },
  { id: 'mod-clinica', name: 'Clínica / Spa', slug: 'clinica', description: 'Clínica de saúde, bem-estar ou massagem', position: 9 },
  { id: 'mod-nautico', name: 'Passeio Náutico', slug: 'nautico', description: 'Catamarã, lancha ou embarcação para piscinas naturais', position: 10 },
  { id: 'mod-balada', name: 'Casa de Shows / Forró', slug: 'balada', description: 'Casa de shows, forró ou lounge noturno', position: 11 },
  { id: 'mod-loja', name: 'Artesanato / Loja', slug: 'loja', description: 'Mercado de artesanato ou loja de artigos regionais', position: 12 },
  { id: 'mod-hotel', name: 'Hotel / Pousada', slug: 'hotel', description: 'Hotel, resort ou pousada de charme', position: 13 },
  { id: 'mod-patrimonio', name: 'Patrimônio Histórico', slug: 'patrimonio', description: 'Igreja barroca, convento ou museu', position: 14 },
  { id: 'mod-mirante', name: 'Ponto Turístico / Mirante', slug: 'mirante', description: 'Mirante panorâmico, farol ou monumento', position: 15 }
];

const TOPICS = [
  { id: 'gastronomia', name: 'Gastronomia', slug: 'gastronomia', description: 'Os melhores restaurantes, bistrôs e sabores regionais e contemporâneos do bairro.', position: 1 },
  { id: 'bares-botecos', name: 'Bares & Botecos', slug: 'bares-botecos', description: 'Points animados, drinks autorais, chopp artesanal e petiscos.', position: 2 },
  { id: 'servicos', name: 'Serviços & Conveniências', slug: 'servicos', description: 'Salões de beleza, barbearias, conveniências e facilidades locais.', position: 3 },
  { id: 'saude', name: 'Saúde & Bem-Estar', slug: 'saude', description: 'Farmácias, clínicas, spas e cuidados de saúde.', position: 4 },
  { id: 'passeios', name: 'Passeios & Experiências', slug: 'passeios', description: 'Passeios náuticos, catamarãs, mirantes e atividades ao ar livre.', position: 5 },
  { id: 'vida-noturna', name: 'Vida Noturna', slug: 'vida-noturna', description: 'Casas de shows, forró autêntico, baladas e lounges noturnos.', position: 6 },
  { id: 'compras', name: 'Compras & Artesanato', slug: 'compras', description: 'Feiras de artesanato, lojas de souvenirs e centros comerciais.', position: 7 },
  { id: 'cultura', name: 'Cultura & História', slug: 'cultura', description: 'Patrimônio histórico, centros culturais, museus e monumentos.', position: 8 },
  { id: 'praias', name: 'Praias & Piscinas Naturais', slug: 'praias', description: 'Faixas de areia, banho de mar, piscinas naturais e orla.', position: 9 },
  { id: 'hospedagem', name: 'Hotéis & Pousadas', slug: 'hospedagem', description: 'Hospedagens aconchegantes e resorts à beira-mar.', position: 10 }
];

const PROFILES = [
  { id: 'usr-vip-01', email: 'alessandro@exemplo.com.br', full_name: 'Alessandro Silva', avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80', access_status: 'active', access_type: 'lifetime', order_id: 'ORD-VIP-99482' },
  { id: 'usr-free-02', email: 'visitante@exemplo.com.br', full_name: 'Turista Visitante', avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80', access_status: 'registered', access_type: 'none' }
];

const QR_CHANNELS = [
  { channel_id: 'qr-pousada-tambau', channel_name: 'Pousada Mar de Tambaú (Display Recepção)', target_neighborhood: 'Tambaú', scans_count: 142, conversions_count: 38, commission_rate: 15, total_earned: 227.43 },
  { channel_id: 'qr-hotel-cabo-branco', channel_name: 'Hotel Cabo Branco Atlântico (Quartos)', target_neighborhood: 'Cabo Branco', scans_count: 289, conversions_count: 76, commission_rate: 15, total_earned: 454.86 },
  { channel_id: 'qr-quiosque-bessa', channel_name: 'Quiosque Praiano Bessa (Menu QR)', target_neighborhood: 'Bessa', scans_count: 87, conversions_count: 19, commission_rate: 10, total_earned: 75.81 },
  { channel_id: 'qr-transfer-aeroporto', channel_name: 'Vans & Receptivo Aeroporto Castro Pinto', target_neighborhood: 'Todos os Bairros', scans_count: 310, conversions_count: 94, commission_rate: 20, total_earned: 750.12 }
];

async function runSeed() {
  console.log('🚀 Iniciando Seed no Supabase...');

  // 1. Bairros
  const { error: errNeigh } = await supabase.from('neighborhoods').upsert(NEIGHBORHOODS, { onConflict: 'id' });
  console.log('Bairros inseridos:', errNeigh ? errNeigh.message : '✅ OK (' + NEIGHBORHOODS.length + ')');

  // 2. Modalidades
  const { error: errMod } = await supabase.from('modalities').upsert(MODALITIES, { onConflict: 'id' });
  console.log('Modalidades inseridas:', errMod ? errMod.message : '✅ OK (' + MODALITIES.length + ')');

  // 3. Tópicos
  const { error: errTop } = await supabase.from('topics').upsert(TOPICS, { onConflict: 'id' });
  console.log('Tópicos inseridos:', errTop ? errTop.message : '✅ OK (' + TOPICS.length + ')');

  // 4. Perfis
  const { error: errProf } = await supabase.from('profiles').upsert(PROFILES, { onConflict: 'id' });
  console.log('Perfis de teste inseridos:', errProf ? errProf.message : '✅ OK (' + PROFILES.length + ')');

  // 5. QR Analytics
  const { error: errQr } = await supabase.from('qr_analytics').upsert(QR_CHANNELS, { onConflict: 'channel_id' });
  console.log('Canais QR inseridos:', errQr ? errQr.message : '✅ OK (' + QR_CHANNELS.length + ')');

  console.log('\n🎉 Seed base concluído com sucesso no Supabase!');
}

runSeed().catch(console.error);
