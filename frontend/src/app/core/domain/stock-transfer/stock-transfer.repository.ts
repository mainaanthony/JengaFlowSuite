import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { StockTransfer } from './stock-transfer';
import { BaseRepository, EntityLogInfo } from '../../repository/base-repository';
import { StockTransferStatus } from '../../enums/stock-transfer-status';
import {
  FRAGMENT_STOCK_TRANSFER,
  GET_STOCK_TRANSFER,
  GET_STOCK_TRANSFERS,
  GET_STOCK_TRANSFERS_BY_BRANCH,
  GET_STOCK_TRANSFERS_BY_STATUS,
  ADD_STOCK_TRANSFER,
  UPDATE_STOCK_TRANSFER,
  DELETE_STOCK_TRANSFER,
} from './stock-transfer.queries';

/**
 * Stock Transfer Repository
 * Handles all stock transfer-related data operations
 */
@Injectable({
  providedIn: 'root',
})
export class StockTransferRepository extends BaseRepository<StockTransfer> {
  constructor(protected override apollo: Apollo) {
    super(apollo);
  }

  override get(id: string): Observable<StockTransfer> {
    return this.apollo
      .query<{ stockTransfers: StockTransfer[] }>({
        query: GET_STOCK_TRANSFER,
        variables: { id: parseInt(id) },
      })
      .pipe(map((result) => result.data.stockTransfers[0]));
  }

  override getAll(): Observable<StockTransfer[]> {
    return this.apollo
      .watchQuery<{ stockTransfers: StockTransfer[] }>({
        query: GET_STOCK_TRANSFERS,
      })
      .valueChanges.pipe(map((result) => result.data.stockTransfers));
  }

  getStockTransfersByBranch(branchId: number): Observable<StockTransfer[]> {
    return this.apollo
      .query<{ stockTransfers: StockTransfer[] }>({
        query: GET_STOCK_TRANSFERS_BY_BRANCH,
        variables: { branchId },
      })
      .pipe(map((result) => result.data.stockTransfers));
  }

  getStockTransfersByStatus(status: StockTransferStatus): Observable<StockTransfer[]> {
    return this.apollo
      .query<{ stockTransfers: StockTransfer[] }>({
        query: GET_STOCK_TRANSFERS_BY_STATUS,
        variables: { status },
      })
      .pipe(map((result) => result.data.stockTransfers));
  }

  override create(
    data: Partial<StockTransfer>,
    logInfo: EntityLogInfo
  ): Observable<Partial<StockTransfer>> {
    return this.apollo
      .mutate<{ addStockTransfer: StockTransfer }>({
        mutation: ADD_STOCK_TRANSFER,
        variables: { input: data },
        refetchQueries: [{ query: GET_STOCK_TRANSFERS }],
      })
      .pipe(
        map((result) => {
          if (result.data?.addStockTransfer) {
            return result.data.addStockTransfer;
          }
          throw new Error('Cannot create stock transfer.');
        })
      );
  }

  override update(
    stockTransfer: Partial<StockTransfer>,
    logInfo: EntityLogInfo
  ): Observable<Partial<StockTransfer>> {
    return this.apollo
      .mutate<{ updateStockTransfer: StockTransfer }>({
        mutation: UPDATE_STOCK_TRANSFER,
        variables: { input: stockTransfer },
      })
      .pipe(
        map((result) => {
          if (result.data?.updateStockTransfer) {
            return result.data.updateStockTransfer;
          }
          throw new Error('Cannot update stock transfer.');
        })
      );
  }

  override delete(id: string, logInfo: EntityLogInfo): Observable<boolean> {
    return this.apollo
      .mutate<{ deleteStockTransfer: boolean }>({
        mutation: DELETE_STOCK_TRANSFER,
        variables: { id: parseInt(id) },
        refetchQueries: [{ query: GET_STOCK_TRANSFERS }],
      })
      .pipe(
        map((result) => {
          if (result.data?.deleteStockTransfer) {
            return result.data.deleteStockTransfer;
          }
          throw new Error('Cannot delete stock transfer.');
        })
      );
  }
}
