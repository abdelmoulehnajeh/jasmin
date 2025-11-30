-- Create table for hero video settings
CREATE TABLE IF NOT EXISTS hero_settings (
  id SERIAL PRIMARY KEY,
  video_url TEXT NOT NULL,
  mobile_image_url TEXT,
  desktop_image_url TEXT,
  title JSONB DEFAULT '{"en": "", "fr": "", "ar": ""}'::jsonb,
  subtitle JSONB DEFAULT '{"en": "", "fr": "", "ar": ""}'::jsonb,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for active hero settings
CREATE INDEX IF NOT EXISTS idx_hero_settings_active ON hero_settings(is_active);

-- Insert default hero settings
INSERT INTO hero_settings (video_url, title, subtitle, is_active)
VALUES (
  '',
  '{"en": "Welcome to Jasmin Rent Cars", "fr": "Bienvenue à Jasmin Rent Cars", "ar": "مرحبا بك في جاسمين لتأجير السيارات"}',
  '{"en": "Your Premium Car Rental Experience", "fr": "Votre expérience de location de voiture premium", "ar": "تجربة تأجير السيارات الفاخرة"}',
  true
)
ON CONFLICT DO NOTHING;
