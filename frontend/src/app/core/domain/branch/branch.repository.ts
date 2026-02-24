import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
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
  constructor(protected override apollo: Apollo) {
    super(apollo);
  }

  /**
   * Get branch by ID
   */
  override get(id: string): Observable<Branch> {
    return this.apollo
      .query<{ branches: { nodes: Branch[] } }>({
        query: GET_BRANCH,
        variables: { id: parseInt(id) },
      })
      .pipe(map((result) => result.data.branches.nodes[0]));
  }

  /**
   * Get all active branches
   */
  override getAll(): Observable<Branch[]> {
    return this.apollo
      .watchQuery<{ branches: { nodes: Branch[] } }>({
        query: GET_BRANCHES,
      })
      .valueChanges.pipe(map((result) => result.data.branches.nodes));
  }

  /**
   * Get all branches including inactive
   */
  getAllBranches(): Observable<Branch[]> {
    return this.apollo
      .watchQuery<{ branches: { nodes: Branch[] } }>({
        query: GET_ALL_BRANCHES,
      })
      .valueChanges.pipe(map((result) => result.data.branches.nodes));
  }

  /**
   * Create a new branch
   */
  override create(
    data: Partial<Branch>,
    logInfo: EntityLogInfo
  ): Observable<Partial<Branch>> {
    return this.apollo
      .mutate<{ addBranch: Branch }>({
        mutation: ADD_BRANCH,
        variables: { input: data },
        refetchQueries: [{ query: GET_BRANCHES }],
      })
      .pipe(
        map((result) => {
          if (result.data?.addBranch) {
            return result.data.addBranch;
          }
          throw new Error('Cannot create branch.');
        })
      );
  }

  /**
   * Update an existing branch
   */
  override update(
    branch: Partial<Branch>,
    logInfo: EntityLogInfo
  ): Observable<Partial<Branch>> {
    return this.apollo
      .mutate<{ updateBranch: Branch }>({
        mutation: UPDATE_BRANCH,
        variables: { input: branch },
      })
      .pipe(
        map((result) => {
          if (result.data?.updateBranch) {
            return result.data.updateBranch;
          }
          throw new Error('Cannot update branch.');
        })
      );
  }

  /**
   * Delete a branch
   */
  override delete(id: string, logInfo: EntityLogInfo): Observable<boolean> {
    return this.apollo
      .mutate<{ deleteBranch: boolean }>({
        mutation: DELETE_BRANCH,
        variables: { id: parseInt(id) },
        refetchQueries: [{ query: GET_BRANCHES }],
      })
      .pipe(
        map((result) => {
          if (result.data?.deleteBranch) {
            return result.data.deleteBranch;
          }
          throw new Error('Cannot delete branch.');
        })
      );
  }
}
