/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getPreferences = /* GraphQL */ `
  query GetPreferences($id: ID!) {
    getPreferences(id: $id) {
      id
      email
      preferences
      createdAt
      updatedAt
      owner
    }
  }
`;
export const listPreferences = /* GraphQL */ `
  query ListPreferences(
    $filter: ModelPreferencesFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listPreferences(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        email
        preferences
        createdAt
        updatedAt
        owner
      }
      nextToken
    }
  }
`;
export const getMetrics = /* GraphQL */ `
  query GetMetrics($id: ID!) {
    getMetrics(id: $id) {
      id
      email
      date
      startTime
      endTime
      description
      dailySteps
      deltaSteps
      dailyDist
      deltaDist
      latitude
      longitude
      deltaLocDist
      createdAt
      updatedAt
      owner
    }
  }
`;
export const listMetrics = /* GraphQL */ `
  query ListMetrics(
    $filter: ModelMetricsFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listMetrics(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        email
        date
        startTime
        endTime
        description
        dailySteps
        deltaSteps
        dailyDist
        deltaDist
        latitude
        longitude
        deltaLocDist
        createdAt
        updatedAt
        owner
      }
      nextToken
    }
  }
`;
export const getCoupons = /* GraphQL */ `
  query GetCoupons($id: ID!) {
    getCoupons(id: $id) {
      id
      email
      date
      couponId
      contentType
      width
      height
      imgData
      type
      name
      state
      validDate
      createdAt
      updatedAt
      owner
    }
  }
`;
export const listCoupons = /* GraphQL */ `
  query ListCoupons(
    $filter: ModelCouponsFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listCoupons(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        email
        date
        couponId
        contentType
        width
        height
        imgData
        type
        name
        state
        validDate
        createdAt
        updatedAt
        owner
      }
      nextToken
    }
  }
`;
