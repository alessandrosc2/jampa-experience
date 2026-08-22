import { Place } from '../types/place';
import { Itinerary } from '../types/itinerary';
import { SHOWCASE_PLACES } from '../data/showcasePlaces';
import { adminService } from './adminService';

/**
 * SERVIÇO DE CONTEÚDO PREMIUM & CONTROLE DE ACESSO
 * 
 * Regra Arquitetural:
 * 1. Visitante NÃO PAGO recebe estritamente SHOWCASE_PLACES (dados de prévia com nomes mascarados, sem coordenadas GPS, sem dicas secretas).
 * 2. Membro VIP PAGO recebe todos os dados reais em tempo real do banco de dados (adminService / Supabase).
 */
class PremiumContentService {
  /**
   * Retorna os locais apropriados de acordo com o status de pagamento do usuário.
   * 
   * Se for membro VIP: entrega os dados completos e descriptografados.
   * Se for visitante: protege os segredos do conteúdo premium (nomes exatos, dicas, telefones, GPS),
   * mas reflete em tempo real as fotos de capa, galerias, categorias e novidades editadas no CMS.
   */
  public getPlacesForUser(isVip: boolean): Place[] {
    const allPlaces = adminService.getAllPlaces();
    if (isVip) {
      return allPlaces;
    }

    return allPlaces.map((place, idx) => ({
      ...place,
      name: `${place.categoryLabel} #${idx + 1} — ${place.neighborhood}`,
      address: `${place.neighborhood}, João Pessoa - PB (Localização exata revelada no guia)`,
      coordinates: { lat: -7.115, lng: -34.825 },
      phone: undefined,
      whatsapp: undefined,
      instagram: undefined,
      facebook: undefined,
      website: undefined,
      googleMapsUrl: undefined,
      tips: [
        {
          title: 'Dica dos Nativos',
          description: 'Horários sem fila, rotas e segredos de estacionamento liberados após o desbloqueio.',
          badge: 'Exclusivo VIP',
          isPremiumOnly: true
        }
      ],
      // Mantém a foto de capa atualizada pelo CMS, galeria e avaliações
      featuredImage: place.featuredImage,
      gallery: place.gallery,
      images: place.images
    }));
  }

  /**
   * Retorna todos os locais completos (Apenas para autenticação VIP ativa ou uso do Painel Admin).
   */
  public getAllPremiumPlaces(): Place[] {
    return adminService.getAllPlaces();
  }

  /**
   * Retorna os roteiros de acordo com o status VIP do usuário.
   */
  public getItinerariesForUser(isVip: boolean): Itinerary[] {
    const all = adminService.getItineraries();
    if (isVip) {
      return all;
    }
    // Para visitantes, retorna roteiros com paradas e horários protegidos
    return all.map((it) => ({
      ...it,
      description: 'Roteiro estratégico completo com paradas hora a hora e rotas no GPS liberados no Guia VIP.',
      days: it.days.map((d) => ({
        ...d,
        stops: d.stops.map((stop, idx) => ({
          ...stop,
          title: `Parada #${idx + 1} — Experiência Selecionada`,
          description: 'Instruções de horário e dicas secretas protegidas no guia VIP.',
          secretTip: 'Desbloqueie para visualizar.'
        }))
      }))
    }));
  }

  /**
   * Retorna os parceiros comerciais vinculados a um local de acordo com o status VIP do usuário.
   */
  public getPartnersForUser(placeId: string, isVip: boolean) {
    const partners = adminService.getPartnersByPlaceId(placeId);
    if (isVip) {
      return partners;
    }
    // Protege cupons de desconto e contatos diretos para visitantes
    return partners.map((p) => ({
      ...p,
      couponCode: '🔒 Exclusivo VIP',
      redemptionInstructions: 'Desbloqueie o acesso VIP para ver o código do cupom e as instruções de resgate.',
      phone: undefined,
      whatsapp: undefined
    }));
  }
  /**
   * Retorna o Guia Completo do Bairro organizado por Tópicos ativos.
   * 
   * REGRA ARQUITETURAL ABSOLUTA:
   * 1. Apenas tópicos que possuem conteúdo (places.length > 0) são retornados nas seções.
   * 2. Se for visitante (!isVip), aplica todas as proteções de paywall existentes (nomes, coordenadas, contatos e dicas).
   * 3. Se for VIP (isVip), retorna o conteúdo completo descriptografado.
   */
  public getNeighborhoodGuide(neighborhoodSlugOrId: string, isVip: boolean) {
    const neighborhood = adminService.getNeighborhoodById(neighborhoodSlugOrId) || adminService.getNeighborhoods()[0];
    const allPlacesForUser = this.getPlacesForUser(isVip);
    const topics = adminService.getTopics();

    // Filtra os locais pertencentes a este bairro (pelo neighborhoodId canônico ou pelo nome)
    const neighborhoodPlaces = allPlacesForUser.filter((p) => {
      const pNeighId = p.neighborhoodId?.toLowerCase() || '';
      const pNeighName = p.neighborhood?.toLowerCase() || '';
      const targetSlug = neighborhood.slug.toLowerCase();
      const targetId = neighborhood.id.toLowerCase();
      const targetName = neighborhood.name.toLowerCase();

      return (
        pNeighId === targetSlug ||
        pNeighId === targetId ||
        pNeighName === targetName ||
        pNeighName.includes(targetSlug) ||
        targetName.includes(pNeighName)
      );
    });

    // Mapeia os tópicos ativos que possuem locais vinculados
    const activeTopicSections = topics
      .map((topic) => {
        const topicPlaces = neighborhoodPlaces.filter((place) => {
          if (place.topicIds && place.topicIds.length > 0) {
            return place.topicIds.includes(topic.id) || place.topicIds.includes(topic.slug);
          }
          return place.categoryId === topic.id || place.categoryId === topic.slug;
        });

        return {
          topic,
          places: topicPlaces
        };
      })
      .filter((section) => section.places.length > 0); // REGRA ABSOLUTA: TÓPICOS VAZIOS NUNCA APARECEM!

    // Dicas do Bairro com proteção de Paywall
    const neighborhoodTips = isVip
      ? neighborhood.tips
      : neighborhood.tips.slice(0, 1).concat([
          '🔒 Horários estratégicos, vagas secretas de estacionamento e rotas liberadas no Acesso VIP.'
        ]);

    return {
      neighborhood,
      tips: neighborhoodTips,
      topicSections: activeTopicSections,
      totalPlacesInNeighborhood: neighborhoodPlaces.length
    };
  }
}

export const premiumContentService = new PremiumContentService();

