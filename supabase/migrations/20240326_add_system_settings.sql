CREATE TABLE IF NOT EXISTS system_settings (
    id INTEGER PRIMARY KEY DEFAULT 1,
    billing_rate DECIMAL(10,2) NOT NULL DEFAULT 0,
    reading_due_day INTEGER NOT NULL DEFAULT 1,
    payment_grace_period INTEGER NOT NULL DEFAULT 7,
    enable_notifications BOOLEAN NOT NULL DEFAULT true,
    enable_auto_billing BOOLEAN NOT NULL DEFAULT false,
    enable_reading_reminders BOOLEAN NOT NULL DEFAULT true,
    minimum_reading_interval INTEGER NOT NULL DEFAULT 25,
    maximum_reading_interval INTEGER NOT NULL DEFAULT 35,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT single_row CHECK (id = 1)
);

-- Insert default settings
INSERT INTO system_settings (
    id, 
    billing_rate, 
    reading_due_day, 
    payment_grace_period,
    enable_notifications,
    enable_auto_billing,
    enable_reading_reminders,
    minimum_reading_interval,
    maximum_reading_interval
) VALUES (
    1, 0, 1, 7, true, false, true, 25, 35
) ON CONFLICT (id) DO NOTHING;

-- Create trigger to update updated_at
CREATE TRIGGER update_system_settings_updated_at
    BEFORE UPDATE ON system_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();