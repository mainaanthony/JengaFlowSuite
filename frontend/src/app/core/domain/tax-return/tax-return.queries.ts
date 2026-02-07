import { gql } from 'apollo-angular';

/**
 * GraphQL fragment for TaxReturn
 */
export const FRAGMENT_TAX_RETURN = gql`
  fragment TaxReturnFields on TaxReturn {
    taxReturnId
    taxType
    returnPeriodStart
    returnPeriodEnd
    filingDate
    dueDate
    totalTaxableAmount
    totalTaxAmount
    status
    submittedBy
    approvedBy
    approvedDate
    referenceNumber
    remarks
    branchId
    createdBy
    createdAt
    modifiedBy
    modifiedAt
  }
`;

/**
 * Query to get a single tax return by ID
 */
export const GET_TAX_RETURN = gql`
  query GetTaxReturn($id: String!) {
    taxReturn(taxReturnId: $id) {
      ...TaxReturnFields
    }
  }
  ${FRAGMENT_TAX_RETURN}
`;

/**
 * Query to get all tax returns
 */
export const GET_TAX_RETURNS = gql`
  query GetTaxReturns {
    taxReturns {
      ...TaxReturnFields
    }
  }
  ${FRAGMENT_TAX_RETURN}
`;

/**
 * Mutation to add a new tax return
 */
export const ADD_TAX_RETURN = gql`
  mutation AddTaxReturn($input: TaxReturnInput!) {
    addTaxReturn(taxReturn: $input) {
      ...TaxReturnFields
    }
  }
  ${FRAGMENT_TAX_RETURN}
`;

/**
 * Mutation to update an existing tax return
 */
export const UPDATE_TAX_RETURN = gql`
  mutation UpdateTaxReturn($input: TaxReturnInput!) {
    updateTaxReturn(taxReturn: $input) {
      ...TaxReturnFields
    }
  }
  ${FRAGMENT_TAX_RETURN}
`;

/**
 * Mutation to delete a tax return
 */
export const DELETE_TAX_RETURN = gql`
  mutation DeleteTaxReturn($id: String!) {
    deleteTaxReturn(taxReturnId: $id)
  }
`;
