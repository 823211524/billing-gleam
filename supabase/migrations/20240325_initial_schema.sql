-- Enable RLS
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Create tables
CREATE TYPE user_role AS ENUM ('ADMIN', 'CONSUMER');

CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    given_name TEXT NOT NULL,
    surname TEXT NOT NULL,
    address TEXT NOT NULL,
    role user_role NOT NULL DEFAULT 'CONSUMER',
    is_enabled BOOLEAN NOT NULL DEFAULT true,
    disabled_at TIMESTAMPTZ,
    secret_word TEXT,
    table_name TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE meters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    qr_code TEXT UNIQUE NOT NULL,
    longitude FLOAT NOT NULL,
    latitude FLOAT NOT NULL,
    is_enabled BOOLEAN NOT NULL DEFAULT true,
    secret_word TEXT,
    table_name TEXT,
    consumer_id BIGINT REFERENCES users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE readings (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    meter_id UUID NOT NULL REFERENCES meters(id),
    reading FLOAT NOT NULL,
    image_url TEXT NOT NULL,
    image_location JSONB,
    ocr_confidence FLOAT,
    manual_input BOOLEAN NOT NULL DEFAULT false,
    validated BOOLEAN NOT NULL DEFAULT false,
    validated_by_consumer BOOLEAN NOT NULL DEFAULT false,
    validated_by_admin BOOLEAN NOT NULL DEFAULT false,
    validation_errors TEXT[],
    year INTEGER NOT NULL,
    month INTEGER NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    user_id BIGINT NOT NULL REFERENCES users(id)
);

CREATE TABLE bills (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    reading_id BIGINT UNIQUE NOT NULL REFERENCES readings(id),
    amount FLOAT NOT NULL,
    consumption FLOAT NOT NULL,
    pdf_url TEXT NOT NULL,
    paid BOOLEAN NOT NULL DEFAULT false,
    due_date TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    user_id BIGINT NOT NULL REFERENCES users(id)
);

-- Create indexes
CREATE INDEX idx_readings_year_month ON readings(year, month);
CREATE INDEX idx_readings_validated ON readings(validated);
CREATE INDEX idx_bills_paid ON bills(paid);
CREATE INDEX idx_users_is_enabled ON users(is_enabled);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE meters ENABLE ROW LEVEL SECURITY;
ALTER TABLE readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE bills ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own data" ON users
    FOR SELECT USING (auth.uid()::text = id::text OR role = 'ADMIN');

CREATE POLICY "Admins can insert users" ON users
    FOR INSERT WITH CHECK (role = 'ADMIN');

CREATE POLICY "Users can update their own data" ON users
    FOR UPDATE USING (auth.uid()::text = id::text OR role = 'ADMIN');

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_meters_updated_at
    BEFORE UPDATE ON meters
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_readings_updated_at
    BEFORE UPDATE ON readings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_bills_updated_at
    BEFORE UPDATE ON bills
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

-- Insert initial admin user (use a secure password in production)
INSERT INTO users (
    email,
    password_hash,
    given_name,
    surname,
    address,
    role,
    is_enabled
) VALUES (
    'admin@example.com',
    '$2a$10$xxxxxxxxxxx', -- Replace with actual hashed password
    'Admin',
    'User',
    'Admin Address',
    'ADMIN',
    true
);
