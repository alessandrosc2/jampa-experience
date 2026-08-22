import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const SUPABASE_URL = 'https://likcbjgedhkisaxqdhwj.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxpa2NiamdlZGhraXNheHFkaHdqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY2NjQ0NzMsImV4cCI6MjEwMjI0MDQ3M30.PvPm8BarYdyC_R1rds89qc1dBrvl9kesQEZko-Oe1Mg';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const mockPlacesContent = fs.readFileSync('src/data/mockPlaces.ts', 'utf-8');

function parseMockPlaces() {
  const code = mockPlacesContent
    .replace(/import\s+[^;]+;/g, '')
    .replace(/export\s+const\s+MOCK_PLACES:\s*Place\[\]\s*=\s*/, 'const MOCK_PLACES = ')
    .concat('\nexport default MOCK_PLACES;');
  
  fs.writeFileSync('scripts/_temp_places.mjs', code, 'utf-8');
}

async function run() {
  console.log('🔄 Sincronizando todos os locais e atrações com o Supabase...');
  parseMockPlaces();

  const { default: places } = await import('./_temp_places.mjs');
  console.log('Carregados ' + places.length + ' locais de mockPlaces.ts');

  let totalPlacesInserted = 0;
  let totalTipsInserted = 0;

  for (const p of places) {
    const placeRow = {
      id: p.id,
      name: p.name,
      slug: p.id,
      slogan: p.slogan || '',
      category_id: p.categoryId || 'praias',
      category_label: p.categoryLabel || 'Praias',
      modality_name: p.modalityName || (p.categoryId === 'praias' ? 'Praias' : 'Restaurante'),
      neighborhood: p.neighborhood,
      neighborhood_id: p.neighborhood.toLowerCase().replace(/\s+/g, '-').normalize('NFD').replace(/[\u0300-\u036f]/g, ''),
      address: p.address || '',
      opening_hours: p.openingHours || 'Acesso livre',
      price_level: p.priceLevel || 'moderado',
      full_description: p.fullDescription || p.publicTeaser || '',
      short_description: p.publicTeaser || '',
      featured_image: p.featuredImage || (p.gallery && p.gallery[0]) || '',
      gallery: p.gallery || [],
      topic_ids: p.topicIds || (p.tags ? p.tags.map(t => t.toLowerCase()) : []),
      lat: p.coordinates?.lat || -7.115,
      lng: p.coordinates?.lng || -34.825,
      whatsapp: p.phone ? p.phone.replace(/\D/g, '') : '',
      instagram: p.instagram || '',
      phone: p.phone || '',
      website: p.website || '',
      is_partner: p.isPartner || false,
      partner_level: p.partnerLevel || 'standard',
      rating: p.rating || 4.8,
      review_count: p.reviewCount || 0,
      amenities: p.amenities || {}
    };

    const { error: placeErr } = await supabase.from('places').upsert(placeRow, { onConflict: 'id' });
    if (placeErr) {
      console.error('Erro ao inserir local ' + p.name + ':', placeErr.message);
    } else {
      totalPlacesInserted++;
    }

    if (p.tips && p.tips.length > 0) {
      await supabase.from('secret_tips').delete().eq('place_id', p.id);

      const tipsRows = p.tips.map((t, idx) => ({
        place_id: p.id,
        title: t.title,
        badge: t.badge || 'Dica dos Nativos',
        description: t.description,
        is_premium_only: t.isPremiumOnly !== false,
        position: idx + 1
      }));

      const { error: tipErr } = await supabase.from('secret_tips').insert(tipsRows);
      if (tipErr) {
        console.error('Erro ao inserir dicas de ' + p.name + ':', tipErr.message);
      } else {
        totalTipsInserted += tipsRows.length;
      }
    }
  }

  if (fs.existsSync('scripts/_temp_places.mjs')) {
    fs.unlinkSync('scripts/_temp_places.mjs');
  }

  console.log('\n✅ Sucesso: ' + totalPlacesInserted + ' locais sincronizados no Supabase!');
  console.log('✅ Sucesso: ' + totalTipsInserted + ' dicas secretas sincronizadas no Supabase!');
}

run().catch(console.error);
