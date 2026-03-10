// ---- Report View Models ----

export interface ReportMetric {
  label: string;
  value: string | number;
  delta?: string;
  deltaType?: 'positive' | 'negative' | 'neutral';
}

export interface TopProduct {
  name: string;
  units: number;
  margin: number;
  revenue: number;
}

export interface ReportBranchPerformance {
  branch: string;
  orders: number;
  revenue: number;
  delta: string;
  deltaType: 'positive' | 'negative';
}

export interface InventoryMetric {
  label: string;
  value: number | string;
  status: 'healthy' | 'warning' | 'critical';
}

export interface FinancialStatement {
  label: string;
  value: number;
}

export interface CashFlowData {
  type: 'inflow' | 'outflow' | 'net';
  label: string;
  value: number;
}

export interface KeyRatio {
  label: string;
  value: string | number;
}

export interface StockMovement {
  title: string;
  description: string;
}

export interface ReportType {
  id: string;
  name: string;
  description: string;
  icon: string;
  features: string[];
}

export interface ReportBranch {
  id: string;
  name: string;
}
