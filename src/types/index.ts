export interface RegisteredCustomer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  workshopName?: string;
  address?: string;
  registeredAt: string;
  notifyTelegram?: boolean;
  notifyWhatsapp?: boolean;
}

export interface AdminKey {
  id: string;
  label: string;
  key: string;
  role: 'dueño' | 'administrador' | 'vendedor';
  createdAt: string;
  active: boolean;
}

export interface ContactInquiry {
  id: string;
  date: string;
  name: string;
  phone: string;
  email?: string;
  partNeeded: string;
  message: string;
  status: 'nuevo' | 'atendido';
}

export interface CustomerContact {
  id: string;
  name: string;
  businessName?: string;
  phone: string;
  whatsapp?: string;
  email?: string;
  city?: string;
  address?: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string;
  notes?: string;
  category: 'taller' | 'tecnico' | 'mayorista' | 'publico';
  createdAt: string;
}

export interface BankDetails {
  bankName: string;
  beneficiary: string;
  clabe: string;
  cardNumber?: string;
  oxxoNumber?: string;
}

export interface ShippingConfig {
  localCost: number;
  nationalCost: number;
  freeShippingThreshold: number;
}

export interface StoreSettings {
  name: string;
  tagline: string;
  logoIcon: string;
  currency: string;
  currencyCode: string;
  whatsapp: string;
  phone: string;
  secondaryPhone?: string;
  supportWhatsapp?: string;
  email?: string;
  address: string;
  locationNotes?: string;
  googleMapsUrl?: string;
  businessHours: string;
  announcement: string;
  showAnnouncement: boolean;
  wholesaleMinQty: number;
  warrantyPolicy: string;
  adminPin: string;
  adminUser?: string;
  adminPassword?: string;
  adminEmail: string; // Authorized Gmail for admin verification & order alerts
  heroHeadline: string;
  heroSubheadline: string;
  facebook?: string;
  instagram?: string;
  tiktok?: string;
  telegram?: string;
  adminSecurityEnabled: boolean;
  adminKeys: AdminKey[];
  // Telegram Bot Dispatch
  telegramBotToken?: string;
  telegramChatId?: string;
  telegramEnabled: boolean;
  emailNotificationsEnabled: boolean;
  bankDetails: BankDetails;
  shippingConfig: ShippingConfig;
  // Agente de IA para Ventas, Consultas y Soporte (100% editable desde Admin)
  aiAssistantEnabled: boolean;
  aiAssistantName: string;
  aiAssistantWelcomeMessage: string;
  aiAssistantTone: 'tecnico' | 'comercial' | 'amigable' | 'directo';
  aiAssistantCustomPrompt: string;
  aiAssistantKnowledgeNotes: string;
  aiAssistantWhatsappDirect: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  iconName: string;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  categoryId: string;
  brand: string;
  priceRetail: number;
  priceWholesale: number;
  stock: number;
  image: string;
  badge?: string;
  description: string;
  compatibility: string[];
  specs: Record<string, string>;
  featured: boolean;
  inStock: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  useWholesalePrice: boolean;
}

export interface OrderItem {
  productId: string;
  sku: string;
  name: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Order {
  id: string;
  date: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  customerAddress?: string;
  gmailVerified?: boolean;
  paymentMethod: 'transferencia' | 'oxxo' | 'efectivo' | 'tarjeta';
  deliveryMethod: 'recoger_tienda' | 'envio_local' | 'envio_nacional';
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  total: number;
  status: 'pendiente' | 'confirmado' | 'en_camino' | 'entregado' | 'cancelado';
  notes?: string;
  telegramSent?: boolean;
  emailSent?: boolean;
  receiptNumber?: string;
}

export interface GmailReceipt {
  id: string;
  orderId: string;
  date: string;
  customerName: string;
  customerGmail: string;
  customerPhone: string;
  total: number;
  paymentMethod: string;
  deliveryMethod: string;
  itemsCount: number;
  status: 'enviado' | 'verificado' | 'entregado';
}
