import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Driver } from './driver';
import { BaseRepository, EntityLogInfo } from '../../repository/base-repository';
import {
  FRAGMENT_DRIVER,
  GET_DRIVER,
  GET_DRIVERS,
  GET_AVAILABLE_DRIVERS,
  ADD_DRIVER,
  UPDATE_DRIVER,
  DELETE_DRIVER,
} from './driver.queries';

/**
 * Driver Repository
 * Handles all driver-related data operations
 */
@Injectable({
  providedIn: 'root',
})
export class DriverRepository extends BaseRepository<Driver> {
  constructor(protected override apollo: Apollo) {
    super(apollo);
  }

  override get(id: string): Observable<Driver> {
    return this.apollo
      .query<{ drivers: Driver[] }>({
        query: GET_DRIVER,
        variables: { id: parseInt(id) },
      })
      .pipe(map((result) => result.data.drivers[0]));
  }

  override getAll(): Observable<Driver[]> {
    return this.apollo
      .watchQuery<{ drivers: { nodes: Driver[] } }>({
        query: GET_DRIVERS,
      })
      .valueChanges.pipe(map((result) => result.data.drivers.nodes));
  }

  getAvailableDrivers(): Observable<Driver[]> {
    return this.apollo
      .query<{ drivers: { nodes: Driver[] } }>({
        query: GET_AVAILABLE_DRIVERS,
      })
      .pipe(map((result) => result.data.drivers.nodes));
  }

  override create(
    data: Partial<Driver>,
    logInfo: EntityLogInfo
  ): Observable<Partial<Driver>> {
    return this.apollo
      .mutate<{ addDriver: Driver }>({
        mutation: ADD_DRIVER,
        variables: { input: { ...data, createdBy: logInfo.userId } },
        refetchQueries: [{ query: GET_DRIVERS }],
      })
      .pipe(
        map((result) => {
          if (result.data?.addDriver) {
            return result.data.addDriver;
          }
          throw new Error('Cannot create driver.');
        })
      );
  }

  override update(
    driver: Partial<Driver>,
    logInfo: EntityLogInfo
  ): Observable<Partial<Driver>> {
    return this.apollo
      .mutate<{ updateDriver: Driver }>({
        mutation: UPDATE_DRIVER,
        variables: { input: { ...driver, updatedBy: logInfo.userId } },
      })
      .pipe(
        map((result) => {
          if (result.data?.updateDriver) {
            return result.data.updateDriver;
          }
          throw new Error('Cannot update driver.');
        })
      );
  }

  override delete(id: string, logInfo: EntityLogInfo): Observable<boolean> {
    return this.apollo
      .mutate<{ deleteDriver: boolean }>({
        mutation: DELETE_DRIVER,
        variables: { id: parseInt(id) },
        refetchQueries: [{ query: GET_DRIVERS }],
      })
      .pipe(
        map((result) => {
          if (result.data?.deleteDriver) {
            return result.data.deleteDriver;
          }
          throw new Error('Cannot delete driver.');
        })
      );
  }
}
