export interface User {
  id: number;
  givenName: string;
  surname: string;
  email: string;
  address: string;
  role: 'ADMIN' | 'CONSUMER';
  isEnabled: boolean;
  disabledAt: Date | null;
  secretWord?: string;
}

export interface Meter {
  id: string;
  longitude: number;
  latitude: number;
  qrCode: string;
  consumerId?: number;
  isEnabled: boolean;
}

export interface Reading {
  id: number;
  meterId: string;
  reading: number;
  imageUrl: string;
  validated: boolean;
  validatedByConsumer: boolean;
  validatedByAdmin: boolean;
  year: number;
  month: number;
}

export interface Bill {
  id: number;
  readingId: number;
  amount: number;
  consumption: number;
  pdfUrl: string;
  paid: boolean;
  dueDate: Date;
}