import { gql } from 'apollo-angular';

/**
 * Fragment for Delivery Item fields
 */
const FRAGMENT_DELIVERY_ITEM = gql`
  fragment DeliveryItemFields on DeliveryItem {
    id
    deliveryId
    productId
    quantity
  }
`;

/**
 * Fragment for Delivery fields
 */
const FRAGMENT_DELIVERY = gql`
  fragment DeliveryFields on Delivery {
    id
    deliveryNumber
    saleId
    customerId
    driverId
    deliveryAddress
    contactPhone
    status
    priority
    scheduledDate
    deliveredDate
    notes
    createdAt
    updatedAt
  }
`;

/**
 * Get all deliveries query
 */
const GET_DELIVERIES = gql`
  query getDeliveries {
    deliveries(order: { scheduledDate: DESC }) {
      nodes {
        ...DeliveryFields
        customer {
          id
          name
          phone
        }
        driver {
          id
          name
          phone
        }
      }
    }
  }
  ${FRAGMENT_DELIVERY}
`;

/**
 * Get delivery by ID query
 */
const GET_DELIVERY = gql`
  query getDelivery($id: Int!) {
    deliveries(where: { id: { eq: $id } }) {
      ...DeliveryFields
      customer {
        id
        name
        phone
        address
      }
      driver {
        id
        name
        phone
        vehicle
      }
      items {
        ...DeliveryItemFields
        product {
          id
          name
          sku
        }
      }
    }
  }
  ${FRAGMENT_DELIVERY}
  ${FRAGMENT_DELIVERY_ITEM}
`;

/**
 * Get deliveries by driver query
 */
const GET_DELIVERIES_BY_DRIVER = gql`
  query getDeliveriesByDriver($driverId: Int!) {
    deliveries(where: { driverId: { eq: $driverId } }, order: { scheduledDate: DESC }) {
      nodes {
        ...DeliveryFields
        customer {
          id
          name
        }
      }
    }
  }
  ${FRAGMENT_DELIVERY}
`;

/**
 * Get deliveries by status query
 */
const GET_DELIVERIES_BY_STATUS = gql`
  query getDeliveriesByStatus($status: DeliveryStatus!) {
    deliveries(where: { status: { eq: $status } }, order: { scheduledDate: ASC }) {
      nodes {
        ...DeliveryFields
        customer {
          id
          name
        }
        driver {
          id
          name
        }
      }
    }
  }
  ${FRAGMENT_DELIVERY}
`;

/**
 * Add delivery mutation
 */
const ADD_DELIVERY = gql`
  mutation addDelivery($input: DeliveryMutationInput!) {
    addDelivery(input: $input) {
      ...DeliveryFields
    }
  }
  ${FRAGMENT_DELIVERY}
`;

/**
 * Update delivery mutation
 */
const UPDATE_DELIVERY = gql`
  mutation updateDelivery($input: DeliveryMutationInput!) {
    updateDelivery(input: $input) {
      ...DeliveryFields
    }
  }
  ${FRAGMENT_DELIVERY}
`;

/**
 * Delete delivery mutation
 */
const DELETE_DELIVERY = gql`
  mutation deleteDelivery($id: Int!) {
    deleteDelivery(id: $id)
  }
`;

export {
  FRAGMENT_DELIVERY,
  FRAGMENT_DELIVERY_ITEM,
  GET_DELIVERIES,
  GET_DELIVERY,
  GET_DELIVERIES_BY_DRIVER,
  GET_DELIVERIES_BY_STATUS,
  ADD_DELIVERY,
  UPDATE_DELIVERY,
  DELETE_DELIVERY,
};
