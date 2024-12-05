export interface SystemSettingsFormData {
  billing_rate: number;
  reading_due_day: number;
  payment_grace_period: number;
  enable_notifications: boolean;
  enable_auto_billing: boolean;
  enable_reading_reminders: boolean;
  minimum_reading_interval: number;
  maximum_reading_interval: number;
}