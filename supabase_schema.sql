-- =======================================================================
-- ESQUEMA DE BASE DE DATOS: MITURNOBARBER.COM (Supabase / PostgreSQL)
-- =======================================================================

-- 1. TABLA DE BARBERÍAS (SHOPS)
CREATE TABLE IF NOT EXISTS public.shops (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT DEFAULT 'barber',
    status TEXT DEFAULT 'trial', -- 'active', 'suspended', 'trial'
    trial_days INT DEFAULT 7,
    trial_ends_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '7 days'),
    monthly_fee NUMERIC(10,2) DEFAULT 1900.00,
    plan TEXT DEFAULT 'pro',
    phone TEXT NOT NULL,
    address TEXT NOT NULL,
    brand_color TEXT DEFAULT '#00ff88',
    promotions JSONB DEFAULT '{
      "pointsSystem": {"enabled": true, "cutsRequired": 5, "discountPercent": 50},
      "birthday": {"enabled": true, "discountPercent": 20},
      "happyHour": {"enabled": true, "discountPercent": 15, "days": ["Martes", "Miércoles"], "startHour": "09:00", "endHour": "13:00"},
      "upselling": {"enabled": true}
    }'::jsonb,
    working_hours JSONB DEFAULT '{
      "start": "09:00",
      "end": "20:00",
      "intervalMinutes": 45,
      "daysOpen": ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"]
    }'::jsonb,
    barbers JSONB DEFAULT '[]'::jsonb,
    services JSONB DEFAULT '[]'::jsonb,
    products JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. TABLA DE TURNOS / RESERVAS (APPOINTMENTS)
CREATE TABLE IF NOT EXISTS public.appointments (
    id TEXT PRIMARY KEY,
    shop_id TEXT REFERENCES public.shops(id) ON DELETE CASCADE,
    code TEXT NOT NULL,
    client_name TEXT NOT NULL,
    client_phone TEXT NOT NULL,
    barber_id TEXT NOT NULL,
    barber_name TEXT NOT NULL,
    service_id TEXT NOT NULL,
    service_name TEXT NOT NULL,
    price NUMERIC(10,2) NOT NULL,
    discount_applied NUMERIC(10,2) DEFAULT 0,
    promo_type TEXT,
    product_name TEXT,
    product_price NUMERIC(10,2) DEFAULT 0,
    date DATE NOT NULL,
    time TEXT NOT NULL,
    status TEXT DEFAULT 'confirmed', -- 'confirmed', 'completed', 'cancelled'
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. TABLA DE USUARIO SUPERADMIN
CREATE TABLE IF NOT EXISTS public.superadmin_users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    name TEXT NOT NULL,
    role TEXT DEFAULT 'superadmin',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
