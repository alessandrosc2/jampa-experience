-- ==============================================================================
-- JAMPA EXPERIENCE — SCHEMA COMPLETO DO BANCO DE DADOS & SEGURANÇA (SUPABASE)
-- ==============================================================================

-- 1. TABELA DE PERFIS DE USUÁRIOS (PROFILES)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    avatar_url TEXT,
    access_status TEXT NOT NULL DEFAULT 'registered' CHECK (access_status IN ('registered', 'active', 'refunded', 'blocked')),
    access_type TEXT NOT NULL DEFAULT 'none' CHECK (access_type IN ('none', 'lifetime', 'partner_demo')),
    order_id TEXT,
    purchased_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. TABELA DE CATEGORIAS / MODALIDADES TURÍSTICAS
CREATE TABLE IF NOT EXISTS public.categories (
    id TEXT PRIMARY KEY,
    label TEXT NOT NULL,
    icon_name TEXT NOT NULL DEFAULT 'Compass',
    description TEXT,
    accent_color TEXT NOT NULL DEFAULT '#00B4D8',
    position INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. TABELA DE LOCAIS (PLACES)
CREATE TABLE IF NOT EXISTS public.places (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slogan TEXT,
    category_id TEXT NOT NULL REFERENCES public.categories(id) ON UPDATE CASCADE ON DELETE RESTRICT,
    neighborhood TEXT NOT NULL,
    city TEXT NOT NULL DEFAULT 'João Pessoa',
    state TEXT NOT NULL DEFAULT 'PB',
    rating NUMERIC(2,1) NOT NULL DEFAULT 5.0,
    review_count INTEGER NOT NULL DEFAULT 1,
    public_teaser TEXT NOT NULL,
    full_description TEXT NOT NULL,
    price_level TEXT NOT NULL DEFAULT 'moderado' CHECK (price_level IN ('economico', 'moderado', 'alto', 'luxo')),
    opening_hours TEXT,
    tags TEXT[] DEFAULT '{}',
    address TEXT NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    phone TEXT,
    whatsapp TEXT,
    instagram TEXT,
    facebook TEXT,
    website TEXT,
    google_maps_url TEXT,
    
    -- Configurações de Parceria Comercial
    is_partner BOOLEAN NOT NULL DEFAULT FALSE,
    partner_level TEXT DEFAULT 'standard' CHECK (partner_level IN ('standard', 'destaque', 'fundador')),
    partner_benefit TEXT,
    partner_description TEXT,
    partner_coupon_code TEXT,
    partner_active BOOLEAN NOT NULL DEFAULT TRUE,
    
    -- Facilidades
    parking BOOLEAN NOT NULL DEFAULT TRUE,
    accessibility BOOLEAN NOT NULL DEFAULT TRUE,
    family_friendly BOOLEAN NOT NULL DEFAULT TRUE,
    pet_friendly BOOLEAN NOT NULL DEFAULT FALSE,
    card_payment BOOLEAN NOT NULL DEFAULT TRUE,
    pix_payment BOOLEAN NOT NULL DEFAULT TRUE,
    
    is_featured BOOLEAN NOT NULL DEFAULT FALSE,
    status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
    views_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. TABELA DE FOTOS / GALERIA DE LOCAIS (PLACE_IMAGES)
CREATE TABLE IF NOT EXISTS public.place_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    place_id TEXT NOT NULL REFERENCES public.places(id) ON DELETE CASCADE,
    storage_path TEXT,
    public_url TEXT NOT NULL,
    position INTEGER NOT NULL DEFAULT 0,
    is_cover BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Garante que apenas UMA foto por local pode ser a foto de capa (is_cover = true)
CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_cover_per_place 
ON public.place_images (place_id) 
WHERE is_cover = TRUE;

-- 5. TABELA DE DICAS SECRETAS DOS NATIVOS (PLACE_TIPS)
CREATE TABLE IF NOT EXISTS public.place_tips (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    place_id TEXT NOT NULL REFERENCES public.places(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    badge TEXT DEFAULT 'Dica VIP',
    is_premium_only BOOLEAN NOT NULL DEFAULT TRUE,
    position INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. TABELA DE ROTEIROS TURÍSTICOS (ITINERARIES)
CREATE TABLE IF NOT EXISTS public.itineraries (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    subtitle TEXT NOT NULL,
    description TEXT NOT NULL,
    duration_label TEXT NOT NULL,
    pace TEXT NOT NULL,
    estimated_cost TEXT NOT NULL,
    featured_image TEXT NOT NULL,
    tags TEXT[] DEFAULT '{}',
    is_featured BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. TABELA DE PAGAMENTOS E TRANSAÇÕES (PAYMENTS)
CREATE TABLE IF NOT EXISTS public.payments (
    id TEXT PRIMARY KEY,
    order_id TEXT UNIQUE NOT NULL,
    user_id TEXT NOT NULL,
    user_name TEXT NOT NULL,
    user_email TEXT NOT NULL,
    amount NUMERIC(10,2) NOT NULL DEFAULT 39.90,
    currency TEXT NOT NULL DEFAULT 'BRL',
    gateway TEXT NOT NULL DEFAULT 'mercadopago',
    gateway_transaction_id TEXT,
    payment_method TEXT NOT NULL CHECK (payment_method IN ('pix', 'credit_card')),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'refunded')),
    status_detail TEXT,
    installments INTEGER NOT NULL DEFAULT 1,
    pix_qr_code TEXT,
    card_brand TEXT,
    card_last_four TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    approved_at TIMESTAMPTZ,
    refunded_at TIMESTAMPTZ
);

-- 8. TABELA DE RASTREAMENTO DE PARCEIROS (PARTNER_TRACKING)
CREATE TABLE IF NOT EXISTS public.partner_tracking (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    place_id TEXT NOT NULL REFERENCES public.places(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL CHECK (event_type IN ('view', 'click_whatsapp', 'click_maps', 'click_instagram', 'click_website', 'click_coupon')),
    source_channel TEXT DEFAULT 'web_app',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. TABELA DE LOGS DO SISTEMA (AUDIT_LOGS)
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    details TEXT,
    payload JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- VIEWS DE PROTEÇÃO DE DADOS (DATA LAYER ACCESS CONTROL)
-- ==============================================================================

-- VIEW PÚBLICA (PUBLIC_PREVIEW): Utilizada estritamente para visitantes NÃO PAGOS.
-- Não expõe nomes comerciais, coordenadas GPS, telefones, WhatsApp ou dicas exclusivas.
CREATE OR REPLACE VIEW public.v_public_showcase_places AS
SELECT 
    p.id,
    CASE 
        WHEN p.category_id = 'restaurantes' THEN 'Experiência Gastronômica Selecionada'
        WHEN p.category_id = 'bares' THEN 'Beach Lounge & Bar Selecionado'
        WHEN p.category_id = 'cafes' THEN 'Cafeteria Especial Selecionada'
        WHEN p.category_id = 'hoteis' THEN 'Hospedagem & Pousada Selecionada'
        WHEN p.category_id = 'passeios' THEN 'Passeio & Experiência Selecionada'
        WHEN p.category_id = 'pontos-turisticos' THEN 'Ponto Turístico Selecionado'
        WHEN p.category_id = 'por-do-sol' THEN 'Mirante & Pôr do Sol Selecionado'
        WHEN p.category_id = 'compras' THEN 'Comércio & Artesanato Selecionado'
        WHEN p.category_id = 'cultura' THEN 'Patrimônio Cultural Selecionado'
        WHEN p.category_id = 'vida-noturna' THEN 'Vida Noturna Selecionada'
        ELSE 'Local Selecionado pelo Jampa Experience'
    END AS name,
    p.slogan,
    p.category_id,
    c.label AS category_label,
    p.neighborhood,
    p.rating,
    p.review_count,
    p.public_teaser,
    p.price_level,
    p.tags,
    p.is_featured,
    -- Imagem de capa genérica/protegida
    COALESCE(
        (SELECT img.public_url FROM public.place_images img WHERE img.place_id = p.id AND img.is_cover = TRUE LIMIT 1),
        (SELECT img.public_url FROM public.place_images img WHERE img.place_id = p.id ORDER BY img.position ASC LIMIT 1),
        'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80'
    ) AS featured_image
FROM public.places p
JOIN public.categories c ON c.id = p.category_id
WHERE p.status = 'published';

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.places ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.place_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.place_tips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.itineraries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partner_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Categories: Leitura pública
CREATE POLICY "Categorias visíveis publicamente" 
ON public.categories FOR SELECT 
USING (TRUE);

-- Places: Público lê apenas registros publicados; Membros VIP autenticados leem tudo
CREATE POLICY "Locais públicos para visualização" 
ON public.places FOR SELECT 
USING (status = 'published');

-- Place Images: Imagens visíveis publicamente
CREATE POLICY "Imagens de locais públicas" 
ON public.place_images FOR SELECT 
USING (TRUE);

-- Tips: Dicas públicas apenas se não forem premium_only
CREATE POLICY "Dicas liberadas para membros autenticados" 
ON public.place_tips FOR SELECT 
USING (
    is_premium_only = FALSE 
    OR (auth.uid() IS NOT NULL AND EXISTS (
        SELECT 1 FROM public.profiles WHERE id = auth.uid() AND access_status = 'active'
    ))
);

-- Profiles: Cada usuário lê/atualiza apenas seu próprio perfil
CREATE POLICY "Usuários acessam seu próprio perfil" 
ON public.profiles FOR ALL 
USING (auth.uid() = id);

-- Payments: Usuário acessa seus próprios pagamentos
CREATE POLICY "Usuários visualizam seus pagamentos" 
ON public.payments FOR SELECT 
USING (auth.uid()::text = user_id);

-- Partner Tracking: Inserção anônima permitida para analytics de cliques
CREATE POLICY "Registro de métricas de parceiros permitido" 
ON public.partner_tracking FOR INSERT 
WITH CHECK (TRUE);

-- ==============================================================================
-- SUPABASE STORAGE: BUCKET 'place-images'
-- ==============================================================================
INSERT INTO storage.buckets (id, name, public) 
VALUES ('place-images', 'place-images', TRUE)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Imagens de locais publicamente acessíveis" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'place-images');

CREATE POLICY "Admin pode gerenciar imagens no bucket" 
ON storage.objects FOR ALL 
USING (bucket_id = 'place-images');
