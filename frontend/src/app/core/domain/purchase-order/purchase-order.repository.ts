import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { PurchaseOrder } from './purchase-order';
import { BaseRepository, EntityLogInfo } from '../../repository/base-repository';
import {
  GET_PURCHASE_ORDER,
  GET_PURCHASE_ORDERS,
  ADD_PURCHASE_ORDER,
  UPDATE_PURCHASE_ORDER,
  DELETE_PURCHASE_ORDER,
} from './purchase-order.queries';

console.log('[PurchaseOrderRepository] Module loading...');
console.log('[PurchaseOrderRepository] GET_PURCHASE_ORDERS query:', GET_PURCHASE_ORDERS?.loc?.source?.body?.substring(0, 100));

/**
 * Purchase Order Repository
 * Handles all purchase order-related data operations
 */
@Injectable({
  providedIn: 'root',
})
export class PurchaseOrderRepository extends BaseRepository<PurchaseOrder> {
  constructor(protected override apollo: Apollo) {
    super(apollo);
  }

  /**
   * Get purchase order by ID
   */
  override get(id: string): Observable<PurchaseOrder> {
    return this.apollo
      .query<{ purchaseOrders: PurchaseOrder[] }>({
        query: GET_PURCHASE_ORDER,
        variables: { id: parseInt(id) },
      })
      .pipe(map((result) => result.data.purchaseOrders[0]));
  }

  /**
   * Get all purchase orders
   */
  override getAll(): Observable<PurchaseOrder[]> {
    return this.apollo
      .watchQuery<{ purchaseOrders: { nodes: PurchaseOrder[] } }>({
        query: GET_PURCHASE_ORDERS,
      })
      .valueChanges.pipe(map((result) => result.data.purchaseOrders.nodes));
  }

  /**
   * Create a new purchase order
   */
  override create(
    data: Partial<PurchaseOrder>,
    logInfo: EntityLogInfo
  ): Observable<Partial<PurchaseOrder>> {
    return this.apollo
      .mutate<{ addPurchaseOrder: PurchaseOrder }>({
        mutation: ADD_PURCHASE_ORDER,
        variables: { 
          input: data,
          logInfo: {
            changedBy: logInfo.userId || 'system',
            changeTrigger: logInfo.category || 'UI',
            changeReason: logInfo.description
          }
        },
        refetchQueries: [{ query: GET_PURCHASE_ORDERS }],
      })
      .pipe(
        map((result) => {
          if (result.data?.addPurchaseOrder) {
            return result.data.addPurchaseOrder;
          }
          throw new Error('Cannot create purchase order.');
        })
      );
  }

  /**
   * Update an existing purchase order
   */
  override update(
    purchaseOrder: Partial<PurchaseOrder>,
    logInfo: EntityLogInfo
  ): Observable<Partial<PurchaseOrder>> {
    return this.apollo
      .mutate<{ updatePurchaseOrder: PurchaseOrder }>({
        mutation: UPDATE_PURCHASE_ORDER,
        variables: { input: purchaseOrder },
      })
      .pipe(
        map((result) => {
          if (result.data?.updatePurchaseOrder) {
            return result.data.updatePurchaseOrder;
          }
          throw new Error('Cannot update purchase order.');
        })
      );
  }

  /**
   * Delete a purchase order
   */
  override delete(id: string, logInfo: EntityLogInfo): Observable<boolean> {
    return this.apollo
      .mutate<{ deletePurchaseOrder: boolean }>({
        mutation: DELETE_PURCHASE_ORDER,
        variables: { id: parseInt(id) },
        refetchQueries: [{ query: GET_PURCHASE_ORDERS }],
      })
      .pipe(
        map((result) => {
          if (result.data?.deletePurchaseOrder) {
            return result.data.deletePurchaseOrder;
          }
          throw new Error('Cannot delete purchase order.');
        })
      );
  }
}
