import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Category } from './category';
import { BaseRepository, EntityLogInfo } from '../../repository/base-repository';
import {
  FRAGMENT_CATEGORY,
  GET_CATEGORY,
  GET_CATEGORIES,
  ADD_CATEGORY,
  UPDATE_CATEGORY,
  DELETE_CATEGORY,
} from './category.queries';

/**
 * Category Repository
 * Handles all category-related data operations
 */
@Injectable({
  providedIn: 'root',
})
export class CategoryRepository extends BaseRepository<Category> {
  constructor(protected override apollo: Apollo) {
    super(apollo);
  }

  /**
   * Get category by ID
   */
  override get(id: string): Observable<Category> {
    return this.apollo
      .query<{ categories: Category[] }>({
        query: GET_CATEGORY,
        variables: { id: parseInt(id) },
      })
      .pipe(map((result) => result.data.categories[0]));
  }

  /**
   * Get all categories
   */
  override getAll(): Observable<Category[]> {
    return this.apollo
      .watchQuery<{ categories: { nodes: Category[] } }>({
        query: GET_CATEGORIES,
      })
      .valueChanges.pipe(map((result) => result.data.categories.nodes));
  }

  /**
   * Create a new category
   */
  override create(
    data: Partial<Category>,
    logInfo: EntityLogInfo
  ): Observable<Partial<Category>> {
    return this.apollo
      .mutate<{ addCategory: Category }>({
        mutation: ADD_CATEGORY,
        variables: { input: { ...data, createdBy: logInfo.userId } },
        refetchQueries: [{ query: GET_CATEGORIES }],
      })
      .pipe(
        map((result) => {
          if (result.data?.addCategory) {
            return result.data.addCategory;
          }
          throw new Error('Cannot create category.');
        })
      );
  }

  /**
   * Update an existing category
   */
  override update(
    category: Partial<Category>,
    logInfo: EntityLogInfo
  ): Observable<Partial<Category>> {
    return this.apollo
      .mutate<{ updateCategory: Category }>({
        mutation: UPDATE_CATEGORY,
        variables: { input: { ...category, updatedBy: logInfo.userId } },
      })
      .pipe(
        map((result) => {
          if (result.data?.updateCategory) {
            return result.data.updateCategory;
          }
          throw new Error('Cannot update category.');
        })
      );
  }

  /**
   * Delete a category
   */
  override delete(id: string, logInfo: EntityLogInfo): Observable<boolean> {
    return this.apollo
      .mutate<{ deleteCategory: boolean }>({
        mutation: DELETE_CATEGORY,
        variables: { id: parseInt(id) },
        refetchQueries: [{ query: GET_CATEGORIES }],
      })
      .pipe(
        map((result) => {
          if (result.data?.deleteCategory) {
            return result.data.deleteCategory;
          }
          throw new Error('Cannot delete category.');
        })
      );
  }
}
