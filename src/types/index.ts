export enum CarStatus {
  AVAILABLE = 'AVAILABLE',
  RENTED = 'RENTED',
  MAINTENANCE = 'MAINTENANCE',
}

export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  REFUNDED = 'REFUNDED',
  FAILED = 'FAILED',
}

export enum ServiceType {
  MARRIAGE = 'marriage',
  TRANSFER = 'transfer',
}

export type Language = 'en' | 'fr' | 'ar' | 'it';

export interface MultiLanguageText {
  en: string;
  fr: string;
  ar: string;
  it: string;
}

export interface User {
  id: number;
  email: string;
  password: string;
  full_name: string;
  phone?: string;
  address?: string;
  role: UserRole;
  preferred_language: string;
  service_type: ServiceType;
  is_verified: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface Car {
  id: number;
  name: MultiLanguageText;
  brand: string;
  model: string;
  year: number;
  price_per_day: number;
  description: MultiLanguageText;
  image_base64?: string;
  gallery?: string[];
  model_3d_url?: string;
  status: CarStatus;
  service_type: ServiceType;
  features?: MultiLanguageText;
  specs?: {
    engine: string;
    transmission: string;
    fuelType: string;
    seats: number;
    color: string;
  };
  total_count: number;
  available_count: number;
  average_rating: number;
  total_ratings: number;
  created_at: Date;
  updated_at: Date;
}

export interface Booking {
  id: number;
  car_id: number;
  user_id: number;
  start_date: Date;
  end_date: Date;
  total_days: number;
  total_price: number;
  status: BookingStatus;
  payment_status: PaymentStatus;
  notes?: string;
  flight_number?: string;
  created_at: Date;
  updated_at: Date;
  car?: Car;
  user?: User;
}

export interface Rating {
  id: number;
  car_id: number;
  user_id: number;
  booking_id: number;
  rating: number;
  comment?: string;
  created_at: Date;
  user?: User;
  car?: Car;
}

export interface UnavailableDate {
  id: number;
  car_id: number;
  date: Date;
  reason?: string;
}

export interface JWTPayload {
  userId: number;
  email: string;
  role: UserRole;
}

export interface AuthResponse {
  token: string;
  user: Omit<User, 'password'>;
}
