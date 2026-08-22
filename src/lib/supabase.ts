/// <reference types="vite/client" />
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL || '';
const supabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    typeof supabaseUrl === 'string' &&
    supabaseUrl.startsWith('https://') &&
    supabaseAnonKey.length > 20
  );
};

// Instância segura do cliente Supabase
export const supabase: SupabaseClient | null = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    })
  : null;

/**
 * Upload seguro de foto para o Bucket 'place-images' no Supabase Storage
 */
export async function uploadPlaceImageToStorage(
  placeId: string,
  file: File | Blob,
  fileName?: string
): Promise<{ publicUrl: string; storagePath: string } | null> {
  if (!supabase || !isSupabaseConfigured()) {
    return null;
  }

  try {
    const fileExt = fileName ? fileName.split('.').pop() : 'jpg';
    const cleanFileName = `${placeId}/${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
    const storagePath = `places/${cleanFileName}`;

    const { data, error } = await supabase.storage
      .from('place-images')
      .upload(storagePath, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (error || !data) {
      console.error('Erro ao enviar imagem para Supabase Storage:', error);
      return null;
    }

    const { data: publicUrlData } = supabase.storage
      .from('place-images')
      .getPublicUrl(data.path);

    return {
      publicUrl: publicUrlData.publicUrl,
      storagePath: data.path
    };
  } catch (err) {
    console.error('Falha inesperada no upload Supabase Storage:', err);
    return null;
  }
}
