import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Role } from './role';
import { BaseRepository, EntityLogInfo } from '../../repository/base-repository';
import {
  FRAGMENT_ROLE,
  GET_ROLE,
  GET_ROLES,
  ADD_ROLE,
  UPDATE_ROLE,
  DELETE_ROLE,
} from './role.queries';

/**
 * Role Repository
 * Handles all role-related data operations
 */
@Injectable({
  providedIn: 'root',
})
export class RoleRepository extends BaseRepository<Role> {
  constructor(protected override apollo: Apollo) {
    super(apollo);
  }

  /**
   * Get role by ID
   */
  override get(id: string): Observable<Role> {
    return this.apollo
      .query<{ roles: Role[] }>({
        query: GET_ROLE,
        variables: { id: parseInt(id) },
      })
      .pipe(map((result) => result.data.roles[0]));
  }

  /**
   * Get all roles
   */
  override getAll(): Observable<Role[]> {
    return this.apollo
      .watchQuery<{ roles: { nodes: Role[] } }>({
        query: GET_ROLES,
      })
      .valueChanges.pipe(map((result) => result.data.roles.nodes));
  }

  /**
   * Create a new role
   */
  override create(
    data: Partial<Role>,
    logInfo: EntityLogInfo
  ): Observable<Partial<Role>> {
    return this.apollo
      .mutate<{ addRole: Role }>({
        mutation: ADD_ROLE,
        variables: { input: { ...data, createdBy: logInfo.userId } },
        refetchQueries: [{ query: GET_ROLES }],
      })
      .pipe(
        map((result) => {
          if (result.data?.addRole) {
            return result.data.addRole;
          }
          throw new Error('Cannot create role.');
        })
      );
  }

  /**
   * Update an existing role
   */
  override update(
    role: Partial<Role>,
    logInfo: EntityLogInfo
  ): Observable<Partial<Role>> {
    return this.apollo
      .mutate<{ updateRole: Role }>({
        mutation: UPDATE_ROLE,
        variables: { input: { ...role, updatedBy: logInfo.userId } },
      })
      .pipe(
        map((result) => {
          if (result.data?.updateRole) {
            return result.data.updateRole;
          }
          throw new Error('Cannot update role.');
        })
      );
  }

  /**
   * Delete a role
   */
  override delete(id: string, logInfo: EntityLogInfo): Observable<boolean> {
    return this.apollo
      .mutate<{ deleteRole: boolean }>({
        mutation: DELETE_ROLE,
        variables: { id: parseInt(id) },
        refetchQueries: [{ query: GET_ROLES }],
      })
      .pipe(
        map((result) => {
          if (result.data?.deleteRole) {
            return result.data.deleteRole;
          }
          throw new Error('Cannot delete role.');
        })
      );
  }
}
