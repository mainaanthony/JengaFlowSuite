import { Injectable } from '@angular/core';
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
  constructor() {
    super();
  }

  /**
   * Get category by ID
   */
  override get(id: string): Observable<Category> {
    throw new Error('Not implemented - Apollo GraphQL required');
  }

  /**
   * Get all categories
   */
  override getAll(): Observable<Category[]> {
    throw new Error('Not implemented - Apollo GraphQL required');
  }

  /**
   * Create a new category
   */
  override create(
    data: Partial<Category>,
    logInfo: EntityLogInfo
  ): Observable<Partial<Category>> {
    throw new Error('Not implemented - Apollo GraphQL required');
  }

  /**
   * Update an existing category
   */
  override update(
    category: Partial<Category>,
    logInfo: EntityLogInfo
  ): Observable<Partial<Category>> {
    throw new Error('Not implemented - Apollo GraphQL required');
  }

  /**
   * Delete a category
   */
  override delete(id: string, logInfo: EntityLogInfo): Observable<boolean> {
    throw new Error('Not implemented - Apollo GraphQL required');
  }
}
