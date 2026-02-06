import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Product } from './product';
import { BaseRepository, EntityLogInfo } from '../../repository/base-repository';
import {
  FRAGMENT_PRODUCT,
  GET_PRODUCT,
  GET_PRODUCTS,
  GET_ALL_PRODUCTS,
  GET_PRODUCTS_BY_CATEGORY,
  SEARCH_PRODUCTS,
  ADD_PRODUCT,
  UPDATE_PRODUCT,
  DELETE_PRODUCT,
} from './product.queries';

/**
 * Product Repository
 * Handles all product-related data operations
 */
@Injectable({
  providedIn: 'root',
})
export class ProductRepository extends BaseRepository<Product> {
  constructor() {
    super();
  }

  /**
   * Get product by ID
   */
  override get(id: string): Observable<Product> {
    throw new Error('Not implemented - Apollo GraphQL required');
  }

  /**
   * Get all active products
   */
  override getAll(): Observable<Product[]> {
    throw new Error('Not implemented - Apollo GraphQL required');
  }

  /**
   * Get all products including inactive
   */
  getAllProducts(): Observable<Product[]> {
    throw new Error('Not implemented - Apollo GraphQL required');
  }

  /**
   * Get products by category
   */
  getProductsByCategory(categoryId: number): Observable<Product[]> {
    throw new Error('Not implemented - Apollo GraphQL required');
  }

  /**
   * Search products by name, SKU, or brand
   */
  searchProducts(search: string): Observable<Product[]> {
    throw new Error('Not implemented - Apollo GraphQL required');
  }

  /**
   * Create a new product
   */
  override create(
    data: Partial<Product>,
    logInfo: EntityLogInfo
  ): Observable<Partial<Product>> {
    throw new Error('Not implemented - Apollo GraphQL required');
  }

  /**
   * Update an existing product
   */
  override update(
    product: Partial<Product>,
    logInfo: EntityLogInfo
  ): Observable<Partial<Product>> {
    throw new Error('Not implemented - Apollo GraphQL required');
  }

  /**
   * Delete a product
   */
  override delete(id: string, logInfo: EntityLogInfo): Observable<boolean> {
    throw new Error('Not implemented - Apollo GraphQL required');
  }
}
