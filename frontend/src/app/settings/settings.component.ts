import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

// Interfaces
interface CompanyInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
}

interface NotificationSetting {
  type: string;
  icon: string;
  description: string;
  enabled: boolean;
}

interface NotificationType {
  name: string;
  enabled: boolean;
}

interface SettingsForm {
  [key: string]: any;
}

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  activeTab: 'company' | 'notifications' | 'security' | 'tax' | 'system' | 'backup' = 'company';

  // Company Settings
  companyForm!: FormGroup;
  companyInfo: CompanyInfo = {
    name: 'JengaFlow Hardware Ltd',
    email: 'info@jengaflow.com',
    phone: '+254-700-123456',
    address: ''
  };

  // Business Preferences
  defaultCurrency = 'Kenyan Shilling (KES)';
  timezone = 'Africa/Nairobi (GMT+3)';
  language = 'English';
  dateFormat = 'DD/MM/YYYY';

  // Notification Settings
  notificationChannels: NotificationSetting[] = [
    {
      type: 'Email Notifications',
      icon: 'mail',
      description: 'Receive notifications via email',
      enabled: true
    },
    {
      type: 'SMS Notifications',
      icon: 'sms',
      description: 'Receive notifications via SMS',
      enabled: false
    },
    {
      type: 'Push Notifications',
      icon: 'notifications',
      description: 'Receive browser push notifications',
      enabled: true
    }
  ];

  notificationTypes: NotificationType[] = [
    { name: 'Low Stock Alerts', enabled: true },
    { name: 'Daily Sales Reports', enabled: true },
    { name: 'System Updates', enabled: false }
  ];

  // Security Settings
  securityForm!: FormGroup;
  twoFactorAuthEnabled = false;
  autoLogoutEnabled = true;
  loginNotificationsEnabled = true;

  // Tax Settings
  taxForm!: FormGroup;
  taxSettings = {
    vatRate: 16,
    kraPin: '',
    vatNumber: '',
    vatRegistered: true,
    withholding: false,
    autoTaxCalculation: true,
    taxFilingPeriod: 'Monthly'
  };

  // System Settings
  systemSettings = {
    darkMode: false,
    maintenanceMode: false,
    debugMode: false,
    logo: null as File | null
  };

  // Backup Settings
  backupSettings = {
    autoBackupEnabled: true,
    backupFrequency: 'Daily',
    retentionPeriod: '30 days'
  };

  // Theme colors
  themeColors = ['#1976d2', '#4caf50', '#9c27b0', '#ff9800'];
  selectedThemeColor = '#1976d2';
  itemsPerPage = 10;
  showTooltips = true;

  constructor(private fb: FormBuilder) {
    this.initializeForms();
  }

  ngOnInit(): void {
    this.loadSettings();
  }

  initializeForms(): void {
    // Company Form
    this.companyForm = this.fb.group({
      name: [this.companyInfo.name, [Validators.required]],
      email: [this.companyInfo.email, [Validators.required, Validators.email]],
      phone: [this.companyInfo.phone, [Validators.required]],
      address: [this.companyInfo.address]
    });

    // Security Form
    this.securityForm = this.fb.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]]
    });

    // Tax Form
    this.taxForm = this.fb.group({
      vatRate: [this.taxSettings.vatRate, [Validators.required, Validators.min(0), Validators.max(100)]],
      kraPin: [this.taxSettings.kraPin],
      vatNumber: [this.taxSettings.vatNumber]
    });
  }

  loadSettings(): void {
    // Load settings from localStorage or API
    const savedSettings = localStorage.getItem('appSettings');
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      this.defaultCurrency = settings.currency || this.defaultCurrency;
      this.timezone = settings.timezone || this.timezone;
      this.language = settings.language || this.language;
      this.dateFormat = settings.dateFormat || this.dateFormat;
    }
  }

  setActiveTab(tab: 'company' | 'notifications' | 'security' | 'tax' | 'system' | 'backup'): void {
    this.activeTab = tab;
  }

  // Company Tab Actions
  saveCompanyInfo(): void {
    if (this.companyForm.valid) {
      console.log('Saving company info:', this.companyForm.value);
      alert('Company information updated successfully!');
    }
  }

  // Notification Tab Actions
  toggleNotificationChannel(index: number): void {
    this.notificationChannels[index].enabled = !this.notificationChannels[index].enabled;
  }

  toggleNotificationType(index: number): void {
    this.notificationTypes[index].enabled = !this.notificationTypes[index].enabled;
  }

  // Security Tab Actions
  updatePassword(): void {
    if (this.securityForm.valid) {
      const passwords = this.securityForm.value;
      if (passwords.newPassword !== passwords.confirmPassword) {
        alert('Passwords do not match!');
        return;
      }
      console.log('Updating password');
      alert('Password updated successfully!');
      this.securityForm.reset();
    }
  }

  toggleTwoFactor(): void {
    this.twoFactorAuthEnabled = !this.twoFactorAuthEnabled;
  }

  toggleAutoLogout(): void {
    this.autoLogoutEnabled = !this.autoLogoutEnabled;
  }

  toggleLoginNotifications(): void {
    this.loginNotificationsEnabled = !this.loginNotificationsEnabled;
  }

  viewActiveSessions(): void {
    console.log('Viewing active sessions');
    alert('Showing active sessions...');
  }

  // Tax Tab Actions
  saveTaxSettings(): void {
    if (this.taxForm.valid) {
      console.log('Saving tax settings:', this.taxForm.value);
      alert('Tax settings updated successfully!');
    }
  }

  toggleVATRegistration(): void {
    this.taxSettings.vatRegistered = !this.taxSettings.vatRegistered;
  }

  toggleWithholding(): void {
    this.taxSettings.withholding = !this.taxSettings.withholding;
  }

  toggleAutoTaxCalculation(): void {
    this.taxSettings.autoTaxCalculation = !this.taxSettings.autoTaxCalculation;
  }

  // System Tab Actions
  toggleDarkMode(): void {
    this.systemSettings.darkMode = !this.systemSettings.darkMode;
  }

  toggleMaintenanceMode(): void {
    this.systemSettings.maintenanceMode = !this.systemSettings.maintenanceMode;
  }

  toggleDebugMode(): void {
    this.systemSettings.debugMode = !this.systemSettings.debugMode;
  }

  selectThemeColor(color: string): void {
    this.selectedThemeColor = color;
  }

  onLogoFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.systemSettings.logo = input.files[0];
    }
  }

  // Backup Tab Actions
  createBackupNow(): void {
    console.log('Creating backup...');
    alert('Backup in progress... This may take a few minutes.');
  }

  toggleAutoBackup(): void {
    this.backupSettings.autoBackupEnabled = !this.backupSettings.autoBackupEnabled;
  }

  onRestoreFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      console.log('Restoring from:', input.files[0].name);
      alert('Restore in progress... This may take a few minutes.');
    }
  }

  // General Actions
  saveChanges(): void {
    console.log('Saving all changes');
    alert('All changes saved successfully!');
  }

  resetChanges(): void {
    this.loadSettings();
    this.initializeForms();
    console.log('Changes reset to last saved state');
  }
}
