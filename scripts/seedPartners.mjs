import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://likcbjgedhkisaxqdhwj.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxpa2NiamdlZGhraXNheHFkaHdqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY2NjQ0NzMsImV4cCI6MjEwMjI0MDQ3M30.PvPm8BarYdyC_R1rds89qc1dBrvl9kesQEZko-Oe1Mg';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const PARTNERS = [
  {
    id: 'partner-mangai',
    place_id: 'praia-de-manaira',
    name: 'Mangaí Restaurante',
    description: 'Restaurante especializado em gastronomia regional paraibana e nordestina.',
    address: 'Av. Edson Ramalho, 696 - Manaíra, João Pessoa - PB',
    google_maps_url: 'https://maps.google.com/?q=Mangai+Manaira+Joao+Pessoa',
    benefit: '10% de desconto no buffet de almoço e jantar para membros VIP',
    partnership_level: 'fundador',
    coupon_code: 'JAMPA10',
    redemption_instructions: 'Apresente o cupom digital JAMPA10 ao garçom no momento de fechar a conta.',
    whatsapp: '83999991111',
    instagram: '@mangairestaurante',
    phone: '8332461244',
    website: 'https://www.mangai.com.br',
    is_active: true
  },
  {
    id: 'partner-bar-cuscuz',
    place_id: 'praia-de-manaira',
    name: 'Bar do Cuscuz Manaíra',
    description: 'O point mais tradicional da orla de João Pessoa.',
    address: 'Av. João Maurício, 255 - Manaíra, João Pessoa - PB',
    google_maps_url: 'https://maps.google.com/?q=Bar+do+Cuscuz+Joao+Pessoa',
    benefit: '1 Welcome Drink ou Caipirinha regional de cortesia por mesa',
    partnership_level: 'destaque',
    coupon_code: 'CUSCUZJAMPA',
    redemption_instructions: 'Apresente seu cartão virtual JAMPA EXPERIENCE ou mencione o cupom ao maître.',
    whatsapp: '83999992222',
    instagram: '@bardocuscuzoficial',
    phone: '8332471010',
    website: 'https://www.bardocuscuz.com.br',
    is_active: true
  }
];

async function seedPartners() {
  console.log('🔄 Sincronizando parceiros VIP no Supabase...');
  const { error } = await supabase.from('partners').upsert(PARTNERS, { onConflict: 'id' });
  if (error) {
    console.error('Erro ao sincronizar parceiros:', error.message);
  } else {
    console.log('✅ ' + PARTNERS.length + ' parceiros VIP sincronizados com sucesso!');
  }
}

seedPartners().catch(console.error);
