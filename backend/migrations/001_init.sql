-- USERS TABLE
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'user',
  profile_picture TEXT,
  phone VARCHAR(20),
  sex VARCHAR(20),
  address TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- PROFESSIONALS TABLE
CREATE TABLE IF NOT EXISTS professionals (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'professional',
  category VARCHAR(255) NOT NULL,
  location VARCHAR(255) NOT NULL,
  profile_picture TEXT,
  phone VARCHAR(20),
  address TEXT,
  sex VARCHAR(20),
  about TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- SERVICES TABLE
CREATE TABLE IF NOT EXISTS services (
  id SERIAL PRIMARY KEY,
  professional_id INT REFERENCES professionals(id) ON DELETE CASCADE,
  service_name VARCHAR(255) NOT NULL,
  description TEXT,
  price NUMERIC,
  created_at TIMESTAMP DEFAULT NOW()
);
