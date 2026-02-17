import { gql } from 'apollo-angular';

/**
 * Fragment for Driver fields
 */
const FRAGMENT_DRIVER = gql`
  fragment DriverFields on Driver {
    id
    name
    phone
    licenseNumber
    vehicle
    vehicleRegistration
    status
    rating
    isActive
    createdAt
    updatedAt
  }
`;

/**
 * Get all drivers query
 */
const GET_DRIVERS = gql`
  query getDrivers {
    drivers(where: { isActive: { eq: true } }, order: { name: ASC }) {
      nodes {
        ...DriverFields
      }
    }
  }
  ${FRAGMENT_DRIVER}
`;

/**
 * Get available drivers query
 */
const GET_AVAILABLE_DRIVERS = gql`
  query getAvailableDrivers {
    drivers(
      where: { isActive: { eq: true }, status: { eq: "Available" } }
      order: { name: ASC }
    ) {
      nodes {
        ...DriverFields
      }
    }
  }
  ${FRAGMENT_DRIVER}
`;

/**
 * Get driver by ID query
 */
const GET_DRIVER = gql`
  query getDriver($id: Int!) {
    drivers(where: { id: { eq: $id } }) {
      ...DriverFields
    }
  }
  ${FRAGMENT_DRIVER}
`;

/**
 * Add driver mutation
 */
const ADD_DRIVER = gql`
  mutation addDriver($input: DriverMutationInput!) {
    addDriver(input: $input) {
      ...DriverFields
    }
  }
  ${FRAGMENT_DRIVER}
`;

/**
 * Update driver mutation
 */
const UPDATE_DRIVER = gql`
  mutation updateDriver($input: DriverMutationInput!) {
    updateDriver(input: $input) {
      ...DriverFields
    }
  }
  ${FRAGMENT_DRIVER}
`;

/**
 * Delete driver mutation
 */
const DELETE_DRIVER = gql`
  mutation deleteDriver($id: Int!) {
    deleteDriver(id: $id)
  }
`;

export {
  FRAGMENT_DRIVER,
  GET_DRIVERS,
  GET_AVAILABLE_DRIVERS,
  GET_DRIVER,
  ADD_DRIVER,
  UPDATE_DRIVER,
  DELETE_DRIVER,
};
