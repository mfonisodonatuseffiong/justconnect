-- GLOBAL CATEGORY FOR OUR APP 
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);


-- USERS TABLE
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'user' CHECK ( role IN ('professional', 'user', 'admin')),
  profile_picture TEXT,
  phone VARCHAR(20),
  sex VARCHAR(20),
  address TEXT,
  location TEXT,
  is_verified boolean DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- PROFESSIONALS TABLE
CREATE TABLE IF NOT EXISTS professionals (
  id SERIAL PRIMARY KEY,
  user_id INT UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  bio TEXT,
  category_id INT REFERENCES categories(id),
  rating DECIMAL(3, 2) DEFAULT 0.00,
  experience_years INT,
  service_area TEXT,
  is_available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- PROFESSIONAL CATEGORY
CREATE TABLE IF NOT EXISTS professional_category (
  id SERIAL PRIMARY KEY,
  professional_id INT NOT NULL REFERENCES professionals(id)
);

-- SERVICES TABLE
CREATE TABLE IF NOT EXISTS services (
  id SERIAL PRIMARY KEY,
  professional_id INT NOT NULL REFERENCES professionals(id) ON DELETE CASCADE,
  service_name VARCHAR(255) NOT NULL,
  description TEXT,
  price NUMERIC,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- BOOKING TABLE 
CREATE TABLE IF NOT EXISTS bookings (
  id SERIAL PRIMARY KEY,
  customer_id INT REFERENCES users(id) ON DELETE CASCADE,
  professional_id INT REFERENCES professionals(id) ON DELETE CASCADE,
  service_id INT REFERENCES services(id),
  booking_date TIMESTAMP NOT NULL,
  status VARCHAR(50) CHECK ( status IN ('incoming', 'accepted', 'on_going', 'completed', 'cancelled')) DEFAULT 'incoming',
  address TEXT,
  note TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- REVIEW TABLE
CREATE TABLE IF NOT EXISTS reviews (
  id SERIAL PRIMARY KEY,
  booking_id INT NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  review TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- TODO: Payment table when payment has been added to the app
-- TODO: Message chat system table
-- TODO: Notifications table
