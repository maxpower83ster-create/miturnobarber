// =========================================================================
// MiTurnoBarber - Motor Central SaaS Multi-Tenancy & Persistencia
// =========================================================================

const STORAGE_KEYS = {
  SHOPS: 'miturnobarber_shops_v9',
  APPOINTMENTS: 'miturnobarber_appointments_v9',
  ACTIVE_SHOP_ID: 'miturnobarber_active_shop_id_v9',
  AUTH_SESSION: 'miturnobarber_auth_session_v9',
  CLOUD_CONFIG: 'miturnobarber_cloud_config_v9'
};

// =========================================================================
// CONFIGURACIÓN SUPABASE EN TIEMPO REAL (CLOUD DATABASE)
// =========================================================================
const SUPABASE_CONFIG = {
  url: 'https://tgxdllqnsspohfubqps.supabase.co',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRneGRsbHFuc3Nwb2hmdWJxcHMiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTc2MDk5MTYwMSwiZXhwIjoyMDc2NTY3NjAxfQ.sB-B-aLTY8uRt5PT6fHEJeI71VbCyy3oB_cYh15m4'
};

// Cliente REST ligero y resiliente para Supabase
async function supabaseFetch(endpoint, method = 'GET', body = null, extraHeaders = {}) {
  try {
    const url = `${SUPABASE_CONFIG.url}/rest/v1/${endpoint}`;
    const headers = {
      'apikey': SUPABASE_CONFIG.anonKey,
      'Authorization': `Bearer ${SUPABASE_CONFIG.anonKey}`,
      'Content-Type': 'application/json',
      ...extraHeaders
    };
    const options = { method, headers };
    if (body && (method === 'POST' || method === 'PATCH' || method === 'PUT')) {
      options.body = JSON.stringify(body);
    }
    const res = await fetch(url, options);
    if (!res.ok) {
      const errText = await res.text();
      console.warn(`Supabase ${method} ${endpoint} aviso:`, errText);
      return null;
    }
    const contentType = res.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await res.json();
    }
    return true;
  } catch (err) {
    console.warn(`Supabase offline o error de red (${endpoint}):`, err);
    return null;
  }
}

// Paleta de Colores Flúor Neón Disponibles
const FLUOR_THEMES = [
  { id: 'green', name: 'Verde Cyberpunk', color: '#00ff88', glow: 'rgba(0, 255, 136, 0.45)', light: 'rgba(0, 255, 136, 0.15)', border: 'rgba(0, 255, 136, 0.4)' },
  { id: 'gold', name: 'Dorado / Oro Neón', color: '#ffd700', glow: 'rgba(255, 215, 0, 0.45)', light: 'rgba(255, 215, 0, 0.15)', border: 'rgba(255, 215, 0, 0.4)' },
  { id: 'cyan', name: 'Cyan / Azul Neón', color: '#00e5ff', glow: 'rgba(0, 229, 255, 0.45)', light: 'rgba(0, 229, 255, 0.15)', border: 'rgba(0, 229, 255, 0.4)' },
  { id: 'magenta', name: 'Magenta / Fucsia', color: '#ff007f', glow: 'rgba(255, 0, 127, 0.45)', light: 'rgba(255, 0, 127, 0.15)', border: 'rgba(255, 0, 127, 0.4)' },
  { id: 'orange', name: 'Naranja Flúor', color: '#ff6b00', glow: 'rgba(255, 107, 0, 0.45)', light: 'rgba(255, 107, 0, 0.15)', border: 'rgba(255, 107, 0, 0.4)' },
  { id: 'purple', name: 'Púrpura Ultravioleta', color: '#a855f7', glow: 'rgba(168, 85, 247, 0.45)', light: 'rgba(168, 85, 247, 0.15)', border: 'rgba(168, 85, 247, 0.4)' }
];

// Cuenta Maestra SuperAdmin
const SUPERADMIN_ACCOUNT = {
  email: 'admin@miturnobarber.com',
  password: 'admin123',
  name: 'Dueño de MiTurnoBarber',
  role: 'superadmin'
};

const DEFAULT_SHOPS = [
  {
    id: 'casa-brava',
    slug: 'casa-brava',
    name: 'Casa Brava',
    email: 'contacto@casabrava.com',
    password: 'barber123', // Contraseña para el panel
    subtitle: 'BARBERÍA & CLUB MASCULINO',
    heroTitle: 'Tu estilo habla por ti.',
    heroHighlight: 'Defínelo con expertos.',
    tagline: 'Tradición en navaja, toalla caliente y los mejores degradés modernos de Salto.',
    address: 'Calle Uruguay 850, Salto',
    phone: '59899123456',
    notificationPreference: 'both', // 'owner', 'barber', 'both'
    status: 'active', // 'active', 'suspended', 'trial'
    trialDays: 14,
    trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    monthlyFee: 1800,
    plan: 'pro',
    brandColor: '#00ff88',
    bgImage: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&q=80',
    workingHours: {
      start: '09:00',
      end: '20:00',
      intervalMinutes: 45,
      daysOpen: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
    },
    promotions: {
      pointsSystem: { enabled: true, cutsRequired: 5, discountPercent: 50 },
      birthday: { enabled: true, discountPercent: 20 },
      happyHour: { enabled: true, discountPercent: 15, days: ['Martes', 'Miércoles'], startHour: '09:00', endHour: '13:00' },
      upselling: { enabled: true }
    },
    barbers: [
      { 
        id: 'b1', 
        name: 'Vicente Cruz', 
        role: 'Barbero Maestro • Fade', 
        photo: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=200&q=80',
        rating: '4.9 (128)',
        commissionRate: 0.55,
        daysOff: [0], // Domingo libre
        phone: '59899111222'
      },
      { 
        id: 'b2', 
        name: 'Lucas Salto', 
        role: 'Barbero Senior • Barbas', 
        photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80',
        rating: '5.0 (94)',
        commissionRate: 0.50,
        daysOff: [1], // Lunes libre
        phone: '59899333444'
      }
    ],
    services: [
      { 
        id: 's1', 
        name: 'Corte Clásico & Fade', 
        price: 450, 
        duration: '30 min', 
        desc: 'Degradé milimétrico a navaja, lavado y peinado profesional.',
        photo: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=160&q=80',
        isPromo: false
      },
      { 
        id: 's2', 
        name: 'Ritual de Barba Tradicional', 
        price: 350, 
        duration: '30 min', 
        desc: 'Toalla caliente, aceites esenciales, perfilado a navaja e hidratación.',
        photo: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=160&q=80',
        isPromo: false
      },
      { 
        id: 's3', 
        name: 'Combo Completo (Pelo + Barba)', 
        price: 700, 
        duration: '60 min', 
        desc: 'La experiencia completa: corte de autor, barba esculpida y toalla caliente.',
        photo: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=160&q=80',
        isPromo: true
      },
      { 
        id: 's4', 
        name: 'Diseño & Perfilado de Cejas', 
        price: 200, 
        duration: '15 min', 
        desc: 'Limpieza y alineación masculina con acabado limpio y natural.',
        photo: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=160&q=80',
        isPromo: false
      }
    ],
    hasStore: true,
    plan: 'pro',
    products: [
      { 
        id: 'p1', 
        name: 'Pomada Matte Gold (Fijación Fuerte)', 
        price: 350, 
        desc: 'Efecto seco sin brillo, ideal para degradés modernos y peinados texturados.',
        photo: 'https://images.unsplash.com/photo-1597854710119-a6a4220b33b9?w=160&q=80',
        active: true
      },
      { 
        id: 'p2', 
        name: 'Aceite Esencial para Barba y Bigote', 
        price: 320, 
        desc: 'Hidratación profunda con aroma a cedro y madera noble. Suaviza el vello.',
        photo: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=160&q=80',
        active: true
      },
      { 
        id: 'p3', 
        name: 'Cera en Polvo Volumen & Textura', 
        price: 400, 
        desc: 'Aporta volumen instantáneo en la raíz con sensación ligera y mate.',
        photo: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=160&q=80',
        active: true
      }
    ]
  }
];

const DEFAULT_APPOINTMENTS = [
  {
    id: 'apt-1',
    code: 'CB-9402',
    shopId: 'casa-brava',
    clientName: 'Alejandro Ramos',
    clientPhone: '099554433',
    barberId: 'b1',
    barberName: 'Vicente Cruz',
    serviceId: 's3',
    serviceName: 'Combo Completo (Pelo + Barba)',
    price: 700,
    discountApplied: 0,
    promoType: null,
    productName: null,
    productPrice: 0,
    date: new Date().toISOString().split('T')[0],
    time: '16:00',
    status: 'confirmed', // 'confirmed', 'completed', 'cancelled'
    createdAt: new Date().toISOString()
  }
];

// =========================================================================
// PERSISTENCIA E INICIALIZACIÓN CON SUPABASE
// =========================================================================

// Mapeo entre modelo JavaScript local y columnas de Supabase
function mapShopToSupabase(s) {
  return {
    id: s.id,
    slug: s.slug || s.id,
    name: s.name,
    email: s.email || `contacto@${s.id}.com`,
    password_hash: s.password || 'barber123',
    role: s.role || 'barber',
    status: s.status || 'active',
    trial_days: s.trialDays || 14,
    trial_ends_at: s.trialEndsAt || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    monthly_fee: s.monthlyFee || 1900,
    plan: s.plan || 'pro',
    phone: s.phone || '59899123456',
    address: s.address || 'Salto, Uruguay',
    brand_color: s.brandColor || '#00ff88',
    promotions: s.promotions || getDefaultPromotionsConfig(),
    working_hours: s.workingHours || null,
    barbers: s.barbers || [],
    services: s.services || [],
    products: s.products || []
  };
}

function mapShopFromSupabase(row) {
  return {
    id: row.id,
    slug: row.slug || row.id,
    name: row.name,
    email: row.email,
    password: row.password_hash,
    role: row.role || 'barber',
    status: row.status || 'active',
    trialDays: row.trial_days || 14,
    trialEndsAt: row.trial_ends_at,
    monthlyFee: Number(row.monthly_fee) || 1900,
    plan: row.plan || 'pro',
    phone: row.phone,
    address: row.address,
    brandColor: row.brand_color || '#00ff88',
    promotions: row.promotions || getDefaultPromotionsConfig(),
    workingHours: row.working_hours,
    barbers: row.barbers || [],
    services: row.services || [],
    products: row.products || [],
    hasStore: (row.plan !== 'standard')
  };
}

function mapAppointmentToSupabase(apt) {
  return {
    id: apt.id,
    shop_id: apt.shopId,
    code: apt.code || ('CB-' + Math.floor(1000 + Math.random() * 9000)),
    client_name: apt.clientName,
    client_phone: apt.clientPhone,
    barber_id: apt.barberId || 'b1',
    barber_name: apt.barberName || 'Barbero',
    service_id: apt.serviceId || 's1',
    service_name: apt.serviceName || 'Corte',
    price: Number(apt.price) || 450,
    discount_applied: Number(apt.discountAmount || apt.discountApplied || 0),
    promo_type: apt.promotionName || apt.promoType || null,
    product_name: apt.productName || null,
    product_price: Number(apt.productPrice || 0),
    date: apt.date,
    time: apt.time,
    status: apt.status || 'confirmed',
    notes: apt.notes || ''
  };
}

function mapAppointmentFromSupabase(row) {
  return {
    id: row.id,
    shopId: row.shop_id,
    code: row.code,
    clientName: row.client_name,
    clientPhone: row.client_phone,
    barberId: row.barber_id,
    barberName: row.barber_name,
    serviceId: row.service_id,
    serviceName: row.service_name,
    price: Number(row.price),
    discountApplied: Number(row.discount_applied) > 0,
    discountAmount: Number(row.discount_applied),
    promotionName: row.promo_type,
    productName: row.product_name,
    productPrice: Number(row.product_price),
    date: row.date,
    time: row.time,
    status: row.status || 'confirmed',
    createdAt: row.created_at
  };
}

// Sincronización en tiempo real desde Supabase hacia la memoria local
async function syncFromSupabase() {
  try {
    // 1. Cargar Barberías desde Supabase
    const dbShops = await supabaseFetch('shops?select=*');
    if (Array.isArray(dbShops) && dbShops.length > 0) {
      const parsedShops = dbShops.map(mapShopFromSupabase);
      localStorage.setItem(STORAGE_KEYS.SHOPS, JSON.stringify(parsedShops));
    } else {
      // Si la base de datos está vacía, sincronizar la barbería inicial hacia Supabase
      const localShops = JSON.parse(localStorage.getItem(STORAGE_KEYS.SHOPS) || '[]');
      const toSync = localShops.length > 0 ? localShops : DEFAULT_SHOPS;
      for (const s of toSync) {
        await supabaseFetch('shops', 'POST', mapShopToSupabase(s), { 'Prefer': 'resolution=merge-duplicates' });
      }
    }

    // 2. Cargar Turnos desde Supabase
    const dbAppointments = await supabaseFetch('appointments?select=*&order=created_at.desc');
    if (Array.isArray(dbAppointments)) {
      const parsedApts = dbAppointments.map(mapAppointmentFromSupabase);
      localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(parsedApts));
    }
  } catch (err) {
    console.warn('Sincronización en segundo plano de Supabase:', err);
  }
}

function initDB() {
  // 1. Carga inicial local
  if (!localStorage.getItem(STORAGE_KEYS.SHOPS)) {
    localStorage.setItem(STORAGE_KEYS.SHOPS, JSON.stringify(DEFAULT_SHOPS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.APPOINTMENTS)) {
    localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(DEFAULT_APPOINTMENTS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.ACTIVE_SHOP_ID)) {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_SHOP_ID, 'casa-brava');
  }

  // 2. Disparar sincronización con Supabase de inmediato
  syncFromSupabase();

  // 3. Comprobar parámetro ?setup= o ?import= si viene por URL
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const setupParam = urlParams.get('setup');
    if (setupParam) {
      const importedShop = decodeShopData(setupParam);
      if (importedShop && importedShop.id) {
        const currentShops = JSON.parse(localStorage.getItem(STORAGE_KEYS.SHOPS) || '[]');
        const existingIdx = currentShops.findIndex(s => s.id === importedShop.id);
        if (existingIdx >= 0) {
          currentShops[existingIdx] = Object.assign({}, currentShops[existingIdx], importedShop);
        } else {
          currentShops.push(importedShop);
        }
        localStorage.setItem(STORAGE_KEYS.SHOPS, JSON.stringify(currentShops));
        localStorage.setItem(STORAGE_KEYS.ACTIVE_SHOP_ID, importedShop.id);
      }
    }
  } catch (err) {
    console.warn('Aviso sincronización enlace:', err);
  }
}

function getShops() {
  initDB();
  const shops = JSON.parse(localStorage.getItem(STORAGE_KEYS.SHOPS) || '[]');
  const list = shops.length > 0 ? shops : DEFAULT_SHOPS;

  // Compatibilidad hacia atrás: asegurar promociones, email, password, status y trial
  list.forEach(shop => {
    if (!shop.slug) shop.slug = shop.id;
    if (!shop.email) shop.email = `contacto@${shop.slug || 'barberia'}.com`;
    if (!shop.password) shop.password = 'barber123';
    if (!shop.status) shop.status = 'active';
    if (!shop.trialDays) shop.trialDays = 14;
    if (!shop.trialEndsAt) {
      shop.trialEndsAt = new Date(Date.now() + (shop.trialDays || 14) * 24 * 60 * 60 * 1000).toISOString();
    }
    if (!shop.notificationPreference) shop.notificationPreference = 'both';
    if (!shop.phone) shop.phone = '59899123456';
    if (shop.hasStore === undefined) shop.hasStore = true;
    if (!shop.plan) shop.plan = 'pro';
    
    // Promociones y Marketing
    if (!shop.promotions) {
      shop.promotions = {
        pointsSystem: { enabled: true, cutsRequired: 5, discountPercent: 50 },
        birthday: { enabled: true, discountPercent: 20 },
        happyHour: { enabled: true, discountPercent: 15, days: ['Martes', 'Miércoles'], startHour: '09:00', endHour: '13:00' },
        upselling: { enabled: true }
      };
    }

    if (!shop.products || shop.products.length === 0) {
      shop.products = [
        { id: 'p1', name: 'Pomada Matte Gold (Fijación Fuerte)', price: 350, desc: 'Efecto seco sin brillo, ideal para degradés modernos y peinados texturados.', photo: 'https://images.unsplash.com/photo-1597854710119-a6a4220b33b9?w=160&q=80', active: true },
        { id: 'p2', name: 'Aceite Esencial para Barba y Bigote', price: 320, desc: 'Hidratación profunda con aroma a cedro y madera noble. Suaviza el vello.', photo: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=160&q=80', active: true },
        { id: 'p3', name: 'Cera en Polvo Volumen & Textura', price: 400, desc: 'Aporta volumen instantáneo en la raíz con sensación ligera y mate.', photo: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=160&q=80', active: true }
      ];
    }

    if (shop.barbers) {
      shop.barbers.forEach((b, idx) => {
        if (!b.daysOff) b.daysOff = b.id === 'b2' ? [1] : [0];
        if (!b.phone) b.phone = idx === 0 ? '59899111222' : '59899333444';
      });
    }

    if (shop.services) {
      shop.services.forEach(s => {
        if (s.isPromo === undefined) s.isPromo = s.id === 's3';
      });
    }
  });

  return list;
}

function saveShops(shops) {
  localStorage.setItem(STORAGE_KEYS.SHOPS, JSON.stringify(shops));
  // Sincronización transparente con Supabase
  try {
    for (const s of shops) {
      supabaseFetch('shops', 'POST', mapShopToSupabase(s), { 'Prefer': 'resolution=merge-duplicates' });
    }
  } catch (e) {
    console.warn('Error sincronizando barberías a Supabase:', e);
  }
}

function getActiveShop() {
  initDB();
  const shops = getShops();
  const urlParams = new URLSearchParams(window.location.search);
  
  // Soporte paramétrico múltiple: ?b=slug-barberia o ?shop=slug-barberia
  const shopParam = urlParams.get('b') || urlParams.get('shop');

  if (shopParam) {
    const cleanQuery = shopParam.toLowerCase().trim();
    const found = shops.find(s => 
      (s.id && s.id.toLowerCase() === cleanQuery) ||
      (s.slug && s.slug.toLowerCase() === cleanQuery) ||
      (s.name && s.name.toLowerCase().replace(/\s+/g, '-') === cleanQuery)
    );

    if (found) {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_SHOP_ID, found.id);
      return found;
    }
  }

  const activeId = localStorage.getItem(STORAGE_KEYS.ACTIVE_SHOP_ID) || 'casa-brava';
  return shops.find(s => s.id === activeId) || shops[0] || DEFAULT_SHOPS[0];
}

function setActiveShop(id) {
  localStorage.setItem(STORAGE_KEYS.ACTIVE_SHOP_ID, id);
}

// =========================================================================
// SISTEMA DE AUTENTICACIÓN Y SEGURIDAD (SESSION & LOGIN)
// =========================================================================

function authenticateUser(email, password) {
  const cleanEmail = (email || '').toLowerCase().trim();
  const cleanPass = (password || '').trim();

  // 1. Verificar SuperAdmin
  if (cleanEmail === SUPERADMIN_ACCOUNT.email && cleanPass === SUPERADMIN_ACCOUNT.password) {
    const session = {
      role: 'superadmin',
      email: cleanEmail,
      name: SUPERADMIN_ACCOUNT.name,
      token: 'sa_' + Date.now(),
      loginAt: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEYS.AUTH_SESSION, JSON.stringify(session));
    return { success: true, role: 'superadmin', session };
  }

  // 2. Verificar Barberías Clientes
  const shops = getShops();
  const shop = shops.find(s => (s.email || '').toLowerCase().trim() === cleanEmail);

  if (!shop) {
    return { success: false, message: 'No existe ninguna cuenta registrada con este correo.' };
  }

  if (shop.password !== cleanPass) {
    return { success: false, message: 'La contraseña ingresada es incorrecta.' };
  }

  const session = {
    role: 'barber',
    shopId: shop.id,
    shopSlug: shop.slug || shop.id,
    shopName: shop.name,
    email: cleanEmail,
    token: 'bk_' + Date.now(),
    loginAt: new Date().toISOString()
  };

  localStorage.setItem(STORAGE_KEYS.AUTH_SESSION, JSON.stringify(session));
  return { success: true, role: 'barber', shop, session };
}

function getCurrentSession() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.AUTH_SESSION);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

function logoutSession() {
  localStorage.removeItem(STORAGE_KEYS.AUTH_SESSION);
}

// Control de Acceso y Bloqueo de Cuentas (Demos y Suscripciones)
function checkShopAccessStatus(shop) {
  if (!shop) return { allowed: false, message: 'Barbería no encontrada.' };

  if (shop.status === 'suspended') {
    return {
      allowed: false,
      reason: 'suspended',
      message: 'Esta barbería se encuentra suspendida temporalmente por administración.'
    };
  }

  if (shop.status === 'trial') {
    const now = new Date();
    const trialEnd = new Date(shop.trialEndsAt || 0);

    if (now > trialEnd) {
      return {
        allowed: false,
        reason: 'expired',
        message: `Tu período de prueba gratuita de ${shop.trialDays || 7} días ha finalizado el ${trialEnd.toLocaleDateString('es-UY')}.`
      };
    }
  }

  return { allowed: true, status: shop.status };
}

function requireAuth(allowedRole = 'any') {
  const session = getCurrentSession();

  if (!session) {
    window.location.href = 'login.html?msg=unauthorized';
    return null;
  }

  if (allowedRole === 'superadmin' && session.role !== 'superadmin') {
    window.location.href = 'login.html?msg=unauthorized';
    return null;
  }

  if (allowedRole === 'barber' && session.role !== 'barber') {
    window.location.href = 'login.html?msg=unauthorized';
    return null;
  }

  // Si es barbero, verificar que su tienda esté activa
  if (session.role === 'barber') {
    const shops = getShops();
    const shop = shops.find(s => s.id === session.shopId);
    const check = checkShopAccessStatus(shop);
    if (!check.allowed) {
      logoutSession();
      window.location.href = 'login.html?msg=expired';
      return null;
    }
  }

  return session;
}

// =========================================================================
// GESTIÓN DE TURNOS / APPOINTMENTS (ALTA, BAJA, CONFIRMACIÓN, CANCELACIÓN)
// =========================================================================

function getAppointments(shopId = null) {
  initDB();
  const apts = JSON.parse(localStorage.getItem(STORAGE_KEYS.APPOINTMENTS) || '[]');
  if (shopId) {
    return apts.filter(a => a.shopId === shopId);
  }
  return apts;
}

function saveAppointment(apt) {
  const apts = getAppointments();
  apt.id = apt.id || ('apt-' + Date.now());
  apt.code = apt.code || ('CB-' + Math.floor(1000 + Math.random() * 9000));
  apt.status = apt.status || 'confirmed';
  apt.createdAt = apt.createdAt || new Date().toISOString();
  
  apts.unshift(apt);
  localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(apts));

  // Sincronización instantánea hacia Supabase
  try {
    supabaseFetch('appointments', 'POST', mapAppointmentToSupabase(apt), { 'Prefer': 'resolution=merge-duplicates' });
  } catch (err) {
    console.warn('Error enviando turno a Supabase:', err);
  }

  return apt;
}

function updateAppointmentStatus(appointmentId, newStatus) {
  const apts = getAppointments();
  const apt = apts.find(a => a.id === appointmentId);
  if (apt) {
    apt.status = newStatus; // 'confirmed', 'completed', 'cancelled'
    localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(apts));

    // Sincronización de cambio de estado en Supabase
    try {
      supabaseFetch(`appointments?id=eq.${encodeURIComponent(appointmentId)}`, 'PATCH', { status: newStatus });
    } catch (err) {
      console.warn('Error actualizando estado en Supabase:', err);
    }

    return true;
  }
  return false;
}

function deleteAppointment(appointmentId) {
  let apts = getAppointments();
  const initialLen = apts.length;
  apts = apts.filter(a => a.id !== appointmentId);
  if (apts.length !== initialLen) {
    localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(apts));

    // Eliminación en Supabase
    try {
      supabaseFetch(`appointments?id=eq.${encodeURIComponent(appointmentId)}`, 'DELETE');
    } catch (err) {
      console.warn('Error eliminando turno en Supabase:', err);
    }

    return true;
  }
  return false;
}

// =========================================================================
// MÓDULO DE PROMOCIONES Y MARKETING (PUNTOS, CUMPLEAÑOS, HAPPY HOUR, UPSELLING)
// =========================================================================

function updateShopPromotions(shopId, promotionsData) {
  const shops = getShops();
  const shop = shops.find(s => s.id === shopId);
  if (shop) {
    shop.promotions = Object.assign({}, shop.promotions || {}, promotionsData);
    saveShops(shops);
    return true;
  }
  return false;
}

// Calcula promociones aplicables para una reserva en client.html
function calculateBookingPromotions(shop, clientPhone, bookingDateStr, bookingTimeStr, basePrice) {
  let discount = 0;
  let promoApplied = null;
  const promoConfig = shop.promotions || {};

  // 1. Happy Hour / Horarios Valle
  if (promoConfig.happyHour && promoConfig.happyHour.enabled) {
    const hh = promoConfig.happyHour;
    const dateObj = new Date(bookingDateStr + 'T12:00:00');
    const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const dayName = dayNames[dateObj.getDay()];

    if (hh.days && hh.days.includes(dayName)) {
      if (bookingTimeStr >= (hh.startHour || '09:00') && bookingTimeStr <= (hh.endHour || '13:00')) {
        const pct = Number(hh.discountPercent || 15);
        discount = Math.round(basePrice * (pct / 100));
        promoApplied = {
          type: 'happyHour',
          name: `⚡ Tarifa Valle / Happy Hour (${pct}% OFF)`,
          discount
        };
      }
    }
  }

  // 2. Sistema de Fidelización por Puntos (Cortes Acumulados)
  if (!promoApplied && promoConfig.pointsSystem && promoConfig.pointsSystem.enabled) {
    const ps = promoConfig.pointsSystem;
    const cleanPhone = (clientPhone || '').replace(/\D/g, '');
    if (cleanPhone.length >= 8) {
      const clientHistory = getAppointments(shop.id).filter(a => 
        (a.clientPhone || '').replace(/\D/g, '') === cleanPhone && a.status === 'completed'
      );
      const req = Number(ps.cutsRequired || 5);
      if (clientHistory.length > 0 && (clientHistory.length % req === 0)) {
        const pct = Number(ps.discountPercent || 50);
        discount = Math.round(basePrice * (pct / 100));
        promoApplied = {
          type: 'points',
          name: `🎖️ Premio Fidelidad por ${req}º corte (${pct}% OFF)`,
          discount
        };
      }
    }
  }

  return {
    discount,
    finalPrice: Math.max(0, basePrice - discount),
    promoApplied
  };
}

// =========================================================================
// GESTIÓN COMERCIAL SUPERADMIN (DEMOS, FECHAS, ACCESOS)
// =========================================================================

function createNewBarberShopAccount(shopData) {
  const shops = getShops();
  const slug = (shopData.slug || shopData.name.toLowerCase())
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || ('shop-' + Date.now());

  const trialDays = Number(shopData.trialDays || 7);
  const trialEndsAt = new Date(Date.now() + trialDays * 24 * 60 * 60 * 1000).toISOString();

  const newShop = {
    id: slug,
    slug: slug,
    name: shopData.name,
    email: shopData.email || `contacto@${slug}.com`,
    password: shopData.password || 'barber123',
    subtitle: 'BARBERÍA & ESTILO',
    heroTitle: 'Tu estilo habla por ti.',
    heroHighlight: 'Defínelo con expertos.',
    tagline: 'Tradición en navaja y los mejores degradés modernos de Salto.',
    address: shopData.address || 'Salto, Uruguay',
    phone: shopData.phone || '59899123456',
    status: shopData.status || 'trial', // 'trial', 'active', 'suspended'
    trialDays: trialDays,
    trialEndsAt: trialEndsAt,
    monthlyFee: Number(shopData.monthlyFee || 1900),
    plan: shopData.plan || 'pro',
    hasStore: shopData.hasStore !== undefined ? Boolean(shopData.hasStore) : true,
    logoEmoji: shopData.logoEmoji || '💈',
    brandColor: '#00ff88',
    promotions: {
      pointsSystem: { enabled: true, cutsRequired: 5, discountPercent: 50 },
      birthday: { enabled: true, discountPercent: 20 },
      happyHour: { enabled: true, discountPercent: 15, days: ['Martes', 'Miércoles'], startHour: '09:00', endHour: '13:00' },
      upselling: { enabled: true }
    },
    workingHours: {
      start: '09:00',
      end: '20:00',
      intervalMinutes: 45,
      daysOpen: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
    },
    barbers: [
      { id: 'b-' + Date.now(), name: 'Barbero Titular', photo: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=200&q=80', role: 'Barbero Titular • Fade', commissionRate: 0.50, daysOff: [0], phone: shopData.phone }
    ],
    services: [
      { id: 's-1', name: 'Corte Clásico & Fade', price: 450, duration: '30 min', desc: 'Corte profesional con degradé y peinado', photo: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=160&q=80', isPromo: false },
      { id: 's-2', name: 'Ritual Barba Tradicional', price: 350, duration: '30 min', desc: 'Perfilado a navaja y toalla caliente', photo: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=160&q=80', isPromo: false },
      { id: 's-3', name: 'Combo Completo (Pelo + Barba)', price: 700, duration: '60 min', desc: 'Experiencia completa corte y barba', photo: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=160&q=80', isPromo: true }
    ],
    products: [
      { id: 'p-1', name: 'Pomada Matte Gold (Fijación Fuerte)', price: 350, desc: 'Fijación fuerte y acabado natural mate', photo: 'https://images.unsplash.com/photo-1597854710119-a6a4220b33b9?w=160&q=80', active: true },
      { id: 'p-2', name: 'Aceite Esencial para Barba', price: 320, desc: 'Hidratación con aroma a cedro noble', photo: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=160&q=80', active: true }
    ]
  };

  const existingIdx = shops.findIndex(s => s.id === slug);
  if (existingIdx >= 0) {
    shops[existingIdx] = newShop;
  } else {
    shops.push(newShop);
  }

  saveShops(shops);
  return newShop;
}

function updateShopAccountStatus(shopId, newStatus, extraTrialDays = 0) {
  const shops = getShops();
  const shop = shops.find(s => s.id === shopId);
  if (shop) {
    shop.status = newStatus;
    if (newStatus === 'trial' && extraTrialDays > 0) {
      shop.trialDays = extraTrialDays;
      shop.trialEndsAt = new Date(Date.now() + extraTrialDays * 24 * 60 * 60 * 1000).toISOString();
    }
    saveShops(shops);
    return true;
  }
  return false;
}

// =========================================================================
// URLS PARAMÉTRICAS Y CÓDIGOS QR MULTI-TENANCY
// =========================================================================

function getShopBookingUrl(shopId) {
  const origin = window.location.origin;
  const path = window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/') + 1);
  return `${origin}${path}client.html?b=${encodeURIComponent(shopId || 'casa-brava')}`;
}

function getShopAdminUrl(shopId) {
  const origin = window.location.origin;
  const path = window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/') + 1);
  return `${origin}${path}admin.html?shop=${encodeURIComponent(shopId || 'casa-brava')}`;
}

function getShopQrCodeUrl(shopId, size = 300) {
  const bookingUrl = getShopBookingUrl(shopId);
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(bookingUrl)}&format=png&margin=10`;
}

// =========================================================================
// GESTIÓN DE TIENDA Y PRODUCTOS
// =========================================================================

function addNewProduct(shopId, productData) {
  const shops = getShops();
  const shop = shops.find(s => s.id === shopId);
  if (shop) {
    if (!shop.products) shop.products = [];
    productData.id = 'p-' + Date.now();
    productData.active = productData.active !== undefined ? productData.active : true;
    shop.products.push(productData);
    saveShops(shops);
    return productData;
  }
  return null;
}

function updateProductPrice(shopId, productId, newPrice) {
  const shops = getShops();
  const shop = shops.find(s => s.id === shopId);
  if (shop && shop.products) {
    const prod = shop.products.find(p => p.id === productId);
    if (prod) {
      prod.price = Number(newPrice);
      saveShops(shops);
      return true;
    }
  }
  return false;
}

function deleteProduct(shopId, productId) {
  const shops = getShops();
  const shop = shops.find(s => s.id === shopId);
  if (shop && shop.products) {
    shop.products = shop.products.filter(p => p.id !== productId);
    saveShops(shops);
    return true;
  }
  return false;
}

function toggleProductActive(shopId, productId) {
  const shops = getShops();
  const shop = shops.find(s => s.id === shopId);
  if (shop && shop.products) {
    const prod = shop.products.find(p => p.id === productId);
    if (prod) {
      prod.active = !prod.active;
      saveShops(shops);
      return prod.active;
    }
  }
  return false;
}

function updateShopSaaSPlan(shopId, planName, monthlyFee, hasStore) {
  const shops = getShops();
  const shop = shops.find(s => s.id === shopId);
  if (shop) {
    shop.plan = planName;
    if (monthlyFee !== undefined) shop.monthlyFee = Number(monthlyFee);
    if (hasStore !== undefined) shop.hasStore = Boolean(hasStore);
    saveShops(shops);
    return true;
  }
  return false;
}

function updateNotificationSettings(shopId, preference, ownerPhone) {
  const shops = getShops();
  const shop = shops.find(s => s.id === shopId);
  if (shop) {
    if (preference) shop.notificationPreference = preference;
    if (ownerPhone) shop.phone = ownerPhone;
    saveShops(shops);
    return true;
  }
  return false;
}

function updateBarberPhone(shopId, barberId, phone) {
  const shops = getShops();
  const shop = shops.find(s => s.id === shopId);
  if (shop && shop.barbers) {
    const barber = shop.barbers.find(b => b.id === barberId);
    if (barber) {
      barber.phone = phone.replace(/[^0-9]/g, '');
      saveShops(shops);
      return true;
    }
  }
  return false;
}

function toggleServicePromo(shopId, serviceId) {
  const shops = getShops();
  const shop = shops.find(s => s.id === shopId);
  if (shop && shop.services) {
    const srv = shop.services.find(s => s.id === serviceId);
    if (srv) {
      srv.isPromo = !srv.isPromo;
      saveShops(shops);
      return srv.isPromo;
    }
  }
  return false;
}

function updateBarberDaysOff(shopId, barberId, daysOffArray) {
  const shops = getShops();
  const shop = shops.find(s => s.id === shopId);
  if (shop && shop.barbers) {
    const barber = shop.barbers.find(b => b.id === barberId);
    if (barber) {
      barber.daysOff = daysOffArray.map(Number);
      saveShops(shops);
      return true;
    }
  }
  return false;
}

function applyShopFluorTheme(shop) {
  const colorHex = shop.brandColor || '#00ff88';
  const theme = FLUOR_THEMES.find(t => t.color.toLowerCase() === colorHex.toLowerCase()) || {
    color: colorHex,
    glow: colorHex + '73',
    light: colorHex + '26',
    border: colorHex + '66'
  };

  document.documentElement.style.setProperty('--primary', theme.color);
  document.documentElement.style.setProperty('--primary-hover', theme.color);
  document.documentElement.style.setProperty('--primary-glow', theme.glow);
  document.documentElement.style.setProperty('--primary-light', theme.light);
  document.documentElement.style.setProperty('--border-gold', theme.border);
}

function updateBarberCommission(shopId, barberId, percentageNumber) {
  const shops = getShops();
  const shop = shops.find(s => s.id === shopId);
  if (shop && shop.barbers) {
    const barber = shop.barbers.find(b => b.id === barberId);
    if (barber) {
      barber.commissionRate = Number(percentageNumber) / 100;
      saveShops(shops);
      return true;
    }
  }
  return false;
}

function updateShopFluorColor(shopId, colorHex) {
  const shops = getShops();
  const shop = shops.find(s => s.id === shopId);
  if (shop) {
    shop.brandColor = colorHex;
    saveShops(shops);
    applyShopFluorTheme(shop);
  }
}

function updateShopCustomization(shopId, data) {
  const shops = getShops();
  const shop = shops.find(s => s.id === shopId);
  if (shop) {
    if (data.name !== undefined) shop.name = data.name;
    if (data.subtitle !== undefined) shop.subtitle = data.subtitle;
    if (data.heroTitle !== undefined) shop.heroTitle = data.heroTitle;
    if (data.heroHighlight !== undefined) shop.heroHighlight = data.heroHighlight;
    if (data.tagline !== undefined) shop.tagline = data.tagline;
    if (data.address !== undefined) shop.address = data.address;
    if (data.phone !== undefined) shop.phone = data.phone;
    if (data.bgImage !== undefined) shop.bgImage = data.bgImage;
    if (data.brandColor !== undefined) shop.brandColor = data.brandColor;
    saveShops(shops);
    applyShopFluorTheme(shop);
  }
}

function updateServicePrice(shopId, serviceId, newPrice) {
  const shops = getShops();
  const shop = shops.find(s => s.id === shopId);
  if (shop && shop.services) {
    const srv = shop.services.find(s => s.id === serviceId);
    if (srv) {
      srv.price = Number(newPrice);
      saveShops(shops);
      return true;
    }
  }
  return false;
}

function addNewService(shopId, serviceData) {
  const shops = getShops();
  const shop = shops.find(s => s.id === shopId);
  if (shop) {
    if (!shop.services) shop.services = [];
    serviceData.id = 's-' + Date.now();
    serviceData.isPromo = !!serviceData.isPromo;
    shop.services.push(serviceData);
    saveShops(shops);
    return serviceData;
  }
  return null;
}

function deleteService(shopId, serviceId) {
  const shops = getShops();
  const shop = shops.find(s => s.id === shopId);
  if (shop && shop.services) {
    shop.services = shop.services.filter(s => s.id !== serviceId);
    saveShops(shops);
    return true;
  }
  return false;
}

function createWhatsAppBookingUrl(appointment, shop, targetPhone = null) {
  const raw = targetPhone || shop.phone || '59899123456';
  const clean = raw.replace(/[^0-9]/g, '');
  const phone = clean.startsWith('0') ? '598' + clean.slice(1) : (clean.startsWith('598') ? clean : '598' + clean);
  
  let productLine = '';
  if (appointment.productName) {
    productLine = `🛍️ *Producto adicional:* ${appointment.productName} ($ ${appointment.productPrice} UYU)\n`;
  }

  let promoLine = '';
  if (appointment.promoName && appointment.discountApplied > 0) {
    promoLine = `🎉 *Beneficio aplicado:* ${appointment.promoName} (-$ ${appointment.discountApplied} UYU)\n`;
  }

  const text = `¡Hola *${shop.name}*! 💈\n` +
               `Quiero confirmar mi reserva de turno:\n\n` +
               `👤 *Cliente:* ${appointment.clientName}\n` +
               `📱 *Celular:* ${appointment.clientPhone}\n` +
               `✂️ *Servicio:* ${appointment.serviceName}\n` +
               productLine +
               promoLine +
               `💈 *Barbero:* ${appointment.barberName}\n` +
               `📅 *Fecha:* ${appointment.date}\n` +
               `⏰ *Hora:* ${appointment.time} hs\n` +
               `💰 *Total a abonar:* $ ${appointment.price} UYU\n\n` +
               `¡Muchas gracias!`;
               
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}

function formatMoneyUY(amount) {
  return `$ ${Number(amount).toLocaleString('es-UY')} UYU`;
}

initDB();
