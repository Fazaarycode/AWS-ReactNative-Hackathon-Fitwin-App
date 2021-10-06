/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createPreferences = /* GraphQL */ `
  mutation CreatePreferences(
    $input: CreatePreferencesInput!
    $condition: ModelPreferencesConditionInput
  ) {
    createPreferences(input: $input, condition: $condition) {
      id
      email
      preferences
      createdAt
      updatedAt
      owner
    }
  }
`;
export const updatePreferences = /* GraphQL */ `
  mutation UpdatePreferences(
    $input: UpdatePreferencesInput!
    $condition: ModelPreferencesConditionInput
  ) {
    updatePreferences(input: $input, condition: $condition) {
      id
      email
      preferences
      createdAt
      updatedAt
      owner
    }
  }
`;
export const deletePreferences = /* GraphQL */ `
  mutation DeletePreferences(
    $input: DeletePreferencesInput!
    $condition: ModelPreferencesConditionInput
  ) {
    deletePreferences(input: $input, condition: $condition) {
      id
      email
      preferences
      createdAt
      updatedAt
      owner
    }
  }
`;
export const createMetrics = /* GraphQL */ `
  mutation CreateMetrics(
    $input: CreateMetricsInput!
    $condition: ModelMetricsConditionInput
  ) {
    createMetrics(input: $input, condition: $condition) {
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
export const updateMetrics = /* GraphQL */ `
  mutation UpdateMetrics(
    $input: UpdateMetricsInput!
    $condition: ModelMetricsConditionInput
  ) {
    updateMetrics(input: $input, condition: $condition) {
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
export const deleteMetrics = /* GraphQL */ `
  mutation DeleteMetrics(
    $input: DeleteMetricsInput!
    $condition: ModelMetricsConditionInput
  ) {
    deleteMetrics(input: $input, condition: $condition) {
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
export const createCoupons = /* GraphQL */ `
  mutation CreateCoupons(
    $input: CreateCouponsInput!
    $condition: ModelCouponsConditionInput
  ) {
    createCoupons(input: $input, condition: $condition) {
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
export const updateCoupons = /* GraphQL */ `
  mutation UpdateCoupons(
    $input: UpdateCouponsInput!
    $condition: ModelCouponsConditionInput
  ) {
    updateCoupons(input: $input, condition: $condition) {
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
export const deleteCoupons = /* GraphQL */ `
  mutation DeleteCoupons(
    $input: DeleteCouponsInput!
    $condition: ModelCouponsConditionInput
  ) {
    deleteCoupons(input: $input, condition: $condition) {
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
export const createAllCoupons = /* GraphQL */ `
  mutation CreateAllCoupons(
    $input: CreateAllCouponsInput!
    $condition: ModelallCouponsConditionInput
  ) {
    createAllCoupons(input: $input, condition: $condition) {
      id
      couponId
      couponName
      couponGroup
      couponCategory
      imgData
      createdAt
      updatedAt
      owner
    }
  }
`;
export const updateAllCoupons = /* GraphQL */ `
  mutation UpdateAllCoupons(
    $input: UpdateAllCouponsInput!
    $condition: ModelallCouponsConditionInput
  ) {
    updateAllCoupons(input: $input, condition: $condition) {
      id
      couponId
      couponName
      couponGroup
      couponCategory
      imgData
      createdAt
      updatedAt
      owner
    }
  }
`;
export const deleteAllCoupons = /* GraphQL */ `
  mutation DeleteAllCoupons(
    $input: DeleteAllCouponsInput!
    $condition: ModelallCouponsConditionInput
  ) {
    deleteAllCoupons(input: $input, condition: $condition) {
      id
      couponId
      couponName
      couponGroup
      couponCategory
      imgData
      createdAt
      updatedAt
      owner
    }
  }
`;
