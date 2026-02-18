import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from './user';
import { BaseRepository, EntityLogInfo } from '../../repository/base-repository';
import {
  FRAGMENT_USER,
  GET_USER,
  GET_USERS,
  GET_USER_BY_KEYCLOAK_ID,
  GET_USERS_BY_BRANCH,
  GET_USERS_BY_ROLE,
  ADD_USER,
  UPDATE_USER,
  DELETE_USER,
  DEACTIVATE_USER,
  ACTIVATE_USER,
} from './user.queries';
import { SessionStorageService } from '../../service/session-storage/session-storage.service';

/**
 * User Repository
 * Handles all user-related data operations
 */
@Injectable({
  providedIn: 'root',
})
export class UserRepository extends BaseRepository<User> {
  private currentUser: User | null;

  constructor(
    protected override apollo: Apollo,
    private sessionStorageService: SessionStorageService
  ) {
    super(apollo);
    this.currentUser = sessionStorageService.getItem<User>('userProfile');
  }

  /**
   * Get user by ID
   */
  override get(id: string): Observable<User> {
    return this.apollo
      .query<{ users: { nodes: User[] } }>({
        query: GET_USER,
        variables: { id: parseInt(id) },
      })
      .pipe(map((result) => result.data.users.nodes[0]));
  }

  /**
   * Get all users
   */
  override getAll(): Observable<User[]> {
    return this.apollo
      .watchQuery<{ users: { nodes: User[] } }>({
        query: GET_USERS,
      })
      .valueChanges.pipe(map((result) => result.data.users.nodes));
  }

  /**
   * Get user by Keycloak ID
   */
  getUserByKeycloakId(keycloakId: string): Observable<User> {
    return this.apollo
      .query<{ users: { nodes: User[] } }>({
        query: GET_USER_BY_KEYCLOAK_ID,
        variables: { keycloakId },
      })
      .pipe(map((result) => result.data.users.nodes[0]));
  }

  /**
   * Get users by branch ID
   */
  getUsersByBranch(branchId: number): Observable<User[]> {
    return this.apollo
      .query<{ users: { nodes: User[] } }>({
        query: GET_USERS_BY_BRANCH,
        variables: { branchId },
      })
      .pipe(map((result) => result.data.users.nodes));
  }

  /**
   * Get users by role ID
   */
  getUsersByRole(roleId: number): Observable<User[]> {
    return this.apollo
      .query<{ users: { nodes: User[] } }>({
        query: GET_USERS_BY_ROLE,
        variables: { roleId },
      })
      .pipe(map((result) => result.data.users.nodes));
  }

  /**
   * Create a new user
   */
  override create(
    data: Partial<User>,
    logInfo: EntityLogInfo
  ): Observable<Partial<User>> {
    return this.apollo
      .mutate<{ addUser: User }>({
        mutation: ADD_USER,
        variables: { input: { ...data, createdBy: logInfo.userId } },
        refetchQueries: [{ query: GET_USERS }],
      })
      .pipe(
        map((result) => {
          if (result.data?.addUser) {
            return result.data.addUser;
          }
          throw new Error('Cannot create user.');
        })
      );
  }

  /**
   * Update an existing user
   */
  override update(
    user: Partial<User>,
    logInfo: EntityLogInfo
  ): Observable<Partial<User>> {
    return this.apollo
      .mutate<{ updateUser: User }>({
        mutation: UPDATE_USER,
        variables: { input: { ...user, updatedBy: logInfo.userId } },
      })
      .pipe(
        map((result) => {
          if (result.data?.updateUser) {
            return result.data.updateUser;
          }
          throw new Error('Cannot update user.');
        })
      );
  }

  /**
   * Delete a user (soft delete)
   */
  override delete(id: string, logInfo: EntityLogInfo): Observable<boolean> {
    return this.apollo
      .mutate<{ deleteUser: boolean }>({
        mutation: DELETE_USER,
        variables: { id: parseInt(id) },
        refetchQueries: [{ query: GET_USERS }],
      })
      .pipe(
        map((result) => {
          if (result.data?.deleteUser) {
            return result.data.deleteUser;
          }
          throw new Error('Cannot delete user.');
        })
      );
  }

  /**
   * Deactivate a user
   */
  deactivateUser(id: number): Observable<User> {
    return this.apollo
      .mutate<{ deactivateUser: User }>({
        mutation: DEACTIVATE_USER,
        variables: { id },
      })
      .pipe(
        map((result) => {
          if (result.data?.deactivateUser) {
            return result.data.deactivateUser;
          }
          throw new Error('Cannot deactivate user.');
        })
      );
  }

  /**
   * Activate a user
   */
  activateUser(id: number): Observable<User> {
    return this.apollo
      .mutate<{ activateUser: User }>({
        mutation: ACTIVATE_USER,
        variables: { id },
      })
      .pipe(
        map((result) => {
          if (result.data?.activateUser) {
            return result.data.activateUser;
          }
          throw new Error('Cannot activate user.');
        })
      );
  }

  /**
   * Get current user from session
   */
  getCurrentUser(): User | null {
    return this.currentUser;
  }

  /**
   * Set current user in session
   */
  setCurrentUser(user: User): void {
    this.currentUser = user;
    this.sessionStorageService.setItem('userProfile', user);
  }

  /**
   * Clear current user from session
   */
  clearCurrentUser(): void {
    this.currentUser = null;
    this.sessionStorageService.removeItem('userProfile');
  }
}
