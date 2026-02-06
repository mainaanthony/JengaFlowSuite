import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Branch } from './branch';
import { BaseRepository, EntityLogInfo } from '../../repository/base-repository';
import {
  FRAGMENT_BRANCH,
  GET_BRANCH,
  GET_BRANCHES,
  GET_ALL_BRANCHES,
  ADD_BRANCH,
  UPDATE_BRANCH,
  DELETE_BRANCH,
} from './branch.queries';

/**
 * Branch Repository
 * Handles all branch-related data operations
 */
@Injectable({
  providedIn: 'root',
})
export class BranchRepository extends BaseRepository<Branch> {
  constructor() {
    super();
  }

  /**
   * Get branch by ID
   */
  override get(id: string): Observable<Branch> {
    throw new Error('Not implemented - Apollo GraphQL required');
  }

  /**
   * Get all active branches
   */
  override getAll(): Observable<Branch[]> {
    throw new Error('Not implemented - Apollo GraphQL required');
  }

  /**
   * Get all branches including inactive
   */
  getAllBranches(): Observable<Branch[]> {
    throw new Error('Not implemented - Apollo GraphQL required');
  }

  /**
   * Create a new branch
   */
  override create(
    data: Partial<Branch>,
    logInfo: EntityLogInfo
  ): Observable<Partial<Branch>> {
    throw new Error('Not implemented - Apollo GraphQL required');
  }

  /**
   * Update an existing branch
   */
  override update(
    branch: Partial<Branch>,
    logInfo: EntityLogInfo
  ): Observable<Partial<Branch>> {
    throw new Error('Not implemented - Apollo GraphQL required');
  }

  /**
   * Delete a branch
   */
  override delete(id: string, logInfo: EntityLogInfo): Observable<boolean> {
    throw new Error('Not implemented - Apollo GraphQL required');
  }
}
