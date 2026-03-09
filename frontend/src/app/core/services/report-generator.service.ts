import { Injectable } from '@angular/core';

export interface ReportData {
  type: string;
  title: string;
  description?: string;
  timePeriod: string;
  branches: string[];
  format: string;
  groupBy?: string;
  sortBy?: string;
  includeExecutiveSummary?: boolean;
  includeChartsGraphs?: boolean;
  includeDetailedData?: boolean;
  generatedAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class ReportGeneratorService {

  generateAndDownload(reportData: ReportData): void {
    const format = (reportData.format || 'PDF').toUpperCase();

    switch (format) {
      case 'PDF':
        this.generatePDF(reportData);
        break;
      case 'CSV':
        this.generateCSV(reportData);
        break;
      case 'EXCEL':
        this.generateCSV(reportData); // CSV is Excel-compatible
        break;
      default:
        this.generatePDF(reportData);
    }
  }

  private generatePDF(data: ReportData): void {
    const reportTypeName = this.getReportTypeName(data.type);
    const generatedDate = new Date(data.generatedAt).toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>${data.title || reportTypeName}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Segoe UI', Arial, sans-serif; color: #333; padding: 40px; line-height: 1.6; }
          .report-header { border-bottom: 3px solid #1976d2; padding-bottom: 20px; margin-bottom: 30px; }
          .company-name { font-size: 28px; font-weight: 700; color: #1976d2; }
          .report-title { font-size: 22px; font-weight: 600; color: #333; margin-top: 8px; }
          .report-subtitle { font-size: 14px; color: #666; margin-top: 4px; }
          .meta-section { display: flex; gap: 40px; margin-bottom: 30px; padding: 16px 20px; background: #f5f7fa; border-radius: 8px; }
          .meta-item { }
          .meta-label { font-size: 11px; text-transform: uppercase; font-weight: 600; color: #888; letter-spacing: 0.5px; }
          .meta-value { font-size: 14px; font-weight: 500; color: #333; margin-top: 2px; }
          .section { margin-bottom: 28px; }
          .section-title { font-size: 16px; font-weight: 600; color: #1976d2; border-bottom: 1px solid #e0e0e0; padding-bottom: 8px; margin-bottom: 16px; }
          table { width: 100%; border-collapse: collapse; margin-top: 12px; }
          th { background: #1976d2; color: white; padding: 10px 14px; text-align: left; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; }
          td { padding: 10px 14px; border-bottom: 1px solid #eee; font-size: 13px; }
          tr:nth-child(even) { background: #f9f9f9; }
          .summary-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
          .summary-card { background: #f5f7fa; border-radius: 8px; padding: 16px 20px; text-align: center; }
          .summary-card .value { font-size: 24px; font-weight: 700; color: #1976d2; }
          .summary-card .label { font-size: 12px; color: #666; margin-top: 4px; }
          .footer { margin-top: 40px; padding-top: 16px; border-top: 1px solid #e0e0e0; font-size: 11px; color: #999; text-align: center; }
          .badge { display: inline-block; padding: 2px 10px; border-radius: 12px; font-size: 11px; font-weight: 600; }
          .badge-active { background: #e8f5e9; color: #2e7d32; }
          .watermark { position: fixed; bottom: 20px; right: 40px; font-size: 10px; color: #ccc; }
          @media print {
            body { padding: 20px; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="report-header">
          <div class="company-name">JengaFlow Suite</div>
          <div class="report-title">${data.title || reportTypeName}</div>
          <div class="report-subtitle">${data.description || 'Auto-generated report'}</div>
        </div>

        <div class="meta-section">
          <div class="meta-item">
            <div class="meta-label">Report Type</div>
            <div class="meta-value">${reportTypeName}</div>
          </div>
          <div class="meta-item">
            <div class="meta-label">Period</div>
            <div class="meta-value">${data.timePeriod}</div>
          </div>
          <div class="meta-item">
            <div class="meta-label">Generated</div>
            <div class="meta-value">${generatedDate}</div>
          </div>
          <div class="meta-item">
            <div class="meta-label">Format</div>
            <div class="meta-value">${data.format}</div>
          </div>
        </div>

        ${data.includeExecutiveSummary !== false ? this.getExecutiveSummaryHTML(data.type) : ''}

        ${data.includeDetailedData !== false ? this.getDetailedDataHTML(data.type) : ''}

        <div class="footer">
          <p>This report was generated by JengaFlow Suite on ${generatedDate}.</p>
          <p>Confidential - For internal use only.</p>
        </div>

        <div class="watermark">JengaFlow Suite Report</div>
      </body>
      </html>
    `;

    // Open print dialog which allows saving as PDF
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(html);
      printWindow.document.close();
      // Slight delay to ensure rendering completes
      setTimeout(() => {
        printWindow.print();
      }, 500);
    } else {
      // Fallback: download as HTML file
      this.downloadAsFile(html, `${data.title || 'report'}.html`, 'text/html');
    }
  }

  private generateCSV(data: ReportData): void {
    const reportTypeName = this.getReportTypeName(data.type);
    const rows = this.getSampleDataRows(data.type);

    let csv = `"${data.title || reportTypeName}"\n`;
    csv += `"Generated","${data.generatedAt}"\n`;
    csv += `"Period","${data.timePeriod}"\n\n`;

    if (rows.length > 0) {
      // Header row
      csv += rows[0].map((h: string) => `"${h}"`).join(',') + '\n';
      // Data rows
      for (let i = 1; i < rows.length; i++) {
        csv += rows[i].map((v: string) => `"${v}"`).join(',') + '\n';
      }
    }

    const filename = `${(data.title || 'report').replace(/[^a-zA-Z0-9]/g, '_')}.csv`;
    this.downloadAsFile(csv, filename, 'text/csv');
  }

  private downloadAsFile(content: string, filename: string, mimeType: string): void {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  private getReportTypeName(type: string): string {
    const names: Record<string, string> = {
      'sales': 'Sales Report',
      'inventory': 'Inventory Report',
      'procurement': 'Procurement Report',
      'financial': 'Financial Report',
      'operational': 'Operational Report',
      'customer': 'Customer Report'
    };
    return names[type] || 'General Report';
  }

  private getExecutiveSummaryHTML(type: string): string {
    const summaries: Record<string, { cards: { label: string; value: string }[] }> = {
      'sales': {
        cards: [
          { label: 'Total Revenue', value: 'KES 4,200,000' },
          { label: 'Units Sold', value: '15,234' },
          { label: 'Avg Order Value', value: 'KES 2,750' }
        ]
      },
      'inventory': {
        cards: [
          { label: 'Total Stock Value', value: 'KES 8,500,000' },
          { label: 'Low Stock Items', value: '23' },
          { label: 'Turnover Rate', value: '6.2x' }
        ]
      },
      'procurement': {
        cards: [
          { label: 'Total Orders', value: '156' },
          { label: 'Pending Deliveries', value: '12' },
          { label: 'Avg Lead Time', value: '5.2 days' }
        ]
      },
      'financial': {
        cards: [
          { label: 'Gross Profit', value: 'KES 1,800,000' },
          { label: 'Net Cash Flow', value: 'KES 1,700,000' },
          { label: 'Gross Margin', value: '42.8%' }
        ]
      },
      'operational': {
        cards: [
          { label: 'Deliveries Completed', value: '342' },
          { label: 'On-Time Rate', value: '94.5%' },
          { label: 'Active Branches', value: '4' }
        ]
      },
      'customer': {
        cards: [
          { label: 'Total Customers', value: '1,245' },
          { label: 'New This Month', value: '87' },
          { label: 'Retention Rate', value: '85%' }
        ]
      }
    };

    const summary = summaries[type] || summaries['sales'];

    return `
      <div class="section">
        <div class="section-title">Executive Summary</div>
        <div class="summary-grid">
          ${summary.cards.map(c => `
            <div class="summary-card">
              <div class="value">${c.value}</div>
              <div class="label">${c.label}</div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  private getDetailedDataHTML(type: string): string {
    const rows = this.getSampleDataRows(type);
    if (rows.length === 0) return '';

    const headers = rows[0];
    const dataRows = rows.slice(1);

    return `
      <div class="section">
        <div class="section-title">Detailed Data</div>
        <table>
          <thead>
            <tr>${headers.map((h: string) => `<th>${h}</th>`).join('')}</tr>
          </thead>
          <tbody>
            ${dataRows.map((row: string[]) => `
              <tr>${row.map((cell: string) => `<td>${cell}</td>`).join('')}</tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  private getSampleDataRows(type: string): string[][] {
    const data: Record<string, string[][]> = {
      'sales': [
        ['Product', 'Units Sold', 'Revenue (KES)', 'Margin %'],
        ['25mm PVC Pipes', '1,250', '156,000', '35%'],
        ['Wood Screws 2in', '980', '98,000', '28%'],
        ['Paint Brushes Set', '750', '112,500', '45%'],
        ['Cement Bags', '650', '325,000', '18%'],
        ['Electrical Cables', '520', '208,000', '32%'],
        ['Roofing Sheets', '380', '475,000', '22%'],
        ['Plumbing Fixtures', '310', '155,000', '38%'],
        ['Power Tools', '280', '420,000', '25%'],
        ['Sand & Gravel', '1,850', '185,000', '15%'],
        ['Steel Bars', '420', '630,000', '20%']
      ],
      'inventory': [
        ['Product', 'Category', 'In Stock', 'Min Level', 'Status'],
        ['25mm PVC Pipes', 'Plumbing', '450', '100', 'In Stock'],
        ['Wood Screws 2in', 'Hardware', '1,200', '500', 'In Stock'],
        ['Ceramic Tiles', 'Flooring', '85', '100', 'Low Stock'],
        ['Paint - White', 'Paints', '0', '50', 'Out of Stock'],
        ['Cement Bags', 'Building', '320', '200', 'In Stock'],
        ['Roofing Nails', 'Hardware', '45', '100', 'Low Stock'],
        ['Electrical Wire', 'Electrical', '0', '75', 'Out of Stock'],
        ['Sand Bags', 'Building', '580', '200', 'In Stock'],
        ['Steel Bars 12mm', 'Steel', '150', '100', 'In Stock'],
        ['Glass Panels', 'Glass', '28', '50', 'Low Stock']
      ],
      'procurement': [
        ['PO Number', 'Supplier', 'Items', 'Total (KES)', 'Status'],
        ['PO-2026-001', 'Kenya Steel Ltd', '5', '850,000', 'Delivered'],
        ['PO-2026-002', 'Bamburi Cement', '3', '320,000', 'In Transit'],
        ['PO-2026-003', 'Paint House Ltd', '8', '125,000', 'Pending'],
        ['PO-2026-004', 'Pipe Masters', '4', '240,000', 'Delivered'],
        ['PO-2026-005', 'Hardware World', '12', '95,000', 'Processing'],
        ['PO-2026-006', 'Timber Kenya', '6', '180,000', 'Delivered'],
        ['PO-2026-007', 'Electric Co.', '3', '75,000', 'Pending'],
        ['PO-2026-008', 'Glass Works Ltd', '2', '150,000', 'In Transit']
      ],
      'financial': [
        ['Category', 'Amount (KES)', 'Percentage', 'Trend'],
        ['Revenue', '4,200,000', '100%', '+12.5%'],
        ['Cost of Goods Sold', '2,400,000', '57.1%', '+8.3%'],
        ['Gross Profit', '1,800,000', '42.9%', '+18.2%'],
        ['Operating Expenses', '650,000', '15.5%', '+5.1%'],
        ['Net Income', '1,150,000', '27.4%', '+24.6%'],
        ['Tax Provisions', '345,000', '8.2%', '+24.6%'],
        ['Retained Earnings', '805,000', '19.2%', '+24.6%']
      ],
      'operational': [
        ['Branch', 'Orders', 'Revenue (KES)', 'Staff', 'Efficiency'],
        ['Main Branch', '456', '1,800,000', '12', '95%'],
        ['Westlands', '312', '1,200,000', '8', '92%'],
        ['Eastleigh', '245', '900,000', '6', '88%'],
        ['Industrial Area', '156', '500,000', '5', '85%']
      ],
      'customer': [
        ['Customer', 'Type', 'Purchases', 'Revenue (KES)', 'Status'],
        ['ABC Construction', 'Corporate', '45', '2,250,000', 'Active'],
        ['Mwangi & Sons', 'Corporate', '38', '1,140,000', 'Active'],
        ['Jane Doe', 'Individual', '12', '84,000', 'Active'],
        ['Nairobi Builders', 'Corporate', '56', '3,360,000', 'Active'],
        ['Kamau Hardware', 'Reseller', '28', '420,000', 'Active'],
        ['City Council', 'Government', '15', '1,500,000', 'Active'],
        ['John Smith', 'Individual', '8', '56,000', 'Inactive'],
        ['Prime Contractors', 'Corporate', '32', '1,920,000', 'Active']
      ]
    };

    return data[type] || data['sales'];
  }
}
