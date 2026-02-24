import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TaxReturn } from './tax-return';
import { BaseRepository, EntityLogInfo } from '../../repository/base-repository';
import {
  GET_TAX_RETURN,
  GET_TAX_RETURNS,
  ADD_TAX_RETURN,
  UPDATE_TAX_RETURN,
  DELETE_TAX_RETURN,
} from './tax-return.queries';

/**
 * Tax Return Repository
 * Handles all tax return-related data operations
 */
@Injectable({
  providedIn: 'root',
})
export class TaxReturnRepository extends BaseRepository<TaxReturn> {
  constructor(protected override apollo: Apollo) {
    super(apollo);
  }

  /**
   * Get tax return by ID
   */
  override get(id: string): Observable<TaxReturn> {
    return this.apollo
      .query<{ taxReturns: TaxReturn[] }>({
        query: GET_TAX_RETURN,
        variables: { id: parseInt(id) },
      })
      .pipe(map((result) => result.data.taxReturns[0]));
  }

  /**
   * Get all tax returns
   */
  override getAll(): Observable<TaxReturn[]> {
    return this.apollo
      .watchQuery<{ taxReturns: { nodes: TaxReturn[] } }>({
        query: GET_TAX_RETURNS,
      })
      .valueChanges.pipe(map((result) => result.data.taxReturns.nodes));
  }

  /**
   * Create a new tax return
   */
  override create(
    data: Partial<TaxReturn>,
    logInfo: EntityLogInfo
  ): Observable<Partial<TaxReturn>> {
    return this.apollo
      .mutate<{ addTaxReturn: TaxReturn }>({
        mutation: ADD_TAX_RETURN,
        variables: { input: data },
        refetchQueries: [{ query: GET_TAX_RETURNS }],
      })
      .pipe(
        map((result) => {
          if (result.data?.addTaxReturn) {
            return result.data.addTaxReturn;
          }
          throw new Error('Cannot create tax return.');
        })
      );
  }

  /**
   * Update an existing tax return
   */
  override update(
    taxReturn: Partial<TaxReturn>,
    logInfo: EntityLogInfo
  ): Observable<Partial<TaxReturn>> {
    return this.apollo
      .mutate<{ updateTaxReturn: TaxReturn }>({
        mutation: UPDATE_TAX_RETURN,
        variables: { input: taxReturn },
      })
      .pipe(
        map((result) => {
          if (result.data?.updateTaxReturn) {
            return result.data.updateTaxReturn;
          }
          throw new Error('Cannot update tax return.');
        })
      );
  }

  /**
   * Delete a tax return
   */
  override delete(id: string, logInfo: EntityLogInfo): Observable<boolean> {
    return this.apollo
      .mutate<{ deleteTaxReturn: boolean }>({
        mutation: DELETE_TAX_RETURN,
        variables: { id: parseInt(id) },
        refetchQueries: [{ query: GET_TAX_RETURNS }],
      })
      .pipe(
        map((result) => {
          if (result.data?.deleteTaxReturn) {
            return result.data.deleteTaxReturn;
          }
          throw new Error('Cannot delete tax return.');
        })
      );
  }
}
