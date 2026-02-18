import { gql } from 'apollo-angular';

/**
 * Fragment for Product fields
 */
const FRAGMENT_PRODUCT = gql`
  fragment ProductFields on Product {
    id
    name
    sku
    brand
    categoryId
    price
    description
    isActive
    createdAt
    updatedAt
  }
`;

/**
 * Get all products query
 */
const GET_PRODUCTS = gql`
  query getProducts {
    products(where: { isActive: { eq: true } }, order: { name: ASC }) {
      nodes {
        ...ProductFields
        category {
          id
          name
        }
      }
    }
  }
  ${FRAGMENT_PRODUCT}
`;

/**
 * Get all products (including inactive)
 */
const GET_ALL_PRODUCTS = gql`
  query getAllProducts {
    products(order: { name: ASC }) {
      nodes {
        ...ProductFields
        category {
          id
          name
        }
      }
    }
  }
  ${FRAGMENT_PRODUCT}
`;

/**
 * Get product by ID query
 */
const GET_PRODUCT = gql`
  query getProduct($id: Int!) {
    products(where: { id: { eq: $id } }) {
      nodes {
        ...ProductFields
        category {
          id
          name
          description
        }
      }
    }
  }
  ${FRAGMENT_PRODUCT}
`;

/**
 * Get products by category query
 */
const GET_PRODUCTS_BY_CATEGORY = gql`
  query getProductsByCategory($categoryId: Int!) {
    products(
      where: { categoryId: { eq: $categoryId }, isActive: { eq: true } }
      order: { name: ASC }
    ) {
      nodes {
        ...ProductFields
      }
    }
  }
  ${FRAGMENT_PRODUCT}
`;

/**
 * Search products by name or SKU
 */
const SEARCH_PRODUCTS = gql`
  query searchProducts($search: String!) {
    products(
      where: {
        or: [
          { name: { contains: $search } }
          { sku: { contains: $search } }
          { brand: { contains: $search } }
        ]
        isActive: { eq: true }
      }
      order: { name: ASC }
    ) {
      nodes {
        ...ProductFields
        category {
          id
          name
        }
      }
    }
  }
  ${FRAGMENT_PRODUCT}
`;

/**
 * Add product mutation
 */
const ADD_PRODUCT = gql`
  mutation addProduct($input: ProductMutationInput!) {
    addProduct(input: $input) {
      ...ProductFields
    }
  }
  ${FRAGMENT_PRODUCT}
`;

/**
 * Update product mutation
 */
const UPDATE_PRODUCT = gql`
  mutation updateProduct($input: ProductMutationInput!) {
    updateProduct(input: $input) {
      ...ProductFields
    }
  }
  ${FRAGMENT_PRODUCT}
`;

/**
 * Delete product mutation
 */
const DELETE_PRODUCT = gql`
  mutation deleteProduct($id: Int!) {
    deleteProduct(id: $id)
  }
`;

export {
  FRAGMENT_PRODUCT,
  GET_PRODUCTS,
  GET_ALL_PRODUCTS,
  GET_PRODUCT,
  GET_PRODUCTS_BY_CATEGORY,
  SEARCH_PRODUCTS,
  ADD_PRODUCT,
  UPDATE_PRODUCT,
  DELETE_PRODUCT,
};
