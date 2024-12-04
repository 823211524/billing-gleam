export interface User {
  id: number;
  email: string;
  given_name: string;
  surname: string;
  address: string;
  role: 'ADMIN' | 'CONSUMER';
  is_enabled: boolean;
  disabled_at: string | null;
  secret_word?: string;
  table_name?: string;
  created_at: string;
  updated_at: string;
}

export interface Meter {
  id: string;
  qr_code: string;
  longitude: number;
  latitude: number;
  is_enabled: boolean;
  secret_word?: string;
  table_name?: string;
  consumer_id?: number;
  created_at: string;
  updated_at: string;
}

export interface Reading {
  id: number;
  meter_id: string;
  reading: number;
  image_url: string;
  image_location?: any;
  ocr_confidence?: number;
  manual_input: boolean;
  validated: boolean;
  validated_by_consumer: boolean;
  validated_by_admin: boolean;
  validation_errors?: string[];
  year: number;
  month: number;
  created_at: string;
  updated_at: string;
  user_id: number;
}

export interface Bill {
  id: number;
  reading_id: number;
  amount: number;
  consumption: number;
  pdf_url: string;
  paid: boolean;
  due_date: string;
  created_at: string;
  updated_at: string;
  user_id: number;
  reading?: Reading;
}