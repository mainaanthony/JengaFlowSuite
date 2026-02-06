import { Injectable } from '@angular/core';
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
    private sessionStorageService: SessionStorageService
  ) {
    super();
    this.currentUser = sessionStorageService.getItem<User>('userProfile');
  }

  /**
   * Get user by ID
   */
  override get(id: string): Observable<User> {
    // TODO: Implement Apollo GraphQL query
    throw new Error('Not implemented - Apollo GraphQL required');
  }

  /**
   * Get all users
   */
  override getAll(): Observable<User[]> {
    // TODO: Implement Apollo GraphQL query
    throw new Error('Not implemented - Apollo GraphQL required');
  }

  /**
   * Get user by Keycloak ID
   */
  getUserByKeycloakId(keycloakId: string): Observable<User> {
    // TODO: Implement Apollo GraphQL query
    throw new Error('Not implemented - Apollo GraphQL required');
  }

  /**
   * Get users by branch ID
   */
  getUsersByBranch(branchId: number): Observable<User[]> {
    // TODO: Implement Apollo GraphQL query
    throw new Error('Not implemented - Apollo GraphQL required');
  }

  /**
   * Get users by role ID
   */
  getUsersByRole(roleId: number): Observable<User[]> {
    // TODO: Implement Apollo GraphQL query
    throw new Error('Not implemented - Apollo GraphQL required');
  }

  /**
   * Create a new user
   */
  override create(
    data: Partial<User>,
    logInfo: EntityLogInfo
  ): Observable<Partial<User>> {
    // TODO: Implement Apollo GraphQL mutation
    throw new Error('Not implemented - Apollo GraphQL required');
  }

  /**
   * Update an existing user
   */
  override update(
    user: Partial<User>,
    logInfo: EntityLogInfo
  ): Observable<Partial<User>> {
    // TODO: Implement Apollo GraphQL mutation
    throw new Error('Not implemented - Apollo GraphQL required');
  }

  /**
   * Delete a user (soft delete)
   */
  override delete(id: string, logInfo: EntityLogInfo): Observable<boolean> {
    // TODO: Implement Apollo GraphQL mutation
    throw new Error('Not implemented - Apollo GraphQL required');
  }

  /**
   * Deactivate a user
   */
  deactivateUser(id: number): Observable<User> {
    // TODO: Implement Apollo GraphQL mutation
    throw new Error('Not implemented - Apollo GraphQL required');
  }

  /**
   * Activate a user
   */
  activateUser(id: number): Observable<User> {
    // TODO: Implement Apollo GraphQL mutation
    throw new Error('Not implemented - Apollo GraphQL required');
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
