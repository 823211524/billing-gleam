export interface Meter {
  id: string;
  qr_code: string;
  longitude: number;
  latitude: number;
  is_enabled: boolean;
  consumer_id?: number;
  location?: string;
  billing_settings?: {
    billing_rate: number;
    reading_due_day: number;
    payment_grace_period: number;
  };
  is_settings?: boolean;
  created_at: string;
  updated_at: string;
}