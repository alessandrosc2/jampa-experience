import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Menu,
  Crown,
  LogOut,
  LayoutDashboard,
  MapPin,
  Sparkles,
  Users,
  Compass,
  FileText,
  Plus,
  Edit2,
  Trash2,
  Search,
  CheckCircle2,
  XCircle,
  Save,
  X,
  Eye,
  EyeOff,
  Sliders,
  SlidersHorizontal,
  DollarSign,
  TrendingUp,
  CreditCard,
  QrCode,
  Tag,
  Star,
  Layers,
  ChevronRight,
  Info,
  Calendar,
  Clock,
  Shield,
  KeyRound,
  Lock,
  User as UserIcon,
  ShieldCheck,
  RefreshCw,
  Image as ImageIcon,
  Upload,
  Camera,
  Check,
  ExternalLink,
  MoveUp,
  MoveDown,
  Handshake,
  Percent,
  Gift,
  Phone,
  MessageCircle,
  Globe,
  Share2,
  Printer,
  Copy
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { Place, CategoryInfo, SecretTip, PriceLevel, CategoryId, PartnerLevel, PlaceImage, Partner, PartnershipLevel, Modality, Topic, Neighborhood } from '../../types/place';
import { Itinerary } from '../../types/itinerary';
import { User } from '../../types/user';
import { AdminMetrics, SystemLog } from '../../types/admin';
import { Affiliate, AffiliateSale } from '../../types/affiliate';
import { adminService, PartnerStat, QrChannel } from '../../services/adminService';
import { authService } from '../../services/authService';
import { paymentService } from '../../services/paymentService';
import { compressImageFile, isValidImageUrl, reorderArray } from '../../utils/imageUtils';

interface AdminPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout?: () => void;
  allPlaces: Place[];
  onPlacesUpdated: () => void;
  isStandalone?: boolean;
}

type AdminTab = 
  | 'places'
  | 'photos'
  | 'partners'
  | 'neighborhoods'
  | 'topics'
  | 'categories'
  | 'qrcodes'
  | 'tips'
  | 'itineraries'
  | 'users'
  | 'affiliates'
  | 'metrics'
  | 'logs'
  | 'security';

const ADMIN_CREDENTIALS_KEY = 'jampa_admin_master_credentials';
const DEFAULT_CREDENTIALS = {
  username: 'admin@jampaexperience.com.br',
  password: 'Jampa@Admin2026!'
};

export const AdminPanelModal: React.FC<AdminPanelModalProps> = ({
  isOpen,
  onClose,
  onLogout,
  allPlaces,
  onPlacesUpdated,
  isStandalone = true
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('places');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Estados de dados
  const [metrics, setMetrics] = useState<AdminMetrics>(() => adminService.getMetrics());
  const [systemLogs, setSystemLogs] = useState<SystemLog[]>(() => adminService.getSystemLogs());
  const [registeredUsers, setRegisteredUsers] = useState<User[]>(() => authService.getRegisteredUsers());
  const [categories, setCategories] = useState<CategoryInfo[]>(() => adminService.getCategories());
  const [neighborhoods, setNeighborhoods] = useState<Neighborhood[]>(() => adminService.getNeighborhoods());
  const [topics, setTopics] = useState<Topic[]>(() => adminService.getTopics());
  const [modalities, setModalities] = useState<Modality[]>(() => adminService.getModalities());
  const [partners, setPartners] = useState<Partner[]>(() => adminService.getPartners());
  const [itineraries, setItineraries] = useState<Itinerary[]>(() => adminService.getItineraries());
  const [partnerStats, setPartnerStats] = useState<PartnerStat[]>(() => adminService.getPartnerStats());
  const [qrChannels, setQrChannels] = useState<QrChannel[]>(() => adminService.getQrChannels());
  const [affiliates, setAffiliates] = useState<Affiliate[]>(() => adminService.getAffiliates());
  const [affiliateSales, setAffiliateSales] = useState<AffiliateSale[]>(() => adminService.getAffiliateSales());

  // Busca e Filtros
  const [placeSearch, setPlaceSearch] = useState('');
  const [placeCatFilter, setPlaceCatFilter] = useState<string>('all');
  const [userSearch, setUserSearch] = useState('');
  const [partnerSearch, setPartnerSearch] = useState('');
  const [partnerPlaceFilter, setPartnerPlaceFilter] = useState('all');
  const [affiliateSearch, setAffiliateSearch] = useState('');

  // Estados de Afiliados
  const [isAffiliateModalOpen, setIsAffiliateModalOpen] = useState(false);
  const [editingAffiliate, setEditingAffiliate] = useState<Partial<Affiliate> | null>(null);
  const [selectedAffiliateForQr, setSelectedAffiliateForQr] = useState<Affiliate | null>(null);
  const [selectedAffiliateForPayout, setSelectedAffiliateForPayout] = useState<Affiliate | null>(null);
  const [payoutAmountInput, setPayoutAmountInput] = useState<string>('');

  // Estados de Hub de Distribuição Física / Canais QR Code
  const [isQrChannelModalOpen, setIsQrChannelModalOpen] = useState(false);
  const [editingQrChannel, setEditingQrChannel] = useState<Partial<QrChannel> | null>(null);
  const [selectedQrChannelForDisplay, setSelectedQrChannelForDisplay] = useState<QrChannel | null>(null);
  const [qrFormName, setQrFormName] = useState('');
  const [qrFormCategory, setQrFormCategory] = useState('Hotelaria & Hospedagem');
  const [qrFormSourceCode, setQrFormSourceCode] = useState('');

  // Estado de Bairros & Dicas
  const [isNeighborhoodModalOpen, setIsNeighborhoodModalOpen] = useState(false);
  const [editingNeighborhood, setEditingNeighborhood] = useState<Partial<Neighborhood> | null>(null);
  const [newNeighborhoodTipInput, setNewNeighborhoodTipInput] = useState('');

  // Estado de Tópicos & Seções
  const [isTopicModalOpen, setIsTopicModalOpen] = useState(false);
  const [editingTopic, setEditingTopic] = useState<Partial<Topic> | null>(null);

  // Estado do Editor de Local
  const [isEditingPlace, setIsEditingPlace] = useState(false);
  const [editingPlace, setEditingPlace] = useState<Partial<Place>>({});
  const [newGalleryUrlInput, setNewGalleryUrlInput] = useState('');
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  // Estado do Modal de Cadastro / Edição de Parceiro
  const [isPartnerModalOpen, setIsPartnerModalOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState<Partial<Partner> | null>(null);
  const [partnerFormPlaceId, setPartnerFormPlaceId] = useState<string>('');
  const [partnerFormName, setPartnerFormName] = useState<string>('');
  const [partnerFormDesc, setPartnerFormDesc] = useState<string>('');
  const [partnerFormAddress, setPartnerFormAddress] = useState<string>('');
  const [partnerFormMapsUrl, setPartnerFormMapsUrl] = useState<string>('');
  const [partnerFormBenefit, setPartnerFormBenefit] = useState<string>('');
  const [partnerFormLevel, setPartnerFormLevel] = useState<PartnershipLevel>('Diamante');
  const [partnerFormCoupon, setPartnerFormCoupon] = useState<string>('');
  const [partnerFormInstructions, setPartnerFormInstructions] = useState<string>('');
  const [partnerFormWhatsapp, setPartnerFormWhatsapp] = useState<string>('');
  const [partnerFormInstagram, setPartnerFormInstagram] = useState<string>('');
  const [partnerFormPhone, setPartnerFormPhone] = useState<string>('');
  const [partnerFormWebsite, setPartnerFormWebsite] = useState<string>('');

  // Estado da Aba de Gestão de Fotos
  const [selectedPlaceForPhotos, setSelectedPlaceForPhotos] = useState<Place | null>(null);
  const [photoTabUrlInput, setPhotoTabUrlInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const formFileInputRef = useRef<HTMLInputElement | null>(null);

  // Estado do Editor de Modalidades (Tipo de Estabelecimento)
  const [isEditingModality, setIsEditingModality] = useState(false);
  const [editingModality, setEditingModality] = useState<Partial<Modality>>({});

  // Estado de Dicas Rápidas na Aba de Dicas
  const [selectedPlaceForTips, setSelectedPlaceForTips] = useState<Place | null>(null);
  const [newTipTitle, setNewTipTitle] = useState('');
  const [newTipDesc, setNewTipDesc] = useState('');
  const [newTipBadge, setNewTipBadge] = useState('Dica dos Nativos');
  const [newTipIsVip, setNewTipIsVip] = useState(true);

  // Estados para nova dica dentro do Formulário de Edição do Local
  const [formTipTitle, setFormTipTitle] = useState('');
  const [formTipBadge, setFormTipBadge] = useState('Dica dos Nativos');
  const [formTipDesc, setFormTipDesc] = useState('');
  const [formTipIsVip, setFormTipIsVip] = useState(true);

  // Estado da Aba de Segurança & Credenciais
  const getStoredAdminCreds = () => {
    const data = localStorage.getItem(ADMIN_CREDENTIALS_KEY);
    if (!data) return DEFAULT_CREDENTIALS;
    try {
      return JSON.parse(data);
    } catch {
      return DEFAULT_CREDENTIALS;
    }
  };

  const [currentAdminUser, setCurrentAdminUser] = useState(getStoredAdminCreds().username);
  const [newAdminUser, setNewAdminUser] = useState(getStoredAdminCreds().username);
  const [currentAdminPassInput, setCurrentAdminPassInput] = useState('');
  const [newAdminPass, setNewAdminPass] = useState('');
  const [newAdminPassConfirm, setNewAdminPassConfirm] = useState('');
  const [showSecurityPass, setShowSecurityPass] = useState(false);

  // Atualização de dados locais
  const syncLocalData = () => {
    setMetrics(adminService.getMetrics());
    setSystemLogs(adminService.getSystemLogs());
    setRegisteredUsers(authService.getRegisteredUsers());
    setCategories(adminService.getCategories());
    setNeighborhoods(adminService.getNeighborhoods());
    setTopics(adminService.getTopics());
    setModalities(adminService.getModalities());
    setPartners(adminService.getPartners());
    setItineraries(adminService.getItineraries());
    setPartnerStats(adminService.getPartnerStats());
    setQrChannels(adminService.getQrChannels());
    setAffiliates(adminService.getAffiliates());
    setAffiliateSales(adminService.getAffiliateSales());
    setCurrentAdminUser(getStoredAdminCreds().username);
  };

  useEffect(() => {
    if (isOpen) {
      syncLocalData();
    }
  }, [isOpen]);

  useEffect(() => {
    if (allPlaces.length > 0) {
      setSelectedPlaceForPhotos((prev) => {
        if (!prev) return allPlaces[0];
        const matching = allPlaces.find((p) => p.id === prev.id);
        return matching || allPlaces[0];
      });

      setSelectedPlaceForTips((prev) => {
        if (!prev) return allPlaces[0];
        const matching = allPlaces.find((p) => p.id === prev.id);
        return matching || allPlaces[0];
      });
    }
  }, [allPlaces]);

  const showNotification = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  /* ======================================================== */
  /* GESTÃO DE PARCEIROS COMERCIAIS (CRUD RELACIONAL 1-TO-N) */
  /* ======================================================== */
  const handleOpenNewPartner = (preselectedPlaceId?: string) => {
    setEditingPartner(null);
    setPartnerFormPlaceId(preselectedPlaceId || (allPlaces.length > 0 ? allPlaces[0].id : ''));
    setPartnerFormName('');
    setPartnerFormDesc('');
    setPartnerFormAddress('');
    setPartnerFormMapsUrl('');
    setPartnerFormBenefit('');
    setPartnerFormLevel('Diamante');
    setPartnerFormCoupon('');
    setPartnerFormInstructions('');
    setPartnerFormWhatsapp('');
    setPartnerFormInstagram('');
    setPartnerFormPhone('');
    setPartnerFormWebsite('');
    setIsPartnerModalOpen(true);
  };

  const handleOpenEditPartner = (partner: Partner) => {
    setEditingPartner(partner);
    setPartnerFormPlaceId(partner.placeId);
    setPartnerFormName(partner.name || '');
    setPartnerFormDesc(partner.description || '');
    setPartnerFormAddress(partner.address || '');
    setPartnerFormMapsUrl(partner.googleMapsUrl || '');
    setPartnerFormBenefit(partner.benefit || '');
    setPartnerFormLevel(partner.partnershipLevel || 'Diamante');
    setPartnerFormCoupon(partner.couponCode || '');
    setPartnerFormInstructions(partner.redemptionInstructions || '');
    setPartnerFormWhatsapp(partner.whatsapp || '');
    setPartnerFormInstagram(partner.instagram || '');
    setPartnerFormPhone(partner.phone || '');
    setPartnerFormWebsite(partner.website || '');
    setIsPartnerModalOpen(true);
  };

  const handleSavePartnerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!partnerFormName.trim() || !partnerFormBenefit.trim()) {
      showNotification('Preencha o nome do parceiro e o benefício ofertado.');
      return;
    }

    const partnerToSave: Partner = {
      id: editingPartner?.id || `partner-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      placeId: partnerFormPlaceId,
      name: partnerFormName.trim(),
      description: partnerFormDesc.trim(),
      address: partnerFormAddress.trim(),
      googleMapsUrl: partnerFormMapsUrl.trim(),
      benefit: partnerFormBenefit.trim(),
      partnershipLevel: partnerFormLevel,
      couponCode: partnerFormCoupon.trim(),
      redemptionInstructions: partnerFormInstructions.trim(),
      whatsapp: partnerFormWhatsapp.trim(),
      instagram: partnerFormInstagram.trim(),
      phone: partnerFormPhone.trim(),
      website: partnerFormWebsite.trim(),
      active: true,
      createdAt: editingPartner?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const saved = adminService.savePartner(partnerToSave);
    setPartners(adminService.getPartners());
    syncLocalData();
    setIsPartnerModalOpen(false);
    showNotification(`✅ Parceiro "${saved.name}" salvo com sucesso!`);
  };

  const handleDeletePartner = (partnerId: string, partnerName: string) => {
    if (window.confirm(`Tem certeza que deseja desvincular e excluir o parceiro "${partnerName}"?`)) {
      adminService.deletePartner(partnerId);
      setPartners(adminService.getPartners());
      syncLocalData();
      showNotification(`🗑️ Parceiro "${partnerName}" excluído.`);
    }
  };

  /* ======================================================== */
  /* GESTÃO DE AFILIADOS */
  /* ======================================================== */
  const [affiliateFormName, setAffiliateFormName] = useState('');
  const [affiliateFormCode, setAffiliateFormCode] = useState('');
  const [affiliateFormPhone, setAffiliateFormPhone] = useState('');
  const [affiliateFormEmail, setAffiliateFormEmail] = useState('');
  const [affiliateFormType, setAffiliateFormType] = useState<'percentage' | 'fixed'>('percentage');
  const [affiliateFormValue, setAffiliateFormValue] = useState<number>(25);
  const [affiliateFormNotes, setAffiliateFormNotes] = useState('');

  const generateAffiliateCodeFromName = (nameStr: string) => {
    const clean = nameStr
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, '')
      .slice(0, 10);
    return clean ? `${clean}${Math.floor(10 + Math.random() * 90)}` : `AF${Math.floor(1000 + Math.random() * 9000)}`;
  };

  const handleOpenNewAffiliate = () => {
    setEditingAffiliate(null);
    setAffiliateFormName('');
    setAffiliateFormCode('');
    setAffiliateFormPhone('');
    setAffiliateFormEmail('');
    setAffiliateFormType('percentage');
    setAffiliateFormValue(25);
    setAffiliateFormNotes('');
    setIsAffiliateModalOpen(true);
  };

  const handleEditAffiliate = (aff: Affiliate) => {
    setEditingAffiliate(aff);
    setAffiliateFormName(aff.name);
    setAffiliateFormCode(aff.code);
    setAffiliateFormPhone(aff.phone || '');
    setAffiliateFormEmail(aff.email || '');
    setAffiliateFormType(aff.commissionType);
    setAffiliateFormValue(aff.commissionValue);
    setAffiliateFormNotes(aff.notes || '');
    setIsAffiliateModalOpen(true);
  };

  const handleSaveAffiliateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!affiliateFormName.trim()) {
      showNotification('Preencha o nome do afiliado.');
      return;
    }

    const code = affiliateFormCode.trim() || generateAffiliateCodeFromName(affiliateFormName);

    const saved = adminService.saveAffiliate({
      id: editingAffiliate?.id,
      name: affiliateFormName.trim(),
      code,
      phone: affiliateFormPhone.trim(),
      email: affiliateFormEmail.trim(),
      commissionType: affiliateFormType,
      commissionValue: Number(affiliateFormValue) || 25,
      notes: affiliateFormNotes.trim(),
      status: editingAffiliate?.status || 'active'
    });

    setAffiliates(adminService.getAffiliates());
    syncLocalData();
    setIsAffiliateModalOpen(false);
    showNotification(`✅ Afiliado "${saved.name}" (${saved.code}) salvo com sucesso!`);
  };

  const handleDeleteAffiliate = (id: string, name: string) => {
    if (window.confirm(`Deseja realmente remover o afiliado "${name}"? Os registros de comissões serão preservados.`)) {
      adminService.deleteAffiliate(id);
      setAffiliates(adminService.getAffiliates());
      syncLocalData();
      showNotification(`🗑️ Afiliado "${name}" removido.`);
    }
  };

  const handleToggleAffiliateStatus = (aff: Affiliate) => {
    const nextStatus = aff.status === 'active' ? 'paused' : 'active';
    adminService.saveAffiliate({
      ...aff,
      status: nextStatus
    });
    setAffiliates(adminService.getAffiliates());
    syncLocalData();
    showNotification(nextStatus === 'active' ? `🟢 Afiliado "${aff.name}" reativado!` : `⏸️ Afiliado "${aff.name}" pausado.`);
  };

  const handleCopyAffiliateLink = (code: string) => {
    const url = `${window.location.origin}/?ref=${code}`;
    navigator.clipboard.writeText(url);
    showNotification(`📋 Link do afiliado copiado: ${url}`);
  };

  const handleOpenPayoutModal = (aff: Affiliate) => {
    setSelectedAffiliateForPayout(aff);
    const pending = aff.totalCommission - aff.paidCommission;
    setPayoutAmountInput(pending > 0 ? pending.toFixed(2) : '0.00');
  };

  const handleConfirmPayoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAffiliateForPayout) return;
    const amount = parseFloat(payoutAmountInput);
    if (isNaN(amount) || amount <= 0) {
      showNotification('Informe um valor de repasse válido.');
      return;
    }

    adminService.payAffiliateCommission(selectedAffiliateForPayout.id, amount);
    setAffiliates(adminService.getAffiliates());
    syncLocalData();
    setSelectedAffiliateForPayout(null);
    showNotification(`💸 Pagamento de R$ ${amount.toFixed(2)} registrado para ${selectedAffiliateForPayout.name}!`);
  };

  /* ======================================================== */
  /* OPERAÇÕES DE CANAIS / PONTOS DE DISTRIBUIÇÃO QR CODE */
  /* ======================================================== */
  const handleOpenNewQrChannel = () => {
    setEditingQrChannel(null);
    setQrFormName('');
    setQrFormCategory('Hotelaria & Hospedagem');
    setQrFormSourceCode('');
    setIsQrChannelModalOpen(true);
  };

  const handleEditQrChannel = (ch: QrChannel) => {
    setEditingQrChannel(ch);
    setQrFormName(ch.name);
    setQrFormCategory(ch.locationCategory);
    setQrFormSourceCode(ch.sourceCode);
    setIsQrChannelModalOpen(true);
  };

  const handleSaveQrChannelSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!qrFormName.trim()) {
      showNotification('Preencha o nome do local ou ponto.');
      return;
    }

    const saved = adminService.saveQrChannel({
      id: editingQrChannel?.id,
      name: qrFormName.trim(),
      locationCategory: qrFormCategory.trim() || 'Geral',
      sourceCode: qrFormSourceCode.trim() || qrFormName.trim(),
      scanCount: editingQrChannel?.scanCount || 0,
      conversionCount: editingQrChannel?.conversionCount || 0
    });

    setQrChannels(adminService.getQrChannels());
    syncLocalData();
    setIsQrChannelModalOpen(false);
    showNotification(`✅ Ponto "${saved.name}" salvo com sucesso!`);
  };

  const handleDeleteQrChannel = (id: string, name: string) => {
    if (window.confirm(`Deseja realmente excluir o ponto "${name}"?`)) {
      adminService.deleteQrChannel(id);
      setQrChannels(adminService.getQrChannels());
      syncLocalData();
      showNotification(`🗑️ Ponto "${name}" excluído.`);
    }
  };

  const handleCopyQrChannelLink = (targetUrl: string) => {
    navigator.clipboard.writeText(targetUrl);
    showNotification(`📋 Link copiado: ${targetUrl}`);
  };

  /* ======================================================== */
  /* OPERAÇÕES DE LOCAIS (CRUD COMPLETO COM SUPABASE/STORAGE) */
  /* ======================================================== */
  const handleOpenNewPlace = () => {
    const firstCat = categories[0] || { id: 'praias' as CategoryId, label: 'Praias' };
    const defaultCover = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80';
    setEditingPlace({
      id: 'place-custom-' + Date.now(),
      name: '',
      slogan: '',
      categoryId: firstCat.id as CategoryId,
      categoryLabel: firstCat.label,
      modalityName: 'Praias',
      topicIds: ['praias'],
      rating: 5.0,
      reviewCount: 1,
      featuredImage: defaultCover,
      gallery: [defaultCover],
      publicTeaser: '',
      fullDescription: '',
      priceLevel: 'moderado',
      tags: ['Destaque'],
      coordinates: { lat: -7.115, lng: -34.825 },
      address: 'João Pessoa - PB',
      amenities: { parking: true, accessibility: true, familyFriendly: true, petFriendly: true, cardPayment: true, pixPayment: true },
      tips: [{ title: 'Dica Especial', description: 'Visite no início da manhã ou no entardecer.', badge: 'Dica VIP', isPremiumOnly: true }],
      reviews: [],
      isPartner: false,
      partnerLevel: 'standard',
      partnerActive: true,
      partnerBenefit: '10% de desconto para membros Jampa Experience',
      partnerCouponCode: 'JAMPA10'
    });
    setIsEditingPlace(true);
  };

  const handleEditPlace = (place: Place) => {
    const normalized = adminService.normalizePlaceModel(adminService.normalizePlacePhotos(place));
    let modalityName = normalized.modalityName;
    if (
      !modalityName ||
      modalityName === 'Acesso Livre / Gratuito' ||
      modalityName === 'Experiência Paga' ||
      modalityName === 'Reserva Prévia Obrigatória' ||
      modalityName === 'Praia / Orla'
    ) {
      if (normalized.categoryId === 'praias' || normalized.id.includes('praia')) {
        modalityName = 'Praias';
      } else if (normalized.categoryLabel && normalized.categoryLabel !== 'Praias & Enseadas') {
        modalityName = normalized.categoryLabel;
      } else {
        modalityName = 'Praias';
      }
    }
    setEditingPlace({ ...normalized, modalityName });
    setIsEditingPlace(true);
  };

  const handleTogglePlaceTopic = (topicId: string) => {
    const current = editingPlace.topicIds || [];
    if (current.includes(topicId)) {
      setEditingPlace({ ...editingPlace, topicIds: current.filter((t) => t !== topicId) });
    } else {
      setEditingPlace({ ...editingPlace, topicIds: [...current, topicId] });
    }
  };

  const handleSavePlace = (e?: React.FormEvent) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!editingPlace.name || !editingPlace.neighborhood) {
      showNotification('Preencha o nome e o bairro do local.');
      return;
    }

    try {
      const catObj = categories.find((c) => c.id === editingPlace.categoryId);
      let gallery = editingPlace.gallery && editingPlace.gallery.length > 0
        ? [...editingPlace.gallery]
        : ['https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80'];

      let mainCover = editingPlace.featuredImage || gallery[0];
      if (!gallery.includes(mainCover)) {
        gallery = [mainCover, ...gallery];
      }

      const lat = typeof editingPlace.coordinates?.lat === 'number' && !isNaN(editingPlace.coordinates.lat)
        ? editingPlace.coordinates.lat
        : -7.115;
      const lng = typeof editingPlace.coordinates?.lng === 'number' && !isNaN(editingPlace.coordinates.lng)
        ? editingPlace.coordinates.lng
        : -34.825;

      const neighLower = (editingPlace.neighborhood || '').toLowerCase();
      const targetNeighObj = neighborhoods.find(
        (n) =>
          n.id === editingPlace.neighborhoodId ||
          n.slug === editingPlace.neighborhoodId ||
          (neighLower && n.name.toLowerCase() === neighLower) ||
          (neighLower && neighLower.includes(n.slug))
      );
      const neighId = editingPlace.neighborhoodId || (targetNeighObj ? targetNeighObj.slug || targetNeighObj.id : undefined);

      const placeToSave: Place = {
        id: editingPlace.id || 'place-custom-' + Date.now(),
        name: editingPlace.name.trim(),
        slogan: editingPlace.slogan ? editingPlace.slogan.trim() : '',
        categoryId: (editingPlace.categoryId || 'praias') as CategoryId,
        categoryLabel: catObj ? catObj.label : 'Praias & Enseadas',
        neighborhood: editingPlace.neighborhood.trim(),
        neighborhoodId: neighId,
        modalityName: editingPlace.modalityName,
        topicIds: editingPlace.topicIds && editingPlace.topicIds.length > 0 ? editingPlace.topicIds : undefined,
        rating: typeof editingPlace.rating === 'number' && !isNaN(editingPlace.rating) ? editingPlace.rating : 5.0,
        reviewCount: typeof editingPlace.reviewCount === 'number' && !isNaN(editingPlace.reviewCount) ? editingPlace.reviewCount : 1,
        featuredImage: mainCover,
        gallery,
        publicTeaser: editingPlace.publicTeaser || editingPlace.slogan || `Experiência selecionada em ${editingPlace.neighborhood}.`,
        fullDescription: editingPlace.fullDescription || '',
        priceLevel: (editingPlace.priceLevel || 'moderado') as PriceLevel,
        tags: Array.isArray(editingPlace.tags) && editingPlace.tags.length > 0 ? editingPlace.tags : ['Destaque'],
        coordinates: { lat, lng },
        address: editingPlace.address || `${editingPlace.neighborhood}, João Pessoa - PB`,
        phone: editingPlace.phone || '',
        whatsapp: editingPlace.whatsapp || '',
        instagram: editingPlace.instagram || '',
        facebook: editingPlace.facebook || '',
        website: editingPlace.website || '',
        googleMapsUrl: editingPlace.googleMapsUrl || `https://maps.google.com/?q=${lat},${lng}`,
        isPartner: Boolean(editingPlace.isPartner),
        partnerLevel: (editingPlace.partnerLevel || 'standard') as PartnerLevel,
        partnerBenefit: editingPlace.partnerBenefit || '',
        partnerDescription: editingPlace.partnerDescription || '',
        partnerCouponCode: editingPlace.partnerCouponCode || '',
        partnerActive: editingPlace.partnerActive ?? true,
        amenities: editingPlace.amenities || { parking: true, accessibility: true, familyFriendly: true, petFriendly: true, cardPayment: true, pixPayment: true },
        tips: Array.isArray(editingPlace.tips) && editingPlace.tips.length > 0 ? editingPlace.tips : [{ title: 'Dica dos Nativos', description: 'Visite no início da manhã.', isPremiumOnly: true }],
        reviews: Array.isArray(editingPlace.reviews) ? editingPlace.reviews : []
      };

      adminService.savePlace(placeToSave);
      setIsEditingPlace(false);
      onPlacesUpdated();
      syncLocalData();
      showNotification(`✅ Local "${placeToSave.name}" e Foto de Capa salvos com sucesso!`);
    } catch (err: any) {
      console.error('Falha ao salvar local:', err);
      showNotification(`❌ Não foi possível salvar: ${err?.message || 'Verifique os dados informados.'}`);
    }
  };

  const handleDeletePlace = (placeId: string, placeName: string) => {
    if (window.confirm(`Tem certeza que deseja excluir o local "${placeName}" do catálogo?`)) {
      adminService.deletePlace(placeId);
      onPlacesUpdated();
      syncLocalData();
      showNotification(`🗑️ Local "${placeName}" excluído.`);
    }
  };

  /* ======================================================== */
  /* OPERAÇÕES DE BAIRROS & DICAS TEXTUAIS */
  /* ======================================================== */
  const handleOpenNewNeighborhood = () => {
    setEditingNeighborhood({
      id: '',
      slug: '',
      name: '',
      description: '',
      coverImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
      tips: []
    });
    setNewNeighborhoodTipInput('');
    setIsNeighborhoodModalOpen(true);
  };

  const handleEditNeighborhood = (neigh: Neighborhood) => {
    setEditingNeighborhood({ ...neigh, tips: [...(neigh.tips || [])] });
    setNewNeighborhoodTipInput('');
    setIsNeighborhoodModalOpen(true);
  };

  const handleSaveNeighborhood = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingNeighborhood?.name) {
      showNotification('Digite o nome do bairro.');
      return;
    }

    const slug =
      editingNeighborhood.slug ||
      editingNeighborhood.name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/\s+/g, '-');

    const neighToSave: Neighborhood = {
      id: editingNeighborhood.id || slug,
      slug,
      name: editingNeighborhood.name,
      description: editingNeighborhood.description || '',
      coverImage:
        editingNeighborhood.coverImage ||
        'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
      tips: Array.isArray(editingNeighborhood.tips) ? editingNeighborhood.tips : []
    };

    adminService.saveNeighborhood(neighToSave);
    setIsNeighborhoodModalOpen(false);
    onPlacesUpdated();
    syncLocalData();
    showNotification(`🏙️ Bairro "${neighToSave.name}" salvo com sucesso!`);
  };

  const handleDeleteNeighborhood = (neighId: string, neighName: string) => {
    if (window.confirm(`Excluir o bairro "${neighName}" e suas dicas?`)) {
      adminService.deleteNeighborhood(neighId);
      onPlacesUpdated();
      syncLocalData();
      showNotification(`🗑️ Bairro "${neighName}" excluído.`);
    }
  };

  const handleAddTipToEditingNeighborhood = () => {
    if (!newNeighborhoodTipInput.trim() || !editingNeighborhood) return;
    const currentTips = editingNeighborhood.tips ? [...editingNeighborhood.tips] : [];
    currentTips.push(newNeighborhoodTipInput.trim());
    setEditingNeighborhood({ ...editingNeighborhood, tips: currentTips });
    setNewNeighborhoodTipInput('');
  };

  const handleRemoveTipFromEditingNeighborhood = (index: number) => {
    if (!editingNeighborhood?.tips) return;
    const updated = editingNeighborhood.tips.filter((_, i) => i !== index);
    setEditingNeighborhood({ ...editingNeighborhood, tips: updated });
  };

  /* ======================================================== */
  /* OPERAÇÕES DE TÓPICOS DINÂMICOS */
  /* ======================================================== */
  const handleOpenNewTopic = () => {
    setEditingTopic({
      id: '',
      slug: '',
      name: '',
      description: '',
      iconName: 'Compass',
      accentColor: '#00B4D8',
      position: topics.length + 1
    });
    setIsTopicModalOpen(true);
  };

  const handleEditTopic = (topic: Topic) => {
    setEditingTopic({ ...topic });
    setIsTopicModalOpen(true);
  };

  const handleSaveTopic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTopic?.name) {
      showNotification('Digite o nome do tópico.');
      return;
    }

    const slug =
      editingTopic.slug ||
      editingTopic.name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/\s+/g, '-');

    const topicToSave: Topic = {
      id: editingTopic.id || slug,
      slug,
      name: editingTopic.name,
      description: editingTopic.description || '',
      iconName: editingTopic.iconName || 'Compass',
      accentColor: editingTopic.accentColor || '#00B4D8',
      position: typeof editingTopic.position === 'number' ? editingTopic.position : topics.length + 1
    };

    adminService.saveTopic(topicToSave);
    setIsTopicModalOpen(false);
    onPlacesUpdated();
    syncLocalData();
    showNotification(`🗂️ Tópico "${topicToSave.name}" salvo com sucesso!`);
  };

  const handleDeleteTopic = (topicId: string, topicName: string) => {
    if (
      window.confirm(
        `Excluir o tópico "${topicName}"? Locais cadastrados não serão apagados, apenas desassociados desta seção.`
      )
    ) {
      adminService.deleteTopic(topicId);
      onPlacesUpdated();
      syncLocalData();
      showNotification(`🗑️ Tópico "${topicName}" excluído.`);
    }
  };

  const handleMoveTopicPosition = (topicIndex: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? topicIndex - 1 : topicIndex + 1;
    if (targetIndex < 0 || targetIndex >= topics.length) return;

    const reordered = reorderArray(
      topics.map((t) => t.id),
      topicIndex,
      targetIndex
    );
    adminService.reorderTopics(reordered);
    onPlacesUpdated();
    syncLocalData();
    showNotification('Ordem das seções atualizada!');
  };

  /* ======================================================== */
  /* GESTÃO DE FOTOS DENTRO DO FORMULÁRIO (ORDENAÇÃO E CAPA) */
  /* ======================================================== */
  const handleAddPhotoToEditingPlace = (url: string) => {
    if (!url.trim()) return;
    const currentGallery = editingPlace.gallery ? [...editingPlace.gallery] : [];
    if (!currentGallery.includes(url.trim())) {
      currentGallery.push(url.trim());
      setEditingPlace({
        ...editingPlace,
        gallery: currentGallery,
        featuredImage: editingPlace.featuredImage || url.trim()
      });
      setNewGalleryUrlInput('');
      showNotification('📷 Foto adicionada à galeria!');
    }
  };

  const handleRemovePhotoFromEditingPlace = (indexToRemove: number) => {
    const currentGallery = editingPlace.gallery ? [...editingPlace.gallery] : [];
    if (currentGallery.length <= 1) {
      showNotification('O local deve conter pelo menos 1 foto.');
      return;
    }
    const removedUrl = currentGallery[indexToRemove];
    const updatedGallery = currentGallery.filter((_, idx) => idx !== indexToRemove);

    let updatedFeatured = editingPlace.featuredImage;
    if (updatedFeatured === removedUrl) {
      updatedFeatured = updatedGallery[0];
    }

    setEditingPlace({
      ...editingPlace,
      gallery: updatedGallery,
      featuredImage: updatedFeatured
    });
    showNotification('Foto removida.');
  };

  const handleMovePhotoOrderInForm = (currentIndex: number, direction: 'up' | 'down') => {
    const currentGallery = editingPlace.gallery ? [...editingPlace.gallery] : [];
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;

    if (targetIndex < 0 || targetIndex >= currentGallery.length) return;

    const reordered = reorderArray(currentGallery, currentIndex, targetIndex);
    setEditingPlace({
      ...editingPlace,
      gallery: reordered
    });
    showNotification('Ordem da foto atualizada.');
  };

  const handleSetFeaturedPhotoInForm = (url: string) => {
    const gallery = editingPlace.gallery ? [...editingPlace.gallery] : [];
    if (!gallery.includes(url)) {
      gallery.unshift(url);
    }
    setEditingPlace({
      ...editingPlace,
      gallery,
      featuredImage: url
    });
    showNotification('⭐ Foto definida como Capa Principal! Lembre-se de clicar em SALVAR.');
  };

  const handleFileUploadInForm = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploadingPhoto(true);
    try {
      for (const file of Array.from(files)) {
        const compressedBase64 = await compressImageFile(file);
        handleAddPhotoToEditingPlace(compressedBase64);
      }
    } catch (err) {
      console.error('Erro ao processar imagem:', err);
      showNotification('Erro ao processar arquivo de imagem.');
    } finally {
      setIsUploadingPhoto(false);
      if (formFileInputRef.current) formFileInputRef.current.value = '';
    }
  };

  /* ======================================================== */
  /* GESTÃO DE FOTOS NA ABA DEDICADA "FOTOS & GALERIA" */
  /* ======================================================== */
  const handleAddPhotoToSelectedPlace = (url: string) => {
    if (!selectedPlaceForPhotos || !url.trim()) return;
    const currentGallery = selectedPlaceForPhotos.gallery ? [...selectedPlaceForPhotos.gallery] : [];
    if (!currentGallery.includes(url.trim())) {
      currentGallery.push(url.trim());
      const updatedPlace: Place = {
        ...selectedPlaceForPhotos,
        gallery: currentGallery,
        featuredImage: selectedPlaceForPhotos.featuredImage || url.trim()
      };
      adminService.savePlace(updatedPlace);
      setSelectedPlaceForPhotos(adminService.normalizePlacePhotos(updatedPlace));
      setPhotoTabUrlInput('');
      onPlacesUpdated();
      syncLocalData();
      showNotification(`📷 Nova foto adicionada a "${selectedPlaceForPhotos.name}"!`);
    }
  };

  const handleRemovePhotoFromSelectedPlace = (indexToRemove: number) => {
    if (!selectedPlaceForPhotos) return;
    const currentGallery = selectedPlaceForPhotos.gallery ? [...selectedPlaceForPhotos.gallery] : [];
    if (currentGallery.length <= 1) {
      showNotification('O local precisa de pelo menos 1 foto.');
      return;
    }
    const removedUrl = currentGallery[indexToRemove];
    const updatedGallery = currentGallery.filter((_, idx) => idx !== indexToRemove);

    let updatedFeatured = selectedPlaceForPhotos.featuredImage;
    if (updatedFeatured === removedUrl) {
      updatedFeatured = updatedGallery[0];
    }

    const updatedPlace: Place = {
      ...selectedPlaceForPhotos,
      gallery: updatedGallery,
      featuredImage: updatedFeatured
    };

    adminService.savePlace(updatedPlace);
    setSelectedPlaceForPhotos(adminService.normalizePlacePhotos(updatedPlace));
    onPlacesUpdated();
    syncLocalData();
    showNotification('Foto excluída com sucesso.');
  };

  const handleMovePhotoOrderInTab = (currentIndex: number, direction: 'up' | 'down') => {
    if (!selectedPlaceForPhotos) return;
    const currentGallery = selectedPlaceForPhotos.gallery ? [...selectedPlaceForPhotos.gallery] : [];
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;

    if (targetIndex < 0 || targetIndex >= currentGallery.length) return;

    const reordered = reorderArray(currentGallery, currentIndex, targetIndex);
    const updatedPlace: Place = {
      ...selectedPlaceForPhotos,
      gallery: reordered
    };
    adminService.savePlace(updatedPlace);
    setSelectedPlaceForPhotos(adminService.normalizePlacePhotos(updatedPlace));
    onPlacesUpdated();
    syncLocalData();
    showNotification('Ordem das fotos atualizada!');
  };

  const handleSetFeaturedPhotoInTab = (url: string) => {
    if (!selectedPlaceForPhotos) return;
    const gallery = selectedPlaceForPhotos.gallery ? [...selectedPlaceForPhotos.gallery] : [];
    if (!gallery.includes(url)) {
      gallery.unshift(url);
    }
    const updatedPlace: Place = {
      ...selectedPlaceForPhotos,
      gallery,
      featuredImage: url
    };
    adminService.savePlace(updatedPlace);
    setSelectedPlaceForPhotos(adminService.normalizePlacePhotos(updatedPlace));
    onPlacesUpdated();
    syncLocalData();
    showNotification(`⭐ Foto de Capa salva com sucesso para "${selectedPlaceForPhotos.name}"!`);
  };

  const handleSavePhotosTab = () => {
    if (!selectedPlaceForPhotos) return;
    adminService.savePlace(selectedPlaceForPhotos);
    setSelectedPlaceForPhotos(adminService.normalizePlacePhotos(selectedPlaceForPhotos));
    onPlacesUpdated();
    syncLocalData();
    showNotification(`✅ Fotos e Capa de "${selectedPlaceForPhotos.name}" salvas com sucesso!`);
  };

  const handleFileUploadInTab = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !selectedPlaceForPhotos) return;

    setIsUploadingPhoto(true);
    try {
      for (const file of Array.from(files)) {
        const compressedBase64 = await compressImageFile(file);
        handleAddPhotoToSelectedPlace(compressedBase64);
      }
    } catch (err) {
      console.error('Erro no upload de foto:', err);
      showNotification('Erro ao comprimir e enviar foto.');
    } finally {
      setIsUploadingPhoto(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  /* ======================================================== */
  /* OPERAÇÕES DE MODALIDADES (TIPO DE ESTABELECIMENTO) */
  /* ======================================================== */
  const handleOpenNewModality = () => {
    setEditingModality({
      id: '',
      name: '',
      slug: '',
      description: ''
    });
    setIsEditingModality(true);
  };

  const handleEditModality = (mod: Modality) => {
    setEditingModality({ ...mod });
    setIsEditingModality(true);
  };

  const handleSaveModality = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingModality?.name) {
      showNotification('Digite o nome da modalidade.');
      return;
    }

    const slug =
      editingModality.slug ||
      editingModality.name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/\s+/g, '-');

    const modToSave: Modality = {
      id: editingModality.id || `mod-${slug}`,
      name: editingModality.name.trim(),
      slug,
      description: editingModality.description || ''
    };

    adminService.saveModality(modToSave);
    setIsEditingModality(false);
    onPlacesUpdated();
    syncLocalData();
    showNotification(`✅ Modalidade "${modToSave.name}" salva com sucesso!`);
  };

  const handleDeleteModality = (modId: string, modName: string) => {
    if (window.confirm(`Excluir a modalidade "${modName}"?`)) {
      adminService.deleteModality(modId);
      onPlacesUpdated();
      syncLocalData();
      showNotification(`🗑️ Modalidade "${modName}" excluída.`);
    }
  };

  /* ======================================================== */
  /* OPERAÇÕES DE DICAS SECRETAS */
  /* ======================================================== */
  const handleAddQuickTip = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlaceForTips || !newTipTitle.trim() || !newTipDesc.trim()) {
      showNotification('Selecione um local e preencha título e descrição da dica.');
      return;
    }

    const tip: SecretTip = {
      title: newTipTitle.trim(),
      description: newTipDesc.trim(),
      badge: newTipBadge.trim(),
      isPremiumOnly: newTipIsVip
    };

    adminService.addTipToPlace(selectedPlaceForTips.id, tip);
    setNewTipTitle('');
    setNewTipDesc('');
    onPlacesUpdated();
    syncLocalData();

    const updated = adminService.getAllPlaces().find((p) => p.id === selectedPlaceForTips.id);
    if (updated) setSelectedPlaceForTips(updated);

    showNotification(`💡 Dica adicionada a "${selectedPlaceForTips.name}"!`);
  };

  const handleDeleteQuickTip = (placeId: string, tipIndex: number) => {
    if (window.confirm('Excluir esta dica secreta?')) {
      adminService.deleteTipFromPlace(placeId, tipIndex);
      onPlacesUpdated();
      syncLocalData();
      const updated = adminService.getAllPlaces().find((p) => p.id === placeId);
      if (updated) setSelectedPlaceForTips(updated);
      showNotification('Dica excluída.');
    }
  };

  /* OPERAÇÕES DE DICAS DENTRO DO FORMULÁRIO DO LOCAL */
  const handleAddTipInPlaceForm = (e?: React.FormEvent) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!formTipTitle.trim() || !formTipDesc.trim()) {
      showNotification('Preencha o título e a descrição da dica.');
      return;
    }
    const newTip: SecretTip = {
      title: formTipTitle.trim(),
      badge: formTipBadge.trim() || 'Dica dos Nativos',
      description: formTipDesc.trim(),
      isPremiumOnly: formTipIsVip
    };
    const currentTips = editingPlace.tips ? [...editingPlace.tips] : [];
    currentTips.push(newTip);
    setEditingPlace({
      ...editingPlace,
      tips: currentTips
    });
    setFormTipTitle('');
    setFormTipDesc('');
    setFormTipBadge('Dica dos Nativos');
    showNotification('✨ Dica secreta adicionada à lista deste local!');
  };

  const handleRemoveTipInPlaceForm = (tipIndex: number) => {
    const currentTips = editingPlace.tips ? [...editingPlace.tips] : [];
    const updated = currentTips.filter((_, idx) => idx !== tipIndex);
    setEditingPlace({
      ...editingPlace,
      tips: updated
    });
    showNotification('Dica removida deste local.');
  };

  /* ======================================================== */
  /* OPERAÇÕES DE USUÁRIOS */
  /* ======================================================== */
  const handleGrantUser = (userId: string, userName: string) => {
    adminService.manualGrantUser(userId);
    onPlacesUpdated();
    syncLocalData();
    showNotification(`👑 Acesso Vitalício concedido a ${userName}!`);
  };

  const handleRevokeUser = (userId: string, userName: string) => {
    if (window.confirm(`Deseja revogar o acesso vitalício de ${userName}?`)) {
      adminService.manualRevokeUser(userId);
      onPlacesUpdated();
      syncLocalData();
      showNotification(`Acesso vitalício de ${userName} revogado.`);
    }
  };

  /* ======================================================== */
  /* ALTERAÇÃO DE LOGIN E SENHA DO ADMINISTRADOR */
  /* ======================================================== */
  const handleUpdateAdminCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    const stored = getStoredAdminCreds();

    if (currentAdminPassInput.trim() !== stored.password) {
      showNotification('❌ Senha atual incorreta. Digite sua senha atual para autorizar a alteração.');
      return;
    }

    if (!newAdminUser.trim()) {
      showNotification('Digite o novo usuário / e-mail.');
      return;
    }

    if (newAdminPass && newAdminPass.length < 6) {
      showNotification('A nova senha deve ter pelo menos 6 caracteres.');
      return;
    }

    if (newAdminPass && newAdminPass !== newAdminPassConfirm) {
      showNotification('A confirmação da nova senha não confere.');
      return;
    }

    const updatedPass = newAdminPass.trim() ? newAdminPass.trim() : stored.password;
    const updatedCreds = {
      username: newAdminUser.trim(),
      password: updatedPass
    };

    localStorage.setItem(ADMIN_CREDENTIALS_KEY, JSON.stringify(updatedCreds));
    setCurrentAdminUser(updatedCreds.username);
    setCurrentAdminPassInput('');
    setNewAdminPass('');
    setNewAdminPassConfirm('');

    adminService.addLog({
      type: 'user_granted',
      title: 'Credenciais de Administrador Atualizadas',
      details: `Novo usuário: ${updatedCreds.username}.`
    });

    showNotification('🔒 Credenciais do Administrador atualizadas com sucesso!');
  };

  const handleResetToDefaultCreds = () => {
    if (window.confirm('Deseja restaurar as credenciais padrão do administrador?')) {
      localStorage.setItem(ADMIN_CREDENTIALS_KEY, JSON.stringify(DEFAULT_CREDENTIALS));
      setCurrentAdminUser(DEFAULT_CREDENTIALS.username);
      setNewAdminUser(DEFAULT_CREDENTIALS.username);
      setCurrentAdminPassInput('');
      setNewAdminPass('');
      setNewAdminPassConfirm('');
      showNotification('Credenciais padrão restauradas: admin / Jampa@Admin2026!');
    }
  };

  // Filtros de Locais
  const filteredPlaces = useMemo(() => {
    return allPlaces.filter((place) => {
      const matchSearch =
        placeSearch === '' ||
        place.name.toLowerCase().includes(placeSearch.toLowerCase()) ||
        place.neighborhood.toLowerCase().includes(placeSearch.toLowerCase());
      const matchCat = placeCatFilter === 'all' || place.categoryId === placeCatFilter;
      return matchSearch && matchCat;
    });
  }, [allPlaces, placeSearch, placeCatFilter]);

  // Filtros de Usuários
  const filteredUsers = useMemo(() => {
    return registeredUsers.filter((u) => {
      const q = userSearch.toLowerCase();
      return (
        userSearch === '' ||
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        (u.phone && u.phone.toLowerCase().includes(q))
      );
    });
  }, [registeredUsers, userSearch]);

  // Filtros de Afiliados
  const filteredAffiliates = useMemo(() => {
    return affiliates.filter((a) => {
      const q = affiliateSearch.toLowerCase();
      return (
        affiliateSearch === '' ||
        a.name.toLowerCase().includes(q) ||
        a.code.toLowerCase().includes(q) ||
        (a.phone && a.phone.toLowerCase().includes(q)) ||
        (a.email && a.email.toLowerCase().includes(q))
      );
    });
  }, [affiliates, affiliateSearch]);

  if (!isOpen) return null;

  const tabsList: { id: AdminTab; label: string; icon: React.ReactNode; badge?: number | string }[] = [
    { id: 'places', label: 'Locais & Atrações', icon: <MapPin size={17} />, badge: allPlaces.length },
    { id: 'neighborhoods', label: 'Bairros & Dicas', icon: <MapPin size={17} />, badge: neighborhoods.length },
    { id: 'topics', label: 'Tópicos & Seções', icon: <SlidersHorizontal size={17} />, badge: topics.length },
    { id: 'photos', label: 'Fotos & Galeria', icon: <Camera size={17} /> },
    { id: 'partners', label: 'Parceiros & Cupons', icon: <Handshake size={17} />, badge: partners.length },
    { id: 'categories', label: 'Modalidades', icon: <Layers size={17} />, badge: modalities.length },
    { id: 'qrcodes', label: 'Distribuição QR Code', icon: <QrCode size={17} />, badge: qrChannels.length },
    { id: 'tips', label: 'Dicas dos Locais', icon: <Sparkles size={17} /> },
    { id: 'itineraries', label: 'Roteiros', icon: <Compass size={17} />, badge: itineraries.length },
    { id: 'users', label: 'Clientes', icon: <Users size={17} />, badge: registeredUsers.length },
    { id: 'affiliates', label: 'Afiliados', icon: <Handshake size={17} />, badge: affiliates.length },
    { id: 'metrics', label: 'Métricas & Financeiro', icon: <TrendingUp size={17} /> },
    { id: 'logs', label: 'Logs & Webhooks', icon: <FileText size={17} /> },
    { id: 'security', label: 'Segurança & Senha', icon: <Lock size={17} /> }
  ];

  const currentTabObj = tabsList.find((t) => t.id === activeTab) || tabsList[0];

  return (
    <div className="admin-portal-standalone-root">
      {/* Top Header Bar */}
      <header className="admin-portal-header">
        <div className="admin-portal-header-left">
          <button
            className="admin-mobile-hamburger-btn show-mobile-only"
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Abrir Menu de Abas"
            type="button"
          >
            <Menu size={22} />
            <span className="hamburger-text">Menu</span>
          </button>

          <div className="admin-portal-brand">
            <div className="admin-brand-icon">
              <Crown size={18} color="#F4A261" />
            </div>
            <div className="admin-brand-info">
              <span className="admin-brand-name">JAMPA EXPERIENCE</span>
              <span className="admin-brand-role">PAINEL DO GESTOR & CMS</span>
            </div>
          </div>
        </div>

        <div className="admin-portal-header-right">
          <div className="admin-session-user-badge hide-mobile">
            <span className="user-online-dot" />
            <span>{currentAdminUser}</span>
          </div>

          <button
            className="admin-header-btn site-btn"
            onClick={onClose}
            title="Voltar ao Site Público"
            type="button"
          >
            <Globe size={15} />
            <span className="hide-mobile">Ver Site</span>
          </button>

          {onLogout && (
            <button
              className="admin-header-btn logout-btn"
              onClick={onLogout}
              title="Encerrar Sessão"
              type="button"
            >
              <LogOut size={15} />
              <span className="hide-mobile">Sair</span>
            </button>
          )}
        </div>
      </header>

      {/* Mobile Drawer Menu (Off-Canvas) */}
      {isMobileMenuOpen && (
        <div className="admin-drawer-backdrop" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="admin-drawer-panel" onClick={(e) => e.stopPropagation()}>
            <div className="admin-drawer-top">
              <div className="drawer-brand-title">
                <Crown size={18} color="#F4A261" />
                <span>Navegação do Gestor</span>
              </div>
              <button
                className="admin-drawer-close"
                onClick={() => setIsMobileMenuOpen(false)}
                type="button"
                aria-label="Fechar menu"
              >
                <X size={20} />
              </button>
            </div>

            <div className="drawer-session-box">
              <span className="drawer-session-label">Gestor Conectado:</span>
              <strong className="drawer-session-user">{currentAdminUser}</strong>
            </div>

            <nav className="admin-drawer-nav-list">
              {tabsList.map((t) => (
                <button
                  key={t.id}
                  className={`drawer-tab-item ${activeTab === t.id ? 'active' : ''}`}
                  onClick={() => {
                    setActiveTab(t.id);
                    if (t.id === 'places') setIsEditingPlace(false);
                    if (t.id === 'categories') setIsEditingModality(false);
                    setIsMobileMenuOpen(false);
                  }}
                  type="button"
                >
                  <span className="drawer-tab-icon">{t.icon}</span>
                  <span className="drawer-tab-label">{t.label}</span>
                  {t.badge !== undefined && (
                    <span className="drawer-tab-badge">{t.badge}</span>
                  )}
                </button>
              ))}
            </nav>

            <div className="admin-drawer-bottom-actions">
              <button
                className="drawer-action-btn site"
                onClick={() => { setIsMobileMenuOpen(false); onClose(); }}
                type="button"
              >
                <Globe size={16} />
                <span>Voltar ao Site Público</span>
              </button>
              {onLogout && (
                <button
                  className="drawer-action-btn logout"
                  onClick={() => { setIsMobileMenuOpen(false); onLogout(); }}
                  type="button"
                >
                  <LogOut size={16} />
                  <span>Deslogar & Sair</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Container */}
      <div className="admin-portal-body">
        {/* Toast Notificação */}
        {toastMsg && (
          <div className="admin-floating-toast">
            <span>{toastMsg}</span>
          </div>
        )}

        {/* Desktop Horizontal Tabs */}
        <div className="admin-tabs-nav hide-mobile">
          {tabsList.map((t) => (
            <button
              key={t.id}
              className={`admin-tab-btn ${activeTab === t.id ? 'active' : ''}`}
              onClick={() => {
                setActiveTab(t.id);
                if (t.id === 'places') setIsEditingPlace(false);
                if (t.id === 'categories') setIsEditingModality(false);
              }}
            >
              {t.icon}
              <span>{t.label} {t.badge !== undefined ? `(${t.badge})` : ''}</span>
            </button>
          ))}
        </div>

        {/* Mobile Sub-Header / Current Tab Indicator */}
        <div className="admin-mobile-subnav show-mobile-only">
          <div className="mobile-active-tab-badge">
            {currentTabObj.icon}
            <span>{currentTabObj.label}</span>
          </div>
          <button
            className="mobile-switch-tab-btn"
            onClick={() => setIsMobileMenuOpen(true)}
            type="button"
          >
            <Menu size={15} />
            <span>Mudar Seção</span>
          </button>
        </div>

        {/* ======================================================== */}
        {/* ABA 1: LOCAIS & ATRAÇÕES (CRUD COMPLETO COM FOTOS & PARCEIROS) */}
        {/* ======================================================== */}
        {activeTab === 'places' && (
          <div className="admin-tab-content">
            {!isEditingPlace ? (
              <>
                <div className="admin-toolbar">
                  <div className="toolbar-search-wrap">
                    <Search size={16} />
                    <input
                      type="text"
                      placeholder="Buscar por nome ou bairro..."
                      value={placeSearch}
                      onChange={(e) => setPlaceSearch(e.target.value)}
                    />
                  </div>

                  <select
                    value={placeCatFilter}
                    onChange={(e) => setPlaceCatFilter(e.target.value)}
                    className="admin-select"
                  >
                    <option value="all">Todas as Modalidades</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.label}</option>
                    ))}
                  </select>

                  <Button
                    variant="gold"
                    size="sm"
                    iconLeft={<Plus size={16} />}
                    onClick={handleOpenNewPlace}
                  >
                    Novo Local
                  </Button>
                </div>

                <div className="admin-places-table-wrap glass-panel hide-mobile">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Foto</th>
                        <th>Nome do Local</th>
                        <th>Modalidade</th>
                        <th>Bairro</th>
                        <th>Parceria Comercial</th>
                        <th>Fotos</th>
                        <th>Dicas</th>
                        <th style={{ textAlign: 'right' }}>Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPlaces.map((p) => (
                        <tr key={p.id}>
                          <td>
                            <img src={p.featuredImage} alt={p.name} className="table-thumb" />
                          </td>
                          <td>
                            <strong className="place-table-name">{p.name}</strong>
                            <span className="place-table-sub">{p.slogan || p.publicTeaser}</span>
                          </td>
                          <td>
                            <Badge variant="cyan" size="sm">{p.modalityName || p.categoryLabel || 'Praias'}</Badge>
                          </td>
                          <td>{p.neighborhood}</td>
                          <td>
                            {p.isPartner ? (
                              <Badge variant="gold" size="sm" icon={<Handshake size={12} />}>
                                {p.partnerLevel === 'fundador' ? '⭐ Fundador' : p.partnerLevel === 'destaque' ? '✨ Destaque' : 'Parceiro'}
                              </Badge>
                            ) : (
                              <span className="non-partner-tag">Orgânico</span>
                            )}
                          </td>
                          <td>
                            <button
                              className="photos-counter-pill"
                              onClick={() => {
                                setSelectedPlaceForPhotos(p);
                                setActiveTab('photos');
                              }}
                              title="Gerenciar Fotos deste Local"
                            >
                              <Camera size={13} />
                              <span>{p.gallery ? p.gallery.length : 1} fotos</span>
                            </button>
                          </td>
                          <td>
                            <button
                              type="button"
                              className="tips-counter-pill"
                              onClick={() => {
                                setSelectedPlaceForTips(p);
                                setActiveTab('tips');
                              }}
                              title="Gerenciar Dicas Secretas & Melhores Práticas deste Local"
                            >
                              <Sparkles size={13} color="#F4A261" />
                              <span>{p.tips ? p.tips.length : 0} dicas</span>
                            </button>
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            <div className="table-actions-row">
                              <button
                                className="action-icon-btn tips-btn"
                                onClick={() => {
                                  setSelectedPlaceForTips(p);
                                  setActiveTab('tips');
                                }}
                                title="Dicas Secretas & Melhores Práticas deste Local"
                              >
                                <Sparkles size={15} color="#F4A261" />
                              </button>
                              <button
                                className="action-icon-btn edit"
                                onClick={() => handleEditPlace(p)}
                                title="Editar Local, Fotos, Benefícios VIP e Dicas"
                              >
                                <Edit2 size={15} />
                              </button>
                              <button
                                className="action-icon-btn delete"
                                onClick={() => handleDeletePlace(p.id, p.name)}
                                title="Excluir Local"
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* VISUALIZAÇÃO RESPONSIVA EM CARDS PARA MOBILE (390PX / SMARTPHONES) */}
                <div className="admin-places-mobile-list show-mobile-only">
                  {filteredPlaces.length === 0 ? (
                    <div className="empty-results-box glass-panel">
                      <p>Nenhum local encontrado para os filtros selecionados.</p>
                    </div>
                  ) : (
                    filteredPlaces.map((p) => (
                      <div key={p.id} className="admin-mobile-place-card glass-panel">
                        <div className="mobile-place-card-top">
                          <img src={p.featuredImage} alt={p.name} className="mobile-place-thumb" />
                          <div className="mobile-place-info">
                            <strong className="mobile-place-name">{p.name}</strong>
                            <span className="mobile-place-neighborhood">{p.neighborhood}</span>
                            <div className="mobile-place-tags">
                              <Badge variant="cyan" size="sm">{p.modalityName || p.categoryLabel || 'Praias'}</Badge>
                              {p.isPartner ? (
                                <Badge variant="gold" size="sm" icon={<Handshake size={11} />}>
                                  {p.partnerLevel === 'fundador' ? '⭐ Fundador' : p.partnerLevel === 'destaque' ? '✨ Destaque' : 'Parceiro'}
                                </Badge>
                              ) : (
                                <span className="non-partner-tag">Orgânico</span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="mobile-place-card-meta">
                          <button
                            type="button"
                            className="mobile-meta-pill"
                            onClick={() => {
                              setSelectedPlaceForPhotos(p);
                              setActiveTab('photos');
                            }}
                          >
                            📷 {p.gallery ? p.gallery.length : 1} fotos
                          </button>
                          <button
                            type="button"
                            className="mobile-meta-pill tips-pill"
                            onClick={() => {
                              setSelectedPlaceForTips(p);
                              setActiveTab('tips');
                            }}
                          >
                            ✨ {p.tips ? p.tips.length : 0} dicas
                          </button>
                        </div>

                        <div className="mobile-place-card-actions">
                          <button
                            className="mobile-card-action-btn edit-btn"
                            onClick={() => handleEditPlace(p)}
                            type="button"
                          >
                            <Edit2 size={15} />
                            <span>Editar</span>
                          </button>
                          <button
                            className="mobile-card-action-btn tips-btn"
                            onClick={() => {
                              setSelectedPlaceForTips(p);
                              setActiveTab('tips');
                            }}
                            type="button"
                          >
                            <Sparkles size={15} color="#F4A261" />
                            <span>Dicas</span>
                          </button>
                          <button
                            className="mobile-card-action-btn photos-btn"
                            onClick={() => {
                              setSelectedPlaceForPhotos(p);
                              setActiveTab('photos');
                            }}
                            type="button"
                          >
                            <Camera size={15} />
                            <span>Fotos</span>
                          </button>
                          <button
                            className="mobile-card-action-btn delete-btn"
                            onClick={() => handleDeletePlace(p.id, p.name)}
                            type="button"
                            title="Excluir"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </>
            ) : (
              /* FORMULÁRIO DE EDIÇÃO / CRIAÇÃO DE LOCAL COM GESTOR VISUAL DE FOTOS E PARCEIROS */
              <form className="admin-form glass-panel" onSubmit={handleSavePlace}>
                <div className="form-header-row">
                  <h4>{editingPlace.id?.startsWith('place-custom') ? 'Criar Novo Local' : `Editar: ${editingPlace.name}`}</h4>
                  <button type="button" className="close-form-btn" onClick={() => setIsEditingPlace(false)}>
                    <X size={18} />
                  </button>
                </div>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label>Nome do Local / Estabelecimento *</label>
                    <input
                      type="text"
                      value={editingPlace.name || ''}
                      onChange={(e) => setEditingPlace({ ...editingPlace, name: e.target.value })}
                      placeholder="Ex: Restaurante Mangai ou Praia de Coqueirinho"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Bairro da Experiência (Porta de Entrada) *</label>
                    <select
                      value={editingPlace.neighborhoodId || ''}
                      onChange={(e) => {
                        const nId = e.target.value;
                        const found = neighborhoods.find((n) => n.id === nId || n.slug === nId);
                        setEditingPlace({
                          ...editingPlace,
                          neighborhoodId: nId,
                          neighborhood: found ? found.name : editingPlace.neighborhood || ''
                        });
                      }}
                      required
                    >
                      <option value="">Selecione o Bairro...</option>
                      {neighborhoods.map((n) => (
                        <option key={n.id} value={n.slug || n.id}>
                          {n.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Modalidade (Tipo do Estabelecimento) *</label>
                    <select
                      value={editingPlace.modalityName || ''}
                      onChange={(e) => {
                        const mName = e.target.value;
                        const found = modalities.find((m) => m.name.toLowerCase() === mName.toLowerCase());
                        setEditingPlace({
                          ...editingPlace,
                          modalityName: mName,
                          modalityId: found ? found.id : undefined
                        });
                      }}
                      required
                    >
                      <option value="">Selecione a Modalidade...</option>
                      {modalities.map((m) => (
                        <option key={m.id} value={m.name}>
                          {m.name}
                        </option>
                      ))}
                      {editingPlace.modalityName &&
                        !modalities.some((m) => m.name.toLowerCase() === editingPlace.modalityName?.toLowerCase()) && (
                          <option value={editingPlace.modalityName}>
                            {editingPlace.modalityName}
                          </option>
                        )}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Nível de Preço</label>
                    <select
                      value={editingPlace.priceLevel || 'moderado'}
                      onChange={(e) => setEditingPlace({ ...editingPlace, priceLevel: e.target.value as PriceLevel })}
                    >
                      <option value="economico">Econômico ($)</option>
                      <option value="moderado">Moderado ($$)</option>
                      <option value="alto">Sofisticado ($$$)</option>
                      <option value="luxo">Luxo ($$$$)</option>
                    </select>
                  </div>
                </div>

                {/* SELETOR DE MÚLTIPLOS TÓPICOS & SEÇÕES (1 LOCAL -> N TÓPICOS) */}
                <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <SlidersHorizontal size={14} color="#00B4D8" />
                    <strong>Tópicos & Seções do Bairro (O local aparecerá em todas as seções marcadas) *</strong>
                  </label>
                  <div className="topic-checkboxes-grid">
                    {topics.map((t) => {
                      const isChecked =
                        (editingPlace.topicIds || []).includes(t.id) ||
                        (editingPlace.topicIds || []).includes(t.slug);
                      return (
                        <button
                          key={t.id}
                          type="button"
                          className={`topic-tag-check-btn ${isChecked ? 'active' : ''}`}
                          onClick={() => handleTogglePlaceTopic(t.id)}
                        >
                          <span className="check-box-indicator">{isChecked ? '✓' : '+'}</span>
                          <span>{t.name}</span>
                        </button>
                      );
                    })}
                  </div>
                  <small style={{ color: '#94A3B8', display: 'block', marginTop: '0.35rem' }}>
                    Ex: Um Bar/Restaurante pode pertencer a "Gastronomia", "Bares & Botecos" e "Vida Noturna". O cadastro permanece único e sem duplicação!
                  </small>
                </div>

                <div className="form-group">
                  <label>Slogan de Impacto</label>
                  <input
                    type="text"
                    value={editingPlace.slogan || ''}
                    onChange={(e) => setEditingPlace({ ...editingPlace, slogan: e.target.value })}
                    placeholder="Ex: O templo da gastronomia regional paraibana"
                  />
                </div>

                {/* ======================================================== */}
                {/* GESTOR VISUAL DE FOTOS E GALERIA DO LOCAL */}
                {/* ======================================================== */}
                <div className="form-photos-manager-section glass-panel">
                  <div className="photos-sec-header">
                    <div className="photos-sec-title">
                      <Camera size={18} color="#00B4D8" />
                      <h5>Galeria de Fotos do Local ({editingPlace.gallery ? editingPlace.gallery.length : 0} fotos)</h5>
                    </div>
                    <span className="photos-sec-sub">Clique em ⭐ para definir qual foto será a Capa Principal. Use ⬆️ / ⬇️ para ordenar.</span>
                  </div>

                  {/* Grid de Miniaturas com Ações e Ordenação */}
                  <div className="form-gallery-grid">
                    {editingPlace.gallery && editingPlace.gallery.map((photoUrl, idx) => {
                      const isMainCover = editingPlace.featuredImage === photoUrl;
                      return (
                        <div key={idx} className={`form-photo-card ${isMainCover ? 'is-cover-active' : ''}`}>
                          <img src={photoUrl} alt={`Foto ${idx + 1}`} className="form-photo-img" />
                          
                          {/* Posição da foto */}
                          <div className="photo-order-badge">#{idx + 1}</div>

                          {/* Badge de Capa */}
                          {isMainCover && (
                            <div className="photo-cover-badge">
                              <Star size={11} fill="#F4A261" color="#F4A261" />
                              <span>CAPA</span>
                            </div>
                          )}

                          {/* Ações da Foto */}
                          <div className="photo-card-hover-actions">
                            {!isMainCover && (
                              <button
                                type="button"
                                className="photo-action-pill cover-btn"
                                onClick={() => handleSetFeaturedPhotoInForm(photoUrl)}
                                title="Definir como Foto de Capa Principal"
                              >
                                <Star size={12} />
                                <span>Capa</span>
                              </button>
                            )}
                            
                            <div className="photo-reorder-btns">
                              {idx > 0 && (
                                <button
                                  type="button"
                                  className="reorder-arrow-btn"
                                  onClick={() => handleMovePhotoOrderInForm(idx, 'up')}
                                  title="Mover para frente"
                                >
                                  <MoveUp size={13} />
                                </button>
                              )}
                              {editingPlace.gallery && idx < editingPlace.gallery.length - 1 && (
                                <button
                                  type="button"
                                  className="reorder-arrow-btn"
                                  onClick={() => handleMovePhotoOrderInForm(idx, 'down')}
                                  title="Mover para trás"
                                >
                                  <MoveDown size={13} />
                                </button>
                              )}
                            </div>

                            <button
                              type="button"
                              className="photo-action-pill delete-btn"
                              onClick={() => handleRemovePhotoFromEditingPlace(idx)}
                              title="Excluir esta foto"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Formulário para Adicionar Foto por URL ou Arquivo */}
                  <div className="add-photo-controls-row">
                    <div className="photo-url-input-wrap">
                      <ImageIcon size={16} className="input-prefix-icon" />
                      <input
                        type="text"
                        placeholder="Colar link URL de nova imagem (https://...)"
                        value={newGalleryUrlInput}
                        onChange={(e) => setNewGalleryUrlInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddPhotoToEditingPlace(newGalleryUrlInput);
                          }
                        }}
                      />
                      <Button
                        type="button"
                        variant="gold"
                        size="sm"
                        iconLeft={<Plus size={14} />}
                        onClick={() => handleAddPhotoToEditingPlace(newGalleryUrlInput)}
                        disabled={!newGalleryUrlInput.trim()}
                      >
                        Adicionar URL
                      </Button>
                    </div>

                    <div className="photo-upload-or-divider">ou</div>

                    {/* Upload de Imagem Local com compressão automática */}
                    <input
                      type="file"
                      ref={formFileInputRef}
                      style={{ display: 'none' }}
                      accept="image/*"
                      multiple
                      onChange={handleFileUploadInForm}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      iconLeft={<Upload size={14} />}
                      onClick={() => formFileInputRef.current?.click()}
                      disabled={isUploadingPhoto}
                    >
                      {isUploadingPhoto ? 'Comprimindo...' : 'Upload do Computador'}
                    </Button>
                  </div>
                </div>

                {/* ======================================================== */}
                {/* SEÇÃO DE LOCAIS VIP & BENEFÍCIOS PARA MEMBROS */}
                {/* ======================================================== */}
                <div className="partner-edit-section glass-panel">
                  <div className="partner-sec-header">
                    <div className="partner-sec-title-group">
                      <Crown size={20} color="#F4A261" />
                      <div>
                        <h5>Locais VIP & Benefícios</h5>
                        <p className="sec-helper-text">
                          Cadastre e vincule restaurantes, bares, quiosques e estabelecimentos com benefícios exclusivos a este local.
                        </p>
                      </div>
                    </div>

                    {/* BOTÃO PROEMINENTE OBRIGATÓRIO: + ADICIONAR BENEFÍCIO VIP */}
                    <Button
                      type="button"
                      variant="gold"
                      size="sm"
                      iconLeft={<Plus size={15} />}
                      onClick={() => handleOpenNewPartner(editingPlace.id)}
                    >
                      + ADICIONAR BENEFÍCIO VIP
                    </Button>
                  </div>

                  {/* LISTA DE BENEFÍCIOS VINCULADOS A ESTE LOCAL */}
                  <div className="linked-partners-container">
                    <div className="linked-partners-header">
                      <span className="linked-count-label">
                        Benefícios VIP vinculados ({partners.filter((p) => p.placeId === editingPlace.id).length}):
                      </span>
                    </div>

                    {partners.filter((p) => p.placeId === editingPlace.id).length === 0 ? (
                      <div className="empty-linked-partners-box">
                        <Gift size={28} color="#94A3B8" opacity={0.6} />
                        <p>Nenhum parceiro comercial vinculado a este local ainda.</p>
                        <span>
                          Clique no botão <strong>"+ ADICIONAR PARCEIRO"</strong> acima para cadastrar restaurantes, bares ou benefícios exclusivos (ex: 10% OFF, cortesia, cupom).
                        </span>
                      </div>
                    ) : (
                      <div className="linked-partners-grid">
                        {partners
                          .filter((p) => p.placeId === editingPlace.id)
                          .map((part) => (
                            <div key={part.id} className="linked-partner-card glass-panel">
                              <div className="l-partner-top">
                                <div className="l-partner-name-wrap">
                                  <h6 className="l-partner-name">{part.name}</h6>
                                  <span className="l-partner-level-badge">{part.partnershipLevel}</span>
                                </div>
                                <div className="l-partner-actions">
                                  <button
                                    type="button"
                                    className="l-action-btn edit"
                                    onClick={() => handleOpenEditPartner(part)}
                                    title="Editar dados do parceiro"
                                  >
                                    <Edit2 size={13} />
                                    <span>Editar</span>
                                  </button>
                                  <button
                                    type="button"
                                    className="l-action-btn delete"
                                    onClick={() => handleDeletePartner(part.id, part.name)}
                                    title="Excluir parceiro"
                                  >
                                    <Trash2 size={13} />
                                    <span>Excluir</span>
                                  </button>
                                </div>
                              </div>

                              {part.address && (
                                <p className="l-partner-address">
                                  <MapPin size={12} color="#F4A261" />
                                  <span>{part.address}</span>
                                </p>
                              )}

                              {part.googleMapsUrl && (
                                <a
                                  href={part.googleMapsUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="l-partner-maps-link"
                                >
                                  <ExternalLink size={11} />
                                  <span>Abrir localização no Google Maps</span>
                                </a>
                              )}

                              {part.description && (
                                <p className="l-partner-desc">{part.description}</p>
                              )}

                              {part.benefit && (
                                <div className="l-partner-benefit-box">
                                  <div className="benefit-row">
                                    <Gift size={13} color="#F4A261" />
                                    <strong>Benefício:</strong>
                                    <span>{part.benefit}</span>
                                  </div>
                                  {part.couponCode && (
                                    <div className="coupon-row">
                                      <Percent size={12} color="#00B4D8" />
                                      <span>Cupom:</span>
                                      <strong className="coupon-code-pill">{part.couponCode}</strong>
                                    </div>
                                  )}
                                  {part.redemptionInstructions && (
                                    <p className="redemption-text">
                                      <em>Instruções: {part.redemptionInstructions}</em>
                                    </p>
                                  )}
                                </div>
                              )}

                              {/* Contatos do Parceiro */}
                              <div className="l-partner-contacts-row">
                                {part.whatsapp && (
                                  <a
                                    href={`https://wa.me/${part.whatsapp.replace(/\D/g, '')}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="l-contact-pill whatsapp"
                                  >
                                    <MessageCircle size={12} />
                                    <span>WhatsApp</span>
                                  </a>
                                )}
                                {part.instagram && (
                                  <a
                                    href={`https://instagram.com/${part.instagram.replace('@', '')}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="l-contact-pill instagram"
                                  >
                                    <span>{part.instagram}</span>
                                  </a>
                                )}
                                {part.phone && (
                                  <span className="l-contact-pill phone">
                                    <Phone size={12} />
                                    <span>{part.phone}</span>
                                  </span>
                                )}
                                {part.website && (
                                  <a
                                    href={part.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="l-contact-pill website"
                                  >
                                    <Globe size={12} />
                                    <span>Site Oficial</span>
                                  </a>
                                )}
                              </div>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* ======================================================== */}
                {/* SEÇÃO DE DICAS SECRETAS & MELHORES PRÁTICAS DO LOCAL */}
                {/* ======================================================== */}
                <div className="tips-edit-section glass-panel">
                  <div className="tips-sec-header">
                    <div className="tips-sec-title-group">
                      <Sparkles size={20} color="#F4A261" />
                      <div>
                        <h5>Dicas Secretas & Melhores Práticas ({editingPlace.tips ? editingPlace.tips.length : 0})</h5>
                        <p className="sec-helper-text">
                          Cadastre segredos dos nativos, horários ideais sem fila, melhor mesa e dicas exclusivas exibidas no guia do local.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* LISTA DE DICAS CADASTRADAS PARA ESTE LOCAL */}
                  <div className="current-tips-list">
                    {editingPlace.tips && editingPlace.tips.length > 0 ? (
                      editingPlace.tips.map((t, idx) => (
                        <div key={idx} className="tip-admin-card glass-panel">
                          <div className="tip-card-top">
                            <div className="tip-badge-tag">{t.badge || 'Dica dos Nativos'}</div>
                            <button
                              type="button"
                              className="action-icon-btn delete"
                              onClick={() => handleRemoveTipInPlaceForm(idx)}
                              title="Excluir Dica"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                          <h5 className="tip-card-title">{t.title}</h5>
                          <p className="tip-card-desc">{t.description}</p>
                        </div>
                      ))
                    ) : (
                      <div className="empty-tips-box">
                        <Sparkles size={28} color="#94A3B8" opacity={0.6} />
                        <p>Nenhuma dica secreta cadastrada para este local ainda.</p>
                        <span>Preencha o formulário abaixo para adicionar dicas estratégicas dos nativos.</span>
                      </div>
                    )}
                  </div>

                  {/* FORMULÁRIO PARA ADICIONAR NOVA DICA */}
                  <div className="add-tip-subform glass-panel">
                    <h6>➕ Adicionar Nova Dica Secreta</h6>
                    <div className="form-grid-2">
                      <div className="form-group">
                        <label>Título da Dica *</label>
                        <input
                          type="text"
                          value={formTipTitle}
                          onChange={(e) => setFormTipTitle(e.target.value)}
                          placeholder="Ex: Trecho Final das Falésias ou Coco Gelado no Quiosque"
                        />
                      </div>
                      <div className="form-group">
                        <label>Selo / Tag da Dica</label>
                        <input
                          type="text"
                          value={formTipBadge}
                          onChange={(e) => setFormTipBadge(e.target.value)}
                          placeholder="Ex: Dica dos Nativos, Gastronomia na Praia, Economia"
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Descrição Detalhada da Dica *</label>
                      <textarea
                        rows={2}
                        value={formTipDesc}
                        onChange={(e) => setFormTipDesc(e.target.value)}
                        placeholder="Ex: O trecho final da Av. Cabo Branco, próximo à Barreira, é o mais calmo e com mar estilo piscina natural na maré seca..."
                      />
                    </div>

                    <div className="tip-form-action-row">
                      <Button
                        type="button"
                        variant="gold"
                        size="sm"
                        iconLeft={<Plus size={14} />}
                        onClick={handleAddTipInPlaceForm}
                        disabled={!formTipTitle.trim() || !formTipDesc.trim()}
                      >
                        + ADICIONAR DICA SECRETA
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Contatos & Links Diretos */}
                <div className="form-grid-2">
                  <div className="form-group">
                    <label>WhatsApp Direto (Apenas Números)</label>
                    <input
                      type="text"
                      value={editingPlace.whatsapp || ''}
                      onChange={(e) => setEditingPlace({ ...editingPlace, whatsapp: e.target.value })}
                      placeholder="Ex: 5583991234567"
                    />
                  </div>

                  <div className="form-group">
                    <label>Instagram (@perfil)</label>
                    <input
                      type="text"
                      value={editingPlace.instagram || ''}
                      onChange={(e) => setEditingPlace({ ...editingPlace, instagram: e.target.value })}
                      placeholder="Ex: @mangairestaurante"
                    />
                  </div>

                  <div className="form-group">
                    <label>Telefone Fixo / Comercial</label>
                    <input
                      type="text"
                      value={editingPlace.phone || ''}
                      onChange={(e) => setEditingPlace({ ...editingPlace, phone: e.target.value })}
                      placeholder="Ex: (83) 3244-3300"
                    />
                  </div>

                  <div className="form-group">
                    <label>Website Oficial</label>
                    <input
                      type="text"
                      value={editingPlace.website || ''}
                      onChange={(e) => setEditingPlace({ ...editingPlace, website: e.target.value })}
                      placeholder="https://..."
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Descrição Completa do Local (Guia VIP)</label>
                  <textarea
                    rows={4}
                    value={editingPlace.fullDescription || ''}
                    onChange={(e) => setEditingPlace({ ...editingPlace, fullDescription: e.target.value })}
                    placeholder="Detalhes históricos, pratos imperdíveis, ambiente e segredos..."
                  />
                </div>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label>Latitude GPS</label>
                    <input
                      type="number"
                      step="any"
                      value={editingPlace.coordinates?.lat || -7.115}
                      onChange={(e) => setEditingPlace({
                        ...editingPlace,
                        coordinates: {
                          lat: parseFloat(e.target.value),
                          lng: editingPlace.coordinates?.lng || -34.825
                        }
                      })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Longitude GPS</label>
                    <input
                      type="number"
                      step="any"
                      value={editingPlace.coordinates?.lng || -34.825}
                      onChange={(e) => setEditingPlace({
                        ...editingPlace,
                        coordinates: {
                          lat: editingPlace.coordinates?.lat || -7.115,
                          lng: parseFloat(e.target.value)
                        }
                      })}
                    />
                  </div>
                </div>

                <div className="form-actions-row">
                  <Button type="button" variant="outline" onClick={() => setIsEditingPlace(false)}>
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    variant="gold"
                    iconLeft={<Save size={16} />}
                    onClick={(e) => {
                      if (e) e.stopPropagation();
                      handleSavePlace(e);
                    }}
                  >
                    SALVAR ALTERAÇÕES & FOTOS
                  </Button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* ABA 2: GESTÃO DEDICADA DE FOTOS & GALERIA POR LOCAL */}
        {/* ======================================================== */}
        {activeTab === 'photos' && (
          <div className="admin-tab-content">
            {/* Seletor Mobile de Local */}
            <div className="mobile-place-selector show-mobile-only glass-panel">
              <label className="mobile-select-label">📍 Selecione o Local para Gerenciar Fotos:</label>
              <select
                className="admin-select"
                value={selectedPlaceForPhotos?.id || ''}
                onChange={(e) => {
                  const found = allPlaces.find((p) => p.id === e.target.value);
                  if (found) setSelectedPlaceForPhotos(adminService.normalizePlacePhotos(found));
                }}
              >
                <option value="">-- Toque para escolher um local ({allPlaces.length}) --</option>
                {allPlaces.map((p) => (
                  <option key={p.id} value={p.id}>{p.name} ({p.neighborhood})</option>
                ))}
              </select>
            </div>

            <div className="photos-manager-layout">
              {/* Barra Lateral Desktop: Lista de Locais */}
              <div className="photos-left-sidebar glass-panel hide-mobile">
                <h5 className="sidebar-title">Selecione o Local:</h5>
                <div className="places-photos-scroll">
                  {allPlaces.map((p) => (
                    <button
                      key={p.id}
                      className={`place-photo-select-btn ${selectedPlaceForPhotos?.id === p.id ? 'active' : ''}`}
                      onClick={() => setSelectedPlaceForPhotos(adminService.normalizePlacePhotos(p))}
                    >
                      <img src={p.featuredImage} alt={p.name} className="mini-btn-thumb" />
                      <div className="mini-btn-info">
                        <span className="mini-name">{p.name}</span>
                        <span className="mini-sub">{p.neighborhood}</span>
                      </div>
                      <span className="photo-count-pill">{p.gallery ? p.gallery.length : 1}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Conteúdo Principal: Editor de Galeria do Local Selecionado */}
              <div className="photos-right-content glass-panel">
                {selectedPlaceForPhotos ? (
                  <>
                    <div className="photos-place-header">
                      <div>
                        <h4>Galeria de Fotos: <strong>{selectedPlaceForPhotos.name}</strong></h4>
                        <span className="photos-loc-sub">{selectedPlaceForPhotos.categoryLabel} • {selectedPlaceForPhotos.neighborhood}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <Badge variant="gold" icon={<Camera size={13} />}>
                          {selectedPlaceForPhotos.gallery ? selectedPlaceForPhotos.gallery.length : 1} Fotos
                        </Badge>
                        <Button
                          variant="gold"
                          size="sm"
                          iconLeft={<Save size={14} />}
                          onClick={handleSavePhotosTab}
                        >
                          Salvar Galeria
                        </Button>
                      </div>
                    </div>

                    {/* Grid Visual de Fotos do Local com Reordenação */}
                    <div className="photos-gallery-grid-main">
                      {selectedPlaceForPhotos.gallery && selectedPlaceForPhotos.gallery.map((photoUrl, idx) => {
                        const isCover = selectedPlaceForPhotos.featuredImage === photoUrl;
                        return (
                          <div key={idx} className={`photo-thumb-box glass-panel ${isCover ? 'is-main-cover' : ''}`}>
                            <img src={photoUrl} alt={`Foto ${idx + 1}`} className="photo-full-thumb" />
                            
                            <div className="photo-order-badge">#{idx + 1}</div>

                            {isCover && (
                              <div className="main-cover-tag">
                                <Star size={12} fill="#F4A261" color="#F4A261" />
                                <span>FOTO DE CAPA</span>
                              </div>
                            )}

                            <div className="photo-thumb-actions">
                              {!isCover && (
                                <button
                                  className="thumb-btn set-cover"
                                  onClick={() => handleSetFeaturedPhotoInTab(photoUrl)}
                                  title="Tornar esta a Foto de Capa Principal"
                                >
                                  <Star size={12} />
                                  <span>Capa</span>
                                </button>
                              )}

                              <div className="photo-reorder-btns">
                                {idx > 0 && (
                                  <button
                                    type="button"
                                    className="reorder-arrow-btn"
                                    onClick={() => handleMovePhotoOrderInTab(idx, 'up')}
                                    title="Mover para frente"
                                  >
                                    <MoveUp size={13} />
                                  </button>
                                )}
                                {selectedPlaceForPhotos.gallery && idx < selectedPlaceForPhotos.gallery.length - 1 && (
                                  <button
                                    type="button"
                                    className="reorder-arrow-btn"
                                    onClick={() => handleMovePhotoOrderInTab(idx, 'down')}
                                    title="Mover para trás"
                                  >
                                    <MoveDown size={13} />
                                  </button>
                                )}
                              </div>

                              <button
                                className="thumb-btn delete-photo"
                                onClick={() => handleRemovePhotoFromSelectedPlace(idx)}
                                title="Excluir Foto da Galeria"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Barra para Adicionar Nova Foto */}
                    <div className="add-photo-bar-box glass-panel">
                      <h5>➕ Adicionar Nova Foto a este Local</h5>
                      
                      <div className="add-photo-row">
                        <div className="url-input-col">
                          <ImageIcon size={16} color="#00B4D8" />
                          <input
                            type="text"
                            placeholder="Insira o link URL da imagem (https://images.unsplash.com/...)"
                            value={photoTabUrlInput}
                            onChange={(e) => setPhotoTabUrlInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleAddPhotoToSelectedPlace(photoTabUrlInput);
                              }
                            }}
                          />
                          <Button
                            variant="gold"
                            size="sm"
                            iconLeft={<Plus size={15} />}
                            onClick={() => handleAddPhotoToSelectedPlace(photoTabUrlInput)}
                            disabled={!photoTabUrlInput.trim()}
                          >
                            Adicionar Foto
                          </Button>
                        </div>

                        <div className="or-badge">OU</div>

                        <input
                          type="file"
                          ref={fileInputRef}
                          style={{ display: 'none' }}
                          accept="image/*"
                          multiple
                          onChange={handleFileUploadInTab}
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          iconLeft={<Upload size={15} />}
                          onClick={() => fileInputRef.current?.click()}
                          disabled={isUploadingPhoto}
                        >
                          {isUploadingPhoto ? 'Comprimindo...' : 'Upload do Dispositivo'}
                        </Button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="empty-selection-box">
                    <Camera size={36} color="#00B4D8" />
                    <h4>Selecione um local na lista ao lado para gerenciar suas fotos.</h4>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* ABA 3: GESTÃO GERAL DE PARCEIROS COMERCIAIS (1-TO-N) */}
        {/* ======================================================== */}
        {activeTab === 'partners' && (
          <div className="admin-tab-content">
            <div className="admin-toolbar">
              <div>
                <h4>Rede de Parceiros Comerciais Jampa Experience ({partners.length})</h4>
                <p className="admin-sec-sub">Gerencie restaurantes, bares, hotéis, quiosques e serviços com benefícios exclusivos para membros.</p>
              </div>
              <Button
                variant="gold"
                size="sm"
                iconLeft={<Plus size={16} />}
                onClick={() => handleOpenNewPartner()}
              >
                + Adicionar Parceiro Comercial
              </Button>
            </div>

            {/* Barra de Filtros e Busca */}
            <div className="partners-filter-toolbar glass-panel">
              <div className="toolbar-search-wrap">
                <Search size={16} color="#94A3B8" />
                <input
                  type="text"
                  placeholder="Buscar parceiro por nome, benefício, cupom ou endereço..."
                  value={partnerSearch}
                  onChange={(e) => setPartnerSearch(e.target.value)}
                />
                {partnerSearch && (
                  <button className="clear-search-btn" onClick={() => setPartnerSearch('')}>
                    <X size={14} />
                  </button>
                )}
              </div>

              <div className="toolbar-select-wrap">
                <select
                  value={partnerPlaceFilter}
                  onChange={(e) => setPartnerPlaceFilter(e.target.value)}
                  className="admin-select"
                >
                  <option value="all">Todos os Locais ({allPlaces.length})</option>
                  {allPlaces.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({partners.filter((pt) => pt.placeId === p.id).length} parceiros)
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Grid Global de Parceiros */}
            <div className="global-partners-grid">
              {partners
                .filter((p) => {
                  const matchesSearch =
                    !partnerSearch.trim() ||
                    p.name.toLowerCase().includes(partnerSearch.toLowerCase()) ||
                    p.benefit.toLowerCase().includes(partnerSearch.toLowerCase()) ||
                    (p.couponCode && p.couponCode.toLowerCase().includes(partnerSearch.toLowerCase())) ||
                    p.address.toLowerCase().includes(partnerSearch.toLowerCase()) ||
                    p.description.toLowerCase().includes(partnerSearch.toLowerCase());

                  const matchesPlace =
                    partnerPlaceFilter === 'all' || p.placeId === partnerPlaceFilter;

                  return matchesSearch && matchesPlace;
                })
                .map((part) => {
                  const linkedPlace = allPlaces.find((p) => p.id === part.placeId);
                  const partnerClicksMap = adminService.getPartnerClicksMap();
                  const pStats = partnerClicksMap[part.id] || {};
                  const placeStats = part.placeId ? (partnerClicksMap[part.placeId] || {}) : {};
                  const pViews = (pStats.views || 0) + (placeStats.views || 0);
                  const pWhatsapp = (pStats.whatsapp || 0) + (placeStats.whatsapp || 0);
                  const pMaps = (pStats.maps || 0) + (placeStats.maps || 0);
                  const pInstagram = (pStats.instagram || 0) + (placeStats.instagram || 0);
                  const pWebsite = (pStats.website || 0) + (placeStats.website || 0);
                  const pCoupon = (pStats.coupon || 0) + (placeStats.coupon || 0);
                  const pTotal = (pStats.total || 0) + (placeStats.total || 0) || (pWhatsapp + pMaps + pInstagram + pWebsite + pCoupon);

                  return (
                    <div key={part.id} className="global-partner-card glass-panel">
                      <div className="g-partner-header">
                        <div>
                          <div className="g-partner-badges">
                            <span className="l-partner-level-badge">{part.partnershipLevel}</span>
                            {linkedPlace && (
                              <span className="g-partner-place-tag">
                                <MapPin size={11} />
                                <span>{linkedPlace.name}</span>
                              </span>
                            )}
                          </div>
                          <h4 className="g-partner-title">{part.name}</h4>
                        </div>
                        <div className="g-partner-actions">
                          <Button
                            size="sm"
                            variant="outline"
                            iconLeft={<Edit2 size={13} />}
                            onClick={() => handleOpenEditPartner(part)}
                          >
                            Editar
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            iconLeft={<Trash2 size={13} />}
                            onClick={() => handleDeletePartner(part.id, part.name)}
                          >
                            Excluir
                          </Button>
                        </div>
                      </div>

                      {part.address && (
                        <p className="g-partner-address">
                          <MapPin size={13} color="#F4A261" />
                          <span>{part.address}</span>
                          {part.googleMapsUrl && (
                            <a
                              href={part.googleMapsUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="g-partner-maps-link"
                            >
                              <ExternalLink size={11} />
                              <span>Ver no Maps</span>
                            </a>
                          )}
                        </p>
                      )}

                      {part.description && (
                        <p className="g-partner-desc">{part.description}</p>
                      )}

                      {/* Caixa de Benefício & Cupom */}
                      <div className="g-partner-benefit-box">
                        <div className="benefit-row">
                          <Gift size={14} color="#F4A261" />
                          <strong>Benefício Exclusivo:</strong>
                          <span>{part.benefit}</span>
                        </div>
                        {part.couponCode && (
                          <div className="coupon-row">
                            <Percent size={13} color="#00B4D8" />
                            <span>Cupom de Desconto:</span>
                            <strong className="coupon-code-pill">{part.couponCode}</strong>
                          </div>
                        )}
                        {part.redemptionInstructions && (
                          <p className="redemption-text">
                            <em>Instruções: {part.redemptionInstructions}</em>
                          </p>
                        )}
                      </div>

                      {/* Contatos */}
                      <div className="g-partner-contacts-row">
                        {part.whatsapp && (
                          <a
                            href={`https://wa.me/${part.whatsapp.replace(/\D/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="l-contact-pill whatsapp"
                          >
                            <MessageCircle size={12} />
                            <span>WhatsApp: {part.whatsapp}</span>
                          </a>
                        )}
                        {part.instagram && (
                          <a
                            href={`https://instagram.com/${part.instagram.replace('@', '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="l-contact-pill instagram"
                          >
                            <span>{part.instagram}</span>
                          </a>
                        )}
                        {part.phone && (
                          <span className="l-contact-pill phone">
                            <Phone size={12} />
                            <span>{part.phone}</span>
                          </span>
                        )}
                        {part.website && (
                          <a
                            href={part.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="l-contact-pill website"
                          >
                            <Globe size={12} />
                            <span>Site Oficial</span>
                          </a>
                        )}
                      </div>

                      {/* Métricas de cliques / engajamento */}
                      <div className="partner-metrics-row">
                        <div className="p-metric-item">
                          <span className="p-metric-val">{pViews}</span>
                          <span className="p-metric-lbl">Visualizações</span>
                        </div>
                        <div className="p-metric-item">
                          <span className="p-metric-val">{pWhatsapp}</span>
                          <span className="p-metric-lbl">WhatsApp</span>
                        </div>
                        <div className="p-metric-item">
                          <span className="p-metric-val">{pMaps}</span>
                          <span className="p-metric-lbl">Como Chegar</span>
                        </div>
                        <div className="p-metric-item">
                          <span className="p-metric-val">{pTotal}</span>
                          <span className="p-metric-lbl">Total Turistas</span>
                        </div>
                      </div>
                    </div>
                  );
                })}

              {partners.filter((p) => {
                const matchesSearch =
                  !partnerSearch.trim() ||
                  p.name.toLowerCase().includes(partnerSearch.toLowerCase()) ||
                  p.benefit.toLowerCase().includes(partnerSearch.toLowerCase()) ||
                  (p.couponCode && p.couponCode.toLowerCase().includes(partnerSearch.toLowerCase()));
                const matchesPlace =
                  partnerPlaceFilter === 'all' || p.placeId === partnerPlaceFilter;
                return matchesSearch && matchesPlace;
              }).length === 0 && (
                <div className="empty-selection-box glass-panel">
                  <Handshake size={36} color="#F4A261" />
                  <h4>Nenhum parceiro comercial encontrado com os filtros atuais.</h4>
                  <p>Clique no botão <strong>"+ Adicionar Parceiro Comercial"</strong> para cadastrar um novo parceiro.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* ABA 4: DISTRIBUIÇÃO FÍSICA & QR CODES */}
        {/* ======================================================== */}
        {activeTab === 'qrcodes' && (
          <div className="admin-tab-content">
            <div className="admin-toolbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h4>Hub de Distribuição Física por QR Codes</h4>
                <p className="admin-sec-sub">Materiais para totens, balcões de hotéis, aeroporto e displays de mesa.</p>
              </div>

              <Button
                variant="gold"
                iconLeft={<Plus size={16} />}
                onClick={handleOpenNewQrChannel}
              >
                Novo Local / Display QR Code
              </Button>
            </div>

            {qrChannels.length === 0 ? (
              <div className="empty-results-box glass-panel" style={{ textAlign: 'center', padding: '3.5rem 1.5rem', marginTop: '1rem' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(0, 180, 216, 0.12)', border: '1px solid rgba(0, 180, 216, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
                  <QrCode size={32} color="#00B4D8" />
                </div>
                <h4 style={{ color: '#F8FAFC', fontSize: '1.2rem', marginBottom: '0.5rem' }}>Nenhum Ponto ou Display QR Code Cadastrado</h4>
                <p style={{ color: '#94A3B8', maxWidth: '520px', margin: '0 auto 1.5rem', fontSize: '0.9rem', lineHeight: 1.5 }}>
                  Cadastre totens de desembarque no aeroporto, placas de balcão em pousadas e displays de mesa em restaurantes para gerar links rastreáveis e materiais impressos.
                </p>
                <Button
                  variant="gold"
                  iconLeft={<Plus size={16} />}
                  onClick={handleOpenNewQrChannel}
                >
                  Cadastrar Primeiro Local
                </Button>
              </div>
            ) : (
              <div className="qrcodes-channels-grid">
                {qrChannels.map((ch) => (
                  <div key={ch.id} className="qr-channel-card glass-panel">
                    <div className="qr-preview-box">
                      <div className="qr-code-img-frame">
                        <img
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(ch.targetUrl)}&margin=6`}
                          alt={`QR Code ${ch.name}`}
                          className="qr-channel-thumb-img"
                        />
                      </div>
                      <span className="qr-source-tag">Origem: {ch.sourceCode}</span>
                    </div>

                    <div className="qr-info-box">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem' }}>
                        <Badge variant="cyan" size="sm">{ch.locationCategory}</Badge>
                        <div style={{ display: 'flex', gap: '0.35rem' }}>
                          <button
                            type="button"
                            className="table-action-btn edit"
                            onClick={() => handleEditQrChannel(ch)}
                            title="Editar este ponto"
                            aria-label="Editar"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            type="button"
                            className="table-action-btn delete"
                            onClick={() => handleDeleteQrChannel(ch.id, ch.name)}
                            title="Excluir este ponto"
                            aria-label="Excluir"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>

                      <h4 className="qr-channel-name">{ch.name}</h4>
                      <p className="qr-link-copy">
                        <code>{ch.targetUrl}</code>
                      </p>

                      <div className="qr-stats-row">
                        <div className="qr-stat-badge">
                          <strong>{ch.scanCount || 0}</strong>
                          <span>Leituras</span>
                        </div>
                        <div className="qr-stat-badge">
                          <strong>{ch.conversionCount || 0}</strong>
                          <span>Vendas</span>
                        </div>
                        <div className="qr-stat-badge">
                          <strong>{ch.scanCount > 0 ? ((ch.conversionCount / ch.scanCount) * 100).toFixed(1) : '0.0'}%</strong>
                          <span>Conversão</span>
                        </div>
                      </div>

                      <div className="qr-card-actions">
                        <Button
                          size="sm"
                          variant="outline"
                          iconLeft={<Copy size={13} />}
                          onClick={() => handleCopyQrChannelLink(ch.targetUrl)}
                        >
                          Copiar Link
                        </Button>
                        <Button
                          size="sm"
                          variant="gold"
                          iconLeft={<Printer size={13} />}
                          onClick={() => setSelectedQrChannelForDisplay(ch)}
                        >
                          Imprimir Display
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* ABA 5: DICAS SECRETAS DOS NATIVOS */}
        {/* ======================================================== */}
        {activeTab === 'tips' && (
          <div className="admin-tab-content">
            {/* Seletor Mobile de Local para Dicas */}
            <div className="mobile-place-selector show-mobile-only glass-panel">
              <label className="mobile-select-label">💡 Selecione o Local para Gerenciar Dicas:</label>
              <select
                className="admin-select"
                value={selectedPlaceForTips?.id || ''}
                onChange={(e) => {
                  const found = allPlaces.find((p) => p.id === e.target.value);
                  if (found) setSelectedPlaceForTips(found);
                }}
              >
                <option value="">-- Toque para escolher um local ({allPlaces.length}) --</option>
                {allPlaces.map((p) => (
                  <option key={p.id} value={p.id}>{p.name} ({p.tips ? p.tips.length : 0} dicas)</option>
                ))}
              </select>
            </div>

            <div className="tips-manager-layout">
              {/* Coluna Esquerda Desktop: Seletor de Local */}
              <div className="tips-left-sidebar glass-panel hide-mobile">
                <h5 className="sidebar-title">Selecione o Local:</h5>
                <div className="places-tips-scroll">
                  {allPlaces.map((p) => (
                    <button
                      key={p.id}
                      className={`place-tip-select-btn ${selectedPlaceForTips?.id === p.id ? 'active' : ''}`}
                      onClick={() => setSelectedPlaceForTips(p)}
                    >
                      <span>{p.name}</span>
                      <span className="tip-badge-count">{p.tips ? p.tips.length : 0}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Coluna Direita: Editor de Dicas do Local Selecionado */}
              <div className="tips-right-content glass-panel">
                {selectedPlaceForTips ? (
                  <>
                    <div className="place-tips-header">
                      <div>
                        <h4>Dicas Secretas: <strong>{selectedPlaceForTips.name}</strong></h4>
                        <span className="tips-loc-sub">{selectedPlaceForTips.categoryLabel} • {selectedPlaceForTips.neighborhood}</span>
                      </div>
                    </div>

                    {/* Lista de Dicas Existentes */}
                    <div className="current-tips-list">
                      {selectedPlaceForTips.tips && selectedPlaceForTips.tips.length > 0 ? (
                        selectedPlaceForTips.tips.map((t, idx) => (
                          <div key={idx} className="tip-admin-card glass-panel">
                            <div className="tip-card-top">
                              <div className="tip-badge-tag">{t.badge || 'Dica VIP'}</div>
                              <button
                                className="action-icon-btn delete"
                                onClick={() => handleDeleteQuickTip(selectedPlaceForTips.id, idx)}
                                title="Excluir Dica"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                            <h5 className="tip-card-title">{t.title}</h5>
                            <p className="tip-card-desc">{t.description}</p>
                          </div>
                        ))
                      ) : (
                        <p className="no-tips-msg">Nenhuma dica cadastrada para este local ainda.</p>
                      )}
                    </div>

                    {/* Formulário para Adicionar Nova Dica */}
                    <form className="add-tip-form" onSubmit={handleAddQuickTip}>
                      <h5>➕ Adicionar Nova Dica Secreta</h5>
                      <div className="form-grid-2">
                        <div className="form-group">
                          <label>Título da Dica *</label>
                          <input
                            type="text"
                            value={newTipTitle}
                            onChange={(e) => setNewTipTitle(e.target.value)}
                            placeholder="Ex: Horário sem fila ou Melhor mesa com vista"
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label>Selo / Tag</label>
                          <input
                            type="text"
                            value={newTipBadge}
                            onChange={(e) => setNewTipBadge(e.target.value)}
                            placeholder="Ex: Segredo Nativo, O Que Pedir, Economia"
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <label>Conteúdo da Dica *</label>
                        <textarea
                          rows={3}
                          value={newTipDesc}
                          onChange={(e) => setNewTipDesc(e.target.value)}
                          placeholder="Instruções práticas, horários, dicas de estacionamento e pratos..."
                          required
                        />
                      </div>

                      <Button type="submit" variant="gold" size="sm" iconLeft={<Plus size={15} />}>
                        Adicionar Dica
                      </Button>
                    </form>
                  </>
                ) : (
                  <div className="empty-selection-box">
                    <Sparkles size={36} color="#F4A261" />
                    <h4>Selecione um local ao lado para gerenciar suas dicas secretas.</h4>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* ABA: GESTÃO DE BAIRROS & DICAS SECRETAS DO BAIRRO */}
        {/* ======================================================== */}
        {activeTab === 'neighborhoods' && (
          <div className="admin-tab-content">
            <div className="admin-toolbar">
              <div>
                <h4>Bairros & Regiões de João Pessoa ({neighborhoods.length})</h4>
                <p className="admin-sec-sub">
                  O bairro é a porta de entrada da experiência turística. Gerencie descrições ricas, capas e dicas secretas exclusivas.
                </p>
              </div>
              <Button
                variant="gold"
                size="sm"
                iconLeft={<Plus size={16} />}
                onClick={handleOpenNewNeighborhood}
              >
                + Adicionar Bairro
              </Button>
            </div>

            <div className="admin-neighborhoods-grid">
              {neighborhoods.map((neigh) => {
                const associatedPlaces = allPlaces.filter(
                  (p) =>
                    p.neighborhoodId === neigh.id ||
                    p.neighborhoodId === neigh.slug ||
                    p.neighborhood.toLowerCase().includes(neigh.name.toLowerCase())
                );
                return (
                  <div key={neigh.id} className="admin-neighborhood-card glass-panel">
                    <div className="neigh-card-cover-wrap">
                      <img src={neigh.coverImage} alt={neigh.name} className="neigh-card-cover-img" />
                      <div className="neigh-card-overlay">
                        <h4 className="neigh-card-title">{neigh.name}</h4>
                        <span className="neigh-card-slug">/{neigh.slug}</span>
                      </div>
                    </div>

                    <div className="neigh-card-body">
                      <p className="neigh-card-desc">{neigh.description || 'Sem descrição cadastrada.'}</p>

                      <div className="neigh-card-metrics">
                        <span className="neigh-metric-pill">
                          <MapPin size={12} />
                          <span>{associatedPlaces.length} locais cadastrados</span>
                        </span>
                        <span className="neigh-metric-pill">
                          <Sparkles size={12} />
                          <span>{neigh.tips ? neigh.tips.length : 0} dicas secretas</span>
                        </span>
                      </div>

                      {/* Prévia das Dicas Textuais do Bairro */}
                      {neigh.tips && neigh.tips.length > 0 && (
                        <div className="neigh-tips-preview-box">
                          <strong className="neigh-tips-preview-label">💡 Dicas Textuais:</strong>
                          <ul className="neigh-tips-preview-list">
                            {neigh.tips.slice(0, 2).map((tip, idx) => (
                              <li key={idx}>{tip}</li>
                            ))}
                            {neigh.tips.length > 2 && (
                              <li className="more-tips">+{neigh.tips.length - 2} outras dicas...</li>
                            )}
                          </ul>
                        </div>
                      )}

                      <div className="neigh-card-actions">
                        <Button
                          size="sm"
                          variant="outline"
                          iconLeft={<Edit2 size={13} />}
                          onClick={() => handleEditNeighborhood(neigh)}
                        >
                          Editar Bairro & Dicas
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          iconLeft={<Trash2 size={13} />}
                          onClick={() => handleDeleteNeighborhood(neigh.id, neigh.name)}
                        >
                          Excluir
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* ABA: GESTÃO DE TÓPICOS & SEÇÕES DINÂMICAS */}
        {/* ======================================================== */}
        {activeTab === 'topics' && (
          <div className="admin-tab-content">
            <div className="admin-toolbar">
              <div>
                <h4>Tópicos & Seções Dinâmicas ({topics.length})</h4>
                <p className="admin-sec-sub">
                  Seções temáticas organizadas dinamicamente dentro de cada Bairro.
                </p>
              </div>
              <Button
                variant="gold"
                size="sm"
                iconLeft={<Plus size={16} />}
                onClick={handleOpenNewTopic}
              >
                + ADICIONAR TÓPICO
              </Button>
            </div>

            {/* Aviso de Regra de Negócio: Tópicos vazios não aparecem */}
            <div className="topic-rule-alert glass-panel">
              <Sparkles size={18} color="#00B4D8" />
              <div>
                <strong>Regra Automática de Exibição:</strong> Se um bairro não tiver nenhum local cadastrado em um tópico (ex: "Passeios" em Manaíra), a seção <strong>NÃO</strong> existirá na página do bairro. Assim que um local for adicionado, a seção surgirá automaticamente!
              </div>
            </div>

            <div className="admin-topics-list">
              {topics.map((topic, index) => {
                const linkedPlaces = allPlaces.filter((p) => {
                  const tIds = p.topicIds || [];
                  return tIds.includes(topic.id) || tIds.includes(topic.slug);
                });

                return (
                  <div
                    key={topic.id}
                    className="admin-topic-item glass-panel"
                    style={{ borderLeft: `4px solid ${topic.accentColor}` }}
                  >
                    <div className="topic-item-left">
                      <span className="topic-position-badge">#{topic.position || index + 1}</span>
                      <div className="topic-item-info">
                        <div className="topic-item-header">
                          <h4 className="topic-item-title">{topic.name}</h4>
                          <span className="topic-item-slug">/{topic.slug}</span>
                          <span
                            className="topic-accent-dot"
                            style={{ backgroundColor: topic.accentColor }}
                            title={`Cor: ${topic.accentColor}`}
                          />
                        </div>
                        <p className="topic-item-desc">{topic.description}</p>
                      </div>
                    </div>

                    <div className="topic-item-right">
                      <span className="topic-places-badge">
                        <MapPin size={12} />
                        <span>{linkedPlaces.length} locais vinculados</span>
                      </span>

                      {/* Controles de Reordenação */}
                      <div className="topic-reorder-buttons">
                        <button
                          type="button"
                          className="reorder-arrow-btn"
                          disabled={index === 0}
                          onClick={() => handleMoveTopicPosition(index, 'up')}
                          title="Subir Posição"
                        >
                          ⬆️
                        </button>
                        <button
                          type="button"
                          className="reorder-arrow-btn"
                          disabled={index === topics.length - 1}
                          onClick={() => handleMoveTopicPosition(index, 'down')}
                          title="Descer Posição"
                        >
                          ⬇️
                        </button>
                      </div>

                      <div className="topic-item-actions">
                        <button
                          className="action-icon-btn edit"
                          onClick={() => handleEditTopic(topic)}
                          title="Editar Tópico"
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          className="action-icon-btn delete"
                          onClick={() => handleDeleteTopic(topic.id, topic.name)}
                          title="Excluir Tópico"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* ABA: MODALIDADES DO CATÁLOGO (TIPOS DE ESTABELECIMENTO) */}
        {/* ======================================================== */}
        {activeTab === 'categories' && (
          <div className="admin-tab-content">
            {!isEditingModality ? (
              <>
                <div className="admin-toolbar">
                  <div>
                    <h4>Modalidades do Catálogo ({modalities.length})</h4>
                    <p className="admin-sec-sub">
                      Classificação visível no topo do card do estabelecimento (ex: Praias, Restaurante, Bar, Quiosque de Praia, Salão de Beleza).
                    </p>
                  </div>
                  <Button
                    variant="gold"
                    size="sm"
                    iconLeft={<Plus size={16} />}
                    onClick={handleOpenNewModality}
                  >
                    Nova Modalidade
                  </Button>
                </div>

                <div className="categories-grid-cards">
                  {modalities.map((mod) => (
                    <div
                      key={mod.id}
                      className="category-admin-card glass-panel"
                      style={{ borderLeft: '4px solid #00B4D8' }}
                    >
                      <div className="cat-card-top">
                        <span className="cat-color-indicator" style={{ backgroundColor: '#00B4D8' }} />
                        <h4 className="cat-card-title">{mod.name}</h4>
                        <div className="cat-card-actions">
                          <button
                            className="action-icon-btn edit"
                            onClick={() => handleEditModality(mod)}
                            title="Editar Modalidade"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            className="action-icon-btn delete"
                            onClick={() => handleDeleteModality(mod.id, mod.name)}
                            title="Excluir Modalidade"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                      <p className="cat-card-desc">
                        {mod.description || 'Tipo de estabelecimento turístico em João Pessoa.'}
                      </p>
                      <span className="cat-id-code">Código: {mod.slug || mod.id}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <form className="admin-form glass-panel" onSubmit={handleSaveModality}>
                <div className="form-header-row">
                  <h4>{editingModality.id ? `Editar: ${editingModality.name}` : 'Nova Modalidade'}</h4>
                  <button type="button" className="close-form-btn" onClick={() => setIsEditingModality(false)}>
                    <X size={18} />
                  </button>
                </div>

                <div className="form-group">
                  <label>Nome da Modalidade *</label>
                  <input
                    type="text"
                    value={editingModality.name || ''}
                    onChange={(e) => setEditingModality({ ...editingModality, name: e.target.value })}
                    placeholder="Ex: Praias, Restaurante, Bar, Quiosque de Praia, Salão de Beleza..."
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Descrição da Modalidade</label>
                  <input
                    type="text"
                    value={editingModality.description || ''}
                    onChange={(e) => setEditingModality({ ...editingModality, description: e.target.value })}
                    placeholder="Breve explicação do tipo de local ou serviço"
                  />
                </div>

                <div className="form-actions-row">
                  <Button type="button" variant="outline" onClick={() => setIsEditingModality(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit" variant="gold" iconLeft={<Save size={16} />}>
                    Salvar Modalidade
                  </Button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* ABA 7: ROTEIROS TURÍSTICOS */}
        {/* ======================================================== */}
        {activeTab === 'itineraries' && (
          <div className="admin-tab-content">
            <div className="admin-toolbar">
              <h4>Roteiros Ativos ({itineraries.length})</h4>
            </div>

            <div className="itineraries-admin-grid">
              {itineraries.map((itin) => (
                <div key={itin.id} className="itin-admin-card glass-panel">
                  <img src={itin.featuredImage} alt={itin.title} className="itin-card-thumb" />
                  <div className="itin-card-info">
                    <Badge variant="gold" size="sm">{itin.durationLabel}</Badge>
                    <h4 className="itin-card-title">{itin.title}</h4>
                    <p className="itin-card-desc">{itin.description}</p>
                    <div className="itin-card-meta">
                      <span>Ritmo: {itin.pace}</span>
                      <span>Custo: {itin.estimatedCost}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* ABA 8: USUÁRIOS & CLIENTES */}
        {/* ======================================================== */}
        {activeTab === 'users' && (
          <div className="admin-tab-content">
            <div className="admin-toolbar">
              <div className="toolbar-search-wrap">
                <Search size={16} />
                <input
                  type="text"
                  placeholder="Buscar por nome, e-mail ou telefone..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="admin-places-table-wrap glass-panel hide-mobile">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Cliente</th>
                    <th>E-mail</th>
                    <th>Telefone / WhatsApp</th>
                    <th>Status</th>
                    <th>Cadastro</th>
                    <th style={{ textAlign: 'right' }}>Ação de Acesso</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((u) => (
                    <tr key={u.id}>
                      <td>
                        <strong>{u.name}</strong>
                      </td>
                      <td>{u.email}</td>
                      <td>
                        {u.phone ? (
                          <a
                            href={`https://wa.me/55${u.phone.replace(/\D/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="client-whatsapp-badge"
                            title="Conversar com cliente via WhatsApp"
                          >
                            <MessageCircle size={14} color="#25D366" />
                            <span>{u.phone}</span>
                          </a>
                        ) : (
                          <span style={{ color: 'var(--text-muted)', fontSize: '0.825rem' }}>—</span>
                        )}
                      </td>
                      <td>
                        {u.accessStatus === 'active' ? (
                          <Badge variant="emerald" icon={<CheckCircle2 size={12} />}>VIP Vitalício</Badge>
                        ) : (
                          <Badge variant="subtle">Visitante</Badge>
                        )}
                      </td>
                      <td>{u.createdAt}</td>
                      <td style={{ textAlign: 'right' }}>
                        {u.accessStatus === 'active' ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRevokeUser(u.id, u.name)}
                          >
                            Revogar
                          </Button>
                        ) : (
                          <Button
                            variant="gold"
                            size="sm"
                            iconLeft={<Crown size={14} />}
                            onClick={() => handleGrantUser(u.id, u.name)}
                          >
                            Conceder VIP
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* LISTA RESPONSIVA DE USUÁRIOS NO MOBILE */}
            <div className="admin-users-mobile-list show-mobile-only">
              {filteredUsers.length === 0 ? (
                <div className="empty-results-box glass-panel">
                  <p>Nenhum cliente encontrado.</p>
                </div>
              ) : (
                filteredUsers.map((u) => (
                  <div key={u.id} className="admin-mobile-user-card glass-panel">
                    <div className="mobile-user-card-info">
                      <strong className="mobile-user-name">{u.name}</strong>
                      <span className="mobile-user-email">{u.email}</span>
                      {u.phone && (
                        <div className="mobile-user-phone-row">
                          <a
                            href={`https://wa.me/55${u.phone.replace(/\D/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="client-whatsapp-badge"
                          >
                            <MessageCircle size={13} color="#25D366" />
                            <span>{u.phone}</span>
                          </a>
                        </div>
                      )}
                      <div className="mobile-user-status">
                        {u.accessStatus === 'active' ? (
                          <Badge variant="emerald" icon={<CheckCircle2 size={12} />}>VIP Vitalício</Badge>
                        ) : (
                          <Badge variant="subtle">Visitante</Badge>
                        )}
                        <span className="mobile-user-date">Cadastrado em {u.createdAt}</span>
                      </div>
                    </div>
                    <div className="mobile-user-card-action">
                      {u.accessStatus === 'active' ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRevokeUser(u.id, u.name)}
                          className="w-full"
                        >
                          Revogar Acesso VIP
                        </Button>
                      ) : (
                        <Button
                          variant="gold"
                          size="sm"
                          iconLeft={<Crown size={14} />}
                          onClick={() => handleGrantUser(u.id, u.name)}
                          className="w-full"
                        >
                          Conceder Acesso VIP
                        </Button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* ABA 9: GESTÃO DE AFILIADOS & PARCEIROS DE INDICAÇÃO */}
        {/* ======================================================== */}
        {activeTab === 'affiliates' && (
          <div className="admin-tab-content">
            <div className="admin-toolbar">
              <div className="toolbar-search-wrap">
                <Search size={16} />
                <input
                  type="text"
                  placeholder="Buscar afiliado por nome, código, fone ou e-mail..."
                  value={affiliateSearch}
                  onChange={(e) => setAffiliateSearch(e.target.value)}
                />
              </div>

              <div className="toolbar-actions">
                <Button
                  variant="gold"
                  size="md"
                  iconLeft={<Plus size={16} />}
                  onClick={handleOpenNewAffiliate}
                >
                  Novo Afiliado
                </Button>
              </div>
            </div>

            {/* KPI Cards de Afiliados */}
            <div className="metrics-cards-grid">
              <div className="metric-stat-card glass-panel">
                <span className="metric-label">Afiliados Cadastrados</span>
                <h3 className="metric-val text-gradient-gold">{affiliates.length}</h3>
                <span className="metric-sub">{affiliates.filter((a) => a.status === 'active').length} parceiros ativos</span>
              </div>

              <div className="metric-stat-card glass-panel">
                <span className="metric-label">Cliques / Scans Gerados</span>
                <h3 className="metric-val text-gradient-cyan">
                  {affiliates.reduce((acc, a) => acc + (a.clicksCount || 0), 0)}
                </h3>
                <span className="metric-sub">Tráfego total de afiliados</span>
              </div>

              <div className="metric-stat-card glass-panel">
                <span className="metric-label">Vendas por Afiliados</span>
                <h3 className="metric-val text-gradient-gold">
                  {affiliates.reduce((acc, a) => acc + (a.salesCount || 0), 0)}
                </h3>
                <span className="metric-sub">
                  R$ {affiliates.reduce((acc, a) => acc + (a.totalRevenue || 0), 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })} faturados
                </span>
              </div>

              <div className="metric-stat-card glass-panel">
                <span className="metric-label">Comissões Devidas</span>
                <h3 className="metric-val" style={{ color: '#10B981' }}>
                  R$ {affiliates.reduce((acc, a) => acc + ((a.totalCommission || 0) - (a.paidCommission || 0)), 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </h3>
                <span className="metric-sub">
                  R$ {affiliates.reduce((acc, a) => acc + (a.paidCommission || 0), 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })} já pagos
                </span>
              </div>
            </div>

            {/* Tabela de Afiliados */}
            <div className="admin-places-table-wrap glass-panel hide-mobile">
              {filteredAffiliates.length === 0 ? (
                <div className="empty-results-box">
                  <Handshake size={32} color="#00B4D8" style={{ margin: '0 auto 0.75rem' }} />
                  <p>Nenhum afiliado cadastrado ainda.</p>
                  <Button variant="gold" size="sm" onClick={handleOpenNewAffiliate} style={{ marginTop: '0.75rem' }}>
                    Cadastrar Primeiro Afiliado
                  </Button>
                </div>
              ) : (
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Afiliado / Contato</th>
                      <th>Código & Link</th>
                      <th>Comissão</th>
                      <th>Cliques</th>
                      <th>Vendas</th>
                      <th>Saldo a Pagar</th>
                      <th>Status</th>
                      <th style={{ textAlign: 'right' }}>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAffiliates.map((aff) => {
                      const pendingCommission = (aff.totalCommission || 0) - (aff.paidCommission || 0);
                      const affiliateUrl = `${window.location.origin}/?ref=${aff.code}`;

                      return (
                        <tr key={aff.id}>
                          <td>
                            <div className="affiliate-name-cell">
                              <strong>{aff.name}</strong>
                              {aff.phone && (
                                <a
                                  href={`https://wa.me/55${aff.phone.replace(/\D/g, '')}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="client-whatsapp-badge"
                                >
                                  <MessageCircle size={12} color="#25D366" />
                                  <span>{aff.phone}</span>
                                </a>
                              )}
                            </div>
                          </td>
                          <td>
                            <div className="affiliate-code-cell">
                              <span className="affiliate-code-badge">{aff.code}</span>
                              <button
                                className="copy-link-btn"
                                onClick={() => handleCopyAffiliateLink(aff.code)}
                                title="Copiar Link de Indicação"
                                type="button"
                              >
                                <Copy size={13} />
                                <span>Copiar Link</span>
                              </button>
                            </div>
                          </td>
                          <td>
                            <Badge variant="gold">
                              {aff.commissionType === 'percentage' ? `${aff.commissionValue}%` : `R$ ${aff.commissionValue.toFixed(2)}`}
                            </Badge>
                          </td>
                          <td>
                            <span className="metric-pill-val">{aff.clicksCount || 0}</span>
                          </td>
                          <td>
                            <strong>{aff.salesCount || 0}</strong>
                            <span className="sub-table-text">
                              (R$ {(aff.totalRevenue || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })})
                            </span>
                          </td>
                          <td>
                            <span style={{ color: pendingCommission > 0 ? '#F4A261' : '#10B981', fontWeight: 700 }}>
                              R$ {pendingCommission.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </span>
                            {aff.paidCommission > 0 && (
                              <span className="sub-table-text">
                                Pago: R$ {aff.paidCommission.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                              </span>
                            )}
                          </td>
                          <td>
                            <button
                              className={`status-toggle-pill ${aff.status === 'active' ? 'active' : 'paused'}`}
                              onClick={() => handleToggleAffiliateStatus(aff)}
                              title="Clique para pausar ou ativar"
                              type="button"
                            >
                              {aff.status === 'active' ? '🟢 Ativo' : '⏸️ Pausado'}
                            </button>
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            <div className="table-actions-inline">
                              <Button
                                variant="primary"
                                size="sm"
                                iconLeft={<QrCode size={13} />}
                                onClick={() => setSelectedAffiliateForQr(aff)}
                                title="Ver & Baixar QR Code do Afiliado"
                              >
                                QR Code
                              </Button>
                              {pendingCommission > 0 && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  iconLeft={<DollarSign size={13} />}
                                  onClick={() => handleOpenPayoutModal(aff)}
                                  title="Registrar pagamento de comissão"
                                >
                                  Pagar
                                </Button>
                              )}
                              <button
                                className="action-icon-btn edit"
                                onClick={() => handleEditAffiliate(aff)}
                                title="Editar Afiliado"
                                type="button"
                              >
                                <Edit2 size={15} />
                              </button>
                              <button
                                className="action-icon-btn delete"
                                onClick={() => handleDeleteAffiliate(aff.id, aff.name)}
                                title="Excluir Afiliado"
                                type="button"
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>

            {/* CARDS RESPONSIVOS DE AFILIADOS NO MOBILE */}
            <div className="admin-affiliates-mobile-list show-mobile-only">
              {filteredAffiliates.length === 0 ? (
                <div className="empty-results-box glass-panel">
                  <p>Nenhum afiliado cadastrado.</p>
                </div>
              ) : (
                filteredAffiliates.map((aff) => {
                  const pendingCommission = (aff.totalCommission || 0) - (aff.paidCommission || 0);

                  return (
                    <div key={aff.id} className="admin-mobile-affiliate-card glass-panel">
                      <div className="mobile-aff-header">
                        <div>
                          <strong className="mobile-aff-name">{aff.name}</strong>
                          <div className="affiliate-code-badge" style={{ marginTop: '0.35rem' }}>{aff.code}</div>
                        </div>
                        <button
                          className={`status-toggle-pill ${aff.status === 'active' ? 'active' : 'paused'}`}
                          onClick={() => handleToggleAffiliateStatus(aff)}
                          type="button"
                        >
                          {aff.status === 'active' ? '🟢 Ativo' : '⏸️ Pausado'}
                        </button>
                      </div>

                      {aff.phone && (
                        <a
                          href={`https://wa.me/55${aff.phone.replace(/\D/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="client-whatsapp-badge"
                          style={{ margin: '0.5rem 0' }}
                        >
                          <MessageCircle size={13} color="#25D366" />
                          <span>{aff.phone}</span>
                        </a>
                      )}

                      <div className="mobile-aff-metrics-grid">
                        <div className="mobile-aff-metric-box">
                          <span>Cliques</span>
                          <strong>{aff.clicksCount || 0}</strong>
                        </div>
                        <div className="mobile-aff-metric-box">
                          <span>Vendas</span>
                          <strong>{aff.salesCount || 0}</strong>
                        </div>
                        <div className="mobile-aff-metric-box">
                          <span>Comissão</span>
                          <strong>{aff.commissionType === 'percentage' ? `${aff.commissionValue}%` : `R$ ${aff.commissionValue}`}</strong>
                        </div>
                        <div className="mobile-aff-metric-box">
                          <span>A Receber</span>
                          <strong style={{ color: pendingCommission > 0 ? '#F4A261' : '#10B981' }}>
                            R$ {pendingCommission.toFixed(2)}
                          </strong>
                        </div>
                      </div>

                      <div className="mobile-aff-actions">
                        <Button
                          variant="outline"
                          size="sm"
                          iconLeft={<Copy size={13} />}
                          onClick={() => handleCopyAffiliateLink(aff.code)}
                          className="w-full"
                        >
                          Copiar Link
                        </Button>
                        <Button
                          variant="primary"
                          size="sm"
                          iconLeft={<QrCode size={13} />}
                          onClick={() => setSelectedAffiliateForQr(aff)}
                          className="w-full"
                        >
                          Ver QR Code
                        </Button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* ABA 10: MÉTRICAS & FINANCEIRO (DASHBOARD COMPLETO) */}
        {/* ======================================================== */}
        {activeTab === 'metrics' && (
          <div className="admin-tab-content">
            {/* Top 4 KPI Cards */}
            <div className="metrics-cards-grid">
              <div className="metric-stat-card glass-panel">
                <span className="metric-label">Faturamento Total Confirmado</span>
                <h3 className="metric-val text-gradient-gold">
                  R$ {metrics.totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </h3>
                <span className="metric-sub">
                  Ticket Médio: R$ {metrics.averageTicket.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>

              <div className="metric-stat-card glass-panel">
                <span className="metric-label">Licenças Vitalícias Vendidas</span>
                <h3 className="metric-val text-gradient-cyan">
                  {metrics.totalSales.toLocaleString('pt-BR')}
                </h3>
                <span className="metric-sub">{metrics.activeLifetimeUsers} membros ativos</span>
              </div>

              <div className="metric-stat-card glass-panel">
                <span className="metric-label">Taxa de Conversão Real</span>
                <h3 className="metric-val">{metrics.conversionRate}%</h3>
                <span className="metric-sub">{metrics.pendingUsers} visitantes cadastrados</span>
              </div>

              <div className="metric-stat-card glass-panel">
                <span className="metric-label">Divisão PIX vs Cartão</span>
                {metrics.totalSales === 0 ? (
                  <div className="payment-split-bar">
                    <div className="split-pix" style={{ width: '50%', background: 'rgba(255,255,255,0.1)' }}>PIX (0)</div>
                    <div className="split-card" style={{ width: '50%', background: 'rgba(255,255,255,0.05)' }}>Cartão (0)</div>
                  </div>
                ) : (
                  <div className="payment-split-bar">
                    <div className="split-pix" style={{ width: `${Math.round((metrics.pixSalesCount / metrics.totalSales) * 100) || 50}%` }}>
                      PIX ({Math.round((metrics.pixSalesCount / metrics.totalSales) * 100) || 0}%)
                    </div>
                    <div className="split-card" style={{ width: `${100 - (Math.round((metrics.pixSalesCount / metrics.totalSales) * 100) || 50)}%` }}>
                      Cartão ({100 - (Math.round((metrics.pixSalesCount / metrics.totalSales) * 100) || 0)}%)
                    </div>
                  </div>
                )}
                <span className="metric-sub">
                  {metrics.pixSalesCount} via PIX • {metrics.cardSalesCount} via Cartão
                </span>
              </div>
            </div>

            {/* SEÇÃO DE GRÁFICOS VISUAIS */}
            <div className="metrics-charts-row">
              {/* Gráfico 1: Performance de Vendas por Período */}
              <div className="metric-chart-card glass-panel">
                <div className="chart-header">
                  <div>
                    <h4 className="chart-title">Receita & Volume de Vendas</h4>
                    <span className="chart-subtitle">Desempenho financeiro dinâmico do Guia</span>
                  </div>
                  <Badge variant="gold" icon={<TrendingUp size={12} />}>
                    Tempo Real
                  </Badge>
                </div>

                <div className="analytics-bars-container">
                  {['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'].map((day, idx) => {
                    // Barras dinâmicas
                    const salesInDay = idx === 6 ? metrics.totalSales : 0;
                    const heightPercent = metrics.totalSales > 0 ? (idx === 6 ? 90 : 15) : 8;

                    return (
                      <div key={day} className="chart-bar-column">
                        <div className="chart-bar-track">
                          <div
                            className="chart-bar-fill"
                            style={{
                              height: `${heightPercent}%`,
                              background: idx === 6 ? 'linear-gradient(to top, #00B4D8, #F4A261)' : 'rgba(255,255,255,0.1)'
                            }}
                          >
                            <span className="chart-bar-tooltip">
                              {idx === 6 ? `R$ ${metrics.totalRevenue.toFixed(2)}` : 'R$ 0,00'}
                            </span>
                          </div>
                        </div>
                        <span className="chart-bar-label">{day}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Gráfico 2: Canais de Aquisição & Afiliados */}
              <div className="metric-chart-card glass-panel">
                <div className="chart-header">
                  <div>
                    <h4 className="chart-title">Origem de Vendas por Canal</h4>
                    <span className="chart-subtitle">Distribuição entre tráfego direto, afiliados e totens</span>
                  </div>
                </div>

                <div className="channel-distribution-list">
                  <div className="channel-item">
                    <div className="channel-info">
                      <span className="channel-name">🌐 Acesso Direto / Orgânico</span>
                      <strong className="channel-val">
                        {Math.max(0, metrics.totalSales - affiliates.reduce((acc, a) => acc + a.salesCount, 0))} vendas
                      </strong>
                    </div>
                    <div className="channel-bar-bg">
                      <div className="channel-bar-fill" style={{ width: metrics.totalSales > 0 ? '70%' : '0%', background: '#00B4D8' }} />
                    </div>
                  </div>

                  <div className="channel-item">
                    <div className="channel-info">
                      <span className="channel-name">🤝 Afiliados & Promotores</span>
                      <strong className="channel-val">
                        {affiliates.reduce((acc, a) => acc + a.salesCount, 0)} vendas
                      </strong>
                    </div>
                    <div className="channel-bar-bg">
                      <div className="channel-bar-fill" style={{ width: metrics.totalSales > 0 ? '30%' : '0%', background: '#F4A261' }} />
                    </div>
                  </div>

                  <div className="channel-item">
                    <div className="channel-info">
                      <span className="channel-name">📱 Displays & Totens QR Code</span>
                      <strong className="channel-val">
                        {qrChannels.reduce((acc, q) => acc + (q.conversionCount || 0), 0)} scans
                      </strong>
                    </div>
                    <div className="channel-bar-bg">
                      <div className="channel-bar-fill" style={{ width: '20%', background: '#10B981' }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* SEÇÃO: HISTÓRICO RECENTE DE VENDAS (LIVE STREAM) */}
            <div className="metric-recent-sales-wrap glass-panel">
              <div className="recent-sales-header">
                <h4 className="chart-title">Transações & Vendas Recentes</h4>
                <span className="chart-subtitle">Últimos pedidos confirmados na plataforma</span>
              </div>

              {paymentService.getTransactions().length === 0 ? (
                <div className="empty-transactions-box">
                  <p>Nenhuma transação registrada ainda.</p>
                </div>
              ) : (
                <div className="admin-places-table-wrap">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Pedido ID</th>
                        <th>Comprador</th>
                        <th>Método</th>
                        <th>Valor</th>
                        <th>Data</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paymentService.getTransactions().slice(0, 10).map((tx) => (
                        <tr key={tx.id}>
                          <td>
                            <strong style={{ fontFamily: 'monospace', color: '#00B4D8' }}>{tx.orderId}</strong>
                          </td>
                          <td>
                            <strong>{tx.userName || 'Cliente'}</strong>
                            <span className="sub-table-text">{tx.userEmail}</span>
                          </td>
                          <td>
                            {tx.paymentMethod === 'pix' ? (
                              <Badge variant="cyan" icon={<QrCode size={12} />}>PIX BACEN</Badge>
                            ) : (
                              <Badge variant="gold" icon={<CreditCard size={12} />}>Cartão de Crédito</Badge>
                            )}
                          </td>
                          <td>
                            <strong>R$ {(tx.amount || 39.90).toFixed(2)}</strong>
                          </td>
                          <td>{new Date(tx.createdAt).toLocaleDateString('pt-BR')}</td>
                          <td>
                            {tx.status === 'approved' ? (
                              <Badge variant="emerald" icon={<CheckCircle2 size={12} />}>Aprovado</Badge>
                            ) : (
                              <Badge variant="warning" icon={<Clock size={12} />}>Pendente</Badge>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* ABA 10: LOGS & AUDITORIA */}
        {/* ======================================================== */}
        {activeTab === 'logs' && (
          <div className="admin-tab-content">
            <div className="logs-timeline glass-panel">
              {systemLogs.map((log) => (
                <div key={log.id} className="log-timeline-row">
                  <div className="log-time-col">
                    <Clock size={13} color="#00B4D8" />
                    <span>{log.timestamp}</span>
                  </div>
                  <div className="log-info-col">
                    <strong>{log.title}</strong>
                    <p>{log.details}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* ABA 11: SEGURANÇA & ALTERAÇÃO DE LOGIN / SENHA */}
        {/* ======================================================== */}
        {activeTab === 'security' && (
          <div className="admin-tab-content">
            <div className="security-settings-grid">
              {/* Card de Formulário de Troca */}
              <form className="admin-form glass-panel" onSubmit={handleUpdateAdminCredentials}>
                <div className="form-header-row">
                  <div className="sec-form-title-group">
                    <ShieldCheck size={20} color="#F4A261" />
                    <h4>Alterar Login e Senha do Administrador</h4>
                  </div>
                  <button
                    type="button"
                    className="toggle-pass-visibility-btn"
                    onClick={() => setShowSecurityPass(!showSecurityPass)}
                  >
                    {showSecurityPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>

                <div className="form-group">
                  <label>Usuário / E-mail do Administrador</label>
                  <div className="input-icon-wrap">
                    <UserIcon size={16} className="input-prefix-icon" />
                    <input
                      type="text"
                      value={newAdminUser}
                      onChange={(e) => setNewAdminUser(e.target.value)}
                      placeholder="admin ou admin@jampaexperience.com.br"
                      required
                    />
                  </div>
                  <span className="input-hint-sub">Você usará este usuário/e-mail para entrar em /PainelAdmin01</span>
                </div>

                <div className="form-group">
                  <label>Senha Atual do Administrador *</label>
                  <div className="input-icon-wrap">
                    <KeyRound size={16} className="input-prefix-icon" />
                    <input
                      type={showSecurityPass ? 'text' : 'password'}
                      value={currentAdminPassInput}
                      onChange={(e) => setCurrentAdminPassInput(e.target.value)}
                      placeholder="Digite sua senha atual para autorizar..."
                      required
                    />
                  </div>
                </div>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label>Nova Senha</label>
                    <div className="input-icon-wrap">
                      <Lock size={16} className="input-prefix-icon" />
                      <input
                        type={showSecurityPass ? 'text' : 'password'}
                        value={newAdminPass}
                        onChange={(e) => setNewAdminPass(e.target.value)}
                        placeholder="Mínimo de 6 caracteres..."
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Confirmar Nova Senha</label>
                    <div className="input-icon-wrap">
                      <Lock size={16} className="input-prefix-icon" />
                      <input
                        type={showSecurityPass ? 'text' : 'password'}
                        value={newAdminPassConfirm}
                        onChange={(e) => setNewAdminPassConfirm(e.target.value)}
                        placeholder="Repita a nova senha..."
                      />
                    </div>
                  </div>
                </div>

                <div className="form-actions-row">
                  <Button
                    type="button"
                    variant="outline"
                    iconLeft={<RefreshCw size={14} />}
                    onClick={handleResetToDefaultCreds}
                  >
                    Restaurar Padrão
                  </Button>
                  <Button
                    type="submit"
                    variant="gold"
                    iconLeft={<Save size={16} />}
                  >
                    SALVAR NOVAS CREDENCIAIS
                  </Button>
                </div>
              </form>

              {/* Card Informativo */}
              <div className="security-info-side-card glass-panel">
                <div className="side-card-badge">
                  <Info size={16} color="#00B4D8" />
                  <span>GERENCIAMENTO DE ACESSO & SEGURANÇA</span>
                </div>

                <h4 className="side-card-heading">Proteção de Nível Comercial</h4>
                <p className="side-card-desc">
                  Suas credenciais são protegidas com chave mestra e persistência permanente.
                </p>

                <div className="creds-reference-box">
                  <span className="ref-label">Usuário Ativo:</span>
                  <strong className="ref-val">{currentAdminUser}</strong>
                </div>

                <div className="security-tips-list">
                  <div className="sec-tip-row">
                    <CheckCircle2 size={15} color="#10B981" />
                    <span>Acesso liberado apenas na rota <strong>/PainelAdmin01</strong></span>
                  </div>
                  <div className="sec-tip-row">
                    <CheckCircle2 size={15} color="#10B981" />
                    <span>Bloqueio automático após tentativas incorretas</span>
                  </div>
                  <div className="sec-tip-row">
                    <CheckCircle2 size={15} color="#10B981" />
                    <span>Sessão protegida e persistente</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* MODAL DE CADASTRO / EDIÇÃO DE PARCEIRO COMERCIAL */}
        {/* ======================================================== */}
        <Modal
          isOpen={isPartnerModalOpen}
          onClose={() => setIsPartnerModalOpen(false)}
          title={editingPartner?.id ? `Editar Parceiro: ${editingPartner.name || ''}` : 'Adicionar Novo Parceiro Comercial'}
          maxWidth="820px"
        >
          <form onSubmit={handleSavePartnerSubmit} className="partner-form-modal">
            <div className="form-grid-2">
              <div className="form-group sm-col-span-2">
                <label>Nome do Estabelecimento / Empresa Parceira *</label>
                <input
                  type="text"
                  value={partnerFormName}
                  onChange={(e) => setPartnerFormName(e.target.value)}
                  placeholder="Ex: Mangaí Restaurante, Bar do Cuscuz, Catamarã Tambaú..."
                  required
                />
              </div>

              <div className="form-group">
                <label>Destino / Local Vinculado *</label>
                <select
                  value={partnerFormPlaceId}
                  onChange={(e) => setPartnerFormPlaceId(e.target.value)}
                  required
                >
                  {allPlaces.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.neighborhood})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Nível da Parceria</label>
                <select
                  value={partnerFormLevel}
                  onChange={(e) => setPartnerFormLevel(e.target.value as PartnershipLevel)}
                >
                  <option value="Diamante">Diamante (Selo Destaque Máximo)</option>
                  <option value="Ouro">Ouro (Parceiro Especial)</option>
                  <option value="Prata">Prata (Parceiro Verificado)</option>
                  <option value="Bronze">Bronze (Parceiro Básico)</option>
                  <option value="Exclusivo">Exclusivo (Membros VIP)</option>
                  <option value="Oficial">Oficial Jampa Experience</option>
                </select>
              </div>

              <div className="form-group sm-col-span-2">
                <label>Endereço Completo</label>
                <input
                  type="text"
                  value={partnerFormAddress}
                  onChange={(e) => setPartnerFormAddress(e.target.value)}
                  placeholder="Ex: Av. Edson Ramalho, 696 - Manaíra, João Pessoa - PB"
                />
              </div>

              <div className="form-group sm-col-span-2">
                <div className="label-with-action">
                  <label>Link de Localização no Google Maps</label>
                  {partnerFormMapsUrl && (
                    <a
                      href={partnerFormMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="quick-test-link"
                    >
                      <ExternalLink size={12} />
                      <span>Testar link no Maps</span>
                    </a>
                  )}
                </div>
                <input
                  type="url"
                  value={partnerFormMapsUrl}
                  onChange={(e) => setPartnerFormMapsUrl(e.target.value)}
                  placeholder="https://maps.google.com/?q=..."
                />
              </div>

              <div className="form-group sm-col-span-2">
                <label>Descrição do Parceiro (Independente do Local)</label>
                <textarea
                  rows={3}
                  value={partnerFormDesc}
                  onChange={(e) => setPartnerFormDesc(e.target.value)}
                  placeholder="Descreva o que o parceiro oferece, especialidades gastronômicas, serviços e diferenciais..."
                />
              </div>

              <div className="form-group">
                <label>Benefício / Cortesia para Membros *</label>
                <input
                  type="text"
                  value={partnerFormBenefit}
                  onChange={(e) => setPartnerFormBenefit(e.target.value)}
                  placeholder="Ex: 10% de desconto no cardápio / 1 Drink cortesia"
                  required
                />
              </div>

              <div className="form-group">
                <label>Código do Cupom de Desconto</label>
                <input
                  type="text"
                  value={partnerFormCoupon}
                  onChange={(e) => setPartnerFormCoupon(e.target.value.toUpperCase())}
                  placeholder="Ex: JAMPA10, MANAIRAVIP"
                />
              </div>

              <div className="form-group sm-col-span-2">
                <label>Instruções de Resgate do Benefício</label>
                <input
                  type="text"
                  value={partnerFormInstructions}
                  onChange={(e) => setPartnerFormInstructions(e.target.value)}
                  placeholder="Ex: Apresente o código do cupom ou o comprovante VIP ao garçom no momento da conta."
                />
              </div>

              <div className="form-group">
                <label>WhatsApp Direto (Apenas Números)</label>
                <input
                  type="text"
                  value={partnerFormWhatsapp}
                  onChange={(e) => setPartnerFormWhatsapp(e.target.value)}
                  placeholder="Ex: 83999991111"
                />
              </div>

              <div className="form-group">
                <label>Instagram @perfil</label>
                <input
                  type="text"
                  value={partnerFormInstagram}
                  onChange={(e) => setPartnerFormInstagram(e.target.value)}
                  placeholder="Ex: @mangairestaurante"
                />
              </div>

              <div className="form-group">
                <label>Telefone Fixo / Comercial</label>
                <input
                  type="text"
                  value={partnerFormPhone}
                  onChange={(e) => setPartnerFormPhone(e.target.value)}
                  placeholder="Ex: 8332461244"
                />
              </div>

              <div className="form-group">
                <label>Website Oficial</label>
                <input
                  type="url"
                  value={partnerFormWebsite}
                  onChange={(e) => setPartnerFormWebsite(e.target.value)}
                  placeholder="https://www.mangai.com.br"
                />
              </div>
            </div>

            <div className="partner-form-footer">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsPartnerModalOpen(false)}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="gold"
                iconLeft={<Save size={15} />}
              >
                Salvar Parceiro Comercial
              </Button>
            </div>
          </form>
        </Modal>

        {/* ======================================================== */}
        {/* MODAL DE CADASTRO / EDIÇÃO DE BAIRRO & DICAS DO BAIRRO */}
        {/* ======================================================== */}
        <Modal
          isOpen={isNeighborhoodModalOpen}
          onClose={() => setIsNeighborhoodModalOpen(false)}
          title={editingNeighborhood?.id ? `Editar Bairro: ${editingNeighborhood.name || ''}` : 'Adicionar Novo Bairro / Região'}
          maxWidth="750px"
        >
          {editingNeighborhood && (
            <form onSubmit={handleSaveNeighborhood} className="partner-form-modal">
              <div className="form-grid-2">
                <div className="form-group sm-col-span-2">
                  <label>Nome do Bairro / Região *</label>
                  <input
                    type="text"
                    value={editingNeighborhood.name || ''}
                    onChange={(e) => setEditingNeighborhood({ ...editingNeighborhood, name: e.target.value })}
                    placeholder="Ex: Manaíra, Cabo Branco, Tambaú, Conde..."
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Slug na URL (Identificador Único)</label>
                  <input
                    type="text"
                    value={editingNeighborhood.slug || ''}
                    onChange={(e) => setEditingNeighborhood({ ...editingNeighborhood, slug: e.target.value.toLowerCase() })}
                    placeholder="Ex: manaira, cabo-branco, conde"
                  />
                </div>

                <div className="form-group">
                  <label>URL da Foto de Capa do Bairro</label>
                  <input
                    type="url"
                    value={editingNeighborhood.coverImage || ''}
                    onChange={(e) => setEditingNeighborhood({ ...editingNeighborhood, coverImage: e.target.value })}
                    placeholder="https://images.unsplash.com/photo-..."
                  />
                </div>

                <div className="form-group sm-col-span-2">
                  <label>Descrição Rica & Guia Introdutório</label>
                  <textarea
                    rows={3}
                    value={editingNeighborhood.description || ''}
                    onChange={(e) => setEditingNeighborhood({ ...editingNeighborhood, description: e.target.value })}
                    placeholder="Fale sobre o clima, características, polo gastronômico, orla, segurança..."
                  />
                </div>
              </div>

              {/* SEÇÃO DE DICAS SECRETAS & MELHORES PRÁTICAS DO BAIRRO (TEXTUAL) */}
              <div className="neighborhood-tips-edit-box glass-panel" style={{ marginTop: '1rem', padding: '1rem', borderRadius: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', margin: 0 }}>
                    <Sparkles size={15} color="#00B4D8" />
                    <strong>Dicas Secretas & Melhores Práticas do Bairro ({editingNeighborhood.tips ? editingNeighborhood.tips.length : 0})</strong>
                  </label>
                  <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Dicas textuais exibidas no Guia do Bairro</span>
                </div>

                {/* Lista de Dicas */}
                <div className="neighborhood-tips-items" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  {editingNeighborhood.tips && editingNeighborhood.tips.length > 0 ? (
                    editingNeighborhood.tips.map((tipText, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0.75rem', background: 'rgba(0,0,0,0.25)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
                        <span style={{ fontSize: '0.85rem', color: '#F1F5F9' }}>💡 {tipText}</span>
                        <button
                          type="button"
                          className="action-icon-btn delete"
                          onClick={() => handleRemoveTipFromEditingNeighborhood(idx)}
                          title="Remover dica"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    ))
                  ) : (
                    <p style={{ fontSize: '0.8rem', color: '#64748B', margin: '0.25rem 0' }}>Nenhuma dica textual adicionada a este bairro ainda.</p>
                  )}
                </div>

                {/* Adicionar Nova Dica */}
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="text"
                    value={newNeighborhoodTipInput}
                    onChange={(e) => setNewNeighborhoodTipInput(e.target.value)}
                    placeholder="Digite uma dica secreta do bairro..."
                    style={{ flex: 1, padding: '0.45rem 0.75rem', background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#F8FAFC', fontSize: '0.85rem' }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTipToEditingNeighborhood();
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddTipToEditingNeighborhood}
                  >
                    + Adicionar Dica
                  </Button>
                </div>
              </div>

              <div className="partner-form-footer" style={{ marginTop: '1.25rem' }}>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setIsNeighborhoodModalOpen(false)}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="gold"
                  iconLeft={<Save size={15} />}
                >
                  Salvar Bairro & Dicas
                </Button>
              </div>
            </form>
          )}
        </Modal>

        {/* ======================================================== */}
        {/* MODAL DE CADASTRO / EDIÇÃO DE TÓPICO DINÂMICO */}
        {/* ======================================================== */}
        <Modal
          isOpen={isTopicModalOpen}
          onClose={() => setIsTopicModalOpen(false)}
          title={editingTopic?.id ? `Editar Tópico: ${editingTopic.name || ''}` : 'Adicionar Novo Tópico / Seção'}
          maxWidth="600px"
        >
          {editingTopic && (
            <form onSubmit={handleSaveTopic} className="partner-form-modal">
              <div className="form-grid-2">
                <div className="form-group sm-col-span-2">
                  <label>Nome do Tópico / Seção *</label>
                  <input
                    type="text"
                    value={editingTopic.name || ''}
                    onChange={(e) => setEditingTopic({ ...editingTopic, name: e.target.value })}
                    placeholder="Ex: Gastronomia, Bares & Botecos, Serviços, Saúde, Passeios..."
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Slug (Identificador)</label>
                  <input
                    type="text"
                    value={editingTopic.slug || ''}
                    onChange={(e) => setEditingTopic({ ...editingTopic, slug: e.target.value.toLowerCase() })}
                    placeholder="Ex: gastronomia, bares-botecos, servicos"
                  />
                </div>

                <div className="form-group">
                  <label>Cor de Destaque (Hex)</label>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <input
                      type="color"
                      value={editingTopic.accentColor || '#00B4D8'}
                      onChange={(e) => setEditingTopic({ ...editingTopic, accentColor: e.target.value })}
                      style={{ width: '40px', height: '38px', padding: '2px', border: 'none', borderRadius: '6px', cursor: 'pointer', background: 'transparent' }}
                    />
                    <input
                      type="text"
                      value={editingTopic.accentColor || '#00B4D8'}
                      onChange={(e) => setEditingTopic({ ...editingTopic, accentColor: e.target.value })}
                      placeholder="#00B4D8"
                      style={{ flex: 1 }}
                    />
                  </div>
                </div>

                <div className="form-group sm-col-span-2">
                  <label>Subtítulo / Descrição da Seção</label>
                  <input
                    type="text"
                    value={editingTopic.description || ''}
                    onChange={(e) => setEditingTopic({ ...editingTopic, description: e.target.value })}
                    placeholder="Ex: Sabores marcantes da culinária paraibana e frutos do mar frescos"
                  />
                </div>

                <div className="form-group">
                  <label>Nome do Ícone Lucide</label>
                  <input
                    type="text"
                    value={editingTopic.iconName || 'Compass'}
                    onChange={(e) => setEditingTopic({ ...editingTopic, iconName: e.target.value })}
                    placeholder="Ex: UtensilsCrossed, GlassWater, Compass, Camera..."
                  />
                </div>

                <div className="form-group">
                  <label>Posição / Ordem de Exibição</label>
                  <input
                    type="number"
                    value={editingTopic.position || 1}
                    onChange={(e) => setEditingTopic({ ...editingTopic, position: parseInt(e.target.value) || 1 })}
                    min={1}
                  />
                </div>
              </div>

              <div className="partner-form-footer" style={{ marginTop: '1.25rem' }}>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setIsTopicModalOpen(false)}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="gold"
                  iconLeft={<Save size={15} />}
                >
                  Salvar Tópico
                </Button>
              </div>
            </form>
          )}
        </Modal>

        {/* ======================================================== */}
        {/* MODAL DE CADASTRO / EDIÇÃO DE AFILIADO */}
        {/* ======================================================== */}
        <Modal
          isOpen={isAffiliateModalOpen}
          onClose={() => setIsAffiliateModalOpen(false)}
          title={editingAffiliate?.id ? `Editar Afiliado: ${editingAffiliate.name || ''}` : 'Cadastrar Novo Afiliado / Promotor'}
          maxWidth="640px"
        >
          <form onSubmit={handleSaveAffiliateSubmit} className="partner-form-modal">
            <div className="form-grid-2">
              <div className="form-group sm-col-span-2">
                <label>Nome do Afiliado / Estabelecimento / Influencer *</label>
                <input
                  type="text"
                  value={affiliateFormName}
                  onChange={(e) => {
                    setAffiliateFormName(e.target.value);
                    if (!editingAffiliate?.id && !affiliateFormCode) {
                      setAffiliateFormCode(generateAffiliateCodeFromName(e.target.value));
                    }
                  }}
                  placeholder="Ex: Pousada Tambaú, Guia Carlos Silva, Dicas de Jampa..."
                  required
                />
              </div>

              <div className="form-group">
                <div className="label-with-action">
                  <label>Código de Indicação (Cupom) *</label>
                  <button
                    type="button"
                    className="quick-test-link"
                    onClick={() => setAffiliateFormCode(generateAffiliateCodeFromName(affiliateFormName || 'AF'))}
                  >
                    Gerar Código
                  </button>
                </div>
                <input
                  type="text"
                  value={affiliateFormCode}
                  onChange={(e) => setAffiliateFormCode(e.target.value.toUpperCase().replace(/[^A-Z0-9_-]/g, ''))}
                  placeholder="Ex: TAMBAU20, CARLOSPB, GUIAJOAO"
                  required
                />
                <span className="input-hint-sub">Link: https://jampaexperience.online/?ref={affiliateFormCode || 'CODIGO'}</span>
              </div>

              <div className="form-group">
                <label>WhatsApp do Afiliado (com DDD)</label>
                <div className="input-icon-wrap">
                  <Phone size={15} className="input-prefix-icon" />
                  <input
                    type="tel"
                    value={affiliateFormPhone}
                    onChange={(e) => setAffiliateFormPhone(e.target.value)}
                    placeholder="(83) 99999-9999"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>E-mail do Afiliado (opcional)</label>
                <input
                  type="email"
                  value={affiliateFormEmail}
                  onChange={(e) => setAffiliateFormEmail(e.target.value)}
                  placeholder="afiliado@email.com"
                />
              </div>

              <div className="form-group">
                <label>Tipo de Comissão</label>
                <select
                  value={affiliateFormType}
                  onChange={(e) => setAffiliateFormType(e.target.value as 'percentage' | 'fixed')}
                >
                  <option value="percentage">Porcentagem (%) por Venda</option>
                  <option value="fixed">Valor Fixo (R$) por Venda</option>
                </select>
              </div>

              <div className="form-group sm-col-span-2">
                <label>
                  Valor da Comissão {affiliateFormType === 'percentage' ? '(em %)' : '(em R$)'} *
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="1"
                  value={affiliateFormValue}
                  onChange={(e) => setAffiliateFormValue(parseFloat(e.target.value) || 0)}
                  placeholder={affiliateFormType === 'percentage' ? '25 (% = R$ 9,97 por venda)' : '10.00 (R$)'}
                  required
                />
                <span className="input-hint-sub">
                  {affiliateFormType === 'percentage'
                    ? `Com 25% o afiliado recebe R$ ${((39.90 * (affiliateFormValue || 25)) / 100).toFixed(2)} a cada venda de R$ 39,90.`
                    : `O afiliado receberá R$ ${Number(affiliateFormValue || 0).toFixed(2)} por cada venda de R$ 39,90.`}
                </span>
              </div>

              <div className="form-group sm-col-span-2">
                <label>Anotações Internas (Chave PIX do Afiliado, Contato, etc.)</label>
                <textarea
                  rows={2}
                  value={affiliateFormNotes}
                  onChange={(e) => setAffiliateFormNotes(e.target.value)}
                  placeholder="Ex: Chave PIX: 83999999999 (Celular Nubank). Pagar todo dia 05."
                />
              </div>
            </div>

            <div className="partner-form-footer" style={{ marginTop: '1.25rem' }}>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsAffiliateModalOpen(false)}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="gold"
                iconLeft={<Save size={15} />}
              >
                Salvar Afiliado
              </Button>
            </div>
          </form>
        </Modal>

        {/* ======================================================== */}
        {/* MODAL DE VISUALIZAÇÃO & DOWNLOAD DE QR CODE DO AFILIADO */}
        {/* ======================================================== */}
        {selectedAffiliateForQr && (
          <Modal
            isOpen={Boolean(selectedAffiliateForQr)}
            onClose={() => setSelectedAffiliateForQr(null)}
            title={`Display & QR Code — ${selectedAffiliateForQr.name}`}
            maxWidth="580px"
          >
            <div className="affiliate-qr-modal-content">
              {/* Placa / Display de Balcão e Mesa */}
              <div className="affiliate-qr-display-card glass-panel" id="printable-affiliate-display">
                <div className="display-card-header">
                  <Crown size={22} color="#F4A261" />
                  <h3 className="display-card-brand">JAMPA EXPERIENCE</h3>
                  <span className="display-card-tagline">GUIA TURÍSTICO OFICIAL • JOÃO PESSOA - PB</span>
                </div>

                <div className="display-card-qr-frame">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(`https://jampaexperience.online/?ref=${selectedAffiliateForQr.code}`)}`}
                    alt={`QR Code ${selectedAffiliateForQr.name}`}
                    className="display-qr-img"
                  />
                  <div className="display-scan-badge">
                    <QrCode size={14} color="#00B4D8" />
                    <span>APONTE A CÂMERA DO CELULAR</span>
                  </div>
                </div>

                <div className="display-card-footer">
                  <p className="display-promo-text">
                    Desbloqueie roteiros secretos, praias paradisíacas e cupons VIP com desconto especial!
                  </p>
                  <div className="display-partner-badge">
                    <span>Parceiro Oficial: <strong>{selectedAffiliateForQr.name}</strong></span>
                    <span className="display-partner-code">CÓDIGO: {selectedAffiliateForQr.code}</span>
                  </div>
                </div>
              </div>

              <div className="affiliate-qr-actions-row">
                <Button
                  variant="outline"
                  size="md"
                  iconLeft={<Copy size={16} />}
                  onClick={() => handleCopyAffiliateLink(selectedAffiliateForQr.code)}
                >
                  Copiar Link
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  iconLeft={<Printer size={16} />}
                  onClick={() => window.print()}
                >
                  Imprimir Placa
                </Button>
                <a
                  href={`https://api.qrserver.com/v1/create-qr-code/?size=600x600&data=${encodeURIComponent(`https://jampaexperience.online/?ref=${selectedAffiliateForQr.code}`)}`}
                  download={`qrcode-afiliado-${selectedAffiliateForQr.code}.png`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-gold btn-md"
                  style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
                >
                  <Upload size={16} style={{ transform: 'rotate(180deg)' }} />
                  <span>Baixar QR Code</span>
                </a>
              </div>
            </div>
          </Modal>
        )}

        {/* ======================================================== */}
        {/* MODAL DE PAGAMENTO DE COMISSÃO DE AFILIADO */}
        {/* ======================================================== */}
        {selectedAffiliateForPayout && (
          <Modal
            isOpen={Boolean(selectedAffiliateForPayout)}
            onClose={() => setSelectedAffiliateForPayout(null)}
            title={`Registrar Pagamento — ${selectedAffiliateForPayout.name}`}
            maxWidth="500px"
          >
            <form onSubmit={handleConfirmPayoutSubmit} className="partner-form-modal">
              <div className="payout-summary-box glass-panel">
                <div className="payout-row">
                  <span>Comissão Total Gerada:</span>
                  <strong>R$ {(selectedAffiliateForPayout.totalCommission || 0).toFixed(2)}</strong>
                </div>
                <div className="payout-row">
                  <span>Já Pago Anteriormente:</span>
                  <span>R$ {(selectedAffiliateForPayout.paidCommission || 0).toFixed(2)}</span>
                </div>
                <div className="payout-row highlight">
                  <span>Saldo Pendente Atual:</span>
                  <strong style={{ color: '#10B981', fontSize: '1.15rem' }}>
                    R$ {((selectedAffiliateForPayout.totalCommission || 0) - (selectedAffiliateForPayout.paidCommission || 0)).toFixed(2)}
                  </strong>
                </div>
              </div>

              {selectedAffiliateForPayout.notes && (
                <div className="payout-notes-box">
                  <strong>Dados Cadastrados do Afiliado:</strong>
                  <p>{selectedAffiliateForPayout.notes}</p>
                </div>
              )}

              <div className="form-group" style={{ marginTop: '1rem' }}>
                <label>Valor a Registrar como Transferido (R$) *</label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={payoutAmountInput}
                  onChange={(e) => setPayoutAmountInput(e.target.value)}
                  placeholder="Ex: 50.00"
                  required
                />
              </div>

              <div className="partner-form-footer" style={{ marginTop: '1.25rem' }}>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setSelectedAffiliateForPayout(null)}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="gold"
                  iconLeft={<DollarSign size={16} />}
                >
                  Confirmar Pagamento
                </Button>
              </div>
            </form>
          </Modal>
        )}

        {/* ======================================================== */}
        {/* MODAL DE CADASTRO / EDIÇÃO DE PONTO QR CODE */}
        {/* ======================================================== */}
        <Modal
          isOpen={isQrChannelModalOpen}
          onClose={() => setIsQrChannelModalOpen(false)}
          title={editingQrChannel?.id ? `Editar Ponto: ${editingQrChannel.name || ''}` : 'Novo Local / Display QR Code'}
          maxWidth="600px"
        >
          <form onSubmit={handleSaveQrChannelSubmit} className="partner-form-modal">
            <div className="form-grid-2">
              <div className="form-group sm-col-span-2">
                <label>Nome do Ponto / Estabelecimento / Totem *</label>
                <input
                  type="text"
                  value={qrFormName}
                  onChange={(e) => {
                    setQrFormName(e.target.value);
                    if (!editingQrChannel?.id && !qrFormSourceCode) {
                      setQrFormSourceCode(
                        e.target.value
                          .toLowerCase()
                          .normalize('NFD')
                          .replace(/[\u0300-\u036f]/g, '')
                          .replace(/[^a-z0-9_-]/g, '_')
                          .replace(/_+/g, '_')
                      );
                    }
                  }}
                  placeholder="Ex: Totem Desembarque — Aeroporto Castro Pinto, Recepção — Pousada Tambaú..."
                  required
                />
              </div>

              <div className="form-group">
                <label>Categoria do Ponto</label>
                <select
                  value={qrFormCategory}
                  onChange={(e) => setQrFormCategory(e.target.value)}
                >
                  <option value="Hotelaria & Hospedagem">Hotelaria & Hospedagem</option>
                  <option value="Aeroporto & Chegada">Aeroporto & Chegada</option>
                  <option value="Gastronomia & Parceiros">Gastronomia & Parceiros</option>
                  <option value="Rodoviária & Transporte">Rodoviária & Transporte</option>
                  <option value="Pontos Turísticos & Praias">Pontos Turísticos & Praias</option>
                  <option value="Comércio & Serviços">Comércio & Serviços</option>
                  <option value="Geral">Outro / Geral</option>
                </select>
              </div>

              <div className="form-group">
                <label>Identificador de Origem (src) *</label>
                <input
                  type="text"
                  value={qrFormSourceCode}
                  onChange={(e) =>
                    setQrFormSourceCode(
                      e.target.value
                        .toLowerCase()
                        .normalize('NFD')
                        .replace(/[\u0300-\u036f]/g, '')
                        .replace(/[^a-z0-9_-]/g, '_')
                    )
                  }
                  placeholder="Ex: aeroporto_jampa, pousada_tambau"
                  required
                />
              </div>

              <div className="form-group sm-col-span-2">
                <span className="input-hint-sub" style={{ display: 'block', padding: '0.5rem 0.75rem', background: 'rgba(0,0,0,0.2)', borderRadius: '6px', fontFamily: 'monospace', color: '#00B4D8' }}>
                  Link gerado: https://jampaexperience.online/?src={qrFormSourceCode || 'origem'}
                </span>
              </div>
            </div>

            <div className="partner-form-footer" style={{ marginTop: '1.25rem' }}>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsQrChannelModalOpen(false)}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="gold"
                iconLeft={<Save size={15} />}
              >
                Salvar Local / Ponto
              </Button>
            </div>
          </form>
        </Modal>

        {/* ======================================================== */}
        {/* MODAL DE VISUALIZAÇÃO & DOWNLOAD DE DISPLAY DO PONTO */}
        {/* ======================================================== */}
        {selectedQrChannelForDisplay && (
          <Modal
            isOpen={Boolean(selectedQrChannelForDisplay)}
            onClose={() => setSelectedQrChannelForDisplay(null)}
            title={`Display de Balcão & Mesa — ${selectedQrChannelForDisplay.name}`}
            maxWidth="580px"
          >
            <div className="affiliate-qr-modal-content">
              {/* Placa / Display de Balcão e Mesa */}
              <div className="affiliate-qr-display-card glass-panel" id="printable-channel-display">
                <div className="display-card-header">
                  <Crown size={22} color="#F4A261" />
                  <h3 className="display-card-brand">JAMPA EXPERIENCE</h3>
                  <span className="display-card-tagline">GUIA TURÍSTICO OFICIAL • JOÃO PESSOA - PB</span>
                </div>

                <div className="display-card-qr-frame">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(selectedQrChannelForDisplay.targetUrl)}&margin=10`}
                    alt={`QR Code ${selectedQrChannelForDisplay.name}`}
                    className="display-qr-img"
                  />
                  <div className="display-scan-badge">
                    <QrCode size={14} color="#00B4D8" />
                    <span>APONTE A CÂMERA DO CELULAR</span>
                  </div>
                </div>

                <div className="display-card-footer">
                  <p className="display-promo-text">
                    Desbloqueie roteiros secretos, praias paradisíacas e cupons VIP com desconto especial!
                  </p>
                  <div className="display-partner-badge">
                    <span>Ponto Oficial: <strong>{selectedQrChannelForDisplay.name}</strong></span>
                    <span className="display-partner-code">ORIGEM: {selectedQrChannelForDisplay.sourceCode}</span>
                  </div>
                </div>
              </div>

              <div className="affiliate-qr-actions-row">
                <Button
                  variant="outline"
                  size="md"
                  iconLeft={<Copy size={16} />}
                  onClick={() => handleCopyQrChannelLink(selectedQrChannelForDisplay.targetUrl)}
                >
                  Copiar Link
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  iconLeft={<Printer size={16} />}
                  onClick={() => window.print()}
                >
                  Imprimir Placa
                </Button>
                <a
                  href={`https://api.qrserver.com/v1/create-qr-code/?size=600x600&data=${encodeURIComponent(selectedQrChannelForDisplay.targetUrl)}&margin=10`}
                  download={`qrcode-${selectedQrChannelForDisplay.sourceCode}.png`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-gold btn-md"
                  style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
                >
                  <Upload size={16} style={{ transform: 'rotate(180deg)' }} />
                  <span>Baixar QR Code</span>
                </a>
              </div>
            </div>
          </Modal>
        )}
      </div>

      <style>{`
        /* ======================================================== */
        /* ESTILOS DE CLIENTES & WHATSAPP */
        /* ======================================================== */
        .client-whatsapp-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.3rem 0.65rem;
          background: rgba(37, 211, 102, 0.12);
          border: 1px solid rgba(37, 211, 102, 0.3);
          border-radius: var(--radius-full);
          color: #25D366;
          font-size: 0.825rem;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .client-whatsapp-badge:hover {
          background: rgba(37, 211, 102, 0.22);
          border-color: #25D366;
          transform: translateY(-1px);
        }

        .mobile-user-phone-row {
          margin: 0.35rem 0 0.5rem;
        }

        /* ======================================================== */
        /* ESTILOS DE AFILIADOS & PARCEIROS */
        /* ======================================================== */
        .affiliate-name-cell {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .affiliate-code-cell {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .affiliate-code-badge {
          display: inline-block;
          padding: 0.2rem 0.5rem;
          background: rgba(244, 162, 97, 0.15);
          border: 1px solid rgba(244, 162, 97, 0.4);
          border-radius: 6px;
          color: #F4A261;
          font-family: monospace;
          font-weight: 700;
          font-size: 0.85rem;
          letter-spacing: 0.05em;
        }

        .copy-link-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 6px;
          padding: 0.2rem 0.45rem;
          color: #94A3B8;
          font-size: 0.75rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .copy-link-btn:hover {
          background: rgba(0, 180, 216, 0.15);
          border-color: #00B4D8;
          color: #00B4D8;
        }

        .status-toggle-pill {
          border: none;
          padding: 0.25rem 0.6rem;
          border-radius: var(--radius-full);
          font-size: 0.775rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .status-toggle-pill.active {
          background: rgba(16, 185, 129, 0.15);
          color: #10B981;
          border: 1px solid rgba(16, 185, 129, 0.3);
        }

        .status-toggle-pill.paused {
          background: rgba(239, 68, 68, 0.15);
          color: #EF4444;
          border: 1px solid rgba(239, 68, 68, 0.3);
        }

        .admin-mobile-affiliate-card {
          padding: 1.25rem;
          border-radius: var(--radius-lg);
          margin-bottom: 1rem;
        }

        .mobile-aff-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 0.75rem;
        }

        .mobile-aff-name {
          font-size: 1.05rem;
          color: #F8FAFC;
        }

        .mobile-aff-metrics-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0.5rem;
          margin: 0.75rem 0;
          background: rgba(0, 0, 0, 0.2);
          border-radius: 8px;
          padding: 0.65rem;
        }

        .mobile-aff-metric-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .mobile-aff-metric-box span {
          font-size: 0.7rem;
          color: var(--text-muted);
        }

        .mobile-aff-metric-box strong {
          font-size: 0.85rem;
          color: #F8FAFC;
          margin-top: 0.15rem;
        }

        .mobile-aff-actions {
          display: flex;
          gap: 0.5rem;
          margin-top: 0.75rem;
        }

        /* ======================================================== */
        /* MODAL DE QR CODE & DISPLAY DE BALCÃO */
        /* ======================================================== */
        .affiliate-qr-modal-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.5rem;
        }

        .affiliate-qr-display-card {
          width: 100%;
          max-width: 420px;
          padding: 2rem 1.5rem;
          border-radius: var(--radius-xl);
          background: linear-gradient(145deg, #0d1b2a 0%, #07101a 100%);
          border: 2px solid rgba(244, 162, 97, 0.4);
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.5), inset 0 0 20px rgba(244, 162, 97, 0.05);
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.25rem;
        }

        .display-card-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.35rem;
        }

        .display-card-brand {
          font-family: var(--font-display);
          font-size: 1.35rem;
          font-weight: 850;
          color: #F8FAFC;
          letter-spacing: 0.06em;
          margin: 0;
        }

        .display-card-tagline {
          font-size: 0.725rem;
          font-weight: 700;
          color: #F4A261;
          letter-spacing: 0.1em;
        }

        .display-card-qr-frame {
          background: #FFFFFF;
          padding: 1.25rem;
          border-radius: 16px;
          display: flex;
          flex-direction: column;
          align-items: center;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.4);
        }

        .display-qr-img {
          width: 220px;
          height: 220px;
          object-fit: contain;
          display: block;
        }

        .display-scan-badge {
          margin-top: 0.75rem;
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.75rem;
          font-weight: 800;
          color: #07101a;
          letter-spacing: 0.05em;
        }

        .display-promo-text {
          font-size: 0.85rem;
          color: #CBD5E1;
          line-height: 1.4;
          margin: 0;
        }

        .display-partner-badge {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px dashed rgba(244, 162, 97, 0.5);
          border-radius: 8px;
          padding: 0.6rem 1rem;
          margin-top: 0.5rem;
          font-size: 0.85rem;
          color: #F8FAFC;
        }

        .display-partner-code {
          font-family: monospace;
          color: #F4A261;
          font-weight: 800;
          letter-spacing: 0.08em;
        }

        .affiliate-qr-actions-row {
          display: flex;
          gap: 0.75rem;
          width: 100%;
          justify-content: center;
          flex-wrap: wrap;
        }

        .payout-summary-box {
          padding: 1.25rem;
          border-radius: var(--radius-md);
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .payout-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.9rem;
          color: #CBD5E1;
        }

        .payout-row.highlight {
          padding-top: 0.5rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .payout-notes-box {
          background: rgba(0, 0, 0, 0.25);
          border-radius: 8px;
          padding: 0.85rem;
          margin-top: 0.75rem;
          font-size: 0.825rem;
        }

        .payout-notes-box strong {
          display: block;
          color: #00B4D8;
          margin-bottom: 0.25rem;
        }

        .payout-notes-box p {
          margin: 0;
          color: #94A3B8;
        }

        /* ======================================================== */
        /* ESTILOS DO DASHBOARD FINANCEIRO & GRÁFICOS */
        /* ======================================================== */
        .metrics-charts-row {
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          gap: 1.25rem;
          margin-top: 1.25rem;
        }

        @media (max-width: 900px) {
          .metrics-charts-row {
            grid-template-columns: 1fr;
          }
        }

        .metric-chart-card {
          padding: 1.5rem;
          border-radius: var(--radius-lg);
          display: flex;
          flex-direction: column;
        }

        .chart-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1.5rem;
        }

        .chart-title {
          margin: 0;
          font-family: var(--font-display);
          font-size: 1.1rem;
          color: #F8FAFC;
        }

        .chart-subtitle {
          font-size: 0.8rem;
          color: var(--text-muted);
        }

        .analytics-bars-container {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          height: 170px;
          padding-top: 1rem;
          gap: 0.75rem;
        }

        .chart-bar-column {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          height: 100%;
        }

        .chart-bar-track {
          width: 100%;
          max-width: 38px;
          height: 130px;
          background: rgba(255, 255, 255, 0.03);
          border-radius: 8px 8px 0 0;
          display: flex;
          align-items: flex-end;
          position: relative;
        }

        .chart-bar-fill {
          width: 100%;
          border-radius: 8px 8px 0 0;
          transition: height 0.5s ease;
          position: relative;
        }

        .chart-bar-tooltip {
          position: absolute;
          top: -28px;
          left: 50%;
          transform: translateX(-50%);
          background: #0F172A;
          border: 1px solid rgba(255, 255, 255, 0.15);
          color: #F8FAFC;
          padding: 0.15rem 0.4rem;
          border-radius: 4px;
          font-size: 0.675rem;
          white-space: nowrap;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.2s ease;
        }

        .chart-bar-column:hover .chart-bar-tooltip {
          opacity: 1;
        }

        .chart-bar-label {
          font-size: 0.75rem;
          color: var(--text-muted);
          margin-top: 0.5rem;
        }

        .channel-distribution-list {
          display: flex;
          flex-direction: column;
          gap: 1.15rem;
        }

        .channel-item {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }

        .channel-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.85rem;
        }

        .channel-name {
          color: #CBD5E1;
        }

        .channel-val {
          color: #F8FAFC;
          font-weight: 700;
        }

        .channel-bar-bg {
          height: 8px;
          background: rgba(255, 255, 255, 0.06);
          border-radius: 4px;
          overflow: hidden;
        }

        .channel-bar-fill {
          height: 100%;
          border-radius: 4px;
          transition: width 0.5s ease;
        }

        .metric-recent-sales-wrap {
          margin-top: 1.25rem;
          padding: 1.5rem;
          border-radius: var(--radius-lg);
        }

        .recent-sales-header {
          margin-bottom: 1rem;
        }

        /* ======================================================== */
        /* ESTILOS DE GESTÃO DE BAIRROS & DICAS DO BAIRRO */
        /* ======================================================== */
        .admin-neighborhoods-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 1.25rem;
        }

        .admin-neighborhood-card {
          border-radius: var(--radius-lg);
          overflow: hidden;
          background: rgba(12, 20, 31, 0.85);
          border: 1px solid rgba(255, 255, 255, 0.08);
          display: flex;
          flex-direction: column;
        }

        .neigh-card-cover-wrap {
          position: relative;
          height: 140px;
          overflow: hidden;
        }

        .neigh-card-cover-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .admin-neighborhood-card:hover .neigh-card-cover-img {
          transform: scale(1.05);
        }

        .neigh-card-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(7, 12, 20, 0.9) 10%, rgba(7, 12, 20, 0.3) 100%);
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 1rem;
        }

        .neigh-card-title {
          margin: 0;
          font-family: var(--font-display);
          font-size: 1.15rem;
          font-weight: 800;
          color: #F8FAFC;
        }

        .neigh-card-slug {
          font-size: 0.75rem;
          color: #00B4D8;
          font-family: monospace;
        }

        .neigh-card-body {
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
          flex: 1;
        }

        .neigh-card-desc {
          margin: 0;
          font-size: 0.825rem;
          color: #94A3B8;
          line-height: 1.4;
        }

        .neigh-card-metrics {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .neigh-metric-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.25rem 0.6rem;
          background: rgba(255, 255, 255, 0.05);
          border-radius: var(--radius-full);
          font-size: 0.75rem;
          color: #CBD5E1;
        }

        .neigh-tips-preview-box {
          background: rgba(0, 0, 0, 0.25);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 8px;
          padding: 0.65rem 0.85rem;
        }

        .neigh-tips-preview-label {
          display: block;
          font-size: 0.75rem;
          color: #00B4D8;
          margin-bottom: 0.35rem;
        }

        .neigh-tips-preview-list {
          margin: 0;
          padding-left: 1.2rem;
          font-size: 0.78rem;
          color: #94A3B8;
          line-height: 1.35;
        }

        .neigh-tips-preview-list .more-tips {
          list-style: none;
          margin-left: -1.2rem;
          margin-top: 0.25rem;
          font-size: 0.7rem;
          color: #64748B;
          font-style: italic;
        }

        .neigh-card-actions {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.5rem;
          margin-top: auto;
          padding-top: 0.5rem;
          border-top: 1px solid rgba(255, 255, 255, 0.06);
        }

        /* ======================================================== */
        /* ESTILOS DE GESTÃO DE TÓPICOS & SEÇÕES DINÂMICAS */
        /* ======================================================== */
        .topic-rule-alert {
          display: flex;
          align-items: center;
          gap: 0.85rem;
          padding: 0.85rem 1.25rem;
          background: rgba(0, 180, 216, 0.08);
          border: 1px solid rgba(0, 180, 216, 0.3);
          border-radius: var(--radius-md);
          margin-bottom: 1.25rem;
          font-size: 0.85rem;
          color: #CBD5E1;
          line-height: 1.4;
        }

        .admin-topics-list {
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
        }

        .admin-topic-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 1.25rem;
          border-radius: var(--radius-md);
          background: rgba(12, 20, 31, 0.8);
          border: 1px solid rgba(255, 255, 255, 0.08);
          flex-wrap: wrap;
          gap: 1rem;
        }

        .topic-item-left {
          display: flex;
          align-items: center;
          gap: 1rem;
          flex: 1;
          min-width: 260px;
        }

        .topic-position-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.06);
          color: #00B4D8;
          font-family: var(--font-display);
          font-weight: 800;
          font-size: 0.85rem;
        }

        .topic-item-header {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          margin-bottom: 0.2rem;
        }

        .topic-item-title {
          margin: 0;
          font-family: var(--font-display);
          font-size: 1rem;
          font-weight: 700;
          color: #F8FAFC;
        }

        .topic-item-slug {
          font-size: 0.75rem;
          color: #64748B;
          font-family: monospace;
        }

        .topic-accent-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
        }

        .topic-item-desc {
          margin: 0;
          font-size: 0.8rem;
          color: #94A3B8;
        }

        .topic-item-right {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .topic-places-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.3rem 0.7rem;
          background: rgba(255, 255, 255, 0.05);
          border-radius: var(--radius-full);
          font-size: 0.78rem;
          color: #CBD5E1;
        }

        .topic-reorder-buttons {
          display: flex;
          gap: 0.25rem;
        }

        .reorder-arrow-btn {
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 6px;
          padding: 0.3rem 0.5rem;
          font-size: 0.75rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .reorder-arrow-btn:hover:not(:disabled) {
          background: rgba(0, 180, 216, 0.2);
          border-color: #00B4D8;
        }

        .reorder-arrow-btn:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }

        .topic-item-actions {
          display: flex;
          gap: 0.35rem;
        }

        /* CHECKBOXES INTERATIVOS DE TÓPICOS NO FORMULÁRIO */
        .topic-checkboxes-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-top: 0.4rem;
        }

        .topic-tag-check-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.4rem 0.85rem;
          border-radius: var(--radius-full);
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #94A3B8;
          font-size: 0.825rem;
          font-family: var(--font-sans);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .topic-tag-check-btn:hover {
          color: #F8FAFC;
          border-color: rgba(255, 255, 255, 0.25);
        }

        .topic-tag-check-btn.active {
          background: rgba(0, 180, 216, 0.18);
          border-color: #00B4D8;
          color: #00B4D8;
          font-weight: 600;
        }

        .check-box-indicator {
          font-weight: 800;
          font-size: 0.75rem;
        }

        /* ======================================================== */
        /* ESTILOS DE PARCEIROS COMERCIAIS & GESTÃO RELACIONAL */
        /* ======================================================== */
        .partner-edit-section {
          padding: 1.25rem;
          border-radius: var(--radius-lg);
          border: 1px solid rgba(244, 162, 97, 0.25);
          background: rgba(244, 162, 97, 0.03);
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .partner-sec-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 0.75rem;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        .partner-sec-title-group {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
        }

        .partner-sec-title-group h5 {
          margin: 0;
          font-family: var(--font-display);
          font-size: 1rem;
          font-weight: 700;
          color: #F8FAFC;
        }

        .sec-helper-text {
          margin: 0.2rem 0 0 0;
          font-size: 0.8125rem;
          color: #94A3B8;
        }

        .linked-partners-container {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .linked-partners-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .linked-count-label {
          font-size: 0.8125rem;
          font-weight: 600;
          color: #F4A261;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .empty-linked-partners-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 2rem 1.5rem;
          background: rgba(255, 255, 255, 0.02);
          border: 1px dashed rgba(255, 255, 255, 0.12);
          border-radius: var(--radius-md);
          gap: 0.5rem;
        }

        .empty-linked-partners-box p {
          margin: 0;
          font-weight: 600;
          color: #E2E8F0;
          font-size: 0.9375rem;
        }

        .empty-linked-partners-box span {
          font-size: 0.8125rem;
          color: #94A3B8;
          max-width: 480px;
        }

        .linked-partners-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 1rem;
        }

        .linked-partner-card {
          padding: 1rem;
          border-radius: var(--radius-md);
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(15, 23, 42, 0.6);
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
          transition: border-color 0.2s ease, transform 0.2s ease;
        }

        .linked-partner-card:hover {
          border-color: rgba(244, 162, 97, 0.4);
          transform: translateY(-2px);
        }

        .l-partner-top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 0.5rem;
        }

        .l-partner-name-wrap {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .l-partner-name {
          margin: 0;
          font-size: 0.9375rem;
          font-weight: 700;
          color: #FFFFFF;
        }

        .l-partner-level-badge {
          display: inline-block;
          font-size: 0.6875rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          padding: 0.15rem 0.5rem;
          border-radius: var(--radius-full);
          background: rgba(244, 162, 97, 0.15);
          border: 1px solid rgba(244, 162, 97, 0.4);
          color: #F4A261;
        }

        .l-partner-actions {
          display: flex;
          align-items: center;
          gap: 0.35rem;
        }

        .l-action-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          padding: 0.25rem 0.5rem;
          font-size: 0.75rem;
          font-weight: 600;
          border-radius: var(--radius-sm);
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(255, 255, 255, 0.05);
          color: #E2E8F0;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .l-action-btn:hover {
          background: rgba(255, 255, 255, 0.15);
        }

        .l-action-btn.edit:hover {
          border-color: #00B4D8;
          color: #00B4D8;
        }

        .l-action-btn.delete:hover {
          border-color: #EF4444;
          color: #EF4444;
        }

        .l-partner-address {
          margin: 0;
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.8125rem;
          color: #94A3B8;
        }

        .l-partner-maps-link {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.75rem;
          color: #00B4D8;
          text-decoration: underline;
        }

        .l-partner-desc {
          margin: 0;
          font-size: 0.8125rem;
          color: #CBD5E1;
          line-height: 1.4;
        }

        .l-partner-benefit-box {
          padding: 0.65rem 0.85rem;
          border-radius: var(--radius-sm);
          background: rgba(244, 162, 97, 0.08);
          border: 1px solid rgba(244, 162, 97, 0.25);
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }

        .benefit-row {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.8125rem;
          color: #F8FAFC;
        }

        .benefit-row strong {
          color: #F4A261;
        }

        .coupon-row {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.75rem;
          color: #94A3B8;
        }

        .coupon-code-pill {
          padding: 0.1rem 0.45rem;
          background: rgba(0, 180, 216, 0.15);
          border: 1px solid rgba(0, 180, 216, 0.4);
          border-radius: var(--radius-sm);
          color: #00B4D8;
          font-family: monospace;
          font-size: 0.75rem;
          letter-spacing: 0.05em;
        }

        .redemption-text {
          margin: 0;
          font-size: 0.75rem;
          color: #94A3B8;
        }

        .l-partner-contacts-row {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          flex-wrap: wrap;
          margin-top: 0.25rem;
        }

        .l-contact-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          padding: 0.2rem 0.5rem;
          font-size: 0.75rem;
          border-radius: var(--radius-full);
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(255, 255, 255, 0.04);
          color: #CBD5E1;
          text-decoration: none;
          transition: all 0.15s ease;
        }

        .l-contact-pill:hover {
          background: rgba(255, 255, 255, 0.12);
        }

        .l-contact-pill.whatsapp {
          border-color: rgba(37, 211, 102, 0.3);
          color: #25D366;
        }

        .l-contact-pill.instagram {
          border-color: rgba(225, 48, 108, 0.3);
          color: #E1306C;
        }

        /* GESTÃO GERAL DE PARCEIROS (ABA 3) */
        .partners-filter-toolbar {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          border-radius: var(--radius-md);
          margin-bottom: 1.25rem;
          flex-wrap: wrap;
        }

        .global-partners-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
          gap: 1.25rem;
        }

        .global-partner-card {
          padding: 1.25rem;
          border-radius: var(--radius-lg);
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(15, 23, 42, 0.6);
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
          transition: border-color 0.2s ease, transform 0.2s ease;
        }

        .global-partner-card:hover {
          border-color: rgba(244, 162, 97, 0.4);
          transform: translateY(-2px);
        }

        .g-partner-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 0.75rem;
        }

        .g-partner-badges {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.35rem;
          flex-wrap: wrap;
        }

        .g-partner-place-tag {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          font-size: 0.6875rem;
          font-weight: 600;
          color: #00B4D8;
          padding: 0.15rem 0.5rem;
          background: rgba(0, 180, 216, 0.1);
          border: 1px solid rgba(0, 180, 216, 0.3);
          border-radius: var(--radius-full);
        }

        .g-partner-title {
          margin: 0;
          font-family: var(--font-display);
          font-size: 1.0625rem;
          font-weight: 700;
          color: #FFFFFF;
        }

        .g-partner-actions {
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }

        .g-partner-address {
          margin: 0;
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.8125rem;
          color: #94A3B8;
          flex-wrap: wrap;
        }

        .g-partner-maps-link {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.75rem;
          color: #00B4D8;
          text-decoration: underline;
          margin-left: 0.4rem;
        }

        .g-partner-desc {
          margin: 0;
          font-size: 0.8125rem;
          color: #CBD5E1;
          line-height: 1.5;
        }

        .g-partner-benefit-box {
          padding: 0.75rem 1rem;
          border-radius: var(--radius-md);
          background: rgba(244, 162, 97, 0.08);
          border: 1px solid rgba(244, 162, 97, 0.25);
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }

        .g-partner-contacts-row {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          flex-wrap: wrap;
        }

        .partner-form-modal {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          padding: 0.5rem 0;
        }

        .partner-form-footer {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 0.75rem;
          padding-top: 1rem;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
        }

        .label-with-action {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.35rem;
        }

        .label-with-action label {
          margin-bottom: 0;
        }

        .quick-test-link {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          font-size: 0.75rem;
          color: #00B4D8;
          text-decoration: underline;
        }

        .admin-header-title {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex-wrap: wrap;
        }

        .admin-title-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.25rem 0.65rem;
          background: rgba(244, 162, 97, 0.15);
          border: 1px solid rgba(244, 162, 97, 0.4);
          border-radius: var(--radius-full);
          font-family: var(--font-display);
          font-size: 0.8125rem;
          font-weight: 800;
          color: #F4A261;
        }

        .admin-subtitle {
          font-size: 0.875rem;
          color: #94A3B8;
        }

        .admin-sec-sub {
          font-size: 0.8125rem;
          color: #94A3B8;
          margin-top: 2px;
        }

        .admin-modal-container {
          position: relative;
          display: flex;
          flex-direction: column;
          gap: var(--space-lg);
          min-height: 540px;
        }

        .admin-floating-toast {
          position: sticky;
          top: 0;
          z-index: 100;
          padding: 0.6rem 1.2rem;
          background: rgba(16, 185, 129, 0.95);
          color: #FFFFFF;
          font-family: var(--font-display);
          font-size: 0.8125rem;
          font-weight: 700;
          border-radius: var(--radius-full);
          text-align: center;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4);
        }

        .admin-tabs-nav {
          display: flex;
          gap: 0.4rem;
          border-bottom: 1px solid var(--border-subtle);
          padding-bottom: 0.5rem;
          overflow-x: auto;
        }

        .admin-tab-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.5rem 0.9rem;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-full);
          font-family: var(--font-display);
          font-size: 0.8125rem;
          font-weight: 700;
          color: #94A3B8;
          cursor: pointer;
          transition: all var(--transition-fast);
          white-space: nowrap;
        }

        .admin-tab-btn:hover {
          background: rgba(255, 255, 255, 0.08);
          color: #F8FAFC;
        }

        .admin-tab-btn.active {
          background: #F4A261;
          border-color: #F4A261;
          color: #060B11;
          box-shadow: 0 0 15px rgba(244, 162, 97, 0.35);
        }

        .admin-tab-content {
          display: flex;
          flex-direction: column;
          gap: var(--space-md);
        }

        .admin-toolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: var(--space-md);
          flex-wrap: wrap;
        }

        .toolbar-search-wrap {
          flex: 1;
          min-width: 240px;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.45rem 0.85rem;
          background: rgba(12, 20, 31, 0.8);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-full);
          color: #94A3B8;
        }

        .toolbar-search-wrap input {
          width: 100%;
          background: transparent;
          border: none;
          outline: none;
          color: #F8FAFC;
          font-size: 0.8125rem;
        }

        .admin-select {
          padding: 0.45rem 0.85rem;
          background: rgba(12, 20, 31, 0.8);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-full);
          color: #F8FAFC;
          font-size: 0.8125rem;
          outline: none;
          cursor: pointer;
        }

        .admin-places-table-wrap {
          overflow-x: auto;
          border-radius: var(--radius-lg);
          border: 1px solid var(--border-subtle);
        }

        .admin-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.8125rem;
          text-align: left;
        }

        .admin-table th {
          background: rgba(6, 11, 17, 0.95);
          color: #64748B;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          padding: 0.75rem 1rem;
          border-bottom: 1px solid var(--border-subtle);
        }

        .admin-table td {
          padding: 0.75rem 1rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.03);
          color: #CBD5E1;
        }

        .table-thumb {
          width: 44px;
          height: 44px;
          border-radius: var(--radius-sm);
          object-fit: cover;
        }

        .place-table-name {
          color: #F8FAFC;
          display: block;
        }

        .place-table-sub {
          font-size: 0.6875rem;
          color: #64748B;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .non-partner-tag {
          font-size: 0.75rem;
          color: #64748B;
        }

        .photos-counter-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          padding: 0.25rem 0.55rem;
          background: rgba(0, 180, 216, 0.12);
          border: 1px solid rgba(0, 180, 216, 0.3);
          border-radius: var(--radius-full);
          color: #38BDF8;
          font-size: 0.75rem;
          font-weight: 700;
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .photos-counter-pill:hover {
          background: #00B4D8;
          color: #060B11;
        }

        .tips-count-badge {
          padding: 0.2rem 0.5rem;
          background: rgba(244, 162, 97, 0.12);
          border-radius: var(--radius-full);
          color: #F4A261;
          font-weight: 700;
        }

        .tips-counter-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          padding: 0.25rem 0.55rem;
          background: rgba(244, 162, 97, 0.12);
          border: 1px solid rgba(244, 162, 97, 0.35);
          border-radius: var(--radius-full);
          color: #F4A261;
          font-size: 0.75rem;
          font-weight: 700;
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .tips-counter-pill:hover {
          background: #F4A261;
          color: #060B11;
          box-shadow: 0 0 12px rgba(244, 162, 97, 0.35);
        }

        .table-actions-row {
          display: flex;
          justify-content: flex-end;
          gap: 0.4rem;
        }

        .action-icon-btn {
          width: 32px;
          height: 32px;
          border-radius: var(--radius-sm);
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border-subtle);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all var(--transition-fast);
          color: #CBD5E1;
        }

        .action-icon-btn.tips-btn:hover {
          background: rgba(244, 162, 97, 0.2);
          border-color: #F4A261;
          color: #F4A261;
        }

        .action-icon-btn.edit:hover {
          background: rgba(0, 180, 216, 0.2);
          border-color: #00B4D8;
          color: #38BDF8;
        }

        .action-icon-btn.delete:hover {
          background: rgba(231, 111, 81, 0.2);
          border-color: #E76F51;
          color: #F87171;
        }

        /* FORMULÁRIO DE LOCAL & CATEGORIA */
        .admin-form {
          padding: var(--space-xl);
          border-radius: var(--radius-lg);
          border: 1px solid var(--border-medium);
          display: flex;
          flex-direction: column;
          gap: var(--space-md);
        }

        .form-header-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid var(--border-subtle);
          padding-bottom: 0.5rem;
        }

        .form-header-row h4 {
          font-family: var(--font-display);
          font-size: 1.1rem;
          font-weight: 800;
          color: #F8FAFC;
        }

        .sec-form-title-group {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .close-form-btn {
          background: none;
          border: none;
          color: #94A3B8;
          cursor: pointer;
        }

        .form-grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--space-md);
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }

        .form-group label {
          font-size: 0.75rem;
          font-weight: 700;
          color: #94A3B8;
          text-transform: uppercase;
        }

        .checkbox-toggle-group {
          justify-content: center;
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          font-size: 0.875rem;
          color: #F8FAFC;
          cursor: pointer;
          text-transform: none !important;
        }

        .checkbox-label input[type="checkbox"] {
          width: 18px;
          height: 18px;
          accent-color: #F4A261;
        }

        .partner-edit-section {
          padding: var(--space-lg);
          border-radius: var(--radius-lg);
          border-left: 4px solid #F4A261;
          display: flex;
          flex-direction: column;
          gap: var(--space-md);
          background: rgba(244, 162, 97, 0.04);
        }

        .tips-edit-section {
          padding: var(--space-lg);
          border-radius: var(--radius-lg);
          border-left: 4px solid #00B4D8;
          display: flex;
          flex-direction: column;
          gap: var(--space-md);
          background: rgba(0, 180, 216, 0.04);
        }

        .tips-sec-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #F4A261;
          font-family: var(--font-display);
          font-weight: 800;
        }

        .tips-sec-title-group {
          display: flex;
          align-items: flex-start;
          gap: 0.65rem;
        }

        .tips-sec-title-group h5 {
          font-size: 1.05rem;
          font-weight: 800;
          color: #F8FAFC;
          margin-bottom: 0.2rem;
        }

        .empty-tips-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: var(--space-lg);
          background: rgba(6, 11, 17, 0.5);
          border-radius: var(--radius-md);
          border: 1px dashed var(--border-subtle);
          color: #94A3B8;
          gap: 0.35rem;
        }

        .empty-tips-box p {
          font-weight: 700;
          color: #CBD5E1;
        }

        .empty-tips-box span {
          font-size: 0.75rem;
        }

        .add-tip-subform {
          padding: var(--space-md);
          background: rgba(6, 11, 17, 0.6);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .add-tip-subform h6 {
          font-size: 0.875rem;
          color: #F4A261;
          font-weight: 700;
        }

        .tip-form-action-row {
          display: flex;
          justify-content: flex-end;
          padding-top: 0.25rem;
        }

        .partner-sec-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #F4A261;
          font-family: var(--font-display);
          font-weight: 800;
        }

        .input-icon-wrap {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-prefix-icon {
          position: absolute;
          left: 0.75rem;
          color: #F4A261;
          pointer-events: none;
        }

        .input-icon-wrap input {
          width: 100%;
          padding-left: 2.25rem !important;
        }

        .input-hint-sub {
          font-size: 0.6875rem;
          color: #64748B;
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
          padding: 0.55rem 0.85rem;
          background: rgba(6, 11, 17, 0.9);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          color: #F8FAFC;
          font-size: 0.8125rem;
          outline: none;
          transition: border-color var(--transition-fast);
        }

        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          border-color: #00B4D8;
        }

        .form-actions-row {
          display: flex;
          justify-content: flex-end;
          gap: var(--space-sm);
          padding-top: var(--space-sm);
          border-top: 1px solid var(--border-subtle);
        }

        /* GESTOR VISUAL DE FOTOS NO FORMULÁRIO */
        .form-photos-manager-section {
          padding: var(--space-md);
          border-radius: var(--radius-lg);
          border: 1px solid var(--border-subtle);
          display: flex;
          flex-direction: column;
          gap: var(--space-sm);
          background: rgba(8, 14, 22, 0.7);
        }

        .photos-sec-header {
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
        }

        .photos-sec-title {
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }

        .photos-sec-title h5 {
          font-family: var(--font-display);
          font-size: 0.9375rem;
          font-weight: 700;
          color: #F8FAFC;
        }

        .photos-sec-sub {
          font-size: 0.75rem;
          color: #94A3B8;
        }

        .form-gallery-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
          gap: 0.75rem;
          padding: 0.5rem 0;
        }

        .form-photo-card {
          position: relative;
          border-radius: var(--radius-md);
          overflow: hidden;
          height: 105px;
          border: 1px solid var(--border-subtle);
          background: #000;
        }

        .form-photo-card.is-cover-active {
          border: 2px solid #F4A261;
          box-shadow: 0 0 15px rgba(244, 162, 97, 0.35);
        }

        .form-photo-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .photo-order-badge {
          position: absolute;
          bottom: 6px;
          right: 6px;
          background: rgba(0, 0, 0, 0.75);
          color: #CBD5E1;
          border-radius: 4px;
          padding: 1px 4px;
          font-size: 0.625rem;
          font-weight: 700;
        }

        .photo-cover-badge {
          position: absolute;
          top: 6px;
          left: 6px;
          background: rgba(10, 17, 26, 0.95);
          border: 1px solid #F4A261;
          border-radius: var(--radius-full);
          padding: 0.15rem 0.4rem;
          font-size: 0.5625rem;
          font-weight: 800;
          color: #F4A261;
          display: flex;
          align-items: center;
          gap: 0.25rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.6);
        }

        .photo-card-hover-actions {
          position: absolute;
          inset: 0;
          background: rgba(6, 11, 17, 0.8);
          backdrop-filter: blur(4px);
          opacity: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.35rem;
          padding: 0.4rem;
          transition: opacity var(--transition-fast);
        }

        .form-photo-card:hover .photo-card-hover-actions {
          opacity: 1;
        }

        .photo-action-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          padding: 0.2rem 0.45rem;
          border-radius: var(--radius-full);
          font-size: 0.6875rem;
          font-weight: 700;
          border: none;
          cursor: pointer;
          transition: transform 0.15s ease;
        }

        .photo-action-pill:hover {
          transform: scale(1.05);
        }

        .photo-action-pill.cover-btn {
          background: #F4A261;
          color: #060B11;
        }

        .photo-action-pill.delete-btn {
          background: #EF4444;
          color: #FFFFFF;
        }

        .photo-reorder-btns {
          display: flex;
          gap: 0.25rem;
        }

        .reorder-arrow-btn {
          width: 24px;
          height: 24px;
          border-radius: 4px;
          background: rgba(255, 255, 255, 0.15);
          border: 1px solid rgba(255, 255, 255, 0.3);
          color: #F8FAFC;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .reorder-arrow-btn:hover {
          background: #00B4D8;
          color: #060B11;
        }

        .add-photo-controls-row {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-top: 0.35rem;
          flex-wrap: wrap;
        }

        .photo-url-input-wrap {
          flex: 1;
          min-width: 260px;
          position: relative;
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }

        .photo-url-input-wrap input {
          flex: 1;
          padding: 0.45rem 0.75rem 0.45rem 2.2rem;
          background: rgba(6, 11, 17, 0.9);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          color: #F8FAFC;
          font-size: 0.78125rem;
        }

        .photo-upload-or-divider {
          font-size: 0.75rem;
          color: #64748B;
          font-weight: 700;
          text-transform: uppercase;
        }

        /* ABA DEDICADA DE FOTOS & GALERIA */
        .photos-manager-layout {
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: var(--space-md);
          min-height: 460px;
        }

        .photos-left-sidebar {
          padding: var(--space-md);
          border-radius: var(--radius-lg);
          display: flex;
          flex-direction: column;
          gap: var(--space-sm);
        }

        .places-photos-scroll {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
          overflow-y: auto;
          max-height: 420px;
        }

        .place-photo-select-btn {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          padding: 0.45rem 0.6rem;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid transparent;
          border-radius: var(--radius-md);
          cursor: pointer;
          transition: all var(--transition-fast);
          text-align: left;
        }

        .place-photo-select-btn:hover {
          background: rgba(255, 255, 255, 0.08);
        }

        .place-photo-select-btn.active {
          background: rgba(0, 180, 216, 0.15);
          border-color: #00B4D8;
        }

        .mini-btn-thumb {
          width: 36px;
          height: 36px;
          border-radius: var(--radius-sm);
          object-fit: cover;
          flex-shrink: 0;
        }

        .mini-btn-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .mini-name {
          font-size: 0.8125rem;
          font-weight: 700;
          color: #F8FAFC;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .mini-sub {
          font-size: 0.6875rem;
          color: #94A3B8;
        }

        .photo-count-pill {
          font-size: 0.6875rem;
          font-weight: 800;
          color: #00B4D8;
          background: rgba(0, 180, 216, 0.12);
          padding: 0.15rem 0.45rem;
          border-radius: var(--radius-full);
        }

        .photos-right-content {
          padding: var(--space-lg);
          border-radius: var(--radius-lg);
          display: flex;
          flex-direction: column;
          gap: var(--space-md);
        }

        .photos-place-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid var(--border-subtle);
          padding-bottom: 0.5rem;
        }

        .photos-place-header h4 {
          font-family: var(--font-display);
          font-size: 1.1rem;
          color: #F8FAFC;
        }

        .photos-loc-sub {
          font-size: 0.75rem;
          color: #00B4D8;
        }

        .photos-gallery-grid-main {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
          gap: 1rem;
          max-height: 280px;
          overflow-y: auto;
          padding: 0.35rem;
        }

        .photo-thumb-box {
          position: relative;
          border-radius: var(--radius-md);
          overflow: hidden;
          height: 130px;
          border: 1px solid var(--border-subtle);
          background: #000;
        }

        .photo-thumb-box.is-main-cover {
          border: 2px solid #F4A261;
          box-shadow: 0 0 15px rgba(244, 162, 97, 0.35);
        }

        .photo-full-thumb {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .main-cover-tag {
          position: absolute;
          top: 8px;
          left: 8px;
          background: rgba(10, 17, 26, 0.95);
          border: 1px solid #F4A261;
          border-radius: var(--radius-full);
          padding: 0.2rem 0.5rem;
          font-size: 0.625rem;
          font-weight: 800;
          color: #F4A261;
          display: flex;
          align-items: center;
          gap: 0.3rem;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.7);
        }

        .photo-thumb-actions {
          position: absolute;
          inset: 0;
          background: rgba(6, 11, 17, 0.8);
          backdrop-filter: blur(4px);
          opacity: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.4rem;
          padding: 0.5rem;
          transition: opacity var(--transition-fast);
        }

        .photo-thumb-box:hover .photo-thumb-actions {
          opacity: 1;
        }

        .thumb-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          padding: 0.35rem 0.65rem;
          border-radius: var(--radius-full);
          font-size: 0.75rem;
          font-weight: 700;
          border: none;
          cursor: pointer;
          transition: transform 0.15s ease;
        }

        .thumb-btn:hover {
          transform: scale(1.05);
        }

        .thumb-btn.set-cover {
          background: #F4A261;
          color: #060B11;
        }

        .thumb-btn.delete-photo {
          background: #EF4444;
          color: #FFFFFF;
        }

        .add-photo-bar-box {
          padding: var(--space-md);
          border-radius: var(--radius-md);
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
        }

        .add-photo-bar-box h5 {
          font-size: 0.8125rem;
          font-weight: 700;
          color: #F8FAFC;
        }

        .add-photo-row {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex-wrap: wrap;
        }

        .url-input-col {
          flex: 1;
          min-width: 280px;
          display: flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.35rem 0.5rem 0.35rem 0.75rem;
          background: rgba(6, 11, 17, 0.9);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
        }

        .url-input-col input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          color: #F8FAFC;
          font-size: 0.8125rem;
        }

        .or-badge {
          font-size: 0.75rem;
          color: #64748B;
          font-weight: 800;
        }

        /* PARCEIROS & ANALYTICS */
        .partner-stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: var(--space-md);
        }

        .partner-stat-card {
          padding: var(--space-lg);
          border-radius: var(--radius-lg);
          border-left: 4px solid #F4A261;
          display: flex;
          flex-direction: column;
          gap: var(--space-sm);
        }

        .partner-card-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
        }

        .partner-card-title {
          font-family: var(--font-display);
          font-size: 1rem;
          font-weight: 800;
          color: #F8FAFC;
        }

        .partner-card-cat {
          font-size: 0.75rem;
          color: #00B4D8;
        }

        .partner-benefit-pill {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.35rem 0.65rem;
          background: rgba(244, 162, 97, 0.12);
          border-radius: var(--radius-md);
          font-size: 0.75rem;
          font-weight: 700;
          color: #F4A261;
        }

        .partner-metrics-row {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0.4rem;
          margin-top: 0.25rem;
          padding-top: 0.5rem;
          border-top: 1px solid var(--border-subtle);
          text-align: center;
        }

        .p-metric-item {
          display: flex;
          flex-direction: column;
        }

        .p-metric-val {
          font-family: var(--font-display);
          font-size: 1.1rem;
          font-weight: 800;
          color: #F8FAFC;
        }

        .p-metric-lbl {
          font-size: 0.625rem;
          color: #94A3B8;
        }

        /* QR CODES */
        .qrcodes-channels-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
          gap: 1.25rem;
          margin-top: 1rem;
        }

        .qr-channel-card {
          padding: 1.25rem;
          border-radius: var(--radius-xl);
          background: rgba(11, 19, 30, 0.95);
          border: 1px solid rgba(255, 255, 255, 0.08);
          display: flex;
          gap: 1.25rem;
          align-items: center;
          transition: transform 0.2s ease, border-color 0.2s ease;
        }

        .qr-channel-card:hover {
          border-color: rgba(0, 180, 216, 0.35);
          transform: translateY(-2px);
        }

        .qr-preview-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          flex-shrink: 0;
        }

        .qr-code-img-frame {
          background: #FFFFFF;
          padding: 0.5rem;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.5);
          width: 96px;
          height: 96px;
        }

        .qr-channel-thumb-img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          display: block;
        }

        .qr-source-tag {
          font-size: 0.6875rem;
          color: #94A3B8;
          font-family: monospace;
          background: rgba(255, 255, 255, 0.05);
          padding: 0.15rem 0.4rem;
          border-radius: 4px;
          max-width: 105px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .qr-info-box {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.45rem;
          min-width: 0;
        }

        .qr-channel-name {
          font-family: var(--font-display);
          font-size: 1rem;
          font-weight: 800;
          color: #F8FAFC;
          margin: 0;
          line-height: 1.3;
        }

        .qr-link-copy {
          margin: 0;
        }

        .qr-link-copy code {
          font-size: 0.725rem;
          color: #38BDF8;
          word-break: break-all;
          background: rgba(0, 0, 0, 0.35);
          padding: 0.2rem 0.4rem;
          border-radius: 4px;
          display: inline-block;
        }

        .qr-stats-row {
          display: flex;
          gap: 0.5rem;
          margin: 0.25rem 0;
        }

        .qr-stat-badge {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 0.35rem 0.4rem;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 6px;
        }

        .qr-stat-badge strong {
          font-size: 0.875rem;
          color: #F8FAFC;
        }

        .qr-stat-badge span {
          font-size: 0.625rem;
          color: #94A3B8;
        }

        .qr-card-actions {
          display: flex;
          gap: 0.5rem;
          margin-top: 0.25rem;
        }

        @media (max-width: 600px) {
          .qr-channel-card {
            flex-direction: column;
            align-items: flex-start;
          }
          .qr-preview-box {
            width: 100%;
            flex-direction: row;
            justify-content: space-between;
          }
        }

        /* LAYOUT DE DICAS */
        .tips-manager-layout {
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: var(--space-md);
          min-height: 400px;
        }

        .tips-left-sidebar {
          padding: var(--space-md);
          border-radius: var(--radius-lg);
          display: flex;
          flex-direction: column;
          gap: var(--space-sm);
        }

        .sidebar-title {
          font-size: 0.8125rem;
          font-weight: 700;
          color: #94A3B8;
          text-transform: uppercase;
        }

        .places-tips-scroll {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
          overflow-y: auto;
          max-height: 380px;
        }

        .place-tip-select-btn {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.5rem 0.75rem;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid transparent;
          border-radius: var(--radius-md);
          color: #CBD5E1;
          font-size: 0.78125rem;
          text-align: left;
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .place-tip-select-btn:hover {
          background: rgba(255, 255, 255, 0.08);
          color: #F8FAFC;
        }

        .place-tip-select-btn.active {
          background: rgba(0, 180, 216, 0.15);
          border-color: #00B4D8;
          color: #38BDF8;
          font-weight: 700;
        }

        .tip-badge-count {
          padding: 0.15rem 0.45rem;
          background: rgba(255, 255, 255, 0.08);
          border-radius: var(--radius-full);
          font-size: 0.6875rem;
        }

        .tips-right-content {
          padding: var(--space-lg);
          border-radius: var(--radius-lg);
          display: flex;
          flex-direction: column;
          gap: var(--space-md);
        }

        .place-tips-header {
          border-bottom: 1px solid var(--border-subtle);
          padding-bottom: 0.5rem;
        }

        .place-tips-header h4 {
          font-family: var(--font-display);
          font-size: 1.05rem;
          color: #F8FAFC;
        }

        .tips-loc-sub {
          font-size: 0.75rem;
          color: #00B4D8;
        }

        .current-tips-list {
          display: flex;
          flex-direction: column;
          gap: var(--space-sm);
          max-height: 200px;
          overflow-y: auto;
        }

        .tip-admin-card {
          padding: 0.65rem 0.85rem;
          border-radius: var(--radius-md);
          border-left: 3px solid #F4A261;
        }

        .tip-card-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.25rem;
        }

        .tip-badge-tag {
          font-size: 0.6875rem;
          font-weight: 700;
          color: #F4A261;
          text-transform: uppercase;
        }

        .tip-card-title {
          font-size: 0.875rem;
          color: #F8FAFC;
          font-weight: 700;
        }

        .tip-card-desc {
          font-size: 0.78125rem;
          color: #CBD5E1;
        }

        .add-tip-form {
          padding: var(--space-md);
          background: rgba(6, 11, 17, 0.6);
          border: 1px dashed var(--border-subtle);
          border-radius: var(--radius-md);
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
        }

        .add-tip-form h5 {
          font-size: 0.8125rem;
          color: #F4A261;
          font-weight: 700;
        }

        .empty-selection-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          height: 100%;
          gap: var(--space-sm);
          color: #94A3B8;
        }

        /* CATEGORIAS */
        .categories-grid-cards {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: var(--space-md);
        }

        .category-admin-card {
          padding: var(--space-md);
          border-radius: var(--radius-md);
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }

        .cat-card-top {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .cat-color-indicator {
          width: 12px;
          height: 12px;
          border-radius: 50%;
        }

        .cat-card-title {
          font-family: var(--font-display);
          font-size: 0.95rem;
          color: #F8FAFC;
          flex-grow: 1;
        }

        .cat-card-actions {
          display: flex;
          gap: 0.3rem;
        }

        .cat-card-desc {
          font-size: 0.78125rem;
          color: #94A3B8;
        }

        .cat-id-code {
          font-size: 0.6875rem;
          color: #64748B;
        }

        /* ROTEIROS */
        .itineraries-admin-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: var(--space-md);
        }

        .itin-admin-card {
          border-radius: var(--radius-md);
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        .itin-card-thumb {
          width: 100%;
          height: 110px;
          object-fit: cover;
        }

        .itin-card-info {
          padding: var(--space-md);
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }

        .itin-card-title {
          font-family: var(--font-display);
          font-size: 0.95rem;
          color: #F8FAFC;
        }

        .itin-card-desc {
          font-size: 0.78125rem;
          color: #94A3B8;
        }

        .itin-card-meta {
          display: flex;
          justify-content: space-between;
          font-size: 0.6875rem;
          color: #00B4D8;
          font-weight: 700;
        }

        /* MÉTRICAS */
        .metrics-cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: var(--space-md);
        }

        .metric-stat-card {
          padding: var(--space-lg);
          border-radius: var(--radius-lg);
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .metric-label {
          font-size: 0.75rem;
          color: #94A3B8;
          text-transform: uppercase;
          font-weight: 700;
        }

        .metric-val {
          font-family: var(--font-display);
          font-size: 1.75rem;
          font-weight: 900;
          color: #F8FAFC;
        }

        .metric-sub {
          font-size: 0.75rem;
          color: #64748B;
        }

        .payment-split-bar {
          display: flex;
          height: 24px;
          border-radius: var(--radius-sm);
          overflow: hidden;
          margin-top: 0.5rem;
          font-size: 0.6875rem;
          font-weight: 700;
          text-align: center;
          line-height: 24px;
        }

        .split-pix {
          background: #00B4D8;
          color: #060B11;
        }

        .split-card {
          background: #F4A261;
          color: #060B11;
        }

        /* LOGS */
        .logs-timeline {
          padding: var(--space-md);
          border-radius: var(--radius-lg);
          display: flex;
          flex-direction: column;
          gap: var(--space-sm);
          max-height: 420px;
          overflow-y: auto;
        }

        .log-timeline-row {
          display: flex;
          gap: var(--space-md);
          padding: 0.65rem;
          border-radius: var(--radius-md);
          background: rgba(255, 255, 255, 0.02);
          border-left: 3px solid #00B4D8;
          font-size: 0.8125rem;
        }

        .log-time-col {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.75rem;
          color: #94A3B8;
          min-width: 140px;
        }

        .log-info-col strong {
          color: #F8FAFC;
        }

        .log-info-col p {
          color: #94A3B8;
          font-size: 0.75rem;
          margin-top: 2px;
        }

        /* SEGURANÇA */
        .security-settings-grid {
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: var(--space-lg);
        }

        .security-info-side-card {
          padding: var(--space-xl);
          border-radius: var(--radius-lg);
          display: flex;
          flex-direction: column;
          gap: var(--space-sm);
        }

        .side-card-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.6875rem;
          font-weight: 700;
          color: #00B4D8;
          text-transform: uppercase;
        }

        .side-card-heading {
          font-family: var(--font-display);
          font-size: 1.1rem;
          color: #F8FAFC;
          font-weight: 800;
        }

        .side-card-desc {
          font-size: 0.8125rem;
          color: #94A3B8;
          line-height: 1.5;
        }

        .creds-reference-box {
          padding: var(--space-md);
          background: rgba(6, 11, 17, 0.8);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
          margin: var(--space-xs) 0;
        }

        .ref-label {
          font-size: 0.6875rem;
          color: #64748B;
          text-transform: uppercase;
          font-weight: 700;
        }

        .ref-val {
          font-size: 0.875rem;
          color: #F4A261;
        }

        .security-tips-list {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
          margin-top: var(--space-xs);
        }

        .sec-tip-row {
          display: flex;
          align-items: center;
          gap: 0.45rem;
          font-size: 0.75rem;
          color: #CBD5E1;
        }

        /* ======================================================== */
        /* RESPONSIVIDADE COMPLETA DO PAINEL DO GESTOR */
        /* BREAKPOINTS: 320px, 360px, 390px, 430px, 768px, 1024px, Desktop */
        /* ======================================================== */

        .admin-portal-standalone-root {
          min-height: 100vh;
          width: 100%;
          background: #060B11;
          color: #F8FAFC;
          display: flex;
          flex-direction: column;
          box-sizing: border-box;
          position: relative;
        }

        /* HEADER DO PAINEL */
        .admin-portal-header {
          position: sticky;
          top: 0;
          z-index: 1000;
          background: rgba(10, 17, 26, 0.97);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-bottom: 1px solid rgba(244, 162, 97, 0.25);
          padding: 0.75rem 1.25rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          box-sizing: border-box;
        }

        .admin-portal-header-left {
          display: flex;
          align-items: center;
          gap: 0.85rem;
        }

        .admin-mobile-hamburger-btn {
          display: none;
          align-items: center;
          gap: 0.4rem;
          padding: 0.45rem 0.75rem;
          background: rgba(244, 162, 97, 0.12);
          border: 1px solid rgba(244, 162, 97, 0.4);
          border-radius: var(--radius-md);
          color: #F4A261;
          font-weight: 800;
          font-size: 0.8125rem;
          min-height: 44px;
          min-width: 44px;
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .admin-mobile-hamburger-btn:hover {
          background: rgba(244, 162, 97, 0.25);
        }

        .admin-portal-brand {
          display: flex;
          align-items: center;
          gap: 0.65rem;
        }

        .admin-brand-icon {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: rgba(244, 162, 97, 0.15);
          border: 1px solid rgba(244, 162, 97, 0.35);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .admin-brand-info {
          display: flex;
          flex-direction: column;
        }

        .admin-brand-name {
          font-family: var(--font-display);
          font-size: 1rem;
          font-weight: 900;
          color: #F8FAFC;
          letter-spacing: -0.01em;
          line-height: 1.2;
        }

        .admin-brand-role {
          font-size: 0.6875rem;
          font-weight: 700;
          color: #F4A261;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        .admin-portal-header-right {
          display: flex;
          align-items: center;
          gap: 0.65rem;
        }

        .admin-session-user-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          padding: 0.4rem 0.85rem;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-full);
          font-size: 0.75rem;
          color: #94A3B8;
          font-weight: 600;
        }

        .user-online-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #10B981;
          box-shadow: 0 0 8px #10B981;
        }

        .admin-header-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.45rem 0.85rem;
          border-radius: var(--radius-md);
          font-size: 0.8125rem;
          font-weight: 700;
          cursor: pointer;
          min-height: 40px;
          transition: all var(--transition-fast);
          box-sizing: border-box;
        }

        .admin-header-btn.site-btn {
          background: rgba(0, 180, 216, 0.12);
          border: 1px solid rgba(0, 180, 216, 0.35);
          color: #00B4D8;
        }

        .admin-header-btn.site-btn:hover {
          background: rgba(0, 180, 216, 0.25);
          color: #F8FAFC;
        }

        .admin-header-btn.logout-btn {
          background: rgba(231, 111, 81, 0.12);
          border: 1px solid rgba(231, 111, 81, 0.35);
          color: #F87171;
        }

        .admin-header-btn.logout-btn:hover {
          background: #E76F51;
          color: #060B11;
        }

        /* DRAWER MENU MOBILE */
        .admin-drawer-backdrop {
          position: fixed;
          inset: 0;
          z-index: 10000;
          background: rgba(3, 7, 12, 0.85);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          display: flex;
          animation: adminFade 0.2s ease-out;
        }

        .admin-drawer-panel {
          width: 320px;
          max-width: 85vw;
          height: 100%;
          background: #0A121D;
          border-right: 1px solid rgba(244, 162, 97, 0.3);
          display: flex;
          flex-direction: column;
          padding: 1.25rem;
          box-sizing: border-box;
          overflow-y: auto;
          box-shadow: 10px 0 40px rgba(0, 0, 0, 0.8);
          animation: drawerSlideIn 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .admin-drawer-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 1rem;
          border-bottom: 1px solid var(--border-subtle);
        }

        .drawer-brand-title {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-family: var(--font-display);
          font-size: 1rem;
          font-weight: 800;
          color: #F8FAFC;
        }

        .admin-drawer-close {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border-subtle);
          color: #94A3B8;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .drawer-session-box {
          padding: 0.75rem;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          margin: 1rem 0;
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
        }

        .drawer-session-label {
          font-size: 0.6875rem;
          color: #64748B;
          text-transform: uppercase;
          font-weight: 700;
        }

        .drawer-session-user {
          font-size: 0.8125rem;
          color: #F4A261;
          word-break: break-all;
        }

        .admin-drawer-nav-list {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
          flex: 1;
        }

        .drawer-tab-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          border-radius: var(--radius-md);
          background: none;
          border: 1px solid transparent;
          color: #CBD5E1;
          font-size: 0.9375rem;
          font-weight: 600;
          min-height: 48px;
          cursor: pointer;
          text-align: left;
          width: 100%;
          box-sizing: border-box;
          transition: all var(--transition-fast);
        }

        .drawer-tab-item.active {
          background: rgba(244, 162, 97, 0.15);
          border-color: rgba(244, 162, 97, 0.4);
          color: #F4A261;
          font-weight: 800;
        }

        .drawer-tab-badge {
          margin-left: auto;
          font-size: 0.6875rem;
          font-weight: 800;
          background: rgba(255, 255, 255, 0.1);
          color: #F8FAFC;
          padding: 0.15rem 0.5rem;
          border-radius: var(--radius-full);
        }

        .admin-drawer-bottom-actions {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          padding-top: 1rem;
          margin-top: 1rem;
          border-top: 1px solid var(--border-subtle);
        }

        .drawer-action-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.75rem;
          border-radius: var(--radius-md);
          font-size: 0.875rem;
          font-weight: 700;
          min-height: 44px;
          cursor: pointer;
        }

        .drawer-action-btn.site {
          background: rgba(0, 180, 216, 0.12);
          border: 1px solid rgba(0, 180, 216, 0.35);
          color: #00B4D8;
        }

        .drawer-action-btn.logout {
          background: rgba(231, 111, 81, 0.12);
          border: 1px solid rgba(231, 111, 81, 0.35);
          color: #F87171;
        }

        /* CORPO PRINCIPAL DO PAINEL */
        .admin-portal-body {
          flex: 1;
          width: 100%;
          max-width: 1440px;
          margin: 0 auto;
          padding: 1.25rem;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        /* INDICADOR DE ABA NO MOBILE */
        .admin-mobile-subnav {
          display: none;
          align-items: center;
          justify-content: space-between;
          padding: 0.75rem 1rem;
          background: rgba(12, 20, 31, 0.95);
          border: 1px solid rgba(244, 162, 97, 0.25);
          border-radius: var(--radius-lg);
          box-sizing: border-box;
        }

        .mobile-active-tab-badge {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-family: var(--font-display);
          font-size: 0.9375rem;
          font-weight: 800;
          color: #F4A261;
        }

        .mobile-switch-tab-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.4rem 0.75rem;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          color: #CBD5E1;
          font-size: 0.75rem;
          font-weight: 700;
          min-height: 38px;
          cursor: pointer;
        }

        /* CARDS DE LOCAIS PARA SMARTPHONES (390PX) */
        .admin-places-mobile-list {
          display: none;
          flex-direction: column;
          gap: 0.85rem;
          width: 100%;
        }

        .admin-mobile-place-card {
          padding: 1rem;
          border-radius: var(--radius-lg);
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          box-sizing: border-box;
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(10, 18, 28, 0.8);
        }

        .mobile-place-card-top {
          display: flex;
          gap: 0.85rem;
          align-items: flex-start;
        }

        .mobile-place-thumb {
          width: 68px;
          height: 68px;
          border-radius: var(--radius-md);
          object-fit: cover;
          flex-shrink: 0;
          border: 1px solid var(--border-subtle);
        }

        .mobile-place-info {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          flex: 1;
          min-width: 0;
        }

        .mobile-place-name {
          font-family: var(--font-display);
          font-size: 1rem;
          font-weight: 800;
          color: #F8FAFC;
          line-height: 1.2;
          word-break: break-word;
        }

        .mobile-place-neighborhood {
          font-size: 0.75rem;
          color: #94A3B8;
        }

        .mobile-place-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.35rem;
          margin-top: 0.2rem;
        }

        .mobile-place-card-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          padding-top: 0.35rem;
          border-top: 1px solid rgba(255, 255, 255, 0.04);
        }

        .mobile-meta-pill {
          font-size: 0.75rem;
          color: #CBD5E1;
          background: rgba(255, 255, 255, 0.04);
          padding: 0.2rem 0.5rem;
          border-radius: var(--radius-sm);
        }

        .mobile-place-card-actions {
          display: flex;
          gap: 0.5rem;
          margin-top: 0.25rem;
        }

        .mobile-card-action-btn {
          flex: 1;
          min-height: 44px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.35rem;
          border-radius: var(--radius-md);
          font-size: 0.8125rem;
          font-weight: 700;
          cursor: pointer;
          box-sizing: border-box;
          transition: all var(--transition-fast);
        }

        .mobile-card-action-btn.edit-btn {
          background: rgba(244, 162, 97, 0.15);
          border: 1px solid rgba(244, 162, 97, 0.4);
          color: #F4A261;
          flex: 2;
        }

        .mobile-card-action-btn.photos-btn {
          background: rgba(0, 180, 216, 0.15);
          border: 1px solid rgba(0, 180, 216, 0.4);
          color: #00B4D8;
          flex: 1.5;
        }

        .mobile-card-action-btn.delete-btn {
          background: rgba(231, 111, 81, 0.12);
          border: 1px solid rgba(231, 111, 81, 0.35);
          color: #F87171;
          flex: 0 0 44px;
        }

        /* SELETORES MOBILE (FOTOS & DICAS) */
        .mobile-place-selector {
          display: none;
          padding: 0.85rem;
          border-radius: var(--radius-lg);
          margin-bottom: 1rem;
          flex-direction: column;
          gap: 0.4rem;
        }

        .mobile-select-label {
          font-size: 0.75rem;
          font-weight: 700;
          color: #CBD5E1;
          text-transform: uppercase;
        }

        /* LISTA MOBILE DE CLIENTES */
        .admin-users-mobile-list {
          display: none;
          flex-direction: column;
          gap: 0.75rem;
          width: 100%;
        }

        .admin-mobile-user-card {
          padding: 1rem;
          border-radius: var(--radius-lg);
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          border: 1px solid rgba(255, 255, 255, 0.08);
        }

        .mobile-user-card-info {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .mobile-user-name {
          font-size: 0.95rem;
          color: #F8FAFC;
        }

        .mobile-user-email {
          font-size: 0.8125rem;
          color: #94A3B8;
          word-break: break-all;
        }

        .mobile-user-status {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-top: 0.25rem;
        }

        .mobile-user-date {
          font-size: 0.6875rem;
          color: #64748B;
        }

        /* UTILITÁRIOS RESPONSIVOS GERAIS */
        .show-mobile-only {
          display: none !important;
        }

        @keyframes drawerSlideIn {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }

        @keyframes adminFade {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        /* ======================================================== */
        /* REGRAS ESPECÍFICAS POR BREAKPOINT */
        /* ======================================================== */
        @media (max-width: 1024px) {
          .admin-mobile-hamburger-btn {
            display: inline-flex !important;
          }
          .admin-tabs-nav.hide-mobile {
            display: none !important;
          }
          .admin-mobile-subnav.show-mobile-only {
            display: flex !important;
          }
        }

        @media (max-width: 768px) {
          .hide-mobile {
            display: none !important;
          }
          .show-mobile-only {
            display: block !important;
          }
          .admin-places-mobile-list.show-mobile-only {
            display: flex !important;
          }
          .admin-users-mobile-list.show-mobile-only {
            display: flex !important;
          }
          .mobile-place-selector.show-mobile-only {
            display: flex !important;
          }

          .admin-portal-body {
            padding: 0.75rem;
            gap: 0.75rem;
          }

          .admin-toolbar {
            flex-direction: column;
            align-items: stretch;
            gap: 0.6rem;
          }

          .toolbar-search-wrap {
            width: 100%;
          }

          .toolbar-search-wrap input,
          .admin-select {
            width: 100%;
            min-height: 44px;
            font-size: 16px !important;
          }

          .form-grid-2 {
            grid-template-columns: 1fr !important;
          }

          .tips-manager-layout,
          .photos-manager-layout,
          .security-settings-grid,
          .qr-channel-card {
            grid-template-columns: 1fr !important;
          }

          .metrics-cards-grid {
            grid-template-columns: 1fr !important;
          }

          .partner-metrics-row {
            grid-template-columns: repeat(2, 1fr) !important;
          }

          .form-actions-row {
            flex-direction: column-reverse;
            gap: 0.5rem;
          }

          .form-actions-row button {
            width: 100%;
            min-height: 48px;
            justify-content: center;
          }

          .photos-gallery-grid-main {
            grid-template-columns: repeat(auto-fill, minmax(110px, 1fr)) !important;
          }

          .form-gallery-grid {
            grid-template-columns: repeat(auto-fill, minmax(95px, 1fr)) !important;
          }
        }

        @media (max-width: 480px) {
          .admin-portal-header {
            padding: 0.5rem 0.75rem;
          }
          .admin-brand-name {
            font-size: 0.875rem;
          }
          .admin-brand-role {
            font-size: 0.625rem;
          }
          .admin-brand-icon {
            width: 30px;
            height: 30px;
          }
        }
      `}</style>
    </div>
  );
};

