-- ========================================
-- CAR RENTAL DATABASE SCHEMA (UUID + PGCRYPTO)
-- ========================================

-- Enable UUID generation and password encryption
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Create ENUM types
CREATE TYPE car_status AS ENUM ('AVAILABLE', 'RENTED', 'MAINTENANCE');
CREATE TYPE booking_status AS ENUM ('PENDING', 'CONFIRMED', 'ACTIVE', 'COMPLETED', 'CANCELLED');
CREATE TYPE user_role AS ENUM ('USER', 'ADMIN');
CREATE TYPE payment_status AS ENUM ('PENDING', 'PAID', 'REFUNDED', 'FAILED');
CREATE TYPE service_type AS ENUM ('marriage', 'transfer');

-- ========================================
-- USERS TABLE
-- ========================================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    address TEXT,
    role user_role DEFAULT 'USER',
    preferred_language VARCHAR(10) DEFAULT 'en',
    service_type service_type DEFAULT 'marriage',
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- CARS TABLE (Multilingual)
-- ========================================
CREATE TABLE cars (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name JSONB NOT NULL,
    brand VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    year INTEGER NOT NULL,
    price_per_day DECIMAL(10, 2) NOT NULL,
    description JSONB NOT NULL,
    image_base64 TEXT,
    gallery JSONB,
    model_3d_url VARCHAR(500),
    status car_status DEFAULT 'AVAILABLE',
    service_type service_type DEFAULT 'marriage',
    features JSONB,
    specs JSONB,
    total_count INTEGER DEFAULT 1,
    available_count INTEGER DEFAULT 1,
    average_rating DECIMAL(3, 2) DEFAULT 0.00,
    total_ratings INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- BOOKINGS TABLE
-- ========================================
CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    car_id UUID NOT NULL REFERENCES cars(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    total_days INTEGER NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    status booking_status DEFAULT 'PENDING',
    payment_status payment_status DEFAULT 'PENDING',
    pickup_location TEXT,
    dropoff_location TEXT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CHECK (end_date > start_date)
);

-- ========================================
-- RATINGS TABLE
-- ========================================
CREATE TABLE ratings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    car_id UUID NOT NULL REFERENCES cars(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(booking_id)
);

-- ========================================
-- UNAVAILABLE DATES TABLE
-- ========================================
CREATE TABLE unavailable_dates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    car_id UUID NOT NULL REFERENCES cars(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    reason VARCHAR(255),
    UNIQUE(car_id, date)
);

-- ========================================
-- INDEXES FOR PERFORMANCE
-- ========================================
CREATE INDEX idx_cars_status ON cars(status);
CREATE INDEX idx_cars_brand ON cars(brand);
CREATE INDEX idx_cars_service_type ON cars(service_type);
CREATE INDEX idx_bookings_car_id ON bookings(car_id);
CREATE INDEX idx_bookings_user_id ON bookings(user_id);
CREATE INDEX idx_bookings_dates ON bookings(start_date, end_date);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_service_type ON users(service_type);
CREATE INDEX idx_ratings_car_id ON ratings(car_id);
CREATE INDEX idx_unavailable_dates_car ON unavailable_dates(car_id);
CREATE INDEX idx_unavailable_dates_date ON unavailable_dates(date);

-- ========================================
-- DEFAULT ADMIN ACCOUNT (ENCRYPTED WITH PGCRYPTO)
-- ========================================
-- Email: admin@carrental.com
-- Password: Admin@123
INSERT INTO users (email, password, full_name, role, preferred_language, is_verified)
VALUES (
    'admin@carrental.com',
    crypt('Admin@123', gen_salt('bf', 10)),
    'Administrateur',
    'ADMIN',
    'fr',
    TRUE
);

-- ========================================
-- TEST USER ACCOUNT (ENCRYPTED WITH PGCRYPTO)
-- ========================================
-- Email: user@test.com
-- Password: User@123
INSERT INTO users (email, password, full_name, phone, role, preferred_language, is_verified)
VALUES (
    'user@test.com',
    crypt('User@123', gen_salt('bf', 10)),
    'Test User',
    '+216 20 123 456',
    'USER',
    'en',
    TRUE
);

-- ========================================
-- SAMPLE CARS (Multilingual)
-- ========================================
INSERT INTO cars (name, brand, model, year, price_per_day, description, status, service_type, features, specs, total_count, available_count)
VALUES 
(
    '{"en": "Mercedes S-Class Luxury", "fr": "Mercedes Classe S Luxe", "ar": "مرسيدس الفئة S الفاخرة", "it": "Mercedes Classe S Lusso"}'::jsonb,
    'Mercedes-Benz',
    'S-Class',
    2024,
    250.00,
    '{"en": "Ultimate luxury sedan with premium features", "fr": "Berline de luxe ultime avec fonctionnalités premium", "ar": "سيارة سيدان فاخرة بمميزات متميزة", "it": "Berlina di lusso con caratteristiche premium"}'::jsonb,
    'AVAILABLE',
    'marriage',
    '{"en": ["GPS Navigation", "Leather Seats", "Automatic", "Bluetooth", "Climate Control"], "fr": ["Navigation GPS", "Sièges cuir", "Automatique", "Bluetooth", "Climatisation"], "ar": ["نظام ملاحة", "مقاعد جلدية", "أوتوماتيك", "بلوتوث", "تكييف"], "it": ["Navigazione GPS", "Sedili pelle", "Automatico", "Bluetooth", "Clima"]}'::jsonb,
    '{"engine": "V8 4.0L", "transmission": "9-Speed Auto", "fuelType": "Petrol", "seats": 5, "color": "Black"}'::jsonb,
    2,
    2
),
(
    '{"en": "BMW X5 SUV", "fr": "BMW X5 SUV", "ar": "BMW X5 دفع رباعي", "it": "BMW X5 SUV"}'::jsonb,
    'BMW',
    'X5',
    2024,
    200.00,
    '{"en": "Spacious luxury SUV perfect for families", "fr": "SUV de luxe spacieux parfait pour familles", "ar": "سيارة دفع رباعي فسيحة للعائلات", "it": "SUV lusso spazioso perfetto per famiglie"}'::jsonb,
    'AVAILABLE',
    'transfer',
    '{"en": ["7 Seats", "AWD", "Panoramic Roof", "Premium Sound", "Parking Sensors"], "fr": ["7 Places", "4x4", "Toit panoramique", "Son premium", "Capteurs parking"], "ar": ["7 مقاعد", "دفع رباعي", "سقف بانورامي", "صوت مميز", "حساسات ركن"], "it": ["7 Posti", "Integrale", "Tetto panoramico", "Audio premium", "Sensori parcheggio"]}'::jsonb,
    '{"engine": "3.0L Turbo", "transmission": "8-Speed Auto", "fuelType": "Diesel", "seats": 7, "color": "White"}'::jsonb,
    3,
    3
),
(
    '{"en": "Tesla Model 3", "fr": "Tesla Model 3", "ar": "تيسلا موديل 3", "it": "Tesla Model 3"}'::jsonb,
    'Tesla',
    'Model 3',
    2024,
    180.00,
    '{"en": "Electric performance sedan with autopilot", "fr": "Berline électrique performante avec autopilote", "ar": "سيارة كهربائية بنظام قيادة ذاتي", "it": "Berlina elettrica con pilota automatico"}'::jsonb,
    'AVAILABLE',
    'transfer',
    '{"en": ["Autopilot", "Supercharging", "Glass Roof", "Premium Interior", "Long Range"], "fr": ["Autopilote", "Supercharge", "Toit verre", "Intérieur premium", "Longue autonomie"], "ar": ["قيادة ذاتية", "شحن سريع", "سقف زجاجي", "داخلية فاخرة", "مدى طويل"], "it": ["Autopilota", "Ricarica rapida", "Tetto vetro", "Interni premium", "Autonomia lunga"]}'::jsonb,
    '{"engine": "Dual Motor Electric", "transmission": "Single-Speed", "fuelType": "Electric", "seats": 5, "color": "Red"}'::jsonb,
    2,
    2
),
(
    '{"en": "Audi A8 Executive", "fr": "Audi A8 Executive", "ar": "أودي A8 تنفيذية", "it": "Audi A8 Executive"}'::jsonb,
    'Audi',
    'A8',
    2024,
    220.00,
    '{"en": "Executive luxury sedan with advanced technology", "fr": "Berline de luxe exécutive avec technologie avancée", "ar": "سيارة تنفيذية فاخرة بتقنية متقدمة", "it": "Berlina executive con tecnologia avanzata"}'::jsonb,
    'AVAILABLE',
    'marriage',
    '{"en": ["Matrix LED", "Massage Seats", "Bang & Olufsen", "Night Vision", "Adaptive Cruise"], "fr": ["LED Matrix", "Sièges massage", "Bang & Olufsen", "Vision nocturne", "Régulateur adaptatif"], "ar": ["إضاءة ماتريكس", "مقاعد تدليك", "صوت متميز", "رؤية ليلية", "تحكم تكيفي"], "it": ["LED Matrix", "Sedili massaggio", "Bang & Olufsen", "Visione notturna", "Cruise adattivo"]}'::jsonb,
    '{"engine": "V6 3.0L TFSI", "transmission": "8-Speed Tiptronic", "fuelType": "Petrol", "seats": 5, "color": "Silver"}'::jsonb,
    2,
    2
),
(
    '{"en": "Porsche Cayenne Sport", "fr": "Porsche Cayenne Sport", "ar": "بورشه كايين رياضية", "it": "Porsche Cayenne Sport"}'::jsonb,
    'Porsche',
    'Cayenne',
    2024,
    280.00,
    '{"en": "High-performance luxury SUV with sport handling", "fr": "SUV de luxe haute performance avec conduite sportive", "ar": "سيارة دفع رباعي رياضية عالية الأداء", "it": "SUV lusso ad alte prestazioni sportive"}'::jsonb,
    'AVAILABLE',
    'marriage',
    '{"en": ["Sport Chrono", "Air Suspension", "PASM", "Bose Surround", "Sport Exhaust"], "fr": ["Chrono Sport", "Suspension pneumatique", "PASM", "Bose Surround", "Échappement sport"], "ar": ["كرونو رياضي", "تعليق هوائي", "نظام PASM", "صوت بوز", "عادم رياضي"], "it": ["Sport Chrono", "Sospensioni pneumatiche", "PASM", "Bose Surround", "Scarico sport"]}'::jsonb,
    '{"engine": "V6 3.0L Turbo", "transmission": "8-Speed Tiptronic S", "fuelType": "Petrol", "seats": 5, "color": "Blue"}'::jsonb,
    1,
    1
),
(
    '{"en": "Range Rover Vogue", "fr": "Range Rover Vogue", "ar": "رينج روفر فوغ", "it": "Range Rover Vogue"}'::jsonb,
    'Land Rover',
    'Range Rover',
    2024,
    300.00,
    '{"en": "The ultimate in luxury SUV with off-road capability", "fr": "Le summum du SUV de luxe avec capacité tout-terrain", "ar": "قمة سيارات الدفع الرباعي الفاخرة", "it": "Il massimo del SUV di lusso con capacità fuoristrada"}'::jsonb,
    'AVAILABLE',
    'transfer',
    '{"en": ["Terrain Response", "Meridian Audio", "Panoramic Roof", "Rear Entertainment", "Adaptive Dynamics"], "fr": ["Terrain Response", "Audio Meridian", "Toit panoramique", "Divertissement arrière", "Dynamique adaptative"], "ar": ["استجابة التضاريس", "صوت ميريديان", "سقف بانورامي", "ترفيه خلفي", "ديناميكية تكيفية"], "it": ["Terrain Response", "Audio Meridian", "Tetto panoramico", "Intrattenimento posteriore", "Dinamica adattiva"]}'::jsonb,
    '{"engine": "V8 5.0L Supercharged", "transmission": "8-Speed Auto", "fuelType": "Petrol", "seats": 7, "color": "Black"}'::jsonb,
    1,
    1
);

-- ========================================
-- HELPER FUNCTION: Verify Password
-- ========================================
-- Use this to check passwords: SELECT verify_password('user@test.com', 'User@123');
CREATE OR REPLACE FUNCTION verify_password(user_email TEXT, plain_password TEXT)
RETURNS BOOLEAN AS $$
DECLARE
    stored_password TEXT;
BEGIN
    SELECT password INTO stored_password FROM users WHERE email = user_email;
    RETURN (stored_password = crypt(plain_password, stored_password));
END;
$$ LANGUAGE plpgsql;
