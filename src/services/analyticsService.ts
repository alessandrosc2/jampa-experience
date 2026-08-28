// Serviço Unificado de Google Analytics 4 (GA4) & Google Ads Conversion Tracking

declare global {
  interface Window {
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
    JAMPA_GA_ID?: string;
    JAMPA_GADS_ID?: string;
  }
}

const STORAGE_GA_KEY = 'jampa_ga_id';
const STORAGE_GADS_KEY = 'jampa_gads_id';
const STORAGE_GADS_CONVERSION_LABEL = 'jampa_gads_conv_label';

// IDs padrão de produção (podem ser alterados no Painel Admin ou via .env)
export const DEFAULT_GA_ID = 'G-JPEXPERI01';
export const DEFAULT_GADS_ID = 'AW-16890000000';

class AnalyticsService {
  private gaId: string;
  private gadsId: string;
  private gadsConversionLabel: string;
  private initialized: boolean = false;

  constructor() {
    this.gaId = this.getStoredValue(STORAGE_GA_KEY, DEFAULT_GA_ID);
    this.gadsId = this.getStoredValue(STORAGE_GADS_KEY, DEFAULT_GADS_ID);
    this.gadsConversionLabel = this.getStoredValue(STORAGE_GADS_CONVERSION_LABEL, 'purchase_jampa_vip');
    this.init();
  }

  private getStoredValue(key: string, fallback: string): string {
    try {
      return localStorage.getItem(key) || fallback;
    } catch {
      return fallback;
    }
  }

  public init() {
    if (typeof window === 'undefined' || this.initialized) return;

    window.dataLayer = window.dataLayer || [];
    function gtag(...args: any[]) {
      window.dataLayer?.push(args);
    }
    window.gtag = gtag;

    gtag('js', new Date());

    // Configura GA4
    if (this.gaId) {
      gtag('config', this.gaId, {
        send_page_view: false, // Controlado manualmente por SPA
        cookie_flags: 'SameSite=None;Secure'
      });
    }

    // Configura Google Ads
    if (this.gadsId) {
      gtag('config', this.gadsId);
    }

    // Injeta a tag gtag.js se ainda não existir
    const existingScript = document.getElementById('google-gtag-script');
    if (!existingScript && this.gaId) {
      const script = document.createElement('script');
      script.id = 'google-gtag-script';
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${this.gaId}`;
      document.head.appendChild(script);
    }

    this.initialized = true;
  }

  public getSettings() {
    return {
      gaId: this.gaId,
      gadsId: this.gadsId,
      gadsConversionLabel: this.gadsConversionLabel
    };
  }

  public saveSettings(gaId: string, gadsId: string, gadsConversionLabel: string) {
    this.gaId = gaId.trim();
    this.gadsId = gadsId.trim();
    this.gadsConversionLabel = gadsConversionLabel.trim();

    try {
      localStorage.setItem(STORAGE_GA_KEY, this.gaId);
      localStorage.setItem(STORAGE_GADS_KEY, this.gadsId);
      localStorage.setItem(STORAGE_GADS_CONVERSION_LABEL, this.gadsConversionLabel);
    } catch (e) {
      console.warn('Erro ao persistir chaves de Analytics:', e);
    }

    // Reconfigura tags no gtag
    if (typeof window !== 'undefined' && window.gtag) {
      if (this.gaId) window.gtag('config', this.gaId);
      if (this.gadsId) window.gtag('config', this.gadsId);
    }
  }

  /**
   * Evento: Page View (Navegação SPA)
   */
  public trackPageView(pagePath: string, pageTitle: string) {
    if (typeof window === 'undefined' || !window.gtag) return;
    window.gtag('event', 'page_view', {
      page_path: pagePath,
      page_title: pageTitle,
      page_location: window.location.href
    });
  }

  /**
   * Evento: Início de Checkout (Garantir R$ 39,90)
   */
  public trackBeginCheckout(value: number = 39.9, currency: string = 'BRL') {
    if (typeof window === 'undefined' || !window.gtag) return;
    window.gtag('event', 'begin_checkout', {
      value,
      currency,
      items: [
        {
          item_id: 'jampa_vip_pass',
          item_name: 'Guia JAMPA EXPERIENCE — Acesso Vitalício VIP',
          price: value,
          quantity: 1,
          item_category: 'Guia Turístico Digital'
        }
      ]
    });
  }

  /**
   * Evento: Compra Concluída / Conversão Principal (Google Analytics & Google Ads)
   */
  public trackPurchase(transactionId: string, value: number = 39.9, paymentMethod: string = 'PIX') {
    if (typeof window === 'undefined' || !window.gtag) return;

    // 1. Envio GA4 E-Commerce
    window.gtag('event', 'purchase', {
      transaction_id: transactionId,
      value,
      currency: 'BRL',
      payment_type: paymentMethod,
      items: [
        {
          item_id: 'jampa_vip_pass',
          item_name: 'Guia JAMPA EXPERIENCE — Acesso Vitalício VIP',
          price: value,
          quantity: 1,
          item_category: 'Guia Turístico Digital'
        }
      ]
    });

    // 2. Envio Conversão Google Ads (Google Ads Conversion Tag)
    if (this.gadsId && this.gadsConversionLabel) {
      window.gtag('event', 'conversion', {
        send_to: `${this.gadsId}/${this.gadsConversionLabel}`,
        value,
        currency: 'BRL',
        transaction_id: transactionId
      });
    }
  }

  /**
   * Evento: Visualização de Detalhes de um Local
   */
  public trackViewItem(placeId: string, placeName: string, categoryId: string) {
    if (typeof window === 'undefined' || !window.gtag) return;
    window.gtag('event', 'view_item', {
      items: [
        {
          item_id: placeId,
          item_name: placeName,
          item_category: categoryId
        }
      ]
    });
  }

  /**
   * Evento: Filtro por Categoria Temática
   */
  public trackSelectCategory(categoryId: string, categoryLabel: string) {
    if (typeof window === 'undefined' || !window.gtag) return;
    window.gtag('event', 'select_content', {
      content_type: 'category',
      item_id: categoryId,
      item_name: categoryLabel
    });
  }

  /**
   * Evento: Consulta da Tábua de Marés
   */
  public trackTideView() {
    if (typeof window === 'undefined' || !window.gtag) return;
    window.gtag('event', 'view_tide_table', {
      event_category: 'tourist_tool',
      event_label: 'Tabua de Mares Joao Pessoa 7D'
    });
  }

  /**
   * Evento: Clique no WhatsApp Oficial / Suporte / Parceiro
   */
  public trackWhatsAppClick(source: string = 'floating_button') {
    if (typeof window === 'undefined' || !window.gtag) return;
    window.gtag('event', 'generate_lead', {
      event_category: 'contact',
      event_label: `whatsapp_${source}`,
      value: 5.0,
      currency: 'BRL'
    });
  }

  /**
   * Evento: Adicionar/Remover Favorito
   */
  public trackFavorite(placeId: string, placeName: string, action: 'add' | 'remove') {
    if (typeof window === 'undefined' || !window.gtag) return;
    window.gtag('event', action === 'add' ? 'add_to_wishlist' : 'remove_from_wishlist', {
      items: [
        {
          item_id: placeId,
          item_name: placeName
        }
      ]
    });
  }

  /**
   * Evento: Visita via Indicação de Afiliado
   */
  public trackAffiliateReferral(refCode: string) {
    if (typeof window === 'undefined' || !window.gtag) return;
    window.gtag('event', 'affiliate_referral', {
      affiliate_code: refCode
    });
  }

  /**
   * Evento: Escaneamento de QR Code Físico (Totem / Hotel / Aeroporto)
   */
  public trackQrScan(channelId: string) {
    if (typeof window === 'undefined' || !window.gtag) return;
    window.gtag('event', 'qr_channel_scan', {
      channel_id: channelId
    });
  }
}

export const analyticsService = new AnalyticsService();
