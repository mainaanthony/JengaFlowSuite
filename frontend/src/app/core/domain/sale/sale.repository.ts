import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Sale } from './sale';
import { BaseRepository, EntityLogInfo } from '../../repository/base-repository';
import {
  FRAGMENT_SALE,
  GET_SALE,
  GET_SALES,
  GET_SALES_BY_BRANCH,
  GET_SALES_BY_CUSTOMER,
  GET_SALES_BY_DATE_RANGE,
  ADD_SALE,
  UPDATE_SALE,
  DELETE_SALE,
} from './sale.queries';

/**
 * Sale Repository
 * Handles all sale-related data operations
 */
@Injectable({
  providedIn: 'root',
})
export class SaleRepository extends BaseRepository<Sale> {
  constructor(protected override apollo: Apollo) {
    super(apollo);
  }

  /**
   * Get sale by ID
   */
  override get(id: string): Observable<Sale> {
    return this.apollo
      .query<{ sales: Sale[] }>({
        query: GET_SALE,
        variables: { id: parseInt(id) },
      })
      .pipe(map((result) => result.data.sales[0]));
  }

  /**
   * Get all sales
   */
  override getAll(): Observable<Sale[]> {
    return this.apollo
      .watchQuery<{ sales: Sale[] }>({
        query: GET_SALES,
      })
      .valueChanges.pipe(map((result) => result.data.sales));
  }

  /**
   * Get sales by branch
   */
  getSalesByBranch(branchId: number): Observable<Sale[]> {
    return this.apollo
      .query<{ sales: Sale[] }>({
        query: GET_SALES_BY_BRANCH,
        variables: { branchId },
      })
      .pipe(map((result) => result.data.sales));
  }

  /**
   * Get sales by customer
   */
  getSalesByCustomer(customerId: number): Observable<Sale[]> {
    return this.apollo
      .query<{ sales: Sale[] }>({
        query: GET_SALES_BY_CUSTOMER,
        variables: { customerId },
      })
      .pipe(map((result) => result.data.sales));
  }

  /**
   * Get sales by date range
   */
  getSalesByDateRange(startDate: Date, endDate: Date): Observable<Sale[]> {
    return this.apollo
      .query<{ sales: Sale[] }>({
        query: GET_SALES_BY_DATE_RANGE,
        variables: { startDate, endDate },
      })
      .pipe(map((result) => result.data.sales));
  }

  /**
   * Create a new sale
   */
  override create(
    data: Partial<Sale>,
    logInfo: EntityLogInfo
  ): Observable<Partial<Sale>> {
    return this.apollo
      .mutate<{ addSale: Sale }>({
        mutation: ADD_SALE,
        variables: { 
          input: data,
          logInfo: {
            changedBy: logInfo.userId || 'system',
            changeTrigger: logInfo.category || 'UI',
            changeReason: logInfo.description
          }
        },
        refetchQueries: [{ query: GET_SALES }],
      })
      .pipe(
        map((result) => {
          if (result.data?.addSale) {
            return result.data.addSale;
          }
          throw new Error('Cannot create sale.');
        })
      );
  }

  /**
   * Update an existing sale
   */
  override update(
    sale: Partial<Sale>,
    logInfo: EntityLogInfo
  ): Observable<Partial<Sale>> {
    return this.apollo
      .mutate<{ updateSale: Sale }>({
        mutation: UPDATE_SALE,
        variables: { input: { ...sale, updatedBy: logInfo.userId } },
      })
      .pipe(
        map((result) => {
          if (result.data?.updateSale) {
            return result.data.updateSale;
          }
          throw new Error('Cannot update sale.');
        })
      );
  }

  /**
   * Delete a sale
   */
  override delete(id: string, logInfo: EntityLogInfo): Observable<boolean> {
    return this.apollo
      .mutate<{ deleteSale: boolean }>({
        mutation: DELETE_SALE,
        variables: { id: parseInt(id) },
        refetchQueries: [{ query: GET_SALES }],
      })
      .pipe(
        map((result) => {
          if (result.data?.deleteSale) {
            return result.data.deleteSale;
          }
          throw new Error('Cannot delete sale.');
        })
      );
  }
}
