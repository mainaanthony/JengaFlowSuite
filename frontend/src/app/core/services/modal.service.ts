import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { ComponentType } from '@angular/cdk/portal';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  constructor(private dialog: MatDialog) {}

  /**
   * Opens a modal with lazy loading support
   * @param modalName - The name of the modal to open
   * @param config - Optional dialog configuration
   * @returns Promise<MatDialogRef> - Reference to the opened dialog
   */
  async openModal<T = any>(
    modalName: string, 
    config?: MatDialogConfig
  ): Promise<MatDialogRef<any, T>> {
    const defaultConfig: MatDialogConfig = {
      disableClose: false,
      panelClass: 'custom-modal-container',
      ...config
    };

    let component: ComponentType<any>;

    // Lazy load the modal component based on name
    switch (modalName) {
      case 'add-customer':
        const addCustomer = await import('../../sales/add-customer-modal/add-customer-modal.component');
        component = addCustomer.AddCustomerModalComponent;
        defaultConfig.width = defaultConfig.width || '900px';
        defaultConfig.maxWidth = defaultConfig.maxWidth || '95vw';
        break;

      case 'new-sale':
        const newSale = await import('../../sales/new-sale-modal/new-sale-modal.component');
        component = newSale.NewSaleModalComponent;
        defaultConfig.width = defaultConfig.width || '1200px';
        defaultConfig.maxWidth = defaultConfig.maxWidth || '98vw';
        break;

      case 'add-supplier':
        const addSupplier = await import('../../procurement/add-supplier-modal/add-supplier-modal.component');
        component = addSupplier.AddSupplierModalComponent;
        defaultConfig.width = defaultConfig.width || '800px';
        break;

      case 'create-po':
        const createPO = await import('../../procurement/create-po-modal/create-po-modal.component');
        component = createPO.CreatePOModalComponent;
        defaultConfig.width = defaultConfig.width || '1000px';
        break;

      case 'create-grn':
        const createGRN = await import('../../procurement/create-grn-modal/create-grn-modal.component');
        component = createGRN.CreateGrnModalComponent;
        defaultConfig.width = defaultConfig.width || '1200px';
        defaultConfig.maxWidth = defaultConfig.maxWidth || '95vw';
        break;

      case 'add-driver':
        const addDriver = await import('../../delivery/add-driver-modal/add-driver-modal.component');
        component = addDriver.AddDriverModalComponent;
        defaultConfig.width = defaultConfig.width || '700px';
        break;

      case 'schedule-delivery':
        const scheduleDelivery = await import('../../delivery/schedule-delivery-modal/schedule-delivery-modal.component');
        component = scheduleDelivery.ScheduleDeliveryModalComponent;
        defaultConfig.width = defaultConfig.width || '900px';
        break;

      case 'add-user':
        const addUser = await import('../../users/add-user-modal/add-user-modal.component');
        component = addUser.AddUserModalComponent;
        defaultConfig.width = defaultConfig.width || '700px';
        break;

      case 'manage-roles':
        const manageRoles = await import('../../users/manage-roles-modal/manage-roles-modal.component');
        component = manageRoles.ManageRolesModalComponent;
        defaultConfig.width = defaultConfig.width || '800px';
        break;

      case 'add-branch':
        const addBranch = await import('../../branches/add-branch-modal/add-branch-modal.component');
        component = addBranch.AddBranchModalComponent;
        defaultConfig.width = defaultConfig.width || '700px';
        break;

      case 'stock-transfer':
        const stockTransfer = await import('../../branches/stock-transfer-modal/stock-transfer-modal.component');
        component = stockTransfer.StockTransferModalComponent;
        defaultConfig.width = defaultConfig.width || '1000px';
        break;

      default:
        throw new Error(`Unknown modal: ${modalName}`);
    }

    return this.dialog.open(component, defaultConfig);
  }

  /**
   * Close all open dialogs
   */
  closeAll(): void {
    this.dialog.closeAll();
  }
}
