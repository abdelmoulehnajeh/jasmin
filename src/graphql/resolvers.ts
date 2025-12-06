import { query } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { generateToken, verifyToken } from '@/lib/jwt';
import { UserRole } from '@/types';

// Helper function to get multilingual text
const getLocalizedText = (jsonb: any, language: string = 'en') => {
  if (!jsonb) return '';
  if (typeof jsonb === 'string') {
    try {
      jsonb = JSON.parse(jsonb);
    } catch {
      return jsonb;
    }
  }
  return jsonb[language] || jsonb['en'] || '';
};

// Helper function to parse JSONB array
const parseJsonbArray = (jsonb: any, language: string = 'en') => {
  if (!jsonb) return [];
  if (typeof jsonb === 'string') {
    try {
      jsonb = JSON.parse(jsonb);
    } catch {
      return [];
    }
  }
  if (Array.isArray(jsonb)) return jsonb;
  return jsonb[language] || jsonb['en'] || [];
};

export const resolvers = {
  Query: {
    // Public queries
    cars: async (_: any, { language = 'en', service_type }: any) => {
      let queryText = 'SELECT * FROM cars WHERE status = $1';
      const params: any[] = ['AVAILABLE'];

      if (service_type) {
        queryText += ' AND service_type = $2';
        params.push(service_type);
      }

      queryText += ' ORDER BY created_at DESC';

      const result = await query(queryText, params);

      return result.rows.map(car => ({
        ...car,
        name: getLocalizedText(car.name, language),
        description: getLocalizedText(car.description, language),
        features: parseJsonbArray(car.features, language),
        specs: car.specs,
        gallery: car.gallery || [],
      }));
    },

    car: async (_: any, { id, language = 'en' }: any) => {
      const result = await query('SELECT * FROM cars WHERE id = $1', [id]);
      if (result.rows.length === 0) throw new Error('Car not found');

      const car = result.rows[0];
      return {
        ...car,
        name: getLocalizedText(car.name, language),
        description: getLocalizedText(car.description, language),
        features: parseJsonbArray(car.features, language),
        specs: car.specs,
        gallery: car.gallery || [],
      };
    },

    carAvailability: async (_: any, { carId, startDate, endDate }: any) => {
      // Check if car has available count
      const carResult = await query(
        'SELECT available_count FROM cars WHERE id = $1',
        [carId]
      );

      if (carResult.rows.length === 0 || carResult.rows[0].available_count <= 0) {
        return false;
      }

      // Check for conflicting bookings
      const bookingResult = await query(
        `SELECT COUNT(*) as count FROM bookings 
         WHERE car_id = $1 
         AND status IN ('CONFIRMED', 'ACTIVE')
         AND (
           (start_date <= $2 AND end_date >= $2)
           OR (start_date <= $3 AND end_date >= $3)
           OR (start_date >= $2 AND end_date <= $3)
         )`,
        [carId, startDate, endDate]
      );

      const bookedCount = parseInt(bookingResult.rows[0].count);
      const availableCount = carResult.rows[0].available_count;

      return bookedCount < availableCount;
    },

    // Authenticated queries
    me: async (_: any, __: any, context: any) => {
      if (!context.user) throw new Error('Not authenticated');

      const result = await query(
        'SELECT id, email, full_name, phone, address, role, preferred_language, is_verified, created_at FROM users WHERE id = $1',
        [context.user.userId]
      );

      if (result.rows.length === 0) throw new Error('User not found');
      return result.rows[0];
    },

    myBookings: async (_: any, __: any, context: any) => {
      if (!context.user) throw new Error('Not authenticated');

      const result = await query(
        `SELECT b.*, 
                c.name, c.brand, c.model, c.image_base64, c.price_per_day
         FROM bookings b
         JOIN cars c ON b.car_id = c.id
         WHERE b.user_id = $1
         ORDER BY b.created_at DESC`,
        [context.user.userId]
      );

      return result.rows.map(booking => ({
        ...booking,
        start_date: new Date(booking.start_date).toISOString(),
        end_date: new Date(booking.end_date).toISOString(),
        created_at: new Date(booking.created_at).toISOString(),
        car: {
          id: booking.car_id,
          name: getLocalizedText(booking.name, context.user.language || 'en'),
          brand: booking.brand,
          model: booking.model,
          image_base64: booking.image_base64,
          price_per_day: booking.price_per_day,
        }
      }));
    },

    booking: async (_: any, { id }: any, context: any) => {
      if (!context.user) throw new Error('Not authenticated');

      const result = await query(
        `SELECT b.*, 
                c.name, c.brand, c.model, c.image_base64, c.price_per_day
         FROM bookings b
         JOIN cars c ON b.car_id = c.id
         WHERE b.id = $1 AND b.user_id = $2`,
        [id, context.user.userId]
      );

      if (result.rows.length === 0) throw new Error('Booking not found');

      const booking = result.rows[0];
      return {
        ...booking,
        car: {
          id: booking.car_id,
          name: getLocalizedText(booking.name, context.user.language || 'en'),
          brand: booking.brand,
          model: booking.model,
          image_base64: booking.image_base64,
          price_per_day: booking.price_per_day,
        }
      };
    },

    // Admin queries
    allBookings: async (_: any, __: any, context: any) => {
      if (!context.user || context.user.role !== UserRole.ADMIN) {
        throw new Error('Not authorized');
      }

      const result = await query(
        `SELECT b.*, 
                c.name, c.brand, c.model,
                u.full_name, u.email, u.phone
         FROM bookings b
         JOIN cars c ON b.car_id = c.id
         JOIN users u ON b.user_id = u.id
         ORDER BY b.created_at DESC`
      );

      return result.rows.map(booking => ({
        ...booking,
        car: {
          id: booking.car_id,
          name: getLocalizedText(booking.name, 'fr'), // Admin panel in French
          brand: booking.brand,
          model: booking.model,
        },
        user: {
          id: booking.user_id,
          full_name: booking.full_name,
          email: booking.email,
          phone: booking.phone,
        }
      }));
    },

    allUsers: async (_: any, __: any, context: any) => {
      if (!context.user || context.user.role !== UserRole.ADMIN) {
        throw new Error('Not authorized');
      }

      const result = await query(
        'SELECT id, email, full_name, phone, address, role, preferred_language, is_verified, created_at FROM users ORDER BY created_at DESC'
      );

      return result.rows;
    },

    dashboardStats: async (_: any, __: any, context: any) => {
      if (!context.user || context.user.role !== UserRole.ADMIN) {
        throw new Error('Not authorized');
      }

      const [carsResult, bookingsResult, usersResult, revenueResult, activeResult, availableResult] = await Promise.all([
        query('SELECT COUNT(*) as count FROM cars'),
        query('SELECT COUNT(*) as count FROM bookings'),
        query('SELECT COUNT(*) as count FROM users WHERE role = $1', ['USER']),
        query('SELECT COALESCE(SUM(total_price), 0) as total FROM bookings WHERE payment_status = $1', ['PAID']),
        query('SELECT COUNT(*) as count FROM bookings WHERE status = $1', ['ACTIVE']),
        query('SELECT COUNT(*) as count FROM cars WHERE status = $1', ['AVAILABLE']),
      ]);

      return {
        totalCars: parseInt(carsResult.rows[0].count),
        totalBookings: parseInt(bookingsResult.rows[0].count),
        totalUsers: parseInt(usersResult.rows[0].count),
        totalRevenue: parseFloat(revenueResult.rows[0].total),
        activeBookings: parseInt(activeResult.rows[0].count),
        availableCars: parseInt(availableResult.rows[0].count || 0),
      };
    },

    carRatings: async (_: any, { carId }: any, context: any) => {
      const result = await query(
        `SELECT r.*, u.full_name, u.email
         FROM ratings r
         JOIN users u ON r.user_id = u.id
         WHERE r.car_id = $1
         ORDER BY r.created_at DESC`,
        [carId]
      );

      return result.rows.map(rating => ({
        ...rating,
        user: {
          id: rating.user_id,
          full_name: rating.full_name,
          email: rating.email,
        }
      }));
    },

    heroSettings: async (_: any, { language = 'en' }: any) => {
      const result = await query(
        'SELECT * FROM hero_settings WHERE is_active = true ORDER BY created_at DESC LIMIT 1'
      );

      if (result.rows.length === 0) {
        return {
          id: '0',
          video_url: '',
          mobile_image_url: null,
          desktop_image_url: null,
          title: '',
          subtitle: '',
          is_active: true,
          created_at: new Date().toISOString(),
        };
      }

      const hero = result.rows[0];
      return {
        id: String(hero.id),
        video_url: hero.video_url || '',
        mobile_image_url: hero.mobile_image_url,
        desktop_image_url: hero.desktop_image_url,
        // Return the full JSON string so frontend can handle language switching
        title: typeof hero.title === 'string' ? hero.title : JSON.stringify(hero.title),
        subtitle: typeof hero.subtitle === 'string' ? hero.subtitle : JSON.stringify(hero.subtitle),
        is_active: hero.is_active,
        created_at: hero.created_at,
      };
    },

    // Gift queries
    gifts: async (_: any, { language = 'en' }: any) => {
      const result = await query(
        'SELECT * FROM gifts ORDER BY display_order ASC, created_at DESC'
      );

      return result.rows.map(gift => ({
        id: String(gift.id),
        title: getLocalizedText(gift.title, language),
        description: getLocalizedText(gift.description, language),
        emoji: gift.emoji,
        discount_percentage: gift.discount_percentage,
        promo_code: gift.promo_code,
        is_active: gift.is_active,
        display_order: gift.display_order,
        created_at: gift.created_at,
        updated_at: gift.updated_at,
      }));
    },

    activeGifts: async (_: any, { language = 'en' }: any) => {
      const result = await query(
        'SELECT * FROM gifts WHERE is_active = true ORDER BY display_order ASC, created_at DESC'
      );

      return result.rows.map(gift => ({
        id: String(gift.id),
        title: getLocalizedText(gift.title, language),
        description: getLocalizedText(gift.description, language),
        emoji: gift.emoji,
        discount_percentage: gift.discount_percentage,
        promo_code: gift.promo_code,
        is_active: gift.is_active,
        display_order: gift.display_order,
        created_at: gift.created_at,
        updated_at: gift.updated_at,
      }));
    },

    // Admin gift queries
    allGifts: async (_: any, __: any, context: any) => {
      if (!context.user || context.user.role !== 'ADMIN') {
        throw new Error('Admin access required');
      }

      const result = await query(
        'SELECT * FROM gifts ORDER BY display_order ASC, created_at DESC'
      );

      return result.rows.map(gift => ({
        id: String(gift.id),
        title: typeof gift.title === 'string' ? gift.title : JSON.stringify(gift.title),
        description: typeof gift.description === 'string' ? gift.description : JSON.stringify(gift.description),
        emoji: gift.emoji,
        discount_percentage: gift.discount_percentage,
        promo_code: gift.promo_code,
        is_active: gift.is_active,
        display_order: gift.display_order,
        created_at: gift.created_at,
        updated_at: gift.updated_at,
      }));
    },

    gift: async (_: any, { id }: any, context: any) => {
      if (!context.user || context.user.role !== 'ADMIN') {
        throw new Error('Admin access required');
      }

      const result = await query('SELECT * FROM gifts WHERE id = $1', [id]);

      if (result.rows.length === 0) throw new Error('Gift not found');

      const gift = result.rows[0];
      return {
        id: String(gift.id),
        title: typeof gift.title === 'string' ? gift.title : JSON.stringify(gift.title),
        description: typeof gift.description === 'string' ? gift.description : JSON.stringify(gift.description),
        emoji: gift.emoji,
        discount_percentage: gift.discount_percentage,
        promo_code: gift.promo_code,
        is_active: gift.is_active,
        display_order: gift.display_order,
        created_at: gift.created_at,
        updated_at: gift.updated_at,
      };
    },
  },

  Mutation: {
    // Auth mutations
    signup: async (_: any, { input }: any) => {
      const { email, password, full_name, phone, address, preferred_language, service_type } = input;

      // Check if user exists
      const existingUser = await query('SELECT id FROM users WHERE email = $1', [email]);
      if (existingUser.rows.length > 0) {
        throw new Error('Email already registered');
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      const result = await query(
        `INSERT INTO users (email, password, full_name, phone, address, preferred_language, service_type, is_verified)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING id, email, full_name, phone, address, role, preferred_language, service_type, is_verified, created_at`,
        [email, hashedPassword, full_name, phone, address, preferred_language || 'en', service_type || 'marriage', true]
      );

      const user = result.rows[0];
      const token = generateToken({
        userId: user.id,
        email: user.email,
        role: user.role,
      });

      return { token, user };
    },

    login: async (_: any, { input }: any) => {
      const { email, password } = input;

      // Find user
      const result = await query(
        'SELECT * FROM users WHERE email = $1',
        [email]
      );

      if (result.rows.length === 0) {
        throw new Error('Invalid credentials');
      }

      const user = result.rows[0];

      // Verify password
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        throw new Error('Invalid credentials');
      }

      // Generate token
      const token = generateToken({
        userId: user.id,
        email: user.email,
        role: user.role,
      });

      // Remove password from response
      const { password: pwd, ...userWithoutPassword } = user;

      return { token, user: userWithoutPassword };
    },

    // Booking mutations
    createBooking: async (_: any, { input }: any, context: any) => {
      if (!context.user) throw new Error('Not authenticated');

      const { car_id, start_date, end_date, notes } = input;

      // Calculate days and price
      const start = new Date(start_date);
      const end = new Date(end_date);
      const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

      // Get car price
      const carResult = await query('SELECT price_per_day FROM cars WHERE id = $1', [car_id]);
      if (carResult.rows.length === 0) throw new Error('Car not found');

      const totalPrice = days * parseFloat(carResult.rows[0].price_per_day);

      // Create booking
      const result = await query(
        `INSERT INTO bookings (car_id, user_id, start_date, end_date, total_days, total_price, notes)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING *`,
        [car_id, context.user.userId, start_date, end_date, days, totalPrice, notes]
      );

      return result.rows[0];
    },

    cancelBooking: async (_: any, { id }: any, context: any) => {
      if (!context.user) throw new Error('Not authenticated');

      const result = await query(
        `UPDATE bookings 
         SET status = 'CANCELLED', updated_at = CURRENT_TIMESTAMP
         WHERE id = $1 AND user_id = $2
         RETURNING *`,
        [id, context.user.userId]
      );

      if (result.rows.length === 0) throw new Error('Booking not found');
      return result.rows[0];
    },

    // Rating mutations
    createRating: async (_: any, { input }: any, context: any) => {
      if (!context.user) throw new Error('Not authenticated');

      const { booking_id, rating, comment } = input;

      // Verify booking belongs to user and is completed
      const bookingResult = await query(
        'SELECT car_id FROM bookings WHERE id = $1 AND user_id = $2 AND status = $3',
        [booking_id, context.user.userId, 'COMPLETED']
      );

      if (bookingResult.rows.length === 0) {
        throw new Error('Invalid booking or booking not completed');
      }

      const car_id = bookingResult.rows[0].car_id;

      // Check if rating already exists
      const existingRating = await query(
        'SELECT id FROM ratings WHERE booking_id = $1',
        [booking_id]
      );

      if (existingRating.rows.length > 0) {
        throw new Error('Booking already rated');
      }

      // Create rating
      const result = await query(
        `INSERT INTO ratings (car_id, user_id, booking_id, rating, comment)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [car_id, context.user.userId, booking_id, rating, comment]
      );

      // Update car average rating
      const avgResult = await query(
        `SELECT AVG(rating) as avg_rating, COUNT(*) as total
         FROM ratings
         WHERE car_id = $1`,
        [car_id]
      );

      await query(
        'UPDATE cars SET average_rating = $1, total_ratings = $2 WHERE id = $3',
        [parseFloat(avgResult.rows[0].avg_rating), parseInt(avgResult.rows[0].total), car_id]
      );

      return result.rows[0];
    },

    // Admin - Car mutations
    createCar: async (_: any, { input }: any, context: any) => {
      if (!context.user || context.user.role !== UserRole.ADMIN) {
        throw new Error('Not authorized');
      }
      const { name, brand, model, year, price_per_day, description, image_base64, gallery, model_3d_url, features, specs, total_count, service_type } = input;

      // Normalize name/description so DB stores a JSON object with languages when a simple string is provided
      const normalizeTextField = (field: any) => {
        if (!field) return { en: '' };
        if (typeof field === 'string') {
          try {
            return JSON.parse(field);
          } catch {
            return { en: field };
          }
        }
        return field;
      };

      const nameObj = normalizeTextField(name);
      const descObj = normalizeTextField(description);

      const result = await query(
        `INSERT INTO cars (name, brand, model, year, price_per_day, description, image_base64, gallery, model_3d_url, features, specs, total_count, available_count, service_type)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $12, $13)
         RETURNING *`,
        [
          JSON.stringify(nameObj),
          brand,
          model,
          year,
          price_per_day,
          JSON.stringify(descObj),
          image_base64,
          JSON.stringify(gallery || []),
          model_3d_url,
          JSON.stringify(features || []),
          JSON.stringify(specs || {}),
          total_count || 1,
          service_type || 'marriage'
        ]
      );

      return result.rows[0];
    },

    updateCar: async (_: any, { id, input }: any, context: any) => {
      if (!context.user || context.user.role !== UserRole.ADMIN) {
        throw new Error('Not authorized');
      }

      const { name, brand, model, year, price_per_day, description, image_base64, gallery, model_3d_url, features, specs, total_count, service_type } = input;

      // Normalize name/description when simple strings are provided
      const normalizeTextField = (field: any) => {
        if (!field) return { en: '' };
        if (typeof field === 'string') {
          try {
            return JSON.parse(field);
          } catch {
            return { en: field };
          }
        }
        return field;
      };

      const nameObj = normalizeTextField(name);
      const descObj = normalizeTextField(description);

      const result = await query(
        `UPDATE cars 
         SET name = $1, brand = $2, model = $3, year = $4, price_per_day = $5, 
             description = $6, image_base64 = $7, gallery = $8, model_3d_url = $9,
             features = $10, specs = $11, total_count = $12, service_type = $13, updated_at = CURRENT_TIMESTAMP
         WHERE id = $14
         RETURNING *`,
        [
          JSON.stringify(nameObj),
          brand,
          model,
          year,
          price_per_day,
          JSON.stringify(descObj),
          image_base64,
          JSON.stringify(gallery || []),
          model_3d_url,
          JSON.stringify(features || []),
          JSON.stringify(specs || {}),
          total_count || 1,
          service_type || 'marriage',
          id
        ]
      );

      if (result.rows.length === 0) throw new Error('Car not found');
      return result.rows[0];
    },

    deleteCar: async (_: any, { id }: any, context: any) => {
      if (!context.user || context.user.role !== UserRole.ADMIN) {
        throw new Error('Not authorized');
      }

      await query('DELETE FROM cars WHERE id = $1', [id]);
      return true;
    },

    // Admin - Booking mutations
    updateBookingStatus: async (_: any, { id, status }: any, context: any) => {
      if (!context.user || context.user.role !== UserRole.ADMIN) {
        throw new Error('Not authorized');
      }

      const result = await query(
        `UPDATE bookings 
         SET status = $1, updated_at = CURRENT_TIMESTAMP
         WHERE id = $2
         RETURNING *`,
        [status, id]
      );

      if (result.rows.length === 0) throw new Error('Booking not found');
      return result.rows[0];
    },

    // Admin - User mutations
    deleteUser: async (_: any, { id }: any, context: any) => {
      if (!context.user || context.user.role !== UserRole.ADMIN) {
        throw new Error('Not authorized');
      }

      await query('DELETE FROM users WHERE id = $1', [id]);
      return true;
    },

    // Admin - Hero Settings mutations
    updateHeroSettings: async (_: any, { input }: any, context: any) => {
      if (!context.user || context.user.role !== UserRole.ADMIN) {
        throw new Error('Not authorized');
      }

      const { video_url, mobile_image_url, desktop_image_url, title, subtitle } = input;

      // Normalize title/subtitle to JSON object format
      const normalizeTextField = (field: any) => {
        if (!field) return { en: '', fr: '', ar: '' };
        if (typeof field === 'string') {
          try {
            return JSON.parse(field);
          } catch {
            return { en: field, fr: field, ar: field };
          }
        }
        return field;
      };

      const titleObj = normalizeTextField(title);
      const subtitleObj = normalizeTextField(subtitle);

      // Deactivate all existing hero settings
      await query('UPDATE hero_settings SET is_active = false');

      // Insert new hero settings
      const result = await query(
        `INSERT INTO hero_settings (video_url, mobile_image_url, desktop_image_url, title, subtitle, is_active)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [
          video_url,
          mobile_image_url || null,
          desktop_image_url || null,
          JSON.stringify(titleObj),
          JSON.stringify(subtitleObj),
          true
        ]
      );

      const hero = result.rows[0];

      // Return properly formatted response with localized strings
      return {
        id: String(hero.id),
        video_url: hero.video_url || '',
        mobile_image_url: hero.mobile_image_url,
        desktop_image_url: hero.desktop_image_url,
        title: getLocalizedText(hero.title, 'en'),
        subtitle: getLocalizedText(hero.subtitle, 'en'),
        is_active: hero.is_active,
        created_at: hero.created_at,
      };
    },

    // Gift mutations
    createGift: async (_: any, { input }: any, context: any) => {
      if (!context.user || context.user.role !== UserRole.ADMIN) {
        throw new Error('Not authorized');
      }

      const { title, description, emoji, discount_percentage, promo_code, is_active = true, display_order = 0 } = input;

      // Normalize title/description to JSON object format
      const normalizeTextField = (field: any) => {
        if (!field) return { en: '', fr: '', ar: '', it: '' };
        if (typeof field === 'string') {
          try {
            return JSON.parse(field);
          } catch {
            return { en: field, fr: field, ar: field, it: field };
          }
        }
        return field;
      };

      const titleObj = normalizeTextField(title);
      const descriptionObj = normalizeTextField(description);

      const result = await query(
        `INSERT INTO gifts (title, description, emoji, discount_percentage, promo_code, is_active, display_order, created_by)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING *`,
        [
          JSON.stringify(titleObj),
          JSON.stringify(descriptionObj),
          emoji,
          discount_percentage,
          promo_code || null,
          is_active,
          display_order,
          context.user.userId
        ]
      );

      const gift = result.rows[0];
      return {
        id: String(gift.id),
        title: typeof gift.title === 'string' ? gift.title : JSON.stringify(gift.title),
        description: typeof gift.description === 'string' ? gift.description : JSON.stringify(gift.description),
        emoji: gift.emoji,
        discount_percentage: gift.discount_percentage,
        promo_code: gift.promo_code,
        is_active: gift.is_active,
        display_order: gift.display_order,
        created_at: gift.created_at,
        updated_at: gift.updated_at,
      };
    },

    updateGift: async (_: any, { id, input }: any, context: any) => {
      if (!context.user || context.user.role !== UserRole.ADMIN) {
        throw new Error('Not authorized');
      }

      const { title, description, emoji, discount_percentage, promo_code, is_active, display_order } = input;

      // Normalize title/description to JSON object format
      const normalizeTextField = (field: any) => {
        if (!field) return { en: '', fr: '', ar: '', it: '' };
        if (typeof field === 'string') {
          try {
            return JSON.parse(field);
          } catch {
            return { en: field, fr: field, ar: field, it: field };
          }
        }
        return field;
      };

      const titleObj = normalizeTextField(title);
      const descriptionObj = normalizeTextField(description);

      const result = await query(
        `UPDATE gifts
         SET title = $1, description = $2, emoji = $3, discount_percentage = $4,
             promo_code = $5, is_active = $6, display_order = $7, updated_at = NOW()
         WHERE id = $8
         RETURNING *`,
        [
          JSON.stringify(titleObj),
          JSON.stringify(descriptionObj),
          emoji,
          discount_percentage,
          promo_code || null,
          is_active !== undefined ? is_active : true,
          display_order !== undefined ? display_order : 0,
          id
        ]
      );

      if (result.rows.length === 0) throw new Error('Gift not found');

      const gift = result.rows[0];
      return {
        id: String(gift.id),
        title: typeof gift.title === 'string' ? gift.title : JSON.stringify(gift.title),
        description: typeof gift.description === 'string' ? gift.description : JSON.stringify(gift.description),
        emoji: gift.emoji,
        discount_percentage: gift.discount_percentage,
        promo_code: gift.promo_code,
        is_active: gift.is_active,
        display_order: gift.display_order,
        created_at: gift.created_at,
        updated_at: gift.updated_at,
      };
    },

    deleteGift: async (_: any, { id }: any, context: any) => {
      if (!context.user || context.user.role !== UserRole.ADMIN) {
        throw new Error('Not authorized');
      }

      const result = await query('DELETE FROM gifts WHERE id = $1 RETURNING id', [id]);

      if (result.rows.length === 0) throw new Error('Gift not found');

      return true;
    },

    toggleGiftStatus: async (_: any, { id }: any, context: any) => {
      if (!context.user || context.user.role !== UserRole.ADMIN) {
        throw new Error('Not authorized');
      }

      const result = await query(
        `UPDATE gifts
         SET is_active = NOT is_active, updated_at = NOW()
         WHERE id = $1
         RETURNING *`,
        [id]
      );

      if (result.rows.length === 0) throw new Error('Gift not found');

      const gift = result.rows[0];
      return {
        id: String(gift.id),
        title: typeof gift.title === 'string' ? gift.title : JSON.stringify(gift.title),
        description: typeof gift.description === 'string' ? gift.description : JSON.stringify(gift.description),
        emoji: gift.emoji,
        discount_percentage: gift.discount_percentage,
        promo_code: gift.promo_code,
        is_active: gift.is_active,
        display_order: gift.display_order,
        created_at: gift.created_at,
        updated_at: gift.updated_at,
      };
    },
  },
};