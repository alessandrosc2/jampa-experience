import React, { useState, useEffect, useMemo } from 'react';
import { Place, CategoryId, CategoryInfo } from './types/place';
import { User } from './types/user';
import { PaymentTransaction } from './types/payment';
import { authService } from './services/authService';
import { favoritesService } from './services/favoritesService';
import { adminService } from './services/adminService';
import { premiumContentService } from './services/premiumContentService';
import { analyticsService } from './services/analyticsService';
import { Header } from './components/landing/Header';
import { HeroSection } from './components/landing/HeroSection';
import { StatsBar } from './components/landing/StatsBar';
import { CategoryNav } from './components/landing/CategoryNav';
import { TideModal } from './components/tides/TideModal';
import { PreviewGrid } from './components/landing/PreviewGrid';
import { ItinerarySection } from './components/itineraries/ItinerarySection';
import { InteractiveMapSection } from './components/map/InteractiveMapSection';
import { PlacePreviewModal } from './components/landing/PlacePreviewModal';
import { ComparisonSection } from './components/landing/ComparisonSection';
import { OfferSection } from './components/landing/OfferSection';
import { TrustSection } from './components/landing/TrustSection';
import { FullCheckoutModal } from './components/checkout/FullCheckoutModal';
import { AuthModal } from './components/auth/AuthModal';
import { UserDashboardModal } from './components/dashboard/UserDashboardModal';
import { FavoritesModal } from './components/places/FavoritesModal';
import { AdminSecurityGatekeeper } from './components/admin/AdminSecurityGatekeeper';
import { PwaInstallBanner } from './components/pwa/PwaInstallBanner';
import { OfflineIndicator } from './components/pwa/OfflineIndicator';
import { ModeSwitcher } from './components/landing/ModeSwitcher';
import { Footer } from './components/landing/Footer';
import { MobileBottomNav } from './components/navigation/MobileBottomNav';
import { LgpdConsentBanner } from './components/legal/LgpdConsentBanner';
import { PrivacyPolicyModal } from './components/legal/PrivacyPolicyModal';
import { WhatsAppFloatingButton } from './components/common/WhatsAppFloatingButton';

export function App() {
  // Limpeza de qualquer tema claro prévio para garantir Modo Escuro Luxury Ocean e Rastreamento de Afiliados
  useEffect(() => {
    document.documentElement.removeAttribute('data-theme');
    document.body.removeAttribute('data-theme');
    try {
      localStorage.removeItem('jampa_theme');
    } catch {}

    // Rastreamento de PageView Inicial
    analyticsService.trackPageView(window.location.pathname + window.location.hash, document.title);

    // Rastreamento de Indicação de Afiliados (?ref=... ou ?af=...)
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const refCode = urlParams.get('ref') || urlParams.get('af') || urlParams.get('aff');
      if (refCode) {
        const cleanRef = refCode.trim().toUpperCase();
        localStorage.setItem('jampa_affiliate_ref', cleanRef);
        adminService.trackAffiliateClick(cleanRef);
        analyticsService.trackAffiliateReferral(cleanRef);
      }

      // Rastreamento de Canais Físicos / Totens (?src=...)
      const srcCode = urlParams.get('src');
      if (srcCode) {
        const cleanSrc = srcCode.trim().toLowerCase();
        localStorage.setItem('jampa_src_ref', cleanSrc);
        adminService.trackQrChannelScan(cleanSrc);
        analyticsService.trackQrScan(cleanSrc);
      }
    } catch (e) {
      console.warn('Erro ao rastrear código de afiliado/canal:', e);
    }
  }, []);

  // Estado do Usuário e Sessão
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const session = authService.getSession();
    return session ? session.user : null;
  });

  // Estado VIP: ativo se o usuário logado tem status ativo ou se o switcher local estiver true
  const [isVipMode, setIsVipMode] = useState<boolean>(() => {
    const session = authService.getSession();
    if (session && session.user.accessStatus === 'active') {
      return true;
    }
    return localStorage.getItem('jampa_vip_mode') === 'true';
  });

  // Estado dos Favoritos
  const [favoriteIds, setFavoriteIds] = useState<string[]>(() => {
    const userId = currentUser ? currentUser.id : 'guest';
    return favoritesService.getFavoriteIds(userId);
  });

  // Versão dinâmica para re-renderizar após alterações do CMS Admin
  const [placesVersion, setPlacesVersion] = useState(0);

  // Lista dinâmica de locais protegida por controle de acesso
  const placesList = useMemo(() => {
    return premiumContentService.getPlacesForUser(isVipMode);
  }, [isVipMode, placesVersion]);

  // Lista completa de locais para o Painel Administrativo
  const allAdminPlaces = useMemo(() => {
    return premiumContentService.getAllPremiumPlaces();
  }, [placesVersion]);

  // Categorias / Modalidades dinâmicas do Admin
  const dynamicCategories = useMemo<CategoryInfo[]>(() => {
    return adminService.getCategories();
  }, [placesVersion]);

  const [selectedCategory, setSelectedCategory] = useState<CategoryId | 'all'>('all');
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  
  // Modais
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authInitialTab, setAuthInitialTab] = useState<'login' | 'register'>('login');
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isTideModalOpen, setIsTideModalOpen] = useState(false);
  const [mobileActiveTab, setMobileActiveTab] = useState<'explore' | 'map' | 'itineraries' | 'favorites' | 'vip'>('explore');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleMobileTabSelect = (tab: 'explore' | 'map' | 'itineraries' | 'favorites' | 'vip') => {
    setMobileActiveTab(tab);
    if (tab === 'explore') {
      scrollToPreview();
    } else if (tab === 'map') {
      const el = document.getElementById('mapa');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else if (tab === 'itineraries') {
      const el = document.getElementById('roteiros');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else if (tab === 'favorites') {
      setIsFavoritesOpen(true);
    } else if (tab === 'vip') {
      if (isVipMode) {
        setIsDashboardOpen(true);
      } else {
        setIsCheckoutOpen(true);
      }
    }
  };
  // Detecção de Rota: /PainelAdmin01 isola 100% o Painel Administrativo
  const [isAdminRoute, setIsAdminRoute] = useState<boolean>(() => {
    const path = window.location.pathname.toLowerCase();
    const hash = window.location.hash.toLowerCase();
    const search = window.location.search.toLowerCase();
    return path.includes('paineladmin01') || hash.includes('paineladmin01') || search.includes('paineladmin01');
  });

  useEffect(() => {
    const handleUrlChange = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      const search = window.location.search.toLowerCase();
      const isMatch = path.includes('paineladmin01') || hash.includes('paineladmin01') || search.includes('paineladmin01');
      setIsAdminRoute(isMatch);
    };

    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('hashchange', handleUrlChange);

    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('hashchange', handleUrlChange);
    };
  }, []);

  useEffect(() => {
    const userId = currentUser ? currentUser.id : 'guest';
    setFavoriteIds(favoritesService.getFavoriteIds(userId));
  }, [currentUser]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleToggleFavorite = (placeId: string) => {
    const userId = currentUser ? currentUser.id : 'guest';
    const isNowFav = favoritesService.toggleFavorite(placeId, userId);
    setFavoriteIds(favoritesService.getFavoriteIds(userId));

    const place = placesList.find((p) => p.id === placeId);
    const placeName = place ? place.name : 'Local';

    analyticsService.trackFavorite(placeId, placeName, isNowFav ? 'add' : 'remove');

    if (isNowFav) {
      showToast(`❤️ "${placeName}" foi adicionado aos seus favoritos!`);
    } else {
      showToast(`Removido dos seus favoritos.`);
    }
  };

  const handleOpenCheckout = () => {
    analyticsService.trackBeginCheckout(39.9);
    setIsCheckoutOpen(true);
  };

  const handleOpenTides = () => {
    analyticsService.trackTideView();
    setIsTideModalOpen(true);
  };

  const handleOpenAuth = (tab: 'login' | 'register' = 'login') => {
    setAuthInitialTab(tab);
    setIsAuthOpen(true);
  };

  const handleAuthSuccess = (user: User) => {
    setCurrentUser(user);
    const hasVip = user.accessStatus === 'active';
    setIsVipMode(hasVip);
    localStorage.setItem('jampa_vip_mode', String(hasVip));
    setFavoriteIds(favoritesService.getFavoriteIds(user.id));

    if (hasVip) {
      showToast(`🌟 Bem-vindo de volta, ${user.name.split(' ')[0]}! Seu Acesso Vitalício está ativo.`);
    } else {
      showToast(`👋 Olá, ${user.name.split(' ')[0]}! Conclua seu pagamento de R$ 39,90 para liberar tudo.`);
    }
  };

  const handleLogout = () => {
    authService.clearSession();
    setCurrentUser(null);
    setIsVipMode(false);
    localStorage.setItem('jampa_vip_mode', 'false');
    setFavoriteIds(favoritesService.getFavoriteIds('guest'));
    showToast('Você saiu da sua conta.');
  };

  const handleToggleVipMode = () => {
    const nextState = !isVipMode;
    setIsVipMode(nextState);
    localStorage.setItem('jampa_vip_mode', String(nextState));

    if (currentUser) {
      const nextStatus = nextState ? 'active' : 'registered';
      const nextType = nextState ? 'lifetime' : 'none';
      const updated = authService.updateUserProfile(currentUser.id, {
        accessStatus: nextStatus,
        accessType: nextType,
        purchasedAt: nextState ? new Date().toLocaleDateString('pt-BR') : undefined
      });
      if (updated) setCurrentUser(updated);
    }

    if (nextState) {
      showToast('🌟 Modo VIP Vitalício Ativado! Ofertas ocultadas e guia completo desbloqueado.');
    } else {
      showToast('🔒 Modo Visitante Ativado. Ofertas e paywall de demonstração visíveis.');
    }
  };

  const handlePaymentApproved = (transaction: PaymentTransaction) => {
    if (currentUser) {
      const updated = authService.grantLifetimeAccess(currentUser.id);
      if (updated) setCurrentUser(updated);
    } else {
      const newUser: User = {
        id: transaction.userId,
        name: transaction.userName,
        email: transaction.userEmail,
        createdAt: new Date().toLocaleDateString('pt-BR'),
        accessStatus: 'active',
        accessType: 'lifetime',
        purchasedAt: new Date().toLocaleDateString('pt-BR'),
        orderId: transaction.orderId
      };
      authService.setSession(newUser);
      setCurrentUser(newUser);
    }

    setIsVipMode(true);
    localStorage.setItem('jampa_vip_mode', 'true');

    // Rastreamento de Conversão Principal no Google Analytics e Google Ads
    analyticsService.trackPurchase(
      transaction.id || transaction.orderId,
      transaction.amount || 39.90,
      transaction.paymentMethod || 'PIX'
    );

    // Atribuir comissão a afiliado se houver indicação salva
    try {
      const refCode = localStorage.getItem('jampa_affiliate_ref');
      if (refCode) {
        adminService.recordAffiliateSale(
          refCode,
          transaction.amount || 39.90,
          transaction.userEmail,
          transaction.userName,
          transaction.paymentMethod
        );
      }

      const srcCode = localStorage.getItem('jampa_src_ref');
      if (srcCode) {
        adminService.recordQrChannelConversion(srcCode);
      }
    } catch (e) {
      console.warn('Erro ao creditar afiliado/canal:', e);
    }

    showToast(`🎉 Pagamento aprovado (${transaction.orderId})! Seu Acesso Vitalício está liberado.`);
  };

  const handleSelectLandmarkFrom3D = (landmarkId: string) => {
    if (!isVipMode) {
      const showcasePlace = placesList[0];
      if (showcasePlace) {
        setSelectedPlace(showcasePlace);
      } else {
        setIsCheckoutOpen(true);
      }
      return;
    }

    const placeMap: Record<string, string> = {
      tambau: 'praia-de-tambau',
      seixas: 'ponta-do-seixas-e-farol',
      jacare: 'por-do-sol-do-jacare',
      coqueirinho: 'praia-de-coqueirinho'
    };

    const targetId = placeMap[landmarkId];
    if (targetId) {
      const found = placesList.find((p) => p.id === targetId);
      if (found) {
        setSelectedPlace(found);
      }
    }
  };

  const scrollToPreview = () => {
    const element = document.getElementById('previa');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  const favoritePlacesList = placesList.filter((p) => favoriteIds.includes(p.id));

  // ========================================================
  // ROTA 100% ISOLADA PARA O PAINEL ADMINISTRATIVO (/PainelAdmin01)
  // ZERO COMPONENTES PÚBLICOS RENDERIZADOS NESTA ROTA
  // ========================================================
  if (isAdminRoute) {
    return (
      <div className="admin-app-root">
        <OfflineIndicator />
        <AdminSecurityGatekeeper
          allPlaces={allAdminPlaces}
          onPlacesUpdated={() => setPlacesVersion((v) => v + 1)}
          onExitAdmin={() => {
            window.history.pushState({}, '', '/');
            setIsAdminRoute(false);
          }}
        />
      </div>
    );
  }

  // ========================================================
  // PÁGINA PÚBLICA (VITRINE / TURISTA / MEMBRO VIP)
  // ========================================================
  return (
    <div className="app-wrapper">
      {/* Indicador de Status de Rede Offline */}
      <OfflineIndicator />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="global-toast glass-panel">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Cabeçalho Público (Zero botões ou vestígios de admin) */}
      <Header
        currentUser={currentUser}
        isVipMode={isVipMode}
        favoriteCount={favoriteIds.length}
        onOpenCheckout={handleOpenCheckout}
        onOpenAuth={handleOpenAuth}
        onOpenDashboard={() => setIsDashboardOpen(true)}
        onOpenFavorites={() => setIsFavoritesOpen(true)}
        onOpenTides={handleOpenTides}
      />

      {/* Hero com 3D Integrado */}
      <HeroSection
        isVipMode={isVipMode}
        userName={currentUser?.name}
        onOpenCheckout={handleOpenCheckout}
        onExploreClick={scrollToPreview}
        onSelectLandmark={handleSelectLandmarkFrom3D}
      />

      {/* Barra de Estatísticas & Selos */}
      <StatsBar />

      {/* Navegação de Categorias / Modalidades Dinâmicas */}
      <CategoryNav
        categories={dynamicCategories}
        selectedCategory={selectedCategory}
        onSelectCategory={(cat) => setSelectedCategory(cat)}
        onOpenTides={handleOpenTides}
      />

      {/* Grade de Locais & Dicas com Filtros Avançados & Guia por Bairros */}
      <PreviewGrid
        places={placesList}
        selectedCategory={selectedCategory}
        isVipMode={isVipMode}
        favoriteIds={favoriteIds}
        onToggleFavorite={handleToggleFavorite}
        onViewPlaceDetails={(place) => setSelectedPlace(place)}
        onOpenCheckout={handleOpenCheckout}
      />

      {/* Roteiros Prontos (1, 3, 5 dias, temáticos) */}
      <ItinerarySection
        isVipMode={isVipMode}
        onOpenCheckout={handleOpenCheckout}
      />

      {/* Mapa Turístico Interativo com OpenStreetMap & Geolocalização */}
      <InteractiveMapSection
        places={placesList}
        isVipMode={isVipMode}
        onSelectPlace={(place) => setSelectedPlace(place)}
        onOpenCheckout={handleOpenCheckout}
      />

      {/* ======================================================== */}
      {/* SEÇÕES DE VENDA & OFERTA (SOMENTE PARA VISITANTES NÃO PAGOS) */}
      {/* ======================================================== */}
      {!isVipMode && (
        <>
          {/* Seção Comparativa "Por que Nós?" */}
          <ComparisonSection />

          {/* Seção da Oferta R$ 39,90 Vitalício */}
          <OfferSection onOpenCheckout={handleOpenCheckout} />

          {/* Pilares de Segurança & Confiança */}
          <TrustSection />
        </>
      )}

      {/* Rodapé Público (Zero botões de admin) */}
      <Footer isVipMode={isVipMode} onOpenPrivacyModal={() => setIsPrivacyOpen(true)} />

      {/* Banner Inteligente de Instalação PWA */}
      <PwaInstallBanner />

      {/* Barra de Navegação Inferior Fixa (Mobile Thumb Zone Ergonomics) */}
      <MobileBottomNav
        activeTab={mobileActiveTab}
        favoriteCount={favoriteIds.length}
        isVipMode={isVipMode}
        onSelectTab={handleMobileTabSelect}
      />

      {/* Botão Flutuante de Atendimento WhatsApp */}
      <WhatsAppFloatingButton phoneNumber="5583993595124" />

      {/* Banner de Consentimento LGPD (Cookies & Privacidade) */}
      <LgpdConsentBanner onOpenPrivacyModal={() => setIsPrivacyOpen(true)} />

      {/* Modal de Política de Privacidade e Termos de Uso (LGPD) */}
      <PrivacyPolicyModal
        isOpen={isPrivacyOpen}
        onClose={() => setIsPrivacyOpen(false)}
      />

      {/* Switcher Interativo de Modos (Visitante x VIP) */}
      <ModeSwitcher isVipMode={isVipMode} onToggle={handleToggleVipMode} />

      {/* Modal de Detalhes do Local (com Lightbox e Reviews) */}
      <PlacePreviewModal
        place={selectedPlace}
        isOpen={!!selectedPlace}
        isVipMode={isVipMode}
        currentUser={currentUser}
        isFavorite={selectedPlace ? favoriteIds.includes(selectedPlace.id) : false}
        onToggleFavorite={handleToggleFavorite}
        onClose={() => setSelectedPlace(null)}
        onUnlockClick={() => {
          setSelectedPlace(null);
          setIsCheckoutOpen(true);
        }}
        onRequireAuth={() => {
          setSelectedPlace(null);
          handleOpenAuth('login');
        }}
        onOpenTides={() => setIsTideModalOpen(true)}
      />

      {/* Modal de Favoritos */}
      <FavoritesModal
        isOpen={isFavoritesOpen}
        onClose={() => setIsFavoritesOpen(false)}
        favorites={favoritePlacesList}
        onRemoveFavorite={handleToggleFavorite}
        onSelectPlace={(place) => {
          setSelectedPlace(place);
        }}
        onExploreMore={scrollToPreview}
      />

      {/* Modal de Checkout Oficial (PIX & Cartão & Webhook) */}
      <FullCheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        currentUser={currentUser}
        onPaymentApproved={handlePaymentApproved}
      />

      {/* Modal de Autenticação de Usuário Comum */}
      <AuthModal
        isOpen={isAuthOpen}
        initialTab={authInitialTab}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />

      {/* Modal de Dashboard / Perfil ("Minha Conta") */}
      <UserDashboardModal
        isOpen={isDashboardOpen}
        user={currentUser}
        favoriteCount={favoriteIds.length}
        onClose={() => setIsDashboardOpen(false)}
        onLogout={handleLogout}
        onOpenCheckout={() => setIsCheckoutOpen(true)}
        onOpenFavorites={() => setIsFavoritesOpen(true)}
        onExploreClick={scrollToPreview}
      />

      {/* Modal Oficial da Tábua de Marés de João Pessoa (7 Dias) */}
      <TideModal
        isOpen={isTideModalOpen}
        onClose={() => setIsTideModalOpen(false)}
      />

      <style>{`
        .app-wrapper {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          position: relative;
        }

        .global-toast {
          position: fixed;
          top: 80px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 1001;
          padding: 0.75rem 1.5rem;
          background: rgba(10, 17, 26, 0.95);
          border: 1px solid #00B4D8;
          border-radius: var(--radius-full);
          color: #F8FAFC;
          font-family: var(--font-display);
          font-size: 0.875rem;
          font-weight: 700;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.6), 0 0 25px rgba(0, 180, 216, 0.3);
          animation: toastSlide 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes toastSlide {
          from { opacity: 0; transform: translate(-50%, -20px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
      `}</style>
    </div>
  );
}

export default App;
