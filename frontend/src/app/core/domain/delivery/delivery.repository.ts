import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Delivery } from './delivery';
import { BaseRepository, EntityLogInfo } from '../../repository/base-repository';
import { DeliveryStatus } from '../../enums/delivery-status';
import {
  FRAGMENT_DELIVERY,
  GET_DELIVERY,
  GET_DELIVERIES,
  GET_DELIVERIES_BY_DRIVER,
  GET_DELIVERIES_BY_STATUS,
  ADD_DELIVERY,
  UPDATE_DELIVERY,
  DELETE_DELIVERY,
} from './delivery.queries';

/**
 * Delivery Repository
 * Handles all delivery-related data operations
 */
@Injectable({
  providedIn: 'root',
})
export class DeliveryRepository extends BaseRepository<Delivery> {
  constructor(protected override apollo: Apollo) {
    super(apollo);
  }

  override get(id: string): Observable<Delivery> {
    return this.apollo
      .query<{ deliveries: Delivery[] }>({
        query: GET_DELIVERY,
        variables: { id: parseInt(id) },
      })
      .pipe(map((result) => result.data.deliveries[0]));
  }

  override getAll(): Observable<Delivery[]> {
    return this.apollo
      .watchQuery<{ deliveries: Delivery[] }>({
        query: GET_DELIVERIES,
      })
      .valueChanges.pipe(map((result) => result.data.deliveries));
  }

  getDeliveriesByDriver(driverId: number): Observable<Delivery[]> {
    return this.apollo
      .query<{ deliveries: Delivery[] }>({
        query: GET_DELIVERIES_BY_DRIVER,
        variables: { driverId },
      })
      .pipe(map((result) => result.data.deliveries));
  }

  getDeliveriesByStatus(status: DeliveryStatus): Observable<Delivery[]> {
    return this.apollo
      .query<{ deliveries: Delivery[] }>({
        query: GET_DELIVERIES_BY_STATUS,
        variables: { status },
      })
      .pipe(map((result) => result.data.deliveries));
  }

  override create(
    data: Partial<Delivery>,
    logInfo: EntityLogInfo
  ): Observable<Partial<Delivery>> {
    return this.apollo
      .mutate<{ addDelivery: Delivery }>({
        mutation: ADD_DELIVERY,
        variables: { input: data },
        refetchQueries: [{ query: GET_DELIVERIES }],
      })
      .pipe(
        map((result) => {
          if (result.data?.addDelivery) {
            return result.data.addDelivery;
          }
          throw new Error('Cannot create delivery.');
        })
      );
  }

  override update(
    delivery: Partial<Delivery>,
    logInfo: EntityLogInfo
  ): Observable<Partial<Delivery>> {
    return this.apollo
      .mutate<{ updateDelivery: Delivery }>({
        mutation: UPDATE_DELIVERY,
        variables: { input: delivery },
      })
      .pipe(
        map((result) => {
          if (result.data?.updateDelivery) {
            return result.data.updateDelivery;
          }
          throw new Error('Cannot update delivery.');
        })
      );
  }

  override delete(id: string, logInfo: EntityLogInfo): Observable<boolean> {
    return this.apollo
      .mutate<{ deleteDelivery: boolean }>({
        mutation: DELETE_DELIVERY,
        variables: { id: parseInt(id) },
        refetchQueries: [{ query: GET_DELIVERIES }],
      })
      .pipe(
        map((result) => {
          if (result.data?.deleteDelivery) {
            return result.data.deleteDelivery;
          }
          throw new Error('Cannot delete delivery.');
        })
      );
  }
}
