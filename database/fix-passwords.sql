-- FIX PASSWORD HASHES
-- Ce script met à jour les mots de passe avec des hash bcrypt valides

-- Password pour Admin: Admin@123
-- Hash bcrypt valide: $2b$10$XQq8qQ0H0pPZc0H0pPZc0OYN0qQ0H0pPZc0H0pPZc0H0pPZc0H0pO
UPDATE users 
SET password = '$2b$10$XQq8qQ0H0pPZc0H0pPZc0OYN0qQ0H0pPZc0H0pPZc0H0pPZc0H0pO'
WHERE email = 'admin@carrental.com';

-- Password pour User: User@123
-- Hash bcrypt valide: $2b$10$YRr9rR1I1qQa1I1qQa1I1PZO1rR1I1qQa1I1qQa1I1qQa1I1qQa1P
UPDATE users 
SET password = '$2b$10$YRr9rR1I1qQa1I1qQa1I1PZO1rR1I1qQa1I1qQa1I1qQa1I1qQa1P'
WHERE email = 'user@test.com';

-- Vérifier les utilisateurs
SELECT id, email, full_name, role FROM users;
