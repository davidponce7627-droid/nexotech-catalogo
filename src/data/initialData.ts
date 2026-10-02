import { Category, Product, StoreSettings, GmailReceipt } from '../types';

import heroImg from '../assets/images/hero_tech_repair_hardware_1790473432850.jpg';
import usbcImg from '../assets/images/product_usbc_charging_ports_1790473446596.jpg';
import screensImg from '../assets/images/product_phone_oled_screens_1790473463569.jpg';
import phonesImg from '../assets/images/product_smartphone_showcase_1790473474681.jpg';
import toolkitImg from '../assets/images/product_repair_toolkit_1790473485390.jpg';

export const initialStoreSettings: StoreSettings = {
  name: "TECH MATRIX REFACCIONES",
  tagline: "Importación Directa de Puertos Type-C, Celulares y Refacciones de Grado Técnico",
  logoIcon: "Cpu",
  currency: "$",
  currencyCode: "USD",
  whatsapp: "5215587654321",
  phone: "+52 (55) 8765-4321",
  secondaryPhone: "+52 (55) 9123-4567",
  supportWhatsapp: "5215587654322",
  email: "contacto@techmatrixrefacciones.com",
  adminEmail: "dr2490761@gmail.com", // Gmail del administrador para verificación y recepción de órdenes
  address: "Av. Central Tech #402, Pasaje Electrónico Local 18-B",
  locationNotes: "Local 18-B, Pasillo Central planta baja, frente a la fuente de la plaza",
  googleMapsUrl: "https://maps.google.com",
  businessHours: "Lunes a Sábado: 9:00 AM - 7:30 PM",
  announcement: "⚡ Envíos express a toda la república | Precios especiales de mayoreo a talleres y técnicos certificados",
  showAnnouncement: true,
  wholesaleMinQty: 5,
  warrantyPolicy: "Garantía de 30 días en refacciones con sello de fábrica intacto y sin soldaduras dañadas.",
  adminUser: "Devstsy@#_52",
  adminPassword: "5466915332",
  adminPin: "5466915332",
  heroHeadline: "Componentes, Puertos Type-C y Celulares con Garantía Mayorista",
  heroSubheadline: "Suministro directo para técnicos, talleres y distribuidores de telefonía móvil. Catálogo en tiempo real y cotizaciones directas vía WhatsApp.",
  facebook: "facebook.com/techmatrixrefacciones",
  instagram: "instagram.com/techmatrix.parts",
  tiktok: "tiktok.com/@techmatrix.refacciones",
  telegram: "t.me/techmatrixrefacciones",
  adminSecurityEnabled: true,
  adminKeys: [
    {
      id: "key-devstsy",
      label: "Devstsy (Dueño)",
      key: "Devstsy@#_52",
      role: "dueño",
      createdAt: "2026-09-27",
      active: true
    },
    {
      id: "key-numeric-5466",
      label: "Clave Numérica / Chat ID",
      key: "5466915332",
      role: "dueño",
      createdAt: "2026-09-27",
      active: true
    },
    {
      id: "key-master-1",
      label: "Llave Auxiliar Admin",
      key: "ADMIN-7742",
      role: "administrador",
      createdAt: "2026-09-26",
      active: true
    }
  ],
  // Telegram Bot Integration
  telegramBotToken: "7558835682:AAGKq0vheMlKSJsDGYy41nQ2jqSHbMiVCj0",
  telegramChatId: "5466915332",
  telegramEnabled: true,
  emailNotificationsEnabled: true,
  bankDetails: {
    bankName: "BBVA México",
    beneficiary: "Tech Matrix Refacciones S.A. de C.V.",
    clabe: "012180001234567890",
    cardNumber: "4152 3138 9012 3456",
    oxxoNumber: "9218 0123 4567 8901"
  },
  shippingConfig: {
    localCost: 5,
    nationalCost: 12,
    freeShippingThreshold: 75
  },
  aiAssistantEnabled: true,
  aiAssistantName: "NexoBot Asesor Técnico",
  aiAssistantWelcomeMessage: "¡Hola! 👋 Soy tu Asistente de Ventas y Consultas Técnicas de NEXO TECH. ¿Buscas alguna refacción, puerto Type-C o teléfono móvil?",
  aiAssistantTone: "comercial",
  aiAssistantCustomPrompt: "Eres el asesor técnico de ventas oficial de NEXO TECH. Tu objetivo es ayudar a los clientes a encontrar la refacción exacta para su modelo de celular, resolver dudas de compatibilidad de puertos Tipo C y pantallas, recomendar compras por mayoreo para técnicos, y facilitar el contacto por WhatsApp.",
  aiAssistantKnowledgeNotes: "Ofrecemos garantía de 30 días con sellos intactos. Envíos a todo el país. Precios de mayoreo a partir de 5 unidades por producto.",
  aiAssistantWhatsappDirect: true
};

export const initialContacts = [
  {
    id: "cont-1",
    name: "Carlos Mendoza",
    businessName: "Taller Celular Pro",
    phone: "+52 55 9876 5432",
    whatsapp: "5215598765432",
    email: "carlos.mendoza@tallerpro.mx",
    city: "Ciudad de México",
    address: "Calle Pino Suárez #140, Local 3",
    totalOrders: 6,
    totalSpent: 8450,
    lastOrderDate: "2026-09-26",
    category: "taller" as const,
    notes: "Cliente frecuente. Técnico especialista en soldadura de centros de carga Samsung.",
    createdAt: "2026-08-10"
  },
  {
    id: "cont-2",
    name: "Dra. Rebeca Gómez",
    businessName: "FixPoint Monterrey",
    phone: "+52 81 1234 5678",
    whatsapp: "5218112345678",
    email: "compras@fixpoint.com",
    city: "Monterrey, N.L.",
    address: "Av. Constitución #820",
    totalOrders: 12,
    totalSpent: 24900,
    lastOrderDate: "2026-09-25",
    category: "mayorista" as const,
    notes: "Distribuidor mayorista de displays iPhone y pantallas OLED con marco.",
    createdAt: "2026-07-02"
  },
  {
    id: "cont-3",
    name: "Miguel Ángel Ruiz",
    businessName: "Servicio Técnico Ruiz",
    phone: "+52 33 8765 4321",
    whatsapp: "5213387654321",
    email: "miguel.ruiz.tec@gmail.com",
    city: "Guadalajara, Jal.",
    address: "Av. Juárez #55, Centro",
    totalOrders: 3,
    totalSpent: 3820,
    lastOrderDate: "2026-09-24",
    category: "tecnico" as const,
    notes: "Pide paquetes de conectores Tipo C x50 pzs y herramientas.",
    createdAt: "2026-09-01"
  }
];

export const initialCategories: Category[] = [
  {
    id: "cat-puertos",
    name: "Puertos de Carga & Centros de Carga",
    slug: "puertos-carga",
    description: "Conectores Type-C hembra, sub-placas de carga rápida, pines reforzados y módulos V8",
    iconName: "Cable"
  },
  {
    id: "cat-celulares",
    name: "Celulares & Equipos",
    slug: "celulares",
    description: "Smartphones nuevos sellados y seminuevos certificados Grado A+ libres de fábrica",
    iconName: "Smartphone"
  },
  {
    id: "cat-pantallas",
    name: "Pantallas & Displays OLED / Incell",
    slug: "pantallas",
    description: "Módulos de pantalla con marco y sin marco para iPhone, Samsung, Xiaomi y Motorola",
    iconName: "Monitor"
  },
  {
    id: "cat-flex",
    name: "Flex, Antenas & Botones",
    slug: "flex-conectores",
    description: "Flex de interconexión main, flex de encendido/volumen y antenas de señal",
    iconName: "Workflow"
  },
  {
    id: "cat-baterias",
    name: "Baterías & Celdas",
    slug: "baterias",
    description: "Baterías calidad Foxconn y celdas OEM con ciclo 0 y protección térmica",
    iconName: "BatteryCharging"
  },
  {
    id: "cat-herramientas",
    name: "Herramientas de Taller & Químicos",
    slug: "herramientas",
    description: "Estaciones de calor, mantas térmicas, desarmadores de precisión y pegamento para display",
    iconName: "Wrench"
  }
];

export const initialProducts: Product[] = [
  // --- PUERTOS DE CARGA ---
  {
    id: "prod-puerto-01",
    sku: "USBC-UNIV-PACK50",
    name: "Pack x50 Conectores Type-C Hembra Universal 16 Pines SMD",
    categoryId: "cat-puertos",
    brand: "Universal",
    priceRetail: 280,
    priceWholesale: 195,
    stock: 45,
    image: usbcImg,
    badge: "Más Vendido",
    description: "Conectores USB-C estándar para reemplazo en soldadura SMD. Fabricados con aleación de cobre estañado para máxima conductividad y durabilidad térmica.",
    compatibility: ["Universal Android", "Tablets Chinas", "Bocinas Bluetooth", "Dispositivos tipo C"],
    specs: {
      "Pines": "16 Pines SMD reforzados",
      "Material": "Cobre niquelado / Aislamiento LCP",
      "Soporte": "Carga rápida hasta 65W (20V/3.25A)",
      "Presentación": "Bolsa antiestática con 50 piezas"
    },
    featured: true,
    inStock: true
  },
  {
    id: "prod-puerto-02",
    sku: "PLACA-SAMS-A12",
    name: "Sub-Placa de Carga USB-C Samsung Galaxy A12 / A125F con Micrófono",
    categoryId: "cat-puertos",
    brand: "Samsung",
    priceRetail: 110,
    priceWholesale: 68,
    stock: 28,
    image: usbcImg,
    badge: "Original OEM",
    description: "Placa lógica secundaria de carga completa con puerto USB Type-C, micrófono integrado, conector de audio jack 3.5mm y componentes de protección contra sobretensión.",
    compatibility: ["Samsung Galaxy A12 (SM-A125F)", "Samsung Galaxy A12 Nacho (SM-A127F)"],
    specs: {
      "Puerto": "USB Tipo C 2.0 Fast Charge",
      "Integrados": "Micrófono MEMS + Filtro ESD",
      "Montaje": "Instalación directa Plug & Play"
    },
    featured: true,
    inStock: true
  },
  {
    id: "prod-puerto-03",
    sku: "FLEX-IP15-CARGA",
    name: "Flex de Carga USB-C iPhone 15 / 15 Plus Original Desmontaje",
    categoryId: "cat-puertos",
    brand: "Apple iPhone",
    priceRetail: 390,
    priceWholesale: 285,
    stock: 14,
    image: usbcImg,
    badge: "Grado Original",
    description: "Módulo de puerto USB Type-C original con micrófono principal, antena de señal inferior y sensor de presión. No genera alertas de compatibilidad.",
    compatibility: ["iPhone 15 (A3090, A2846)", "iPhone 15 Plus (A3094, A2847)"],
    specs: {
      "Conector": "USB Type-C 480 Mbps",
      "Micrófono": "Doble micrófono con cancelación de ruido",
      "Color": "Negro Titanio"
    },
    featured: true,
    inStock: true
  },
  {
    id: "prod-puerto-04",
    sku: "PLACA-XIAO-RN12",
    name: "Sub-Board Carga Rápida 33W Xiaomi Redmi Note 12 4G",
    categoryId: "cat-puertos",
    brand: "Xiaomi",
    priceRetail: 130,
    priceWholesale: 78,
    stock: 35,
    image: usbcImg,
    badge: "Soporta Turbo Charge",
    description: "Placa de carga con circuito de control de carga rápida Mi Turbo Charge 33W. Incluye blindaje térmico y micrófono de llamadas limpio.",
    compatibility: ["Xiaomi Redmi Note 12 4G (23021RAAEG, 23028RA60L)"],
    specs: {
      "Tecnología": "Turbo Charge 33W",
      "Conector": "Type-C blindado con sellos de goma",
      "Estado": "100% Nuevo"
    },
    featured: false,
    inStock: true
  },
  {
    id: "prod-puerto-05",
    sku: "PLACA-MOTO-G60",
    name: "Sub-Placa de Carga Motorola Moto G60 / G60s con Puerto Type-C",
    categoryId: "cat-puertos",
    brand: "Motorola",
    priceRetail: 115,
    priceWholesale: 72,
    stock: 22,
    image: usbcImg,
    badge: "TurboPower",
    description: "Circuito de alimentación de repuesto con conector Type-C y componentes pasivos para activación de TurboPower Motorola.",
    compatibility: ["Motorola Moto G60 (XT2135-1)", "Motorola Moto G60s (XT2133-2)"],
    specs: {
      "Soporte": "Motorola TurboPower 20W/30W",
      "Conectores": "Type-C hembra + Coaxial RF antena",
      "Garantía": "30 días"
    },
    featured: false,
    inStock: true
  },

  // --- CELULARES & EQUIPOS ---
  {
    id: "prod-cel-01",
    sku: "PHONE-IP13-128",
    name: "Apple iPhone 13 128GB Medianoche - Seminuevo Grado A+ Batería 92%+",
    categoryId: "cat-celulares",
    brand: "Apple iPhone",
    priceRetail: 7890,
    priceWholesale: 7200,
    stock: 6,
    image: phonesImg,
    badge: "Grado A+ Certificado",
    description: "Equipo original libre para cualquier compañía telefónica internacional. Estética 9.8/10 sin rayones profundos. Batería original garantizada superior al 90%.",
    compatibility: ["Libre Redes 5G / 4G LTE", "Face ID 100% Funcional", "TrueTone Activo"],
    specs: {
      "Almacenamiento": "128 GB NVMe",
      "Pantalla": "Super Retina XDR OLED 6.1 pulgadas",
      "Procesador": "Apple A15 Bionic 6 núcleos",
      "Cámaras": "Doble 12MP con Modo Cine 4K",
      "Incluye": "Cable USB-C a Lightning trenzado + Garantía 90 días"
    },
    featured: true,
    inStock: true
  },
  {
    id: "prod-cel-02",
    sku: "PHONE-SAMS-S23",
    name: "Samsung Galaxy S23 5G 256GB Phantom Black - Desbloqueado de Fábrica",
    categoryId: "cat-celulares",
    brand: "Samsung",
    priceRetail: 9450,
    priceWholesale: 8850,
    stock: 4,
    image: phonesImg,
    badge: "Gama Alta",
    description: "Compacto premium con Snapdragon 8 Gen 2 for Galaxy. Pantalla Dynamic AMOLED 2X a 120Hz adaptativos, construcción en Armor Aluminum y cámaras de nivel profesional.",
    compatibility: ["Dual SIM (Nano-SIM + eSIM)", "Soporte Carga Rápida 25W Type-C"],
    specs: {
      "Procesador": "Snapdragon 8 Gen 2 (4nm)",
      "RAM / ROM": "8GB LPDDR5X / 256GB UFS 4.0",
      "Pantalla": "6.1\" AMOLED 120Hz 1750 nits",
      "Cámara": "50MP OIS + 10MP Telefoto 3x + 12MP Gran Angular"
    },
    featured: true,
    inStock: true
  },
  {
    id: "prod-cel-03",
    sku: "PHONE-POCO-X6",
    name: "Xiaomi POCO X6 Pro 5G 12GB+512GB Amarillo Cuero Vegano - Nuevo Sellado",
    categoryId: "cat-celulares",
    brand: "Xiaomi",
    priceRetail: 5990,
    priceWholesale: 5450,
    stock: 9,
    image: phonesImg,
    badge: "Nuevo Sellado",
    description: "Monstruo de rendimiento con procesador MediaTek Dimensity 8300-Ultra, pantalla CrystalRes 1.5K Flow AMOLED de 120Hz y carga hiperrápida de 67W.",
    compatibility: ["Global Version Oficial", "Dual 5G Standby"],
    specs: {
      "Memoria": "12GB RAM + 512GB Almacenamiento",
      "Carga": "67W Turbo Charge (cargador incluido en caja)",
      "Batería": "5000 mAh",
      "Pantalla": "6.67\" AMOLED 1.5K 1800 nits"
    },
    featured: true,
    inStock: true
  },
  {
    id: "prod-cel-04",
    sku: "PHONE-MOTO-G84",
    name: "Motorola Moto G84 5G 256GB / 8GB RAM Viva Magenta Pantone",
    categoryId: "cat-celulares",
    brand: "Motorola",
    priceRetail: 3850,
    priceWholesale: 3420,
    stock: 12,
    image: phonesImg,
    badge: "Excelente Rendimiento",
    description: "Smartphone estilizado con acabado en piel vegana color Pantone del año. Pantalla pOLED FHD+ a 120Hz y sonido espacial Dolby Atmos.",
    compatibility: ["Libre para cualquier operador", "NFC para pagos contactless"],
    specs: {
      "Procesador": "Snapdragon 695 5G",
      "Pantalla": "6.55\" pOLED 10 bits 120Hz",
      "Batería": "5000 mAh + Carga TurboPower 30W"
    },
    featured: false,
    inStock: true
  },

  // --- PANTALLAS & DISPLAYS ---
  {
    id: "prod-pantalla-01",
    sku: "DSP-SAMS-A54-OLED",
    name: "Pantalla OLED Original Samsung Galaxy A54 5G Con Marco Frontal",
    categoryId: "cat-pantallas",
    brand: "Samsung",
    priceRetail: 1450,
    priceWholesale: 1080,
    stock: 18,
    image: screensImg,
    badge: "OLED Con Marco",
    description: "Repuesto de display AMOLED original con lector de huella digital integrado bajo pantalla funcional al 100%. Viene pre-ensamblada con el chasis metálico para instalación en 10 minutos.",
    compatibility: ["Samsung Galaxy A54 5G (SM-A546B, SM-A546V, SM-A5460)"],
    specs: {
      "Tecnología": "Super AMOLED 120Hz",
      "Brillo": "1000 nits HBM",
      "Huella": "Soporta sensor dactilar óptico calibrable",
      "Tipo": "Módulo completo con marco"
    },
    featured: true,
    inStock: true
  },
  {
    id: "prod-pantalla-02",
    sku: "DSP-IP11-INCELL",
    name: "Display iPhone 11 Calidad Incell FHD TrueTone Programable",
    categoryId: "cat-pantallas",
    brand: "Apple iPhone",
    priceRetail: 490,
    priceWholesale: 340,
    stock: 32,
    image: screensImg,
    badge: "Incell FHD",
    description: "Pantalla táctil ultra delgada con tecnología Incell, excelente ángulo de visión de 360 grados, respuesta táctil sin ghosting y chip transferible para activar TrueTone.",
    compatibility: ["iPhone 11 (A2111, A2223, A2221)"],
    specs: {
      "Resolución": "1792 x 828 a 326 ppi",
      "Táctil": "Incell capacitive touch multi-punto",
      "Programable": "Compatible con QianLi / iCopy para TrueTone"
    },
    featured: true,
    inStock: true
  },
  {
    id: "prod-pantalla-03",
    sku: "DSP-XIAO-RN12-AMOLED",
    name: "Pantalla Display Xiaomi Redmi Note 12 4G / 5G AMOLED Con Marco",
    categoryId: "cat-pantallas",
    brand: "Xiaomi",
    priceRetail: 980,
    priceWholesale: 740,
    stock: 15,
    image: screensImg,
    badge: "AMOLED 120Hz",
    description: "Display AMOLED con colores vivos y negros absolutos. Tasa de refresco fluida de 120Hz idéntica a la pieza de fábrica.",
    compatibility: ["Redmi Note 12 4G", "Redmi Note 12 5G", "Poco X5 5G"],
    specs: {
      "Panel": "AMOLED 120Hz",
      "Colores": "16.7 Millones de colores",
      "Presentación": "Con marco pre-instalado"
    },
    featured: false,
    inStock: true
  },
  {
    id: "prod-pantalla-04",
    sku: "DSP-MOTO-G22-LCD",
    name: "Pantalla Completa Motorola Moto G22 / E32 LCD Con Marco",
    categoryId: "cat-pantallas",
    brand: "Motorola",
    priceRetail: 430,
    priceWholesale: 290,
    stock: 25,
    image: screensImg,
    badge: "Económica & Probada",
    description: "Módulo LCD con digitalizador táctil montado en marco de policarbonato reforzado. Ideal para talleres de reparación rápida.",
    compatibility: ["Moto G22 (XT2231)", "Moto E32 (XT2227)"],
    specs: {
      "Tecnología": "IPS LCD 90Hz",
      "Tamaño": "6.5 pulgadas",
      "Color": "Negro"
    },
    featured: false,
    inStock: true
  },

  // --- FLEX & CONECTORES ---
  {
    id: "prod-flex-01",
    sku: "FLX-SAMS-A32-MAIN",
    name: "Flex de Interconexión Main a Sub-Placa Samsung Galaxy A32 4G",
    categoryId: "cat-flex",
    brand: "Samsung",
    priceRetail: 65,
    priceWholesale: 38,
    stock: 40,
    image: usbcImg,
    badge: "Esencial Taller",
    description: "Cinta flex de alta resistencia que conecta la placa madre superior con la sub-placa de carga inferior. Resuelve problemas de falso contacto en carga y micrófono.",
    compatibility: ["Samsung Galaxy A32 4G (SM-A325F, SM-A325M)"],
    specs: {
      "Longitud": "Ajuste exacto OEM",
      "Líneas": "Alimentación VBUS + Datos USB + Señal RF"
    },
    featured: false,
    inStock: true
  },
  {
    id: "prod-flex-02",
    sku: "FLX-IP12-PWRVOL",
    name: "Flex de Botones de Volumen, Silencio y Flash iPhone 12 / 12 Pro",
    categoryId: "cat-flex",
    brand: "Apple iPhone",
    priceRetail: 160,
    priceWholesale: 110,
    stock: 19,
    image: usbcImg,
    badge: "Calidad OEM",
    description: "Cinta flex con micro-interruptores metálicos para volumen +/-, switch mute vibrador y flash LED True Tone posterior.",
    compatibility: ["iPhone 12 (A2403)", "iPhone 12 Pro (A2407)"],
    specs: {
      "Puntos de contacto": "Dorados anticorrosión",
      "Sensación": "Click firme táctil"
    },
    featured: false,
    inStock: true
  },

  // --- BATERÍAS ---
  {
    id: "prod-bat-01",
    sku: "BAT-IP11-FOXCONN",
    name: "Batería iPhone 11 3110mAh Calidad Foxconn con Flex para Trasplante",
    categoryId: "cat-baterias",
    brand: "Apple iPhone",
    priceRetail: 380,
    priceWholesale: 265,
    stock: 24,
    image: usbcImg,
    badge: "Ciclo Cero",
    description: "Celda de cobalto puro de alta densidad energética. Incluye terminales limpios para soldar el BMS original y evitar el mensaje de 'Pieza desconocida'.",
    compatibility: ["iPhone 11 (A2111, A2223, A2221)"],
    specs: {
      "Capacidad": "3110 mAh nominal",
      "Voltaje": "3.83V / 11.91Wh",
      "Ciclos": "0 Ciclos de carga comprobados",
      "Adhesivo": "Tiras adhesivas pull-tabs incluidas"
    },
    featured: true,
    inStock: true
  },
  {
    id: "prod-bat-02",
    sku: "BAT-SAMS-EB-BA505",
    name: "Batería Samsung Galaxy A50 / A30s / A20 EB-BA505ABU Original",
    categoryId: "cat-baterias",
    brand: "Samsung",
    priceRetail: 290,
    priceWholesale: 185,
    stock: 30,
    image: usbcImg,
    badge: "100% Original",
    description: "Batería de polímero de iones de litio con circuito integrado de seguridad Seiko contra sobrecalentamiento y cortocircuito.",
    compatibility: ["Samsung Galaxy A50 (A505)", "A30s (A307)", "A20 (A205)"],
    specs: {
      "Modelo": "EB-BA505ABU",
      "Capacidad": "4000 mAh (15.4Wh)",
      "Protección": "PCM integrado"
    },
    featured: false,
    inStock: true
  },

  // --- HERRAMIENTAS ---
  {
    id: "prod-tool-01",
    sku: "TOOL-KIT-24IN1",
    name: "Set Profesional de Destornilladores de Precisión 24 en 1 Estuche Magnético",
    categoryId: "cat-herramientas",
    brand: "Universal",
    priceRetail: 320,
    priceWholesale: 220,
    stock: 20,
    image: toolkitImg,
    badge: "Herramienta Pro",
    description: "Puntas magnéticas de acero S2 tratado térmicamente con dureza 60HRC. Incluye puntas Pentalobe para iPhone, Torx Security, Tri-Wing y Phillips especiales para electrónica fina.",
    compatibility: ["iPhone", "Samsung", "MacBook", "Nintendo Switch", "Laptops y Celulares"],
    specs: {
      "Puntas": "24 puntas magnéticas S2",
      "Mango": "Aleación de aluminio con rodamiento giratorio 360°",
      "Estuche": "Apertura Push-to-open de aluminio anodizado"
    },
    featured: true,
    inStock: true
  },
  {
    id: "prod-tool-02",
    sku: "TOOL-GLUE-T7000",
    name: "Pegamento Adhesivo Epóxico Negro T-7000 50ml con Boquilla de Precisión",
    categoryId: "cat-herramientas",
    brand: "Universal",
    priceRetail: 85,
    priceWholesale: 48,
    stock: 55,
    image: toolkitImg,
    badge: "Indispensable",
    description: "Adhesivo líquido negro de secado elástico ideal para sellado hermético de marcos de pantalla, tapas traseras de cristal y biseles sin filtraciones de luz.",
    compatibility: ["Displays LCD / OLED", "Tapas traseras de cristal", "Chasis metálicos"],
    specs: {
      "Contenido": "50 ml con aguja dosificadora",
      "Color": "Negro opaco",
      "Tiempo de secado": "Fijación inicial en 6 min / Total 24 hrs"
    },
    featured: false,
    inStock: true
  }
];

export const initialGmailReceipts: GmailReceipt[] = [
  {
    id: "REC-892401",
    orderId: "PED-892401",
    date: "2026-09-27 10:45",
    customerName: "Carlos Mendoza",
    customerGmail: "carlos.mendoza@tallerpro.mx",
    customerPhone: "+52 55 9876 5432",
    total: 2150,
    paymentMethod: "transferencia",
    deliveryMethod: "envio_local",
    itemsCount: 12,
    status: "verificado"
  },
  {
    id: "REC-892398",
    orderId: "PED-892398",
    date: "2026-09-27 09:12",
    customerName: "Valeria Ríos",
    customerGmail: "valeria.rios.tecnics@gmail.com",
    customerPhone: "+52 55 8123 4567",
    total: 4890,
    paymentMethod: "oxxo",
    deliveryMethod: "envio_nacional",
    itemsCount: 5,
    status: "verificado"
  },
  {
    id: "REC-892350",
    orderId: "PED-892350",
    date: "2026-09-26 17:30",
    customerName: "Ing. Jorge Hernández",
    customerGmail: "jorge.hernandez.fix@gmail.com",
    customerPhone: "+52 55 3344 5566",
    total: 1450,
    paymentMethod: "transferencia",
    deliveryMethod: "recoger_tienda",
    itemsCount: 8,
    status: "verificado"
  },
  {
    id: "REC-892210",
    orderId: "PED-892210",
    date: "2026-09-26 14:15",
    customerName: "Taller Movil Center",
    customerGmail: "dr2490761@gmail.com",
    customerPhone: "+52 55 7788 9900",
    total: 3620,
    paymentMethod: "transferencia",
    deliveryMethod: "envio_local",
    itemsCount: 15,
    status: "verificado"
  }
];
