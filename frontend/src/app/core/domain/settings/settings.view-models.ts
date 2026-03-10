// ---- Settings View Models ----

export interface CompanyInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
}

export interface NotificationSetting {
  type: string;
  icon: string;
  description: string;
  enabled: boolean;
}

export interface NotificationType {
  name: string;
  enabled: boolean;
}

export interface SettingsForm {
  [key: string]: any;
}
