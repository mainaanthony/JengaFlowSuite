import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Supplier } from './supplier';
import { BaseRepository, EntityLogInfo } from '../../repository/base-repository';
import {
  FRAGMENT_SUPPLIER,
  GET_SUPPLIER,
  GET_SUPPLIERS,
  GET_ALL_SUPPLIERS,
  SEARCH_SUPPLIERS,
  ADD_SUPPLIER,
  UPDATE_SUPPLIER,
  DELETE_SUPPLIER,
} from './supplier.queries';

/**
 * Supplier Repository
 * Handles all supplier-related data operations
 */
@Injectable({
  providedIn: 'root',
})
export class SupplierRepository extends BaseRepository<Supplier> {
  constructor(protected override apollo: Apollo) {
    super(apollo);
  }

  override get(id: string): Observable<Supplier> {
    return this.apollo
      .query<{ suppliers: { nodes: Supplier[] } }>({
        query: GET_SUPPLIER,
        variables: { id: parseInt(id) },
      })
      .pipe(map((result) => result.data.suppliers.nodes[0]));
  }

  override getAll(): Observable<Supplier[]> {
    return this.apollo
      .watchQuery<{ suppliers: { nodes: Supplier[] } }>({
        query: GET_SUPPLIERS,
      })
      .valueChanges.pipe(map((result) => result.data.suppliers.nodes));
  }

  getAllSuppliers(): Observable<Supplier[]> {
    return this.apollo
      .watchQuery<{ suppliers: { nodes: Supplier[] } }>({
        query: GET_ALL_SUPPLIERS,
      })
      .valueChanges.pipe(map((result) => result.data.suppliers.nodes));
  }

  searchSuppliers(search: string): Observable<Supplier[]> {
    return this.apollo
      .query<{ suppliers: { nodes: Supplier[] } }>({
        query: SEARCH_SUPPLIERS,
        variables: { search },
      })
      .pipe(map((result) => result.data.suppliers.nodes));
  }

  override create(
    data: Partial<Supplier>,
    logInfo: EntityLogInfo
  ): Observable<Partial<Supplier>> {
    return this.apollo
      .mutate<{ addSupplier: Supplier }>({
        mutation: ADD_SUPPLIER,
        variables: { input: { ...data, createdBy: logInfo.userId } },
        refetchQueries: [{ query: GET_SUPPLIERS }],
      })
      .pipe(
        map((result) => {
          if (result.data?.addSupplier) {
            return result.data.addSupplier;
          }
          throw new Error('Cannot create supplier.');
        })
      );
  }

  override update(
    supplier: Partial<Supplier>,
    logInfo: EntityLogInfo
  ): Observable<Partial<Supplier>> {
    return this.apollo
      .mutate<{ updateSupplier: Supplier }>({
        mutation: UPDATE_SUPPLIER,
        variables: { input: { ...supplier, updatedBy: logInfo.userId } },
      })
      .pipe(
        map((result) => {
          if (result.data?.updateSupplier) {
            return result.data.updateSupplier;
          }
          throw new Error('Cannot update supplier.');
        })
      );
  }

  override delete(id: string, logInfo: EntityLogInfo): Observable<boolean> {
    return this.apollo
      .mutate<{ deleteSupplier: boolean }>({
        mutation: DELETE_SUPPLIER,
        variables: { id: parseInt(id) },
        refetchQueries: [{ query: GET_SUPPLIERS }],
      })
      .pipe(
        map((result) => {
          if (result.data?.deleteSupplier) {
            return result.data.deleteSupplier;
          }
          throw new Error('Cannot delete supplier.');
        })
      );
  }
}
