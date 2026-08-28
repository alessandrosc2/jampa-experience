import React, { useState, useEffect, useMemo } from 'react';
import {
  Star,
  MapPin,
  Clock,
  Navigation,
  Sparkles,
  Lock,
  Unlock,
  Check,
  Car,
  Accessibility,
  HeartHandshake,
  CreditCard,
  QrCode,
  Heart,
  Maximize2,
  Images,
  ShieldCheck,
  ArrowRight,
  Compass,
  Gift,
  Copy,
  MessageCircle,
  Phone,
  Globe,
  Crown,
  Handshake,
  Camera,
  Waves
} from 'lucide-react';
import { Place, Topic, Partner } from '../../types/place';
import { User } from '../../types/user';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { LightboxModal } from '../places/LightboxModal';
import { ReviewSection } from '../places/ReviewSection';
import { adminService } from '../../services/adminService';
import { analyticsService } from '../../services/analyticsService';

interface PlacePreviewModalProps {
  place: Place | null;
  isOpen: boolean;
  isVipMode: boolean;
  currentUser: User | null;
  isFavorite?: boolean;
  onToggleFavorite?: (placeId: string) => void;
  onClose: () => void;
  onUnlockClick: () => void;
  onRequireAuth: () => void;
  onOpenTides?: () => void;
}

export const PlacePreviewModal: React.FC<PlacePreviewModalProps> = ({
  place,
  isOpen,
  isVipMode,
  currentUser,
  isFavorite = false,
  onToggleFavorite,
  onClose,
  onUnlockClick,
  onRequireAuth,
  onOpenTides
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [copiedCoupon, setCopiedCoupon] = useState(false);

  useEffect(() => {
    if (isOpen && place) {
      analyticsService.trackViewItem(place.id, place.name, place.categoryId);
    }
  }, [isOpen, place]);

  // Busca parceiros comerciais vinculados a este local (1 local -> N parceiros)
  const linkedPartners = useMemo(() => {
    if (!place) return [];
    const directPartners = adminService.getPartnersByPlaceId(place.id);
    if (directPartners.length > 0) return directPartners;

    // Se o próprio local tiver campos de parceiro, cria o fallback
    if (place.isPartner && place.partnerBenefit) {
      const fallbackPartner: Partner = {
        id: `partner-legacy-${place.id}`,
        placeId: place.id,
        name: place.name,
        description: place.partnerDescription || place.publicTeaser || '',
        address: place.address || '',
        googleMapsUrl: place.googleMapsUrl || '',
        benefit: place.partnerBenefit,
        partnershipLevel: (place.partnerLevel === 'fundador' ? 'Diamante' : place.partnerLevel === 'destaque' ? 'Ouro' : 'Prata') as any,
        couponCode: place.partnerCouponCode,
        whatsapp: place.whatsapp,
        instagram: place.instagram,
        phone: place.phone,
        website: place.website,
        active: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      return [fallbackPartner];
    }
    return [];
  }, [place]);

  // Busca os tópicos aos quais o local pertence
  const placeTopics = useMemo(() => {
    if (!place) return [];
    const allTopics = adminService.getTopics();
    const tIds = place.topicIds || [];
    return allTopics.filter((t) => tIds.includes(t.id) || tIds.includes(t.slug));
  }, [place]);

  // Busca outros locais cadastrados no mesmo bairro
  const neighborhoodPlaces = useMemo(() => {
    if (!place) return [];
    const all = adminService.getAllPlaces();
    return all.filter((p) => p.id !== place.id && (
      (p.neighborhood && p.neighborhood.toLowerCase().includes(place.neighborhood.toLowerCase())) ||
      (place.neighborhood && place.neighborhood.toLowerCase().includes(p.neighborhood.toLowerCase())) ||
      (p.neighborhoodId && place.neighborhoodId && p.neighborhoodId === place.neighborhoodId)
    ));
  }, [place]);

  useEffect(() => {
    if (isOpen && place && isVipMode && (place.isPartner || linkedPartners.length > 0)) {
      adminService.trackPartnerClick(place.id, 'view');
      linkedPartners.forEach((pt: Partner) => adminService.trackPartnerClick(pt.id, 'view'));
    }
  }, [isOpen, place, isVipMode, linkedPartners]);

  if (!place) return null;

  const allImages = place.gallery && place.gallery.length > 0
    ? place.gallery
    : [place.featuredImage];

  const currentMainImage = selectedImage || place.featuredImage;

  // URLs de Navegação GPS
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${place.coordinates.lat},${place.coordinates.lng}`;
  const appleMapsUrl = `https://maps.apple.com/?ll=${place.coordinates.lat},${place.coordinates.lng}`;
  const wazeUrl = `https://waze.com/ul?ll=${place.coordinates.lat},${place.coordinates.lng}&navigate=yes`;

  const handleOpenLightbox = (index: number = 0) => {
    setLightboxIndex(index);
    setIsLightboxOpen(true);
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        maxWidth="840px"
        title={
          <div className="modal-top-title">
            <Badge variant="cyan" size="sm">{place.categoryLabel}</Badge>
            <span className="modal-title-name">
              {isVipMode ? place.name : 'Experiência Selecionada'}
            </span>
            {isVipMode && (
              <button
                type="button"
                className={`modal-fav-btn ${isFavorite ? 'active' : ''}`}
                onClick={() => onToggleFavorite?.(place.id)}
                title={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
              >
                <Heart
                  size={18}
                  fill={isFavorite ? '#E76F51' : 'transparent'}
                  color={isFavorite ? '#E76F51' : '#CBD5E1'}
                />
              </button>
            )}
          </div>
        }
      >
        <div className="modal-place-content">
          {/* ======================================================== */}
          {/* MODO VISITANTE (PAYWALL ELEGANTE & EXPERIÊNCIA PROTEGIDA) */}
          {/* ======================================================== */}
          {!isVipMode ? (
            <div className="visitor-exclusive-modal-view">
              {/* Foto de Capa com Badge de Bloqueio */}
              <div className="preview-hero-wrap">
                <img src={place.featuredImage} alt="Experiência em João Pessoa" className="preview-hero-img" />
                <div className="preview-hero-overlay" />

                <div className="preview-hero-badge-tag">
                  <Badge variant="gold" icon={<Lock size={13} />}>
                    Conteúdo Exclusivo para Membros
                  </Badge>
                </div>

                <div className="preview-hero-title-box">
                  <h3 className="preview-hero-heading">{place.name}</h3>
                  <p className="preview-hero-loc">
                    <MapPin size={14} color="#00B4D8" /> {place.neighborhood} • João Pessoa (PB)
                  </p>
                </div>
              </div>

              {/* Descrição Geral e Benefícios do Desbloqueio */}
              <div className="preview-lock-content-box glass-panel">
                <div className="lock-header-row">
                  <div className="lock-icon-circle">
                    <Sparkles size={22} color="#F4A261" />
                  </div>
                  <div>
                    <h4 className="lock-heading-title">Extraia o melhor deste local com o Guia Completo</h4>
                    <p className="lock-heading-desc">
                      Todas as informações estratégicas, horários sem fila e rotas no GPS estão protegidas. Desbloqueie com pagamento único de R$ 39,90.
                    </p>
                  </div>
                </div>

                {/* Checklist do que será Desbloqueado */}
                <div className="unlocked-features-checklist">
                  <div className="feature-check-item">
                    <span className="check-bullet">🔒</span>
                    <div>
                      <strong>Nome Exato & Endereço Completo:</strong>
                      <span>Descubra o local exato com rota de 1 clique no Google Maps e Waze.</span>
                    </div>
                  </div>

                  <div className="feature-check-item">
                    <span className="check-bullet">🔒</span>
                    <div>
                      <strong>Tábua de Marés & Melhores Horários:</strong>
                      <span>Saiba o momento perfeito para visitar sem pegar maré cheia ou turbidez.</span>
                    </div>
                  </div>

                  <div className="feature-check-item">
                    <span className="check-bullet">🔒</span>
                    <div>
                      <strong>Dica Secreta de Quem Vive Aqui:</strong>
                      <span>Onde estacionar sem flanelinha, melhor mesa e o prato com melhor custo-benefício.</span>
                    </div>
                  </div>

                  <div className="feature-check-item">
                    <span className="check-bullet">🔒</span>
                    <div>
                      <strong>Galeria em Alta Resolução & Avaliações Reais:</strong>
                      <span>Fotos exclusivas e opiniões de outros turistas verificados.</span>
                    </div>
                  </div>
                </div>

                {/* Box de Ação Comercial / Compra */}
                <div className="lock-modal-cta-box">
                  <div className="price-tag-wrap">
                    <span className="price-label">Acesso Vitalício Completo:</span>
                    <div className="price-num">
                      <span className="cur">R$</span>
                      <span className="val">39,90</span>
                      <span className="once">pagamento único</span>
                    </div>
                  </div>

                  <Button
                    variant="gold"
                    size="lg"
                    iconLeft={<Sparkles size={18} />}
                    iconRight={<ArrowRight size={18} />}
                    onClick={onUnlockClick}
                    className="modal-unlock-cta-btn"
                  >
                    DESBLOQUEAR ACESSO VITALÍCIO (R$ 39,90)
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            /* ======================================================== */
            /* MODO VIP (CONTEÚDO COMPLETO DESBLOQUEADO) */
            /* ======================================================== */
            <>
              {/* Galeria de Fotos */}
              <div className="place-gallery-section">
                <div className="main-image-container" onClick={() => handleOpenLightbox(allImages.indexOf(currentMainImage))}>
                  <img src={currentMainImage} alt={place.name} className="modal-main-img" />
                  <div className="image-overlay-info">
                    <div className="rating-tag glass-panel">
                      <Star size={14} fill="#F59E0B" color="#F59E0B" />
                      <span>{place.rating.toFixed(1)}</span>
                      <span className="count">({place.reviewCount} avaliações)</span>
                    </div>
                    <div className="neighborhood-tag glass-panel">
                      <MapPin size={14} color="#00B4D8" />
                      <span>{place.neighborhood}</span>
                    </div>
                  </div>

                  <div className="zoom-hint-badge glass-panel">
                    <Maximize2 size={14} />
                    <span>Ver Galeria ({allImages.length} fotos)</span>
                  </div>
                </div>

                {allImages.length > 1 && (
                  <div className="gallery-thumbs">
                    {allImages.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setSelectedImage(img);
                          handleOpenLightbox(idx);
                        }}
                        className={`thumb-btn ${currentMainImage === img ? 'thumb-active' : ''}`}
                        title="Clique para abrir galeria em tela cheia"
                      >
                        <img src={img} alt={`Foto ${idx + 1} de ${place.name}`} />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Descrição & Detalhes */}
              <div className="place-info-block">
                {place.slogan && <p className="place-slogan">"{place.slogan}"</p>}

                {/* TÓPICOS & SEÇÕES VINCULADAS AO LOCAL */}
                {placeTopics.length > 0 && (
                  <div className="place-topics-pill-row">
                    {placeTopics.map((t: Topic) => (
                      <span key={t.id} className="place-topic-pill">
                        {t.name}
                      </span>
                    ))}
                  </div>
                )}

                <p className="place-full-desc">{place.fullDescription}</p>

                <div className="place-meta-grid">
                  <div className="meta-item">
                    <MapPin size={16} className="meta-icon" />
                    <div>
                      <span className="meta-label">Endereço</span>
                      <span className="meta-val">{place.address}</span>
                    </div>
                  </div>

                  {place.openingHours && (
                    <div className="meta-item">
                      <Clock size={16} className="meta-icon" />
                      <div>
                        <span className="meta-label">Horários</span>
                        <span className="meta-val">{place.openingHours}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Facilidades e Comodidades */}
                <div className="amenities-row">
                  {place.amenities.parking && (
                    <span className="amenity-badge"><Car size={13} /> Estacionamento</span>
                  )}
                  {place.amenities.accessibility && (
                    <span className="amenity-badge"><Accessibility size={13} /> Acessibilidade</span>
                  )}
                  {place.amenities.familyFriendly && (
                    <span className="amenity-badge"><HeartHandshake size={13} /> Família & Crianças</span>
                  )}
                  {place.amenities.pixPayment && (
                    <span className="amenity-badge"><QrCode size={13} /> Aceita PIX</span>
                  )}
                  {place.amenities.cardPayment && (
                    <span className="amenity-badge"><CreditCard size={13} /> Cartões</span>
                  )}
                </div>

                {/* Atalho Inteligente para Tábua de Marés nos Locais Costeiros/Passeios */}
                {onOpenTides && (place.categoryId === 'praias' || place.categoryId === 'passeios' || place.categoryId === 'dicas' || place.tags.some(t => t.toLowerCase().includes('maré') || t.toLowerCase().includes('piscina') || t.toLowerCase().includes('catamarã') || t.toLowerCase().includes('seixas') || t.toLowerCase().includes('picãozinho') || t.toLowerCase().includes('areia vermelha'))) && (
                  <div className="place-tide-box glass-panel">
                    <div className="place-tide-box-left">
                      <Waves size={18} color="#00B4D8" />
                      <div>
                        <strong className="place-tide-title">Consultar Tábua de Marés deste Local</strong>
                        <span className="place-tide-sub">Veja os horários ideais de maré baixa para os próximos 7 dias.</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="place-tide-action-btn"
                      onClick={onOpenTides}
                    >
                      <span>Ver Marés (7D)</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                )}

                {/* ======================================================== */}
                {/* SEÇÃO DE ESTABELECIMENTOS & BENEFÍCIOS PARCEIROS (1-TO-N) */}
                {/* ======================================================== */}
                {linkedPartners.length > 0 && (
                  <div className="modal-linked-partners-section">
                    <div className="partner-section-header">
                      <Crown size={18} color="#F4A261" />
                      <h4>Locais VIP & Benefícios ({linkedPartners.length})</h4>
                    </div>

                    <div className="linked-partners-list">
                      {linkedPartners.map((partner: Partner) => (
                        <div key={partner.id} className="modal-partner-perk-card glass-panel">
                          <div className="partner-perk-header">
                            <div className="partner-badge-and-title">
                              <h4 className="partner-title-text">{partner.name}</h4>
                              {partner.address && (
                                <span className="partner-sub-text">
                                  <MapPin size={12} color="#00B4D8" /> {partner.address}
                                </span>
                              )}
                            </div>
                            <Badge variant="gold" size="sm">Benefício Exclusivo VIP</Badge>
                          </div>

                          {partner.benefit && (
                            <div className="partner-perk-box">
                              <Gift size={20} color="#F4A261" className="gift-icon" />
                              <div className="perk-info">
                                <strong className="perk-title">{partner.benefit}</strong>
                                {partner.description && (
                                  <p className="perk-desc">{partner.description}</p>
                                )}
                              </div>
                            </div>
                          )}

                          {partner.couponCode && (
                            <div className="partner-coupon-action-row">
                              <div className="coupon-code-pill">
                                <span className="coupon-label">CUPOM VIP:</span>
                                <span className="coupon-code">{partner.couponCode}</span>
                              </div>
                              <Button
                                size="sm"
                                variant="gold"
                                iconLeft={<Copy size={13} />}
                                onClick={() => {
                                  navigator.clipboard.writeText(partner.couponCode || '');
                                  adminService.trackPartnerClick(partner.id, 'click_coupon');
                                  adminService.trackPartnerClick(place.id, 'click_coupon');
                                  setCopiedCoupon(true);
                                  setTimeout(() => setCopiedCoupon(false), 2500);
                                }}
                              >
                                {copiedCoupon ? 'Copiado!' : 'Copiar Cupom'}
                              </Button>
                            </div>
                          )}

                          {/* Canais Diretos de Atendimento do Parceiro */}
                          <div className="partner-contact-channels">
                            {partner.whatsapp && (
                              <a
                                href={`https://wa.me/${partner.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent('Olá! Encontrei vocês através do JAMPA EXPERIENCE e gostaria de mais informações.')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="partner-channel-btn whatsapp"
                                onClick={() => {
                                  adminService.trackPartnerClick(partner.id, 'click_whatsapp');
                                  adminService.trackPartnerClick(place.id, 'click_whatsapp');
                                }}
                              >
                                <MessageCircle size={15} />
                                <span>WhatsApp Direto</span>
                              </a>
                            )}

                            {partner.instagram && (
                              <a
                                href={`https://instagram.com/${partner.instagram.replace('@', '')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="partner-channel-btn instagram"
                                onClick={() => {
                                  adminService.trackPartnerClick(partner.id, 'click_instagram');
                                  adminService.trackPartnerClick(place.id, 'click_instagram');
                                }}
                              >
                                <Camera size={15} />
                                <span>{partner.instagram.startsWith('@') ? partner.instagram : `@${partner.instagram}`}</span>
                              </a>
                            )}

                            {partner.phone && (
                              <a
                                href={`tel:${partner.phone.replace(/\D/g, '')}`}
                                className="partner-channel-btn phone"
                              >
                                <Phone size={15} />
                                <span>{partner.phone}</span>
                              </a>
                            )}

                            {partner.website && (
                              <a
                                href={partner.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="partner-channel-btn website"
                                onClick={() => {
                                  adminService.trackPartnerClick(partner.id, 'click_website');
                                  adminService.trackPartnerClick(place.id, 'click_website');
                                }}
                              >
                                <Globe size={15} />
                                <span>Site Oficial</span>
                              </a>
                            )}

                            {partner.googleMapsUrl && (
                              <a
                                href={partner.googleMapsUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="partner-channel-btn maps"
                                onClick={() => {
                                  adminService.trackPartnerClick(partner.id, 'click_maps');
                                  adminService.trackPartnerClick(place.id, 'click_maps');
                                }}
                              >
                                <MapPin size={15} />
                                <span>Google Maps</span>
                              </a>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* DICAS SECRETAS DOS NATIVOS */}
              <div className="secret-tips-wrapper">
                <div className="tips-section-header">
                  <div className="tips-title-group">
                    <Sparkles size={18} color="#F4A261" />
                    <h3>Dicas Secretas & Melhores Práticas</h3>
                  </div>
                  <Badge variant="emerald" icon={<Unlock size={13} />}>
                    VIP Desbloqueado
                  </Badge>
                </div>

                <div className="unlocked-tips-list">
                  {place.tips.map((tip, idx) => (
                    <div key={idx} className="tip-unlocked-card glass-panel">
                      <div className="tip-header-row">
                        {tip.badge && <Badge variant="gold" size="sm">{tip.badge}</Badge>}
                        <h4 className="tip-title">{tip.title}</h4>
                      </div>
                      <p className="tip-description">{tip.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* NAVEGAÇÃO & ROTAS NO MAPA (GPS) */}
              <div className="map-navigation-block glass-panel">
                <div className="nav-block-header">
                  <Navigation size={18} color="#00B4D8" />
                  <h4>Como Chegar — Abrir no seu GPS Favorito</h4>
                </div>

                <div className="gps-buttons-row">
                  <a
                    href={googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="gps-btn google-maps"
                    onClick={() => {
                      adminService.trackPartnerClick(place.id, 'click_maps');
                      linkedPartners.forEach((pt: Partner) => adminService.trackPartnerClick(pt.id, 'click_maps'));
                    }}
                  >
                    📍 Abrir no Google Maps
                  </a>
                  <a
                    href={appleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="gps-btn apple-maps"
                    onClick={() => {
                      adminService.trackPartnerClick(place.id, 'click_maps');
                      linkedPartners.forEach((pt: Partner) => adminService.trackPartnerClick(pt.id, 'click_maps'));
                    }}
                  >
                    🗺️ Abrir no Apple Maps
                  </a>
                  <a
                    href={wazeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="gps-btn waze"
                    onClick={() => {
                      adminService.trackPartnerClick(place.id, 'click_maps');
                      linkedPartners.forEach((pt: Partner) => adminService.trackPartnerClick(pt.id, 'click_maps'));
                    }}
                  >
                    🚗 Navegar com Waze
                  </a>
                </div>
              </div>

              {/* Avaliações e Comentários */}
              <ReviewSection
                placeId={place.id}
                initialReviews={place.reviews || []}
                currentUser={currentUser}
                isVipMode={isVipMode}
                onRequireAuth={onRequireAuth}
              />
            </>
          )}
        </div>

        <style>{`
          .modal-top-title {
            display: flex;
            align-items: center;
            gap: 0.75rem;
          }

          .modal-title-name {
            font-family: var(--font-display);
            font-size: 1.15rem;
            font-weight: 800;
            color: #F8FAFC;
          }

          .modal-fav-btn {
            width: 34px;
            height: 34px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.06);
            border: 1px solid var(--border-subtle);
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all var(--transition-fast);
            margin-left: 0.35rem;
          }

          .modal-fav-btn:hover {
            background: rgba(231, 111, 81, 0.2);
            border-color: #E76F51;
            transform: scale(1.1);
          }

          .modal-fav-btn.active {
            background: rgba(231, 111, 81, 0.25);
            border-color: #E76F51;
          }

          .modal-place-content {
            display: flex;
            flex-direction: column;
            gap: var(--space-xl);
          }

          /* ESTILO DO PAYWALL DO VISITANTE */
          .visitor-exclusive-modal-view {
            display: flex;
            flex-direction: column;
            gap: var(--space-lg);
          }

          .preview-hero-wrap {
            position: relative;
            width: 100%;
            height: 220px;
            border-radius: var(--radius-lg);
            overflow: hidden;
            background: #09111b;
          }

          .preview-hero-img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }

          .preview-hero-overlay {
            position: absolute;
            inset: 0;
            background: linear-gradient(180deg, rgba(6, 11, 17, 0.2) 0%, rgba(6, 11, 17, 0.9) 100%);
          }

          .preview-hero-badge-tag {
            position: absolute;
            top: var(--space-md);
            left: var(--space-md);
            z-index: 2;
          }

          .preview-hero-title-box {
            position: absolute;
            bottom: var(--space-md);
            left: var(--space-lg);
            right: var(--space-lg);
            z-index: 2;
          }

          .preview-hero-heading {
            font-family: var(--font-display);
            font-size: 1.35rem;
            font-weight: 800;
            color: #F8FAFC;
            line-height: 1.25;
          }

          .preview-hero-loc {
            display: flex;
            align-items: center;
            gap: 0.35rem;
            font-size: 0.8125rem;
            color: #00B4D8;
            margin-top: 0.25rem;
          }

          .preview-lock-content-box {
            padding: var(--space-xl);
            border-radius: var(--radius-lg);
            border: 1px solid rgba(244, 162, 97, 0.3);
            display: flex;
            flex-direction: column;
            gap: var(--space-lg);
          }

          .lock-header-row {
            display: flex;
            align-items: flex-start;
            gap: var(--space-md);
          }

          .lock-icon-circle {
            width: 48px;
            height: 48px;
            border-radius: var(--radius-md);
            background: rgba(244, 162, 97, 0.15);
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
          }

          .lock-heading-title {
            font-family: var(--font-display);
            font-size: 1.15rem;
            font-weight: 800;
            color: #F8FAFC;
          }

          .lock-heading-desc {
            font-size: 0.875rem;
            color: #94A3B8;
            margin-top: 0.25rem;
            line-height: 1.45;
          }

          .unlocked-features-checklist {
            display: flex;
            flex-direction: column;
            gap: 0.75rem;
            padding: var(--space-md);
            background: rgba(255, 255, 255, 0.02);
            border: 1px solid var(--border-subtle);
            border-radius: var(--radius-md);
          }

          .feature-check-item {
            display: flex;
            align-items: flex-start;
            gap: 0.65rem;
            font-size: 0.8125rem;
            line-height: 1.4;
          }

          .feature-check-item strong {
            color: #F8FAFC;
            display: block;
          }

          .feature-check-item span {
            color: #94A3B8;
          }

          .lock-modal-cta-box {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: var(--space-lg);
            padding-top: var(--space-md);
            border-top: 1px solid var(--border-subtle);
            flex-wrap: wrap;
          }

          .price-tag-wrap {
            display: flex;
            flex-direction: column;
          }

          .price-label {
            font-size: 0.75rem;
            color: #94A3B8;
          }

          .price-num {
            display: flex;
            align-items: baseline;
            gap: 0.25rem;
          }

          .price-num .cur {
            font-size: 0.875rem;
            color: #F4A261;
            font-weight: 700;
          }

          .price-num .val {
            font-family: var(--font-display);
            font-size: 1.75rem;
            font-weight: 900;
            color: #F8FAFC;
          }

          .price-num .once {
            font-size: 0.6875rem;
            color: #94A3B8;
          }

          .modal-unlock-cta-btn {
            box-shadow: 0 0 25px rgba(244, 162, 97, 0.35);
          }

          /* ESTILOS DA VERSÃO VIP */
          .place-gallery-section {
            display: flex;
            flex-direction: column;
            gap: 0.75rem;
          }

          .main-image-container {
            position: relative;
            width: 100%;
            height: 300px;
            border-radius: var(--radius-lg);
            overflow: hidden;
            background: #09111b;
            cursor: pointer;
          }

          .modal-main-img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.4s ease;
          }

          .main-image-container:hover .modal-main-img {
            transform: scale(1.03);
          }

          .image-overlay-info {
            position: absolute;
            bottom: var(--space-md);
            left: var(--space-md);
            display: flex;
            gap: 0.5rem;
          }

          .zoom-hint-badge {
            position: absolute;
            top: var(--space-md);
            right: var(--space-md);
            display: flex;
            align-items: center;
            gap: 0.4rem;
            padding: 0.35rem 0.75rem;
            background: rgba(6, 11, 17, 0.85);
            border-radius: var(--radius-full);
            font-size: 0.75rem;
            color: #CBD5E1;
            font-weight: 600;
          }

          .rating-tag, .neighborhood-tag {
            display: flex;
            align-items: center;
            gap: 0.4rem;
            padding: 0.35rem 0.75rem;
            background: rgba(6, 11, 17, 0.85);
            border-radius: var(--radius-full);
            font-size: 0.8125rem;
            font-weight: 700;
            color: #F8FAFC;
          }

          .gallery-thumbs {
            display: flex;
            gap: 0.5rem;
            overflow-x: auto;
            padding-bottom: 0.25rem;
          }

          .thumb-btn {
            width: 75px;
            height: 55px;
            border-radius: var(--radius-sm);
            overflow: hidden;
            border: 2px solid transparent;
            opacity: 0.6;
            transition: all var(--transition-fast);
            flex-shrink: 0;
            cursor: pointer;
          }

          .thumb-btn img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }

          .thumb-btn:hover, .thumb-active {
            opacity: 1;
            border-color: #00B4D8;
            transform: scale(1.05);
          }

          .place-info-block {
            display: flex;
            flex-direction: column;
            gap: var(--space-md);
          }

          .place-slogan {
            font-size: 1.05rem;
            font-style: italic;
            color: #F4A261;
            font-weight: 600;
          }

          .place-full-desc {
            font-size: 0.95rem;
            color: #CBD5E1;
            line-height: 1.65;
          }

          .place-meta-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
            gap: var(--space-md);
            padding: var(--space-md);
            background: rgba(255, 255, 255, 0.03);
            border-radius: var(--radius-md);
            border: 1px solid var(--border-subtle);
          }

          .meta-item {
            display: flex;
            align-items: flex-start;
            gap: 0.6rem;
          }

          .meta-icon {
            color: #00B4D8;
            margin-top: 2px;
          }

          .meta-label {
            display: block;
            font-size: 0.75rem;
            text-transform: uppercase;
            color: #64748B;
            font-weight: 700;
          }

          .meta-val {
            font-size: 0.875rem;
            color: #E2E8F0;
            font-weight: 500;
          }

          .amenities-row {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
          }

          .place-tide-box {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 1rem;
            padding: 0.85rem 1.15rem;
            background: linear-gradient(90deg, rgba(0, 180, 216, 0.12) 0%, rgba(15, 23, 42, 0.6) 100%);
            border: 1px solid rgba(0, 180, 216, 0.35);
            border-radius: var(--radius-lg);
            margin-top: 0.35rem;
          }

          .place-tide-box-left {
            display: flex;
            align-items: center;
            gap: 0.75rem;
          }

          .place-tide-box-left div {
            display: flex;
            flex-direction: column;
            gap: 0.15rem;
          }

          .place-tide-title {
            font-size: 0.875rem;
            color: #F8FAFC;
            font-weight: 700;
          }

          .place-tide-sub {
            font-size: 0.785rem;
            color: #94A3B8;
          }

          .place-tide-action-btn {
            display: inline-flex;
            align-items: center;
            gap: 0.35rem;
            padding: 0.4rem 0.85rem;
            background: rgba(0, 180, 216, 0.2);
            border: 1px solid rgba(0, 180, 216, 0.5);
            border-radius: var(--radius-full);
            color: #00B4D8;
            font-size: 0.785rem;
            font-weight: 700;
            cursor: pointer;
            white-space: nowrap;
            transition: all 0.2s ease;
          }

          .place-tide-action-btn:hover {
            background: #00B4D8;
            color: #0F172A;
            box-shadow: 0 0 12px rgba(0, 180, 216, 0.4);
          }

          .place-topics-pill-row {
            display: flex;
            flex-wrap: wrap;
            gap: 0.4rem;
            margin-top: -0.25rem;
          }

          .place-topic-pill {
            display: inline-flex;
            align-items: center;
            padding: 0.25rem 0.65rem;
            background: rgba(0, 180, 216, 0.12);
            border: 1px solid rgba(0, 180, 216, 0.35);
            border-radius: var(--radius-full);
            font-size: 0.75rem;
            font-weight: 700;
            color: #38BDF8;
          }

          .modal-linked-partners-section {
            display: flex;
            flex-direction: column;
            gap: var(--space-md);
            margin-top: 0.5rem;
          }

          .partner-section-header {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            border-bottom: 1px solid rgba(255, 255, 255, 0.08);
            padding-bottom: 0.4rem;
          }

          .partner-section-header h4 {
            font-family: var(--font-display);
            font-size: 1rem;
            font-weight: 800;
            color: #F8FAFC;
            margin: 0;
          }

          .linked-partners-list {
            display: flex;
            flex-direction: column;
            gap: var(--space-md);
          }

          .amenity-badge {
            display: inline-flex;
            align-items: center;
            gap: 0.35rem;
            padding: 0.3rem 0.65rem;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid var(--border-subtle);
            border-radius: var(--radius-full);
            font-size: 0.75rem;
            color: #94A3B8;
          }

          .secret-tips-wrapper {
            display: flex;
            flex-direction: column;
            gap: var(--space-md);
          }

          .tips-section-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-bottom: 1px solid var(--border-subtle);
            padding-bottom: 0.5rem;
          }

          .tips-title-group {
            display: flex;
            align-items: center;
            gap: 0.5rem;
          }

          .tips-title-group h3 {
            font-size: 1.15rem;
            color: #F8FAFC;
          }

          .unlocked-tips-list {
            display: flex;
            flex-direction: column;
            gap: var(--space-sm);
          }

          .tip-unlocked-card {
            padding: var(--space-md);
            border-left: 3px solid #00B4D8;
            display: flex;
            flex-direction: column;
            gap: 0.3rem;
          }

          .tip-header-row {
            display: flex;
            align-items: center;
            gap: 0.5rem;
          }

          .tip-title {
            font-family: var(--font-display);
            font-size: 0.95rem;
            color: #F8FAFC;
          }

          .tip-description {
            font-size: 0.875rem;
            color: #CBD5E1;
            line-height: 1.5;
          }

          .map-navigation-block {
            padding: var(--space-md) var(--space-lg);
            display: flex;
            flex-direction: column;
            gap: var(--space-sm);
          }

          .nav-block-header {
            display: flex;
            align-items: center;
            gap: 0.5rem;
          }

          .nav-block-header h4 {
            font-size: 0.95rem;
            color: #F8FAFC;
          }

          .gps-buttons-row {
            display: flex;
            gap: var(--space-sm);
            flex-wrap: wrap;
          }

          .gps-btn {
            flex: 1;
            min-width: 160px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: 0.6rem 1rem;
            border-radius: var(--radius-md);
            font-family: var(--font-display);
            font-size: 0.8125rem;
            font-weight: 700;
            color: #F8FAFC;
            background: rgba(255, 255, 255, 0.06);
            border: 1px solid var(--border-medium);
            transition: all var(--transition-fast);
          }

          .gps-btn:hover {
            background: rgba(0, 180, 216, 0.2);
            border-color: #00B4D8;
            color: #38BDF8;
            transform: translateY(-2px);
          }

          .modal-partner-perk-card {
            padding: var(--space-lg);
            border-radius: var(--radius-lg);
            border-left: 4px solid #F4A261;
            display: flex;
            flex-direction: column;
            gap: var(--space-md);
            background: rgba(244, 162, 97, 0.05);
          }

          .partner-perk-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
          }

          .partner-badge-and-title {
            display: flex;
            align-items: center;
            gap: 0.5rem;
          }

          .partner-title-text {
            font-family: var(--font-display);
            font-size: 1rem;
            font-weight: 800;
            color: #F8FAFC;
          }

          .partner-sub-text {
            font-size: 0.75rem;
            color: #F4A261;
            display: block;
          }

          .partner-perk-box {
            display: flex;
            align-items: flex-start;
            gap: 0.75rem;
            padding: var(--space-md);
            background: rgba(244, 162, 97, 0.1);
            border: 1px solid rgba(244, 162, 97, 0.3);
            border-radius: var(--radius-md);
          }

          .perk-info {
            display: flex;
            flex-direction: column;
            gap: 0.2rem;
          }

          .perk-title {
            font-size: 0.9375rem;
            color: #F8FAFC;
          }

          .perk-desc {
            font-size: 0.8125rem;
            color: #CBD5E1;
            line-height: 1.4;
          }

          .partner-coupon-action-row {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: var(--space-md);
            padding: var(--space-sm) var(--space-md);
            background: rgba(6, 11, 17, 0.8);
            border: 1px dashed rgba(244, 162, 97, 0.4);
            border-radius: var(--radius-md);
            flex-wrap: wrap;
          }

          .coupon-code-pill {
            display: flex;
            align-items: center;
            gap: 0.5rem;
          }

          .coupon-label {
            font-size: 0.6875rem;
            font-weight: 800;
            color: #94A3B8;
            letter-spacing: 0.05em;
          }

          .coupon-code {
            font-family: var(--font-mono, monospace);
            font-size: 1rem;
            font-weight: 800;
            color: #F4A261;
            letter-spacing: 0.1em;
          }

          .partner-contact-channels {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
            gap: 0.5rem;
          }

          .partner-channel-btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 0.45rem;
            padding: 0.55rem 0.85rem;
            border-radius: var(--radius-md);
            font-size: 0.78125rem;
            font-weight: 700;
            color: #F8FAFC;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid var(--border-subtle);
            transition: all var(--transition-fast);
            text-decoration: none;
          }

          .partner-channel-btn.whatsapp {
            background: rgba(37, 211, 102, 0.15);
            border-color: rgba(37, 211, 102, 0.4);
            color: #4ADE80;
          }

          .partner-channel-btn.whatsapp:hover {
            background: #25D366;
            color: #060B11;
          }

          .partner-channel-btn.instagram {
            background: rgba(225, 48, 108, 0.15);
            border-color: rgba(225, 48, 108, 0.4);
            color: #F472B6;
          }

          .partner-channel-btn.instagram:hover {
            background: #E1306C;
            color: #FFFFFF;
          }

          .partner-channel-btn:hover {
            background: rgba(0, 180, 216, 0.2);
            border-color: #00B4D8;
            color: #38BDF8;
          }

          @media (max-width: 640px) {
            .main-image-container {
              height: 220px;
            }
            .lock-modal-cta-box {
              flex-direction: column;
              align-items: stretch;
            }
            .modal-unlock-cta-btn {
              width: 100%;
            }
          }
        `}</style>
      </Modal>

      {/* Lightbox em Tela Cheia (somente VIP) */}
      {isVipMode && (
        <LightboxModal
          isOpen={isLightboxOpen}
          onClose={() => setIsLightboxOpen(false)}
          images={allImages}
          initialIndex={lightboxIndex}
          placeName={place.name}
        />
      )}
    </>
  );
};
