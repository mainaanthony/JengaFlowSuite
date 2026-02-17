import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Customer } from './customer';
import { BaseRepository, EntityLogInfo } from '../../repository/base-repository';
import {
  GET_CUSTOMER,
  GET_CUSTOMERS,
  GET_ALL_CUSTOMERS,
  SEARCH_CUSTOMERS,
  ADD_CUSTOMER,
  UPDATE_CUSTOMER,
  DELETE_CUSTOMER,
} from './customer.queries';

/**
 * Customer Repository
 * Handles all customer-related data operations
 */
@Injectable({
  providedIn: 'root',
})
export class CustomerRepository extends BaseRepository<Customer> {
  constructor(protected override apollo: Apollo) {
    super(apollo);
  }

  override get(id: string): Observable<Customer> {
    return this.apollo
      .query<{ customers: Customer[] }>({
        query: GET_CUSTOMER,
        variables: { id: parseInt(id) },
      })
      .pipe(map((result) => result.data.customers[0]));
  }

  override getAll(): Observable<Customer[]> {
    return this.apollo
      .watchQuery<{ customers: { nodes: Customer[] } }>({
        query: GET_CUSTOMERS,
      })
      .valueChanges.pipe(map((result) => result.data.customers.nodes));
  }

  getAllCustomers(): Observable<Customer[]> {
    return this.apollo
      .watchQuery<{ customers: { nodes: Customer[] } }>({
        query: GET_ALL_CUSTOMERS,
      })
      .valueChanges.pipe(map((result) => result.data.customers.nodes));
  }

  searchCustomers(search: string): Observable<Customer[]> {
    return this.apollo
      .watchQuery<{ customers: { nodes: Customer[] } }>({
        query: SEARCH_CUSTOMERS,
        variables: { search },
      })
      .valueChanges.pipe(map((result) => result.data.customers.nodes));
  }

  override create(customer: Partial<Customer>, logInfo: EntityLogInfo): Observable<Partial<Customer>> {
    return this.apollo
      .mutate<{ addCustomer: Customer }>({
        mutation: ADD_CUSTOMER,
        variables: {
          input: {
            name: customer.name,
            phone: customer.phone,
            email: customer.email,
            address: customer.address,
            customerType: customer.customerType,
            isActive: customer.isActive ?? true,
          },
          logInfo,
        },
        refetchQueries: [{ query: GET_CUSTOMERS }],
      })
      .pipe(map((result) => result.data!.addCustomer));
  }

  override update(customer: Partial<Customer>, logInfo: EntityLogInfo): Observable<Customer> {
    return this.apollo
      .mutate<{ updateCustomer: Customer }>({
        mutation: UPDATE_CUSTOMER,
        variables: {
          input: {
            id: customer.id,
            name: customer.name,
            phone: customer.phone,
            email: customer.email,
            address: customer.address,
            customerType: customer.customerType,
            isActive: customer.isActive,
          },
          logInfo,
        },
        refetchQueries: [{ query: GET_CUSTOMERS }],
      })
      .pipe(map((result) => result.data!.updateCustomer));
  }

  override delete(id: string, logInfo: EntityLogInfo): Observable<boolean> {
    return this.apollo
      .mutate<{ deleteCustomer: boolean }>({
        mutation: DELETE_CUSTOMER,
        variables: {
          id: parseInt(id),
          logInfo,
        },
        refetchQueries: [{ query: GET_CUSTOMERS }],
      })
      .pipe(map((result) => result.data!.deleteCustomer));
  }
}
