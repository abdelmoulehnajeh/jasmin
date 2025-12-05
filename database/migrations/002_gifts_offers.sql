-- ========================================
-- GIFTS/OFFERS TABLE MIGRATION
-- ========================================

-- Create gifts table for admin-managed promotional offers
CREATE TABLE IF NOT EXISTS gifts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title JSONB NOT NULL, -- Multilingual title {"en": "...", "fr": "...", "ar": "...", "it": "..."}
    description JSONB NOT NULL, -- Multilingual description
    emoji VARCHAR(10) NOT NULL, -- Emoji icon (e.g., "🎁", "💎", "🎉")
    discount_percentage INTEGER NOT NULL CHECK (discount_percentage >= 0 AND discount_percentage <= 100),
    promo_code VARCHAR(50) UNIQUE, -- Optional promo code for this gift
    is_active BOOLEAN DEFAULT TRUE,
    display_order INTEGER DEFAULT 0, -- For ordering in the spin wheel
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for active gifts
CREATE INDEX IF NOT EXISTS idx_gifts_active ON gifts(is_active, display_order);

-- Create index for promo codes
CREATE INDEX IF NOT EXISTS idx_gifts_promo_code ON gifts(promo_code) WHERE promo_code IS NOT NULL;

-- Insert some default sample gifts
INSERT INTO gifts (title, description, emoji, discount_percentage, promo_code, is_active, display_order) VALUES
(
    '{"en": "Welcome Gift", "fr": "Cadeau de bienvenue", "ar": "هدية ترحيبية", "it": "Regalo di benvenuto"}',
    '{"en": "Get 10% off your first rental!", "fr": "Obtenez 10% de réduction sur votre première location!", "ar": "احصل على خصم 10٪ على أول تأجير!", "it": "Ottieni il 10% di sconto sul tuo primo noleggio!"}',
    '🎁',
    10,
    'WELCOME10',
    true,
    1
),
(
    '{"en": "Premium Discount", "fr": "Réduction Premium", "ar": "خصم بريميوم", "it": "Sconto Premium"}',
    '{"en": "Enjoy 20% off premium cars", "fr": "Profitez de 20% de réduction sur les voitures premium", "ar": "استمتع بخصم 20٪ على السيارات الفاخرة", "it": "Goditi il 20% di sconto sulle auto premium"}',
    '💎',
    20,
    'PREMIUM20',
    true,
    2
),
(
    '{"en": "Special Celebration", "fr": "Célébration spéciale", "ar": "احتفال خاص", "it": "Celebrazione speciale"}',
    '{"en": "15% off for special events", "fr": "15% de réduction pour les événements spéciaux", "ar": "خصم 15٪ للمناسبات الخاصة", "it": "15% di sconto per eventi speciali"}',
    '🎉',
    15,
    'CELEBRATE15',
    true,
    3
),
(
    '{"en": "Lucky Winner", "fr": "Gagnant chanceux", "ar": "الفائز المحظوظ", "it": "Vincitore fortunato"}',
    '{"en": "You won 25% discount!", "fr": "Vous avez gagné 25% de réduction!", "ar": "لقد فزت بخصم 25٪!", "it": "Hai vinto il 25% di sconto!"}',
    '🍀',
    25,
    'LUCKY25',
    true,
    4
),
(
    '{"en": "VIP Offer", "fr": "Offre VIP", "ar": "عرض في آي بي", "it": "Offerta VIP"}',
    '{"en": "Exclusive 30% VIP discount", "fr": "Réduction VIP exclusive de 30%", "ar": "خصم حصري 30٪ في آي بي", "it": "Sconto VIP esclusivo del 30%"}',
    '👑',
    30,
    'VIP30',
    true,
    5
),
(
    '{"en": "Star Deal", "fr": "Offre étoile", "ar": "صفقة النجوم", "it": "Offerta stella"}',
    '{"en": "Get 12% off today!", "fr": "Obtenez 12% de réduction aujourd''hui!", "ar": "احصل على خصم 12٪ اليوم!", "it": "Ottieni il 12% di sconto oggi!"}',
    '⭐',
    12,
    'STAR12',
    true,
    6
);

COMMENT ON TABLE gifts IS 'Admin-managed promotional gifts and offers';
COMMENT ON COLUMN gifts.title IS 'Multilingual gift title in JSON format';
COMMENT ON COLUMN gifts.description IS 'Multilingual gift description in JSON format';
COMMENT ON COLUMN gifts.emoji IS 'Emoji icon to display for this gift';
COMMENT ON COLUMN gifts.discount_percentage IS 'Discount percentage (0-100)';
COMMENT ON COLUMN gifts.promo_code IS 'Optional promo code that can be used';
