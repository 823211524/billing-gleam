export interface Meter {
  id: string;
  qr_code: string;
  longitude: number;
  latitude: number;
  is_enabled: boolean;
  secret_word: string;
  table_name: string;
  unit_rate: number;
  consumer_id?: number;
  created_at: string;
  updated_at: string;
}