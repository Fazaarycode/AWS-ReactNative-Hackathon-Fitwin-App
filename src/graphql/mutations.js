/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createPreferences = /* GraphQL */ `
  mutation CreatePreferences(
    $input: CreatePreferencesInput!
    $condition: ModelPreferencesConditionInput
  ) {
    createPreferences(input: $input, condition: $condition) {
      id
      name
      preferences
      _version
      _deleted
      _lastChangedAt
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
      name
      preferences
      _version
      _deleted
      _lastChangedAt
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
      name
      preferences
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
      owner
    }
  }
`;
