import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
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

console.log('[ProductRepository] Module loading...');
console.log('[ProductRepository] GET_PRODUCTS query:', GET_PRODUCTS?.loc?.source?.body?.substring(0, 100));

/**
 * Product Repository
 * Handles all product-related data operations
 */
@Injectable({
  providedIn: 'root',
})
export class ProductRepository extends BaseRepository<Product> {
  constructor(protected override apollo: Apollo) {
    super(apollo);
  }

  /**
   * Get product by ID
   */
  override get(id: string): Observable<Product> {
    return this.apollo
      .query<{ products: { nodes: Product[] } }>({
        query: GET_PRODUCT,
        variables: { id: parseInt(id) },
      })
      .pipe(map((result) => result.data.products.nodes[0]));
  }

  /**
   * Get all active products
   */
  override getAll(): Observable<Product[]> {
    return this.apollo
      .watchQuery<{ products: { nodes: Product[] } }>({
        query: GET_PRODUCTS,
      })
      .valueChanges.pipe(map((result) => result.data.products.nodes));
  }

  /**
   * Get all products including inactive
   */
  getAllProducts(): Observable<Product[]> {
    return this.apollo
      .watchQuery<{ products: { nodes: Product[] } }>({
        query: GET_ALL_PRODUCTS,
      })
      .valueChanges.pipe(map((result) => result.data.products.nodes));
  }

  /**
   * Get products by category
   */
  getProductsByCategory(categoryId: number): Observable<Product[]> {
    return this.apollo
      .query<{ products: { nodes: Product[] } }>({
        query: GET_PRODUCTS_BY_CATEGORY,
        variables: { categoryId },
      })
      .pipe(map((result) => result.data.products.nodes));
  }

  /**
   * Search products by name, SKU, or brand
   */
  searchProducts(search: string): Observable<Product[]> {
    return this.apollo
      .query<{ products: { nodes: Product[] } }>({
        query: SEARCH_PRODUCTS,
        variables: { search },
      })
      .pipe(map((result) => result.data.products.nodes));
  }

  /**
   * Create a new product
   */
  override create(
    data: Partial<Product>,
    logInfo: EntityLogInfo
  ): Observable<Partial<Product>> {
    return this.apollo
      .mutate<{ addProduct: Product }>({
        mutation: ADD_PRODUCT,
        variables: { input: data },
        refetchQueries: [{ query: GET_PRODUCTS }],
      })
      .pipe(
        map((result) => {
          if (result.data?.addProduct) {
            return result.data.addProduct;
          }
          throw new Error('Cannot create product.');
        })
      );
  }

  /**
   * Update an existing product
   */
  override update(
    product: Partial<Product>,
    logInfo: EntityLogInfo
  ): Observable<Partial<Product>> {
    return this.apollo
      .mutate<{ updateProduct: Product }>({
        mutation: UPDATE_PRODUCT,
        variables: { input: product },
      })
      .pipe(
        map((result) => {
          if (result.data?.updateProduct) {
            return result.data.updateProduct;
          }
          throw new Error('Cannot update product.');
        })
      );
  }

  /**
   * Delete a product
   */
  override delete(id: string, logInfo: EntityLogInfo): Observable<boolean> {
    return this.apollo
      .mutate<{ deleteProduct: boolean }>({
        mutation: DELETE_PRODUCT,
        variables: { id: parseInt(id) },
        refetchQueries: [{ query: GET_PRODUCTS }],
      })
      .pipe(
        map((result) => {
          if (result.data?.deleteProduct) {
            return result.data.deleteProduct;
          }
          throw new Error('Cannot delete product.');
        })
      );
  }
}
