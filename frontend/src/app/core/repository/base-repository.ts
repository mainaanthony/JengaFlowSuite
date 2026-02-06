import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs';
import { DocumentNode } from 'graphql';

export interface EntityLogInfo {
  userId?: string;
  description?: string;
  category?: string;
}

/**
 * Base repository class for all domain entities
 * Provides common CRUD operations
 */
export abstract class BaseRepository<T> {
  constructor(
    protected apollo?: Apollo,
    protected fragment?: DocumentNode
  ) {}

  /**
   * Get a single entity by ID
   */
  abstract get(id: string): Observable<T>;

  /**
   * Get all entities
   */
  abstract getAll(): Observable<T[]>;

  /**
   * Create a new entity
   */
  abstract create(data: Partial<T>, logInfo: EntityLogInfo): Observable<Partial<T>>;

  /**
   * Update an existing entity
   */
  abstract update(data: Partial<T>, logInfo: EntityLogInfo): Observable<Partial<T>>;

  /**
   * Delete an entity by ID
   */
  abstract delete(id: string, logInfo: EntityLogInfo): Observable<boolean>;
}
