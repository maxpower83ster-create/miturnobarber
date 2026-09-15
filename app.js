// =========================================================================
// BarberFlow Salto - Lógica con Colores Flúor Dinámicos y Editor de Precios
// =========================================================================

const STORAGE_KEYS = {
  SHOPS: 'barber_saas_shops_v8',
  APPOINTMENTS: 'barber_saas_appointments_v8',
  ACTIVE_SHOP_ID: 'barber_saas_active_shop_id_v8'
};

// Paleta de Colores Flúor Neón Disponibles
const FLUOR_THEMES = [
  { id: 'green', name: 'Verde Cyberpunk', color: '#00ff88', glow: 'rgba(0, 255, 136, 0.45)', light: 'rgba(0, 255, 136, 0.15)', border: 'rgba(0, 255, 136, 0.4)' },
  { id: 'gold', name: 'Dorado / Oro Neón', color: '#ffd700', glow: 'rgba(255, 215, 0, 0.45)', light: 'rgba(255, 215, 0, 0.15)', border: 'rgba(255, 215, 0, 0.4)' },
  { id: 'cyan', name: 'Cyan / Azul Neón', color: '#00e5ff', glow: 'rgba(0, 229, 255, 0.45)', light: 'rgba(0, 229, 255, 0.15)', border: 'rgba(0, 229, 255, 0.4)' },
  { id: 'magenta', name: 'Magenta / Fucsia', color: '#ff007f', glow: 'rgba(255, 0, 127, 0.45)', light: 'rgba(255, 0, 127, 0.15)', border: 'rgba(255, 0, 127, 0.4)' },
  { id: 'orange', name: 'Naranja Flúor', color: '#ff6b00', glow: 'rgba(255, 107, 0, 0.45)', light: 'rgba(255, 107, 0, 0.15)', border: 'rgba(255, 107, 0, 0.4)' },
  { id: 'purple', name: 'Púrpura Ultravioleta', color: '#a855f7', glow: 'rgba(168, 85, 247, 0.45)', light: 'rgba(168, 85, 247, 0.15)', border: 'rgba(168, 85, 247, 0.4)' }
];

const DEFAULT_SHOPS = [
  {
    id: 'casa-brava',
    name: 'Casa Brava',
    subtitle: 'BARBERÍA & CLUB MASCULINO',
    heroTitle: 'Tu estilo habla por ti.',
    heroHighlight: 'Defínelo con expertos.',
    tagline: 'Tradición en navaja, toalla caliente y los mejores degradés modernos de Salto.',
    address: 'Calle Uruguay 850, Salto',
    phone: '59899123456',
    notificationPreference: 'both', // 'owner', 'barber', 'both'
    status: 'active',
    monthlyFee: 1800,
    brandColor: '#00ff88', // Verde Flúor por defecto
    bgImage: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&q=80',
    workingHours: {
      start: '09:00',
      end: '20:00',
      intervalMinutes: 45,
      daysOpen: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
    },
    barbers: [
      { 
        id: 'b1', 
        name: 'Vicente Cruz', 
        role: 'Barbero Maestro • Fade', 
        photo: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=200&q=80',
        rating: '4.9 (128)',
        commissionRate: 0.55,
        daysOff: [0], // Domingo libre (0: Dom, 1: Lun, etc.)
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
    plan: 'pro', // 'standard', 'pro', 'vip', 'lifetime'
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
    date: new Date().toISOString().split('T')[0],
    time: '16:00',
    status: 'confirmed',
    createdAt: new Date().toISOString()
  }
];

function encodeShopData(shop) {
  try {
    return encodeURIComponent(btoa(unescape(encodeURIComponent(JSON.stringify(shop)))));
  } catch (e) {
    return '';
  }
}

function decodeShopData(str) {
  try {
    return JSON.parse(decodeURIComponent(escape(atob(decodeURIComponent(str)))));
  } catch (e) {
    return null;
  }
}

function initDB() {
  // Sincronización automática si el enlace trae datos de la barbería (?setup=)
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

  if (!localStorage.getItem(STORAGE_KEYS.SHOPS)) {
    localStorage.setItem(STORAGE_KEYS.SHOPS, JSON.stringify(DEFAULT_SHOPS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.APPOINTMENTS)) {
    localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(DEFAULT_APPOINTMENTS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.ACTIVE_SHOP_ID)) {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_SHOP_ID, 'casa-brava');
  }
}

function getShops() {
  initDB();
  const shops = JSON.parse(localStorage.getItem(STORAGE_KEYS.SHOPS) || '[]');
  const list = shops.length > 0 ? shops : DEFAULT_SHOPS;
  
  // Compatibilidad hacia atrás: asegurar daysOff, isPromo, notificationPreference, barber.phone, hasStore y products
  list.forEach(shop => {
    if (!shop.notificationPreference) shop.notificationPreference = 'both';
    if (!shop.phone) shop.phone = '59899123456';
    if (shop.hasStore === undefined) shop.hasStore = true;
    if (!shop.plan) shop.plan = 'pro';
    if (!shop.products || shop.products.length === 0) {
      shop.products = [
        { id: 'p1', name: 'Pomada Matte Gold (Fijación Fuerte)', price: 350, desc: 'Efecto seco sin brillo, ideal para degradés modernos y peinados texturados.', photo: 'https://images.unsplash.com/photo-1597854710119-a6a4220b33b9?w=160&q=80', active: true },
        { id: 'p2', name: 'Aceite Esencial para Barba y Bigote', price: 320, desc: 'Hidratación profunda con aroma a cedro y madera noble. Suaviza el vello.', photo: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=160&q=80', active: true },
        { id: 'p3', name: 'Cera en Polvo Volumen & Textura', price: 400, desc: 'Aporta volumen instantáneo en la raíz con sensación ligera y mate.', photo: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=160&q=80', active: true }
      ];
    }
    if (shop.barbers) {
      shop.barbers.forEach((b, idx) => {
        if (!b.daysOff) b.daysOff = b.id === 'b2' ? [1] : [0]; // default: domingo o lunes
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

// ==========================================
// GESTIÓN DE TIENDA Y PRODUCTOS DE BARBERÍA
// ==========================================

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

// Actualizar módulos del SaaS (Super Admin)
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

// Configurar preferencias de notificación (dueño, barbero, ambos)
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

// Actualizar teléfono de WhatsApp particular de un barbero
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
function getActiveShop() {
  const shops = getShops();
  const urlParams = new URLSearchParams(window.location.search);
  const shopParam = urlParams.get('shop');

  if (shopParam) {
    const found = shops.find(s => s.id === shopParam || s.name.toLowerCase().replace(/\s+/g, '-') === shopParam.toLowerCase());
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

function saveShops(shops) {
  localStorage.setItem(STORAGE_KEYS.SHOPS, JSON.stringify(shops));
}

// Obtener URL de reservas para el cliente (limpia y perfecta para QR)
function getShopBookingUrl(shopId) {
  const origin = window.location.origin;
  const path = window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/') + 1);
  return `${origin}${path}client.html?shop=${encodeURIComponent(shopId || 'casa-brava')}`;
}

// Obtener URL del panel de administración del dueño
function getShopAdminUrl(shopId) {
  const origin = window.location.origin;
  const path = window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/') + 1);
  return `${origin}${path}admin.html?shop=${encodeURIComponent(shopId || 'casa-brava')}`;
}

// Generador de QR oficial en tiempo real (alta calidad y nítido)
function getShopQrCodeUrl(shopId, size = 300) {
  const bookingUrl = getShopBookingUrl(shopId);
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(bookingUrl)}&format=png&margin=10`;
}

// Alternar estado de Promoción / Destacado en un corte
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

// Actualizar días de descanso de un barbero (ej: [0] para Domingo, [1] para Lunes)
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

// Aplicar Color Flúor Dinámico a la página en tiempo real
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

// Actualizar comisión de un barbero / estilista (0% a 100%)
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

// Actualizar color flúor de la barbería
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

// ==========================================
// GESTIÓN DE CORTES Y PRECIOS DEL DUEÑO
// ==========================================

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
  apt.id = 'apt-' + Date.now();
  apt.code = 'CB-' + Math.floor(1000 + Math.random() * 9000);
  apt.createdAt = new Date().toISOString();
  apts.unshift(apt);
  localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(apts));
  return apt;
}

function createWhatsAppBookingUrl(appointment, shop, targetPhone = null) {
  const raw = targetPhone || shop.phone || '59899123456';
  const clean = raw.replace(/[^0-9]/g, '');
  const phone = clean.startsWith('0') ? '598' + clean.slice(1) : (clean.startsWith('598') ? clean : '598' + clean);
  
  let productLine = '';
  if (appointment.productName) {
    productLine = `🛍️ *Producto adicional:* ${appointment.productName} ($ ${appointment.productPrice} UYU)\n`;
  }

  const text = `¡Hola *${shop.name}*! 💈\n` +
               `Quiero confirmar mi reserva de turno:\n\n` +
               `👤 *Cliente:* ${appointment.clientName}\n` +
               `📱 *Celular:* ${appointment.clientPhone}\n` +
               `✂️ *Servicio:* ${appointment.serviceName}\n` +
               productLine +
               `💈 *Barbero:* ${appointment.barberName}\n` +
               `📅 *Fecha:* ${appointment.date}\n` +
               `⏰ *Hora:* ${appointment.time} hs\n` +
               `💰 *Total:* $ ${appointment.price} UYU\n\n` +
               `¡Muchas gracias!`;
               
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}

function formatMoneyUY(amount) {
  return `$ ${Number(amount).toLocaleString('es-UY')} UYU`;
}

initDB();
