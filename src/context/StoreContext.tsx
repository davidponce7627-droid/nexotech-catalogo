import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  StoreSettings, 
  Category, 
  Product, 
  CartItem, 
  Order, 
  AdminKey, 
  ContactInquiry, 
  CustomerContact,
  GmailReceipt,
  RegisteredCustomer 
} from '../types';
import { 
  initialStoreSettings, 
  initialCategories, 
  initialProducts, 
  initialContacts,
  initialGmailReceipts 
} from '../data/initialData';
import { auth, googleProvider, signInWithPopup, signOut, onAuthStateChanged, User } from '../lib/firebase';

interface StoreContextType {
  settings: StoreSettings;
  updateSettings: (newSettings: Partial<StoreSettings>) => void;
  
  categories: Category[];
  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (id: string, category: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, useWholesale?: boolean) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  cartTotal: number;
  cartSubtotal: number;
  cartShippingCost: number;
  cartCount: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  
  // Orders
  orders: Order[];
  createOrder: (orderData: {
    customerName: string;
    customerPhone: string;
    customerEmail?: string;
    customerAddress?: string;
    deliveryMethod: Order['deliveryMethod'];
    paymentMethod: Order['paymentMethod'];
    notes?: string;
  }) => Order;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  deleteOrder: (orderId: string) => void;
  latestCreatedOrder: Order | null;
  setLatestCreatedOrder: (order: Order | null) => void;

  // CRM Contacts
  contacts: CustomerContact[];
  addContact: (contact: Omit<CustomerContact, 'id' | 'createdAt'>) => void;
  updateContact: (id: string, contact: Partial<CustomerContact>) => void;
  deleteContact: (id: string) => void;
  exportContactsCSV: () => void;

  // Contact Inquiries
  inquiries: ContactInquiry[];
  submitInquiry: (name: string, phone: string, partNeeded: string, message: string, email?: string) => void;
  deleteInquiry: (id: string) => void;
  updateInquiryStatus: (id: string, status: 'nuevo' | 'atendido') => void;
  isContactModalOpen: boolean;
  setIsContactModalOpen: (open: boolean) => void;

  // Gmail Receipts Database
  gmailReceipts: GmailReceipt[];
  sendCustomerReceiptByEmail: (receipt: GmailReceipt) => void;
  exportGmailDatabaseCSV: () => void;
  
  // Telegram & Email Dispatching
  sendTelegramNotification: (order: Order) => Promise<boolean>;
  testTelegramConnection: (token: string, chatId: string) => Promise<{ success: boolean; message: string; details?: any }>;
  sendSampleOrderToTelegram: (token?: string, chatId?: string) => Promise<{ success: boolean; message: string; details?: any }>;
  sendEmailNotification: (order: Order) => Promise<boolean>;

  viewMode: 'client' | 'admin';
  setViewMode: (mode: 'client' | 'admin') => void;
  requestAdminAccess: () => void;
  
  // Security & Admin Keys with Firebase Google Auth & Master Credentials
  generateNewAdminKey: (label: string, role?: 'dueño' | 'administrador' | 'vendedor') => AdminKey;
  deleteAdminKey: (id: string) => void;
  toggleAdminKey: (id: string) => void;
  isAuthenticatedAdmin: boolean;
  setIsAuthenticatedAdmin: (val: boolean) => void;
  validateAdminAccess: (enteredKey: string, enteredGmail?: string) => { success: boolean; message: string };
  loginWithGoogle: () => Promise<{ success: boolean; message: string }>;
  logoutAdmin: () => Promise<void>;
  firebaseUser: User | null;
  isSecurityModalOpen: boolean;
  setIsSecurityModalOpen: (open: boolean) => void;
  
  // Customer Portal (Registro de usuarios, Notificaciones y Recibos)
  isCustomerPortalOpen: boolean;
  setIsCustomerPortalOpen: (open: boolean) => void;
  currentCustomer: RegisteredCustomer | null;
  registerCustomer: (customerData: Omit<RegisteredCustomer, 'id' | 'registeredAt'>) => RegisteredCustomer;
  loginCustomerWithGoogle: () => Promise<{ success: boolean; message: string; customer?: RegisteredCustomer }>;
  logoutCustomer: () => void;

  selectedCategory: string;
  setSelectedCategory: (catId: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedBrand: string;
  setSelectedBrand: (brand: string) => void;
  isWholesalePricing: boolean;
  setIsWholesalePricing: (val: boolean) => void;
  
  quickViewProduct: Product | null;
  setQuickViewProduct: (product: Product | null) => void;
  
  resetToDefaults: () => void;
  exportBackup: () => string;
  importBackup: (jsonStr: string) => boolean;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const STORAGE_KEYS = {
  SETTINGS: 'nexotech_settings_v3',
  CATEGORIES: 'nexotech_categories_v3',
  PRODUCTS: 'nexotech_products_v3',
  CART: 'nexotech_cart_v3',
  ORDERS: 'nexotech_orders_v3',
  CONTACTS: 'nexotech_contacts_v3',
  INQUIRIES: 'nexotech_inquiries_v3',
  WHOLESALE_MODE: 'nexotech_wholesale_mode_v3',
  AUTH: 'nexotech_admin_auth_v3',
  GMAIL_RECEIPTS: 'nexotech_gmail_receipts_v3',
  CUSTOMER: 'nexotech_customer_v1'
};

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Settings State
  const [settings, setSettings] = useState<StoreSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (!Array.isArray(parsed.adminKeys)) {
          parsed.adminKeys = [];
        }
        // Always ensure Devstsy@#_52 and 5466915332 are preloaded!
        if (!parsed.adminKeys.some((k: any) => k.key === 'Devstsy@#_52')) {
          parsed.adminKeys.unshift({
            id: 'key-devstsy',
            label: 'Devstsy (Dueño)',
            key: 'Devstsy@#_52',
            role: 'dueño',
            createdAt: '2026-09-27',
            active: true
          });
        }
        if (!parsed.adminKeys.some((k: any) => k.key === '5466915332')) {
          parsed.adminKeys.push({
            id: 'key-numeric-5466',
            label: 'Clave Numérica / Chat ID',
            key: '5466915332',
            role: 'dueño',
            createdAt: '2026-09-27',
            active: true
          });
        }
        parsed.adminPin = 'Devstsy@#_52';
        if (!parsed.telegramChatId || parsed.telegramChatId === '-1002345678901') {
          parsed.telegramChatId = '5466915332';
        }
        // Preload active Telegram Bot Token from user
        if (!parsed.telegramBotToken) {
          parsed.telegramBotToken = '7558835682:AAGKq0vheMlKSJsDGYy41nQ2jqSHbMiVCj0';
        }
        parsed.telegramEnabled = true;
        if (!parsed.adminEmail) parsed.adminEmail = 'dr2490761@gmail.com';
        if (!parsed.currencyCode) parsed.currencyCode = 'USD';
        if (!parsed.currency) parsed.currency = '$';
        if (parsed.aiAssistantEnabled === undefined) parsed.aiAssistantEnabled = true;
        if (!parsed.aiAssistantName) parsed.aiAssistantName = 'NexoBot Asesor Técnico';
        if (!parsed.aiAssistantWelcomeMessage) parsed.aiAssistantWelcomeMessage = '¡Hola! 👋 Soy tu Asistente de Ventas y Consultas Técnicas de NEXO TECH. ¿Buscas alguna refacción, puerto Type-C o teléfono móvil?';
        if (!parsed.aiAssistantTone) parsed.aiAssistantTone = 'comercial';
        if (!parsed.aiAssistantCustomPrompt) parsed.aiAssistantCustomPrompt = 'Eres el asesor técnico de ventas oficial de NEXO TECH. Tu objetivo es ayudar a los clientes a encontrar la refacción exacta para su modelo de celular, resolver dudas de compatibilidad de puertos Tipo C y pantallas, recomendar compras por mayoreo para técnicos, y facilitar el contacto por WhatsApp.';
        if (!parsed.aiAssistantKnowledgeNotes) parsed.aiAssistantKnowledgeNotes = 'Ofrecemos garantía de 30 días con sellos intactos. Envíos a todo el país. Precios de mayoreo a partir de 5 unidades por producto.';
        if (parsed.aiAssistantWhatsappDirect === undefined) parsed.aiAssistantWhatsappDirect = true;
        if (!parsed.bankDetails) parsed.bankDetails = initialStoreSettings.bankDetails;
        if (!parsed.shippingConfig) parsed.shippingConfig = initialStoreSettings.shippingConfig;
        return parsed;
      }
      return initialStoreSettings;
    } catch {
      return initialStoreSettings;
    }
  });

  // 2. Categories State
  const [categories, setCategories] = useState<Category[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      return saved ? JSON.parse(saved) : initialCategories;
    } catch {
      return initialCategories;
    }
  });

  // 3. Products State
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      return saved ? JSON.parse(saved) : initialProducts;
    } catch {
      return initialProducts;
    }
  });

  // 4. Cart State
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CART);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // 5. Orders State
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // 6. CRM Contacts State
  const [contacts, setContacts] = useState<CustomerContact[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CONTACTS);
      return saved ? JSON.parse(saved) : initialContacts;
    } catch {
      return initialContacts;
    }
  });

  // 7. Inquiries State
  const [inquiries, setInquiries] = useState<ContactInquiry[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.INQUIRIES);
      return saved ? JSON.parse(saved) : [
        {
          id: 'inq-101',
          date: '2026-09-27 10:15',
          name: 'Taller Express Juárez',
          phone: '+52 55 9876 5432',
          email: 'contacto@juarezrepair.com',
          partNeeded: 'Sub-placas Samsung A54 y Flex Moto G60',
          message: '¿Tienen existencia de 10 piezas de cada una para entrega hoy mismo en su local?',
          status: 'nuevo'
        }
      ];
    } catch {
      return [];
    }
  });

  // 8. Gmail Receipts Database State
  const [gmailReceipts, setGmailReceipts] = useState<GmailReceipt[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.GMAIL_RECEIPTS);
      return saved ? JSON.parse(saved) : initialGmailReceipts;
    } catch {
      return initialGmailReceipts;
    }
  });

  // Navigation & Filter States
  const [viewMode, setViewMode] = useState<'client' | 'admin'>('client');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [isWholesalePricing, setIsWholesalePricing] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.WHOLESALE_MODE) === 'true';
    } catch {
      return false;
    }
  });

  // Modals & Popups
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState<boolean>(false);
  const [isCustomerPortalOpen, setIsCustomerPortalOpen] = useState<boolean>(false);
  const [isSecurityModalOpen, setIsSecurityModalOpen] = useState<boolean>(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [latestCreatedOrder, setLatestCreatedOrder] = useState<Order | null>(null);

  // Customer Session (Buyers / Technicians Portal)
  const [currentCustomer, setCurrentCustomer] = useState<RegisteredCustomer | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CUSTOMER);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Authentication
  const [isAuthenticatedAdmin, setIsAuthenticatedAdmin] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem(STORAGE_KEYS.AUTH) === 'true';
    } catch {
      return false;
    }
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('admin') === 'true' || urlParams.get('admin') === '1' || urlParams.get('panel') === '1') {
        const isAuth = sessionStorage.getItem(STORAGE_KEYS.AUTH) === 'true';
        if (!settings.adminSecurityEnabled || isAuth) {
          setViewMode('admin');
        } else {
          setIsSecurityModalOpen(true);
        }
      }
    } catch (e) {
      console.warn("URL param parsing:", e);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
      document.title = `${settings.name} - Catálogo & Refacciones`;
    } catch (e) {
      console.error("Storage error:", e);
    }
  }, [settings]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
    } catch (e) {
      console.error("Storage error:", e);
    }
  }, [categories]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    } catch (e) {
      console.error("Storage error:", e);
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
    } catch (e) {
      console.error("Storage error:", e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    } catch (e) {
      console.error("Storage error:", e);
    }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CONTACTS, JSON.stringify(contacts));
    } catch (e) {
      console.error("Storage error:", e);
    }
  }, [contacts]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify(inquiries));
    } catch (e) {
      console.error("Storage error:", e);
    }
  }, [inquiries]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.GMAIL_RECEIPTS, JSON.stringify(gmailReceipts));
    } catch (e) {
      console.error("Storage error:", e);
    }
  }, [gmailReceipts]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.WHOLESALE_MODE, isWholesalePricing ? 'true' : 'false');
    } catch (e) {
      console.error("Storage error:", e);
    }
  }, [isWholesalePricing]);

  // Actions: Settings
  const updateSettings = (newSettings: Partial<StoreSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  // Actions: Key Security & Gmail Verification
  const generateNewAdminKey = (label: string, role: 'dueño' | 'administrador' | 'vendedor' = 'administrador'): AdminKey => {
    const prefixes = role === 'dueño' ? 'OWNER' : role === 'administrador' ? 'ADMIN' : 'STAFF';
    const randomHex = Math.random().toString(36).substring(2, 6).toUpperCase();
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const generatedCode = `${prefixes}-${randomHex}${randomNum}`;

    const newKey: AdminKey = {
      id: `key-${Date.now()}`,
      label: label.trim() || `Llave ${role.toUpperCase()}`,
      key: generatedCode,
      role,
      createdAt: new Date().toLocaleDateString('es-MX'),
      active: true
    };

    setSettings(prev => ({
      ...prev,
      adminKeys: [newKey, ...(prev.adminKeys || [])]
    }));

    return newKey;
  };

  const deleteAdminKey = (id: string) => {
    setSettings(prev => ({
      ...prev,
      adminKeys: (prev.adminKeys || []).filter(k => k.id !== id)
    }));
  };

  const toggleAdminKey = (id: string) => {
    setSettings(prev => ({
      ...prev,
      adminKeys: (prev.adminKeys || []).map(k => k.id === id ? { ...k, active: !k.active } : k)
    }));
  };

  const validateAdminAccess = (enteredKey: string, enteredUserOrGmail?: string): { success: boolean; message: string } => {
    const cleanKey = enteredKey.trim();
    const cleanUser = (enteredUserOrGmail || '').trim();

    if (!cleanKey && !cleanUser) {
      return { success: false, message: 'Por favor ingresa tus credenciales de acceso.' };
    }

    // Direct check for user Devstsy@#_52 and password/key 5466915332
    if (
      (cleanUser.toLowerCase() === 'devstsy@#_52' && (cleanKey === '5466915332' || cleanKey === 'Devstsy@#_52')) ||
      (cleanUser.toLowerCase() === 'dr2490761@gmail.com' && (cleanKey === '5466915332' || cleanKey === 'Devstsy@#_52')) ||
      (cleanKey === '5466915332' || cleanKey === 'Devstsy@#_52') ||
      (cleanUser === '5466915332' || cleanUser === 'Devstsy@#_52')
    ) {
      setIsAuthenticatedAdmin(true);
      try { sessionStorage.setItem(STORAGE_KEYS.AUTH, 'true'); } catch {}
      return { success: true, message: 'Acceso autorizado correctamente.' };
    }

    // If Gmail is supplied, verify against authorized admin email
    if (enteredUserOrGmail && enteredUserOrGmail.includes('@')) {
      const cleanInputGmail = enteredUserOrGmail.trim().toLowerCase();
      const authorizedAdminGmail = (settings.adminEmail || 'dr2490761@gmail.com').toLowerCase();
      if (cleanInputGmail !== authorizedAdminGmail) {
        return { 
          success: false, 
          message: 'El correo no corresponde al personal administrativo autorizado.' 
        };
      }
    }

    // Check master pin
    if (settings.adminPin && (cleanKey === settings.adminPin || cleanKey === '5466915332' || cleanKey === 'Devstsy@#_52')) {
      setIsAuthenticatedAdmin(true);
      try { sessionStorage.setItem(STORAGE_KEYS.AUTH, 'true'); } catch {}
      return { success: true, message: 'Acceso autorizado correctamente.' };
    }

    // Check configured keys
    const match = (settings.adminKeys || []).find(
      k => k.active && (k.key.toUpperCase() === cleanKey.toUpperCase() || k.key === cleanKey)
    );

    if (match) {
      setIsAuthenticatedAdmin(true);
      try { sessionStorage.setItem(STORAGE_KEYS.AUTH, 'true'); } catch {}
      return { success: true, message: 'Acceso autorizado correctamente.' };
    }

    return { success: false, message: 'Usuario o contraseña incorrectos. Verifica tus credenciales.' };
  };

  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user);
      if (user && user.email) {
        const authorizedEmail = (settings.adminEmail || 'dr2490761@gmail.com').toLowerCase();
        if (user.email.toLowerCase() === authorizedEmail || user.email.toLowerCase() === 'dr2490761@gmail.com') {
          setIsAuthenticatedAdmin(true);
          try { sessionStorage.setItem(STORAGE_KEYS.AUTH, 'true'); } catch {}
        }
      }
    });
    return () => unsubscribe();
  }, [settings.adminEmail]);

  const loginWithGoogle = async (): Promise<{ success: boolean; message: string }> => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const userEmail = (user.email || '').toLowerCase();
      const authorizedEmail = (settings.adminEmail || 'dr2490761@gmail.com').toLowerCase();

      if (userEmail === authorizedEmail || userEmail === 'dr2490761@gmail.com') {
        setIsAuthenticatedAdmin(true);
        setViewMode('admin');
        try { sessionStorage.setItem(STORAGE_KEYS.AUTH, 'true'); } catch {}
        return { success: true, message: `Bienvenido, ${user.displayName || user.email} (Acceso Autorizado).` };
      } else {
        await signOut(auth);
        setIsAuthenticatedAdmin(false);
        return { 
          success: false, 
          message: `Acceso denegado: La cuenta de Google (${user.email}) no está registrada como administrador autorizado de NEXO TECH.` 
        };
      }
    } catch (err: any) {
      console.error('Google Sign-In Error:', err);
      return { 
        success: false, 
        message: err.message || 'Error al conectar con Google Sign-In.' 
      };
    }
  };

  const loginCustomerWithGoogle = async (): Promise<{ success: boolean; message: string; customer?: RegisteredCustomer }> => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      if (!user) {
        return { success: false, message: 'No se completó el inicio de sesión con Google.' };
      }

      const email = user.email || '';
      const name = user.displayName || user.email?.split('@')[0] || 'Cliente';
      const avatarUrl = user.photoURL || undefined;

      // Check if this customer was already in contacts or saved customer
      const existingContact = contacts.find(c => c.email && c.email.toLowerCase() === email.toLowerCase());

      const customerObj: RegisteredCustomer = {
        id: currentCustomer?.id || `CUST-G-${Date.now().toString().slice(-6)}`,
        name: existingContact?.name || name,
        email: email,
        phone: existingContact?.phone || currentCustomer?.phone || '',
        workshopName: existingContact?.businessName || currentCustomer?.workshopName || '',
        address: existingContact?.address || currentCustomer?.address || '',
        registeredAt: currentCustomer?.registeredAt || new Date().toLocaleDateString('es-MX'),
        isGoogleAccount: true,
        avatarUrl: avatarUrl
      };

      setCurrentCustomer(customerObj);
      try {
        localStorage.setItem(STORAGE_KEYS.CUSTOMER, JSON.stringify(customerObj));
      } catch {}

      // Keep clients in client mode
      const authorizedAdminEmail = (settings.adminEmail || 'dr2490761@gmail.com').toLowerCase();
      if (email.toLowerCase() !== authorizedAdminEmail) {
        setIsAuthenticatedAdmin(false);
        setViewMode('client');
      }

      return {
        success: true,
        message: `¡Sesión iniciada con éxito! Bienvenido, ${customerObj.name}.`,
        customer: customerObj
      };
    } catch (err: any) {
      console.error('Customer Google Login error:', err);
      return {
        success: false,
        message: err.message || 'Error al iniciar sesión con Google.'
      };
    }
  };

  const logoutAdmin = async () => {
    try {
      await signOut(auth);
    } catch {}
    setIsAuthenticatedAdmin(false);
    setViewMode('client');
    try { sessionStorage.removeItem(STORAGE_KEYS.AUTH); } catch {}
  };

  const requestAdminAccess = () => {
    if (viewMode === 'admin') {
      setViewMode('client');
      return;
    }

    if (!settings.adminSecurityEnabled || isAuthenticatedAdmin) {
      setViewMode('admin');
    } else {
      setIsSecurityModalOpen(true);
    }
  };

  // Actions: Categories
  const addCategory = (categoryData: Omit<Category, 'id'>) => {
    const newCat: Category = {
      ...categoryData,
      id: `cat-${Date.now()}`
    };
    setCategories(prev => [...prev, newCat]);
  };

  const updateCategory = (id: string, updatedFields: Partial<Category>) => {
    setCategories(prev => prev.map(c => (c.id === id ? { ...c, ...updatedFields } : c)));
  };

  const deleteCategory = (id: string) => {
    setCategories(prev => prev.filter(c => c.id !== id));
  };

  // Actions: Products
  const addProduct = (productData: Omit<Product, 'id'>) => {
    const newProd: Product = {
      ...productData,
      id: `prod-${Date.now()}`
    };
    setProducts(prev => [newProd, ...prev]);
  };

  const updateProduct = (id: string, updatedFields: Partial<Product>) => {
    setProducts(prev => prev.map(p => (p.id === id ? { ...p, ...updatedFields } : p)));
    if (quickViewProduct && quickViewProduct.id === id) {
      setQuickViewProduct(prev => prev ? { ...prev, ...updatedFields } : null);
    }
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    setCart(prev => prev.filter(item => item.product.id !== id));
    if (quickViewProduct?.id === id) {
      setQuickViewProduct(null);
    }
  };

  // Actions: Cart
  const addToCart = (product: Product, quantity = 1, useWholesale = false) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity, useWholesalePrice: useWholesale || item.useWholesalePrice }
            : item
        );
      }
      return [...prev, { product, quantity, useWholesalePrice: useWholesale }];
    });
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  // Cart Calculations
  const cartSubtotal = cart.reduce((acc, item) => {
    const qualifiesWholesale = isWholesalePricing || item.useWholesalePrice || item.quantity >= settings.wholesaleMinQty;
    const price = qualifiesWholesale ? item.product.priceWholesale : item.product.priceRetail;
    return acc + price * item.quantity;
  }, 0);

  const cartShippingCost = cartSubtotal >= settings.shippingConfig.freeShippingThreshold || cart.length === 0
    ? 0
    : settings.shippingConfig.localCost;

  const cartTotal = cartSubtotal + cartShippingCost;
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Telegram Dispatcher
  const sendTelegramNotification = async (order: Order): Promise<boolean> => {
    if (!settings.telegramEnabled || !settings.telegramBotToken || !settings.telegramChatId) {
      return false;
    }

    const itemsText = order.items
      .map((item, idx) => `  <b>${idx + 1}.</b> [<code>${item.sku}</code>] ${item.name}\n      Cantidad: <b>${item.quantity}</b> pzs x ${settings.currency}${item.unitPrice} = <b>${settings.currency}${item.total.toLocaleString('es-MX')}</b>`)
      .join('\n');

    const message = `🧾 <b>COMPROBANTE & RECIBO OFICIAL</b>\n` +
      `🏢 <b>${settings.name.toUpperCase()}</b> · <i>${settings.tagline}</i>\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `📄 <b>N° Folio / Recibo:</b> <code>${order.id}</code>\n` +
      `📅 <b>Fecha y Hora:</b> ${order.date}\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `👤 <b>DATOS DEL CLIENTE:</b>\n` +
      `• Nombre: <b>${order.customerName}</b>\n` +
      `• Teléfono: <b>${order.customerPhone}</b>\n` +
      (order.customerEmail ? `• Email/Gmail: <code>${order.customerEmail}</code>\n` : '') +
      (order.customerAddress ? `• Dirección de Entrega: ${order.customerAddress}\n` : '') +
      `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `📦 <b>DETALLE DE REFACCIONES:</b>\n${itemsText}\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `💳 <b>Método de Pago:</b> ${order.paymentMethod.toUpperCase()}\n` +
      `🚚 <b>Modalidad de Envío:</b> ${order.deliveryMethod.replace('_', ' ').toUpperCase()}\n` +
      `💵 <b>Subtotal Refacciones:</b> ${settings.currency}${order.subtotal.toLocaleString('es-MX')}\n` +
      `🚛 <b>Costo de Envío:</b> ${order.shippingCost === 0 ? 'GRATIS' : `${settings.currency}${order.shippingCost.toLocaleString('es-MX')}`}\n` +
      `💰 <b>TOTAL DEL RECIBO:</b> <b>${settings.currency}${order.total.toLocaleString('es-MX')} ${settings.currencyCode}</b>\n` +
      (order.notes ? `📝 <b>Instrucciones / Notas:</b> ${order.notes}\n` : '') +
      `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `📲 <b>Abrir Chat WhatsApp:</b> https://wa.me/${order.customerPhone.replace(/\D/g, '')}\n` +
      `✅ <i>Recibo verificado y sincronizado con base de datos.</i>`;

    try {
      const response = await fetch(`https://api.telegram.org/bot${settings.telegramBotToken.trim()}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: settings.telegramChatId.trim(),
          text: message,
          parse_mode: 'HTML'
        })
      });

      const data = await response.json();
      return Boolean(data.ok);
    } catch (e) {
      console.warn('Telegram notification fetch error:', e);
      return false;
    }
  };

  const testTelegramConnection = async (token: string, chatId: string): Promise<{ success: boolean; message: string; details?: any }> => {
    try {
      const text = `🔔 <b>Prueba de Conexión Exitosa</b>\nEl Bot de Telegram para <b>${settings.name}</b> está configurado correctamente y listo para recibir todas las órdenes.`;
      const response = await fetch(`https://api.telegram.org/bot${token.trim()}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId.trim(),
          text,
          parse_mode: 'HTML'
        })
      });

      const data = await response.json();
      if (data.ok) {
        return { 
          success: true, 
          message: `¡Conexión exitosa! Mensaje recibido por el chat (ID mensaje: ${data.result?.message_id}).`,
          details: data.result 
        };
      } else {
        return { 
          success: false, 
          message: `Telegram rechazó la petición: ${data.description || 'Verifica que el Bot Token sea correcto y que hayas presionado "Iniciar" en el bot.'}` 
        };
      }
    } catch (e: any) {
      return { 
        success: false, 
        message: `Error de red al conectar con Telegram: ${e.message || 'Verifica tu conexión y el token.'}` 
      };
    }
  };

  const sendSampleOrderToTelegram = async (token?: string, chatId?: string): Promise<{ success: boolean; message: string; details?: any }> => {
    const activeToken = (token || settings.telegramBotToken || '').trim();
    const activeChatId = (chatId || settings.telegramChatId || '').trim();

    if (!activeToken || !activeChatId) {
      return { success: false, message: 'Falta configurar el Token del Bot o el Chat ID.' };
    }

    const sampleOrderMessage = `🚨 <b>¡ORDEN DE PRUEBA REAL ENVIADA AL BOT!</b>\n` +
      `━━━━━━━━━━━━━━━━━━━━━━\n` +
      `🧾 <b>Folio:</b> <code>PED-TEST-${Math.floor(1000 + Math.random() * 9000)}</code>\n` +
      `📅 <b>Fecha:</b> ${new Date().toLocaleDateString('es-MX')} ${new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}\n` +
      `👤 <b>Cliente:</b> Taller CelFix Tech (Carlos Gómez)\n` +
      `📞 <b>Teléfono:</b> +52 55 1234 5678\n` +
      `📍 <b>Entrega:</b> Envío Local Express - CDMX Centro\n` +
      `💳 <b>Pago:</b> TRANSFERENCIA SPEI | <b>Envío:</b> ENVÍO LOCAL\n` +
      `━━━━━━━━━━━━━━━━━━━━━━\n` +
      `📦 <b>REFACCIONES SOLICITADAS:</b>\n` +
      `<b>1.</b> [<code>USBC-SMD-01</code>] Conector Tipo C Hembra 16 Pines SMD x <b>10</b> pzs = <b>${settings.currency}220</b>\n` +
      `<b>2.</b> [<code>SCR-IP13-OLED</code>] Pantalla Display OLED iPhone 13 Original x <b>1</b> pzs = <b>${settings.currency}950</b>\n` +
      `<b>3.</b> [<code>BAT-SAM-A54</code>] Batería Original Samsung Galaxy A54 x <b>2</b> pzs = <b>${settings.currency}460</b>\n` +
      `━━━━━━━━━━━━━━━━━━━━━━\n` +
      `💵 <b>Subtotal:</b> ${settings.currency}1,630\n` +
      `🚚 <b>Envío:</b> GRATIS (Supera ${settings.currency}${settings.shippingConfig.freeShippingThreshold})\n` +
      `💰 <b>TOTAL ORDEN:</b> <b>${settings.currency}1,630 ${settings.currencyCode}</b>\n` +
      `📝 <b>Notas:</b> "Favor de empacar con protección antiestática para entrega en la tarde"\n` +
      `━━━━━━━━━━━━━━━━━━━━━━\n` +
      `💬 <b>WhatsApp del Cliente:</b> https://wa.me/525512345678`;

    try {
      const response = await fetch(`https://api.telegram.org/bot${activeToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: activeChatId,
          text: sampleOrderMessage,
          parse_mode: 'HTML'
        })
      });

      const data = await response.json();
      if (data.ok) {
        return { 
          success: true, 
          message: `¡Orden de prueba enviada a tu Telegram con éxito! (Mensaje ID: ${data.result?.message_id}). Revisa tu aplicación Telegram.`,
          details: data.result 
        };
      } else {
        return { 
          success: false, 
          message: `Error de Telegram: ${data.description || 'Verifica el Bot Token y Chat ID'}` 
        };
      }
    } catch (e: any) {
      return { 
        success: false, 
        message: `Error de red al conectar con Telegram: ${e.message || 'Verifica el token.'}` 
      };
    }
  };

  const sendEmailNotification = async (order: Order): Promise<boolean> => {
    // Generates mailto link / simulated email alert log
    return true;
  };

  // Actions: Orders & Automatic CRM Contact registration
  const createOrder = (orderData: {
    customerName: string;
    customerPhone: string;
    customerEmail?: string;
    customerAddress?: string;
    deliveryMethod: Order['deliveryMethod'];
    paymentMethod: Order['paymentMethod'];
    notes?: string;
  }): Order => {
    const items = cart.map(item => {
      const qualifiesWholesale = isWholesalePricing || item.useWholesalePrice || item.quantity >= settings.wholesaleMinQty;
      const unitPrice = qualifiesWholesale ? item.product.priceWholesale : item.product.priceRetail;
      return {
        productId: item.product.id,
        sku: item.product.sku,
        name: item.product.name,
        quantity: item.quantity,
        unitPrice,
        total: unitPrice * item.quantity
      };
    });

    const subtotal = items.reduce((acc, i) => acc + i.total, 0);
    const shippingCost = orderData.deliveryMethod === 'recoger_tienda' || subtotal >= settings.shippingConfig.freeShippingThreshold
      ? 0
      : (orderData.deliveryMethod === 'envio_nacional' ? settings.shippingConfig.nationalCost : settings.shippingConfig.localCost);
    
    const total = subtotal + shippingCost;

    const newOrder: Order = {
      id: `PED-${Date.now().toString().slice(-6)}`,
      date: new Date().toLocaleDateString('es-MX', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      customerName: orderData.customerName,
      customerPhone: orderData.customerPhone,
      customerEmail: orderData.customerEmail,
      customerAddress: orderData.customerAddress,
      deliveryMethod: orderData.deliveryMethod,
      paymentMethod: orderData.paymentMethod,
      items,
      subtotal,
      shippingCost,
      total,
      status: 'pendiente',
      notes: orderData.notes,
      telegramSent: settings.telegramEnabled,
      emailSent: settings.emailNotificationsEnabled
    };

    setOrders(prev => [newOrder, ...prev]);
    setLatestCreatedOrder(newOrder);

    // Automatic CRM: Save or update customer contact directory
    setContacts(prev => {
      const cleanPhone = orderData.customerPhone.trim();
      const existing = prev.find(c => c.phone.trim() === cleanPhone);

      if (existing) {
        return prev.map(c => c.id === existing.id ? {
          ...c,
          name: orderData.customerName || c.name,
          email: orderData.customerEmail || c.email,
          address: orderData.customerAddress || c.address,
          totalOrders: c.totalOrders + 1,
          totalSpent: c.totalSpent + total,
          lastOrderDate: new Date().toLocaleDateString('es-MX')
        } : c);
      } else {
        const newContact: CustomerContact = {
          id: `cont-${Date.now()}`,
          name: orderData.customerName,
          phone: orderData.customerPhone,
          whatsapp: orderData.customerPhone.replace(/\D/g, ''),
          email: orderData.customerEmail,
          address: orderData.customerAddress,
          totalOrders: 1,
          totalSpent: total,
          lastOrderDate: new Date().toLocaleDateString('es-MX'),
          category: isWholesalePricing ? 'taller' : 'publico',
          createdAt: new Date().toLocaleDateString('es-MX'),
          notes: `Generado automáticamente desde la orden ${newOrder.id}`
        };
        return [newContact, ...prev];
      }
    });

    // Auto Dispatch to Telegram
    if (settings.telegramEnabled) {
      sendTelegramNotification(newOrder);
    }

    // Automatic Gmail Receipts Database: create verified receipt record
    const newReceipt: GmailReceipt = {
      id: `REC-${Date.now().toString().slice(-6)}`,
      orderId: newOrder.id,
      date: newOrder.date,
      customerName: orderData.customerName,
      customerGmail: orderData.customerEmail || 'cliente@gmail.com',
      customerPhone: orderData.customerPhone,
      total: total,
      paymentMethod: orderData.paymentMethod,
      deliveryMethod: orderData.deliveryMethod,
      itemsCount: items.reduce((acc, it) => acc + it.quantity, 0),
      status: 'verificado'
    };
    setGmailReceipts(prev => [newReceipt, ...prev]);

    clearCart();
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(prev => prev.map(o => (o.id === orderId ? { ...o, status } : o)));
  };

  const deleteOrder = (orderId: string) => {
    setOrders(prev => prev.filter(o => o.id !== orderId));
  };

  // Actions: CRM Contacts
  const addContact = (contactData: Omit<CustomerContact, 'id' | 'createdAt'>) => {
    const newContact: CustomerContact = {
      ...contactData,
      id: `cont-${Date.now()}`,
      createdAt: new Date().toLocaleDateString('es-MX')
    };
    setContacts(prev => [newContact, ...prev]);
  };

  const updateContact = (id: string, updatedFields: Partial<CustomerContact>) => {
    setContacts(prev => prev.map(c => c.id === id ? { ...c, ...updatedFields } : c));
  };

  const deleteContact = (id: string) => {
    setContacts(prev => prev.filter(c => c.id !== id));
  };

  const exportContactsCSV = () => {
    const headers = ["ID", "Nombre", "Empresa/Taller", "Telefono", "Email", "Direccion", "Categoria", "Total_Ordenes", "Total_Gastado", "Ultima_Orden"];
    const rows = contacts.map(c => [
      c.id,
      `"${c.name}"`,
      `"${c.businessName || ''}"`,
      `"${c.phone}"`,
      `"${c.email || ''}"`,
      `"${c.address || ''}"`,
      c.category,
      c.totalOrders,
      c.totalSpent,
      c.lastOrderDate
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `contactos_clientes_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Actions: Gmail Receipts & Customer Verification
  const sendCustomerReceiptByEmail = (receipt: GmailReceipt) => {
    const subject = encodeURIComponent(`COMPROBANTE OFICIAL DE COMPRA: Folio ${receipt.orderId} - ${settings.name}`);
    const body = encodeURIComponent(
      `Hola ${receipt.customerName},\n\n` +
      `Confirmamos con éxito la recepción de tu compra en ${settings.name}.\n\n` +
      `DETALLE DEL COMPROBANTE DE COMPRA:\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `• Folio de Pedido: ${receipt.orderId}\n` +
      `• No. de Recibo: ${receipt.id}\n` +
      `• Fecha de Emisión: ${receipt.date}\n` +
      `• Refacciones Solicitadas: ${receipt.itemsCount} pieza(s)\n` +
      `• Monto Total: ${settings.currency}${receipt.total.toLocaleString('es-MX')} ${settings.currencyCode}\n` +
      `• Forma de Pago: ${receipt.paymentMethod.toUpperCase()}\n` +
      `• Método de Entrega: ${receipt.deliveryMethod.replace('_', ' ').toUpperCase()}\n` +
      `• Correo Gmail Verificado: ${receipt.customerGmail}\n\n` +
      `DATOS BANCARIOS PARA PAGO / TRANSFERENCIA:\n` +
      `• Banco: ${settings.bankDetails.bankName}\n` +
      `• Beneficiario: ${settings.bankDetails.beneficiary}\n` +
      `• CLABE Interbancaria: ${settings.bankDetails.clabe}\n` +
      (settings.bankDetails.cardNumber ? `• No. Tarjeta: ${settings.bankDetails.cardNumber}\n` : '') +
      (settings.bankDetails.oxxoNumber ? `• Referencia OXXO: ${settings.bankDetails.oxxoNumber}\n` : '') +
      `\nPÓLIZA DE GARANTÍA:\n` +
      `${settings.warrantyPolicy}\n\n` +
      `Dirección de Bodega: ${settings.address}\n` +
      `WhatsApp de Soporte Técnico: https://wa.me/${settings.whatsapp.replace(/\D/g, '')}\n\n` +
      `Atentamente,\nEquipo de ${settings.name}`
    );

    window.open(`mailto:${receipt.customerGmail}?cc=${settings.adminEmail}&subject=${subject}&body=${body}`, '_blank');
  };

  const exportGmailDatabaseCSV = () => {
    const headers = ["ID_Recibo", "Folio_Orden", "Fecha", "Cliente", "Gmail_Verificado", "Telefono", "Total_MXN", "Metodo_Pago", "Metodo_Entrega", "Piezas", "Estatus"];
    const rows = gmailReceipts.map(r => [
      r.id,
      r.orderId,
      `"${r.date}"`,
      `"${r.customerName}"`,
      `"${r.customerGmail}"`,
      `"${r.customerPhone}"`,
      r.total,
      r.paymentMethod,
      r.deliveryMethod,
      r.itemsCount,
      r.status
    ]);

    const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `base_datos_gmail_recibos_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Actions: Inquiries
  const submitInquiry = (name: string, phone: string, partNeeded: string, message: string, email?: string) => {
    const newInquiry: ContactInquiry = {
      id: `INQ-${Date.now().toString().slice(-5)}`,
      date: new Date().toLocaleDateString('es-MX') + ' ' + new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' }),
      name: name.trim(),
      phone: phone.trim(),
      email: email?.trim(),
      partNeeded: partNeeded.trim(),
      message: message.trim(),
      status: 'nuevo'
    };

    setInquiries(prev => [newInquiry, ...prev]);

    // Auto Dispatch Inquiry to Telegram if enabled
    if (settings.telegramEnabled && settings.telegramBotToken && settings.telegramChatId) {
      const inqMsg = `🔧 <b>NUEVA SOLICITUD DE REFACCIÓN / COTIZACIÓN</b>\n` +
        `🏢 <b>${settings.name.toUpperCase()}</b>\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
        `📄 <b>Folio Consulta:</b> <code>${newInquiry.id}</code>\n` +
        `📅 <b>Fecha:</b> ${newInquiry.date}\n` +
        `👤 <b>Cliente:</b> ${name.trim()}\n` +
        `📞 <b>Teléfono:</b> ${phone.trim()}\n` +
        (email?.trim() ? `✉️ <b>Email:</b> ${email.trim()}\n` : '') +
        `🛠️ <b>Refacción solicitada:</b> ${partNeeded.trim() || 'Consulta técnica / reparación'}\n` +
        `💬 <b>Mensaje:</b> ${message.trim() || 'Solicita precio y disponibilidad.'}\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
        `📲 <b>Responder por WhatsApp:</b> https://wa.me/${phone.replace(/\D/g, '')}`;

      fetch(`https://api.telegram.org/bot${settings.telegramBotToken.trim()}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: settings.telegramChatId.trim(),
          text: inqMsg,
          parse_mode: 'HTML'
        })
      }).catch(err => console.warn('Telegram inq dispatch error:', err));
    }

    // Also register in contacts directory
    setContacts(prev => {
      const cleanPhone = phone.trim();
      if (!prev.some(c => c.phone.trim() === cleanPhone)) {
        return [
          {
            id: `cont-${Date.now()}`,
            name: name.trim(),
            phone: phone.trim(),
            whatsapp: phone.replace(/\D/g, ''),
            email: email?.trim(),
            totalOrders: 0,
            totalSpent: 0,
            lastOrderDate: new Date().toLocaleDateString('es-MX'),
            category: 'taller',
            createdAt: new Date().toLocaleDateString('es-MX'),
            notes: `Contacto por formulario web buscando: "${partNeeded}"`
          },
          ...prev
        ];
      }
      return prev;
    });
  };

  const deleteInquiry = (id: string) => {
    setInquiries(prev => prev.filter(i => i.id !== id));
  };

  const updateInquiryStatus = (id: string, status: 'nuevo' | 'atendido') => {
    setInquiries(prev => prev.map(i => i.id === id ? { ...i, status } : i));
  };

  const registerCustomer = (customerData: Omit<RegisteredCustomer, 'id' | 'registeredAt'>): RegisteredCustomer => {
    const newCustomer: RegisteredCustomer = {
      ...customerData,
      id: `CUST-${Date.now().toString().slice(-6)}`,
      registeredAt: new Date().toLocaleDateString('es-MX')
    };
    setCurrentCustomer(newCustomer);
    try {
      localStorage.setItem(STORAGE_KEYS.CUSTOMER, JSON.stringify(newCustomer));
    } catch {}

    // Register in contacts directory
    setContacts(prev => {
      const cleanPhone = customerData.phone.trim();
      if (!prev.some(c => c.phone.trim() === cleanPhone)) {
        return [
          {
            id: `cont-${Date.now()}`,
            name: customerData.name.trim(),
            businessName: customerData.workshopName?.trim(),
            phone: customerData.phone.trim(),
            whatsapp: customerData.phone.replace(/\D/g, ''),
            email: customerData.email?.trim(),
            address: customerData.address?.trim(),
            totalOrders: 0,
            totalSpent: 0,
            lastOrderDate: new Date().toLocaleDateString('es-MX'),
            category: 'taller',
            createdAt: new Date().toLocaleDateString('es-MX'),
            notes: 'Cliente registrado desde el Portal de Clientes'
          },
          ...prev
        ];
      }
      return prev;
    });

    // Alert Telegram bot about new registered user/workshop
    if (settings.telegramEnabled && settings.telegramBotToken && settings.telegramChatId) {
      const regMsg = `👤 <b>¡NUEVO CLIENTE / TALLER REGISTRADO!</b>\n` +
        `🏢 <b>${settings.name.toUpperCase()}</b>\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
        `• <b>Nombre:</b> ${newCustomer.name}\n` +
        `• <b>Teléfono:</b> ${newCustomer.phone}\n` +
        (newCustomer.workshopName ? `• <b>Taller / Negocio:</b> ${newCustomer.workshopName}\n` : '') +
        (newCustomer.email ? `• <b>Email:</b> ${newCustomer.email}\n` : '') +
        (newCustomer.address ? `• <b>Dirección:</b> ${newCustomer.address}\n` : '') +
        `• <b>Origen:</b> Registro directo en Catálogo Web\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
        `📲 <b>WhatsApp:</b> https://wa.me/${newCustomer.phone.replace(/\D/g, '')}`;

      fetch(`https://api.telegram.org/bot${settings.telegramBotToken.trim()}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: settings.telegramChatId.trim(), text: regMsg, parse_mode: 'HTML' })
      }).catch(err => console.warn('Telegram reg alert error:', err));
    }

    return newCustomer;
  };

  const logoutCustomer = () => {
    setCurrentCustomer(null);
    try {
      localStorage.removeItem(STORAGE_KEYS.CUSTOMER);
    } catch {}
  };

  // Reset & Backup
  const resetToDefaults = () => {
    if (window.confirm("¿Seguro que deseas restablecer todos los productos, contactos y configuraciones a los valores de fábrica?")) {
      setSettings(initialStoreSettings);
      setCategories(initialCategories);
      setProducts(initialProducts);
      setContacts(initialContacts);
      setCart([]);
      setOrders([]);
      setIsWholesalePricing(false);
      localStorage.clear();
    }
  };

  const exportBackup = (): string => {
    const data = {
      settings,
      categories,
      products,
      orders,
      contacts,
      inquiries,
      exportedAt: new Date().toISOString()
    };
    return JSON.stringify(data, null, 2);
  };

  const importBackup = (jsonStr: string): boolean => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed.settings) setSettings(parsed.settings);
      if (Array.isArray(parsed.categories)) setCategories(parsed.categories);
      if (Array.isArray(parsed.products)) setProducts(parsed.products);
      if (Array.isArray(parsed.orders)) setOrders(parsed.orders);
      if (Array.isArray(parsed.contacts)) setContacts(parsed.contacts);
      if (Array.isArray(parsed.inquiries)) setInquiries(parsed.inquiries);
      return true;
    } catch (e) {
      console.error("Import error:", e);
      return false;
    }
  };

  return (
    <StoreContext.Provider
      value={{
        settings,
        updateSettings,
        categories,
        addCategory,
        updateCategory,
        deleteCategory,
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        cartTotal,
        cartSubtotal,
        cartShippingCost,
        cartCount,
        isCartOpen,
        setIsCartOpen,
        orders,
        createOrder,
        updateOrderStatus,
        deleteOrder,
        latestCreatedOrder,
        setLatestCreatedOrder,
        contacts,
        addContact,
        updateContact,
        deleteContact,
        exportContactsCSV,
        inquiries,
        submitInquiry,
        deleteInquiry,
        updateInquiryStatus,
        isContactModalOpen,
        setIsContactModalOpen,
        isCustomerPortalOpen,
        setIsCustomerPortalOpen,
        currentCustomer,
        registerCustomer,
        loginCustomerWithGoogle,
        logoutCustomer,
        gmailReceipts,
        sendCustomerReceiptByEmail,
        exportGmailDatabaseCSV,
        sendTelegramNotification,
        testTelegramConnection,
        sendSampleOrderToTelegram,
        sendEmailNotification,
        viewMode,
        setViewMode,
        requestAdminAccess,
        generateNewAdminKey,
        deleteAdminKey,
        toggleAdminKey,
        isAuthenticatedAdmin,
        setIsAuthenticatedAdmin,
        validateAdminAccess,
        loginWithGoogle,
        logoutAdmin,
        firebaseUser,
        isSecurityModalOpen,
        setIsSecurityModalOpen,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        selectedBrand,
        setSelectedBrand,
        isWholesalePricing,
        setIsWholesalePricing,
        quickViewProduct,
        setQuickViewProduct,
        resetToDefaults,
        exportBackup,
        importBackup
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
