-- ========================================
-- FIX PASSWORDS - Solution Simple
-- ========================================

-- Supprimer les anciens utilisateurs
DELETE FROM users WHERE email IN ('admin@carrental.com', 'user@test.com');

-- Installer l'extension pgcrypto si pas déjà fait
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Insérer admin avec mot de passe hashé: Admin@123
INSERT INTO users (email, password, full_name, role, preferred_language, is_verified)
VALUES (
    'admin@carrental.com',
    crypt('Admin@123', gen_salt('bf', 10)),
    'Administrateur',
    'ADMIN',
    'fr',
    TRUE
);

-- Insérer user avec mot de passe hashé: User@123
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

-- Vérifier
SELECT id, email, full_name, role, LEFT(password, 20) as password_preview FROM users;

-- Pour tester un mot de passe plus tard, utiliser:
-- SELECT password = crypt('Admin@123', password) AS password_match FROM users WHERE email = 'admin@carrental.com';
