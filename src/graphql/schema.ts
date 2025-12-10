export const typeDefs = `#graphql
  type User {
    id: String!
    email: String!
    full_name: String!
    phone: String
    address: String
    role: String!
    preferred_language: String!
    service_type: String!
    is_verified: Boolean!
    created_at: String!
  }

  type Car {
    id: String!
    name: String!
    brand: String!
    model: String!
    year: Int!
    price_per_day: Float!
    description: String!
    image_base64: String
    gallery: [String]
    model_3d_url: String
    status: String!
    service_type: String!
    features: [String]
    specs: CarSpecs
    total_count: Int!
    available_count: Int!
    average_rating: Float!
    total_ratings: Int!
  }

  type CarSpecs {
    engine: String
    transmission: String
    fuelType: String
    seats: Int
    color: String
  }

  type Booking {
    id: String!
    car_id: String!
    user_id: String!
    start_date: String!
    end_date: String!
    total_days: Int!
    total_price: Float!
    status: String!
    payment_status: String!
    notes: String
    flight_number: String
    promo_code: String
    created_at: String!
    car: Car
    user: User
  }

  type Rating {
    id: String!
    car_id: String!
    user_id: String!
    booking_id: String!
    rating: Int!
    comment: String
    created_at: String!
    user: User
  }

  type AuthResponse {
    token: String!
    user: User!
  }

  type DashboardStats {
    totalCars: Int!
    totalBookings: Int!
    totalUsers: Int!
    totalRevenue: Float!
    activeBookings: Int!
    availableCars: Int!
  }

  type HeroSettings {
    id: String!
    video_url: String!
    mobile_image_url: String
    desktop_image_url: String
    title: String
    subtitle: String
    is_active: Boolean!
    created_at: String!
  }

  input HeroSettingsInput {
    video_url: String!
    mobile_image_url: String
    desktop_image_url: String
    title: String
    subtitle: String
  }

  type Gift {
    id: String!
    title: String!
    description: String!
    emoji: String!
    discount_percentage: Int!
    promo_code: String
    is_active: Boolean!
    display_order: Int!
    created_at: String!
    updated_at: String!
  }

  input GiftInput {
    title: String!
    description: String!
    emoji: String!
    discount_percentage: Int!
    promo_code: String
    is_active: Boolean
    display_order: Int
  }

  input SignupInput {
    email: String!
    password: String!
    full_name: String!
    phone: String
    address: String
    preferred_language: String
    service_type: String
  }

  input LoginInput {
    email: String!
    password: String!
  }

  input CarInput {
    name: String!
    brand: String!
    model: String!
    year: Int!
    price_per_day: Float!
    description: String!
    image_base64: String
    gallery: [String]
    model_3d_url: String
    service_type: String
    features: [String]
    specs: CarSpecsInput
    total_count: Int
  }

  input CarSpecsInput {
    engine: String
    transmission: String
    fuelType: String
    seats: Int
    color: String
  }

  input BookingInput {
    car_id: String!
    start_date: String!
    end_date: String!
    notes: String
    flight_number: String
    promo_code: String
  }

  input RatingInput {
    booking_id: String!
    rating: Int!
    comment: String
  }

  type Query {
    # Public
    cars(language: String, service_type: String): [Car]
    car(id: String!, language: String): Car
    carAvailability(carId: String!, startDate: String!, endDate: String!): Boolean!
    heroSettings(language: String): HeroSettings
    gifts(language: String): [Gift]
    activeGifts(language: String): [Gift]

    # Authenticated
    me: User
    myBookings: [Booking]
    booking(id: String!): Booking

    # Admin
    allBookings: [Booking]
    allUsers: [User]
    dashboardStats: DashboardStats
    carRatings(carId: String!): [Rating]
    allGifts: [Gift]
    gift(id: String!): Gift
  }

  type Mutation {
    # Auth
    signup(input: SignupInput!): AuthResponse!
    login(input: LoginInput!): AuthResponse!
    
    # Bookings
    createBooking(input: BookingInput!): Booking!
    cancelBooking(id: String!): Booking!
    
    # Ratings
    createRating(input: RatingInput!): Rating!
    
    # Admin - Cars
    createCar(input: CarInput!): Car!
    updateCar(id: String!, input: CarInput!): Car!
    deleteCar(id: String!): Boolean!
    
    # Admin - Bookings
    updateBookingStatus(id: String!, status: String!): Booking!
    
    # Admin - Users
    deleteUser(id: String!): Boolean!

    # Admin - Hero Settings
    updateHeroSettings(input: HeroSettingsInput!): HeroSettings!

    # Admin - Gifts
    createGift(input: GiftInput!): Gift!
    updateGift(id: String!, input: GiftInput!): Gift!
    deleteGift(id: String!): Boolean!
    toggleGiftStatus(id: String!): Gift!
  }
`;
