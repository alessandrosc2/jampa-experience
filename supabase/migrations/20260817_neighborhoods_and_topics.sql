-- ==============================================================================
-- JAMPA EXPERIENCE — MIGRAÇÃO: BAIRROS, TÓPICOS E MODALIDADES RELACIONAIS
-- ==============================================================================

-- 1. TABELA DE BAIRROS (NEIGHBORHOODS)
CREATE TABLE IF NOT EXISTS public.neighborhoods (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    cover_image TEXT NOT NULL,
    tips TEXT[] DEFAULT '{}',
    position INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. TABELA DE TÓPICOS DINÂMICOS (TOPICS)
CREATE TABLE IF NOT EXISTS public.topics (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    icon_name TEXT NOT NULL DEFAULT 'Compass',
    accent_color TEXT NOT NULL DEFAULT '#00B4D8',
    position INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. TABELA DE MODALIDADES (MODALITIES)
CREATE TABLE IF NOT EXISTS public.modalities (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    icon_name TEXT NOT NULL DEFAULT 'Tag',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. ADICIONAR CAMPOS NA TABELA DE LOCAIS (PLACES)
ALTER TABLE public.places 
ADD COLUMN IF NOT EXISTS neighborhood_id TEXT REFERENCES public.neighborhoods(id) ON UPDATE CASCADE ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS modality_name TEXT,
ADD COLUMN IF NOT EXISTS topic_ids TEXT[] DEFAULT '{}';

-- 5. POLÍTICAS RLS (ROW LEVEL SECURITY)
ALTER TABLE public.neighborhoods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modalities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Bairros visíveis publicamente" 
ON public.neighborhoods FOR SELECT USING (TRUE);

CREATE POLICY "Tópicos visíveis publicamente" 
ON public.topics FOR SELECT USING (TRUE);

CREATE POLICY "Modalidades visíveis publicamente" 
ON public.modalities FOR SELECT USING (TRUE);
