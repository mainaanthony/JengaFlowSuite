console.log('[domain.barrel] === LOADING DOMAIN BARREL ===');

// Domain Exports
console.log('[domain.barrel] Loading user.barrel...');
export * from './user/user.barrel';
console.log('[domain.barrel] Loading role.barrel...');
export * from './role/role.barrel';
console.log('[domain.barrel] Loading branch.barrel...');
export * from './branch/branch.barrel';
console.log('[domain.barrel] Loading product.barrel...');
export * from './product/product.barrel';
console.log('[domain.barrel] Loading category.barrel...');
export * from './category/category.barrel';
console.log('[domain.barrel] Loading sale.barrel...');
export * from './sale/sale.barrel';
console.log('[domain.barrel] Loading customer.barrel...');
export * from './customer/customer.barrel';
console.log('[domain.barrel] Loading supplier.barrel...');
export * from './supplier/supplier.barrel';
console.log('[domain.barrel] Loading driver.barrel...');
export * from './driver/driver.barrel';
console.log('[domain.barrel] Loading delivery.barrel...');
export * from './delivery/delivery.barrel';
console.log('[domain.barrel] Loading stock-transfer.barrel...');
export * from './stock-transfer/stock-transfer.barrel';
console.log('[domain.barrel] Loading inventory...');
export * from './inventory/inventory';
console.log('[domain.barrel] Loading purchase-order.barrel...');
export * from './purchase-order/purchase-order.barrel';
console.log('[domain.barrel] Loading goods-received-note.barrel...');
export * from './goods-received-note/goods-received-note.barrel';
console.log('[domain.barrel] Loading tax-return.barrel...');
export * from './tax-return/tax-return.barrel';
console.log('[domain.barrel] === ALL BARRELS LOADED ===');

// Repository Exports
export * from '../repository/base-repository';

// Enum Exports
export * from '../enums/enums.barrel';

// Service Exports
export * from '../service/session-storage/session-storage.service';
